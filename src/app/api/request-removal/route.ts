import { NextRequest, NextResponse } from "next/server";
import { COUNTRIES } from "@/data/countries";

const REMOVAL_EMAIL_TO = process.env.REMOVAL_EMAIL_TO;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.REMOVAL_EMAIL_FROM || "Brand Wall <onboarding@resend.dev>";

export async function POST(request: NextRequest) {
  let body: { brandName?: string; country?: string; email?: string; reason?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const brandName = typeof body.brandName === "string" ? body.brandName.trim() : "";
  const country = typeof body.country === "string" ? body.country.trim().toLowerCase() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const reason = typeof body.reason === "string" ? body.reason.trim() : "";

  if (!brandName || brandName.length > 200) {
    return NextResponse.json({ message: "Brand name is required (max 200 characters)" }, { status: 400 });
  }
  if (!country || !COUNTRIES[country]) {
    return NextResponse.json({ message: "Valid country is required" }, { status: 400 });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ message: "Valid email is required" }, { status: 400 });
  }
  if (reason.length > 2000) {
    return NextResponse.json({ message: "Reason must be under 2000 characters" }, { status: 400 });
  }

  const payload = {
    brandName,
    country,
    email,
    reason: reason || "(none provided)",
    timestamp: new Date().toISOString(),
  };

  if (RESEND_API_KEY && REMOVAL_EMAIL_TO) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [REMOVAL_EMAIL_TO],
          subject: `[Brand Wall] Removal request: ${brandName} (${country})`,
          text: [
            `Brand: ${brandName}`,
            `Country: ${country}`,
            `Requester email: ${email}`,
            `Reason: ${payload.reason}`,
            `Submitted: ${payload.timestamp}`,
          ].join("\n"),
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        console.error("[request-removal] Resend error:", res.status, err);
        return NextResponse.json(
          { message: "Failed to send request. Please try again or contact us directly." },
          { status: 502 }
        );
      }
    } catch (e) {
      console.error("[request-removal] Send failed:", e);
      return NextResponse.json(
        { message: "Failed to send request. Please try again later." },
        { status: 502 }
      );
    }
  } else {
    console.log("[request-removal] No RESEND_API_KEY or REMOVAL_EMAIL_TO; logging only:", payload);
  }

  return NextResponse.json({ ok: true });
}
