//keeping a local campaign object around for tests. 
//this matches the format of the raw file in s3.
var campaigns = {
};

campaigns.defaultCampaign = function(){
    var campaignOne = {
        id: '01',
        description:"List based graph",
        path: 'https://s3-us-west-2.amazonaws.com/mayszak-campaign/mock1.png'
        };
        var campaignTwo = {
            id: '02',
             description:"Big Graph",
            path: 'https://s3-us-west-2.amazonaws.com/mayszak-campaign/mock2.png'
        };
        var campaignThree = {
            id: '03',
             description:"Busy graph",
            path: 'https://s3-us-west-2.amazonaws.com/mayszak-campaign/mock3.png'
        };
        
        var codeCampaigns = {
                "CampaignTitle":"Test Graph Layouts",
                "CampaignID":"CMP01",
                "SchemaVersion":"1.0",
                "Treatments": [campaignOne, campaignTwo, campaignThree]
                };
            
     return codeCampaigns;
}

module.exports = campaigns;