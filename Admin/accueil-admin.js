

// Sidebar toggle (mobile)
    document.getElementById("toggleSidebar").addEventListener("click", () => {
      document.getElementById("sidebar").classList.toggle("show");
    });

    // Exemple de Chart.js responsive
    // new Chart(document.getElementById('lineChart'), {
    //   type: 'line',
    //   data: {
    //     labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    //     datasets: [{label: 'Cotisations', data: [50, 10, 750, 120, 90, 15], borderColor: 'blue'}]
    //   },
    //   options: {responsive: true, maintainAspectRatio: false}
    // });

    new Chart(document.getElementById('doughnutChart'), {
      type: 'doughnut',
      data: {
        labels: ['Payé', 'Impayé'],
        datasets: [{data: [70, 30], backgroundColor: ['green','red']}]
      },
      options: {responsive: true, maintainAspectRatio: false}
    });
document.addEventListener("DOMContentLoaded", () => {
  const content = document.getElementById("main-content");
  const navbarTitle = document.querySelector(".navbar .navbar-brand");
  const sidebarLinks = document.querySelectorAll('.sidebar a[data-page]');
  const subLinks = document.querySelectorAll('.accordion-body a[data-page]');

  // 👉 Fonction pour charger une page dans #main-content
  function loadPage(page, title = "") {
    fetch(page)
      .then(res => res.text())
      .then(data => {
        content.innerHTML = data;
        if (title) navbarTitle.textContent = title;

        // ⚡ Charger dynamiquement le JS spécifique à la page (ex: user.js)
        if (page === "Users.html") {
          const script = document.createElement("script");
          script.src = "user.js";
          script.defer = true;
          document.body.appendChild(script);
        }
      })
      .catch(() => {
        content.innerHTML = "<p class='text-danger'>Erreur de chargement...</p>";
        navbarTitle.textContent = "Erreur";
      });
  }

  // ✅ Charger Dashboard par défaut
  loadPage("dashboard.html", "dashboard");

  // ✅ Sidebar (Dashboard, Utilisateurs, Cotisations)
  sidebarLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const page = link.getAttribute("data-page");
      const title = link.textContent.trim();
      loadPage(page, title);
    });
  });

  // ✅ Sous-menus (Paramètres, Archives…)
  subLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const page = link.getAttribute("data-page");
      const title = link.textContent.trim();
      loadPage(page, title);
    });
  });
});



 //  Graphique en ligne (évolution cotisations)
    //  Graphique en ligne (évolution cotisations)
    // const ctx1 = document.getElementById('lineChart');
    // new Chart(ctx1, {
    //   type: 'line',
    //   data: {
    //     labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet'],
    //     datasets: [{
    //       label: 'Cotisations (en milliers)',
    //       data: [0, 40, 35, 38, 50, 40, 60],
    //       borderColor: '#15cc95',
    //       backgroundColor: 'rgba(34, 197, 94, 0.2)',
    //       fill: true,
    //       tension: 0.3
    //     }]
    //   },
    //   options: {
    //     responsive: true,
    //     plugins: { legend: { display: false } },
    //     scales: {
    //       y: { beginAtZero: true }
    //     }
    //   }
    // });

    // //  Graphique Doughnut (statistiques)
    // const ctx2 = document.getElementById('doughnutChart');
    // new Chart(ctx2, {
    //   type: 'doughnut',
    //   data: {
    //     labels: ['Terminé', 'En cours', 'Archivé', 'Bloqué'],
    //     datasets: [{
    //       data: [49.48, 23.62, 9.04, 18],
    //       backgroundColor: ['#198754', '#0dcaf0', '#f87171', '#facc15']
    //     }]
    //   },
    //   options: {
    //     responsive: true,
    //     plugins: {
    //       legend: {
    //         position: 'bottom'
    //       }
    //     }
    //   }
    // });














// Import Firebase depuis CDN
  // import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  // import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

  // // 🔹 Configuration Firebase (⚠️ remplace par ton propre config)
  // const firebaseConfig = {
  //   apiKey: "TA_CLE_API",
  //   authDomain: "ton-projet.firebaseapp.com",
  //   projectId: "ton-projet",
  //   storageBucket: "ton-projet.appspot.com",
  //   messagingSenderId: "TON_ID",
  //   appId: "TON_APP_ID"
  // };

  // // Initialisation Firebase
  // const app = initializeApp(firebaseConfig);
  // const db = getFirestore(app);

  // // Variables globales
  // let data = [];
  // const rowsPerPage = 4; // 🔹 Nombre de lignes par page
  // let currentPage = 1;
  // let totalPages = 1;

  // // Charger les données depuis Firestore
  // async function loadData() {
  //   const querySnapshot = await getDocs(collection(db, "cotisations"));
  //   data = querySnapshot.docs.map(doc => doc.data());

  //   totalPages = Math.ceil(data.length / rowsPerPage);
  //   displayTables(currentPage);
  // }

  // // Affichage des tableaux
  // function displayTables(page) {
  //   const start = (page - 1) * rowsPerPage;
  //   const end = start + rowsPerPage;
  //   const pageData = data.slice(start, end);

  //   // Tableau Juin
  //   const juinTable = document.getElementById("juinTable");
  //   juinTable.innerHTML = "";
  //   pageData.forEach(row => {
  //     const tr = document.createElement("tr");
  //     tr.innerHTML = `
  //       <td>${row.membre}</td>
  //       <td>${row.montant} FCFA</td>
  //       <td>${row.date}</td>
  //       <td>
  //         <span class="badge ${row.statut === "Validé" ? "bg-success" : "bg-warning text-dark"}">
  //           ${row.statut}
  //         </span>
  //       </td>
  //     `;
  //     juinTable.appendChild(tr);
  //   });

  //   // Tableau progression
  //   const progressTable = document.getElementById("progressTable");
  //   progressTable.innerHTML = "";
  //   pageData.forEach(row => {
  //     const tr = document.createElement("tr");
  //     tr.innerHTML = `
  //       <td>${row.membre}</td>
  //       <td>${row.date}</td>
  //       <td>
  //         <div class="progress">
  //           <div class="progress-bar ${row.progression >= 70 ? "bg-success" : "bg-info"}" 
  //                style="width: ${row.progression}%;">
  //             ${row.progression}%
  //           </div>
  //         </div>
  //       </td>
  //     `;
  //     progressTable.appendChild(tr);
  //   });

  //   renderPagination();
  // }

  // // Pagination
  // function renderPagination() {
  //   const pagination = document.getElementById("pagination");
  //   pagination.innerHTML = "";

  //   // Previous
  //   pagination.innerHTML += `
  //     <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
  //       <a class="page-link" href="#" onclick="window.changePage(${currentPage - 1})">Previous</a>
  //     </li>
  //   `;

  //   // Numéros de pages
  //   for (let i = 1; i <= totalPages; i++) {
  //     pagination.innerHTML += `
  //       <li class="page-item ${i === currentPage ? "active" : ""}">
  //         <a class="page-link" href="#" onclick="window.changePage(${i})">${i}</a>
  //       </li>
  //     `;
  //   }

  //   // Next
  //   pagination.innerHTML += `
  //     <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
  //       <a class="page-link" href="#" onclick="window.changePage(${currentPage + 1})">Next</a>
  //     </li>
  //   `;
  // }

  // // Changer de page
  // window.changePage = function(page) {
  //   if (page < 1 || page > totalPages) return;
  //   currentPage = page;
  //   displayTables(currentPage);
  // };

  // // Lancer le chargement
  // loadData();
    