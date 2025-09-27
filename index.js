// Import Firebase
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyD1gEj4mV2hRaJImHW1IsyQjZ1uEusY-bM",
    authDomain: "tontine-bakeli.firebaseapp.com",
    projectId: "tontine-bakeli",
    storageBucket: "tontine-bakeli.appspot.com",
    messagingSenderId: "542050089083",
    appId: "1:542050089083:web:41426bb7f5c41c496acade"
  }

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Gestion du formulaire de connexion
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  console.log("Email :", email);
console.log("Password :", password);

  try {
    // Connexion Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Vérifier rôle dans Firestore
    const userDoc = await getDoc(doc(db, "user", user.uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      const role = data.role;

      if (role === "admin") {
        window.location.href = "Admin/accueil-admin.html";
        console.log("Utilisateur connecté :", user.uid1, email);
      } else {
        window.location.href = "User/accueil-user.html";
        console.log("Utilisateur connecté :", user.uid2, email);
      }
    } else {
      alert("Utilisateur non trouvé dans la base de données !");
    }
  } catch (error) {
    alert("Erreur : " + error.message);
  }
});
