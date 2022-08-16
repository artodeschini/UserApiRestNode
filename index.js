const bodyParser = require('body-parser');
const express = require("express");
const app = express();
const router = require("./routes/routes");
const cors = require('cors');

 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(express.urlencoded()); //Parse URL-encoded bodies

// cors
app.use(cors());

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

app.listen(8888,() => {
    console.log("Servidor rodando")
});