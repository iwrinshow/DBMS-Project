var express = require('express');
var mysql = require('mysql');
var bodyparser = require('body-parser');
var cors = require('cors');
var path = require('path');
const ejs = require('ejs');
const paypal = require('paypal-rest-sdk');

paypal.configure({
	'mode': 'sandbox', //sandbox or live
	'client_id': 'Aez_XRN1O4ziSPcrMMDQ5-TVrQhQMsOfMxlyAbJAf8FM6hGzU2AC0RQGi0p__vmyiWVuALZMa2UbEOSO',
	'client_secret': 'ECoH-hRlwguE2LzjTRFwSk5k_PZNfvJTXXvcMvm70t80P44fL6962TWIhrl8l1SkuIXuvfkomMBur3wh'
});

var app = express();

app.set('view engine', 'ejs');

var login = require('./routes/login');


app.post('/pay', (req, res) => {
  const create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhost:3000/success",
        "cancel_url": "http://localhost:3000/cancel"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "1 day package",
                "sku": "001",
                "price": "100.00",
                "currency": "USD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "USD",
            "total": "100.00"
        },
        "description": "Dive into Salvar"
    }]
};

paypal.payment.create(create_payment_json, function (error, payment) {
  if (error) {
      throw error;
  } else {
      for(let i = 0;i < payment.links.length;i++){
        if(payment.links[i].rel === 'approval_url'){
          res.redirect(payment.links[i].href);
        }
      }
  }
});

});

app.get('/success', (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
        "amount": {
            "currency": "USD",
            "total": "100.00"
        }
    }]
  };

  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
        console.log(error.response);
        throw error;
    } else {
        console.log(JSON.stringify(payment));
        res.send('Success');
    }
});
});

app.get('/cancel', (req, res) => res.send('Cancelled'));


const port = 3000;

app.use(cors());

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
  extended: true
}));

app.use(express.static(path.join(__dirname, 'Public')));

app.post('/login', login.login);

app.get('/', (req, res)=>{
	res.send('foobar');
});

app.listen(port, ()=>{
	console.log('Server started at port:'+port);
});
