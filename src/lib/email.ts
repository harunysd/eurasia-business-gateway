import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { prisma } from './prisma';

// Admin-configurable SMTP transport used for contact-form replies and test
// emails. Stored as JSON in the Setting table. If no SMTP transport has been
// configured, sendEmail() falls back to Resend (RESEND_API_KEY).
export type SmtpSettings = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromEmail: string;
  fromName: string;
};

const SMTP_KEY = 'smtp';

const defaultSmtp: SmtpSettings = {
  host: '',
  port: 587,
  secure: false,
  user: '',
  pass: '',
  fromEmail: '',
  fromName: '',
};

export async function getSmtpSettings(): Promise<SmtpSettings | null> {
  try {
    const row = await prisma.setting.findUnique({ where: { key: SMTP_KEY } });
    if (!row?.value) return null;
    const parsed = JSON.parse(row.value) as SmtpSettings;
    if (!parsed.host) return null;
    return { ...defaultSmtp, ...parsed, port: Number(parsed.port || 587) };
  } catch {
    return null;
  }
}

export async function saveSmtpSettings(settings: SmtpSettings): Promise<void> {
  const value = JSON.stringify({ ...defaultSmtp, ...settings });
  await prisma.setting.upsert({
    where: { key: SMTP_KEY },
    update: { value },
    create: { key: SMTP_KEY, value },
  });
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

// Send a plain-text email. Throws with a descriptive message when no email
// transport is configured at all.
export async function sendEmail(args: {
  to: string;
  subject: string;
  text: string;
}): Promise<{ provider: 'smtp' | 'resend' }> {
  const { to, subject, text } = args;

  const smtp = await getSmtpSettings();
  if (smtp) {
    const transport = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: { user: smtp.user, pass: smtp.pass },
    });
    const from = smtp.fromEmail || smtp.user;
    const fromAddr = smtp.fromName && from ? `"${smtp.fromName}" <${from}>` : from;
    if (!fromAddr) {
      throw new Error('SMTP "From" address is not set.');
    }
    await transport.sendMail({ from: fromAddr, to, subject, text });
    return { provider: 'smtp' };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: 'Eurasia Business Gateway <info@eurasiabusinessgateway.com>',
      to,
      subject,
      text,
    });
    return { provider: 'resend' };
  }

  throw new Error(
    'No email transport configured. Add SMTP settings in Admin > Email Settings, or set the RESEND_API_KEY environment variable.',
  );
}