export function renderPage(page) {
  switch (page) {
    case "login":
      document.body.innerHTML =
        '<div class="container" id="formContainer"><h2 class="main-text" id="formTitle">Login</h2><form id="authForm"><div class="error" id="errorMessage"></div><input class="auth-input" type="text" id="username" placeholder="Username" required><input class="auth-input" type="password" id="password" placeholder="Password" required><button class="auth-button" type="submit">Login</button><div class="toggle-link" id="toggleForm">Don\'t have an account? Register</div></form></div>';
      break;
    case "register":
      document.body.innerHTML =
        '<div class="container" id="formContainer"><h2 class="main-text" id="formTitle">Register</h2><form id="authForm"><div class="error" id="errorMessage"></div><input class="auth-input" type="text" id="username" placeholder="Username" required><input class="auth-input" type="password" id="password" placeholder="Password" required><button class="auth-button" type="submit">Register</button><div class="toggle-link" id="toggleForm">Already have an account? Login</div></form></div>';
      break;
    case "user":
      document.body.innerHTML =
        "<h1>Contact Page</h1><p>Contact us at example@example.com.</p>";
      break;
    case "diagram":
      document.body.innerHTML = '<div id="view"><div id="view-area"></div></div>';
      break;
      case "diagrams":
        document.body.innerHTML = '';
        break;
    default:
      document.body.innerHTML = "<h1>404 Not Found</h1>";
  }
}

function navigate(event) {
  event.preventDefault();
  const page = event.target.getAttribute("href").substring(1);
  history.pushState(null, "", page);
  renderPage(page);
}

window.addEventListener("popstate", () => {
  renderPage(location.pathname.substring(1));
});

document.querySelectorAll("a[data-link]").forEach((link) => {
  link.addEventListener("click", navigate);
});

// Initial render
if (!location.pathname || location.pathname === "/") {
  renderPage("home");
} else {
  renderPage(location.pathname.substring(1));
}
