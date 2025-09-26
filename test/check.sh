source curl_jsonlines.sh
function checkStem() {
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
function checkPos() {
  while read -r line; do
    local stem=$(echo $line | jq .stem | sed 's/"//g')
    local oldPos=$(echo $line | jq .oldPos | sed 's/"//g')
    local newPos=$(echo $line | jq .newPos | sed 's/"//g')
    local translation=$(echo $line | jq .translation | sed 's/"//g')
    local key=$stem,$newPos
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
function checkTranslation() {
  while read -r line; do
    local stem=$(echo $line | jq .stem | sed 's/"//g')
    local pos=$(echo $line | jq .pos | sed 's/"//g')
    local oldTranslation=$(echo $line | jq .oldTranslation | sed 's/"//g')
    local newTranslation=$(echo $line | jq .newTranslation | sed 's/"//g')
    local key=$stem,$pos
    echo "Looking up $key"
    local result=$(jq ".glosses[\"$key\"][0]" < $1)
    if [[ $result == "\"$newTranslation\"" ]]; then
      echo "success: $result"
    else
      echo "expected: $newTranslation, found: $result"
    fi
  done < "$2"
  return
}
function modify() {
  curl_jsonlines "$1Replacements.jsonlines" "replace$1"
}
dict=~/Downloads/Dictionary.json
function check() {
  check$1 $dict "$1Replacements.jsonlines"
}
