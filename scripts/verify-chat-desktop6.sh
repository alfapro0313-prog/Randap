#!/usr/bin/env bash
set -u
cd /home/z/my-project
mkdir -p /tmp/shots

setsid bun run dev </dev/null >> dev.log 2>&1 &
for i in $(seq 1 90); do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 http://localhost:3000/ 2>/dev/null)
  [ "$code" = "200" ] && { echo "[server ready: ${i}s]"; break; }
  sleep 1
done
# So'rov birinchi kompilyatsiya uchun
curl -s -o /dev/null http://localhost:3000/
sleep 8

SESS="chatv2"
SB() { agent-browser --session "$SESS" "$@"; }
BASE="http://localhost:3000"
BK="test-device-b"

echo "== Chatga kirish =="
SB set viewport 1280 800
SB open http://localhost:3000
sleep 6
SB click "button[aria-label='Chat bo\\'limiga kirish']" 2>/dev/null || SB find role button click --name "Chat bo'limiga kirish"
sleep 2
SB screenshot /tmp/shots/27-chat-fresh.png

echo "== Random chat (B navbatda) =="
curl -s -X POST $BASE/api/chat/random -H 'Content-Type: application/json' -d "{\"deviceKey\":\"$BK\",\"action\":\"join\"}" >/dev/null
SB find text "Random chat" click
sleep 3
SB screenshot /tmp/shots/28-random-matched.png

echo "== Keyingi =="
SB find text "Keyingi" click
sleep 2
SB screenshot /tmp/shots/29-keyingi-after.png

echo "== Orqaga =="
SB find text "Orqaga" click
sleep 2
SB screenshot /tmp/shots/30-orqaga-after.png

echo "== errors =="
SB errors 2>&1 | head -6
SB close >/dev/null 2>&1
echo DONE
