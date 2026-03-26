import{u as w,r as s,j as e,d as y,a as k,e as N,f as L}from"./index-DQfzOgci.js";import{_ as v}from"./splash-BJ2Tu_06.js";import{B as j}from"./BackgroundScreen-Bks-uW60.js";import{r as E}from"./userPreferences-DBNuM3fd.js";function C(){const t=w(),[r,l]=s.useState(!1),[c,g]=s.useState(null),d=s.useMemo(()=>E(),[]),a=s.useMemo(()=>O(d),[d]),p=!0;async function f(){var m;if(!r){l(!0),g(null);try{const o=await N("demo-token-123");if(!o.ok||!o.data)throw new Error(((m=o.error)==null?void 0:m.message)||"Login failed. Please try again.");const u=p?!0:o.data.isNewUser,{userKey:x,isPremium:h,name:b}=o.data,n=u??!0;L({userKey:x,isPremium:h,name:b||"User",isNewUser:n,requiresProfile:n,requiresTimeSelection:n}),n&&t("/terms",{replace:!0,state:{mode:"accept",userKey:x}})}catch(i){console.error("Login Error:",i),g(i.message||"Unable to connect to login server."),l(!1)}}}return e.jsxs(j,{backgroundImage:y,className:"login-screen",contentClassName:"login-content",children:[e.jsx("style",{children:`
        .login-screen {
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        .login-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          text-align: center;
          padding: 32px 20px;
          width: 100%;
          max-width: 360px;
          min-height: 100vh;
        }

        .login-main {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          width: 100%;
        }

        /* LOGO */
        .logo {
          width: clamp(150px, 38vw, 200px);
          height: auto;
          filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.4));
          transition: transform 0.3s ease;
        }
        
        .logo.spinning {
          animation: spin 2s linear infinite;
        }

        /* MOTTO */
        .motto {
          width: clamp(180px, 42vw, 260px);
          height: auto;
          opacity: 0.9;
        }

        /* LOGIN BUTTON */
        .login-btn {
          width: 100%;
          max-width: 260px;
          padding: 14px 24px;
          border-radius: 30px;
          border: none;
          background: #F4D73E; /* Gold/Yellow from spec */
          color: #0B0C2A;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 0.5px;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(244, 215, 62, 0.3);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .login-btn:active {
          transform: scale(0.98);
        }

        /* LOADING INDICATOR */
        .loading-text {
          color: #F4D73E;
          font-size: 16px;
          letter-spacing: 1px;
          font-weight: 600;
          animation: pulse 1.5s infinite;
        }

        /* ERROR MESSAGE */
        .error-msg {
          color: #ff6b6b;
          font-size: 14px;
          background: rgba(0,0,0,0.4);
          padding: 8px 12px;
          border-radius: 8px;
          margin-top: 8px;
        }

        /* FOOTER LINKS */
        .footer {
          display: flex;
          gap: 16px;
          z-index: 2;
          padding-bottom: 12px;
        }

        .footer-link {
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
          text-decoration: underline;
          background: none;
          border: none;
          cursor: pointer;
        }

        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes pulse { 50% { opacity: 0.6; } }
      `}),e.jsxs("div",{className:"login-main",children:[e.jsx("img",{src:k,alt:"8Fate Logo",className:`logo ${r?"spinning":""}`}),r?e.jsx("div",{className:"loading-text",children:a.loading}):e.jsx("button",{onClick:f,className:"login-btn",children:a.cta}),e.jsx("img",{src:v,alt:"Motto",className:"motto"}),c&&e.jsx("div",{className:"error-msg",children:c})]}),e.jsx("div",{className:"footer",children:e.jsx("button",{className:"footer-link",onClick:()=>t("/terms",{state:{mode:"read-only"}}),children:a.terms})})]})}function O(t){return t.toLowerCase().startsWith("zh")?{cta:"登入",loading:"正在登入…",terms:"條款與隱私"}:{cta:"Login",loading:"Loading…",terms:"Terms & Privacy"}}export{C as default};
