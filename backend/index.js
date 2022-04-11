const app = require('./app.js');


//Initiate the server
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));