import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import {LexicalDatabase} from './objects/lexicalDatabase.js';

const dictionaryFilePath = '/data/data/Dictionary.json';

let lexicalDatabase: LexicalDatabase;
if (fs.existsSync(dictionaryFilePath)) {
  const jsonText = fs.readFileSync(dictionaryFilePath, 'utf8');
  const obj = JSON.parse(jsonText);
  lexicalDatabase = new LexicalDatabase(obj);
} else {
  lexicalDatabase = new LexicalDatabase(undefined);
}

function saveLexicalDatabase(): void {
  fs.writeFileSync(dictionaryFilePath, lexicalDatabase.toString(), 'utf8')
}

// Constants
var DEFAULT_PORT = 8080;
var DEFAULT_WHO = "World";
var PORT = process.env.PORT || DEFAULT_PORT;
var WHO = process.env.WHO || DEFAULT_WHO;

// App
var app = express();
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
const jsonParser = bodyParser.json();
app.get('/', function (req, res) {
  res.type('json');
  res.set('Access-Control-Allow-Origin', '*');
  res.send(lexicalDatabase.toJSON());
});

app.post('/uploadLexicalDatabase', jsonParser, function (req, res) {
  const {transcriptions, origin, target} = req.body;
  lexicalDatabase.replaceMorphologicalAnalysis(transcriptions, origin, target);
  res.set('Access-Control-Allow-Origin', '*');
  res.sendStatus(204);
  saveLexicalDatabase();
});

app.post('/replaceMorphologicalAnalysis', jsonParser, function (req, res) {
  lexicalDatabase = new LexicalDatabase(req.body);
  res.set('Access-Control-Allow-Origin', '*');
  res.sendStatus(204);
  saveLexicalDatabase();
});

app.post('/replaceStem', jsonParser, function (req, res) {
  const {oldStem, newStem, pos, translation} = req.body;
  lexicalDatabase.changeStem(oldStem, newStem, pos, translation);
  res.set('Access-Control-Allow-Origin', '*');
  res.sendStatus(204);
  saveLexicalDatabase();
});

app.post('/replacePos', jsonParser, function (req, res) {
  const {stem, oldPos, newPos, translation} = req.body;
  lexicalDatabase.changePos(stem, oldPos, newPos, translation);
  res.set('Access-Control-Allow-Origin', '*');
  res.sendStatus(204);
  saveLexicalDatabase();
});

app.post('/replaceTranslation', jsonParser, function (req, res) {
  const {stem, pos, oldTranslation, newTranslation} = req.body;
  lexicalDatabase.changeTranslation(stem, pos, oldTranslation, newTranslation);
  res.set('Access-Control-Allow-Origin', '*');
  res.sendStatus(204);
  saveLexicalDatabase();
});

app.post('/addAttestation', jsonParser, function(req, res) {
  const { analysis, attestation } = req.body;
  lexicalDatabase.concordance.addAttestation(analysis, attestation);
  res.set('Access-Control-Allow-Origin', '*');
  res.sendStatus(204);
  saveLexicalDatabase();
});

app.post('/removeAttestation', jsonParser, function(req, res) {
  const { analysis, attestation } = req.body;
  lexicalDatabase.concordance.removeAttestation(analysis, attestation);
  res.set('Access-Control-Allow-Origin', '*');
  res.sendStatus(204);
  saveLexicalDatabase();
});

app.post('/addLine', jsonParser, function(req, res) {
  const { attestation, line } = req.body;
  lexicalDatabase.corpus.addLine(attestation, line);
  res.set('Access-Control-Allow-Origin', '*');
  res.sendStatus(204);
  saveLexicalDatabase();
});

app.post('/updateLine', jsonParser, function(req, res) {
  const { attestation, position, word } = req.body;
  lexicalDatabase.corpus.updateLine(attestation, position, word);
  res.set('Access-Control-Allow-Origin', '*');
  res.sendStatus(204);
  saveLexicalDatabase();
});

app.listen(PORT)
console.log('Running on http://localhost:' + PORT);
