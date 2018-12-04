//bring in express- this is a fully functional webserver!
var express = require('express');
var app = express();
///setup body poarser for posts//////////
var bodyParser = require('body-parser');
var defaultCampaignConfig = null;
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

///XRAY - Load SDK and register////////////////////////////
var AWSXRay = require('aws-xray-sdk');
app.use(AWSXRay.express.openSegment('CampaignLambdaDetail'));

//include my custom code (aka - my budiness logic) 
var campaignLoader = require('modules/campaigns');
var hashring = require('modules/hashring');
hashring.load(campaignLoader.defaultCampaign());


/////////////app routes/////////////////////

//LAMDBA POST API function handler
app.post('/', function(req, res) {
   //XRAY Logging additional, searchable data.\//extract input from API call
    var id = req.body.customerId;
  AWSXRay.captureFunc('annotations', function(subsegment){
    //extract input from API call
    var id = req.body.customerId;
    //XRAY: I can add additional fields here. These will be searchable!
    subsegment.addAnnotation('ID', id);
    
    //validation check
   if(isNaN(id)){
        res.status(500).send('Not a valid customer id');
        subsegment.addAnnotation('ErrorMessage', "Not a valid customer id");
   }
   var campaign = hashring.get(id);
   subsegment.addAnnotation('CampaignId', campaign.id);
   //Cloudwatch equip of XRAY annotation without first tier filter support
   console.log('customerId: ' + id + ' mapped to: ' + campaign.id);
   //respond to our clients!
    res.json({ campaign: campaign });
  });
});


//LAMBDA: API - GET function handler
app.get('/', function(req, res) {
    console.log('received get to listCampaigns');
    var data = campaignLoader.defaultCampaign();
    res.json({ campaignList: data });
});

////Xray - close out Xray/////////////
app.use(AWSXRay.express.closeSegment());

// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app;
