import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { initDb } from './services/db.js';
import { handleShopifyCustomerCreate } from './routes/shopify.js';
import { handleSumaWebhook } from './routes/suma.js';

dotenv.config();
const app = express();
app.use(bodyParser.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.post('/webhook/shopify/customers_create', handleShopifyCustomerCreate);
app.post('/suma/webhook', handleSumaWebhook);

const PORT = process.env.PORT || 3000;

initDb().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('DB init error', err);
  process.exit(1);
});
