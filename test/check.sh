source curl_jsonlines.sh
function check_stems() {
  while read -r line; do
    local oldStem=$(echo $line | jq .oldStem | sed 's/"//g')
    local newStem=$(echo $line | jq .newStem | sed 's/"//g')
    local pos=$(echo $line | jq .pos | sed 's/"//g')
    local translation=$(echo $line | jq .translation | sed 's/"//g')
    local key=$newStem,$pos
    echo "Looking up $key"
    local result=$(jq ".glosses[\"$key\"][0]" < $1)
    if [[ $result == "\"$translation\"" ]]; then
      echo "success: $result"
    else
      echo "expected: $translation, found: $result"
    fi
  done < "$2"
  return
}
function modify_stems() {
  curl_jsonlines stemReplacements.jsonlines replaceStem
}
dict_path=~/Downloads/Dictionary.json
function test_stems() {
  check_stems $dict_path stemReplacements.jsonlines
}
