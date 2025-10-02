// document.addEventListener("DOMContentLoaded", () => {
//   const sidebarLinks = document.querySelectorAll('.sidebar a[data-page]'); // Tous les liens du sidebar
//   const subLinks = document.querySelectorAll('.accordion-body a[data-page]'); // Sous-menus
//   const content = document.getElementById("main-content");
//   const navbarTitle = document.querySelector(".navbar .navbar-brand");

//   // Fonction pour charger la page et mettre à jour le titre
//   function loadPage(page, title = "") {
//     fetch(page)
//       .then(res => res.text())
//       .then(data => {
//         content.innerHTML = data;
//         if (title) {
//           navbarTitle.textContent = title;
//         }
//       })
//       .catch(() => {
//         content.innerHTML = "<p class='text-danger'>Erreur de chargement...</p>";
//         navbarTitle.textContent = "Erreur";
//       });
//   }

//   // ✅ Charger Dashboard par défaut
//   loadPage("cotisation-user.html", "cotisation");

//   // ✅ Gérer tous les liens du sidebar (Dashboard, Cotisations, Paramètres, etc.)
//   sidebarLinks.forEach(link => {
//     link.addEventListener("click", e => {
//       e.preventDefault();
//       const page = link.getAttribute("data-page");
//       const title = link.textContent.trim(); // Utilise le texte du lien comme titre
//       loadPage(page, title);
//     });
//   });

//   // ✅ Gérer les sous-menus (Informations, Changer mot de passe, etc.)
//   subLinks.forEach(link => {
//     link.addEventListener("click", e => {
//       e.preventDefault();
//       const page = link.getAttribute("data-page");
//       const title = link.textContent.trim(); // Garde aussi un titre clair
//       loadPage(page, title);
//     });
//   });
// });

  












document.addEventListener("DOMContentLoaded", () => {
  const sidebarLinks = document.querySelectorAll('.sidebar a[data-page]');
  const subLinks = document.querySelectorAll('.accordion-body a[data-page]');
  const content = document.getElementById("main-content");
  const navbarTitle = document.querySelector(".navbar .navbar-brand");

  // -----------------------------
  // Fonction pour charger une page
  // -----------------------------
  function loadPage(page, title = "") {
    fetch(page)
      .then(res => res.text())
      .then(data => {
        content.innerHTML = data;
        if (title) navbarTitle.textContent = title;

        // Initialiser les fonctionnalités spécifiques à certaines pages
        if (page === "cotisation-user.html") {
          initCotisationPage();
        }
      })
      .catch(() => {
        content.innerHTML = "<p class='text-danger'>Erreur de chargement...</p>";
        navbarTitle.textContent = "Erreur";
      });
  }

  // -----------------------------
  // Charger Dashboard par défaut
  // -----------------------------
  loadPage("cotisation-user.html", "Cotisations");

  // -----------------------------
  // Gestion des liens du sidebar
  // -----------------------------
  sidebarLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const page = link.getAttribute("data-page");
      const title = link.textContent.trim();
      loadPage(page, title);
    });
  });

  // -----------------------------
  // Gestion des sous-menus
  // -----------------------------
  subLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const page = link.getAttribute("data-page");
      const title = link.textContent.trim();
      loadPage(page, title);
    });
  });

  // -----------------------------
  // Fonction pour initialiser la page Cotisations
  // -----------------------------
  function initCotisationPage() {
    const jeCotiseBtn = document.getElementById('jeCotiseBtn');
    const cotisationModal = new bootstrap.Modal(document.getElementById('cotisationModal'));
    const cotisationForm = document.getElementById('cotisationForm');
    const tableBody = document.getElementById("table-body");
    const pagination = document.getElementById("pagination");

    let currentPage = 1;
    const totalPages = 4;
    const rowsPerPage = 5;

    // Ouvrir le modal
    if (jeCotiseBtn) {
      jeCotiseBtn.addEventListener('click', () => cotisationModal.show());
    }

    // Soumission du formulaire
    if (cotisationForm) {
      cotisationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const date = document.getElementById('cotisationDate').value;
        const montant = document.getElementById('cotisationMontant').value;

        if (!date || !montant) {
          alert("Veuillez remplir la date et le montant !");
          return;
        }

        console.log("Cotisation ajoutée :", { date, montant });
        cotisationForm.reset();
        cotisationModal.hide();
        alert(`Cotisation de ${montant} ajoutée le ${date}`);
      });
    }

    // Remplir le tableau
    function renderTable(page) {
      tableBody.innerHTML = "";
      for (let i = 0; i < rowsPerPage; i++) {
        const row = `
          <tr>
            <td class="text-center text-muted"></td>
            <td class="text-center text-muted"></td>
            <td class="text-center text-muted"></td>
            <td class="text-center text-muted"></td>
            <td>
              <i class="fa-regular fa-eye me-2"></i>
              <i class="fa-solid fa-pen-to-square"></i>
            </td>
          </tr>`;
        tableBody.innerHTML += row;
      }
    }

    // Pagination
    function updatePagination(page) {
      if (page === "prev" && currentPage > 1) currentPage--;
      else if (page === "next" && currentPage < totalPages) currentPage++;
      else if (!isNaN(page)) currentPage = parseInt(page);

      pagination.querySelectorAll(".page-item").forEach(item => item.classList.remove("active"));
      pagination.querySelectorAll(".page-item").forEach(item => {
        const link = item.querySelector("a");
        if (link && link.dataset.page == currentPage) item.classList.add("active");
      });

      renderTable(currentPage);
    }

    if (pagination) {
      pagination.addEventListener("click", function (e) {
        e.preventDefault();
        if (e.target.tagName === "A") updatePagination(e.target.dataset.page);
      });
    }

    // Initialiser le tableau
    renderTable(currentPage);
  }
});
