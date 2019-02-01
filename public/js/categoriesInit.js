async function categoriesReq() {
  const myInit = {
    method: 'GET',
    cache: 'default',
    headers: {
      'x-auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzUzMTUwMDExZWY0NjZjYzU1ZmMwNDYiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTQ4OTQ4NzM2fQ.lk6-7nia4pIz2TAX1VP9dRH30gaKVXqnRqFfy0QLaMA'
    }
  }
  const response = await fetch('http://192.168.0.30:3000/api/categories', myInit)
  categoriesData = await response.json();
}

function loadCategories() {
  document.getElementById('gambar').src = `http://192.168.0.30:3000/public/img/categories/${categoriesData[2].mainImage}`
}

document.addEventListener('DOMContentLoaded', async function() {
  await categoriesReq();
  await loadCategories();
});