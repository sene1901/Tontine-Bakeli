
    


    



//     // ==================== DONNÉES ====================
// const dataJuin = [
//   { membre: "Ali", montant: "50 000 FCFA", date: "01/06/2025", statut: "Payé" },
//   { membre: "Fatou", montant: "40 000 FCFA", date: "02/06/2025", statut: "Payé" },
//   { membre: "Moussa", montant: "30 000 FCFA", date: "03/06/2025", statut: "En attente" },
//   { membre: "Mariama", montant: "25 000 FCFA", date: "04/06/2025", statut: "Payé" },
//   { membre: "Ibrahima", montant: "45 000 FCFA", date: "05/06/2025", statut: "Payé" },
//   { membre: "Awa", montant: "35 000 FCFA", date: "06/06/2025", statut: "En attente" },
//   { membre: "Cheikh", montant: "20 000 FCFA", date: "07/06/2025", statut: "Payé" },
//   { membre: "Ndeye", montant: "60 000 FCFA", date: "08/06/2025", statut: "Payé" }
// ];

// const dataProgress = [
//   { membre: "Ali", debut: "01/01/2025", progression: "70%" },
//   { membre: "Fatou", debut: "05/01/2025", progression: "55%" },
//   { membre: "Moussa", debut: "10/01/2025", progression: "40%" },
//   { membre: "Mariama", debut: "12/01/2025", progression: "80%" },
//   { membre: "Awa", debut: "15/01/2025", progression: "65%" },
//   { membre: "Cheikh", debut: "20/01/2025", progression: "90%" },
//   { membre: "Ibrahima", debut: "25/01/2025", progression: "75%" },
//   { membre: "Ndeye", debut: "28/01/2025", progression: "60%" }
// ];

// // ==================== PAGINATION ====================
// let currentPage = 1;
// const rowsPerPage = 2;

// // Calcul du total de pages en fonction du tableau le plus long
// const totalPages = Math.max(
//   Math.ceil(dataJuin.length / rowsPerPage),
//   Math.ceil(dataProgress.length / rowsPerPage)
// );

// // ==================== FONCTIONS ====================
// function displayJuinTable(page) {
//   const tableBody = document.getElementById("juinTable");
//   tableBody.innerHTML = "";

//   let start = (page - 1) * rowsPerPage;
//   let end = start + rowsPerPage;
//   let paginatedData = dataJuin.slice(start, end);

//   for (let row of paginatedData) {
//     tableBody.innerHTML += `
//       <tr>
//         <td>${row.membre}</td>
//         <td>${row.montant}</td>
//         <td>${row.date}</td>
//         <td>${row.statut}</td>
//       </tr>`;
//   }
// }

// function displayProgressTable(page) {
//   const tableBody = document.getElementById("progressTable");
//   tableBody.innerHTML = "";

//   let start = (page - 1) * rowsPerPage;
//   let end = start + rowsPerPage;
//   let paginatedData = dataProgress.slice(start, end);

//   for (let row of paginatedData) {
//     tableBody.innerHTML += `
//       <tr>
//         <td>${row.membre}</td>
//         <td>${row.debut}</td>
//         <td>${row.progression}</td>
//       </tr>`;
//   }
// }

// function setupPagination() {
//   const pagination = document.getElementById("pagination");
//   pagination.innerHTML = "";

//   // Bouton "Précédent"
//   pagination.innerHTML += `
//     <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
//       <a class="page-link" href="#" id="prev">Précédent</a>
//     </li>`;

//   // Numéros des pages
//   for (let i = 1; i <= totalPages; i++) {
//     pagination.innerHTML += `
//       <li class="page-item ${i === currentPage ? 'active' : ''}">
//         <a class="page-link" href="#">${i}</a>
//       </li>`;
//   }

//   // Bouton "Suivant"
//   pagination.innerHTML += `
//     <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
//       <a class="page-link" href="#" id="next">Suivant</a>
//     </li>`;

//   // Événements sur les numéros
//   document.querySelectorAll("#pagination .page-link").forEach((btn, index) => {
//     btn.addEventListener("click", (e) => {
//       e.preventDefault();

//       if (btn.id === "prev" && currentPage > 1) {
//         currentPage--;
//       } else if (btn.id === "next" && currentPage < totalPages) {
//         currentPage++;
//       } else if (!isNaN(parseInt(btn.textContent))) {
//         currentPage = parseInt(btn.textContent);
//       }

//       updateTables();
//     });
//   });
// }

// // Met à jour les deux tables
// function updateTables() {
//   displayJuinTable(currentPage);
//   displayProgressTable(currentPage);
//   setupPagination();
// }

// // ==================== INITIALISATION ====================
// updateTables();