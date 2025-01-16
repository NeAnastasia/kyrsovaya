export class Navbar {
  static singleton = new Navbar();
  constructor() {
    const token = localStorage.getItem("token");
    this.isLoggedIn = token !== null;
    this.renderNav();
  }
  
  login() {
    const token = localStorage.getItem("token");
    this.isLoggedIn = token !== null;
    this.renderNav();
  }

  renderNav() {
    let navlinks = $(".navbar-menu")[0];
    if (this.isLoggedIn) {
      navlinks.innerHTML = `
      <li><a href="#diagrams">Диаграммы</a></li>
      <li><a href="#logout">Выход</a></li>`;
    } else {
      navlinks.innerHTML = `
      <li><a href="#login">Вход</a></li>
      <li><a href="#register">Регистрация</a></li>`;
    }
  }
}
