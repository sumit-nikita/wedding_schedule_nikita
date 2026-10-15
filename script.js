const $=id=>document.getElementById(id),first=n=>n.split(" ")[0],dlg=$("dlg");
const keys=Object.keys(W.ui);let L="en",ready=false;
const tr=(o,k)=>(o[L]&&o[L][k])||o[k];
function render(){
const U=W.ui[L];document.documentElement.lang=L;
document.querySelectorAll("[data-t]").forEach(el=>el.textContent=U[el.dataset.t]);
$("gn").textContent=first(tr(W.groom,"name"));$("bn").textContent=first(tr(W.bride,"name"));
$("hash").textContent=W.hashtag;
$("ct").innerHTML=W.contacts.map(c=>`<div class="ct"><span>${tr(c,"name")}</span>${c.phone?`<a href="tel:${c.phone}">${c.phone}</a>`:""}</div>`).join("");
$("tl").innerHTML=W.events.map((e,i)=>`<li class="${ready?"rv in":"rv"}"><div class="row"><h3 class="en" style="margin:0">${tr(e,"name")}</h3><span>${tr(e,"time")}</span></div>
<div class="row d"><span>${tr(e,"date")}</span><span>${tr(e,"day")}</span></div><p class="pl">${tr(e,"place")}</p>
<div class="btns"><a href="${e.map}" target="_blank" rel="noopener">${U.directions}</a><button data-i="${i}" aria-haspopup="dialog">${U.details}</button></div></li>`).join("");
$("lang").textContent=W.ui[keys[(keys.indexOf(L)+1)%keys.length]].label}
$("tl").addEventListener("click",ev=>{const b=ev.target.closest("button");if(!b)return;const e=W.events[b.dataset.i];
$("dn").textContent=tr(e,"name");$("dw").textContent=tr(e,"date")+" · "+tr(e,"day");$("dtm").textContent=tr(e,"time");$("dp").textContent=tr(e,"place");
$("dnote").textContent=tr(e,"note")||"";$("dmap").href=e.map;dlg.showModal()});
dlg.addEventListener("click",ev=>{if(ev.target===dlg||ev.target.closest("#dx"))dlg.close()});
$("lang").addEventListener("click",()=>{L=keys[(keys.indexOf(L)+1)%keys.length];render()});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.15});
const snd=$("snd");let on=false,synth=null,file=null;
if(W.music){file=new Audio(W.music);file.loop=true;file.volume=.6;file.addEventListener("error",()=>{file=null;if(on)startSynth()})}
function startSynth(){const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
if(synth){synth.ctx.resume();return}
const ctx=new C(),out=ctx.createGain();out.gain.value=.25;out.connect(ctx.destination);
const sc=[293.66,329.63,369.99,440,493.88,587.33,659.25];
const note=(f,t,d,v)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type="sine";o.frequency.value=f;
g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.03);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(out);o.start(t);o.stop(t+d)};
const dr=ctx.createOscillator(),dg=ctx.createGain();dr.frequency.value=146.83;dg.gain.value=.12;dr.connect(dg);dg.connect(out);dr.start();
let i=0;const run=()=>{const t=ctx.currentTime+.05;note(sc[[0,2,4,2,5,4,2,1][i%8]],t,2.2,.35);if(i%4===0)note(sc[0]/2,t,3,.3);i++};
run();synth={ctx,id:setInterval(run,650)}}
function play(){on=true;snd.classList.remove("off");snd.setAttribute("aria-pressed","true");
if(file)file.play().catch(()=>{});else startSynth()}
function stop(){on=false;snd.classList.add("off");snd.setAttribute("aria-pressed","false");
if(file)file.pause();if(synth)synth.ctx.suspend()}
snd.addEventListener("click",()=>on?stop():play());
render();ready=true;
document.querySelectorAll(".rv").forEach(el=>io.observe(el));
snd.hidden=false;snd.classList.add("off");snd.setAttribute("aria-pressed","false");