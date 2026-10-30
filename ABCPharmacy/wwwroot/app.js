
"use strict";


// API CONFIGURATION


const API = {
    medicines: "/api/Medicines",
    sales: "/api/Sales"
};


// DOM ELEMENTS

const medicineRows = document.getElementById("medicine-rows");
const salesRows = document.getElementById("sales-rows");

const medicineForm = document.getElementById("medicine-form");
const medicineFormContainer =
    document.getElementById("medicine-form-container");

const saleForm = document.getElementById("sale-form");

const searchInput = document.getElementById("search");
const saleMedicine = document.getElementById("sale-medicine");
const saleQuantity = document.getElementById("sale-quantity");

const availableStock = document.getElementById("available-stock");

let medicines = [];

// API HELPER
async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            ...(options.body ? { "Content-Type": "application/json" } : {}),
            ...options.headers
        }
    });

    const responseText = await response.text();

    let result = null;

    if (responseText) {
        try {
            result = JSON.parse(responseText);
        } catch {
            result = responseText;
        }
    }

    if (!response.ok) {
        let message = "Request failed. Please try again.";

        if (typeof result === "string") {
            message = result;
        } else if (result?.errors) {
            message = Object.values(result.errors).flat().join(" ");
        } else if (result?.detail) {
            message = result.detail;
        } else if (result?.title) {
            message = result.title;
        } else if (result?.message) {
            message = result.message;
        }

        throw new Error(message);
    }

    return result;
}

// COMMON HELPER FUNCTIONS


function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => {
        const replacements = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return replacements[character];
    });
}

function formatPrice(value) {
    return Number(value || 0).toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function formatDate(value) {
    if (!value) return "-";

    const date = new Date(`${value.toString().substring(0, 10)}T00:00:00`);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-IN");
}

function showMessage(elementId, message, isError = false) {
    const element = document.getElementById(elementId);

    if (!element) return;

    element.textContent = message;
    element.classList.toggle("error", isError);

    element.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}

function clearMessage(elementId) {
    const element = document.getElementById(elementId);

    if (element) {
        element.textContent = "";
        element.classList.remove("error");
    }
}


// EXPIRY AND STOCK STATUS

function getMedicineStatus(medicine) {
    if (!medicine.expiryDate) return "";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(
        `${medicine.expiryDate.toString().substring(0, 10)}T00:00:00`
    );

    const daysRemaining = Math.ceil(
        (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Red takes priority if both conditions apply.
    if (daysRemaining < 30) {
        return "expiring";
    }

    if (Number(medicine.quantity) < 10) {
        return "low-stock";
    }

    return "";
}

// LOAD MEDICINES FROM WEB API


async function loadMedicines() {
    try {
        const result = await apiRequest(API.medicines);

        medicines = Array.isArray(result) ? result : [];

        renderMedicines();
        populateSaleDropdown();

    } catch (error) {
        console.error("Medicine loading error:", error);

        medicineRows.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    Unable to load medicines: ${escapeHtml(error.message)}
                </td>
            </tr>
        `;

        showMessage(
            "inventory-message",
            "Could not load medicines. Check that the API is running.",
            true
        );
    }
}

// DISPLAY MEDICINES

function renderMedicines() {
    const searchText = searchInput.value.trim().toLowerCase();

    const filteredMedicines = medicines.filter(medicine =>
        (medicine.fullName || "").toLowerCase().includes(searchText)
    );

    document.getElementById("medicine-count").textContent =
        `${filteredMedicines.length} medicine(s)`;

    if (filteredMedicines.length === 0) {
        medicineRows.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    No medicines found.
                </td>
            </tr>
        `;
        return;
    }

    medicineRows.innerHTML = filteredMedicines.map(medicine => {
        const status = getMedicineStatus(medicine);

        return `
            <tr class="${status}">
                <td>
                    <strong>${escapeHtml(medicine.fullName)}</strong>
                </td>

                <td>${escapeHtml(medicine.brand)}</td>

                <td>${formatDate(medicine.expiryDate)}</td>

                <td>
                    <span class="quantity-value">
                        ${Number(medicine.quantity)}
                    </span>
                </td>

                <td>${formatPrice(medicine.price)}</td>

                <td>
                    <button
                        type="button"
                        class="small-button"
                        data-sell-id="${escapeHtml(medicine.id)}"
                        ${Number(medicine.quantity) <= 0 ? "disabled" : ""}>
                        Sell
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}


// POPULATE SALES MEDICINE DROPDOWN

function populateSaleDropdown(selectedId = saleMedicine.value) {
    const availableMedicines = medicines.filter(
        medicine => Number(medicine.quantity) > 0
    );

    saleMedicine.innerHTML = `
        <option value="">Select medicine</option>
        ${availableMedicines.map(medicine => `
            <option value="${escapeHtml(medicine.id)}">
                ${escapeHtml(medicine.fullName)}
                (Available: ${Number(medicine.quantity)})
            </option>
        `).join("")}
    `;

    if (availableMedicines.some(
        medicine => String(medicine.id) === String(selectedId)
    )) {
        saleMedicine.value = selectedId;
    }

    updateAvailableStock();
}


// ADD MEDICINE FORM

function openMedicineForm() {
    clearMessage("inventory-message");

    medicineFormContainer.classList.remove("hidden");

    medicineFormContainer.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function closeMedicineForm() {
    medicineForm.reset();
    medicineFormContainer.classList.add("hidden");
}

document.getElementById("show-add-form")
    .addEventListener("click", openMedicineForm);

document.getElementById("cancel-add")
    .addEventListener("click", closeMedicineForm);

document.getElementById("close-add-form")
    .addEventListener("click", closeMedicineForm);


// SAVE MEDICINE THROUGH POST API

medicineForm.addEventListener("submit", async event => {
    event.preventDefault();

    clearMessage("inventory-message");

    if (!medicineForm.reportValidity()) {
        return;
    }

    const medicine = {
        fullName: document.getElementById("fullName").value.trim(),
        notes: document.getElementById("notes").value.trim(),
        expiryDate: document.getElementById("expiryDate").value,
        quantity: Number(document.getElementById("quantity").value),
        price: Number(document.getElementById("price").value),
        brand: document.getElementById("brand").value.trim()
    };

    if (
        !medicine.fullName ||
        !medicine.brand ||
        !medicine.expiryDate ||
        !Number.isInteger(medicine.quantity) ||
        medicine.quantity < 0 ||
        !Number.isFinite(medicine.price) ||
        medicine.price < 0
    ) {
        showMessage(
            "inventory-message",
            "Please enter valid medicine details.",
            true
        );
        return;
    }

    const saveButton = document.getElementById("save-medicine");

    saveButton.disabled = true;
    saveButton.textContent = "Saving...";

    try {
        await apiRequest(API.medicines, {
            method: "POST",
            body: JSON.stringify(medicine)
        });

        closeMedicineForm();

        await loadMedicines();

        showMessage(
            "inventory-message",
            "Medicine saved successfully."
        );

    } catch (error) {
        console.error("Save medicine error:", error);

        showMessage(
            "inventory-message",
            `Unable to save medicine: ${error.message}`,
            true
        );

    } finally {
        saveButton.disabled = false;
        saveButton.textContent = "Save Medicine";
    }
});


// NAVIGATION BETWEEN SCREENS


function switchView(viewId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.toggle("hidden", page.id !== viewId);
    });

    document.querySelectorAll(".nav-button").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.view === viewId
        );
    });

    if (viewId === "sales-view") {
        loadSales();
    }
}

document.querySelectorAll(".nav-button").forEach(button => {
    button.addEventListener("click", () => {
        switchView(button.dataset.view);
    });
});

// SELL BUTTON FROM INVENTORY

medicineRows.addEventListener("click", event => {
    const button = event.target.closest("[data-sell-id]");

    if (!button || button.disabled) {
        return;
    }

    const medicineId = button.dataset.sellId;

    const medicine = medicines.find(
        item => String(item.id) === String(medicineId)
    );

    if (!medicine) {
        showMessage(
            "inventory-message",
            "Selected medicine could not be found.",
            true
        );
        return;
    }

    if (Number(medicine.quantity) <= 0) {
        showMessage(
            "inventory-message",
            "This medicine is out of stock.",
            true
        );
        return;
    }

    // Open sales screen.
    switchView("sales-view");

    // Select the medicine automatically.
    populateSaleDropdown(medicineId);
    saleMedicine.value = medicineId;

    // Set available stock as maximum sale quantity.
    saleQuantity.max = medicine.quantity;
    saleQuantity.value = "";

    updateAvailableStock();

    clearMessage("sales-message");

    saleQuantity.focus();
});


// SHOW AVAILABLE STOCK

function updateAvailableStock() {
    const medicineId = saleMedicine.value;

    const medicine = medicines.find(
        item => String(item.id) === String(medicineId)
    );

    if (!medicine) {
        availableStock.textContent = "";
        saleQuantity.removeAttribute("max");
        return;
    }

    availableStock.textContent =
        `Available stock: ${medicine.quantity}`;

    saleQuantity.max = medicine.quantity;
}

saleMedicine.addEventListener("change", () => {
    saleQuantity.value = "";
    updateAvailableStock();
});

// RECORD SALE THROUGH POST API

saleForm.addEventListener("submit", async event => {
    event.preventDefault();

    clearMessage("sales-message");

    const medicineId = saleMedicine.value;
    const quantity = Number(saleQuantity.value);

    if (!medicineId) {
        showMessage(
            "sales-message",
            "Please select a medicine.",
            true
        );
        return;
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
        showMessage(
            "sales-message",
            "Please enter a valid quantity.",
            true
        );
        return;
    }

    const medicine = medicines.find(
        item => String(item.id) === String(medicineId)
    );

    if (!medicine) {
        showMessage(
            "sales-message",
            "Medicine not found.",
            true
        );
        return;
    }

    if (quantity > Number(medicine.quantity)) {
        showMessage(
            "sales-message",
            `Only ${medicine.quantity} units are available.`,
            true
        );
        return;
    }

    const saleButton = document.getElementById("record-sale");

    saleButton.disabled = true;
    saleButton.textContent = "Processing...";

    try {
        await apiRequest(API.sales, {
            method: "POST",
            body: JSON.stringify({
                medicineId: medicineId,
                quantity: quantity
            })
        });

        saleForm.reset();
        availableStock.textContent = "";

        // Reload both inventory and sales from the API.
        await Promise.all([
            loadMedicines(),
            loadSales()
        ]);

        showMessage(
            "sales-message",
            "Sale recorded successfully. Medicine stock has been updated."
        );

    } catch (error) {
        console.error("Record sale error:", error);

        showMessage(
            "sales-message",
            `Unable to record sale: ${error.message}`,
            true
        );

    } finally {
        saleButton.disabled = false;
        saleButton.textContent = "Record Sale";
    }
});


// LOAD SALES HISTORY

async function loadSales() {
    try {
        const sales = await apiRequest(API.sales);

        renderSales(Array.isArray(sales) ? sales : []);

    } catch (error) {
        console.error("Sales loading error:", error);

        salesRows.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    Unable to load sales: ${escapeHtml(error.message)}
                </td>
            </tr>
        `;
    }
}


// DISPLAY SALES HISTORY

function renderSales(sales) {
    if (sales.length === 0) {
        salesRows.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    No sales recorded yet.
                </td>
            </tr>
        `;
        return;
    }

    salesRows.innerHTML = [...sales].reverse().map(sale => `
        <tr>
            <td>${escapeHtml(
        sale.soldAt
            ? new Date(sale.soldAt).toLocaleString("en-IN")
            : "-"
    )}</td>

            <td>${escapeHtml(sale.medicineName)}</td>

            <td>${Number(sale.quantitySold)}</td>

            <td>${formatPrice(sale.unitPrice)}</td>

            <td><strong>${formatPrice(sale.totalAmount)}</strong></td>
        </tr>
    `).join("");
}


// SEARCH MEDICINES BY NAME


searchInput.addEventListener("input", renderMedicines);


// INITIALIZE APPLICATION


async function initializeApp() {
    await Promise.all([
        loadMedicines(),
        loadSales()
    ]);
}

initializeApp();
