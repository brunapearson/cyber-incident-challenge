/* =====================================================================
   NexusSphere Cyber Incident Challenge — AR edition
   ---------------------------------------------------------------------
   Edit the stakeholders below. Extra fields for the AR version:
     id    – short name, also used for QR stations (yoursite/#emma)
     yaw   – where the hologram stands around the student, in degrees
             (0 = straight ahead when scanning starts, 90 = right)
     pdf   – optional link to the full evidence file
   ===================================================================== */

const stakeholders = [
{
id:"emma", yaw:0,
name:"Emma Carter",
role:"Helpdesk Manager",
image:"images/emma.jpg",
pdf:"evidence/helpdesk.pdf",
statement:
"Over 50 employees have reported account lockouts this morning. Several users received password reset emails they did not request.",
evidenceTitle:"Helpdesk Ticket Log",
evidence:
`08:05  Multiple staff unable to login
08:11  Password reset notifications
08:14  Locked accounts reported
08:18  Service desk call volume spikes`,
questions:[
{q:"When did reports begin?",
 a:"The first call came in at 08:05, as people started logging on. But looking back, some of the reset emails were sent last night, not long after 23:00. Something started well before the working day."},
{q:"Which departments are affected?",
 a:"Mostly Finance and Sales. Funnily enough, those are the same teams who got that 'Mandatory Password Reset' email yesterday afternoon."},
{q:"What issues are users reporting?",
 a:"Accounts locked after too many failed sign-ins, ones they never made. They're also getting genuine reset emails from our system that they never asked for. Someone has been trying passwords on a lot of accounts."}
]
},
{
id:"daniel", yaw:72,
name:"Daniel Hughes",
role:"SOC Analyst",
image:"images/daniel.jpg",
pdf:"evidence/firewall.pdf",
statement:
"Our monitoring systems detected a significant amount of outbound traffic to an unknown external IP address.",
evidenceTitle:"Firewall Log",
evidence:
`03:12 203.15.44.77
03:13 Outbound Traffic
03:14 5.4 GB Data Transfer
03:18 Connection Terminated`,
questions:[
{q:"What data may have left the network?",
 a:"The transfer came from the Finance file server. 5.4 GB is roughly the size of the shared drive that holds customer invoices, names and contact details."},
{q:"What systems generated alerts?",
 a:"Two. Login monitoring flagged a sign-in to a Finance user's account from an overseas IP at 02:41. Then the firewall flagged the outbound transfer at 03:14. Nobody was on shift overnight, so both alerts sat in the queue until 08:30."},
{q:"Should the incident be escalated?",
 a:"Yes, straight away. If personal data has left the network, we may have to report it to the ICO within 72 hours of becoming aware of it. I'd treat this as a major incident."}
]
},
{
id:"sophie", yaw:144,
name:"Sophie Mitchell",
role:"Chief Financial Officer",
image:"images/sophie.jpg",
pdf:"evidence/payment.pdf",
statement:
"A payment of £48,000 was approved outside normal working hours.",
evidenceTitle:"Payment Record",
evidence:
`Amount: £48,000
Approved: 02:54
Vendor: Cloud Resource Solutions Ltd
Status: Completed`,
questions:[
{q:"Who approved the payment?",
 a:"The record shows it was approved from our accounts payable officer's account. That account can approve payments up to £50,000 without a second sign-off, and £48,000 sits just under the limit."},
{q:"Was MFA enabled?",
 a:"Not on that account. Finance was given a temporary MFA exemption on the payments system during last year's migration. Nobody ever switched it back on."},
{q:"Could systems be compromised?",
 a:"If someone could approve a payment, they were inside our finance system. And I don't recognise Cloud Resource Solutions Ltd. It was added to our supplier list two days ago."}
]
},
{
id:"james", yaw:-144,
name:"James Walker",
role:"HR Manager",
image:"images/james.jpg",
pdf:"evidence/email.pdf",
statement:
"One employee admitted opening a suspicious email attachment.",
evidenceTitle:"Phishing Email",
evidence:
`Subject:
Mandatory Password Reset

From:
ITSupport@nexusphere-helpdesk.net

Action:
Open attachment and verify account.`,
questions:[
{q:"Who received the email?",
 a:"About 120 staff yesterday afternoon, mostly in Finance and Sales. The person who came to me is our accounts payable officer. And look closely at the sender: 'nexusphere' with one S. Our real domain has two."},
{q:"What did the attachment contain?",
 a:"IT tells me it was a web page made to look exactly like our Microsoft 365 sign-in screen. They typed in their username and password, and then nothing seemed to happen."},
{q:"Could credentials be stolen?",
 a:"Almost certainly. They admitted they use the same password for the payments system. And they weren't the only one: three more people have come forward since this morning."}
]
},
{
id:"olivia", yaw:-72,
name:"Olivia Bennett",
role:"Chief Executive Officer",
image:"images/olivia.jpg",
pdf:"evidence/impact.pdf",
statement:
"Customers are commenting on social media. The Board needs an update.",
evidenceTitle:"Business Impact Brief",
evidence:
`Customers Contacting Support: 45
Negative Social Posts: 18
Affected Services: Customer Portal
Incident Status: Active`,
questions:[
{q:"What is the business impact?",
 a:"The customer portal is offline while we investigate, £48,000 is gone unless the bank can recall it, and customer data may be in criminal hands. Every hour the portal is down costs us around £6,000."},
{q:"What should be communicated externally?",
 a:"That's what I need from you. Legal says we mustn't speculate, but staying silent while customers post online is making things worse. Draft me a holding statement I can approve."},
{q:"What should happen next?",
 a:"I want a plan by midday: how we contain this, who we notify (the bank, the ICO, our customers) and how we stop it happening again. The Board meets at four."}
]
}
];

const finalQuestions = [
"What was the root cause?",
"How did the attacker gain access?",
"Which evidence is most significant?",
"What should the organisation do next?"
];

/* Solve the case: teams must answer all three correctly to stop the clock.
   `answer` is the index of the correct option. Each wrong pick adds PENALTY seconds. */
const PENALTY = 30;
const verdict = [
{q:"How did the attacker first get into NexusSphere?",
 options:[
  "By guessing staff passwords overnight until accounts locked",
  "Through a phishing email linking to a fake Microsoft 365 sign-in page",
  "Through the new supplier, Cloud Resource Solutions Ltd",
  "With help from someone inside the HR team"],
 answer:1},
{q:"Why could the attacker approve a £48,000 payment on their own?",
 options:[
  "Sophie approved it by mistake at 02:54",
  "The firewall was switched off overnight",
  "A stolen, reused password, no MFA on the payments system, and an amount just under the single sign-off limit",
  "A software bug in the payments system"],
 answer:2},
{q:"What should NexusSphere prioritise in the next 72 hours?",
 options:[
  "Stay quiet until the investigation is completely finished",
  "Restore the customer portal first, then investigate",
  "Pay the vendor's invoice to avoid further disruption",
  "Contain the attack (reset passwords, enforce MFA, block the domain and IP), ask the bank to recall the payment, assess ICO notification and update customers"],
 answer:3}
];

/* ===================================================================== */

const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const stage=$("#stage"), cam=$("#cam"), grid=$("#grid"), fx=$("#fx"), world=$("#world"), radar=$("#radar");
const g=grid.getContext("2d"), f=fx.getContext("2d"), r=radar.getContext("2d");
const FOV=62, FOVV=48;
let W=0, H=0, DPR=Math.min(2, window.devicePixelRatio||1);
let yaw=0, pitch=0, tYaw=0, tPitch=0, baseHeading=null, started=false, sheetOpen=false, startTime=0;

const store = {
  get(k,d){ try{ const v=localStorage.getItem("nxs-"+k); return v==null?d:JSON.parse(v); }catch(e){ return d; } },
  set(k,v){ try{ localStorage.setItem("nxs-"+k, JSON.stringify(v)); }catch(e){} }
};
let interviewed = new Set(store.get("done", []));
/* run = {team, start (epoch ms), penalty (s), finish (epoch ms or null), solved:[...]} — kept across refreshes */
let run = store.get("run", null);
const saveRun = ()=>store.set("run", run);
function elapsed(){
  if(!run) return 0;
  const end = run.finish || Date.now();
  return Math.max(0, Math.floor((end-run.start)/1000)) + (run.penalty||0);
}
const fmt = s => s>=3600
  ? `${Math.floor(s/3600)}:${String(Math.floor(s/60)%60).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`
  : `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
if(run){
  $("#teamName").value = run.team;
  $("#startAR").textContent = run.finish ? "View your result" : "Resume investigation";
}
function markSolvedHUD(){
  const sev=$(".sev"); if(!sev) return;
  sev.firstChild.textContent="CASE SOLVED · ";
  sev.style.color="var(--ok)"; sev.style.setProperty("--alert","var(--ok)");
}
if(run && run.finish){ document.body.classList.remove("alarm"); markSolvedHUD(); }

/* Holographic stand-in used until a real photo exists in /images */
function placeholder(p){
  const ini = p.name.split(" ").map(w=>w[0]).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400"><defs><linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f3d78"/><stop offset="1" stop-color="#05162e"/></linearGradient><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fe9ff"/><stop offset="1" stop-color="#2f8be6"/></linearGradient></defs><rect width="300" height="400" fill="url(#a)"/><circle cx="150" cy="150" r="66" fill="url(#b)" opacity=".85"/><path d="M30 400C40 290 90 245 150 245S260 290 270 400Z" fill="url(#b)" opacity=".85"/><text x="150" y="172" font-family="Arial,sans-serif" font-size="58" font-weight="700" fill="#05162e" text-anchor="middle">${ini}</text></svg>`;
  return "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg);
}
function imgTag(p, cls=""){
  return `<img class="${cls}" alt="${esc(p.name)}" src="${esc(p.image)}" onerror="this.onerror=null;this.src='${placeholder(p)}'">`;
}

/* QR stations: opening yoursite/#daniel puts Daniel straight ahead */
const startId = location.hash.slice(1).toLowerCase();
const anchor = stakeholders.find(p=>p.id===startId);
if(anchor){ const off=anchor.yaw; stakeholders.forEach(p=>p.yaw=norm(p.yaw-off)); }

/* Build holograms */
stakeholders.forEach(p=>{
  const b=document.createElement("button");
  b.type="button"; b.className="holo"; b.hidden=true;
  b.setAttribute("aria-label","Interview "+p.name);
  b.innerHTML=`<div class="pad"><i></i><i></i><i></i></div>
    <div class="figure"><span class="brk a"></span><span class="brk b"></span>
      <div class="frame">${imgTag(p)}<div class="tint"></div><div class="glow"></div><div class="scan"></div><div class="sweep"></div></div></div>
    <div class="tag">${esc(p.name.split(" ")[0])} · <b>${interviewed.has(p.id)?"Filed":esc(p.role)}</b></div>`;
  b.addEventListener("click",e=>{ e.stopPropagation(); openInterview(p); });
  world.appendChild(b);
  p.el=b; p.spawned=false; p.vis=false; p.x=0; p.y=0; p.d=0;
  if(interviewed.has(p.id)) b.classList.add("done");
});

function updateCount(){
  $("#caseCount").textContent=`${interviewed.size}/${stakeholders.length}`;
  $("#caseBtn").classList.toggle("ready", interviewed.size===stakeholders.length);
}
updateCount();

function resize(){
  W=innerWidth; H=innerHeight;
  for(const c of [grid,fx]){ c.width=W*DPR; c.height=H*DPR; }
  g.setTransform(DPR,0,0,DPR,0,0); f.setTransform(DPR,0,0,DPR,0,0);
}
addEventListener("resize",resize); resize();

/* Sound + haptics (start after the first tap) */
let ac=null;
function tone(freq=880,dur=.12,type="sine",vol=.08,slide=0){
  if(!ac) return;
  try{
    const o=ac.createOscillator(), gn=ac.createGain(), t=ac.currentTime;
    o.type=type; o.frequency.setValueAtTime(freq,t);
    if(slide) o.frequency.exponentialRampToValueAtTime(freq*slide,t+dur);
    gn.gain.setValueAtTime(vol,t); gn.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(gn).connect(ac.destination); o.start(t); o.stop(t+dur);
  }catch(e){}
}
const buzz=p=>{ try{ navigator.vibrate && navigator.vibrate(p); }catch(e){} };

/* Start */
async function startInvestigation(wantAR){
  const team = $("#teamName").value.trim();
  if(!run){
    if(!team){ $("#teamErr").hidden=false; $("#teamName").focus(); return; }
    run = {team, start:Date.now(), penalty:0, finish:null, solved:[]};
    saveRun();
  }
  try{ ac=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){}
  let motion=false, camera=false;
  if(wantAR){
    try{
      if(typeof DeviceOrientationEvent!=="undefined" && DeviceOrientationEvent.requestPermission){
        motion=(await DeviceOrientationEvent.requestPermission())==="granted";
      } else motion=("ondeviceorientation" in window) && matchMedia("(pointer:coarse)").matches;
    }catch(e){ motion=false; }
    try{
      const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}},audio:false});
      cam.srcObject=s; cam.hidden=false; await cam.play().catch(()=>{}); camera=true;
    }catch(e){ camera=false; }
  }
  if(motion) addEventListener("deviceorientation",onOrient,true);
  grid.style.opacity = camera ? .3 : 1;
  $("#mode").textContent = camera
    ? (motion ? "AR mode · turn to scan" : "AR mode · drag to scan")
    : (motion ? "Virtual incident room · turn to scan" : "Virtual incident room · drag to scan");
  $("#intro").hidden=true; started=true;
  tone(520,.18,"triangle",.07,1.8); setTimeout(()=>tone(1040,.2,"sine",.05),140);
  if(run.finish) openCaseFile();
}
$("#teamName").addEventListener("input",()=>{ $("#teamErr").hidden=true; });
$("#startAR").onclick=()=>startInvestigation(true);
$("#startVR").onclick=()=>startInvestigation(false);

function onOrient(e){
  if(e.alpha==null) return;
  const heading = e.webkitCompassHeading!=null ? e.webkitCompassHeading : 360-e.alpha;
  if(baseHeading==null) baseHeading=heading;
  tYaw=norm(heading-baseHeading);
  tPitch=Math.max(-40,Math.min(40,(e.beta||90)-90));
}

/* Drag / arrow keys to look around (works everywhere) */
let drag=null;
stage.addEventListener("pointerdown",e=>{ drag={x:e.clientX,y:e.clientY,yaw:tYaw,pitch:tPitch}; });
addEventListener("pointermove",e=>{
  if(!drag||sheetOpen) return;
  tYaw=norm(drag.yaw-(e.clientX-drag.x)*.22);
  tPitch=Math.max(-30,Math.min(30,drag.pitch+(e.clientY-drag.y)*.15));
});
addEventListener("pointerup",()=>drag=null);
addEventListener("keydown",e=>{
  if(sheetOpen) return;
  if(e.key==="ArrowLeft") tYaw=norm(tYaw-8);
  if(e.key==="ArrowRight") tYaw=norm(tYaw+8);
});

function norm(a){ return ((a%360)+540)%360-180; }

/* Particles */
const P=[];
function emit(x,y,n,spread=1,burst=false,red=false){
  for(let i=0;i<n;i++){
    const a=Math.random()*Math.PI*2, s=burst?(2+Math.random()*5):(.2+Math.random()*.6);
    P.push({x:x+(burst?0:(Math.random()-.5)*spread),y,
      vx:burst?Math.cos(a)*s:(Math.random()-.5)*.3, vy:burst?Math.sin(a)*s:-(.6+Math.random()*1.4),
      life:1, d:burst?.018:.01+Math.random()*.01, r:burst?2.5:1+Math.random()*1.8,
      c: red&&Math.random()<.5 ? "#ff4d5e" : burst&&Math.random()<.35 ? "#fbbf24" : "#7fefff"});
  }
}

/* Main loop */
let t0=performance.now(), lockedOn=null, sweep=0;
function frame(now){
  const dt=Math.min(50,now-t0); t0=now;
  yaw+=norm(tYaw-yaw)*.15; pitch+=(tPitch-pitch)*.15;
  drawRoom(now);

  let nearest=null;
  for(const p of stakeholders){
    p.d=norm(p.yaw-yaw);
    const x=W/2+p.d/FOV*W, y=H*.64+pitch/FOVV*H;
    p.vis=Math.abs(p.d)<FOV/2+14;
    p.el.hidden=!started||!p.vis;
    if(started&&p.vis){
      const depth=.9+.1*Math.cos(p.d*Math.PI/180);
      p.el.style.transform=`translate(${x}px,${y}px) translate(-50%,-100%) scale(${depth})`;
      p.x=x; p.y=y;
      if(!p.spawned&&Math.abs(p.d)<FOV/2){
        p.spawned=true; p.el.classList.add("materialise");
        emit(x,y-H*.14,70,0,true); tone(300,.6,"sawtooth",.035,4); buzz([30,40,60]);
      }
      if(!p.el.classList.contains("filing")) emit(x,y-6,2,W*.16);
    }
    if(!interviewed.has(p.id) && (!nearest||Math.abs(p.d)<Math.abs(nearest.d))) nearest=p;
  }
  if(!nearest) nearest=stakeholders.reduce((a,b)=>Math.abs(a.d)<Math.abs(b.d)?a:b);

  const lock=started&&Math.abs(nearest.d)<10;
  $("#reticle").classList.toggle("lock",lock);
  if(lock&&lockedOn!==nearest){ tone(1320,.08,"square",.03); buzz(15); }
  lockedOn=lock?nearest:null;
  $("#edgeL").hidden=!started||nearest.vis||nearest.d>0;
  $("#edgeR").hidden=!started||nearest.vis||nearest.d<0;

  if(started){ const c=fmt(elapsed()); const ce=$("#clock"); if(ce.textContent!==c) ce.textContent=c; }
  if(started&&!sheetOpen){
    const done=interviewed.size===stakeholders.length;
    const txt = run&&run.finish ? `Case solved in ${fmt(elapsed())}`
      : done ? "All stakeholders interviewed · open the case file to solve it"
      : lock ? (interviewed.has(nearest.id)?`${nearest.name} · already filed`:`${nearest.name} · tap to interview`)
      : nearest.vis ? "Stakeholder detected · centre the reticle"
      : `Next signal ${Math.round(Math.abs(nearest.d))}° ${nearest.d<0?"left":"right"}`;
    const st=$("#statusText"); if(st.textContent!==txt) st.textContent=txt;
  }

  f.clearRect(0,0,W,H);
  for(let i=P.length-1;i>=0;i--){
    const q=P[i]; q.x+=q.vx; q.y+=q.vy; q.vy+=q.d>.015?.06:-.004; q.life-=q.d;
    if(q.life<=0){ P.splice(i,1); continue; }
    f.globalAlpha=q.life; f.fillStyle=q.c; f.shadowColor=q.c; f.shadowBlur=10;
    f.beginPath(); f.arc(q.x,q.y,q.r,0,7); f.fill();
  }
  f.globalAlpha=1; f.shadowBlur=0;
  drawRadar(dt, now);
  requestAnimationFrame(frame);
}

/* Virtual incident room: floor grid + server racks with blinking LEDs */
function drawRoom(now){
  g.clearRect(0,0,W,H);
  const hz=H*.5+pitch/FOVV*H;
  const sky=g.createLinearGradient(0,0,0,hz);
  sky.addColorStop(0,"rgba(3,11,24,0)"); sky.addColorStop(1,"rgba(47,139,230,.18)");
  g.fillStyle=sky; g.fillRect(0,0,W,hz);
  for(let k=0;k<16;k++){
    const a=k*(360/16)+11, d=norm(a-yaw);
    if(Math.abs(d)>FOV/2+10) continue;
    const x=W/2+d/FOV*W, h=H*(.15+.06*((k*37)%5)/5);
    g.fillStyle="rgba(10,40,80,.6)"; g.fillRect(x-15,hz-h,30,h);
    for(let j=0;j<7;j++){
      const on=Math.sin(now/280+k*3+j*1.7)>.25, red=(k+j)%9===0;
      g.fillStyle = red ? (on?"rgba(255,77,94,.95)":"rgba(255,77,94,.2)") : (on?"rgba(95,228,255,.85)":"rgba(95,228,255,.15)");
      g.fillRect(x-9,hz-h+8+j*(h-16)/7,4,2); g.fillRect(x+3,hz-h+8+j*(h-16)/7,4,2);
    }
  }
  g.strokeStyle="rgba(95,228,255,.35)"; g.lineWidth=1;
  for(let i=1;i<22;i++){
    const y=hz+i*i*.9; if(y>H) break;
    g.globalAlpha=Math.min(1,i/8)*.8; g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke();
  }
  const off=((yaw%10)+10)%10;
  g.globalAlpha=.5;
  for(let i=-30;i<=30;i++){
    const bx=W/2+(i*10-off)/FOV*W;
    g.beginPath(); g.moveTo(W/2+(bx-W/2)*.05,hz); g.lineTo(W/2+(bx-W/2)*4,H*1.4); g.stroke();
  }
  g.globalAlpha=1;
  g.fillStyle="rgba(95,228,255,.45)"; g.fillRect(0,hz-1,W,2);
}

function drawRadar(dt, now){
  const s=200, c=s/2; sweep=(sweep+dt*.004)%(Math.PI*2);
  r.clearRect(0,0,s,s);
  r.fillStyle="rgba(6,22,46,.88)"; r.beginPath(); r.arc(c,c,c-2,0,7); r.fill();
  r.strokeStyle="rgba(120,210,255,.35)"; r.lineWidth=2;
  for(const k of [1,.66,.33]){ r.beginPath(); r.arc(c,c,(c-4)*k,0,7); r.stroke(); }
  r.fillStyle="rgba(95,228,255,.12)"; r.beginPath(); r.moveTo(c,c);
  r.arc(c,c,c-4,-Math.PI/2-FOV/2*Math.PI/180,-Math.PI/2+FOV/2*Math.PI/180); r.fill();
  if(r.createConicGradient){
    const gr=r.createConicGradient(sweep,c,c);
    gr.addColorStop(0,"rgba(95,228,255,.35)"); gr.addColorStop(.15,"rgba(95,228,255,0)"); gr.addColorStop(1,"rgba(95,228,255,0)");
    r.fillStyle=gr; r.beginPath(); r.arc(c,c,c-4,0,7); r.fill();
  }
  for(const p of stakeholders){
    const a=(p.d-90)*Math.PI/180, R=(c-4)*.64;
    const x=c+Math.cos(a)*R, y=c+Math.sin(a)*R;
    const col=interviewed.has(p.id)?"#3ee59a":"#fbbf24";
    r.fillStyle=col; r.shadowColor=col; r.shadowBlur=14;
    r.beginPath(); r.arc(x,y,interviewed.has(p.id)?5:7+Math.sin(now/200)*2,0,7); r.fill(); r.shadowBlur=0;
  }
  r.fillStyle="#e8f6ff"; r.beginPath(); r.moveTo(c,c-9); r.lineTo(c+7,c+7); r.lineTo(c,c+3); r.lineTo(c-7,c+7); r.fill();
}

/* Sheets */
const host=$("#sheetHost");
function closeSheet(){ host.innerHTML=""; sheetOpen=false; }
function sheet(title, html){
  sheetOpen=true;
  host.innerHTML=`<section class="sheet" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="sheet-in">
    <div class="sheet-head"><span class="eyebrow">${esc(title)}</span><button class="close" type="button" data-close>Back to scan</button></div>${html}</div></section>`;
  host.querySelector("[data-close]").onclick=()=>{ tone(400,.08,"sine",.04); closeSheet(); };
}
function typeOut(el,text){
  el.textContent=""; let i=0;
  const step=()=>{ if(!el.isConnected) return; el.textContent=text.slice(0,++i); if(i%3===0) tone(1600+Math.random()*400,.02,"square",.01); if(i<text.length) setTimeout(step,20); };
  step();
}

function openInterview(p){
  if(sheetOpen) return;
  tone(660,.12,"triangle",.07,1.5); buzz(25);
  emit(p.x,p.y-H*.2,30,0,true);
  const idx=stakeholders.indexOf(p)+1, done=interviewed.has(p.id);
  sheet(`Interview · Stakeholder ${idx} of ${stakeholders.length}`, `
    <div class="id"><div class="ph">${imgTag(p)}</div><div><h2>${esc(p.name)}</h2><div class="role">${esc(p.role)}</div></div></div>
    <p class="quote" id="quote"></p>
    <div class="evidence"><header>Evidence unlocked <span>${esc(p.evidenceTitle)}</span></header><pre>${esc(p.evidence)}</pre>
      ${p.pdf?`<a href="${esc(p.pdf)}" target="_blank" rel="noopener">Open full evidence file</a>`:""}</div>
    <div class="sheet-head"><h3>Ask ${esc(p.name.split(" ")[0])}</h3><span class="clues" id="clueCount"></span></div>
    <p class="hint">Tap a question to hear the answer. Each answer is a clue for your final report.</p>
    <ul class="asks">${p.questions.map((x,i)=>`<li>
      <button class="ask" type="button" data-i="${i}" aria-expanded="false"><span>${esc(x.q)}</span><span class="go">Ask</span></button>
      <div class="answer" id="ans${i}" hidden><b>${esc(p.name.split(" ")[0])}</b><span></span></div></li>`).join("")}</ul>
    <button class="btn wide" type="button" id="fileBtn">${done?"Back to scanning":"File evidence &amp; keep scanning"}</button>`);
  typeOut($("#quote"),"“"+p.statement+"”");

  const asked = new Set(askedFor(p.id));
  const showCount = ()=>{ $("#clueCount").textContent=`Clues ${asked.size}/${p.questions.length}`; };
  const reveal = (i, animate)=>{
    const btn=host.querySelector(`.ask[data-i="${i}"]`), box=$("#ans"+i), txt=box.querySelector("span");
    btn.setAttribute("aria-expanded","true"); btn.querySelector(".go").textContent="Answered";
    box.hidden=false;
    if(animate) typeOut(txt,p.questions[i].a); else txt.textContent=p.questions[i].a;
  };
  asked.forEach(i=>reveal(i,false));
  showCount();
  host.querySelectorAll(".ask").forEach(btn=>btn.onclick=()=>{
    const i=+btn.dataset.i;
    if(asked.has(i)) return;
    asked.add(i); saveAsked(p.id,[...asked]); showCount();
    tone(740,.1,"triangle",.06,1.3); buzz(15);
    reveal(i,true);
    if(asked.size===p.questions.length){ setTimeout(()=>{ tone(988,.18,"sine",.06); }, 200); }
  });
  $("#fileBtn").onclick=()=>{ closeSheet(); if(!done) fileEvidence(p); };
}

function askedFor(id){ return (store.get("asked",{})[id])||[]; }
function saveAsked(id,list){ const all=store.get("asked",{}); all[id]=list; store.set("asked",all); }

function fileEvidence(p){
  interviewed.add(p.id); store.set("done",[...interviewed]); updateCount();
  p.el.classList.add("filing");
  setTimeout(()=>{
    emit(p.x,p.y-H*.2,140,0,true,true);
    tone(523,.15,"triangle",.07); setTimeout(()=>tone(659,.15,"triangle",.07),120); setTimeout(()=>tone(784,.4,"triangle",.08),240);
    buzz([40,60,90]);
    p.el.classList.remove("filing","materialise"); p.el.classList.add("done");
    p.el.querySelector(".tag b").textContent="Filed";
    const all=interviewed.size===stakeholders.length;
    toast(all?"All evidence in":"Evidence filed", all?"Now solve the case · the clock is still running":`${p.evidenceTitle} · ${interviewed.size} of ${stakeholders.length}`);
    if(all) setTimeout(openCaseFile,2400);
  },850);
}

function toast(big,small){
  const t=document.createElement("div"); t.className="toast";
  t.innerHTML=`<b>${esc(big)}</b><span>${esc(small)}</span>`;
  document.body.appendChild(t); setTimeout(()=>t.remove(),2700);
}

function openCaseFile(){
  if(sheetOpen) closeSheet();
  tone(500,.08,"sine",.04);
  const n=interviewed.size, all=n===stakeholders.length;
  const list=stakeholders.map(p=>{
    const got=interviewed.has(p.id);
    return `<button class="file ${got?"got":""}" type="button" data-id="${p.id}" ${got?"":"disabled"}>
      <div class="av">${imgTag(p)}</div>
      <div class="nm"><b>${esc(p.name)}</b>${got?esc(p.evidenceTitle):esc(p.role)}</div>
      <span class="st">${got?"Filed":"Not found"}</span></button>`;
  }).join("");
  const solved = run && run.finish;
  const result = solved ? `<div class="result">
      <span class="eyebrow">Case solved · show this to your lecturer</span>
      <div class="team">${esc(run.team)}</div>
      <div class="time">${fmt(elapsed())}</div>
      <div class="meta">Investigation <b>${fmt(elapsed()-(run.penalty||0))}</b> · Penalties <b>+${run.penalty||0}s</b> (${(run.penalty||0)/PENALTY} wrong)<br>Finished at <b>${new Date(run.finish).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}</b></div>
    </div>` : "";
  sheet("Case file", `
    ${result}
    <div><h2>${solved?"Final Incident Review":all?"Ready to solve":"Investigation in progress"}</h2><p class="role">${n} of ${stakeholders.length} stakeholders interviewed · clock ${fmt(elapsed())}</p></div>
    <div class="meter"><i style="width:${n/stakeholders.length*100}%"></i></div>
    ${all&&!solved?`<button class="btn wide" type="button" id="solveBtn">Solve the case</button>`:""}
    <div class="files">${list}</div>
    ${cluesHTML()}
    ${solved?`<div class="final">
      <h3>Prepare to present</h3>
      <p class="hint" style="margin:0">Be ready to explain to the class how your team worked it out.</p>
      <ul class="qs">${finalQuestions.map(q=>`<li>${esc(q)}</li>`).join("")}</ul>
      <label class="eyebrow" for="report">Your incident report</label>
      <textarea id="report" placeholder="Write your final incident report here"></textarea>
      <div class="row"><button class="btn" type="button" id="copyBtn">Copy report</button><span class="saved" id="saved">Saved on this phone as you type</span></div>
    </div>`:all?"":`<p class="role">Find the remaining stakeholders to unlock the case.</p>`}
    <div id="restartBox"><button class="restart" type="button" id="restartBtn">Start a new investigation on this phone</button></div>`);
  host.querySelectorAll(".file.got").forEach(b=>b.onclick=()=>{ closeSheet(); openInterview(stakeholders.find(p=>p.id===b.dataset.id)); });
  const sb=$("#solveBtn"); if(sb) sb.onclick=openVerdict;
  $("#restartBtn").onclick=()=>{
    $("#restartBox").innerHTML=`<div class="confirm">This clears your team name, time, clues and report from this phone.
      <div class="row"><button class="btn" type="button" id="yesRestart">Clear and restart</button><button class="close" type="button" id="noRestart">Keep my progress</button></div></div>`;
    $("#noRestart").onclick=openCaseFile;
    $("#yesRestart").onclick=()=>{ ["done","asked","report","run"].forEach(k=>{ try{ localStorage.removeItem("nxs-"+k); }catch(e){} }); location.reload(); };
  };
  const ta=$("#report");
  if(ta){
    ta.value=store.get("report","");
    ta.oninput=()=>store.set("report",ta.value);
    $("#copyBtn").onclick=async()=>{
      try{ await navigator.clipboard.writeText(ta.value); $("#saved").textContent="Copied to clipboard"; }
      catch(e){ ta.select(); $("#saved").textContent="Selected · copy it from your keyboard"; }
    };
  }
}
function openVerdict(){
  closeSheet();
  tone(440,.15,"triangle",.06,1.5);
  const solvedSet = new Set(run.solved||[]);
  sheet("Solve the case", `
    <div><h2>What really happened?</h2><p class="role">Answer all three to stop the clock. Each wrong answer adds ${PENALTY} seconds.</p></div>
    <p class="penalty" id="penLine">${run.penalty?`Penalties so far: +${run.penalty}s`:""}</p>
    ${verdict.map((v,qi)=>`<div class="vq ${solvedSet.has(qi)?"solved":""}" id="vq${qi}">
      <span class="num">Question ${qi+1} of ${verdict.length}</span><p>${esc(v.q)}</p>
      ${v.options.map((o,oi)=>`<button class="opt ${solvedSet.has(qi)&&oi===v.answer?"right":""}" type="button" data-q="${qi}" data-o="${oi}" ${solvedSet.has(qi)?"disabled":""}><b>${"ABCD"[oi]}</b><span>${esc(o)}</span></button>`).join("")}
    </div>`).join("")}`);
  host.querySelectorAll(".opt").forEach(btn=>btn.onclick=()=>{
    const qi=+btn.dataset.q, oi=+btn.dataset.o;
    if(solvedSet.has(qi)) return;
    if(oi===verdict[qi].answer){
      solvedSet.add(qi); run.solved=[...solvedSet]; saveRun();
      btn.classList.add("right");
      $("#vq"+qi).classList.add("solved");
      $("#vq"+qi).querySelectorAll(".opt").forEach(b=>b.disabled=true);
      tone(880,.1,"sine",.07); setTimeout(()=>tone(1320,.2,"sine",.07),100); buzz(30);
      if(solvedSet.size===verdict.length) setTimeout(finishCase,700);
    } else {
      run.penalty=(run.penalty||0)+PENALTY; saveRun();
      btn.classList.remove("wrong"); void btn.offsetWidth; btn.classList.add("wrong");
      btn.disabled=true;
      $("#penLine").textContent=`Wrong. +${PENALTY}s penalty (total +${run.penalty}s)`;
      tone(160,.3,"sawtooth",.06,.6); buzz([80,40,80]);
    }
  });
}

function finishCase(){
  run.finish=Date.now(); saveRun();
  closeSheet();
  document.body.classList.remove("alarm"); markSolvedHUD();
  emit(W/2,H*.45,220,0,true);
  tone(523,.15,"triangle",.08); setTimeout(()=>tone(659,.15,"triangle",.08),130); setTimeout(()=>tone(784,.15,"triangle",.08),260); setTimeout(()=>tone(1046,.5,"triangle",.09),390);
  buzz([60,60,60,60,200]);
  toast("Case solved", `${run.team} · ${fmt(elapsed())}`);
  setTimeout(openCaseFile,2400);
}

function cluesHTML(){
  const items=[];
  stakeholders.forEach(p=>askedFor(p.id).slice().sort().forEach(i=>
    items.push(`<li><b>${esc(p.name.split(" ")[0])}:</b> ${esc(p.questions[i].a)}</li>`)));
  if(!items.length) return `<p class="hint" style="margin:0">Clues appear here as you question stakeholders.</p>`;
  return `<div><h3>Clues collected (${items.length})</h3><ul class="notes">${items.join("")}</ul></div>`;
}

$("#caseBtn").onclick=openCaseFile;

requestAnimationFrame(frame);
