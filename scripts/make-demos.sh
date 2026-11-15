#!/bin/bash
# Randap demo videolari — ffmpeg bilan generatsiya qilinadi
set -e

DIR="/home/z/my-project/public/uploads"
mkdir -p "$DIR/videos" "$DIR/thumbs"

FONT="/usr/share/fonts/truetype/chinese/NotoSansSC-Regular.ttf"

make_video () {
  local out="$1" dur="$2" size="$3" label="$4" c1="$5" c2="$6"
  ffmpeg -y -hide_banner -loglevel error \
    -f lavfi -i "gradients=size=${size}:speed=0.03:duration=${dur}:c0=${c1}:c1=${c2}" \
    -f lavfi -i "anullsrc=channel_layout=stereo:sample_rate=44100" \
    -t "$dur" \
    -vf "drawtext=fontfile=${FONT}:text='${label}':fontcolor=white@0.9:fontsize=44:x=(w-text_w)/2:y=(h-text_h)/2:box=1:boxcolor=black@0.35:boxborderw=16" \
    -c:v libx264 -preset veryfast -pix_fmt yuv420p -movflags +faststart \
    -c:a aac -b:a 96k -shortest \
    "$DIR/videos/${out}.mp4"
  ffmpeg -y -hide_banner -loglevel error -ss 1 -i "$DIR/videos/${out}.mp4" -frames:v 1 -vf "scale=640:-2" "$DIR/thumbs/${out}.jpg"
  echo "OK: ${out}.mp4"
}

# Oddiy videolar (cheksiz davomiylik namoyishi uchun turli davomiyliklar)
make_video "demo-metro"   18 "1280x720" "Toshkent metropoliteni" "0x1c3f2d" "0x0b0f14"
make_video "demo-osh"     12 "1280x720" "Osh retsepti"           "0x8a3b12" "0x2b120a"
make_video "demo-dars"    15 "1280x720" "Dasturlash 1-dars"      "0x3b2f63" "0x0e0b1e"
make_video "demo-xiva"    14 "1280x720" "Xiva durdonasi"         "0x8a6a1c" "0x1e1503"

# Shorts (vertikal, 1:20 dan qisqa)
make_video "demo-short-parvoz" 10 "720x1280" "Parvoz"      "0x14528a" "0x050b12"
make_video "demo-short-fokus"   8 "720x1280" "Fokus testi" "0x8a1c3b" "0x12040a"
make_video "demo-short-choy"   12 "720x1280" "Choymona"    "0x2f7a4d" "0x08140c"

echo "Barcha demo videolar tayyor."
