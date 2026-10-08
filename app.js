
const coins={BTC:['₿','btc'],ETH:['♦','eth'],USDT:['₮','usdt'],USDC:['$','usdc'],SOL:['≋','sol'],XRP:['×','xrp']};const coin=n=>`<img class="coin ${coins[n][1]}" src="tokens-${coins[n][1]}.svg" alt="" width="13" height="13">`;
document.querySelector('#markets').innerHTML=Object.keys(coins).map(n=>`<div class="row market-row"><span class="coin-name">${coin(n)}${n}</span><span data-price="${n}">—</span><span data-change="${n}" class="muted">—</span></div>`).join('');
document.querySelector('#balances').innerHTML=[['USDT','Tether','20,029.62','20,029.62'],['ETH','Ethereum','4,200.50','160,200.50'],['XRP','XRP','324,962,456.78','413,650,594.21'],['BTC','Bitcoin','800.00','223,954,800.00'],['USDC','USD Coin','180.75','180.75'],['SOL','Solana','2.00','2.00']].map(([n,l,q,t],i)=>`${i===2?'<div class="section-label">Other assets</div>':''}<div class="row asset"><span class="coin-name">${coin(n)}<span>${n}<small>${l}</small></span></span><span class="amount">${q}<small>${q}</small></span><span>${t}</span></div>`).join('');
document.querySelector('#offers').innerHTML=[['BTC','USDC','0.91822312','43,123.48','77,145.34'],['ETH','USDT','0.2345','56,329.48','2,207.34'],['SOL','BTC','0.91822312','12.56','0.0232883'],['XRP','USDC','2,000.00','445.62','0.67222']].map(([a,b,v,w,r])=>`<div class="offer"><div><div class="coin-name down">${coin(a)}−${v} <span class="muted">${a}</span></div><div class="coin-name up">${coin(b)}+${w} <span class="muted">${b}</span></div></div><div class="rate"><span data-rate-base="${a}" data-rate-quote="${b}">1 ${a} ≈ — ${b}</span><br><span class="muted">Fee 0.01 ${b}</span></div><div><div class="expiry">• Available (0:30)</div><button type="button" class="accept" title="RFQ interface preview">Accept</button></div></div>`).join('');
document.querySelector('#trades').innerHTML=[['USDT','23,293.12','BTC','0.91882312'],['SOL','3,000.00','USDT','245,243.56'],['ETH','70,000.00','BTC','0.91822312'],['USDT','70,000.00','ETH','430.12'],['USDT','70,000.00','BTC','0.91822312'],['BTC','1.00000000','USDC','72,454.14']].map(([a,v,b,w])=>`<tr><td>2025-02-28 &nbsp;14:27:47</td><td>${coin(a)}${v} ${a}</td><td>${coin(b)}${w} ${b}</td><td>1 ${b} ≈ 77,124.12 ${a} ⇄</td><td>2.00 ${a}</td><td>8279…3bd1 ↗</td></tr>`).join('');

const reduced=matchMedia('(prefers-reduced-motion: reduce)');
function installCursorAtmosphere(servicesSection,showDots,showGlow=true){
const layer=document.createElement('div');layer.className='cursor-atmosphere';layer.setAttribute('aria-hidden','true');const gridCanvas=document.createElement('canvas');layer.append(gridCanvas);servicesSection.prepend(layer);const gridCtx=gridCanvas.getContext('2d');
let gridWidth=0,gridHeight=0,gridDpr=1,gridX=0,gridY=0,gridTargetX=0,gridTargetY=0,gridStrength=0,gridActive=false,gridVisible=false,gridLast=0,gridIsoX=0,gridIsoY=0,gridIsoRadius=240;
function resizeServicesGrid(){if(servicesSection.classList.contains('hero'))layer.style.top=`${-servicesSection.offsetTop}px`;gridWidth=layer.clientWidth;gridHeight=layer.clientHeight;gridDpr=Math.min(devicePixelRatio||1,1.5);gridCanvas.width=Math.round(gridWidth*gridDpr);gridCanvas.height=Math.round(gridHeight*gridDpr);}
new ResizeObserver(resizeServicesGrid).observe(servicesSection);
new IntersectionObserver(entries=>{gridVisible=entries[0].isIntersecting;}).observe(servicesSection);
let pointerX=0,pointerY=0,pointerPresent=false;
function followPointer(e){if(e.pointerType==='touch')return;pointerX=e.clientX;pointerY=e.clientY;pointerPresent=true;updatePointer()}
function updatePointer(){const box=layer.getBoundingClientRect();gridActive=pointerPresent&&!reduced.matches&&pointerX>=box.left&&pointerX<=box.right&&pointerY>=box.top&&pointerY<=box.bottom;gridTargetX=pointerX-box.left;gridTargetY=pointerY-box.top;}
// Capture hover even when a child UI control handles or stops its own events.
document.addEventListener('pointermove',followPointer,{passive:true,capture:true});
document.addEventListener('pointerover',followPointer,{passive:true,capture:true});
document.addEventListener('pointerout',e=>{if(!e.relatedTarget){pointerPresent=false;gridActive=false}},{passive:true});
addEventListener('scroll',updatePointer,{passive:true});
function drawServicesGrid(now){
 requestAnimationFrame(drawServicesGrid);if(!gridVisible||document.hidden||now-gridLast<33)return;gridLast=now;
 gridX+=(gridTargetX-gridX)*.32;gridY+=(gridTargetY-gridY)*.32;gridStrength+=((gridActive&&!reduced.matches?1:0)-gridStrength)*.12;
 gridCtx.setTransform(gridDpr,0,0,gridDpr,0,0);gridCtx.clearRect(0,0,gridWidth,gridHeight);gridCtx.lineWidth=.2;
 const warp=(x,y)=>{
  const planeX=x,planeY=y;
  const dx=gridX-planeX,dy=gridY-planeY,pull=.62*gridStrength*Math.exp(-(dx*dx+dy*dy)/(2*180*180));
  return [planeX+dx*pull,planeY+dy*pull];
 };
 const dots=new Path2D();
 if(showDots)for(let x=-384;x<gridWidth+384;x+=16){for(let y=-384;y<gridHeight+384;y+=16){const [px,py]=warp(x,y);const radius=.85;dots.moveTo(px+radius,py);dots.arc(px,py,radius,0,Math.PI*2);}}
 gridCtx.fillStyle='rgba(255,255,255,.7)';gridCtx.fill(dots);
 if(!reduced.matches){
  const travel=(now%6000)/6000*(gridWidth+gridHeight+700)-350;
  const glow=gridCtx.createLinearGradient(travel/2-130,travel/2-130,travel/2+130,travel/2+130);
  glow.addColorStop(0,'rgba(0,214,144,0)');glow.addColorStop(.25,'rgba(0,214,144,.38)');glow.addColorStop(.48,'rgba(153,220,255,.56)');glow.addColorStop(.75,'rgba(180,230,255,.49)');glow.addColorStop(1,'rgba(180,230,255,0)');
  gridCtx.fillStyle=glow;gridCtx.fill(dots);
 }
 if(showGlow&&gridStrength>.005){
  const greenPulse=.7+.3*Math.sin(now*2*Math.PI/4200),bluePulse=.7+.3*Math.sin(now*2*Math.PI/2900+1.3),purplePulse=.7+.3*Math.sin(now*2*Math.PI/5600+2.6);
  const purpleX=gridX-36+Math.sin(now/700+2)*34,purpleY=gridY+24+Math.cos(now/850+1)*28;
  const purpleLight=gridCtx.createRadialGradient(purpleX,purpleY,0,purpleX,purpleY,105);
  purpleLight.addColorStop(0,`rgba(190,160,245,${.46*gridStrength*purplePulse})`);
  purpleLight.addColorStop(.3,`rgba(201,180,250,${.28*gridStrength*purplePulse})`);
  purpleLight.addColorStop(.65,`rgba(218,204,255,${.09*gridStrength*purplePulse})`);
  purpleLight.addColorStop(1,'rgba(218,204,255,0)');
  gridCtx.fillStyle=purpleLight;gridCtx.fillRect(purpleX-105,purpleY-105,210,210);
  const blueX=gridX+38+Math.sin(now/500)*42,blueY=gridY-22+Math.cos(now/650)*34;
  const blueLight=gridCtx.createRadialGradient(blueX,blueY,0,blueX,blueY,110);
  blueLight.addColorStop(0,`rgba(117,198,255,${.48*gridStrength*bluePulse})`);
  blueLight.addColorStop(.3,`rgba(140,213,255,${.30*gridStrength*bluePulse})`);
  blueLight.addColorStop(.65,`rgba(169,227,255,${.10*gridStrength*bluePulse})`);
  blueLight.addColorStop(1,'rgba(169,227,255,0)');
  gridCtx.fillStyle=blueLight;gridCtx.fillRect(blueX-110,blueY-110,220,220);
  const light=gridCtx.createRadialGradient(gridX,gridY,0,gridX,gridY,120);
  light.addColorStop(0,`rgba(0,214,144,${.44*gridStrength*greenPulse})`);
  light.addColorStop(.3,`rgba(0,214,144,${.28*gridStrength*greenPulse})`);
  light.addColorStop(.65,`rgba(0,214,144,${.09*gridStrength*greenPulse})`);
  light.addColorStop(1,'rgba(0,214,144,0)');
  gridCtx.fillStyle=light;gridCtx.fillRect(gridX-120,gridY-120,240,240);
  const cursorGlow=gridCtx.createRadialGradient(gridX,gridY,0,gridX,gridY,90);
  cursorGlow.addColorStop(0,`rgba(0,214,144,${.85*gridStrength})`);
  cursorGlow.addColorStop(.25,`rgba(0,214,144,${.42*gridStrength})`);
  cursorGlow.addColorStop(.6,`rgba(0,214,144,${.1*gridStrength})`);
  cursorGlow.addColorStop(1,'rgba(0,214,144,0)');
  gridCtx.fillStyle=cursorGlow;gridCtx.fill(dots);
 }
}
resizeServicesGrid();requestAnimationFrame(drawServicesGrid);
}
installCursorAtmosphere(document.querySelector('.why-choose'),true,false);
installCursorAtmosphere(document.querySelector('.hero'),false);
installCursorAtmosphere(document.querySelector('.services'),false);
const otcMotion=document.querySelector('.otc-motion'),otcArt=document.querySelector('.otc-animation');
otcMotion.addEventListener('pointermove',e=>{if(reduced.matches||e.pointerType==='touch')return;const box=otcMotion.getBoundingClientRect();const position=Math.max(-1,Math.min(1,(e.clientX-box.left)/box.width*2-1));otcArt.style.transform=`rotateY(${position*5}deg)`;},{passive:true});
otcMotion.addEventListener('pointerleave',()=>{otcArt.style.transform='rotateY(0deg)';});

const depthPanels=[...document.querySelectorAll('.panel')];
depthPanels.forEach(panel=>{
 for(const side of ['back','left','right','top','bottom']){const face=document.createElement('span');face.className=`depth-face depth-${side}`;face.setAttribute('aria-hidden','true');panel.prepend(face);}
 panel.addEventListener('focusin',()=>panel.setAttribute('data-raised',''));
 panel.addEventListener('focusout',()=>panel.removeAttribute('data-raised'));
});
let hoverPanel=null,lastHoverX=-1,lastHoverY=-1;
window.addEventListener('pointermove',e=>{
 if(e.pointerType==='touch'||(e.clientX===lastHoverX&&e.clientY===lastHoverY))return;
 lastHoverX=e.clientX;lastHoverY=e.clientY;
 const next=e.target.closest?.('.panel');
 if(next===hoverPanel)return;
 hoverPanel?.removeAttribute('data-raised');hoverPanel=next;
 hoverPanel?.setAttribute('data-raised','');
},{passive:true});
document.documentElement.addEventListener('pointerleave',()=>{hoverPanel?.removeAttribute('data-raised');hoverPanel=null;});
const scene=document.querySelector('.scene');
let targetX=0,targetY=0,currentX=0,currentY=0,cursorFrame=0;
function paintCursor(){
 currentX+=(targetX-currentX)*.12;currentY+=(targetY-currentY)*.12;
 scene.style.transform=`rotateY(${currentX*10}deg) rotateX(${-currentY*10}deg)`;
 cursorFrame=Math.abs(targetX-currentX)+Math.abs(targetY-currentY)>.001?requestAnimationFrame(paintCursor):0;
}
window.addEventListener('pointermove',e=>{
 if(e.pointerType==='touch'||reduced.matches)return;
 targetX=Math.max(-1,Math.min(1,e.clientX/window.innerWidth*2-1));
 targetY=Math.max(-1,Math.min(1,e.clientY/window.innerHeight*2-1));
 if(!cursorFrame)cursorFrame=requestAnimationFrame(paintCursor);
},{passive:true});
document.documentElement.addEventListener('pointerleave',()=>{targetX=targetY=0;if(!cursorFrame)cursorFrame=requestAnimationFrame(paintCursor);});


// Keep the visible UI 100px below the introduction at every breakpoint.
const heroStage=document.querySelector('.stage');
const heroPinTrack=document.createElement('div');heroPinTrack.className='hero-pin-track';
heroStage.before(heroPinTrack);heroPinTrack.append(heroStage);
function sizeHeroPreview(){
 const sceneScale=parseFloat(getComputedStyle(scene).scale)||1;
 heroStage.style.setProperty('--preview-height',`${scene.offsetHeight*sceneScale}px`);
 heroPinTrack.style.setProperty('--track-preview-height',`${scene.offsetHeight*sceneScale}px`);
 document.documentElement.style.setProperty('--hero-cover-runway',`${scene.offsetHeight*sceneScale+innerHeight*.2+200}px`);
}
window.addEventListener('resize',sizeHeroPreview);
document.fonts.ready.then(sizeHeroPreview);sizeHeroPreview();
// Hold the fixed-size hero while the services layer scrolls over it.
const scrollBackdrop=document.querySelector('.background-parallax');
const scrollHeadline=document.querySelector('.intro');
let parallaxFrame=0,parallaxLimit=0;
function measureHeroParallax(){
 const hero=document.querySelector('.hero');
 parallaxLimit=hero.offsetTop+hero.offsetHeight-innerHeight;

 paintScrollParallax();
}
function paintScrollParallax(){
 parallaxFrame=0;
 const travel=Math.max(0,Math.min(scrollY,parallaxLimit));
 scrollBackdrop.style.translate=reduced.matches?'none':`0 ${travel*.55}px`;
 scrollHeadline.style.translate=reduced.matches?'none':`0 ${travel*1.35}px`;
 const blurProgress=Math.max(0,Math.min(1,travel/420));
 scrollHeadline.style.filter=reduced.matches?'none':`blur(${blurProgress*blurProgress*32}px)`;
}
window.addEventListener('scroll',()=>{if(!parallaxFrame)parallaxFrame=requestAnimationFrame(paintScrollParallax)},{passive:true});
window.addEventListener('resize',measureHeroParallax);
document.fonts.ready.then(measureHeroParallax);
reduced.addEventListener('change',measureHeroParallax);
measureHeroParallax();
if(reduced.matches)document.querySelectorAll('.broker-wave animate, .broker-arc-track animateTransform').forEach(animation=>animation.remove());
const entranceObserver=new IntersectionObserver(entries=>{
 for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-visible');entranceObserver.unobserve(entry.target);}
},{threshold:.12});
document.querySelectorAll('.services>h2,.service-art,.service-heading,.service-features>.service-glass').forEach(el=>{
 if(reduced.matches)return;
 el.classList.add('service-enter');
 if(el.matches('.service-glass'))el.style.setProperty('--enter-delay',`${Array.from(el.parentElement.children).indexOf(el)*110}ms`);
 entranceObserver.observe(el);
});

// Draw independent artwork in one raster layer, avoiding animated SVG mask surfaces.
const artCanvas=document.querySelector('.background-art'),artContext=artCanvas.getContext('2d');
const artwork=new Image();let sprites=[],artWidth=0,artHeight=0,artDpr=1,lastArtFrame=0;
const artRegions=[[750,205,100,115],[1090,245,105,95],[2010,215,150,120],[315,485,105,95],[980,600,205,240],[870,970,160,130],[1810,1030,120,200],[1600,1510,410,380],[505,1690,245,165],[1020,1780,135,150]];
function sizeArtwork(){artCanvas.parentElement.style.bottom='auto';artCanvas.parentElement.style.height=`${document.querySelector('.hero').offsetTop+document.querySelector('.intro').offsetHeight+window.innerHeight+500}px`;const box=artCanvas.parentElement.getBoundingClientRect();artWidth=box.width;artHeight=box.height;artDpr=Math.min(devicePixelRatio||1,1.5);artCanvas.width=Math.round(artWidth*artDpr);artCanvas.height=Math.round(artHeight*artDpr);}
artwork.onload=()=>{
 sprites=artRegions.map(([x,y,rx,ry],i)=>{
  const canvas=document.createElement('canvas');canvas.width=rx*2;canvas.height=ry*2;
  const ctx=canvas.getContext('2d');ctx.drawImage(artwork,x-rx,y-ry,rx*2,ry*2,0,0,rx*2,ry*2);
  ctx.globalCompositeOperation='destination-in';ctx.translate(rx,ry);ctx.scale(rx,ry);
  const fade=ctx.createRadialGradient(0,0,.75,0,0,1);fade.addColorStop(0,'#fff');fade.addColorStop(1,'transparent');ctx.fillStyle=fade;ctx.fillRect(-1,-1,2,2);
  return {canvas,x,y,rx,ry,phase:Math.random()*Math.PI*2,duration:14+i};
 });sizeArtwork();requestAnimationFrame(drawArtwork);
};
function drawArtwork(now){
 requestAnimationFrame(drawArtwork);if(document.hidden||now-lastArtFrame<33)return;lastArtFrame=now;
 artContext.setTransform(artDpr,0,0,artDpr,0,0);artContext.clearRect(0,0,artWidth,artHeight);
 const scale=Math.min(artWidth/2600,artHeight/2580),ox=(artWidth-2600*scale)/2+200*scale,oy=(artHeight-2580*scale)/2+180*scale;
 sprites.forEach((s,i)=>{const t=reduced.matches?0:now/1000/s.duration*Math.PI*2+s.phase;const dx=reduced.matches?0:Math.sin(t)*(90+i*5),dy=reduced.matches?0:Math.cos(t*.83)*(75+i*4);
 artContext.drawImage(s.canvas,ox+(s.x-s.rx+dx)*scale-(reduced.matches?0:currentX*60),oy+(s.y-s.ry+dy)*scale-(reduced.matches?0:currentY*45),s.rx*2*scale,s.ry*2*scale);
 });
}
window.addEventListener('resize',sizeArtwork);artwork.src='hero-background.png?v=17';
const symbols=Object.keys(coins),received=new Set();
const feedStatus=document.querySelector('.connection');
let socket,reconnectTimer,watchdog,lastMessage=0,retries=0,stopped=false;
function status(text){feedStatus.innerHTML='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 14v-3m4 3V8m4 6V5m4 9V2" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><span></span>';feedStatus.lastElementChild.textContent=text;}
const livePrices=new Map();
function updateLiveQuotes(){
 const eth=livePrices.get('ETH'),usdt=livePrices.get('USDT');
 if(eth&&usdt){
  const rate=eth/usdt,gross=1000000/rate,fee=gross*.0001;
  document.querySelector('[data-reference-rate]').textContent=`1 ETH ≈ ${rate.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})} USDT`;
  document.querySelector('[data-estimated-fee]').textContent=fee.toFixed(8);
  document.querySelector('[data-estimated-receive]').textContent=`${(gross-fee).toLocaleString('en-US',{minimumFractionDigits:8,maximumFractionDigits:8})} ETH`;
 }
 if(usdt)document.querySelector('[data-pay-usd]').textContent=`≈ ${(1000000*usdt).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})} USD`;
 document.querySelectorAll('[data-rate-base]').forEach(el=>{
  const base=el.dataset.rateBase,quote=el.dataset.rateQuote,a=livePrices.get(base),b=livePrices.get(quote);
  if(a&&b&&!el.dataset.rateLocked){el.dataset.rateLocked='true';el.textContent=`1 ${base} ≈ ${(a/b).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:quote==='BTC'?8:5})} ${quote}`;}
 });
}
const previousPrices=new Map(),priceFlashTimers=new Map(),lastPriceUpdates=new Map();
function resetPriceDirections(){
 previousPrices.clear();
 priceFlashTimers.forEach(timer=>clearTimeout(timer));
 priceFlashTimers.clear();
 document.querySelectorAll('.market-row').forEach(row=>{delete row.dataset.direction;delete row.dataset.flashing;});
}
function updatePriceDirection(symbol,price){
 const previous=previousPrices.get(symbol);
 previousPrices.set(symbol,price);
 if(previous===undefined)return;
 const row=document.querySelector(`#markets [data-price="${symbol}"]`)?.closest('.market-row');
 if(!row)return;
 clearTimeout(priceFlashTimers.get(symbol));
 delete row.dataset.flashing;
 void row.offsetWidth;
 row.dataset.direction=price===previous?'flat':price>previous?'up':'down';
 row.dataset.flashing='true';
 priceFlashTimers.set(symbol,setTimeout(()=>{
  delete row.dataset.flashing;
  delete row.dataset.direction;
  priceFlashTimers.delete(symbol);
 },1400));
}
function renderTicker(t){
 const symbol=t.symbol?.split('/')[0];
 if(!symbols.includes(symbol)||!Number.isFinite(t.last)||t.last<=0)return;
 livePrices.set(symbol,t.last);
 updateLiveQuotes();
 lastPriceUpdates.set(symbol,Date.now());
 updatePriceDirection(symbol,t.last);
 const precision=['USDT','USDC','XRP'].includes(symbol)?5:2;
 const price=t.last.toLocaleString('en-US',{minimumFractionDigits:precision,maximumFractionDigits:precision});
 document.querySelectorAll(`[data-price="${symbol}"]`).forEach(e=>{e.textContent=price;e.title=`${symbol}/USD · Received ${new Date().toLocaleTimeString()}`;});
 if(Number.isFinite(t.change_pct))document.querySelectorAll(`[data-change="${symbol}"]`).forEach(e=>{e.textContent=`${t.change_pct>=0?'+':''}${t.change_pct.toFixed(2)}%`;e.className=t.change_pct<0?'down':'up';});
 received.add(symbol);
 status(received.size===symbols.length?'Stable connection':'Connecting…');
 feedStatus.title='Live USD prices; updates stream on trades.';
}
function connectPrices(){
 if(stopped||!navigator.onLine)return;
 clearTimeout(reconnectTimer);clearInterval(watchdog);
 if(socket){socket.onclose=null;socket.close();}
 received.clear();resetPriceDirections();status('Connecting…');
 socket=new WebSocket('wss://ws.kraken.com/v2');lastMessage=Date.now();
 socket.onopen=()=>{retries=0;socket.send(JSON.stringify({method:'subscribe',params:{channel:'ticker',symbol:symbols.map(s=>s+'/USD'),snapshot:true}}));};
 socket.onmessage=e=>{lastMessage=Date.now();try{const m=JSON.parse(e.data);if(m.channel==='ticker')m.data?.forEach(renderTicker);if(m.success===false){status('Connection unavailable');socket.close();}}catch{}};
 socket.onerror=()=>socket.close();
 socket.onclose=()=>{clearInterval(watchdog);if(stopped)return;status('Reconnecting…');reconnectTimer=setTimeout(connectPrices,Math.min(30000,2000*2**Math.min(retries++,4)));};
 watchdog=setInterval(()=>{if(Date.now()-lastMessage>30000){status('Reconnecting…');socket.close();}},5000);
}
let priceCheckRunning=false;
const restSymbols={XXBTZUSD:'BTC',XETHZUSD:'ETH',USDTZUSD:'USDT',USDCUSD:'USDC',SOLUSD:'SOL',XXRPZUSD:'XRP'};
async function checkPrices(){
 if(stopped||!navigator.onLine||priceCheckRunning||document.hidden)return;
 if(symbols.every(s=>Date.now()-(lastPriceUpdates.get(s)||0)<15000))return;
 priceCheckRunning=true;
 const started=Date.now();
 try{
  const response=await fetch('https://api.kraken.com/0/public/Ticker?pair=XBTUSD,ETHUSD,USDTUSD,USDCUSD,SOLUSD,XRPUSD',{cache:'no-store',signal:AbortSignal.timeout(8000)});
  if(!response.ok)throw new Error('Price check failed');
  const payload=await response.json();
  if(payload.error?.length)throw new Error('Price check unavailable');
  for(const [pair,ticker] of Object.entries(payload.result||{})){
   const symbol=restSymbols[pair];
   if(symbol&&(lastPriceUpdates.get(symbol)||0)<started)renderTicker({symbol:symbol+'/USD',last:Number(ticker.c?.[0])});
  }
  feedStatus.title='Live USD prices; automatic price checks supplement the stream.';
 }catch{
  if(symbols.some(s=>Date.now()-(lastPriceUpdates.get(s)||0)>60000))status('Reconnecting…');
 }finally{priceCheckRunning=false;}
}
setInterval(checkPrices,15000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden){stopped=false;connectPrices();checkPrices();}});
window.addEventListener('focus',()=>{if(!stopped){checkPrices();if(!socket||socket.readyState>1)connectPrices();}});
window.addEventListener('offline',()=>{status('Offline');socket?.close();});
window.addEventListener('online',connectPrices);
window.addEventListener('pagehide',()=>{stopped=true;clearTimeout(reconnectTimer);clearInterval(watchdog);socket?.close();});
window.addEventListener('pageshow',e=>{if(e.persisted){stopped=false;connectPrices();}});
connectPrices();
checkPrices();



// Project the existing semicircular accent in the platform plane, including its side faces.
(()=>{
 const root=document.querySelector('.broker-arc-perspective');
 const ns='http://www.w3.org/2000/svg', faces=[];
 for(let i=0;i<99;i++){const p=document.createElementNS(ns,'path');root.appendChild(p);faces.push(p)}
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let visible=true,last=0;
 new IntersectionObserver(([e])=>visible=e.isIntersecting).observe(root.closest('.service-art'));
 const project=(r,a,z)=>{const x=r*Math.cos(a),y=r*Math.sin(a),k=540/(540-y*.916);return [451+x*k,471+(y*.4-z)*k]};
 const polygon=points=>'M'+points.map(p=>p.map(v=>v.toFixed(2)).join(',')).join('L')+'Z';
 function draw(t){
  if(!reduced)requestAnimationFrame(draw);
  if(!visible||t-last<32)return;last=t;
  const angle=reduced?0:t/9000*Math.PI*2, pieces=[];
  for(let i=0;i<32;i++){
   const a=angle-Math.PI/2+i*Math.PI/32,b=a+Math.PI/32,m=(a+b)/2;
   pieces.push({depth:Math.sin(m)*82,z:1,fill:'#ffc0b6',p:[project(82,a,7),project(82,b,7),project(69,b,7),project(69,a,7)]});
   pieces.push({depth:Math.sin(m)*82,z:0,fill:Math.sin(m)>0?'#ee9c98':'#d99599',p:[project(82,a,0),project(82,b,0),project(82,b,7),project(82,a,7)]});
   pieces.push({depth:Math.sin(m)*69,z:0,fill:'#e9a4a1',p:[project(69,a,0),project(69,b,0),project(69,b,7),project(69,a,7)]});
  }
  for(const a of [angle-Math.PI/2,angle+Math.PI/2])pieces.push({depth:Math.sin(a)*75,z:0,fill:'#f3aea5',p:[project(69,a,0),project(82,a,0),project(82,a,7),project(69,a,7)]});
  pieces.sort((a,b)=>a.depth-b.depth||a.z-b.z);
  faces.forEach((p,i)=>{const f=pieces[i];p.setAttribute('d',f?polygon(f.p):'');if(f){p.setAttribute('fill',f.fill);p.setAttribute('stroke',f.fill);p.setAttribute('stroke-width','.3')}});
 }
 draw(100);
})();



// Measure the runway only on layout changes; scroll frames change transforms only.
(()=>{const track=document.querySelector('.why-track'),section=track.querySelector('.why-choose'),services=document.querySelector('.services'),wrapper=document.querySelector('.services-transition'),motion=matchMedia('(prefers-reduced-motion:reduce)');let queued=false,needsMeasure=true,height=400,travel=0,start=0,trackTop=0;
function measure(){height=section.offsetHeight;track.style.setProperty('--why-stage-height',`${height}px`);const delay=Math.min(80,innerHeight*.1);start=innerHeight*1.2-delay;const end=Math.max(0,innerHeight-height)-delay;travel=motion.matches?0:Math.max(1,start-end);wrapper.style.setProperty('--services-hold-space',`${travel}px`);trackTop=track.getBoundingClientRect().top+scrollY;needsMeasure=false}
function update(){queued=false;if(needsMeasure)measure();const actualTop=trackTop-scrollY,top=actualTop-travel;const progress=motion.matches?1:Math.max(0,Math.min(1,(start-top)/Math.max(1,travel)));services.style.setProperty('--services-hold',`${progress*travel}px`);section.style.setProperty('--why-visible',progress>0?'visible':'hidden');const floating=!motion.matches&&actualTop>innerHeight-height;section.classList.toggle('is-floating',floating);section.style.setProperty('--why-entry-y',`${-innerHeight*(1-progress)}px`);const parallax=motion.matches?1:Math.max(0,Math.min(1,(start+travel-actualTop)/Math.max(1,start+travel-(innerHeight-height))));section.style.setProperty('--why-bg-y',`${80*(1-parallax)}px`)}
function schedule(){if(!queued){queued=true;requestAnimationFrame(update)}}function resize(){needsMeasure=true;schedule()}addEventListener('scroll',schedule,{passive:true});addEventListener('resize',resize);addEventListener('load',resize);motion.addEventListener('change',resize);const observer=new ResizeObserver(resize);observer.observe(section);observer.observe(services);document.fonts.ready.then(resize);schedule();})();
