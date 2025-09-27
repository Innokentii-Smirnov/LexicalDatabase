source curl_jsonlines.sh
function check_addLine() {
  while read -r jsonline; do
    local attestation=$(echo $jsonline | jq .attestation | sed 's/"//g')
    local line=$(echo $jsonline | jq -c .line)
    echo "Looking up $attestation"
    local result=$(jq -c ".corpus[\"$attestation\"]" < $1)
    if [[ $result == "$line" ]]; then
      echo "success: $result"
    else
      echo "expected: $line, found: $result"
    fi
  done < "$2"
  return
}
function check_updateLine() {
  while read -r jsonline; do
    local attestation=$(echo $jsonline | jq .attestation | sed 's/"//g')
    local position=$(echo $jsonline | jq .position)
    local word=$(echo $jsonline | jq -c .word)
    echo "Looking up $attestation"
    local result=$(jq -c ".corpus[\"$attestation\"][$position]" < $1)
    if [[ $result == "$word" ]]; then
      echo "success: $result"
    else
      echo "expected: $word, found: $result"
    fi
  done < "$2"
  return
}
function modify() {
  curl_jsonlines "$1Line.jsonlines" "$1Line"
}
dict=~/Downloads/Dictionary.json
function check() {
  check_$1Line $dict "$1Line.jsonlines"
}
