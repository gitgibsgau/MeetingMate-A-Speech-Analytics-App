var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var fs = require('fs');
var dir = require('node-dir');
const outputDir = 'speakerRecognitionSamples/splittedAudios/'
var exec = require('child_process').exec;
//var app = require('./app');
var db = require('./DBConnector');

var speech_to_text = new SpeechToTextV1({
    username: 'd21d3ec7-797d-4569-aa75-14d1515b64ca',
    password: 'ydQYpIfTxqKN'
});

//-------------------------------------------------------------------------------------
const meetingSpeech = 'speakerRecognitionSamples/test/Meeting.wav';
//const outputPath = 'speakerRecognitionSamples/test/Meeting-low.wav'

//samplingRateChanger(meetingSpeech);
//setTimeout(speechSplitter,3000);
//removeFiles(outputDir);
//setTimeout(speechSplitter, 3000);

//speechSplitter();
//-------------------------------------------------------------------------------------
module.exports = {
    removeFiles: function (outputDir) {
        dir.files(outputDir, function (err, files) {
            if (err) throw err;
            files.forEach(function (filepath) {
                fs.unlinkSync(filepath);
            })
            console.log('Deleted old files');
        });
    },

    speechSplitter: function (callback) {

        var params;

        params = {
            'model': 'en-US_NarrowbandModel',
            'audio': fs.createReadStream(meetingSpeech),
            'content_type': 'audio/wav',
            'continuous': false,
            'speaker_labels': true,
            'word_confidence': false,
            'max_alternatives': 1,
            'timestamps': false,
            'smart_formatting': true,

        }

        speech_to_text.recognize(params, function (error, transcript) {
            if (error)
                console.log('Error:', error);
            else {
                var timestamps = new Array();
                // Initialize
                var speaker = transcript.speaker_labels[0].speaker
                timestamps.push(0)

                for (var i = 0; i < transcript.speaker_labels.length; i++) {

                    if (speaker != transcript.speaker_labels[i].speaker) {
                        speaker = transcript.speaker_labels[i].speaker
                        timestamps.push(transcript.speaker_labels[i].to - 0.3)
                    }
                }
                timestamps.push(transcript.speaker_labels.length);


                splitMeetingSpeech(meetingSpeech,timestamps, function (err, result) {
                    if (err) return console.log(err);

                    callback(result);
                })


            }
        });
    },
    speechTotextIBM:function (audio,callback) {
    var params;

    params = {
        'model': 'en-US_BroadbandModel',
        'audio': fs.createReadStream(audio),
        'content_type': 'audio/wav',
        'continuous': false,
        'speaker_labels': false,
        'word_confidence': false,
        'max_alternatives': 1,
        'timestamps': false,
        'smart_formatting': true,
    };

    speech_to_text.recognize(params, function (error, transcript) {
        if (error)
            console.log('Error:', error);
        else {
            callback(null,JSON.stringify(transcript.results[0].alternatives[0].transcript,null,2));
        }
    });
}

}

function samplingRateChanger(filePath) {
    var cmd = 'sox ' + filePath + ' −b 16 ' + outputPath + ' channels 1 rate 8k'
    exec(cmd, function (error, stdout, stderr) {
        if (error) {
            console.log(error)
        }
    });
}

function splitMeetingSpeech(file, timestamps,callback) {

    var currentDir = 'cd C:/Users/Parag_2/Desktop/NodeJS_Test/'

    exec(currentDir, function (error, stdout, stderr) {
        if (error) {
            console.log(error)
        }
    });

    for (var i = 1; i < timestamps.length; i++) {
        //console.log(timestamps[i])
        if ((timestamps[i] - timestamps[i - 1]) < 1) {
            continue;
        }
        var cmd = 'ffmpeg -ss ' + timestamps[i - 1] + ' -i ' + file + ' -t ' + (timestamps[i] - timestamps[i - 1]) + ' ' + outputDir + i + '.wav'
        exec(cmd, function (error, stdout, stderr) {
            if (error) {
                console.log(error)
            }
        });
    }
    callback(null,true);
}

function wait(){}


