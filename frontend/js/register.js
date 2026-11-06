// Backend URL
const BASE_URL = "http://localhost:8080";

// Get HTML elements
const registerForm = document.getElementById("registerForm");
const submitBtn = document.getElementById("submitBtn");
const formMessage = document.getElementById("formMessage");

// Show message on the page (type = "success" or "error")
function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = "message " + type;
}
// Runs when the Sign Up button is clicked
registerForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // stop page reload

    const farmerData = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value,
        phone: document.getElementById("phone").value.trim(),
        village: document.getElementById("village").value.trim()
    };

    // Same rule as backend: password at least 6 characters
    if (farmerData.password.length < 6) {
        showMessage("Password must be at least 6 characters long", "error");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Creating account...";

    try {
        const response = await fetch(BASE_URL + "/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(farmerData)
        });

        if (response.ok) {
            showMessage("Registration successful! Redirecting to login...", "success");

            setTimeout(function () {
                window.location.href = "login.html";
            }, 1500);

        } else if (response.status === 409) {
            showMessage("This email is already registered", "error");
        } else if (response.status === 400) {
            showMessage("Please check your details and try again", "error");
        } else {
            showMessage("Server error. Please try again.", "error");
        }

    } catch (error) {
        // Happens when backend is off or CORS is blocking
        showMessage("Cannot connect to server. Is the backend running?", "error");
    }

    submitBtn.disabled = false;
    submitBtn.textContent = "Sign Up";
});