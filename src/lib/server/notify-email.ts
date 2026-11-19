export async function sendResendEmail(to: string, subject: string, text: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "HIREORA <noreply@hireora.in>";
  if (!key) {
    console.info("[hireora:email:dev]", { to, subject, text });
    return { ok: true, provider: "console" as const };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, text }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error("[hireora:email:error]", body);
    return { ok: false, provider: "resend" as const };
  }
  return { ok: true, provider: "resend" as const };
}
