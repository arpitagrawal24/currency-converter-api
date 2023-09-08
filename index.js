const express = require('express');
const axios = require('axios');

const app = express();
const port = 7850;

app.use(express.json());


const FIXER_API_KEY = 'f3530d21f2adf8022111806fc8adbb1b';


const FIXER_API_URL = 'https://data.fixer.io/api/latest';


app.post('/convert', async (req, res) => {
  try {
    const { toConvert } = req.body;
    const conversions = [];

    for (const conversion of toConvert) {
      const { amount, from, to } = conversion;

     
      const response = await axios.get(FIXER_API_URL, {
        params: {
          access_key: FIXER_API_KEY,
          base: from,
        },
      });

      const exchangeRates = response.data.rates;
      const exchangeValues = {};

      for (const targetCurrency of to) {
        if (exchangeRates[targetCurrency]) {
          const convertedAmount = (amount * exchangeRates[targetCurrency]).toFixed(2);
          exchangeValues[targetCurrency] = {
            to: targetCurrency,
            value: parseFloat(convertedAmount),
          };
        }
      }

      conversions.push({
        amount,
        from,
        exchangeValues,
      });
    }

    res.status(200).json({ conversions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/', (req, res) => {
    res.send('Welcome to the Currency Converter API');
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});