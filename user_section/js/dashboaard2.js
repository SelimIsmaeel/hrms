document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  console.log("Current User Data:", currentUser);

  if (!currentUser) {
    console.warn("No user logged in, redirecting to login page");
    window.location.href = "login.html";
    return;
  }

  const userNameElement = document.getElementById("user-name");
  if (userNameElement) {
    const userName = currentUser.name || currentUser.fullName || currentUser.firstName || currentUser.email || "User";
    userNameElement.textContent = userName;
    console.log("Display name set to:", userName);
  }

  const profileBtn = document.getElementById("profile-btn");
  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      window.location.href = "profile.html";
    });
  }

  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      navItems.forEach((i) => i.classList.remove("active"));
      e.target.classList.add("active");
    });
  });

  const leaveForm = document.getElementById("leave-form");
  if (leaveForm) {
    leaveForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const leaveData = {
        userName: currentUser.name || currentUser.email,
        leaveType: document.getElementById("leave-type-input").value,
        startDate: document.getElementById("start-date").value,
        endDate: document.getElementById("end-date").value,
        duration: document.getElementById("duration").value,
        resumptionDate: document.getElementById("resumption-date").value,
        reason: document.getElementById("reason").value,
        reliefOfficer: document.getElementById("relief-officer").value,
        submittedDate: new Date().toISOString(),
        status: "Pending"
      };

      const leaveApplications = JSON.parse(localStorage.getItem("leaveApplications")) || [];
      leaveApplications.push(leaveData);
      localStorage.setItem("leaveApplications", JSON.stringify(leaveApplications));

      console.log("Leave application saved:", leaveData);

      const successModal = document.getElementById("success-modal");
      successModal.classList.remove("hidden");
    });
  }

  function loadLeaveHistory() {
    const leaveApplications = JSON.parse(localStorage.getItem("leaveApplications")) || [];
    const leaveHistoryBody = document.getElementById("leave-history-body");
    
    if (leaveHistoryBody) {
      leaveHistoryBody.innerHTML = "";
      if (leaveApplications.length === 0) {
        leaveHistoryBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No leave applications yet</td></tr>';
      } else {
        leaveApplications.forEach((application) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${application.userName}</td>
            <td>${application.duration} days</td>
            <td>${application.startDate}</td>
            <td>${application.endDate}</td>
            <td>${application.leaveType}</td>
            <td>${application.reason}</td>
            <td>
              <select class="btn-table-action action-select" onchange="handleLeaveAction(this.value, '${application.id || ''}')">
                <option value="" disabled selected>Actions</option>
                <option value="view">View</option>
                <option value="edit">Edit</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
                <option value="download">Download</option>
              </select>
            </td>
          `; 
          leaveHistoryBody.appendChild(row);
        });
      }
    }
  }

  function handleLeaveAction(action, applicationId) {
    if (action === 'view') {
      alert(`Viewing application: ${applicationId}`);
    } else if (action === 'edit') {
      alert(`Editing application: ${applicationId}`);
    } else if (action === 'update') {
      alert(`Updating application: ${applicationId}`);
    } else if (action === 'delete') {
      alert(`Deleting application: ${applicationId}`);
    } else if (action === 'download') {
      alert(`Downloading application: ${applicationId}`);
    }
  }

  window.showHomeView = () => {
    document.getElementById("view-home").classList.remove("hidden");
    document.getElementById("view-leave-dashboard").classList.add("hidden");
    document.getElementById("view-apply-leave").classList.add("hidden");
    document.getElementById("breadcrumb").textContent = "Dashboard";
  };

  window.showLeaveDashboardView = () => {
    document.getElementById("view-home").classList.add("hidden");
    document.getElementById("view-leave-dashboard").classList.remove("hidden");
    document.getElementById("view-apply-leave").classList.add("hidden");
    document.getElementById("breadcrumb").textContent = "Dashboard > Leave Application";
    loadLeaveHistory();
  };

  window.openLeaveForm = (leaveType) => {
    document.getElementById("view-home").classList.add("hidden");
    document.getElementById("view-leave-dashboard").classList.add("hidden");
    document.getElementById("view-apply-leave").classList.remove("hidden");
    document.getElementById("breadcrumb").textContent = "Dashboard > Apply for Leave";
    document.getElementById("leave-type-input").value = leaveType;
  };

  window.closeModalAndReturn = () => {
    const successModal = document.getElementById("success-modal");
    successModal.classList.add("hidden");
    resetForm();
    showLeaveDashboardView();
  };

  window.resetForm = () => {
    document.getElementById("leave-form").reset();
  };

  const qaApplyLeave = document.getElementById("qa-apply-leave");
  if (qaApplyLeave) {
    qaApplyLeave.addEventListener("click", () => {
      openLeaveForm("Annual Leave");
    });
  }

  const editProfileBtn = document.getElementById("editProfileBtn");
  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", () => {
    window.location.href=`profile.html#personalViewMode`
    });
  }

  initCarousel();
});

function initCarousel() {
  const track = document.getElementById("carousel-track");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");
  const dotsContainer = document.getElementById("carousel-dots");
  const cards = document.querySelectorAll(".leave-card");

  if (!track || cards.length === 0) return;

  let currentIndex = 0;
  
  // 1. Define how many cards are visible at once
  const visibleCards = Math.min(cards.length, 4); 
  
  // 2. Calculate the true maximum index to prevent empty space
  const maxIndex = Math.max(0, cards.length - visibleCards);

  // 3. Generate dots ONLY for the valid scroll positions
  if (dotsContainer) {
    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement("button");
      dot.classList.add("carousel-dot");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateCarousel() {
    const offset = -currentIndex * (100 / visibleCards);
    track.style.transform = `translateX(${offset}%)`;
    updateDots();
  }

  function updateDots() {
    const dots = document.querySelectorAll(".carousel-dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  }

  function goToSlide(index) {
    // 4. Use maxIndex here instead of cards.length - 1
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    updateCarousel();
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      currentIndex = Math.max(0, currentIndex - 1);
      updateCarousel();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      // 5. Use maxIndex here to stop the 'Next' button
      currentIndex = Math.min(maxIndex, currentIndex + 1);
      updateCarousel();
    });
  }

  updateCarousel();
}
// to display the username
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (currentUser){
  const fullName = currentUser.firstName + " " + currentUser.lastName;

  document.getElementById("userName").textContent =`Welcome ${fullName}` ;
}