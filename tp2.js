// Requêtes des modules Node.js essentiels au projet
const express = require('express');
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const app = express();
// Déclaration du moteur de gabarits ejs pour l'application
app.set('view engine', 'ejs');
// Définition des options des modules
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
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
	})
})

// Routage de l'adresse '/' pour l'affichage de la page html du template contenant les informations de la base de données
app.get('/',  (req, res) => {
  console.log('la route get / = ' + req.url);
  var cursor = db.collection('adresse').find().toArray(function(err, resultat){
    if (err) return console.log(err);
    // Appel de la page ejs et distribution des informations de la base de données à celle-ci
    res.render('index.ejs', {liste: resultat});
  });
});

app.get('/trier/:champ/:direction', (req, res) => {
	console.log('la route get /trier/ = '+ req.url);
	console.log('Paramètre 1 :'+req.params.champ);
	console.log('Paramètre 2 :'+req.params.direction);
	var champ = req.params.champ;
	var direction = 1;

	if(req.params.direction == 'desc') direction = -1;

	var ordre_de_tri = {};
	ordre_de_tri[champ] = direction;

	var cursor = db.collection('adresse').find({}, {sort: ordre_de_tri}).toArray(function(err, resultatTri) {
		if(err) {
			res.redirect('/');
			return console.log(err);
		}
		console.log(resultatTri);
		// Retourner une variable chargée avec en paramètre le facteur de tri qui a été employé.
		// Cela servira à identifier s'il faut maintenant inverser l'ordre de tri (géré sur le template)
		var tri = champ;
		if(direction == -1) tri = tri+'-inverse';
		
		res.render('index.ejs', {liste: resultatTri, tri: tri});
	});
});

// Routage de l'adresse '/ajouter' appelée depuis le bouton d'ajout de la page HTML
app.post('/ajouter', function (req, res) {
	// Création d'un document à ajouter à la base de données et récupération des informations de la rangée
	var nouvelleAdresse = {
		nom:req.body.nom,
		prenom:req.body.prenom,
		telephone:req.body.telephone
	};
	console.log('Ajout');
	// Envoi du document à la base de données
	db.collection('adresse').save(nouvelleAdresse, (err, result) => {
		if (err) return console.log(err);
		console.log('Ajouter dans la base de données');
		/*console.log(result);*/

		console.log(req.body.nom);
		res.json({
			type: "ajout",
			infos: {
				nom: req.body.nom,
				prenom: req.body.prenom,
				telephone: req.body.telephone,
				_id: ObjectId(result._id)
			}
		});
	});
});

// Routage de l'adresse 'modifier' appelée depuis le bouton de modification adjacent à la rangée correspondante du tableau
app.post('/modifier', function (req, res) {
	// Préparation d'un document à insérer dans la base de données pour remplacer un document existant
	var adresseModifiee = {
		// Déclaration, en premier lieu, du ID
		_id: ObjectId(req.body._id),
		nom:req.body.modification.nom,
		prenom:req.body.modification.prenom,
		telephone:req.body.modification.telephone
	};
	console.log('Modification');
	// Envoi des informations à un document correspondant à un id spécifique dans la collection
	db.collection('adresse').save(adresseModifiee, (err, result) => {
		if (err) return console.log(err);
		console.log('Modifier l\'id '+req.body._id+' de la base de données');
		res.json({
			type: "modification",
			infos: {
				_id: req.body._id
			}
		});
	})
});

// Routage de l'adresse '/supprimer' appelée depuis le bouton de suppression adjacent à la rangée correspondante du tableau
app.post('/supprimer', function (req, res) {
	console.log('Suppression');
	// Suppression du document correspondant à l'id fourni de la collection
	db.collection('adresse').remove({"_id": ObjectId(req.body._id)}, (err, result) => {
		if (err) return console.log(err);
		console.log('Supprimer l\'id '+req.body._id+' de la base de données');
		res.json({
			type: "suppression",
			infos: {
				_id: req.body._id
			}
		});
	});
});