curl --header "Content-Type: application/json" \
     --data-raw '{"transcriptions":"nāli","origin":"nāli @ Rehbock @ .ABS @ noun @ ","target":"noli @ Hirsch @ .ABS @ noun @ "}' \
     http://localhost:8080/replaceMorphologicalAnalysis
curl localhost:8080 | grep 'Hirsch'
