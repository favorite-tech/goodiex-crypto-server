const fetch = require('node-fetch');

module.exports = async (req, res) => {
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
      callback_url: `${process.env.VERCEL_URL}/api/webhook`,
      success_url: 'https://www.goodiex.store/pages/thank-you'
    })
  });

  const data = await response.json();
  res.json({ invoice_url: data.invoice_url });
};
