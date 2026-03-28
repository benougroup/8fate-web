import{u as k,r as i,j as e,L as E,x as z,I as B}from"./index-04RUwBse.js";import{b as I}from"./background_003-D8Gsq-oN.js";import{A as h}from"./AppShell-DldpckuI.js";import{E as $}from"./ErrorBox-BOtNVmEW.js";import{B as m}from"./Button-BB6WBOrq.js";import{P as b}from"./Popup-CrdHGELT.js";import{u as A}from"./useSession-Ck2jKrVa.js";import"./profile_icon-DtzFR4rr.js";import"./exclamation_mark_icon-CRnSbbak.js";import"./question_mark_icon-PbVWcZNJ.js";function V(){var f;const c=k(),[l,j]=A(),[t,v]=i.useState([]),[y,S]=i.useState(!0),[x,g]=i.useState(null),[C,o]=i.useState(!1),[P,d]=i.useState(!1),[p,w]=i.useState(()=>localStorage.getItem("subscribed_plan_id")||""),u=!!(l!=null&&l.isPremium),r=i.useMemo(()=>p?t.find(a=>a.id===p)??t[0]:t.find(a=>a.id.includes("yearly"))??t[0],[p,t]);return i.useEffect(()=>{async function a(){var s;try{const n=await B();n.ok&&n.data?v(n.data.plans):g(((s=n.error)==null?void 0:s.message)||"Failed to load plans")}catch{g("An unexpected error occurred.")}finally{S(!1)}}a()},[]),y?e.jsx(h,{hideNav:!0,children:e.jsx(E,{label:"Loading plans..."})}):e.jsxs(h,{children:[e.jsx("style",{children:`
        .plans-screen { padding: 20px; color: #fff; min-height: 100vh; }
        .bg-fixed { position: fixed; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; }
        .content { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 20px; }
        .page-title { font-size: 22px; font-weight: 700; margin: 0 0 10px 0; text-align: center; }
        .plan-card {
          background: rgba(29, 35, 47, 0.8); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px; padding: 20px; position: relative; overflow: hidden;
        }
        .active-plan {
          border: 1px solid rgba(244, 215, 62, 0.7);
          background: linear-gradient(145deg, rgba(29, 35, 47, 0.95), rgba(40, 30, 10, 0.7));
        }
        .plan-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.4px;
          color: #0B0C2A;
          background: #F4D73E;
          border-radius: 999px;
          padding: 4px 10px;
          margin-bottom: 12px;
        }
        .plan-name { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
        .plan-price { font-size: 20px; color: #F4D73E; font-weight: 600; margin-bottom: 12px; }
        .features { list-style: none; padding: 0; margin: 0 0 16px; opacity: 0.8; font-size: 13px; }
        .features li { margin-bottom: 6px; }
        .plan-actions { display: grid; gap: 10px; }
      `}),e.jsx("img",{src:I,className:"bg-fixed",alt:"bg"}),e.jsx("div",{className:"plans-screen",children:e.jsxs("div",{className:"content",children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:10},children:[e.jsx("img",{src:z,style:{width:24},alt:"Back",onClick:()=>c(-1)}),e.jsx("h1",{className:"page-title",style:{margin:0},children:"Plans & Billing"})]}),x&&e.jsx($,{message:x}),u&&r&&e.jsxs("div",{className:"plan-card active-plan",children:[e.jsx("div",{className:"plan-chip",children:"Current Plan"}),e.jsx("div",{className:"plan-name",children:r.name}),e.jsxs("div",{className:"plan-price",children:["$",(r.price/100).toFixed(2)]}),e.jsx("ul",{className:"features",children:(f=r.features)==null?void 0:f.map((a,s)=>e.jsxs("li",{children:["• ",a]},`${r.id}-${s}`))}),e.jsxs("div",{className:"plan-actions",children:[e.jsx(m,{variant:"secondary",onClick:()=>c("/upgrade"),children:"Change Plan"}),e.jsx(m,{variant:"ghost",onClick:()=>o(!0),children:"Cancel Subscription"})]})]}),t.map(a=>{var s;return e.jsxs("div",{className:"plan-card",children:[e.jsx("div",{className:"plan-name",children:a.name}),e.jsxs("div",{className:"plan-price",children:["$",(a.price/100).toFixed(2)]}),e.jsxs("ul",{className:"features",children:[a.trial&&e.jsxs("li",{children:["• ",a.trial]}),(s=a.features)==null?void 0:s.map((n,N)=>e.jsxs("li",{children:["• ",n]},`${a.id}-${N}`))]}),e.jsx(m,{style:{width:"100%"},onClick:()=>c("/upgrade"),children:u?"View Plan Options":"Manage Plan"})]},a.id)})]})}),e.jsx(b,{open:C,title:"Cancel your subscription?",message:"You will keep premium access until the end of the billing period.",tone:"warning",actions:[{label:"Keep Premium",onSelect:()=>o(!1),variant:"primary"},{label:"Cancel Subscription",onSelect:()=>{o(!1),j({...l,isPremium:!1}),w(""),localStorage.removeItem("subscribed_plan_id"),d(!0)},variant:"ghost"}],onClose:()=>o(!1)}),e.jsx(b,{open:P,title:"Subscription cancelled",message:"Your premium benefits remain active until the current period ends.",tone:"info",actions:[{label:"Got it",onSelect:()=>d(!1),variant:"primary"}],onClose:()=>d(!1)})]})}export{V as default};
