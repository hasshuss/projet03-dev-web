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
  fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (response.status == 200) {
      sessionStorage.setItem('response', JSON.stringify(response));
      console.log('Connexion réussie');
      let main = document.querySelector('main');
      let loginPage = document.getElementById('loginpage');
      main.style.display="block";
      loginPage.style.display="none";
      let modifier = document.getElementById('modifier');
      modifier.textContent = "modifier";
      let buttons = document.getElementById('buttons');
      buttons.style.display="none";
      let login = document.getElementById('login');
      login.textContent="log out";
      modifier.addEventListener('click', modal);
    } 
    else  {
      console.log('Échec de la connexion');
    }
  })
  .catch(error => {
    console.error('Erreur lors de la connexion', error);
  });
}

function printgallery(){
  let travaux = JSON.parse(sessionStorage.getItem('works'));
  console.log(travaux);
  let i = 0;
  let gallery = document.getElementById('gallery');
  gallery.innerHTML = '';
  while (i < travaux.length)
  {
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

function printCategories(){
  let Categories = JSON.parse(sessionStorage.getItem('Categories'));
  console.log(Categories);
  
  for (let k = 0; k < Categories.length; k++)
  {
    let buttonCategories = document.createElement('button');
    buttonCategories.textContent = Categories[k].name;
    let buttons = document.getElementById('buttons');
    buttons.appendChild(buttonCategories);
    buttonCategories.addEventListener('click', (function(k){
      return function() {
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

function modal(){
let modal = document.getElementById('modal');
modal.style.display="block";
let titre = document.createElement('h2');
titre.id="titre";
titre.textContent="Galerie Photo";
modal.appendChild(titre);
let modalgalery = document.createElement('div');
modalgalery.id ="modalgalery";
titre.insertAdjacentElement('afterend', modalgalery);
let travaux = JSON.parse(sessionStorage.getItem('works'));
let i = 0;
modalgalery.innerHTML = '';
while (i < travaux.length)
{
  let figure = document.createElement('figure');
  let image = document.createElement('img');
  image.src = travaux[i].imageUrl;
  figure.appendChild(image);
  let figcaption = document.createElement('figcaption');
  figcaption.textContent = travaux[i].title;
  figure.appendChild(figcaption);
  modalgalery.appendChild(figure);
  i++;
}


}


window.onload = function() {
  console.log("bonjour")
  getWorks().then(() => printgallery());
  let button = document.createElement('button');
  let buttons = document.getElementById('buttons');
  button.textContent = 'Tous';
  buttons.appendChild(button);
  button.addEventListener('click', function() {
  printgallery();
  });
  getCategories().then(() => printCategories());
  let login = document.getElementById('login');
  login.addEventListener('click', function() {
  let main = document.querySelector('main');
  main.style.display="none"
  let loginPage = document.getElementById('loginpage');
  loginPage.style.display = 'block';
  loginPage.style.setProperty('display', 'block', 'important');
  });
  let btn = document.getElementById("btn");
  btn.addEventListener('click', loginadmin);
  
};
 
 
