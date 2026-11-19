"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { toast } from "sonner";
import { IconOrb } from "@/components/brand/icon-orb";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/lib/store";

type DeletionItem = {
  id: string;
  email: string;
  status: string;
  reason: string | null;
  createdAt: string;
};

export default function AdminUsersPage() {
  const { users, refresh } = useDemo();
  const [deletions, setDeletions] = useState<DeletionItem[]>([]);

  async function loadDeletions() {
    const res = await fetch("/api/privacy/deletion-request");
    if (!res.ok) return;
    const data = await res.json();
    setDeletions(data.items ?? []);
  }

  useEffect(() => {
    void loadDeletions();
  }, []);

  async function toggleDisabled(id: string, disabled: boolean) {
    const res = await fetch("/api/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "setUserDisabled", payload: { id, disabled } }),
    });
    if (!res.ok) {
      toast.error("Could not update user");
      return;
    }
    toast.success(disabled ? "User disabled" : "User enabled");
    await refresh();
  }

  async function fulfil(id: string) {
    const res = await fetch("/api/privacy/deletion-request", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, fulfil: true }),
    });
    if (!res.ok) {
      toast.error("Could not fulfil deletion");
      return;
    }
    toast.success("Deletion fulfilled");
    await loadDeletions();
    await refresh();
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Users" description="Disable accounts and fulfil DPDP deletion requests." />
      <div className="overflow-hidden rounded-[1.85rem] bg-white shadow-soft">
        <div className="flex items-center gap-3 border-b border-[#eef0f5] px-6 py-5">
          <IconOrb icon={Users} />
          <p className="text-sm text-muted-foreground">{users.length} accounts</p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-[#f7f8fb] text-left">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Role</th>
              <th className="px-6 py-3 font-medium">Actions</th>
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
                <td className="px-6 py-4">
                  <Button
                    variant="outline"
                    className="h-9 rounded-full"
                    onClick={() => void toggleDisabled(user.id, true)}
                  >
                    Disable
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-[1.85rem] bg-white p-6 shadow-soft">
        <h2 className="font-heading text-lg font-semibold">DPDP deletion queue</h2>
        <div className="mt-4 space-y-3">
          {deletions.length ? (
            deletions.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#f7f8fb] px-4 py-3 text-sm">
                <div>
                  <p className="font-medium">{item.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.status} · {new Date(item.createdAt).toLocaleString()}
                    {item.reason ? ` · ${item.reason}` : ""}
                  </p>
                </div>
                {item.status === "pending" ? (
                  <Button className="h-9 rounded-full" onClick={() => void fulfil(item.id)}>
                    Fulfil
                  </Button>
                ) : (
                  <Badge variant="outline">{item.status}</Badge>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No deletion requests yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
