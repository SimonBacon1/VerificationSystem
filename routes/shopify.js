import express from "express";
const router = express.Router();

router.post("/create-verification", (req, res) => {
  console.log("Shopify request:", req.body);
  res.status(200).json({
    verificationUrl: "https://example.com/verify"
  });
});

export default router;