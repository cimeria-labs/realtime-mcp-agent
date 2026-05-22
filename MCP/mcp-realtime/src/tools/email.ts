import { z } from "zod";
import nodemailer from "nodemailer";

export function registerEmailTools(register: Function) {
  register(
    "email.send",
    "Envia um email via SMTP",
    {
      inputSchema: z.object({
        to: z.string(),
        subject: z.string(),
        text: z.string()
      })
    },
    async ({ to, subject, text }) => {
      const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env as Record<string, string>;
      if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
        return { content: [{ type: "text", text: "SMTP não configurado no .env" }] };
      }

      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT || 587),
        secure: false,
        auth: { user: SMTP_USER, pass: SMTP_PASS }
      });

      const info = await transporter.sendMail({ from: SMTP_USER, to, subject, text });
      return { content: [{ type: "json", json: { ok: true, messageId: info.messageId } }] };
    }
  );
}
