/**
 * Created by Parag_2 on 5/14/2017.
 */
var MongoClient = require('mongodb').MongoClient;
var HashMap = require('hashmap');
var uri = "mongodb://admin:admin@cluster0-shard-00-00-axcdx.mongodb.net:27017,cluster0-shard-00-01-axcdx.mongodb.net:27017,cluster0-shard-00-02-axcdx.mongodb.net:27017/MeetingMate?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";
var fs = require('fs');
var endOfLine = require('os').EOL;

//For the first graph for Employee vs Tone per meeting
MongoClient.connect(uri, function(err, db) {
    var cursor = db.collection('Meetings').find();
    var mapQuery1 = new HashMap();

    cursor.each(function(err, doc) {
        if (doc !=null){

            if(mapQuery1.get(doc.speaker)==undefined){
                mapQuery1.set(doc.speaker,doc.tone);
            }else {
                var oldTone = parseFloat(mapQuery1.get(doc.speaker));
                var newTone = parseFloat(doc.tone);
                doc.tone=(oldTone+newTone).toString();
                mapQuery1.set(doc.speaker,((oldTone+newTone)/2).toString());
            }
        }else{
            //Create a file with headers
            fs.writeFile('file.csv', ('firstname,Tone'+endOfLine), function(err) {
                if (err) throw err;
            });
            //Append values
            mapQuery1.forEach(function(value, key) {
                if(key!=null)
                    fs.appendFile('file.csv', (key+','+value+endOfLine), function (err) {
                    if (err) throw err;
                });
            });
        }
    });

    db.close();
});


//For the second graph for Employee vs Tone per meeting
MongoClient.connect(uri, function(err, db) {
    var cursor = db.collection('Meetings').find();

    var mapQuery2 = new HashMap(HashMap);
    var innerDayMap = new HashMap();
    innerDayMap.set('Fri',0)
        .set('Mon',0)
        .set('Tue',0)
        .set('Wed',0)
        .set('Thu',0);

    cursor.each(function(err, doc) {
        if (doc !=null){
            if(mapQuery2.get(doc.speaker)==undefined ){
                innerDayMap.forEach(function(value, key) {
                    if (JSON.stringify(doc.timestamp).indexOf(key) > -1) {
                        mapQuery2.set(doc.speaker,innerDayMap);
                        var tempMap= new HashMap();
                        tempMap.copy(mapQuery2.get(doc.speaker));
                        tempMap.set(key, (doc.duration).toString());
                        mapQuery2.set(doc.speaker,tempMap);
                    }
                });

            }else {
                innerDayMap.forEach(function(value, key) {
                    if (JSON.stringify(doc.timestamp).indexOf(key) > -1) {
                        var oldTime = parseFloat(mapQuery2.get(doc.speaker).get(key));
                        var newTime = parseFloat(doc.duration);

                        var tempMap= new HashMap();
                        tempMap.copy(mapQuery2.get(doc.speaker));
                        tempMap.set(key, (oldTime + newTime).toString());
                        mapQuery2.set(doc.speaker,tempMap);
                    }
                });
            }
        }else{
            //Create a file with headers
            fs.writeFile('file2.csv', ('firstname,Mon,Tue,Wed,Thu,Fri'+endOfLine), function(err) {
                if (err) throw err;
            });
            //Append values
            mapQuery2.forEach(function(value, key) {
                if(key!=null)
                        fs.appendFile('file2.csv', (key+','+value.get('Mon')+','+value.get('Tue')+','+value.get('Wed')+','+value.get('Thu')+','+value.get('Fri')+endOfLine), function (err) {
                    if (err) throw err;
                });
            });
        }
    });
    db.close();
});


