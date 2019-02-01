const express = require('express');
const exphbs = require('express-handlebars');
const bodyParse = require('body-parser');
// const path = require('path');
// const index = require('./view/index.ejs');
// const ejs = require('ejs');

const que = require('./config/database')

var ejs = require('ejs')
  , fs = require('fs')
  , path = __dirname + '/index.ejs'
  , str = fs.readFileSync(path, 'utf8');

var users = [];

users.push({ name: 'Tobi', age: 2, species: 'ferret' })
users.push({ name: 'Loki', age: 2, species: 'ferret' })
users.push({ name: 'Jane', age: 6, species: 'ferret' })

var ret = ejs.render(str, {
  users: users,
  filename: path
});

//Database
// const db = require('./model/sequelizeSetUp');

// //Test DB
// db.authenticate()
// .then(() => console.log('database connected'))
// .catch(err => console.log('Error: '+err));

const app = express();

users = ['geddy', 'neil', 'alex'];

app.set('view engine', ejs);

// app.set('view', path.join(__dirname, 'view'));

app.get("/api/numOfMatches",que.findNumberOfMatches);
app.get("/api/matchesWonPerSeason",que.matchesWonPerSeason);
app.get("/api/extraRunsConceded",que.extraRunsConceded);
app.get("/api/economicalRate",que.economicalRate);

app.get('/', function(req, res){ 
    res.render(path,que.findNumberOfMatches);
  });

app.listen(3000, console.log('server is running on the port 3000'));