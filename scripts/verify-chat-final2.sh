#!/usr/bin/env bash
set -u
cd /home/z/my-project
mkdir -p /tmp/shots

SESS="chatv3"
SB() { agent-browser --session "$SESS" "$@"; }
BASE="http://localhost:3000"
BK="test-device-b"
BKEY=$(SB eval "localStorage.getItem('randap_device_key')" 2>/dev/null | tr -d '"')
echo "browser: $BKEY"

setsid bun run dev </dev/null >> dev.log 2>&1 &
sleep 4
for i in $(seq 1 100); do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 $BASE 2>/dev/null)
  [ "$code" = "200" ] && { echo "[server ready]"; break; }
  sleep 1
done
curl -s -o /dev/null $BASE; sleep 3

SB set viewport 1280 800
SB open $BASE >/dev/null 2>&1
sleep 4
SB find role button click --name "Chat bo'limiga kirish" >/dev/null 2>&1
sleep 2

echo "== Next (B navbatda) =="
curl -s -X POST $BASE/api/chat/random -H 'Content-Type: application/json' -d "{\"deviceKey\":\"$BK\",\"action\":\"join\"}" >/dev/null
sleep 1
SB find text "Next" click
sleep 3
SB screenshot /tmp/shots/11-next-en.png

echo "== B yozadi random chatda =="
RCONV=$(curl -s "$BASE/api/chat/conversations?deviceKey=$BK" | python3 -c "
import sys,json;d=json.load(sys.stdin)
r=[c for c in d['conversations'] if c['isRandom'] and not c['ended']]
print(r[0]['id'] if r else '')")
echo "conv: $RCONV"
if [ -n "$RCONV" ]; then
  curl -s -X POST $BASE/api/chat/messages -H 'Content-Type: application/json' \
    -d "{\"deviceKey\":\"$BK\",\"conversationId\":\"$RCONV\",\"kind\":\"text\",\"content\":\"Hello from a stranger!\"}" >/dev/null
  sleep 3
  SB screenshot /tmp/shots/12-random-msg-en.png
fi

echo "== Back =="
SB find text "Back" click
sleep 2
SB screenshot /tmp/shots/13-back-en.png

echo "== People search (EN) =="
SB find placeholder "Search people..." fill "Malika"
sleep 2
SB screenshot /tmp/shots/14-search-en.png

echo "== errors =="
SB errors 2>&1 | head -6
SB close >/dev/null 2>&1
echo DONE
