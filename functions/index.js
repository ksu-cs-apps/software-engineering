const functions = require('firebase-functions');
const admin = require('firebase-admin');
const request = require('request');
const moment = require('moment');
const Promise = require('promise');

// The Firebase Admin SDK to access the Firebase Realtime Database.
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// TODO: Create static versions of the
// Kanban board and burndown chart
// for the current sprint and save them
// to the database
//
// STEP 1: Determine the current sprint
// STEP 2: Render the burndown chart
exports.archiveSprintProgress = functions.https.onRequest((req, res) => {
  admin.database().ref('/projects').once('value')
  .then((snapshot) => {
    var collection = snapshot.val();
    var projects = [];
    for(key in collection) {
      projects.push(collection[key]);
    }
    return projects;
  }).then((projects) => {
    return Promise.all(projects.map(archiveCurrentSprint));
  }).then(() => {
    res.send(200, "Ok\n")
  });
});

function archiveCurrentSprint(project) {
  if(!project.sprints) return;
  var index = project.sprints.findIndex((sprint) => {
    if(!sprint) return false;
    return (moment(sprint.start) < moment() && moment() < moment(sprint.end));
  });
  if(index === -1) return;
  var url = 'https://api.github.com/repos/' + project.ownerID + "/" + project.repoID + "?milestone=" + project.sprints[index].milestone;
  return new Promise(function(fulfill, reject) {
    request(url, (err, response, body) => {
      if(err) reject(err);
      else fulfill(body);
    });
  }).then((data) => {
    admin.database().ref('/archive').push({
      data: data
    });
  });
}
/*
    var projects = snapshot.val();
    for(key in projects) {
      var project = projects[key];
      if(!project.sprints) continue;
      var index = project.sprints.findIndex((sprint) => {
        if(!sprint) return false;
        return (moment(sprint.start) < moment() && moment() < moment(sprint.end));
      });
      if(index > 0) {
        saveSprintData('https://api.github.com/repos/' + project.ownerID + "/" + project.repoID + "?milestone" + project.sprints[index].milestone);
      }
    }
    res.send(200, "Ok\n")
  });
});
*/
function saveSprintData(url) {
//  request.get(url), (err, response, body) => {
    return admin.database().ref('/archive').push({
      data: url
    });
  //});
}

function saveBurndown(sprint) {
  //ReactDomServer.renderToStaticMarkup(<h1>sprint.title</h1>);
  admin.database().ref('/burndowns').push({
    name: "Saving burndown",
    data: sprint,
    html: ReactDomServer.renderToString(React.createElement('h1', null, 'Foo'))
  });
}

function saveKanban(sprint) {
  admin.database().ref('/kanbans').push({
    name: "Saving kanban",
    data: sprint
  });
}
