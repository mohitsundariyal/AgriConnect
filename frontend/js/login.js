// Backend API Base URL for Login
// (Note: Backend route aapke API ke mutabik change kar sakte hain, jaise /api/auth/login)
const API_URL = "http://localhost:8080/api/auth/login";

const loginForm = document.getElementById("loginForm");
const formMessage = document.getElementById("formMessage");
const submitBtn = document.getElementById("submitBtn");

function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = `message ${type}`;
}

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    formMessage.className = "message hidden";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const requestData = { email, password };

    try {
        submitBtn.disabled = true;
        submitBtn.textContent = "Logging in...";

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();

        if (response.ok) {
            // Success hone par user ki details localStorage me save karein
            // (Zyadatar backend login par id aur name return karta hai)
            if (data.id) localStorage.setItem("id", data.id);
            if (data.name) localStorage.setItem("name", data.name);

            showMessage("Login successful! Redirecting...", "success");

            // Dashboard par redirect karein
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
        } else {
            showMessage(data.message || "Invalid email or password.", "error");
            submitBtn.disabled = false;
            submitBtn.textContent = "Login";
        }
    } catch (error) {
        console.error("Connection Error:", error);
        showMessage("Unable to connect to the server.", "error");
        submitBtn.disabled = false;
        submitBtn.textContent = "Login";
    }
});