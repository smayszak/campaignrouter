// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = function(defaultCampaign) {
    //cache configuration, from s3 call on lambda cold start
    var DEFAULT_CAMPAIGN = defaultCampaign; 
    var hashring = require('modules/hashring');
    hashring.load(DEFAULT_CAMPAIGN);
    
    //bring in express- this is a fully functional webserver!
    var express = require('express');
    var app = express();
    
    ///setup body poarser for posts//////////
    var bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({
      extended: true
    }));
    app.use(bodyParser.json());
    
    /////////////app routes/////////////////////
    ///XRAY - Load SDK and register////////////////////////////
    var AWSXRay = require('aws-xray-sdk');
    //to use XRAY, we need to open the segment before we register routes.
    app.use(AWSXRay.express.openSegment('LambdaRequestRouter'));
    
    //Register LAMDBA POST API function handler
    app.post('/', function(req, res) {
        
        //extract input from API call
       var id = req.body.customerId;
       if(isNaN(id)){
            res.status(500).send('Not a valid customer id');
       }
       //map the customer id to a campaign in our hashring
       var campaign = hashring.get(req.body.customerId);
       
       //XRAY Logging additional, searchable data.
       AWSXRay.captureFunc('annotations', function(subsegment){
        subsegment.addAnnotation('Body', JSON.stringify(req.body));
        //XRAY: I can add additional fields here. These will be searchable!
        subsegment.addAnnotation('CustomerId', req.body.customerId);
      });
    
       //Anything i log to console log will appear in cloudwatch logs.
       console.log('customerId: ' + id + ' mapped to: ' + campaign);
       
       //respond to our clients!
        res.json({ campaign: campaign });
    });
    
    //LAMBDA: API - GET function handler
    app.get('/', function(req, res) {
        console.log('received get to listCampaigns');
        res.json({ campaignList: DEFAULT_CAMPAIGN });
    });
    
    ////After registering our routes, we need to close out our XRAY segment/////////////
    app.use(AWSXRay.express.closeSegment());
    
    //finally, return the app so that it can be used.
    return app;
}
