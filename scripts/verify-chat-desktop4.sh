#!/usr/bin/env bash
set -u
cd /home/z/my-project
mkdir -p /tmp/shots

setsid bun run dev </dev/null >> dev.log 2>&1 &
for i in $(seq 1 60); do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 http://localhost:3000/ 2>/dev/null)
  [ "$code" = "200" ] && break
  sleep 1
done

SESS="chatverify"
SB() { agent-browser --session "$SESS" "$@"; }
BASE="http://localhost:3000"
BK="test-device-b"

SB open http://localhost:3000 >/dev/null 2>&1
sleep 3
SB find role button by aria-label "Chat bo'limiga kirish" click >/dev/null 2>&1
sleep 2

echo "== Keyingi/Orqaga: B navbatda, browser Random chat bosadi =="
curl -s -X POST $BASE/api/chat/random -H 'Content-Type: application/json' -d "{\"deviceKey\":\"$BK\",\"action\":\"join\"}" >/dev/null
SB find text "Random chat" click
sleep 3
SB screenshot /tmp/shots/20-random-uz.png

echo "== Keyingi bosish =="
SB find text "Keyingi" click
sleep 2
SB screenshot /tmp/shots/21-keyingi.png

echo "== Orqaga bosish =="
SB find text "Orqaga" click
sleep 2
SB screenshot /tmp/shots/22-orqaga.png

echo "== errors =="
SB errors 2>&1 | head -8
SB close >/dev/null 2>&1
echo DONE
