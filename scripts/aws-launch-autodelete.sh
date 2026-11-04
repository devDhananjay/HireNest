#!/bin/bash
set -euo pipefail
REGION=ap-south-1
KEY_NAME=hireora-temp-20261104
SG_NAME=hireora-temp-sg
ROLE_NAME=hireora-auto-terminate-role
SCHED_NAME=hireora-auto-terminate-20261109
TERM_AT="2026-11-09T11:30:00"
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
echo "Account=$ACCOUNT Region=$REGION"

aws ec2 delete-key-pair --region $REGION --key-name "$KEY_NAME" 2>/dev/null || true
aws ec2 create-key-pair --region $REGION --key-name "$KEY_NAME" --query KeyMaterial --output text > ~/hireora-temp.pem
chmod 400 ~/hireora-temp.pem
echo "PEM saved ~/hireora-temp.pem"

CONTENT_ID=$(aws ec2 describe-instances --region $REGION --filters "Name=tag:Name,Values=Content" "Name=instance-state-name,Values=running" --query 'Reservations[0].Instances[0].InstanceId' --output text)
VPC=$(aws ec2 describe-instances --region $REGION --instance-ids "$CONTENT_ID" --query 'Reservations[0].Instances[0].VpcId' --output text)
SUBNET=$(aws ec2 describe-instances --region $REGION --instance-ids "$CONTENT_ID" --query 'Reservations[0].Instances[0].SubnetId' --output text)
echo "VPC=$VPC SUBNET=$SUBNET from $CONTENT_ID"

SG=$(aws ec2 describe-security-groups --region $REGION --filters "Name=group-name,Values=$SG_NAME" "Name=vpc-id,Values=$VPC" --query 'SecurityGroups[0].GroupId' --output text 2>/dev/null || true)
if [ -z "$SG" ] || [ "$SG" = "None" ]; then
  SG=$(aws ec2 create-security-group --region $REGION --group-name "$SG_NAME" --description "Hireora temp auto-delete" --vpc-id "$VPC" --query GroupId --output text)
  aws ec2 authorize-security-group-ingress --region $REGION --group-id "$SG" --ip-permissions \
    'IpProtocol=tcp,FromPort=22,ToPort=22,IpRanges=[{CidrIp=0.0.0.0/0,Description=ssh}]' \
    'IpProtocol=tcp,FromPort=3000,ToPort=3000,IpRanges=[{CidrIp=0.0.0.0/0,Description=hireora}]'
fi
echo "SG=$SG"

AMI=$(aws ec2 describe-images --region $REGION --owners amazon \
  --filters "Name=name,Values=al2023-ami-2023*-x86_64" "Name=state,Values=available" \
  --query 'sort_by(Images,&CreationDate)[-1].ImageId' --output text)
echo "AMI=$AMI"

cat > /tmp/trust.json <<'JSON'
{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"scheduler.amazonaws.com"},"Action":"sts:AssumeRole"}]}
JSON
if ! aws iam get-role --role-name "$ROLE_NAME" >/dev/null 2>&1; then
  aws iam create-role --role-name "$ROLE_NAME" --assume-role-policy-document file:///tmp/trust.json >/dev/null
fi
cat > /tmp/term-pol.json <<'JSON'
{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["ec2:TerminateInstances","ec2:DescribeInstances"],"Resource":"*"}]}
JSON
aws iam put-role-policy --role-name "$ROLE_NAME" --policy-name terminate --policy-document file:///tmp/term-pol.json
ROLE_ARN="arn:aws:iam::${ACCOUNT}:role/${ROLE_NAME}"
echo "Waiting IAM propagation..."; sleep 15

# Skip userdata complexity; install later via SSH
IID=$(aws ec2 run-instances --region $REGION \
  --image-id "$AMI" \
  --instance-type t3.nano \
  --key-name "$KEY_NAME" \
  --security-group-ids "$SG" \
  --subnet-id "$SUBNET" \
  --associate-public-ip-address \
  --block-device-mappings '[{"DeviceName":"/dev/xvda","Ebs":{"VolumeSize":8,"VolumeType":"gp3","DeleteOnTermination":true}}]' \
  --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=hireora-temp},{Key=AutoDelete,Value=2026-11-09},{Key=Project,Value=Hireora}]" \
  --query 'Instances[0].InstanceId' --output text)
echo "INSTANCE=$IID"

aws ec2 wait instance-running --region $REGION --instance-ids "$IID"
IP=$(aws ec2 describe-instances --region $REGION --instance-ids "$IID" --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)
echo "PUBLIC_IP=$IP"

aws scheduler delete-schedule --region $REGION --name "$SCHED_NAME" 2>/dev/null || true
aws scheduler create-schedule --region $REGION \
  --name "$SCHED_NAME" \
  --schedule-expression "at(${TERM_AT})" \
  --flexible-time-window '{"Mode":"OFF"}' \
  --target "{\"Arn\":\"arn:aws:scheduler:::aws-sdk:ec2:terminateInstances\",\"RoleArn\":\"${ROLE_ARN}\",\"Input\":\"{\\\"InstanceIds\\\":[\\\"${IID}\\\"]}\"}" \
  --action-after-completion DELETE

echo "==== DONE ===="
echo "INSTANCE_ID=$IID"
echo "PUBLIC_IP=$IP"
echo "AUTO_TERMINATE_UTC=$TERM_AT (~Nov 9 5:00 PM IST)"
echo "PEM=~/hireora-temp.pem  (Actions > Download file)"
echo "KEY_NAME=$KEY_NAME SG=$SG"
