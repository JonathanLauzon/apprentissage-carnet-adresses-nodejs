/*********************************
DÉCLARATION DES VARIABLES GLOBALES
*********************************/
var lesBtnModifier;
var lesBtnSupprimer

/***********************
INITIALISATION DU SCRIPT
***********************/
initialiser();

/********
FONCTIONS
********/


// Fonction d'initialisation (déclaration des objets du DOM et écouteurs d'événement)

function initialiser() {
	/*DÉCLARATION DE VARIABLES D'OBJETS DU DOM*/
	lesBtnModifier = document.querySelectorAll('.case--modifier');
	lesBtnSupprimer = document.querySelectorAll('.case--supprimer');

	/*ÉCOUTEURS D'ÉVÉNEMENTS*/
	document.querySelector('.case--ajouter').addEventListener('click', function(element) {
		var ligne = element.target.parentNode.children;
		ajouterLigne(ligne);
	});

	for (var i = 0; i < lesBtnModifier.length; i++) {
		lesBtnModifier[i].addEventListener('click', function(element) {
			var ligne = element.target.parentNode.children;
			modifierLigne(ligne);
		});
	}

	for (var i = 0; i < lesBtnSupprimer.length; i++) {
		lesBtnSupprimer[i].addEventListener('click', function(element) {
			var ligne = element.target.parentNode.children;
			supprimerLigne(ligne);
		});
	}
}


// Fonctions de requêtes AJAX

function ajouterLigne(laLigne) {
	xhr = new XMLHttpRequest();
	xhr.open('POST', "/ajouter", true);
	data = {
		"nom" : laLigne[0].innerHTML,
		"prenom" : laLigne[1].innerHTML,
		"telephone" : laLigne[2].innerHTML
	}
	sData = JSON.stringify(data);
	xhr.setRequestHeader('Content-type', 'application/json');
	xhr.send(sData);
	xhr.addEventListener("readystatechange", traiterRequete, false);
}

function modifierLigne(laLigne) {
	xhr = new XMLHttpRequest();
	xhr.open('POST', "/modifier", true);
	data = {
		"modification": {
			"nom" : laLigne[0].innerHTML,
			"prenom" : laLigne[1].innerHTML,
			"telephone" : laLigne[2].innerHTML
			},
		"_id" : laLigne[3].innerHTML
	}
	sData = JSON.stringify(data);
	xhr.setRequestHeader('Content-type', 'application/json');
	xhr.send(sData);
	xhr.addEventListener("readystatechange", traiterRequete, false);
}

function supprimerLigne(laLigne) {
	xhr = new XMLHttpRequest();
	xhr.open('POST', "/supprimer", true);
	data = {
		"_id" : laLigne[3].innerHTML
	}
	sData = JSON.stringify(data);
	xhr.setRequestHeader('Content-type', 'application/json');
	xhr.send(sData);
	xhr.addEventListener("readystatechange", traiterRequete, false);
}


// Réception de requêtes AJAX (fonction de routage vers les fonctions de traitement de données ci-dessous)

function traiterRequete(e) {
	console.log("xhr.readyState = " + xhr.readyState);
	console.log("xhr.status = " + xhr.status);
	if(xhr.readyState == 4 && xhr.status == 200) {
		console.log('ajax fonctionne');
		var response = JSON.parse(xhr.responseText);
		console.log(xhr.responseText);
		console.log(response.type);
		switch(response.type) {
			case 'ajout':
				traiterAjout(response.infos.nom, response.infos.prenom, response.infos.telephone, response.infos._id);
				break;
			case 'modification':
				traiterModification(response.infos._id);
				break;
			case 'suppression':
				traiterSuppression(response.infos._id);
				break;
			default:
				console.log('Requête impossible à traiter');
		}
	}
}


// Application des requêtes AJAX envoyées par la fonction de routage traiterRequete

function traiterAjout(leNom, lePrenom, leTelephone, leId) {
	console.log(leNom, lePrenom, leTelephone, leId);
	var rangeeCachee = document.querySelector('.rangee.cachee');
	var nouvelleRangee = rangeeCachee.cloneNode(true);
	nouvelleRangee.classList.remove('cachee');
	nouvelleRangee.querySelector('.case--nom').innerHTML = leNom;
	nouvelleRangee.querySelector('.case--prenom').innerHTML = lePrenom;
	nouvelleRangee.querySelector('.case--telephone').innerHTML = leTelephone;
	nouvelleRangee.querySelector('.case--id').innerHTML = leId;
	var leTableau = document.getElementById('tableau');
	initialiser();
	leTableau.insertBefore(nouvelleRangee, leTableau.children[1]);
	initialiser();
}

function traiterModification(leId) {
	console.log(leId);
	var laRangee;
	if(chercherRangee(leId)) laRangee = chercherRangee(leId);
	var laCouleur = laRangee.style.backgroundColor;
	laRangee.style.backgroundColor = '#55ff68';
	setTimeout(function () {
		laRangee.style.backgroundColor = laCouleur;
    }, 500);
}

function traiterSuppression(leId) {
	console.log(leId);
	if(chercherRangee(leId)) chercherRangee(leId).remove();
}


// Fonctions d'assistance

function chercherRangee(leId) {
	var lesIds = document.querySelectorAll('.case--id');
	for (var i = 0; i < lesIds.length; i++) {
		if(lesIds[i].innerHTML == leId) {
			return lesIds[i].parentNode;
		}
	}
	return false;
}

