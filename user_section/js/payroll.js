// Seed Data for initial load if missing in localStorage
const initialPayrollRecords = [
  { id: 201, month: "July 2026", year: "2026", employee: "Biruk Dawit", gross: 5500, deductions: 650, net: 4850, status: "Paid" },
  { id: 202, month: "June 2026", year: "2026", employee: "Biruk Dawit", gross: 5500, deductions: 650, net: 4850, status: "Paid" },
  { id: 203, month: "May 2026", year: "2026", employee: "Biruk Dawit", gross: 5500, deductions: 600, net: 4900, status: "Paid" },
  { id: 204, month: "April 2026", year: "2026", employee: "Biruk Dawit", gross: 5200, deductions: 550, net: 4650, status: "Paid" },
  { id: 205, month: "December 2025", year: "2025", employee: "Biruk Dawit", gross: 5000, deductions: 500, net: 4500, status: "Paid" },
  { id: 206, month: "November 2025", year: "2025", employee: "Biruk Dawit", gross: 5000, deductions: 500, net: 4500, status: "Paid" }
];

let selectedYear = "2026";

// Initialize LocalStorage Data
function initPayrollData() {
  if (!localStorage.getItem("payrollRecords")) {
    localStorage.setItem("payrollRecords", JSON.stringify(initialPayrollRecords));
  }
}

// Retrieve data
function getPayrollRecords() {
  return JSON.parse(localStorage.getItem("payrollRecords")) || [];
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

// Update Top Metrics
function updateMetrics(records) {
  if (records.length === 0) return;
  const latest = records[0];
  document.getElementById("net-pay").innerText = formatCurrency(latest.net);
  document.getElementById("deductions-pay").innerText = formatCurrency(latest.deductions);
  document.getElementById("gross-pay").innerText = formatCurrency(latest.gross);
}

// Render Payroll Table
function renderPayrollTable(yearFilter = "2026") {
  const tableBody = document.getElementById("payroll-table-body");
  const records = getPayrollRecords();

  const filtered = records.filter(r => r.year === yearFilter);
  updateMetrics(filtered);

  tableBody.innerHTML = "";

  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #777;">No payroll records found for ${yearFilter}.</td></tr>`;
    return;
  }

  filtered.forEach(item => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.month}</td>
      <td>${item.employee}</td>
      <td>${formatCurrency(item.gross)}</td>
      <td>${formatCurrency(item.deductions)}</td>
      <td><strong>${formatCurrency(item.net)}</strong></td>
      <td><span class="status-pill ${item.status.toLowerCase()}">${item.status}</span></td>
      <td>
        <button class="btn-action" onclick="viewPayslip(${item.id})">
          View Slip <i class="fa-solid fa-file-invoice"></i>
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

// Filter Tab Click Handler
function filterPayroll(year, element) {
  selectedYear = year;
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach(btn => btn.classList.remove("active"));
  element.classList.add("active");

  renderPayrollTable(selectedYear);
}

// View Detailed Payslip Modal
function viewPayslip(id) {
  const records = getPayrollRecords();
  const record = records.find(r => r.id === id);

  if (!record) return;

  const detailContainer = document.getElementById("payslip-detail");
  detailContainer.innerHTML = `
    <div class="payslip-row"><span>Employee Name:</span><strong>${record.employee}</strong></div>
    <div class="payslip-row"><span>Pay Period:</span><strong>${record.month}</strong></div>
    <div class="payslip-row"><span>Base/Gross Salary:</span><span>${formatCurrency(record.gross)}</span></div>
    <div class="payslip-row"><span>Tax & Deductions:</span><span>-${formatCurrency(record.deductions)}</span></div>
    <div class="payslip-row"><span>Payment Status:</span><span class="status-pill paid">${record.status}</span></div>
    <div class="payslip-row total"><span>Net Take-Home Pay:</span><span>${formatCurrency(record.net)}</span></div>
  `;

  document.getElementById("payslip-modal").classList.remove("hidden");
}

function closePayslipModal() {
  document.getElementById("payslip-modal").classList.add("hidden");
}

function exportPayrollData() {
  alert("Payroll data exported successfully!");
}

// Application Lifecycle Bootstrap
document.addEventListener("DOMContentLoaded", () => {
  initPayrollData();
  renderPayrollTable(selectedYear);
});