 const defaultLeaveRecords = [
    { id: 1, name: "Abenezer kebede", duration: 5, startDate: "22/04/2022", endDate: "28/04/2022", type: "Sick", reason: "Personal" },
    { id: 2, name: "Abenezer kebede", duration: 7, startDate: "22/04/2022", endDate: "30/04/2022", type: "Exam", reason: "Examination" },
    { id: 3, name: "Abenezer kebede", duration: 120, startDate: "22/04/2022", endDate: "28/06/2022", type: "Maternity", reason: "Child Care" },
    { id: 4, name: "Abenezer kebede", duration: 5, startDate: "22/04/2022", endDate: "28/04/2022", type: "Sick", reason: "Personal" },
    { id: 5, name: "Abenezer kebede", duration: 5, startDate: "22/04/2022", endDate: "28/04/2022", type: "Sick", reason: "Personal" }
  ];

  let leaveRecords = [...defaultLeaveRecords];

  function getRecords() { return leaveRecords; }

  function renderLeaveHistory() {
    const tableBody = document.getElementById("leave-history-body");
    tableBody.innerHTML = "";
    getRecords().forEach(record => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${record.name}</td>
        <td>${record.duration}</td>
        <td>${record.startDate}</td>
        <td>${record.endDate}</td>
        <td>${record.type}</td>
        <td>${record.reason}</td>
        <td><button class="btn-table-action">Actions <i class="fa-solid fa-chevron-down"></i></button></td>
      `;
      tableBody.appendChild(row);
    });
  }

  function hideAllViews() {
    document.getElementById("view-home").classList.add("hidden");
    document.getElementById("view-leave-dashboard").classList.add("hidden");
    document.getElementById("view-apply-leave").classList.add("hidden");
  }

  function showHomeView() {
    hideAllViews();
    document.getElementById("view-home").classList.remove("hidden");
    document.getElementById("breadcrumb").innerText = "Dashboard";
  }

  function showLeaveDashboardView() {
    hideAllViews();
    document.getElementById("view-leave-dashboard").classList.remove("hidden");
    document.getElementById("breadcrumb").innerText = "Dashboard > Apply for Leave";
    renderLeaveHistory();
    initCarousel();
  }

  function openLeaveForm(leaveType) {
    hideAllViews();
    document.getElementById("view-apply-leave").classList.remove("hidden");
    document.getElementById("breadcrumb").innerText = `Dashboard > Apply for Leave > ${leaveType}`;
    document.getElementById("leave-type-input").value = leaveType;
    document.getElementById("form-subtitle").innerText = `Fill the required fields below to apply for ${leaveType.toLowerCase()}.`;
  }

  // Quick action pill -> leave overview
  document.getElementById("qa-apply-leave").addEventListener("click", showLeaveDashboardView);

  document.getElementById("file-input").addEventListener("change", function(e) {
    const fileName = e.target.files[0] ? e.target.files[0].name : "";
    document.getElementById("file-chosen-name").innerText = fileName;
  });

  function resetForm() {
    document.getElementById("leave-form").reset();
    document.getElementById("file-chosen-name").innerText = "";
  }

  document.getElementById("leave-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const type = document.getElementById("leave-type-input").value.replace(" Leave", "");
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;
    const duration = document.getElementById("duration").value;
    const reason = document.getElementById("reason").value || "Personal";

    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      const [y, m, d] = dateStr.split("-");
      return `${d}/${m}/${y}`;
    };

    const newRecord = {
      id: Date.now(),
      name: "Biruk Dawit",
      duration: duration,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      type: type,
      reason: reason
    };

    leaveRecords.unshift(newRecord);
    document.getElementById("success-modal").classList.remove("hidden");
  });

  function closeModalAndReturn() {
    document.getElementById("success-modal").classList.add("hidden");
    resetForm();
    showLeaveDashboardView();
  }

  /* ---------- Carousel logic ---------- */
  let carouselIndex = 0;
  let carouselCardsPerView = 4;
  let carouselTotalCards = 0;
  let carouselInitialized = false;

  function getCardsPerView() {
    const w = window.innerWidth;
    if (w <= 560) return 1;
    if (w <= 900) return 2;
    return 4;
  }

  function updateCarousel() {
    const track = document.getElementById("carousel-track");
    const cards = track.children;
    carouselTotalCards = cards.length;
    if (carouselTotalCards === 0) return;

    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 20;
    const offset = carouselIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    const maxIndex = Math.max(0, carouselTotalCards - carouselCardsPerView);
    document.getElementById("carousel-prev").disabled = carouselIndex <= 0;
    document.getElementById("carousel-next").disabled = carouselIndex >= maxIndex;

    // dots: one per "page"
    const dotsContainer = document.getElementById("carousel-dots");
    const pageCount = maxIndex + 1;
    dotsContainer.innerHTML = "";
    for (let i = 0; i < pageCount; i++) {
      const dot = document.createElement("button");
      dot.className = "carousel-dot" + (i === carouselIndex ? " active" : "");
      dot.addEventListener("click", () => {
        carouselIndex = i;
        updateCarousel();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function carouselNext() {
    const maxIndex = Math.max(0, carouselTotalCards - carouselCardsPerView);
    if (carouselIndex < maxIndex) {
      carouselIndex++;
      updateCarousel();
    }
  }

  function carouselPrev() {
    if (carouselIndex > 0) {
      carouselIndex--;
      updateCarousel();
    }
  }

  function initCarousel() {
    carouselCardsPerView = getCardsPerView();
    carouselIndex = 0;
    updateCarousel();

    if (!carouselInitialized) {
      document.getElementById("carousel-next").addEventListener("click", carouselNext);
      document.getElementById("carousel-prev").addEventListener("click", carouselPrev);
      window.addEventListener("resize", () => {
        const newCardsPerView = getCardsPerView();
        if (newCardsPerView !== carouselCardsPerView) {
          carouselCardsPerView = newCardsPerView;
          carouselIndex = 0;
        }
        updateCarousel();
      });
      carouselInitialized = true;
    }
  }

  /* ---------- Mobile nav toggle ---------- */
  document.getElementById("nav-hamburger").addEventListener("click", () => {
    document.querySelector(".nav-center").classList.toggle("open");
  });
  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", () => {
      document.querySelector(".nav-center").classList.remove("open");
    });
  });

  document.addEventListener("DOMContentLoaded", () => {
    renderLeaveHistory();
    showHomeView();
  });

  function profileFunction() {
    let profileButton = document.getElementById("profile-btn");
    profileButton.addEventListener('click', () => {
      window.location.href ="profile.html";
    });
  }
   profileFunction()

