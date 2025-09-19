cat Dictionary.json | jq -c '{dictionary: {"nāli":.dictionary["nāli"]}, glosses: {}, concordance: {}, corpus: {}}' > Dict.json
curl --header "Content-Type: application/json" \
     --data @Dict.json \
     http://localhost:8080/uploadLexicalDatabase
