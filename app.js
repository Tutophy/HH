// Simple i18n + carousel + form handling script
const defaultLang = 'ar';
let currentLang = localStorage.getItem('ilm_lang') || defaultLang;
const i18nCache = {};

async function loadLang(lang){
  if(i18nCache[lang]) return i18nCache[lang];
  try{
    const res = await fetch(`i18n/${lang}.json`);
    const json = await res.json();
    i18nCache[lang] = json;
    return json;
  }catch(e){
    console.error('Failed to load language',lang,e);
    return {};
  }
}

async function applyTranslations(lang){
  const dict = await loadLang(lang);
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if(!key) return;
    const text = key.split('.').reduce((o,k)=>o && o[k], dict);
    if(text){
      if(el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = text;
      else el.textContent = text;
    }
  });
  document.documentElement.lang = lang;
  document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
  // adjust language button label
  document.getElementById('lang-switch').textContent = (lang === 'ar') ? 'EN' : 'ع';
  localStorage.setItem('ilm_lang', lang);
  currentLang = lang;
}

document.addEventListener('DOMContentLoaded', async ()=>{
  // set year
  document.getElementById('year').textContent = new Date().getFullYear();

  // language switch
  const langBtn = document.getElementById('lang-switch');
  langBtn.addEventListener('click', ()=> {
    applyTranslations(currentLang === 'ar' ? 'en' : 'ar');
  });

  await applyTranslations(currentLang);

  // accessible carousel basic
  const track = document.getElementById('carousel-track');
  const slides = Array.from(track.children);
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const dots = document.getElementById('carousel-dots');
  let index = 0;

  function update(){
    const slideWidth = slides[0].getBoundingClientRect().width + parseInt(getComputedStyle(slides[0]).gap || 16);
    track.style.transform = `translateX(${-(slideWidth * index)}px)`;
    // update dots aria
    Array.from(dots.children).forEach((d,i)=>{
      d.setAttribute('aria-selected', i === index);
    });
  }

  slides.forEach((s,i)=>{
    const btn = document.createElement('button');
    btn.className = 'dot';
    btn.setAttribute('role','tab');
    btn.setAttribute('aria-selected', i === 0);
    btn.addEventListener('click', ()=>{ index = i; update(); });
    dots.appendChild(btn);
  });

  prevBtn.addEventListener('click', ()=>{ index = Math.max(0, index-1); update(); });
  nextBtn.addEventListener('click', ()=>{ index = Math.min(slides.length-1, index+1); update(); });

  // keyboard for carousel
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowLeft') prevBtn.click();
    if(e.key === 'ArrowRight') nextBtn.click();
  });

  // pause auto on focus/hover
  let auto = setInterval(()=>{ index = (index+1) % slides.length; update(); }, 5000);
  [track, prevBtn, nextBtn].forEach(el=>{
    el.addEventListener('mouseover', ()=>clearInterval(auto));
    el.addEventListener('focusin', ()=>clearInterval(auto));
    el.addEventListener('mouseout', ()=>{ auto = setInterval(()=>{ index = (index+1) % slides.length; update(); }, 5000); });
  });

  update();

  // Form handling - posts to /api/preorder
  const form = document.getElementById('preorder-form');
  const status = document.getElementById('form-status');
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    status.textContent = '';
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    try{
      const res = await fetch(form.action, {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify(payload)
      });
      if(res.ok){
        const data = await res.json();
        status.textContent = data.message || 'تم إرسال الطلب. شكراً';
        form.reset();
      } else {
        const err = await res.json();
        status.textContent = err.message || 'حدث خطأ';
      }
    }catch(err){
      status.textContent = 'خطأ في الاتصال';
      console.error(err);
    }
  });

});
