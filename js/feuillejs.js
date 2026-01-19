//page 2
var modal = document.getElementById('album');
// Ouvre une fenêtre 
function openalbum(id) {
  modal.style.display = "block";
  document.getElementById(id).style.display = "block";
}
// Ferme une fenêtre 
function closealbum() {
  modal.style.display = "none";
  let tabid = ['salle', 'batterie', 'ipseite', 'lithopedion',  'qalf' ];
  for (let i = 0; i < tabid.length; i++) {
    document.getElementById(tabid[i]).style.display = "none";
  }
}

// page 4
// Raffraichi la valeur affichée
function refreshrange() {
  document.getElementById('rangeout').innerHTML = document.getElementById('range').value;
}
// Vérifie la validité du formulaire
function checkform() {
  debug();
  var validation = true;
  var fout = "Erreur(s) :";
  var f = document.forms['formulaire'];
  if (!f.elements['nom'].checkValidity()) {
    fout += "\n Nom invalide";
    validation = false;
  }
  if (!f.elements['prenom'].checkValidity()) {
    fout += "\n Prénom invalide";
    validation = false;
  }
  if (!f.elements['tel'].checkValidity()) {
    fout += "\n Numéro de téléphone invalide";
    validation = false;
  }
  if (!f.elements['photo'].checkValidity()) {
    fout += "\n Photo invalide";
    validation = false;
  }
  if (!f.elements['datenaissance'].checkValidity()) {
    fout += "\n Date de naissance invalide";
    validation = false;
  }
  if (!f.elements['age'].checkValidity()) {
    fout += "\n Age invalide";
    validation = false;
  }
  if (!f.elements['semainenaissance'].checkValidity()) {
    fout += "\n Semaine de naissance invalide";
    validation = false;
  }
  if (!f.elements['moisnaissance'].checkValidity()) {
    fout += "\n Mois de naissance invalide";
    validation = false;
  }
  if (!f.elements['email'].checkValidity()) {
    fout += "\n Adresse E-mail invalide";
    validation = false;
  }
  if (!f.elements['mpd'].checkValidity()) {
    fout += "\n Mot de passe invalide";
    validation = false;
  }
  if (!f.elements['range'].checkValidity()) {
    fout += "\n Echelle de satisfaction invalide";
    validation = false;
  }
  if (!f.elements['mllr'].checkValidity()||f.elements['mllr'].value=="default") {
    fout += "\n Séléctionnez ce que vous pensais de notre site";
    validation = false;
  }
  if (!f.elements['couleur'].checkValidity()) {
    fout += "\n Couleur préferée invalide";
    validation = false;
  }
  if (!f.elements['site'].checkValidity()) {
    fout += "\n Site web invalide";
    validation = false;
  }
  if (!(f.elements['dchoix'].checkValidity()&&f.elements['nchoix'].checkValidity())) {
    fout += "\n Séléctionnez damso ou ninho";
    validation = false;
  }
  if (!f.elements['incr'].checkValidity()) {
    fout += "\n Vous etes contre c'est votre choix";
    validation = false;
  }
  if (!f.elements['heure'].checkValidity()) {
    fout += "\n Heure de reception des mails invalide";
    validation = false;
  }
  if (!f.elements['datedesinscription'].checkValidity()) {
    fout += "\n Date de désinscription invalide";
    validation = false;
  }
  if (!f.elements['commentaire'].checkValidity()||f.elements['commentaire'].value=="") {
    fout += "\n Commentaire invalide";
    validation = false;
  }
  if (!validation) {
    alert(fout);
  }
  return validation;
}
// pour vérifier les entrées
function debug() {
  var f = document.forms['formulaire'];
  var elmts = ['nom', 'prenom', 'tel', 'photo', 'datenaissance', 'age', 'semainenaissance', 'moisnaissance', 'email', 'mpd', 'range', 'mllr', 'couleur', 'site', 'dchoix','nchoix', 'incr', 'heure', 'datedesinscription', 'commentaire'];
  elmts.forEach(itm => console.log(itm + ' = ' + f.elements[itm].value));
}
