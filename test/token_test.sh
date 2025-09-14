function curl_jsonlines() {
  while read -r line; do
    echo $line | jq .
    curl --header "Content-Type: application/json" \
        --data-raw "$line" \
        http://localhost:8080/$2
  done < $1
  return
}
curl_jsonlines tokenAnnotationEdits.jsonlines editTokenAnnotation
curl localhost:8080 | jq '.corpus["KBo 32.14,Rs. 10a"]'
curl localhost:8080 | jq '.dictionary["talaḫḫōm"]'
curl localhost:8080 | jq '.concordance["tal+aḫḫ-o-m @ pull out @ TR.PFV-3A.SG @ verb @ "]'
curl localhost:8080 | jq '.concordance["tal-aḫḫ-ō-m @ herausziehen @ aḫḫ-TR.PFV-3A.SG @ verb @ "]'
curl localhost:8080 | jq '.corpus["KBo 32.14,Rs. 11a"]'
curl localhost:8080 | jq '.dictionary["pūziġum"]'
curl localhost:8080 | jq '.concordance["pūz+iġ-o-m @ dive @ TR.PFV-3A.SG @ verbum @ "]'
curl localhost:8080 | jq '.concordance["pūz+iġ-o-m @ eintauchen @ TR.PFV-3A.SG @ verb @ "]'
curl localhost:8080 | jq '.corpus["KBo 32.14,Rs. 12a"]'
curl localhost:8080 | jq '.dictionary["naḫḫab"]'
curl localhost:8080 | jq '.concordance["naḫḫ-a-p @ sit down @ INT-b @ verbum @ "]'
curl localhost:8080 | jq '.concordance["naḫḫ-a-b @ sich setzen; sitzen; einsetzen @ INT-b @ verb @ "]'
