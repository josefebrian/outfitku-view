

function editNama() {
  if (document.getElementById('descNama').innerHTML.includes(`<div class="input-field inli`)) {
    return document.getElementById('descNama').innerHTML = document.getElementById(`${document.getElementById('infoNama').innerHTML}Field`).innerHTML
  }

  const infoKey = document.getElementById('infoNama').innerHTML
  document.getElementById('descNama').innerHTML = `<form action="${postActionUrl}" method="post">
  <div class="input-field inline">
    <input id="input" type="text" class="validate">
    <label for="input" id="${document.getElementById('infoNama').innerHTML}Field">${document.getElementById('descNama').innerHTML}</label>
    <button class="inline btn waves-effect waves-light blue-grey" type="submit">
    Kirim
    <i class="material-icons right">send</i></button>
    </div>
  <div class="right inline">
 
  </div>
</form>`
}


