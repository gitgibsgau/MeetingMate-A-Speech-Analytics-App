/**
 * Created by Parag_2 on 2/10/2017.
 */
/**
 * Created by Parag_2 on 2/10/2017.
 */
var util = require('util');
var request = require('request');
var db = require('./DBConnector');

var subscriptionKey = 'a720c36c5f3b4cc498d0528eb9e81e84';


module.exports = {
    analyzeTone: function (meetingId,inputText,i) {
        toneAnalyzer(inputText, function (err, res) {
            if (err) return console.log(err);

            //console.log(i+' : '+JSON.stringify(res.documents[0].score));
            db.setMasterMap(meetingId,i,'tone',JSON.stringify(res.documents[0].score));

        });
    }
}


function toneAnalyzer(inputText, callback) {
    if (!inputText) return callback(err);

    var data = [];

    data.push({id: (1).toString(), text: inputText});
    var dataDocuments = {documents: data};

    request({
        url: 'https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment',
        method: 'POST',
        json: true,
        headers: {
            'Content-type': 'application/json',
            'Ocp-Apim-Subscription-Key': subscriptionKey,
        },
        body: dataDocuments

    }, function (err, resp, body) {
        if (err) return callback(err);
        try {
            callback(null, body);
        } catch (e) {
            callback(e);
        }
    });
}
