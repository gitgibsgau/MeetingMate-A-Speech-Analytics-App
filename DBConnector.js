/**
 * Created by Parag_2 on 4/8/2017.
 */
var MongoClient = require('mongodb').MongoClient;
var HashMap = require('hashmap');
var uri = "mongodb://admin:admin@cluster0-shard-00-00-axcdx.mongodb.net:27017,cluster0-shard-00-01-axcdx.mongodb.net:27017,cluster0-shard-00-02-axcdx.mongodb.net:27017/MeetingMate?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";
var fs = require('fs');


//Master map
var masterMap = new HashMap(HashMap);

//A function to fill masterMap
module.exports = {
    setMasterMap: function (meetingID,key, innerkey, value) {
        console.log('Send to DB : '+key+' : '+innerkey+' : '+value);

        MongoClient.connect(uri, function(err, db) {

            if (innerkey.toString().trim() === 'speaker')
                db.collection('Meetings').update({$and: [{"meetingId": meetingID},  {"sentence": key}]},{$set: {speaker:value}},{ upsert: true });
            else if (innerkey.toString().trim() === 'text')
                db.collection('Meetings').update({$and: [{"meetingId": meetingID}, {"sentence": key}]},{$set: {text:value}},{ upsert: true });
            else if (innerkey.toString().trim() === 'keywords')
                db.collection('Meetings').update({$and: [{"meetingId": meetingID}, {"sentence": key}]},{$set: {keywords:value}},{ upsert: true });
            else if (innerkey.toString().trim() === 'tone')
                db.collection('Meetings').update({$and: [{"meetingId": meetingID}, {"sentence": key}]},{$set: {tone:value}},{ upsert: true });
            else if (innerkey.toString().trim() === 'duration')
                db.collection('Meetings').update({$and: [{"meetingId": meetingID}, {"sentence": key}]},{$set: {duration:value}},{ upsert: true });
            else if (innerkey.toString().trim() === 'timestamp')
                db.collection('Meetings').update({$and: [{"meetingId": meetingID}, {"sentence": key}]},{$set: {timestamp:value}},{ upsert: true });
                db.close();
        });
    }
};



//By meetingid Output - id emp name and tone
//By meetingid Output - time duration for each employee and no. of employees


/*
 MongoClient.connect(uri, function(err, db) {
     var cursor = db.collection('Meetings').find();
     //db.collection('Meetings').update({},{$set : {"timestamp":1}},{upsert:false,multi:true});
     var mapQuery1 = new HashMap();

     cursor.each(function(err, doc) {
         if (doc !=null) {
            console.log(doc);
         }
     });
    //db.collection('Meetings').remove();
 db.close();
 });
*/

/*
MongoClient.connect(uri, function(err, db) {
    var cursor = db.collection('Meetings').find();

    var cursor1 =  db.collection('Meetings').find().toArray(function(err,arr){
        var csv = json2csv({ data: arr, fields: query1 });

        fs.writeFile('file.csv', csv, function(err) {
            if (err) throw err;
            console.log('file saved');
        });

    });

    //db.collection('Meetings').drop();
    db.close();
});


*/
