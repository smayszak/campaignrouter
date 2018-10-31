'use strict';

const awsServerlessExpress = require('aws-serverless-express')

var AWS = require('aws-sdk');
var defaultCampaignConfig = null;

var s3 = new AWS.S3();
var params = {Bucket: 'mayszak-campaign', Key: 'campaign.json'};
var configRequest = s3.getObject(params);

exports.handler = (event, context) => {
    configRequest.on('success', function(response) {
            var objectData = response.data.Body.toString('utf-8'); // Use the encoding necessary
            defaultCampaignConfig = JSON.parse(objectData);
            
            const app = require('./app')(defaultCampaignConfig);
            const server = awsServerlessExpress.createServer(app);
            awsServerlessExpress.proxy(server, event, context);
    });

    configRequest.send()    
}
