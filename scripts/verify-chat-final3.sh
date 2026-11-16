#!/usr/bin/env bash
set -u
cd /home/z/my-project
mkdir -p /tmp/shots

SESS="chatv3"
SB() { agent-browser --session "$SESS" "$@"; }
BASE="http://localhost:3000"
BK="test-device-b"

setsid bun run dev </dev/null >> dev.log 2>&1 &
sleep 4
for i in $(seq 1 100); do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 $BASE 2>/dev/null)
  [ "$code" = "200" ] && { echo "[server ready]"; break; }
  sleep 1
done
curl -s -o /dev/null $BASE; sleep 3

BKEY=$(agent-browser --session "$SESS" open $BASE >/dev/null 2>&1; sleep 4; agent-browser --session "$SESS" eval "localStorage.getItem('randap_device_key')" | tr -d '"')
echo "browser: $BKEY"
SB set viewport 1280 800

echo "== 1. B yozadi (SMS toast tuzatilganini tekshirish) =="
CONV=$(curl -s -X POST $BASE/api/chat/open -H 'Content-Type: application/json' \
  -d "{\"deviceKey\":\"$BK\",\"peerKey\":\"$BKEY\"}" | python3 -c "import sys,json;print(json.load(sys.stdin)['conversationId'])")
curl -s -X POST $BASE/api/chat/messages -H 'Content-Type: application/json' \
  -d "{\"deviceKey\":\"$BK\",\"conversationId\":\"$CONV\",\"kind\":\"text\",\"content\":\"Profile modal test!\"}" >/dev/null
SB find role button click --name "Chat bo'limiga kirish" >/dev/null 2>&1
sleep 12
SB screenshot /tmp/shots/31-toast-fixed.png

echo "== 2. Sherik profilini ochish =="
SB find text "Malika" click
sleep 2
SB screenshot /tmp/shots/32-peer-modal.png

echo "== 3. Message tugmasi suhbatni ochadi =="
SB find role button click --name "Message"
sleep 2
SB screenshot /tmp/shots/33-peer-chat.png

echo "== errors =="
SB errors 2>&1 | head -6
SB close >/dev/null 2>&1
echo DONE
