const axios = require('axios');

const getCat = async function() {
  await axios({
      method: 'get',
      url: 'http://192.168.0.30:3000/api/categories'
    })
    .then(function(response) {
      console.log(response.data)
    })
}

getCat()