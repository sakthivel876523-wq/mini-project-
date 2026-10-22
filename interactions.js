// Interaction layer; report data and persistence remain in app.js.
let queueView={category:'',status:'',priority:'',search:''};
const baseBind=bind;
function goQueue(values){queueView={category:'',status:'',priority:'',search:'',...values};if(location.hash==='#incidents')render();else location.hash='incidents'}
function filterQueue(){
 const q=$('#search').value.trim().toLowerCase(),s=$('#status-filter').value,p=$('#priority-filter').value,c=queueView.category;
 queueView={category:c,status:s,priority:p,search:q};
 const list=reports.filter(r=>(!c||r.category===c)&&(!s||(s==='Open'?r.status!=='Resolved':r.status===s))&&(!p||r.priority===p)&&[r.id,r.location,r.description,r.category].join(' ').toLowerCase().includes(q));
 $('#queue').innerHTML=rows(list);$('#result-count').textContent=`${list.length} of ${reports.length} incidents`;
 document.querySelectorAll('[data-category]').forEach(b=>{const active=b.dataset.category===c;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active))});
 $('#clear-filters').hidden=!(c||s||p||q);
}
bind=function(page){
 baseBind(page);
 if(page==='overview'){
  const filters=[{}, {status:'Open'}, {status:'Resolved'}, {status:'Open',priority:'High'}];
  document.querySelectorAll('.stats>.card').forEach((card,i)=>{const b=document.createElement('button');b.className=card.className+' stat-action';b.innerHTML=card.innerHTML+'<span class="card-arrow" aria-hidden="true">↗</span>';b.setAttribute('aria-label','View '+['all reports','open incidents','resolved reports','open high-priority incidents'][i]);b.onclick=()=>goQueue(filters[i]);card.replaceWith(b)});
  document.querySelectorAll('.bar-row').forEach(row=>{const category=row.firstElementChild.textContent;const b=document.createElement('button');b.className=row.className+' category-action';b.innerHTML=row.innerHTML;b.setAttribute('aria-label','View '+category+' incidents');b.onclick=()=>goQueue({category});row.replaceWith(b)});
 }
 if(page==='incidents'){
  $('#status-filter').insertAdjacentHTML('afterbegin','<option value="Open">Open incidents</option>');
  $('.filters').insertAdjacentHTML('beforebegin',`<div class="category-tabs" aria-label="Incident categories">${['',...Object.keys(categories)].map(c=>`<button class="category-tab" data-category="${c}" aria-pressed="false">${c?icon(c):icon('overview')} ${c||'All issues'}<span>${c?reports.filter(r=>r.category===c).length:reports.length}</span></button>`).join('')}</div>`);
  $('#queue').insertAdjacentHTML('beforebegin','<div class="result-toolbar"><span id="result-count" role="status" aria-live="polite"></span><button class="link" id="clear-filters">Clear filters ×</button></div>');
  $('#search').value=queueView.search;$('#status-filter').value=queueView.status;$('#priority-filter').value=queueView.priority;
  $('#search').oninput=filterQueue;$('#status-filter').onchange=filterQueue;$('#priority-filter').onchange=filterQueue;
  document.querySelectorAll('[data-category]').forEach(b=>b.onclick=()=>{queueView.category=b.dataset.category;filterQueue()});
  $('#clear-filters').onclick=()=>{queueView={category:'',status:'',priority:'',search:''};$('#search').value='';$('#status-filter').value='';$('#priority-filter').value='';filterQueue()};
  filterQueue();
 }
 if(page==='report'){
  $('#description').insertAdjacentHTML('afterend','<div class="description-footer"><span id="description-hint">A little detail helps the right team respond.</span><span id="character-count">0 / 1500</span></div>');
  const oldInput=$('#description').oninput;
  $('#description').oninput=()=>{oldInput();updateCount()};
  function updateCount(){let n=$('#description').value.length;$('#character-count').textContent=n+' / 1500';$('#description-hint').textContent=n>0&&n<12?'Add a few more details (at least 12 characters).':'A little detail helps the right team respond.'}
  const oldExample=$('#example').onclick;$('#example').onclick=()=>{oldExample();updateCount();$('#description').focus()};
  const oldAnalyze=$('#analyze').onclick;$('#analyze').onclick=()=>{oldAnalyze();if(analysis){$('#analysis').classList.remove('reveal');void $('#analysis').offsetWidth;$('#analysis').classList.add('reveal');$('#analysis').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'nearest'})}};
 }
 if(page==='track'){
  $('#tracking-result').setAttribute('aria-live','polite');
  $('#tracking-result').innerHTML=`<div class="track-empty"><span class="track-illustration">${icon('track')}</span><h2>Your report. Every step.</h2><p>See its current status, assigned department and activity.</p><div class="recent-track"><span>Try a recent report</span>${reports.slice(0,3).map(r=>`<button class="btn" data-track="${esc(r.id)}">${esc(r.id)} <span>→</span></button>`).join('')}</div></div>`;
 }
};
document.addEventListener('click',async e=>{
 const t=e.target.closest('[data-track]');if(t){$('#tracking-id').value=t.dataset.track;$('#track-form').requestSubmit()}
 const copy=e.target.closest('[data-copy]');if(copy){try{await navigator.clipboard.writeText(copy.dataset.copy);toast('Tracking ID copied')}catch{toast('Copy this tracking ID: '+copy.dataset.copy)}}
 const detail=e.target.closest('[data-detail]');if(detail){const r=reports.find(r=>r.id===detail.dataset.detail);if(!r)return;const next=r.status==='Reported'?'In Progress':r.status==='In Progress'?'Resolved':null;if(next){$('#update-status').insertAdjacentHTML('beforebegin',`<button type="button" class="suggest-status" data-next-status="${next}">${icon(next==='Resolved'?'check':'track')} ${next==='Resolved'?'Work completed? Select Resolved':'Ready to start? Select In Progress'} <span>→</span></button>`)} }
 const next=e.target.closest('[data-next-status]');if(next){$('#update-status').value=next.dataset.nextStatus;next.textContent='Selected '+next.dataset.nextStatus+' · Click Save status to confirm';$('#update-status').focus()}
});
const baseDetails=details;
details=function(r,admin=false){return baseDetails(r,admin)+(admin?'':`<div class="tracking-actions"><button class="btn" data-copy="${esc(r.id)}">Copy tracking ID</button><a class="btn" href="#report">Report another issue →</a></div>`)};
render();
