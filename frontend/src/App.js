import './App.css';
import axios from 'axios'
import React, { useEffect } from 'react';

function App() {
  const [responseId, setResponseId] = React.useState("");
  const [responseState, setResponseState] = React.useState({});
  const [resp1,setResp1] = React.useState(null);
  const [resp2,setResp2] = React.useState(null);
  const createRazorpayOrder = async (amount) => {
    try {
      const response = await axios.post("http://localhost:5000/order", {
        amount: amount,
        currency: "INR"
      });
      setResponseId(response.data.order_id);
      console.log(response.data);
      setResp1(response.data);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  }
  const paymentFetch = async (e) => {
    e.preventDefault();
    const paymentId = e.target.paymentId.value;
    try {
      const response = await axios.get(`http://localhost:5000/payment/${paymentId}`);
      setResponseState(response.data);
      console.log(response.data);
      setResp2(response.data);
    } catch (error) {
      console.error("Error fetching payment:", error);
    }
  }
  

  return (
    <div className="App">
      <button onClick={() => createRazorpayOrder(100)}>Payment of 100Rs.</button>

      <p>{resp1}</p>
      <p>{resp2}</p>

      {responseId && <p>{responseId}</p>}
      

      <form onSubmit={paymentFetch}>
      <h1>This is payment verification form</h1>
        <input type="text" name="paymentId" />
        <button type="submit">Fetch Payment</button>
        {responseState.length !==0 && (
          <ul style={{ listStyleType: "none" }}>
            <li>Amount: {responseState.amount / 100} Rs.</li>
            <li>Currency: {responseState.currency}</li>
            <li>Status: {responseState.status}</li>
            <li>Method: {responseState.method}</li>
          </ul>
        )}
      </form>


    </div>
  );
}

export default App;
