// Seed Data for initial load if missing in localStorage
const initialRequests = [
  { id: 101, name: "Abenezer kebede", type: "Sick", duration: 5, startDate: "22/04/2022", endDate: "28/04/2022", status: "Approved" },
  { id: 102, name: "Abenezer kebede", type: "Exam", duration: 7, startDate: "22/04/2022", endDate: "30/04/2022", status: "Approved" },
  { id: 103, name: "Biruk Dawit", type: "Annual", duration: 60, startDate: "10/05/2026", endDate: "10/07/2026", status: "Pending" },
  { id: 104, name: "Samson Dawit", type: "Casual", duration: 3, startDate: "01/06/2026", endDate: "04/06/2026", status: "Rejected" },
  { id: 105, name: "Abenezer kebede", type: "Maternity", duration: 120, startDate: "22/04/2022", endDate: "28/06/2022", status: "Approved" },
  { id: 106, name: "Biruk Dawit", type: "Sick", duration: 20, startDate: "15/07/2026", endDate: "04/08/2026", status: "Pending" }
];

let activeFilter = "All";

// Initialize LocalStorage Data
function initRequestsData() {
  if (!localStorage.getItem("leaveRecords")) {
    // Standardize status on existing records if initialized via Dashboard
    const formattedData = initialRequests.map(item => ({ ...item, reason: item.reason || "Personal" }));
    localStorage.setItem("leaveRecords", JSON.stringify(formattedData));
  }
}

// Retrieve data safely
function getStoredRequests() {
  const records = JSON.parse(localStorage.getItem("leaveRecords")) || [];
  return records.map(record => ({
    ...record,
    status: record.status || "Pending" // Default new submitted applications from dashboard to Pending
  }));
}

// Update Metric Summary Counters
function updateMetrics(records) {
  const pendingCount = records.filter(r => r.status === "Pending").length;
  const approvedCount = records.filter(r => r.status === "Approved").length;
  const rejectedCount = records.filter(r => r.status === "Rejected").length;

  document.getElementById("pending-count").innerText = pendingCount;
  document.getElementById("approved-count").innerText = approvedCount;
  document.getElementById("rejected-count").innerText = rejectedCount;
}

// Render Requests Table
function renderRequestsTable(statusFilter = "All") {
  const tableBody = document.getElementById("requests-table-body");
  const records = getStoredRequests();
  
  updateMetrics(records);

  const filteredRecords = statusFilter === "All" 
    ? records 
    : records.filter(r => r.status.toLowerCase() === statusFilter.toLowerCase());

  tableBody.innerHTML = "";

  if (filteredRecords.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #777;">No requests found for this status.</td></tr>`;
    return;
  }

  filteredRecords.forEach(req => {
    const row = document.createElement("tr");
    
    // Status style mapping
    const statusClass = req.status.toLowerCase();

    row.innerHTML = `
      <td>${req.name}</td>
      <td>${req.type}</td>
      <td>${req.duration} Days</td>
      <td>${req.startDate}</td>
      <td>${req.endDate}</td>
      <td><span class="status-pill ${statusClass}">${req.status}</span></td>
      <td>
        <button class="btn-action-dropdown">
          Actions <i class="fa-solid fa-chevron-down"></i>
        </button>
      </td>
    `;
    
    tableBody.appendChild(row);
  });
}

// Filter Tab Click Handler
function filterRequests(status, element) {
  activeFilter = status;
  
  // Update Tab Styling
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach(btn => btn.classList.remove("active"));
  element.classList.add("active");

  renderRequestsTable(activeFilter);
}

// Application Lifecycle Bootstrap
document.addEventListener("DOMContentLoaded", () => {
  initRequestsData();
  renderRequestsTable(activeFilter);
});