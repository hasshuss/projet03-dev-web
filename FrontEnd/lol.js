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
      let workData = await response.json();
      sessionStorage.setItem('Categories', JSON.stringify(workData));
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
          console.log('Connexion réussie');
          let main = document.querySelector('main');
          let loginPage = document.getElementById('loginpage');
          main.style.display = "block";
          loginPage.style.display = "none";
          let modifier = document.getElementById('modifier');
          modifier.textContent = "modifier";
          let buttons = document.getElementById('buttons');
          buttons.style.display = "none";
          let login = document.getElementById('login');
          login.textContent = "log out";
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

function printgallery() {
  let travaux = JSON.parse(sessionStorage.getItem('works'));
  console.log(travaux);
  let i = 0;
  let gallery = document.getElementById('gallery');
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
    i++;
  }
};

function printCategories() {
  let Categories = JSON.parse(sessionStorage.getItem('Categories'));
  console.log(Categories);

  for (let k = 0; k < Categories.length; k++) {
    let buttonCategories = document.createElement('button');
    buttonCategories.textContent = Categories[k].name;
    let buttons = document.getElementById('buttons');
    buttons.appendChild(buttonCategories);
    buttonCategories.addEventListener('click', (function (k) {
      return function () {
        let travaux = JSON.parse(sessionStorage.getItem('works'));
        console.log(travaux);
        let gallery = document.getElementById('gallery');
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
  let modal = document.getElementById('modal');
  modal.innerHTML=''
  let modalgalery = document.createElement('div');
  modalgalery.id = "modalgalery";
  modal.style.display = "block";
  let titre = document.createElement('h2');
  titre.id = "titre";
  titre.textContent = "Galerie Photo";
  modal.appendChild(titre);
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
  modal.insertBefore(AddWorkButton, modalgalery.nextSibling);
  AddWorkButton.addEventListener('click', function () {
    modalgalery.innerHTML = '';
    AddWorkButton.style.display = 'none';
    titre.textContent = "Ajout Photo";
    let cadre = document.createElement('div')
    let btnAjout = document.createElement('input');
    btnAjout.type = 'file';
    btnAjout.accept = 'image/jpeg, image/png';
    btnAjout.style.display = 'block';
    btnAjout.id = 'fileInput';
    btnAjout.addEventListener('change', function(event) {
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
    modal.appendChild(cadre);
    cadre.appendChild(btnAjout);
    btnAjout.textContent = "+ Ajouter une photo"
    cadre.className = "cadre";
    let SousTitre1 = document.createElement('div');
    SousTitre1.textContent = 'Titre'
    let dial = document.createElement('input');
    dial.type = 'text';
    modal.appendChild(SousTitre1);
    modal.appendChild(dial);
    let SousTitre2 = document.createElement('div');
    SousTitre2.textContent = 'Catégorie';
    modal.appendChild(SousTitre2);
    let menu = document.createElement('select');
    modal.appendChild(menu);
    let Categories = JSON.parse(sessionStorage.getItem('Categories'));
    console.log(Categories);
    for (let k = 0; k < Categories.length; k++) {
      let CategorieMenu = document.createElement('option');
      CategorieMenu.textContent = Categories[k].name;
      menu.appendChild(CategorieMenu);
    }
    let ajout = document.createElement('button');
    ajout.textContent='Ajout';
    modal.appendChild(ajout);
    ajout.addEventListener('click', function() {
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

              console.log('Image ajoutée avec succès');
              dial.value = '';
              menu.value = '';
              btnAjout.value = null;
              ClearModal();
              getWorks()
              .then(() => printgallery());

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
    let modifier = document.getElementById('modifier');
    if (
      event.target === modal ||
      modal.style.display === 'none' ||
      event.target === modifier ||
      modal.contains(event.target)
    ) {
    }
  
    ClearModal();
    console.log('modal supprimé');
  });
  
};


function ClearModal(){
  let modal = document.getElementById('modal');
  modal.style.display='none';
}



  window.onload = function () {
  console.log("bonjour")
  getWorks().then(() => printgallery());
  let button = document.createElement('button');
  let buttons = document.getElementById('buttons');
  button.textContent = 'Tous';
  buttons.appendChild(button);
  button.addEventListener('click', function () {
    printgallery();
  });
  getCategories().then(() => printCategories());
  let login = document.getElementById('login');
  login.addEventListener('click', function () {
    let main = document.querySelector('main');
    main.style.display = "none"
    let loginPage = document.getElementById('loginpage');
    loginPage.style.display = 'block';
    loginPage.style.setProperty('display', 'block', 'important');
  });
  let btn = document.getElementById("btn");
  btn.addEventListener('click', loginadmin);
};


