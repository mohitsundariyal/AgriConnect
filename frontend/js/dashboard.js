// If farmer is not logged in, send to login page
const farmerId = localStorage.getItem("id");
const farmerName = localStorage.getItem("name");

if (!farmerId) {
    window.location.href = "login.html";
}

// Show farmer name in welcome text
document.getElementById("welcomeText").textContent = "Welcome, " + farmerName;

// Logout: clear saved data and go to login page
document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.clear();
    window.location.href = "login.html";
});