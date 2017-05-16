//Environment variables
var outputDir = 'speakerRecognitionSamples/splittedAudios/';
var dir = require('node-dir');
var loop = require('easy-loop');
var dateFormat = require('dateformat');
var wavFileInfo = require('wav-file-info');

const meetingId = '10012';

var date = new Date();

//Class objects
var SplitAudio = require('./SplitAudio');
var Minutes = require('./Minutes');
var ToneAnalysis = require('./ToneAnalysis');
var SpeakerRecognition = require('./SpeakerRecognition');
var db = require('./DBConnector');

//Remove files created for previous execution
SplitAudio.removeFiles(outputDir);

//Wait for 1 sec and then start Speech splitting by tone
setTimeout(splitMeeting, 2000);

//Display results
//setTimeout(db.showMastermap,80000);


//----------------------------------Functions----------------------------------------

function splitMeeting() {
    SplitAudio.speechSplitter(function (result) {
        setTimeout(function () {
            analyzeMeeting(result, function (err,completeFlag) {
                if (err) return console.log(err);

                console.log('Process Complete flag: '+completeFlag);
            });
        }, 2000);
    })
}

function analyzeMeeting(result, callback) {
    console.log('Started');
    dir.files(outputDir, function (err, files) {
        if (err) throw err;

        loop(files, function (i, audioFile, next) {

            setTimeout(function () {
                //Identify the speaker
                SpeakerRecognition.identifySpeaker(meetingId,audioFile, i);

                wavFileInfo.infoByFilename(audioFile, function(err, info){
                    if (err) throw err;
                    //console.log(i +' '+ info.duration);
                    db.setMasterMap(meetingId,i,'duration',info.duration);
                });

                SplitAudio.speechTotextIBM(audioFile, function (err, inputText) {
                    if (err) return console.log(err);

                    db.setMasterMap(meetingId,i,'text',inputText);

                    db.setMasterMap(meetingId,i,'timestamp',dateFormat(date,"dddd, mmmm dd, yyyy, hhMMss"));

                    //Extract important keywords
                    Minutes.extractMinutes(meetingId,inputText, i);

                    //Analyze tone
                     ToneAnalysis.analyzeTone(meetingId,inputText, i);
                });
                next();
            }, 9000);
        })
    });

    callback(null,true);
}


