document.addEventListener('DOMContentLoaded', ()=>{
  // Navbar background on scroll
  const nav = document.getElementById('siteNav');
  if(nav) window.addEventListener('scroll', ()=>{nav.classList.toggle('scrolled', window.scrollY>20)});

  // Active link highlighting using IntersectionObserver
  const links = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('main section');
  if(sections.length){
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        const id = e.target.id;
        const link = document.querySelector('.nav-links a[href="#'+id+'"]');
        if(e.isIntersecting){links.forEach(l=>l.classList.remove('active')); if(link) link.classList.add('active')}
      })
    },{threshold:0.45});
    sections.forEach(s=>obs.observe(s));
  }

  // Map & telemetry only if #map present
  const mapEl = document.getElementById('map');
  if(mapEl && typeof L !== 'undefined'){
    const map = L.map('map', {zoomControl:true, scrollWheelZoom:false}).setView([13.1402,77.5895],13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'',maxZoom:19}).addTo(map);
    const route = [[13.141,77.588],[13.142,77.592],[13.145,77.595],[13.148,77.593],[13.151,77.590],[13.153,77.587]];
    const poly = L.polyline(route,{color:'#ffb703',weight:4,opacity:0.9}).addTo(map);
    const vehIcon = L.divIcon({className:'vehicle-icon',html:`<svg width="28" height="14" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="12" rx="3" fill="#ffb703"/></svg>`});
    const marker = L.marker(route[0],{icon:vehIcon}).addTo(map);
    let idx=0; function step(){ idx=(idx+1)%route.length; marker.setLatLng(route[idx]); map.panTo(route[idx],{animate:true,duration:0.8}); }
    let sim = setInterval(step,1800);

    // Track button focuses the map
    const trackBtn = document.getElementById('trackBtn');
    if(trackBtn) trackBtn.addEventListener('click', ()=>{map.invalidateSize(); map.setView(route[idx],14)})
  }

  // Telemetry simulation if telemetry elements present
  function rnd(min,max){return Math.round((Math.random()*(max-min)+min)*10)/10}
  const telemetryEls = {
    speed:document.getElementById('speed'),soc:document.getElementById('soc'),solar:document.getElementById('solar'),voltage:document.getElementById('voltage'),temp:document.getElementById('temp'),range:document.getElementById('range'),eff:document.getElementById('eff'),mode:document.getElementById('mode')
  }
  if(telemetryEls.speed){
    function updateTelemetry(){
      telemetryEls.speed.textContent = rnd(20,95) + ' km/h';
      telemetryEls.soc.textContent = Math.round(rnd(45,98)) + ' %';
      telemetryEls.solar.textContent = Math.round(rnd(1200,4200)) + ' W';
      telemetryEls.voltage.textContent = rnd(360,420) + ' V';
      telemetryEls.temp.textContent = Math.round(rnd(30,80)) + ' °C';
      telemetryEls.range.textContent = Math.round(rnd(60,220)) + ' km';
      telemetryEls.eff.textContent = Math.round(rnd(80,180)) + ' Wh/km';
      telemetryEls.mode.textContent = Math.random()>0.8? 'Race':'Eco';
    }
    updateTelemetry(); setInterval(updateTelemetry,2500);
  }

  // Timeline scroll reveal
  const timelineItems = document.querySelectorAll('.timeline-item');
  if(timelineItems.length){
    const tObs = new IntersectionObserver((entries, obs)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          const el = entry.target;
          const delay = parseInt(el.dataset.index || 0, 10) * 80;
          setTimeout(()=> el.classList.add('in-view'), delay);
          obs.unobserve(el);
        }
      })
    }, {threshold: 0.12});
    timelineItems.forEach((el,i)=>{ el.dataset.index = i; tObs.observe(el) });
  }

});

// Load shared footer partial into pages
(function loadFooter(){
  const slot = document.getElementById('siteFooter');
  if(!slot) return;
  fetch('assets/partials/footer.html').then(r=>{ if(!r.ok) throw new Error('footer fetch failed'); return r.text() }).then(html=>{ slot.innerHTML = html }).catch(()=>{
    slot.innerHTML = '<footer><div class="container"><div>© Team Horus — NMIT</div><div class="muted">Built by students • Competition-proven engineering</div></div></footer>'
  });
})();
