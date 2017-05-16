/**
 * Created by Parag_2 on 2/10/2017.
 */
var fs = require('fs');
var util = require('util');
var request = require('request');

var subscriptionKey = 'ef0dcbd67047410f958f108f9db35b3d';


module.exports = {
    speechToText: function (audio,i,callback) {

        getAccessToken(subscriptionKey, function (err, accessToken) {
            if (err) return console.log(err);

            prcoessSpeech(audio, accessToken, function (err, res) {
                if (err) return console.log(err);
               //console.log(i+' : '+JSON.stringify(res));

                callback(null,res.header.lexical);
            });
        })
    }
}

function getAccessToken(subscriptionKey, callback) {
    request.post({
        url: 'https://api.cognitive.microsoft.com/sts/v1.0/issueToken',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
            'Ocp-Apim-Subscription-Key': subscriptionKey,
            'Content-Length': 0
        }
    }, function (err, resp, body) {
        if (err) return callback(err);
        try {
            var accessToken = (body);
            if (accessToken) {
                callback(null, accessToken);
            } else {
                callback(body);
                console.log('Not authorized')
            }
        } catch (e) {
            callback(e);
        }
    });
}

function prcoessSpeech(filename, accessToken, callback) {
    fs.readFile(filename, function (err, Data) {
        if (err) return callback(err);
        request.post({
            url: 'https://speech.platform.bing.com/speech/recognition/conversation/cognitiveservices/v1',
            qs: {
                /*
                'scenarios': 'ulm',
                'appid': 'D4D52672-91D7-4C74-8AD8-42B1D98141A5', // DO NOT CHANGE
                'locale': 'en-US',
                'device.os': 'wp7',
                'version': '3.0',
                'format': 'json',
                'requestid': '1d4b6030-9099-11e0-91e4-0800200c9a66', // can be anything
                'instanceid': '1d4b6030-9099-11e0-91e4-0800200c9a66' // can be anything
                */
                'format':'detailed',
                'locale': 'en-US',
                'requestid': '1d4b6030-9099-11e0-91e4-0800200c9a66' // can be anything


            },
            body: Data,
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Host': 'speech.platform.bing.com',
                'Content-Type': 'audio/wav; samplerate=16000',
                'Content-Length': Data.length
            }
        }, function (err, resp, body) {
            if (err) return callback(err);
            try {
                callback(null, JSON.parse(body));
            } catch (e) {
                console.log('Error:'+body);
                callback(e);
            }
        });
    });
}