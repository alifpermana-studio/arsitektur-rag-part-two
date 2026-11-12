---
name: video-as-code-merger
description: Menggabungkan beberapa file HTML cutscene motion graphic (Canvas 2D + Web Audio API) menjadi satu aplikasi pemutar & perekam video utuh (9:16, 30 FPS) dengan perbaikan simetri, Dark Tech Theme konsisten, tipografi kinetik bersih tanpa background/border berasio kontras tinggi, kalibrasi kekerasan audio ITU-R BS.1770-4 (Voiceover -10 LUFS / 0 dBTP & SFX -14 LUFS / 0 dBTP pada kalibrasi transien 75% tanpa musik), serta ekspor MP4 FastStart yang seekable.
---

# Video-as-Code Cutscene Merger & Mastering Skill

Gunakan skill ini setiap kali pengguna meminta penggabungan beberapa file HTML *cutscene motion graphic* (`rag-scene-1.html`..`rag-scene-N.html`, `alifpustaka-logo-reveal.html`, file `.wav` voiceover, dan timestamp subtitle) menjadi **satu aplikasi video utuh**.

---

## 1. Arsitektur Proyek & Spesifikasi Kanvas

1. **Struktur Proyek Minimalis (Vanilla HTML5 `<canvas>` 2D + Web Audio API):**
   - Gunakan struktur seminimalis mungkin tanpa bundler berat:
     - `/index.html`: Kerangka UI pemutar, mesin *loudness normalizer* (LUFS/dBTP), *master timeline*, *Web Audio bus*, pengekspor `.srt`, dan *MP4 FastStart defragmenter*.
     - `/scenes.js`: Konstanta palet `K`, helper gambar simetris, ikon vektor (`Path2D`), modul `createScene1(cv)`..`createSceneN(cv)`, serta `renderOutro(g, localT, outroDur)` & `scheduleOutroSfx(...)`.
     - `/audio-b64.js` (opsional): *Fallback* Base64 untuk file `voiceover-scene-1.wav`..`voiceover-scene-N.wav`.
2. **Spesifikasi Kanvas & Kontrol Pemutar:**
   - Resolusi vertikal **9:16 (`width="1080" height="1920"`)** pada **30 FPS**.
   - Kontrol pemutar lengkap:
     - Tombol `▶ Play / ⏸ Pause`, `↺ Reset`, slider `seekbar` presisi (`step="0.1"`), dan indikator waktu `MM:SS / MM:SS`.
     - Tombol loncat antar-*scene* (`Scene 1`..`Scene N` + `Outro`).
     - Toggle checkbox: **`Narasi`**, **`Efek`**, dan **`Subtitle`** (**JANGAN sertakan fitur Musik** — seluruh musik latar dihapus agar fokus pada *Voiceover* dan *SFX*).
     - Tombol unduh subtitle gabungan (`⬇ .srt`) dan perekam video (`⬇ Download Video (MP4)`).

---

## 2. Preservasi Animasi Bawaan, Simetri & Jeda Baca 2 Detik

1. **Preservasi Kode Animasi Asli (Dilarang Mengarang Ulang):**
   - **DILARANG KERAS** mengganti, menyederhanakan, atau menghapus *shape*, karakter, elemen diagram, teks layar, *keyframe*, maupun fungsi *easing* dari file HTML partisi asli.
   - Bungkus setiap file HTML partisi ke dalam factory terisolasi:
     ```javascript
     function createSceneN(cv) {
       // ... state & fungsi gambar asli Scene N ...
       return {
         render: renderAt,       // (localT, voDur, showSub) => void
         scheduleSfx: scheduleSfx, // (ctx, dest, startTime, offset, maxDur) => void
         getCues: getCues,       // () => [[startSec, endSec, text], ...]
         refDur: DUR             // durasi referensi asli scene
       };
     }
     ```
2. **Perbaikan Simetri (`x = 540` atau `x = 270`):**
   - Rapikan koordinat (`x`, `y`, `width`, `height`, jarak antar-kartu, dan titik konektor/partikel) agar simetris terhadap sumbu tengah kanvas **`x = 540`** (atau **`x = 270`** apabila *scene* menggunakan transformasi `scale(2, 2)`).
   - Transisi antar-*scene* (*radial wipe*) wajib berpusat tepat di tengah kanvas **`(540, 960)`**.
   - **Pengecualian Progress/Gauge Bar:** Kotak *track* luar berada simetris di tengah kanvas, tetapi pengisian bar kapasitas (*fill*) wajib bergerak **rata kiri ke kanan** di dalam *track*-nya.
3. **Jeda Baca 2 Detik Antar-Scene (`SCENE_DELAY = 2.0`):**
   - Durasi total tiap *scene* adalah `DURS[i] = VO_DURS[i] + 2.0`.
   - Selama jeda 2 detik (`VO_DURS[i] <= localT < VO_DURS[i] + 2.0`), *clamp* waktu struktural diagram pada `Math.min(localT, VO_DURS[i] - 0.0005)` agar visual akhir tidak hilang, perpanjang *cue* subtitle terakhir selama **`+1.8 detik`**, dan biarkan animasi *ambient*/partikel tetap berjalan.
4. **Outro (`alifpustaka-logo-reveal.html`) & SFX Tipografi Kinetik:**
   - Tempatkan animasi logo reveal di akhir video sebagai **Outro** berdurasi `4.0 + 2.0 = 6.0 detik`.
   - Wajib menyertakan `scheduleOutroSfx` yang menyintesis suara *whoosh*, *brand chime*, serta ketukan *kinetic typography pop/tick* saat teks **`"Ruang Literasi, Rumah Inovasi"`** dan *underline sweep* muncul.

---

## 3. Spesifikasi Tema Warna (Dark Tech Theme — Wajib Konsisten)

Gunakan palet **Dark Tech Theme (`K`)** berikut di seluruh *scene* dan *Outro*:

```javascript
const K = {
  bg:   '#0e1626', // Warna latar utama kanvas (Deep Dark Navy)
  bg2:  '#13203a', // Warna lingkaran dekoratif sudut latar (Subtle Navy Glow)
  ink:  '#172235', // Warna isi kartu/panel/gedung gelap (Dark Slate Ink)
  surf: '#22314d', // Warna permukaan kartu sekunder, border panel, & track bar
  iv:   '#F6F5EE', // Warna teks utama & elemen terang (Warm Ivory White)
  cob:  '#4667FF', // Aksen utama biru Kubernetes (Cobalt Blue)
  teal: '#16B99A', // Aksen sukses / Pod sehat / kapasitas bersih (Teal Green)
  cor:  '#FF765E', // Aksen peringatan / sorotan penting / atap (Coral Orange)
  amb:  '#FFC65C', // Aksen sorotan sekunder / badge / partikel aktif (Amber Gold)
  peri: '#A3A5F4', // Aksen teks subjudul / garis konektor sekunder (Periwinkle)
  sl:   '#73819A', // Warna teks/elemen nonaktif atau redup (Muted Slate)
  red:  '#E5484D', // Warna error / bahaya / crash (Crimson Red)
  wh:   '#FFFFFF'  // Putih murni
};
```

### Aturan Latar & Kontras Warna (Anti-Low-Contrast):
1. **Latar Belakang Kanvas (`drawThemeBg`):**
   - Isi kanvas `(0, 0, 1080, 1920)` dengan `K.bg` (`#0e1626`).
   - Gambar 2 lingkaran dekoratif `K.bg2` (`#13203a`) di `(980, 160)` radius `300` dan `(60, 1800)` radius `360`.
   - Jangan biarkan ada *scene* yang menimpa `drawThemeBg` dengan warna krem/terang bawaan lama (`#F6F5EE` / `#EAE6DF`) atau ungu pekat (`#100D26`).
2. **Kontras Teks vs Kartu:**
   - Di atas latar gelap (`K.bg` `#0e1626`, `K.ink` `#172235`, `K.surf` `#22314d`), teks utama **WAJIB** menggunakan `K.iv` (`#F6F5EE`), `K.amb` (`#FFC65C`), `K.peri` (`#A3A5F4`), atau `K.teal` (`#16B99A`). **DILARANG** menggunakan `K.ink` (`#172235`) atau `K.sl` gelap untuk teks utama di atas latar gelap.
   - Di atas *badge*/pil terang (`K.amb` `#FFC65C`, `K.iv` `#F6F5EE`, `K.teal` `#16B99A`), teks wajib menggunakan warna gelap `K.ink` (`#172235`).

---

## 4. Aturan Subtitle Kinetik Tipografi (Clean, Tanpa Pill/Border, Kontras Tinggi)

1. **TANPA Dark Pill Background & TANPA Border:**
   - **DILARANG** menggambar kotak kapsul gelap (`rgba(11, 18, 32, 0.88)`) maupun *border* di belakang teks subtitle kinetik tipografi (`kin`, `dch`, `cap`, `caption`, `capt`).
   - Biarkan teks kinetik tipografi tampil bersih langsung di atas latar `#0e1626`, lengkap dengan animasi per-kata (*pop/slide/bounce*) dan *progress bar* / *underline* di bagian bawahnya.
2. **Skema Warna Font Kinetik Tipografi Berasio Kontras Tinggi:**
   - **Kata Reguler:** `K.iv` (`#F6F5EE` — rasio kontras `> 15:1` di atas `#0e1626`).
   - **Kata Kunci Teknis / Angka:** `K.amb` (`#FFC65C`), `K.teal` (`#16B99A`), atau `K.peri` (`#A3A5F4`). Jangan gunakan biru gelap atau slate redup.
   - **Kata Bahaya / Error (`OOM`, `137`, `jepret`, `fatal`, `lumpuh`, `mati`):** `K.cor` (`#FF765E`) atau `K.red` (`#E5484D`).

---

## 5. Konfigurasi Audio & Loudness Mastering (VO -10 LUFS vs SFX -14 LUFS @ 75%)

### A. Prinsip Utama Audio & Preservasi SFX Bawaan
1. **Tanpa Musik Latar:** Hanya gunakan jalur **Narasi (Voiceover)** dan **Efek (SFX)**.
2. **Preservasi Utuh Seluruh SFX Bawaan (Kecuali Rentetan Beep Berlebihan pada Judul Pembuka):**
   - **WAJIB MEMPERTAHANKAN 100%** seluruh definisi sintesis suara (`wh`, `wave`, `swipe`, `ting`, `pop`, `slash`, `ding`, `blip`, `knock`, `th`, `slam`, `crack`, `hum`, `hiss`, `click`, `clack`, `zap`, `err`, `rise`, `alarm`, `lock`, `power`, `tk`, `tap`, `chime`) beserta seluruh jadwal pemicunya (`mkSfx` / `CUES` `tap`) sebagaimana aslinya di setiap file HTML partisi.
   - **SATU-SATUNYA PENGECUALIAN (`Penghapusan Rentetan Beep Berlebihan`):** Apabila pada pembuka *scene* terdapat loop rentetan *square-wave beep* frekuensi tinggi yang berulang pada tiap baris judul (seperti `for(let k=0;k<6;k++)A(B[0]+(1+k)*DLS[0],'type')` yang memicu `6 × 7 = 42` beep `2400–2800 Hz` secara bertumpuk), ganti **hanya** bagian `type` tersebut menjadi **satu aksen *soft sine pop* tunggal** (`case 'type': O('sine', 680, 920, 0.14, 0.12); break;` dengan satu panggilan `A(B[0]+DLS[0], 'type')`), tanpa menghapus atau melemahkan efek suara lainnya.
3. **Target Kekerasan ITU-R BS.1770-4:**
   - **Voiceover (`VO_TARGET_LUFS`):** **`-10.0 LUFS`** dengan batas puncak **`0.0 dBTP`**.
   - **Efek Suara (`SFX_TARGET_LUFS`):** **`-14.0 LUFS`** dengan batas puncak **`0.0 dBTP`** menggunakan **Kalibrasi Transien 75%** + **Vocal-Pocket EQ (`-1.25 dB` @ `2.2 kHz`)**.

### B. Mengapa SFX Wajib Menggunakan Kalibrasi Transien 75%?
- Jika SFX diukur dengan jendela `400 ms` standar penuh tanpa pembatas, bunyi pendek (`40–120 ms`) terdilusi oleh keheningan di sekitarnya sehingga *normalizer* melakukan *over-boost* ekstrem (`+15 dB`) yang membuat SFX menenggelamkan *voiceover*.
- Sebaliknya, jika dibatasi terlalu ketat (`30 ms`, *top 15%*, *gain cap* `1.15x`, EQ `-5 dB`), SFX terdengar terlalu senyap.
- **Titik Kalibrasi Ideal (75% Configuration)** memberikan keseimbangan terbaik:
  1. **Jendela Pengukuran SFX (`winSec`):** **`0.30s` (`300 ms`)** dengan langkah **`0.075s` (`75 ms`)**.
  2. **Cakupan Blok Aktif (`topCount`):** Ambil rata-rata dari **top `78%` blok aktif** (`Math.ceil(sorted.length * 0.78)`) yang lolos *absolute gate* `-70 LUFS`.
  3. **Batas Penguatan Maksimum (`gain cap`) & Iterasi *Soft-Knee*:** Batasi *gain* maksimum SFX pada **`2.80x` (`+8.94 dB`)** dengan **4 iterasi *soft-knee*** (`knee = 0.84`, faktor koreksi `diff * 0.75`).
  4. **Filter *Vocal-Pocket EQ* pada Bus SFX (`sfxEq`):** Pasang `BiquadFilterNode` tipe `peaking` di **`2200 Hz`**, **`Q = 0.9`**, **`gain = -1.25 dB`** sebelum *limiter* SFX untuk memberi ruang artikulasi bagi konsonan *voiceover*.

### C. Implementasi Referensi Normalizer & Bus Audio

```javascript
const VO_TARGET_LUFS = -10.0;
const VO_TARGET_DBTP = 0.0;
const SFX_TARGET_LUFS = -14.0;
const SFX_TARGET_DBTP = 0.0;

function measureKWeightedLufs(samples, sr, isSparseSfx = false) {
  const { b1, a1, b2, a2 } = computeKWeightCoeffs(sr);
  const n = samples.length;
  const kw = new Float32Array(n);
  let x1_1 = 0, x2_1 = 0, y1_1 = 0, y2_1 = 0;
  let x1_2 = 0, x2_2 = 0, y1_2 = 0, y2_2 = 0;
  for (let i = 0; i < n; i++) {
    const x0 = samples[i];
    const u0 = b1[0] * x0 + b1[1] * x1_1 + b1[2] * x2_1 - a1[1] * y1_1 - a1[2] * y2_1;
    x2_1 = x1_1; x1_1 = x0; y2_1 = y1_1; y1_1 = u0;
    const y0 = b2[0] * u0 + b2[1] * x1_2 + b2[2] * x2_2 - a2[1] * y1_2 - a2[2] * y2_2;
    x2_2 = x1_2; x1_2 = u0; y2_2 = y1_2; y2_2 = y0;
    kw[i] = y0;
  }

  // Kalibrasi 75%: jendela 300ms (step 75ms) untuk SFX, 400ms (step 100ms) untuk Voiceover
  const winSec = isSparseSfx ? 0.30 : 0.40;
  const stepSec = isSparseSfx ? 0.075 : 0.10;
  const blockLen = Math.max(1, Math.round(winSec * sr));
  const stepLen = Math.max(1, Math.round(stepSec * sr));
  const blockEnergies = [];
  for (let start = 0; start + blockLen <= n; start += stepLen) {
    let sumSq = 0;
    for (let i = start; i < start + blockLen; i++) sumSq += kw[i] * kw[i];
    blockEnergies.push(sumSq / blockLen);
  }
  if (blockEnergies.length === 0) {
    let sumSq = 0;
    for (let i = 0; i < n; i++) sumSq += kw[i] * kw[i];
    blockEnergies.push(sumSq / Math.max(1, n));
  }

  const absGateLin = Math.pow(10, (-70 + 0.691) / 10);
  const absPassed = blockEnergies.filter(z => z > absGateLin);
  if (absPassed.length === 0) return -70;

  if (isSparseSfx) {
    // Kalibrasi 75%: rata-rata dari top 78% blok aktif
    const sorted = [...absPassed].sort((a, b) => b - a);
    const topCount = Math.max(1, Math.ceil(sorted.length * 0.78));
    let sumTop = 0;
    for (let i = 0; i < topCount; i++) sumTop += sorted[i];
    return -0.691 + 10 * Math.log10(Math.max(1e-12, sumTop / topCount));
  }

  const avgAbs = absPassed.reduce((a, b) => a + b, 0) / absPassed.length;
  const relGateLufs = -0.691 + 10 * Math.log10(avgAbs) - 10;
  const relGateLin = Math.pow(10, (relGateLufs + 0.691) / 10);
  const relPassed = absPassed.filter(z => z > relGateLin);
  const finalMean = (relPassed.length > 0 ? relPassed : absPassed).reduce((a, b) => a + b, 0) /
    (relPassed.length > 0 ? relPassed.length : absPassed.length);

  return -0.691 + 10 * Math.log10(Math.max(1e-12, finalMean));
}

function normalizeAudioBufferToLufs(audioBuf, targetLufs, targetDbTP = 0.0, isSparseSfx = false) {
  if (!audioBuf) return audioBuf;
  const sr = audioBuf.sampleRate;
  const numCh = audioBuf.numberOfChannels;
  const len = audioBuf.length;
  const maxTpLinear = Math.min(0.998, Math.pow(10, targetDbTP / 20) * 0.998);

  for (let ch = 0; ch < numCh; ch++) {
    const data = audioBuf.getChannelData(ch);
    const orig = new Float32Array(data);
    const curLufs = measureKWeightedLufs(orig, sr, isSparseSfx);
    if (curLufs <= -65) continue;

    let gain = Math.pow(10, (targetLufs - curLufs) / 20);
    const knee = 0.84;
    const span = Math.max(0.02, maxTpLinear - knee);

    if (isSparseSfx) {
      // Kalibrasi 75%: batas gain maksimum 2.80x (+8.94 dB) dengan 4 iterasi soft-knee
      gain = Math.min(gain, 2.80);
      for (let iter = 0; iter < 4; iter++) {
        for (let i = 0; i < len; i++) {
          let v = orig[i] * gain;
          const av = Math.abs(v);
          if (av > knee) {
            const sign = v < 0 ? -1 : 1;
            v = sign * (knee + span * Math.tanh((av - knee) / span));
          }
          data[i] = v;
        }
        clampLocalTruePeaks(data, maxTpLinear);
        const newLufs = measureKWeightedLufs(data, sr, true);
        const diff = targetLufs - newLufs;
        if (Math.abs(diff) <= 0.08) break;
        gain = Math.min(2.80, gain * Math.pow(10, (diff * 0.75) / 20));
      }
      continue;
    }

    for (let iter = 0; iter < 5; iter++) {
      for (let i = 0; i < len; i++) {
        let v = orig[i] * gain;
        const av = Math.abs(v);
        if (av > knee) {
          const sign = v < 0 ? -1 : 1;
          v = sign * (knee + span * Math.tanh((av - knee) / span));
        }
        data[i] = v;
      }
      clampLocalTruePeaks(data, maxTpLinear);
      const newLufs = measureKWeightedLufs(data, sr, false);
      const diff = targetLufs - newLufs;
      if (Math.abs(diff) <= 0.05) break;
      gain *= Math.pow(10, diff / 20);
    }
  }
  return audioBuf;
}
```

---

## 6. Perbaikan Wajib Ekspor MP4 (`defragmentMp4` FastStart Seekable)

1. **Dilarang Mengunduh Mentah Output `MediaRecorder`:**
   - Output bawaan `MediaRecorder` (`video/mp4`) adalah **Fragmented MP4 (`fMP4`)** dengan `mvhd.duration = 0` dan tabel sampel `stbl` kosong sehingga durasi tampil `00:00` dan *seekbar* mati.
2. **Konversi Dua-Pass ke `[ftyp][moov][mdat]`:**
   - Wajib memproses `Blob` hasil rekaman melalui `ensureSeekableMp4(rawBlob)` -> `defragmentMp4(arrayBuf)` yang mengekstrak seluruh sampel dari pasangan `moof + mdat`, menghitung ulang durasi `mvhd`, `tkhd`, `mdhd`, dan membangun tabel `stts`, `stss`, `stsc`, `stsz`, serta `stco` dalam dua *pass* agar *offset* byte mengarah presisi ke payload `mdat`.
