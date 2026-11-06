// ---------- Setup ----------
const BASE_URL = "http://localhost:8080";

// Farmer must be logged in
const farmerId = localStorage.getItem("id");
if (!farmerId) {
    window.location.href = "login.html";
}

const farmSelect = document.getElementById("farmSelect");
const totalBox = document.getElementById("totalBox");
const totalAmountText = document.getElementById("totalAmountText");
const expenseFormCard = document.getElementById("expenseFormCard");
const expenseForm = document.getElementById("expenseForm");
const tableSection = document.getElementById("tableSection");
const tableBody = document.getElementById("expensesTableBody");
const messageBox = document.getElementById("messageBox");
const dateInput = document.getElementById("expenseDate");

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

// 1250 -> ₹1,250.00
function formatMoney(amount) {
    return "₹" + Number(amount).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Today's date as yyyy-mm-dd
function today() {
    return new Date().toLocaleDateString("en-CA");
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
    if (farmSelect.value === "") {
        totalBox.classList.add("hidden");
        expenseFormCard.classList.add("hidden");
        tableSection.classList.add("hidden");
    } else {
        totalBox.classList.remove("hidden");
        expenseFormCard.classList.remove("hidden");
        tableSection.classList.remove("hidden");
        dateInput.value = today();
        loadExpenses();
    }
});

// ---------- Load expenses and total ----------
async function loadExpenses() {
    const farmId = farmSelect.value;

    try {
        const expenses = await api("/api/expenses/farm/" + farmId);
        const totalData = await api("/api/expenses/farm/" + farmId + "/total");

        totalAmountText.textContent = formatMoney(totalData.total);
        showExpenses(expenses);
    } catch (error) {
        showMessage("Could not load expenses.", "error");
    }
}

function showExpenses(expenses) {
    if (expenses.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5">No expenses recorded yet.</td></tr>';
        return;
    }

    tableBody.innerHTML = expenses.map(function (expense) {
        return `
            <tr>
                <td>${escapeHtml(expense.expenseDate)}</td>
                <td>${escapeHtml(expense.category)}</td>
                <td>${escapeHtml(expense.description || "-")}</td>
                <td>${formatMoney(expense.amount)}</td>
                <td><button class="btn-danger" data-id="${expense.id}">Delete</button></td>
            </tr>`;
    }).join("");
}

// ---------- Add expense ----------
expenseForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const expenseData = {
        farmId: Number(farmSelect.value),
        category: document.getElementById("category").value,
        description: document.getElementById("description").value.trim(),
        amount: Number(document.getElementById("amount").value),
        expenseDate: dateInput.value
    };

    try {
        await api("/api/expenses", "POST", expenseData);
        showMessage("Expense added successfully", "success");
        expenseForm.reset();
        dateInput.value = today();
        loadExpenses();
    } catch (error) {
        showMessage("Could not save expense. Please check the details.", "error");
    }
});

// ---------- Delete expense ----------
tableBody.addEventListener("click", async function (event) {
    const button = event.target.closest("button");
    if (!button) return;

    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
        await api("/api/expenses/" + button.dataset.id, "DELETE");
        showMessage("Expense deleted", "success");
        loadExpenses();
    } catch (error) {
        showMessage("Could not delete expense.", "error");
    }
});

// Load farms when page opens
loadFarms();