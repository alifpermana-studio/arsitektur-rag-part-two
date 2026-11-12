### PERAN & TUJUAN UTAMA
Kamu bertugas menggabungkan seluruh file HTML cutscene motion graphic yang ada di project ini menjadi **satu aplikasi video utuh**, merapikan simetrinya, menyamakan tema warnanya tanpa mengubah animasi bawaannya, serta **memastikan hasil Download Video (MP4) memiliki metadata durasi yang akurat (bukan 00:00) dan seekbar yang bisa digeser/lompat ke timestamp mana pun**.

---

### 1. ATURAN ARSITEKTUR PROYEK (MINIMALIS & BERSIH)
1. **STRUKTUR PROYEK SEMINIMALIS MUNGKIN:**
   - Kamu diperbolehkan membuat `package.json` seperlunya, namun **buat seminimalis mungkin** (gunakan Vanilla HTML5 `<canvas>` 2D + Web Audio API bawaan seperti pada file aslinya).
2. **PERTAHANKAN SPESIFIKASI KANVAS & KONTROL PEMUTAR:**
   - Pertahankan resolusi vertikal **9:16 (`width="1080" height="1920"`)** dan frame rate **30 FPS**.
   - Sediakan kontrol pemutar lengkap: tombol `Play/Pause`, `Reset`, slider *seekbar*, tombol loncat antar-scene (`Scene 1`..`Scene N` + `Outro`), *toggle checkbox* (`Narasi`, `Musik`, `Efek`, `Subtitle`), tombol unduh `.srt`, dan tombol `Download Video (MP4)`.

---

### 2. ATURAN KERAS PRESERVASI ANIMASI BAWAAN & PERBAIKAN SIMETRI
1. **WAJIB MENGGUNAKAN KODE ANIMASI BAWAAN DARI FILE HTML PARTISI (JANGAN MENGARANG ULANG!):**
   - **DILARANG KERAS** mengganti, menghapus, menyederhanakan, atau membuat ulang *shape*, objek karakter/ikon, elemen diagram, teks layar, *keyframe*, maupun kurva *easing* yang sudah ada di masing-masing file HTML scene/partisi.
   - Ekstrak fungsi gambar dan *timeline* asli dari setiap file HTML partisi ke dalam fungsi/modul per scene (misal `renderScene1(g, localT, voDur, showSub)`, `renderScene2(...)`, dst.) agar tidak terjadi bentrok nama variabel global (`t`, `D`, `K`, `CUES`, `draw`, dll.).
2. **PERBAIKAN SIMETRI (SHAPE, PARTICLES, LINE, TRANSITION, MOTION):**
   - **Perhatikan bahwa ada beberapa shape, particles, line, transition, motion, dan aspek lain yang berantakan dan tidak simetris. Aku ingin kamu memperbaikinya agar terlihat simetris.**
   - Cara memperbaikinya **WAJIB** dengan merapikan koordinat (`x`, `y`, lebar/tinggi, jarak antar-elemen, serta titik awal/akhir garis & partikel) pada objek bawaan tersebut—**BUKAN** dengan mengganti objeknya dengan bentuk baru:
     - Pastikan seluruh tata letak kartu, gedung, karakter, grup *badge*, dan diagram **simetris terhadap sumbu tengah kanvas (`x = 540` pada koordinat `1080×1920`, atau `x = 270` jika scene menggunakan `scale(2, 2)`)** dengan margin kiri dan kanan yang seimbang.
     - Rapikan jalur *line* (garis konektor/panah) dan aliran *particles* agar titik berangkat dan titik tujuannya tepat di tengah *node*/objek yang dihubungkan serta bercabang secara simetris.
     - Rapikan *transition* (seperti *radial wipe* / lingkaran transisi) agar selalu berpusat tepat di tengah kanvas (`(540, 960)` atau `(270, 480)`) dan *motion* masuk/keluar bergerak mulus tanpa posisi miring/timpang.
     - Pengecualian khusus untuk elemen *progress bar* atau *horizontal gauge bar* yang menunjukkan persentase kapasitas: pastikan animasi pengisian bar bergerak **rata kiri** di dalam *track*-nya (bukan melebar dari tengah), sedangkan kotak *track* luarnya tetap berada di tengah kanvas.

---

### 3. SPESIFIKASI TEMA WARNA (DARK TECH THEME — WAJIB KONSISTEN DI SEMUA SCENE)
Ganti seluruh palet warna latar terang/krem di semua scene agar menggunakan **Dark Tech Theme** berikut secara konsisten:

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

- **Latar Belakang Kanvas (`drawThemeBg`) di Setiap Scene:**
  - Isi seluruh kanvas `(0, 0, 1080, 1920)` dengan `K.bg` (`#0e1626`).
  - Gambar 2 lingkaran dekoratif lembut berwarna `K.bg2` (`#13203a`):
    1. Pusat `(980, 160)`, radius `300`.
    2. Pusat `(60, 1800)`, radius `360`.
- **Teks & Kartu:**
  - Seluruh teks judul/utama yang tadinya berwarna gelap (`#172235` / `#001531`) di atas latar terang **WAJIB** diubah menjadi `K.iv` (`#F6F5EE`) agar kontras di atas latar `#0e1626`.
  - Namun, teks yang berada di atas *badge*/kartu berwarna terang (`K.amb` `#FFC65C` atau `K.iv` `#F6F5EE`) tetap menggunakan warna gelap `K.ink` (`#172235`) agar terbaca jelas.
- **Kotak Subtitle (`drawSubtitleOverlay`):**
  - Kotak kapsul di bagian bawah kanvas (`x = 60`, `w = 960`, `r = 28`) dengan fill `#000000` (`alpha = 0.68`), stroke `K.surf` (`#22314d`, `lineWidth = 2`), dan teks `K.iv` (`#F6F5EE`, `600 38px Inter, system-ui, sans-serif`, rata tengah di `x = 540`).
- **Tema Halaman Pembungkus HTML (CSS):**
  - `body`: `background: #0b1220; color: #F6F5EE; font-family: Inter, system-ui, sans-serif;`
  - `canvas`: `background: #0e1626; border-radius: 14px; box-shadow: 0 10px 32px rgba(0,0,0,.45);`
  - Tombol utama: `#4667FF`, tombol sekunder (`.g`): `#22314d`, tombol scene aktif (`.act`): `#16B99A` dengan teks `#0b1220`.

---

### 4. JEDA BACA 2 DETIK (`SCENE_DELAY = 2.0`), IKON KUBERNETES & OUTRO
1. **Jeda Baca 2 Detik Antar-Scene:**
   - Berikan jeda **`SCENE_DELAY = 2.0` detik** setelah durasi voiceover tiap scene selesai sebelum berpindah ke scene berikutnya (`DURS[i] = VO_DURS[i] + 2.0`).
   - Selama jeda 2 detik tersebut (`VO_DURS[i] <= localT < VO_DURS[i] + 2.0`), tahan (*clamp*) *timeline* struktural scene pada posisi akhir (`tClamped = Math.min(localT, VO_DURS[i] - 0.001)`) agar diagram/teks akhir tetap utuh di layar, sambil membiarkan animasi *ambient*/partikel dan musik tetap berjalan, serta perpanjang *cue* subtitle terakhir selama `+1.8 detik`.
2. **Ikon Kubernetes (`kubernetes-icon.svg`) & Outro (`alifpustaka-logo-reveal.html`):**
   - Gunakan path vektor asli dari `kubernetes-icon.svg` (`Path2D` dengan heptagon `#326ce5` dan roda kemudi `#ffffff`).
   - Tambahkan animasi dari file `alifpustaka-logo-reveal.html` di bagian paling akhir video sebagai **Outro** berdurasi `4.0 + 2.0 = 6.0 detik` di atas latar `drawThemeBg` (`#0e1626`).

---

### 5. WAJIB — PERBAIKAN BUG MP4 DURASI `00:00` & SEEKBAR TIDAK BISA DIGESER
Saat merekam dengan `MediaRecorder` di Chrome/Edge, browser menghasilkan **Fragmented MP4 (`fMP4`)** dengan kotak `moof` + `mdat` di mana `mvhd.duration = 0` (`00:00`) dan tabel indeks `stbl` (`stts`, `stss`, `stsc`, `stsz`, `stco`) kosong, sehingga video **tidak bisa di-*seek* (lompat ke timestamp tertentu)** di pemutar video dan detail durasinya muncul `00.00`.

**ATURAN WAJIB UNTUK EKSPOR VIDEO MP4:**
1. **DILARANG KERAS** langsung mengunduh `new Blob(chunks, { type: 'video/mp4' })` mentah dari `MediaRecorder`!
2. **WAJIB** menyertakan fungsi `defragmentMp4(arrayBuf)` dan `ensureSeekableMp4(rawBlob)` di bawah ini secara utuh di dalam kode, lalu **WAJIB** memanggil `const finalBlob = await ensureSeekableMp4(rawBlob)` sebelum memicu unduhan file `.mp4`:

```javascript
// WAJIB DISERTAKAN: Mengubah Fragmented MP4 (durasi 00:00, seekbar mati)
// menjadi MP4 Standar FastStart [ftyp][moov][mdat] dengan durasi & tabel seekbar penuh (stts, stss, stsc, stsz, stco)
function defragmentMp4(arrayBuf) {
  try {
    const u8 = new Uint8Array(arrayBuf);
    const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
    const rType = o => String.fromCharCode(u8[o], u8[o + 1], u8[o + 2], u8[o + 3]);
    const boxes = (start, end) => {
      const res = [];
      let o = start;
      while (o + 8 <= end) {
        let sz = dv.getUint32(o), hdr = 8;
        const t = rType(o + 4);
        if (sz === 1) { sz = Number(dv.getBigUint64(o + 8)); hdr = 16; }
        else if (sz === 0) sz = end - o;
        if (sz < hdr || o + sz > end) break;
        res.push({ t, o, sz, hdr, body: o + hdr, end: o + sz });
        o += sz;
      }
      return res;
    };
    const top = boxes(0, u8.byteLength);
    const moofs = top.filter(b => b.t === 'moof');
    const moov = top.find(b => b.t === 'moov');
    const ftyp = top.find(b => b.t === 'ftyp');
    if (!moov || !ftyp || moofs.length === 0) return arrayBuf;

    const tracks = new Map();
    const chunks = [];
    for (const moof of moofs) {
      for (const traf of boxes(moof.body, moof.end).filter(b => b.t === 'traf')) {
        const sub = boxes(traf.body, traf.end);
        const tfhd = sub.find(b => b.t === 'tfhd');
        if (!tfhd) continue;
        const tfFlags = dv.getUint32(tfhd.body) & 0xffffff;
        const trackId = dv.getUint32(tfhd.body + 4);
        let p = tfhd.body + 8;
        let baseOff = moof.o;
        if (tfFlags & 0x01) { baseOff = Number(dv.getBigUint64(p)); p += 8; }
        if (tfFlags & 0x02) p += 4;
        const defDur = (tfFlags & 0x08) ? (p += 4, dv.getUint32(p - 4)) : 0;
        const defSz  = (tfFlags & 0x10) ? (p += 4, dv.getUint32(p - 4)) : 0;
        const defFlg = (tfFlags & 0x20) ? (p += 4, dv.getUint32(p - 4)) : 0;
        if (!tracks.has(trackId)) tracks.set(trackId, { samples: [], chunks: [] });
        const trk = tracks.get(trackId);
        for (const trun of sub.filter(b => b.t === 'trun')) {
          const trFlags = dv.getUint32(trun.body) & 0xffffff;
          const cnt = dv.getUint32(trun.body + 4);
          let q = trun.body + 8;
          const dataOff = (trFlags & 0x01) ? (q += 4, dv.getInt32(q - 4)) : 0;
          const firstFlg = (trFlags & 0x04) ? (q += 4, dv.getUint32(q - 4)) : defFlg;
          let dPos = baseOff + dataOff;
          const chunkStartPos = dPos;
          let chunkByteLen = 0;
          for (let i = 0; i < cnt; i++) {
            const dur = (trFlags & 0x100) ? (q += 4, dv.getUint32(q - 4)) : defDur;
            const sz  = (trFlags & 0x200) ? (q += 4, dv.getUint32(q - 4)) : defSz;
            const flg = (trFlags & 0x400) ? (q += 4, dv.getUint32(q - 4)) : (i === 0 ? firstFlg : defFlg);
            const cto = (trFlags & 0x800) ? (q += 4, dv.getInt32(q - 4)) : 0;
            const isKey = (flg & 0x00010000) === 0 && ((flg >> 24) & 3) !== 1;
            trk.samples.push({ dur: dur || 1000, sz, isKey, cto });
            dPos += sz;
            chunkByteLen += sz;
          }
          if (cnt > 0 && chunkByteLen > 0) {
            const ch = { trackId, srcOffset: chunkStartPos, byteLen: chunkByteLen, sampleCount: cnt, dstOffset: 0 };
            trk.chunks.push(ch);
            chunks.push(ch);
          }
        }
      }
    }
    const mkBox = (type, ...payloads) => {
      const len = payloads.reduce((s, a) => s + a.byteLength, 0);
      const out = new Uint8Array(8 + len);
      const v = new DataView(out.buffer);
      v.setUint32(0, 8 + len);
      for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
      let o = 8;
      for (const a of payloads) { out.set(a, o); o += a.byteLength; }
      return out;
    };
    let mvhdTimescale = 1000;
    const moovChildren = boxes(moov.body, moov.end);
    const mvhdBox = moovChildren.find(b => b.t === 'mvhd');
    if (mvhdBox) {
      const ver = u8[mvhdBox.body];
      mvhdTimescale = ver === 1 ? dv.getUint32(mvhdBox.body + 20) : dv.getUint32(mvhdBox.body + 12);
    }
    let maxDurSec = 0;
    const buildTrak = (trakBox, mdatBase) => {
      const tCh = boxes(trakBox.body, trakBox.end);
      const tkhd = tCh.find(b => b.t === 'tkhd');
      const mdia = tCh.find(b => b.t === 'mdia');
      if (!tkhd || !mdia) return u8.subarray(trakBox.o, trakBox.end);
      const tkVer = u8[tkhd.body];
      const trackId = tkVer === 1 ? dv.getUint32(tkhd.body + 20) : dv.getUint32(tkhd.body + 12);
      const trk = tracks.get(trackId);
      if (!trk || trk.samples.length === 0) return u8.subarray(trakBox.o, trakBox.end);
      const mCh = boxes(mdia.body, mdia.end);
      const mdhd = mCh.find(b => b.t === 'mdhd');
      const hdlr = mCh.find(b => b.t === 'hdlr');
      const minf = mCh.find(b => b.t === 'minf');
      const mdVer = u8[mdhd.body];
      const mdTs = mdVer === 1 ? dv.getUint32(mdhd.body + 20) : dv.getUint32(mdhd.body + 12);
      const totalDur = trk.samples.reduce((s, x) => s + x.dur, 0);
      const durSec = totalDur / (mdTs || 1000);
      if (durSec > maxDurSec) maxDurSec = durSec;
      const hdlrType = hdlr ? rType(hdlr.body + 8) : '';

      const tkhdBytes = u8.slice(tkhd.body, tkhd.end);
      const tkDv = new DataView(tkhdBytes.buffer);
      const tkDur = Math.round(durSec * mvhdTimescale);
      if (tkVer === 1) tkDv.setBigUint64(28, BigInt(tkDur));
      else tkDv.setUint32(20, tkDur);

      const mdhdBytes = u8.slice(mdhd.body, mdhd.end);
      const mdDv = new DataView(mdhdBytes.buffer);
      if (mdVer === 1) mdDv.setBigUint64(24, BigInt(totalDur));
      else mdDv.setUint32(16, totalDur);

      const minfCh = boxes(minf.body, minf.end);
      const stbl = minfCh.find(b => b.t === 'stbl');
      const stblCh = boxes(stbl.body, stbl.end);
      const stsd = stblCh.find(b => b.t === 'stsd');

      const sttsRuns = [];
      for (const s of trk.samples) {
        const last = sttsRuns[sttsRuns.length - 1];
        if (last && last.d === s.dur) last.c++;
        else sttsRuns.push({ c: 1, d: s.dur });
      }
      const sttsBuf = new Uint8Array(8 + sttsRuns.length * 8), sttsDv = new DataView(sttsBuf.buffer);
      sttsDv.setUint32(4, sttsRuns.length);
      sttsRuns.forEach((r, i) => { sttsDv.setUint32(8 + i * 8, r.c); sttsDv.setUint32(12 + i * 8, r.d); });

      let stssBox = null;
      if (hdlrType === 'vide') {
        const keys = [];
        trk.samples.forEach((s, i) => { if (s.isKey) keys.push(i + 1); });
        if (keys.length > 0 && keys.length < trk.samples.length) {
          const b = new Uint8Array(8 + keys.length * 4), v = new DataView(b.buffer);
          v.setUint32(4, keys.length);
          keys.forEach((k, i) => v.setUint32(8 + i * 4, k));
          stssBox = mkBox('stss', b);
        }
      }

      const stscBuf = new Uint8Array(8 + trk.chunks.length * 12), stscDv = new DataView(stscBuf.buffer);
      stscDv.setUint32(4, trk.chunks.length);
      trk.chunks.forEach((c, i) => {
        stscDv.setUint32(8 + i * 12, i + 1);
        stscDv.setUint32(12 + i * 12, c.sampleCount);
        stscDv.setUint32(16 + i * 12, 1);
      });

      const stszBuf = new Uint8Array(12 + trk.samples.length * 4), stszDv = new DataView(stszBuf.buffer);
      stszDv.setUint32(8, trk.samples.length);
      trk.samples.forEach((s, i) => stszDv.setUint32(12 + i * 4, s.sz));

      const stcoBuf = new Uint8Array(8 + trk.chunks.length * 4), stcoDv = new DataView(stcoBuf.buffer);
      stcoDv.setUint32(4, trk.chunks.length);
      trk.chunks.forEach((c, i) => stcoDv.setUint32(8 + i * 4, mdatBase + c.dstOffset));

      const stblParts = [u8.subarray(stsd.o, stsd.end), mkBox('stts', sttsBuf)];
      if (stssBox) stblParts.push(stssBox);
      stblParts.push(mkBox('stsc', stscBuf), mkBox('stsz', stszBuf), mkBox('stco', stcoBuf));
      const newStbl = mkBox('stbl', ...stblParts);
      const newMinf = mkBox('minf', ...minfCh.map(b => b.t === 'stbl' ? newStbl : u8.subarray(b.o, b.end)));
      const newMdia = mkBox('mdia', ...mCh.map(b => b.t === 'mdhd' ? mkBox('mdhd', mdhdBytes) : b.t === 'minf' ? newMinf : u8.subarray(b.o, b.end)));
      return mkBox('trak', ...tCh.map(b => b.t === 'tkhd' ? mkBox('tkhd', tkhdBytes) : b.t === 'mdia' ? newMdia : u8.subarray(b.o, b.end)));
    };

    let mdatPayloadLen = 0;
    for (const c of chunks) { c.dstOffset = mdatPayloadLen; mdatPayloadLen += c.byteLen; }
    const passMoov = mdatBase => {
      const traks = moovChildren.filter(b => b.t === 'trak').map(b => buildTrak(b, mdatBase));
      const mvhdBytes = u8.slice(mvhdBox.body, mvhdBox.end);
      const mvDv = new DataView(mvhdBytes.buffer);
      const mvVer = u8[mvhdBox.body];
      const mvDur = Math.round(maxDurSec * mvhdTimescale);
      if (mvVer === 1) mvDv.setBigUint64(24, BigInt(mvDur));
      else mvDv.setUint32(16, mvDur);
      return mkBox('moov', mkBox('mvhd', mvhdBytes), ...traks);
    };
    const ftypBytes = u8.subarray(ftyp.o, ftyp.end);
    const dummyMoov = passMoov(0);
    const mdatDataStart = ftypBytes.byteLength + dummyMoov.byteLength + 8;
    const finalMoov = passMoov(mdatDataStart);

    const out = new Uint8Array(mdatDataStart + mdatPayloadLen);
    out.set(ftypBytes, 0);
    out.set(finalMoov, ftypBytes.byteLength);
    const outDv = new DataView(out.buffer);
    outDv.setUint32(ftypBytes.byteLength + finalMoov.byteLength, 8 + mdatPayloadLen);
    out.set([109, 100, 97, 116], ftypBytes.byteLength + finalMoov.byteLength + 4);
    for (const c of chunks) {
      out.set(u8.subarray(c.srcOffset, c.srcOffset + c.byteLen), mdatDataStart + c.dstOffset);
    }
    return out.buffer;
  } catch (e) {
    console.warn('defragmentMp4 fallback:', e);
    return arrayBuf;
  }
}

async function ensureSeekableMp4(rawBlob) {
  const rawBuf = await rawBlob.arrayBuffer();
  try {
    const M = window.Mediabunny || await import('https://cdn.jsdelivr.net/npm/mediabunny@1.25.0/dist/bundles/mediabunny.min.mjs');
    if (M && M.Input && M.Conversion) {
      const input = new M.Input({ source: new M.BufferSource(rawBuf), formats: [M.MP4, M.WEBM] });
      const out = new M.Output({ format: new M.Mp4OutputFormat({ fastStart: 'in-memory' }), target: new M.BufferTarget() });
      const conv = await M.Conversion.init({ input, output: out });
      if (conv.isValid) {
        await conv.execute();
        return new Blob([out.target.buffer], { type: 'video/mp4' });
      }
    }
  } catch (e) {}
  return new Blob([defragmentMp4(rawBuf)], { type: 'video/mp4' });
}
```

3. Pada handler `recorder.onstop`, **WAJIB** memanggil `ensureSeekableMp4`:
```javascript
recorder.onstop = async () => {
  const rawBlob = new Blob(chunks, { type: mimeType.split(';')[0] });
  const seekableBlob = await ensureSeekableMp4(rawBlob);
  downloadBlob(seekableBlob, 'video-full.mp4');
};
```