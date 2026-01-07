require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const SQUARE_BASE_URL = process.env.SQUARE_ENVIRONMENT === 'production'
    ? 'https://connect.squareup.com'
    : 'https://connect.squareupsandbox.com';

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', environment: process.env.SQUARE_ENVIRONMENT });
});

app.post('/api/process-payment', async (req, res) => {
    const { sourceId, email, profileName } = req.body;

    if (!sourceId) {
        return res.status(400).json({ success: false, error: 'Missing payment source token' });
    }

    try {
        const idempotencyKey = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const response = await fetch(`${SQUARE_BASE_URL}/v2/payments`, {
            method: 'POST',
            headers: {
                'Square-Version': '2024-01-18',
                'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                source_id: sourceId,
                idempotency_key: idempotencyKey,
                location_id: process.env.SQUARE_LOCATION_ID,
                amount_money: { amount: 999, currency: 'USD' },
                note: `Parser Profile Full Report - ${profileName || 'Unknown'}`,
                buyer_email_address: email || undefined
            })
        });

        const data = await response.json();

        if (data.payment) {
            console.log('Payment successful:', data.payment.id);
            res.json({
                success: true,
                paymentId: data.payment.id,
                receiptUrl: data.payment.receipt_url
            });
        } else {
            throw new Error(data.errors?.[0]?.detail || 'Payment failed');
        }
    } catch (error) {
        console.error('Payment error:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Open http://localhost:${PORT}/assessment.html to test`);
});
