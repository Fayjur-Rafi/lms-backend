import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./configs/mongodb.js";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import Stripe from 'stripe';

dotenv.config();
const app = express();
const PORT = 4000;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// CORS - credentials: true add kora hoyeche cookies er jonno
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/ai", aiRoutes); // Payment routes add kora hoyeche

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Backend running", success: true });
});

// Old payment route (if you need it for other products)
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { product } = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              images: [product.image],
            },
            unit_amount: product.price * 100,
          },
          quantity: 1,
        }
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on http://localhost:${PORT}`);
});