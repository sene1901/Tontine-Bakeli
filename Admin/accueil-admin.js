import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, query, where, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

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
      const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      modal.hide();

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

// ==================== REALTIME USERS (corrigé) ====================
function initRealtimeUsers() {
  const tbodyActifs = document.getElementById("tbody-actifs");
  const tbodyBloques = document.getElementById("tbody-bloques");
  const tbodyTous = document.getElementById("tbody-tous");
  const cardActifs = document.querySelector('.card-stats[data-table="actifs"] h3');
  const cardBloques = document.querySelector('.card-stats[data-table="bloques"] h3');
  const cardTous = document.querySelector('.card-stats[data-table="tous"] h3');

  if (!tbodyActifs || !tbodyBloques || !tbodyTous) {
    console.error("⚠️ Les tbody (#tbody-actifs, #tbody-bloques, #tbody-tous) n'existent pas dans le HTML !");
    return;
  }

  // Requête sans where au début pour être sûr d'avoir des résultats
  const q = query(
    collection(db, "utilisateurs"),
    orderBy("createdAt", "asc")
  );

  onSnapshot(q, (snap) => {
    console.log("📡 Nombre de docs Firestore récupérés :", snap.size);

    tbodyActifs.innerHTML = "";
    tbodyBloques.innerHTML = "";
    tbodyTous.innerHTML = "";

    let countActifs = 0;
    let countBloques = 0;

    snap.forEach(docSnap => {
      const data = { id: docSnap.id, ...docSnap.data() };
      console.log("➡️ Utilisateur :", data);

      const trTous = document.createElement("tr");
      trTous.innerHTML = `
        <td>${data.prenom || ""} ${data.nom || ""}</td>
        <td>${data.dateDebut || "-"}</td>
        <td>${data.seuil || 300000} FCFA</td>
        <td>${data.progression || 0}%</td>
        <td class="${data.statut === 'Bloqué' ? 'statut-bloque' : 'statut-actif'}">
          ${data.statut || "En cours"}
        </td>
        <td>
          <button class="btn btn-sm btn-primary me-1"><i class="bi bi-eye"></i></button>
          <button class="btn btn-sm btn-success me-1"><i class="bi bi-save"></i></button>
          <button class="btn btn-sm btn-danger">
            <i class="bi ${data.statut === 'Bloqué' ? 'bi-unlock' : 'bi-slash-circle'}"></i>
          </button>
        </td>
      `;
      tbodyTous.appendChild(trTous);

      // Actifs
      if (data.statut !== "Bloqué") {
        const trActif = document.createElement("tr");
        trActif.innerHTML = `
          <td>${data.prenom || ""} ${data.nom || ""}</td>
          <td>${data.dateDebut || "-"}</td>
          <td>${data.seuil || 300000} FCFA</td>
          <td>${data.progression || 0}%</td>
          <td class="statut-actif">${data.statut || "Actif"}</td>
          <td>
            <button class="btn btn-sm btn-primary me-1"><i class="bi bi-eye"></i></button>
            <button class="btn btn-sm btn-success me-1"><i class="bi bi-save"></i></button>
            <button class="btn btn-sm btn-danger"><i class="bi bi-slash-circle"></i></button>
          </td>
        `;
        tbodyActifs.appendChild(trActif);
        countActifs++;
      }

      // Bloqués
      if (data.statut === "Bloqué") {
        const trTous = document.createElement("tr");
trTous.innerHTML = `
  <td>${data.prenom || ""} ${data.nom || ""}</td>
  <td>${data.dateDebut || "-"}</td>
  <td>${data.seuil || 300000} FCFA</td>
  <td>
    <div class="progress">
      <div class="progress-bar" style="width:${data.progression || 0}%"></div>
    </div>
    ${data.progression || 0}%
  </td>
  <td class="${data.statut === 'Bloqué' ? 'statut-bloque' : 'statut-actif'}">
    ${data.statut || "Actif"}
  </td>
  <td>
    <i class="bi bi-eye me-2" title="Voir"></i>
    <i class="bi bi-pencil-square me-2" title="Modifier"></i>
    <i class="bi bi-trash me-2" title="Supprimer"></i>
    <i class="bi ${data.statut === 'Bloqué' ? 'bi-unlock' : 'bi-slash-circle'} text-danger" 
       style="cursor:pointer" 
       title="${data.statut === 'Bloqué' ? 'Débloquer' : 'Bloquer'}"
       onclick="toggleStatut('${data.id}', '${data.statut || "Actif"}')">
    </i>
  </td>
`;

    //     const trBloque = document.createElement("tr");
    //     trBloque.innerHTML = `
    //       <td>${data.prenom || ""} ${data.nom || ""}</td>
    //       <td>${data.dateDebut || "-"}</td>
    //       <td>${data.seuil || 0} FCFA</td>
    //       <td class="statut-bloque">${data.statut}</td>
    //       <td>
    //         <i class="bi bi-eye me-2" title="Voir"></i>
    // <i class="bi bi-pencil-square me-2" title="Modifier"></i>
    // <i class="bi bi-trash me-2" title="Supprimer"></i>
    // <i class="bi ${data.statut === 'Bloqué' ? 'bi-unlock' : 'bi-slash-circle'} text-danger" 
    //    style="cursor:pointer" 
    //    title="${data.statut === 'Bloqué' ? 'Débloquer' : 'Bloquer'}"
    //    onclick="toggleStatut('${data.id}', '${data.statut || "Actif"}')">
    //       </td>
    //     `;
    //     tbodyBloques.appendChild(trBloque);
    //     countBloques++;
      }
    });

    cardActifs.textContent = countActifs + " Membres";
    cardBloques.textContent = countBloques + " Membres";
    cardTous.textContent = snap.size + " Membres";
  });
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

    // Initialisations après injection HTML
    attachCardEvents();
    initCharts();
    initUserForm();
    initRealtimeUsers();
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
// ⚠️ Vérifie bien le nom de ton fichier (dashboard.html)
loadPage("dashbord.html", "Dashboard");