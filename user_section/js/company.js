// Default Company Profile State
const defaultProfileData = {
  personal: {
    name: "Biruk Dawit",
    department: "Design & Marketing",
    title: "UI / UX Designer",
    category: "Full time"
  },
  nextOfKin: {
    name: "Samson Dawit",
    job: "IT Manager",
    phone: "099332212",
    relationship: "Relative",
    address: "Alembank, Addia ababa"
  },
  education: {
    institution: "Jimma university",
    department: "Computer Dept",
    course: "Computer Science",
    location: "JImma, Ethiopia",
    startDate: "01/01/1998",
    endDate: "01/01/2019",
    description: "• Gathering and evaluating product requirements, in collaboration with product managers and the developers\n• Illustrating design ideas using storyboards, process flows, and sitemaps.\n• Designing graphic user interface pages and elements, like menus, tabs, and widgets\n• Design wireframes, mockups, storyboards, and fully interactive prototype design"
  },
  documents: {
    offerLetter: "",
    birthCertificate: "",
    guarantorForm: "",
    degreeCertificate: ""
  }
};

// Initialize Profile in localStorage
function initProfileData() {
  if (!localStorage.getItem("userProfile")) {
    localStorage.setItem("userProfile", JSON.stringify(defaultProfileData));
  }
}

// Retrieve Profile Data
function getProfileData() {
  return JSON.parse(localStorage.getItem("userProfile")) || defaultProfileData;
}

// Save Profile Data
function saveProfileData(data) {
  localStorage.setItem("userProfile", JSON.stringify(data));
}

// Sidebar Navigation Tab Switcher
function switchTab(tabKey, element) {
  // Update Active Sidebar Button
  const buttons = document.querySelectorAll(".sidebar-btn");
  buttons.forEach(btn => btn.classList.remove("active"));
  
  if (element) {
    element.classList.add("active");
  }

  // Hide all sections
  const contents = document.querySelectorAll(".tab-content");
  contents.forEach(sec => sec.classList.remove("active"));

  // Show targeted section or fallback
  const targetTab = document.getElementById(`tab-${tabKey}`);
  if (targetTab) {
    targetTab.classList.add("active");
  } else {
    const genericTab = document.getElementById("tab-generic");
    document.getElementById("generic-title").innerText = `${tabKey.replace("-", " ").toUpperCase()} Details`;
    genericTab.classList.add("active");
  }
}

// Handle File Name Update on Document Selection
function handleFileSelect(input, displayId) {
  const file = input.files[0];
  if (file) {
    document.getElementById(displayId).value = file.name;
  }
}

// Load and Populate Form Fields from LocalStorage
function loadFormData() {
  const profile = getProfileData();

  // Personal Details
  if (profile.personal) {
    document.getElementById("display-name").innerText = profile.personal.name;
    document.getElementById("display-dept").innerText = profile.personal.department;
    document.getElementById("display-title").innerText = profile.personal.title;
    document.getElementById("display-category").innerText = profile.personal.category;
  }

  // Next of Kin
  if (profile.nextOfKin) {
    document.getElementById("kin-name").value = profile.nextOfKin.name;
    document.getElementById("kin-job").value = profile.nextOfKin.job;
    document.getElementById("kin-phone").value = profile.nextOfKin.phone;
    document.getElementById("kin-relation").value = profile.nextOfKin.relationship;
    document.getElementById("kin-address").value = profile.nextOfKin.address;
  }

  // Education Details
  if (profile.education) {
    document.getElementById("edu-institution").value = profile.education.institution;
    document.getElementById("edu-dept").value = profile.education.department;
    document.getElementById("edu-course").value = profile.education.course;
    document.getElementById("edu-location").value = profile.education.location;
    document.getElementById("edu-start").value = profile.education.startDate;
    document.getElementById("edu-end").value = profile.education.endDate;
    document.getElementById("edu-desc").value = profile.education.description;
  }

  // Documents Paths
  if (profile.documents) {
    document.getElementById("path-offer").value = profile.documents.offerLetter || "";
    document.getElementById("path-birth").value = profile.documents.birthCertificate || "";
    document.getElementById("path-guarantor").value = profile.documents.guarantorForm || "";
    document.getElementById("path-degree").value = profile.documents.degreeCertificate || "";
  }
}

// Attach Form Submit Event Listeners
function setupFormListeners() {
  // Next of Kin Form Submit
  const kinForm = document.getElementById("next-of-kin-form");
  if (kinForm) {
    kinForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const profile = getProfileData();
      profile.nextOfKin = {
        name: document.getElementById("kin-name").value,
        job: document.getElementById("kin-job").value,
        phone: document.getElementById("kin-phone").value,
        relationship: document.getElementById("kin-relation").value,
        address: document.getElementById("kin-address").value
      };
      saveProfileData(profile);
      alert("Next of Kin details updated successfully!");
    });
  }

  // Education Form Submit
  const eduForm = document.getElementById("education-form");
  if (eduForm) {
    eduForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const profile = getProfileData();
      profile.education = {
        institution: document.getElementById("edu-institution").value,
        department: document.getElementById("edu-dept").value,
        course: document.getElementById("edu-course").value,
        location: document.getElementById("edu-location").value,
        startDate: document.getElementById("edu-start").value,
        endDate: document.getElementById("edu-end").value,
        description: document.getElementById("edu-desc").value
      };
      saveProfileData(profile);
      alert("Educational qualifications updated successfully!");
    });
  }

  // Documents Form Submit
  const docForm = document.getElementById("documents-form");
  if (docForm) {
    docForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const profile = getProfileData();
      profile.documents = {
        offerLetter: document.getElementById("path-offer").value,
        birthCertificate: document.getElementById("path-birth").value,
        guarantorForm: document.getElementById("path-guarantor").value,
        degreeCertificate: document.getElementById("path-degree").value
      };
      saveProfileData(profile);
      alert("Documents submitted successfully!");
    });
  }
}

// Application Lifecycle Bootstrap
document.addEventListener("DOMContentLoaded", () => {
  initProfileData();
  loadFormData();
  setupFormListeners();
});