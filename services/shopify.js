import axios from 'axios';

const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
const SHOPIFY_TOKEN = process.env.SHOPIFY_TOKEN;

export async function getCustomerByEmail(email){
  const resp = await axios.get(`https://${SHOPIFY_STORE}/admin/api/2024-10/customers/search.json?query=email:${encodeURIComponent(email)}`, { headers: { 'X-Shopify-Access-Token': SHOPIFY_TOKEN } });
  return resp.data.customers?.[0];
}

export async function tagCustomer(customerId, tag){
  const getResp = await axios.get(`https://${SHOPIFY_STORE}/admin/api/2024-10/customers/${customerId}.json`, { headers: { 'X-Shopify-Access-Token': SHOPIFY_TOKEN } });
  const customer = getResp.data.customer;
  const existingTags = customer.tags || '';
  const newTags = existingTags ? `${existingTags}, ${tag}` : tag;
  await axios.put(`https://${SHOPIFY_STORE}/admin/api/2024-10/customers/${customerId}.json`, { customer: { id: customerId, tags: newTags } }, { headers: { 'X-Shopify-Access-Token': SHOPIFY_TOKEN } });
}
