"use strict";

(() => {
  const toggleButton = document.querySelector(".header__toggle");
  const menu = document.querySelector(".menu-list");

  const hideMenu = () => {
    menu.classList.toggle("menu-list--hidden");
  };

  const showToggleButton = isVisible => {
    toggleButton.classList.toggle("header__toggle--open", isVisible);
  };

  const changeButtonStatus = () => {
    toggleButton.classList.toggle("header__toggle--open");
    toggleButton.classList.toggle("header__toggle--close");
  };

  const changeMenuStatusByClickHandler = () => {
    hideMenu();
    changeButtonStatus();
  };

  hideMenu();
  showToggleButton(true);

  toggleButton.addEventListener('click', changeMenuStatusByClickHandler);
})();
