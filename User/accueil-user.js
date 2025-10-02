import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

// ⚡️ Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD1gEj4mV2hRaJImHW1IsyQjZ1uEusY-bM",
  authDomain: "tontine-bakeli.firebaseapp.com",
  projectId: "tontine-bakeli",
  storageBucket: "tontine-bakeli.appspot.com",
  messagingSenderId: "542050089083",
  appId: "1:542050089083:web:41426bb7f5c41c496acade"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
  const sidebarLinks = document.querySelectorAll('.sidebar a[data-page]');
  const subLinks = document.querySelectorAll('.accordion-body a[data-page]');
  const content = document.getElementById("main-content");
  const navbarTitle = document.querySelector(".navbar .navbar-brand");

  // ----------------------------
  // Fonction pour charger une page
  // ----------------------------
  function loadPage(page, title = "") {
    fetch(page)
      .then(res => res.text())
      .then(data => {
        content.innerHTML = data;
        if (title) navbarTitle.textContent = title;

        // ⚡️ Réinitialiser les scripts spécifiques si on est sur cotisation
        if (page === "cotisation-user.html") {
          initCotisationPage();
        }
      })
      .catch(() => {
        content.innerHTML = "<p class='text-danger'>Erreur de chargement...</p>";
        navbarTitle.textContent = "Erreur";
      });
  }

  // Charger par défaut
  loadPage("cotisation-user.html", "Cotisations");

  // Sidebar
  sidebarLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const page = link.getAttribute("data-page");
      const title = link.textContent.trim();
      loadPage(page, title);
    });
  });

  // Sous-menus
  subLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const page = link.getAttribute("data-page");
      const title = link.textContent.trim();
      loadPage(page, title);
    });
  });

  // ----------------------------
  // Fonction Cotisations
  // ----------------------------
  function initCotisationPage() {
    const jeCotiseBtn = document.getElementById("jeCotiseBtn");
    const cotisationModal = new bootstrap.Modal(document.getElementById("cotisationModal"));
    const cotisationForm = document.getElementById("cotisationForm");
    const tableBody = document.getElementById("table-body");
    const pagination = document.getElementById("pagination");

    // Cartes
    const totalCotiseEl = document.getElementById("total-cotise");
    const nbCotisationsEl = document.getElementById("nb-cotisations");
    const montantRestantEl = document.getElementById("montant-restant");
    const nbRestantEl = document.getElementById("nb-cotisation-restant");
    const caisseTotalEl = document.getElementById("caisse-total");
    const caisseObjectifEl = document.getElementById("caisse-objectif");
    const caisseProgress = document.getElementById("caisse-progress");

    let cotisations = [];
    let currentPage = 1;
    const rowsPerPage = 3;
    const objectif = 240000;
    
  // Fonction pour obtenir le nom du mois
  function getMonthName(dateStr) {
    const mois = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    const d = new Date(dateStr);
    return mois[d.getMonth()];
  }
    // Bouton → Ouvrir modal
    if (jeCotiseBtn) {
      jeCotiseBtn.addEventListener("click", () => cotisationModal.show());
    }

    // Formulaire → Ajouter Firestore
    if (cotisationForm) {
      cotisationForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const date = document.getElementById("cotisationDate").value;
        const montant = parseFloat(document.getElementById("cotisationMontant").value);

        if (!date || !montant) return alert("Veuillez remplir la date et le montant");

        try {
          await addDoc(collection(db, "Cotisations"), {
            date,
            montant,
            createdAt: new Date(),
            userId: auth.currentUser ? auth.currentUser.uid : null
          });

          cotisationForm.reset();
          cotisationModal.hide();
        } catch (err) {
          console.error(err);
          alert("Erreur lors de l'ajout");
        }
      });
    }

    // 🔥 Récupérer en temps réel depuis Firestore
    onSnapshot(collection(db, "Cotisations"), (snapshot) => {
      cotisations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      renderTable(currentPage);
      updateCards();
    });

    // Tableau
    function renderTable(page) {
      tableBody.innerHTML = "";
      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage;
      const rows = cotisations.slice(start, end);

      rows.forEach((c, index) => {
        tableBody.innerHTML += `
          <tr>
           <td class="text-center">${getMonthName(c.date)}</td>
            <td class="">${c.date}</td>
            <td class="">${c.montant} FCFA</td>
            <td class=" text-success fw-bold  " >Payé</td>
            <td><i class="fa-regular fa-eye "></i><i class="fa-solid fa-pen-to-square"></i></td>
          </tr>`;
      });
    }

    // Cartes
    function updateCards() {
      const total = cotisations.reduce((s, c) => s + c.montant, 0);
      const nb = cotisations.length;
      const restant = objectif - total;

      totalCotiseEl.textContent = total + " FCFA";
      nbCotisationsEl.textContent = "Nombre de cotisations restantes : " + nb;
      montantRestantEl.textContent = restant + " FCFA";
     nbRestantEl.textContent = "Nombre de cotisations restantes : " + Math.max(1, Math.ceil(restant / 240000));

      caisseTotalEl.textContent = total;
      caisseObjectifEl.textContent = objectif;
      caisseProgress.style.width = Math.min(100, (total / objectif) * 100) + "%";
    }

    // Pagination
    if (pagination) {
      pagination.addEventListener("click", (e) => {
        e.preventDefault();
        if (e.target.tagName === "A") updatePagination(e.target.dataset.page);
      });
    }

    function updatePagination(page) {
      if (page === "prev" && currentPage > 1) currentPage--;
      else if (page === "next" && currentPage < Math.ceil(cotisations.length / rowsPerPage)) currentPage++;
      else if (!isNaN(page)) currentPage = parseInt(page);

      pagination.querySelectorAll(".page-item").forEach(item => item.classList.remove("active"));
      pagination.querySelectorAll(".page-item a").forEach(link => {
        if (link.dataset.page == currentPage) link.parentElement.classList.add("active");
      });

      renderTable(currentPage);
    }
  }
})