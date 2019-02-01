let categoriesData = null

async function categoriesReq() {
  const myInit = {
    method: 'GET',
    cache: 'default'
  }
  const response = await fetch('localhost:3000/api/categories' + categoriesId, myInit)
  categoriesData = await response.json();
}

function addContent(target, value) {
  if (!value) {
    document.getElementById(target).firstChild.textContent = '-';
  } else document.getElementById(target).firstChild.textContent = value;
}

function populateTable() {

  addContent('_id', categoriesData._id);
  addContent('name', categoriesData.name);
};

document.addEventListener('DOMContentLoaded', async function() {
  await categoriesReq();
  await populateTable();
});