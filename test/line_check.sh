for key in "KBo 32.14,Rs. 11a" "KBo 32.14,Rs. 12a" "KBo 32.14,Rs. 13a" "KBo 32.14,Rs. 14a"; do
  newkey="copy of $key"
  curl localhost:8080 | jq ".corpus[\"$newkey\"]"
done
