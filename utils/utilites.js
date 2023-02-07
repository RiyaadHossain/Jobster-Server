const { default: axios } = require("axios");

// To keep Running the Server
axios.get('https://elite-recruiting-server.vercel.app/')
    .then(result => console.log(result))
    .catch(err => console.log(err))