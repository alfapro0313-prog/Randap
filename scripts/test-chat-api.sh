#!/usr/bin/env bash
# Chat API oqimini ikki qurilma bilan tekshirish
set -e
BASE="http://localhost:3000"
A="test-device-a"
B="test-device-b"

j() { python3 -c "import sys,json;d=json.load(sys.stdin);print(json.dumps(d,ensure_ascii=False)[:400])"; }

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

echo "== 4. B xabar yozadi (text) =="
curl -s -X POST $BASE/api/chat/messages -H 'Content-Type: application/json' \
  -d "{\"deviceKey\":\"$B\",\"conversationId\":\"$CONV\",\"kind\":\"text\",\"content\":\"Salom, qalesan?\"}" | j
curl -s -X POST $BASE/api/chat/messages -H 'Content-Type: application/json' \
  -d "{\"deviceKey\":\"$B\",\"conversationId\":\"$CONV\",\"kind\":\"sticker\",\"content\":\"🔥\"}" >/dev/null

echo "== 5. B typing yuboradi =="
curl -s -X POST $BASE/api/chat/typing -H 'Content-Type: application/json' \
  -d "{\"deviceKey\":\"$B\",\"conversationId\":\"$CONV\"}" | j

echo "== 6. A suhbatlari (unread=2 bo'lishi kerak) =="
curl -s "$BASE/api/chat/conversations?deviceKey=$A" | python3 -c "
import sys,json;d=json.load(sys.stdin)
c=d['conversations'][0]
print('unread:',c['unreadCount'],'partner:',c['partner']['name'],'online:',c['partner']['online'])"

echo "== 7. A polling: partnerTyping=true, 2 xabar =="
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
  echo "matched on B join -> $RCONV"
fi

echo "== 9. Random chatda B yozadi =="
curl -s -X POST $BASE/api/chat/messages -H 'Content-Type: application/json' \
  -d "{\"deviceKey\":\"$B\",\"conversationId\":\"$RCONV\",\"kind\":\"text\",\"content\":\"Bu random chat!\"}" >/dev/null

echo "== 10. B 'Next' bosadi -> A 'left' ko'rishi kerak =="
curl -s -X POST $BASE/api/chat/random -H 'Content-Type: application/json' -d "{\"deviceKey\":\"$B\",\"action\":\"next\"}" | j
curl -s "$BASE/api/chat/messages?deviceKey=$A&conversationId=$RCONV" | python3 -c "
import sys,json;d=json.load(sys.stdin)
print('ended:',d['ended'],'msgs:',[(m['kind'],m['content']) for m in d['messages']])"

echo "== 11. A notifications (esemes) =="
curl -s "$BASE/api/chat/notifications?deviceKey=$A" | python3 -c "
import sys,json;d=json.load(sys.stdin)
print('count:',d['count'],[ (n['senderName'],n['preview']) for n in d['notifications']])"

echo "== 12. A suhbatni ochadi -> unread 0, SMS tozalashadi =="
curl -s "$BASE/api/chat/messages?deviceKey=$A&conversationId=$CONV" >/dev/null
curl -s "$BASE/api/chat/conversations?deviceKey=$A" | python3 -c "
import sys,json;d=json.load(sys.stdin)
print('unread now:',sum(c['unreadCount'] for c in d['conversations']))"
curl -s "$BASE/api/chat/notifications?deviceKey=$A" | python3 -c "
import sys,json;d=json.load(sys.stdin);print('notif count:',d['count'])"

echo "== DONE =="
