import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import Enrollment from '../models/Enrollment.js';

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', isAuthenticated, async (req, res) => {
  try {
    const { courseId, courseName, coursePrice, discount } = req.body;
    const userId = req.userId;

    const finalPrice = coursePrice - (discount * coursePrice / 100);

    if (!courseId || !courseName || coursePrice === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: courseName,
            },
            unit_amount: Math.round(finalPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&courseId=${courseId}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel?courseId=${courseId}`,
      metadata: {
        courseId: courseId,
        userId: userId,
      },
    });

    res.json({
      success: true,
      url: session.url
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Verify Payment
router.post('/verify-session', isAuthenticated, async (req, res) => {
  try {
    const { sessionId, courseId } = req.body;
    const userId = req.userId;

    if (!sessionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // Check if enrollment already exists
      const existingEnrollment = await Enrollment.findOne({ paymentId: sessionId });
      
      if (existingEnrollment) {
        return res.json({
          success: true,
          message: 'Already enrolled',
          enrollment: existingEnrollment
        });
      }

      // Create new enrollment record
      const enrollment = await Enrollment.create({
        userId: userId,
        courseId: courseId,
        paymentId: sessionId,
        amount: session.amount_total / 100, // Convert from cents to dollars
        status: 'completed'
      });

      res.json({
        success: true,
        message: 'Payment verified and enrollment created',
        enrollment: enrollment
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }
  } catch (error) {
    console.error('Verify session error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;