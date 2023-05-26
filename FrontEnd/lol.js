async function getWork() {
  try {
      const response = await fetch('http://localhost:5678/api/works');
      
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      } else {
          const workData = await response.json();
          sessionStorage.setItem('works', JSON.stringify(workData));
      }
  } catch (error) {
      console.error('Une erreur est survenue lors de la récupération des données : ', error);
  }
}

getWork().then(() => {
  let travaux = JSON.parse(sessionStorage.getItem('works'));
  console.log(travaux);
  let i = 0;
  let gallery = document.getElementById('gallery');
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

  
});

