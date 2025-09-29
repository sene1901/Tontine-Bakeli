import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

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

const resetForm = document.getElementById("resetForm");
const messageDiv = document.getElementById("message");

resetForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("identifiant").value;

  try{
    await sendPasswordResetEmail(auth, email);
    messageDiv.innerHTML = `<span class="text-success">Mail envoyé à ${email}</span>`;
    setTimeout(()=>{ window.location.href="/index.html"; }, 3000);
  } catch(error){
    messageDiv.innerHTML = `<span class="text-danger">Erreur : ${error.message}</span>`;
  }
});