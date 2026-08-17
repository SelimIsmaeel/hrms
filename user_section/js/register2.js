document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get values
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Check password match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Retrieve existing users or initialize empty array
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Check if user email already exists
    const userExists = existingUsers.some((user) => user.email === email);
    if (userExists) {
      alert("An account with this email address already exists!");
      return;
    }

    // Build new user object
    const newUser = {
      id: Date.now(),
      firstName,
      lastName,
      email,
      phone,
      password,
    };

    // Push and update localStorage
    existingUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(existingUsers));

    alert("Account created successfully! Redirecting to login page...");
    window.location.href = "login.html";
  });

  // Indicator Toggle Logic
  const indicators = document.querySelectorAll(".indicator");
  indicators.forEach((indicator) => {
    indicator.addEventListener("click", () => {
      indicators.forEach((i) => i.classList.remove("active"));
      indicator.classList.add("active");
    });
  });
});
