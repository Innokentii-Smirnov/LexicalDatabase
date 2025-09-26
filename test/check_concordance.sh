source curl_jsonlines.sh
function check_addAttestation() {
  while read -r line; do
    local analysis=$(echo $line | jq .analysis | sed 's/"//g')
    local attestation=$(echo $line | jq .attestation | sed 's/"//g')
    echo "Looking up $analysis"
    local result=$(jq -c ".concordance[\"$analysis\"][0]" < $1)
    if [[ $result == "\"$attestation\"" ]]; then
      echo "success: $result"
    else
      echo "expected: $attestation, found: $result"
    fi
  done < "$2"
  return
}
function check_removeAttestation() {
  while read -r line; do
    local analysis=$(echo $line | jq .analysis | sed 's/"//g')
    local attestation=$(echo $line | jq .attestation | sed 's/"//g')
    echo "Looking up $analysis"
    local result=$(jq -c ".concordance[\"$analysis\"][0]" < $1)
    if [[ $result != "\"$attestation\"" ]]; then
      echo "success: $result"
    else
      echo "unexpected: $attestation, in: $result"
    fi
  done < "$2"
  return
}
function modify() {
  curl_jsonlines "$1Attestations.jsonlines" "$1Attestation"
}
dict=~/Downloads/Dictionary.json
function check() {
  check_$1Attestation $dict "$1Attestations.jsonlines"
}
