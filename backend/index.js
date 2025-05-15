const express = require('express');
const cors = require("cors");
const Razorpay = require("razorpay");

const app = express();
const port = 5000;

app.use(cors());

app.get('/', (req, res) => {
    res.send("Hello World!");
});

// Create Razorpay order
app.post('/order', async (req, res) => {
    res.send("Hello Order");
});

// Fetch payment details
app.get("/payment/:paymentId", async (req, res) => {
    res.send("Hello PaymentId");
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
