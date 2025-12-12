import express from 'express';
import dotenv from 'dotenv';
import shopifyRoutes from './routes/shopify.js';
import sumaRoutes from './routes/suma.js';

dotenv.config();
const app = express();

// capture raw body for webhook verification, and still parse json
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.post('/webhook/shopify/customers_create', shopifyRoutes.handleShopifyCustomerCreate);
app.post('/suma/webhook', sumaRoutes.handleSumaWebhook);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
