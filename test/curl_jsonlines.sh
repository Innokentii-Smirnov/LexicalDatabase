function curl_jsonlines() {
  while read -r line; do
    echo $line | jq .
    curl --header "Content-Type: application/json" \
        --data-raw "$line" \
        http://localhost:8080/$2
  done < $1
  return
}
