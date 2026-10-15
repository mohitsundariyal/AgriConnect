// Backend API Base URLs
const API_FARMS = "http://localhost:8080/api/farms";
const API_CROPS = "http://localhost:8080/api/crops";

// 1. Check authentication: localStorage mein "id" hona chahiye
const farmerId = localStorage.getItem("id");


// DOM Elements
const farmSelect = document.getElementById("farmSelect");
const cropFormCard = document.getElementById("cropFormCard");
const cropForm = document.getElementById("cropForm");
const cropIdInput = document.getElementById("cropId");
const cropNameInput = document.getElementById("cropName");
const varietyInput = document.getElementById("variety");
const seasonSelect = document.getElementById("season");
const areaInput = document.getElementById("areaInAcres");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formTitle = document.getElementById("formTitle");
const messageBox = document.getElementById("messageBox");
const cropsListContainer = document.getElementById("cropsList");

// Helper function to show messages on page instead of alert()
function showMessage(text, type) {
    messageBox.textContent = text;
    messageBox.className = `message ${type}`;
    setTimeout(() => {
        messageBox.className = "message hidden";
    }, 4000);
}

// 2. Load farmer's farms into the dropdown on page load
document.addEventListener("DOMContentLoaded", fetchFarmsDropdown);

async function fetchFarmsDropdown() {
    try {
        const response = await fetch(`${API_FARMS}/farmer/${farmerId}`);
        if (!response.ok) throw new Error("Failed to load farms");

        const farms = await response.json();
        
        farmSelect.innerHTML = '<option value="">-- Choose a Farm --</option>';
        farms.forEach(farm => {
            const option = document.createElement("option");
            option.value = farm.id;
            option.textContent = farm.farmName;
            farmSelect.appendChild(option);
        });
    } catch (error) {
        console.error(error);
        showMessage("Could not load your farms.", "error");
    }
}

// 3. When a farm is selected, show form and load its crops
farmSelect.addEventListener("change", function() {
    const selectedFarmId = farmSelect.value;
    resetForm();

    if (selectedFarmId) {
        cropFormCard.classList.remove("hidden");
        fetchCrops(selectedFarmId);
    } else {
        cropFormCard.classList.add("hidden");
        cropsListContainer.innerHTML = `<p class="empty-text">Please select a farm above to view or add crops.</p>`;
    }
});

// Fetch crops for the chosen farm
async function fetchCrops(farmId) {
    try {
        const response = await fetch(`${API_CROPS}/farm/${farmId}`);
        if (!response.ok) throw new Error("Failed to load crops");

        const crops = await response.json();
        renderCrops(crops);
    } catch (error) {
        console.error(error);
        cropsListContainer.innerHTML = `<p class="empty-text">Could not load crops for this farm.</p>`;
    }
}

// Render crops list as cards
function renderCrops(crops) {
    if (!crops || crops.length === 0) {
        cropsListContainer.innerHTML = `<p class="empty-text">No crops added for this farm yet.</p>`;
        return;
    }

    cropsListContainer.innerHTML = "";
    crops.forEach(crop => {
        const cropCard = document.createElement("div");
        cropCard.className = "crop-item";
        cropCard.innerHTML = `
            <div class="crop-info">
                <h4>${crop.cropName}</h4>
                <p>🌱 Variety: ${crop.variety || 'N/A'}</p>
                <p>🌤️ Season: ${crop.season || 'N/A'} | 📐 Area: ${crop.areaInAcres || 'N/A'} Acres</p>
            </div>
            <div class="crop-actions">
                <button class="btn-edit" onclick="editCrop('${crop.id}', '${encodeURIComponent(crop.cropName)}', '${encodeURIComponent(crop.variety || '')}', '${crop.season || 'Kharif'}', '${crop.areaInAcres || ''}')">Edit</button>
                <button class="btn-delete" onclick="deleteCrop('${crop.id}')">Delete</button>
            </div>
        `;
        cropsListContainer.appendChild(cropCard);
    });
}

// Handle Form Submission (Add or Update)
cropForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    const currentFarmId = farmSelect.value;
    if (!currentFarmId) {
        showMessage("Please select a farm first.", "error");
        return;
    }

    const cropId = cropIdInput.value;
    const cropData = {
        farmId: currentFarmId,
        cropName: cropNameInput.value.trim(),
        variety: varietyInput.value.trim(),
        season: seasonSelect.value,
        areaInAcres: areaInput.value ? parseFloat(areaInput.value) : null
    };

    try {
        let response;
        if (cropId) {
            // PUT Request for Update
            response = await fetch(`${API_CROPS}/${cropId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cropData)
            });
        } else {
            // POST Request for Create
            response = await fetch(API_CROPS, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cropData)
            });
        }

        if (response.ok) {
            showMessage(cropId ? "Crop updated successfully!" : "Crop added successfully!", "success");
            resetForm();
            fetchCrops(currentFarmId); // Refresh list
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
function editCrop(id, name, variety, season, area) {
    cropIdInput.value = id;
    cropNameInput.value = decodeURIComponent(name);
    varietyInput.value = decodeURIComponent(variety);
    seasonSelect.value = season;
    areaInput.value = area;

    formTitle.textContent = "Edit Crop";
    submitBtn.textContent = "Update Crop";
    cancelBtn.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Reset Form to Add Mode
function resetForm() {
    cropForm.reset();
    cropIdInput.value = "";
    formTitle.textContent = "Add New Crop";
    submitBtn.textContent = "Add Crop";
    cancelBtn.classList.add("hidden");
}

// Delete Crop with confirm()
async function deleteCrop(id) {
    if (!confirm("Are you sure you want to delete this crop?")) {
        return;
    }

    const currentFarmId = farmSelect.value;

    try {
        const response = await fetch(`${API_CROPS}/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            showMessage("Crop deleted successfully", "success");
            fetchCrops(currentFarmId); // Refresh list
        } else {
            showMessage("Failed to delete crop", "error");
        }
    } catch (error) {
        console.error(error);
        showMessage("Server error connection failed.", "error");
    }
}