// Seed Announcements Data
const defaultAnnouncements = [
  {
    id: 1,
    title: "Mid-Year All-Hands Meeting",
    date: "July 30, 2026",
    content: "Please join us for our mid-year company status updates and Q&A session taking place in the primary conference hall."
  },
  {
    id: 2,
    title: "Updated Health Insurance Benefits",
    date: "July 15, 2026",
    content: "The HR department has updated the employee health care package. Download the updated policy from the document downloads section."
  }
];

// Initialize Announcements
function initAnnouncements() {
  if (!localStorage.getItem("companyAnnouncements")) {
    localStorage.setItem("companyAnnouncements", JSON.stringify(defaultAnnouncements));
  }
}

// Render Announcements
function renderAnnouncements() {
  const container = document.getElementById("announcements-container");
  const data = JSON.parse(localStorage.getItem("companyAnnouncements")) || defaultAnnouncements;

  container.innerHTML = "";

  data.forEach(item => {
    const card = document.createElement("div");
    card.className = "announcement-card";
    card.innerHTML = `
      <h4>${item.title}</h4>
      <div class="meta"><i class="fa-regular fa-calendar"></i> ${item.date}</div>
      <p>${item.content}</p>
    `;
    container.appendChild(card);
  });
}

// Working Days Estimator
function setupCalculator() {
  const form = document.getElementById("calculator-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const startDate = new Date(document.getElementById("start-date-input").value);
    const endDate = new Date(document.getElementById("end-date-input").value);

    if (endDate < startDate) {
      alert("End date cannot be earlier than start date.");
      return;
    }

    let count = 0;
    let curDate = new Date(startDate);

    while (curDate <= endDate) {
      const dayOfWeek = curDate.getDay();
      // Exclude Saturday (6) and Sunday (0)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      curDate.setDate(curDate.getDate() + 1);
    }

    document.getElementById("business-days-count").innerText = `${count} Business Day(s)`;
    document.getElementById("calc-result").classList.remove("hidden");
  });
}

// Download Trigger Simulation
function downloadTemplate(fileName) {
  alert(`Downloading document template: ${fileName}`);
}

// Support Ticket Handler
function setupSupportForm() {
  const form = document.getElementById("support-ticket-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const subject = document.getElementById("ticket-subject").value;
    const category = document.getElementById("ticket-category").value;

    alert(`Ticket Submitted Successfully!\nCategory: ${category}\nSubject: ${subject}`);
    form.reset();
  });
}

// Application Lifecycle Bootstrap
document.addEventListener("DOMContentLoaded", () => {
  initAnnouncements();
  renderAnnouncements();
  setupCalculator();
  setupSupportForm();
});