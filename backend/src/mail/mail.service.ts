import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendVerificationEmail(email: string, token: string) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const verifyUrl = `${frontendUrl}/verify-email?token=${token}`;

        await this.transporter.sendMail({
            from: `"NeuroTron" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Verify your NeuroTron account ✅',
            html: `
                <div style="font-family: sans-serif; max-width: 480px; margin: auto; padding: 32px; border-radius: 12px; background: #0f172a; color: #f1f5f9;">
                    <h1 style="color: #6366f1; margin-bottom: 8px;">Welcome to NeuroTron! 🚀</h1>
                    <p style="color: #94a3b8;">Please verify your email address to activate your account.</p>
                    <a href="${verifyUrl}" style="display:inline-block;margin-top:24px;padding:12px 28px;background:#6366f1;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;">
                        Verify Email
                    </a>
                    <p style="margin-top:24px;color:#64748b;font-size:12px;">If you didn't create an account, you can safely ignore this email.</p>
                </div>
            `,
        });
    }
}
