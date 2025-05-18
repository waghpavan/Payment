import './App.css';
import axios from 'axios'
import React from 'react';

function App() {
  
  const createRazorpayOrder = async (amount) => {
    try {
      const response = await axios.post("http://localhost:5000/payment/process", {
        amount: amount,
        currency: "INR"
      });
      const order = response.data.order;

      const key = await axios.get("http://localhost:5000/getKey");
      const rozarkey = key.data.key_id; 

      const options = {
        key: rozarkey,
        amount,
        currency: 'INR',
        name: 'Acme Corp',
        description: 'Test Transaction',
        order_id: order.id,
        callback_url: 'http://localhost:5000/paymentVerification',
        prefill: {
          name: 'Gaurav Kumar',
          email: 'gaurav.kumar@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#F37254'
        },
      };

      // eslint-disable-next-line no-undef
      if (typeof Razorpay === "undefined") {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => {
          // eslint-disable-next-line no-undef
          const rzp = new Razorpay(options);
          rzp.open();
        };
        document.body.appendChild(script);
      } else {
        // eslint-disable-next-line no-undef
        const rzp = new Razorpay(options);
        rzp.open();
      }

    } catch (error) {
      console.error("Error creating order:", error);
    }
  }


  return (
    <div className="App">
      <button onClick={() => createRazorpayOrder(10000)}>Payment of 100Rs.</button>
    </div>
  );
}

export default App;
