//hashring.js
var hashring = {
    campaignring : []
};

hashring.load = function(campaign){
    try{
      for (var i = 0; i < campaign.Treatments.length; i++) {
          console.log(campaign.Treatments[i]);
          hashring.add(campaign.Treatments[i]);
      }
    } catch(e){
      throw (e);
    }
}
hashring.add = function(campaign){
    //map each campaign to a new structure:
    //id     campaignId
    //HashId uint32
    var hashed = hashring.castToUint32(campaign.id);
    console.log("hashed value: " + hashed);
    hashring.campaignring.push({id: campaign.id,hashid: hashed, description: campaign.description, path: campaign.path});
    hashring.campaignring.sort(function(a, b) {
            return a.id - b.id;
    });
    
    return hashring.campaignring;
}

hashring.get = function(customerid){
    
    var lengthOfHashRing = hashring.campaignring.length;
    console.log("lengthOfHashRing:" + lengthOfHashRing);
    //using the length, map id to a campaign, since 1 % 1 == 0 and campaign id maps start at 1, add 1 to the result;
    var hashed = (customerid % lengthOfHashRing) + 1;
    console.log("hash of:" + customerid + " is " + hashed);
    var found = hashring.campaignring.find( campaign => campaign.hashid === hashed );
    return found;
}

hashring.castToUint32 = function(diskid){
    //1.7.3 The Unsigned Right Shift Operator ( >>> )
    //Performs a zero-filling bitwise right shift operation on the left operand by the amount > specified by the right operand.
    var uint32 = diskid >>>0;
    return uint32;
}

module.exports = hashring;