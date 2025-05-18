const express = require('express');
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require('crypto');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("Hello World!");
});


const instance = new Razorpay({
    key_id: 'your_id',
    key_secret: 'your_secert',
});


app.get('/getKey', (req, res) => {
    res.json({
        key_id: instance.key_id,
    });
});


const paymentProcess = async (req, res) => {
    try {
        const options = {
            amount: Number(req.body.amount * 100), // in paise 1000 Rs. = 100000 paise
            currency: req.body.currency || "INR",
        };

        const order = await instance.orders.create(options);

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error("Payment creation failed:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create payment order",
            error: error.message || error
        });
    }
}

app.post('/payment/process', paymentProcess);

const paymentVerification = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', instance.key_secret)
        .update(body.toString())
        .digest('hex');

    console.log("Razorpay Signature:", razorpay_signature)
    console.log("Expected Signature:", expectedSignature);
    const isSignatureValid = expectedSignature === razorpay_signature;
    if (isSignatureValid) {
        console.log("Signature is valid");
        res.redirect(`http://localhost:3006?reference=${razorpay_payment_id}`);
        return res.status(400).json({
            success: true,
            message: "Valid Signature"
        });
    }
    else {
        console.log("Signature is invalid");
        return res.status(400).json({
            success: false,
            message: "Invalid Signature"
        });
    }
}

app.post('/paymentVerification', paymentVerification)
// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
