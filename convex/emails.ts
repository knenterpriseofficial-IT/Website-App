"use node";

import escapeHtml from "escape-html";
import { Hercules } from "@usehercules/sdk";
import { v } from "convex/values";
import { internalAction } from "./_generated/server";

const hercules = new Hercules({
  apiKey: process.env.HERCULES_API_KEY!,
  apiVersion: "2025-12-09",
});

// Both admin emails receive notifications
const ADMIN_EMAILS = [
  "aditya.saha.official963@gmail.com",
  "knenterprise.official@gmail.com", // company email as fallback for Subhajit
];

const SERVICE_LABELS: Record<string, string> = {
  general: "General / Site-wide",
  internship: "Internships",
  training: "Industrial Training",
  websites: "Ready-made Websites",
  "custom-websites": "Custom Websites",
  "ai-agents": "AI Agents",
  "mobile-apps": "Mobile Apps",
};

export const sendAdminChangeNotification = internalAction({
  args: {
    action: v.string(), // "added" | "deleted" | "updated"
    adminName: v.string(),
    serviceId: v.string(),
    contentTitle: v.string(),
    contentType: v.string(),
  },
  handler: async (_ctx, args) => {
    const serviceLabel = SERVICE_LABELS[args.serviceId] ?? args.serviceId;
    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    const subject = `[K&N Enterprises] Admin Update: ${escapeHtml(args.contentTitle)}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: Arial, sans-serif; background: #0a0d1a; color: #e8e8e8; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 30px auto; background: #141830; border-radius: 12px; overflow: hidden; border: 1px solid #2a3060; }
            .header { background: linear-gradient(135deg, #1a2040, #0d1530); padding: 30px; text-align: center; border-bottom: 2px solid #c8a030; }
            .logo-text { font-size: 26px; font-weight: 900; color: #c8a030; letter-spacing: 2px; }
            .tagline { font-size: 11px; color: #8898b8; letter-spacing: 3px; margin-top: 4px; }
            .body { padding: 30px; }
            .badge { display: inline-block; background: #c8a030; color: #0a0d1a; font-weight: bold; font-size: 13px; padding: 4px 14px; border-radius: 20px; margin-bottom: 20px; }
            .detail-row { display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid #2a3060; }
            .detail-label { color: #8898b8; font-size: 13px; min-width: 120px; }
            .detail-value { color: #e8e8e8; font-size: 13px; font-weight: 600; }
            .footer { background: #0d1020; padding: 20px 30px; text-align: center; font-size: 12px; color: #556; }
            .footer a { color: #c8a030; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo-text">K&N Enterprises</div>
              <div class="tagline">RESEARCH &bull; INNOVATION &bull; TECHNOLOGY</div>
            </div>
            <div class="body">
              <div class="badge">Admin Activity Alert</div>
              <p style="color:#aab;font-size:14px;margin-bottom:24px;">A change was made to the website content. Here are the details:</p>

              <div class="detail-row">
                <span class="detail-label">Action</span>
                <span class="detail-value" style="color:#c8a030;text-transform:capitalize;">${escapeHtml(args.action)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">By Admin</span>
                <span class="detail-value">${escapeHtml(args.adminName)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Section</span>
                <span class="detail-value">${escapeHtml(serviceLabel)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Content Title</span>
                <span class="detail-value">${escapeHtml(args.contentTitle)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Content Type</span>
                <span class="detail-value" style="text-transform:capitalize;">${escapeHtml(args.contentType)}</span>
              </div>
              <div class="detail-row" style="border-bottom:none;">
                <span class="detail-label">Timestamp</span>
                <span class="detail-value">${escapeHtml(timestamp)} IST</span>
              </div>
            </div>
            <div class="footer">
              This is an automated notification from the K&N Enterprises Admin System.<br/>
              <a href="mailto:knenterprise.official@gmail.com">knenterprise.official@gmail.com</a>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      await hercules.email.send({
        from: "knenterprise.official@gmail.com",
        to: ADMIN_EMAILS,
        subject,
        html,
      });
    } catch (err) {
      // Log but don't throw — content change already happened
      console.error("Failed to send admin notification email:", err);
    }
  },
});
