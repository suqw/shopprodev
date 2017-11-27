var express = require ("express");
var app = express();

app.use( express.static("shopDev") );

app.listen(4567,function(){
	console.log("server is running..")
});