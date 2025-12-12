# Connabis Verification Service (No DB)

Node.js service that integrates Shopify -> SUMA (VeriDocID) -> Resend email notifications.
This variant runs WITHOUT a database or local logs (stateless).

MVP:
- Create SUMA verification session (document + selfie + liveness)
- Send verification link to user (Resend) to open on phone
- Receive SUMA webhook results and send Spanish emails to user + admin
- Optionally tag Shopify customer as Verified / Urgent

Deploy: push this repo to GitHub and connect to Render, set environment variables from .env.example
