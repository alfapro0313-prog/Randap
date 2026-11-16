#!/usr/bin/env bash
# Desktop 3-qism: Keyingi/Orqaga (uz) + portal + mobil tekshiruv
set -u
cd /home/z/my-project
mkdir -p /tmp/shots

setsid bun run dev </dev/null >> dev.log 2>&1 &
for i in $(seq 1 60); do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 http://localhost:3000/ 2>/dev/null)
  [ "$code" = "200" ] && { echo "[server ready]"; break; }
  sleep 1
done

SESS="chatverify"
SB() { agent-browser --session "$SESS" "$@"; }
BASE="http://localhost:3000"
BK="test-device-b"

SB open http://localhost:3000 >/dev/null 2>&1
sleep 3

echo "== 1. Chatga kirish (uz rejimi saqlanganmi) =="
SB find role button by aria-label "Chat bo'limiga kirish" click >/dev/null 2>&1
sleep 2

echo "== 2. Keyingi (Next) — B navbatda =="
curl -s -X POST $BASE/api/chat/random -H 'Content-Type: application/json' -d "{\"deviceKey\":\"$BK\",\"action\":\"join\"}" >/dev/null
SB find text "Keyingi" click
sleep 2
SB screenshot /tmp/shots/14-keyingi-waiting.png
sleep 3
SB screenshot /tmp/shots/15-keyingi-matched.png

echo "== 3. Orqaga (Back) =="
SB find text "Orqaga" click
sleep 2
SB screenshot /tmp/shots/16-orqaga.png

echo "== 4. Portal holati =="
SB find role button by aria-label "Asosiy menyu" click >/dev/null 2>&1
sleep 2
SB screenshot /tmp/shots/17-portal-4cards.png

echo "== 5. Mobil ko'rinish =="
SB set viewport 390 844
sleep 2
SB screenshot /tmp/shots/18-mobile-portal.png
SB find role button by aria-label "Chat bo'limiga kirish" click >/dev/null 2>&1
sleep 2
SB screenshot /tmp/shots/19-mobile-chat.png
SB find role button by aria-label "Asosiy" click >/dev/null 2>&1
sleep 1
SB snapshot -i | head -30
echo "== DONE =="
