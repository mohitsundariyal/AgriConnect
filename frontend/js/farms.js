// Backend API Base URL
const API_BASE = "http://localhost:8080/api/farms";

// 1. Check authentication: localStorage mein "id" hona chahiye
const farmerId = localStorage.getItem("id");


// DOM Elements
const farmForm = document.getElementById("farmForm");
const farmIdInput = document.getElementById("farmId");
const farmNameInput = document.getElementById("farmName");
const locationInput = document.getElementById("location");
const areaInput = document.getElementById("areaInAcres");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formTitle = document.getElementById("formTitle");
const messageBox = document.getElementById("messageBox");
const farmsListContainer = document.getElementById("farmsList");

// Helper function to show messages on page instead of alert()
function showMessage(text, type) {
    messageBox.textContent = text;
    messageBox.className = `message ${type}`;
    setTimeout(() => {
        messageBox.className = "message hidden";
    }, 4000); // Hide after 4 seconds
}

// Fetch and display farms on page load
document.addEventListener("DOMContentLoaded", fetchFarms);

async function fetchFarms() {
    try {
        const response = await fetch(`${API_BASE}/farmer/${farmerId}`);
        if (!response.ok) throw new Error("Failed to load farms");

        const farms = await response.json();
        renderFarms(farms);
    } catch (error) {
        console.error(error);
        farmsListContainer.innerHTML = `<p class="empty-text">Could not load farms. Is the server running?</p>`;
    }
}

// Render farms list as cards
function renderFarms(farms) {
    if (!farms || farms.length === 0) {
        farmsListContainer.innerHTML = `<p class="empty-text">No farms added yet.</p>`;
        return;
    }

    farmsListContainer.innerHTML = "";
    farms.forEach(farm => {
        const farmCard = document.createElement("div");
        farmCard.className = "farm-item";
        farmCard.innerHTML = `
            <div class="farm-info">
                <h4>${farm.farmName}</h4>
                <p>📍 Location: ${farm.location}</p>
                <p>📐 Area: ${farm.areaInAcres} Acres</p>
            </div>
            <div class="farm-actions">
                <button class="btn-edit" onclick="editFarm('${farm.id}', '${encodeURIComponent(farm.farmName)}', '${encodeURIComponent(farm.location)}', '${farm.areaInAcres}')">Edit</button>
                <button class="btn-delete" onclick="deleteFarm('${farm.id}')">Delete</button>
            </div>
        `;
        farmsListContainer.appendChild(farmCard);
    });
}

// Handle Form Submission (Add or Update)
farmForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    const id = farmIdInput.value;
    const farmData = {
        farmerId: farmerId,
        farmName: farmNameInput.value.trim(),
        location: locationInput.value.trim(),
        areaInAcres: parseFloat(areaInput.value)
    };

    try {
        let response;
        if (id) {
            // PUT Request for Update
            response = await fetch(`${API_BASE}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(farmData)
            });
        } else {
            // POST Request for Create
            response = await fetch(API_BASE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(farmData)
            });
        }

        if (response.ok) {
            showMessage(id ? "Farm updated successfully!" : "Farm added successfully!", "success");
            resetForm();
            fetchFarms(); // Refresh list
        } else {
            const errData = await response.json().catch(() => ({}));
            showMessage(errData.message || "Operation failed. Please try again.", "error");
        }
    } catch (error) {
        console.error(error);
        showMessage("Server error connection failed.", "error");
    }
});

// Fill form with values for Editing
function editFarm(id, name, location, area) {
    farmIdInput.value = id;
    farmNameInput.value = decodeURIComponent(name);
    locationInput.value = decodeURIComponent(location);
    areaInput.value = area;

    formTitle.textContent = "Edit Farm";
    submitBtn.textContent = "Update Farm";
    cancelBtn.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Reset Form to Add Mode
function resetForm() {
    farmForm.reset();
    farmIdInput.value = "";
    formTitle.textContent = "Add New Farm";
    submitBtn.textContent = "Add Farm";
    cancelBtn.classList.add("hidden");
}

// Delete Farm with confirm()
async function deleteFarm(id) {
    if (!confirm("Are you sure you want to delete this farm?")) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            showMessage("Farm deleted successfully", "success");
            fetchFarms(); // Refresh list
        } else {
            showMessage("Failed to delete farm", "error");
        }
    } catch (error) {
        console.error(error);
        showMessage("Server error connection failed.", "error");
    }
}