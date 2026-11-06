// ---------- Setup ----------
const BASE_URL = "http://localhost:8080";

// Farmer must be logged in
const farmerId = localStorage.getItem("id");
if (!farmerId) {
    window.location.href = "login.html";
}

const farmForm = document.getElementById("farmForm");
const farmIdInput = document.getElementById("farmId");
const farmNameInput = document.getElementById("farmName");
const locationInput = document.getElementById("location");
const areaInput = document.getElementById("areaInAcres");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const farmsList = document.getElementById("farmsList");
const messageBox = document.getElementById("messageBox");

let farms = []; // farms of this farmer

// ---------- Helper functions ----------

// Call the backend. Throws an error (with status) if the response is not OK
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

// Show message for 3 seconds (type = "success" or "error")
function showMessage(text, type) {
    messageBox.textContent = text;
    messageBox.className = "message " + type;
    setTimeout(function () {
        messageBox.className = "message hidden";
    }, 3000);
}

// Prevent HTML injection when showing user text
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text ?? "";
    return div.innerHTML;
}

// ---------- Load and show farms ----------
async function loadFarms() {
    try {
        farms = await api("/api/farms/farmer/" + farmerId);
        showFarms();
    } catch (error) {
        farmsList.innerHTML = '<p class="empty-text">Could not load farms. Is the backend running?</p>';
    }
}

function showFarms() {
    if (farms.length === 0) {
        farmsList.innerHTML = '<p class="empty-text">No farms yet. Add your first farm above.</p>';
        return;
    }

    farmsList.innerHTML = farms.map(function (farm) {
        return `
            <div class="card farm-card">
                <h3>${escapeHtml(farm.farmName)}</h3>
                <p>📍 ${escapeHtml(farm.location)}</p>
                <p>📐 ${farm.areaInAcres} acres</p>
                <div class="button-group">
                    <button class="btn-secondary" data-action="edit" data-id="${farm.id}">Edit</button>
                    <button class="btn-danger" data-action="delete" data-id="${farm.id}">Delete</button>
                </div>
            </div>`;
    }).join("");
}

// ---------- Add / Update farm ----------
farmForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const farmData = {
        farmerId: Number(farmerId),
        farmName: farmNameInput.value.trim(),
        location: locationInput.value.trim(),
        areaInAcres: Number(areaInput.value)
    };

    const editingId = farmIdInput.value; // empty = adding new farm

    try {
        if (editingId) {
            await api("/api/farms/" + editingId, "PUT", farmData);
            showMessage("Farm updated successfully", "success");
        } else {
            await api("/api/farms", "POST", farmData);
            showMessage("Farm added successfully", "success");
        }
        resetForm();
        loadFarms();
    } catch (error) {
        showMessage("Could not save farm. Please check the details.", "error");
    }
});

// ---------- Edit / Delete buttons ----------
farmsList.addEventListener("click", async function (event) {
    const button = event.target.closest("button");
    if (!button) return;

    const id = button.dataset.id;

    if (button.dataset.action === "edit") {
        const farm = farms.find(function (f) { return String(f.id) === id; });
        farmIdInput.value = farm.id;
        farmNameInput.value = farm.farmName;
        locationInput.value = farm.location;
        areaInput.value = farm.areaInAcres;
        formTitle.textContent = "Edit Farm";
        submitBtn.textContent = "Update Farm";
        cancelBtn.classList.remove("hidden");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (button.dataset.action === "delete") {
        if (!confirm("Are you sure you want to delete this farm?")) return;
        try {
            await api("/api/farms/" + id, "DELETE");
            showMessage("Farm deleted", "success");
            loadFarms();
        } catch (error) {
            showMessage("Cannot delete this farm. Remove its crops and expenses first.", "error");
        }
    }
});

// ---------- Reset form (also used by the Cancel button in HTML) ----------
function resetForm() {
    farmForm.reset();
    farmIdInput.value = "";
    formTitle.textContent = "Add New Farm";
    submitBtn.textContent = "Add Farm";
    cancelBtn.classList.add("hidden");
}

// Load farms when page opens
loadFarms();