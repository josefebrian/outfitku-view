async function categoriesReq() {
  const myInit = {
    method: 'GET',
    cache: 'default',
    headers: {
      'x-auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzUzMTUwMDExZWY0NjZjYzU1ZmMwNDYiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTQ4OTQ4NzM2fQ.lk6-7nia4pIz2TAX1VP9dRH30gaKVXqnRqFfy0QLaMA'
    }
  }
  const response = await fetch('http://192.168.0.30:3000/api/users', myInit)
  categoriesData = await response.json();
}

function loadCategories() {

  for (i in categoriesData) {
    document.getElementById('categoryId').firstChild.textContent = categoriesData[i]._id;
    document.getElementById('nama').firstChild.textContent = categoriesData[i].name;
  }
}

document.addEventListener('DOMContentLoaded', async function() {
  await categoriesReq();
  await loadCategories();
});