var bodyParser = require('body-parser')
var express = require("express")
var app = express()
var router = require("./routes/routes")
 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(express.urlencoded()); //Parse URL-encoded bodies

// parse application/json
app.use(bodyParser.json())
// app.use(express.json()); //Used to parse JSON bodies

// app.use(function(req, res, next){
//     var data = "";
//     req.on('data', function(chunk){ data += chunk})
//     req.on('end', function(){
//         req.rawBody = data;
//         req.jsonBody = JSON.parse(data);
//         next();
//     })
//  })

app.use("/",router);

app.listen(8080,() => {
    console.log("Servidor rodando")
});