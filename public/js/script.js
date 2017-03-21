// Déclaration des variables d'objets du DOM
var lesTrieurs = document.querySelectorAll('.trier');
var lesBtnModifier = document.querySelectorAll('.case--modifier');
var lesBtnSupprimer = document.querySelectorAll('.case--supprimer');

// Déclaration des écouteurs d'événements
for (var i = 0; i < lesTrieurs.length; i++) {
	lesTrieurs[i].addEventListener('click', function(element) {
		if(lesTrieurs[i].getAttribute('data-tri')) {
			console.log('Il y a un tri : '+lesTrieurs[i].getAttribute('data-tri'));
			gererTri(lesTrieurs[i].getAttribute('data-tri'));
		}
	});
}

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


function ajouterLigne(laLigne) {
	xhr = new XMLHttpRequest();
	xhr.open('POST', "ajouter", true);
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
	xhr.open('POST', "modifier", true);
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
	xhr.open('POST', "supprimer", true);
	data = {
		"_id" : laLigne[3].innerHTML
	}
	sData = JSON.stringify(data);
	xhr.setRequestHeader('Content-type', 'application/json');
	xhr.send(sData);
	xhr.addEventListener("readystatechange", traiterRequete, false);
}

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
	leTableau.insertBefore(nouvelleRangee, leTableau.childNodes[2]);
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

function chercherRangee(leId) {
	var lesIds = document.querySelectorAll('.case--id');
	console.log(lesIds.length);
	for (var i = 0; i < lesIds.length; i++) {
		if(lesIds[i].innerHTML == leId) {
			console.log('Élément repéré à l\'id '+i);
			return lesIds[i].parentNode;
		}
	}
	return false;
}