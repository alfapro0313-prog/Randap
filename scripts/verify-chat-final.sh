#!/usr/bin/env bash
set -u
cd /home/z/my-project
mkdir -p /tmp/shots
rm -f /tmp/shots/*.png

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
curl -s -o /dev/null $BASE; sleep 4

echo "== 1. Desktop portal =="
SB set viewport 1280 800
SB open $BASE
sleep 5
SB screenshot /tmp/shots/01-portal.png

echo "== 2. Chat bo'limi =="
SB find role button click --name "Chat bo'limiga kirish"
sleep 2
SB screenshot /tmp/shots/02-chat.png

echo "== 3. Random chat matched (B navbatda) =="
curl -s -X POST $BASE/api/chat/random -H 'Content-Type: application/json' -d "{\"deviceKey\":\"$BK\",\"action\":\"join\"}" >/dev/null
SB find text "Random chat" click
sleep 3
SB screenshot /tmp/shots/03-random.png

echo "== 4. Keyingi =="
SB find text "Keyingi" click
sleep 2
SB screenshot /tmp/shots/04-keyingi.png

echo "== 5. Orqaga =="
SB find text "Orqaga" click
sleep 2
SB screenshot /tmp/shots/05-orqaga.png

echo "== 6. People qidiruv =="
SB find placeholder "Odamlarni qidirish..." fill "Malika"
sleep 2
SB screenshot /tmp/shots/06-people-search.png

echo "== 7. Portalga qaytish =="
SB find role button click --name "Asosiy menyu"
sleep 2
SB screenshot /tmp/shots/07-portal-2.png

echo "== 8. Mobil =="
SB set viewport 390 844
sleep 2
SB screenshot /tmp/shots/08-mobile-portal.png
SB find role button click --name "Chat bo'limiga kirish"
sleep 2
SB screenshot /tmp/shots/09-mobile-chat-list.png
SB find text "Malika" click
sleep 2
SB screenshot /tmp/shots/10-mobile-conversation.png

echo "== 9. Errors =="
SB errors 2>&1 | head -6
SB close >/dev/null 2>&1
echo DONE
