// Requêtes des modules Node.js essentiels au projet
const express = require('express');
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const app = express();
// Déclaration du moteur de gabarits ejs pour l'application
app.set('view engine', 'ejs');
// Définition des options des modules
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'));
// Création de la base de données du serveur
var db;
// Connexion à la base de données MongoDB installée localement, collection carnet_adresses
MongoClient.connect('mongodb://127.0.0.1:27017/carnet_tp2', (err, database) => {
	if (err) return console.log(err)
	// Récupération de la base de données sur le serveur
	db = database
	app.listen(8081, () => {
		console.log('connexion à la BD et on écoute sur le port 8081');
		console.log(db);
	})
})