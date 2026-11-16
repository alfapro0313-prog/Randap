#!/usr/bin/env bash
# Desktop tekshiruv 2-qism: suhbat, yuborish, typing, settings/til, random chat
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
BKEY=$(SB eval "localStorage.getItem('randap_device_key')" 2>/dev/null | tr -d '"')
echo "browser key: $BKEY"

# Suhbat ochiq (avvalgi holat: chat view, Malika conv ro'yxatda)
SB open http://localhost:3000 >/dev/null 2>&1
sleep 3
SB find role button by aria-label "Chat bo'limiga kirish" click >/dev/null 2>&1
sleep 2

echo "== 1. SMS toast -> suhbat =="
SB find text "Salom! Bu Malika, yaxshimisan?" click
sleep 2
SB screenshot /tmp/shots/04-conversation.png

echo "== 2. Javob yozish va yuborish =="
SB fill "textarea" "Yaxshi, rahmat! Qaysi shahardansan?"
SB press Enter
sleep 2
SB screenshot /tmp/shots/05-sent.png

echo "== 3. B yozmoqda (typing indikator) =="
curl -s -X POST $BASE/api/chat/messages -H 'Content-Type: application/json' \
  -d "{\"deviceKey\":\"$BK\",\"conversationId\":\"$(curl -s -X POST $BASE/api/chat/open -H 'Content-Type: application/json' -d "{\"deviceKey\":\"$BK\",\"peerKey\":\"$BKEY\"}" | python3 -c "import sys,json;print(json.load(sys.stdin)['conversationId'])")\",\"kind\":\"text\",\"content\":\"Toshkentdanman!\"}" >/dev/null
sleep 3
curl -s -X POST $BASE/api/chat/typing -H 'Content-Type: application/json' \
  -d "{\"deviceKey\":\"$BK\",\"conversationId\":\"$(curl -s "$BASE/api/chat/conversations?deviceKey=$BKEY" | python3 -c "import sys,json;print(json.load(sys.stdin)['conversations'][0]['id'])")\"}" >/dev/null
sleep 1
SB screenshot /tmp/shots/06-typing.png

echo "== 4. Settings (til tanlash) =="
SB click "button[aria-label='Settings']"
sleep 1
SB screenshot /tmp/shots/07-settings-en.png
SB find text "O'zbekcha" click
sleep 1
SB screenshot /tmp/shots/08-settings-uz.png
SB find text "Bekor qilish" click
sleep 1
SB screenshot /tmp/shots/09-chat-uz.png

echo "== 5. Random chat =="
curl -s -X POST $BASE/api/chat/random -H 'Content-Type: application/json' -d "{\"deviceKey\":\"$BK\",\"action\":\"join\"}" >/dev/null
SB find text "Random chat" click
sleep 3
SB screenshot /tmp/shots/10-random-matched.png

echo "== 6. Random chatda B yozadi =="
RCONV=$(curl -s "$BASE/api/chat/conversations?deviceKey=$BK" | python3 -c "
import sys,json;d=json.load(sys.stdin)
r=[c for c in d['conversations'] if c['isRandom']]
print(r[0]['id'] if r else '')")
echo "random conv: $RCONV"
curl -s -X POST $BASE/api/chat/messages -H 'Content-Type: application/json' \
  -d "{\"deviceKey\":\"$BK\",\"conversationId\":\"$RCONV\",\"kind\":\"text\",\"content\":\"Bu random chat, tanishganimdan xursandman!\"}" >/dev/null
sleep 3
curl -s -X POST $BASE/api/chat/typing -H 'Content-Type: application/json' \
  -d "{\"deviceKey\":\"$BK\",\"conversationId\":\"$RCONV\"}" >/dev/null
sleep 1
SB screenshot /tmp/shots/11-random-msg.png

echo "== 7. Next tugmasi -> yangi sherik =="
curl -s -X POST $BASE/api/chat/random -H 'Content-Type: application/json' -d "{\"deviceKey\":\"$BK\",\"action\":\"next\"}" >/dev/null
sleep 1
SB find text "Next" click
sleep 3
SB screenshot /tmp/shots/12-next.png

echo "== 8. Back tugmasi =="
SB find text "Back" click
sleep 2
SB screenshot /tmp/shots/13-back.png

echo "== 9. Xatoliklar =="
SB errors 2>&1 | head -5
echo "== DONE =="
