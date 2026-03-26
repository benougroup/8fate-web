import{u as A,r as o,j as e,L as D,I,J as L}from"./index-Cs5zJtQU.js";import{b as R}from"./background_003-D8Gsq-oN.js";import{a as U}from"./imageResolver-U44BYyNa.js";import{u as $}from"./useSession-BfueH97-.js";import{A as h}from"./AppShell-BK1aJzJS.js";import{E as Y}from"./ErrorBox-CAEoYPxm.js";import{B as W}from"./Button-leQsQewa.js";import{P as m}from"./Popup-h7X3kPis.js";import"./back_page_icon-Dl_tVR_0.js";import"./exclamation_mark_icon-CRnSbbak.js";import"./profile_icon-DtzFR4rr.js";import"./question_mark_icon-PbVWcZNJ.js";import"./submit_arrow_icon-Q5dhc_J4.js";import"./splash-BJ2Tu_06.js";import"./yin_yang_balance-CnjywNEt.js";function ae(){const d=A(),[r,b]=$(),u=!!(r!=null&&r.isPremium),y=U(u?"badges/premium.png":"badges/free_logo.png"),[j,v]=o.useState([]),[S,w]=o.useState(!0),[g,p]=o.useState(null),[P,l]=o.useState(!1),[s,c]=o.useState(null),[i,f]=o.useState(!1),[k,x]=o.useState(!1);o.useEffect(()=>{async function a(){var n;const t=await I();t.ok&&t.data?v(t.data.plans):p(((n=t.error)==null?void 0:n.message)||"Failed to load plans"),w(!1)}a()},[]);const N=()=>{r!=null&&r.isPremium?d(-1):l(!0)},E=()=>{l(!1),d(-1)},z=async a=>{c(a)},C=async()=>{if(!s||i)return;f(!0),p(null);const a="mock-receipt-"+Date.now(),t=await L(a);t.ok&&t.data?(b({...r,isPremium:!0}),s!=null&&s.id&&localStorage.setItem("subscribed_plan_id",s.id),c(null),x(!0)):p("Purchase validation failed."),f(!1)};return S?e.jsx(h,{hideNav:!0,children:e.jsx(D,{label:"Loading plans..."})}):e.jsxs(h,{hideNav:!0,children:[e.jsx("style",{children:`
        .upgrade-screen {
          min-height: 100vh;
          position: relative;
          background-color: #0B0C2A;
          color: #fff;
          display: flex;
          flex-direction: column;
        }
        .upgrade-bg {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
        }
        .content {
          position: relative;
          z-index: 1;
          padding: 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .close-btn { 
          background: rgba(255,255,255,0.1); border: none; color: #fff; 
          width: 32px; height: 32px; border-radius: 50%; font-size: 18px; cursor: pointer; 
        }

        .hero-text { text-align: center; margin-bottom: 32px; }
        .hero-title { font-size: 24px; font-weight: 700; color: #F4D73E; margin: 0 0 8px; }
        .hero-sub { opacity: 0.8; font-size: 15px; line-height: 1.5; }

        .plans-list { display: flex; flex-direction: column; gap: 16px; }

        .plan-card {
          background: rgba(29, 35, 47, 0.8);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }
        .plan-card.popular {
          border: 1px solid #F4D73E;
          background: linear-gradient(145deg, rgba(29, 35, 47, 0.9), rgba(40, 30, 10, 0.6));
        }
        .pop-badge {
          position: absolute;
          top: 0; right: 0;
          background: #F4D73E;
          color: #000;
          font-size: 10px;
          font-weight: 800;
          padding: 4px 12px;
          border-bottom-left-radius: 12px;
        }

        .plan-name { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
        .plan-price { font-size: 20px; color: #F4D73E; font-weight: 600; margin-bottom: 12px; }
        .features { list-style: none; padding: 0; margin: 0 0 16px; opacity: 0.8; font-size: 13px; }
        .features li { margin-bottom: 6px; display: flex; gap: 8px; }
        .features li::before { content: "✓"; color: #F4D73E; }

        .restore-link {
          margin-top: auto;
          text-align: center;
          padding: 20px;
          font-size: 13px;
          opacity: 0.6;
          text-decoration: underline;
          cursor: pointer;
        }
      `}),e.jsx("img",{src:R,className:"upgrade-bg",alt:"bg"}),e.jsx("div",{className:"upgrade-screen",children:e.jsxs("div",{className:"content",children:[e.jsxs("div",{className:"header",children:[e.jsx("button",{className:"close-btn",onClick:N,children:"✕"}),e.jsx("span",{style:{fontWeight:600,fontSize:14},children:"Unlock Destiny"}),e.jsx("div",{style:{width:32}})]}),e.jsxs("div",{className:"hero-text",children:[e.jsx("img",{src:y,style:{width:48,marginBottom:16},alt:u?"Premium":"Free"}),e.jsx("h1",{className:"hero-title",children:"Upgrade to Premium"}),e.jsx("p",{className:"hero-sub",children:"Get detailed insights, future forecasts, and unlimited AI guidance."})]}),g&&e.jsx(Y,{message:g,style:{marginBottom:16}}),e.jsx("div",{className:"plans-list",children:j.map(a=>{var n;const t=a.id.includes("yearly");return e.jsxs("div",{className:`plan-card ${t?"popular":""}`,children:[t&&e.jsx("div",{className:"pop-badge",children:"BEST VALUE"}),e.jsx("div",{className:"plan-name",children:a.name}),e.jsxs("div",{className:"plan-price",children:["$",(a.price/100).toFixed(2)," ",e.jsxs("span",{style:{fontSize:14,color:"#fff",opacity:.5},children:["/",t?"year":"mo"]})]}),e.jsx("ul",{className:"features",children:(n=a.features)==null?void 0:n.map((B,F)=>e.jsx("li",{children:B},F))}),e.jsxs(W,{variant:t?"primary":"secondary",style:{width:"100%"},onClick:()=>z(a),children:["Start ",t?"Yearly":"Monthly"," Plan"]})]},a.id)})}),e.jsx("div",{className:"restore-link",onClick:()=>alert("Restore Purchase Mock Triggered"),children:"Restore Purchases"})]})}),e.jsx(m,{open:P,title:"Wait! Your destiny awaits.",message:"Are you sure you want to leave?",tone:"warning",actions:[{label:"Stay & Upgrade",onSelect:()=>l(!1),variant:"primary"},{label:"Leave Anyway",onSelect:E,variant:"ghost"}],onClose:()=>l(!1)}),e.jsx(m,{open:!!s,title:"Confirm your plan",message:s?`Buy ${s.name} for $${(s.price/100).toFixed(2)}?`:"",tone:"confirm",actions:[{label:i?"Processing...":"Confirm purchase",onSelect:C,variant:"primary",disabled:i},{label:"Cancel",onSelect:()=>c(null),variant:"ghost",disabled:i}],onClose:()=>{i||c(null)}}),e.jsx(m,{open:k,title:"Welcome to Premium!",message:"Your purchase is complete and your premium access is now active.",tone:"info",actions:[{label:"Go to dashboard",onSelect:()=>d("/dashboard",{replace:!0}),variant:"primary"}],onClose:()=>x(!1)})]})}export{ae as default};
