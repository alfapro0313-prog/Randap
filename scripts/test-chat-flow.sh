#!/usr/bin/env bash
# Serverni ishga tushirib, chat API oqimini ikki qurilma bilan tekshiradi
cd /home/z/my-project
setsid bun run dev </dev/null >> dev.log 2>&1 &
SERVER_PID=$!

# Server tayyor bo'lguncha kutish
for i in $(seq 1 60); do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 http://localhost:3000/ 2>/dev/null)
  if [ "$code" = "200" ]; then echo "[server ready after ${i}s]"; break; fi
  sleep 1
done

BASE="http://localhost:3000"
A="test-device-a"
B="test-device-b"

j() { python3 -c "import sys,json;d=json.load(sys.stdin);print(json.dumps(d,ensure_ascii=False)[:300])"; }

echo "== 1. Profil yaratish/nomi =="
curl -s -X PATCH $BASE/api/chat/me -H 'Content-Type: application/json' \
  -d "{\"deviceKey\":\"$A\",\"name\":\"Aziz\",\"emoji\":\"😎\",\"color\":\"emerald\",\"bio\":\"Salom men Aziz\"}" | j
curl -s -X PATCH $BASE/api/chat/me -H 'Content-Type: application/json' \
  -d "{\"deviceKey\":\"$B\",\"name\":\"Malika\",\"emoji\":\"🥰\",\"color\":\"rose\",\"bio\":\"Men Malika\"}" | j

echo "== 2. A odamlarni qidiradi =="
curl -s "$BASE/api/chat/people?deviceKey=$A&q=Mal" | j

echo "== 3. A Malika bilan suhbat ochadi =="
CONV=$(curl -s -X POST $BASE/api/chat/open -H 'Content-Type: application/json' \
  -d "{\"deviceKey\":\"$A\",\"peerKey\":\"$B\"}" | python3 -c "import sys,json;print(json.load(sys.stdin)['conversationId'])")
echo "conv=$CONV"

echo "== 4. B xabar yozadi (text + sticker) =="
curl -s -X POST $BASE/api/chat/messages -H 'Content-Type: application/json' \
  -d "{\"deviceKey\":\"$B\",\"conversationId\":\"$CONV\",\"kind\":\"text\",\"content\":\"Salom, qalesan?\"}" | j
curl -s -X POST $BASE/api/chat/messages -H 'Content-Type: application/json' \
  -d "{\"deviceKey\":\"$B\",\"conversationId\":\"$CONV\",\"kind\":\"sticker\",\"content\":\"fire\"}" | j

echo "== 5. B typing yuboradi =="
curl -s -X POST $BASE/api/chat/typing -H 'Content-Type: application/json' \
  -d "{\"deviceKey\":\"$B\",\"conversationId\":\"$CONV\"}" | j

echo "== 6. A suhbatlari (unread=2, online=true) =="
curl -s "$BASE/api/chat/conversations?deviceKey=$A" | python3 -c "
import sys,json;d=json.load(sys.stdin)
c=d['conversations'][0]
print('unread:',c['unreadCount'],'partner:',c['partner']['name'],'online:',c['partner']['online'],'lastKind:',c['lastMessage']['kind'])"

echo "== 7. A polling: typing=true, xabarlar =="
curl -s "$BASE/api/chat/messages?deviceKey=$A&conversationId=$CONV" | python3 -c "
import sys,json;d=json.load(sys.stdin)
print('typing:',d['partnerTyping'],'msgs:',len(d['messages']),'kinds:',[m['kind'] for m in d['messages']],'partnerOnline:',d['partnerOnline'])"

echo "== 8. Random chat: A join, B join =="
R1=$(curl -s -X POST $BASE/api/chat/random -H 'Content-Type: application/json' -d "{\"deviceKey\":\"$A\",\"action\":\"join\"}")
R2=$(curl -s -X POST $BASE/api/chat/random -H 'Content-Type: application/json' -d "{\"deviceKey\":\"$B\",\"action\":\"join\"}")
echo "A: $R1"
echo "B: $R2"
RCONV=$(echo "$R1" | python3 -c "import sys,json;d=json.load(sys.stdin);print(d.get('conversationId') or '')")
if [ -z "$RCONV" ]; then
  RCONV=$(echo "$R2" | python3 -c "import sys,json;d=json.load(sys.stdin);print(d.get('conversationId') or '')")
fi
echo "random conv: $RCONV"

echo "== 9. Random chatda B yozadi =="
curl -s -X POST $BASE/api/chat/messages -H 'Content-Type: application/json' \
  -d "{\"deviceKey\":\"$B\",\"conversationId\":\"$RCONV\",\"kind\":\"text\",\"content\":\"Bu random chat!\"}" >/dev/null

echo "== 10. B 'Next' -> A 'left' tizim xabari =="
curl -s -X POST $BASE/api/chat/random -H 'Content-Type: application/json' -d "{\"deviceKey\":\"$B\",\"action\":\"next\"}" | j
curl -s "$BASE/api/chat/messages?deviceKey=$A&conversationId=$RCONV" | python3 -c "
import sys,json;d=json.load(sys.stdin)
print('ended:',d['ended'],'msgs:',[(m['kind'],m['content']) for m in d['messages']])"

echo "== 11. A notifications (esemes) =="
curl -s "$BASE/api/chat/notifications?deviceKey=$A" | python3 -c "
import sys,json;d=json.load(sys.stdin)
print('count:',d['count'],[(n['senderName'],n['preview'][:20]) for n in d['notifications']])"

echo "== 12. A suhbatni ochadi -> unread=0, notifications=0 =="
curl -s "$BASE/api/chat/messages?deviceKey=$A&conversationId=$CONV" >/dev/null
curl -s "$BASE/api/chat/conversations?deviceKey=$A" | python3 -c "
import sys,json;d=json.load(sys.stdin)
print('unread total:',sum(c['unreadCount'] for c in d['conversations']))"
curl -s "$BASE/api/chat/notifications?deviceKey=$A" | python3 -c "
import sys,json;d=json.load(sys.stdin);print('notif count:',d['count'])"

echo "== 13. Upload yo'llari tiklandimi (HEAD so'rovlar) =="
curl -s -o /dev/null -w "POST /api/upload (bo'sh): %{http_code}\n" -X POST $BASE/api/upload
curl -s -o /dev/null -w "POST /api/upload/avatar (bo'sh): %{http_code}\n" -X POST $BASE/api/upload/avatar

echo "== DONE =="
