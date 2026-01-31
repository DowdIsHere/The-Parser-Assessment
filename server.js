// Only load .env in development (not on Railway)
if (!process.env.RAILWAY_ENVIRONMENT_NAME) {
    require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const Stripe = require('stripe');

const app = express();

// Stripe webhook needs raw body, so set it up before express.json()
app.post('/api/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Initialize Stripe lazily (env vars not available during Railway build)
let stripe;
function getStripe() {
    if (!stripe) {
        stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
    return stripe;
}

// ============================================================================
// CUSTOMER ID GENERATION
// ============================================================================

// Simple counter stored in memory (resets on server restart)
// For production, you'd want to store this in a database
let customerCounter = Math.floor(Math.random() * 1000) + 1;

function generateCustomerId() {
    const year = new Date().getFullYear();
    const counter = String(customerCounter++).padStart(5, '0');
    return `CBI-${year}-${counter}`;
}

// ============================================================================
// EMAIL CONFIGURATION
// ============================================================================

// Create transporter - configure via environment variables
// Supports Gmail, SMTP, or other providers
const createTransporter = () => {
    // Use Gmail if configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    // Use custom SMTP if configured
    if (process.env.SMTP_HOST) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    // Return null if no email config (will skip sending)
    return null;
};

// ============================================================================
// ROOT REDIRECT
// ============================================================================

app.get('/', (req, res) => {
    res.redirect('/assessment.html');
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get('/api/health', (req, res) => {
    const transporter = createTransporter();
    res.json({
        status: 'ok',
        environment: process.env.STRIPE_ENVIRONMENT || 'test',
        emailConfigured: !!transporter
    });
});

// Serve Stripe publishable key to frontend
app.get('/api/config', (req, res) => {
    res.json({
        stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
});

// ============================================================================
// EMAIL ENDPOINTS
// ============================================================================

// Send FREE tier results email
app.post('/api/send-results', async (req, res) => {
    const { email, name, profileName, profileCode, scores, overview, phrase, strengths, howYouLearn, howYouCommunicate, primaryChallenge } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, error: 'Email is required' });
    }

    const customerId = generateCustomerId();
    const transporter = createTransporter();

    // Build the email HTML
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f7;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0a0a0f 0%, #1a1a24 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #00d4aa; font-size: 28px; margin: 0 0 8px 0;">Parser Profile™</h1>
            <p style="color: #a0a0b0; font-size: 14px; margin: 0;">Developed by J.D. Mercer</p>
        </div>

        <!-- Customer ID -->
        <div style="background-color: #f0f0f5; padding: 16px 30px; text-align: center; border-bottom: 1px solid #e0e0e5;">
            <p style="margin: 0; color: #6a6a7a; font-size: 12px;">Your Customer ID</p>
            <p style="margin: 4px 0 0 0; color: #1a1a24; font-size: 16px; font-weight: bold; letter-spacing: 0.05em;">${customerId}</p>
        </div>

        <!-- Profile Name -->
        <div style="padding: 40px 30px; text-align: center; border-bottom: 1px solid #e0e0e5;">
            ${name ? `<p style="color: #6a6a7a; font-size: 14px; margin: 0 0 8px 0;">Hi ${name},</p>` : ''}
            <p style="color: #6a6a7a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 12px 0;">Your Parser Profile™</p>
            <h2 style="color: #00d4aa; font-size: 42px; margin: 0 0 8px 0;">${profileName}</h2>
            <p style="color: #6a6a7a; font-size: 14px; margin: 0;">${profileCode}</p>
        </div>

        <!-- Dimension Scores -->
        <div style="padding: 30px; border-bottom: 1px solid #e0e0e5;">
            <h3 style="color: #1a1a24; font-size: 16px; margin: 0 0 20px 0;">📊 Your Cognitive Coordinates</h3>
            <div style="margin-bottom: 16px;">
                <p style="margin: 0 0 4px 0; color: #1a1a24;"><strong>Spatial Processing:</strong></p>
                <p style="margin: 0; color: #00d4aa;">${scores.spatial >= 50 ? scores.spatial : 100 - scores.spatial}% ${scores.spatial >= 50 ? 'Abstract' : 'Concrete'}</p>
            </div>
            <div style="margin-bottom: 16px;">
                <p style="margin: 0 0 4px 0; color: #1a1a24;"><strong>Temporal Processing:</strong></p>
                <p style="margin: 0; color: #ffc857;">${scores.temporal >= 50 ? scores.temporal : 100 - scores.temporal}% ${scores.temporal >= 50 ? 'Future' : 'Past'}</p>
            </div>
            <div>
                <p style="margin: 0 0 4px 0; color: #1a1a24;"><strong>Reference Processing:</strong></p>
                <p style="margin: 0; color: #a855f7;">${scores.reference >= 50 ? scores.reference : 100 - scores.reference}% ${scores.reference >= 50 ? 'Self' : 'Other'}</p>
            </div>
        </div>

        <!-- Profile Overview -->
        ${overview ? `
        <div style="padding: 30px; border-bottom: 1px solid #e0e0e5;">
            <h3 style="color: #1a1a24; font-size: 16px; margin: 0 0 16px 0;">🔮 Your Profile</h3>
            <p style="color: #4a4a5a; line-height: 1.6; margin: 0;">${overview.replace(/\n\n/g, '</p><p style="color: #4a4a5a; line-height: 1.6; margin: 16px 0 0 0;">')}</p>
        </div>
        ` : ''}

        <!-- The Phrase -->
        ${phrase ? `
        <div style="padding: 30px; border-bottom: 1px solid #e0e0e5; background-color: #f8f8fa;">
            <h3 style="color: #1a1a24; font-size: 16px; margin: 0 0 16px 0;">💡 The Phrase That Hits Home</h3>
            <p style="color: #1a1a24; font-size: 18px; font-style: italic; line-height: 1.5; margin: 0; text-align: center;">"${phrase}"</p>
        </div>
        ` : ''}

        <!-- Strengths -->
        ${strengths && strengths.length > 0 ? `
        <div style="padding: 30px; border-bottom: 1px solid #e0e0e5;">
            <h3 style="color: #1a1a24; font-size: 16px; margin: 0 0 20px 0;">⚡ Your Cognitive Strengths</h3>
            ${strengths.slice(0, 6).map(s => `
                <div style="margin-bottom: 16px; padding: 16px; background-color: #f5f5f7; border-radius: 8px;">
                    <p style="margin: 0 0 4px 0; color: #1a1a24; font-weight: bold;">${s.title}</p>
                    <p style="margin: 0; color: #4a4a5a; font-size: 14px;">${s.description}</p>
                </div>
            `).join('')}
        </div>
        ` : ''}

        <!-- How You Learn -->
        ${howYouLearn ? `
        <div style="padding: 30px; border-bottom: 1px solid #e0e0e5;">
            <h3 style="color: #1a1a24; font-size: 16px; margin: 0 0 16px 0;">📚 How You Learn Best</h3>
            <p style="color: #4a4a5a; line-height: 1.6; margin: 0;">${howYouLearn.replace(/\n\n/g, '</p><p style="color: #4a4a5a; line-height: 1.6; margin: 16px 0 0 0;">')}</p>
        </div>
        ` : ''}

        <!-- How You Communicate -->
        ${howYouCommunicate ? `
        <div style="padding: 30px; border-bottom: 1px solid #e0e0e5;">
            <h3 style="color: #1a1a24; font-size: 16px; margin: 0 0 16px 0;">💬 How You Communicate</h3>
            <p style="color: #4a4a5a; line-height: 1.6; margin: 0;">${howYouCommunicate.replace(/\n\n/g, '</p><p style="color: #4a4a5a; line-height: 1.6; margin: 16px 0 0 0;">')}</p>
        </div>
        ` : ''}

        <!-- Primary Challenge -->
        ${primaryChallenge ? `
        <div style="padding: 30px; border-bottom: 1px solid #e0e0e5;">
            <h3 style="color: #1a1a24; font-size: 16px; margin: 0 0 16px 0;">🎯 Your Primary Challenge</h3>
            <div style="padding: 20px; background-color: #fff8f0; border-left: 4px solid #ffc857; border-radius: 8px;">
                <p style="margin: 0 0 8px 0; color: #1a1a24; font-weight: bold;">${primaryChallenge.title}</p>
                <p style="margin: 0 0 12px 0; color: #4a4a5a; font-size: 14px;">${primaryChallenge.challenge}</p>
                <p style="margin: 0; color: #00d4aa; font-size: 14px;"><strong>Remedy:</strong> ${primaryChallenge.remedy}</p>
            </div>
        </div>
        ` : ''}

        <!-- Unlock Full Report CTA -->
        <div style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, rgba(0, 212, 170, 0.1), rgba(168, 85, 247, 0.1));">
            <h3 style="color: #1a1a24; font-size: 20px; margin: 0 0 12px 0;">Unlock Your Complete Profile</h3>
            <p style="color: #4a4a5a; font-size: 14px; margin: 0 0 24px 0;">Get The Secret, Hidden Superpower, Blind Spot, and more.</p>
            <a href="https://the-parser-assessment-production.up.railway.app/assessment.html" style="display: inline-block; background: linear-gradient(135deg, #00d4aa, #00b894); color: #0a0a0f; padding: 14px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px;">Get Full Report - $9.99</a>
        </div>

        <!-- Footer -->
        <div style="padding: 30px; text-align: center; background-color: #0a0a0f;">
            <a href="https://cognitionblocksllc.com/cbi_overview" style="display: inline-block; color: #00d4aa; border: 2px solid #00d4aa; padding: 12px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px; margin-bottom: 20px;">Explore CBI</a>
            <p style="color: #a0a0b0; font-size: 12px; margin: 16px 0 0 0;">Parser Profile™ developed by J.D. Mercer</p>
            <p style="color: #6a6a7a; font-size: 11px; margin: 4px 0 0 0;">Based on the Cognition Blocks Intelligence (CBI) Framework</p>
            <p style="color: #6a6a7a; font-size: 11px; margin: 12px 0 0 0;">© 2026 Cognition Blocks LLC. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

    // If email is configured, send it
    if (transporter) {
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@cognitionblocksllc.com',
                to: email,
                bcc: 'Profile.library@cognitionblocksllc.com',
                subject: `Your Parser Profile™ Results: ${profileName}`,
                html: emailHtml
            });

            console.log(`Email sent to ${email}, Customer ID: ${customerId}`);

            res.json({
                success: true,
                customerId,
                message: 'Results sent to your email!'
            });
        } catch (error) {
            console.error('Email error:', error);
            // Still return success with customer ID even if email fails
            res.json({
                success: true,
                customerId,
                emailSent: false,
                message: 'Results saved! Email delivery pending.'
            });
        }
    } else {
        // No email config - just generate customer ID
        console.log(`No email config. Customer ID generated: ${customerId} for ${email}`);
        res.json({
            success: true,
            customerId,
            emailSent: false,
            message: 'Results saved!'
        });
    }
});

// Notification endpoint - for admin notifications
app.post('/api/notify-completion', async (req, res) => {
    const { customerId, profileName, email, name, tier } = req.body;

    const transporter = createTransporter();
    if (!transporter) {
        return res.json({ success: true, message: 'Notifications not configured' });
    }

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@cognitionblocksllc.com',
            to: 'Profile.library@cognitionblocksllc.com',
            subject: `New Parser Profile™ Completion: ${profileName} (${tier})`,
            html: `
                <h2>New Assessment Completed</h2>
                <p><strong>Customer ID:</strong> ${customerId}</p>
                <p><strong>Profile:</strong> ${profileName}</p>
                <p><strong>Name:</strong> ${name || 'Not provided'}</p>
                <p><strong>Email:</strong> ${email || 'Not provided'}</p>
                <p><strong>Tier:</strong> ${tier}</p>
                <p><strong>Time:</strong> ${new Date().toISOString()}</p>
            `
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Notification error:', error);
        res.json({ success: true, message: 'Notification queued' });
    }
});

// ============================================================================
// PAYMENT ENDPOINTS (Stripe)
// ============================================================================

// Create Stripe PaymentIntent
app.post('/api/create-payment-intent', async (req, res) => {
    const { email, profileName } = req.body;

    try {
        const paymentIntent = await getStripe().paymentIntents.create({
            amount: 999, // $9.99 in cents
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                profileName: profileName || 'Unknown',
                email: email || ''
            },
            receipt_email: email || undefined,
            description: `Parser Profile™ Full Report - ${profileName || 'Assessment'}`
        });

        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        console.error('Payment intent error:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// Stripe webhook handler
async function handleStripeWebhook(req, res) {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    // If no webhook secret configured, skip validation (for development)
    if (!webhookSecret) {
        console.log('Stripe webhook received (no signature validation)');
        return res.json({ received: true });
    }

    try {
        const event = getStripe().webhooks.constructEvent(req.body, sig, webhookSecret);

        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                console.log('Payment succeeded:', paymentIntent.id, paymentIntent.metadata);
                break;
            case 'payment_intent.payment_failed':
                const failedPayment = event.data.object;
                console.log('Payment failed:', failedPayment.id, failedPayment.last_payment_error?.message);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error.message);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
}

// ============================================================================
// START SERVER
// ============================================================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Email configured: ${!!createTransporter()}`);
});
