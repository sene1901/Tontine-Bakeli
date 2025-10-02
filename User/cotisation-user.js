// // const jeCotiseBtn = document.getElementById('jeCotiseBtn');
// //         const cotisationModal = new bootstrap.Modal(document.getElementById('cotisationModal'));
// //         const cotisationForm = document.getElementById('cotisationForm');
// //         const tableBody = document.getElementById("table-body");
// //         const pagination = document.getElementById("pagination");

// //         let currentPage = 1;
// //         const totalPages = 4;
// //         const rowsPerPage = 5;

// //         // Ouvrir modal quand on clique sur le bouton
// //         jeCotiseBtn.addEventListener('click', () => {
// //             cotisationModal.show();
// //         });

// //         // Soumission formulaire
// //         cotisationForm.addEventListener('submit', (e) => {
// //             e.preventDefault();
// //             const date = document.getElementById('cotisationDate').value;
// //             const montant = document.getElementById('cotisationMontant').value;

// //             if (!date || !montant) {
// //                 alert("Veuillez remplir la date et le montant !");
// //                 return;
// //             }

// //             console.log("Cotisation ajoutée :", { date, montant });

// //             cotisationForm.reset();
// //             cotisationModal.hide();
// //             alert(`Cotisation de ${montant} ajoutée le ${date}`);
// //         });

// //         // Fonction pour remplir le tableau vide
// //         function renderTable(page) {
// //             tableBody.innerHTML = "";
// //             for (let i = 0; i < rowsPerPage; i++) {
// //                 const row = `
// //                 <tr>
// //                     <td class="text-center text-muted"></td>
// //                     <td class="text-center text-muted"></td>
// //                     <td class="text-center text-muted"></td>
// //                     <td class="text-center text-muted"></td>
// //                     <td>
// //                         <i class="fa-regular fa-eye me-2"></i>
// //                         <i class="fa-solid fa-pen-to-square"></i>
// //                     </td>
// //                 </tr>`;
// //                 tableBody.innerHTML += row;
// //             }
// //         }

// //         // Pagination
// //         function updatePagination(page) {
// //             if (page === "prev" && currentPage > 1) currentPage--;
// //             else if (page === "next" && currentPage < totalPages) currentPage++;
// //             else if (!isNaN(page)) currentPage = parseInt(page);

// //             pagination.querySelectorAll(".page-item").forEach(item => item.classList.remove("active"));
// //             pagination.querySelectorAll(".page-item").forEach(item => {
// //                 const link = item.querySelector("a");
// //                 if (link && link.dataset.page == currentPage) item.classList.add("active");
// //             });

// //             renderTable(currentPage);
// //         }

// //         pagination.addEventListener("click", function (e) {
// //             e.preventDefault();
// //             if (e.target.tagName === "A") updatePagination(e.target.dataset.page);
// //         });

// //         // Initialisation
// //         renderTable(currentPage);export function init() {
//   const jeCotiseBtn = document.getElementById('jeCotiseBtn');
//   const cotisationModal = new bootstrap.Modal(document.getElementById('cotisationModal'));
//   const cotisationForm = document.getElementById('cotisationForm');
//   const tableBody = document.getElementById("table-body");
//   const pagination = document.getElementById("pagination");

//   let currentPage = 1;
//   const totalPages = 4;
//   const rowsPerPage = 5;

//   if (jeCotiseBtn) {
//     jeCotiseBtn.addEventListener('click', () => {
//       cotisationModal.show();
//     });
//   }

//   if (cotisationForm) {
//     cotisationForm.addEventListener('submit', (e) => {
//       e.preventDefault();
//       const date = document.getElementById('cotisationDate').value;
//       const montant = document.getElementById('cotisationMontant').value;

//       if (!date || !montant) {
//         alert("Veuillez remplir la date et le montant !");
//         return;
//       }

//       console.log("Cotisation ajoutée :", { date, montant });
//       cotisationForm.reset();
//       cotisationModal.hide();
//       alert(`Cotisation de ${montant} ajoutée le ${date}`);
//     });
//   }

//   function renderTable(page) {
//     tableBody.innerHTML = "";
//     for (let i = 0; i < rowsPerPage; i++) {
//       const row = `
//         <tr>
//           <td class="text-center text-muted"></td>
//           <td class="text-center text-muted"></td>
//           <td class="text-center text-muted"></td>
//           <td class="text-center text-muted"></td>
//           <td>
//             <i class="fa-regular fa-eye me-2"></i>
//             <i class="fa-solid fa-pen-to-square"></i>
//           </td>
//         </tr>`;
//       tableBody.innerHTML += row;
//     }
//   }

//   function updatePagination(page) {
//     if (page === "prev" && currentPage > 1) currentPage--;
//     else if (page === "next" && currentPage < totalPages) currentPage++;
//     else if (!isNaN(page)) currentPage = parseInt(page);

//     pagination.querySelectorAll(".page-item").forEach(item => item.classList.remove("active"));
//     pagination.querySelectorAll(".page-item").forEach(item => {
//       const link = item.querySelector("a");
//       if (link && link.dataset.page == currentPage) item.classList.add("active");
//     });

//     renderTable(currentPage);
//   }

//   if (pagination) {
//     pagination.addEventListener("click", function (e) {
//       e.preventDefault();
//       if (e.target.tagName === "A") updatePagination(e.target.dataset.page);
//     });
//   }

//   // Initialisation
//   renderTable(currentPage);

