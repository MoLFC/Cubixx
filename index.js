function addUser() {
  var username = document.getElementById('username').value;
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  var userId = firebase.database().ref().child('users').push().key; // Generiert eine einzigartige ID für den Benutzer

  firebase.database().ref('users/' + userId).set({
    username: username,
    email: email,
    password: password // Passwörter sollten verschlüsselt und nicht im Klartext gespeichert werden
  }).then(() => {
    window.location.href = 'Dashboard.html';
  }).catch((error) => {
    console.error('Error adding user:', error);
    alert('Error adding user');
  });
}

document.getElementById('dataForm').addEventListener('submit', function(event) {
  event.preventDefault();
  addUser();
});
