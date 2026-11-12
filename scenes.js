// ============================================================================
// MASTERCLASS RAG BAGIAN 2 — UNIFIED SCENES (SCENE 1..8 + OUTRO)
// Dark Tech Theme (K) + Symmetry Fixes + 2.0s Reading Delay Clamping
// ============================================================================

const W = 1080, H = 1920;
const SCENE_DELAY = 2.0;

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

const F_SANS = 'Inter,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif';
const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const pr = (t, a, b) => cl((t - a) / (b - a));
const eo = x => 1 - Math.pow(1 - cl(x), 3);
const eio = x => { x = cl(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };

function drawThemeBg(g, w = 1080, h = 1920) {
  g.save();
  g.fillStyle = K.bg;
  g.fillRect(-160, -160, w + 320, h + 320);
  const sx = w / 1080, sy = h / 1920;
  g.fillStyle = K.bg2;
  g.beginPath(); g.arc(980 * sx, 160 * sy, 300 * sx, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.arc(60 * sx, 1800 * sy, 360 * sx, 0, Math.PI * 2); g.fill();
  g.restore();
}

function drawR(g, x, y, w, h, r, fill, alpha = 1, stroke = null, lw = 4, dash = []) {
  if (w <= 0 || h <= 0) return;
  g.save();
  g.globalAlpha *= alpha;
  g.beginPath();
  g.roundRect(x, y, w, h, Math.min(r, w / 2, h / 2));
  if (fill) { g.fillStyle = fill; g.fill(); }
  if (stroke) {
    g.strokeStyle = stroke;
    g.lineWidth = lw;
    g.setLineDash(dash);
    g.stroke();
  }
  g.restore();
}

function drawC(g, x, y, r, fill, alpha = 1, stroke = null, lw = 4) {
  if (r <= 0) return;
  g.save();
  g.globalAlpha *= alpha;
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
  if (fill) { g.fillStyle = fill; g.fill(); }
  if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); }
  g.restore();
}

function drawT(g, txt, x, y, sz, col, wt = 700, align = 'center', alpha = 1, baseline = 'alphabetic', maxW = undefined) {
  g.save();
  g.globalAlpha *= alpha;
  g.font = `${wt} ${sz}px ${F_SANS}`;
  g.fillStyle = col;
  g.textAlign = align;
  g.textBaseline = baseline;
  if (maxW) g.fillText(String(txt), x, y, maxW);
  else g.fillText(String(txt), x, y);
  g.restore();
}

function drawSubtitleOverlay(g, text) {
  if (!text) return;
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.font = `600 38px ${F_SANS}`;
  const words = text.trim().split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    const test = cur ? cur + ' ' + w : w;
    if (g.measureText(test).width > 880 && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  const lh = 52;
  const bh = lines.length * lh + 32;
  const by = 1868 - bh;
  drawR(g, 60, by, 960, bh, 28, '#000000', 0.68, K.surf, 2);
  lines.forEach((line, idx) => {
    drawT(g, line, 540, by + 28 + idx * lh + 22, 38, K.iv, 600, 'center', 1);
  });
  g.restore();
}

// ============================================================================
// KUBERNETES SVG ICON (kubernetes-icon.svg Path2D)
// ============================================================================
const K8S_SVG_P1 = 'M365 185a47 46 0 0 0-18 4L103 306a47 46 0 0 0-25 32L18 600a47 46 0 0 0 6 35 47 46 0 0 0 3 4l169 210a47 46 0 0 0 36 18h271a47 46 0 0 0 37-18l169-210a47 46 0 0 0 9-39l-60-263a47 46 0 0 0-26-31L388 189a47 46 0 0 0-23-4z';
const K8S_SVG_P2 = 'M368 274c-8 0-15 7-15 16v4l2 14 2 27c-1 3-3 6-5 7v7a190 190 0 0 0-122 58l-6-3c-2 0-5 1-8-1l-20-18-10-10-3-3c-3-2-7-4-10-4-5 0-9 2-12 5-5 7-3 16 4 22l3 3 12 7 22 15c2 2 3 7 3 8l5 5c-26 37-37 84-30 131l-6 2c-2 2-4 6-7 7l-26 4-14 1-4 1c-9 2-14 10-13 18 2 8 11 12 19 11h1v-1h4l13-5c9-4 17-7 25-8l9 3 6-1c15 45 45 82 84 105l-2 7c1 2 2 5 1 8l-13 24-8 11-2 4c-4 8-1 18 6 21 8 4 17 0 20-8l2-4 5-13c3-10 6-20 11-27l6-3 3-6a189 189 0 0 0 135 1l4 5c2 1 5 2 7 5l10 24 4 14 2 4c4 8 13 11 20 8 8-4 10-13 7-21l-2-4-8-12c-6-8-10-15-13-23-1-4 0-6 1-8l-2-6c40-24 70-62 84-106l6 1c2-2 4-4 8-3 8 1 16 4 26 7l13 5 4 1c9 2 17-3 19-10 2-8-4-16-12-18l-5-1-14-1c-10-1-18-2-26-5-3-1-5-5-6-6l-6-2a189 189 0 0 0-31-131l6-5c0-3 0-5 2-8 6-6 13-10 22-16l12-7 4-2c7-6 8-16 3-22s-15-7-22-1l-3 2-10 11c-7 7-13 13-19 17-3 2-7 2-9 1l-6 4c-31-33-75-54-121-58v-7c-2-2-5-3-5-7-1-8 0-16 1-27l2-14v-4c0-9-6-16-14-16zm-19 113-4 77a13 13 0 0 1-21 10l-63-44a151 151 0 0 1 88-43zm37 0c33 5 64 20 88 43l-63 44a13 13 0 0 1-21-10zm-148 71 58 52a13 13 0 0 1-5 22l-74 22c-4-35 4-68 21-96zm259 0a153 153 0 0 1 22 95l-74-21a13 13 0 0 1-5-22h-1l58-52zm-141 56h23l15 18-5 23-21 10-21-10-6-23zm75 62h3l77 13c-12 32-33 59-61 77l-30-72a13 13 0 0 1 11-18zm-128 1a13 13 0 0 1 12 18l-29 71c-27-18-49-44-61-77l76-12h2zm64 31c2-1 4 0 6 1 3 1 5 3 6 5l38 68a154 154 0 0 1-98-1l37-67c3-4 7-6 11-6z';
let _k8sP1 = null, _k8sP2 = null;
function drawK8sIcon(g, cx, cy, size, alpha = 1) {
  g.save();
  g.globalAlpha *= alpha;
  const s = size / 722.8;
  g.translate(cx - (722.8 * s) / 2, cy - (702 * s) / 2);
  g.scale(s, s);
  g.translate(-6, -175);
  if (typeof Path2D !== 'undefined') {
    if (!_k8sP1) {
      _k8sP1 = new Path2D(K8S_SVG_P1);
      _k8sP2 = new Path2D(K8S_SVG_P2);
    }
    g.fillStyle = '#326ce5';
    g.fill(_k8sP1);
    g.fillStyle = '#ffffff';
    g.fill(_k8sP2);
    g.strokeStyle = '#ffffff';
    g.lineWidth = 0.25;
    g.stroke(_k8sP2);
  }
  g.restore();
}

// ============================================================================
// SCENE 1: HOOK & BIANG KEROK OOM KILLER (EXIT CODE 137)
// ============================================================================
function createScene1(cv) {
  const X = cv.getContext('2d');
  const K1 = { ink: K.ink, i2: K.bg, i3: K.surf, iv: K.iv, co: K.cob, te: K.teal, cr: K.cor, am: K.amb, pe: K.peri, sl: K.sl, sa: K.surf };
  let c = X;
  const F = { d: '"Bricolage Grotesque",sans-serif', m: '"JetBrains Mono",monospace', i: 'Inter,sans-serif' }, WT = { d: 800, m: 700, i: 600 };
  function R0(x,y,w,h,r,f,s,lw){c.beginPath();c.roundRect(x,y,w,h,r);if(f){c.fillStyle=f;c.fill()}if(s){c.strokeStyle=s;c.lineWidth=lw||6;c.lineCap='round';c.lineJoin='round';c.stroke()}}
  function Ci0(x,y,r,f,s,lw){c.beginPath();c.arc(x,y,r,0,7);if(f){c.fillStyle=f;c.fill()}if(s){c.strokeStyle=s;c.lineWidth=lw||6;c.stroke()}}
  function PG0(p,f,s,lw){c.beginPath();p.forEach((q,k)=>k?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.closePath();if(f){c.fillStyle=f;c.fill()}if(s){c.strokeStyle=s;c.lineWidth=lw||6;c.lineJoin='round';c.stroke()}}
  function PL0(p,s,lw){c.beginPath();p.forEach((q,k)=>k?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.strokeStyle=s;c.lineWidth=lw||6;c.lineCap='round';c.lineJoin='round';c.stroke()}
  function T0(s,x,y,z,col,f,al){c.font=WT[f]+' '+z+'px '+F[f];c.fillStyle=col;c.textAlign=al||'left';c.textBaseline='alphabetic';c.fillText(s,x,y)}
  function wrap(s,w,z,f){c.font=WT[f]+' '+z+'px '+F[f];const o=[];let l='';s.split(' ').forEach(a=>{const t=l?l+' '+a:a;if(c.measureText(t).width>w&&l){o.push(l);l=a}else l=t});o.push(l);return o}
  function star0(x,y,r1,r2,n,f){const p=[];for(let k=0;k<n*2;k++){const a=k*Math.PI/n,r=k%2?r2:r1;p.push([x+r*Math.sin(a),y-r*Math.cos(a)])}PG0(p,f)}
  function db0(x,y,w,h,f,top){const e=h*.14;c.fillStyle=f;c.beginPath();c.rect(x,y+e,w,h-2*e);c.fill();c.beginPath();c.ellipse(x+w/2,y+h-e,w/2,e,0,0,7);c.fill();c.beginPath();c.ellipse(x+w/2,y+e,w/2,e,0,0,7);c.fillStyle=top;c.fill();[.38,.62].forEach(k=>{c.beginPath();c.ellipse(x+w/2,y+h*k+e*.2,w/2,e,0,0,Math.PI);c.strokeStyle=top;c.lineWidth=5;c.stroke()})}
  function head(n,t,col,ac){Ci(106,110,38,ac);T(String(n),106,126,44,K1.ink,'d','center');T(t,166,126,46,col,'d');for(let k=1;k<=6;k++)Ci(1010-(6-k)*34,50,k==n?10:6,k==n?ac:K1.sl)}

  let ANIM=true,U=0,DL=.1,cnt=0,SUBS=true,DLS=[],SH=1.3,CNTP=false;
  const SFX=[],MK={};
  function mk(k){if(CNTP)MK[k]=cnt}
  const seg=(u,a,b)=>cl((u-a)/(b-a));
  function ent(){const n=cnt++;return ANIM?eo(seg(U,n*DL,n*DL+.4)):1}
  function R(...a){const e=ent();if(e<=0)return;c.save();c.globalAlpha*=e;c.translate(0,(1-e)*36);R0(...a);c.restore()}
  function Ci(...a){const e=ent();if(e<=0)return;c.save();c.globalAlpha*=e;c.translate(0,(1-e)*36);Ci0(...a);c.restore()}
  function PG(...a){const e=ent();if(e<=0)return;c.save();c.globalAlpha*=e;c.translate(0,(1-e)*36);PG0(...a);c.restore()}
  function PL(...a){const e=ent();if(e<=0)return;c.save();c.globalAlpha*=e;c.translate(0,(1-e)*36);PL0(...a);c.restore()}
  function T(...a){const e=ent();if(e<=0)return;c.save();c.globalAlpha*=e;c.translate(0,(1-e)*36);T0(...a);c.restore()}
  function star(...a){const e=ent();if(e<=0)return;c.save();c.globalAlpha*=e;c.translate(0,(1-e)*36);star0(...a);c.restore()}
  function db(...a){const e=ent();if(e<=0)return;c.save();c.globalAlpha*=e;c.translate(0,(1-e)*36);db0(...a);c.restore()}

  const S = [
    ()=>{T('BAGIAN 2 / 10 · MASTERCLASS ARSITEKTUR RAG',540,110,25,K1.am,'m','center');
    [['Bikin Sistem RAG',K1.iv],['di VPS 4 GB RAM',K1.iv],['Tapi Database',K1.iv],['Mati Terus',K1.iv],['(Exit Code 137)?',K1.cr],['Ini Biang Keroknya!',K1.am]].forEach((a,k)=>T(a[0],540,250+k*100,86,a[1],'d','center'));
    // Left rack (70..430, width 360, center 250) & Right VPS (650..1010, width 360, center 830) — 100% symmetric around x=540!
    R(70,900,360,420,30,K1.i3,K1.sl,6);[0,1,2].forEach(k=>{R(100,935+k*130,300,100,22,K1.co);Ci(140,985+k*130,11,K1.te);Ci(180,985+k*130,11,K1.am);R(250,975+k*130,120,20,10,K1.pe)});
    mk('s1strike');PL([[70,900],[430,1320]],K1.cr,16);R(110,1350,280,64,32,K1.cr);T('Rp puluhan juta',250,1393,26,K1.iv,'m','center');
    T('VS',540,1130,52,K1.am,'d','center');
    mk('s1vps');R(650,1040,360,200,36,K1.i3,K1.te,7);R(680,1070,150,22,11,K1.sl);Ci(955,1081,11,K1.te);T('4 GB',680,1190,76,K1.iv,'d');T('2 vCPU',845,1215,26,K1.pe,'m');
    mk('s1chk');Ci(990,1040,40,K1.te);PL([[972,1040],[986,1054],[1010,1026]],K1.iv,9);T('VPS murah',830,1290,32,K1.iv,'i','center');
    T('contoh ilustrasi',540,1480,22,K1.sl,'m','center')},

    ()=>{head(1,'Anggaran RAM = Kost 5 Kamar',K1.iv,K1.am);
    T('RAM 4 GB · total anggaran',70,262,26,K1.sl,'m');c.save();c.beginPath();c.roundRect(70,285,940,84,42);c.clip();c.fillStyle=K1.i3;c.fillRect(70,285,940,84);let x=70;[.22,.2,.28,.12,.18].forEach((w,k)=>{c.fillStyle=[K1.co,K1.te,K1.am,K1.cr,K1.pe][k];c.fillRect(x,285,(w*940-6)*eo(seg(U,.2,1.4)),84);x+=w*940});c.restore();
    mk('s2roof');PG([[90,660],[540,470],[990,660]],K1.cr);R(120,640,840,810,30,K1.ink,K1.i3,6);
    const N=['Next.js','API RAG','PostgreSQL','Redis','Worker'],Cl=[K1.co,K1.te,K1.am,K1.cr,K1.pe],bw=[.6,.5,.85,.3,.45];
    for(let k=0;k<5;k++){mk('s2room'+k);const t=k<3,w=t?250:385,x=t?145+k*270:145+(k-3)*405,y=t?690:1060;R(x,y,w,340,26,K1.i3,K1.sl,5);R(x+w/2-40,y+14,80,16,8,K1.sl);
    R(x+22,y+60,w-44,120,24,Cl[k]);T(N[k],x+w/2,y+135,t?36:44,k==2?K1.ink:K1.iv,'d','center');
    R(x+22,y+230,w-44,22,11,K1.ink);R(x+22,y+230,(w-44)*bw[k],22,11,Cl[k]);T('KAMAR '+(k+1),x+w/2,y+300,22,K1.iv,'m','center')}
    T('jatah RAM per kamar — contoh ilustrasi',540,1530,22,K1.sl,'m','center')},

    ()=>{head(2,'Satu Atap, Satu Rebutan',K1.iv,K1.am);
    R(70,500,560,680,36,K1.i3,K1.sl,7);db(150,590,200,230,K1.te,'#5fd6bf');T('PostgreSQL',250,900,46,K1.iv,'d','center');T('+ pgvector',250,950,28,K1.pe,'m','center');
    [[420,640],[500,720],[440,800]].forEach((p,k)=>{Ci(p[0],p[1],14,K1.co);if(k)PL([[p[0],p[1]],[[420,640],[500,720]][k-1]],K1.co,5)});
    mk('s3blk');R(500,650,510,440,44,K1.cr,K1.iv,7);T('BGE-M3',755,800,92,K1.iv,'d','center');T('model embedding lokal',755,858,28,K1.iv,'i','center');T('2,2 GB',755,990,84,K1.am,'m','center');
    mk('s3crack');PL([[560,500],[548,580],[572,650],[552,760],[570,900],[556,1010],[566,1180]],K1.am,9);
    mk('s3push');[760,840,920].forEach(y=>PL([[475,y],[420,y],[440,y-18],[420,y],[440,y+18]],K1.am,7));
    R(70,1260,940,230,40,K1.ink,K1.i3,5);T('Model embedding + database',540,1355,48,K1.iv,'d','center');T('satu atap = rebutan RAM',540,1430,48,K1.am,'d','center')},

    ()=>{head(3,'Sekring Rumah Jepret',K1.iv,K1.am);
    PG([[70,540],[540,360],[1010,540]],K1.cr);R(110,520,860,760,30,K1.ink,K1.i3,6);
    mk('s4ac');R(150,580,360,130,26,K1.co,K1.iv,5);[0,1,2,3].forEach(k=>PL([[190+k*80,650],[220+k*80,680]],K1.iv,8));Ci(470,615,10,K1.am);T('AC',180,625,30,K1.iv,'m');
    mk('s4oven');R(150,770,230,230,28,K1.am,K1.ink,6);R(180,830,170,120,16,K1.ink);[0,1].forEach(k=>Ci(215+k*100,800,10,K1.ink));
    mk('s4iron');PG([[420,930],[600,930],[640,990],[420,990]],K1.cr,K1.iv,6);R(440,900,120,22,11,K1.iv);
    mk('s4box');R(660,570,270,420,28,K1.i3,K1.iv,6);[0,1,2].forEach(k=>{mk('s4sw'+k);R(700,620+k*110,190,70,16,K1.ink,K1.sl,4);R(720+(k<2?90:0),632+k*110+(k==2?38:0),70,30,10,k<2?K1.te:K1.cr)});T('JEPRET',795,1030,34,K1.cr,'m','center');
    mk('s4spark');star(840,590,52,24,8,K1.am);
    PL([[265,1000],[265,1090],[540,1090],[780,1090],[795,990]],K1.sl,8);R(180,1070,420,50,16,K1.ink,K1.iv,4);Ci(230,1095,8,K1.am);Ci(290,1095,8,K1.am);Ci(350,1095,8,K1.am);
    T('daya rumah kecil',540,1190,32,K1.iv,'i','center');T('AC + oven + setrika = beban melebihi kapasitas',540,1240,24,K1.pe,'m','center')},

    ()=>{head(4,'RAM Tembus 100%',K1.iv,K1.am);
    R(70,300,940,140,40,K1.i3);c.save();c.beginPath();c.roundRect(70,300,940,140,40);c.clip();c.fillStyle=K1.cr;c.fillRect(70,300,517*eo(seg(U,.3,3)),140);c.fillStyle=K1.am;c.fillRect(587,300,423*eo(seg(U,3.2,6)),140);c.restore();
    T('BGE-M3 · 2,2 GB',100,385,38,K1.iv,'d');T('PostgreSQL',620,385,38,K1.ink,'d');T('RAM 4 GB',70,270,26,K1.sl,'m');
    T(Math.round(100*eo(seg(U,3.2,6.5)))+'%',540,640,220,K1.cr,'d','center');
    mk('s5panel');R(70,700,940,700,40,K1.ink,K1.i3,5);T('HNSW — grafik indeks vektor dirakit di RAM',540,770,28,K1.am,'m','center');
    // Symmetric HNSW graph nodes (130..950, exact center 540)
    const L=[[3,830],[6,1030],[12,1250]],P=L.map(([n,y])=>Array.from({length:n},(_,k)=>[130+(820/(n-1))*k,y+Math.abs(k-(n-1)/2)*12]));
    P[1].forEach((p,k)=>PL([p,P[0][Math.min(2,Math.floor(k/2))]],K1.sl,4));P[2].forEach((p,k)=>PL([p,P[1][Math.min(5,Math.floor(k/2))]],K1.sl,4));
    P.forEach(l=>l.forEach((p,k)=>{if(k)PL([l[k-1],p],K1.pe,4)}));
    mk('s5nodes');P.forEach((l,j)=>l.forEach(p=>Ci(p[0],p[1],j==0?22:j==1?17:13,j==2?K1.te:K1.co)));Ci(P[2][5][0],P[2][5][1],19,K1.am);
    T('contoh ilustrasi',540,1450,22,K1.sl,'m','center')},

    ()=>{mk('s6term');R(50,40,980,780,34,K1.ink,K1.cr,10);[K1.cr,K1.am,K1.te].forEach((a,k)=>Ci(100+k*34,88,11,a));T('htop — vps-4gb',250,98,26,K1.sl,'m');
    [['CPU1',.55],['CPU2',.7]].forEach((a,k)=>{T(a[0],90,170+k*56,24,K1.sl,'m');R(190,148+k*56,800,26,13,K1.i3);R(190,148+k*56,800*a[1],26,13,K1.te)});
    mk('s6mem');T('Mem',90,282,24,K1.iv,'m');R(190,260,800,30,15,K1.i3);R(190,260,796,30,15,K1.cr);T('3.98G/4.00G',590,284,22,K1.iv,'m','center');
    T('PID  PROSES            MEM%',90,350,22,K1.sl,'m');
    [['next-server','12.4',K1.iv],['redis-server','3.1',K1.iv],['embed-bge-m3','55.0',K1.am],['postgres','Killed',K1.cr]].forEach((a,k)=>{if(k==3)R(90,538,900,52,12,K1.cr);T('· '+a[0],110,392+k*54+(k==3?20:0),26,k==3?K1.iv:a[2],'m');T(a[1],970,392+k*54+(k==3?20:0),26,k==3?K1.iv:a[2],'m','right')});
    mk('s6kill');R(100,630,880,130,28,K1.cr);T('Killed (Exit Code 137)',540,715,56,K1.iv,'d','center');
    // Symmetric reticle (center 290, span 90..490) and fuse box (630..950, center 790) -> symmetric around x=540
    mk('s6ret');Ci(290,1040,160,null,K1.cr,10);PL([[90,1040],[190,1040]],K1.cr,10);PL([[390,1040],[490,1040]],K1.cr,10);PL([[290,840],[290,940]],K1.cr,10);PL([[290,1140],[290,1240]],K1.cr,10);db(225,980,130,150,K1.te,'#5fd6bf');T('OOM Killer',290,1270,26,K1.cr,'m','center');
    R(630,880,320,340,28,K1.i3,K1.iv,6);[0,1,2].forEach(k=>{R(670,920+k*95,240,64,16,K1.ink,K1.sl,4);R(685+(k<2?120:0),930+k*95+(k==2?30:0),105,30,10,k<2?K1.te:K1.cr)});T('sekring jepret',790,1260,24,K1.cr,'m','center');
    mk('s6amb');R(70,1340,940,210,40,K1.am);T('Hitung anggaran RAM dulu:',540,1430,46,K1.ink,'d','center');T('pisahkan embedding dari database',540,1500,40,K1.ink,'d','center')}
  ];

  const DUR=45.411125,B=[0,7,15,22,30,39.4,DUR],CUES=[[0.03, 1.65, [["Banyak", 0.08], ["developer", 0.56], ["mengira", 1.22]]], [1.71, 3.85, [["bahwa", 1.76], ["membangun", 2.102], ["sistem", 2.64], ["microservice", 3.031], ["RAG", 3.716]]], [3.91, 5.142, [["butuh", 3.96], ["sewa", 4.283], ["server", 4.56], ["cloud", 4.929]]], [5.202, 6.36, [["puluhan", 5.252], ["juta", 5.668], ["rupiah.", 5.945]]], [7.25, 7.822, [["Padahal,", 7.3]]], [7.882, 10.097, [["VPS", 7.932], ["Linux", 8.248], ["murah", 8.69], ["berkapasitas", 9.132], ["4", 10.017]]], [10.157, 11.55, [["GB", 10.207], ["RAM", 10.459], ["dan", 10.775], ["2", 11.091], ["vCPU", 11.281]]], [11.61, 12.979, [["sudah", 11.66], ["sangat", 11.93], ["tangguh", 12.239], ["kalau", 12.587], ["kamu", 12.858]]], [13.039, 14.48, [["tahu", 13.089], ["cara", 13.321], ["mengatur", 13.553], ["anggarannya.", 13.939]]], [15.43, 16.888, [["Kesalahan", 15.48], ["paling", 15.908], ["fatal", 16.219], ["yang", 16.492], ["bikin", 16.725]]], [16.948, 18.25, [["server", 16.998], ["4", 17.309], ["giga", 17.426], ["langsung", 17.659], ["lumpuh", 18.049]]], [18.31, 20.072, [["adalah", 18.36], ["memaksakan", 18.684], ["model", 19.17], ["embedding", 19.453], ["lokal", 19.898]]], [20.132, 21.99, [["jalan", 20.182], ["satu", 20.465], ["atap", 20.708], ["dengan", 20.951], ["database.", 21.275]]], [22.05, 23.29, [["Bayangkan,", 22.1]]], [23.35, 24.384, [["menyalakan", 23.4], ["AC,", 23.947], ["oven,", 24.175]]], [24.444, 25.706, [["dan", 24.494], ["setrika", 24.722], ["bersamaan", 25.132], ["di", 25.633]]], [25.766, 27.49, [["rumah", 25.816], ["berdaya", 26.135], ["listrik", 26.545], ["kecil.", 26.955]]], [27.55, 29.48, [["Sekring", 27.6], ["pasti", 28.083], ["langsung", 28.459], ["jepret.", 28.997]]], [30.35, 32.666, [["Model", 30.4], ["seperti", 30.826], ["BGE-M3", 31.375], ["itu", 31.862], ["merampas", 32.167]]], [32.726, 34.36, [["2,2", 32.776], ["GB", 33.081], ["RAM", 33.324], ["sendirian.", 33.629]]], [35.35, 36.288, [["Begitu", 35.4], ["PostgreSQL", 35.696], ["mulai", 36.14]]], [36.348, 37.25, [["merakit", 36.398], ["indeks", 36.731], ["vektor,", 37.027]]], [37.31, 39.27, [["RAM", 37.36], ["langsung", 37.697], ["tembus", 38.37], ["100%,", 38.909]]], [39.33, 40.653, [["dan", 39.38], ["fitur", 39.618], ["OOM", 39.952], ["Killer", 40.191], ["di", 40.572]]], [40.713, 42.655, [["Linux", 40.763], ["akan", 41.096], ["menembak", 41.383], ["mati", 41.859], ["database-mu", 42.145]]], [42.715, 43.752, [["dengan", 42.765], ["pesan", 43.147], ["horor:", 43.48]]], [43.812, 44.72 + 1.8, [["Exit", 43.862], ["Code", 44.148], ["137.", 44.434]]]];
  const ZC=[[540,960],[540,960],[540,960],[540,960],[540,960],[540,960]];
  const KC=[K1.am,K1.te,K1.pe,K1.am,K1.te,K1.am],DC=[K1.cr,K1.cr,K1.cr,K1.cr,K1.cr,K1.cr],TC=[K1.iv,K1.iv,K1.iv,K1.iv,K1.iv,K1.iv],AC=[K1.am,K1.te,K1.pe,K1.am,K1.te,K1.am],DG=new Set(['jepret','fatal','lumpuh','oom','killer','exit','code','137','merampas','menembak','mati','horor','tembus']),TK=new Set(['gb','mb','vcpu','ram','bge-m3','postgresql','embedding','database','database-mu','sekring','indeks','vektor','server','cloud','microservice','rag','container','linux']);
  const bo=x=>1+2.4*Math.pow(x-1,3)+1.4*Math.pow(x-1,2),LY={},KF='800 %px "Bricolage Grotesque",sans-serif';
  function lay(k){if(LY[k])return LY[k];let z=68;const ws=CUES[k][2],m=(s,z)=>{X.font=KF.replace('%',z);return X.measureText(s).width},cls=w=>{const n=w.toLowerCase().replace(/[.,:?!]+$/,'');return DG.has(n)?1:(TK.has(n)||/[\d_]/.test(n))?2:0};
  const tot=z=>ws.reduce((a,[w])=>a+m(w,z)+0,0)+(ws.length-1)*z*.28;while(tot(z)>900&&z>40)z-=2;
  let x=540-tot(z)/2;const items=ws.map(([w])=>{const kk=cls(w),wi=m(w,z)+0,it={s:w,x:x+wi/2,w:wi,k:kk};x+=wi+z*.28;return it});return LY[k]={z,items}}
  function kin(t,i){if(!SUBS)return;CUES.forEach((ch,k)=>{const bEnd = i===5 ? DUR+2.5 : B[i+1]; if(t<ch[0]||t>=ch[1]+.05||ch[0]<B[i]-.1||ch[0]>=bEnd)return;const L=lay(k),y=1700,pe=eo(seg(t,ch[1]-.18,ch[1])),pr=seg(t,ch[0]+.05,ch[1]-.18),t0=ch[0]+.05,ac=AC[i];
  const f=L.items[0],l=L.items[L.items.length-1],x0=f.x-f.w/2,w=l.x+l.w/2-x0;
  c=X;c.save();c.globalAlpha=1-pe;c.translate(0,-pe*46);
  L.items.forEach((it,n)=>{const p=seg(t,t0+n*.07,t0+n*.07+.26);if(p<=0)return;const st=n%4,e=eo(p);let dx=0,dy=0,sc=1;if(st==0)dy=(1-e)*40;else if(st==1)dy=-(1-e)*40;else if(st==2)dx=-(1-e)*70;else sc=.5+.5*bo(p);
  c.save();c.globalAlpha*=cl(p*2);c.translate(it.x+dx,y+dy);c.scale(sc,sc);
  c.font=KF.replace('%',L.z);c.fillStyle=it.k==1?DC[i]:it.k==2?KC[i]:TC[i];c.textAlign='center';c.textBaseline='alphabetic';c.fillText(it.s,0,0);c.restore()});
  c.save();c.globalAlpha*=.24;c.fillStyle=TC[i];c.beginPath();c.roundRect(x0,y+30,w,8,4);c.fill();c.restore();
  c.fillStyle=ac==K1.ink?K1.am:ac;c.beginPath();c.roundRect(x0,y+30,Math.max(.1,w*pr),8,4);c.fill();c.restore()})}

  function drawScene(i,u,subT){c=X;U=u;ANIM=true;cnt=0;DL=DLS[i];const d=B[i+1]-B[i],z=1+.06*Math.sin(Math.PI*cl(u/d));
  c.save();c.translate(ZC[i][0],ZC[i][1]);c.scale(z,z);c.translate(-ZC[i][0],-ZC[i][1]);
  if(i==5&&u>SH&&u<SH+.6)c.translate(Math.sin(u*110)*9*(1-seg(u,SH,SH+.6)),0);
  drawThemeBg(c,W,H);c.save();c.translate(43.2,36);c.scale(.92,.92);S[i]();c.restore();
  kin(subT!==undefined?subT:(B[i]+u),i);if(i==5&&u>SH){c.globalAlpha=.2*(1-seg(u,SH,SH+.5));c.fillStyle=K1.cr;c.fillRect(-100,-100,W+200,H+200)}c.restore();c.globalAlpha=1}

  function tp(k,p){c.beginPath();if(k==1||k==4){c.arc(540,960,p*1700,0,7)}
  else if(k==2||k==5){const a=Math.sin(Math.PI*p)*70;if(k==2){c.moveTo(0,H);for(let x=0;x<=W;x+=20)c.lineTo(x,(H+160)*(1-p)-80+Math.sin(x/90+p*6)*a);c.lineTo(W,H)}else{c.moveTo(0,0);for(let x=0;x<=W;x+=20)c.lineTo(x,(H+160)*p-80+Math.sin(x/90+p*6)*a);c.lineTo(W,0)}c.closePath()}
  else{const a=-700+p*2100;c.moveTo(-1500,-100);c.lineTo(a+700,-100);c.lineTo(a,H+100);c.lineTo(-1500,H+100);c.closePath()}}

  function renderAt(localT, voDur, showSub) {
    SUBS = showSub;
    const scale = DUR / (voDur || DUR);
    const tStruct = cl(Math.min(localT, (voDur || DUR) - 0.0005) * scale, 0, DUR - 0.0001);
    const tSub = localT < (voDur || DUR) ? tStruct : (DUR + (localT - (voDur || DUR)));
    const i = B.findIndex((b,k)=>tStruct>=b&&tStruct<B[k+1]), u = tStruct - B[i];
    c = X; X.setTransform(1,0,0,1,0,0);
    if(i>0&&u<.5){const p=eo(u/.5);drawScene(i-1,B[i]-B[i-1]+u);c=X;c.save();tp(i,p);c.clip();drawScene(i,u,tSub);c=X;c.restore();tp(i,p);c.strokeStyle=K1.am;c.lineWidth=18*Math.sin(Math.PI*p)+2;c.stroke()}
    else drawScene(i,u,tSub);
  }

  const NB=x=>x._n1||(x._n1=(()=>{const b=x.createBuffer(1,x.sampleRate,x.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return b})());
  function env(x,o,t,a,d,g){const n=x.createGain();n.gain.setValueAtTime(0,t);n.gain.linearRampToValueAtTime(g,t+a);n.gain.exponentialRampToValueAtTime(.0001,t+d);n.connect(o);return n}
  function osc(x,o,t,ty,f0,f1,d,g){const s=x.createOscillator();s.type=ty;s.frequency.setValueAtTime(f0,t);s.frequency.exponentialRampToValueAtTime(f1,t+d);s.connect(env(x,o,t,.005,d,g));s.start(t);s.stop(t+d+.05)}
  function nz(x,o,t,d,f0,f1,g,ty){const s=x.createBufferSource();s.buffer=NB(x);const f=x.createBiquadFilter();f.type=ty||'bandpass';f.frequency.setValueAtTime(f0,t);f.frequency.exponentialRampToValueAtTime(f1,t+d);s.connect(f);f.connect(env(x,o,t,d*.3,d,g));s.start(t);s.stop(t+d+.05)}
  function ev(x,o,t,k,a){const O=(ty,f0,f1,d,g,dt)=>osc(x,o,t+(dt||0),ty,f0,f1,d,g),N=(d,f0,f1,g,ty,dt)=>nz(x,o,t+(dt||0),d,f0,f1,g,ty);
  switch(k){
  case'wh':N(.45,280,2200,.32);break;
  case'wave':N(.55,240,1900,.35,'lowpass');break;
  case'swipe':N(.28,4200,900,.32);break;
  case'ting':O('sine',1320,1315,.22,.08);break;
  case'pop':O('sine',520*Math.pow(1.05,a||0),840*Math.pow(1.05,a||0),.12,.16);break;
  case'type':O('sine',680,920,.14,.12);break;
  case'slash':O('sine',150,65,.18,.22);break;
  case'ding':O('sine',1046.5,1045,.45,.14);break;
  case'blip':O('triangle',500*Math.pow(2,a/12),520*Math.pow(2,a/12),.12,.18);break;
  case'knock':O('sine',220,90,.14,.45);N(.08,900,200,.22,'lowpass');break;
  case'th':O('sine',140,40,.28,.55);N(.18,800,200,.28,'lowpass');break;
  case'slam':O('sine',90,30,.45,.75);N(.3,500,100,.5,'lowpass');break;
  case'crack':for(let j=0;j<3;j++)N(.04,4200,2200,.25,'highpass',j*.08);break;
  case'hum':O('sine',100,100.5,.6,.22);O('sine',200,200.5,.6,.08);break;
  case'hiss':N(.5,3800,3400,.2,'highpass');break;
  case'click':O('sine',1400,1200,.04,.12);break;
  case'clack':O('triangle',800,450,.06,.18);N(.05,1800,500,.14);break;
  case'zap':O('triangle',1400,80,.24,.2);N(.2,1800,300,.28);break;
  case'err':O('sawtooth',110,108,.45,.14);O('sawtooth',117,115,.45,.14);break;
  case'rise':N(1.2,380,2200,.22);break;
  case'alarm':for(let j=0;j<4;j++)O('triangle',j%2?660:880,j%2?655:875,.14,.11,j*.22);break;
  case'lock':for(let j=0;j<2;j++)O('sine',1200,1200.5,.06,.15,j*.14);O('sine',1200,1200.5,.3,.16,.32);break;
  case'power':O('sine',180,780,.4,.22);N(.25,200,1600,.18);break;
  case'tk':O('sine',1200*(1+a*.04),1200*(1+a*.04)+1,.035,.12);break;
  case'tap':O('sine',760,480,.05,.06);break;
  case'chime':[523,659,784,1047].forEach((f,j)=>O('sine',f,f*.999,1.2,.15,j*.08))}}
  function mkSfx(){const A=(t,k,a)=>SFX.push([t,k,a]),Q=(k,i)=>B[i]+MK[k]*DLS[i]+.08;
  [['wh',1],['wave',2],['swipe',3],['wh',4],['wave',5]].forEach(([k,i])=>{A(B[i]-.02,k)});
  [1,2,3,4].forEach(i=>A(B[i]+.35,'pop',i*2));
  // Intro Scene 1 ("Bikin Sistem RAG di VPS 4 GB..."): satu efek pop lembut saat judul muncul, tanpa rentetan beep
  A(B[0]+DLS[0],'type');
  A(Q('s1vps',0),'pop',3);A(Q('s1chk',0),'ding');
  A(Q('s2roof',1),'th');for(let k=0;k<5;k++){A(Q('s2room'+k,1),'knock')}
  A(Q('s3blk',2),'slam');A(Q('s3crack',2),'crack');for(let j=0;j<3;j++)A(Q('s3push',2)+j*.12,'knock');
  A(Q('s4ac',3),'hum');A(Q('s4oven',3),'ding');A(Q('s4iron',3),'hiss');A(Q('s4box',3),'click');A(Q('s4sw2',3),'clack');A(Q('s4spark',3),'zap');
  A(B[4]+.3,'rise');for(let t=3.2;t<6.5;t+=.18)A(B[4]+t,'tk',(t-3.2)/3.3*8);A(B[4]+6.5,'alarm');A(Q('s5panel',4),'th');
  for(let j=0;j<22;j+=2)A(Q('s5nodes',4)+j*DLS[4],'blip',[0,2,4,7,9][j%5]+(j/5|0)*2);
  A(Q('s6term',5),'power');SH=Q('s6kill',5)-B[5];A(B[5]+SH,'th');A(B[5]+SH,'alarm');A(Q('s6ret',5),'lock');A(Q('s6amb',5),'ding');A(43.4,'chime');
  CUES.forEach((ch,idx)=>{if(idx>0)A(ch[0]+.02,'tap')})}

  CNTP=true;const sc=document.createElement('canvas').getContext('2d');c=sc;S.forEach((f,i)=>{U=99;ANIM=true;DL=.1;cnt=0;f();DLS[i]=Math.min(.11,(B[i+1]-B[i])*.6/cnt)});CNTP=false;c=X;mkSfx();

  function scheduleSfx(ctx, dest, startTime, offset, maxDur) {
    const sg = ctx.createGain(); sg.gain.value = 0.4; sg.connect(dest);
    SFX.forEach(([t, k, a]) => {
      if (t >= offset && t < maxDur) ev(ctx, sg, startTime + (t - offset), k, a);
    });
  }
  function getCues() {
    return CUES.map(ch => [ch[0], ch[1], ch[2].map(w => w[0]).join(' ')]);
  }
  return { render: renderAt, scheduleSfx, getCues, refDur: DUR };
}

// ============================================================================
// SCENE 2: ARSITEKTUR PEMISAHAN BEBAN AI GATEWAY VS 5 KONTAINER DATA
// ============================================================================
function createScene2(cv) {
  const c = cv.getContext('2d');
  const D = 37.049, B = [0, 5, 11.6, 19.2, 28.3, 37.049];
  const C = { ink: K.ink, ink3: K.surf, iv: K.iv, cob: K.cob, tea: K.teal, cor: K.cor, amb: K.amb, per: K.peri, sla: K.sl, sand: K.surf };
  const BG = "'Bricolage Grotesque',Inter,sans-serif", MO = "'JetBrains Mono',monospace", IN = "Inter,sans-serif";
  const COL = [C.amb, C.cob, C.tea, C.cor, C.per], LAB = ['Reverse Proxy', 'Next.js UI', 'Express.js API & Worker', 'Redis Cache & Queue', 'PostgreSQL pgvector'], SH = ['Proxy', 'Next.js', 'Express', 'Redis', 'pgvector'];
  const CH = [[0.62, 2.808, "Lalu, bagaimana arsitektur yang benar", [0.62, 0.966, 1.541, 2.175, 2.463]], [2.808, 4.41, "untuk VPS 4 GB RAM?", [2.808, 3.154, 3.384, 3.499, 3.672]], [5.39, 7.4, "Rahasianya adalah", [5.39, 6.722]], [7.4, 8.953, "memisahkan beban komputasi model AI", [7.4, 7.874, 8.133, 8.564, 8.823]], [8.953, 10.61, "dari beban orkestrasi data.", [8.953, 9.168, 9.427, 9.901]], [11.75, 13.431, "Kita keluarkan proses pembuatan", [11.75, 12.013, 12.538, 12.906]], [13.431, 15.1, "vektor embedding dan penalaran LLM", [13.431, 13.799, 14.324, 14.534, 15.06]], [15.1, 16.233, "dari dalam VPS menuju", [15.1, 15.358, 15.667, 15.873]], [16.233, 18.28, "layanan API Gateway eksternal.", [16.233, 16.645, 16.851, 17.263]], [19.35, 20.795, "Dengan begitu, seluruh", [19.35, 19.79, 20.292]], [20.795, 22.366, "kapasitas CPU dan memori", [20.795, 21.424, 21.675, 21.926]], [22.366, 22.95, "di VPS kita", [22.366, 22.555, 22.806]], [22.95, 24.083, "bisa difokuskan 100%", [22.95, 23.22, 23.814]], [24.083, 25.703, "untuk menjalankan 5 kontainer", [24.083, 24.407, 25.055, 25.163]], [25.703, 27.88, "microservice secara terisolasi.", [25.703, 26.404, 26.782]], [28.4, 30.15, "Mulai dari reverse proxy,", [28.4, 28.841, 29.208, 29.796]], [30.15, 31.9, "antarmuka Next.js,", [30.15, 31.15]], [31.93, 33.8, "orkestrator Express.js,", [31.93, 32.95]], [33.8, 34.533, "memori Redis,", [33.8, 34.166]], [34.533, 36.92 + 1.8, "hingga database PostgreSQL pgvector.", [34.533, 34.899, 35.371, 35.946]]];
  const KW = /vps|gb|^ram|^ai$|embedding|llm|api|gateway|100%|cpu|memori|kontainer|microservice|redis|next\.js|express\.js|postgresql|pgvector|proxy|data|orkestrasi|terisolasi|eksternal|beban|rahasianya|arsitektur/i;
  let SUB = true;
  const seg = (u,a,b)=>cl((u-a)/(b-a)), ebo = x=>1+2.4*Math.pow(x-1,3)+1.4*Math.pow(x-1,2), lr = (a,b,t)=>a+(b-a)*t;
  const hx = h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)), mc = (a,b,t)=>'rgb('+hx(a).map((v,i)=>Math.round(lr(v,hx(b)[i],t))).join()+')';
  function rr(x,y,w,h,r,f,s,lw){c.beginPath();c.roundRect(x,y,w,Math.max(0,h),r,0);if(f){c.fillStyle=f;c.fill()}if(s){c.strokeStyle=s;c.lineWidth=lw||6;c.lineCap='round';c.stroke()}}
  function tx(s,x,y,z,col,w,al,f){c.font=`${w||600} ${z}px ${f||IN}`;c.fillStyle=col;c.textAlign=al||'left';c.textBaseline='alphabetic';c.fillText(s,x,y)}
  function mw(s,z,w,f){c.font=`${w} ${z}px ${f}`;return c.measureText(s).width}
  function line(x1,y1,x2,y2,col,lw,dash){c.save();c.strokeStyle=col;c.lineWidth=lw;c.lineCap='round';if(dash)c.setLineDash(dash);c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();c.restore()}
  function tri(x,y,d,col,s=18){c.fillStyle=col;c.beginPath();c.moveTo(x,y+d*s);c.lineTo(x-s,y-d*s*.4);c.lineTo(x+s,y-d*s*.4);c.closePath();c.fill()}
  function pop(cx,cy,p,fn){if(p<=0)return;c.save();c.translate(cx,cy);const s=ebo(p);c.scale(s,s);c.translate(-cx,-cy);fn();c.restore()}
  function A(a,fn){if(a<=0)return;c.save();c.globalAlpha=cl(a);fn();c.restore()}
  function sl(p,fn,dy=80){if(p<=0)return;c.save();c.globalAlpha=cl(p*1.5);c.translate(0,(1-eo(p))*dy);fn();c.restore()}
  function rtx(s,x,y,z,col,w,al,f,p){if(p<=0)return;c.save();c.beginPath();c.rect(0,y-z*1.05,W,z*1.45);c.clip();c.translate(0,(1-eo(p))*z*1.2);tx(s,x,y,z,col,w,al,f);c.restore()}
  function ty(s,x,y,z,col,w,f,u,u0,rate){const n=Math.min(s.length,Math.floor(Math.max(0,u-u0)*rate));if(n<=0)return;tx(s.slice(0,n),x,y,z,col,w,'left',f);if(n<s.length){const m=c.measureText(s.slice(0,n)).width;rr(x+m+6,y-z*.8,6,z*.9,3,col)}}
  function kin(t,y,fg,kw,ul){if(!SUB)return;const k=CH.find(q=>t>=q[0]&&t<q[1]);if(!k)return;const V=k[2].split(' ');let z=100;
   const me=()=>{c.font=`800 ${z}px ${BG}`;return V.map(w=>c.measureText(w).width)};let m=me(),sp=z*.26,tot=m.reduce((a,b)=>a+b,0)+sp*(m.length-1);
   if(tot>900){z=Math.floor(z*900/tot);m=me();sp=z*.26;tot=m.reduce((a,b)=>a+b,0)+sp*(m.length-1)}
   const out=seg(t,k[1]-.18,k[1]);let x=540-tot/2;const x0=x;
   V.forEach((w,i)=>{const p=seg(t,k[3][i],k[3][i]+.3);if(p>0){c.save();c.beginPath();c.rect(0,y-z*1.1,W,z*1.55);c.clip();const s=.85+.15*ebo(p);c.translate(x+m[i]/2,y);c.globalAlpha=cl(p*2)*(1-out);c.translate(0,(1-eo(p))*z*.9-eo(out)*z*.7);c.scale(s,s);tx(w,0,0,z,KW.test(w)?kw:fg,800,'center',BG);c.restore()}x+=m[i]+sp});
   const pr=seg(t,k[0],k[1]-.18);if(pr>0)A(1-out,()=>line(x0,y+34,x0+tot*pr,y+34,ul||kw,10))}
  function ico(k,x,y,s,col){c.save();c.translate(x,y);c.strokeStyle=col;c.fillStyle=col;c.lineWidth=s*.09;c.lineCap='round';c.lineJoin='round';
   if(k==0){c.beginPath();c.moveTo(-s/2,-s*.18);c.lineTo(s/2,-s*.18);c.lineTo(s*.2,-s*.42);c.moveTo(s/2,s*.18);c.lineTo(-s/2,s*.18);c.lineTo(-s*.2,s*.42);c.stroke()}
   if(k==1){c.beginPath();c.roundRect(-s/2,-s/2,s,s,s*.2);c.stroke();tx('N',0,s*.25,s*.7,col,800,'center',BG)}
   if(k==2){c.beginPath();c.arc(0,0,s*.28,0,7);c.stroke();for(let i=0;i<8;i++){const a=i*Math.PI/4;c.beginPath();c.moveTo(Math.cos(a)*s*.38,Math.sin(a)*s*.38);c.lineTo(Math.cos(a)*s*.55,Math.sin(a)*s*.55);c.stroke()}}
   if(k==3){for(let i=0;i<3;i++){c.beginPath();c.roundRect(-s/2,-s*.5+i*s*.36,s,s*.26,s*.1);i?c.stroke():c.fill()}}
   if(k==4){c.beginPath();c.ellipse(0,-s*.32,s*.4,s*.16,0,0,7);c.stroke();c.beginPath();c.moveTo(-s*.4,-s*.32);c.lineTo(-s*.4,s*.32);c.moveTo(s*.4,-s*.32);c.lineTo(s*.4,s*.32);c.stroke();c.beginPath();c.ellipse(0,s*.32,s*.4,s*.16,0,0,Math.PI);c.stroke()}
   c.restore()}
  function card(x,y,w,h,i,bg,fg,lab){rr(x,y,w,h,28,bg);rr(x+16,y+h/2-36,72,72,22,COL[i]);ico(i,x+52,y+h/2,40,C.ink);tx(lab,x+110,y+h/2+10,28,fg,700,'left',MO)}
  function head(n,t,s,col,fg){c.beginPath();c.arc(100,120,44,0,7);c.fillStyle=col;c.fill();tx(String(n),100,140,52,col==C.ink?C.iv:C.ink,800,'center',BG);tx(t,170,128,44,fg,800,'left',BG);tx(s,170,168,24,C.sla,500,'left',MO)}
  // Symmetric dual spines at x=42 and x=1038
  function spine(i){[42,1038].forEach(sx=>{line(sx,200,sx,1560,C.sla,4,[2,14]);for(let k=0;k<5;k++){c.beginPath();c.arc(sx,200+k*340,k==i?14:7,0,7);c.fillStyle=k==i?C.amb:C.sla;c.fill()}})}
  function vps(x,y,w,h,fill,fg,lab){rr(x,y,w,h,44,fill,fg,6);tx(lab,x+36,y+60,28,fg,700,'left',MO)}
  function open(bg,i){drawThemeBg(c,W,H);spine(i);c.translate(43.2,36);c.scale(.92,.92)}

  const S = [
    (u,subT)=>{c.save();open(C.ink,0);
     A(seg(u,.1,.5),()=>head(1,'Masalah','VPS 4 GB · 5 layanan RAG',C.cob,C.iv));
     ty('Arsitektur yang benar',90,330,92,C.iv,800,BG,u,.67,20);
     ty('untuk VPS ',90,430,92,C.iv,800,BG,u,1.75,16);const w=mw('untuk VPS ',92,800,BG);ty('4 GB?',90+w,430,92,C.amb,800,BG,u,2.4,10);kin(subT,1790,C.iv,C.amb);
     sl(seg(u,1,1.7),()=>vps(90,600,900,1000,C.ink3,C.iv,'VPS · 4 GB RAM · 2 vCPU'),90);
     // 4 RAM sub-bars centered inside 90..990: x = 135 + i*210, w = 180 -> 135..945 (exact center 540!)
     A(seg(u,1.7,2.1),()=>{for(let i=0;i<4;i++){rr(135+i*210,680,180,46,14,C.ink);const f=seg(u,3+i*.25,3.4+i*.25);if(f>0)rr(135+i*210,680,180*f,46,14,i<3?C.cob:C.cor)}tx(u>3.9?'RAM penuh':'RAM terisi',135,770,22,u>3.9?C.cor:C.per,700,'left',MO)});
     for(let i=0;i<5;i++)pop(390,868+i*120,seg(u,1.5+i*.2,1.9+i*.2),()=>card(130,820+i*120,520,96,i,C.ink,C.iv,LAB[i]));
     [['BGE-M3',860],['GLM-4',1010],['Claude',1160]].forEach(([t,y],i)=>{const p=eo(seg(u,2.6+i*.25,3.2+i*.25));if(p<=0)return;const sh=u>3.8?Math.sin(u*45+i)*3:0;c.save();c.translate(lr(1150,670,p)+sh,0);rr(0,y,280,120,36,C.cor);tx(t,140,y+75,38,C.ink,800,'center',BG);c.restore()});
     pop(930,600,seg(u,3.6,4.0),()=>{c.beginPath();c.arc(930,600,56,0,7);c.fillStyle=C.amb;c.fill();tx('?',930,632,88,C.ink,800,'center',BG)});
     pop(540,1478,seg(u,4.2,4.6),()=>{rr(250,1440,580,76,38,C.cor);tx('OOM Killer · Exit Code 137',540,1490,28,C.ink,700,'center',MO)});
     c.restore()},

    (u,subT)=>{c.save();open(C.iv,1);
     A(seg(u,0,.4),()=>head(2,'Rahasia','Pisahkan dua jenis beban',C.cor,C.iv));
     rtx('Pisahkan beban',540,330,100,C.iv,800,'center',BG,seg(u,.3,.9));
     rtx('model AI dari data',540,430,100,C.amb,800,'center',BG,seg(u,2.45,3.1));kin(subT,1790,C.iv,C.amb);
     const e=eio(seg(u,1.8,3.2)),lx=lr(250,70,e),rx=lr(390,570,e);
     A(seg(u,.4,.9),()=>rr(rx,560,440,820,44,C.tea));A(seg(u,.4,.9),()=>rr(lx,560,440,820,44,C.cor));
     const lc=seg(u,2.9,3.5);A(lc,()=>{c.save();c.translate(lx-70,0);rr(190,660,200,200,36,C.iv);rr(228,698,124,124,22,C.ink);tx('AI',290,780,56,C.amb,800,'center',BG);for(let i=0;i<4;i++){line(222+i*52,640,222+i*52,660,C.iv,8);line(222+i*52,860,222+i*52,880,C.iv,8)}tx('Komputasi model AI',290,980,32,C.ink,800,'center',BG);tx('embedding',290,1040,26,C.ink,700,'center',MO);tx('penalaran LLM',290,1080,26,C.ink,700,'center',MO);tx('BERAT',290,1300,64,C.ink,800,'center',BG);c.restore()});
     c.save();c.translate(rx-570,0);for(let i=0;i<5;i++){const p=eo(seg(u,3.1+i*.12,3.6+i*.12));A(p,()=>{rr(620+(1-p)*60,610+i*90,340,60,20,C.iv);rr(634+(1-p)*60,624+i*90,32,32,10,COL[i])})}A(seg(u,3.4,3.9),()=>{tx('Orkestrasi data',790,1130,32,C.ink,800,'center',BG);tx('5 kontainer',790,1190,26,C.ink,700,'center',MO);tx('RINGAN',790,1300,64,C.ink,800,'center',BG)});c.restore();
     const g=eo(seg(u,.6,1.6));if(g>0)line(540,520,540,520+900*g,C.amb,10,[4,22]);
     pop(540,970,seg(u,1.5,1.9),()=>{c.beginPath();c.arc(540,970,44,0,7);c.fillStyle=C.amb;c.fill();line(522,952,558,988,C.ink,8);line(558,952,522,988,C.ink,8)});
     pop(540,1500,seg(u,4.6,5.1),()=>{rr(190,1460,700,80,40,C.ink,C.ink3,4);tx('Beban AI ≠ beban data',540,1514,34,C.iv,700,'center',MO)});
     c.restore()},

    (u,subT)=>{c.save();open(C.per,2);
     A(seg(u,0,.4),()=>head(3,'Eksternalisasi','Vektor embedding & penalaran LLM',C.amb,C.iv));
     rtx('Beban model keluar',540,320,86,C.iv,800,'center',BG,seg(u,.3,.9));rtx('dari dalam VPS',540,410,86,C.amb,800,'center',BG,seg(u,.6,1.2));kin(subT,1790,C.iv,C.amb,C.amb);
     vps(60,1120,960,440,C.ink3,C.iv,'VPS · 4 GB · 2 vCPU');
     SH.forEach((t,i)=>{const x=100+i*180;pop(x+80,1350,seg(u,.3+i*.12,.7+i*.12),()=>{rr(x,1200,160,300,30,C.ink);rr(x+30,1220,100,100,28,COL[i]);ico(i,x+80,1270,56,C.ink);tx(t,x+80,1440,22,C.iv,700,'center',MO)})});
     const gp=eo(seg(u,2.0,2.7));if(gp>0){c.save();c.globalAlpha=gp;c.translate(0,(1-gp)*-60);rr(60,480,960,420,44,C.ink,C.ink3,5);tx('AI API Gateway',100,550,46,C.iv,800,'left',BG);tx('mis. 9Router · di luar VPS',100,590,24,C.amb,700,'left',MO);c.restore()}
     [['BGE-M3','embedding',C.tea],['GLM-4-Flash','contextualizer',C.cob],['Claude 3.5','Sonnet · reasoning',C.cor]].forEach(([a,b,col],i)=>{const t=eio(seg(u,1.2+i*.25,2.9+i*.25));if(t<=0)return;const x0=140+i*300,x=lr(x0,100+i*300,t),y=lr(1170,640,t)-Math.sin(Math.PI*t)*40,w=lr(200,280,t),h=lr(70,200,t),tc=col==C.tea?C.ink:C.iv;rr(x,y,w,h,lr(28,34,t),mc(C.cor,col,t));A(seg(t,.6,1),()=>{tx(a,x+w/2,y+h/2+4,a.length>10?32:38,tc,800,'center',BG);tx(b,x+w/2,y+h/2+54,21,tc,700,'center',MO)});A(1-seg(t,0,.3),()=>tx('AI',x+w/2,y+h/2+10,28,C.ink,800,'center',BG))});
     [240,540,840].forEach((x,i)=>{const p=eo(seg(u,3.6+i*.15,4.2+i*.15));if(p<=0)return;line(x,920,x,920+170*p,C.amb,8,[16,14]);if(p>.9){tri(x,1100,1,C.amb);tri(x,910,-1,C.amb)}if(u>4.4){const q=((u*.7+i*.33)%1);c.beginPath();c.arc(x,lr(930,1090,q),10,0,7);c.fillStyle=C.iv;c.fill();c.beginPath();c.arc(x,lr(1090,930,(q+.5)%1),10,0,7);c.fillStyle=C.cob;c.fill()}});
     pop(540,992,seg(u,4.0,4.5),()=>{rr(300,960,480,64,32,C.ink,C.ink3,4);tx('koneksi cepat · API',540,1004,26,C.iv,700,'center',MO)});
     pop(850,1172,seg(u,3.6,4.0),()=>{rr(720,1140,260,48,24,C.tea);tx('RAM lega',850,1172,22,C.ink,700,'center',MO)});
     c.restore()},

    (u,subT)=>{c.save();open(C.ink,3);
     A(seg(u,0,.4),()=>head(4,'Fokus penuh','Kapasitas VPS hanya untuk data',C.tea,C.iv));kin(subT,1790,C.iv,C.amb);
     tx(Math.round(100*eo(seg(u,.3,2.0)))+'%',540,560,300,C.amb,800,'center',BG);rtx('CPU & RAM untuk orkestrasi',540,650,38,C.iv,800,'center',BG,seg(u,1.9,2.5));
     const rg=eio(seg(u,1.2,3.2));[[290,'2 vCPU','CPU'],[790,'4 GB','RAM']].forEach(([x,a,b])=>{if(rg<=0)return;c.beginPath();c.arc(x,930,150,0,7);c.strokeStyle=C.ink3;c.lineWidth=40;c.stroke();c.beginPath();c.arc(x,930,150,-Math.PI/2,-Math.PI/2+Math.PI*2*rg);c.strokeStyle=C.tea;c.lineWidth=40;c.lineCap='round';c.stroke();pop(x,930,seg(u,2.8,3.3),()=>{tx(a,x,950,44,C.iv,800,'center',BG);tx(b,x,1150,28,C.per,700,'center',MO)})});
     pop(540,1250,seg(u,5.0,5.5),()=>{rr(130,1220,820,60,30,C.amb);tx('5 kontainer · terisolasi',540,1261,28,C.ink,700,'center',MO)});
     // Symmetric 5 bottom containers: x = 75 + i*190, w = 170 -> 75..1005 (exact center 540!)
     for(let i=0;i<5;i++){const x=75+i*190;pop(x+85,1450,seg(u,5.4+i*.3,5.9+i*.3),()=>{rr(x,1320,170,260,28,C.ink3);c.save();c.setLineDash([10,10]);c.lineDashOffset=-u*20;rr(x-6,1314,182,272,32,0,COL[i],4);c.restore();rr(x+35,1360,100,100,26,COL[i]);ico(i,x+85,1410,56,C.ink);tx(SH[i],x+85,1520,22,C.iv,700,'center',MO)})}
     c.restore()},

    (u,subT)=>{c.save();open(C.iv,4);
     A(seg(u,0,.4),()=>head(5,'Ringkasan','Topologi akhir: 1 gateway + 5 kontainer',C.cob,C.iv));kin(subT,1790,C.iv,C.amb);
     sl(seg(u,0,.6),()=>{rr(90,230,900,150,36,C.ink,C.ink3,4);tx('AI API Gateway (mis. 9Router)',540,300,34,C.iv,800,'center',BG);tx('BGE-M3 · GLM-4-Flash · Claude 3.5 Sonnet',540,346,22,C.amb,700,'center',MO);line(540,395,540,470,C.amb,8,[14,12]);tri(540,480,1,C.amb)},-60);
     sl(seg(u,.1,.7),()=>vps(90,500,900,790,C.ink3,C.iv,'VPS · 4 GB RAM · 2 vCPU'),70);
     const T=[.15,1.9,3.65,5.7,7.0],act=u>=T[4]?4:u>=T[3]?3:u>=T[2]?2:u>=T[1]?1:0;
     for(let i=0;i<5;i++){const y=590+i*124,p=seg(u,T[i]-.15,T[i]+.35);pop(540,y+48,p,()=>{c.beginPath();c.arc(148,y+48,26,0,7);c.fillStyle=i==act?C.amb:C.ink;c.fill();tx(String(i+1),148,y+60,32,i==act?C.ink:C.iv,800,'center',BG);card(200,y,740,96,i,C.ink,C.iv,LAB[i]);if(i==act)rr(194,y-6,752,108,32,0,C.amb,6)})}
     sl(seg(u,6.8,7.4),()=>{rr(60,1340,960,250,44,C.amb);tx('Solusi Arsitektur:',540,1415,44,C.ink,800,'center',BG);tx('Lempar Beban Komputasi Model ke API Gateway,',540,1485,31,C.ink,800,'center',BG);tx('Fokuskan VPS untuk Orkestrasi Data!',540,1545,36,C.ink,800,'center',BG)},120);
     c.restore()}
  ];

  function tpath(i,p){const e=eio(p);c.beginPath();
   if(i==1||i==3)c.arc(540,960,e*2300,0,7);
   else if(i==2){const y0=lr(H+120,-120,e),a=40*Math.sin(Math.PI*p);c.moveTo(0,H);for(let x=0;x<=W;x+=30)c.lineTo(x,y0+Math.sin(x/90+p*6)*a);c.lineTo(W,H);c.closePath()}
   else{const a=e*(W+H*.5)+20;c.moveTo(0,0);c.lineTo(a,0);c.lineTo(a-H*.5,H);c.lineTo(0,H);c.closePath()}}
  function drawScene(i,u,subT){c.save();const z=1+.035*Math.sin(Math.PI*seg(u,.8,B[i+1]-B[i]));c.translate(540,960);c.scale(z,z);c.translate(-540,-960);S[i](u,subT!==undefined?subT:(B[i]+u));c.restore()}

  function renderAt(localT, voDur, showSub) {
    SUB = showSub;
    const scale = D / (voDur || D);
    const tStruct = cl(Math.min(localT, (voDur || D) - 0.0005) * scale, 0, D - 0.001);
    const tSub = localT < (voDur || D) ? tStruct : (D + (localT - (voDur || D)));
    c.setTransform(1,0,0,1,0,0);
    let i=0;while(i<4&&tStruct>=B[i+1])i++;const tr=i>0?seg(tStruct,B[i],B[i]+.5):1;
    if(tr<1){drawScene(i-1,tStruct-B[i-1],tSub);c.save();tpath(i,tr);c.clip();drawScene(i,tStruct-B[i],tSub);c.restore();c.save();tpath(i,tr);c.strokeStyle=C.amb;c.lineWidth=18*Math.sin(Math.PI*tr)+2;c.stroke();c.restore()}
    else drawScene(i,tStruct-B[i],tSub);
  }

  const SFX=[],add=(t,k,a,p)=>SFX.push([t,k,a||0,p||0]);
  CH.forEach(q=>q[3].forEach((s,i)=>add(s,'tick',i%4)));
  ['whoosh','sweepdown','whoosh','sweepdown'].forEach((k,i)=>add(B[i+1],k));add(B[3],'thump');
  add(.1,'blip',0);add(1.0,'slide');add(1.65,'thump');
  for(let i=0;i<5;i++)add(1.5+.2*i,'blip',i,-.3+.15*i);
  for(let i=0;i<3;i++)add(2.6+.25*i,'zap',i,.6);
  for(let i=0;i<4;i++)add(3+.25*i,'click',i+2);
  add(3.6,'bubble');add(3.85,'alarm');add(4.2,'err');add(4.25,'thud');
  add(5.1,'blip',2);add(5.3,'slide');add(5.6,'zip');add(6.5,'snip');add(6.58,'snip');add(6.8,'whoosh',0,-.4);add(7.45,'slide');add(7.9,'sparkle');add(8.2,'thump');
  for(let i=0;i<5;i++)add(8.1+.12*i,'blip',i,.5);add(9.6,'ding');
  add(11.7,'blip',3);add(11.9,'slide');add(12.2,'slide');
  for(let i=0;i<5;i++)add(11.9+.12*i,'blip',i,-.6+.3*i);
  for(let i=0;i<3;i++){add(12.8+.25*i,'zap',i,-.3+.3*i);add(14.5+.25*i,'blip',i+2,-.3+.3*i);add(14.5+.25*i,'click',i)}
  add(13.6,'slide');for(let i=0;i<3;i++)add(15.2+.15*i,'zip',0,-.5+.5*i);add(15.2,'sparkle');add(15.6,'ding',0);
  for(let i=0;i<5;i++)add(16+i*.7,'ping',i,i%2?.5:-.5);
  add(19.3,'blip',4);for(let i=0;i<24;i++)add(19.5+i*.07,'tick',2+i*.5);
  add(20.4,'swell',2);add(21.1,'slide');add(22.0,'sparkle');add(22.4,'ding',2);add(24.2,'bubble');
  for(let i=0;i<5;i++)add(24.6+.3*i,'latch',i,-.6+.3*i);
  add(28.3,'slide');add(28.4,'slide');add(28.35,'blip',1);
  [.15,1.9,3.65,5.7,7.0].forEach((t,i)=>{add(28.3+t,'blip',i,-.4+.2*i);add(28.3+t+.06,'ding',i)});
  add(35.1,'whoosh');add(35.45,'confirm');add(35.7,'chime');
  SFX.sort((a,b)=>a[0]-b[0]);
  const NBc=new WeakMap();
  function nbuf(x){let b=NBc.get(x);if(!b){b=x.createBuffer(1,x.sampleRate,x.sampleRate);const d=b.getChannelData(0);let s=12345;for(let i=0;i<d.length;i++){s=(s*1103515245+12345)&0x7fffffff;d[i]=s/0x3fffffff-1}NBc.set(x,b)}return b}
  function osc(x,o,w,ty,f0,f1,dur,g){const a=x.createOscillator(),y=x.createGain();a.type=ty;a.frequency.setValueAtTime(f0,w);if(f1)a.frequency.exponentialRampToValueAtTime(f1,w+dur);y.gain.setValueAtTime(g,w);y.gain.exponentialRampToValueAtTime(.0001,w+dur);a.connect(y);y.connect(o);a.start(w);a.stop(w+dur+.02)}
  function nz(x,o,w,f0,f1,dur,g){const s=x.createBufferSource(),f=x.createBiquadFilter(),y=x.createGain();s.buffer=nbuf(x);f.type='bandpass';f.Q.value=1.2;f.frequency.setValueAtTime(f0,w);f.frequency.exponentialRampToValueAtTime(f1,w+dur);y.gain.setValueAtTime(.0001,w);y.gain.linearRampToValueAtTime(g,w+dur*.4);y.gain.exponentialRampToValueAtTime(.0001,w+dur);s.connect(f);f.connect(y);y.connect(o);s.start(w,0,dur+.05)}
  function fx(x,o,w,k,a){const P=[1,1.125,1.25,1.5,1.667,2];
   if(k=='whoosh')nz(x,o,w,300,3200,.5,.35);if(k=='sweepdown')nz(x,o,w,3200,300,.5,.3);if(k=='slide')nz(x,o,w,800,2400,.28,.16);
   if(k=='zip')nz(x,o,w,600,4200,.35,.25);if(k=='rise')nz(x,o,w,400,2600,.8,.3);if(k=='swell')nz(x,o,w,200,2200,a||2,.22);
   if(k=='tick')osc(x,o,w,'square',2600*(1+.05*a),0,.025,.05);if(k=='click')osc(x,o,w,'square',1800*(1+.1*a),0,.05,.07);
   if(k=='pop'){const f=600*(1+.1*a);osc(x,o,w,'sine',f,f*1.8,.16,.3)}
   if(k=='blip'){const f=523*P[a%6];osc(x,o,w,'triangle',f,f*1.5,.14,.22);osc(x,o,w+.07,'triangle',f*1.5,f*1.5*1.01,.12,.14)}
   if(k=='bubble'){osc(x,o,w,'sine',350,1100,.12,.28);osc(x,o,w+.03,'sine',700,1800,.1,.12)}
   if(k=='zap'){osc(x,o,w,'sawtooth',1400,180,.22,.09);nz(x,o,w,2000,600,.2,.15)}
   if(k=='thump'){osc(x,o,w,'sine',90,38,.3,.7);nz(x,o,w,200,80,.2,.2)}if(k=='thud')osc(x,o,w,'sine',140,40,.25,.5);
   if(k=='snip'){nz(x,o,w,5000,7000,.06,.4)}
   if(k=='sparkle')[1319,1760,2349].forEach((f,i)=>osc(x,o,w+i*.05,'sine',f,0,.25,.1));
   if(k=='ding'){const f=1320*(1+.1*a);osc(x,o,w,'sine',f,0,.6,.18);osc(x,o,w,'sine',f*2,0,.4,.05)}
   if(k=='confirm'){osc(x,o,w,'sine',784,0,.2,.15);osc(x,o,w+.12,'sine',1047,0,.45,.15)}
   if(k=='latch'){osc(x,o,w,'square',700,400,.06,.09);osc(x,o,w+.03,'sine',160,70,.15,.35)}
   if(k=='alarm')for(let j=0;j<3;j++){osc(x,o,w+j*.22,'square',880,0,.1,.05);osc(x,o,w+j*.22+.11,'square',660,0,.1,.05)}
   if(k=='ping')osc(x,o,w,'sine',880*P[a%3==2?3:a%3],0,.35,.12);
   if(k=='err'){osc(x,o,w,'sawtooth',110,0,.35,.07);osc(x,o,w,'sawtooth',117,0,.35,.07)}
   if(k=='chime')[523,659,784,1047].forEach((f,i)=>osc(x,o,w+i*.06,'sine',f,0,.9,.12))}

  function scheduleSfx(ctx, dest, startTime, offset, maxDur) {
    const sb = ctx.createGain(); sb.gain.value = 0.5; sb.connect(dest);
    SFX.forEach(([t, k, a, p]) => {
      if (t >= offset && t < maxDur) {
        let o = sb;
        if (p && ctx.createStereoPanner) { o = ctx.createStereoPanner(); o.pan.value = p; o.connect(sb); }
        fx(ctx, o, startTime + (t - offset), k, a);
      }
    });
  }
  function getCues() {
    return CH.map(q => [q[0], q[1], q[2]]);
  }
  return { render: renderAt, scheduleSfx, getCues, refDur: D };
}

// ============================================================================
// SCENE 3: RUMUS PEMBAGIAN ANGGARAN RAM DOCKER COMPOSE (2880 MB HARD LIMIT)
// ============================================================================
function createScene3(cv) {
  
const K3={ink:K.ink,dk:K.bg,dk2:K.surf,iv:K.iv,co:K.cob,te:K.teal,cr:K.cor,am:K.amb,pe:K.peri,sl:K.sl,sa:K.surf};
const SEG=[['Reverse Proxy',64,K3.sl],['Next.js',384,K3.co],['Redis',384,K3.cr],['Express.js',512,K3.am],['PostgreSQL pgvector',1536,K3.pe]];
const HF="'Bricolage Grotesque',Inter,sans-serif",MF="'JetBrains Mono',monospace",IF="Inter,sans-serif";
const W=1080,H=1920,D=46.46,B=[0,6.2,12.85,25.15,30.45,37.3,D];
const CUES=[[.56,5.5,'Sekarang, mari kita bedah rumus pembagian anggaran RAM-nya di dalam berkas docker-compose.'],[6.4,9.1,'Ibarat membagi jatah listrik di lima kamar kos,'],[9.3,12.7,'setiap kontainer wajib kita pasang gembok batas maksimal memori.'],[13,16.1,'Kita alokasikan 64 MB untuk reverse proxy,'],[16.4,18.9,'384 MB untuk Next.js,'],[19.1,21.7,'384 MB untuk Redis,'],[22,24.9,'512 MB untuk Express.js beserta worker-nya,'],[25.2,30.2,'dan porsi terbesar 1536 MB untuk PostgreSQL pgvector.'],[30.7,37.1,'Kalau dijumlahkan, total batas maksimal kelima kontainer ini terkunci rapat di angka 2880 MB.'],[37.5,41.2,'Sisa memori sebesar 1,1 GB sengaja kita biarkan bebas'],[41.4,44.2,'sebagai ruang bernapas bagi sistem operasi Linux dan page cache'],[44.35,46.1,'agar server tidak pernah membeku.']];
let c=cv.getContext('2d');
const cl=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)),seg=(u,a,b)=>cl((u-a)/(b-a)),eo=x=>1-Math.pow(1-x,3),eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2,ebo=x=>1+2.4*Math.pow(x-1,3)+1.4*Math.pow(x-1,2),lp=(a,b,t)=>a+(b-a)*t;
const mix=(a,b,t)=>{const p=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16));const x=p(a),y=p(b);return 'rgb('+x.map((v,i)=>Math.round(v+(y[i]-v)*t))+')'};
const rr=(x,y,w,h,r,f,s,lw)=>{if(w<=0||h<=0)return;c.beginPath();c.roundRect(x,y,w,h,Math.min(r,w/2,h/2));if(f){c.fillStyle=f;c.fill()}if(s){c.strokeStyle=s;c.lineWidth=lw||6;c.lineCap='round';c.stroke()}};
const tx=(s,x,y,z,col,f,al)=>{c.font=(f==HF?'800 ':f==MF?'700 ':'600 ')+z+'px '+f;c.fillStyle=col;c.textAlign=al||'left';c.textBaseline='alphabetic';c.fillText(s,x,y)};
const A=(a,fn)=>{if(a<=0)return;c.save();c.globalAlpha=cl(a);fn();c.restore()};
const T=(s,x,y,z,col,f,al,p)=>{if(p<=0)return;A(p,()=>tx(s,x,y+(1-eo(p))*28,z,col,f,al))};
const pop=(cx,cy,p,fn)=>{if(p<=0)return;c.save();c.translate(cx,cy);const s=ebo(p);c.scale(s,s);c.translate(-cx,-cy);fn();c.restore()};
function lock(x,y,s,col,open){c.save();c.translate(x,y);c.scale(s,s);c.strokeStyle=col;c.lineWidth=9;c.lineCap='round';c.beginPath();if(open){c.arc(-8,-8,22,Math.PI,Math.PI*2)}else c.arc(0,-8,22,Math.PI,0);c.stroke();if(!open){}rr(-32,-8,64,52,12,col);c.fillStyle=K3.ink;c.beginPath();c.arc(0,15,7,0,7);c.fill();c.fillRect(-3,17,6,14);c.restore()}
function Pbar(x,y,w,h,pr){const k=w/4096;let a=x;c.save();c.beginPath();c.roundRect(x,y,w,h,28);c.clip();c.fillStyle='rgba(115,129,154,.18)';c.fillRect(x,y,w,h);SEG.forEach((s,i)=>{const sw=s[1]*k,p=pr[i]||0;c.fillStyle=s[2];c.fillRect(a,y,sw*p,h);if(p>.98){c.fillStyle=K3.ink;c.fillRect(a+sw-3,y,3,h)}a+=sw});c.restore();rr(x,y,w,h,28,null,K3.sl,5)}
function head(u,n,t,col,s){pop(120,150,seg(u,.1,.5),()=>{c.beginPath();c.arc(120,150,40,0,7);c.fillStyle=K3.cr;c.fill();tx(n,120,166,46,K3.iv,HF,'center')});T(t,190,168,62,col,HF,'left',seg(u,.25,.7));T(s,190,215,26,K3.sl,MF,'left',seg(u,.45,.9))}
const bg=col=>{drawThemeBg(c,W,H)};
const CU=[.15,3.55,6.25,9.15];
const SC=[
u=>{bg(K3.ink);head(u,'1','Rumus Budgeting RAM',K3.iv,'BAGIAN 2/10 · MASTERCLASS ARSITEKTUR RAG');
pop(540,640,seg(u,.5,1.2),()=>{rr(130,360,820,560,44,K3.dk2,K3.sl,6);for(let i=0;i<5;i++){const x=200+i*140,dn=i==4,d=eo(seg(u,2.9,3.15)),on=dn&&u>2.95;rr(x,430,90,330,20,K3.dk);rr(x+12,dn?lp(450,600,d):450,66,150,14,on?K3.cr:K3.te);c.beginPath();c.arc(x+45,810,10,0,7);c.fillStyle=on?K3.cr:K3.te;c.fill()}});
let a=eo(seg(u,1.5,2.2));c.save();c.translate(-(1-a)*600,0);rr(130,1000,330,260,36,K3.co);for(let i=0;i<4;i++)rr(170,1040+i*26,250,10,5,K3.iv);tx('AC',295,1230,40,K3.iv,MF,'center');c.restore();
c.save();c.translate((1-a)*600,0);rr(620,1000,330,260,36,K3.am);rr(660,1060,250,150,22,K3.ink);c.beginPath();c.arc(785,1135,38,0,7);c.strokeStyle=K3.cr;c.lineWidth=8;c.stroke();tx('OVEN',785,1245,40,K3.ink,MF,'center');c.restore();
const bf=seg(u,2.6,2.7)*(u<3.2?1:Math.max(0,1-(u-3.2)*3));A(bf*(Math.sin(u*60)>-.3?1:.4),()=>{c.beginPath();c.moveTo(540,960);c.lineTo(500,1090);c.lineTo(550,1090);c.lineTo(510,1220);c.lineTo(600,1050);c.lineTo(550,1050);c.closePath();c.fillStyle=K3.am;c.fill()});
T('SEKRING JEPRET',540,880,34,K3.cr,MF,'center',seg(u,3,3.4));T('AC + oven bersamaan = listrik jepret',540,1370,50,K3.iv,HF,'center',seg(u,3.3,3.9));
pop(540,1500,seg(u,3.9,4.5),()=>{rr(130,1440,820,120,28,K3.dk,K3.te,5);const s='deploy.resources.limits.memory';tx(s.slice(0,Math.floor(s.length*seg(u,4.2,5.4))),540,1515,36,K3.te,MF,'center')})},
u=>{bg(K3.iv);head(u,'2','5 kamar, 5 gembok',K3.iv,'IBARAT JATAH LISTRIK KAMAR KOS');
const rp=eo(seg(u,.1,.7));c.save();c.translate(0,-(1-rp)*400);c.beginPath();c.moveTo(90,520);c.lineTo(540,360);c.lineTo(990,520);c.closePath();c.fillStyle=K3.cr;c.fill();c.restore();A(seg(u,.1,.5),()=>rr(120,520,840,880,30,K3.dk2,K3.sl,5));
[[150,560],[420,560],[690,560],[285,960],[555,960]].forEach((p,i)=>{const [n,m,col]=SEG[i],w=240,h=370;pop(p[0]+w/2,p[1]+h/2,seg(u,.5+i*.35,1+i*.35),()=>{rr(p[0],p[1],w,h,26,K3.ink,K3.sl,6);rr(p[0]+20,p[1]+20,w-40,120,16,col);tx(n.split(' ')[0],p[0]+w/2,p[1]+205,i==4?24:28,K3.iv,IF,'center');tx(m+' MB',p[0]+w/2,p[1]+250,30,K3.pe,MF,'center');const lt=3.1+i*.28;pop(p[0]+w/2,p[1]+310,u>lt?seg(u,lt,lt+.3)*.6+.4:1,()=>lock(p[0]+w/2,p[1]+310,.9,K3.am,u<lt))})});
T('Setiap kontainer = satu kamar',540,1500,52,K3.iv,HF,'center',seg(u,2.2,2.8));T('+ gembok batas memori',540,1565,36,K3.pe,MF,'center',seg(u,3.6,4.2))},
u=>{bg(K3.ink);head(u,'3','Jatah RAM per kontainer',K3.iv,'RAM VPS = 4096 MB');tx('4096 MB',90,470,40,K3.sl,MF);
Pbar(90,500,900,150,[0,1,2,3].map(i=>eo(seg(u,CU[i],CU[i]+.7))));
const ge=seg(u,9.8,10.4);A(ge*(.6+.4*Math.sin(u*5)),()=>{c.setLineDash([14,12]);rr(90+900*2880/4096,500,900*1536/4096,150,28,null,K3.pe,5);c.setLineDash([])});
SEG.forEach((s,i)=>{const y=760+i*150,t=i<4?CU[i]:9.8,p=eo(seg(u,t,t+.5));if(p<=0)return;c.save();c.translate((1-p)*500,0);c.globalAlpha=(i<4?1:.45)*p;rr(90,y,900,118,28,K3.dk2);rr(90,y,18,118,9,s[2]);tx(s[0],140,y+72,38,K3.iv,IF);tx(s[1]+' MB',880,y+74,42,s[2],MF,'right');lock(950,y+60,.55,K3.iv,i==4);c.restore()})},
u=>{bg(K3.pe);const e=eio(seg(u,0,.9));const k=900/4096,x0=90+1344*k;
rr(lp(x0,90,e),lp(500,360,e),lp(1536*k,900,e),lp(150,840,e),lp(28,48,e),mix(K3.pe,K3.ink,seg(u,.2,.9)));
if(u<.5)A(1-u*2,()=>{});head(u,'4','Porsi terbesar',K3.iv,'POSTGRESQL PGVECTOR');
const n=Math.round(1536*eo(seg(u,.8,2.2)));T(n+' MB',540,640,170,K3.iv,HF,'center',seg(u,.8,1.1));
pop(390,800,seg(u,1.2,1.7),()=>{rr(130,700,520,200,26,K3.co);tx('shared_buffers',390,815,34,K3.iv,MF,'center')});pop(810,800,seg(u,1.6,2.1),()=>{rr(670,700,280,200,26,K3.te);tx('work_mem',810,815,30,K3.ink,MF,'center')});pop(540,1000,seg(u,2,2.5),()=>{rr(130,920,820,160,26,K3.am);tx('indeks vektor (pgvector)',540,1015,34,K3.ink,MF,'center')});
T('contoh ilustrasi pembagian internal',540,1150,24,K3.sl,MF,'center',seg(u,2.6,3));A(seg(u,3,3.4),()=>{rr(90,1330,900,70,18,K3.dk2);rr(90,1330,900*1536/4096*eo(seg(u,3,4)),70,18,K3.pe)});T('37,5% dari 4096 MB',540,1450,30,K3.iv,MF,'center',seg(u,3.8,4.2));T('Kamar terbesar di gedung',540,1560,52,K3.iv,HF,'center',seg(u,3.5,4.1))},
u=>{bg(K3.iv);head(u,'5','Total hard limit',K3.iv,'KELIMA KONTAINER');const k=900/4096,e=90+2880*k;
Pbar(90,520,900,150,[0,1,2,3,4].map(i=>eo(seg(u,.3+i*.45,.8+i*.45))));
const ls=seg(u,4.2,4.6);if(ls>0){const y=lp(200,430,eo(ls));rr(e-6,470,12,250,6,K3.iv);lock(e,y,1.3,K3.cr,false)}
A(seg(u,2.6,3),()=>{c.beginPath();c.moveTo(90,740);c.lineTo(90,780);c.lineTo(e,780);c.lineTo(e,740);c.strokeStyle=K3.iv;c.lineWidth=6;c.stroke()});
T('64 + 384 + 384 + 512 + 1536',540,900,40,K3.sl,MF,'center',seg(u,.5,1));
const v=[64,384,384,512,1536];let s=0;v.forEach((x,i)=>{s+=x*eo(seg(u,.3+i*.45,.8+i*.45))});T('= '+Math.round(s)+' MB',540,1090,170,K3.am,HF,'center',seg(u,.4,.8));
T('≈ 70% dari 4096 MB · terkunci rapat',540,1190,34,K3.iv,IF,'center',seg(u,4.6,5.1));
SEG.forEach((s,i)=>pop(196+i*172,1365,seg(u,5+i*.15,5.5+i*.15),()=>{rr(121+i*172,1290,150,150,30,s[2]);tx(s[1],196+i*172,1385,36,K3.ink,MF,'center')}))},
u=>{bg(K3.ink);head(u,'6','Ruang napas OS',K3.iv,'SISA RAM UNTUK UBUNTU LINUX');const k=900/4096,e=90+2880*k;
Pbar(90,420,900,150,[1,1,1,1,1]);const g=eo(seg(u,.3,1.3));rr(e,420,(900-2880*k)*g,150,28,K3.te);const pl=1+.03*Math.sin(u*3)*seg(u,1.3,2);
T('2880 MB',90+1440*k,640,34,K3.iv,MF,'center',seg(u,.2,.6));T('±1,1 GB',e+(900-2880*k)/2+20,640,34,K3.te,MF,'center',seg(u,1,1.5));
pop(540,960,seg(u,3.8,4.5),()=>{c.save();c.translate(540,960);const s=1+.05*Math.sin(u*2.4);c.scale(s,s);c.beginPath();c.arc(0,0,190,0,7);c.fillStyle=K3.te;c.fill();c.rotate(u*.25);for(let i=0;i<8;i++){c.save();c.rotate(i*Math.PI/4);rr(-14,-175,28,70,14,K3.ink);c.restore()}c.beginPath();c.arc(0,0,60,0,7);c.fillStyle=K3.ink;c.fill();c.restore()});
T('±1,1 GB hijau',540,1230,56,K3.te,HF,'center',seg(u,4.2,4.8));
[['Ubuntu Linux',K3.te],['Jaringan Docker',K3.pe],['OS Page Cache',K3.am]].forEach((a,i)=>pop(230+i*310,1328,seg(u,4.6+i*.4,5.1+i*.4),()=>{rr(85+i*310,1290,290,76,38,null,a[1],5);tx(a[0],230+i*310,1338,26,a[1],MF,'center')}));
const bp=eo(seg(u,6.2,6.9));c.save();c.translate(0,(1-bp)*400);c.globalAlpha=bp;rr(90,1420,900,230,36,K3.am);tx('Kunci 5 Kontainer di 2.880 MB,',540,1500,44,K3.ink,HF,'center');tx('Sisakan 1,1 GB untuk Napas OS Linux!',540,1565,44,K3.ink,HF,'center');tx('agar server tidak pernah membeku',540,1620,28,K3.ink,IF,'center');c.restore()}
];
const TR=[[540,960,'c'],[0,0,'w'],[540,960,'c'],[540,960,'c'],[540,960,'c']];
function scene(i,t,subT){const u=t-B[i];const z=1+.04*Math.sin(Math.PI*cl((u)/(B[i+1]-B[i])));c.save();c.translate(540,960);c.scale(z,z);c.translate(-540,-960);SC[i](u);kin(subT!==undefined?subT:t,i);c.restore()}

const CC={3:K3.pe,4:K3.te,5:K3.cr,6:K3.am,7:K3.pe,8:K3.am,9:K3.te};
const KW={reverse:K3.pe,proxy:K3.pe,'next.js':K3.te,redis:K3.cr,'express.js':K3.am,postgresql:K3.pe,pgvector:K3.pe,gembok:K3.cr,terkunci:K3.cr,listrik:K3.am,kos:K3.am,bernapas:K3.te,linux:K3.te,page:K3.te,cache:K3.te,'docker-compose':K3.am};
const colr=(w,ci)=>{const l=w.toLowerCase().replace(/[.,]+$/,'');if(KW[l])return KW[l];if(/^\d/.test(l)||l=='mb'||l=='gb')return CC[ci]||K3.te;return null};
const CH=[];CUES.forEach(([s,e,txt],ci)=>{const w=txt.split(' '),n=w.length,k=Math.ceil(n/5),bs=Math.floor(n/k),ex=n%k;let i=0;const gs=[];for(let j=0;j<k;j++){const z=bs+(j<ex?1:0);gs.push(w.slice(i,i+z));i+=z}
const L=gs.map(g=>g.join(' ').length+1),T=L.reduce((a,b)=>a+b);let t=s;gs.forEach((g,j)=>{const d=(e-s)*L[j]/T,tl=g.join(' ').length;let cp=0;CH.push({s:t,e:t+d-.06,ci,w:g.map((x,wi)=>({t:x,at:t+wi*.07}))});t+=d})});
if(CH.length)CH[CH.length-1].e+=1.8;
const ACC=[K3.am,K3.cr,K3.te,K3.pe,K3.am,K3.am];
function kin(t,si){if(!showSub)return;const q=CH.find(q=>t>=q.s&&t<q.e);if(!q)return;const base=K3.iv,Z=64;
c.save();c.font='800 '+Z+'px '+HF;const sp=Z*.3,pad=0;const ws=q.w.map(o=>({o,w:c.measureText(o.t).width,k:colr(o.t,q.ci)}));let tot=-sp;ws.forEach(x=>tot+=x.w+sp+(x.k?pad*2:0));const sc=Math.min(1,940/tot);
c.translate(540,1745);c.scale(sc,sc);const ex=seg(t,q.e-.18,q.e);let x=-tot/2;
ws.forEach((r,wi)=>{const bw=r.w+(r.k?pad*2:0),p=seg(t,r.o.at,r.o.at+.26);if(p>0){const e=eo(p),st=wi%4,cx=x+bw/2,cy=-Z*.3;let dx=0,dy=0,s2=1;if(st==0)dy=(1-e)*44;else if(st==1)dy=-(1-e)*44;else if(st==2)dx=-(1-e)*70;else s2=ebo(p);
c.save();c.globalAlpha=cl(p*3)*(1-ex);c.translate(cx+dx,cy+dy-ex*34);c.scale(s2,s2);c.translate(-cx,-cy);
c.fillStyle=r.k||base;c.font='800 '+Z+'px '+HF;c.textAlign='left';c.textBaseline='alphabetic';c.fillText(r.o.t,x+(r.k?pad:0),0);c.restore()}x+=bw+sp});
const ra=seg(t,q.s,q.s+.15)*(1-ex);if(ra>0){c.globalAlpha=ra*.24;rr(-tot/2,34,tot,8,4,base);c.globalAlpha=ra;rr(-tot/2,34,tot*cl((t-q.s)/(q.e-q.s)),8,4,ACC[si])}c.restore()}
let showSub=true;
function renderAt(t,subT){t=cl(t,0,D);c.setTransform(1,0,0,1,0,0);let i=0;while(i<5&&t>=B[i+1])i++;scene(i,t,subT);
if(i<5&&t>B[i+1]-.5){const p=eio((t-(B[i+1]-.5))/.5),tr=TR[i];c.save();c.beginPath();let rim;if(tr[2]=='c'){const r=p*2300;c.arc(tr[0],tr[1],r,0,7)}else{c.moveTo(0,H);const yy=H-p*(H+120);for(let x=0;x<=W;x+=20)c.lineTo(x,yy+Math.sin(x/90+p*9)*40*Math.sin(Math.PI*p));c.lineTo(W,H)}c.closePath();c.clip();scene(i+1,t,subT);c.restore();c.save();c.beginPath();if(tr[2]=='c')c.arc(tr[0],tr[1],p*2300,0,7);else{const yy=H-p*(H+120);for(let x=0;x<=W;x+=20){const y=yy+Math.sin(x/90+p*9)*40*Math.sin(Math.PI*p);x?c.lineTo(x,y):c.moveTo(x,y)}}c.strokeStyle=K3.am;c.lineWidth=18*Math.sin(Math.PI*p)+2;c.stroke();c.restore()}
}
// ---- audio
const SF=[];const sf=(t,k,a)=>SF.push([t,k,a||1]);
const P=(i)=>Math.pow(2,i/12);
// scene 1
sf(.5,'slide');sf(.65,'pop',.8);sf(1.5,'whoosh');sf(1.65,'whoosh',1.3);sf(2.1,'rise');sf(2.6,'zap');sf(2.95,'clack');sf(3,'bleep',1);sf(3.22,'bleep',.7);sf(3.3,'slide');sf(3.9,'pop',1.2);
for(let i=0;i<15;i++)sf(4.2+i*.08,'tick',1+(i%3)*.12);sf(5.5,'ding');
// scene 2
sf(B[1]+.1,'thud');sf(B[1]+.15,'slide');[0,1,2,3,4].forEach(i=>{sf(B[1]+.5+i*.35,'pop',P(i*2));sf(B[1]+3.1+i*.28,'clunk',1-i*.04)});sf(B[1]+2.2,'slide');sf(B[1]+3.6,'sparkle');
// scene 3
CU.forEach((t,i)=>{sf(B[2]+t,'slide');sf(B[2]+t+.05,'pop',P(i*3));sf(B[2]+t+.7,'ding',P(i*2))});sf(B[2]+9.8,'slide');sf(B[2]+9.9,'bleep',.5);
// scene 4
sf(B[3]+.05,'whoosh',.8);sf(B[3]+.9,'thud');for(let i=0;i<18;i++)sf(B[3]+.85+i*.08,'tick',1+i*.04);[1.2,1.6,2].forEach((t,i)=>sf(B[3]+t,'pop',P(i*4)));sf(B[3]+2.3,'ding',1.2);sf(B[3]+3,'rise');sf(B[3]+3.8,'sparkle');
// scene 5
[0,1,2,3,4].forEach(i=>{sf(B[4]+.3+i*.45,'pop',P(i*2));});for(let i=0;i<26;i++)sf(B[4]+.4+i*.11,'tick',1+i*.02);sf(B[4]+2.6,'slide');sf(B[4]+4.2,'whoosh',1.6);sf(B[4]+4.55,'clunk',.8);sf(B[4]+4.58,'thud');sf(B[4]+4.7,'ding',.75);[0,1,2,3,4].forEach(i=>sf(B[4]+5+i*.15,'pop',P(i*3+3)));
// scene 6
sf(B[5]+.3,'rise');sf(B[5]+1.3,'ding',1.5);sf(B[5]+3.8,'swell');sf(B[5]+3.85,'pop',.9);[4.6,5,5.4].forEach((t,i)=>sf(B[5]+t,'pop',P(5+i*3)));sf(B[5]+6.2,'whoosh',.9);sf(B[5]+6.9,'ding');sf(B[5]+7.3,'chime');
// transitions
['whoosh','zip','rise','whomp','slide'].forEach((k,i)=>{sf(B[i+1]-.5,k,k=='slide'?1.4:1);sf(B[i+1]-.02,i==3?'thud':'pop',.6)});
CH.forEach((q,i)=>sf(q.s,'blip',1+(i%3)*.12));
function sfx(x,out,t,k,a=1){const g=x.createGain();g.connect(out);
const nz=()=>{if(!x._nb){const b=x.createBuffer(1,x.sampleRate,x.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;x._nb=b}const s=x.createBufferSource();s.buffer=x._nb;return s};
const env=(at,d,pk)=>{g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(pk,t+at);g.gain.exponentialRampToValueAtTime(.001,t+at+d)};
const osc=(ty,f1,f2,d)=>{const o=x.createOscillator();o.type=ty;o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(f2,t+d);o.connect(g);o.start(t);o.stop(t+d+.05)};
const nf=(ty,f1,f2,d,q)=>{const n=nz(),f=x.createBiquadFilter();f.type=ty;f.Q.value=q||1;f.frequency.setValueAtTime(f1,t);f.frequency.exponentialRampToValueAtTime(f2,t+d);n.connect(f);f.connect(g);n.start(t);n.stop(t+d+.05)};
const bell=(fr,step,pk,dur)=>fr.forEach((f,i)=>{const o=x.createOscillator(),gg=x.createGain(),s=t+i*step;o.type='sine';o.frequency.value=f*a;o.connect(gg);gg.connect(out);gg.gain.setValueAtTime(0,s);gg.gain.linearRampToValueAtTime(pk,s+.01);gg.gain.exponentialRampToValueAtTime(.001,s+dur);o.start(s);o.stop(s+dur+.05)});
switch(k){
case'whoosh':nf('bandpass',300*a,3200*a,.5,1.2);env(.2,.3,.3);break;
case'rise':nf('bandpass',400,2600,.7,3);env(.5,.2,.22);break;
case'pop':env(.01,.15,.38);osc('sine',600*a,1080*a,.16);break;
case'tick':env(.001,.03,.16);osc('square',2600*a,2400*a,.03);break;
case'slide':nf('bandpass',700,1900,.28,2);env(.08,.2,.2);break;
case'zap':env(.004,.35,.35);osc('sawtooth',2000,120,.32);osc('square',95,60,.3);break;
case'clack':env(.002,.09,.5);osc('square',260,110,.08);nf('highpass',2500,2600,.05);break;
case'clunk':env(.003,.26,.6*Math.min(1,a+.3));osc('sine',330*a,85,.22);osc('square',1300,700,.03);break;
case'thud':env(.005,.3,.7);osc('sine',140,40,.3);break;
case'blip':env(.004,.06,.09);osc('sine',1500*a,1900*a,.05);break;
case'zip':nf('bandpass',500,5200,.22,2);env(.04,.2,.3);osc('sine',1000,2600,.2);break;
case'whomp':nf('lowpass',900,150,.5,.8);env(.05,.5,.5);osc('sine',95,45,.45);break;
case'bleep':env(.005,.14,.22);osc('square',880*a,880*a,.14);break;
case'swell':nf('lowpass',500,1400,1.4,.7);env(.7,.8,.3);break;
case'ding':bell([880,1320],0,.16,1.1);g.gain.value=0;break;
case'sparkle':bell([1318,1760,2093,2637],.05,.1,.35);g.gain.value=0;break;
case'chime':bell([523,659,784,1047],.06,.12,1.7);g.gain.value=0;break;
default:env(.01,.1,.2);osc('sine',500,700,.1)}}

  function renderScene3(localT, voDur, subOn) {
    showSub = subOn;
    const scale = D / (voDur || D);
    const tStruct = cl(Math.min(localT, (voDur || D) - 0.0005) * scale, 0, D - 0.001);
    const tSub = localT < (voDur || D) ? tStruct : (D + (localT - (voDur || D)));
    c.setTransform(1, 0, 0, 1, 0, 0);
    renderAt(tStruct, tSub);
  }
  function scheduleSfx(ctx, dest, startTime, offset, maxDur) {
    const fg = ctx.createGain(); fg.gain.value = 0.45; fg.connect(dest);
    SF.forEach(([t, k, a]) => {
      if (t >= offset && t < maxDur) sfx(ctx, fg, startTime + (t - offset) + 0.03, k, a);
    });
  }
  function getCues() {
    return CH.map(q => [q.s, q.e, q.w.map(w => w.t).join(' ')]);
  }
  return { render: renderScene3, scheduleSfx, getCues, refDur: D };
}

// ============================================================================
// SCENE 4: DIET KETAT NEXT.JS STANDALONE & WORKER EXPRESS.JS
// ============================================================================
function createScene4(cv) {
  
const CH=[[0.14, 1.262, "Tapi, memasang *gembok*"], [1.322, 2.163, "memori di *Docker*"], [2.223, 3.18, "saja tidak *cukup,*"], [3.38, 4.825, "kalau aplikasi di dalamnya"], [4.885, 5.58, "masih *boros.*"], [5.98, 7.45, "Di *container Next.js,*"], [7.68, 8.907, "kalau kamu memaketkan"], [8.967, 10.562, "seluruh folder *node_modules*"], [10.622, 11.48, "secara mentah,"], [11.88, 12.974, "RAM *384 megabit*"], [13.034, 14.65, "pasti langsung *jebol.*"], [15.28, 16.593, "Kita wajib mengaktifkan"], [16.653, 17.967, "fitur output *standalone*"], [18.027, 19.4, "di konfigurasi *Next.js,*"], [19.48, 20.567, "agar Docker hanya menjalankan"], [20.627, 21.16, "berkas produksi"], [21.22, 22.05, "yang diperas *ramping.*"], [22.45, 24.222, "Sehingga, saat kondisi diam,"], [24.282, 25.269, "ia hanya memakan"], [25.329, 26.9, "sekitar *140 megabit* RAM."], [27.42, 28.911, "Sementara, di *container*"], [28.971, 30.326, "*Express.js* yang punya"], [30.386, 31.6, "batas *512 megabit,*"], [31.95, 33.128, "kita batasi worker agar"], [33.188, 33.936, "hanya memproses"], [33.996, 35.175, "maksimal *dua* berkas PDF"], [35.235, 36.15, "secara bersamaan,"], [36.3, 37.648, "supaya memori *Node.js*"], [37.708, 38.58, "tetap *stabil.*"]];
const W=1080,H=1920,C={ink:K.ink,ink2:K.bg,ink3:K.surf,iv:K.iv,co:K.cob,te:K.teal,cr:K.cor,am:K.amb,pe:K.peri,sl:K.sl,sa:K.surf,rm:'#2a3d63'};
let c;
const rr0=(x,y,w,h,r,f,s,lw=6)=>{c.beginPath();c.roundRect(x,y,w,h,r);if(f){c.fillStyle=f;c.fill()}if(s){c.strokeStyle=s;c.lineWidth=lw;c.stroke()}};
const tx0=(s,x,y,z,col,f='B',al='left')=>{c.font=({B:'800 ',M:'700 ',I:'600 '}[f])+z+'px '+({B:'"Bricolage Grotesque",Inter',M:'"JetBrains Mono","DejaVu Sans Mono"',I:'Inter'}[f])+',sans-serif';c.fillStyle=col;c.textAlign=al;c.textBaseline='alphabetic';c.fillText(s,x,y)};
const circ0=(x,y,r,f)=>{c.beginPath();c.arc(x,y,r,0,7);c.fillStyle=f;c.fill()};
const ln0=(x1,y1,x2,y2,col,lw=6,d)=>{c.beginPath();c.setLineDash(d||[]);c.moveTo(x1,y1);c.lineTo(x2,y2);c.strokeStyle=col;c.lineWidth=lw;c.lineCap='round';c.stroke();c.setLineDash([])};
function lock(x,y,s,col){G(()=>{c.beginPath();c.arc(x+s/2,y+s*.45,s*.3,Math.PI,0);c.strokeStyle=col;c.lineWidth=s*.13;c.stroke();});rr(x,y+s*.45,s,s*.6,s*.15,col);circ(x+s/2,y+s*.75,s*.09,C.ink)}
function pdf(x,y,w,col,lab=true){rr(x,y,w,w*1.25,w*.1,C.ink,col,5);G(()=>{c.beginPath();c.moveTo(x+w*.7,y);c.lineTo(x+w,y+w*.3);c.lineTo(x+w*.7,y+w*.3);c.closePath();c.fillStyle=col;c.fill();});for(let i=0;i<3;i++)ln(x+w*.2,y+w*(.55+i*.17),x+w*(.8-i*.12),y+w*(.55+i*.17),C.pe,5);lab&&tx('PDF',x+w*.2,y+w*.45,w*.17,col,'M')}
function hd(n,t,s,dk){circ(110,150,40,C.am);tx(n,110,167,48,C.ink,'B','center');tx(t,175,150,52,C.iv,'B');tx(s,175,192,26,C.pe,'M')}
function bar(x,y,w,h,v,max,col,bg){rr(x,y,w,h,h/2,bg);rr(x,y,Math.max(h,w*v/max),h,h/2,col)}
function sub(l){const z=34;rr(90,1720,900,l.length>1?140:90,40,'rgba(14,23,39,.86)');l.forEach((t,i)=>tx(t,540,1768+i*44+(l.length>1?0:8),z-2,C.iv,'I','center'))}

const S=[
{bg:C.ink2,t:'S1 · Gembok tidak cukup',w:'0,14–5,58 dtk',sub:['Tapi, memasang gembok memori di Docker saja tidak cukup,','kalau aplikasi di dalamnya masih boros.'],f(){
 hd(1,'Gembok saja tidak cukup','mem_limit per kontainer · 5 layanan',1);
 G(()=>{c.beginPath();c.moveTo(110,440);c.lineTo(540,290);c.lineTo(970,440);c.closePath();c.fillStyle=C.co;c.fill();});
 rr(140,430,800,930,36,C.ink3,C.sl);
 [['PostgreSQL','pgvector',180,480],['Redis','cache',560,480],['Next.js','384 MB',180,760],['Express.js','512 MB',560,760],['Worker','PDF',370,1040]].forEach(([n,s,x,y],i)=>{const hot=i==2;
  if(hot){rr(x-22,y-16,384,262,36,C.cr);rr(x+170,y-62,170,54,27,C.am);tx('boros!',x+255,y-24,30,C.ink,'B','center')}
  rr(x,y,340,230,28,hot?C.ink:C.rm);tx(n,x+30,y+80,44,C.iv,'B');tx(s,x+30,y+118,24,C.pe,'M');
  rr(x+30,y+158,260,26,13,C.ink3);rr(x+30,y+158,hot?110+220*eo(seg(u,2,3.5)):110,26,13,hot?C.cr:C.te);lock(x+268,y+22,44,C.am)});
 },
 a:'Kost 5 kamar (PostgreSQL, Redis, Next.js, Express.js, Worker) dengan gembok di tiap pintu; kamar Next.js menggembung melewati dindingnya.',
 m:'Atap kost muncul dari garis; kamar Next.js menggembung, bar RAM-nya meluber. Wipe keluar berbentuk bar RAM yang memanjang jadi kontainer Scene 2.',
 s:'Klik gembok (click), pop tiap kamar, thud pelan saat kamar menggembung.'},
{bg:C.ink2,t:'S2 · Dockerfile biasa jebol',w:'5,98–15,28 dtk',sub:['Di container Next.js, kalau kamu memaketkan seluruh folder','node_modules secara mentah, RAM 384 MB pasti jebol.'],f(){
 hd(2,'Next.js · Dockerfile biasa','bawa seluruh node_modules',1);
 rr(90,290,900,760,44,C.ink,C.co,8);rr(90,290,300,60,30,C.co);tx('next-app',120,331,28,C.iv,'M');
 G(()=>{c.beginPath();c.roundRect(140,420,260,60,[24,24,0,0]);c.fillStyle=C.am;c.fill();});rr(140,470,520,420,36,C.am);
 for(let i=0;i<5;i++)for(let j=0;j<8;j++)rr(180+j*56,520+i*64,40,40,10,(i+j)%3?'#E5A93E':C.ink,null);
 tx('node_modules',160,938,54,C.iv,'B');
 rr(700,470,240,150,30,C.cr);tx('1,2 GB',820,560,52,C.iv,'B','center');tx('image',820,598,26,C.iv,'M','center');
 ln(790,640,790,860,C.cr,8,[2,18]);tx('berat!',820,910,34,C.cr,'M','center');
 X=2.4;tx('RAM saat berjalan',90,1160,30,C.pe,'M');
 rr(90,1190,860,84,42,C.ink3);rr(90,1190,84+653*eo(seg(u,6,8.2)),84,42,C.cr);tx(Math.round(600*eo(seg(u,6,8.2)))+' MB',140,1245,40,C.iv,'B');
 ln(562,1160,562,1310,C.am,8,[16,12]);tx('limit 384 MB',562,1350,30,C.am,'M','center');
 X=4.4;rr(130,1420,820,150,40,C.ink,C.ink3,4);tx('OOM Killer · exit code 137',540,1490,44,C.am,'B','center');tx('seperti sekring jepret: AC + oven nyala bersamaan',540,1540,24,C.pe,'M','center')},
 a:'Kontainer Next.js membawa folder node_modules gemuk (image 1,2 GB). Bar RAM melewati garis limit 384 MB sampai 600 MB, lalu OOM Killer menembak (exit 137).',
 m:'Bar RAM memanjang dan menabrak garis limit; kontainer bergetar lalu terpotong oleh garis coral. Transisi: lingkaran coral dari ujung bar mengembang jadi latar Scene 3.',
 s:'Whoosh bar tumbuh, rise saat melewati limit, err (dua sawtooth) saat exit 137.'},
{bg:C.ink2,t:'S3 · output: standalone',w:'15,28–22,05 dtk',sub:['Kita wajib mengaktifkan fitur output standalone di konfigurasi Next.js,','agar Docker hanya menjalankan berkas produksi yang sudah diperas ramping.'],f(){
 hd(3,"Next.js · output: 'standalone'",'next.config.js',1);
 rr(90,290,900,330,36,C.ink,C.ink3,4);tx('// next.config.js',130,360,32,C.pe,'M');tx('module.exports = {',130,420,36,C.iv,'M');
 rr(110,445,860,66,16,'#3a4a6e',C.am,4);tx("  output: 'standalone',",130,492,38,C.am,'M');tx('}',130,560,36,C.iv,'M');
 X=3;G(()=>{c.beginPath();c.roundRect(130,800,200,50,[20,20,0,0]);c.fillStyle=C.am;c.fill();});rr(130,840,380,280,30,C.am);tx('node_modules',160,990,38,C.ink,'B');
 G(()=>{c.beginPath();c.moveTo(540,790);c.lineTo(720,900);c.lineTo(720,1060);c.lineTo(540,1170);c.closePath();c.fillStyle=C.co;c.fill();});
 [880,960,1040].forEach(y=>ln(560,y,700,y<960?y+14:y>960?y-14:y,C.iv,6));
 rr(770,880,190,200,34,C.te);tx('server.js',865,980,28,C.ink,'M','center');tx('hanya yang',865,1020,22,C.ink,'M','center');tx('perlu',865,1046,22,C.ink,'M','center');
 ln(865,1120,865,1250,C.te,8);G(()=>{c.beginPath();c.moveTo(835,1235);c.lineTo(865,1275);c.lineTo(895,1235);c.fillStyle=C.te;c.fill();});
 rr(90,1300,900,220,40,C.ink,C.ink3,4);tx('Docker hanya menjalankan',540,1390,46,C.iv,'B','center');tx('berkas produksi yang ramping',540,1450,46,C.te,'B','center')},
 a:'Panel kode next.config.js menyorot baris output: \'standalone\'. Folder node_modules gemuk diperas lewat corong menjadi paket ramping server.js, lalu masuk kontainer.',
 m:'Highlight amber menyapu baris config; folder gemuk morph menjadi kartu teal ramping lewat corong (lerp lebar/tinggi/radius). Transisi: corong memanjang jadi bar pengukur Scene 4.',
 s:'Typing tick pada kode, click saat baris tersorot, whoosh peras, pop paket teal.'},
{bg:C.ink2,t:'S4 · 140 MB saat diam',w:'22,45–27,42 dtk',sub:['Sehingga, saat kondisi diam, ia hanya memakan','sekitar 140 MB RAM.'],f(){
 hd(4,'Next.js · kondisi diam','biasa vs standalone',1);
 tx(Math.round(140*eo(seg(u,.3,2.4)))+' MB',540,540,230,C.te,'B','center');tx('RAM idle · aman di bawah limit 384 MB',540,610,32,C.iv,'I','center');
 tx('Dockerfile biasa',90,800,30,C.pe,'M');rr(90,830,860,70,35,C.ink3);rr(90,830,737,70,35,C.cr);tx('600',140,880,36,C.iv,'B');
 tx('output: standalone',90,1020,30,C.pe,'M');rr(90,1050,860,70,35,C.ink3);rr(90,1050,70+102*eo(seg(u,1.4,3)),70,35,C.te);tx('140',140,1100,36,C.ink,'B');
 G(()=>{c.beginPath();c.roundRect(268,1054,555,62,31);c.strokeStyle=C.cr;c.lineWidth=4;c.setLineDash([10,12]);c.stroke();c.setLineDash([]);});
 ln(562,780,562,1190,C.am,8,[16,12]);tx('limit 384 MB',562,1240,30,C.am,'M','center');
 rr(250,1320,580,100,50,C.te);tx('✓ aman, ada ruang napas',540,1385,36,C.ink,'B','center')},
 a:'Dua bar RAM berurutan: Dockerfile biasa 600 MB (coral, melewati limit) vs standalone 140 MB (teal) jauh di bawah garis limit 384 MB. Angka 140 MB raksasa jadi fokus.',
 m:'Bar coral menyusut ke bar teal (lerp lebar + warna); bayangan outline putus-putus menandai selisih yang terpangkas. Counter naik ke 140. Transisi: gelombang naik dari bawah.',
 s:'Rise counter, pop angka 140, chime kecil saat tanda aman.'},
{bg:C.ink2,t:'S5 · Express.js 512 MB',w:'27,42–31,95 dtk',sub:['Sementara, di container Express.js','yang punya batas 512 MB,'],f(){
 hd(5,'Express.js · antrean PDF','ekstraksi dokumen',1);
 rr(300,330,690,940,44,C.ink,C.co,8);rr(300,330,320,60,30,C.co);tx('express-api · 512 MB',330,371,24,C.iv,'M');
 [0,1,2,3,4].forEach(i=>{pdf(60+(i%2)*110,430+i*150,92,C.cr,false);ln(215-((i%2)*0)+(i%2)*110,480+i*150,330,540+i*40,C.cr,5,[2,12])});
 rr(560,440,360,740,34,C.ink3);rr(560,1180-720*eo(seg(u,.8,3.8)),360,Math.max(30,720*eo(seg(u,.8,3.8))),34,C.cr);

 tx('Heap V8',740,610,46,C.iv,'B','center');tx('penuh!',740,670,34,C.iv,'M','center');
 ln(540,440,940,440,C.am,6,[14,10]);tx('batas memori',740,420,22,C.am,'M','center');
 tx('semua PDF masuk sekaligus',540,1390,40,C.cr,'B','center');tx('Garbage Collector kewalahan',540,1445,32,C.pe,'I','center')},
 a:'Kontainer Express.js (limit 512 MB) kebanjiran tumpukan PDF dari kiri; tangki heap V8 terisi sampai penuh dan menyentuh garis batas.',
 m:'Dokumen PDF terbang bergelombang ke kontainer; tangki heap naik dengan level bergelombang. Transisi: tumpukan PDF terakhir menyusut menjadi dua slot Scene 6.',
 s:'Pop beruntun nada naik tiap PDF, rise saat heap naik.'},
{bg:C.ink,t:'S6 · Maks 2 PDF + ringkasan',w:'31,95–38,91 dtk',sub:['kita batasi worker agar hanya memproses maksimal dua berkas PDF','secara bersamaan, supaya memori Node.js tetap stabil.'],f(){
 hd(6,'Ringkasan: diet ketat','Next.js standalone + worker terbatas',1);
 rr(90,250,900,330,40,C.ink3);tx('Next.js · standalone',130,320,40,C.iv,'B');tx('limit 384 MB',130,360,24,C.sl,'M');
 bar(130,400,820,64,140,384,C.te,C.rm);ln(130+820*140/384,390,130+820*140/384,474,C.iv,4);tx('140 MB idle',130,525,34,C.te,'M');
 rr(90,610,900,740,40,C.ink3);tx('Express.js · limit 512 MB',130,680,40,C.iv,'B');tx('worker: maks 2 PDF',130,720,24,C.sl,'M');
 pdf(130,900,80,C.sl,false);pdf(130,1030,80,C.sl,false);pdf(130,1160,80,C.sl,false);
 rr(260,780,26,500,13,C.am);tx('antre',200,860,22,C.sl,'M');
 rr(330,800,330,200,30,C.rm);rr(330,1040,330,200,30,C.rm);
 pdf(400,830,100,C.te);pdf(400,1070,100,C.te);ln(520,880,620,880,C.te,10);ln(520,1120,620,1120,C.te,10);
 tx('slot 1',495,985,22,C.sl,'M','center');tx('slot 2',495,1225,22,C.sl,'M','center');
 rr(720,780,200,500,34,C.rm);rr(720,1000,200,280,34,C.te);tx('Heap V8',820,860,30,C.iv,'B','center');tx('stabil',820,900,26,C.te,'M','center');
 X=1.6;rr(90,1400,900,270,40,C.am);['Diet Ketat Kontainer Node.js:','Wajib Aktifkan Next.js Standalone','& Batasi Konkurensi Express.js!'].forEach((t,i)=>tx(t,540,1475+i*62,i?42:46,C.ink,'B','center'))},
 a:'Rekap dua layar: atas Next.js standalone 140/384 MB; bawah Express.js dengan palang amber, hanya dua PDF di slot aktif, sisanya antre. Tangki heap tenang di level rendah. Kotak amber memuat teks layar utama.',
 m:'Dua slot teal terbentuk dari PDF yang menyusut dan antre di belakang palang; heap menurun lalu stabil. Layar atas+bawah menyatu ke kotak amber penutup (roundRect membesar).',
 s:'Click palang menutup, pop dua slot, chime akor penutup.'}
];

const cl=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)),seg=(u,a,b)=>cl((u-a)/(b-a));
const eo=x=>1-Math.pow(1-x,3),ebo=x=>1+2.4*Math.pow(x-1,3)+1.4*Math.pow(x-1,2);
let u=0,cnt=0,MODE=0,STG=.04,DEL=.12,X=0,CUR=0,SUBON=true,SFXON=true;
const RT=[],N=[],ST=[];
const skip=(i,k,z)=>{if(MODE==2)RT[CUR].push([DEL+i*STG+X,k,z||0]);return MODE>0};
const rv=(i,d=.4)=>seg(u,DEL+i*STG+X,DEL+i*STG+X+d);
function gate(fn,cx,cy,big,kd){const i=cnt++;if(skip(i,kd||(big?'slab':'pop')))return;const a=rv(i);if(a<=0)return;c.save();c.globalAlpha*=cl(a*1.6);if(!big){const s=ebo(a);c.translate(cx,cy);c.scale(s,s);c.translate(-cx,-cy)}fn();c.restore()}
const rr=(x,y,w,h,r,f,s,lw)=>gate(()=>rr0(x,y,w,h,r,f,s,lw),x+w/2,y+h/2,w>560||h>560);
const circ=(x,y,r,f)=>gate(()=>circ0(x,y,r,f),x,y,false,'blip');
const G=(fn,cx=540,cy=900)=>gate(fn,cx,cy,true,'swish');
const tx=(s,x,y,z,col,f,al)=>{const i=cnt++;if(skip(i,'tick'))return;const a=rv(i,.35);if(a<=0)return;c.save();c.globalAlpha*=cl(a*1.5);c.translate(0,(1-eo(a))*24);tx0(s,x,y,z,col,f,al);c.restore()};
const ln=(x1,y1,x2,y2,col,lw,d)=>{const i=cnt++;if(skip(i,'zip',Math.hypot(x2-x1,y2-y1)))return;const a=rv(i,.5);if(a<=0)return;const p=eo(a);ln0(x1,y1,x1+(x2-x1)*p,y1+(y2-y1)*p,col,lw,d)};
const B=[0,5.7,14.9,22.2,27.2,31.8];let END=38.9068;
const dur=i=>(i<5?B[i+1]:END)-B[i];
function scene(i,uu,subT){u=uu;cnt=0;X=0;STG=ST[i];CUR=i;drawThemeBg(c,W,H);const z=1+.045*Math.sin(Math.PI*seg(u,0,dur(i)));c.save();c.translate(540,900);c.scale(z,z);c.translate(-540,-900);S[i].f();c.restore();capScene(i,subT!==undefined?subT:(B[i]+uu))}
function trPath(i,p){const e=eo(p),k=i%4;c.beginPath();
 if(k==1)c.arc(540,960,e*1300,0,7);
 else if(k==2){const y=H+60-(H+160)*e;c.moveTo(0,H);c.lineTo(0,y);for(let x=0;x<=W;x+=24)c.lineTo(x,y+Math.sin(x/70+p*8)*46*Math.sin(Math.PI*p));c.lineTo(W,H)}
 else if(k==3){const D=e*(W+H)*1.02;c.moveTo(0,0);c.lineTo(D,0);c.lineTo(0,D)}
 else c.arc(540,960,e*2300,0,7);
 c.closePath()}
const CAPY=[1560,1740,1740,1700,1740,1790],ACC=[C.am,C.cr,C.te,C.am,C.cr,C.am],DK=[1,1,1,1,1,1];
const PRE=CH.map(q=>{const tk=[];let hi=false;q[2].split(' ').forEach(w=>{if(w[0]=='*')hi=true;tk.push({w:w.replace(/\*/g,''),hi});if(w.endsWith('*'))hi=false});return tk});
const CSC=CH.map(q=>{let i=0;while(i<5&&q[0]>=B[i+1]-.3)i++;return i});
function dch(k,t,i){const q=CH[k],tk=PRE[k],y=CAPY[i],z0=64;
 c.font='800 '+z0+'px "Bricolage Grotesque",Inter,sans-serif';const gap=z0*.28,ws=tk.map(o=>c.measureText(o.w).width),tot=ws.reduce((a,b)=>a+b,0)+gap*(tk.length-1),f=Math.min(1,900/tot),z=z0*f,x0=540-tot*f/2,sty=k%4,ex=eo(seg(t,q[1]-.18,q[1]));
 let x=x0;
 tk.forEach((o,j)=>{const w=ws[j]*f,s0=q[0]+j*.07,ein=eo(seg(t,s0,s0+.3)),a=cl(Math.min(ein*1.6,1-ex));
  if(a>0){c.save();c.globalAlpha=a;let dx=0,dy=-ex*40,sc=1;
   if(sty==0){dy+=(1-ein)*z*1.1;c.beginPath();c.rect(0,y-z*1.2,W,z*1.7);c.clip()}
   else if(sty==1)dy+=-(1-ein)*80;
   else if(sty==2)dx=-(1-ein)*180;
   else sc=ebo(ein);
   const cx=x+w/2,cy=y-z*.3;c.translate(cx+dx,cy+dy);c.scale(sc,sc);c.translate(-cx,-cy);
   tx0(o.w,x,y,z,o.hi?ACC[i]:C.iv,'B','left');c.restore()}
  x+=w+gap*f});
 const ra=cl(Math.min(seg(t,q[0],q[0]+.15),1-ex));if(ra>0){c.save();c.globalAlpha=ra;const col=C.iv;c.globalAlpha=ra*.24;rr0(x0,y+z*.3,tot*f,8,4,col);c.globalAlpha=ra;rr0(x0,y+z*.3,Math.max(8,tot*f*seg(t,q[0],q[1])),8,4,ACC[i]);c.restore()}}
function capScene(i,t){if(!SUBON)return;CH.forEach((q,k)=>{if(CSC[k]==i&&t>=q[0]-.02&&t<=q[1]+.02)dch(k,t,i)})}
function renderAt(t,subT){t=cl(t,0,END);let i=0;while(i<5&&t>=B[i+1])i++;const p=i>0?seg(t-B[i],0,.5):1;
 if(p<1){scene(i-1,t-B[i-1],subT);c.save();trPath(i,p);c.clip();scene(i,t-B[i],subT);c.restore();trPath(i,p);c.strokeStyle=C.am;c.lineWidth=18*Math.sin(Math.PI*p)+2;c.stroke()}else scene(i,t-B[i],subT);
 }
function R(t,cvs){c=cvs.getContext('2d');c.setTransform(cvs.width/W,0,0,cvs.width/W,0,0);renderAt(t)}
function prep(){const k=document.createElement('canvas');k.width=108;k.height=192;c=k.getContext('2d');c.setTransform(.1,0,0,.1,0,0);
 S.forEach((s,i)=>{CUR=i;MODE=1;u=0;cnt=0;X=0;s.f();N[i]=cnt;ST[i]=Math.min(.06,(dur(i)*.55-DEL-.4)/Math.max(cnt,1));STG=ST[i];RT[i]=[];MODE=2;cnt=0;X=0;s.f()});MODE=0}
/* audio */
const EV=[];
function buildEv(){EV.length=0;
 ['whoosh','swell','whoosh1','slide','zip'].forEach((k,i)=>EV.push([B[i+1]-.05,k]));EV.push([B[4]-.1,'whomp'],[B[5]-.1,'sparkle']);
 const cap=[];CH.forEach((q,k)=>{EV.push([q[0]-.02,['cswish','cdrop','cslide','cpop'][k%4]]);cap.push(q[0]-.02)});
 let n=0;
 S.forEach((s,i)=>{let last=-1;const cn={pop:0,tick:0,zip:0};RT[i].forEach(([t,kd,z])=>{const ta=B[i]+t+.1;
  if(ta-last<.13||cap.some(c=>Math.abs(c-ta)<.1))return;
  if(kd in cn){const m={pop:2,tick:5,zip:3}[kd];if(cn[kd]++%m)return;if(kd=='zip'&&z<200)return}
  EV.push([ta,kd=='pop'?['pop','boop','tap'][n%3]:kd=='slab'?['stamp','whomp'][n%2]:kd,n++]);last=ta})});
 EV.push([1.2,'clunk'],[1.55,'clunk'],[1.9,'clunk'],[2.4,'thud'],[2.6,'rise',1],[3.5,'alarm'],
  [B[1]+6,'rise',2.2],[B[1]+8.3,'alarm'],[B[1]+8.9,'glitch'],
  [B[2]+1.3,'click'],[B[2]+3.6,'whirr',1],[B[2]+4.4,'squish'],[B[2]+5.3,'bell'],
  [B[3]+.3,'rise',2.1],[B[3]+2.5,'bell'],
  [B[4]+.8,'bubble',3],[B[4]+3.9,'alarm'],
  [B[5]+1,'clunk'],[B[5]+1.7,'beep'],[B[5]+2,'beep'],[B[5]+3.2,'click'],[B[5]+5,'tada'],[B[5]+5.2,'sparkle'],[B[3]+2.7,'sparkle'],[B[2]+4.8,'snap'],[END-1.6,'chime']);
 EV.sort((a,b)=>a[0]-b[0])}
function noiseBuf(ctx){const b=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return b}
function sfx(ctx,out,w,k,a,nb){
 const env=(g,pk,d,at=.005,dl=0)=>{g.gain.setValueAtTime(0.0001,w+dl);g.gain.linearRampToValueAtTime(pk,w+dl+at);g.gain.exponentialRampToValueAtTime(.0001,w+dl+d)};
 const osc=(ty,f1,f2,d,pk,dl=0)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type=ty;o.frequency.setValueAtTime(f1,w+dl);if(f2!=f1)o.frequency.exponentialRampToValueAtTime(f2,w+dl+d);env(g,pk,d,.005,dl);o.connect(g);g.connect(out);o.start(w+dl);o.stop(w+dl+d+.05)};
 const noise=(f1,f2,d,pk,q,ty='bandpass',dl=0)=>{const s=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();s.buffer=nb;f.type=ty;f.Q.value=q;f.frequency.setValueAtTime(f1,w+dl);f.frequency.exponentialRampToValueAtTime(f2,w+dl+d);env(g,pk,d,d*.35,dl);s.connect(f);f.connect(g);g.connect(out);s.start(w+dl);s.stop(w+dl+d+.05)};
 const v=1+((a||0)%5)*.06;
 switch(k){
 case'whoosh':noise(300,3200,.5,.45,1.2);break;
 case'whoosh1':noise(3200,300,.5,.4,1.2);break;
 case'swell':noise(200,2400,.6,.42,.8,'lowpass');osc('sine',120,260,.5,.12);break;
 case'zip':osc('sine',500,2400,.14,.1);noise(1500,6000,.14,.08,1);break;
 case'pop':osc('sine',600*v,600*v*1.8,.16,.3);break;
 case'blip':osc('sine',880*v,1320*v,.09,.16);osc('sine',1320*v,1760*v,.08,.08,.07);break;
 case'tick':osc('square',3000*v,2800,.02,.045);break;
 case'slab':osc('sine',110,55,.22,.32);noise(300,100,.18,.14,.7,'lowpass');break;
 case'swish':noise(1200,5000,.2,.2,.8);break;
 case'click':osc('square',1800,1700,.05,.1);break;
 case'snap':noise(4000,2000,.04,.25,.8,'highpass');break;
 case'thud':osc('sine',140,40,.35,.6);noise(400,80,.3,.35,.7,'lowpass');break;
 case'clunk':osc('triangle',220,110,.14,.35);noise(1500,800,.06,.2,2);osc('sine',90,60,.18,.25,.03);break;
 case'rise':noise(400,2600,a,.3,3);break;
 case'whirr':noise(200,1400,a,.28,8);break;
 case'squish':noise(900,150,.4,.35,.7,'lowpass');osc('sine',300,120,.35,.18);break;
 case'bubble':for(let j=0;j<7;j++)osc('sine',400+j*70,520+j*90,.09,.1,j*a/7);break;
 case'alarm':for(let j=0;j<3;j++)osc('square',880,880,.09,.1,j*.14);break;
 case'beep':osc('sine',1046,1046,.12,.14);break;
 case'err':osc('sawtooth',110,108,.5,.14);osc('sawtooth',117,115,.5,.14);break;
 case'bell':osc('sine',1319,1319,.9,.12);osc('sine',1976,1976,.6,.05);break;
 case'tada':[523,659,784,1047,1319].forEach((f,j)=>osc('sine',f,f,.8,.1,j*.07));break;
 case'chime':[523,659,784,1047].forEach((f,j)=>osc('sine',f,f,1.1,.1,j*.06));break;
 case'boop':osc('sine',330,440,.12,.22);break;
 case'tap':osc('sine',1200,900,.04,.18);noise(3000,1500,.03,.1,1);break;
 case'sparkle':[1568,2093,2637,3136].forEach((f,j)=>osc('sine',f*(1+j%2*.01),f*1.02,.18,.06,j*.045));break;
 case'glitch':for(let j=0;j<6;j++)osc('square',200+((j*733)%1400),150+((j*377)%900),.04,.09,j*.045);break;
 case'whomp':osc('triangle',200,55,.32,.4);noise(500,90,.3,.25,.7,'lowpass');break;
 case'stamp':osc('sine',100,50,.15,.4);noise(2000,600,.06,.25,1);break;
 case'slide':noise(600,1800,.25,.3,1.2);break;
 case'cswish':noise(2000,6000,.14,.1,1);break;
 case'cpop':osc('sine',700,1000,.08,.1);break;
 case'cslide':noise(1800,700,.16,.09,1.5);break;
 case'cdrop':osc('sine',950,420,.11,.1);break}}

  if(CH.length)CH[CH.length-1][1]+=1.8;
  prep();
  buildEv();
  c = cv.getContext('2d');
  function renderScene4(localT, voDur, showSub) {
    SUBON = showSub;
    c = cv.getContext('2d');
    c.setTransform(1, 0, 0, 1, 0, 0);
    const scale = END / (voDur || END);
    const tStruct = cl(Math.min(localT, (voDur || END) - 0.0005) * scale, 0, END - 0.001);
    const tSub = localT < (voDur || END) ? tStruct : (END + (localT - (voDur || END)));
    renderAt(tStruct, tSub);
  }
  function scheduleSfx(ctx, dest, startTime, offset, maxDur) {
    const bus = ctx.createGain(); bus.gain.value = 0.5; bus.connect(dest);
    const nb = noiseBuf(ctx);
    EV.forEach(([t, k, a]) => {
      if (t >= offset && t < maxDur) sfx(ctx, bus, startTime + (t - offset), k, a, nb);
    });
  }
  function getCues() {
    return CH.map(q => [q[0], q[1], q[2].replace(/\*/g, '')]);
  }
  return { render: renderScene4, scheduleSfx, getCues, refDur: END };
}

// ============================================================================
// SCENE 5: BEDAH PARAMETER INTERNAL POSTGRESQL PGVECTOR
// ============================================================================
function createScene5(cv) {
  
const W=1080,H=1920,D=42.823,B=[0,6,13.2,20.4,25.1,28.7,39.3,D];
const CUES=[[.68,5.15,"Perhatian paling ekstra wajib kita berikan pada container PostgreSQL PG Vector."],[6.15,12.65,"Secara bawaan, PostgreSQL tidak sadar kalau dirinya sedang dikurung di dalam container berbatas 1,5 giga RAM."],[13.65,19.95,"Supaya ia tidak kalap memakai memori, kita suntikkan empat parameter pengaman langsung saat container dinyalakan."],[20.8,24.95,"Kita atur shared_buffers di 384 MB sebagai memori kerja utama,"],[25.3,28.45,"work_mem di 16 MB per operasi pencarian,"],[28.8,32.9,"dan kita kunci maintenance_work_mem di 128 MB."],[33.75,37.35,"Parameter terakhir ini sangat krusial untuk menahan nafsu PostgreSQL"],[37.35,42.2,"saat merakit jaring indeks vektor HNSW agar tidak pernah melampaui batas memori container."]];
const CHK=[["Perhatian paling ekstra wajib","kita berikan pada container","PostgreSQL PG Vector."],["Secara bawaan, PostgreSQL","tidak sadar kalau dirinya","sedang dikurung di dalam","container berbatas 1,5 giga RAM."],["Supaya ia tidak kalap","memakai memori, kita suntikkan","empat parameter pengaman langsung","saat container dinyalakan."],["Kita atur shared_buffers","di 384 MB sebagai","memori kerja utama,"],["work_mem di 16 MB","per operasi pencarian,"],["dan kita kunci","maintenance_work_mem di 128 MB."],["Parameter terakhir ini","sangat krusial untuk","menahan nafsu PostgreSQL"],["saat merakit jaring indeks","vektor HNSW agar tidak","pernah melampaui batas","memori container."]];
const CH=[];CUES.forEach((q,ci)=>{const L=CHK[ci],tot=L.reduce((a,s)=>a+s.length,0);let t=q[0];L.forEach(s=>{const d=(q[1]-q[0])*s.length/tot;CH.push([t,t+d,s,ci]);t+=d})});
CH.forEach((q,i)=>{const n=CH[i+1];q[1]=n&&n[0]-q[1]<.3?n[0]-.06:q[1]+(i===CH.length-1?2.0:.2)});
const c=cv.getContext('2d');
const F={B:'"Bricolage Grotesque","Inter",sans-serif',M:'"JetBrains Mono","DejaVu Sans Mono",monospace',I:'Inter,sans-serif'},WT={B:800,M:700,I:600};
const K5={ink:K.ink,dk:K.bg,dk2:K.surf,iv:K.iv,co:K.cob,te:K.teal,cr:K.cor,am:K.amb,pe:K.peri,sl:K.sl,sa:K.surf};
let U=0,SUB=true,SFXON=true;
const cl=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)),sg=(a,b)=>cl((U-a)/(b-a)),eo=x=>1-Math.pow(1-x,3),eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2,ebo=x=>1+2.4*Math.pow(x-1,3)+1.4*Math.pow(x-1,2),lp=(a,b,t)=>a+(b-a)*t;
const mix=(a,b,t)=>{const f=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16)),X=f(a),Y=f(b);return'rgb('+X.map((v,i)=>Math.round(lp(v,Y[i],t))).join()+')'};
const rr=(x,y,w,h,r,f,s,lw,d)=>{c.beginPath();c.roundRect(x,y,Math.max(w,0),Math.max(h,0),r);if(f){c.fillStyle=f;c.fill()}if(s){c.strokeStyle=s;c.lineWidth=lw||6;c.lineCap='round';c.setLineDash(d||[]);c.stroke();c.setLineDash([])}};
const tx=(s,x,y,z,col,fam='B',al='left',mw=1000)=>{c.font=WT[fam]+' '+z+'px '+F[fam];const w=c.measureText(s).width;if(w>mw){z*=mw/w;c.font=WT[fam]+' '+z+'px '+F[fam]}c.fillStyle=col;c.textAlign=al;c.textBaseline='alphabetic';c.fillText(s,x,y)};
const bg=col=>{drawThemeBg(c,W,H)};
const ln=(x1,y1,x2,y2,col,w)=>{c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.strokeStyle=col;c.lineWidth=w||6;c.lineCap='round';c.stroke()};
const dot=(x,y,r,col)=>{c.beginPath();c.arc(x,y,Math.max(r,0),0,7);c.fillStyle=col;c.fill()};
function pop(cx,cy,p,fn){if(p<=0)return;c.save();c.translate(cx,cy);const s=ebo(p);c.scale(s,s);c.translate(-cx,-cy);fn();c.restore()}
function A(a,fn){if(a<=0)return;c.save();c.globalAlpha=cl(a);fn();c.restore()}
function rtx(s,x,y,z,col,fam,al,p,mw){if(p<=0)return;c.save();c.beginPath();c.rect(0,y-z*1.05,W,z*1.45);c.clip();c.translate(0,(1-eo(p))*z*1.2);tx(s,x,y,z,col,fam,al,mw);c.restore()}
function up(p,dy,fn){if(p<=0)return;c.save();c.globalAlpha=cl(p*1.6);c.translate(0,(1-eo(p))*dy);fn();c.restore()}
function cyl(x,y,w,h,col,top){const e=h*.13;c.fillStyle=col;c.fillRect(x,y+e,w,h-2*e);c.beginPath();c.ellipse(x+w/2,y+h-e,w/2,e,0,0,7);c.fill();c.beginPath();c.ellipse(x+w/2,y+e,w/2,e,0,0,7);c.fillStyle=top;c.fill();c.strokeStyle=top;c.lineWidth=7;for(let i=1;i<3;i++){c.beginPath();c.ellipse(x+w/2,y+e+(h-2*e)*i/3+e*.2,w/2,e,0,0,Math.PI);c.stroke()}}
const S=[];
S[0]=()=>{bg(K5.ink);const z=1+.06*eio(sg(0,6));c.save();c.translate(540,800);c.scale(z,z);c.translate(-540,-800);
 rtx('SERIES RAG · BAGIAN 2/10',W/2,150,30,K5.sl,'M','center',sg(0,.5));
 c.save();c.translate(0,-(1-eo(sg(0,.6)))*320);c.beginPath();c.moveTo(80,420);c.lineTo(540,290);c.lineTo(1000,420);c.closePath();c.fillStyle=K5.cr;c.fill();c.restore();
 [[105,420,'Next.js'],[405,420,'Redis'],[705,420,'layanan 3'],[255,680,'PostgreSQL'],[555,680,'layanan 5']].forEach(([x,y,n],i)=>{const hl=i==3;pop(x+135,y+115,sg(.2+i*.18,.7+i*.18),()=>A(1-(hl?0:.65*eio(sg(3,3.6))),()=>{rr(x,y,270,230,26,hl?K5.co:K5.dk2,hl?K5.am:K5.sl,hl?10:4);rr(x+195,y+24,50,50,10,hl?K5.am:K5.ink);if(!hl)tx(n,x+28,y+200,26,K5.sl,'M','left',220)}))});
 pop(390,780,sg(1.1,1.6),()=>{cyl(300,712,180,130,K5.iv,K5.pe);tx('pgvector',390,880,26,K5.iv,'M','center')});
 A(sg(1.5,2),()=>tx('kost 5 kamar · 1 server 4 GB',W/2,1000,30,K5.sl,'M','center'));
 rtx('Perhatian paling ekstra',W/2,1130,80,K5.iv,'B','center',sg(.7,1.3));rtx('untuk container pgvector',W/2,1225,64,K5.am,'B','center',sg(2.9,3.5));
 const l=eo(sg(4,4.6));if(l>0)ln(390,925,390,925+375*l,K5.cr,8);pop(390,1350,sg(4.6,5.1),()=>{rr(240,1300,300,100,50,K5.am);tx('limit 1536 MB',390,1364,36,K5.ink,'M','center',270)});c.restore()};
S[1]=()=>{bg(K5.iv);rtx('Secara bawaan,',W/2,170,64,K5.iv,'B','center',sg(.2,.8));rtx('PostgreSQL tidak sadar batas',W/2,250,64,K5.cr,'B','center',sg(1.6,2.3));
 const over=U>4.8,sh=over?Math.sin((U-4.8)*70)*9*Math.exp(-(U-4.8)*3.5):0;
 c.save();c.translate(sh,0);pop(540,690,sg(.5,1),()=>{rr(190,330,700,720,44,K5.sa,over?K5.cr:K5.te,8,[26,18]);tx('container · 1536 MB',540,385,30,over?K5.cr:K5.te,'M','center')});
 pop(540,640,sg(.9,1.4),()=>cyl(400,470,280,340,K5.co,K5.pe));
 A(sg(1.5,1.8),()=>rr(375,420+170*eo(sg(1.6,2.2)),330,76,28,K5.am,K5.ink,6));
 pop(540,440,sg(2.4,2.9),()=>tx('?',540,470-8*Math.sin(U*4),70,K5.am,'B','center'));A(sg(2.6,3),()=>tx('merasa RAM-nya 4 GB',540,950,34,K5.iv,'M','center'));c.restore();
 up(sg(3,3.6),90,()=>{rr(90,1120,900,90,22,K5.sa,K5.sl,5);tx('RAM VPS 4 GB',990,1270,26,K5.pe,'M','right')});
 const lx=90+900*1536/4096,w=670*eio(sg(3.9,5.7));if(w>0)rr(90,1120,w,90,22,K5.cr);
 const m=eo(sg(3.6,4));if(m>0){ln(lx,1090,lx,1090+150*m,K5.am,8);A(m,()=>tx('limit 1536 MB',lx,1075,28,K5.am,'M','center'))}
 A(sg(4,4.5),()=>tx('tumbuh tanpa tahu batas',100,1270,26,K5.cr,'M'));
 pop(540,1395,sg(5.5,6),()=>{rr(240,1340,600,110,55,K5.cr);tx('OOM Killer · Exit 137',540,1408,38,K5.iv,'M','center',560)})};
const CODE=[['rag-postgres:',K5.iv],['  mem_limit: 1536m',K5.te],['  command:',K5.iv],['    - postgres',K5.pe],['    - -c shared_buffers=384MB'],['    - -c work_mem=16MB'],['    - -c maintenance_work_mem=128MB'],['    - -c max_connections=50']],TS=[1,1.35,1.7,2,3.2,3.8,4.4,5];
S[2]=()=>{bg(K5.dk);rtx('4 parameter pengaman',W/2,170,76,K5.iv,'B','center',sg(.2,.8));A(sg(.6,1.1),()=>tx('disuntik saat container menyala',W/2,235,32,K5.pe,'M','center'));
 up(sg(.4,1),120,()=>{rr(60,300,960,760,36,K5.ink,K5.dk2,6);[K5.cr,K5.am,K5.te].forEach((q,i)=>dot(110+i*40,350,12,q));
  CODE.forEach((l,i)=>{const y=440+i*74;if(i>3){const b=eo(sg(TS[i],TS[i]+.3));rr(80,y-46,920*b,62,14,K5.dk2);rr(80,y-46,12,62,6,K5.am)}
   const n=Math.floor((U-TS[i])*55);if(n>0){tx(l[0].slice(0,n),110,y,34,l[1]||K5.am,'M','left',880);if(n<=l[0].length+20&&Math.floor(U*4)%2==0){c.font='700 34px '+F.M;const w=c.measureText(l[0].slice(0,n)).width;rr(110+w+4,y-30,14,36,3,K5.am)}}})});
 [['shared_buffers','384 MB'],['work_mem','16 MB'],['maintenance_work_mem','128 MB'],['max_connections','50']].forEach((p,i)=>{const x=60+(i%2)*490,y=1130+Math.floor(i/2)*190;pop(x+235,y+80,sg(5.6+i*.3,6.1+i*.3),()=>{rr(x,y,470,160,28,K5.dk2);dot(x+56,y+80,32,K5.am);tx(i+1+'',x+56,y+95,40,K5.ink,'B','center');tx(p[0],x+110,y+68,28,K5.iv,'M','left',340);tx(p[1],x+110,y+130,52,K5.am,'B','left',340)})})};
S[3]=()=>{bg(K5.pe);rtx('shared_buffers = 384 MB',W/2,170,68,K5.iv,'B','center',sg(.3,.9));rtx('25% dari limit container',W/2,240,40,K5.pe,'I','center',sg(2.4,3));
 pop(540,750,sg(.2,.7),()=>{rr(140,350,800,800,44,K5.ink,K5.sl,8);tx('1536 MB',180,330,30,K5.iv,'M')});
 for(let r=0;r<4;r++)for(let q=0;q<4;q++){const hot=r<2&&q<2,x=182+q*182,y=392+r*182,k=r*4+q;pop(x+85,y+85,sg(.4+k*.03,.85+k*.03),()=>{rr(x,y,170,170,22,hot?mix(K5.sa,K5.am,eio(sg(1.5,2.1))):K5.sa);if(hot)for(let j=0;j<3;j++)rr(x+28,y+36+j*36,(114-j*22)*eo(sg(2.1+j*.15,2.6+j*.15)),16,8,K5.ink)})}
 A(sg(2.5,3),()=>rr(170,380,376,376,30,null,K5.am,8,[22,16]));pop(358,790,sg(2.9,3.3),()=>tx('384 MB',358,812,40,K5.am,'M','center'));
 const l=eo(sg(3.2,3.7));if(l>0)ln(358,830,358,830+400*l,K5.am,6);rtx('blok indeks yang sering diakses',540,1290,36,K5.iv,'M','center',sg(3.6,4.1));rtx('tetap hangat di memori',540,1345,36,K5.te,'M','center',sg(4,4.5))};
const JM=[[30,50,70,90,110,130,150,170],[50,130,30,170,90,70,150,110],[30,70,50,90,150,110,170,130]];
S[4]=()=>{bg(K5.iv);rtx('work_mem = 16 MB',W/2,170,72,K5.iv,'B','center',sg(.1,.6));rtx('per operasi pengurutan vektor',W/2,235,34,K5.pe,'M','center',sg(.5,1));
 JM.forEach((d,i)=>{const y=330+i*290,s=sg(.15+i*.15,.65+i*.15);c.save();c.globalAlpha=cl(s*2);c.translate((1-eo(s))*420,0);rr(70,y,940,250,30,K5.sa);tx('operasi '+(i+1),400,y+34,24,K5.iv,'M');
  d.forEach((h,k)=>{const so=[...d].sort((a,b)=>a-b)[k],hh=lp(h,so,eio(sg(1.5+k*.05,2.4+k*.05)))*eo(sg(.7+k*.04,1.2+k*.04));rr(360+k*80,y+228-hh,60,hh,10,k%2||i==0?K5.co:K5.pe)});c.restore();
  pop(195,y+125,sg(.5+i*.12,1+i*.12),()=>{rr(100,y+38,190,174,26,K5.te);tx('16 MB',195,y+140,40,K5.ink,'M','center',170)})});
 rtx('tiap operasi punya jatahnya sendiri',W/2,1330,52,K5.iv,'B','center',sg(2.5,3),960);rr(240,1355,600*eo(sg(2.8,3.3)),12,6,K5.am)};
const T0=[5.2,6,6.9],DT=[.2,.14,.16],Y6=[540,780,1030],N6=[3,6,11];
const P6=Y6.map((y,l)=>Array.from({length:N6[l]},(_,i)=>[170+(i+.5)*(740/N6[l])+((i*37)%5-2)*8,y+((i*53)%7-3)*14]));
S[5]=()=>{bg(K5.ink);rtx('maintenance_work_mem',W/2,170,64,K5.iv,'B','center',sg(.3,.9));pop(540,225,sg(3.2,3.7),()=>tx('= 128 MB',W/2,245,64,K5.am,'B','center'));
 A(sg(.6,1.2),()=>rr(100,380,880,940,40,null,K5.am,8+10*Math.sin(Math.PI*sg(9.2,9.9)),[24,16]));for(let i=0;i<11;i++)pop(142+i*76,380,sg(.2+i*.07,.6+i*.07),()=>rr(130+i*76,352,24,56,8,K5.am));
 const pn=(l,i)=>eo(sg(T0[l]+i*DT[l],T0[l]+i*DT[l]+.4)),gz=lp(.82,1,eio(sg(6.9,9.2)));c.save();c.translate(540,800);c.scale(gz,gz);c.translate(-540,-800);
 P6.forEach((a,l)=>{A(sg(T0[l]-.3,T0[l]+.2),()=>tx('layer '+(2-l),130,Y6[l]-70,24,K5.pe,'M'));a.forEach((p,i)=>{const q=pn(l,i);if(i)A(q,()=>ln(a[i-1][0],a[i-1][1],p[0],p[1],K5.sl,5));if(i>1&&i%3==0)A(q,()=>ln(a[i-2][0],a[i-2][1],p[0],p[1],K5.dk2,4));
  if(l<2){const j=P6[l+1].reduce((m,z,k)=>Math.abs(z[0]-p[0])<Math.abs(P6[l+1][m][0]-p[0])?k:m,0);A(Math.min(q,pn(l+1,j)),()=>ln(p[0],p[1],P6[l+1][j][0],P6[l+1][j][1],K5.co,4))}})});
 P6.forEach((a,l)=>a.forEach((p,i)=>{const q=pn(l,i);if(q>0)dot(p[0],p[1],(l==2?16:22)*ebo(q),[K5.cr,K5.pe,K5.te][l])}));c.restore();
 rtx('merakit jaring indeks HNSW',W/2,1415,40,K5.iv,'M','center',sg(5.6,6.2));rtx('tidak melampaui limit container',W/2,1470,34,K5.am,'M','center',sg(9.3,9.9))};
S[6]=()=>{bg(K5.iv);rtx('Batas Docker saja',W/2,170,72,K5.iv,'B','center',sg(0,.5));rtx('tidak cukup',W/2,250,72,K5.cr,'B','center',sg(.15,.65));A(sg(.3,.7),()=>tx('ilustrasi proporsi, bukan hasil ukur',W/2,310,26,K5.pe,'M','center'));
 pop(540,450,sg(.1,.5),()=>{rr(90,380,900,140,28,K5.sa);tx('limit container 1536 MB',90,365,26,K5.iv,'M')});
 c.save();c.beginPath();c.roundRect(90,380,900,140,28);c.clip();c.fillStyle=K5.am;c.fillRect(90,380,225*eo(sg(.2,.8)),140);if(U>.7){c.fillStyle=K5.co;c.fillRect(315,380,75*eo(sg(.7,1.2)),140)}A(sg(1,1.3),()=>{c.fillStyle=K5.te;c.fillRect(390,380,12,140)});c.restore();A(sg(.1,.5),()=>rr(90,380,900,140,28,null,K5.sl,8));
 [[K5.am,'shared_buffers 384 MB'],[K5.co,'maintenance_work_mem 128 MB'],[K5.te,'work_mem 16 MB × operasi'],[K5.pe,'max_connections 50']].forEach((l,i)=>pop(500,626+i*88,sg(.8+i*.2,1.3+i*.2),()=>{rr(110,600+i*88,52,52,14,l[0]);tx(l[1],190,642+i*88,34,K5.iv,'M','left',780)}));
 up(sg(1.1,1.7),220,()=>rr(70,1030,940,470,40,K5.am));rtx('Jangan Biarkan PostgreSQL',W/2,1150,60,K5.ink,'B','center',sg(1.7,2.1),880);rtx('Buta Kapasitas!',W/2,1225,60,K5.ink,'B','center',sg(1.9,2.3));
 rtx('Setel shared_buffers=384MB &',W/2,1340,34,K5.ink,'M','center',sg(2.2,2.6),880);rtx('maintenance_work_mem=128MB',W/2,1395,34,K5.ink,'M','center',sg(2.4,2.8),880)};
const TR=[['c',540,960],['w'],['d'],['c',540,960],['w'],['d']];
function tp(k,p,edge){const e=eo(p);c.beginPath();if(k[0]=='c')c.arc(k[1],k[2],e*2300+1,0,7);else if(k[0]=='w'){const y0=H+60-e*(H+160);c.moveTo(0,y0);for(let x=0;x<=W;x+=20)c.lineTo(x,y0+Math.sin(x*.012+p*8)*46);if(!edge){c.lineTo(W,H+10);c.lineTo(0,H+10);c.closePath()}}else{const kk=e*(W+.4*H+30);c.moveTo(kk,0);c.lineTo(kk-.4*H,H);if(!edge){c.lineTo(0,H);c.lineTo(0,0);c.closePath()}}}
const PAL=[['#F6F5EE','#FFC65C'],['#F6F5EE','#FF765E'],['#F6F5EE','#FFC65C'],['#F6F5EE','#A3A5F4'],['#F6F5EE','#16B99A'],['#F6F5EE','#FFC65C'],['#F6F5EE','#16B99A']],HI=/_|\d|MB|PostgreSQL|container|HNSW|RAM|Vector|OOM/;
function cap(t,si){if(!SUB)return;const k=CH.findIndex(q=>t>=q[0]&&t<q[1]);if(k<0)return;const q=CH[k],[bc,pf]=PAL[si],ws=q[2].split(' '),z0=72;c.save();c.font='800 '+z0+'px '+F.B;
 const w0=ws.map(w=>c.measureText(w).width),gap=22,tot=w0.reduce((a,b)=>a+b,0)+gap*(ws.length-1),s=Math.min(1,980/tot),z=z0*s,y=1660,u=t-q[0],o=cl((t-(q[1]-.18))/.18);let x=(W-tot*s)/2;const x0=x;
 ws.forEach((w,i)=>{const p=eo(cl((u-i*.07)/.28)),v=k%4,ww=w0[i]*s;c.save();c.globalAlpha=cl(p*1.4)*(1-o);let dx=0,dy=-o*44;if(v==0)dy+=(1-p)*70;else if(v==1)dy-=(1-p)*70;else if(v==2)dx=-(1-p)*130;else{const sc=ebo(p);c.translate(x+ww/2,y);c.scale(sc,sc);c.translate(-(x+ww/2),-y)}
  c.translate(dx,dy);tx(w,x,y,z,HI.test(w)?pf:bc,'B','left',ww);c.restore();x+=ww+gap*s});
 rr(x0,y+34,tot*s*cl(u/(q[1]-q[0])),8,4,pf);c.restore()}
function renderAt(t, subT){t=cl(t,0,D);let i=B.findIndex((b,k)=>t<B[k+1]);if(i<0)i=6;U=t-B[i];const st=subT!==undefined?subT:t;
 if(i>0&&U<.5){const p=U/.5,k=TR[i-1];U=B[i]-B[i-1];S[i-1]();cap(st,i-1);c.save();tp(k,p,false);c.clip();U=t-B[i];S[i]();cap(st,i);c.restore();if(p>0&&p<1){tp(k,p,true);c.strokeStyle=K5.am;c.lineWidth=18*Math.sin(Math.PI*p)+2;c.lineCap='round';c.stroke()}}else{S[i]();cap(st,i)}}
/* audio */
const SE=[],E=(s,t,k,a)=>SE.push([B[s]+t,k,a]);
[0,1,2,3,4].forEach(i=>E(0,.2+i*.18,'boop',1+i*.14));E(0,0,'slide');E(0,1.1,'ding');E(0,3,'zip');E(0,4,'rise',.6);E(0,4.6,'stamp');
E(1,.5,'boop',.8);E(1,.9,'blip');E(1,1.6,'slide');E(1,2.4,'blip',1.5);E(1,3,'zip',.8);E(1,3.6,'snap');E(1,3.9,'rise',1.8);E(1,4.8,'thud');E(1,4.8,'err');E(1,4.85,'glitch');E(1,5.5,'stamp');
CODE.forEach((l,i)=>{for(let j=0;j<l[0].length;j+=2)E(2,TS[i]+j/55,'tick')});E(2,.4,'slide');[3.2,3.8,4.4,5].forEach(t=>E(2,t,'snap'));[1,1.19,1.33,1.5].forEach((m,i)=>E(2,5.6+i*.3,'ding',m));
E(3,.2,'boop');[0,5,10,15].forEach(k=>E(3,.4+k*.03,'tap',1+k*.02));E(3,1.5,'zip');[0,1,2].forEach(j=>E(3,2.1+j*.15,'blip',1+j*.1));E(3,2.5,'snap');E(3,2.9,'ding');E(3,3.2,'slide');
[0,1,2].forEach(i=>{E(4,.15+i*.15,'slide');E(4,.5+i*.12,'boop',1+i*.2)});for(let k=0;k<8;k++)E(4,1.5+k*.12,'tick');E(4,2.6,'ding',1.3);E(4,2.8,'zip');
for(let i=0;i<11;i++)E(5,.2+i*.07,'tap',1+i*.04);E(5,3.4,'ding');[5.2,6,6.9].forEach((t,i)=>E(5,t,'blip',.8+i*.2));for(let k=0;k<5;k++)E(5,7.2+k*.4,'tap',1.2);E(5,6.9,'rise',2);E(5,9.2,'stamp');E(5,9.2,'whomp');
E(6,.1,'boop');E(6,.2,'zip');E(6,.7,'blip',1.3);[0,1,2,3].forEach(i=>E(6,.8+i*.2,'ding',1+i*.12));E(6,1.1,'slide');E(6,2.2,'chime');E(6,2.3,'sparkle');
const TK={c:['whoosh'],w:['rise','whoosh'],d:['slide','zip']};TR.forEach((k,i)=>TK[k[0]].forEach(n=>E(i+1,0,n,n=='rise'?.5:1)));
const KR=['tap','blip','zip','tap','snap','blip'];CH.forEach((q,i)=>{SE.push([q[0],KR[i%6],.9+(i%3)*.15]);if(/_/.test(q[2]))SE.push([q[0]+.15,'ding',1.2])});
const NB=x=>x._nb||(x._nb=(()=>{const b=x.createBuffer(1,x.sampleRate,x.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return b})());
function sfx(x,d,w,k,a){const env=(g,v,dur,o)=>{g.gain.setValueAtTime(.0001,w+o);g.gain.exponentialRampToValueAtTime(v,w+o+.005);g.gain.exponentialRampToValueAtTime(.0001,w+o+dur)};
 const osc=(ty,f1,f2,dur,v,o=0)=>{const s=x.createOscillator(),g=x.createGain();s.type=ty;s.frequency.setValueAtTime(f1,w+o);s.frequency.exponentialRampToValueAtTime(f2,w+o+dur);env(g,v,dur,o);s.connect(g);g.connect(d);s.start(w+o);s.stop(w+o+dur+.03)};
 const nz=(f1,f2,dur,v,q)=>{const s=x.createBufferSource(),b=x.createBiquadFilter(),g=x.createGain();s.buffer=NB(x);b.type='bandpass';b.Q.value=q;b.frequency.setValueAtTime(f1,w);b.frequency.exponentialRampToValueAtTime(f2,w+dur);env(g,v,dur,0);s.connect(b);b.connect(g);g.connect(d);s.start(w);s.stop(w+dur+.03)};
 const m=a||1;({pop:()=>osc('sine',600*m,1080*m,.16,.5),tick:()=>osc('square',2600,2600,.025,.1),click:()=>osc('square',1800,1800,.05,.16),whoosh:()=>nz(300,3200,.5,.7,.8),thud:()=>{osc('sine',140,40,.3,.9);nz(500,120,.2,.3,.7)},rise:()=>nz(400,2600,a||.8,.4,2),err:()=>{osc('sawtooth',110,110,.4,.12);osc('sawtooth',117,117,.4,.12)},chime:()=>[523,659,784,1047].forEach((f,i)=>osc('sine',f,f,1,.25,i*.06)),
 boop:()=>osc('sine',220*m,330*m,.14,.5),tap:()=>osc('sine',1000*m,650*m,.06,.22),blip:()=>{osc('triangle',880*m,880*m,.07,.25);osc('triangle',1320*m,1320*m,.08,.25,.07)},zip:()=>osc('triangle',300*m,2400*m,.18,.22),snap:()=>nz(3500,7000,.04,.4,1.5),ding:()=>{osc('sine',784*m,784*m,.9,.3);osc('sine',2160*m,2160*m,.5,.1)},sparkle:()=>[1319,1568,1976,2349,2637].forEach((f,i)=>osc('sine',f,f,.15,.15,i*.05)),glitch:()=>{osc('square',440,110,.15,.15);nz(1200,300,.12,.3,2)},whomp:()=>osc('sine',90,45,.5,.9),slide:()=>nz(2200,500,.3,.35,1.2),stamp:()=>{osc('sine',160,50,.25,.8);nz(2500,800,.05,.35,1)}})[k]()}

  function renderScene5(localT, voDur, showSub) {
    SUB = showSub;
    c.setTransform(1, 0, 0, 1, 0, 0);
    const scale = D / (voDur || D);
    const tStruct = cl(Math.min(localT, (voDur || D) - 0.0005) * scale, 0, D - 0.001);
    const tSub = localT < (voDur || D) ? tStruct : (D + (localT - (voDur || D)));
    renderAt(tStruct, tSub);
  }
  function scheduleSfx(ctx, dest, startTime, offset, maxDur) {
    const sv = ctx.createGain(); sv.gain.value = 0.5; sv.connect(dest);
    SE.forEach(([t, k, a]) => {
      if (t >= offset && t < maxDur) sfx(ctx, sv, startTime + (t - offset), k, a);
    });
  }
  function getCues() {
    return CH.map(q => [q[0], q[1], q[2].replace(/_/g, ' ')]);
  }
  return { render: renderScene5, scheduleSfx, getCues, refDur: D };
}

// ============================================================================
// SCENE 6: MENJINAKKAN REDIS CACHE & BULLMQ (EVIKSI VOLATILE-LRU)
// ============================================================================
function createScene6(cv) {
  
const D=44.7527,W=1080,HT=1920,B=[0,7.2,15.3,25.5,33.2,D];
const C={ink:K.ink,ink2:K.bg,ink3:K.surf,iv:K.iv,co:K.cob,te:K.teal,cr:K.cor,am:K.amb,pe:K.peri,sl:K.sl,sa:K.surf};
const BG=[C.ink,C.iv,C.ink,C.pe,C.iv];
const H="'Bricolage Grotesque','Inter',sans-serif",M="'JetBrains Mono','DejaVu Sans Mono',monospace",I="Inter,sans-serif";
const PH=[{"s": 0.58, "e": 2.474, "sc": 0, "w": [["Selanjutnya", 0], ["kita", 0], ["jinakkan", 0], ["kontainer", 1], ["Redis", 1]]}, {"s": 2.534, "e": 3.65, "sc": 0, "w": [["yang", 0], ["memikul", 0], ["tugas", 0], ["ganda", 0]]}, {"s": 3.75, "e": 6.68, "sc": 0, "w": [["di", 0], ["batas", 0], ["memori", 0], ["384", 1], ["MB", 1]]}, {"s": 7.4, "e": 8.835, "sc": 1, "w": [["Database", 0], ["0", 1], ["dipakai", 0], ["untuk", 0]]}, {"s": 8.895, "e": 10.95, "sc": 1, "w": [["antrean", 1], ["ekstraksi", 0], ["dokumen", 0], ["BullMQ", 1]]}, {"s": 11.15, "e": 12.814, "sc": 1, "w": [["sedangkan", 0], ["database", 0], ["1", 1], ["dipakai", 0], ["untuk", 0]]}, {"s": 12.874, "e": 14.7, "sc": 1, "w": [["menyimpan", 0], ["semantic", 1], ["cache", 1], ["jawaban", 0], ["AI", 0]]}, {"s": 15.6, "e": 16.603, "sc": 2, "w": [["Apa", 0], ["jadinya", 0], ["kalau", 0]]}, {"s": 16.663, "e": 17.85, "sc": 2, "w": [["memori", 0], ["Redis", 1], ["penuh?", 1]]}, {"s": 18.55, "e": 19.622, "sc": 2, "w": [["Kalau", 0], ["kita", 0], ["salah", 0], ["memilih", 0]]}, {"s": 19.682, "e": 21.05, "sc": 2, "w": [["kebijakan", 0], ["penghapusan", 1], ["memori", 0]]}, {"s": 21.15, "e": 23.132, "sc": 2, "w": [["Redis", 1], ["bisa", 0], ["membuang", 1], ["antrean", 1], ["dokumen", 0]]}, {"s": 23.192, "e": 25.0, "sc": 2, "w": [["pelanggan", 0], ["yang", 0], ["sedang", 0], ["diproses", 0]]}, {"s": 25.75, "e": 28.093, "sc": 3, "w": [["Karena", 0], ["itu", 0], ["kita", 0], ["jalankan", 0], ["Redis", 1]]}, {"s": 28.152, "e": 30.4, "sc": 3, "w": [["dengan", 0], ["batas", 0], ["maxmemory", 1], ["256", 1], ["MB", 1]]}, {"s": 30.6, "e": 32.8, "sc": 3, "w": [["dan", 0], ["kebijakan", 0], ["volatile-lru", 1]]}, {"s": 33.3, "e": 34.806, "sc": 4, "w": [["Dengan", 0], ["aturan", 0], ["ini", 0], ["saat", 0], ["memori", 0]]}, {"s": 34.866, "e": 36.529, "sc": 4, "w": [["penuh", 1], ["Redis", 1], ["hanya", 0], ["akan", 0], ["menghapus", 0]]}, {"s": 36.589, "e": 37.574, "sc": 4, "w": [["data", 0], ["cache", 1], ["lama", 0], ["yang", 0]]}, {"s": 37.634, "e": 39.2, "sc": 4, "w": [["punya", 0], ["batas", 0], ["waktu", 0], ["kedaluwarsa", 1]]}, {"s": 39.45, "e": 40.815, "sc": 4, "w": [["sementara", 0], ["antrean", 1], ["BullMQ", 1], ["yang", 0]]}, {"s": 40.875, "e": 42.3, "sc": 4, "w": [["tidak", 0], ["punya", 0], ["waktu", 0], ["kedaluwarsa", 1]]}, {"s": 42.45, "e": 44.25+1.8, "sc": 4, "w": [["tetap", 0], ["aman", 1], ["100%", 1]]}];
const cl=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)),seg=(u,a,b)=>cl((u-a)/(b-a));
const eo=x=>1-Math.pow(1-x,3),eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2,ebo=x=>1+2.4*Math.pow(x-1,3)+1.4*Math.pow(x-1,2),lerp=(a,b,t)=>a+(b-a)*t;
const mix=(a,b,t)=>{const f=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),p=f(a),q=f(b);return`rgb(${p.map((v,i)=>Math.round(v+(q[i]-v)*t)).join()})`};
const c=cv.getContext('2d');
function rr(x,y,w,h,r,f,s,lw){c.beginPath();c.roundRect(x,y,w,h,Math.max(0,Math.min(r,w/2,h/2)));if(f){c.fillStyle=f;c.fill()}if(s){c.strokeStyle=s;c.lineWidth=lw||6;c.lineCap='round';c.stroke()}}
function tx(t,x,y,z,col,fm,al){c.font=`${fm==M?700:fm==I?600:800} ${z}px ${fm||H}`;c.fillStyle=col;c.textAlign=al||'center';c.textBaseline='middle';c.fillText(t,x,y)}
function wrap(t,x,y,mw,lh,z,col,fm){c.font=`${fm==I?600:800} ${z}px ${fm||H}`;let L=[],l='';t.split(' ').forEach(w=>{const k=l?l+' '+w:w;if(c.measureText(k).width>mw){L.push(l);l=w}else l=k});L.push(l);L.forEach((s,i)=>tx(s,x,y+(i-(L.length-1)/2)*lh,z,col,fm))}
function A(a,fn){if(a<=0)return;c.save();c.globalAlpha=cl(a);fn();c.restore()}
function pop(cx,cy,p,fn){if(p<=0)return;c.save();c.translate(cx,cy);const s=ebo(p);c.scale(s,s);c.translate(-cx,-cy);fn();c.restore()}
function rise(u,a,b,fn){const p=eo(seg(u,a,b));if(p<=0)return;c.save();c.globalAlpha=p;c.translate(0,(1-p)*44);fn();c.restore()}
function typ(s,p){const n=Math.floor(s.length*p);return s.slice(0,n)+(p>0&&p<1?'▌':'')}
function head(n,t,s,dk){c.beginPath();c.arc(110,170,44,0,7);c.fillStyle=C.am;c.fill();tx(n,110,172,48,C.ink);tx(t,180,160,54,C.iv,H,'left');tx(s,180,224,28,C.pe,M,'left')}
function clock(x,y,r,col,a){c.beginPath();c.arc(x,y,r,0,7);c.strokeStyle=col;c.lineWidth=6;c.stroke();c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.sin(a)*r*.7,y-Math.cos(a)*r*.7);c.moveTo(x,y);c.lineTo(x+Math.sin(a/12)*r*.45,y-Math.cos(a/12)*r*.45);c.stroke()}
function lock(x,y,col){rr(x-18,y,36,30,8,col);c.beginPath();c.arc(x,y,13,Math.PI,0);c.strokeStyle=col;c.lineWidth=6;c.stroke()}
function card(x,y,w,h,col,t,ic,ang){rr(x,y,w,h,26,col);tx(t,x+(ic?w/2+20:w/2),y+h/2,26,C.iv,M);if(ic=='k')lock(x+44,y+h/2-12,C.iv);if(ic=='c')clock(x+46,y+h/2,20,C.iv,ang||0)}
function slide(u,a,b,dx,fn){const p=eo(seg(u,a,b));if(p<=0)return;c.save();c.globalAlpha=p;c.translate((1-p)*dx,0);fn();c.restore()}
const SC=[
(u)=>{
 A(seg(u,0,.4),()=>head('1','Satu kontainer, dua tugas','rag-redis · jinakkan Redis',1));
 const pc=seg(u,.3,1);pop(540,880,pc,()=>rr(100,430,880,900,44,C.ink3,C.te,8));
 pop(290,429,seg(u,.9,1.4),()=>{rr(140,396,300,64,22,C.te);tx('rag-redis',290,429,30,C.ink,M)});
 pop(790,429,seg(u,3.1,3.6),()=>{rr(640,396,300,64,32,C.am);tx('limit 384 MB',790,429,28,C.ink,M)});
 const sp=eio(seg(u,1.8,3)),da=seg(u,2.6,3.2);
 [[150,C.co,'DB 0','Antrean BullMQ'],[550,C.te,'DB 1','Semantic Cache']].forEach(([x,col,a,b],k)=>{A(seg(u,1.6,2),()=>{const xx=lerp(350,x,sp);rr(xx,510,380,540,32,col);tx(a,xx+190,580,54,C.iv,M);A(da,()=>{for(let i=0;i<3;i++){rr(xx+50,640+i*80,280,56,28,'rgba(246,245,238,.28)');c.beginPath();c.arc(xx+84,668+i*80,12,0,7);c.fillStyle=C.iv;c.fill()}tx(b,xx+190,960,34,C.iv,I)})})});
 A(seg(u,3.4,3.8),()=>{rr(150,1110,780,76,38,C.ink2);rr(150,1110,Math.max(0,560*eo(seg(u,3.6,5))),76,38,C.co);tx('memori Redis',190,1148,26,C.iv,M,'left')});
 rise(u,4.7,5.3,()=>tx('1 kontainer',540,1400,100,C.iv));rise(u,5.5,6.1,()=>{tx('2 peran berbeda',540,1500,64,C.am);tx('antrean pekerjaan + cache jawaban AI',540,1590,28,C.pe,I)})},
(u,t)=>{
 A(seg(u,0,.4),()=>head('2','Dua database, dua sifat','DB 0 permanen · DB 1 kedaluwarsa'));
 pop(290,880,seg(u,.2,.8),()=>{rr(60,360,460,1040,36,C.sa);rr(60,360,460,100,36,C.co);tx('DB 0 · BullMQ',290,412,34,C.iv,M)});
 pop(790,880,seg(u,3.9,4.5),()=>{rr(560,360,460,1040,36,C.sa);rr(560,360,460,100,36,C.te);tx('DB 1 · Cache',790,412,34,C.iv,M)});
 for(let i=0;i<4;i++){slide(u,.7+i*.45,1.3+i*.45,-420,()=>card(90,500+i*190,400,150,C.co,'job: ekstrak-pdf','k'));
  slide(u,4.3+i*.45,4.9+i*.45,420,()=>{card(590,500+i*190,400,150,C.te,'jawaban AI','c',t*2+i);tx('TTL 1 jam',900,525+i*190,20,C.iv,M)})}
 pop(290,1310,seg(u,2.6,3.1),()=>{rr(90,1270,400,80,40,C.am);tx('tanpa TTL = permanen',290,1310,24,C.ink,M)});
 pop(790,1310,seg(u,6.3,6.8),()=>{rr(590,1270,400,80,40,C.cr);tx('ber-TTL = bisa habis',790,1310,24,C.iv,M)});
 rise(u,6.8,7.4,()=>{tx('Dokumen pelanggan yang sedang diproses ada di DB 0',540,1500,36,C.iv);tx('contoh ilustrasi',540,1570,24,C.pe,M)})},
(u)=>{
 A(seg(u,0,.4),()=>head('3','Memori penuh, lalu?','salah kebijakan = antrean ikut hilang',1));
 const f=eio(seg(u,.3,2.4));rr(100,470,260,860,40,C.ink2,C.sl,6);
 if(f>0){c.save();c.beginPath();c.roundRect(120,490,220,820,30);c.clip();c.fillStyle=C.te;c.fillRect(120,1310-820*f,220,820*f);c.globalAlpha=seg(f,.6,1);c.fillStyle=C.cr;c.fillRect(120,1310-820*f,220,820*f);c.restore()}
 for(let i=0;i<6;i++)rr(300,530+i*130,40,8,4,C.ink2);
 const zp=seg(u,2.5,2.9);if(zp>0){c.save();c.translate((Math.sin(u*70)*6)*(1-seg(u,2.9,3.4)),0);c.globalAlpha=1-seg(u,3.6,4);c.beginPath();[[230,360],[200,410],[240,420],[205,470]].forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.strokeStyle=C.am;c.lineWidth=14;c.lineJoin='round';c.stroke();c.restore()}
 rise(u,2.4,3,()=>{tx('PENUH',230,1400,52,C.cr);tx('seperti sekring jepret',230,1470,26,C.pe,I)});
 [520,700,880].forEach((y,i)=>{slide(u,1+i*.4,1.6+i*.4,400,()=>{const q=i==1?eio(seg(u,4.8,5.8)):0;c.save();if(q>0){rr(470,y,500,150,26,null,C.cr,5);c.translate(720+q*420,y+75);c.rotate(.18*q);c.translate(-720,-y-75);c.globalAlpha=1-q*.7}card(470,y,500,150,C.co,'job: ekstrak-pdf','k');c.restore()})});
 const sp=seg(u,3.25,4.2);if(sp>0){c.save();c.setLineDash([200,400]);c.lineDashOffset=200*(1-eo(sp));c.beginPath();c.arc(430,780,170,-.5,.5);c.strokeStyle=C.cr;c.lineWidth=14;c.stroke();c.restore()}
 pop(930,775,seg(u,5.9,6.4),()=>{c.beginPath();c.arc(930,775,46,0,7);c.fillStyle=C.cr;c.fill();c.strokeStyle=C.iv;c.lineWidth=10;c.beginPath();c.moveTo(912,757);c.lineTo(948,793);c.moveTo(948,757);c.lineTo(912,793);c.stroke()});
 rise(u,6.4,7,()=>tx('Antrean pelanggan terhapus!',700,1250,40,C.cr));rise(u,7.4,8,()=>tx('kebijakan penghapusan salah pilih',700,1320,26,C.pe,I))},
(u)=>{
 A(seg(u,0,.4),()=>head('4','Batasi dan pilih aturannya','maxmemory + volatile-lru'));
 const tp=eo(seg(u,.1,.8));if(tp>0){c.save();c.globalAlpha=tp;c.translate(0,(1-tp)*140);rr(60,370,960,560,36,C.ink,C.ink3,5);[C.cr,C.am,C.te].forEach((k,i)=>{c.beginPath();c.arc(120+i*44,424,13,0,7);c.fillStyle=k;c.fill()});
 tx(typ('$ redis-server',seg(u,.8,1.6)),110,530,40,C.iv,M,'left');tx(typ('--maxmemory 256mb',seg(u,2.4,4)),150,620,40,C.am,M,'left');tx(typ('--maxmemory-policy',seg(u,4.2,5)),150,710,40,C.iv,M,'left');
 const w=eio(seg(u,5.1,5.8));if(w>0){c.save();c.beginPath();c.rect(130,750,520*w,90);c.clip();rr(130,750,520,90,24,C.te);tx('volatile-lru',390,796,46,C.ink,M);c.restore()}c.restore()}
 pop(540,1140,seg(u,3,3.5),()=>{rr(60,1060,960,160,44,C.ink3,C.sl,6);const iw=lerp(920,573,eio(seg(u,3.6,4.6)));rr(80,1080,iw,120,32,C.co);tx('maxmemory 256 MB',80+iw/2,1140,30,C.iv,M);
  const ha=seg(u,4.4,5);if(ha>0){c.save();c.globalAlpha=ha;c.beginPath();c.roundRect(80+iw+14,1080,986-iw-80-14,120,32);c.clip();c.strokeStyle=C.sl;c.lineWidth=6;for(let x=600;x<1040;x+=34){c.beginPath();c.moveTo(x,1200);c.lineTo(x+60,1080);c.stroke()}c.restore()}});
 rise(u,5.6,6.2,()=>tx('limit kontainer 384 MB',540,1290,36,C.iv));rise(u,6.4,7,()=>tx('sisa ruang untuk proses Redis',540,1350,26,C.pe,I))},
(u,t)=>{
 A(seg(u,0,.4),()=>head('5','volatile-lru bekerja','hanya data ber-TTL yang dibuang'));
 pop(540,760,seg(u,.1,.7),()=>rr(60,330,960,860,44,C.sa,C.sl,6));
 const qs=[0,1,2].map(i=>eio(seg(u,2.6+i,3.4+i))),av=(qs[0]+qs[1]+qs[2])/3;
 A(seg(u,.5,1),()=>{rr(100,365,880,44,22,C.ink);rr(100,365,Math.max(0,880*lerp(seg(u,.6,1.5),.5,av)),44,22,av<.34?C.cr:av<.99?C.am:C.te);tx(av<.99?'256 MB penuh':'ada ruang lagi',540,388,24,C.ink,M)});
 pop(785,520,seg(u,1.6,2.1),()=>{rr(745,500,80,80,26,C.cr);c.beginPath();c.arc(785,455,34,0,7);c.fillStyle=C.ink;c.fill();c.strokeStyle=C.iv;c.lineWidth=6;c.stroke();rr(752,415,66,20,10,C.am)});
 A(seg(u,2,2.5),()=>{const a=seg(u,2.6,5.6),sw=a>0&&a<1?.35*Math.sin(u*8):0;c.save();c.translate(830,540);c.rotate(sw);c.beginPath();c.moveTo(0,0);c.lineTo(90,90);c.strokeStyle=C.iv;c.lineWidth=8;c.stroke();rr(70,85,70,24,10,C.am);c.restore();tx('petugas Redis',900,470,22,C.iv,M)});
 for(let i=0;i<3;i++){const y=640+i*165;slide(u,.6+i*.15,1.1+i*.15,-300,()=>card(100,y,380,130,C.co,'job: ekstrak-pdf','k'));
  slide(u,.8+i*.15,1.3+i*.15,300,()=>{c.save();c.translate(qs[i]*480,0);c.globalAlpha=1-qs[i];card(540,y,380,130,C.te,'jawaban AI','c',t*2+i);c.restore()})}
 const sp=eo(seg(u,6.3,7));if(sp>0){c.save();c.translate(0,(1-sp)*-300);c.globalAlpha=sp;c.beginPath();c.moveTo(290,625);c.lineTo(190,640);c.lineTo(190,1130);c.lineTo(290,1155);c.lineTo(390,1130);c.lineTo(390,640);c.closePath();c.fillStyle='rgba(22,185,154,.18)';c.strokeStyle=C.te;c.lineWidth=8;c.lineJoin='round';c.fill();c.stroke();c.restore()}
 pop(290,1130,seg(u,7,7.5),()=>{rr(160,1100,260,60,30,C.te);tx('100% aman',290,1130,26,C.ink,M)});
 const bp=eo(seg(u,8,8.8));if(bp>0){c.save();c.globalAlpha=bp;c.translate(0,(1-bp)*300);rr(60,1260,960,360,40,C.am);wrap('Rahasia Redis Peran Ganda: Pakai Kebijakan volatile-lru Agar Antrean BullMQ Tidak Ikut Terhapus!',540,1440,860,66,46,C.ink);c.restore()}}
];
function shapeP(i,p){const e=eo(p),P=new Path2D();
 if(i==1)P.arc(540,1160,e*1800,0,7);
 else if(i==2){const y0=HT*(1-e)-60;P.moveTo(0,HT);P.lineTo(0,y0);for(let x=0;x<=W;x+=30)P.lineTo(x,y0+Math.sin(x*.012+p*9)*50*Math.sin(Math.PI*p));P.lineTo(W,HT)}
 else if(i==3){const g=e*(W+HT*.6);P.moveTo(0,0);P.lineTo(g-HT*.6,0);P.lineTo(g,HT);P.lineTo(0,HT)}
 else P.arc(540,960,e*1900,0,7);
 P.closePath();return P}
function scene(i,t,subT){const u=t-B[i],z=1+.05*Math.sin(Math.PI*seg(u,1,B[i+1]-B[i]-.6));drawThemeBg(c,W,HT);c.save();c.translate(540,900);c.scale(z,z);c.translate(-540,-900);c.translate(43,36);c.scale(.92,.92);SC[i](u,t);caption(i,subT!==undefined?subT:t);c.restore()}
const CAPY=[1730,1700,1640,1560,1730],ACC=[C.am,C.te,C.cr,C.am,C.te];
function caption(i,t){if(!SHOW)return;const base=C.iv;PH.forEach((p,pi)=>{if(p.sc!=i||t<p.s||t>p.e)return;
 let z=64,g,ws,tot;const M_=()=>{c.font=`800 ${z}px ${H}`;ws=p.w.map(w=>c.measureText(w[0]).width);g=z*.3;tot=ws.reduce((a,b)=>a+b,0)+g*(p.w.length-1)};M_();while(tot>940&&z>38){z-=2;M_()}
 const ex=seg(t,p.e-.18,p.e),y0=CAPY[i]-eo(ex)*30,st=pi%4;let x=540-tot/2;
 p.w.forEach((w,k)=>{const q=seg(t,p.s+k*.07,p.s+k*.07+.24),wx=x;x+=ws[k]+g;if(q<=0)return;const e=eo(q);c.save();c.globalAlpha=e*(1-ex);let dx=0,dy=0,sc=1;if(st==0)dy=(1-e)*60;else if(st==1)dy=-(1-e)*60;else if(st==2)dx=-(1-e)*100;else sc=ebo(q);
  c.translate(wx+ws[k]/2+dx,y0+dy);c.scale(sc,sc);tx(w[0],0,0,z,w[1]?ACC[i]:base,H);c.restore()});
 c.save();c.globalAlpha=1-ex;rr(540-tot/2,y0+z*.78,tot,8,4,'rgba(115,129,154,.35)');rr(540-tot/2,y0+z*.78,Math.max(0,tot*seg(t,p.s,p.e)),8,4,ACC[i]);c.restore()})}
let SHOW=true;
function renderAt(t,subT){t=cl(t,0,D-.001);if(subT===undefined)subT=t;let i=B.findIndex((b,j)=>t>=b&&t<B[j+1]);const u=t-B[i];
 if(i>0&&u<.5){scene(i-1,t,subT);const p=u/.5,P=shapeP(i,p);c.save();c.clip(P);scene(i,t,subT);c.restore();c.strokeStyle=C.am;c.lineWidth=18*Math.sin(Math.PI*p)+2;c.stroke(P)}else scene(i,t,subT);
 }
// ---- audio
const SFX=[];const E=(t,k)=>SFX.push([t,k]);
E(7.15,'zoom');E(15.25,'wave');E(25.45,'zip');E(33.15,'whoosh');
E(.3,'whoosh');E(.65,'thud');E(.95,'blip');E(1.8,'zip');E(2.9,'lock');E(2.7,'tap');E(2.8,'tap');E(3.1,'bubble');E(3.1,'ding');E(3.6,'rise');E(3.7,'ratchet');E(4.8,'stamp');E(5.5,'pop');E(5.7,'sparkle');
E(7.4,'pop');for(let i=0;i<4;i++){E(7.9+i*.45,'swish');E(8.35+i*.45,'lock');E(11.5+i*.45,'swish');E(11.95+i*.45,'clocktick')}E(9.8,'ding');E(11.15,'bubble');E(13.5,'warn');E(14.05,'stamp');
E(15.6,'rise');E(15.8,'ratchet');E(16.3,'swish');E(16.7,'swish');E(17.1,'swish');E(17.8,'zap');E(18.05,'warn');E(18.55,'whoosh');E(20.1,'snap');E(20.2,'zip');E(20.7,'boing');E(21.2,'err');E(21.7,'stamp');E(22.7,'drip');
E(25.6,'swish');for(let i=0;i<14;i++)E(26.3+i*.057,'tick');for(let i=0;i<17;i++)E(27.9+i*.094,'tick');for(let i=0;i<18;i++)E(29.7+i*.044,'tick');
E(28.5,'pop');E(29,'whirr');E(29.9,'tap');E(30.6,'zip');E(31.1,'ding');E(31.9,'blip');
E(33.3,'pop');E(33.7,'rise');E(34.8,'boing');[35.8,36.8,37.8].forEach(t=>{E(t-.3,'swish');E(t,'snap');E(t+.15,'drip')});E(39.5,'shield');E(40.2,'ding');E(40.3,'sparkle');E(41.2,'whoosh');E(42,'chime');
PH.forEach((p,i)=>E(p.s,'w'+(i%4)));
SFX.sort((a,b)=>a[0]-b[0]);
if(PH.length)PH[PH.length-1].e+=1.8;
function noise(ctx){const n=ctx.sampleRate*2,b=ctx.createBuffer(1,n,ctx.sampleRate),d=b.getChannelData(0);let s=7;for(let i=0;i<n;i++){s=(s*16807)%2147483647;d[i]=s/1073741823-1}return b}
function sfx(ctx,out,t0,k,nb){
 const n=(ty,f1,f2,d,v,o=0)=>{const s=t0+o,os=ctx.createOscillator(),g=ctx.createGain();os.type=ty;os.frequency.setValueAtTime(f1,s);os.frequency.exponentialRampToValueAtTime(f2,s+d);g.gain.setValueAtTime(.0001,s);g.gain.exponentialRampToValueAtTime(v,s+.005);g.gain.exponentialRampToValueAtTime(.0001,s+d);os.connect(g);g.connect(out);os.start(s);os.stop(s+d+.02)};
 const z=(f1,f2,d,v,ty='bandpass',o=0,q=1.2)=>{const s=t0+o,b=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();b.buffer=nb;f.type=ty;f.Q.value=q;f.frequency.setValueAtTime(f1,s);f.frequency.exponentialRampToValueAtTime(f2,s+d);g.gain.setValueAtTime(.0001,s);g.gain.linearRampToValueAtTime(v,s+d*.35);g.gain.exponentialRampToValueAtTime(.0001,s+d);b.connect(f);f.connect(g);g.connect(out);b.start(s);b.stop(s+d+.02)};
 if(k[0]=='w'&&k.length==2)return n('sine',700+Number(k[1])*110,680+Number(k[1])*110,.05,.1);
 switch(k){
 case'whoosh':z(300,3200,.5,.5);break;case'swish':z(1800,7000,.16,.35);break;case'zoom':z(200,4500,.7,.5);break;
 case'wave':z(150,2200,.9,.5,'lowpass',0,.8);n('sine',120,60,.5,.25);break;case'zip':n('sawtooth',250,2000,.22,.14);z(1500,6000,.2,.2);break;
 case'pop':n('sine',600,1080,.16,.5);break;case'blip':n('triangle',660,990,.08,.35);n('triangle',990,1320,.08,.35,.07);break;
 case'ding':n('sine',1320,1318,.7,.3);n('sine',2640,2636,.4,.1);break;case'bubble':n('sine',300,900,.12,.4);n('sine',400,1100,.1,.3,.1);break;
 case'lock':n('square',700,500,.04,.2);n('square',1100,800,.05,.2,.09);n('sine',120,70,.12,.4,.09);break;case'tap':n('sine',900,700,.04,.3);break;
 case'tick':n('square',2600,2400,.025,.1);break;case'clocktick':n('square',1400,1200,.02,.12);n('square',1000,900,.02,.1,.12);break;
 case'thud':n('sine',140,40,.3,.8);z(600,100,.2,.3,'lowpass');break;case'stamp':n('sine',200,50,.25,.8);z(3000,800,.06,.4,'highpass');break;
 case'snap':z(3000,9000,.07,.5,'highpass');n('square',2200,900,.05,.2);break;case'boing':n('sine',220,520,.18,.45);n('sine',520,260,.2,.35,.17);break;
 case'rise':z(400,2600,1.2,.35);break;case'ratchet':for(let i=0;i<8;i++)n('square',900+i*80,850+i*80,.02,.1,i*.09);break;
 case'zap':n('square',900,90,.22,.25);z(2000,6000,.15,.3);break;case'warn':n('sawtooth',600,590,.12,.12);n('sawtooth',450,440,.12,.12,.14);break;
 case'err':n('sawtooth',110,105,.45,.22);n('sawtooth',117,110,.45,.22);break;case'whirr':n('sawtooth',900,200,.5,.12);z(2000,300,.5,.25);break;
 case'drip':n('sine',1500,600,.1,.35);break;case'shield':n('sine',400,800,.25,.3);n('sine',600,1200,.3,.25,.1);z(2000,6000,.4,.2);break;
 case'sparkle':for(let i=0;i<6;i++)n('sine',2000+(i*377)%1500,2000+(i*377)%1500+200,.15,.12,i*.05);break;
 case'chime':[523,659,784,1047].forEach((f,i)=>n('sine',f,f+1,1.4,.18,i*.06));break}}

  function renderScene6(localT, voDur, showSub) {
    SHOW = showSub;
    c.setTransform(1, 0, 0, 1, 0, 0);
    const scale = D / (voDur || D);
    const tStruct = cl(Math.min(localT, (voDur || D) - 0.0005) * scale, 0, D - 0.001);
    const tSub = localT < (voDur || D) ? tStruct : (D + (localT - (voDur || D)));
    renderAt(tStruct, tSub);
  }
  function scheduleSfx(ctx, dest, startTime, offset, maxDur) {
    const sg = ctx.createGain(); sg.gain.value = 0.35; sg.connect(dest);
    const nb = noise(ctx);
    SFX.forEach(([t, k]) => {
      if (t >= offset && t < maxDur) sfx(ctx, sg, startTime + (t - offset), k, nb);
    });
  }
  function getCues() {
    return PH.map(p => [p.s, p.e, p.w.map(x => Array.isArray(x) ? x[0] : x.w).join(' ')]);
  }
  return { render: renderScene6, scheduleSfx, getCues, refDur: D };
}

// ============================================================================
// SCENE 7: KEAMANAN PORT LOCALHOST (127.0.0.1) & HEALTHCHECK SERVICE_HEALTHY
// ============================================================================
function createScene7(cv) {
  
const W=1080,H=1920,FPS=30;
const c=cv.getContext('2d');
const C={ink:K.ink,ink2:K.ink,ink3:K.surf,iv:K.iv,cob:K.cob,teal:K.teal,cor:K.cor,amb:K.amb,peri:K.peri,sl:K.sl,sand:K.surf};
const F={B:'"Bricolage Grotesque",system-ui,sans-serif',M:'"JetBrains Mono",ui-monospace,monospace',I:'Inter,system-ui,sans-serif'};
const CUES=[[0.12,4.55,"Dua detail terakhir di Docker Compose ini sering menjadi penyelamat di server produksi."],[4.85,5.6,"Pertama,"],[6.0,11.5,"jangan pernah menulis pemetaan port database hanya dengan angka 5432:5432,"],[11.9,16.45,"karena Docker akan membelokkan aturan iptables dan membuka database-mu ke internet publik"],[16.55,18.85,"meskipun firewall UFW sudah menyala."],[19.35,22.85,"Selalu ikat ke alamat lokal 127.0.0.1,"],[23.0,26.15,"agar database hanya bisa diakses dari dalam VPS."],[26.6,27.35,"Kedua,"],[27.55,31.75,"pasang fitur healthcheck menggunakan pg_isready dan redis-cli ping,"],[32.05,35.05,"sehingga kontainer Express.js kita baru akan dinyalakan"],[35.15,38.85,"setelah database dan Redis benar-benar sehat dan siap menerima sambungan."]];
let D=39.054875;
const B=[0,5.8,11.9,19.0,26.4,32.0,35.1];const TR=.55;
/* ---------- util ---------- */
const cl=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)),seg=(u,a,b)=>cl((u-a)/(b-a)),lerp=(a,b,p)=>a+(b-a)*p;
const eo=x=>1-Math.pow(1-x,3),eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2,ebo=x=>1+2.4*Math.pow(x-1,3)+1.4*Math.pow(x-1,2);
const hx=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const mix=(a,b,p)=>{const A=hx(a),Bb=hx(b);return`rgb(${A.map((v,i)=>Math.round(lerp(v,Bb[i],p))).join(',')})`};
function pop(cx,cy,p,fn){if(p<=0)return;c.save();c.translate(cx,cy);const s=ebo(cl(p));c.scale(s,s);c.translate(-cx,-cy);fn();c.restore()}
function A(a,fn){if(a<=0)return;c.save();c.globalAlpha=cl(a);fn();c.restore()}
function T(s,x,y,z,col,wt,al,f){c.font=`${wt||800} ${z}px ${F[f||'B']}`;c.fillStyle=col;c.textAlign=al||'left';c.textBaseline='alphabetic';c.fillText(s,x,y);return c.measureText(s).width}
function rtx(s,x,y,z,col,wt,al,f,p){if(p<=0)return;c.save();c.beginPath();c.rect(0,y-z*1.05,W,z*1.45);c.clip();c.translate(0,(1-eo(p))*z*1.2);T(s,x,y,z,col,wt,al,f);c.restore()}
const rr=(x,y,w,h,r,f,s,lw)=>{c.beginPath();c.roundRect(x,y,w,h,r);if(f){c.fillStyle=f;c.fill()}if(s){c.strokeStyle=s;c.lineWidth=lw||6;c.stroke()}};
const bg=col=>{drawThemeBg(c,W,H)};
const plen=p=>{let L=0;for(let i=1;i<p.length;i++)L+=Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]);return L};
function path(pts){c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1])}
function line(pts,col,lw,dash,off){path(pts);c.strokeStyle=col;c.lineWidth=lw;c.lineCap='round';c.lineJoin='round';c.setLineDash(dash||[]);c.lineDashOffset=off||0;c.stroke();c.setLineDash([]);c.lineDashOffset=0}
function grow(pts,col,lw,p){if(p<=0)return;const L=plen(pts);path(pts);c.strokeStyle=col;c.lineWidth=lw;c.lineCap='round';c.lineJoin='round';c.setLineDash([L+2,L+2]);c.lineDashOffset=(L+2)*(1-cl(p));c.stroke();c.setLineDash([]);c.lineDashOffset=0}
function at(pts,s){const L=plen(pts);let d=s*L;for(let i=1;i<pts.length;i++){const l=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);if(d<=l||i===pts.length-1){const k=cl(d/l);return[lerp(pts[i-1][0],pts[i][0],k),lerp(pts[i-1][1],pts[i][1],k)]}d-=l}}
function arrow(x,y,a,s,col){c.save();c.translate(x,y);c.rotate(a);c.beginPath();c.moveTo(0,0);c.lineTo(-s,-s*.6);c.lineTo(-s,s*.6);c.closePath();c.fillStyle=col;c.fill();c.restore()}
function dot(x,y,r,col){c.beginPath();c.arc(x,y,r,0,7);c.fillStyle=col;c.fill()}
function cyl(cx,cy,w,h,col,top){const rx=w/2,ry=h*.15;c.fillStyle=col;c.beginPath();c.moveTo(cx-rx,cy-h/2+ry);c.lineTo(cx-rx,cy+h/2-ry);c.ellipse(cx,cy+h/2-ry,rx,ry,0,Math.PI,0,true);c.lineTo(cx+rx,cy-h/2+ry);c.ellipse(cx,cy-h/2+ry,rx,ry,0,0,Math.PI,true);c.closePath();c.fill();
 c.strokeStyle='rgba(14,23,39,.28)';c.lineWidth=5;for(const k of[.34,.66]){c.beginPath();c.ellipse(cx,cy-h/2+ry+(h-2*ry)*k,rx,ry,0,0,Math.PI);c.stroke()}
 c.fillStyle=top||col;c.beginPath();c.ellipse(cx,cy-h/2+ry,rx,ry,0,0,7);c.fill()}
function cloud(cx,cy,s,col){c.fillStyle=col;for(const[a,b,r]of[[-70,12,44],[-10,-22,62],[56,-4,50],[100,22,34]]){c.beginPath();c.arc(cx+a*s,cy+b*s,r*s,0,7);c.fill()}rr(cx-100*s,cy+8*s,230*s,48*s,24*s,col)}
function lock(cx,cy,s,col){c.strokeStyle=col;c.lineWidth=12*s;c.lineCap='round';c.beginPath();c.arc(cx,cy-18*s,28*s,Math.PI,0);c.stroke();rr(cx-42*s,cy-18*s,84*s,70*s,16*s,col);dot(cx,cy+10*s,8*s,C.ink);rr(cx-3*s,cy+10*s,6*s,20*s,3*s,C.ink)}
function mark(x,y,ok,s){dot(x,y,s,ok?C.teal:C.cor);c.strokeStyle=C.iv;c.lineWidth=s*.2;c.lineCap='round';c.lineJoin='round';c.beginPath();if(ok){c.moveTo(x-s*.42,y);c.lineTo(x-s*.1,y+s*.32);c.lineTo(x+s*.46,y-s*.32)}else{c.moveTo(x-s*.34,y-s*.34);c.lineTo(x+s*.34,y+s*.34);c.moveTo(x+s*.34,y-s*.34);c.lineTo(x-s*.34,y+s*.34)}c.stroke()}
function chip(x,y,n,col){dot(x,y,34,col);T(n,x,y+14,40,C.ink,800,'center')}
function pill(x,y,w,h,col,s,tc,z){rr(x,y,w,h,h/2,col);T(s,x+w/2,y+h/2+(z||22)*.36,z||22,tc,700,'center','M')}
function tag(txt,col,tc,u,a){const w=txt.length*15+56;pop(60+w/2,136,seg(u,a,a+.4),()=>pill(60,110,w,52,col,txt,tc,22))}
const typ=(s,u,a,cps)=>s.slice(0,Math.floor(cl((u-a)*cps,0,s.length)));
function caret(s,u,a,cps,x,y,z,col,w0){const n=s.length;if(u<a||u>a+n/cps+.35)return;if(Math.floor(u*4)%2===0||u<a+n/cps)rr(x+w0+6,y-z*.8,Math.max(5,z*.07),z*.9,3,col)}
function slideUp(u,a,b,dy,fn){const p=eo(seg(u,a,b));A(p,()=>{c.save();c.translate(0,(1-p)*dy);fn();c.restore()})}
let CAMZ={z:1,fx:540,fy:960};const mp=(x,y)=>[CAMZ.fx+(x-CAMZ.fx)*CAMZ.z,CAMZ.fy+(y-CAMZ.fy)*CAMZ.z];
function cam(u,K){let a=K[0],b=K[0];for(let i=0;i<K.length-1;i++)if(u>=K[i][0]&&u<=K[i+1][0]){a=K[i];b=K[i+1];break}if(u>K[K.length-1][0])a=b=K[K.length-1];const p=a===b?1:eio(seg(u,a[0],b[0]));const z=lerp(a[1],b[1],p),fx=lerp(a[2],b[2],p),fy=lerp(a[3],b[3],p);CAMZ={z,fx,fy};c.translate(fx,fy);c.scale(z,z);c.translate(-fx,-fy)}
/* kode: jadwal ketik bersama untuk visual dan SFX */
function codeTimes(L,t0,cps){const o=[];let t=t0;for(const l of L){o.push(t);t+=l.t.length/cps+.12}return o}
function codeBlock(x,y,w,h,L,z,u,t0,cps,hls){rr(x,y,w,h,36,C.ink2);[C.cor,C.amb,C.teal].forEach((d,i)=>dot(x+44+i*30,y+42,9,d));T('docker-compose.yml',x+w-36,y+48,22,C.sl,500,'right','M');
 const tt=codeTimes(L,t0,cps);let yy=y+120;const lh=z*1.75;
 L.forEach((l,i)=>{for(const hh of hls||[])if(hh.i===i){const p=eo(seg(u,hh.a,hh.b));if(p>0){c.save();c.beginPath();c.rect(x+16,yy-z*1.2,(w-32)*p,z*1.7);c.clip();rr(x+16,yy-z*1.15,w-32,z*1.6,14,hh.col);c.restore()}}
  const s=typ(l.t,u,tt[i],cps);const wd=T(s,x+40,yy,z,l.c||C.iv,500,'left','M');if(u>=tt[i]&&u<tt[i]+l.t.length/cps+.01)caret(s,u,tt[i],cps,x+40,yy,z,C.amb,wd);yy+=lh})}
/* ---------- scene ---------- */
const S=[];
const S1L=[{t:'services:'},{t:'  db:'},{t:'    image: pgvector/pgvector'},{t:'    ports:',c:C.sl},{t:'      - "5432:5432"'}];
const S5L=[{t:'postgres:'},{t:'  healthcheck:'},{t:'    test: pg_isready'},{t:'redis:'},{t:'  healthcheck:'},{t:'    test: redis-cli ping'}];
const S4TXT='- "127.0.0.1:5432:5432"';
/* S1 */
S[0]=u=>{bg(C.ink);cam(u,[[0,1,540,700],[3,1.03,540,800],[5.8,1.05,540,1100]]);
 tag('SERI RAG · BAGIAN 2',C.ink3,C.peri,u,.05);
 const a1=typ('Awas Jebakan',u,.2,22),a2=typ('Firewall Docker!',u,.9,24);
 const w1=T(a1,60,290,104,C.iv),w2=T(a2,60,410,104,C.amb);caret(a1,u,.2,22,60,290,104,C.amb,w1);if(u>=.9)caret(a2,u,.9,24,60,410,104,C.iv,w2);
 let p=eo(seg(u,1.0,1.5));c.save();c.translate(540,650);c.scale(1,p);c.beginPath();c.moveTo(-390,0);c.lineTo(0,-130);c.lineTo(390,0);c.closePath();c.fillStyle=C.cor;c.fill();c.restore();
 pop(540,589,seg(u,1.15,1.55),()=>pill(400,566,280,46,C.ink,'VPS · RAM 4 GB',C.iv,20));
 p=eo(seg(u,.9,1.4));A(p,()=>{c.save();c.translate(540,650);c.scale(1,p);c.translate(-540,-650);rr(190,650,700,560,26,C.ink3,C.sl,5);c.restore()});
 const R=[['next',C.cob,215,680,1.3],['api',C.teal,445,680,1.55],['pg',C.amb,675,680,1.8],['redis',C.cor,330,940,2.05],['worker',C.peri,560,940,2.3]];
 for(const[n,col,x,y,t]of R)pop(x+100,y+115,seg(u,t,t+.4),()=>{rr(x,y,200,230,22,C.ink2);rr(x+22,y+22,156,86,14,col);rr(x+22,y+118,156,8,4,'rgba(246,245,238,.2)');T(n,x+100,y+160,26,C.iv,700,'center','M');rr(x+76,y+176,48,54,10,n==='pg'?C.cor:C.sl)});
 A(seg(u,2.9,3.2),()=>{c.strokeStyle=C.cor;c.lineWidth=6;c.setLineDash([12,10]);c.lineDashOffset=-u*40;c.beginPath();c.roundRect(668,673,214,244,28);c.stroke();c.setLineDash([]);c.lineDashOffset=0});
 rr(540-420*eo(seg(u,2.4,2.9)),1210,840*eo(seg(u,2.4,2.9)),14,7,C.teal);
 pop(295,1465,seg(u,3.3,3.75),()=>{rr(60,1290,470,350,36,C.cob);chip(116,1350,'1',C.amb);T('PORT',166,1366,44,C.iv);
  T('"5432:5432"',96,1470,38,C.cor,700,'left','M');grow([[96,1456],[386,1456]],C.cor,6,seg(u,3.9,4.3));A(seg(u,4.3,4.6),()=>T('127.0.0.1:5432',96,1540,36,C.iv,700,'left','M'));pop(466,1530,seg(u,4.5,4.9),()=>mark(466,1530,true,26));
  A(seg(u,4.85,5.0)*(.6+.4*Math.sin(u*14)),()=>rr(60,1290,470,350,36,null,C.amb,10))});
 pop(785,1465,seg(u,3.8,4.25),()=>{rr(550,1290,470,350,36,C.teal);chip(606,1350,'2',C.amb);T('URUTAN NYALA',656,1366,38,C.ink);
  pop(665,1473,seg(u,4.1,4.5),()=>{rr(600,1430,130,86,20,C.amb);T('db',665,1484,28,C.ink,700,'center','M')});pop(825,1473,seg(u,4.3,4.7),()=>{rr(760,1430,130,86,20,C.ink);T('redis',825,1484,28,C.iv,700,'center','M')});
  grow([[690,1516],[690,1580],[900,1580]],C.ink,6,seg(u,4.6,5.1));A(seg(u,5.0,5.2),()=>{arrow(930,1580,0,18,C.ink)});pop(930,1620,seg(u,5.1,5.5),()=>T('api',930,1625,26,C.ink,700,'center','M'))})};
/* S2 */
S[1]=u=>{bg(C.iv);cam(u,[[0,1,540,450],[2.4,1.05,540,450],[3.0,1,540,900],[4.0,1.04,540,1250],[6.1,1.03,540,1250]]);
 tag('PENULISAN CEROBOH',C.cor,C.iv,u,.1);
 slideUp(u,.1,.7,300,()=>{codeBlock(45,200,990,500,S1L,38,u,.7,36,[{i:4,a:3.3,b:3.7,col:'rgba(255,118,94,.38)'}])});
 grow([[290,606],[381,606]],C.amb,5,seg(u,3.6,3.9));grow([[404,606],[495,606]],C.amb,5,seg(u,3.75,4.05));
 A(seg(u,3.7,4.0),()=>T('host',336,646,24,C.amb,700,'center','M'));A(seg(u,3.85,4.15),()=>T('kontainer',450,680,24,C.amb,700,'center','M'));
 rtx('= 0.0.0.0:5432',540,800,64,C.cor,800,'center','B',seg(u,4.0,4.5));A(seg(u,4.3,4.7),()=>T('tanpa alamat = terbuka ke semua',540,850,28,C.iv,600,'center','I'));
 slideUp(u,2.6,3.2,260,()=>rr(45,930,990,900,44,C.sand));
 pop(200,1130,seg(u,3.1,3.55),()=>{cloud(200,1090,1.05,C.cob);T('INTERNET',200,1200,26,C.iv,700,'center','M')});
 pop(820,1230,seg(u,3.3,3.75),()=>{rr(660,1010,320,440,34,C.ink3);T('VPS',820,1058,24,C.sl,700,'center','M')});
 pop(820,1260,seg(u,3.5,3.95),()=>{cyl(820,1260,170,230,C.amb,'#ffd98b')});
 const dp=eio(seg(u,4.1,4.6)),ring=seg(u,4.7,5.1);
 A(ring,()=>{c.strokeStyle=C.cor;c.lineWidth=8;c.setLineDash([14,10]);c.lineDashOffset=-u*40;c.beginPath();c.ellipse(820,1260,125,150,0,0,7);c.stroke();c.setLineDash([]);c.lineDashOffset=0});
 if(u>=3.5){c.save();c.translate(640,1200);c.scale(1-.85*dp,1);rr(0,0,40,160,10,C.cor);c.restore()}
 const lp=seg(u,4.7,5.0);A(lp,()=>{line([[330,1250],[600,1280]],C.cor,10,[22,16],-u*120);arrow(626,1281,.1,28,C.cor);for(let k=0;k<3;k++){const s=((u*.7+k/3)%1);dot(lerp(330,600,s),lerp(1250,1280,s),13,C.cor)}});
 A(seg(u,4.6,4.9),()=>{T('pintu terbuka',420,1180,28,C.cor,700,'center','M');T(':5432',540,1390,34,C.cor,700,'center','M')});
 rtx('Database langsung terlihat publik',540,1530,34,C.iv,800,'center','B',seg(u,5.0,5.5))};
/* S3 */
const PIPE=[[880,300],[880,880],[720,1080],[560,1180]];
S[2]=u=>{bg(C.ink);cam(u,[[0,1,540,700],[1.0,1.03,300,700],[1.7,1.04,700,800],[3.5,1.05,560,1150],[7.1,1.02,560,1150]]);
 tag('DOCKER BELOKKAN IPTABLES',C.cor,C.iv,u,.1);
 pop(300,350,seg(u,.2,.65),()=>{cloud(300,330,1.1,C.cob);T('INTERNET',300,440,26,C.iv,700,'center','M')});
 slideUp(u,.4,1.0,240,()=>{rr(60,1000,960,830,44,C.ink3,C.sl,5);T('VPS',110,1060,26,C.sl,700,'left','M')});
 for(let i=0;i<7;i++)pop(104+i*96,792,seg(u,.3+i*.08,.7+i*.08),()=>rr(60+i*96,760,88,64,10,i%2?C.teal:'#10a085'));
 pop(300,724,seg(u,1.0,1.4),()=>{const k=u>5.3?1+.06*Math.sin(u*10):1;c.save();c.translate(300,724);c.scale(k,k);c.translate(-300,-724);pill(170,700,260,48,C.teal,'UFW · ON',C.ink,24);c.restore()});
 A(seg(u,1.1,1.4),()=>T('deny 5432',300,870,26,C.teal,700,'center','M'));
 pop(300,1280,seg(u,1.2,1.65),()=>{cyl(430,1280,210,260,C.amb,'#ffd98b');T('pg:5432',430,1450,28,C.iv,700,'center','M')});
 if(u>1.2){const per=1.1,ph=((u-1.2)%per)/per;let y,al=1;if(ph<.6)y=560+ph/.6*150;else{const q=(ph-.6)/.4;y=710-q*90;al=1-q}
  line([[300,550],[300,720]],'rgba(255,118,94,.35)',6,[10,14]);A(al,()=>dot(300,y,13,C.cor));if(ph>.58&&ph<.9){const q=(ph-.58)/.32;pop(300,676,Math.min(1,q*2.5),()=>A(1-q*.8,()=>mark(300,676,false,26)))}}
 const pp=seg(u,1.7,2.8);if(pp>0){grow(PIPE,C.amb,56,pp);grow(PIPE,C.ink3,36,pp)}
 pop(850,286,seg(u,2.0,2.4),()=>pill(700,260,300,52,C.amb,'DOCKER · iptables NAT',C.ink,20));
 A(seg(u,2.6,2.9),()=>T('jalur samping',900,980,26,C.amb,700,'left','M'));
 if(u>=2.8){A(seg(u,2.8,3.0),()=>{line(PIPE,C.cor,10,[20,22],-u*110)});for(let k=0;k<4;k++){const s=((u-2.8)*.45+k/4)%1;const q=at(PIPE,s);A(seg(u,2.9,3.1),()=>dot(q[0],q[1],11,C.iv))}}
 A(seg(u,3.6,3.9),()=>{c.strokeStyle=C.cor;c.lineWidth=8;c.setLineDash([14,10]);c.lineDashOffset=-u*40;c.beginPath();c.ellipse(430,1280,150,170,0,0,7);c.stroke();c.setLineDash([]);c.lineDashOffset=0});
 pop(785,1448,seg(u,4.0,4.4),()=>pill(620,1420,330,56,C.cor,'BOCOR KE PUBLIK',C.iv,22));
 rtx('UFW ON, jalur Docker tetap tembus',540,1640,32,C.iv,800,'center','B',seg(u,5.8,6.3))};
/* S4 */
S[3]=u=>{bg(C.peri);cam(u,[[0,1,540,400],[3,1.04,540,700],[3.8,1,540,1000],[4.5,1.05,700,1300],[7.4,1.03,700,1300]]);
 tag('PENULISAN AMAN',C.ink3,C.iv,u,.1);
 pop(540,365,seg(u,.2,.6),()=>{rr(45,200,990,330,36,C.ink3);pop(120,270,seg(u,.5,.9),()=>mark(120,270,false,34));T('ceroboh',180,284,34,C.iv,800);T('- "5432:5432"',96,390,56,C.cor,700,'left','M');grow([[96,370],[560,370]],C.cor,6,seg(u,.8,1.2));A(seg(u,.9,1.2),()=>T('terbuka ke semua alamat',96,470,28,C.sl,600,'left','I'))});
 pop(540,780,seg(u,.9,1.35),()=>{rr(45,570,990,420,36,C.ink,C.teal,8);pop(120,642,seg(u,1.2,1.6),()=>mark(120,642,true,34));T('aman',180,656,34,C.iv,800);
  const s=typ(S4TXT,u,1.5,15);c.font=`700 50px ${F.M}`;const cw=c.measureText('0').width;const hp=eo(seg(u,2.9,3.3));
  if(hp>0){c.save();c.beginPath();c.rect(96+cw*3-18,700,(cw*9+36)*hp,96);c.clip();rr(96+cw*3-18,712,cw*9+36,72,16,C.teal);c.restore()}
  const wd=T(s,96,764,50,C.iv,700,'left','M');if(hp>0){c.save();c.beginPath();c.rect(96+cw*3-18,700,(cw*9+36)*hp,96);c.clip();T(S4TXT.slice(0,12),96,764,50,C.ink,700,'left','M');c.restore()}caret(s,u,1.5,15,96,764,50,C.amb,wd);
  A(seg(u,3.3,3.6),()=>T('alamat ikat ↑',96+cw*7.5,822,22,C.amb,700,'center','M'));rtx('hanya bisa dari dalam VPS',96,880,30,C.peri,600,'left','I',seg(u,4.0,4.5))});
 slideUp(u,3.7,4.3,260,()=>rr(45,1060,990,770,44,C.ink,C.ink3,5));
 pop(190,1290,seg(u,4.0,4.45),()=>{cloud(190,1250,.9,C.cob);T('INTERNET',190,1340,24,C.iv,700,'center','M')});
 pop(715,1360,seg(u,4.2,4.65),()=>{rr(420,1100,590,520,36,C.ink3,C.sl,5);T('VPS',470,1150,22,C.sl,700,'left','M')});
 const lk=seg(u,4.5,4.95);A(1-lk,()=>rr(412,1210,16,150,8,C.cor));pop(420,1280,lk,()=>lock(420,1280,1.1,C.amb));
 if(u>5){const per=1.2,ph=((u-5)%per)/per;let x;let al=1;if(ph<.5)x=lerp(290,380,ph/.5);else{x=lerp(380,300,(ph-.5)/.5);al=1-(ph-.5)/.5}A(al,()=>dot(x,1280,12,C.cor));if(ph>.48&&ph<.85)pop(330,1215,Math.min(1,(ph-.48)*7),()=>mark(330,1215,false,24))}
 pop(555,1285,seg(u,5.1,5.5),()=>{rr(470,1230,170,110,22,C.cob);T('express',555,1296,26,C.iv,700,'center','M')});
 pop(860,1320,seg(u,5.3,5.7),()=>{cyl(860,1320,150,200,C.amb,'#ffd98b');T('127.0.0.1',860,1470,22,C.iv,700,'center','M')});
 const bz=s=>{const t=s,a=1-t;return[a*a*a*640+3*a*a*t*700+3*a*t*t*780+t*t*t*790,a*a*a*1270+3*a*a*t*1190+3*a*t*t*1190+t*t*t*1260]};
 const gp=eo(seg(u,5.7,6.2));if(gp>0){c.beginPath();c.moveTo(640,1270);c.bezierCurveTo(700,1190,780,1190,790,1260);c.strokeStyle=C.teal;c.lineWidth=9;c.lineCap='round';c.setLineDash([210,210]);c.lineDashOffset=210*(1-gp);c.stroke();c.setLineDash([]);c.lineDashOffset=0;A(seg(u,6.1,6.3),()=>arrow(792,1262,1.9,22,C.teal))}
 A(seg(u,6.2,6.4),()=>{for(let k=0;k<2;k++){const q=bz(((u-6.2)*.7+k/2)%1);dot(q[0],q[1],9,C.iv)}pill(560,1180,260,44,C.teal,'loopback lokal',C.ink,20)})};
/* S5 */
S[4]=u=>{bg(C.iv);cam(u,[[0,1,540,450],[1.6,1.03,540,450],[2.0,1,540,1100],[3.3,1.04,540,1150],[5.4,1.02,540,1150]]);
 tag('HEALTHCHECK',C.teal,C.ink,u,.5);
 slideUp(u,.4,.9,300,()=>codeBlock(45,200,990,560,S5L,36,u,.7,34,[{i:2,a:2.2,b:2.6,col:'rgba(22,185,154,.35)'},{i:5,a:3.6,b:4.0,col:'rgba(255,118,94,.35)'}]));
 slideUp(u,1.6,2.1,260,()=>{rr(45,820,480,730,40,C.ink,C.ink3,5);rr(555,820,480,730,40,C.ink,C.ink3,5)});
 pop(285,1040,seg(u,2.0,2.45),()=>{cyl(285,1040,170,210,C.amb,'#ffd98b');T('postgres',285,1200,28,C.iv,700,'center','M')});
 const ep=seg(u,2.4,3.2);if(ep>0){c.save();c.beginPath();c.rect(85,1230,400*ep,130);c.clip();const pts=[];for(let x=85;x<=485;x+=5){const d=(((x-u*140)%200)+200)%200;let y=1290;if(d>60&&d<80)y-=(d-60)*1.6;else if(d>=80&&d<100)y+=(d-80)*3-32;else if(d>=100&&d<115)y+=60-(d-100)*4;pts.push([x,y])}line(pts,C.teal,8);c.restore()}
 pop(285,1431,seg(u,2.5,2.9),()=>pill(100,1390,370,82,C.teal,'pg_isready',C.ink,30));A(seg(u,3.1,3.4),()=>T('accepting connections',285,1515,20,C.teal,600,'center','M'));
 pop(795,1045,seg(u,3.4,3.85),()=>{rr(690,950,190,190,28,C.cor);for(let i=0;i<3;i++)rr(704,970+i*58,162,38,12,'#ff9a87');T('redis',795,1200,28,C.iv,700,'center','M')});
 pop(795,1431,seg(u,4.0,4.4),()=>pill(610,1390,370,82,C.cor,'redis-cli ping',C.iv,28));
 if(u>4.1){const ph=((u-4.1)%1);line([[600,1290],[700,1290]],'rgba(255,118,94,.35)',6,[10,12]);const x=lerp(600,700,Math.min(1,ph/.5));A(ph<.5?1:1-(ph-.5)/.3,()=>dot(x,1290,11,C.cor))}
 pop(795,1515,seg(u,4.7,5.1),()=>T('PONG',795,1525,34,C.teal,800,'center','M'))};
/* S6 */
S[5]=u=>{bg(C.ink);cam(u,[[0,1,540,500],[1.2,1.03,540,900],[3.1,1.05,540,1300]]);
 tag('depends_on · service_healthy',C.ink3,C.amb,u,.05);
 rtx('Express menunggu',60,300,92,C.iv,800,'left','B',seg(u,.1,.5));rtx('di gerbang.',60,400,92,C.amb,800,'left','B',seg(u,.45,.85));
 [[130,'postgres',C.amb,.5],[600,'redis',C.cor,.7]].forEach(([x,n,col,t])=>pop(x+175,630,seg(u,t,t+.4),()=>{rr(x,500,350,260,36,C.ink3);c.beginPath();c.arc(x+175,600,48,0,7);c.strokeStyle=col;c.lineWidth=8;c.setLineDash([16,14]);c.lineDashOffset=-u*50;c.stroke();c.setLineDash([]);c.lineDashOffset=0;dot(x+175,600,20,col);T(n,x+175,700,28,C.iv,700,'center','M');if(Math.floor(u*2)%2===0)T('starting…',x+175,738,22,col,600,'center','M')}));
 grow([[305,760],[305,880],[540,940]],C.amb,7,seg(u,1.0,1.4));grow([[775,760],[775,880],[540,940]],C.cor,7,seg(u,1.05,1.45));
 const g=eo(seg(u,1.2,1.8));if(g>0){for(let i=0;i<9;i++){const d=eo(seg(u,1.2+i*.03,1.8+i*.03));rr(100+i*100,1000,60,150*d,8,i%2?C.amb:C.ink3)}rr(540-470*g,1000,940*g,26,13,C.amb);rr(540-470*g,1150,940*g,26,13,C.amb)}
 pop(540,1100,seg(u,1.6,2.0),()=>{rr(190,1050,700,100,26,C.ink,C.ink3,5);T('condition: service_healthy',540,1112,32,C.iv,700,'center','M')});
 pop(540,1385,seg(u,1.8,2.2),()=>{const b=Math.sin(u*3)*5;c.save();c.translate(0,b);rr(350,1260,380,250,40,C.cob);rr(390,1310,300,26,13,'rgba(246,245,238,.25)');T('express.js',540,1425,36,C.iv,700,'center','M');T('zzz',650+Math.sin(u*2)*6,1295-((u*30)%30),40,C.amb,800,'center','M');c.restore()});
 const sh=u>2.4?Math.sin((u-2.4)*55)*7*Math.exp(-(u-2.4)*3):0;pop(280,1610,seg(u,2.4,2.8),()=>{c.save();c.translate(sh,0);rr(60,1560,440,100,24,'rgba(255,118,94,.18)',C.cor,4);T('tanpa healthcheck:',90,1600,22,C.cor,700,'left','M');T('ECONNREFUSED → crash',90,1638,26,C.iv,700,'left','M');c.restore()})};
/* S7 */
S[6]=u=>{bg(C.iv);cam(u,[[0,1,540,300],[1.5,1.03,540,700],[3.95,1.0,540,1000]]);
 tag('RINGKASAN',C.ink3,C.iv,u,.05);
 [[130,'postgres',.0],[600,'redis',.6]].forEach(([x,n,t])=>pop(x+175,300,seg(u,t,t+.4),()=>{rr(x,200,350,200,36,C.ink,C.ink3,5);const k=eio(seg(u,t+.2,t+.5));c.beginPath();c.arc(x+70,300,36,0,7);c.strokeStyle=mix(C.amb,C.teal,k);c.lineWidth=8;c.stroke();pop(x+70,300,seg(u,t+.4,t+.75),()=>mark(x+70,300,true,36));T(n,x+240,296,28,C.iv,700,'center','M');T('healthy',x+240,334,22,C.teal,600,'center','M')}));
 grow([[305,400],[305,470],[540,520]],C.teal,8,seg(u,1.2,1.5));grow([[775,400],[775,470],[540,520]],C.teal,8,seg(u,1.2,1.5));
 const lift=eio(seg(u,1.4,1.9));rr(70,520,940,26,13,C.amb);for(let i=0;i<5;i++)rr(100+i*180,430+(-60)*lift,40,90*(1-lift*.2),8,C.amb);A(1-lift,()=>0);
 const ek=eio(seg(u,1.9,2.2));pop(540,760,seg(u,1.9,2.3),()=>{rr(350,640,380,240,40,mix(C.cob,C.teal,ek));T('express.js',540,760,38,C.ink,700,'center','M');A(seg(u,2.3,2.6),()=>T('ready · listening',540,810,24,C.ink,600,'center','M'))});
 const sl=(a,y,fn)=>{const p=eo(seg(u,a,a+.4));A(p,()=>{c.save();c.translate((1-p)*300,0);fn();c.restore()})};
 sl(2.1,940,()=>{rr(45,940,990,200,36,C.ink,C.ink3,5);mark(130,1040,true,36);T('ports:',196,1022,28,C.peri,500,'left','M');T('"127.0.0.1:5432:5432"',196,1080,44,C.iv,700,'left','M')});
 sl(2.35,1170,()=>{rr(45,1170,990,200,36,C.ink,C.ink3,5);mark(130,1270,true,36);T('depends_on:',196,1252,28,C.peri,500,'left','M');T('condition: service_healthy',196,1310,44,C.iv,700,'left','M')});
 const bp=eo(seg(u,2.55,2.9));A(bp,()=>{c.save();c.translate(0,(1-bp)*160);rr(45,1410,990,250,40,C.amb);c.restore()});
 rtx('Awas Jebakan Firewall Docker!',540,1488,40,C.ink,800,'center','B',seg(u,2.65,3.05));rtx('Kunci Port di 127.0.0.1 &',540,1550,40,C.ink,800,'center','B',seg(u,2.8,3.2));rtx('Pasang Healthcheck Sebelum API Menyala',540,1610,34,C.ink,800,'center','B',seg(u,2.95,3.35))};
/* ---------- transisi ---------- */
const TRN={1:'wave',2:['circ',540,960],3:'diag',4:'wave',5:['circ',540,960],6:['circ',540,960]};
function trPath(i,p){const k=TRN[i];c.beginPath();if(k==='wave'){const e=eio(p),a=80*Math.sin(Math.PI*p);c.moveTo(-10,H+40);for(let x=-10;x<=W+10;x+=20)c.lineTo(x,H*(1-e)+a*Math.sin(x/120+p*9));c.lineTo(W+10,H+40);c.closePath()}
 else if(k==='diag'){const s=eio(p)*2300;c.moveTo(-300,-10);c.lineTo(s,-10);c.lineTo(s-H*.6,H+10);c.lineTo(-300,H+10);c.closePath()}
 else{c.arc(k[1],k[2],eio(p)*2400+1,0,7)}}
/* ---------- subtitle kinetik ---------- */
let SUBS=true;
const KINS=[[0.52,4.44,['Dua detail terakhir','di Docker Compose ini','sering menjadi penyelamat','di server produksi.']],[5.10,5.48,['Pertama,']],[6.54,11.54,['jangan pernah menulis','pemetaan port database','hanya dengan angka','5432:5432,']],[12.15,16.28,['karena Docker akan membelokkan','aturan iptables','dan membuka database-mu','ke internet publik']],[16.69,18.62,['meskipun firewall UFW','sudah menyala.']],[19.72,22.73,['Selalu ikat ke','alamat lokal','127.0.0.1,']],[23.14,25.23,['agar database hanya','bisa diakses','dari dalam VPS.']],[26.97,27.29,['Kedua,']],[27.73,31.5,['pasang fitur healthcheck','menggunakan pg_isready','dan redis-cli ping,']],[32.13,35.0,['sehingga kontainer Express.js','kita baru akan dinyalakan']],[35.1,36.99,['setelah database dan Redis','benar-benar sehat']],[37.22,38.44,['dan siap menerima sambungan.']]];
const SYLM={'pg_isready':5,'redis-cli':5,'5432:5432':16,'127.0.0.1':17,'iptables':4,'UFW':3,'VPS':3,'database-mu':5,'benar-benar':5,'healthcheck':3,'ping':2,'Docker':2,'Express.js':5,'Redis':2,'Compose':2,'Dua':2,'detail':2,'port':1,'Kedua':3,'Pertama':3};
const strip=w=>w.replace(/[.,]$/,'');
const sylOf=w=>{const k=strip(w);if(SYLM[k]!==undefined)return SYLM[k];const m=k.match(/[aeiouAEIOU]+/g);return Math.max(1,m?m.length:1)};
const PHR=[];
KINS.forEach(([s0,e0,ps],ci)=>{const wl=ps.map(p=>p.split(' '));const tot=wl.flat().reduce((a,w)=>a+sylOf(w),0),tps=(e0-s0)/tot;let cur=s0;ps.forEach((txt,pi)=>{const ws=wl[pi].map(w=>{const t=cur;cur+=sylOf(w)*tps;return{s:w,t,e:cur}});PHR.push({text:txt,start:ws[0].t,end:ws[ws.length-1].e,words:ws,scene:0,cue:ci})})});
PHR.forEach((p,k)=>{if(PHR[k+1]&&PHR[k+1].cue===p.cue)p.end=PHR[k+1].start-.06});
PHR.forEach(p=>{let i=0;for(let k=0;k<B.length;k++)if(p.start>=B[k]-1e-6)i=k;p.scene=i});
const KEYN={'5432:5432':'cor','127.0.0.1':'teal','iptables':'amb','UFW':'teal','Docker':'cob','healthcheck':'teal','pg_isready':'teal','redis-cli':'cor','ping':'cor','Express.js':'cob','sehat':'teal','database-mu':'cor','publik':'cor','VPS':'cob','Pertama':'amb','Kedua':'amb','lokal':'teal','Redis':'cor'};
const PAL_D={cor:C.cor,teal:C.teal,amb:C.amb,cob:C.peri};
const PAL_L={cor:'#E5432A',teal:'#0C8A72',amb:'#B7791F',cob:'#4667FF'};
const PAL_P={cor:'#C23318',teal:'#0A6B59',amb:'#7A4E0C',cob:'#2840D0'};
const keyOf=(w,i)=>{const n=KEYN[strip(w)];if(!n)return null;return PAL_D[n]};
const STY=[{col:C.iv,rail:C.amb},{col:C.iv,rail:C.cor},{col:C.iv,rail:C.cor},{col:C.iv,rail:C.teal},{col:C.iv,rail:C.teal},{col:C.iv,rail:C.amb},{col:C.iv,rail:C.teal}];
const KY=1770;
const ANCH={'pemetaan port database':[890,1345,C.cor],'agar database hanya':[860,1495,C.teal],'dari dalam VPS.':[715,1625,C.teal],'menggunakan pg_isready':[285,1555,C.teal],'dan redis-cli ping,':[795,1555,C.cor],'kita baru akan dinyalakan':[540,1515,C.amb]};
function measure(ph,size){c.font=`800 ${size}px ${F.B}`;const gap=size*.3;let x=0;const items=ph.words.map(w=>{const wd=c.measureText(w.s).width;const it={x,wd};x+=wd+gap;return it});const w=x-gap;return{size,items,w,x0:(W-w)/2}}
function layout(ph){if(ph.lay)return ph.lay;let size=84,L=measure(ph,size);for(let k=0;k<6&&L.w>940;k++){size=Math.max(50,Math.floor(size*940/L.w));L=measure(ph,size)}ph.lay=L;return L}
function kin(i,t){if(!SUBS)return;const st=STY[i];
 PHR.forEach((ph,pi)=>{if(ph.scene!==i||t<ph.start-.05||t>ph.end+.1)return;
  const L=layout(ph),z=L.size,ex=eio(seg(t,ph.end-.18,ph.end)),al=1-ex;if(al<=0)return;
  c.save();c.translate(0,-ex*z*.35);
  const prog=eo(seg(t,ph.start,ph.end));c.globalAlpha=al;rr(L.x0,KY+z*.22,Math.max(0,L.w*prog),8,4,st.rail);
  const an=ANCH[ph.text];if(an){const m=mp(an[0],an[1]);const p=eo(seg(t,ph.start+.1,ph.start+.55)),y0=KY-z*1.1-8;if(p>0){c.globalAlpha=al;line([[m[0],y0],[m[0],lerp(y0,m[1],p)]],an[2],6,[1,13]);if(p>.98)dot(m[0],m[1],9,an[2])}}
  ph.words.forEach((w,j)=>{const p=seg(t,ph.start+j*.07,ph.start+j*.07+.26);if(p<=0)return;const it=L.items[j],x=L.x0+it.x,col=keyOf(w.s,i)||st.col,cx=x+it.wd/2,cy=KY-z*.3,sty=(j+pi)%4;
   if(sty===0){c.globalAlpha=al;c.save();c.beginPath();c.rect(x-10,KY-z*1.1,it.wd+20,z*1.5);c.clip();c.translate(0,(1-eo(p))*z*1.1);T(w.s,x,KY,z,col,800,'left','B');c.restore()}
   else if(sty===1){c.globalAlpha=al*p;c.save();c.translate(0,-(1-eo(p))*z*.9);T(w.s,x,KY,z,col,800,'left','B');c.restore()}
   else if(sty===2){c.globalAlpha=al*p;c.save();c.translate(-(1-eo(p))*z*1.6,0);T(w.s,x,KY,z,col,800,'left','B');c.restore()}
   else{c.globalAlpha=al*Math.min(1,p*2);pop(cx,cy,p,()=>T(w.s,x,KY,z,col,800,'left','B'))}});
  c.restore()})}
/* ---------- renderAt ---------- */
function drawScene(i,t,subT){c.save();c.setLineDash([]);c.globalAlpha=1;CAMZ={z:1,fx:540,fy:960};S[i](t-B[i]);c.restore();c.save();c.setLineDash([]);kin(i,subT!==undefined?subT:t);c.restore()}
function renderAt(t,subT){t=cl(t,0,D);if(subT===undefined)subT=t;c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;let i=0;for(let k=0;k<B.length;k++)if(t>=B[k])i=k;
 const p=i>0?seg(t,B[i],B[i]+TR):1;
 if(i>0&&p<1){drawScene(i-1,t,subT);c.save();trPath(i,p);c.clip();drawScene(i,t,subT);c.restore();c.save();trPath(i,p);c.strokeStyle=C.amb;c.lineWidth=18*Math.sin(Math.PI*p)+2;c.lineJoin='round';c.stroke();c.restore()}else drawScene(i,t,subT)}
/* ---------- SFX jadwal ---------- */
const SFX=[];
(function(){const add=(t,k,a)=>SFX.push([t,k,a||0]);
 const ticks=(t0,n,cps)=>{for(let i=0;i<n;i+=3)add(t0+i/cps,'tick')};
 add(B[1]-.05,'whoosh',0);add(B[2]-.05,'whomp');add(B[3]-.05,'whoosh',1);add(B[4]-.05,'snapwipe');add(B[5]-.05,'whoosh',2);add(B[6]-.05,'rise');add(B[6]+.1,'zip');
 let b=0;add(.05,'swish');ticks(.2,12,22);ticks(.9,16,24);add(.9,'thud',.4);add(1.0,'swish');add(1.15,'stamp');[1.3,1.55,1.8,2.05,2.3].forEach((t,i)=>add(t,'pop',i));add(2.4,'zip');add(2.9,'sonar');add(3.3,'stamp');add(3.8,'stamp');add(3.9,'zip');add(4.1,'blip');add(4.3,'blip');add(4.5,'sparkle');add(4.6,'slide');add(5.0,'ding');
 b=B[1];add(b+.1,'swish');add(b+.1,'slide');codeTimes(S1L,.7,36).forEach((t,i)=>ticks(b+t,S1L[i].t.length,36));add(b+2.6,'swipe');add(b+3.1,'pop',1);add(b+3.3,'pop',2);add(b+3.3,'click');add(b+3.3,'zip');add(b+3.5,'pop',3);add(b+3.6,'blip');add(b+3.75,'blip');add(b+4.0,'stamp');add(b+4.1,'creak');add(b+4.7,'alarm');add(b+4.7,'sonar');add(b+5.0,'zip');
 b=B[2];add(b+.1,'swish');add(b+.2,'pop',1);for(let i=0;i<7;i++)add(b+.3+i*.08,'brick',i);add(b+.4,'slide');add(b+1.0,'shield');add(b+1.2,'pop',3);for(let k=0;k<5;k++){add(b+1.86+k*1.1,'bounce');add(b+1.89+k*1.1,'glitch')}add(b+1.7,'rise');add(b+2.0,'stamp');add(b+2.8,'flow');add(b+3.6,'sonar');add(b+4.0,'alarm');add(b+5.3,'shield');add(b+5.8,'zip');
 b=B[3];add(b+.1,'swish');add(b+.2,'stamp');add(b+.5,'glitch');add(b+.8,'zip');add(b+.9,'stamp');add(b+1.2,'sparkle');ticks(b+1.5,22,15);add(b+2.9,'zip');add(b+2.9,'blip');add(b+3.3,'blip');add(b+3.7,'swipe');add(b+4.0,'pop',1);add(b+4.2,'pop',2);add(b+4.6,'latch');add(b+5.1,'pop',3);add(b+5.3,'pop',4);add(b+5.6,'bounce');add(b+5.6,'glitch');add(b+5.7,'rise');add(b+6.2,'sparkle');add(b+6.8,'bounce');add(b+6.8,'glitch');
 b=B[4];add(b+.4,'swish');add(b+.5,'swish');codeTimes(S5L,.7,34).forEach((t,i)=>ticks(b+t,S5L[i].t.length,34));add(b+1.6,'slide');add(b+2.0,'pop',1);add(b+2.2,'click');add(b+2.2,'zip');add(b+2.5,'blip');add(b+2.6,'heartbeat');add(b+3.1,'ding');add(b+3.4,'pop',2);add(b+3.6,'click');add(b+4.0,'heartbeat');add(b+4.0,'blip');[4.1,5.1].forEach(t=>add(b+t,'ping'));add(b+4.7,'pong');add(b+4.7,'sparkle');
 b=B[5];add(b+.05,'swish');add(b+.1,'swish');add(b+.45,'swish');add(b+.5,'pop',1);add(b+.7,'pop',2);add(b+1.0,'zip');[1.2,1.45,1.7].forEach(t=>add(b+t,'gateclank'));add(b+1.7,'stamp');add(b+1.8,'pop',3);add(b+2.3,'zzz');add(b+2.4,'rattle');add(b+2.4,'alarm');
 b=B[6];add(b+.05,'swish');add(b+.0,'pop',2);add(b+.45,'sparkle');add(b+.6,'pop',4);add(b+1.0,'sparkle');add(b+1.2,'zip');add(b+1.4,'gatelift');add(b+1.9,'latch');add(b+1.9,'powerup');add(b+2.1,'swipe');add(b+2.35,'swipe');add(b+2.55,'stamp');add(b+2.55,'chime');
 PHR.forEach((p,i)=>{add(p.start,['tap','boop','tap','snap'][i%4],i%3)});
 SFX.sort((x,y)=>x[0]-y[0])})();
/* ---------- audio ---------- */
let AB=null;
function noiseBuf(x){const n=x.sampleRate;const b=x.createBuffer(1,n,x.sampleRate),d=b.getChannelData(0);let s=12345;for(let i=0;i<n;i++){s=(s*1664525+1013904223)>>>0;d[i]=s/2147483648-1}return b}
function env(g,t,a,d,v){g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+a);g.gain.exponentialRampToValueAtTime(.0008,t+a+d)}
function sfx(x,out,t,k,a,nb){const g=x.createGain();g.connect(out);
 const osc=(type,f0,f1,dur,v,dt=0,lp)=>{const s=t+dt;const o=x.createOscillator();o.type=type;o.frequency.setValueAtTime(f0,s);if(f1)o.frequency.exponentialRampToValueAtTime(f1,s+dur);const q=x.createGain();env(q,s,.004,dur,v);let n=o;if(lp){const f=x.createBiquadFilter();f.type='lowpass';f.frequency.value=lp;o.connect(f);n=f}n.connect(q);q.connect(g);o.start(s);o.stop(s+dur+.05)};
 const noise=(f0,f1,dur,v,q,type,dt=0)=>{const s=t+dt;const b=x.createBufferSource();b.buffer=nb;b.loop=true;const f=x.createBiquadFilter();f.type=type||'bandpass';f.Q.value=q||1;f.frequency.setValueAtTime(f0,s);f.frequency.exponentialRampToValueAtTime(f1,s+dur);const q2=x.createGain();q2.gain.setValueAtTime(0,s);q2.gain.linearRampToValueAtTime(v,s+dur*.4);q2.gain.linearRampToValueAtTime(0,s+dur);b.connect(f);f.connect(q2);q2.connect(g);b.start(s,0);b.stop(s+dur+.05)};
 switch(k){
 case'whoosh':if(a===1)noise(3200,300,.55,.4,1.2);else if(a===2){noise(150,1400,.6,.5,.8,'lowpass');osc('sine',80,35,.6,.5)}else noise(300,3200,.55,.45,1.2);break;
 case'boop':osc('sine',330,230,.12,.2);break;
 case'snap':noise(4000,4000,.02,.2,1,'highpass');osc('sine',1800,900,.04,.12);break;
 case'whomp':osc('sine',220,55,.35,.6);noise(500,100,.3,.3,.7,'lowpass');break;
 case'snapwipe':noise(5000,500,.45,.35,1.4);noise(4000,4000,.02,.3,1,'highpass',.4);break;
 case'tick':osc('square',2600,0,.025,.05);break;
 case'click':osc('square',1800,0,.05,.09);break;
 case'pop':osc('sine',600*(1+.12*a),600*(1+.12*a)*1.8,.16,.5);break;
 case'thud':osc('sine',140,40,.25,.7*(a||1));noise(300,120,.2,.25*(a||1),.7,'lowpass');break;
 case'rise':noise(400,2600,.9,.25,3);break;
 case'err':osc('sawtooth',110,0,.5,.1);osc('sawtooth',117,0,.5,.1);break;
 case'ping':osc('sine',1300,0,.09,.25);break;
 case'chime':[523,659,784,1047].forEach((f,i)=>osc('sine',f,0,1.3,.22,i*.06));break;
 case'swish':noise(2500,6000,.14,.22,1.5);break;
 case'slide':noise(600,1800,.3,.28,1);break;
 case'zip':osc('sine',400,2400,.12,.22);noise(1500,5000,.12,.12,2);break;
 case'stamp':osc('sine',130,50,.18,.55);noise(2000,2000,.03,.3,1,'highpass');break;
 case'blip':osc('sine',880,0,.07,.22*(a||1));osc('sine',1320,0,.07,.22*(a||1),.06);break;
 case'tap':osc('sine',1100*(1+.08*a),1400*(1+.08*a),.05,.12);break;
 case'ding':osc('sine',1568,0,.5,.3);osc('sine',3136,0,.3,.08);break;
 case'sparkle':[1319,1568,2093].forEach((f,i)=>osc('sine',f,0,.25,.18,i*.05));break;
 case'latch':noise(3000,3000,.04,.4,6);osc('sine',600,300,.06,.35);osc('sine',1200,0,.05,.25,.07);break;
 case'bounce':osc('sine',500,180,.14,.4);break;
 case'glitch':[0,.05,.09].forEach(d=>noise(1500,1500,.03,.2,3,'bandpass',d));break;
 case'alarm':osc('square',880,0,.1,.1);osc('square',880,0,.1,.1,.16);break;
 case'creak':osc('sawtooth',260,140,.5,.06,0,800);break;
 case'shield':[330,440,550].forEach((f,i)=>osc('sine',f,f*1.05,.5,.13,i*.05));break;
 case'sonar':osc('sine',1500,0,.6,.28);osc('sine',1500,0,.4,.1,.2);break;
 case'pong':osc('sine',900,600,.15,.32);break;
 case'heartbeat':osc('sine',70,45,.14,.7);osc('sine',60,40,.14,.55,.18);break;
 case'gateclank':noise(1400,1400,.15,.4,8);osc('sine',220,110,.25,.45);osc('sine',1800,0,.1,.12);break;
 case'gatelift':noise(200,900,.5,.22,1.5);osc('sawtooth',90,180,.5,.06,0,500);break;
 case'rattle':for(let i=0;i<6;i++)noise(2000,2000,.02,.22,2,'bandpass',i*.035);break;
 case'zzz':osc('sine',400,250,.5,.1);break;
 case'powerup':osc('sine',200,900,.4,.28);[1568,2093].forEach((f,i)=>osc('sine',f,0,.2,.14,.4+i*.06));break;
 case'swipe':noise(1500,700,.2,.22,1);break;
 case'flow':noise(700,1000,.8,.14,.8);break;
 case'brick':osc('triangle',400+40*a,0,.05,.3);noise(3000,3000,.02,.15,1,'highpass');break}}

  if(PHR.length)PHR[PHR.length-1].end+=1.8;
  function renderScene7(localT, voDur, showSub) {
    SUBS = showSub;
    c.setTransform(1, 0, 0, 1, 0, 0);
    const scale = D / (voDur || D);
    const tStruct = cl(Math.min(localT, (voDur || D) - 0.0005) * scale, 0, D - 0.001);
    const tSub = localT < (voDur || D) ? tStruct : (D + (localT - (voDur || D)));
    renderAt(tStruct, tSub);
  }
  function scheduleSfx(ctx, dest, startTime, offset, maxDur) {
    const bus = ctx.createGain(); bus.gain.value = 0.5; bus.connect(dest);
    const nb = noiseBuf(ctx);
    for (const [t, k, a] of SFX) {
      if (t >= offset && t < maxDur) sfx(ctx, bus, startTime + (t - offset), k, a, nb);
    }
  }
  function getCues() {
    return PHR.map(p => [p.start, p.end, p.text || p.words.map(x => x.s || x.w).join(' ')]);
  }
  return { render: renderScene7, scheduleSfx, getCues, refDur: D };
}

// ============================================================================
// SCENE 8: PEMBUKTIAN DOCKER STATS DI TERMINAL & PENUTUP
// ============================================================================
function createScene8(cv) {
  
const W=1080,H=1920,D=41.81,C={ink:K.ink,i2:K.ink,i3:K.surf,iv:K.iv,co:K.cob,te:K.teal,cr:K.cor,am:K.amb,pe:K.peri,sl:K.sl,sa:K.surf};
const F={h:'"Bricolage Grotesque",Inter,sans-serif',m:'"JetBrains Mono","DejaVu Sans Mono",monospace',i:'Inter,sans-serif'};
let c=cv.getContext('2d');
const B=[0,5,12.6,21.6,28.6,34,D],BG=[C.ink,C.iv,C.ink,C.pe,C.iv,C.ink];
const CAP=[[.34,3.94,[['Mari kita buktikan hasilnya',[2]],['lewat perintah docker stats',[2,3]],['di terminal.',[]]]],
[5.15,7.7,[['Kelima container microservice',[0]],['RAG kita menyala bersamaan',[3]]]],
[7.9,12.3,[['dengan konsumsi memori saat diam',[2]],['hanya di kisaran 700 MB,',[3,4]]]],
[13.1,18,[['dan saat digempur',[2]],['beban kerja penuh,',[]],['tetap terkunci aman',[1]],['di bawah 2,8 GB',[2,3]]]],
[18.3,20.9,[['tanpa menyentuh zona bahaya',[3]],['OOM Killer.',[0,1]]]],
[22.1,25,[['Sekarang, setelah rumah',[]],['infrastrukturnya berdiri kokoh,',[2]]]],
[25.3,28.3,[['bagaimana cara kita merancang',[]],['isi di dalam PostgreSQL,',[3]]]],
[28.8,33.4,[['agar sanggup mencari',[]],['jutaan potongan teks',[0]],['dan metadata dalam',[1]],['hitungan milidetik?',[1]]]],
[34.4,37.5,[['Di bagian ketiga,',[2]],['kita akan bedah desain',[]],['database hibrida',[1]]]],
[37.6,41.38,[['yang mengawinkan indeks vektor',[1]],['HNSW dengan indeks',[0]],['metadata JSONB.',[1]]]]];
const cl=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)),seg=(u,a,b)=>cl((u-a)/(b-a)),eo=x=>1-Math.pow(1-x,3),eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2,ebo=x=>1+2.4*Math.pow(x-1,3)+1.4*Math.pow(x-1,2);
const pop=(cx,cy,p,fn)=>{if(p<=0)return;c.save();c.translate(cx,cy);const s=ebo(p);c.scale(s,s);c.translate(-cx,-cy);fn();c.restore()};
const A=(a,fn)=>{if(a<=0)return;c.save();c.globalAlpha=cl(a);fn();c.restore()};
const rr=(x,y,w,h,r,f,s,lw)=>{if(w<=0||h<=0)return;c.beginPath();c.roundRect(x,y,w,h,Math.min(r,w/2,h/2));if(f){c.fillStyle=f;c.fill()}if(s){c.strokeStyle=s;c.lineWidth=lw||4;c.stroke()}};
const circ=(x,y,r,f)=>{c.beginPath();c.arc(x,y,Math.max(0,r),0,7);c.fillStyle=f;c.fill()};
const tx=(s,x,y,z,col,wt,al,f)=>{c.font=`${wt||800} ${z}px ${f||F.h}`;c.fillStyle=col;c.textAlign=al||'center';c.textBaseline='alphabetic';c.fillText(s,x,y)};
const rtx=(s,x,y,z,col,wt,al,f,p)=>{if(p<=0)return;c.save();c.beginPath();c.rect(-50,y-z*1.05,W+100,z*1.45);c.clip();c.translate(0,(1-eo(p))*z*1.2);tx(s,x,y,z,col,wt,al,f);c.restore()};
const fit=(s,x,y,mw,z,col,wt,al,f)=>{c.font=`${wt||800} ${z}px ${f||F.h}`;const w=c.measureText(s).width;tx(s,x,y,w>mw?z*mw/w:z,col,wt,al,f)};
const ln=(a,b,d,e,col,lw,dash)=>{c.beginPath();c.moveTo(a,b);c.lineTo(d,e);c.strokeStyle=col;c.lineWidth=lw;c.lineCap='round';c.setLineDash(dash||[]);c.stroke();c.setLineDash([])};
function cyl(x,y,w,h,k){const ry=w*.17,cx=x+w/2;c.fillStyle=k;c.fillRect(x,y+ry,w,h-2*ry);c.beginPath();c.ellipse(cx,y+h-ry,w/2,ry,0,0,7);c.fill();c.strokeStyle=C.ink;c.lineWidth=6;c.lineCap='round';c.beginPath();c.moveTo(x,y+ry);c.lineTo(x,y+h-ry);c.moveTo(x+w,y+ry);c.lineTo(x+w,y+h-ry);c.stroke();c.beginPath();c.ellipse(cx,y+h-ry,w/2,ry,0,0,Math.PI);c.stroke();c.beginPath();c.ellipse(cx,y+h*.5,w/2,ry,0,0,Math.PI);c.stroke();c.beginPath();c.ellipse(cx,y+ry,w/2,ry,0,0,7);c.fillStyle=C.iv;c.fill();c.stroke()}
function term(x,y,w,h,title){rr(x,y,w,h,44,C.i2,C.sl,5);rr(x,y,w,100,44,C.i3);c.fillStyle=C.i3;c.fillRect(x+2,y+50,w-4,50);[C.cr,C.am,C.te].forEach((k,i)=>circ(x+60+i*46,y+50,13,k));tx(title,x+w/2,y+60,26,C.sl,500,'center',F.m)}

function s1(u){
rtx('BAGIAN 2 / 10 · MASTERCLASS RAG',540,140,28,C.am,700,'center',F.m,seg(u,0,.5));
rtx('Buktikan di',540,310,120,C.iv,800,'center',F.h,seg(u,.1,.7));rtx('terminal.',540,440,120,C.te,800,'center',F.h,seg(u,.3,.9));
pop(540,990,seg(u,0,.7),()=>{term(70,540,940,900,'rag-vps · 4 GB RAM');
tx('$',120,740,50,C.te,700,'left',F.m);const n=Math.floor(seg(u,1.7,2.9)*12+.001),s='docker stats'.slice(0,n);tx(s,185,740,50,C.iv,700,'left',F.m);
const w=c.measureText(s).width;if(u<3.1&&(n<12||Math.floor(u*2.5)%2==0)&&u>1.2)rr(185+w+14,700,28,54,6,C.am);
c.font='700 50px '+F.m;rr(185,762,c.measureText('docker stats').width*eo(seg(u,3,3.4)),8,4,C.am);
A(seg(u,3.2,3.6),()=>{tx('NAME',120,880,26,C.sl,700,'left',F.m);tx('CPU %',520,880,26,C.sl,700,'left',F.m);tx('MEM USAGE / LIMIT',700,880,26,C.sl,700,'left',F.m)});
for(let i=0;i<5;i++){const p=seg(u,3.4+i*.15,3.9+i*.15);A(p,()=>{c.save();c.translate(0,(1-eo(p))*30);rr(120,920+i*90,300,28,14,C.i3);rr(520,920+i*90,100,28,14,C.i3);rr(700,920+i*90,230,28,14,C.i3);c.restore()})}});
A(seg(u,3.8,4.4),()=>tx('pantau RAM setiap kontainer, live',540,1540,38,C.pe,600,'center',F.i))}

function s2(u){
const val=Math.round(700*eio(seg(u,.8,6.4)));
pop(540,200,seg(u,0,.6),()=>tx('≈ '+val+' MB',540,250,180,C.iv));
A(seg(u,.2,.7),()=>tx('RAM total saat idle · 5 kontainer',540,325,36,C.sl,600,'center',F.i));
rr(70,400,940,960,44,C.i2);tx('NAME',120,480,24,C.sl,700,'left',F.m);tx('MEM USAGE',560,480,24,C.sl,700,'left',F.m);
[['rag-postgres',280,C.co],['rag-redis',50,C.te],['rag-api',190,C.pe],['rag-web',120,C.am],['proxy',60,C.sl]].forEach(([n,m,k],i)=>{const y=540+i*160,t0=.3+i*.35;
pop(540,y+60,seg(u,t0,t0+.5),()=>{circ(130,y+38,14,C.te);tx(n,165,y+52,38,C.iv,700,'left',F.m);rr(165,y+78,560,22,11,C.i3);rr(165,y+78,560*m/300*eo(seg(u,t0+.3,t0+1.3)),22,11,k);tx(Math.round(m*eo(seg(u,t0+.3,t0+1.3)))+' MiB',950,y+52,34,k,700,'right',F.m)})});
pop(540,1465,seg(u,6.4,7),()=>{rr(250,1420,580,90,45,C.te);tx('● 5/5 running · stabil',540,1480,38,C.ink,800,'center',F.m)});
A(seg(u,.8,1.2),()=>tx('contoh ilustrasi · nilai per kontainer',540,1570,28,C.sl,600,'center',F.i))}

const gAt=t=>.7+1.85*(1-Math.exp(-6*Math.max(0,t-.18)/.82))*(t>.18?1:0)+.07*Math.sin(t*136)*(t>.3?1:0);
function s3(u){
rtx('Beban penuh,',540,190,104,C.iv,800,'center',F.h,seg(u,.1,.7));rtx('tetap terkunci.',540,300,104,C.te,800,'center',F.h,seg(u,.35,1));
const x0=90,sc=225,y=640,h=150,dz=x0+2.8*sc,tot=.7+1.85*eio(seg(u,.5,4.6));
A(seg(u,0,.4),()=>{rr(x0,y,900,h,36,C.i3);c.save();c.beginPath();c.roundRect(x0,y,900,h,36);c.clip();
let x=x0;[[1.1,C.co,'PG'],[.7,C.pe,'API'],[.5,C.am,'WEB'],[.3,C.te,'RDS'],[.2,C.sl,'PX']].forEach(([g,k,l])=>{const w=g/2.8*tot*sc;c.fillStyle=k;c.fillRect(x,y,w,h);if(w>60)tx(l,x+w/2,y+h/2+10,26,C.ink,800,'center',F.m);x+=w;c.fillStyle=C.i3;c.fillRect(x-2,y,4,h)});
const rw=(990-dz)*eo(seg(u,5.2,6));if(rw>0){c.beginPath();c.rect(dz,y,rw,h);c.clip();c.fillStyle='#3a2a3a';c.fillRect(dz,y,300,h);for(let k=-300;k<300;k+=34)ln(dz+k,y+h,dz+k+h,y,C.cr,10)}c.restore();
tx('0',x0,y-20,28,C.sl,700,'left',F.m);tx('4 GB VPS',990,y-20,28,C.sl,700,'right',F.m)});
ln(dz,y-80,dz,y-80+(h+104)*eo(seg(u,3.2,3.7)),C.te,8);pop(dz,y-130,seg(u,3.4,4),()=>{rr(dz-110,y-170,220,80,40,C.te);tx('2,8 GB',dz,y-115,40,C.ink,800,'center',F.m)});
A(seg(u,5.6,6),()=>tx('ZONA OOM · exit code 137',dz+(990-dz)/2,y+h+60,26,C.cr,700,'center',F.m));
A(seg(u,.4,.9),()=>{rr(90,1000,900,520,40,C.i2);tx('uji beban · total RAM',130,1070,28,C.sl,700,'left',F.m);
const px=130,pw=820,pt=1120,ph=350,Y=g=>pt+(4-g)*ph/4;
ln(px,Y(4),px+pw,Y(4),C.cr,5,[14,12]);tx('zona OOM',950,Y(4)-12,24,C.cr,700,'right',F.m);
A(seg(u,3.2,3.7),()=>{ln(px,Y(2.8),px+pw,Y(2.8),C.te,5,[14,12]);tx('batas aman',950,Y(2.8)-12,24,C.te,700,'right',F.m)});
const p=seg(u,.6,4.8),n=Math.floor(p*80);c.beginPath();for(let i=0;i<=n;i++){const t=i/80;i?c.lineTo(px+t*pw,Y(gAt(t))):c.moveTo(px,Y(gAt(t)))}c.strokeStyle=C.iv;c.lineWidth=8;c.lineJoin='round';c.stroke();
if(p>0&&p<1)circ(px+n/80*pw,Y(gAt(n/80)),12,C.am);tx('idle ≈ 0,7',px+10,Y(.7)-18,24,C.pe,700,'left',F.m)});
A(seg(u,.8,1.2),()=>tx('contoh ilustrasi · pembagian RAM per kontainer',540,1580,28,C.sl,600,'center',F.i))}

function s4(u){
rtx('Infrastruktur',540,170,92,C.iv,800,'center',F.h,seg(u,.2,.8));rtx('sudah kokoh.',540,270,92,C.iv,800,'center',F.h,seg(u,.4,1));rr(330,292,420*eo(seg(u,.9,1.4)),10,5,C.am);
A(seg(u,.4,.9),()=>{c.save();c.translate(0,-300*(1-eo(seg(u,.4,1.1))));c.beginPath();c.moveTo(540,380);c.lineTo(900,660);c.lineTo(180,660);c.closePath();c.fillStyle=C.cr;c.fill();c.lineJoin='round';c.strokeStyle=C.cr;c.lineWidth=40;c.stroke();c.restore()});
const bp=eo(seg(u,.8,1.5));rr(240,640+520*(1-bp),600,520*bp,30,C.i3);
[[280,690,C.co,'pg'],[465,690,C.te,'redis'],[650,690,C.pe,'api'],[280,880,C.am,'web'],[465,880,C.sl,'proxy']].forEach(([x,y,k,l],i)=>pop(x+75,y+75,seg(u,1+i*.22,1.5+i*.22),()=>{rr(x,y,150,150,22,k);tx(l,x+75,y+85,30,C.ink,700,'center',F.m)}));
pop(725,1020,seg(u,1.7,2.3),()=>{rr(650,880,150,280,22,C.ink);circ(776,1030,10,C.am)});
rr(540-350*eo(seg(u,2.2,2.8)),1160,700*eo(seg(u,2.2,2.8)),110,24,C.ink);A(seg(u,2.6,3),()=>tx('FONDASI · < 2,8 GB',540,1228,34,C.am,700,'center',F.m));
const ap=seg(u,3,3.5);ln(540,1290,540,1290+70*ap,C.am,8,[2,18]);A(seg(u,3.4,3.6),()=>{c.beginPath();c.moveTo(510,1345);c.lineTo(540,1378);c.lineTo(570,1345);c.strokeStyle=C.am;c.lineWidth=8;c.stroke()});
pop(540,1500,seg(u,3.4,4),()=>cyl(440,1390,200,230,C.co));A(seg(u,3.8,4.2),()=>tx('PostgreSQL',410,1515,44,C.iv,800,'right'));
pop(820,1470,seg(u,4.2,4.8),()=>{circ(820,1470,70,C.cr);tx('?',820,1503,100,C.iv,800,'center')})}

function s5(u){
rtx('Jutaan potongan teks',540,190,92,C.iv,800,'center',F.h,seg(u,.1,.7));rtx('dalam milidetik.',540,305,104,C.am,800,'center',F.h,seg(u,.3,.9));
const hl=[7,22,39,53,70],hp=hl.map(i=>[92+(i%12)*76+30,420+Math.floor(i/12)*82+33]);
for(let i=0;i<84;i++){const x=92+(i%12)*76,y=420+Math.floor(i/12)*82,d=.15+((i%12)+Math.floor(i/12))*.075,k=hl.indexOf(i),h=k>=0&&u>2.6+k*.5;
pop(x+30,y+33,seg(u,d,d+.4),()=>{rr(x,y,60,66,12,h?C.am:C.sa);rr(x+10,y+16,40,8,4,h?C.ink:C.sl);rr(x+10,y+32,28,8,4,h?C.ink:C.sl);rr(x+10,y+48,18,8,4,C.te)})}
const q=seg(u,2.2,4.6)*4,qi=Math.min(3,Math.floor(q)),qe=eio(q-qi),mx=hp[qi][0]+(hp[qi+1][0]-hp[qi][0])*qe,my=hp[qi][1]+(hp[qi+1][1]-hp[qi][1])*qe;
A(seg(u,2.2,2.6),()=>{c.beginPath();c.arc(mx,my,78,0,7);c.strokeStyle=C.iv;c.lineWidth=14;c.stroke();ln(mx+55,my+55,mx+120,my+120,C.iv,22)});
A(seg(u,2,2.5),()=>{circ(190,1040,12,C.am);tx('chunk teks cocok',215,1050,28,C.iv,600,'left',F.i);circ(600,1040,12,C.te);tx('tag metadata',625,1050,28,C.iv,600,'left',F.i)});
pop(540,1330,seg(u,2.8,3.4),()=>{c.beginPath();c.arc(540,1330,170,0,7);c.strokeStyle=C.sa;c.lineWidth=36;c.stroke();
const a=-Math.PI/2+Math.PI*2*eio(seg(u,3.2,4.6));c.beginPath();c.arc(540,1330,170,-Math.PI/2,a);c.strokeStyle=C.am;c.lineWidth=36;c.lineCap='round';c.stroke();
ln(540,1330,540+120*Math.cos(a),1330+120*Math.sin(a),C.iv,10);circ(540,1330,16,C.iv);tx('ms',540,1520,60,C.am,800,'center')});
}

function s6(u){
rtx('PART 3',540,140,30,C.am,700,'center',F.m,seg(u,0,.4));rtx('Skema database',540,250,100,C.iv,800,'center',F.h,seg(u,.15,.75));rtx('hibrida.',540,360,100,C.te,800,'center',F.h,seg(u,.35,.95));
const sp=eo(seg(u,.3,1));A(sp,()=>{c.save();c.translate(0,(1-sp)*500);rr(90,430,900,560,40,C.i2,C.sl,5);rr(90,430,900,100,40,C.co);c.fillStyle=C.co;c.fillRect(92,490,896,40);tx('TABLE  chunks',140,495,40,C.iv,700,'left',F.m);c.restore()});
[['id','bigserial'],['content','text'],['embedding','vector(1024)','HNSW',C.co],['metadata','jsonb','JSONB',C.te]].forEach(([n,t,g,k],i)=>{const y=560+i*105,p=seg(u,1+i*.35,1.5+i*.35);
A(p,()=>{c.save();c.translate((1-eo(p))*-60,0);tx(n,130,y+58,34,C.iv,700,'left',F.m);tx(t,400,y+58,30,C.pe,700,'left',F.m);c.restore();if(i<3)ln(130,y+90,130+820*eo(p),y+90,C.i3,3)});
if(g)pop(840,y+38,seg(u,1.5+i*.35,2+i*.35),()=>{rr(740,y+8,200,60,30,k);tx(g,840,y+49,30,k==C.te?C.ink:C.iv,700,'center',F.m)})});
const N=[[290,1150],[220,1090],[360,1085],[200,1200],[385,1195],[290,1240],[290,1100]];
A(seg(u,3.2,3.8),()=>[[0,1],[0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[2,4],[3,5],[4,5],[6,0]].forEach(([a,b])=>ln(N[a][0],N[a][1],N[a][0]+(N[b][0]-N[a][0])*eo(seg(u,3.2,3.9)),N[a][1]+(N[b][1]-N[a][1])*eo(seg(u,3.2,3.9)),C.co,5)));
N.forEach(([x,y],i)=>pop(x,y,seg(u,3.4+i*.08,3.9+i*.08),()=>circ(x,y,i==0?22:15,i==0?C.am:C.co)));
A(seg(u,3.8,4.2),()=>tx('indeks HNSW',290,1300,30,C.pe,700,'center',F.m));
pop(790,1170,seg(u,3.9,4.5),()=>tx('{ }',790,1210,140,C.te,700,'center',F.m));A(seg(u,4.2,4.6),()=>tx('indeks JSONB',790,1300,30,C.te,700,'center',F.m));
const lp=eo(seg(u,4.4,4.9));ln(420,1170,420+250*lp,1170,C.am,8,[2,16]);pop(540,1170,seg(u,4.8,5.3),()=>{circ(540,1170,40,C.am);tx('+',540,1196,64,C.ink,800,'center',F.m)});
pop(540,1605,seg(u,5.4,6),()=>{rr(60,1440,960,330,44,C.am);});
rtx('Terbukti Stabil di Bawah 2,8 GB!',540,1550,56,C.ink,800,'center',F.h,seg(u,5.7,6.2));rtx('Lanjut Part 3: Merancang Skema',540,1640,44,C.ink,800,'center',F.h,seg(u,6,6.5));rtx('Database Hibrida pgvector & JSONB!',540,1700,44,C.ink,800,'center',F.h,seg(u,6.3,6.8))}

let T=0;const CH=[];
CAP.forEach(([a,b,cs])=>{const tot=cs.reduce((s,[x])=>s+x.split(' ').reduce((q,w)=>q+w.length+1,0),0);let x=a;const cc=[];
cs.forEach(([tt,kw])=>{const ws=tt.split(' ').map((w,j)=>{const d=(w.length+1)/tot*(b-a),o={s:x,e:x+d,w,k:kw.includes(j)};x+=d;return o});cc.push({t0:ws[0].s,le:ws[ws.length-1].e,ws,text:tt})});
cc.forEach((ch,j)=>{const n=cc[j+1];ch.t1=n&&n.t0-ch.le<.7?n.t0-.06:ch.le+.25;ch.i=CH.length;CH.push(ch)})});
const CCOL=[C.iv,C.iv,C.iv,C.iv,C.iv,C.iv],CACC=[C.am,C.te,C.am,C.am,C.am,C.te],CPOS=[1700,1700,1700,1735,1700,1375];
function capt(i){if(!SUBON)return;const ch=CH.find(q=>T>=q.t0-.01&&T<q.t1);if(!ch)return;
c.font='800 68px '+F.h;const sp=c.measureText(' ').width;let tot=-sp;const wd=ch.ws.map(o=>{const w=c.measureText(o.w).width;tot+=w+sp;return w});
const z=Math.min(68,68*920/tot),k=z/68,y=CPOS[i],q=eo(seg(T,ch.t1-.18,ch.t1)),ac=CACC[i],x0=540-tot*k/2;let x=x0;
ch.ws.forEach((o,j)=>{const w=wd[j]*k,p=seg(T,ch.t0+j*.07,ch.t0+j*.07+.28),st=(ch.i+j)%4;
if(p>0){c.save();c.globalAlpha=cl(p*1.6)*(1-q);let dx=0,dy=-q*44,sc=1;
if(st==0)dy+=(1-eo(p))*42;else if(st==1)dy-=(1-ebo(p))*56;else if(st==2)dx-=(1-eo(p))*90;else sc=ebo(p);
c.translate(x+w/2+dx,y+dy);c.scale(sc,sc);tx(o.w,0,0,z,o.k?ac:CCOL[i],800,'center',F.h);c.restore()}x+=w+sp*k});
c.save();c.globalAlpha=cl(seg(T,ch.t0,ch.t0+.15))*(1-q);c.translate(0,-q*44);rr(x0,y+24,tot*k,6,3,CCOL[i]+'38');rr(x0,y+24,tot*k*seg(T,ch.t0,ch.le),6,3,ac);c.restore()}
const SC=[s1,s2,s3,s4,s5,s6],CAM=[null,[1,5],[3,6.5],null,[2,4.6],[3,6]];
function scene(i,u){drawThemeBg(c,W,H);c.save();c.translate(43,36);c.scale(.92,.92);const cm=CAM[i];if(cm){const z=1+.05*Math.sin(Math.PI*seg(u,cm[0],cm[1]));c.translate(540,900);c.scale(z,z);c.translate(-540,-900)}SC[i](u);capt(i);c.restore()}
function tpath(i,p){c.beginPath();const e=eio(p);
if(i==1||i==4){const cy=i==1?990:1330;c.arc(540,cy,e*2100+1,0,7)}
else if(i==2){const ed=H*(1-Math.min(1,e*1.08)),a=70*Math.sin(Math.PI*p);c.moveTo(-60,H+80);c.lineTo(-60,ed);for(let x=-60;x<=W+60;x+=30)c.lineTo(x,ed+a*Math.sin(x/W*6.28+p*4));c.lineTo(W+60,H+80);c.closePath()}
else if(i==3){c.arc(540,880,e*1800+1,0,7)}
else{const s=e*(W+720);c.moveTo(-60,-60);c.lineTo(s,-60);c.lineTo(s-700,H+60);c.lineTo(-60,H+60);c.closePath()}}
let SUBON=true,SFXON=true;
function renderAt(t,subT){t=cl(t,0,D);T=subT!==undefined?subT:t;let i=0;while(i<5&&t>=B[i+1])i++;
if(i>0&&t-B[i]<.5){const p=(t-B[i])/.5;scene(i-1,t-B[i-1]);c.save();tpath(i,p);c.clip();scene(i,t-B[i]);c.restore();tpath(i,p);c.strokeStyle=C.am;c.lineWidth=18*Math.sin(Math.PI*p)+2;c.stroke()}else scene(i,t-B[i])}

// ---- audio ----
const SFX=[];(()=>{const a=(t,k,x)=>SFX.push([t,k,x||0]);const R=(t0,t1,n,k,f)=>{for(let i=0;i<n;i++)a(t0+(t1-t0)*i/Math.max(1,n-1),k,f?f(i):i)};
// S1
a(.05,'zip');a(.15,'bubble',0);a(.3,'zip');a(.4,'tom');R(1.7,2.9,12,'tick',i=>i);a(3.1,'knock');a(3.12,'snap');R(3.4,4.1,5,'blip',i=>i);a(B[1],'whoosh');
// S2
a(B[1]+.05,'zip');for(let i=0;i<5;i++){a(B[1]+.3+i*.35,'knock');a(B[1]+.6+i*.35,'bubble',i)}a(B[1]+.8,'rise',5.4);R(B[1]+1.5,B[1]+6.2,10,'blip',i=>i);a(B[1]+6.4,'coin');a(B[1]+6.55,'ding');a(B[1]+6.7,'sparkle');a(B[2],'wave');
// S3
a(B[2]+.1,'zip');a(B[2]+.35,'zip');a(B[2]+.6,'glide',4.2);R(B[2]+.6,B[2]+4.6,12,'tick',i=>i);a(B[2]+3.2,'snap');a(B[2]+3.4,'ding');a(B[2]+3.5,'knock');a(B[2]+5.2,'alarm');a(B[2]+5.3,'tom');a(B[2]+5.6,'beep2');a(B[3],'whooshLo');a(B[3]+.05,'tom');
// S4
a(B[3]+.2,'zip');a(B[3]+.4,'zip');a(B[3]+.4,'sweep');a(B[3]+.8,'bubble',1);for(let i=0;i<5;i++)a(B[3]+1+i*.22,i%2?'coin':'pop',i);a(B[3]+2.2,'stamp');a(B[3]+2.6,'snap');R(B[3]+3,B[3]+3.5,6,'tick',i=>i);a(B[3]+3.4,'ding');a(B[3]+3.45,'bubble',3);a(B[3]+4.2,'beep2');a(B[4],'diag');
// S5
a(B[4]+.2,'glide',1.7);R(B[4]+.2,B[4]+1.8,17,'blip',i=>i%8+2);for(let k=0;k<5;k++)a(B[4]+2.6+k*.5,'coin',k);a(B[4]+2.2,'scan');R(B[4]+3.2,B[4]+4.6,22,'tick',i=>i);a(B[4]+4.6,'ding');a(B[5],'whoosh');a(B[5]+.05,'sparkle');
// S6
a(B[5]+.3,'tom');for(let i=0;i<4;i++){a(B[5]+1+i*.35,'knock');if(i>1)a(B[5]+1.5+i*.35,'coin',i)}R(B[5]+3.4,B[5]+4.1,7,'blip',i=>i+1);a(B[5]+3.9,'stamp');R(B[5]+4.4,B[5]+4.9,6,'tick',i=>i);a(B[5]+4.8,'ding');a(B[5]+5.4,'stamp');a(B[5]+5.7,'sparkle');a(B[5]+5.9,'chime');
// kinetic caption sounds
CH.forEach((ch,j)=>{a(ch.t0,'tap',j);});
SFX.sort((p,q)=>p[0]-q[0])})();
const NBs=new WeakMap(),NB=x=>{if(!NBs.has(x)){const b=x.createBuffer(1,x.sampleRate*2,x.sampleRate),d=b.getChannelData(0);let s=7;for(let i=0;i<d.length;i++){s=(s*16807)%2147483647;d[i]=s/1073741823-1}NBs.set(x,b)}return NBs.get(x)};
const PN=[880,988,1175,1319,1568];
function sfx(x,o,t,k,a){a=a||0;const g=x.createGain();g.connect(o);
const env=(pk,d)=>{g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(pk,t+.005);g.gain.exponentialRampToValueAtTime(.0001,t+d)};
const osc=(ty,f0,f1,d,off)=>{off=off||0;const s=x.createOscillator();s.type=ty;s.frequency.setValueAtTime(f0,t+off);if(f1)s.frequency.exponentialRampToValueAtTime(f1,t+off+d);s.connect(g);s.start(t+off);s.stop(t+off+d+.02)};
const nz=(f0,f1,d,q,ty,fm)=>{const s=x.createBufferSource();s.buffer=NB(x);const b=x.createBiquadFilter();b.type=ty||'bandpass';b.Q.value=q||1;b.frequency.setValueAtTime(f0,t);if(fm)b.frequency.exponentialRampToValueAtTime(fm,t+d/2);b.frequency.exponentialRampToValueAtTime(f1,t+d);s.connect(b);b.connect(g);s.start(t);s.stop(t+d+.02)};
switch(k){
case 'whoosh':env(.5,.5);nz(300,3200,.5);break;
case 'whooshLo':env(.55,.6);nz(120,900,.6,.8);break;
case 'wave':g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.45,t+.25);g.gain.linearRampToValueAtTime(0,t+.55);nz(250,500,.5,1.2,'bandpass',2600);break;
case 'diag':env(.45,.4);nz(800,6500,.4,3);break;
case 'tick':env(.07,.025);osc('square',2200+(a%4)*180,0,.025);break;
case 'blip':env(.09,.05);osc('sine',700+a*70,0,.05);break;
case 'click':env(.12,.05);osc('square',1800,0,.05);break;
case 'pop':{const f=600*(1+.08*a);env(.3,.16);osc('sine',f,f*1.8,.16);break}
case 'bubble':{const f=420+a*60;env(.22,.14);osc('sine',f,f*2.6,.14);break}
case 'coin':env(.2,.3);osc('square',988+a*40,0,.07);osc('square',1319+a*40,0,.22,.07);break;
case 'ding':env(.2,.9);osc('sine',1319,0,.9);osc('sine',2637,0,.5);break;
case 'beep2':env(.1,.22);osc('square',660,0,.1);osc('square',880,0,.1,.1);break;
case 'knock':env(.35,.1);osc('sine',240,110,.1);nz(900,400,.04,2);break;
case 'snap':env(.3,.05);nz(3000,6500,.05,3,'highpass');break;
case 'stamp':env(.6,.3);osc('sine',150,45,.3);nz(1200,300,.06,1.5);break;
case 'tom':env(.5,.32);osc('sine',210,70,.3);break;
case 'thud':env(.55,.25);osc('sine',140,40,.25);nz(220,60,.2,.7);break;
case 'zip':env(.2,.18);osc('triangle',300,2400,.18);break;
case 'sweep':env(.22,.4);osc('sine',1800,200,.38);break;
case 'glide':g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.05,t+a*.5);g.gain.linearRampToValueAtTime(0,t+a);osc('sine',400,1400,a);break;
case 'scan':g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.05,t+1.2);g.gain.linearRampToValueAtTime(0,t+2.4);osc('triangle',500,1800,2.4);break;
case 'rise':g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.12,t+a);g.gain.linearRampToValueAtTime(0,t+a+.05);nz(400,2600,a,2);break;
case 'alarm':env(.13,.45);osc('sawtooth',440,220,.4);break;
case 'err':env(.14,.5);osc('sawtooth',110,0,.5);osc('sawtooth',117,0,.5);break;
case 'sparkle':env(.12,.5);[2093,2637,3136].forEach((f,i)=>osc('sine',f,0,.3,i*.06));break;
case 'tap':env(.07,.08);osc('sine',PN[a%5],0,.08);break;
case 'mark':env(.05,.11);nz(2500,5200,.1,1.5);break;
case 'chime':env(.16,1.3);[523,659,784,1047].forEach(f=>osc('sine',f,0,1.3));break}}

  if(CH.length){CH[CH.length-1].t1+=1.8;CH[CH.length-1].le+=1.8;const lw=CH[CH.length-1].w;if(lw&&lw.length)lw[lw.length-1].e+=1.8;}
  function renderScene8(localT, voDur, showSub) {
    SUBON = showSub;
    c.setTransform(1, 0, 0, 1, 0, 0);
    const scale = D / (voDur || D);
    const tStruct = cl(Math.min(localT, (voDur || D) - 0.0005) * scale, 0, D - 0.001);
    const tSub = localT < (voDur || D) ? tStruct : (D + (localT - (voDur || D)));
    renderAt(tStruct, tSub);
  }
  function scheduleSfx(ctx, dest, startTime, offset, maxDur) {
    const sg = ctx.createGain(); sg.gain.value = 0.55; sg.connect(dest);
    SFX.forEach(([t, k, a]) => {
      if (t >= offset && t < maxDur) sfx(ctx, sg, startTime + (t - offset), k, a);
    });
  }
  function getCues() {
    return CH.map(q => [q.t0, q.t1, q.text]);
  }
  return { render: renderScene8, scheduleSfx, getCues, refDur: D };
}

// ============================================================================
// OUTRO (SCENE 9): ALIF PUSTAKA — LOGO REVEAL
// ============================================================================
const ALIF_LOGO_PARTS = [
  { d: 'M1189.26,941.45v28.86a9.63,9.63,0,0,0,4.83,8.35l60.29,34.69a9.64,9.64,0,0,0,9.61,0L1289.05,999a9.63,9.63,0,0,0,0-16.7l-85.36-49.16A9.63,9.63,0,0,0,1189.26,941.45Z', fill: '#eb0d00', cx: 1241.57, cy: 973.23 },
  { d: 'M1320.87,929.41l-91.66,52.74a9.64,9.64,0,0,0,0,16.71l25.19,14.48a9.62,9.62,0,0,0,9.61,0l66.47-38.25a9.65,9.65,0,0,0,4.83-8.36v-29A9.64,9.64,0,0,0,1320.87,929.41Z', fill: '#ff2b1f', cx: 1279.85, cy: 971.38 },
  { d: 'M1291,869.07V981.19a9.64,9.64,0,0,0,14.45,8.36l25.06-14.42a9.65,9.65,0,0,0,4.84-8.36V883.5a9.66,9.66,0,0,0-4.83-8.36l-25.08-14.42A9.63,9.63,0,0,0,1291,869.07Z', fill: '#ff5b52', cx: 1313.18, cy: 925.13 },
  { d: 'M1276.87,844.3l53.61,30.84a9.66,9.66,0,0,1,4.83,8.36v28.79a9.64,9.64,0,0,1-14.45,8.35l-53.6-30.84a9.63,9.63,0,0,1-4.83-8.35V852.66A9.64,9.64,0,0,1,1276.87,844.3Z', fill: '#ff8b85', cx: 1298.87, cy: 882.47 },
  { d: 'M1189.26,1013.85v25.86a9.64,9.64,0,0,0,14.45,8.35l22.47-12.93a9.64,9.64,0,0,0,0-16.71l-22.47-12.93A9.65,9.65,0,0,0,1189.26,1013.85Z', fill: '#6bff73', cx: 1210.14, cy: 1026.78 },
  { d: 'M1235.87,890.42l-32.16-18.5a9.64,9.64,0,0,0-14.45,8.35v21.22a9.65,9.65,0,0,0,4.83,8.35l32.17,18.51A9.64,9.64,0,0,0,1240.7,920V898.78A9.64,9.64,0,0,0,1235.87,890.42Z', fill: '#38ff43', cx: 1214.98, cy: 900.14 },
  { d: 'M1240.7,857.86V829.07a9.63,9.63,0,0,0-4.83-8.35l-62.3-35.85a9.64,9.64,0,0,0-9.61,0l-25,14.4a9.64,9.64,0,0,0,0,16.71l87.33,50.23A9.63,9.63,0,0,0,1240.7,857.86Z', fill: '#0d00eb', cx: 1187.42, cy: 825.54 },
  { d: 'M1094.78,858.25v-28a9.66,9.66,0,0,1,4.83-8.35l64.35-37a9.64,9.64,0,0,1,9.61,0l24.41,14a9.64,9.64,0,0,1,0,16.71l-88.76,51A9.64,9.64,0,0,1,1094.78,858.25Z', fill: '#2b1fff', cx: 1148.80, cy: 825.75 },
  { d: 'M1139.08,930.27,1139,815.91a9.64,9.64,0,0,0-14.44-8.35l-24.91,14.33a9.66,9.66,0,0,0-4.83,8.35l0,85.66a9.63,9.63,0,0,0,4.83,8.35l25,14.38A9.63,9.63,0,0,0,1139.08,930.27Z', fill: '#5b52ff', cx: 1116.95, cy: 873.09 },
  { d: 'M1152.5,954.71l-52.88-30.42a9.64,9.64,0,0,1-4.83-8.35V887.06a9.63,9.63,0,0,1,14.44-8.35l52.88,30.42a9.64,9.64,0,0,1,4.83,8.35v28.88A9.63,9.63,0,0,1,1152.5,954.71Z', fill: '#8b85ff', cx: 1130.87, cy: 916.71 }
];

const ALIF_TEXT_PATHS = [
  'M1551.62,854.06a13.23,13.23,0,0,1,9.76,3.86,13.51,13.51,0,0,1,3.86,10v96a13.59,13.59,0,0,1-3.86,9.87,14,14,0,0,1-19.52,0,13.59,13.59,0,0,1-3.86-9.87V952.79l5,2q0,3-3.18,7.15a43.17,43.17,0,0,1-8.62,8.28,52.78,52.78,0,0,1-12.83,6.93,44.23,44.23,0,0,1-16,2.83,51.89,51.89,0,0,1-28.37-8,56.64,56.64,0,0,1-20.09-22.25q-7.37-14.18-7.37-32.57,0-18.6,7.37-32.79a57.3,57.3,0,0,1,19.86-22.24,50,50,0,0,1,27.69-8.06,52.33,52.33,0,0,1,17.93,3,53.55,53.55,0,0,1,14.19,7.49,42.91,42.91,0,0,1,9.3,9.19q3.3,4.65,3.3,7.83l-8.18,3V867.9a13.62,13.62,0,0,1,3.86-9.87A13,13,0,0,1,1551.62,854.06Zm-45.84,101a30.75,30.75,0,0,0,17.47-5,33.59,33.59,0,0,0,11.69-13.61,43.49,43.49,0,0,0,4.2-19.3,44,44,0,0,0-4.2-19.51A33.69,33.69,0,0,0,1523.25,884a30.75,30.75,0,0,0-17.47-5,30.35,30.35,0,0,0-17.25,5,33.69,33.69,0,0,0-11.69,13.62,44,44,0,0,0-4.2,19.51,43.49,43.49,0,0,0,4.2,19.3,33.59,33.59,0,0,0,11.69,13.61A30.35,30.35,0,0,0,1505.78,955.06Z',
  'M1625.38,963.91a13.56,13.56,0,0,1-13.84,13.84,12.73,12.73,0,0,1-9.53-4,13.55,13.55,0,0,1-3.86-9.87V823.64A13.56,13.56,0,0,1,1612,809.8a12.7,12.7,0,0,1,9.65,4,13.82,13.82,0,0,1,3.74,9.87Z',
  'M1670.09,841.58q-7.71,0-10.89-2.5c-2.12-1.66-3.18-4.62-3.18-8.85v-4.32q0-6.57,3.52-9t10.78-2.38q7.93,0,11.12,2.49t3.18,8.85v4.32q0,6.59-3.41,9T1670.09,841.58Zm13.85,122.33a13.59,13.59,0,0,1-3.86,9.87,14,14,0,0,1-19.52,0,13.59,13.59,0,0,1-3.86-9.87V870.17a13.62,13.62,0,0,1,3.86-9.87,14,14,0,0,1,19.52,0,13.62,13.62,0,0,1,3.86,9.87Z',
  'M1777.9,858.6a12.51,12.51,0,0,1,9.08,3.52,12.89,12.89,0,0,1,0,17.93,12.55,12.55,0,0,1-9.08,3.51h-60.15a12.51,12.51,0,0,1-9.07-3.51,12.86,12.86,0,0,1,0-17.93,12.47,12.47,0,0,1,9.07-3.52Zm-2.5-48.8a35.23,35.23,0,0,1,9.76,1.36,18.63,18.63,0,0,1,7.95,4.43,10.7,10.7,0,0,1,3.17,8q0,5.68-3.29,9a10.41,10.41,0,0,1-7.6,3.29,28.06,28.06,0,0,1-6.13-1,32.7,32.7,0,0,0-7.94-1q-5.68,0-8.74,2.49a13,13,0,0,0-4.2,5.79,18,18,0,0,0-1.13,5.79v116a13.59,13.59,0,0,1-3.86,9.87,14,14,0,0,1-19.52,0,13.55,13.55,0,0,1-3.86-9.87V848.16a36.67,36.67,0,0,1,11.35-27.24Q1752.7,809.81,1775.4,809.8Z',
  'M1910.37,854.06a51.71,51.71,0,0,1,28.48,8.06,57.17,57.17,0,0,1,20,22.12q7.37,14.09,7.37,32.69t-7.37,32.79A57.63,57.63,0,0,1,1939.08,972a49.83,49.83,0,0,1-27.8,8,48.36,48.36,0,0,1-17-2.95,54,54,0,0,1-14-7.49,42.75,42.75,0,0,1-9.31-9.19q-3.29-4.65-3.29-7.83l7-2.95v59.69a13.65,13.65,0,0,1-3.86,9.88,13.08,13.08,0,0,1-9.76,4,13.23,13.23,0,0,1-9.76-3.86,13.54,13.54,0,0,1-3.86-10V870.17a13.62,13.62,0,0,1,3.86-9.87,14,14,0,0,1,19.52,0,13.62,13.62,0,0,1,3.86,9.87v11.12l-3.86-2c0-2,1-4.35,3.18-7.15a45.81,45.81,0,0,1,8.62-8.4,49.46,49.46,0,0,1,12.6-6.92A42.1,42.1,0,0,1,1910.37,854.06Zm-3.4,25a30.76,30.76,0,0,0-17.48,5,33.94,33.94,0,0,0-11.69,13.5,43.3,43.3,0,0,0-4.2,19.41,44.18,44.18,0,0,0,4.2,19.4,33.5,33.5,0,0,0,11.69,13.73,30.76,30.76,0,0,0,17.48,5,30.24,30.24,0,0,0,17.36-5,33.85,33.85,0,0,0,11.57-13.73,44.18,44.18,0,0,0,4.2-19.4,43.3,43.3,0,0,0-4.2-19.41,34.3,34.3,0,0,0-11.57-13.5A30.24,30.24,0,0,0,1907,879Z',
  'M2081.27,856.33a13,13,0,0,1,9.76,4,13.62,13.62,0,0,1,3.86,9.87v57.65q0,24.06-13.39,38.13T2042.92,980q-25.2,0-38.47-14.07t-13.28-38.13V870.17a13.58,13.58,0,0,1,3.86-9.87,14,14,0,0,1,19.52,0,13.62,13.62,0,0,1,3.85,9.87v57.65q0,13.84,6.13,20.54t18.39,6.7q12.48,0,18.61-6.7t6.12-20.54V870.17a13.62,13.62,0,0,1,3.86-9.87A13,13,0,0,1,2081.27,856.33Z',
  'M2118.49,958.92a12.73,12.73,0,0,1-2-8.17q.23-5,5.9-8.63a12.3,12.3,0,0,1,7.72-1.93q4.08.34,7.94,4.2a53.38,53.38,0,0,0,13.85,10.21q7.26,3.64,18.15,3.63a56.67,56.67,0,0,0,7.49-1,14.18,14.18,0,0,0,7.15-3.63q3.07-2.83,3.07-8.74a10,10,0,0,0-3.41-7.94,28.83,28.83,0,0,0-9-5q-5.57-2-12.37-3.86-7-2-14.41-4.54a60,60,0,0,1-13.51-6.47,31.12,31.12,0,0,1-10-10.55q-3.86-6.59-3.85-16.57,0-11.35,6.35-19.29A41.51,41.51,0,0,1,2144,858.37a53.53,53.53,0,0,1,21.22-4.31,68.82,68.82,0,0,1,14.75,1.7,57.84,57.84,0,0,1,14.75,5.45,36.35,36.35,0,0,1,11.8,9.87,16.12,16.12,0,0,1,3,8.17q.45,4.77-4.32,8.63a11,11,0,0,1-7.94,2.38,12,12,0,0,1-7.49-3.06,26.85,26.85,0,0,0-10.33-8,35.57,35.57,0,0,0-14.86-3,38.54,38.54,0,0,0-7.38.79,14.62,14.62,0,0,0-6.92,3.41q-3,2.61-2.95,8.28a10.58,10.58,0,0,0,3.4,8.29,25.68,25.68,0,0,0,9.19,5q5.79,1.94,12.37,3.75,6.81,1.82,13.85,4.31a54.65,54.65,0,0,1,12.93,6.58,31.15,31.15,0,0,1,9.54,10.55q3.63,6.48,3.63,16.46a29.84,29.84,0,0,1-6.81,19.75,43.05,43.05,0,0,1-17,12.36,54.44,54.44,0,0,1-20.88,4.2,81.14,81.14,0,0,1-26.78-4.65A46.39,46.39,0,0,1,2118.49,958.92Z',
  'M2237.42,858.6h53.79a12.41,12.41,0,0,1,12.71,12.71,11.69,11.69,0,0,1-3.63,8.74,12.55,12.55,0,0,1-9.08,3.51h-53.79a12.41,12.41,0,0,1-12.71-12.71,11.65,11.65,0,0,1,3.63-8.73A12.51,12.51,0,0,1,2237.42,858.6Zm24.28-28.37a12.66,12.66,0,0,1,9.65,4,13.83,13.83,0,0,1,3.75,9.87v101a9.89,9.89,0,0,0,1.24,5.22,7.14,7.14,0,0,0,3.41,3,11.72,11.72,0,0,0,4.65.91,12.08,12.08,0,0,0,5-1,12.6,12.6,0,0,1,5.22-1,7.63,7.63,0,0,1,5.78,2.95q2.61,3,2.61,8.17c0,4.24-2.31,7.71-6.92,10.44a28.8,28.8,0,0,1-14.87,4.08,78.1,78.1,0,0,1-10.55-.79,28.51,28.51,0,0,1-10.89-3.86,23.45,23.45,0,0,1-8.51-9.42q-3.42-6.34-3.41-17.47V844.07a13.56,13.56,0,0,1,13.84-13.84Z',
  'M2429.43,854.06a13.24,13.24,0,0,1,9.76,3.86,13.51,13.51,0,0,1,3.86,10v96a13.59,13.59,0,0,1-3.86,9.87,14,14,0,0,1-19.52,0,13.59,13.59,0,0,1-3.86-9.87V952.79l5,2q0,3-3.18,7.15a43.17,43.17,0,0,1-8.62,8.28,52.78,52.78,0,0,1-12.83,6.93,44.23,44.23,0,0,1-16,2.83,51.89,51.89,0,0,1-28.37-8,56.64,56.64,0,0,1-20.09-22.25q-7.38-14.18-7.37-32.57,0-18.6,7.37-32.79a57.3,57.3,0,0,1,19.86-22.24,50,50,0,0,1,27.69-8.06,52.33,52.33,0,0,1,17.93,3,53.55,53.55,0,0,1,14.19,7.49,42.91,42.91,0,0,1,9.3,9.19c2.2,3.1,3.29,5.71,3.29,7.83l-8.17,3V867.9a13.62,13.62,0,0,1,3.86-9.87A13,13,0,0,1,2429.43,854.06Zm-45.84,101a30.75,30.75,0,0,0,17.47-5,33.67,33.67,0,0,0,11.69-13.61,43.49,43.49,0,0,0,4.2-19.3,44,44,0,0,0-4.2-19.51A33.76,33.76,0,0,0,2401.06,884a30.75,30.75,0,0,0-17.47-5,30.35,30.35,0,0,0-17.25,5,33.61,33.61,0,0,0-11.69,13.62,44,44,0,0,0-4.2,19.51,43.49,43.49,0,0,0,4.2,19.3,33.52,33.52,0,0,0,11.69,13.61A30.35,30.35,0,0,0,2383.59,955.06Z',
  'M2489.57,977.75a13,13,0,0,1-9.76-4,13.58,13.58,0,0,1-3.85-9.87V823.64a13.62,13.62,0,0,1,3.85-9.87,14,14,0,0,1,19.52,0,13.58,13.58,0,0,1,3.86,9.87V963.91a13.55,13.55,0,0,1-3.86,9.87A13,13,0,0,1,2489.57,977.75Zm72.18-121.42a11.85,11.85,0,0,1,9.08,4.31c2.57,2.88,3.86,5.67,3.86,8.4q0,5.44-5.45,10.21l-68.32,62.87-1.13-31.32,52-50.16A13.74,13.74,0,0,1,2561.75,856.33Zm3.4,121.2a12.9,12.9,0,0,1-10-4.54l-42-44.49,20.65-19.06,40.86,44.48a14.51,14.51,0,0,1,4.31,10.22,11.84,11.84,0,0,1-4.65,9.64Q2569.68,977.53,2565.15,977.53Z',
  'M2702.47,854.06a13.22,13.22,0,0,1,9.75,3.86,13.47,13.47,0,0,1,3.86,10v96a13.55,13.55,0,0,1-3.86,9.87,14,14,0,0,1-19.51,0,13.55,13.55,0,0,1-3.86-9.87V952.79l5,2q0,3-3.18,7.15a43.17,43.17,0,0,1-8.62,8.28,52.71,52.71,0,0,1-12.82,6.93,44.29,44.29,0,0,1-16,2.83,51.91,51.91,0,0,1-28.37-8,56.62,56.62,0,0,1-20.08-22.25q-7.38-14.18-7.38-32.57,0-18.6,7.38-32.79a57.15,57.15,0,0,1,19.86-22.24,50,50,0,0,1,27.69-8.06,52.41,52.41,0,0,1,17.93,3,53.64,53.64,0,0,1,14.18,7.49,43.2,43.2,0,0,1,9.31,9.19q3.29,4.65,3.29,7.83l-8.17,3V867.9a13.58,13.58,0,0,1,3.86-9.87A13,13,0,0,1,2702.47,854.06Zm-45.85,101a30.75,30.75,0,0,0,17.47-5,33.59,33.59,0,0,0,11.69-13.61,43.49,43.49,0,0,0,4.2-19.3,44,44,0,0,0-4.2-19.51A33.69,33.69,0,0,0,2674.09,884a30.75,30.75,0,0,0-17.47-5,30.35,30.35,0,0,0-17.25,5,33.76,33.76,0,0,0-11.69,13.62,44,44,0,0,0-4.2,19.51,43.49,43.49,0,0,0,4.2,19.3,33.67,33.67,0,0,0,11.69,13.61A30.35,30.35,0,0,0,2656.62,955.06Z'
];

const ALIF_PARTICLES = (() => {
  const rnd = (s => () => {
    s |= 0; s = s + 0x6D2B79F5 | 0;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  })(7);
  const COL = ['#2b1fff', '#5b52ff', '#8b85ff', '#5b52ff', '#2b1fff', '#ff8b85'];
  const P = [...Array(34)].map(() => {
    const a = rnd() * Math.PI * 2, ring = rnd() < 0.22;
    const sp = 230 + rnd() * 330, t0 = 0.3 + rnd() * 0.25, life = 0.8 + rnd() * 0.5;
    const r = ring ? 7 + rnd() * 5 : 2.5 + rnd() * 4.5;
    const col = ring ? COL[Math.floor(rnd() * 3)] : COL[Math.floor(rnd() * COL.length)];
    return { a, sp, t0, life, r, ring, col };
  });
  const A = [...Array(16)].map(() => ({
    x: rnd() * 1080,
    y: 200 + rnd() * 1500,
    r: 2 + rnd() * 3,
    ph: rnd()
  }));
  return { P, A };
})();

let _alifLogoPath2D = null;
let _alifTextPath2D = null;

function renderOutro(g, t, D9) {
  const eBackAlif = x => { x = cl(x); return 1 + 2.4 * Math.pow(x - 1, 3) + 1.4 * Math.pow(x - 1, 2); };
  const S0 = 900 / 1621.3;
  const LC = [122.7, 132.9], LW = [810.65, 132.9], DX = LW[0] - LC[0], K_SC = 2.2;
  const RAW = [1217.5, 916.5], CY = 960;
  const TAG = 'Ruang Literasi, Rumah Inovasi';
  const URL_TXT = 'https://alifpustaka.web.id';
  const F_NUNITO = 'Nunito,"Varela Round",' + F_SANS;

  if (typeof Path2D !== 'undefined' && !_alifLogoPath2D) {
    _alifLogoPath2D = ALIF_LOGO_PARTS.map(p => new Path2D(p.d));
    _alifTextPath2D = ALIF_TEXT_PATHS.map(d => new Path2D(d));
  }

  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  drawThemeBg(g, 1080, 1920);

  // Ambient floating particles (#amb)
  const ambFade = pr(t, 0.2, 0.8);
  ALIF_PARTICLES.A.forEach(o => {
    const f = (t * 0.12 + o.ph) % 1;
    const cy = o.y - t * 28;
    const op = Math.sin(Math.PI * f) * 0.22 * ambFade;
    if (op > 0.005) drawC(g, o.x, cy, o.r, '#5b52ff', op);
  });

  const u = eio(pr(t, 1.0, 1.55));
  const z = eBackAlif(pr(t, 0.1, 0.95));
  const kz = 0.12 + (K_SC - 0.12) * z;
  const k = kz + (1 - kz) * u;
  const dx = DX * (1 - u);

  // Radial glow (#glow)
  const lx = 540 + (LC[0] + dx - LW[0]) * S0, ly = CY;
  const gx = lx + (540 - lx) * 0.5 * u;
  const glowOp = pr(t, 0, 0.6) * (1 - 0.55 * u);
  if (glowOp > 0.005 && typeof g.createRadialGradient === 'function') {
    const grd = g.createRadialGradient(gx, ly, 0, gx, ly, 560);
    if (grd && typeof grd.addColorStop === 'function') {
      grd.addColorStop(0, `rgba(91, 82, 255, ${(0.22 * glowOp).toFixed(4)})`);
      grd.addColorStop(1, 'rgba(91, 82, 255, 0)');
      g.save();
      g.fillStyle = grd;
      g.beginPath();
      g.arc(gx, ly, 560, 0, Math.PI * 2);
      g.fill();
      g.restore();
    }
  }

  // Expanding rings (#r1, #r2)
  [['#5b52ff', 0.32, 1.0, 60, 560, 0.45, 2.4], ['#8b85ff', 0.46, 1.1, 40, 420, 0.32, 1.6]].forEach(([col, a, b, r0, r1, al, sw]) => {
    const q = pr(t, a, b);
    if (q > 0 && q < 1) {
      const e = eo(q);
      drawC(g, 540, CY, r0 + (r1 - r0) * e, null, al * (1 - q), col, sw * (1 - 0.6 * q));
    }
  });

  // Burst particles (#fx)
  ALIF_PARTICLES.P.forEach(o => {
    const a = (t - o.t0) / o.life;
    if (a <= 0 || a >= 1) return;
    const d = o.sp * eo(a);
    const px = 540 + Math.cos(o.a) * d;
    const py = CY + Math.sin(o.a) * d;
    const rad = o.r * (o.ring ? (0.6 + a * 1.6) : (1 - a * 0.5));
    const op = Math.pow(1 - a, 1.4) * 0.9;
    if (o.ring) drawC(g, px, py, rad, null, op, o.col, 2.2);
    else drawC(g, px, py, rad, o.col, op);
  });

  // #lockup: transform="translate(540 960) scale(0.55509) translate(-810.65 -132.9)"
  g.save();
  g.translate(540, 960);
  g.scale(0.55509, 0.55509);
  g.translate(-810.65, -132.9);

  // #logo
  const logoOp = pr(t, 0.1, 0.35);
  if (logoOp > 0 && _alifLogoPath2D) {
    g.save();
    g.translate(LC[0] + dx, LC[1]);
    g.scale(k, k);
    g.translate(-LC[0], -LC[1]);
    g.translate(-1094.78, -783.59);
    ALIF_LOGO_PARTS.forEach((part, i) => {
      const q = pr(t, 0.05 + i * 0.04, 0.6 + i * 0.04);
      const partOp = logoOp * cl(q * 2.2);
      if (partOp <= 0) return;
      const e = eo(q);
      const vx = part.cx - RAW[0], vy = part.cy - RAW[1];
      const dist = Math.hypot(vx, vy) || 1;
      const m = 70 * (1 - e) / dist;
      const sc = 0.55 + 0.45 * e;
      g.save();
      g.globalAlpha = partOp;
      g.translate(vx * m, vy * m);
      g.translate(part.cx, part.cy);
      g.scale(sc, sc);
      g.translate(-part.cx, -part.cy);
      g.fillStyle = part.fill;
      g.fill(_alifLogoPath2D[i]);
      g.restore();
    });
    g.restore();
  }

  // #text (11 letters of "alifpustaka")
  if (_alifTextPath2D) {
    g.save();
    g.translate(-1094.78, -783.59);
    ALIF_TEXT_PATHS.forEach((_, i) => {
      const q = pr(t, 1.1 + i * 0.03, 1.4 + i * 0.03);
      const e = eo(q);
      if (e <= 0) return;
      g.save();
      g.globalAlpha = e;
      g.translate(-34 * (1 - e), 0);
      g.fillStyle = K.iv;
      g.fill(_alifTextPath2D[i]);
      g.restore();
    });
    g.restore();
  }
  g.restore(); // end #lockup

  // Typewriter tagline (#tag) & blinking caret (#caret)
  g.save();
  g.font = `700 46px ${F_NUNITO}`;
  const fullTagW = g.measureText(TAG).width;
  const tagX = 540 - fullTagW / 2;
  const n = Math.floor(pr(t, 1.75, 2.95) * TAG.length + 1e-6);
  const subTag = n > 0 ? TAG.slice(0, n) : '';
  if (subTag) {
    g.fillStyle = K.iv;
    g.textAlign = 'left';
    g.textBaseline = 'alphabetic';
    g.fillText(subTag, tagX, 1130);
  }
  const subW = subTag ? g.measureText(subTag).width : 0;
  const co = t < 1.7 ? 0 : t < 2.95 ? 1 : t < 3.5 ? (Math.floor((t - 2.95) / 0.18) % 2 ? 0 : 1) : 0;
  if (co > 0) {
    drawR(g, tagX + subW + 4, 1088, 4, 54, 2, '#5b52ff', co);
  }
  g.restore();

  // URL pill (#url: #pill, #globe, #urlt)
  const uo = eo(pr(t, 3.0, 3.55));
  if (uo > 0) {
    g.save();
    g.globalAlpha = uo;
    g.translate(0, 14 * (1 - uo));
    g.font = `600 34px ${F_NUNITO}`;
    const tw = g.measureText(URL_TXT).width;
    const tot = 40 + 36 + 14 + tw + 40;
    const urlX = 540 - tot / 2;
    drawR(g, urlX, 1194, tot, 76, 38, K.ink, 1, K.cob, 3);

    // Globe icon at (urlX + 58, 1232)
    const gx2 = urlX + 58, gy2 = 1232;
    drawC(g, gx2, gy2, 18, null, 1, K.wh, 2.6);
    g.save();
    g.strokeStyle = K.wh;
    g.lineWidth = 2.6;
    g.lineCap = 'round';
    g.beginPath();
    if (typeof g.ellipse === 'function') g.ellipse(gx2, gy2, 8, 18, 0, 0, Math.PI * 2);
    g.moveTo(gx2 - 18, gy2); g.lineTo(gx2 + 18, gy2);
    g.moveTo(gx2 - 14.5, gy2 - 9.5); g.lineTo(gx2 + 14.5, gy2 - 9.5);
    g.moveTo(gx2 - 14.5, gy2 + 9.5); g.lineTo(gx2 + 14.5, gy2 + 9.5);
    g.stroke();
    g.restore();

    g.fillStyle = K.wh;
    g.textAlign = 'left';
    g.textBaseline = 'alphabetic';
    g.fillText(URL_TXT, urlX + 90, 1244);
    g.restore();
  }

  g.restore();
}

function scheduleOutroSfx(ctx, dest, startTime, offset, maxDur) {
  const bus = ctx.createGain();
  bus.gain.value = 0.65;
  bus.connect(dest);

  // Deterministic noise buffer for crisp mechanical/kinetic transients
  const sr = ctx.sampleRate || 48000;
  const nb = ctx.createBuffer(1, sr, sr);
  const nd = nb.getChannelData(0);
  let seed = 98765;
  for (let i = 0; i < sr; i++) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    nd[i] = seed / 2147483648 - 1;
  }

  const playTone = (type, f0, f1, dur, vol, relT) => {
    if (relT < offset || relT >= maxDur) return;
    const t = startTime + (relT - offset);
    const osc = ctx.createOscillator();
    const gn = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f0, t);
    if (f1 && f1 !== f0) osc.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    gn.gain.setValueAtTime(0.0001, t);
    gn.gain.linearRampToValueAtTime(vol, t + 0.004);
    gn.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gn);
    gn.connect(bus);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  };

  const playNoise = (f0, f1, dur, vol, filterType, qVal, relT) => {
    if (relT < offset || relT >= maxDur) return;
    const t = startTime + (relT - offset);
    const src = ctx.createBufferSource();
    const flt = ctx.createBiquadFilter();
    const gn = ctx.createGain();
    src.buffer = nb;
    src.loop = true;
    flt.type = filterType || 'bandpass';
    flt.Q.value = qVal || 1.5;
    flt.frequency.setValueAtTime(f0, t);
    if (f1 && f1 !== f0) flt.frequency.exponentialRampToValueAtTime(Math.max(40, f1), t + dur);
    gn.gain.setValueAtTime(0.0001, t);
    gn.gain.linearRampToValueAtTime(vol, t + Math.min(0.005, dur * 0.25));
    gn.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(flt);
    flt.connect(gn);
    gn.connect(bus);
    src.start(t);
    src.stop(t + dur + 0.02);
  };

  // 1. Logo geometric parts assembly (0.05s .. 0.45s) & particle burst (0.32s)
  playNoise(300, 2800, 0.45, 0.35, 'bandpass', 1.2, 0.05);
  for (let i = 0; i < 10; i++) {
    const tPart = 0.06 + i * 0.04;
    playTone('sine', 420 + i * 55, (420 + i * 55) * 1.45, 0.09, 0.22, tPart);
  }
  // Radial burst rings (0.32s & 0.46s)
  playTone('sine', 160, 48, 0.28, 0.48, 0.32);
  playNoise(1800, 6200, 0.32, 0.30, 'highpass', 1.4, 0.32);
  [1046.5, 1318.5, 1567.98, 2093.0].forEach((f, idx) => {
    playTone('sine', f, f * 1.02, 0.26, 0.16, 0.34 + idx * 0.045);
  });

  // 2. Lockup shift & "alifpustaka" 11-letter wordmark slide-in (1.00s .. 1.55s)
  playNoise(600, 3400, 0.36, 0.28, 'bandpass', 1.4, 1.02);
  for (let i = 0; i < 11; i++) {
    const tLet = 1.10 + i * 0.03;
    playTone('triangle', 680 + (i % 5) * 85, 920 + (i % 5) * 85, 0.055, 0.16, tLet);
    playNoise(3200, 5400, 0.025, 0.12, 'highpass', 2.0, tLet);
  }

  // 3. Kinetik Tipografi / Typewriter: "Ruang Literasi, Rumah Inovasi" (1.75s .. 2.95s)
  const TAG = 'Ruang Literasi, Rumah Inovasi';
  // Caret blink-in blip at 1.70s
  playTone('sine', 880, 1320, 0.06, 0.22, 1.70);

  for (let i = 0; i < TAG.length; i++) {
    const ch = TAG[i];
    const tChar = 1.75 + (i / TAG.length) * (2.95 - 1.75);
    if (ch === ' ') {
      // Spacebar subtle low mechanical thud
      playTone('sine', 240, 110, 0.035, 0.18, tChar);
      playNoise(1200, 800, 0.025, 0.14, 'bandpass', 2.0, tChar);
    } else if (ch === ',') {
      // Comma punctuation accent click + micro chime
      playNoise(4200, 6800, 0.028, 0.28, 'highpass', 2.5, tChar);
      playTone('triangle', 1320, 990, 0.07, 0.24, tChar);
    } else {
      // Crisp kinetic typography keystroke click + pitched transient
      const isUpper = ch === ch.toUpperCase() && ch !== ch.toLowerCase();
      const baseFreq = (i < 15 ? 780 : 860) + (i % 6) * 65;
      playNoise(isUpper ? 3800 : 4400, 7500, 0.022, isUpper ? 0.34 : 0.25, 'highpass', 2.8, tChar);
      playTone('square', 2100 + (i % 4) * 180, 1100, 0.018, isUpper ? 0.18 : 0.13, tChar);
      playTone('sine', baseFreq, baseFreq * 1.18, 0.045, isUpper ? 0.26 : 0.19, tChar);
    }
  }
  // Completion bell / lock at end of "Ruang Literasi, Rumah Inovasi" (2.95s)
  playTone('sine', 1567.98, 1565, 0.38, 0.26, 2.95);
  playTone('sine', 3135.96, 3130, 0.22, 0.12, 2.96);

  // 4. URL pill "https://alifpustaka.web.id" slide-up & resolution chord (3.00s .. 3.55s)
  playNoise(900, 2600, 0.22, 0.22, 'bandpass', 1.5, 3.00);
  playTone('sine', 520, 960, 0.12, 0.28, 3.04);
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, k) => {
    playTone('sine', freq, freq, 1.35, 0.22, 3.12 + k * 0.07);
  });
}
