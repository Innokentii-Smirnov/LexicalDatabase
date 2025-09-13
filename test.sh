while read -r line; do
  echo $line | jq .
  curl --header "Content-Type: application/json" \
       --data-raw "$line" \
       http://localhost:8080/replaceMorphologicalAnalysis
done < morphologicalAnalysisReplacements.jsonlines
curl localhost:8080 > output.txt
grep -E 'Hirsch|Rehbock|curse|verfluchen' < output.txt
