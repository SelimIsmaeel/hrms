document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  // --- N Reusable Modal Function ---
  function showModal(message, redirectUrl = null) {
    const modal = document.getElementById("customModal");
    const modalMessage = document.getElementById("modalMessage");
    const closeBtn = document.getElementById("modalCloseBtn");

    // Set the message and show the modal
    modalMessage.textContent = message;
    modal.style.display = "flex";

    // Handle the close button click
    closeBtn.onclick = () => {
      modal.style.display = "none"; // Hide modal

      // If a redirect URL was provided, redirect now
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    };
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;

    // Retrieve existing users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Find user with matching credentials
    const matchedUser = existingUsers.find(
      (user) =>
        user.email.toLowerCase() === email && user.password === password,
    );

    if (matchedUser) {
      // Save currently logged-in user state
      localStorage.setItem("currentUser", JSON.stringify(matchedUser));

      // Replaced alert with custom modal. Passes redirect URL.
      showModal(
        "Login successful! Redirecting to dashboard...",
        "dashboard.html",
      );
    } else {
      // Replaced alert with custom modal. No redirect URL needed.
      showModal(
        "Invalid email or password. Please try again or create an account.",
      );
    }
  });

  // Indicators toggle logic
  const indicators = document.querySelectorAll(".indicator");
  indicators.forEach((indicator) => {
    indicator.addEventListener("click", () => {
      indicators.forEach((i) => i.classList.remove("active"));
      indicator.classList.add("active");
    });
  });
});
