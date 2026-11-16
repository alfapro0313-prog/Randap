#!/usr/bin/env bash
set -u
cd /home/z/my-project
mkdir -p /tmp/shots

SESS="chatv3"
SB() { agent-browser --session "$SESS" "$@"; }
BASE="http://localhost:3000"
BK="test-device-b"
BKEY=$(SB eval "localStorage.getItem('randap_device_key')" | tr -d '"')
echo "browser key: $BKEY"

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

echo "== 1. Random chat -> waiting (B band) =="
SB find role button click --name "Random chat Chat with a random person"
sleep 2
SB screenshot /tmp/shots/21-waiting.png

echo "== 2. B bo'shaydi va navbatga qo'shiladi -> browser ulanadi =="
curl -s -X POST $BASE/api/chat/random -H 'Content-Type: application/json' -d "{\"deviceKey\":\"$BK\",\"action\":\"back\"}" >/dev/null
curl -s -X POST $BASE/api/chat/random -H 'Content-Type: application/json' -d "{\"deviceKey\":\"$BK\",\"action\":\"join\"}" >/dev/null
sleep 5
SB screenshot /tmp/shots/22-matched.png

echo "== 3. B xabar yozadi =="
RCONV=$(curl -s "$BASE/api/chat/conversations?deviceKey=$BK" | python3 -c "
import sys,json;d=json.load(sys.stdin)
r=[c for c in d['conversations'] if c['isRandom'] and not c['ended'] and c['partner']]
print(r[0]['id'] if r else '')")
echo "conv: $RCONV"
if [ -n "$RCONV" ]; then
  curl -s -X POST $BASE/api/chat/messages -H 'Content-Type: application/json' \
    -d "{\"deviceKey\":\"$BK\",\"conversationId\":\"$RCONV\",\"kind\":\"text\",\"content\":\"Hello stranger!\"}" >/dev/null
  curl -s -X POST $BASE/api/chat/typing -H 'Content-Type: application/json' \
    -d "{\"deviceKey\":\"$BK\",\"conversationId\":\"$RCONV\"}" >/dev/null
  sleep 3
  SB screenshot /tmp/shots/23-random-typing.png
fi

echo "== 4. Browser Next -> B navbatda bo'lsa yangi chat =="
curl -s -X POST $BASE/api/chat/random -H 'Content-Type: application/json' -d "{\"deviceKey\":\"$BK\",\"action\":\"back\"}" >/dev/null
sleep 1
curl -s -X POST $BASE/api/chat/random -H 'Content-Type: application/json' -d "{\"deviceKey\":\"$BK\",\"action\":\"join\"}" >/dev/null
# Next tugmasi random chat headerda
SB click "button:has-text('Next')" 2>/dev/null || agent-browser --session "$SESS" eval "document.querySelectorAll('button').forEach(b=>{if(b.textContent.trim()==='Next')b.click()})"
sleep 4
SB screenshot /tmp/shots/24-next.png

echo "== 5. Back -> idle =="
agent-browser --session "$SESS" eval "document.querySelectorAll('button').forEach(b=>{if(b.textContent.trim()==='Back')b.click()})"
sleep 2
SB screenshot /tmp/shots/25-back.png

echo "== errors =="
SB errors 2>&1 | head -6
SB close >/dev/null 2>&1
echo DONE
