import { createHash, randomUUID } from "crypto";
import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const UPLOAD_ROOT = path.join(process.cwd(), "uploads");

function s3Enabled() {
  return Boolean(process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY);
}

function s3Client() {
  return new S3Client({
    region: process.env.S3_REGION || "auto",
    endpoint: process.env.S3_ENDPOINT || undefined,
    forcePathStyle: Boolean(process.env.S3_ENDPOINT),
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
  });
}

export function makeStorageKey(fileName: string, prefix = "resumes") {
  const safe = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const hash = createHash("sha1").update(`${randomUUID()}-${safe}`).digest("hex").slice(0, 10);
  return `${prefix}/${hash}-${safe}`;
}

export async function putObject(storageKey: string, bytes: Buffer, contentType?: string) {
  if (s3Enabled()) {
    await s3Client().send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: storageKey,
        Body: bytes,
        ContentType: contentType,
      }),
    );
    return { storageKey, provider: "s3" as const };
  }
  const full = path.join(UPLOAD_ROOT, storageKey);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, bytes);
  return { storageKey, provider: "local" as const };
}

export async function getObject(storageKey: string) {
  if (s3Enabled()) {
    const res = await s3Client().send(
      new GetObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: storageKey,
      }),
    );
    const bytes = Buffer.from(await res.Body!.transformToByteArray());
    return { bytes, contentType: res.ContentType ?? "application/octet-stream" };
  }
  const full = path.join(UPLOAD_ROOT, storageKey);
  const bytes = await readFile(full);
  return { bytes, contentType: "application/octet-stream" };
}

export async function deleteObject(storageKey: string) {
  if (s3Enabled()) {
    await s3Client().send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: storageKey,
      }),
    );
    return;
  }
  const full = path.join(UPLOAD_ROOT, storageKey);
  await unlink(full).catch(() => undefined);
}

export function publicOrProxyUrl(storageKey: string) {
  if (process.env.S3_PUBLIC_BASE_URL) {
    return `${process.env.S3_PUBLIC_BASE_URL.replace(/\/$/, "")}/${storageKey}`;
  }
  return `/api/files/${encodeURIComponent(storageKey)}`;
}
