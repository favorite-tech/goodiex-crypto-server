module.exports = async (req, res) => {
  const { order_id, payment_status } = req.body;

  if (payment_status === 'finished') {
    await fetch(`https://www.goodiex.store/admin/api/2024-01/orders/${order_id}.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN
      },
      body: JSON.stringify({
        order: { id: order_id, tags: 'crypto-paid' }
      })
    });
  }

  res.status(200).send('OK');
};
