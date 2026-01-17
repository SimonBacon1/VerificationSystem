import express from "express";
import { sendVerificationEmail } from "../services/email.js";
import crypto from "crypto";

const router = express.Router();

// Store pending verifications (use database in production)
const pendingVerifications = new Map();

router.post("/customer-create", async (req, res) => {
  try {
    const { email, id } = req.body;
    
    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex');
    
    // Store verification data
    pendingVerifications.set(token, {
      email,
      customerId: id,
      createdAt: Date.now()
    });
    
    // Send verification email
    const verificationUrl = `${process.env.VERIFICATION_HOST}/verify?token=${token}`;
    await sendVerificationEmail({ to: email, verificationUrl });
    
    console.log(`Verification email sent to ${email}`);
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

router.get("/verify", (req, res) => {
  const { token } = req.query;
  const data = pendingVerifications.get(token);
  
  if (!data) {
    return res.send("Invalid or expired verification link");
  }
  
  // Check expiration (48 hours)
  const hours = (Date.now() - data.createdAt) / (1000 * 60 * 60);
  if (hours > 48) {
    pendingVerifications.delete(token);
    return res.send("Verification link expired");
  }
  
  pendingVerifications.delete(token);
  res.send("✅ Email verified successfully!");
});

export default router;