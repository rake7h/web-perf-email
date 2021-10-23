var axios = require('axios'); //importing axios

function makeGet() {
  axios.get(process.env.HEROKU_APP)
    .then(function(response) {
      console.log("Self Ping:" + response.data);
    })
    .catch(function(error) {
      console.log('herokuSelfPing', error);
    })
}
function herokuSelfPing() {
  makeGet();
  setInterval(makeGet, 20 * 60 * 1000); // load every 20 minutes
}

module.exports = herokuSelfPing;
