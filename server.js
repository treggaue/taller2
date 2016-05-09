var express = require('express');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var DataStore = require('nedb');

var port = (process.env.PORT || 10000);

var app = express();

var dbFileName  = path.join(__dirname,'citas.json');
var db = new DataStore({
		filename : dbFileName,
		autoload: true
	});

console.log('DB initialized');

db.find({},function (err,citas){

	if(citas.length == 0){
		console.log('Empty DB, loading initial data');

		cita1 = { 
			descripcion : 'Medico',
			fecha : '12/12/2016',
			lugar : 'Tarifa'
		};

		cita2 = {
			descripcion : 'Examen',
			fecha : '13/05/2016',
			lugar : 'Sevilla'
		};

		db.insert([cita1, cita2]);

	}else{
		console.log('DB has '+citas.length+' citas ');
	}

});

app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json());

app.get('/citas',function(req,res){
	console.log('New GET request');

	db.find({},function (err,citas){
		res.json(citas);
	});
});

app.post('/citas',function(req,res){
	console.log('New POST request');
	console.log(req.body);
	db.insert(req.body);
	res.sendStatus(200);
});

app.get('/citas/:descripcion',function(req,res){
	var n = req.params.descripcion;
	console.log('New GET request for cita with name '+n);

	db.find({ descripcion : n},function (err,citas){
		console.log("Citas obtained: "+citas.length);
		if(citas.length  > 0){
			res.send(citas[0]);
		}else{
			res.sendStatus(404);
		}
	});
});

app.delete('/citas/:descripcion',function(req,res){
	var n = req.params.descripcion;
	console.log('New DELETE request for cita with name '+n);

	db.remove({ descripcion: n},{}, function(err,numRemoved){
		console.log("Citas removed: "+numRemoved);
		if(numRemoved  == 1)
			res.sendStatus(200);
		else
			res.sendStatus(404);
	});
});

app.listen(port);
console.log('Magic is happening on port '+port);
