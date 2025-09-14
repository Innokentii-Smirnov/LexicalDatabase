function curl_jsonlines() {
  while read -r line; do
    echo $line | jq .
    curl --header "Content-Type: application/json" \
        --data-raw "$line" \
        http://localhost:8080/$2
  done < $1
  return
}
curl_jsonlines morphologicalAnalysisReplacements.jsonlines replaceMorphologicalAnalysis
curl_jsonlines translationReplacements.jsonlines replaceTranslation
curl_jsonlines stemReplacements.jsonlines replaceStem
curl_jsonlines posReplacements.jsonlines replacePos
curl localhost:8080 | grep -E 'Hirsch|Rehbock|curse|verfluchen|nāli|šid|naali|šidd|ḫimzatḫ|adj'
