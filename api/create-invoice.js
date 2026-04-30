const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ status: 'Invoice endpoint active' });
  }

  try {
    const { orderId, totalAmount, currency, pay_currency } = req.body;

    const response = await fetch('https://api.nowpayments.io/v1/invoice', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.NOWPAYMENTS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        price_amount: totalAmount,
        price_currency: currency,
        pay_currency: pay_currency,
        order_id: orderId,
        order_description: `GOODIE X Order #${orderId}`,
        callback_url: `https://goodiex-crypto-server.vercel.app/api/webhook`,
        success_url: 'https://www.goodiex.store/pages/thank-you'
      })
    });

    const data = await response.json();
    res.json({ invoice_url: data.invoice_url });
  } catch (err) {
    console.error('Invoice error:', err);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
}
