/**
 * Created by Parag_2 on 2/10/2017.
 */
var fs = require('fs');
var util = require('util');
var request = require('request');
var db = require('./DBConnector');
var HashMap = require('hashmap');


var subscriptionKey = '08dec9f79732435a9be16ce2755aa3d5';
//Training audios
var profile1_train = 'speakerRecognitionSamples/train/Daisy.wav';
var profile2_train = 'speakerRecognitionSamples/train/George.wav';
var profile3_train = 'speakerRecognitionSamples/train/Jenna.wav';
var profile4_train = 'speakerRecognitionSamples/train/John.wav';

var profileMap = new HashMap();
profileMap
    .set('ac13b39e-b5aa-4555-b2e8-237a160bec95','Daisy')
    .set('bc1deeb9-b827-43ee-8ad0-cc6b56f15821','George')
    .set('5c4d46d0-e731-425d-9dd1-6711637b9fe1','Jenna')
    .set('eceaa7ac-a73d-49c7-97ef-a3df0ebdaa22','John');


/*
 createProfile(subscriptionKey, function (err, profileId) {
 if (err) return console.log(err);
 profile1 = profileId;
 createEnrollment(profile1_train, subscriptionKey, profileId, function (err, res) {
 if (err) return console.log(err);
 console.log(res);
 });

 })

 createProfile(subscriptionKey, function (err, profileId) {
 if (err) return console.log(err);
 profile2 = profileId;
 createEnrollment(profile2_train, subscriptionKey, profileId, function (err, res) {
 if (err) return console.log(err);
 console.log(res);
 });

 })



 createProfile(subscriptionKey, function (err, profileId) {
 if (err) return console.log(err);
 profile3 = profileId;
 createEnrollment(profile3_train, subscriptionKey, profileId, function (err, res) {
 if (err) return console.log(err);
 console.log(res);
 });

 })




 createProfile(subscriptionKey, function (err, profileId) {
 if (err) return console.log(err);
 profile4 = profileId;
 createEnrollment(profile4_train, subscriptionKey, profileId, function (err, res) {
 if (err) return console.log(err);
 console.log(res);
 });

 })
 */


/*
 getProfiles(subscriptionKey, function (err, res) {
 if (err) return console.log(err);
 console.log(res);
 });
*/



var profileIds = profileMap.keys();

module.exports = {
    identifySpeaker: function (meetingId,profile_test, i) {
        identifyProfile(profile_test, subscriptionKey, profileIds, function (err, resp) {
            if (err) return console.log(err);
            if(!resp['operation-location'])    console.log(resp);
            var requestURL = resp['operation-location'];

            setTimeout(function () {
                    getOperationStatus(requestURL, subscriptionKey, function (err, res) {
                        if (err) return console.log(err);
                        var result = JSON.parse(res)
                        //console.log(i+' : Identified Profile: ' + result.processingResult.identifiedProfileId);
                        db.setMasterMap(meetingId,i,'speaker',profileMap.get(result.processingResult.identifiedProfileId));
                    });
                }
                , 6000);
        });
    }
}


function waitingForOperation() {
    console.log('Waiting for the opration');
}


function createProfile(subscriptionKey, callback) {
    request.post({
        url: 'https://westus.api.cognitive.microsoft.com/spid/v1.0/identificationProfiles',
        headers: {
            'Content-type': 'application/json',
            'Ocp-Apim-Subscription-Key': subscriptionKey,
            'Host': 'westus.api.cognitive.microsoft.com'
        },
        json: {
            'locale': 'en-us',
        }
    }, function (err, resp, body) {
        if (err) return callback(err);
        try {
            var profileId = (body).identificationProfileId;
            if (profileId) {
                console.log('Profile created :' + profileId)
                callback(null, profileId);
            } else {
                callback(body);
            }
        } catch (e) {
            callback(e);
        }
    });
}

function getProfiles(subscriptionKey, callback) {
    request.get({
        url: 'https://westus.api.cognitive.microsoft.com/spid/v1.0/identificationProfiles',
        headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey,
        }
    }, function (err, resp, body) {
        if (err) return callback(err);
        try {
            var profiles = JSON.parse(body);
            callback(null, profiles);
        } catch (e) {
            callback(e);
        }
    });
}

function deleteProfile(subscriptionKey, profileId, callback) {
    request.delete({
        url: 'https://westus.api.cognitive.microsoft.com/spid/v1.0/identificationProfiles/' + profileId,
        headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey,
        }
    }, function (err, resp, body) {
        if (err) return callback(err);
        try {
            var response = JSON.parse(body);
            console.log(response)
        } catch (e) {
            callback(e);
        }
    });
}


function createEnrollment(filename, subscriptionKey, profileId, callback) {
    fs.readFile(filename, function (err, Data) {
        if (err) return callback(err);
        request.post({
            url: 'https://westus.api.cognitive.microsoft.com/spid/v1.0/identificationProfiles/' + profileId + '/enroll?shortAudio=true',
            body: Data,
            headers: {
                'Content-type': 'audio/wav',
                'Ocp-Apim-Subscription-Key': subscriptionKey,
            }
        }, function (err, resp, body) {
            if (err) return callback(err);
            try {
                callback(null, (body));
            } catch (e) {
                callback(e);
            }
        });
    });
}


function identifyProfile(filename, subscriptionKey, profileIds, callback) {
    fs.readFile(filename, function (err, Data) {
        if (err) return callback(err);
        var identifyProfiles = profileIds.join(',');
        request.post({
            url: 'https://westus.api.cognitive.microsoft.com/spid/v1.0/identify?identificationProfileIds=' + identifyProfiles + "&shortAudio=true",
            body: Data,
            headers: {
                'Content-type': 'application/octet-stream',
                'Ocp-Apim-Subscription-Key': subscriptionKey,
            }
        }, function (err, resp) {
            if (err) return callback(err);
            try {
                callback(null, resp.headers);
            } catch (e) {
                callback(e);
            }
        });
    });
}


function getOperationStatus(requestURL, subscriptionKey, callback) {
    request.get({
        url: requestURL,
        headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey,
        }
    }, function (err, resp) {
        if (err) return callback(err);
        try {
            callback(null, resp.body);
        } catch (e) {
            callback(e);
        }
    });

}