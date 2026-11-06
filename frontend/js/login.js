// Backend URL
const BASE_URL = "http://localhost:8080";

// Get HTML elements
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitBtn = document.getElementById("submitBtn");
const formMessage = document.getElementById("formMessage");

// Show message on the page (type = "success" or "error")
function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = "message " + type;
}

// Runs when the Login button is clicked
loginForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // stop page reload

    const loginData = {
        email: emailInput.value.trim(),
        password: passwordInput.value
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Logging in...";

    try {
        const response = await fetch(BASE_URL + "/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginData)
        });

        if (response.ok) {
            const data = await response.json();

            // Save farmer details (used later in other pages)
            localStorage.setItem("id", data.id);
            localStorage.setItem("name", data.name);
            localStorage.setItem("email", data.email);

            showMessage("Login successful! Redirecting...", "success");

            setTimeout(function () {
                window.location.href = "dashboard.html";
            }, 1000);

        } else if (response.status === 401) {
            showMessage("Invalid email or password", "error");
        } else if (response.status === 400) {
            showMessage("Please enter a valid email and password", "error");
        } else {
            showMessage("Server error. Please try again.", "error");
        }

    } catch (error) {
        // Happens when backend is off or CORS is blocking
        showMessage("Cannot connect to server. Is the backend running?", "error");
    }

    submitBtn.disabled = false;
    submitBtn.textContent = "Login";
});