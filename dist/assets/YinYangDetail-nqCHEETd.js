import{u,dO as b,h as y,r,j as e,L as v,x as N,dP as w}from"./index-DgbupLA2.js";import{b as k}from"./background_003-D8Gsq-oN.js";import{i as Y}from"./back_page_icon-Dl_tVR_0.js";import{i as E,a as B,b as S}from"./yin_yang_balance-CnjywNEt.js";import{A as p}from"./AppShell-Bb5JWpNa.js";import{B as D}from"./BackgroundScreen-vQHGRN1q.js";import{D as z}from"./DetailHeader-DXS21Rqy.js";import{G as c}from"./GlassCard-DccyGaYK.js";import{L}from"./LockedOverlay-BH7d8WE6.js";import{E as A}from"./ErrorBox-4Cy3JgYF.js";import"./profile_icon-DtzFR4rr.js";function $(){const o=u(),[h]=b(),g=y(),{isPremium:t}=g||{},l=h.get("key")||"balance",[s,f]=r.useState(null),[j,d]=r.useState(!0),[m,x]=r.useState(null);return r.useEffect(()=>{async function n(){var a;d(!0),x(null);try{const i=await w({key:l,detailLevel:t?"advanced":"beginner"});if(i.ok&&i.data)f(i.data);else throw new Error(((a=i.error)==null?void 0:a.message)||"Failed to load details")}catch(i){x((i==null?void 0:i.message)||"Something went wrong.")}finally{d(!1)}}n()},[l,t]),j?e.jsx(p,{children:e.jsx(v,{})}):e.jsxs(p,{children:[e.jsx("style",{children:`
        .yy-screen {
          padding: 20px 20px 100px;
          color: #fff;
        }
        .yy-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Hero Section */
        .hero-card {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .main-icon { width: 64px; height: 64px; object-fit: contain; margin-bottom: 12px; filter: drop-shadow(0 0 10px rgba(255,255,255,0.2)); }
        .hero-title { font-size: 22px; font-weight: 700; margin-bottom: 4px; color: #fff; }
        .hero-sub { font-size: 13px; opacity: 0.8; margin-bottom: 20px; font-style: italic; }

        /* Balance Bar */
        .balance-container { width: 100%; margin-bottom: 20px; }
        .bar-labels { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px; font-weight: 600; }
        .bar-track { width: 100%; height: 12px; background: rgba(255,255,255,0.1); border-radius: 6px; overflow: hidden; display: flex; }
        .bar-yin { background: #111; height: 100%; }
        .bar-yang { background: #fff; height: 100%; }
        
        .hero-desc { font-size: 15px; line-height: 1.6; color: rgba(255,255,255,0.9); }

        .section-head { color: #F4D73E; font-size: 13px; text-transform: uppercase; font-weight: 700; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
        
        .list-item { margin-bottom: 8px; font-size: 14px; line-height: 1.4; display: flex; gap: 8px; }
        .bullet { color: #F4D73E; font-weight: bold; }

        /* Icons Row */
        .icons-row { display: flex; justify-content: center; gap: 32px; margin-bottom: 16px; }
        .icon-col { display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 12px; opacity: 0.8; }
        .mini-icon { width: 32px; height: 32px; opacity: 0.9; }

      `}),e.jsxs(D,{backgroundImage:k,className:"yy-screen",contentClassName:"yy-content",children:[e.jsx(z,{title:"Energy Balance",backIcon:Y,onBack:()=>o(-1)}),m&&e.jsx(A,{message:m}),s&&e.jsxs(e.Fragment,{children:[e.jsxs(c,{className:"glass-card hero-card",children:[e.jsx("img",{src:E,className:"main-icon",alt:"Yin Yang"}),e.jsx("h1",{className:"hero-title",children:s.title}),e.jsx("div",{className:"hero-sub",children:s.subtitle}),e.jsxs("div",{className:"balance-container",children:[e.jsxs("div",{className:"bar-labels",children:[e.jsxs("span",{children:["YIN ",s.percentages.yin,"%"]}),e.jsxs("span",{children:["YANG ",s.percentages.yang,"%"]})]}),e.jsxs("div",{className:"bar-track",children:[e.jsx("div",{className:"bar-yin",style:{width:`${s.percentages.yin}%`}}),e.jsx("div",{className:"bar-yang",style:{width:`${s.percentages.yang}%`}})]})]}),e.jsx("p",{className:"hero-desc",children:s.summary})]}),e.jsxs(c,{children:[e.jsx("div",{className:"section-head",children:"Key Qualities"}),e.jsxs("div",{className:"icons-row",children:[e.jsxs("div",{className:"icon-col",children:[e.jsx("img",{src:B,className:"mini-icon",alt:"Yin"}),e.jsx("span",{children:"Receptive"})]}),e.jsxs("div",{className:"icon-col",children:[e.jsx("img",{src:S,className:"mini-icon",alt:"Yang"}),e.jsx("span",{children:"Active"})]})]}),s.qualities.map((n,a)=>e.jsxs("div",{className:"list-item",children:[e.jsx("span",{className:"bullet",children:"•"})," ",n]},a))]}),e.jsxs(c,{children:[e.jsx("div",{className:"section-head",children:"How to Balance"}),s.balancingTips.map((n,a)=>e.jsxs("div",{className:"list-item",children:[e.jsx("span",{className:"bullet",children:"✓"})," ",n]},a))]}),s.advanced&&e.jsxs(c,{className:"glass-card",style:{position:"relative",overflow:"hidden"},children:[e.jsxs("div",{className:"section-head",children:["Advanced Notes",t&&e.jsx("span",{style:{fontSize:10,background:"#F4D73E",color:"#000",padding:"1px 4px",borderRadius:4},children:"PRO"})]}),e.jsx(L,{isLocked:!t,lockIcon:N,message:"Unlock Advanced Analysis",onUpgrade:t?void 0:()=>o("/membership"),children:t?s.advanced.notes.map((n,a)=>e.jsxs("div",{className:"list-item",children:[e.jsx("span",{className:"bullet",children:"★"})," ",n]},a)):e.jsxs(e.Fragment,{children:[e.jsx("p",{children:"Your energy chart indicates a shift in the coming months..."}),e.jsx("p",{children:"Focus on grounding exercises to prevent burnout..."})]})})]})]})]})]})}export{$ as default};
