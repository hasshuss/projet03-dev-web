window.addEventListener('DOMContentLoaded', function main() {
    fetch('http://localhost:5678/api/works/')
        .then(function(res) {
            return res.json();
        })
        .then(function (body) {
            var gallery = document.querySelector('.gallery');
            var filterButtons = document.querySelectorAll('.filter-btn');

            var imagesToShow = body; // Toutes les images par défaut

            // Fonction pour afficher les images
            function displayImages(images) {
                gallery.innerHTML = ''; // Effacer le contenu existant de la galerie

                if (images.length > 0) {
                    for (var i = 0; i < images.length; i++) {
                        var figure = document.createElement("figure");
                        var img = document.createElement("img");
                        img.src = images[i].imageUrl;
                        var figcaption = document.createElement("figcaption");
                        figcaption.textContent = images[i].title;
                        figure.appendChild(img);
                        figure.appendChild(figcaption);
                        gallery.appendChild(figure);
                    }
                } else {
                    var noImagesMessage = document.createElement("p");
                    noImagesMessage.textContent = "Aucune image à afficher pour le moment.";
                    gallery.appendChild(noImagesMessage);
                }
            }

            // Gestion des clics sur les boutons de filtre
            filterButtons.forEach(function(button) {
                button.addEventListener('click', function() {
                    var category = this.getAttribute('data-category');

                    if (category === 'all') {
                        imagesToShow = body; // Afficher toutes les images
                    } else {
                        imagesToShow = body.filter(function(image) {
                            return image.categoryId === parseInt(category);
                        });
                    }

                    displayImages(imagesToShow);
                  
                });
            });

            // Afficher toutes les images au chargement initial de la page
            displayImages(body);
        })
        .catch(function(error) {
            console.log('Erreur lors de la récupération des données depuis l\'API :', error);
        });



// Lorsque le lien "Se connecter" est cliqué
document.getElementById("loginLink").addEventListener("click", function() {
    var modal_connexion = document.getElementById("modal_connexion");
    modal_connexion.style.display = "block"; // Afficher le modal en définissant la propriété 'display' sur 'block'
});

// Lorsque le bouton de fermeture du modal est cliqué
document.getElementsByClassName("close")[0].addEventListener("click", function() {
    var modal_connexion = document.getElementById("modal_connexion");
    modal_connexion.style.display = "none"; // Masquer le modal en définissant la propriété 'display' sur 'none'
});

// Lorsque l'utilisateur clique en dehors du modal
window.addEventListener("click", function(event) {
    var modal_connexion = document.getElementById("modal_connexion");
    if (event.target === modal_connexion) {
        modal_connexion.style.display = "none"; // Masquer le modal si l'élément cliqué est le modal lui-même
    }
});
document.getElementById("loginpage").addEventListener("submit", function(event) {
  event.preventDefault(); // Empêche le comportement par défaut du formulaire

  // Récupérer les valeurs des champs de formulaire (nom d'utilisateur et mot de passe)
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  // Créer l'objet de données à envoyer dans la requête POST
  var data = {
    email: username,
    password: password
  };

  // Effectuer la requête POST à l'API pour la connexion
  fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(function(response) {
      if (response.ok) {
        // La requête a réussi (statut 200)
        return response.json();
      } else {
        // La requête a échoué, gérer l'erreur
        throw new Error('Échec de la connexion');
      }
    })
    .then(function(data) {
      // Stocker le token dans le sessionStorage
      sessionStorage.setItem('token', data.token);

      // Effectuer d'autres actions en fonction du succès de la connexion
      console.log('Connexion réussie');
    })
    .catch(function(error) {
      // Gérer les erreurs de requête
      console.log('Erreur lors de la connexion :', error.message);
    });

  // Réinitialiser les champs du formulaire
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
});
  
    // Fermer le modal
       let modal_connexion = document.getElementById("modal_connexion");
       modal_connexion.style.display = "none";

       let modifier = document.getElementById("modal_modifier");
       modifier.style.display = "block";

       document.getElementById("modal_modifier").addEventListener("click", function() {
        document.getElementById('modal-gallery').innerHTML = "";
        var modalshow = document.getElementById("modal-gallery-container");
        modalshow.style.display = "grid"; // Afficher le modal de modification


        fetch('http://localhost:5678/api/works')
        .then(r => r.json())
        .then(body => {
            console.log(body);
              let i = 0;
              while (i < body.length) 
              {
              console.log(body[i].imageUrl);
              let imgurl=body[i].imageUrl;
              let newdiv=document.createElement('div');
              newdiv.id = "div" + i;
              let newimg = document.createElement('img');
              let supr = document.createElement('div');
              supr.textContent="supr"
              newimg.setAttribute('src', imgurl);
              newdiv.appendChild(newimg);
              newdiv.appendChild(supr);
              let parentdiv = document.getElementById('modal-gallery');
              parentdiv.appendChild(newdiv);
              i++;
              }
              let ajouter=document.createElement('div');
              ajouter.textContent="Ajouter une photo";
              modalshow.appendChild(ajouter);





})
    
       
    });
    


      });

    });



