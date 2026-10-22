const issuePresets={Roads:{title:'Safer streets',description:'A pothole on the road needs inspection and repair.',caption:'Potholes & road damage'},Water:{title:'Every drop matters',description:'A water pipe is leaking onto the street.',caption:'Leaks & drainage'},Waste:{title:'Cleaner corners',description:'Garbage has accumulated beside the street.',caption:'Waste & sanitation'}};
let presetToApply=null,photoVersion=0;
const interactionBind=bind;
bind=function(page){
 interactionBind(page);
 photoVersion++;
 if(page==='overview'){
  const scene=$('.city-scene');if(scene){scene.className='hero-art';scene.removeAttribute('aria-hidden');scene.innerHTML='<img src="assets/civic-neighbourhood.jpg" alt="Illustration of a green neighbourhood with trees, homes and shared public spaces" width="1264" height="848"><span>Small actions. A better place to live.</span>'}
  $('.stats').insertAdjacentHTML('afterend',`<section class="issue-shortcuts" aria-label="Start an issue report"><div class="shortcut-heading"><h2>What needs attention?</h2><span>Choose an issue to get started</span></div><div class="issue-tiles">${Object.entries(issuePresets).map(([category,p])=>`<button class="issue-tile" data-preset="${category}"><img src="assets/${category.toLowerCase()}.svg" alt="" width="130" height="92"><span><strong>${p.title}</strong><small>${p.caption}</small></span><span class="tile-arrow" aria-hidden="true">↗</span></button>`).join('')}</div></section>`);
 }
 if(page==='report'){
  const input=$('#photo');input.parentElement.classList.add('photo-field');
  input.insertAdjacentHTML('beforebegin','<div class="drop-copy"><span class="upload-symbol">'+icon('report')+'</span><strong>A photo helps tell the story</strong><span>Drag an image here or choose a file below</span></div>');
  input.insertAdjacentHTML('afterend','<p class="photo-feedback" id="photo-feedback" role="status" aria-live="polite">JPG, PNG or WebP · Up to 3 MB</p>');
  const zone=input.parentElement;zone.setAttribute('aria-label','Incident photo upload');
  function paintPhoto(name){$('#photo-preview').innerHTML=photo?`<div class="photo-selected"><button type="button" class="photo-zoom" data-image-preview aria-label="Enlarge selected incident photo"><img src="${photo}" alt="Selected incident evidence"><span>View larger ↗</span></button><div><strong>${esc(name)}</strong><small>Ready to attach to your report</small><button type="button" class="link" id="remove-photo">Remove photo ×</button></div></div>`:'';if($('#remove-photo'))$('#remove-photo').onclick=()=>{photoVersion++;photo='';input.value='';paintPhoto('');$('#analyze').disabled=false;$('#submit').disabled=!analysis;$('#photo-feedback').textContent='Photo removed. You can choose another image.'};}
  async function readPhoto(file){
   if(!file)return;const version=++photoVersion;
   if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>3*1024*1024){input.value='';$('#analyze').disabled=false;$('#submit').disabled=!analysis;$('#photo-feedback').textContent='Choose a JPG, PNG or WebP under 3 MB. Your previous photo is kept.';return}
   $('#photo-feedback').textContent='Preparing your photo…';$('#analyze').disabled=true;$('#submit').disabled=true;
   try{const bitmap=await createImageBitmap(file);const canvas=document.createElement('canvas'),scale=Math.min(1,1000/Math.max(bitmap.width,bitmap.height));canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);const result=canvas.toDataURL('image/jpeg',.75);bitmap.close();if(version!==photoVersion)return;photo=result;paintPhoto(file.name);$('#photo-feedback').textContent='Photo ready. Click the preview to inspect it.'}
   catch{if(version===photoVersion)$('#photo-feedback').textContent='This image could not be opened. Please choose another.'}
   finally{if(version===photoVersion){$('#analyze').disabled=false;$('#submit').disabled=!analysis}}
  }
  input.onchange=e=>readPhoto(e.target.files[0]);
  let dragDepth=0;zone.addEventListener('dragenter',e=>{e.preventDefault();dragDepth++;zone.classList.add('drag-over')});zone.addEventListener('dragover',e=>e.preventDefault());zone.addEventListener('dragleave',()=>{if(--dragDepth<=0)zone.classList.remove('drag-over')});zone.addEventListener('drop',e=>{e.preventDefault();dragDepth=0;zone.classList.remove('drag-over');if(e.dataTransfer.files.length!==1){$('#photo-feedback').textContent='Please drop one image at a time.';return}readPhoto(e.dataTransfer.files[0])});
  if(presetToApply){$('#description').value=issuePresets[presetToApply].description;$('#description').dispatchEvent(new Event('input'));presetToApply=null;$('#location').focus()}
 }
};
const photoDialog=document.createElement('dialog');photoDialog.className='image-dialog';photoDialog.setAttribute('aria-label','Incident photo preview');photoDialog.innerHTML='<div class="image-dialog-heading"><span>Incident photo</span><button type="button" class="close" aria-label="Close image preview">×</button></div><img alt="Enlarged incident evidence">';document.body.appendChild(photoDialog);photoDialog.querySelector('button').onclick=()=>photoDialog.close();photoDialog.addEventListener('click',e=>{if(e.target===photoDialog)photoDialog.close()});
function showImage(src){photoDialog.querySelector('img').src=src;photoDialog.showModal()}
document.addEventListener('click',e=>{const preset=e.target.closest('[data-preset]');if(preset){presetToApply=preset.dataset.preset;location.hash='report'}const preview=e.target.closest('[data-image-preview]');if(preview&&photo)showImage(photo);const evidence=e.target.closest('[data-evidence]');if(evidence){const r=reports.find(r=>r.id===evidence.dataset.evidence);if(r?.photo)showImage(r.photo)}});
const existingDetails=details;
details=function(r,admin=false){const html=existingDetails(r,admin);return r.photo?html.replace(`<img class="preview" src="${r.photo}" alt="Citizen supplied incident evidence">`,`<button type="button" class="evidence-button" data-evidence="${esc(r.id)}"><img class="preview" src="${r.photo}" alt="Citizen supplied incident evidence"><span>View photo ↗</span></button>`):html};
render();

