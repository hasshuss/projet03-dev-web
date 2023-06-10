document.addEventListener('DOMContentLoaded', function() {

const main = document.querySelector('main')
const loginPage = document.getElementById('loginpage')
const modifier = document.getElementById('modifier')
const buttons = document.getElementById('buttons')
const login = document.getElementById('login')
const overlay = document.getElementById('superposition')
const modalelement = document.getElementById('modal');
const gallery = document.getElementById('gallery');
let message = document.createElement('span');
const cadre = document.createElement('div');
const parent = document.getElementById('parent');
const body = document.querySelector('body');

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
    message.textContent='impossible de contacter le serveur';
    PrintErrorMessage(message,gallery);
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
    message.textContent='impossible de contacter le serveur';
    PrintErrorMessage(message,gallery);
  }
}

async function loginadmin() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let data =
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
          let IconeModifier = document.getElementById('icone-modifier');
          IconeModifier.style.display='flex';
          modifier.addEventListener('click', modal);
          document.getElementById("username").value = "";
          document.getElementById("password").value = "";
          login.textContent = "log out";
          login.id="logout";
          CreateHeaderAdmin();
          logout();
        });
      } else {
        message.textContent='Echec de la connexion';
        PrintErrorMessage(message,loginPage);
      }

});
}

function ClearLoginPage() {
  main.style.display = "block";
  loginPage.style.display = "none";
  modifier.textContent = "modifier";
  buttons.style.display = "none";
}

function printgallery() {
  let travaux = JSON.parse(sessionStorage.getItem('works'));
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
        gallery.innerHTML = '';
        for (let i = 0; i < travaux.length; i++) {
          if (travaux[i].categoryId == Categories[k].id) {
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
  let travaux = JSON.parse(sessionStorage.getItem('works'));
  travaux.splice(arraynumber, 1);
  sessionStorage.setItem('works', JSON.stringify(travaux));
  printgallery();
  modal();
}

function modal() {
  overlay.style.display='block';
  modalelement.innerHTML = '';
  ConstructBtnCloseModal();
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
    let trash= document.createElement('i');
    trash.className='fa-regular fa-trash-can';
    trash.id='trash';
    figure.style.position='relative';
    figure.appendChild(trash)
    trash.dataset.workId = travaux[i].id;
    trash.dataset.arraynumber = i;
    trash.addEventListener('click', function (event) {
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
    ConstrucBtnBeforeModal();
    AddWorkButton.style.display = 'none';
    titre.textContent = "Ajout Photo";
    cadre.id='cadre';
    AddImageIcone();
    var btnAjout = document.createElement('input');
    btnAjout.id='BtnAjoutPhoto'
    btnAjout.type = 'file';
    btnAjout.accept = 'image/jpeg, image/png';
    btnAjout.style.display = 'flex';
    btnAjout.id = 'fileInput';
    btnAjout.addEventListener('change', function(event) {
      var selectedFile = event.target.files[0];
      if (selectedFile) {
        var fileSize = selectedFile.size;
        var maxSize = 4 * 1024 * 1024;
        if (fileSize <= maxSize) {
    
          var reader = new FileReader();
    
          reader.addEventListener('load', function() {
            var cadre = document.getElementById('cadre');
            cadre.innerHTML='';
            var previewImage = document.createElement('img');
            previewImage.src = reader.result;
            previewImage.style.maxWidth = '90%'; 
            previewImage.style.maxHeight = '90%';
            previewImage.style.objectFit = 'cover'
            cadre.appendChild(previewImage);
          });
    
          reader.readAsDataURL(selectedFile);
        } else {
          message.textContent = 'Veuillez sélectionner un fichier de taille inférieure à 4 Mo';
          PrintErrorMessage(message, modalelement);
        }
      }
    });
    modalelement.appendChild(cadre);
    cadre.appendChild(btnAjout);
    cadre.className = "cadre";
    let cadre2 = document.createElement('div');
    cadre2.id='cadre2'
    modalelement.appendChild(cadre2);
    let SousTitre1 = document.createElement('div');
    SousTitre1.textContent = 'Titre'
    let dial = document.createElement('input');
    dial.type = 'text';
    cadre2.appendChild(SousTitre1);
    cadre2.appendChild(dial);
    let SousTitre2 = document.createElement('div');
    SousTitre2.textContent = 'Catégorie';
    cadre2.appendChild(SousTitre2);
    let menu = document.createElement('select');
    cadre2.appendChild(menu);
    let Categories = JSON.parse(sessionStorage.getItem('Categories'));
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
              message.textContent='Une erreur est survenue lors de la requête';
              PrintErrorMessage(message,modalelement);
            }
          })
          .catch(error => {
            console.error('Une erreur est survenue lors de la requête', error);
            message.textContent='Une erreur est survenue lors de la requête';
            PrintErrorMessage(message,modalelement);
          });
      } else {
        message.textContent='Veuillez remplir tous les champs';
        PrintErrorMessage(message,modalelement);
      }
    });
  });
  ClearModalWhenClickOutside();
};

function ClearModal() {
  cadre.innerHTML='';
  modalelement.style.display = 'none';
  overlay.style.display='none';
}

function bouttontous() {
let buttontous = document.createElement('button');
buttontous.textContent = 'Tous';
buttons.appendChild(buttontous);
buttontous.addEventListener('click', printgallery);
}

function PrintErrorMessage(message,parent) {
message.id="ErrorMessage"
parent.appendChild(message);
}

function ConstructBtnCloseModal(){
let btnclose= document.createElement('i');
btnclose.id='btnclose';
btnclose.className='fa-solid fa-xmark';
modalelement.appendChild(btnclose);
btnclose.addEventListener('click',ClearModal);
}

function ConstrucBtnBeforeModal(){
  let btnbefore= document.createElement('i');
  btnbefore.id='btnbefore';
  btnbefore.className='fa-solid fa-arrow-left';
  modalelement.appendChild(btnbefore);
  btnbefore.addEventListener('click',function(){
    ClearModal();
    setTimeout(function() {
      modal(); 
    }, 0.1);
  })
}

function AddImageIcone(){
  let IconeImage= document.createElement('i');
  IconeImage.id='IconeImage';
  IconeImage.className='fa-regular fa-image fa-2xl';
  cadre.appendChild(IconeImage);
}

function ClearModalWhenClickOutside(){
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
}

function logout(){
let logout_text=document.getElementById('logout');
logout_text.addEventListener('click', function(){
logout_text.id='login';
logout_text.textContent='login';
sessionStorage.removeItem('token');
})
}

function CreateHeaderAdmin(){
  let bodyheader=document.createElement('div');
  parent.appendChild(bodyheader);
  bodyheader.id="bodyheader";
  bodyheader.style.backgroundColor='black';
  let ButtonHeader=document.createElement('button');
  ButtonHeader.id = 'ButtonHeader';
  ButtonHeader.textContent='publier les changements';
  let div=document.createElement('div');
  div.id="modifier-content2"
  body.style.marginTop='150px';
  let modifierheader= document.createElement('i');
  modifierheader.className='fa-regular fa-pen-to-square';
  let modifiertext=document.createElement('div');
  modifiertext.textContent='mode édition';
  div.appendChild(modifierheader);
  div.appendChild(modifiertext);
  bodyheader.appendChild(div);
  bodyheader.appendChild(ButtonHeader);
}



function mainscript() {
getWorks().then(() => printgallery());
bouttontous();
getCategories().then(() => printCategories());
login.addEventListener('click', function () {
main.style.display = "none";
loginPage.style.display = 'flex';
  });
let btn = document.getElementById("btn");
btn.addEventListener('click', loginadmin);
}

mainscript();
});