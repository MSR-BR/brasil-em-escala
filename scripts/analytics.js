(() => {
  const tag=document.currentScript, id=tag?.dataset.id;
  if(!/^G-[A-Z0-9]+$/.test(id||'')||tag.dataset.enabled!=='true'||location.hostname!=='msr-br.github.io'||!location.pathname.startsWith('/brasil-em-escala/'))return;
  // A repeated script tag must not install handlers or send a second page_view.
  if(window.__beeAnalyticsInstalled)return;
  window.__beeAnalyticsInstalled=true;
  const key='bee.analytics.v1', state=()=>{try{return localStorage.getItem(key);}catch{return null;}};
  let allowed=false,loaded=false;
  function queue(){window.dataLayer=window.dataLayer||[];window.dataLayer.push(arguments);}
  const disable=()=>{
    allowed=false;window['ga-disable-'+id]=true;
    if(loaded)queue('consent','update',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    // Never remove Analytics cookies belonging to another project on this host.
    for(const c of document.cookie.split(';')){const name=c.split('=')[0].trim();if(!/^bee_ga(?:_|$)/.test(name))continue;
      for(const domain of ['',`; domain=${location.hostname}`,`; domain=.${location.hostname}`])document.cookie=`${name}=; Max-Age=0; path=/brasil-em-escala/${domain}`;}
  };
  const enable=()=>{
    allowed=true;window['ga-disable-'+id]=false;
    if(loaded){queue('consent','update',{analytics_storage:'granted'});return;}
    loaded=true;window.dataLayer=window.dataLayer||[];
    queue('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    let referrer='';try{const r=new URL(document.referrer);if(/^https?:$/.test(r.protocol))referrer=r.origin;}catch{}
    // Override SDK defaults as well as explicit events: never inherit query/title text.
    const pageContext={page_location:location.origin+location.pathname,page_referrer:referrer,page_title:'Brasil em Escala'};
    queue('js',new Date());queue('config',id,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,cookie_prefix:'bee',cookie_domain:location.hostname,cookie_path:'/brasil-em-escala/',...pageContext});
    const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+id;document.head.append(script);
    queue('event','page_view',pageContext);
  };
  const panel=document.createElement('aside');panel.setAttribute('aria-label','Preferências de medição');panel.style.cssText='position:fixed;bottom:16px;left:16px;right:16px;background:#fff;color:#172d38;padding:18px;border:2px solid #006d65;z-index:1000;max-width:640px';
  panel.innerHTML='<p>Podemos medir leitura, downloads e compartilhamentos para melhorar as histórias?</p><button type="button" data-choice="granted">Aceitar medição</button> <button type="button" data-choice="denied">Recusar</button> <a href="/brasil-em-escala/privacidade/">Privacidade</a>';
  panel.addEventListener('click',e=>{const v=e.target.dataset.choice;if(!v)return;try{localStorage.setItem(key,v);}catch{}v==='granted'?enable():disable();panel.hidden=true;});document.body.append(panel);
  const saved=state();panel.hidden=saved==='granted'||saved==='denied';saved==='granted'?enable():disable();
  document.querySelector('[data-analytics-preferences]')?.addEventListener('click',()=>{panel.hidden=false;panel.querySelector('button').focus();});
  const lastEvent=new Map();
  const event=name=>{if(!allowed)return;const at=performance.now();if(at-(lastEvent.get(name)??-Infinity)<500)return;
    lastEvent.set(name,at);queue('event',name,{bee_surface:location.pathname.includes('/historias/')?'story':'site'});};
  document.addEventListener('click',e=>{const a=e.target.closest('a');if(a?.hasAttribute('download'))event('bee_download');});
  document.addEventListener('bee:share-success',()=>event('bee_share'));
  let read=false,visibleMs=0,lastTick=performance.now();
  setInterval(()=>{const at=performance.now(),elapsed=Math.min(1000,Math.max(0,at-lastTick));lastTick=at;
    if(!allowed||document.visibilityState!=='visible'||!location.pathname.includes('/historias/')||read)return;
    visibleMs+=elapsed;if(visibleMs>=30000){event('bee_read_30s');read=true;}
  },1000);
})();
