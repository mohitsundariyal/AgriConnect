// 1. Check if user is logged in (localStorage mein "id" check karo)
const userId = localStorage.getItem("id");

// 2. LocalStorage se farmer ka naam nikalo aur welcome message update karo
const farmerName = localStorage.getItem("name");
const welcomeText = document.getElementById("welcomeText");

if (farmerName) {
    welcomeText.textContent = `Welcome, ${farmerName}`;
} else {
    welcomeText.textContent = "Welcome, Farmer";
}

// 3. Logout button functionality
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", function() {
    // Sab kuch localStorage se saaf kar do
    localStorage.clear();
    // Login page par redirect kar do
    window.location.href = "login.html";
});