export const renderLoginPage = () => {
  return `<div class="auth-container" id="formContainer">
      <h2 class="main-text" id="formTitle">Login</h2>
      <form id="authForm">
        <div class="error" id="errorMessage"></div>
        <input
          class="auth-input"
          type="text"
          id="username"
          placeholder="Username"
          required
        /><input
          class="auth-input"
          type="password"
          id="password"
          placeholder="Password"
          required
        /><button class="auth-button" type="submit">Login</button>
        <div class="toggle-link" id="toggleForm" href="#register">
          Don\'t have an account? Register
        </div>
      </form>
    </div>`;
};
