const url = require('url');
const queryString = require('query-string');
const math = require('mathjs');

function getQueryStringParams(url) {
    if (url.indexOf('?') > -1) {
        let query = url.substring(url.indexOf('?'), url.length);
        const parsed = queryString.parse(query);
        return parsed;
    }
    return null;
}
function detectErrors(res, params) {
    let allParams = {x:undefined, 
                    y:undefined, 
                    n:undefined};
    let result;
    //savoir quel est l'opérateur et parse les variables 
    if (params["op"]=='+'||params["op"]=='-'||params["op"]=='/'||params["op"]=='*'||params["op"]=='%'){
        if (Object.keys(params).length > 3){
            result = {"error":"too many parameters, expecting: op, x, y"};
            sendResFailure(result, res);
        }
        if (parseInt(params["x"]))
            allParams["x"] = parseInt(params["x"]);  
        else if(!params["x"]){
            result = [{"x":"missing"},{"y":params["y"]},{"error":"parameter x is missing"}];
            sendResFailure(result, res);
        }
        else{
            result = [{"x":params["x"]},{"y":params["y"]},{"error":"x is not a number"}];
            sendResFailure(result, res);
        }

        if (parseInt(params["y"]))
            allParams["y"] = parseInt(params["y"]);
        else if(!params["y"]){
            result = [{"x":params["x"]},{"y":"missing"},{"error":"parameter y is missing"}];
            sendResFailure(result, res);
        }
        else{
            result = [{"x":params["x"]},{"y":params["y"]},{"error":"y is not a number"}];
            sendResFailure(result, res);
        }
    }
    else if (params["op"]=='!'||params["op"]=='p'||params["op"]=='np'){
        if (Object.keys(params).length > 2){
            result = {"error":"too many parameters, expecting: op, n"};
            sendResFailure(result, res);
        }
        if (parseInt(params["n"]))
            allParams["n"] = parseInt(params["n"]); 
        else if(!params["n"]){
            result = [{"n":params["n"]},{"error":"parameter is missing"}];
            sendResFailure(result, res);
        }    
        else{
            result = [{"n":params["n"]},{"error":"n is not a number"}];
            sendResFailure(result, res);
        }
    }
    else{
        result = {"error":"non-existing operation"}
        sendResFailure(result, res);
    }
    return allParams;
}
function sendResSuccess (result, res){
    res.statusCode = 200;
    res.setHeader('content-Type', 'Application/json');
    res.end(JSON.stringify(result));
}
function sendResFailure(result, res){
    res.statusCode = 400;
    res.setHeader('content-Type', 'Application/json');
    res.end(JSON.stringify(result));
}
function addition(res, x, y) {
    let result = [{"x":x},{"y":y},{"value":x + y}];
    sendResSuccess(result, res);
}
function substraction(res, x, y) {
    let result = [{"x":x},{"y":y},{"value":x - y}];
    sendResSuccess(result, res); 
}
function division(res, x, y){
    let result = [{"x":x},{"y":y},{"value":x / y}];
    sendResSuccess(result, res);
}
function multiplication(res, x, y){
    let result = [{"x":x},{"y":y},{"value":x * y}];
    sendResSuccess(result, res);
}
function modulo(res, x, y){
    let result = [{"x":x},{"y":y},{"value":x % y}];
    sendResSuccess(result, res);
}
function factorial(res, n){
    let result = 1;
    for(var i = n; i >= 1; i--){
        result = result * i;
    }
    let message = [{"n":n},{"value":result}];
    sendResSuccess(message, res);
}
function isPrime(res, n){
    let result = n > 1; 
    for(var i = 2; i < n; i++)
        if(n % i === 0){
            result=false; 
            break;
        }  
    let message = [{"n":n},{"value":result}];
    sendResSuccess(message, res);
}
//Source: https://www.tutorialspoint.com/finding-the-nth-prime-number-in-javascript
function findPrime(res, num) {
    let i, primes = [2, 3], n = 5;
    const isPrime = n => {
        let i = 1, p = primes[i],
        limit = Math.ceil(Math.sqrt(n));
        while (p <= limit) {
           if (n % p === 0) {
              return false;
           }
           i += 1;
           p = primes[i];
        }
        return true;
    }
    for (i = 2; i <= num; i += 1) {
       while (!isPrime(n)) {
          n += 2;
       }
       primes.push(n);
       n += 2;
    };
    let result = [{"n":num},{"value":primes[num - 1]}];
    sendResSuccess(result, res);
}
exports.basicFuncs = function (req, res) {
    let params = getQueryStringParams(req.url);
    //prend en charge un espace comme char '+'
    if (params["op"] != undefined & params["op"] == ' '){
        params["op"] = '+'; 
        req.url = req.url.replace("op=%20", "op=+");
    }
    let checkedParams = detectErrors(res, params);
    var x = checkedParams["x"];
    var y = checkedParams["y"];
    var n = checkedParams["n"];
    switch (req.url) {
        case `/api/maths?op=+&x=${x}&y=${y}`:
            addition(res, x, y);
            break;
        case `/api/maths?op=-&x=${x}&y=${y}`:
            substraction(res, x, y);
            break;
        case `/api/maths?op=/&x=${x}&y=${y}`:
            division(res, x, y);
            break;
        case `/api/maths?op=*&x=${x}&y=${y}`:
            multiplication(res, x, y);
            break;
        case `/api/maths?op=%&x=${x}&y=${y}`:
            modulo(res, x, y);
            break;
        case `/api/maths?op=!&n=${n}`:
            factorial(res, n);
            break;
        case `/api/maths?op=p&n=${n}`:
            isPrime(res, n);
            break;
        case `/api/maths?op=np&n=${n}`:
            findPrime(res, n);
            break;
    }
}