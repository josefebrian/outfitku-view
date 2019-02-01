const express = require('express');

const app = express();

require('./startup/routes')(app);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));