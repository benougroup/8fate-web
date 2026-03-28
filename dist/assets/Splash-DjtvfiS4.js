import{u as V,r as o,j as t,_ as O,a as k,m as p,b as N,c as P}from"./index-DkvI-k6J.js";import{_ as j}from"./splash-BJ2Tu_06.js";import{w as D}from"./exclamation_mark_icon-CRnSbbak.js";import{B as M}from"./BackgroundScreen-xPDgd1yI.js";import{B}from"./Button-J9zTvF62.js";import{E as C}from"./ErrorBox-N1WOdeTA.js";import{r as L}from"./userPreferences-DBNuM3fd.js";const U="https://json.schemastore.org/json",H=1,z="2025-08-21T00:00:00Z",K="Global application constants and feature flags. This file is trimmed for MVP 1 usage.",W="v1",Y="1.0.0",G=["en"],q={payments:!0,applePay:!0,stripe:!1,googleSSO:!0,facebookSSO:!1,microsoftSSO:!1,advancedDetailToggle:!0,analytics:!0},$={theme:"light",splashTimeoutMs:2e3},F={collectPII:!1,storeDOB:!0,storeEmail:!0,notes:"DOB is sensitive. All other fields can be fake/pseudonymous."},Z={enabled:!0,resumeMinAgeMs:{free:18e5,premium:9e5},reconnectMinAgeMs:36e5,maxDailyResumeChecks:{free:12,premium:24},errorBackoffMs:[3e5,9e5,36e5],headEndpoint:"/sync/head",batchEndpoint:"/sync",useConditionalGets:!0},J={version:"v1.0.0",defaultLocale:"en"},E={$schema:U,version:H,updatedAt:z,notes:K,apiVersion:W,minShellVersion:Y,supportedLocales:G,features:q,ui:$,privacy:F,sync:Z,legal:J},c={BASE_URL:"./",DEV:!1,MODE:"production",PROD:!0,SSR:!1,VITE_API_BASE_URL:"https://api.example.com",VITE_APP_ENV:"development",VITE_AUTH_BYPASS:"1",VITE_AUTH_REDIRECT_URI:"http://localhost:4173/auth/callback",VITE_BASE_PATH:"/8fate-web",VITE_CHAT_PATH:"/chat",VITE_DATA_MODE:"mock",VITE_LANG:"English",VITE_SYNC_DISABLED:"1",VITE_UI_VARIANT:"20260213",VITE_USE_MOCKS:"true"},Q=2200,d={APP_OUTDATED:{message:"Please visit App Store to download latest version."}};function le(){const h=V(),i=o.useRef(null),[n,s]=o.useState(null),[u,e]=o.useState(!0),m=o.useMemo(()=>"https://api.example.com",[]),y=o.useMemo(()=>"http://localhost:4173/auth/callback",[]),b=o.useMemo(()=>"/chat",[]),S=o.useMemo(()=>L(),[]);function R(){i.current&&(clearTimeout(i.current),i.current=null)}function _(){var a,l,r;s(null),typeof window<"u"&&((r=(l=(a=window.navigator)==null?void 0:a.app)==null?void 0:l.exitApp)==null||r.call(l),window.close(),window.location.href="about:blank")}async function w(a){s(null),e(!0);const l=performance.now();if(typeof navigator<"u"&&navigator.onLine===!1){s(p({code:"NETWORK_ERROR"},d)),e(!1);return}try{N({baseUrl:m,auth:{redirectUri:y},apiClient:{chatPath:b}});const r=(c==null?void 0:c.VITE_APP_VERSION)||"2.1.0",g=Number((c==null?void 0:c.VITE_APP_BUILD)||123),T=(E==null?void 0:E.platform)??"iOS",f=await P({appVersion:r,platform:T,build:g,language:S});if(a.current)return;if(!f.ok||!f.data){const v=p(f.error??{code:"SERVER_ERROR"},d);s(v),e(!1);return}const x=f.data;if(!x.serverOk){s(p({code:"SERVER_DOWN"},d)),e(!1);return}if(X(r,x.minSupportedVersion)<0||x.forceUpdate){s(p({code:"APP_OUTDATED"},d)),e(!1);return}const A=performance.now()-l,I=Math.max(0,Q-A);i.current=window.setTimeout(()=>{a.current||h("/login",{replace:!0})},I),e(!1)}catch(r){if(console.error("Splash check failed",r),!a.current){const g=typeof navigator<"u"&&navigator.onLine===!1;s(p({code:g?"NETWORK_ERROR":"SERVER_ERROR"},d)),e(!1)}}}return o.useEffect(()=>{const a={current:!1};return w(a),()=>{a.current=!0,R()}},[]),t.jsxs(M,{backgroundImage:O,className:"splash-screen",contentClassName:"splash-content",children:[t.jsx("style",{children:`
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
      `}),t.jsx("img",{src:k,alt:"8Fate logo",className:"logo-spin","aria-hidden":!u}),t.jsx("img",{src:j,alt:"我命由我不由天",className:"quote-breathe"}),t.jsxs("div",{className:"status-row","aria-live":"polite",children:[t.jsx("span",{className:"status-dot"}),t.jsx("span",{children:u?"Checking server status…":"Preparing login…"})]}),n?t.jsx("div",{className:"modal-backdrop",children:t.jsxs("div",{className:"modal-box",role:"alertdialog","aria-modal":"true",children:[t.jsx("img",{src:D,alt:"Warning",className:"modal-icon"}),t.jsx(C,{tone:n.severity==="error"?"error":"warning",message:t.jsxs("div",{className:"modal-message",children:[t.jsx("span",{className:"modal-title",children:n.title}),t.jsx("span",{className:"modal-body",children:n.message})]}),style:{margin:0,width:"100%"}}),t.jsx(B,{type:"button",variant:"secondary",onClick:_,children:"OK"})]})}):null]})}function X(h,i){const n=h.split(".").map(e=>parseInt(e,10)||0),s=i.split(".").map(e=>parseInt(e,10)||0),u=Math.max(n.length,s.length);for(let e=0;e<u;e+=1){const m=(n[e]??0)-(s[e]??0);if(m!==0)return m>0?1:-1}return 0}export{le as default};
