import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import {LexicalDatabase} from './lexicalDatabase.js';

const jsonText = fs.readFileSync('/data/data/Dictionary.json', 'utf8');
const obj = JSON.parse(jsonText);
const lexicalDatabase = new LexicalDatabase(obj);

// Constants
var DEFAULT_PORT = 8080;
var DEFAULT_WHO = "World";
var PORT = process.env.PORT || DEFAULT_PORT;
var WHO = process.env.WHO || DEFAULT_WHO;

// App
var app = express();
const jsonParser = bodyParser.json();
app.get('/', function (req, res) {
  res.send(lexicalDatabase.toJSON());
});
app.post('/replaceMorphologicalAnalysis',
         jsonParser, function (req, res) {
  const {transcriptions, origin, target} = req.body;
  lexicalDatabase.replaceMorphologicalAnalysis(transcriptions.split(','), origin, target);
});

app.listen(PORT)
console.log('Running on http://localhost:' + PORT);
