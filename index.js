const express = require("express");
const axios = require("axios");

const app = express();
const port = 7850;

app.use(express.json());

const FIXER_API_KEY = "f3530d21f2adf8022111806fc8adbb1b";
const FIXER_API_URL = `http://data.fixer.io/api/latest?access_key=${FIXER_API_KEY}`;

app.post("/convert", async (req, res) => {
  try {
    const { amount, from, to } = req.body;

    // Make a request to the Fixer API to get exchange rates
    const response = await axios.get(FIXER_API_URL);
    const exchangeRates = response.data.rates;

    const conversions = [];

    // Loop through the target currencies and calculate conversions
    for (const targetCurrency of to) {
      if (!exchangeRates[targetCurrency]) {
        // Handle the case where the target currency is not available
        conversions.push({
          amount,
          from,
          to: targetCurrency,
          error: `Currency ${targetCurrency} not found in exchange rates.`,
        });
        continue;
      }

      const exchangeValue = amount * exchangeRates[targetCurrency];

      conversions.push({
        amount,
        from,
        to: targetCurrency,
        exchangeValue,
      });
    }

    res.json({ conversions });
  } catch (error) {
    // Handle any errors that occur during the conversion
    res
      .status(500)
      .json({ error: "An error occurred while processing the request." });
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to the Currency Converter API");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
