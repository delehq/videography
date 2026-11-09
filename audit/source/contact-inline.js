{"@context":"https://schema.org","@type":"WebPage","name":"Work With Me | Video & Photography — Thomas Mamfredas","description":"Let’s plan your film or photos. Weddings, commercial campaigns & personal stories. Based in Zakynthos, traveling across Greece. Reply in 24–48h.","url":"https://thomasmamfredas.com/","image":"https://thomasmamfredas.com/assets/images/default-image.jpg"}

        (function() {
            'use strict';

            let scriptAnima = '/assets/js/manim.js?100';
                            scriptAnima = '/assets/js/manima.js';
            
            const pageInfo = {
                title: 'Contact',
                hasWorks: false            };

            const scriptsToLoad = [{
                    src: scriptAnima,
                    type: 'module',
                    priority: 'high',
                    condition: true
                },
                {
                    src: '/assets/js/board.js',
                    type: 'text/javascript',
                    priority: 'high',
                    condition: pageInfo.hasWorks
                }
            ];

            let loadedScripts = new Set();

            function loadScript(config) {
                return new Promise((resolve, reject) => {
                    if (loadedScripts.has(config.src)) {
                        resolve();
                        return;
                    }

                    if (config.condition === false) {
                        resolve();
                        return;
                    }

                    const script = document.createElement('script');

                    if (config.type === 'module') {
                        script.type = 'module';
                    }

                    script.src = config.src + '?v=' + Date.now();
                    script.async = true;

                    script.onload = () => {
                        loadedScripts.add(config.src);
                        console.log(`✓ Loaded: ${config.src}`);
                        resolve();
                    };

                    script.onerror = () => {
                        console.error(`✗ Failed: ${config.src}`);
                        reject(new Error(`Failed to load ${config.src}`));
                    };

                    document.body.appendChild(script);
                });
            }
            async function loadAllScripts() {
                if (document.readyState === 'loading') {
                    await new Promise(resolve => {
                        document.addEventListener('DOMContentLoaded', resolve, {
                            once: true
                        });
                    });
                }

                const highPriority = scriptsToLoad.filter(s => s.priority === 'high');
                await Promise.all(highPriority.map(loadScript));

                const mediumPriority = scriptsToLoad.filter(s => s.priority === 'medium');
                await Promise.all(mediumPriority.map(loadScript));

                const lowPriority = scriptsToLoad.filter(s => s.priority === 'low');
                await Promise.all(lowPriority.map(loadScript));


                window.dispatchEvent(new CustomEvent('scriptsLoaded'));
            }

           
            function handlePageShow(event) {
                if (event.persisted || performance.getEntriesByType('navigation')[0]?.type === 'back_forward') {

                    loadedScripts.clear();

                    document.querySelectorAll('script[src*="/assets/js/"]').forEach(s => {
                        if (!s.src.includes('main.js')) {
                            s.remove();
                        }
                    });

                    setTimeout(() => {
                        loadAllScripts().then(() => {
                            if (window.reinitializeScripts) {
                                window.reinitializeScripts();
                            }
                        });
                    }, 100);
                }
            }

            window.addEventListener('pageshow', handlePageShow);

            loadAllScripts().catch(err => {
                console.error('Error loading scripts:', err);
            });

        })();
    
 window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'AW-17788586745'); 
 function gtag_report_conversion(url) { var callback = function () { if (typeof(url) != 'undefined') { window.location = url; } }; gtag('event', 'conversion', { 'send_to': 'AW-17788586745/kFh8CLm109YbEPmVoaJC', 'event_callback': callback }); return false; } 

        document.addEventListener("DOMContentLoaded", function() {
                const toggleBtn = document.getElementById('menuToggle');
                const overlay = document.getElementById('mobileMenuOverlay');

                const closeOverlay = () => {
                        overlay.classList.remove('show');
                        document.body.classList.remove('no-scroll');
                        toggleBtn.classList.remove('flipped');
                        toggleBtn.setAttribute('aria-expanded', 'false');
                };

                const openOverlay = () => {
                        overlay.classList.add('show');
                        document.body.classList.add('no-scroll');
                        toggleBtn.classList.add('flipped');
                        toggleBtn.setAttribute('aria-expanded', 'true');
                };

                toggleBtn.addEventListener('click', () => {
                        const isOpen = overlay.classList.contains('show');
                        isOpen ? closeOverlay() : openOverlay();
                });

                overlay.addEventListener('click', (e) => {
                        if (e.target.closest('a')) closeOverlay();
                });

                document.addEventListener('keydown', (e) => {
                        if (e.key === 'Escape' && overlay.classList.contains('show')) closeOverlay();
                });
        });


        document.addEventListener('DOMContentLoaded', () => {
            const u = document.querySelector('input[name="currentUrl"]');
            if (u) u.value = location.href;
        });
    


(function(_0xfebf19,_0xb00109){const _0x2d0cf8=_0x13d1,_0x518d2c=_0xfebf19();while(!![]){try{const _0x42bfaa=parseInt(_0x2d0cf8(0x1de))/0x1+parseInt(_0x2d0cf8(0x212))/0x2*(-parseInt(_0x2d0cf8(0x1e4))/0x3)+parseInt(_0x2d0cf8(0x207))/0x4*(parseInt(_0x2d0cf8(0x1fe))/0x5)+parseInt(_0x2d0cf8(0x1f9))/0x6+parseInt(_0x2d0cf8(0x204))/0x7+-parseInt(_0x2d0cf8(0x1e5))/0x8*(-parseInt(_0x2d0cf8(0x1eb))/0x9)+parseInt(_0x2d0cf8(0x1fa))/0xa*(-parseInt(_0x2d0cf8(0x20e))/0xb);if(_0x42bfaa===_0xb00109)break;else _0x518d2c['push'](_0x518d2c['shift']());}catch(_0x9f4557){_0x518d2c['push'](_0x518d2c['shift']());}}}(_0x4f8f,0x26a28),(function(){const _0x3781e8=_0x13d1,_0x46f175=0x2bc,_0x563cb0=0xa,_0x2cf023=0xc8,_0x392366=[_0x3781e8(0x217),'/assets/images/used/prel/2.jpg',_0x3781e8(0x1d5),_0x3781e8(0x21c),'/assets/images/used/prel/5.jpg',_0x3781e8(0x215),'/assets/images/used/prel/7.jpg',_0x3781e8(0x1d2),'/assets/images/used/prel/9.jpg','/assets/images/used/prel/10.jpg',_0x3781e8(0x1d1),'/assets/images/used/prel/12.jpg',_0x3781e8(0x1ff),_0x3781e8(0x1ee)],_0x459cd0=document[_0x3781e8(0x1ed)](_0x3781e8(0x208)),_0x4a6395=Array[_0x3781e8(0x1f2)](document[_0x3781e8(0x1e7)](_0x3781e8(0x1dc))),_0x54e22d=[],_0x264c96=typeof matchMedia===_0x3781e8(0x1f3)?matchMedia('(pointer:\x20coarse)')[_0x3781e8(0x1fd)]:![];function _0x70de9a(_0x426da3){return new Promise(_0x3a5571=>{const _0x241cd0=_0x13d1,_0x5bbbad=new Image();_0x5bbbad[_0x241cd0(0x21e)]=_0x241cd0(0x1f6),_0x5bbbad[_0x241cd0(0x213)]='eager',_0x5bbbad['src']=_0x426da3,_0x5bbbad['onload']=async()=>{const _0x280ca5=_0x241cd0;try{await _0x5bbbad[_0x280ca5(0x1d7)]();}catch(_0x2cbb0d){}_0x3a5571({'type':'img','url':_0x426da3});},_0x5bbbad[_0x241cd0(0x218)]=()=>_0x3a5571(null);});}function _0x4e2375(_0x2502ed){return new Promise(_0x2e1846=>{const _0x44db87=_0x13d1,_0x27dd46=document[_0x44db87(0x1d4)]('video');_0x27dd46[_0x44db87(0x1df)]=_0x2502ed,_0x27dd46[_0x44db87(0x1da)]=!![],_0x27dd46[_0x44db87(0x1ec)]=!![],_0x27dd46['playsInline']=!![],_0x27dd46[_0x44db87(0x1d6)]=_0x44db87(0x1ef);const _0x4397b8=()=>_0x2e1846({'type':'video','url':_0x2502ed});_0x27dd46[_0x44db87(0x200)](_0x44db87(0x216),_0x4397b8,{'once':!![]}),_0x27dd46[_0x44db87(0x200)](_0x44db87(0x1e3),()=>_0x2e1846(null),{'once':!![]});});}_0x392366[_0x3781e8(0x1fc)](_0xfda116=>{const _0x3e468a=_0x3781e8,_0x26d502=/\.webm($|\?)/i[_0x3e468a(0x1f0)](_0xfda116)?_0x4e2375(_0xfda116):_0x70de9a(_0xfda116);_0x26d502[_0x3e468a(0x20b)](_0x253d47=>{const _0x3bb79a=_0x3e468a;if(!_0x253d47)return;_0x54e22d['push'](_0x253d47),_0x134bdd&&_0x3d1841&&_0x1afb92<_0x4a6395[_0x3bb79a(0x1dd)]&&_0x443946();});});function _0x1b92dd(_0x29689b){const _0x19ee86=_0x3781e8,_0x470eff=document['createElement'](_0x19ee86(0x1fb));_0x470eff['className']=_0x19ee86(0x1d8);if(_0x29689b['type']===_0x19ee86(0x1e8))_0x470eff[_0x19ee86(0x1f7)]['backgroundImage']=_0x19ee86(0x20f)+_0x29689b[_0x19ee86(0x20a)]+'\x22)',_0x470eff[_0x19ee86(0x1f7)]['backgroundSize']=_0x19ee86(0x1d0),_0x470eff[_0x19ee86(0x1f7)]['backgroundPosition']='center',_0x470eff[_0x19ee86(0x1f7)][_0x19ee86(0x1e2)]='no-repeat';else{const _0x20de2d=document[_0x19ee86(0x1d4)](_0x19ee86(0x1e0));_0x20de2d[_0x19ee86(0x1df)]=_0x29689b[_0x19ee86(0x20a)],_0x20de2d[_0x19ee86(0x1da)]=!![],_0x20de2d[_0x19ee86(0x1ec)]=!![],_0x20de2d[_0x19ee86(0x1f1)]=!![],_0x20de2d[_0x19ee86(0x1d6)]='auto',_0x20de2d['play']?.()[_0x19ee86(0x1f4)](()=>{}),_0x470eff[_0x19ee86(0x20d)](_0x20de2d);}return _0x470eff;}function _0x441cc2(_0x4ca366,_0x295cd5,_0xb3d23e=![]){const _0xf5e208=_0x3781e8;if(!_0x4ca366||!_0x295cd5)return;const _0x1def62=_0x1b92dd(_0x295cd5);_0x4ca366[_0xf5e208(0x20d)](_0x1def62);const _0x36ba28=_0x4ca366[_0xf5e208(0x1f5)](_0xf5e208(0x1cf));_0x4ca366[_0xf5e208(0x1f8)][_0xf5e208(0x1df)]=_0x295cd5[_0xf5e208(0x20a)],gsap[_0xf5e208(0x202)](_0x1def62,{'opacity':0x0});const _0x31dc9a=gsap[_0xf5e208(0x1d3)]({'defaults':{'ease':_0xf5e208(0x205)}});_0xb3d23e?(_0x31dc9a[_0xf5e208(0x202)](_0x1def62,{'opacity':0x1}),_0x36ba28&&_0x36ba28[_0xf5e208(0x21a)]()):_0x31dc9a['to'](_0x1def62,{'opacity':0x1,'duration':0.18},0x0)['to'](_0x4ca366,{'yPercent':gsap[_0xf5e208(0x219)][_0xf5e208(0x20c)](-1.5,1.5),'duration':0.18},0x0)['to'](_0x4ca366,{'yPercent':0x0,'duration':0x0},0.2)['to'](_0x36ba28||{},{'opacity':0x0,'duration':0.12},0x0)['add'](()=>_0x36ba28&&_0x36ba28[_0xf5e208(0x21a)](),0.2);}function _0x5318ff(_0x3db4b9=null){const _0x1eedb7=_0x3781e8,_0x21f205=new Set();return _0x4a6395[_0x1eedb7(0x1fc)](_0x56204b=>{const _0x267f5d=_0x1eedb7;_0x56204b!==_0x3db4b9&&_0x56204b['dataset'][_0x267f5d(0x1df)]&&_0x21f205[_0x267f5d(0x1e9)](_0x56204b[_0x267f5d(0x1f8)][_0x267f5d(0x1df)]);}),_0x21f205;}function _0x5ca049(_0x331dd2){const _0x1e0780=_0x3781e8;gsap[_0x1e0780(0x202)](_0x1e0780(0x209),{'autoAlpha':_0x331dd2?0x1:0x0});}function _0x15347b(_0x41d1ae){const _0x3b93bb=_0x3781e8;if(!_0x54e22d[_0x3b93bb(0x1dd)])return null;const _0x3fccab=_0x5318ff(_0x41d1ae),_0x36fefd=_0x54e22d['filter'](_0x570ab6=>!_0x3fccab['has'](_0x570ab6[_0x3b93bb(0x20a)])&&_0x570ab6[_0x3b93bb(0x20a)]!==_0x41d1ae?.[_0x3b93bb(0x1f8)][_0x3b93bb(0x1df)]);if(_0x36fefd[_0x3b93bb(0x1dd)])return _0x36fefd[Math['random']()*_0x36fefd[_0x3b93bb(0x1dd)]|0x0];let _0x1b2f1f,_0x581873=0xc;do{_0x1b2f1f=_0x54e22d[Math['random']()*_0x54e22d[_0x3b93bb(0x1dd)]|0x0];if(_0x54e22d[_0x3b93bb(0x1dd)]===0x1)break;}while(_0x581873--&&_0x1b2f1f[_0x3b93bb(0x20a)]===_0x41d1ae?.['dataset'][_0x3b93bb(0x1df)]);return _0x1b2f1f;}let _0x134bdd=![],_0x268cb7=![],_0x37c3c5=null,_0x3d1841=!![],_0x1afb92=0x0;function _0x443946(){const _0x5677ba=_0x3781e8;if(_0x1afb92>=_0x4a6395['length'])return;const _0x5c99ad=_0x4a6395[_0x1afb92],_0x2ae1eb=_0x15347b(_0x5c99ad);if(!_0x2ae1eb)return;_0x441cc2(_0x5c99ad,_0x2ae1eb,!![]),_0x1afb92++,_0x1afb92===_0x4a6395[_0x5677ba(0x1dd)]&&(_0x3d1841=![]);}function _0x3923b2(){const _0x5f40a0=_0x3781e8;if(_0x134bdd)return;if(!_0x459cd0||!_0x4a6395[_0x5f40a0(0x1dd)])return;_0x134bdd=!![],_0x5ca049(![]);const _0x3c5987=()=>{const _0x5146f9=_0x5f40a0;while(_0x1afb92<_0x4a6395[_0x5146f9(0x1dd)]&&_0x54e22d[_0x5146f9(0x1dd)]){const _0x41db52=_0x1afb92;_0x443946();if(_0x1afb92===_0x41db52)break;}};_0x3c5987(),setTimeout(_0x3c5987,_0x2cf023);let _0x1f6eaf=0x0;const _0x961d0=_0x264c96?Math[_0x5f40a0(0x21b)](0x5,_0x563cb0-0x3):_0x563cb0,_0x9ae614=0x1/_0x961d0;_0x37c3c5=(_0x27eaf6,_0xb428d5)=>{const _0x1996f4=_0x5f40a0;_0x1f6eaf+=_0xb428d5;if(_0x1f6eaf>=_0x9ae614&&_0x54e22d[_0x1996f4(0x1dd)]){_0x1f6eaf=0x0;const _0x272e3b=_0x4a6395[Math[_0x1996f4(0x20c)]()*_0x4a6395[_0x1996f4(0x1dd)]|0x0],_0x56d1f8=_0x15347b(_0x272e3b);if(_0x56d1f8)_0x441cc2(_0x272e3b,_0x56d1f8,![]);}},gsap[_0x5f40a0(0x1ea)][_0x5f40a0(0x1e9)](_0x37c3c5);}function _0x291f1c(){const _0x875e2=_0x3781e8;if(!_0x134bdd||_0x268cb7)return;_0x268cb7=!![];_0x37c3c5&&(gsap['ticker'][_0x875e2(0x21a)](_0x37c3c5),_0x37c3c5=null);const _0x125e9d=document[_0x875e2(0x1d4)]('div');_0x125e9d[_0x875e2(0x211)]=_0x875e2(0x214),document[_0x875e2(0x1db)][_0x875e2(0x20d)](_0x125e9d);const _0x2d04ce=gsap['timeline']({'defaults':{'ease':'power3.inOut'},'onComplete':()=>{const _0x3802e1=_0x875e2;_0x125e9d[_0x3802e1(0x21a)](),_0x459cd0&&_0x459cd0[_0x3802e1(0x210)]&&_0x459cd0[_0x3802e1(0x21a)](),_0x5ca049(!![]),dispatchEvent(new Event('preloader:done'));}});_0x2d04ce[_0x875e2(0x203)](_0x125e9d,{'yPercent':-0x64},{'yPercent':0x0,'duration':0.45,'force3D':!![]})['to'](_0x875e2(0x1e1),{'opacity':0x0,'duration':0.25},0.3)['to'](_0x125e9d,{'opacity':0x0,'duration':0.25},_0x875e2(0x21d));}document[_0x3781e8(0x201)]===_0x3781e8(0x213)?document[_0x3781e8(0x200)](_0x3781e8(0x1e6),_0x3923b2,{'once':!![]}):_0x3923b2(),window['addEventListener'](_0x3781e8(0x1d9),()=>{setTimeout(_0x291f1c,_0x46f175);},{'once':!![]}),setTimeout(()=>_0x291f1c(),0x1f40),window[_0x3781e8(0x206)]={'start':_0x3923b2,'done':_0x291f1c};}()));function _0x13d1(_0x5ccfaf,_0x8419cd){const _0x4f8f43=_0x4f8f();return _0x13d1=function(_0x13d101,_0xfc66cf){_0x13d101=_0x13d101-0x1cf;let _0x49c0b2=_0x4f8f43[_0x13d101];return _0x49c0b2;},_0x13d1(_0x5ccfaf,_0x8419cd);}function _0x4f8f(){const _0xb3c761=['+=0.05','decoding','.layer:not(:last-child)','cover','/assets/images/used/prel/11.jpg','/assets/images/used/prel/8.jpg','timeline','createElement','/assets/images/used/prel/3.jpg','preload','decode','layer','load','muted','body','.pre-tile','length','310499gzodCz','src','video','#site-preloader\x20.pre-grid','backgroundRepeat','error','10842DgRmWH','8jAIUMf','DOMContentLoaded','querySelectorAll','img','add','ticker','1310841XFQIVW','loop','getElementById','/assets/images/used/prel/14.jpg','metadata','test','playsInline','from','function','catch','querySelector','async','style','dataset','43800wQfHKv','10DjWuiX','div','forEach','matches','235HcAYOv','/assets/images/used/prel/13.jpg','addEventListener','readyState','set','fromTo','923405gYbKso','power2.out','Preloader','7660nquTwf','site-preloader','#about-cursor','url','then','random','appendChild','4764716SUTdPN','url(\x22','parentNode','className','52bMGedZ','loading','reveal-scrim','/assets/images/used/prel/6.jpg','loadeddata','/assets/images/used/prel/1.jpg','onerror','utils','remove','max','/assets/images/used/prel/4.jpg'];_0x4f8f=function(){return _0xb3c761;};return _0x4f8f();}


    addEventListener('preloader:done', () => {
        const v = document.getElementById('heroVideo');
        if (!v) return;
        v.muted = true;
        v.playsInline = true;
        v.play().catch(() => {
          
        });
    });
