import express from 'express';
import {LexicalDatabase} from './lexicalDatabase.js';

const lexicalDatabase = new LexicalDatabase();

// Constants
var DEFAULT_PORT = 8080;
var DEFAULT_WHO = "World";
var PORT = process.env.PORT || DEFAULT_PORT;
var WHO = process.env.WHO || DEFAULT_WHO;

// App
var app = express();
app.get('/', function (req, res) {
  res.send(lexicalDatabase.toJSON());
});

app.listen(PORT)
console.log('Running on http://localhost:' + PORT);
