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

// ---------- Water Reminders ----------
const BASE_URL = "http://localhost:8080";
const remindersSummary = document.getElementById("remindersSummary");
const remindersList = document.getElementById("remindersList");

async function api(path, method = "GET", body = null) {
    const response = await fetch(BASE_URL + path, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : null
    });
    if (!response.ok) {
        const error = new Error("HTTP " + response.status);
        error.status = response.status;
        throw error;
    }
    return response.json().catch(() => ({}));
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text ?? "";
    return div.innerHTML;
}

function formatStatus(item) {
    if (item.status === "OVERDUE") {
        return `Overdue by ${item.daysOverdue} day(s)`;
    } else if (item.status === "DUE_TODAY") {
        return "Due today";
    } else if (item.status === "NOT_RECORDED") {
        return "Not recorded yet";
    } else if (item.status === "UPCOMING") {
        return `Next watering: ${escapeHtml(item.nextWateringDate || "-")}`;
    }
    return escapeHtml(item.status || "");
}

function getStatusClass(status) {
    switch (status) {
        case "OVERDUE": return "status-overdue";
        case "DUE_TODAY": return "status-due-today";
        case "UPCOMING": return "status-upcoming";
        case "NOT_RECORDED": return "status-not-recorded";
        default: return "";
    }
}

async function loadReminders() {
    try {
        const reminders = await api("/api/reminders/watering/farmer/" + farmerId);

        if (reminders.length === 0) {
            remindersSummary.textContent = "No crops yet. Add crops from the My Crops page.";
            remindersList.innerHTML = '<p class="empty-reminders">No crops found.</p>';
            return;
        }

        const needWaterCount = reminders.filter(function (r) {
            return r.status === "OVERDUE" || r.status === "DUE_TODAY" || r.status === "NOT_RECORDED";
        }).length;

        remindersSummary.textContent = `${needWaterCount} crop(s) need water`;

        remindersList.innerHTML = reminders.map(function (item) {
            const statusText = formatStatus(item);
            const statusClass = getStatusClass(item.status);
            const lastWateredText = item.lastWateredDate
                ? `<p>Last watered: ${escapeHtml(item.lastWateredDate)}</p>`
                : "";

            return `
                <div class="reminder-card ${statusClass}">
                    <div class="reminder-info">
                        <h4>${escapeHtml(item.cropName)}</h4>
                        <p>Farm: ${escapeHtml(item.farmName || "-")}</p>
                        <p class="reminder-status">Status: ${statusText}</p>
                        ${lastWateredText}
                    </div>
                    <button class="btn-water" data-id="${item.cropId}">Mark as watered</button>
                </div>`;
        }).join("");

    } catch (error) {
        remindersSummary.textContent = "Could not load reminders. Is the backend running?";
        remindersList.innerHTML = "";
    }
}

remindersList.addEventListener("click", async function (event) {
    const button = event.target.closest("button.btn-water");
    if (!button) return;

    const cropId = button.dataset.id;
    button.disabled = true;
    button.textContent = "Updating...";

    try {
        await api("/api/reminders/watering/crop/" + cropId + "/done", "POST");
        loadReminders();
    } catch (error) {
        alert("Could not mark crop as watered. Please try again.");
        button.disabled = false;
        button.textContent = "Mark as watered";
    }
});

loadReminders();