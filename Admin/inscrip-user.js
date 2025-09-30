// inscrip-user.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// Config Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyD1gEj4mV2hRaJImHW1IsyQjZ1uEusY-bM",
    authDomain: "tontine-bakeli.firebaseapp.com",
    projectId: "tontine-bakeli",
    storageBucket: "tontine-bakeli.appspot.com",
    messagingSenderId: "542050089083",
    appId: "1:542050089083:web:41426bb7f5c41c496acade"
  };

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('form-user');

    // Charger les utilisateurs et remplir les tableaux
    async function loadUsers() {
        const snapshot = await getDocs(collection(db, "utilisateurs"));
        const tbodyActifs = document.getElementById('tbody-actifs');
        const tbodyBloques = document.getElementById('tbody-bloques');
        const tbodyTous = document.getElementById('tbody-tous');

        tbodyActifs.innerHTML = "";
        tbodyBloques.innerHTML = "";
        tbodyTous.innerHTML = "";

        let actifsCount = 0;
        let bloquesCount = 0;

        snapshot.forEach(docSnap => {
            const user = docSnap.data();
            const userId = docSnap.id;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.nom} ${user.prenom}</td>
                <td>${user.dateNaissance || '-'}</td>
                <td>${user.seuil || '0 FCFA'}</td>
                <td>
                    <div class="progres">
                        <div class="progress" style="width:${user.progression || 0}%"></div>
                    </div>
                </td>
                <td class="${user.statut === 'bloque' ? 'statut-bloque' : 'statut-actif'}">${user.statut || 'actif'}</td>
                <td>
                    <button class="btn btn-sm btn-info btn-voir" data-id="${userId}"><i class="bi bi-eye"></i></button>
                    <button class="btn btn-sm btn-warning btn-modifier" data-id="${userId}"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-danger btn-bloquer" data-id="${userId}"><i class="bi bi-slash-circle"></i></button>
                </td>
            `;

            tbodyTous.appendChild(tr.cloneNode(true));

            if (user.statut === 'bloque') {
                tbodyBloques.appendChild(tr.cloneNode(true));
                bloquesCount++;
            } else {
                tbodyActifs.appendChild(tr.cloneNode(true));
                actifsCount++;
            }
        });

        // Mettre à jour les compteurs
        document.querySelector('.card-stats[data-table="actifs"] h3').textContent = `${actifsCount} Membres`;
        document.querySelector('.card-stats[data-table="bloques"] h3').textContent = `${bloquesCount} Membres`;
        document.querySelector('.card-stats[data-table="tous"] h3').textContent = `${snapshot.size} Membres`;

        // Ajouter les actions des boutons
        document.querySelectorAll('.btn-bloquer').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                await updateDoc(doc(db, "utilisateurs", id), { statut: 'bloque' });
                await loadUsers();
            });
        });

        document.querySelectorAll('.btn-modifier').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                alert(`Fonction modifier à implémenter pour ID : ${id}`);
            });
        });

        document.querySelectorAll('.btn-voir').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                alert(`Fonction voir à implémenter pour ID : ${id}`);
            });
        });
    }

    await loadUsers();

    // Gestion du formulaire
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nom = document.getElementById('nom').value.trim();
        const prenom = document.getElementById('prenom').value.trim();
        const dateNaissance = document.getElementById('date').value;
        const profession = document.getElementById('profession').value.trim();
        const email = document.getElementById('userEmail').value.trim();
        const telephone = document.getElementById('telephone').value.trim();
        const adresse = document.getElementById('adress').value.trim();
        const role = document.getElementById('role').value.trim();

        if (!nom || !prenom || !dateNaissance || !email) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Email invalide');
            return;
        }

        const telRegex = /^\d{9,10}$/;
        if (telephone && !telRegex.test(telephone)) {
            alert('Téléphone invalide');
            return;
        }

        try {
            // Inscrire l'utilisateur dans Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, "MotDePasseTemp123!");
            const uid = userCredential.user.uid;

            // Stocker les données dans Firestore
            const user = {
                uid,
                nom,
                prenom,
                dateNaissance,
                profession,
                email,
                telephone,
                adresse,
                role,
                seuil: '0 FCFA',
                progression: 0,
                statut: 'actif'
            };

            await addDoc(collection(db, "users"), user);

            form.reset();
            const modal = bootstrap.Modal.getInstance(document.getElementById('ajouterModal'));
            modal.hide();

            await loadUsers();
            alert('Utilisateur ajouté avec succès !');
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'inscription : " + error.message);
        }
    });
});
