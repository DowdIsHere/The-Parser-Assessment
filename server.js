// Parser Profile™ - Payment Server
// Handles Square payment processing

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Client, Environment } = require('square');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Initialize Square client
const squareClient = new Client({
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    environment: process.env.SQUARE_ENVIRONMENT === 'production'
        ? Environment.Production
        : Environment.Sandbox
});

const paymentsApi = squareClient.paymentsApi;

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        environment: process.env.SQUARE_ENVIRONMENT,
        timestamp: new Date().toISOString()
    });
});

// Process payment
app.post('/api/process-payment', async (req, res) => {
    const { sourceId, email, profileName } = req.body;

    if (!sourceId) {
        return res.status(400).json({
            success: false,
            error: 'Missing payment source token'
        });
    }

    try {
        // Create a unique idempotency key for this payment
        const idempotencyKey = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const response = await paymentsApi.createPayment({
            sourceId: sourceId,
            idempotencyKey: idempotencyKey,
            locationId: process.env.SQUARE_LOCATION_ID,
            amountMoney: {
                amount: 999, // $9.99 in cents
                currency: 'USD'
            },
            // Optional: Add metadata about the purchase
            note: `Parser Profile Full Report - ${profileName || 'Unknown'}`,
            // Optional: Link to customer email
            buyerEmailAddress: email || undefined
        });

        if (response.result.payment) {
            console.log('Payment successful:', response.result.payment.id);

            res.json({
                success: true,
                paymentId: response.result.payment.id,
                receiptUrl: response.result.payment.receiptUrl
            });
        } else {
            throw new Error('No payment in response');
        }

    } catch (error) {
        console.error('Payment error:', error);

        // Extract error message from Square API response
        let errorMessage = 'Payment processing failed';
        if (error.result && error.result.errors) {
            errorMessage = error.result.errors.map(e => e.detail).join(', ');
        } else if (error.message) {
            errorMessage = error.message;
        }

        res.status(400).json({
            success: false,
            error: errorMessage
        });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║           Parser Profile™ Payment Server                  ║
╠═══════════════════════════════════════════════════════════╣
║  Server running at: http://localhost:${PORT}                 ║
║  Environment: ${(process.env.SQUARE_ENVIRONMENT || 'sandbox').padEnd(41)}║
║                                                           ║
║  Open http://localhost:${PORT}/assessment.html to test       ║
╚═══════════════════════════════════════════════════════════╝
    `);
});
