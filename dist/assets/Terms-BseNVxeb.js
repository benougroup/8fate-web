const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./index-B_zkfeoz.js","./index-DGFivzbo.css"])))=>i.map(i=>d[i]);
import{u as V,g as O,r as n,h as _,j as e,d as H,i as K,t as U,k as $,l as X,f as q,n as F}from"./index-B_zkfeoz.js";import{B as G}from"./BackgroundScreen-BzhoMHd9.js";import{C as J}from"./Card-B4WrrXAe.js";const Q=Object.assign({"/src/assets/data/legal/terms_v1_en.html":()=>F(()=>import("./terms_v1_en-LdVCG8me.js"),[],import.meta.url).then(a=>a.default)}),W=Object.assign({"/src/assets/legal/terms.v1.0.0.en.html":()=>F(()=>import("./index-B_zkfeoz.js").then(a=>a.dX),__vite__mapDeps([0,1]),import.meta.url).then(a=>a.default)});function re(){var b;const a=V(),T=O(),c=n.useRef(null),l=T.state||{},S=l.mode!=="read-only",A=l.userKey||((b=_())==null?void 0:b.userKey),C=l.document==="privacy"?"Privacy Policy":"Terms & Conditions",[E,u]=n.useState(!0),[i,f]=n.useState(!1),[L,g]=n.useState("Loading terms..."),[d,x]=n.useState("1.0"),[m,I]=n.useState(!1),[h,o]=n.useState(null);n.useEffect(()=>{let t=!0;async function s(){const r=await P();r&&t&&u(!1),await z(r)}return s(),()=>{t=!1}},[]);async function P(){try{const t=async(r,p,D)=>{var j,k,N;const M=r.defaultLocale||"en",w=((l.document||"terms")==="privacy"?(j=r.privacy)==null?void 0:j.file:(k=r.terms)==null?void 0:k.file)||((N=r.assets)==null?void 0:N[M]);if(!w)return!1;const v=p[`${D}/${w}`];if(!v)return!1;const R=await v();return g(R),x(r.version||"1.0"),c.current&&(c.current.scrollTop=0),!0};return await t(K,Q,"/src/assets/data/legal")?!0:await t(U,W,"/src/assets/legal")}catch{return console.warn("Local terms not found, relying on API."),!1}}async function z(t){o(null);try{const s=await $("en");s.ok&&s.data?(g(s.data.html||"No content available."),x(s.data.version||"1.0"),c.current&&(c.current.scrollTop=0)):t||o("Failed to load terms. Please check your connection.")}catch(s){console.error("Terms fetch error:",s),t||o("Unable to load terms.")}finally{u(!1)}}async function B(){if(!(!m||i)){if(!A){o("Session expired. Please log in again.");return}f(!0),o(null);try{if(!(await X(d)).ok)throw new Error("Acceptance failed.");const s=_();if(s){const{loggedIn:r,...p}=s;q({...p,isNewUser:!1,termsAcceptedVersion:d})}a("/profile-setup",{replace:!0})}catch(t){console.error("Accept error:",t),o("Failed to submit acceptance. Please try again.")}finally{f(!1)}}}function y(){a("/login")}return e.jsxs(G,{backgroundImage:H,className:"terms-screen",contentClassName:"terms-card",children:[e.jsx("style",{children:`
        .terms-screen {
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .terms-card {
          width: min(92vw, 680px);
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 16px;
        }

        .terms-title {
          color: #F4D73E;
          font-size: 20px;
          font-weight: 700;
          margin: 0;
          text-align: left;
        }

        .terms-version {
          margin: 0;
          color: rgba(230, 236, 245, 0.75);
          font-size: 13px;
        }

        .terms-content-card {
          display: flex;
          flex-direction: column;
          max-height: 50vh;
        }

        .terms-scroll-area {
          flex: 1;
          overflow-y: auto;
          color: #e6ecf5;
          font-size: 14px;
          line-height: 1.55;
          white-space: normal;
          padding-right: 6px;
        }
        .terms-scroll-area h1,
        .terms-scroll-area h2,
        .terms-scroll-area h3 {
          margin: 8px 0 4px 0;
          line-height: 1.25;
          font-size: 15px;
        }
        .terms-scroll-area p {
          margin: 0 0 6px 0;
          line-height: 1.35;
        }
        .terms-scroll-area ul {
          margin: 0 0 6px 0;
          padding-left: 18px;
        }
        .terms-scroll-area li {
          margin: 0 0 4px 0;
        }

        .actions-area {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .checkbox-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          cursor: pointer;
          color: #e6ecf5;
          font-size: 14px;
          user-select: none;
        }

        .checkbox-row input {
          margin-top: 2px;
          accent-color: #F4D73E;
          width: 18px;
          height: 18px;
        }

        .action-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 12px;
        }

        .action-btn {
          width: 100%;
          padding: 12px;
          border-radius: 24px;
          border: none;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .btn-primary {
          background: #F4D73E;
          color: #0B0C2A;
        }
        
        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: #545b68;
          color: #888;
        }

        .btn-secondary {
          background: transparent;
          border: 1px solid #466270;
          color: #e6ecf5;
        }

        .error-text {
          color: #ff6b6b;
          font-size: 13px;
          text-align: center;
        }
      `}),e.jsx("h2",{className:"terms-title",children:C}),e.jsxs("p",{className:"terms-version",children:["Version ",d]}),e.jsx(J,{className:"terms-content-card",children:e.jsx("div",{className:"terms-scroll-area",ref:c,children:E?"Loading latest terms...":e.jsx("div",{className:"markdown-content",dangerouslySetInnerHTML:{__html:L}})})}),e.jsxs("div",{className:"actions-area",children:[h&&e.jsx("span",{className:"error-text",children:h}),S?e.jsxs(e.Fragment,{children:[e.jsxs("label",{className:"checkbox-row",children:[e.jsx("input",{type:"checkbox",checked:m,onChange:()=>!i&&I(!m),disabled:i}),e.jsxs("span",{children:["I agree to the Terms & Conditions (v",d,")."]})]}),e.jsxs("div",{className:"action-row",children:[e.jsx("button",{className:"action-btn btn-secondary",onClick:y,children:"Back"}),e.jsx("button",{className:"action-btn btn-primary",disabled:!m||i,onClick:B,children:i?"Accepting...":"Agree & Continue"})]})]}):e.jsx("button",{className:"action-btn btn-secondary",onClick:y,children:"Back"})]})]})}export{re as default};
