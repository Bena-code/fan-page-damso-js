// Fonction appelée quand on clique sur le bouton "Rechercher"
function lancerRecherche() {
    var artiste = document.getElementById("recherche").value;
    var divResultats = document.getElementById("resultats");
    
    // On vide les anciens résultats et on met un chargement
    divResultats.innerHTML = "<p style='color:white;'>Chargement des sons de " + artiste + "...</p>";

    // ASTUCE JSONP :
    // Comme on est en local, on ne peut pas utiliser "fetch" à cause des sécurités (CORS).
    // On utilise une technique ancienne mais robuste : on injecte une balise <script> qui va charger les données.
    
    var script = document.createElement("script");
    // On appelle l'API Deezer en demandant du JSONP (&output=jsonp) et en donnant le nom de notre fonction callback
    script.src = "https://api.deezer.com/search?q=" + encodeURIComponent(artiste) + "&output=jsonp&callback=afficherResultatsDeezer";
    
    // On ajoute le script à la page, ce qui lance la requête immédiatement
    document.body.appendChild(script);
    
    // On supprime le script après coup pour garder le code propre
    document.body.removeChild(script);
}

// Cette fonction est appelée AUTOMATIQUEMENT par Deezer quand les données arrivent
function afficherResultatsDeezer(donnees) {
    var divResultats = document.getElementById("resultats");
    divResultats.innerHTML = ""; // On enlève le message "Chargement..."

    if (!donnees.data || donnees.data.length === 0) {
        divResultats.innerHTML = "<p>Aucun résultat trouvé.</p>";
        return;
    }

    // On prend les 6 premiers résultats seulement pour ne pas surcharger la page
    for (var i = 0; i < 6; i++) {
        var titre = donnees.data[i];

        // On crée une "carte" pour chaque musique
        var carte = document.createElement("div");
        carte.style = "background-color: #1b212c; border: 1px solid #cc00cc; border-radius: 10px; padding: 10px; width: 200px; text-align: center;";
        
        // On remplit la carte avec le HTML (Image + Titre + Lecteur Audio)
        carte.innerHTML = `
            <img src="${titre.album.cover_medium}" style="width: 100%; border-radius: 5px;">
            <h3 style="color: #cc00cc; font-size: 16px; margin: 10px 0;">${titre.title}</h3>
            <p style="font-size: 12px; color: silver;">${titre.artist.name}</p>
            <audio controls src="${titre.preview}" style="width: 100%; height: 30px;"></audio>
        `;

        divResultats.appendChild(carte);
    }
}

// (Optionnel) Lance une recherche par défaut au chargement de la page
// lancerRecherche();