var restify = require('restify');
var builder = require('botbuilder');
var express = require('express');
var app = express();
var https = require("https");
var request = require('request');
var fs = require('fs');
var passport = require('passport-facebook');

try{
    var configuration = require('./configure.js');
}catch(e){
    console.log("configuration file is hidden on github for security");
    configuration = null;
}



//=========================================================
// Bot Setup
//=========================================================

//set up server with express
var PORT = process.env.PORT || 8080;
app.listen(PORT, function () {
   console.log('listening to %s', PORT); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
app.post('/event', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================
// bot.dialog('/', function (session) {
//     var currentTime = (new Date()).toJSON();
//     var user_text = session.message.text;
//      session.sendTyping();
//     if(user_text == 'what is time now?'){
//         session.send(session.message.timestamp);
//     }else{
       
//         bot.beginDialog(,'/standup', { userId: 99, reportId: 100 });
//     }

// });

// app.post('/api/standup', function (req, res) {
//     // Get list of team members to run a standup with.
//     var members = req.body.members;
//     var reportId = req.body.reportId;
//     for (var i = 0; i < members.length; i++) {
//         // Start standup for the specified team member
//         var user = members[i];
//         var address = JSON.parse(user.address);
//         bot.beginDialog(address, '/standup', { userId: user.id, reportId: reportId });
//     }
//     res.status(200);
//     res.end();
// });
//---------------------------imp-------------
// bot.dialog('/', [
//     function (session) {
//         session.beginDialog('/askName');
//     },
//     function (session, results) {
//         session.send('Hello %s!', results.response);
//     }
// ]);
// bot.dialog('/askName', [
//     function (session) {
//         builder.Prompts.text(session, 'Hi! What is your name?');
//     }
// ]);

//-------------------final waterfall-------------------------
// bot.dialog('/', new builder.IntentDialog()
//     .matches(/^hi/i, [function (session) {
//             session.beginDialog('/askName');
//         },function (session, results) {
//             session.sendTyping();
//             session.send('Hello %s!', results.response);
//             var msg = new builder.Message(session)
//             .attachments([{
//                 contentType: "image/jpeg",
//                 contentUrl: "http://www.theoldrobots.com/images62/Bender-18.JPG"
//             }]);
//             session.send(msg);
//             session.endConversation("Ok… Goodbye.");
//         }
//     ])
//     .onDefault(function (session) {
//         session.send("I didn't understand. Say hi to me!");
//     }));
    
// bot.dialog('/askName', [
//     function (session) {
//         builder.Prompts.text(session, 'Hi There! What is your name?');
//     }
// ]);

//--------------------------------test with https
// bot.dialog('/',function(session){
//     request({
//         method: 'GET',
//         uri: 'https://graph.facebook.com/v2.8/search?q=orlando&type=event&access_token=EAACEdEose0cBANpcAechlCLxvaaH1ZCk38dMlpLyZCei1qYvghyJXybr0FbqYO3opX0S2tHKZCj4DOxg2ol2ZCWwQPMo7kay3ZCJyyR77SdezU4eXUzq6D3ig5M4MHupqTwC1ytgBpW6VQwUNLicVwktDxV4zbUdIJ4UANrDQwAZDZD'
//       },
//       function (error, response, body) {
//         if (error) {
//           return console.error('upload failed:', error);
//         }
        
//         fs.writeFile('./facebook_data/events.json', body,'utf-8',function(err, data){
//             if(err){
//                 return console.log("Error while writing file "+ err);
//             }
//         });

//       });
// });

var city = configure.city;
var access_token = configure.access_token;

app.get('/facebook/login', function(req, res) {
    res.sendFile(__dirname + '/login.html');
});

app.get('/facebook/sucess', function(request, response) {
    console.log(request.query.hackthon);
    request.pause();
    response.status = 400;
    response.end('something went wrong...');
});
//--------------final with facebook events-------------------
bot.dialog('/', new builder.IntentDialog()
    .matches(/^hi/i, [function (session) {
            session.beginDialog('/askName');
        },function (session, results) {
            
            
            // session.sendTyping();
            // session.send('List of 10 events around u');
            // request({
            //     method: 'GET',
            //     uri: 'https://graph.facebook.com/v2.8/search?q='+city+'&type=event&access_token='+access_token
            //   },
            //   function (error, response, body) {
            //     if (error) {
            //       return console.error('upload failed:', error);
            //     }
                
            //     fs.writeFile('./facebook_data/events.json', body,'utf-8',function(err, data){
            //         if(err){
            //             return console.log("Error while writing file "+ err);
            //         }
            //         fs.readFile('./facebook_data/events.json','utf-8',function(err, data){
            //             if(err){
            //                 return console.log("Error while writing file "+ err);
            //             }
            //             var eventlist = JSON.parse(data);
            //             for(var i=0;i<10;i++){
            //                 session.send(eventlist.data[i].name);
            //             } 
            //             session.endConversation("Ok… Goodbye.");
            //         });
                    
            //     });

            // });
        }
    ])
    .onDefault(function (session) {
        session.send("I didn't understand. Say hi to me!");
    }));
    
bot.dialog('/askName', [
    function (session) {
        builder.Prompts.text(session, 'Hi There! What is your name?');
    },function(session, results){
        session.send('Hello %s!, Can you login in ', results.response);
        var msg = new builder.Message(session)
            .attachments([
                new builder.SigninCard(session)
                    .button("facebook login","http://localhost:8080/facebook/login")
            ]);
        session.endDialog(msg);
    }
]);
