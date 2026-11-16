#!/usr/bin/env bash
# Desktop brauzer tekshiruvi: portal -> chat -> xabarlar -> settings -> random chat
set -u
cd /home/z/my-project
mkdir -p /tmp/shots
rm -f /tmp/shots/*.png

setsid bun run dev </dev/null >> dev.log 2>&1 &
for i in $(seq 1 60); do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 http://localhost:3000/ 2>/dev/null)
  [ "$code" = "200" ] && { echo "[server ready]"; break; }
  sleep 1
done

SESS="chatverify"
SB() { agent-browser --session "$SESS" "$@"; }
BKEY=$(SB eval "localStorage.getItem('randap_device_key')" 2>/dev/null | tr -d '"')
if [ -z "$BKEY" ] || [ "$BKEY" = "null" ]; then
  SB open http://localhost:3000 >/dev/null 2>&1
  sleep 4
  BKEY=$(SB eval "localStorage.getItem('randap_device_key')" | tr -d '"')
fi
echo "browser deviceKey: $BKEY"

BK="test-device-b"
BASE="http://localhost:3000"

echo "== 1. Portal =="
SB set viewport 1280 800
SB open http://localhost:3000
SB wait --text "Chat" --timeout 20000
sleep 2
SB screenshot /tmp/shots/01-portal-desktop.png

echo "== 2. Chat bo'limini ochish =="
SB find role button by aria-label "Chat bo'limiga kirish" click 2>/dev/null || SB click "button[aria-label=\"Chat bo'limiga kirish\"]"
sleep 2
SB screenshot /tmp/shots/02-chat-desktop-en.png

echo "== 3. B xabar yuboradi (SMS toast test) =="
CONV=$(curl -s -X POST $BASE/api/chat/open -H 'Content-Type: application/json' \
  -d "{\"deviceKey\":\"$BK\",\"peerKey\":\"$BKEY\"}" | python3 -c "import sys,json;print(json.load(sys.stdin)['conversationId'])")
echo "conv=$CONV"
curl -s -X POST $BASE/api/chat/messages -H 'Content-Type: application/json' \
  -d "{\"deviceKey\":\"$BK\",\"conversationId\":\"$CONV\",\"kind\":\"text\",\"content\":\"Salom! Bu Malika, yaxshimisan?\"}" >/dev/null
curl -s -X POST $BASE/api/chat/messages -H 'Content-Type: application/json' \
  -d "{\"deviceKey\":\"$BK\",\"conversationId\":\"$CONV\",\"kind\":\"sticker\",\"content\":\"🎉\"}" >/dev/null
echo "SMS toast kutish (10s poll)..."
sleep 12
SB screenshot /tmp/shots/03-sms-toast.png

echo "== 4. SMS toastni bosish -> suhbat ochiladi =="
SB snapshot -i | head -60
