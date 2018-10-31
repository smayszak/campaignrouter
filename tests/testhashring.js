'use strict';

const supertest = require('supertest'); 
const test = require('unit.js');
const hashring = require('../modules/hashring.js');
hashring.load(mockCampaigns());


describe('Run hashing function', function() {
  it('verifies can take a hash of ids', function(done) {
    var err = undefined;
    var result = hashring.castToUint32('01');
    if(result ==1){
      console.log("valid");
    }else{
      err = "didnt hash to expected value";
    }
    if (err){
      throw err;
    } else{
      done();  
    }
  });
});

describe('Tests the customerid hashing', function() {
  it('verifies we can consistently map customer ids to a campaign', function(done) {

    var one = hashring.get("1");
    if(one.hashid != 2){
        throw Error("1 expected to map to 2 but mapped to: " + one.hashid);
    }
    
    var two = hashring.get("2");
    if(two.hashid !=3){
        throw Error("2 expected to map to 3 but mapped to: " + two.hashid);
    }
    
    var three = hashring.get("3");
    if(three.hashid !=1){
      throw Error("3 expected to map to 1 but mapped to: " + three.hashid);
    }
    
   done();  
  });
});

function mockCampaigns(){
    var cOne = {
        id: '01',
        description: "a",
        path: 'd1'
    }
    var cTwo = {
        id: '02',
        description: "a",
        path: 'd2'
    }
    var cThree = {
        id: '03',
        description: "a",
        path: 'd3'
    }
        var codeCampaigns = {
            "CampaignTitle":"Unit test campaign",
            "CampaignID":"CMPTEST01",
            "SchemaVersion":"1.0",
            "Treatments": [cOne, cTwo, cThree]
            };
   
    return codeCampaigns;
}