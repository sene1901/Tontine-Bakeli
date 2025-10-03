// ==================== IMPORTS FIREBASE ====================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { 
  getFirestore, collection, doc, setDoc, query, where, orderBy, onSnapshot, updateDoc 
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// ==================== CONFIG FIREBASE ====================
const firebaseConfig = {
  apiKey: "AIzaSyD1gEj4mV2hRaJImHW1IsyQjZ1uEusY-bM",
  authDomain: "tontine-bakeli.firebaseapp.com",
  projectId: "tontine-bakeli",
  storageBucket: "tontine-bakeli.appspot.com",
  messagingSenderId: "542050089083",
  appId: "1:542050089083:web:41426bb7f5c41c496acade"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ==================== VARIABLES GLOBALES ====================
const content = document.getElementById("main-content");
const navbarTitle = document.querySelector(".navbar .navbar-brand");

// ==================== TOGGLE STATUT ====================
async function toggleStatut(userId, currentStatut) {
  const ref = doc(db, "utilisateurs", userId);
  const newStatut = currentStatut === "Bloqué" ? "Actif" : "Bloqué";
  try {
    await updateDoc(ref, { statut: newStatut });
    console.log(`✅ Utilisateur ${userId} mis à jour en ${newStatut}`);
  } catch (err) {
    console.error("❌ Erreur toggle statut :", err);
  }
}
window.toggleStatut = toggleStatut; // export global pour onclick()

// ==================== FORMULAIRE ====================
function initUserForm() {
  const form = document.getElementById("form-user");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nom = document.getElementById("nom").value.trim();
    const prenom = document.getElementById("prenom").value.trim();
    const dateNaissance = document.getElementById("date").value;
    const profession = document.getElementById("profession").value.trim();
    const email = document.getElementById("userEmail").value.trim();
    const telephone = document.getElementById("telephone").value.trim();
    const adresse = document.getElementById("adress").value.trim();

    if (!nom || !prenom || !email || !dateNaissance) {
      alert("Merci de remplir les champs obligatoires !");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, "motdepasse123");
      const user = userCredential.user;

      await setDoc(doc(db, "utilisateurs", user.uid), {
        nom, prenom, dateNaissance, profession, email, telephone, adresse,
        role: "user",
        dateDebut: new Date().toISOString().slice(0, 10),
        statut: "Actif",
        createdAt: new Date()
      });

      form.reset();

      const modalEl = document.getElementById("ajouterModal");
      if (modalEl) {
        const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modal.hide();
      }

      alert("Ajout réussi !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout : " + err.message);
    }
  });
}

// ==================== SWITCH TABLEAU CARTES ====================
function attachCardEvents() {
  const cards = document.querySelectorAll('.card-stats');
  const tables = document.querySelectorAll('.table-container');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      tables.forEach(t => t.classList.add('d-none'));
      const table = document.getElementById('table-' + card.dataset.table);
      if (table) table.classList.remove('d-none');
    });
  });
}

// ==================== USERS EN TEMPS RÉEL ====================
function initRealtimeUsers() {
  const tbodyActifs = document.getElementById("tbody-actifs");
  const tbodyBloques = document.getElementById("tbody-bloques");
  const tbodyTous = document.getElementById("tbody-tous");

  const cardActifs = document.querySelector('.card-stats[data-table="actifs"]');
  const cardBloques = document.querySelector('.card-stats[data-table="bloques"]');
  const cardTous = document.querySelector('.card-stats[data-table="tous"]');

  if (!tbodyActifs || !tbodyBloques || !tbodyTous) return;

  // 🔹 Écoute Firestore en temps réel
  const q = query(collection(db, "utilisateurs"), orderBy("createdAt", "asc"));
  onSnapshot(q, (snap) => {
    const allUsers = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    renderTables(allUsers);
    updateCards(allUsers);
  });

  function renderTables(users) {
    tbodyActifs.innerHTML = "";
    tbodyBloques.innerHTML = "";
    tbodyTous.innerHTML = "";

    users.forEach(user => {
      const baseRow = `
        <td>${user.prenom || ""} ${user.nom || ""}</td>
        <td>${user.dateDebut || "-"}</td>
        <td>${user.seuil || 300000} FCFA</td>
        <td>
          <div class="progress">
            <div class="progress-bar bg-success" style="width:${user.progression || 0}%"></div>
          </div>
          ${user.progression || 0}%
        </td>
        <td class="${user.statut === 'Bloqué' ? 'statut-bloque' : 'statut-actif'}">
          ${user.statut || "En cours"}
        </td>
        <td>
          <i class="bi bi-eye me-2" title="Voir"></i>
          <i class="bi bi-pencil-square me-2" title="Modifier"></i>
          <i class="bi bi-trash me-2 text-danger" title="Supprimer"></i>
          <i class="bi ${user.statut === 'Bloqué' ? 'bi-unlock' : 'bi-slash-circle'} text-danger" 
             style="cursor:pointer" 
             title="${user.statut === 'Bloqué' ? 'Débloquer' : 'Bloquer'}"
             onclick="toggleStatut('${user.id}', '${user.statut || "Actif"}')">
          </i>
        </td>
      `;

      // Tous
      const trTous = document.createElement("tr");
      trTous.innerHTML = baseRow;
      tbodyTous.appendChild(trTous);

      // Actifs
      if (user.statut !== "Bloqué") {
        const trActif = document.createElement("tr");
        trActif.innerHTML = baseRow;
        tbodyActifs.appendChild(trActif);
      }

      // Bloqués
      if (user.statut === "Bloqué") {
        const trBloque = document.createElement("tr");
        trBloque.innerHTML = baseRow;
        tbodyBloques.appendChild(trBloque);
      }
    });
  }
  
  function updateCards(users) {
    cardActifs.querySelector("h3").textContent = users.filter(u => u.statut !== "Bloqué").length + " Membres";
    cardBloques.querySelector("h3").textContent = users.filter(u => u.statut === "Bloqué").length + " Membres";
    cardTous.querySelector("h3").textContent = users.length + " Membres";
  }

  // Filtrage par carte
  function showTable(table) {
    tbodyActifs.parentElement.classList.add("d-none");
    tbodyBloques.parentElement.classList.add("d-none");
    tbodyTous.parentElement.classList.add("d-none");

    if (table === "actifs") tbodyActifs.parentElement.classList.remove("d-none");
    if (table === "bloques") tbodyBloques.parentElement.classList.remove("d-none");
    if (table === "tous") tbodyTous.parentElement.classList.remove("d-none");
  }

  cardActifs.addEventListener("click", () => showTable("actifs"));
  cardBloques.addEventListener("click", () => showTable("bloques"));
  cardTous.addEventListener("click", () => showTable("tous"));

  showTable("tous"); // affichage par défaut
}

// ==================== CHARTS ====================
function initCharts() {
  const ctx1 = document.getElementById('lineChart');
  if (ctx1) {
    new Chart(ctx1, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{ 
          label: 'Cotisations', 
          data: [0, 40, 35, 38, 50, 40, 60], 
          borderColor: '#15cc95', 
          backgroundColor: 'rgba(34,197,94,0.2)', 
          fill: true, 
          tension: 0.3 
        }]
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
        datasets: [{ 
          data: [49.48, 23.62, 95.04, 88], 
          backgroundColor: ['#198754','#0dcaf0','#8e71f8ff','#facc15'] 
        }]
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
  }
}

// ==================== CHARGEMENT DYNAMIQUE DES PAGES ====================
async function loadPage(page, title = "") {
  try {
    const res = await fetch(page);
    if (!res.ok) throw new Error("Page non trouvée : " + page);
    const html = await res.text();
    content.innerHTML = html;

    if (title) navbarTitle.textContent = title;

    attachCardEvents();
    initUserForm();
    initRealtimeUsers();
    initCharts(); // ✅ correction : appel des graphiques
  } catch (err) {
    console.error("Erreur de chargement :", err);
    content.innerHTML = "<p class='text-danger'>Erreur de chargement...</p>";
    navbarTitle.textContent = "Erreur";
  }
}

// ==================== SIDEBAR ====================
document.querySelectorAll('.sidebar a[data-page]').forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    loadPage(link.dataset.page, link.textContent.trim());
  });
});

// ==================== CHARGEMENT PAR DÉFAUT ====================
loadPage("dashboard.html", "Dashboard"); // ✅ nom correct du fichier
