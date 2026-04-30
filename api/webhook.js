module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(200).json({ status: 'Webhook endpoint active' });
  }

  try {
    const { order_id, payment_status } = req.body || {};

    if (payment_status === 'finished' && order_id) {
      // Get access token
      const tokenRes = await fetch(
        `https://${process.env.SHOPIFY_SHOP}.myshopify.com/admin/oauth/access_token`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: process.env.SHOPIFY_CLIENT_ID,
            client_secret: process.env.SHOPIFY_CLIENT_SECRET,
          }),
        }
      );

      const { access_token } = await tokenRes.json();

      // Update order
      await fetch(
        `https://${process.env.SHOPIFY_SHOP}.myshopify.com/admin/api/2026-04/orders/${order_id}.json`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': access_token,
          },
          body: JSON.stringify({
            order: { id: order_id, tags: 'crypto-paid' }
          }),
        }
      );
    }

    res.status(200).send('OK');
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(200).send('OK');
  }
};
