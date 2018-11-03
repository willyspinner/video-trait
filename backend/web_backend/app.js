const express = require('express'); 
const app = express();
//TODO: check env variables here, to see if they're defined or not.

const bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(cookieParser());


//NOTE: for each route, we prepend it with 'shmrk' to indicate 'shmrk'

app.post('/analyze', (req, res) => {
      //TODO: handle request here.
});




const port = process.env.PORT || 7200;
const server = app.listen(port);
console.log(`server running on port ${port}`);

// trapping exit signals.
const shutDown = async (signal) => {
    console.warn(`signal ${signal}`, `shutting down gracefully..`);
    //TODO: any cleanup you want to do before shutdown.
    //
    console.warn(`signal ${signal}`, `OK. Bye... 👋`);
    process.exit(0);
}
process.on('SIGTERM', () => shutDown('SIGTERM'));
process.on('SIGINT', () => shutDown('SIGINT'));

