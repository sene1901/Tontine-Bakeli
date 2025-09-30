// let notifCount = 0; // compteur notifications

// // Fonction pour ajouter une notification
// function addNotification(message) {
//   notifCount++;
//   document.getElementById("notif-count").textContent = notifCount;

//   // Afficher le toast
//   const toastEl = document.getElementById("notification-toast");
//   toastEl.querySelector(".toast-body").textContent = message;
//   const toast = new bootstrap.Toast(toastEl);
//   toast.show();
// }

// // Quand on clique sur la cloche, réinitialiser le compteur
// const bellBtn = document.getElementById("btn-bell");
// bellBtn.addEventListener("click", () => {
//   notifCount = 0;
//   document.getElementById("notif-count").textContent = notifCount;
// });
// import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
// import { getFirestore, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// // 🔹 Initialisation Firebase
// // (Suppose que Firebase est déjà initialisé dans un autre fichier, sinon répéter config)
// const db = getFirestore();
// const auth = getAuth();

// // 🔹 Badge et toast
// const notifCountEl = document.getElementById("notif-count");
// let notifCount = 0;

// const toastEl = document.getElementById("notification-toast");
// const toastBody = document.getElementById("toast-body");
// const bsToast = new bootstrap.Toast(toastEl);

// // 🔹 Écoute temps réel pour nouvelles notifications
// const notifCollection = collection(db, "notifications");
// const notifQuery = query(notifCollection, orderBy("createdAt", "desc"));

// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     // Écoute notifications seulement pour l'utilisateur connecté
//     onSnapshot(notifQuery, (snapshot) => {
//       snapshot.docChanges().forEach((change) => {
//         if (change.type === "added") {
//           const data = change.doc.data();
//           if (data.userId === user.uid) {
//             // Afficher toast
//             toastBody.textContent = data.message;
//             bsToast.show();

//             // Incrémenter badge
//             notifCount++;
//             notifCountEl.textContent = notifCount;
//           }
//         }
//       });
//     });
//   }
// });

// // 🔹 Fonction pour créer une notification (à appeler depuis d'autres fichiers)
// export async function createNotification(userId, message) {
//   await addDoc(notifCollection, {
//     userId,
//     message,
//     read: false,
//     createdAt: serverTimestamp()
//   });
// }

// // 🔹 Réinitialiser le compteur quand on clique sur la cloche
// const bellBtn = document.getElementById("btn-bell");
// if (bellBtn) {
//   bellBtn.addEventListener("click", () => {
//     notifCount = 0;
//     notifCountEl.textContent = notifCount;
//   });
// }

