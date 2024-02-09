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
const database = getDatabase(app);

// Reference to your database path
const dataRef = ref(database, 'users/-NnB_1DAXTwkGegI1ENa/completed');
let currentChartType = 'bar';// Globale Variable, um den aktuellen Diagrammtyp zu speichern

// This callback is used to create the bar chart with the count of activities
onValue(dataRef, (snapshot) => {
  const data = snapshot.val();
  const activityCounts = countChildren(data);
  createBarChart(activityCounts);
  createPieChart(activityCounts);
}, {
  onlyOnce: true
});

// This callback is used to create the table with the sums of the values
onValue(dataRef, (snapshot) => {
  const data = snapshot.val();
  const activitySums = calculateSums(data);
  createSumsTable(activitySums);
}, {
  onlyOnce: true
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
      label: 'Number of Activities',
      data: Object.values(activityCounts),
      backgroundColor: [
        'rgba(255, 99, 132, 0.4)',
        'rgba(54, 162, 235, 0.4)',
        'rgba(255, 206, 86, 0.4)',
        'rgba(75, 192, 192, 0.4)',
        'rgba(153, 102, 255, 0.4)',
        'rgba(255, 159, 64, 0.4)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 4
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
      },
      plugins: {
        legend: {
          labels: {
            font: {
              size: 20 // Setzt die Schriftgröße auf 18
            }
          }
        }
      } 
    }
  };
  new Chart(ctx, config);
}

function createPieChart(activityCounts) {
  const ctx = document.getElementById('myPieChart').getContext('2d'); 
  const data = {
    labels: Object.keys(activityCounts),
    datasets: [{
      data: Object.values(activityCounts),
      backgroundColor: [
        'rgba(255, 99, 132, 0.4)',
        'rgba(54, 162, 235, 0.4)',
        'rgba(255, 206, 86, 0.4)',
        'rgba(75, 192, 192, 0.4)',
        'rgba(153, 102, 255, 0.4)',
        'rgba(255, 159, 64, 0.4)'
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
    type: 'pie',
    data: data,
  };
  new Chart(ctx, config);
}

function toggleChart() {
  const chartImage = document.getElementById('chartImage');
  if (currentChartType === 'bar') {
    currentChartType = 'pie';
    document.getElementById('myChart').style.display = 'none';
    document.getElementById('myPieChart').style.display = 'block';
    chartImage.src = 'assets/BarChart.png'; 
  } else {
    currentChartType = 'bar';
    document.getElementById('myChart').style.display = 'block';
    document.getElementById('myPieChart').style.display = 'none';
    chartImage.src = 'assets/PieChart.png'; 
  }
}

// Event Listener für den Button
document.getElementById('toggleChart').addEventListener('click', toggleChart);

// Initialisiere das Balkendiagramm als sichtbar und das Kreisdiagramm als unsichtbar
document.getElementById('myChart').style.display = 'block';
document.getElementById('myPieChart').style.display = 'none';


function calculateSums(data) {
  const sums = {};
  for (const activity in data) {
    if (data.hasOwnProperty(activity)) {
      let total = 0;
      for (const key in data[activity]) {
        if (data[activity].hasOwnProperty(key)) {
          total += data[activity][key];
        }
      }
      sums[activity] = total;
    }
  }
  return sums;
}

function formatDuration(ms) {
  let seconds = Math.floor(ms / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  seconds = seconds % 60;
  minutes = minutes % 60;

  if (ms < 60000) {
      return `${seconds} s`;
  } else if (ms < 3600000) {
      return `${minutes} m ${seconds} s`;
  } else {
      return `${hours} h ${minutes} m ${seconds} s`;
  }
}

function createSumsTable(activitySums) {
  const tableContainer = document.getElementById('sumsTableContainer');
  const table = document.createElement('table');
  table.id = 'sumsTable';
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const activityHeader = document.createElement('th');
  activityHeader.textContent = 'Activity';
  const sumHeader = document.createElement('th');
  sumHeader.textContent = 'Total Duration';
  headerRow.appendChild(activityHeader);
  headerRow.appendChild(sumHeader);
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  Object.entries(activitySums).forEach(([activity, sum]) => {
    const row = document.createElement('tr');
    const activityCell = document.createElement('td');
    activityCell.textContent = activity;
    const sumCell = document.createElement('td');
    sumCell.textContent = formatDuration(sum);
    row.appendChild(activityCell);
    row.appendChild(sumCell);
    tbody.appendChild(row);
  });
  table.appendChild(tbody);

  tableContainer.innerHTML = '';
  tableContainer.appendChild(table);
}