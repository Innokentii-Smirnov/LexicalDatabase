import fs from 'fs';
import express, {Response} from 'express';
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
  try {
    fs.writeFileSync(dictionaryFilePath, lexicalDatabase.toString(), 'utf8');
  } catch (err) {
    console.log('Unable to save the database due to the following error:');
    console.log(err);
    console.log('Continuing without saving the database.\n');
  }
}

let clients: Response[] = [];

// Constants
const uploadLexicalDatabasePath = '/uploadLexicalDatabase';
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
const jsonParser = bodyParser.json({limit: '5mb'});
app.get('/', function (req, res) {
  res.type('json');
  res.set('Access-Control-Allow-Origin', '*');
  res.send(lexicalDatabase.toJSON());
});

app.get('/getLexicalDatabaseUpdates', function (req, res) {
  clients.push(res);
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); // flush the headers to establish SSE with client
  res.on('close', () => {
    res.end();
    clients.splice(clients.indexOf(res), 1);
  });
});

app.post(uploadLexicalDatabasePath, jsonParser, function (req, res) {
  lexicalDatabase = new LexicalDatabase(req.body);
  res.set('Access-Control-Allow-Origin', '*');
  res.sendStatus(204);
  saveLexicalDatabase();
});

app.post('/replaceMorphologicalAnalysis', jsonParser, function (req, res, next) {
  const {transcriptions, origin, target} = req.body;
  lexicalDatabase.replaceMorphologicalAnalysis(transcriptions, origin, target);
  res.set('Access-Control-Allow-Origin', '*');
  res.sendStatus(204);
  saveLexicalDatabase();
  next();
});

app.post('/replaceStem', jsonParser, function (req, res, next) {
  const {oldStem, newStem, pos, translation} = req.body;
  lexicalDatabase.changeStem(oldStem, newStem, pos, translation);
  res.set('Access-Control-Allow-Origin', '*');
  res.sendStatus(204);
  saveLexicalDatabase();
  next();
});

app.post('/replacePos', jsonParser, function (req, res, next) {
  const {stem, oldPos, newPos, translation} = req.body;
  lexicalDatabase.changePos(stem, oldPos, newPos, translation);
  res.set('Access-Control-Allow-Origin', '*');
  res.sendStatus(204);
  saveLexicalDatabase();
  next();
});

app.post('/replaceTranslation', jsonParser, function (req, res, next) {
  const {stem, pos, oldTranslation, newTranslation} = req.body;
  lexicalDatabase.changeTranslation(stem, pos, oldTranslation, newTranslation);
  res.set('Access-Control-Allow-Origin', '*');
  res.sendStatus(204);
  saveLexicalDatabase();
  next();
});

app.post('/addAttestation', jsonParser, function(req, res, next) {
  const { analysis, attestation } = req.body;
  lexicalDatabase.concordance.addAttestation(analysis, attestation);
  res.set('Access-Control-Allow-Origin', '*');
  res.sendStatus(204);
  saveLexicalDatabase();
  next();
});

app.post('/removeAttestation', jsonParser, function(req, res, next) {
  const { analysis, attestation } = req.body;
  lexicalDatabase.concordance.removeAttestation(analysis, attestation);
  res.set('Access-Control-Allow-Origin', '*');
  res.sendStatus(204);
  saveLexicalDatabase();
  next();
});

app.post('/addLine', jsonParser, function(req, res, next) {
  const { attestation, line } = req.body;
  lexicalDatabase.corpus.addLine(attestation, line);
  res.set('Access-Control-Allow-Origin', '*');
  res.sendStatus(204);
  saveLexicalDatabase();
  next();
});

app.post('/updateLine', jsonParser, function(req, res, next) {
  const { attestation, position, word } = req.body;
  lexicalDatabase.corpus.updateLine(attestation, position, word);
  res.set('Access-Control-Allow-Origin', '*');
  res.sendStatus(204);
  saveLexicalDatabase();
  next();
});

function removePrefix(prefix: string, text: string): string {
  if (text.startsWith(prefix)) {
    return text.substring(prefix.length);
  } else {
    return text;
  }
}

app.post('/*path', jsonParser, function(req, res, next) {
  if (req.path !== uploadLexicalDatabasePath) {
    const message = 'data: ' + JSON.stringify(req.body);
    const event = `event: ${removePrefix('/', req.path)}\n${message}\n\n`;
    console.log(`Sending to ${clients.length} clients:\n${event}`);
    clients.forEach(client => client.write(event));
  }
});

app.listen(PORT)
console.log('Running on http://localhost:' + PORT);
