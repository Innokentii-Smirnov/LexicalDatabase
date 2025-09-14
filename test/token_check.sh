function check() {
  while read -r line; do
    local text=$(echo $line | jq .text | sed 's/"//g')
    local lnr=$(echo $line | jq .lnr | sed 's/"//g')
    local attestation=$text,$lnr
    local transcription=$(echo $line | jq .transcription)
    local old_analysis=$(echo $line | jq .oldAnalysis)
    local new_analysis=$(echo $line | jq .newAnalysis)
    curl localhost:8080 | jq ".corpus[\"$attestation\"]"
    curl localhost:8080 | jq ".dictionary[$transcription]"
    curl localhost:8080 | jq ".concordance[$new_analysis]"
    curl localhost:8080 | jq ".concordance[$old_analysis]"
  done < $1
  return
}
check tokenAnnotationEdits.jsonlines
