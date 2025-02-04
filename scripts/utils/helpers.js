export const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  return token !== null;
}

export const getNavbarHeight = () => {
  const navbar = document.getElementById("navbar");
  return navbar ? navbar.offsetHeight : 0;
}
