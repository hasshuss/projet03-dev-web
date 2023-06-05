document.addEventListener('DOMContentLoaded', function() {

const main = document.querySelector('main')
const loginPage = document.getElementById('loginpage')
const modifier = document.getElementById('modifier')
const buttons = document.getElementById('buttons')
const login = document.getElementById('login')
const overlay = document.getElementById('superposition')
const modalelement = document.getElementById('modal');
const gallery = document.getElementById('gallery');

async function getWorks() {
  try {
    let response = await fetch('http://localhost:5678/api/works');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      let workData = await response.json();
      sessionStorage.setItem('works', JSON.stringify(workData));
    }
  } catch (error) {
    console.error('Une erreur est survenue lors de la récupération des données : ', error);
  }
}

async function getCategories() {
  try {
    let response = await fetch('http://localhost:5678/api/categories');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      let CatData = await response.json();
      sessionStorage.setItem('Categories', JSON.stringify(CatData));
    }
  } catch (error) {
    console.error('Une erreur est survenue lors de la récupération des données : ', error);
  }
}

async function loginadmin() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  var data =
  {
    email: username,
    password: password
  };
  await fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (response.status == 200) {
        response.json().then(tokenData => {
          let token = tokenData.token;
          sessionStorage.setItem('token', JSON.stringify(token));
          ClearLoginPage();
          printgallery();
          modifier.addEventListener('click', modal);
        });
      } else {
        console.log('Échec de la connexion');
      }
    })
    .catch(error => {
      console.error('Erreur lors de la connexion', error);
    });
}

function ClearLoginPage() {
  main.style.display = "block";
  loginPage.style.display = "none";
  modifier.textContent = "modifier";
  buttons.style.display = "none";
  login.textContent = "log out";
}

function printgallery() {
  let travaux = JSON.parse(sessionStorage.getItem('works'));
  console.log(travaux);
  let i = 0;
  gallery.innerHTML = '';
  while (i < travaux.length) {
    let figure = document.createElement('figure');
    let image = document.createElement('img');
    image.src = travaux[i].imageUrl;
    figure.appendChild(image);
    let figcaption = document.createElement('figcaption');
    figcaption.textContent = travaux[i].title;
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
    console.log('galleryprinted')
    i++;
  }
}

function printCategories() {
  let Categories = JSON.parse(sessionStorage.getItem('Categories'));
  for (let k = 0; k < Categories.length; k++) {
    let buttonCategories = document.createElement('button');
    buttonCategories.textContent = Categories[k].name;
    buttons.appendChild(buttonCategories);
    buttonCategories.addEventListener('click', (function (k) {
      return function () {
        let travaux = JSON.parse(sessionStorage.getItem('works'));
        console.log(travaux);
        gallery.innerHTML = '';
        for (let i = 0; i < travaux.length; i++) {
          if (travaux[i].categoryId == Categories[k].id) {
            console.log(travaux[i].categoryId);
            console.log(Categories[k].id);
            let figure = document.createElement('figure');
            let image = document.createElement('img');
            image.src = travaux[i].imageUrl;
            figure.appendChild(image);
            let figcaption = document.createElement('figcaption');
            figcaption.textContent = travaux[i].title;
            figure.appendChild(figcaption);
            gallery.appendChild(figure);
          }
        }
      }
    })(k));
  }
}

async function deletework(workId, arraynumber) {
  var token = JSON.parse(sessionStorage.getItem('token'));

  await fetch(`http://localhost:5678/api/works/${workId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  console.log(workId);
  let travaux = JSON.parse(sessionStorage.getItem('works'));
  travaux.splice(arraynumber, 1);
  sessionStorage.setItem('works', JSON.stringify(travaux));
  printgallery();
  modal();
  console.log(travaux);
}

function modal() {
  overlay.style.display='block';
  modalelement.innerHTML = ''
  let modalgalery = document.createElement('div');
  modalgalery.id = "modalgalery";
  modalelement.style.display = "block";
  let titre = document.createElement('h2');
  titre.id = "titre";
  titre.textContent = "Galerie Photo";
  modalelement.appendChild(titre);
  titre.insertAdjacentElement('afterend', modalgalery);
  let travaux = JSON.parse(sessionStorage.getItem('works'));
  modalgalery.innerHTML = '';
  for (let i = 0; i < travaux.length; i++) {
    let figure = document.createElement('figure');
    let image = document.createElement('img');
    image.src = travaux[i].imageUrl;
    figure.appendChild(image);
    let figcaption = document.createElement('figcaption');
    figcaption.textContent = "éditer";
    figure.appendChild(figcaption);
    modalgalery.appendChild(figure);
    figcaption.dataset.workId = travaux[i].id;
    figcaption.dataset.arraynumber = i;
    figcaption.addEventListener('click', function (event) {
      let workId = event.target.dataset.workId;
      let arraynumber = event.target.dataset.arraynumber;
      deletework(workId, arraynumber);
    });
  }
  let AddWorkButton = document.createElement('button');
  AddWorkButton.textContent = "Ajouter une photo";
  AddWorkButton.style.display ="flex";
  AddWorkButton.style.justifyContent="center"
  
  modalelement.insertBefore(AddWorkButton, modalgalery.nextSibling);
  AddWorkButton.addEventListener('click', function () {
    modalgalery.innerHTML = '';
    AddWorkButton.style.display = 'none';
    titre.textContent = "Ajout Photo";
    let cadre = document.createElement('div')
    var btnAjout = document.createElement('input');
    btnAjout.type = 'file';
    btnAjout.accept = 'image/jpeg, image/png';
    btnAjout.style.display = 'flex';
    btnAjout.id = 'fileInput';
    btnAjout.addEventListener('change', function (event) {
   
      var selectedFile = event.target.files[0];
      if (selectedFile) {
        var fileSize = selectedFile.size;
        var maxSize = 4 * 1024 * 1024;
        if (fileSize <= maxSize) {
          console.log('Fichier sélectionné :', selectedFile.name);
        } else {
          console.log('Taille de fichier trop grande. Veuillez sélectionner un fichier de moins de 4 Mo.');
        }
      }
    });
    modalelement.appendChild(cadre);
    cadre.appendChild(btnAjout);
    btnAjout.textContent = "+ Ajouter une photo"
    cadre.className = "cadre";
    let SousTitre1 = document.createElement('div');
    SousTitre1.textContent = 'Titre'
    let dial = document.createElement('input');
    dial.type = 'text';
    modalelement.appendChild(SousTitre1);
    modalelement.appendChild(dial);
    let SousTitre2 = document.createElement('div');
    SousTitre2.textContent = 'Catégorie';
    modalelement.appendChild(SousTitre2);
    let menu = document.createElement('select');
    modalelement.appendChild(menu);
    let Categories = JSON.parse(sessionStorage.getItem('Categories'));
    console.log(Categories);
    for (let k = 0; k < Categories.length; k++) {
      let CategorieMenu = document.createElement('option');
      CategorieMenu.textContent = Categories[k].name;
      menu.appendChild(CategorieMenu);
    }
    let ajout = document.createElement('button');
    ajout.textContent = 'Valider';
    ajout.id = "validerbtn";
    modalelement.appendChild(ajout);
    ajout.addEventListener('click', function () {
      let titreValue = dial.value;
      let categorieValue = menu.value;
      let categorieId = Categories.find(category => category.name === categorieValue)?.id;
      let selectedFile = btnAjout.files[0];
      if (titreValue && categorieValue && categorieId && selectedFile) {
        let dataToSend = new FormData();
        dataToSend.append('image', selectedFile);
        dataToSend.append('title', titreValue);
        dataToSend.append('category', categorieId);
        var token = JSON.parse(sessionStorage.getItem('token'));
        fetch('http://localhost:5678/api/works', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: dataToSend
        })
          .then(response => {
            if (response.ok) {
              dial.value = '';
              menu.value = '';
              btnAjout.value = null;
              ClearModal();
              getWorks().then(() => printgallery());
            } else {
              console.error('Erreur lors de l\'ajout de l\'image');
            }
          })
          .catch(error => {
            console.error('Une erreur est survenue lors de la requête', error);
          });
      } else {
        console.log('Veuillez remplir tous les champs');
      }
    });
  });
  window.addEventListener('click', function (event) {
    if (
      event.target === modalelement ||
      modalelement.style.display === 'none' ||
      event.target === modifier ||
      modalelement.contains(event.target)     
       )
     {return}
    ClearModal();
  });
};

function ClearModal() {
  modalelement.style.display = 'none';
  overlay.style.display='none';
}

function Center(Id){
 let elem = document.getElementById(Id);
 elem.style.display = "flex";
 elem.style.justifyContent = "center";
 elem.style.alignItems = "center";
}

function bouttontous() {
let buttontous = document.createElement('button');
buttontous.textContent = 'Tous';
buttons.appendChild(buttontous);
buttontous.addEventListener('click', printgallery);
}

function mainscript() {
getWorks().then(() => printgallery());
bouttontous();
getCategories().then(() => printCategories());
login.addEventListener('click', function () {
main.style.display = "none";
loginPage.style.display = 'block';
  });
let btn = document.getElementById("btn");
btn.addEventListener('click', loginadmin);
}

mainscript()

});