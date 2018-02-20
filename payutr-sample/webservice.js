const express = require('express');
const bodyParser = require('body-parser');
var moment = require('moment');
var xml2js = require('xml2js');

var payutr = require('../index.js');
payutr.setKeys('OPU_TEST', 'SECRET_KEY'); //-Normal Test
//payutr.setKeys('PALJZXGV', 'f*%J7z6_#|5]s7V4[g3]'); //-3D Secure Test

app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/', express.static(__dirname + '/'));

app.post('/api/makePayment', makePayment);

app.post('/api/paymentResult', paymentResult);

app.post('/api/makeBinRequestV1', makeBINRequestV1);

app.post('/api/makeBinRequestV2', makeBINRequestV2);

app.post('/api/ipnService', ipnService);

app.post('/api/iosRequest', iosRequest);

app.post('/api/irnRequest', irnRequest);

app.post('/api/loyaltyPointsRequest', loyaltyPointsRequest);

app.post('/api/idnRequest', idnRequest);

app.post('/api/ordersRequest', ordersRequest);

app.post('/api/productsRequest', productsRequest);

app.listen(8080);
console.log("runing@http://localhost:8080/")


function makePayment(req, res) {


    var paymentData = req.body.payment;
    paymentData["ORDER_DATE"] = moment().utc().format('YYYY-MM-DD HH:mm:ss').toString();

    var api_response = {
        isSuccess: false,
        result: null
    }

    payutr.makePayment(paymentData, function(error, response, body) {


        xml2js.parseString(body, { explicitArray: false }, function(err, result) {
            if (error) {
                api_response.result = result;
                api_response.result = "response: " + response + "-body: " + body;
                res.send(api_response);
            } else {
                api_response.isSuccess = true;
                api_response.result = result;
                res.send(api_response);
            }
        });
    });
}

function paymentResult(req, res) {
    console.log(req.body);
    var response = req.body;
    if (response.STATUS == 'SUCCESS') {
        if (response.RETURN_CODE == 'AUTHORIZED') {
            res.redirect("/paymentresult?isSuccess=true&ORDER_REF=" + response.ORDER_REF);
            console.log("PAYMENT SUCCESS");
        }
    } else {
        res.redirect("/paymentresult?isSuccess=false");
    }
}

function makeBINRequestV1(req, res) {

    var requestParams = {
        'TIMESTAMP': moment().unix().toString(),
        'BIN': req.body.BIN, //Kredi kartının ilk 6 hanesi.
    }

    payutr.makeBINRequestV1(requestParams, function(error, response, body) {
        //console.log(error);
        //console.log(response);
        console.log(body);
        res.send(body);
    });
}

function makeBINRequestV2(req, res) {

    var requestParams = {
        extraInfo: req.body.extraInfo, //true değer ile gönderilmesi durumunda puan sorgusu yapılmasını sağlayan parametredir.
        dateTime: moment().utc().format('YYYY-MM-DDTHH:mm:ss+00:00').toString(), //ISO_8601 formatında istek aman değeri (Örn: 2017-10-06T06:52:14+00:00 )
        cc_cvv: req.body.cc_cvv, //Sorgusu yapılacak kartın güvenlik kodu
        cc_owner: req.body.cc_owner, //Sorgusu yapılacak kart sahibinin Ad Soyad bilgisi
        exp_year: req.body.exp_year, //Sorgusu yapılacak kartın son kullanma yılı
        exp_month: req.body.exp_month, //Sorgusu yapılacak kartın son kullanma ayı
        cc_number: req.body.cc_number, //Sorgusu yapılacak kartın kart numarası
    }

    payutr.makeBINRequestV2(requestParams, function(error, response, body) {
        //console.log(error);
        //console.log(response);
        console.log(body);
        res.send(body);
    });
}

function ipnService(req, res) {
    //console.log(req);
    var data = req.body;
    console.log("request body:↧↧↧");
    console.log(data);
    console.log("RESONSE:::" + payutr.IPNService(data, moment().utc().format('YYYYMMDDHHmmss').toString()));
    res.send(payutr.IPNService(data, moment().utc().format('YYYYMMDDHHmmss').toString()));
}

function iosRequest(req, res) {
    payutr.makeIOSRequest(req.body, function(error, response, body) {
        //console.log(error);
        //console.log(response);
        console.log(body);
        res.send(body);
    });
}

function irnRequest(req, res) {
    var request = req.body;
    request.IRN_DATE = moment().utc().format('YYYY-MM-DD HH:mm:ss').toString();
    payutr.makeIRNRequest(request, function(error, response, body) {
        //console.log(error);
        //console.log(response);
        console.log(body);
        res.send(body);
    });
}

function loyaltyPointsRequest(req, res) {
    var request = req.body;
    request.DATE = moment().utc().format('YYYY-MM-DD HH:mm:ss').toString();
    payutr.makeLoyaltyPointsRequest(request, function(error, response, body) {
        //console.log(error);
        //console.log(response);
        console.log(body);
        res.send(body);
    });
}

function idnRequest(req, res) {
    var request = req.body;
    request.IDN_DATE = moment().utc().format('YYYY-MM-DD HH:mm:ss').toString();
    payutr.makeIDNRequest(request, function(error, response, body) {
        //console.log(error);
        //console.log(response);
        console.log(body);
        res.send(body);
    });
}


function ordersRequest(req, res) {
    var request = req.body;
    request.timeStamp = moment().unix().toString();
    payutr.makeOrdersRequest(request, function(error, response, body) {
        //console.log(error);
        //console.log(response);
        console.log(body);
        res.send(body);
    });
}

function productsRequest(req, res) {
    var request = req.body;
    request.timeStamp = moment().unix().toString();
    payutr.makeProductsRequest(request, function(error, response, body) {
        //console.log(error);
        //console.log(response);
        console.log(body);
        res.send(body);
    });
}