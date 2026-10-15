// Backend API Base URLs
const API_FARMS = "http://localhost:8080/api/farms";
const API_EXPENSES = "http://localhost:8080/api/expenses";

// 1. Check authentication: localStorage mein "id" hona chahiye
const farmerId = localStorage.getItem("id");


// DOM Elements
const farmSelect = document.getElementById("farmSelect");
const totalBox = document.getElementById("totalBox");
const totalAmountText = document.getElementById("totalAmountText");
const expenseFormCard = document.getElementById("expenseFormCard");
const expenseForm = document.getElementById("expenseForm");
const categorySelect = document.getElementById("category");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const expenseDateInput = document.getElementById("expenseDate");
const tableSection = document.getElementById("tableSection");
const expensesTableBody = document.getElementById("expensesTableBody");
const messageBox = document.getElementById("messageBox");

// Helper function to show messages on page instead of alert()
function showMessage(text, type) {
    messageBox.textContent = text;
    messageBox.className = `message ${type}`;
    setTimeout(() => {
        messageBox.className = "message hidden";
    }, 4000);
}

// Set today's date as default in date picker
document.getElementById("expenseDate").valueAsDate = new Date();

// 2. Load farmer's farms into dropdown on page load
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

// 3. When a farm is selected, show total, form, and table data
farmSelect.addEventListener("change", function() {
    const selectedFarmId = farmSelect.value;

    if (selectedFarmId) {
        totalBox.classList.remove("hidden");
        expenseFormCard.classList.remove("hidden");
        tableSection.classList.remove("hidden");
        
        loadFarmData(selectedFarmId);
    } else {
        totalBox.classList.add("hidden");
        expenseFormCard.classList.add("hidden");
        tableSection.classList.add("hidden");
    }
});

// Load Expenses and Total for the chosen farm
async function loadFarmData(farmId) {
    await fetchTotalExpense(farmId);
    await fetchExpensesList(farmId);
}

// Fetch and display total expense (formatted like ₹1,250.00)
async function fetchTotalExpense(farmId) {
    try {
        const response = await fetch(`${API_EXPENSES}/farm/${farmId}/total`);
        if (!response.ok) throw new Error("Failed to fetch total");

        const data = await response.json();
        const totalValue = data.total || 0;
        
        // Format as Indian Rupee style (e.g. ₹1,250.00)
        totalAmountText.textContent = `₹${parseFloat(totalValue).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    } catch (error) {
        console.error(error);
        totalAmountText.textContent = "₹0.00";
    }
}

// Fetch and render expenses table list
async function fetchExpensesList(farmId) {
    try {
        const response = await fetch(`${API_EXPENSES}/farm/${farmId}`);
        if (!response.ok) throw new Error("Failed to fetch expenses");

        const expenses = await response.json();
        renderExpensesTable(expenses);
    } catch (error) {
        console.error(error);
        expensesTableBody.innerHTML = `<tr><td colspan="5" class="empty-row">Could not load expense records.</td></tr>`;
    }
}

// Render rows in the expense table
function renderExpensesTable(expenses) {
    if (!expenses || expenses.length === 0) {
        expensesTableBody.innerHTML = `<tr><td colspan="5" class="empty-row">No expense records found for this farm.</td></tr>`;
        return;
    }

    expensesTableBody.innerHTML = "";
    expenses.forEach(exp => {
        const formattedAmount = parseFloat(exp.amount).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${exp.expenseDate}</td>
            <td>${exp.category}</td>
            <td>${exp.description || '-'}</td>
            <td>₹${formattedAmount}</td>
            <td><button class="btn-delete" onclick="deleteExpense('${exp.id}')">Delete</button></td>
        `;
        expensesTableBody.appendChild(row);
    });
}

// Handle Form Submission to Add Expense
expenseForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    const currentFarmId = farmSelect.value;
    if (!currentFarmId) {
        showMessage("Please select a farm first.", "error");
        return;
    }

    const amountValue = parseFloat(amountInput.value);
    if (amountValue <= 0) {
        showMessage("Amount must be greater than 0.", "error");
        return;
    }

    const expenseData = {
        farmId: currentFarmId,
        category: categorySelect.value,
        description: descriptionInput.value.trim(),
        amount: amountValue,
        expenseDate: expenseDateInput.value
    };

    try {
        const response = await fetch(API_EXPENSES, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(expenseData)
        });

        if (response.ok) {
            showMessage("Expense added successfully!", "success");
            expenseForm.reset();
            document.getElementById("expenseDate").valueAsDate = new Date(); // Reset date to today
            loadFarmData(currentFarmId); // Refresh table and total
        } else {
            const errData = await response.json().catch(() => ({}));
            showMessage(errData.message || "Failed to add expense.", "error");
        }
    } catch (error) {
        console.error(error);
        showMessage("Server connection failed.", "error");
    }
});

// Delete Expense with confirm()
async function deleteExpense(id) {
    if (!confirm("Are you sure you want to delete this expense record?")) {
        return;
    }

    const currentFarmId = farmSelect.value;

    try {
        const response = await fetch(`${API_EXPENSES}/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            showMessage("Expense deleted successfully", "success");
            loadFarmData(currentFarmId); // Refresh table and total
        } else {
            showMessage("Failed to delete expense", "error");
        }
    } catch (error) {
        console.error(error);
        showMessage("Server connection failed.", "error");
    }
}