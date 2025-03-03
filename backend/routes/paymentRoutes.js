// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || "sk_test_yourKey"); 
// ↑ Make sure you have STRIPE_SECRET_KEY in .env or replace "sk_test_yourKey" with your real secret key

router.post("/stripe", async (req, res) => {
  try {
    const { amount, id } = req.body;

    // Confirm a PaymentIntent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount,       // e.g., 5000 for $50.00
      currency: "usd",
      payment_method: id,
      confirm: true,
    });

    // If successful, return success + the amount
    return res.json({
      success: true,
      amount,
    });
  } catch (err) {
    console.error("Payment error:", err);

    // Return a JSON error so your frontend can handle it
    return res.json({
      success: false,
      message: err.raw?.message || "Something went wrong with Stripe",
    });
  }
});

module.exports = router;
