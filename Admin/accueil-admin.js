document.addEventListener("DOMContentLoaded", () => {
  // ==================== VARIABLES ====================
  const content = document.getElementById("main-content");
  const navbarTitle = document.querySelector(".navbar .navbar-brand");
  const sidebarLinks = document.querySelectorAll('.sidebar a[data-page]');
  const subLinks = document.querySelectorAll('.accordion-body a[data-page]');
  const rowsPerPage = 5;
  let currentPage = 1;

  // ==================== DONNÉES GLOBALES ====================
  window.dataJuin = [
    { membre: "Ali", montant: "50 000 FCFA", date: "01/06/2025", statut: "Payé" },
    { membre: "Fatou", montant: "40 000 FCFA", date: "02/06/2025", statut: "Payé" },
    { membre: "Moussa", montant: "30 000 FCFA", date: "03/06/2025", statut: "En attente" },
    { membre: "Mariama", montant: "25 000 FCFA", date: "04/06/2025", statut: "Payé" },
    { membre: "Ibrahima", montant: "45 000 FCFA", date: "05/06/2025", statut: "Payé" },
    { membre: "Awa", montant: "35 000 FCFA", date: "06/06/2025", statut: "En attente" },
    { membre: "Cheikh", montant: "20 000 FCFA", date: "07/06/2025", statut: "Payé" },
    { membre: "Ndeye", montant: "60 000 FCFA", date: "08/06/2025", statut: "Payé" }
  ];

  window.dataProgress = [
    { membre: "Ali", debut: "01/01/2025", progression: "70%" },
    { membre: "Fatou", debut: "05/01/2025", progression: "55%" },
    { membre: "Moussa", debut: "10/01/2025", progression: "40%" },
    { membre: "Mariama", debut: "12/01/2025", progression: "80%" },
    { membre: "Awa", debut: "15/01/2025", progression: "65%" },
    { membre: "Cheikh", debut: "20/01/2025", progression: "90%" },
    { membre: "Ibrahima", debut: "25/01/2025", progression: "75%" },
    { membre: "Ndeye", debut: "28/01/2025", progression: "60%" }
  ];

  // ==================== TABLES ====================
  function displayJuinTable(data, page) {
    const tableBody = document.getElementById("juinTable");
    if (!tableBody) return;
    tableBody.innerHTML = "";

    const start = (page - 1) * rowsPerPage;
    const paginatedData = data.slice(start, start + rowsPerPage);

    paginatedData.forEach(row => {
      tableBody.innerHTML += `
        <tr>
          <td>${row.membre}</td>
          <td>${row.montant}</td>
          <td>${row.date}</td>
          <td>${row.statut}</td>
        </tr>`;
    });
  }

  function displayProgressTable(data, page) {
    const tableBody = document.getElementById("progressTable");
    if (!tableBody) return;
    tableBody.innerHTML = "";

    const start = (page - 1) * rowsPerPage;
    const paginatedData = data.slice(start, start + rowsPerPage);

    paginatedData.forEach(row => {
      tableBody.innerHTML += `
        <tr>
          <td>${row.membre}</td>
          <td>${row.debut}</td>
          <td>${row.progression}</td>
        </tr>`;
    });
  }

  // ==================== PAGINATION ====================
  function createPagination(totalPages, callback) {
    const pagination = document.getElementById("pagination");
    if (!pagination) return;

    pagination.innerHTML = `
      <li class="page-item"><a class="page-link" href="#" id="prev">Précédent</a></li>
      ${Array.from({length: totalPages}, (_, i) => `<li class="page-item" data-page="${i+1}"><a class="page-link" href="#">${i+1}</a></li>`).join("")}
      <li class="page-item"><a class="page-link" href="#" id="next">Suivant</a></li>
    `;

    pagination.addEventListener("click", e => {
      e.preventDefault();
      const target = e.target;

      if (target.id === "prev" && currentPage > 1) currentPage--;
      else if (target.id === "next" && currentPage < totalPages) currentPage++;
      else if (target.closest("li[data-page]")) currentPage = parseInt(target.closest("li").dataset.page);

      callback(currentPage);
      updatePaginationUI(totalPages);
    });

    updatePaginationUI(totalPages);
  }

  function updatePaginationUI(totalPages) {
    const pagination = document.getElementById("pagination");
    if (!pagination) return;

    pagination.querySelectorAll("li").forEach(li => li.classList.remove("active", "disabled"));

    const activeLi = pagination.querySelector(`li[data-page="${currentPage}"]`);
    if (activeLi) activeLi.classList.add("active");

    if (currentPage === 1) pagination.querySelector("#prev")?.parentElement.classList.add("disabled");
    if (currentPage === totalPages) pagination.querySelector("#next")?.parentElement.classList.add("disabled");
  }

  // ==================== CARTES ====================
  function attachCardEvents() {
    const cards = document.querySelectorAll('.card-stats');
    const tables = document.querySelectorAll('.table-container');

    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        tables.forEach(t => t.classList.add('d-none'));
        const tableId = card.getAttribute('data-table');
        const table = document.getElementById('table-' + tableId);
        if (table) table.classList.remove('d-none');
      });
    });
  }

  // ==================== GRAPHIQUES ====================
  function initCharts() {
    const ctx1 = document.getElementById('lineChart');
    if (ctx1) {
      new Chart(ctx1, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [{ label: 'Cotisations', data: [0, 40, 35, 38, 50, 40, 60], borderColor: '#15cc95', backgroundColor: 'rgba(34,197,94,0.2)', fill: true, tension: 0.3 }]
        },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
      });
    }

    const ctx2 = document.getElementById('doughnutChart');
    if (ctx2) {
      new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: ['Terminé', 'En cours', 'Archivé', 'Bloqué'],
          datasets: [{ data: [49.48, 23.62, 95.04, 88], backgroundColor: ['#198754','#0dcaf0','#8e71f8ff','#facc15'] }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
      });
    }
  }

  // ==================== FORMULAIRE ====================
  function initUserForm() {
    const form = document.getElementById("form-user");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      alert("Formulaire soumis (à remplacer par ton code Firebase)");
      form.reset();
    });
  }

  // ==================== LOAD PAGE ====================
  async function loadPage(page, title = "") {
    try {
      const res = await fetch(page);
      if (!res.ok) throw new Error("Page non trouvée : " + page);
      const html = await res.text();
      content.innerHTML = html;
      if (title) navbarTitle.textContent = title;

      // Initialisations
      initCharts();
      attachCardEvents();
      initUserForm();

      // Pagination
      const dataJuin = window.dataJuin;
      const dataProgress = window.dataProgress;
      const totalPages = Math.max(
        Math.ceil(dataJuin.length / rowsPerPage),
        Math.ceil(dataProgress.length / rowsPerPage)
      );

      if (document.getElementById("juinTable") && document.getElementById("progressTable")) {
        currentPage = 1;
        displayJuinTable(dataJuin, currentPage);
        displayProgressTable(dataProgress, currentPage);
        createPagination(totalPages, page => {
          currentPage = page;
          displayJuinTable(dataJuin, page);
          displayProgressTable(dataProgress, page);
        });
      }
    } catch (err) {
      console.error("Erreur de chargement :", err);
      content.innerHTML = "<p class='text-danger'>Erreur de chargement...</p>";
      navbarTitle.textContent = "Erreur";
    }
  }

  // ==================== SIDEBAR ====================
  document.getElementById("toggleSidebar")?.addEventListener("click", () => {
    document.getElementById("sidebar")?.classList.toggle("show");
  });

  sidebarLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      loadPage(link.dataset.page, link.textContent.trim());
    });
  });

  subLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      loadPage(link.dataset.page, link.textContent.trim());
    });
  });

  // ==================== CHARGEMENT PAR DÉFAUT ====================
  loadPage("dashbord.html", "Dashboard");
});
