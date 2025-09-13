while read -r line; do
  echo $line | jq .
  curl --header "Content-Type: application/json" \
       --data-raw "$line" \
       http://localhost:8080/replaceMorphologicalAnalysis
done < morphologicalAnalysisReplacements.jsonlines
while read -r line; do
  echo $line | jq .
  curl --header "Content-Type: application/json" \
       --data-raw "$line" \
       http://localhost:8080/replaceTranslation
done < translationReplacements.jsonlines
curl localhost:8080 | grep -E 'Hirsch|Rehbock|curse|verfluchen'
