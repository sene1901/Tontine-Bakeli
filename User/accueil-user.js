document.addEventListener("DOMContentLoaded", () => {
  const sidebarLinks = document.querySelectorAll('.sidebar a[data-page]'); // Tous les liens du sidebar
  const subLinks = document.querySelectorAll('.accordion-body a[data-page]'); // Sous-menus
  const content = document.getElementById("main-content");
  const navbarTitle = document.querySelector(".navbar .navbar-brand");

  // Fonction pour charger la page et mettre à jour le titre
  function loadPage(page, title = "") {
    fetch(page)
      .then(res => res.text())
      .then(data => {
        content.innerHTML = data;
        if (title) {
          navbarTitle.textContent = title;
        }
      })
      .catch(() => {
        content.innerHTML = "<p class='text-danger'>Erreur de chargement...</p>";
        navbarTitle.textContent = "Erreur";
      });
  }

  // ✅ Charger Dashboard par défaut
  loadPage("dashboard.html", "dashboard");

  // ✅ Gérer tous les liens du sidebar (Dashboard, Cotisations, Paramètres, etc.)
  sidebarLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const page = link.getAttribute("data-page");
      const title = link.textContent.trim(); // Utilise le texte du lien comme titre
      loadPage(page, title);
    });
  });

  // ✅ Gérer les sous-menus (Informations, Changer mot de passe, etc.)
  subLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const page = link.getAttribute("data-page");
      const title = link.textContent.trim(); // Garde aussi un titre clair
      loadPage(page, title);
    });
  });
});

