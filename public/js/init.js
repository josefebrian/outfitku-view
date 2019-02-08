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
  M.Datepicker.init(document.querySelectorAll('.datepicker'), {
    format: 'yyyy-mm-dd',
    maxDate: new Date(new Date().getFullYear() - 14, new Date().getMonth(), new Date().getDate() + 1),
    minDate: new Date(new Date().getFullYear() - 69, new Date().getMonth(), new Date().getDate() + 1),
    setDefaultDate: new Date(new Date().getFullYear() - 25, new Date().getMonth(), new Date().getDate()),
    defaultDate: new Date(new Date().getFullYear() - 25, new Date().getMonth(), new Date().getDate()),
    yearRange: [new Date().getFullYear() - 69, new Date().getFullYear() - 14]
  })
}

document.addEventListener('DOMContentLoaded', async function () {
  await materializeInit();
});