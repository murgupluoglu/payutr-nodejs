# [PayU Turkey: Node.js Client](https://npmjs.com/package/payutr)

[PayU Turkey Official Documentation](https://payuturkiye.github.io/PayU-Turkiye-Entegrasyon-Dokumani/#baslamadan-once)


## For test payment 

```
payutr.setKeys('OPU_TEST', 'SECRET_KEY'); -> Use this one for without 3D Secure

payutr.setKeys('PALJZXGV', 'f*%J7z6_#|5]s7V4[g3]'); -> This for 3D Secure

```


## Used Libraries

[Request](https://github.com/request/request)

[crypto-js](https://github.com/brix/crypto-js)


## Run Sample

Go to project folder and
```shell
npm install 

cd payutr-sample

npm install

npm start
```
Open browser and visit http://localhost:8080/


## Usage 

```shell
npm install payutr --save
```

```javascript
var payutr = require('payutr');

payutr.setKeys('MERCHANT_KEY', 'SECRET_KEY');

var paymentData = req.body.payment;
paymentData["ORDER_DATE"] = "2018-02-20 13:50:00";

var api_response = {
	isSuccess: false,
	result: null
 }

payutr.makePayment(paymentData, function(error, response, body) {
	xml2js.parseString(body, { explicitArray: false }, function(err, result) {
		console.log(result);
	});
});
```