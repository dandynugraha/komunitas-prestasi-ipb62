// LOAD PAGE FUNCTION
function loadPage(page) {
    const container = document.getElementById("mainContent");

    container.innerHTML = "<p>Loading...</p>";

    fetch(page)
        .then(res => res.text())
        .then(data => {
            container.innerHTML = data;
        })
        .catch(() => {
            container.innerHTML = "<p>Halaman tidak ditemukan ❌</p>";
        });
}

// HANDLE NAVIGATION
document.addEventListener("DOMContentLoaded", () => {

    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach(btn => {
        btn.addEventListener("click", function () {

            const page = this.getAttribute("data-page");

            // load page
            loadPage(page);

            // active state
            navItems.forEach(b => b.classList.remove("active-link"));
            this.classList.add("active-link");

            // auto close sidebar (mobile)
            const sidebar = document.getElementById("sidebar");
            if (sidebar) sidebar.classList.remove("show");
        });
    });

    // DEFAULT LOAD
    loadPage("pages/home-dashboard.html");
});

// TOGGLE SIDEBAR (HP)
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("show");
}

// LOGOUT
function logout() {
    if (confirm("Yakin mau logout?")) {
        localStorage.clear();
        window.location.href = "index.html";
    }
}
