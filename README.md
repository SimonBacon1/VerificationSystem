# Connabis Verification Service

Node.js service that integrates Shopify -> SUMA (VeriDocID) -> Resend email notifications.

Features (MVP):
- Create SUMA verification session (document + selfie + liveness)
- Send verification link to user (Resend) to open on phone
- Receive SUMA webhook results and email user + admin in Spanish
- Optionally tag Shopify customer

Deploy: push this repo to GitHub and connect to Render, set environment variables from .env.example
