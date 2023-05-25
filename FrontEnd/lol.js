fetch('http://localhost:5678/api/works')
  .then(function(reponse) {
    return reponse.json();
  })
  .then(function(body) {
    console.log(body);
  })
  .catch(function(error) {
    console.error('Erreur:', error);
  }); 
  console.log(body);
