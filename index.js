import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
  import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
  import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

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

  const loginForm = document.querySelector("#loginForm");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      // 1. Authentification
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Récupérer le rôle dans Firestore
      const docRef = doc(db, "utilisateurs", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const role = docSnap.data().role || "utilisateur";

        // 3. Redirection selon le rôle
        if (role.toLowerCase() === "admin") {
          window.location.href = "/Admin/accueil-admin.html";
        } else  {
          window.location.href = "/User/accueil-user.html";
        }
      } else {
        alert("Aucun document utilisateur trouvé !");
      }

    } catch (error) {
      alert("Erreur : " + error.message);
    }
  });
