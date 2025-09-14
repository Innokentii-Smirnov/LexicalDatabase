import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import {LexicalDatabase} from './objects/lexicalDatabase.js';

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
  res.type('json');
  res.send(lexicalDatabase.toJSON());
});
app.post('/replaceMorphologicalAnalysis', jsonParser, function (req, res) {
  const {transcriptions, origin, target} = req.body;
  lexicalDatabase.replaceMorphologicalAnalysis(transcriptions, origin, target);
  res.sendStatus(204);
});

app.post('/replaceStem', jsonParser, function (req, res) {
  const {oldStem, newStem, pos, translation} = req.body;
  lexicalDatabase.changeStem(oldStem, newStem, pos, translation);
  res.sendStatus(204);
});

app.post('/replacePos', jsonParser, function (req, res) {
  const {stem, oldPos, newPos, translation} = req.body;
  lexicalDatabase.changePos(stem, oldPos, newPos, translation);
  res.sendStatus(204);
});

app.post('/replaceTranslation', jsonParser, function (req, res) {
  const {stem, pos, oldTranslation, newTranslation} = req.body;
  lexicalDatabase.changeTranslation(stem, pos, oldTranslation, newTranslation);
  res.sendStatus(204);
});

app.listen(PORT)
console.log('Running on http://localhost:' + PORT);
