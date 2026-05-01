module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://www.goodiex.store');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId, totalAmount, currency, pay_currency } = req.body;

    const response = await fetch('https://api.nowpayments.io/v1/invoice', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.NOWPAYMENTS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_amount: totalAmount,
        price_currency: currency || 'USD',
        pay_currency: pay_currency || 'USDTTRC20',
        order_id: orderId,
        order_description: 'GOODIE X Store Order',
        ipn_callback_url: 'https://goodiex-crypto-server.vercel.app/api/webhook',
        success_url: 'https://www.goodiex.store/pages/thank-you',
        cancel_url: 'https://www.goodiex.store/cart',
      }),
    });

    const data = await response.json();

    if (data.invoice_url) {
      return res.status(200).json({ invoice_url: data.invoice_url });
    } else {
      console.error('NOWPayments error:', data);
      return res.status(500).json({ error: 'Failed to create invoice', details: data });
    }
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
