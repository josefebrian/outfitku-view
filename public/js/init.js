function materializeInit() {
  M.Parallax.init(document.querySelectorAll('.parallax'));
  M.Sidenav.init(document.querySelectorAll('.sidenav'));
  M.Modal.init(document.querySelectorAll('.modal'));
  M.FormSelect.init(document.querySelectorAll('select'));
  M.Tooltip.init(document.querySelectorAll('.tooltipped'), {
    outDuration: 250,
    enterDelay: 500
  });
  M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'));
  M.Carousel.init(document.querySelectorAll('.carousel'));
}

document.addEventListener('DOMContentLoaded', async function() {
  await materializeInit();
});