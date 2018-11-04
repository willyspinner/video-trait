const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const workerpool = require('workerpool')
const path = require('path');
const { spawn } = require('child_process');
var request = require('request');
require('dotenv').config({path: path.join(__dirname,"settings.env")})
//var exec = require('child_process').exec;
//var worker = require('child_process');
//TODO: check env variables here, to see if they're defined or not.

/*Youtube OAuth stuff */
var fs = require('fs');
var readline = require('readline');
var {google} = require('googleapis');
var OAuth2 = google.auth.OAuth2;

// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');

const bodyParser = require('body-parser')
app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
//app.use(cookieParser());
let clientSecret, clientId, redirectUrl, oauth2Client;


// our worker pool for downloading and processing videos
const pool = workerpool.pool(path.join(__dirname,"downloader_worker.js"));
/* ==============================================Youtube Auth============================================= */
// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];

let content = fs.readFileSync('client_secret.json');
const credentials = JSON.parse(content);
clientSecret = credentials.web.client_secret;
clientId = credentials.web.client_id;
redirectUrl = credentials.web.redirect_uri;
oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

/* ==============================================Reddit Auth============================================= */
var REDDIT_SCOPES = ['history'];

const reddit_secret = credentials.reddit_secret;
const reddit_id = credentials.reddit_id;
const reddit_response = 'code';
const reddit_state = 'yourtrait';
const reddit_redirect = 'https://yourtrait.app/api/redditCallback';
const reddit_duration = 'temporary';
const reddit_scope = REDDIT_SCOPES.join(',');

app.get('/api/authUrl', (req,res)=>{
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  res.status(200).send(authUrl);
})

app.get('/api/authReddit', (req, res) => {
  const authUrl = `https://www.reddit.com/api/v1/authorize?client_id=${reddit_id}&response_type=${reddit_response}&state=${reddit_state}&redirect_uri=${reddit_redirect}&duration=${reddit_duration}&scope=${reddit_scope}`;
  res.status(200).send(authUrl);
});

app.get('/api/youtubeCallback', (req, res) => {
  res.status(200).sendFile(__dirname + '/youtubeCallback.html');
});

app.get('/api/redditCallback', (req, res) => {
  res.status(200).sendFile(__dirname + '/redditCallback.html');
});

app.post('/api/analyze', (req, res) => {
    // body:
    // req.body.youtubeToken
    if(!req.body.youtubeToken){
        res.status(400).json({"error":"No token present."});
        return;
    }
    req.body.youtubeToken = req.body.youtubeToken.replace('%2F', '/');
    oauth2Client.getToken(req.body.youtubeToken, function(err, token) {
      if (err) {
        res.status(400).json({"error":"token error."});
        return;
      }
      oauth2Client.credentials = token;
      console.log("listing rated videos...")
      videosListMyRatedVideos(oauth2Client,
        {'params': {'myRating': 'like',
      'part': 'contentDetails', 'maxResults': '20'}}
      /* insert youtube API specific req data here */
    ).then((video_items)=>{
        console.log("got rated videos. Downloading videos,extracting frames, and GCP....")
         //var video_urls = video_items.map((item)=>`https://youtube.com/watch?v=${item.id}`);
         var video_ids = video_items.map((item)=>item.id);
        pool.exec('process_video',video_ids).then((aggregated_gcp_output)=>{
          console.log("done. POSTing to nn server. ")
          //NOTE: aggregated_gcp_output  is an array of individual video answers.
          request.post("http://localhost:9500/analyze", {
            json: aggregated_gcp_output
          }, function(err, httpResponse, body){
            if(err){
              res.status(500).json({"error":"nn-server down."});
              return; 
            }
            res.status(200).send(body);
          })

        }).catch(err => {
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
