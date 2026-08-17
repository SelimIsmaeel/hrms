
if (!localStorage.getItem("currentUser")) {
  window.location.href = "login.html";
}

// Data Management
class DataManager {
  constructor() {
    this.prefix = "employee_profile_";
    this.initData();
  }

  initData() {
    // 1. Get the currently logged-in user saved during login
    const currentUserData = localStorage.getItem("currentUser");
    const currentUser = currentUserData ? JSON.parse(currentUserData) : null;

    // Helper: Parse name into firstName and lastName if currentUser only has a full name string
    let defaultFirstName = "John";
    let defaultLastName = "Adelaja";

    if (currentUser) {
      if (currentUser.firstName) {
        defaultFirstName = currentUser.firstName;
        defaultLastName = currentUser.lastName || "";
      } else if (currentUser.name || currentUser.fullName) {
        const parts = (currentUser.name || currentUser.fullName).trim().split(" ");
        defaultFirstName = parts[0] || "";
        defaultLastName = parts.slice(1).join(" ") || "";
      }
    }

    // 2. Set Personal Details using logged-in user data
    if (!this.get("personal")) {
      this.set("personal", {
        firstName: defaultFirstName,
        lastName: defaultLastName,
        department: "Design & Marketing",
        jobTitle: "UI / UX Designer",
        jobCategory: "Full time",
      });
    }

    // 3. Set Contact Details using logged-in user email
    if (!this.get("contact")) {
      this.set("contact", {
        phone1: currentUser?.phone || "",
        phone2: "",
        email: currentUser?.email || "johnadelaja@gmail.com",
        city: "",
        address: "Alembank, Addia ababa",
      });
    }

    if (!this.get("nextOfKin")) {
      this.set("nextOfKin", []);
    }
    if (!this.get("education")) {
      this.set("education", []);
    }
    if (!this.get("guarantor")) {
      this.set("guarantor", []);
    }
    if (!this.get("family")) {
      this.set("family", []);
    }
    if (!this.get("financial")) {
      this.set("financial", []);
    }
    if (!this.get("documents")) {
      this.set("documents", []);
    }
  }

  set(key, value) {
    localStorage.setItem(this.prefix + key, JSON.stringify(value));
  }

  get(key) {
    const item = localStorage.getItem(this.prefix + key);
    return item ? JSON.parse(item) : null;
  }

  addToArray(key, item) {
    const array = this.get(key) || [];
    item.id = Date.now();
    array.push(item);
    this.set(key, array);
    return item.id;
  }

  removeFromArray(key, id) {
    const array = this.get(key) || [];
    const filtered = array.filter((item) => item.id !== id);
    this.set(key, filtered);
  }

  updateInArray(key, id, updated) {
    const array = this.get(key) || [];
    const index = array.findIndex((item) => item.id === id);
    if (index !== -1) {
      array[index] = { ...array[index], ...updated };
      this.set(key, array);
    }
  }
}

const dm = new DataManager();

// UI Functions
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = "toast" + (type === "error" ? " error" : "");
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Navigation
document.querySelectorAll(".menu-item").forEach((item) => {
  item.addEventListener("click", () => {
    document
      .querySelectorAll(".menu-item")
      .forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
    const section = item.dataset.section;
    showSection(section);
  });
});

function showSection(section) {
  document
    .querySelectorAll(".section")
    .forEach((s) => s.classList.remove("active"));
  document.querySelector(`[data-section="${section}"]`).classList.add("active");
  loadSectionData(section);
}

function loadSectionData(section) {
  switch (section) {
    case "contact-details":
      loadContactDetails();
      break;
    case "next-of-kin":
      loadNextOfKin();
      break;
    case "education":
      loadEducation();
      break;
    case "guarantor":
      loadGuarantor();
      break;
    case "family":
      loadFamily();
      break;
    case "job":
      loadDocuments();
      break;
    case "financial":
      loadFinancial();
      break;
  }
}

function toggleEditPersonal() {
  const viewMode = document.getElementById("personalViewMode");
  const editMode = document.getElementById("personalEditMode");

  if (editMode.style.display === "none") {
    const personal = dm.get("personal");
    document.getElementById("fullName").value = personal.firstName + " " + personal.lastName;
    document.getElementById("dob").value = personal.dob || "";
    document.getElementById("gender").value = personal.gender || "Male";
    document.getElementById("maritalStatus").value = personal.maritalStatus || "Single";
    viewMode.style.display = "none";
    editMode.style.display = "block";
  } else {
    viewMode.style.display = "block";
    editMode.style.display = "none";
  }
}
toggleEditPersonal()

function savePersonalDetails() {
  const fullNameInput = document.getElementById("fullName").value.trim();
  const nameParts = fullNameInput.split(" ");

  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";
  
  const personal = {
    firstName: firstName,
    lastName: lastName,
    dob: document.getElementById("dob").value,
    gender: document.getElementById("gender").value,
    maritalStatus: document.getElementById("maritalStatus").value,
    department: dm.get("personal").department,
    jobTitle: dm.get("personal").jobTitle,
    jobCategory: dm.get("personal").jobCategory,
  };

  if (!personal.firstName) {
    showToast("Please fill in all required fields", "error");
    return;
  }

  // 1. Update DataManager personal state
  dm.set("personal", personal);

  // 2. Sync back to currentUser in localStorage
  const currentUserData = localStorage.getItem("currentUser");
  if (currentUserData) {
    const currentUser = JSON.parse(currentUserData);
    currentUser.firstName = firstName;
    currentUser.lastName = lastName;
    // Fallbacks if your app relies on 'name' or 'fullName' properties elsewhere
    currentUser.name = `${firstName} ${lastName}`.trim();
    currentUser.fullName = `${firstName} ${lastName}`.trim();

    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }

  // 3. Update active UI elements
  updatePersonalDisplay();

  const headerUserName = document.getElementById("userName");
  if (headerUserName) {
    headerUserName.textContent = `Welcome ${firstName} ${lastName}`.trim();
  }

  document.getElementById("personalViewMode").style.display = "block";
  document.getElementById("personalEditMode").style.display = "none";
  showToast("Personal details updated successfully");
}

function updatePersonalDisplay() {
  const personal = dm.get("personal");
  document.getElementById("profileName").textContent =
    personal.firstName + " " + personal.lastName;
  document.getElementById("deptDisplay").textContent = personal.department;
  document.getElementById("jobTitleDisplay").textContent = personal.jobTitle;
  document.getElementById("jobCategoryDisplay").textContent =
    personal.jobCategory;
}

// Contact Details
function loadContactDetails() {
  const contact = dm.get("contact");
  document.getElementById("phone1").value = contact.phone1 || "";
  document.getElementById("phone2").value = contact.phone2 || "";
  document.getElementById("email").value = contact.email || "";
  document.getElementById("city").value = contact.city || "";
  document.getElementById("address").value = contact.address || "";
}

function saveContactDetails() {
  const contact = {
    phone1: document.getElementById("phone1").value,
    phone2: document.getElementById("phone2").value,
    email: document.getElementById("email").value,
    city: document.getElementById("city").value,
    address: document.getElementById("address").value,
  };

  if (!contact.email || !contact.phone1) {
    showToast("Please fill in required fields", "error");
    return;
  }

  dm.set("contact", contact);
  showToast("Contact details updated successfully");
}

// Next of Kin
function loadNextOfKin() {
  displayNextOfKinList();
}

function saveNextOfKin() {
  const kinName = document.getElementById("kinName");
  const kin = {
    name: kinName.value.trim(),
    occupation: document.getElementById("kinOccupation").value.trim(),
    phone: document.getElementById("kinPhone").value.trim(),
    relationship: document.getElementById("kinRelationship").value.trim(),
    address: document.getElementById("kinAddress").value.trim(),
  };

  if (!kin.name || !kin.phone) {
    showToast("Please fill in required fields", "error");
    return;
  }

  // Check if in edit mode
  if (kinName.dataset.editId) {
    const editId = parseInt(kinName.dataset.editId);
    dm.updateInArray("nextOfKin", editId, kin);
    delete kinName.dataset.editId;
    showToast("Next of kin details updated successfully");
  } else {
    dm.addToArray("nextOfKin", kin);
    showToast("Next of kin details added successfully");
  }

  // Clear form
  kinName.value = "";
  document.getElementById("kinOccupation").value = "";
  document.getElementById("kinPhone").value = "";
  document.getElementById("kinRelationship").value = "";
  document.getElementById("kinAddress").value = "";

  loadNextOfKin();
}

function displayNextOfKinList() {
  const kinList = dm.get("nextOfKin") || [];
  const list = document.getElementById("nextOfKinList");
  list.innerHTML = "";

  if (kinList.length === 0) return;

  kinList.forEach((kin) => {
    const card = document.createElement("div");
    card.className = "kin-card";
    card.innerHTML = `
      <div class="kin-card-grid">
          <div class="kin-field">
              <div class="kin-field-label">Next of kin name</div>
              <div class="kin-field-value">${kin.name}</div>
          </div>
          <div class="kin-field">
              <div class="kin-field-label">Job / Occupation</div>
              <div class="kin-field-value">${kin.occupation}</div>
          </div>
          <div class="kin-field">
              <div class="kin-field-label">Phone Number</div>
              <div class="kin-field-value">${kin.phone}</div>
          </div>
          <div class="kin-field">
              <div class="kin-field-label">Relationship</div>
              <div class="kin-field-value">${kin.relationship}</div>
          </div>
      </div>
      <div class="kin-field">
          <div class="kin-field-label">Residential Address</div>
          <div class="kin-full-address">${kin.address}</div>
      </div>
      <div class="button-group" style="margin-top: 20px;">
          <button class="btn btn-primary" onclick="editNextOfKin(${kin.id})">Update</button>
          <button class="btn btn-danger" onclick="deleteNextOfKin(${kin.id})">Delete</button>
      </div>
    `;
    list.appendChild(card);
  });
}

function editNextOfKin(id) {
  const kinList = dm.get("nextOfKin") || [];
  const kin = kinList.find((k) => k.id === id);
  if (kin) {
    const kinNameInput = document.getElementById("kinName");
    kinNameInput.value = kin.name;
    document.getElementById("kinOccupation").value = kin.occupation;
    document.getElementById("kinPhone").value = kin.phone;
    document.getElementById("kinRelationship").value = kin.relationship;
    document.getElementById("kinAddress").value = kin.address;
    kinNameInput.dataset.editId = id;
    kinNameInput.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast("Edit mode - Change and click Update to save");
  }
}

function deleteNextOfKin(id) {
  if (confirm("Are you sure you want to delete this next of kin entry?")) {
    dm.removeFromArray("nextOfKin", id);
    // Clear form if in edit mode
    const kinName = document.getElementById("kinName");
    if (kinName.dataset.editId == id) {
      kinName.value = "";
      document.getElementById("kinOccupation").value = "";
      document.getElementById("kinPhone").value = "";
      document.getElementById("kinRelationship").value = "";
      document.getElementById("kinAddress").value = "";
      delete kinName.dataset.editId;
    }
    loadNextOfKin();
    showToast("Next of kin entry deleted");
  }
}

// Education
function openEducationModal() {
  document.getElementById("educationModal").classList.add("active");
  document.getElementById("edu-institution").value = "";
  document.getElementById("edu-department").value = "";
  document.getElementById("edu-course").value = "";
  document.getElementById("edu-location").value = "";
  document.getElementById("edu-startDate").value = "";
  document.getElementById("edu-endDate").value = "";
  document.getElementById("edu-description").value = "";
}

function closeEducationModal() {
  document.getElementById("educationModal").classList.remove("active");
}

function saveEducation() {
  const education = {
    institution: document.getElementById("edu-institution").value,
    department: document.getElementById("edu-department").value,
    course: document.getElementById("edu-course").value,
    location: document.getElementById("edu-location").value,
    startDate: document.getElementById("edu-startDate").value,
    endDate: document.getElementById("edu-endDate").value,
    description: document.getElementById("edu-description").value,
  };

  if (!education.institution || !education.course) {
    showToast("Please fill in required fields", "error");
    return;
  }

  dm.addToArray("education", education);
  loadEducation();
  closeEducationModal();
  showToast("Education qualification added successfully");
}

function loadEducation() {
  const education = dm.get("education") || [];
  const list = document.getElementById("educationList");
  list.innerHTML = "";

  if (education.length === 0) {
    list.innerHTML =
      '<div class="empty-state"><div class="empty-state-icon">📚</div><div class="empty-state-text">No educational qualifications added yet</div></div>';
    return;
  }

  education.forEach((edu) => {
    const item = document.createElement("div");
    item.className = "list-item";
    item.innerHTML = `
      <div class="list-item-title">${edu.institution}</div>
      <div class="list-item-details">
          <strong>Course:</strong> ${edu.course} | <strong>Department:</strong> ${edu.department}<br>
          <strong>Location:</strong> ${edu.location}<br>
          <strong>Period:</strong> ${edu.startDate} to ${edu.endDate}
      </div>
      <div class="list-item-actions">
          <button class="btn btn-secondary" onclick="editEducation(${edu.id})">Edit</button>
          <button class="btn btn-danger" onclick="deleteEducation(${edu.id})">Delete</button>
      </div>
    `;
    list.appendChild(item);
  });
}

function editEducation(id) {
  const education = dm.get("education") || [];
  const edu = education.find((e) => e.id === id);
  if (edu) {
    document.getElementById("edu-edit-institution").value = edu.institution;
    document.getElementById("edu-edit-department").value = edu.department;
    document.getElementById("edu-edit-course").value = edu.course;
    document.getElementById("edu-edit-location").value = edu.location;
    document.getElementById("edu-edit-startDate").value = edu.startDate;
    document.getElementById("edu-edit-endDate").value = edu.endDate;
    document.getElementById("edu-edit-description").value = edu.description;
    document.getElementById("editEducationModal").dataset.editId = id;
    document.getElementById("editEducationModal").classList.add("active");
  }
}

function closeEditEducationModal() {
  document.getElementById("editEducationModal").classList.remove("active");
}

function updateEducation() {
  const id = parseInt(
    document.getElementById("editEducationModal").dataset.editId,
  );
  const updated = {
    institution: document.getElementById("edu-edit-institution").value,
    department: document.getElementById("edu-edit-department").value,
    course: document.getElementById("edu-edit-course").value,
    location: document.getElementById("edu-edit-location").value,
    startDate: document.getElementById("edu-edit-startDate").value,
    endDate: document.getElementById("edu-edit-endDate").value,
    description: document.getElementById("edu-edit-description").value,
  };

  if (!updated.institution || !updated.course) {
    showToast("Please fill in required fields", "error");
    return;
  }

  dm.updateInArray("education", id, updated);
  loadEducation();
  closeEditEducationModal();
  showToast("Education qualification updated successfully");
}

function deleteEducation(id) {
  if (confirm("Are you sure you want to delete this qualification?")) {
    dm.removeFromArray("education", id);
    loadEducation();
    showToast("Education qualification deleted");
  }
}

// Guarantor
function openGuarantorModal() {
  document.getElementById("guarantorModal").classList.add("active");
  document.getElementById("guar-name").value = "";
  document.getElementById("guar-job").value = "";
  document.getElementById("guar-phone").value = "";
}

function closeGuarantorModal() {
  document.getElementById("guarantorModal").classList.remove("active");
}

function toggleEditGuarantor() {
  const viewMode = document.getElementById("guarantorViewMode");
  const editMode = document.getElementById("guarantorEditMode");
  
  if (editMode.style.display === "none") {
    viewMode.style.display = "none";
    editMode.style.display = "block";
  } else {
    viewMode.style.display = "block";
    editMode.style.display = "none";
  }
}

function saveGuarantor() {
  const guarantor = {
    name: document.getElementById("guarantorName").value,
    job: document.getElementById("guarantorJob").value,
    phone: document.getElementById("guarantorPhone").value,
  };

  if (!guarantor.name || !guarantor.phone) {
    showToast("Please fill in required fields", "error");
    return;
  }

  dm.addToArray("guarantor", guarantor);
  loadGuarantor();
  toggleEditGuarantor();
  showToast("Guarantor added successfully");
}

function loadGuarantor() {
  const guarantors = dm.get("guarantor") || [];
  const list = document.getElementById("guarantorList");
  list.innerHTML = "";

  if (guarantors.length === 0) {
    list.innerHTML =
      '<div class="empty-state"><div class="empty-state-icon">👤</div><div class="empty-state-text">No guarantors added yet</div></div>';
    return;
  }

  guarantors.forEach((guar) => {
    const item = document.createElement("div");
    item.className = "list-item";
    item.innerHTML = `
      <div class="list-item-title">${guar.name}</div>
      <div class="list-item-details">
          <strong>Occupation:</strong> ${guar.job} | <strong>Phone:</strong> ${guar.phone}
      </div>
      <div class="list-item-actions">
          <button class="btn btn-secondary" onclick="editGuarantor(${guar.id})">Edit</button>
          <button class="btn btn-danger" onclick="deleteGuarantor(${guar.id})">Delete</button>
      </div>
    `;
    list.appendChild(item);
  });
}

function editGuarantor(id) {
  const guarantors = dm.get("guarantor") || [];
  const guar = guarantors.find((g) => g.id === id);
  if (guar) {
    document.getElementById("guarantorName").value = guar.name;
    document.getElementById("guarantorJob").value = guar.job;
    document.getElementById("guarantorPhone").value = guar.phone;
    document.getElementById("editGuarantorModal").dataset.editId = id;
    document.getElementById("editGuarantorModal").classList.add("active");
  }
}

function closeEditGuarantorModal() {
  document.getElementById("editGuarantorModal").classList.remove("active");
}

function updateGuarantor() {
  const id = parseInt(
    document.getElementById("editGuarantorModal").dataset.editId,
  );
  const updated = {
    name: document.getElementById("guarantorName").value,
    job: document.getElementById("guarantorJob").value,
    phone: document.getElementById("guarantorPhone").value,
  };

  if (!updated.name || !updated.phone) {
    showToast("Please fill in required fields", "error");
    return;
  }

  dm.updateInArray("guarantor", id, updated);
  loadGuarantor();
  closeEditGuarantorModal();
  showToast("Guarantor updated successfully");
}

function deleteGuarantor(id) {
  if (confirm("Are you sure you want to delete this guarantor?")) {
    dm.removeFromArray("guarantor", id);
    loadGuarantor();
    showToast("Guarantor deleted");
  }
}

// Family
function toggleEditFamily() {
  const viewMode = document.getElementById("familyViewMode");
  const editMode = document.getElementById("familyEditMode");
  
  if (editMode.style.display === "none") {
    viewMode.style.display = "none";
    editMode.style.display = "block";
  } else {
    viewMode.style.display = "block";
    editMode.style.display = "none";
  }
}

function openFamilyModal() {
  document.getElementById("familyModal").classList.add("active");
  document.getElementById("fam-name").value = "";
  document.getElementById("fam-relationship").value = "";
  document.getElementById("fam-phone").value = "";
  document.getElementById("fam-address").value = "";
}

function closeFamilyModal() {
  document.getElementById("familyModal").classList.remove("active");
}

function saveFamily() {
  const family = {
    name: document.getElementById("familyName").value,
    relationship: document.getElementById("familyRelationship").value,
    phone: document.getElementById("familyPhone").value,
    address: document.getElementById("familyAddress").value,
  };

  if (!family.name || !family.relationship) {
    showToast("Please fill in required fields", "error");
    return;
  }

  dm.addToArray("family", family);
  loadFamily();
  toggleEditFamily();
  showToast("Family member added successfully");
}

function loadFamily() {
  const family = dm.get("family") || [];
  const list = document.getElementById("familyList");
  list.innerHTML = "";

  if (family.length === 0) {
    list.innerHTML =
      '<div class="empty-state"><div class="empty-state-icon">👨‍👩‍👧‍👦</div><div class="empty-state-text">No family members added yet</div></div>';
    return;
  }

  family.forEach((member) => {
    const item = document.createElement("div");
    item.className = "list-item";
    item.innerHTML = `
      <div class="list-item-title">${member.name}</div>
      <div class="list-item-details">
          <strong>Relationship:</strong> ${member.relationship} | <strong>Phone:</strong> ${member.phone}<br>
          <strong>Address:</strong> ${member.address}
      </div>
      <div class="list-item-actions">
          <button class="btn btn-secondary" onclick="editFamily(${member.id})">Edit</button>
          <button class="btn btn-danger" onclick="deleteFamily(${member.id})">Delete</button>
      </div>
    `;
    list.appendChild(item);
  });
}

function editFamily(id) {
  const family = dm.get("family") || [];
  const member = family.find((f) => f.id === id);
  if (member) {
    document.getElementById("familyName").value = member.name;
    document.getElementById("familyRelationship").value = member.relationship;
    document.getElementById("familyPhone").value = member.phone;
    document.getElementById("familyAddress").value = member.address;
    document.getElementById("editFamilyModal").dataset.editId = id;
    document.getElementById("editFamilyModal").classList.add("active");
  }
}

function closeEditFamilyModal() {
  document.getElementById("editFamilyModal").classList.remove("active");
}

function updateFamily() {
  const id = parseInt(
    document.getElementById("editFamilyModal").dataset.editId,
  );
  const updated = {
    name: document.getElementById("familyName").value,
    relationship: document.getElementById("familyRelationship").value,
    phone: document.getElementById("familyPhone").value,
    address: document.getElementById("familyAddress").value,
  };

  if (!updated.name || !updated.relationship) {
    showToast("Please fill in required fields", "error");
    return;
  }

  dm.updateInArray("family", id, updated);
  loadFamily();
  closeEditFamilyModal();
  showToast("Family member updated successfully");
}

function deleteFamily(id) {
  if (confirm("Are you sure you want to delete this family member?")) {
    dm.removeFromArray("family", id);
    loadFamily();
    showToast("Family member deleted");
  }
}

// Financial
function saveFinancial() {
  const finAccount = document.getElementById("fin-account");
  const financial = {
    account: finAccount.value,
    holder: document.getElementById("fin-holder").value,
    bank: document.getElementById("fin-bank").value,
    type: document.getElementById("fin-type").value,
  };

  if (!financial.account || !financial.bank) {
    showToast("Please fill in required fields", "error");
    return;
  }

  // Check if in edit mode
  if (finAccount.dataset.editId) {
    const editId = parseInt(finAccount.dataset.editId);
    dm.updateInArray("financial", editId, financial);
    delete finAccount.dataset.editId;
    showToast("Bank account updated successfully");
  } else {
    dm.addToArray("financial", financial);
    showToast("Bank account added successfully");
  }

  // Clear form
  finAccount.value = "";
  document.getElementById("fin-holder").value = "";
  document.getElementById("fin-bank").value = "";
  document.getElementById("fin-type").value = "";

  loadFinancial();
}

function loadFinancial() {
  const financial = dm.get("financial") || [];
  const list = document.getElementById("financialList");
  list.innerHTML = "";

  if (financial.length === 0) {
    list.innerHTML =
      '<div class="empty-state"><div class="empty-state-icon">🏦</div><div class="empty-state-text">No bank accounts added yet</div></div>';
    return;
  }

  financial.forEach((account) => {
    const card = document.createElement("div");
    card.className = "financial-card";
    card.innerHTML = `
      <div class="financial-info">
          <div class="financial-line">${account.account} | ${account.holder}</div>
          <div class="financial-line">${account.bank} | ${account.type}</div>
      </div>
      <div class="list-item-actions" style="margin-left: 20px;">
          <button class="btn btn-secondary" onclick="editFinancial(${account.id})">Edit</button>
          <button class="btn btn-danger" onclick="deleteFinancial(${account.id})">Delete</button>
      </div>
    `;
    list.appendChild(card);
  });
}

function editFinancial(id) {
  const financial = dm.get("financial") || [];
  const account = financial.find((a) => a.id === id);
  if (account) {
    const finAccount = document.getElementById("fin-account");
    finAccount.value = account.account;
    document.getElementById("fin-holder").value = account.holder;
    document.getElementById("fin-bank").value = account.bank;
    document.getElementById("fin-type").value = account.type;
    finAccount.dataset.editId = id;
    finAccount.focus();
    showToast("Edit mode - Change and click Add Account to save");
  }
}

function deleteFinancial(id) {
  if (confirm("Are you sure you want to delete this account?")) {
    dm.removeFromArray("financial", id);
    loadFinancial();
    showToast("Bank account deleted");
  }
}

// Documents
function uploadDocument(fieldId) {
  const input = document.getElementById(fieldId);
  const file = input.files[0];
  if (!file) {
    showToast("Please select a file", "error");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const documents = dm.get("documents") || [];
    documents.push({
      id: Date.now(),
      name: fieldId,
      filename: file.name,
      data: e.target.result,
      date: new Date().toLocaleDateString(),
    });
    dm.set("documents", documents);
    showToast("Document uploaded successfully");
    input.value = "";
  };
  reader.readAsDataURL(file);
}

function uploadAllDocuments() {
  showToast("All documents processed");
  loadDocuments();
}

function loadDocuments() {
  const documents = dm.get("documents") || [];
  const list = document.getElementById("documentsList");
  list.innerHTML =
    '<div class="section-title" style="margin-top: 30px;">Uploaded Documents</div>';

  if (documents.length === 0) {
    list.innerHTML +=
      '<div class="empty-state"><div class="empty-state-icon">📄</div><div class="empty-state-text">No documents uploaded yet</div></div>';
    return;
  }

  documents.forEach((doc) => {
    const item = document.createElement("div");
    item.className = "card";
    item.innerHTML = `
      <div class="card-header">
          <div class="card-title">${doc.filename}</div>
          <div class="card-actions">
              <button class="btn btn-secondary" onclick="downloadDocument(${doc.id})">Download</button>
              <button class="btn btn-danger" onclick="deleteDocument(${doc.id})">Delete</button>
          </div>
      </div>
      <div style="font-size: 13px; color: #666;">Uploaded: ${doc.date}</div>
    `;
    list.appendChild(item);
  });
}

function deleteDocument(id) {
  if (confirm("Are you sure you want to delete this document?")) {
    const documents = dm.get("documents") || [];
    const filtered = documents.filter((doc) => doc.id !== id);
    dm.set("documents", filtered);
    loadDocuments();
    showToast("Document deleted");
  }
}

function downloadDocument(id) {
  const documents = dm.get("documents") || [];
  const doc = documents.find((d) => d.id === id);
  if (doc) {
    const link = document.createElement("a");
    link.href = doc.data;
    link.download = doc.filename;
    link.click();
    showToast("Download started");
  }
}

// Initialize
updatePersonalDisplay();