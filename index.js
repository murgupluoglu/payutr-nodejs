var request = require('request'),
    cryptoJS = require("crypto-js");


var url_payment = 'https://secure.payu.com.tr/order/alu/v3';

var url_bin_v1 = 'https://secure.payu.com.tr/api/card-info/v1/';

var url_bin_v2 = 'https://secure.payu.com.tr/api/card-info/v2/';

var url_ios = 'https://secure.payu.com.tr/order/ios.php/';

var url_irn = 'https://secure.payu.com.tr/order/irn.php/';

var url_loyaltypoints = 'https://secure.payu.com.tr/api/loyalty-points/check/';

var url_idn = 'https://secure.payu.com.tr/order/idn.php/';

var url_orders = 'https://secure.payu.com.tr/reports/orders';

var url_producsts = 'https://secure.payu.com.tr/reports/products';

module.exports = {

    credentials: {
        'merchantkey': 'YOUR-MERCHANT-KEY',
        'secretkey': 'YOUR-SECRET-KEY' //Üye İşyeri Kontrol Paneli’nde -> Kodlama Anahtarı
    },

    setKeys: function(merchantkey, secretkey) {
        this.credentials.merchantkey = merchantkey;
        this.credentials.secretkey = secretkey;
    },

    order: {
        ORDER_PNAME: "",
        ORDER_PCODE: "",
        ORDER_PINFO: "",
        ORDER_VER: "",
        ORDER_PRICE: "",
        ORDER_VAT: "",
        ORDER_PRICE_TYPE: "",
        ORDER_QTY: "",
    },

    apiresponse: {
        REFNO: "", //İşleme ait PayU referans numarasının bildirildiği parametredir.
        ALIAS: "", //Üye işyerinin kendi tarafında kullanabileceği benzersiz işlem dizesidir.
        STATUS: "", //Alabileceği Değerler: SUCCESS FAILED INPUT_ERROR 
        RETURN_CODE: "", //Alabileceği Değerler: AUTHORIZED 3DS_ENROLLED ALREADY_AUTHORIZED AUTHORIZATION_FAILED INVALID_CUSTOMER_INFO INVALID_PAYMENT_INFO INVALID_ACCOUNT INVALID_PAYMENT_METHOD_CODE INVALID_CURRENCY REQUEST_EXPIRED HASH_MISMATCH WRONG_VERSION INVALID_CC_TOKEN
        RETURN_MESSAGE: "", //RETURN_CODE parametreleri ile dönen değerlerin daha detaylı açıklamasını içeren parametredir.
        DATE: "", //UTC formatında response zaman değerini belirten parametredir.
        URL_3DS: "", //3DS_ENROLLED fonksiyonunun içerisinde işlemi 3D olarak tamamlatabilmek için 3D Secure sayfasına yönlendirmeniz gereken URL'yi dönen parametredir.
        AMOUNT: "", //Toplam işlem tutarını belirten parametredir. Mutlaka sıfırdan büyük olmalıdır.
        CURRENCY: "", //İşlemde kullanılan para birimini belirten parametredir.
        INSTALLMENTS_NO: "", //İşlemde kullanılan kartın, program ismini belirten parametredir (Axess,Bonus vb.).
        CARD_PROGRAM_NAME: "", //İşlemde seçilen taksit sayısını belirten parametredir.
        ORDER_REF: "", // Üye işyeri tarafından request sırasında belirlenen sipariş referans numarasıdır.
        AUTH_CODE: "", //Bankanın otorizasyon işlem numarasıdır.
        RRN: "", //Bankaların iade işlemi için kullandığı işlem numarasıdır.
        HASH: "", //Response sırasında gelen tüm parametreler geldiği sıra ile uzunluğu alınıp, dizine çevirilip aynı algoritma ile hash hesaplaması sonucu elde edilen değerdir. URL_3DS, hash hesaplamasına dahil değildir.
        PROCRETURNCODE: "", //*Zorunlu*Yanıt içerisinde bankaların hata açıklama kodunun iletildiği parametredir.
        ERRORMESSAGE: "", //*Zorunlu*Yanıt içerisinde bankaların hata açıklama mesajının iletildiği parametredir.
        BANK_MERCHANT_ID: "", //*Zorunlu*Yanıt içerisinde işlemin gerçekleştiği Sanal POS’un bankadaki üye işyeri numarasının iletildiği parametredir.
        PAN: "", //*Zorunlu*Yanıt içerisinde işlemin gerçekleştiği kartın numarasının maskeli biçimde iletildiği parametredir.
        EXPYEAR: "", //*Zorunlu*Yanıt içerisinde işlemin gerçekleştiği kartın son kullanma yılının iletildiği parametredir.
        EXPMONTH: "", //*Zorunlu*Yanıt içerisinde işlemin gerçekleştiği kartın son kullanma ayının iletildiği parametredir.
        OID: "", //*Zorunlu*Yanıt içerisinde üye işyerlerinin kendi belirledikleri sipariş numarasının iletildiği parametredir.
        TERMINAL_BANK: "", //*Zorunlu*Yanıt içerisinde işlemin gerçekleştiği Sanal POS bankasının iletildiği parametredir.
        MDSTATUS: "", //*Zorunlu*Yanıt içerisinde 3DS işlem parametrelerinin iletildiği parametrelerdir.
        MDERRORMSG: "",
        TXSTATUS: "",
        XID: "",
        ECI: "",
        CAVV: "",
        TRANSID: "", //*Zorunlu*Yanıt içerisinde banka işlem numarasının iletildiği parametredir.
        CLIENTID: "", //*Zorunlu*Yanıt içerisinde işlemin gerçekleştiği Sanal POS’un bankadaki müşteri numarasının iletildiği parametredir.
        MDSTATUS: "", //*Zorunlu*Yanıt içerisinde 3DS işlem parametrelerinin iletildiği parametrelerdir.
        MDERRORMSG: "",
        TXSTATUS: "",
        XID: "",
        ECI: "",
        CAVV: "",
        TOKEN_HASH: "", //API ile ödeme isteği oluşturulduğu sırada "LU_ENABLE_TOKEN" parametresini "1" veya "true" değeri ile gönderildiğinde işlem yanıtında ve IPN bildiriminde "TOKEN_HASH"" parametresi içerisinde saklanmış kart token değeri yanıt olarak dönmektedir. Bu değeri kendi tarafınızda saklamalısınız.
    },

    makePayment: function(data, callback) {

        var mandatory = false;
        if (this.credentials.merchantkey &&
            data.LANGUAGE && data.ORDER_REF && data.ORDER_DATE && data.PAY_METHOD &&
            data.BILL_FNAME && data.BILL_LNAME && data.BILL_EMAIL && data.BILL_PHONE &&
            data.ORDERS && data.ORDERS[0].ORDER_PNAME && data.ORDERS[0].ORDER_PCODE && data.ORDERS[0].ORDER_PRICE && data.ORDERS[0].ORDER_VAT && data.ORDERS[0].ORDER_PRICE_TYPE && data.ORDERS[0].ORDER_QTY) {

            if (!data.CC_TOKEN) {
                if (data.CC_NUMBER && data.EXP_MONTH && data.EXP_YEAR && data.CC_CVV) {
                    mandatory = true;
                }
            } else {
                mandatory = true;
            }
        }

        if (!mandatory) {
            callback("66", "mandatory fields cannot be empty", "MERCHANT-LANGUAGE-ORDER_REF-ORDER_DATE-PAY_METHOD-CC_NUMBER-EXP_MONTH-EXP_YEAR-CC_CVV-BILL_FNAME-BILL_LNAME-BILL_EMAIL-BILL_PHONE-BILL_COUNTRYCODE\nCC_TOKEN*****OR****\n[ORDER_PNAME-ORDER_PCODE-ORDER_PINFO-ORDER_PRICE-ORDER_VAT-ORDER_PRICE_TYPE-ORDER_QTY]");
            return;
        }

        var queryData = {
            "MERCHANT": this.credentials.merchantkey, //*Zorunlu*İşyerinin ID bilgisidir. Üye İşyeri Kontrol Paneli’nde, hesap ayarları sayfasında bulunmaktadır.
            "LANGUAGE": data.LANGUAGE, //*Zorunlu*İşlemin gerçekleştiği dilin kısa kodu değeri (TR/EN)
            "ORDER_REF": data.ORDER_REF, //*Zorunlu*İşyerinin kendi belirlediği sipariş/işlem numarasıdır. Her başarılı / başarısız işlemde benzersiz bir değer atanmalıdır.
            "ORDER_DATE": data.ORDER_DATE, //*Zorunlu*İşlem/sipariş saati
            "PAY_METHOD": data.PAY_METHOD, //*Zorunlu*Ödeme yöntemini belirtir. Alabileceği değerler; 1.“CCVISAMC” (Kartlı işlemler) 2.“BKM” (BKM Express işlemleri) 3.“UPT” (Ucuz Para Transferi işlemleri) 4.“COMPAY” (Online Havale işlemleri) 5.“WIRE” (Havale/EFT işlemleri)           
            "BACK_REF": data.BACK_REF, //Ödeme işlemi tamamlandıktan sonra kullanıcının yönlendirileceği URL’dir. 3D işlemlerde işleme ait parametreler de BACK_REF URL’e post edilir.
            "PRICES_CURRENCY": data.PRICES_CURRENCY, //İşlemin gerçekleşeceği para birimini belirleyen parametredir (TRY, EUR, USD, GBP). Türk kartlar için dövizli işlem gönderilmemelidir.
            "SELECTED_INSTALLMENTS_NUMBER": data.SELECTED_INSTALLMENTS_NUMBER, //Taksit yapılacaksa taksit bilgisinin belirtildiği parametredir.Vade farkı/komisyon bilgileri Üye işyeri kontrol panelinde “Hesap Yönetimi” > “Finansal Yönetim” adımı altında sunulmaktadır. Bu sayfa aracılığı ile komisyonlar kart hamiline ya da işyerine yansıtılabilmektedir.
            "ORDER_SHIPPING": data.ORDER_SHIPPING, //Teslimat/Kargo ücretinin belirtildiği parametredir. Kullanılan para birimi ürün bilgisindeki PRICES_CURRENCY[]’den alınmaktadır.
            "CLIENT_IP": data.CLIENT_IP, //Kullanıcı IP’sinin belirtildiği parametredir.
            "DISCOUNT": data.DISCOUNT, //Sepet tutarında genel indirim yapılabilmesini sağlayan parametredir.
            "ORDER_TIMEOUT": data.ORDER_TIMEOUT, //Belirli bir süre cevap alınamadığı durumlarda işlemin sonlandırılması için saniye belirtebileceğiniz parametre.

            "CC_NUMBER": data.CC_NUMBER, //*Zorunlu*Kart numarasının belirtildiği parametredir.
            "EXP_MONTH": data.EXP_MONTH, //*Zorunlu*Kartın son kullanım tarihi ay bilgisinin belirtildiği parametredir.
            "EXP_YEAR": data.EXP_YEAR, //*Zorunlu*Kartın son kullanım tarihi yıl bilgisinin belirtildiği parametredir. Dört haneli olarak belirlenmelidir.
            "CC_CVV": data.CC_CVV, //*Zorunlu*Kartın güvenlik kodunu belirtildiği parametredir.
            "CC_OWNER": data.CC_OWNER, //Kart hamilinin isim-soyisim bilgisinin belirtildiği parametredir.
            "CC_TOKEN": data.CC_TOKEN, //Saklanmış Kart ile Ödeme Alma(Token ile Ödeme Alma)
            "CVV": data.CVV, //Eğer tek tıklama modeli ile çalışıyor ve güvenlik için CVV değerini tekrar kart hamiline girdiriyorsanız , CC_CVV parametresini CVV değeri ile gönderebilirsiniz. 
            "LU_ENABLE_TOKEN": data.LU_ENABLE_TOKEN, //API ile ödeme isteği oluşturulduğu sırada "LU_ENABLE_TOKEN" parametresini "1" veya "true" değeri ile gönderildiğinde işlem yanıtında ve IPN bildiriminde "TOKEN_HASH"" parametresi içerisinde saklanmış kart token değeri yanıt olarak dönmektedir. Bu değeri kendi tarafınızda saklamalısınız.

            "BILL_FNAME": data.BILL_FNAME, //*Zorunlu*Fatura düzenlenecek kişinin adı.
            "BILL_LNAME": data.BILL_LNAME, //*Zorunlu*Fatura düzenlenecek kişinin soyadı.
            "BILL_EMAIL": data.BILL_EMAIL, //*Zorunlu*Fatura düzenlenecek kişinin email adresi.
            "BILL_PHONE": data.BILL_PHONE, //*Zorunlu*Fatura düzenlenecek kişinin telefon numarası.
            "BILL_FAX": data.BILL_FAX, //Fatura düzenlenecek kişinin faks numarasının belirtildiği parametredir.
            "BILL_ADDRESS": data.BILL_ADDRESS, //Fatura düzenlenecek kişinin adresinin belirtildiği parametredir.
            "BILL_ADDRESS2": data.BILL_ADDRESS2, //Fatura düzenlenecek kişinin adresinin belirtildiği parametredir. (ikinci satır için)
            "BILL_ZIPCODE": data.BILL_ZIPCODE, //Fatura düzenlenecek kişinin posta kodunun belirtildiği parametredir.
            "BILL_CITY": data.BILL_CITY, //Fatura düzenlenecek kişinin şehir bilgisinin belirtildiği parametredir.
            "BILL_COUNTRYCODE": data.BILL_COUNTRYCODE, //*Zorunlu*Fatura düzenlenecek kişinin iki karakterli ülke kodu. (ISO Alpha-2 formatında)
            "BILL_STATE": data.BILL_STATE, //Fatura düzenlenecek kişinin semt/ilçe bilgisinin belirtildiği parametredir.

            "DELIVERY_FNAME": data.DELIVERY_FNAME, //Teslim edilecek kişinin adı.
            "DELIVERY_LNAME": data.DELIVERY_LNAME, //Teslim edilecek kişinin soyadı.
            "DELIVERY_EMAIL": data.DELIVERY_EMAIL, //Teslim edilecek kişinin email adresi.
            "DELIVERY_PHONE": data.DELIVERY_PHONE, //Teslim edilecek kişinin telefon numarası.
            "DELIVERY_COMPANY": data.DELIVERY_COMPANY, //Teslim edilecek kişinin şirket bilgisi.
            "DELIVERY_ADDRESS": data.DELIVERY_ADDRESS, //Teslim edilecek kişinin adresi.
            "DELIVERY_ADDRESS2": data.DELIVERY_ADDRESS2, //Teslim edilecek kişinin adresi. (ikinci satır için)
            "DELIVERY_ZIPCODE": data.DELIVERY_ZIPCODE, //Teslim edilecek kişinin posta kodu.
            "DELIVERY_CITY": data.DELIVERY_CITY, //Teslim edilecek kişinin şehir bilgisi.
            "DELIVERY_STATE": data.DELIVERY_STATE, //Teslim edilecek kişinin semt/ilçe bilgisi.
            "DELIVERY_COUNTRYCODE": data.DELIVERY_COUNTRYCODE, //Teslim edilecek kişinin iki karakterli ülke kodu. (ISO Alpha-2 formatında).

            "CC_NUMBER_TIME": data.CC_NUMBER_TIME, //Kullanıcının kart numarasını giriş hızının belirtildiği parametredir.
            "CC_OWNER_TIME": data.CC_OWNER_TIME, //Kullanıcının kart üzerindeki ismi giriş hızının belirtildiği parametredir.
            "CLIENT_TIME": data.CLIENT_TIME, //Kullanıcının tarayıcısından YYYY-MM-DD hh:mm;ss formatında alınan zaman bilgisinin belirtildiği parametredir.

            "USE_LOYALTY_POINTS": data.USE_LOYALTY_POINTS, //HTTPSPOST metodu ile gönderilen ALU requesti içerisine, USE_LOYALTY_POINTS =’YES’, parametresi ile ödemede puan kullanılacağı
            "LOYALTY_POINTS_AMOUNT": data.LOYALTY_POINTS_AMOUNT, //LOYALTY_POINTS_AMOUNT parametresinin değeri ile de kullanılacak olan puan miktarını belirtilmesi yeterli olacaktır.
        };


        if ('ORDERS' in data.ORDERS) {

            for (i = 0; i < data.ORDERS.length; i++) {

                var order = data.ORDERS[i];

                queryData["ORDER_PNAME[" + i + "]"] = order.ORDER_PNAME; //*Zorunlu*Minimum 2, maksimum 155 karakterden oluşan ürün isminin gönderildiği parametredir.
                queryData["ORDER_PCODE[" + i + "]"] = order.ORDER_PCODE; //*Zorunlu*Maksimum 50 karakterden oluşan ürün kodunun gönderildiği parametredir.
                queryData["ORDER_PINFO[" + i + "]"] = order.ORDER_PINFO; //Ürün bilgisinin belirtildiği parametredir.
                queryData["ORDER_VER[" + i + "]"] = order.ORDER_VER; //Ürün versiyonunun belirtildiği parametredir.
                queryData["ORDER_PRICE[" + i + "]"] = order.ORDER_PRICE; //*Zorunlu*Ürün fiyatının gönderildiği parametredir. Ondalık simgesi olarak "."(nokta) kullanılmalıdır. ","(virgül) kullanımında hata alınacaktır.
                queryData["ORDER_VAT[" + i + "]"] = order.ORDER_VAT; //*Zorunlu*Üründe uygulanan verginin belirlendiği parametredir 1, 8 veya 18 olarak belirlenmelidir.
                queryData["ORDER_PRICE_TYPE[" + i + "]"] = order.ORDER_PRICE_TYPE; //*Zorunlu*KDV tipinin belirlendiği parametredir. "GROSS" değeri ile gönderilmesi durumunda ürün fiyatına KDV dahil kabul edilecektir. "NET" gönderilmesi durumunda KDV, PayU tarafından ürünün tutarına eklenecektir.
                queryData["ORDER_QTY[" + i + "]"] = order.ORDER_QTY; //*Zorunlu*Ürün adedinin belirlendiği parametredir.
            }
        }




        var hashString = "";

        var ordered = [];

        Object.keys(queryData).sort().forEach(function(key) {
            if (queryData[key]) {
                ordered[key] = queryData[key];
            }
        });

        Object.keys(ordered).forEach(function(key) {
            hashString += getByteLength(ordered[key].toString()) + ordered[key];
        });

        var hash = cryptoJS.HmacMD5(hashString, this.credentials.secretkey);
        ordered.ORDER_HASH = hash.toString(); //*Zorunlu*Sipariş içeriğindeki tüm parametre değerlerinin key'e göre sıralanıp, üye işyeri kodlama anahtarı kullanılarak HMAC MD5 algoritması ile hashlenerek elde edilen değerdir. Hash hesaplaması için Bknz: Hash Hesaplama

        request.post({ url: url_payment, form: ordered },
            function optionalCallback(error, response, body) {
                callback(error, response, body);
            });

    },

    makeBINRequestV1: function(data, callback) {

        var hash = cryptoJS.HmacSHA256((this.credentials.merchantkey + data.TIMESTAMP), this.credentials.secretkey);

        var request_url = url_bin_v1 + data.BIN + "?merchant=" + this.credentials.merchantkey + "&timestamp=" + data.TIMESTAMP + "&signature=" + hash;

        request.get({ url: request_url },
            function optionalCallback(error, response, body) {
                callback(error, response, body);
            });

        var requestParams = {
            MERCHANT: '',
            TIMESTAMP: '', //Milisaniye cinsinden UTC(TR saatine göre 3 saat geri.) zaman damgası.
            SIG: data.SIG, //İstek sırasında gönderilen değerlerin HMAC_SHA256 algoritması ile hash oluşturulan değerdir.
            BIN: '', //Kredi kartının ilk 6 hanesi.
        }

        var responseParams = {
            binType: '', //Sorgulunan kartın Bin Tipinin iletildiği parametredir.(Mastercard,Visa,Troy v.b.)
            binIssuer: '', //Sorgulunan kartın Banka bilgisin iletildiği bankadır. (Akbank, ING Bank v.b.)
            cardType: '', //Sorgulanan kartın tipinin iletildiği parametredir.( Kredi kartı, Debit card )
            country: '', //Sorgulanan kartın ülkesinin iletildiği parametredir.
            program: '', //Sorgulanan kartın bağlılık programı bilgisinin iletildiği paramtredir.( Axes,Bonus v.b.)
            installments: '', //Sorgulanan karta üye işyeri tarafından uygulanabilecek taksit değerlerinin iletildiği parametredir.
        }
    },

    makeBINRequestV2: function(data, callback) {

        var requestParams = {
            merchant: this.credentials.merchantkey,
            extraInfo: data.extraInfo, //true değer ile gönderilmesi durumunda puan sorgusu yapılmasını sağlayan parametredir.
            dateTime: data.dateTime, //ISO_8601 formatında istek aman değeri (Örn: 2017-10-06T06:52:14+00:00 )
            cc_cvv: data.cc_cvv, //Sorgusu yapılacak kartın güvenlik kodu
            cc_owner: data.cc_owner, //Sorgusu yapılacak kart sahibinin Ad Soyad bilgisi
            exp_year: data.exp_year, //Sorgusu yapılacak kartın son kullanma yılı
            exp_month: data.exp_month, //Sorgusu yapılacak kartın son kullanma ayı
            cc_number: data.cc_number, //Sorgusu yapılacak kartın kart numarası
            //signature: data.signature, //İstek sırasında gönderilen değerlerin Key'e göre sıralanıp, başlarına uzunlukları eklendikten sonra HMAC_SHA256 algoritması ile hash oluşturulan değerdir.
        }

        var hashString = "";

        var ordered = [];

        Object.keys(requestParams).sort().forEach(function(key) {
            if (requestParams[key]) {
                ordered[key] = requestParams[key];
            }
        });


        Object.keys(ordered).forEach(function(key) {
            hashString += getByteLength(ordered[key].toString()) + ordered[key];
        });


        var hash = cryptoJS.HmacSHA256(hashString, this.credentials.secretkey);
        ordered.signature = hash.toString();


        request.post({ url: url_bin_v2, form: ordered },
            function optionalCallback(error, response, body) {
                callback(error, response, body);
            });

        var responseParams = {
            cardMask: '', //Sorgulunan kart numarası.
            binNumber: '', // Sorgulunan kartın BIN numarası.
            cardBrand: '', // Sorgulunan kartın Bin Tipinin iletildiği parametredir.(Mastercard, Visa, Troy v.b.)
            issuerBank: '', //  Sorgulunan kartın Banka bilgisin iletildiği bankadır.(Akbank, ING Bank v.b.)
            cardType: '', //  Sorgulanan kartın tipinin iletildiği parametredir.(Kredi kartı, Debit card)
            issuerCountry: '', //  Sorgulanan kartın ülkesinin iletildiği parametredir.
            cardProgram: '', //  Sorgulanan kartın bağlılık programı bilgisinin iletildiği paramtredir.(Axes, Bonus v.b.)
            installmentOptions: '', //  Sorgulanan karta üye işyeri tarafından uygulanabilecek taksit değerlerinin iletildiği parametredir.
            installmentNumber: '', //  Sorgulanan karta üye işyeri tarafından uygulanabilecek taksit sayısının iletildiği parametredir.
            installmentAditionalCostPercent: '', //  Sorgulanan karta üye işyeri tarafından uygulanabilecek taksit sayısının komisyon bilgisinin iletildiği parametredir.
            loyaltyPoints: '', //  Sorgulanan kartın puan değerinin iletildiği parametredir.
            type: '', //  Kullanılabilir puan tipi
            number: '', //  Kullanılabilir puan adedi
            moneyValue: '', //  Kullanılabilir puanın para birimi cinsinden değeri
            amount: '', //  Kullanılabilir puanın para birimi cinsinden tutarı
            currency: '', //  Kullanılabilir puanın para birimi
        }
    },

    IPNService: function(data, date) {

        var IPN_PID = data.IPN_PID[0];
        var IPN_PNAME = data.IPN_PNAME[0];
        var IPN_DATE = data.IPN_DATE;

        var hashString = "";

        hashString += getByteLength(IPN_PID.toString()) + IPN_PID;
        hashString += getByteLength(IPN_PNAME.toString()) + IPN_PNAME;
        hashString += getByteLength(IPN_DATE.toString()) + IPN_DATE;
        hashString += getByteLength(date.toString()) + date;


        var hash = cryptoJS.HmacMD5(hashString, this.credentials.secretkey);

        return "<EPAYMENT>" + date + "|" + hash + "</EPAYMENT>";


        var responseParams = {
            SALEDATE: '', //    Satış işleminin başlangıçının iletildiği parametredir
            PAYMENTDATE: '', //    Satış zamanının iletildiği parametredir
            REFNO: '', // PayU referans numarasının iletildiği parametredir.
            REFNOEXT: '', // : '', //  Üye iş yeri sipariş numarasının iletildiği parametredir.
            ORDERNO: '', // PayU tarafındaki sipariş sıra numarasının iletildiği parametredir.
            ORDERSTATUS: '', //   Sipariş durumunun iletildiği parametredir. PAYMENT_AUTHORIZED – Otorizasyon alındığını ileten durum mesajıdır. PAYMENT_RECEIVED – Wire ödeme alındığını ileten durum mesajıdır. COMPLETE – Tamamlanmış işlemlerde iletilen durum mesajıdır.
            PAYMETHOD: '', // Maksimum 40 karakter ile ödeme yönteminin iletildiği parametredir.
            PAYMETHOD_CODE: '', // Ödeme yöntemi kodunun iletildiği parametredir.
            FIRSTNAME: '', //  Fatura Ad bilgisinin iletildiği parametredir (Maksimum 40 Karakter)
            LASTNAME: '', //  Fatura Soyad bilgisinin iletildiği parametredir (Maksimum 40 Karakter)
            IDENTITY_NO: '', //Vatandaşlık / Vergi bilgisinin iletildiği parametredir.
            IDENTITY_ISSUER: '', // Vatandaşlık  / Vergi belge sağlayıcısının tipinin iletildiği parametredir.
            CARD_TYPE: '', // Kart Tipinin iletildiği parametredir.
            IDENTITY_CNP: '', // Vatandaşlık / Vergi belgesinin tipinin iletildiği parametredir.
            COMPANY: '', // Fatura Firma bilgisinin iletildiği parametredir.
            REGISTRATIONNUMBER: '', // Vergi numarasının iletildiği parametredir.
            FISCALCODE: '', // Mali Kodun iletildiği parametredir
            CBANKNAME: '', // Banka isminin iletildiği parametredir.
            CBANKACCOUNT: '', // Banka hesap bilgisinin iletildiği parametredir.
            ADDRESS1: '', // Fatura Adres Bilgisinin iletildiği parametredir.
            ADDRESS2: '', // Adres Bilgisinin ikinci satırnının iletildiği parametredir.
            CITY: '', // İl bilgisinin iletildiği parametredir.
            STATE: '', // İlçe / Semt bilgisinin iletildiği parametredir.
            ZIPCODE: '', // Posta kodunun iletildiği parametredir.
            COUNTRY: '', // Ülke bilgisinin iletildiği parametredir.
            COUNTRY: '', //_CODE Ülke kodunun iletildiği parametredir.
            PHONE: '', // Telefon numarasının iletildiği parametredir.
            FAX: '', // Fax numarasının iletildiği parametredir.
            CUSTOMEREMAIL: '', // Mail bilgisinin iletildiği parametredir.
            FIRSTNAME_D: '', // Teslimat Ad bilgisinin iletildiği parametredir.
            LASTNAME_D: '', // Teslimat Soyad bilgisinin iletildiği parametredir.
            COMPANY_D: '', // Teslimat Firma bilgisinin iletildiği parametredir.
            ADDRESS1_D: '', // Teslimat Adres bilgisinin iletildiği parametredir.
            ADDRESS2_D: '', // Teslimat Adres bilgisinin ikinci satırının iletildiği parametredir.
            CITY_D: '', // Teslimat Şehir bilgisinin iletildiği parametredir.
            STATE_D: '', // Teslimat İlçe / Semt bilgisinin iletildiği parametredir.
            ZIPCODE_D: '', // Teslimat Posta kodu bilgisinin iletildiği parametredir.
            COUNTRY_D: '', // Teslimat Ülke bilgisinin iletildiği parametredir.
            COUNTRY_D_CODE: '', // Teslimat Ülke kodunun iletildiği parametredir.
            PHONE_D: '', // Teslimat Telefon numara bilgisinin iletildiği parametredir.
            EMAIL_D: '', // Teslimat Mail bilgisinin iletildiği parametredir.
            IPADDRESS: '', // Kullanıcı IP adresinin iletildiği parametredir.
            IPCOUNTRY: '', // Kullanıcı IP adresinin ülke bilgisinin iletildiği parametredir.
            COMPLETE_DATE: '', // Sipariş tamamlanma zamanının bilgisinin iletildiği parametredir.
            CURRENCY: '', // Para birimin iletildiği parametredir.
            LANGUAGE: '', // İşlem dilinin iletildiği parametredir.
            IPN_PID: '', // Ürün ID 'sinin iletildiği parametredir.
            IPN_PNAME: '', // Ürün isminin iletildiği parametredir.
            IPN_PCODE: '', // Ürün kodunun iletildiği parametredir.
            IPN_INFO: '', // Ürün açıklamasının iletildiği parametredir.
            IPN_QTY: '', // Ürün adedinin iletildiği parametredir.
            IPN_PRICE: '', // Ürün adet fiyatının iletildiği parametredir.
            IPN_VAT: '', // Ürün vergi fiyatının iletildiği parametredir.
            IPN_VER: '', // Ürün versiyon bilgisinin iletildiği parametredir.
            IPN_DISCOUNT: '', // Toplam indirim tutarının iletildiği parametredir.
            IPN_PROMONAME: '', // Promosyon isminin iletildiği parametredir.
            IPN_PROMOCODE: '', // Promosyon kodunun iletildiği parametredir.
            IPN_ORDER_COSTS: '', // Sipariş masraflarının iletildiği parametredir.
            IPN_DELIVEREDCODES: '', // Teslimat kodlarının iletildiği parametredir.
            IPN_DOWNLOAD_LINK: '', // Sanal ürün indirme linkinin iletildiği parametredir.
            IPN_TOTAL: '', // Ara toplam ücretinin iletildiği parametredir.
            IPN_TOTALGENERAL: '', // Toplam ücretin iletildiği parametredir.
            IPN_SHIPPING: '', // Kargo ücretinin iletildiği parametredir.
            IPN_COMMISSION: '', // Komisyon ücretinin iletildiği parametredir.
            IPN_DATE: '', // IPN teslimat zaman bilgisinin iletildiği parametredir.
            IPN_PAID_AMOUNT: '', // Ödenmiş tutar bilgisinin iletildiği parametredir.
            IPN_INSTALLMENTS_PROGRAM: '', // Kart program bilgisinin iletildiği parametredir.
            IPN_INSTALLMENTS_NUMBER: '', // Taksit bilgisinin iletildiği parametredir.
            IPN_INSTALLMENTS_PROFIT: '', // Taksit komisyon ücret bilgisinin iletildiği parametredir.
            AUTH_CODE: '', // Otorizasyon kodunun iletildiği parametredir.
            BANK_MERCHANT_ID: '', // İşlemin gerçekleştiği sanal pos ID 'sinin iletildiği parametredir.
            BANK_RRN: '', // İade işlem numarasının iletildiği parametredir.
            CARD_BIN: '', // İşlemde kullanılan kart BIN bilgisinin iletildiği parametredir.
            CARD_HOLDER_NAME: '', // Kart sahibinin Ad Soyad bilgisinin iletildiği parametredir.
            CARD_MASK: '', // Kartın maskeli halinin iletildiği parametredir.
            ISSUING_BANK: '', // Kart bankasının iletildiği parametredir.
            NUMBER_OF_INSTALLMENTS: '', // Taksit bilgisinin iletildiği parametredir.
            TERMINAL_BANK: '', // İşlemin gerçekleştiği banka posunun iletildiği parametredir.
            HASH: '', // PayU tarafından gönderilen salt IPN bildirimi için hesaplanan Hash bilgisidir.
        }
    },

    makeIOSRequest: function(data, callback) {

        var REFNOEXT = data.REFNOEXT;

        var hashString = "";

        hashString += getByteLength(this.credentials.merchantkey.toString()) + this.credentials.merchantkey;
        hashString += getByteLength(REFNOEXT.toString()) + REFNOEXT;

        var hash = cryptoJS.HmacMD5(hashString, this.credentials.secretkey);

        var requestParams = {
            MERCHANT: this.credentials.merchantkey,
            SECRET_KEY: this.credentials.secretkey,
            REFNOEXT: REFNOEXT, //İşyerinin kendi belirlediği sipariş/işlem numarasınnın iletildiği parametredir.
            HASH: hash.toString(),
        };

        request.post({ url: url_ios, form: requestParams },
            function optionalCallback(error, response, body) {
                callback(error, response, body);
            });


        var responseParams = {
            ORDER_DATE: '', //İşlem yapılan zaman bilgisinin iletildiği parametredir.
            REFNO: '', //İşlemin PayU referans numarasının iletildiği parametredir.
            REFNOEXT: '', //İşyerinin kendi belirlediği sipariş/işlem numarasınnın iletildiği parametredir.
            PAYMETHOD: '', //İşleminde kullanılan ödeme yönteminin iletildiği parametredir.
            ORDER_STATUS: '', //Siparişin anlık durumunun iletildiği parametredir. Dönen değerler dokümanın aşağısında detaylı olarak iletilmiştir.
            ORDER_HASH: '', //Sorgu sırasında elde edilen HASH değerinin iletildiği parametredir.
        }

        var responseStatus = {
            NOT_FOUND: '', //Sorgulanan Değerler ile işlem bulunamadığında karşılaşılan durum mesajıdır.
            CARD_NOTAUTHORIZED: '', //Kullanılan kart ile otorizasyon alınamadığında karşılaşılan durum mesajıdır.
            IN_PROGRESS: '', //İşlem incele aşamasında olduğunda karşılaşılan durum mesajıdır
            PAYMENT_AUTHORIZED: '', //İşlemin otorizasyonunun başarı ile yapıldığında karşılaşılan durum mesajıdır.
            COMPLETE: '', //İşlem başarı ile tamamlandığında karşılaşılan durum mesajıdır.
            FRAUD: '', //İşlem fraud olarak değerlendirildiğinde karşılaşılan durum mesajıdır.
            INVALID: '', //Müşteri tarafından geçersiz bilgi girildiği için onaylanmayan siparişlerde karşılaşılan durum mesajıdır.
            REVERSED: '', //İşlem iptal edildiğinde karşılaşılan durum mesajıdır.
            REFUND: '', //İşlem iade edildiğinde karşılaşılan durum mesajıdır.
        }
    },

    makeIRNRequest: function(data, callback) {

        var requestParams = {
            MERCHANT: this.credentials.merchantkey, // İşyerini ID bilgisidir.Üye İşyeri Kontrol Paneli’ nde,hesap ayarları sayfasında bulunmaktadır.
            ORDER_REF: data.ORDER_REF, // İptal / İade işlemi yapılacak siparişin PayU referans numarasının gönderildiği parametredir.
            ORDER_AMOUNT: data.ORDER_AMOUNT, // İşlemin toplam tutarının gönderildiği parametredir.
            ORDER_CURRENCY: data.ORDER_CURRENCY, // İşlemin gerçekleştiği para biriminin gönderildiği parametredir.
            IRN_DATE: data.IRN_DATE, // İade / İptal isteğinin gönderildiği zamanın gönderildiği parametredir.(Y - m - d H: i: s(Örn: 2017 - 01 - 26 14: 30: 56) 
            //ORDER_HASH: '', // İstek sırasında gönderilen değerlerin Key 'e göre sıralanıp, başlarına uzunlukları eklendikten sonra HMAC_MD5 algoritması ile hash oluşturulan değerdir.
            AMOUNT: data.AMOUNT, // İade yapılacak tutarın belirtildiği parametredir.
        };


        var hashString = "";

        Object.keys(requestParams).forEach(function(key) {
            hashString += getByteLength(requestParams[key].toString()) + requestParams[key];
        });


        var hash = cryptoJS.HmacMD5(hashString, this.credentials.secretkey);
        requestParams.ORDER_HASH = hash.toString();

        request.post({ url: url_irn, form: requestParams },
            function optionalCallback(error, response, body) {
                callback(error, response, body);
            });


        var responseParams = {
            ORDER_REF: '', // İptal / İade işlemi yapılacak siparişin PayU referans numarasıdır.
            RESPONSE_CODE: '', // İstek yanıtının döndüğü kod değeridir.
            RESPONSE_MSG: '', // İstek yanıt mesajıdır.
            IRN_DATE: '', // İptal / İade işlem isteğinin gönderildiği zamana ait bilgiyi ileten parametredir.
            ORDER_HASH: '', // İstek sırasında gönderilen değerlerin Key 'e göre sıralanıp, başlarına uzunlukları eklendikten sonra HMAC_MD5 algoritması ile hash oluşturulan değerdir. Yanıtta bulunan değer PayU tarafından hesaplanmaktadır.
        }
    },

    makeLoyaltyPointsRequest: function(data, callback) {

        var requestParams = {
            MERCHANT: this.credentials.merchantkey, //Üye iş yeri entegrasyon ismi.
            CURRENCY: data.CURRENCY, // Para birimi
            DATE: data.DATE, //UTC/GMT formatı ile ayarlanmalı ve Türkiye saatine göre 3 saat geri olacak şekilde gönderilmelidir. YYYY-MM-DD HH:MM:SS
            CC_CVV: data.CC_CVV, //Sorgusu yapılacak kartın güvenlik kodu
            CC_OWNER: data.CC_OWNER, //Sorgusu yapılacak kart sahibinin Ad Soyad bilgisi
            EXP_YEAR: data.EXP_YEAR, //Sorgusu yapılacak kartın son kullanma yılı
            EXP_MONTH: data.EXP_MONTH, //Sorgusu yapılacak kartın son kullanma ayı
            CC_NUMBER: data.CC_NUMBER, //Sorgusu yapılacak kartın kart numarası
            //HASH: '', //İstek sırasında gönderilen değerlerin Key'e göre sıralanıp, başlarına uzunlukları eklendikten sonra HMAC_MD5 algoritması ile hash oluşturulan değerdir.
            TOKEN: data.TOKEN, //Sorgusu yapılacak kartın token değeri
        };

        var hashString = "";

        var ordered = [];

        Object.keys(requestParams).sort().forEach(function(key) {
            if (requestParams[key]) {
                ordered[key] = requestParams[key];
            }
        });


        Object.keys(ordered).forEach(function(key) {
            hashString += getByteLength(ordered[key].toString()) + ordered[key];
        });


        var hash = cryptoJS.HmacMD5(hashString, this.credentials.secretkey);
        ordered.HASH = hash.toString();


        request.post({ url: url_loyaltypoints, form: ordered },
            function optionalCallback(error, response, body) {
                callback(error, response, body);
            });


        var responseParams = {
            STATUS: '', //Sorgu sonuç statüsü.
            MESSAGE: '', //Sorgu sonuç statü mesajı.
            POINTS: '', //Kullanılabilir puan bilgisi.
            AMOUNT: '', //Kullanılabilir puanın para cinsinden değeri.
            CURRENCY: '', //Kullanılabilir puanın para birimi.
            BANK: '', //Kart banka bilgisi.
            CARD_PROGRAM_NAME: '', //Kartın bağlılık program bilgisi.
            DATE: '', //Sorgu yanıt tarih bilgisi.
            HASH: '', //Sorgu yanıtlarının hash değeri.
        }
    },

    makeIDNRequest: function(data, callback) {

        var requestParams = {
            MERCHANT: this.credentials.merchantkey, //Üye işyeri ID bilgisi.
            ORDER_REF: data.ORDER_REF, //Satışa çevirilecek işlemin PayU referans numarası.
            ORDER_AMOUNT: data.ORDER_AMOUNT, //Satışa çevirilecek işlemin toplam tutarı.
            ORDER_CURRENCY: data.ORDER_CURRENCY, //Satışa çevirilecek işlemin para birimi.
            IDN_DATE: data.IDN_DATE, //UTC/GMT formatı ile ayarlanmalı ve Türkiye saatine göre 3 saat geri olacak şekilde gönderilmelidir. YYYY-MM-DD HH:MM:SS"
            CHARGE_AMOUNT: data.CHARGE_AMOUNT, //Satışa çevirilecek tutar.(Zorunlu değildir, gönderilmez ise toplam tutar satışa çevirilir.)
            //ORDER_HASH: data.ORDER_HASH, //İstek sırasında gönderilen değerlerin Key'e göre sıralanıp, başlarına uzunlukları eklendikten sonra HMAC_MD5 algoritması ile hash oluşturulan değerdir.
            REF_URL: data.REF_URL, //İstek yanıtı belirtilen URL'e GET metodu ile dönmektedir.(Zorunlu değildir, gönderilmez ise anında response'u post sonrası anlık alabilirsiniz.)
        };


        var hashString = "";

        var ordered = [];

        Object.keys(requestParams).forEach(function(key) {
            if (requestParams[key]) {
                ordered[key] = requestParams[key];
            }
        });


        Object.keys(ordered).forEach(function(key) {
            hashString += getByteLength(ordered[key].toString()) + ordered[key];
        });


        var hash = cryptoJS.HmacMD5(hashString, this.credentials.secretkey);
        ordered.ORDER_HASH = hash.toString();

        request.post({ url: url_idn, form: ordered },
            function optionalCallback(error, response, body) {
                callback(error, response, body);
            });


        var responseParams = {
            ORDER_REF: '', //İstek gönderilen işlemin PayU referans numarası.
            RESPONSE_CODE: '', //İstek Sonuç Kodu.
            RESPONSE_MSG: '', //İstek Sonuç Mesajı.
            IDN_DATE: '', //Y-m-d H:i:s formatında yanıt zaman değeri.
            ORDER_HASH: '', //İstek sonucu yanıt değerlerinin hash bilgisi.
        }

        var responseCode = {
            "1": '', //Confirmed Başarılı istek sonucu.
            "2": '', //ORDER_REF missing or incorrect Hatalı veya eksik ORDER_REF gönderimi.
            "3": '', //ORDER_AMOUNT missing or incorrect Hatalı veya eksik ORDER_AMOUNT gönderimi.
            "4": '', //ORDER_CURRENCY is missing or incorrect Hatalı veya eksik ORDER_CURRENCY gönderimi.
            "5": '', //IDN_DATE is not in the correct format Hatalı veya eksik IDN_DATE gönderimi.
            "6": '', //Error confirming order İstek işlenirken bir hata oluştu,PayU destek ekibi ile iletişime geçiniz.
            "7": '', //Order already confirmed İşlem daha önce konfirme edilmiş.
            "8": '', //Unknown error İstek işlenirken bir hata oluştu,PayU destek ekibi ile iletişime geçiniz.
            "9": '', //Invalid ORDER_REF Hatalı veya eksik ORDER_REF gönderimi.
            "10": '', //Invalid ORDER_AMOUNT Hatalı veya eksik ORDER_AMOUNT gönderimi.
            "11": '', //Invalid ORDER_CURRENCY Hatalı veya eksik ORDER_CURRENCY gönderimi.
            "12": '', //Invalid CHARGE_AMOUNT Hatalı veya eksik CHARGE_AMOUNT gönderimi.
            "13": '', //Invalid signature ORDER_HASH hatalı hesaplanmış.
        }
    },

    makeOrdersRequest: function(data, callback) {

        var requestParams = {
            merchant: this.credentials.merchantkey, //Üye iş yeri entegrasyon ismi.
            startDate: data.startDate, //Rapor başlangıç tarihi.
            endDate: data.endDate, //Rapor bitiş tarihi.
            timeStamp: data.timeStamp, //Unix timestamp(UTC / GMT 0).
            //signature: '', //İstek sırasında gönderilen değerlerin belirtildiği sırada, başlarına: '', //uzunlukları eklendikten sonra HMAC_MD5 algoritması ile hash oluşturulan değerdir.
            externalRefNo: data.externalRefNo //Siparişin sizin tarafından belirlenmiş sipariş numarası.
        };


        var hashString = "";

        var ordered = [];

        Object.keys(requestParams).forEach(function(key) {
            if (requestParams[key]) {
                ordered[key] = requestParams[key];
            }
        });


        Object.keys(ordered).forEach(function(key) {
            hashString += getByteLength(ordered[key].toString()) + ordered[key];
        });


        var hash = cryptoJS.HmacMD5(hashString, this.credentials.secretkey);
        ordered.signature = hash.toString();

        console.log(ordered);

        request.post({ url: url_orders, qs: ordered },
            function optionalCallback(error, response, body) {
                callback(error, response, body);
            });


        var responseParams = {
            statusCode: '', //Rapor yanıt statü kodu
            statusDescription: '', //Rapor yanıt mesajı
            data: '', //Siparişin tüm detayları
        }
    },

    makeProductsRequest: function(data, callback) {

        var requestParams = {
            merchant: this.credentials.merchantkey, //Üye iş yeri entegrasyon ismi.
            startDate: data.startDate, //Rapor başlangıç tarihi.
            endDate: data.endDate, //Rapor bitiş tarihi.
            timeStamp: data.timeStamp, //Unix timestamp(UTC / GMT 0).
            //signature: '', //İstek sırasında gönderilen değerlerin belirtildiği sırada, başlarına: '', //uzunlukları eklendikten sonra HMAC_MD5 algoritması ile hash oluşturulan değerdir.
            externalRefNo: data.externalRefNo //Siparişin sizin tarafından belirlenmiş sipariş numarası.
        };


        var hashString = "";

        var ordered = [];

        Object.keys(requestParams).forEach(function(key) {
            if (requestParams[key]) {
                ordered[key] = requestParams[key];
            }
        });


        Object.keys(ordered).forEach(function(key) {
            hashString += getByteLength(ordered[key].toString()) + ordered[key];
        });


        var hash = cryptoJS.HmacMD5(hashString, this.credentials.secretkey);
        ordered.signature = hash.toString();

        console.log(ordered);

        request.post({ url: url_producsts, qs: ordered },
            function optionalCallback(error, response, body) {
                callback(error, response, body);
            });


        var responseParams = {
            statusCode: '', //Rapor yanıt statü kodu
            statusDescription: '', //Rapor yanıt mesajı
            data: '', //Siparişin tüm detayları
        }
    }

};

function getByteLength(string) {
  if (typeof string !== "string") {
    throw new Error("Input must be string");
  }
  return Buffer.byteLength(string, "utf8");
}