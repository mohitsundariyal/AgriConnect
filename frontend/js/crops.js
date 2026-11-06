// ---------- Setup ----------
const BASE_URL = "http://localhost:8080";

// Farmer must be logged in
const farmerId = localStorage.getItem("id");
if (!farmerId) {
    window.location.href = "login.html";
}

const farmSelect = document.getElementById("farmSelect");
const cropFormCard = document.getElementById("cropFormCard");
const cropForm = document.getElementById("cropForm");
const cropIdInput = document.getElementById("cropId");
const cropNameInput = document.getElementById("cropName");
const varietyInput = document.getElementById("variety");
const seasonInput = document.getElementById("season");
const areaInput = document.getElementById("areaInAcres");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const cropsList = document.getElementById("cropsList");
const messageBox = document.getElementById("messageBox");

let crops = []; // crops of the selected farm

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

// ---------- Load farms into the dropdown ----------
async function loadFarms() {
    try {
        const farms = await api("/api/farms/farmer/" + farmerId);
        farms.forEach(function (farm) {
            const option = document.createElement("option");
            option.value = farm.id;
            option.textContent = farm.farmName;
            farmSelect.appendChild(option);
        });
        if (farms.length === 0) {
            showMessage("Please add a farm first from the Farms page.", "error");
        }
    } catch (error) {
        showMessage("Could not load farms. Is the backend running?", "error");
    }
}

// When a farm is selected
farmSelect.addEventListener("change", function () {
    resetForm();
    if (farmSelect.value === "") {
        cropFormCard.classList.add("hidden");
        cropsList.innerHTML = '<p class="empty-text">Please select a farm above to view or add crops.</p>';
    } else {
        cropFormCard.classList.remove("hidden");
        loadCrops();
    }
});

// ---------- Load and show crops ----------
async function loadCrops() {
    try {
        crops = await api("/api/crops/farm/" + farmSelect.value);
        showCrops();
    } catch (error) {
        cropsList.innerHTML = '<p class="empty-text">Could not load crops.</p>';
    }
}

function showCrops() {
    if (crops.length === 0) {
        cropsList.innerHTML = '<p class="empty-text">No crops in this farm yet. Add one above.</p>';
        return;
    }

    cropsList.innerHTML = crops.map(function (crop) {
        return `
            <div class="card crop-card">
                <h3>${escapeHtml(crop.cropName)}</h3>
                <p>Variety: ${escapeHtml(crop.variety || "-")}</p>
                <p>Season: ${escapeHtml(crop.season || "-")}</p>
                <p>Area: ${crop.areaInAcres ?? "-"} acres</p>
                <div class="button-group">
                    <button class="btn-secondary" data-action="edit" data-id="${crop.id}">Edit</button>
                    <button class="btn-danger" data-action="delete" data-id="${crop.id}">Delete</button>
                </div>
            </div>`;
    }).join("");
}

// ---------- Add / Update crop ----------
cropForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const cropData = {
        farmId: Number(farmSelect.value),
        cropName: cropNameInput.value.trim(),
        variety: varietyInput.value.trim(),
        season: seasonInput.value,
        areaInAcres: areaInput.value ? Number(areaInput.value) : null
    };

    const editingId = cropIdInput.value; // empty = adding new crop

    try {
        if (editingId) {
            await api("/api/crops/" + editingId, "PUT", cropData);
            showMessage("Crop updated successfully", "success");
        } else {
            await api("/api/crops", "POST", cropData);
            showMessage("Crop added successfully", "success");
        }
        resetForm();
        loadCrops();
    } catch (error) {
        showMessage("Could not save crop. Please check the details.", "error");
    }
});

// ---------- Edit / Delete buttons ----------
cropsList.addEventListener("click", async function (event) {
    const button = event.target.closest("button");
    if (!button) return;

    const id = button.dataset.id;

    if (button.dataset.action === "edit") {
        const crop = crops.find(function (c) { return String(c.id) === id; });
        cropIdInput.value = crop.id;
        cropNameInput.value = crop.cropName;
        varietyInput.value = crop.variety || "";
        seasonInput.value = crop.season || "Kharif";
        areaInput.value = crop.areaInAcres ?? "";
        formTitle.textContent = "Edit Crop";
        submitBtn.textContent = "Update Crop";
        cancelBtn.classList.remove("hidden");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (button.dataset.action === "delete") {
        if (!confirm("Are you sure you want to delete this crop?")) return;
        try {
            await api("/api/crops/" + id, "DELETE");
            showMessage("Crop deleted", "success");
            loadCrops();
        } catch (error) {
            showMessage("Cannot delete this crop. Remove its expenses first.", "error");
        }
    }
});

// ---------- Reset form (also used by the Cancel button in HTML) ----------
function resetForm() {
    cropForm.reset();
    cropIdInput.value = "";
    formTitle.textContent = "Add New Crop";
    submitBtn.textContent = "Add Crop";
    cancelBtn.classList.add("hidden");
}

// Load farms when page opens
loadFarms();