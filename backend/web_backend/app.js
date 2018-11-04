const express = require('express'); 
const app = express();
var exec = require('child_process').exec;
//TODO: check env variables here, to see if they're defined or not.

/*Youtube OAuth stuff */
var fs = require('fs');
var readline = require('readline');
var {google} = require('googleapis');
var OAuth2 = google.auth.OAuth2;

// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');

const bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
//app.use(cookieParser());
let clientSecret, clientId, redirectUrl, oauth2Client;

/* ==============================================Youtube Auth============================================= */
// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/youtube.readonly', 'https://www.googleapis.com/auth/cloud-platform'];

let content = fs.readFileSync('client_secret.json');
const credentials = JSON.parse(content);
clientSecret = credentials.web.client_secret;
clientId = credentials.web.client_id;
redirectUrl = credentials.web.redirect_uri; 
oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

app.get('/authUrl', (req,res)=>{
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  res.status(200).send(authUrl);
})

app.post('/analyze', (req, res) => {
    // body:
    // req.body.token
    if(!req.body.token){
        res.status(400).json({"error":"No token present."});
        return;
    }
    oauth2Client.getToken(req.body.token, function(err, token) {
      if (err) {
        res.status(400).json({"error":"token error."});
        return;
      }
      oauth2Client.credentials = token;
      videosListMyRatedVideos(oauth2Client,
        {'params': {'myRating': 'like',
      'part': 'contentDetails', 'maxResults': '20'}} 
      /* insert youtube API specific req data here */
    ).then((video_items)=>{
        // var video_ids = video_items.map((item)=>`https://youtube.com/watch?v=${item.id}`);

        // for (var i = 0; i < video_ids.length ; i++){
        //     exec(`./ytdl.sh ${video_ids[i]}`) 
        // }

        // Creates a client
        console.log(video_items);        
        const client = new vision.ImageAnnotatorClient();

        client
        .labelDetection('./ZfqmFfN.jpg')
        .then(results => {
          const labels = results[0].labelAnnotations;

        console.log('Labels:');
        labels.forEach(label => console.log(label.description));
        })
        .catch(err => {
          console.error('ERROR:', err);
        });





    }).catch((err)=>{
        console.error(err);
        res.status(500).json({"error":"Youtube API error."});
    })
    
 })
});



const port = process.env.PORT || 7200;
app.listen(port);
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






/* ==============================================Youtube Auth============================================= */


/**
 * Remove parameters that do not have values.
 *
 * @param {Object} params A list of key-value pairs representing request
 *                        parameters and their values.
 * @return {Object} The params object minus parameters with no values set.
 */
function removeEmptyParameters(params) {
  for (var p in params) {
    if (!params[p] || params[p] == 'undefined') {
      delete params[p];
    }
  }
  return params;
}

/**
 * Create a JSON object, representing an API resource, from a list of
 * properties and their values.
 *
 * @param {Object} properties A list of key-value pairs representing resource
 *                            properties and their values.
 * @return {Object} A JSON object. The function nests properties based on
 *                  periods (.) in property names.
 */


function videosListMyRatedVideos(auth, requestData) {
    return new Promise((resolve,reject)=>{
        var service = google.youtube('v3');
        var parameters = removeEmptyParameters(requestData['params']);
        parameters['auth'] = auth;
        service.videos.list(parameters, function(err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                reject(err);
                return;
            }else{
                resolve(response.data.items);
            }
        })
    });
}