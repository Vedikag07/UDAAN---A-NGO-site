const express = require('express');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');
const crypto = require('crypto');// Add this line
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 3000; // you can choose any available port

// Add the CORS middleware here
const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from the current directory
app.use(express.static(__dirname));

var razorpay = new Razorpay({
  key_id: 'rzp_test_VyR5UUq4VfhzGF',
  key_secret: '80rkph2ZlYa2LO4MBDDFJRml',
});

app.get('/', (req, res) => {
  // This route serves the index.html file in the current directory
  const orderId = uuidv4();
  res.sendFile('razor.html', { root: __dirname, orderId });
});

app.post('/api/payment/verify', (req, res) => {
  let body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;
  var expectedSignature = crypto.createHmac('sha256', '80rkph2ZlYa2LO4MBDDFJRml').update(body.toString()).digest('hex');
  console.log("sig received", req.body.response.razorpay_signature);
  console.log("sig generated", expectedSignature);

 // var response = { "signatureIsValid": "false" }
 var response = {
    "signatureIsValid": false,
    "message": "Payment verification failed"
  };
  if (expectedSignature === req.body.response.razorpay_signature)
    response = { "signatureIsValid": "true", "message": "Your Payment is Successful! Thanks For the Generous Donation" };
  //res.send(response);
  res.json(response);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
