
// ceci est un un test de camomille 37

/////////////////////////////////////////////
// Exécute un appel AJAX GET
/////////////////////////////////////////////
// Prend en paramètres l'URL cible et la fonction callback appelée en cas de succès
function ajaxGet(url, callback) {
    var req = new XMLHttpRequest();
    req.open("GET", url);
    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400) {
            // Appelle la fonction callback en lui passant la réponse de la requête
            callback(req.responseText);
        } else {
            console.error(req.status + " " + req.statusText + " " + url);
        }
    });
    req.addEventListener("error", function () {
        console.error("Erreur réseau avec l'URL " + url);
    });
    req.send(null);
}

/////////////////////////////////////////////
//Récupère des liens sur le serveur
/////////////////////////////////////////////

// Exécute un appel AJAX GET ciblé et récupère les données JSON
ajaxGet("https://oc-jswebsrv.herokuapp.com/api/liens", function (reponse) {
    // Transforme la réponse en tableau d'objets JavaScript
    var listeLiens = JSON.parse(reponse);
    // Affiche le titre de chaque lien
    listeLiens.forEach(function (lien) {
        var lienElt = creerElementLien(lien);
        contenuElt.appendChild(lienElt);
    });
})


// Crée et renvoie un élément DOM affichant les données d'un lien
// Le paramètre lien est un objet JS représentant un lien
function creerElementLien(lien) {
    var titreElt = document.createElement("a");
    titreElt.href = lien.url;
    titreElt.style.color = "#428bca";
    titreElt.style.textDecoration = "none";
    titreElt.style.marginRight = "5px";
    titreElt.appendChild(document.createTextNode(lien.titre));

    var urlElt = document.createElement("span");
    urlElt.appendChild(document.createTextNode(lien.url));

    // Cette ligne contient le titre et l'URL du lien
    var ligneTitreElt = document.createElement("h4");
    ligneTitreElt.style.margin = "0px";
    ligneTitreElt.appendChild(titreElt);
    ligneTitreElt.appendChild(urlElt);

    // Cette ligne contient l'auteur
    var ligneDetailsElt = document.createElement("span");
    ligneDetailsElt.appendChild(document.createTextNode("Ajouté par " + lien.auteur));

    var divLienElt = document.createElement("div");
    divLienElt.classList.add("lien");
    divLienElt.appendChild(ligneTitreElt);
    divLienElt.appendChild(ligneDetailsElt);

    return divLienElt;
}

var contenuElt = document.getElementById("contenu");


// Crée et renvoie un élément DOM de type input
function creerElementInput(placeholder, taille) {
    var inputElt = document.createElement("input");
    inputElt.type = "text";
    inputElt.setAttribute("placeholder", placeholder);
    inputElt.setAttribute("size", taille);
    inputElt.setAttribute("required", "true");
    return inputElt;
}

/////////////////////////////////////////////
//Poste un lien sur le serveur
/////////////////////////////////////////////

var ajouterLienElt = document.getElementById("ajoutLien");

// Gère l'ajout d'un nouveau lien

ajouterLienElt.addEventListener("click", function () {

    var auteurElt = creerElementInput("Entrez votre nom", 20);
    var titreElt = creerElementInput("Entrez le titre du lien", 40);
    var urlElt = creerElementInput("Entrez l'URL du lien", 40);

    var ajoutElt = document.createElement("input");
    ajoutElt.type = "submit";
    ajoutElt.value = "Ajouter";

    var formAjoutElt = document.createElement("form");
    formAjoutElt.appendChild(auteurElt);
    formAjoutElt.appendChild(titreElt);
    formAjoutElt.appendChild(urlElt);
    formAjoutElt.appendChild(ajoutElt);

    var p = document.querySelector("p");

    // Remplace le bouton d'ajout par le formulaire d'ajout
    p.replaceChild(formAjoutElt, ajouterLienElt);


    // Ajoute le nouveau lien
    formAjoutElt.addEventListener("submit", function (e) {
        e.preventDefault(); // Annule la publication du formulaire

        var url = urlElt.value;
        // Si l'URL ne commence ni par "http://" ni par "https://"
        if ((url.indexOf("http://") !== 0) && (url.indexOf("https://") !== 0)) {
            // On la préfixe par "http://"
            url = "http://" + url;
        }

        // Création de l'objet contenant les données du nouveau lien
        var lien = {
            titre: titreElt.value,
            url: url,
            auteur: auteurElt.value
        };

        /////////////////////////////////////////////
        //// Exécute un appel AJAX POST
        /////////////////////////////////////////////

        // Prend en paramètres l'URL cible, la donnée à envoyer et la fonction callback appelée en cas de succès
        function ajaxPost(url, data, callback, isJson) {
            var req = new XMLHttpRequest();
            req.open("POST", url);
            req.addEventListener("load", function () {
                if (req.status >= 200 && req.status < 400) {
                    // Appelle la fonction callback en lui passant la réponse de la requête
                    callback(req.responseText);

                } else {
                    console.error(req.status + " " + req.statusText + " " + url);

                }
            });
            req.addEventListener("error", function () {
                console.error("Erreur réseau avec l'URL " + url);
                // Remplace le formulaire d'ajout par le bouton d'ajout
                p.replaceChild(ajouterLienElt, formAjoutElt);
            });

            if (isJson) {
                // Définit le contenu de la requête comme étant du JSON
                req.setRequestHeader("Content-Type", "application/json");
                // Transforme la donnée du format JSON vers le format texte avant l'envoi
                data = JSON.stringify(data);
            }
            req.send(data);
        }
        
        
        /////////////////////////////////////////////
        // Envoi de l'objet au serveur
        /////////////////////////////////////////////
        
        ajaxPost("https://oc-jswebsrv.herokuapp.com/api/lien", lien,
            function (reponse) {
                var lienElt = creerElementLien(lien);
                // Ajoute le nouveau lien en haut de la liste
                contenuElt.insertBefore(lienElt, contenuElt.firstChild);

                // Remplace le formulaire d'ajout par le bouton d'ajout
                p.replaceChild(ajouterLienElt, formAjoutElt);

                // Création du message d'information
                var infoElt = document.createElement("div");
                infoElt.classList.add("info");
                infoElt.textContent = "Le lien \"" + lien.titre + "\" a bien été ajouté.";
                p.insertBefore(infoElt, ajouterLienElt);
                // Suppression du message après 2 secondes
                setTimeout(function () {
                    p.removeChild(infoElt);
                }, 2000);
            },
            true // Valeur du paramètre isJson
        );

    })

})
