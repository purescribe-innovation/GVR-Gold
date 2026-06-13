const fetch = require('node-fetch');

async function test() {
  const url = 'https://api.metals.dev/v1/latest?api_key=V7IOEMMRHUHZBTC9ROAS620C9ROAS&currency=INR&unit=g';
  const res = await fetch(url);
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

test();
