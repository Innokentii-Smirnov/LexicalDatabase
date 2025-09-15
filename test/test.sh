source curl_jsonlines.sh
curl_jsonlines morphologicalAnalysisReplacements.jsonlines replaceMorphologicalAnalysis
curl_jsonlines translationReplacements.jsonlines replaceTranslation
curl_jsonlines stemReplacements.jsonlines replaceStem
curl_jsonlines posReplacements.jsonlines replacePos
curl localhost:8080 | grep -E 'Hirsch|Rehbock|curse|verfluchen|nāli|šid|naali|šidd|ḫimzatḫ|adj'
