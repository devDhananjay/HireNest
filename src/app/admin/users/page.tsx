"use client";

import { Users } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { useDemo } from "@/lib/store";

export default function AdminUsersPage() {
  const { users } = useDemo();
  return (
    <div>
      <PageHeader title="Users" description="Role and permission management is scaffolded for a later auth provider." />
      <div className="overflow-hidden rounded-[1.85rem] bg-white shadow-soft">
        <div className="flex items-center gap-3 border-b border-[#eef0f5] px-6 py-5">
          <IconOrb icon={Users} />
          <p className="text-sm text-muted-foreground">{users.length} accounts in this demo workspace</p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-[#f7f8fb] text-left">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-[#eef0f5]">
                <td className="px-6 py-4 font-medium">{user.name}</td>
                <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                <td className="px-6 py-4">
                  <Badge variant="outline">{user.role}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
