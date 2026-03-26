import{u as T,r as n,j as s,_ as N,a as P,m as p,b as v,c as V}from"./index-Cs5zJtQU.js";import{_ as D}from"./splash-BJ2Tu_06.js";import{w as M}from"./exclamation_mark_icon-CRnSbbak.js";import{B}from"./BackgroundScreen-CSOHEDwx.js";import{B as C}from"./Button-leQsQewa.js";import{E as L}from"./ErrorBox-CAEoYPxm.js";import{r as U}from"./userPreferences-vDYvr4E9.js";const z="https://json.schemastore.org/json",W=1,H="2025-08-21T00:00:00Z",K="Global application constants and feature flags. This file is trimmed for MVP 1 usage.",$="v1",q="1.0.0",G=["en"],Y={payments:!0,applePay:!0,stripe:!1,googleSSO:!0,facebookSSO:!1,microsoftSSO:!1,advancedDetailToggle:!0,analytics:!0},F={theme:"light",splashTimeoutMs:2e3},Z={collectPII:!1,storeDOB:!0,storeEmail:!0,notes:"DOB is sensitive. All other fields can be fake/pseudonymous."},J={enabled:!0,resumeMinAgeMs:{free:18e5,premium:9e5},reconnectMinAgeMs:36e5,maxDailyResumeChecks:{free:12,premium:24},errorBackoffMs:[3e5,9e5,36e5],headEndpoint:"/sync/head",batchEndpoint:"/sync",useConditionalGets:!0},Q={version:"v1.0.0",defaultLocale:"en"},y={$schema:z,version:W,updatedAt:H,notes:K,apiVersion:$,minShellVersion:q,supportedLocales:G,features:Y,ui:F,privacy:Z,sync:J,legal:Q},t={BASE_URL:"./",DEV:!1,MODE:"production",PROD:!0,SSR:!1},X=2200,d={APP_OUTDATED:{message:"Please visit App Store to download latest version."}};function le(){const g=T(),l=n.useRef(null),[r,a]=n.useState(null),[u,e]=n.useState(!0),f=n.useMemo(()=>(t==null?void 0:t.VITE_API_BASE_URL)||"https://api.example.com",[]),E=n.useMemo(()=>(t==null?void 0:t.VITE_AUTH_REDIRECT_URI)||(typeof window<"u"?`${window.location.origin}/auth/callback`:"https://app.example.com/auth/callback"),[]),b=n.useMemo(()=>t==null?void 0:t.VITE_CHAT_PATH,[]),w=n.useMemo(()=>U(),[]);function R(){l.current&&(clearTimeout(l.current),l.current=null)}function S(){var o,c,i;a(null),typeof window<"u"&&((i=(c=(o=window.navigator)==null?void 0:o.app)==null?void 0:c.exitApp)==null||i.call(c),window.close(),window.location.href="about:blank")}async function k(o){a(null),e(!0);const c=performance.now();if(typeof navigator<"u"&&navigator.onLine===!1){a(p({code:"NETWORK_ERROR"},d)),e(!1);return}try{v({baseUrl:f,auth:{redirectUri:E},apiClient:{chatPath:b}});const i=(t==null?void 0:t.VITE_APP_VERSION)||"2.1.0",h=Number((t==null?void 0:t.VITE_APP_BUILD)||123),O=(y==null?void 0:y.platform)??"iOS",m=await V({appVersion:i,platform:O,build:h,language:w});if(o.current)return;if(!m.ok||!m.data){const I=p(m.error??{code:"SERVER_ERROR"},d);a(I),e(!1);return}const x=m.data;if(!x.serverOk){a(p({code:"SERVER_DOWN"},d)),e(!1);return}if(_(i,x.minSupportedVersion)<0||x.forceUpdate){a(p({code:"APP_OUTDATED"},d)),e(!1);return}const j=performance.now()-c,A=Math.max(0,X-j);l.current=window.setTimeout(()=>{o.current||g("/login",{replace:!0})},A),e(!1)}catch(i){if(console.error("Splash check failed",i),!o.current){const h=typeof navigator<"u"&&navigator.onLine===!1;a(p({code:h?"NETWORK_ERROR":"SERVER_ERROR"},d)),e(!1)}}}return n.useEffect(()=>{const o={current:!1};return k(o),()=>{o.current=!0,R()}},[]),s.jsxs(B,{backgroundImage:N,className:"splash-screen",contentClassName:"splash-content",children:[s.jsx("style",{children:`
        .splash-screen {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .splash-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 32px;
          text-align: center;
          padding: 32px;
        }

        .logo-spin {
          width: clamp(140px, 32vw, 220px);
          height: clamp(140px, 32vw, 220px);
          animation: splashSpin 2.6s linear infinite;
          filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.4));
        }

        .quote-breathe {
          width: clamp(180px, 38vw, 280px);
          height: auto;
          animation: splashBreathe 2.8s ease-in-out infinite;
          opacity: 0.92;
        }

        .status-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #3fe2c5;
          box-shadow: 0 0 12px rgba(63, 226, 197, 0.6);
          animation: pulse 1.4s ease-in-out infinite;
        }

        .status-row {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #e6ecf5;
          font-size: 14px;
          letter-spacing: 0.3px;
          opacity: 0.82;
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(11, 12, 42, 0.71);
          display: grid;
          place-items: center;
          z-index: 4;
        }

        .modal-box {
          width: min(92vw, 380px);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          text-align: center;
        }

        .modal-icon {
          width: 56px;
          height: 56px;
          object-fit: contain;
          filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.35));
        }

        .modal-message {
          display: flex;
          flex-direction: column;
          gap: 6px;
          color: inherit;
        }

        .modal-title {
          font-size: 16px;
          font-weight: 700;
          color: inherit;
        }

        .modal-body {
          font-size: 14px;
          line-height: 1.5;
          color: inherit;
          opacity: 0.9;
        }

        @keyframes splashSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes splashBreathe {
          0%, 100% { opacity: 0.82; transform: scale(0.98); }
          50% { opacity: 1; transform: scale(1.03); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(0.95); opacity: 0.75; }
          50% { transform: scale(1.08); opacity: 1; }
        }
      `}),s.jsx("img",{src:P,alt:"8Fate logo",className:"logo-spin","aria-hidden":!u}),s.jsx("img",{src:D,alt:"我命由我不由天",className:"quote-breathe"}),s.jsxs("div",{className:"status-row","aria-live":"polite",children:[s.jsx("span",{className:"status-dot"}),s.jsx("span",{children:u?"Checking server status…":"Preparing login…"})]}),r?s.jsx("div",{className:"modal-backdrop",children:s.jsxs("div",{className:"modal-box",role:"alertdialog","aria-modal":"true",children:[s.jsx("img",{src:M,alt:"Warning",className:"modal-icon"}),s.jsx(L,{tone:r.severity==="error"?"error":"warning",message:s.jsxs("div",{className:"modal-message",children:[s.jsx("span",{className:"modal-title",children:r.title}),s.jsx("span",{className:"modal-body",children:r.message})]}),style:{margin:0,width:"100%"}}),s.jsx(C,{type:"button",variant:"secondary",onClick:S,children:"OK"})]})}):null]})}function _(g,l){const r=g.split(".").map(e=>parseInt(e,10)||0),a=l.split(".").map(e=>parseInt(e,10)||0),u=Math.max(r.length,a.length);for(let e=0;e<u;e+=1){const f=(r[e]??0)-(a[e]??0);if(f!==0)return f>0?1:-1}return 0}export{le as default};
