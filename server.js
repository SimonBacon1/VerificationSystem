import express from "express";
import cors from "cors";

import sumaRoutes from "./routes/suma.js";
import shopifyRoutes from "./routes/shopify.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/suma", sumaRoutes);
app.use("/shopify", shopifyRoutes);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});