// index.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASe-03_gMfgc-EPnqq-WD5BtMINE9mnz0",
  authDomain: "cubixxtt.firebaseapp.com",
  databaseURL: "https://cubixxtt-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cubixxtt",
  storageBucket: "cubixxtt.appspot.com",
  messagingSenderId: "821359872963",
  appId: "1:821359872963:web:6db61190e1f3870c33cb76"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const database = getDatabase(app);

// Reference to your database path
const dataRef = ref(database, 'users/-NnB_1DAXTwkGegI1ENa/completed');

// Get the data and display it
onValue(dataRef, (snapshot) => {
  const data = snapshot.val();
  const activityCounts = countChildren(data);
  createBarChart(activityCounts);
}, {
  onlyOnce: true // This option will get the data only once
});

function countChildren(data) {
  const activityCounts = {};
  for (const [key, value] of Object.entries(data)) {
    activityCounts[key] = Object.keys(value).length;
  }
  return activityCounts;
}

function createBarChart(activityCounts) {
  const ctx = document.getElementById('myChart').getContext('2d');
  const labels = Object.keys(activityCounts);
  const data = {
    labels: labels,
    datasets: [{
      label: 'Anzahl der Aktivitäten',
      data: Object.values(activityCounts),
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  };
  const config = {
    type: 'bar',
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };
  const myChart = new Chart(ctx, config);
}
