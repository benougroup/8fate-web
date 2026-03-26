import{_ as u,a as j,b as v,c as y,d as z,e as N,f as k,g as w,h as B,i as F,j as S,k as L,l as E,m as C}from"./tiger-BLHpiHP8.js";import{u as D,dO as I,h as A,r as n,j as e,L as P,x as R,dQ as H}from"./index-DQfzOgci.js";import{b as O}from"./background_003-D8Gsq-oN.js";import{i as T}from"./back_page_icon-Dl_tVR_0.js";import{A as h}from"./AppShell-rTOyX860.js";import{B as Z}from"./BackgroundScreen-Bks-uW60.js";import{D as G}from"./DetailHeader-BS9CcGqp.js";import{G as c}from"./GlassCard-LWksbb0u.js";import{L as U}from"./LockedOverlay-dndy3ZZO.js";import{E as K}from"./ErrorBox-lMib7A1M.js";import"./profile_icon-DtzFR4rr.js";function Q(r){if(!r)return"";const l=r.toLowerCase().trim();return new URL(Object.assign({"../assets/images/zodiac/chatgpt image may 4, 2025, 05_21_51 pm.png":C,"../assets/images/zodiac/chatgpt image may 4, 2025, 05_23_40 pm.png":E,"../assets/images/zodiac/chicken.png":L,"../assets/images/zodiac/dog.png":S,"../assets/images/zodiac/dragon.png":F,"../assets/images/zodiac/goat.png":B,"../assets/images/zodiac/horse.png":w,"../assets/images/zodiac/monkey.png":k,"../assets/images/zodiac/ox.png":N,"../assets/images/zodiac/pig.png":z,"../assets/images/zodiac/rabbit.png":y,"../assets/images/zodiac/rat.png":v,"../assets/images/zodiac/snake.png":j,"../assets/images/zodiac/tiger.png":u})[`../assets/images/zodiac/${l}.png`],import.meta.url).href}function te(){var x;const r=D(),[l]=I(),_=A(),{isPremium:o}=_||{},d=l.get("sign")||localStorage.getItem("last_zodiac_sign")||"",[a,b]=n.useState(null),[f,g]=n.useState(!0),[m,p]=n.useState(null);return n.useEffect(()=>{async function s(){var i;if(!d){p("No zodiac sign specified."),g(!1);return}g(!0),p(null);try{const t=await H({sign:d,detailLevel:o?"advanced":"beginner"});if(t.ok&&t.data)b(t.data);else throw new Error(((i=t.error)==null?void 0:i.message)||"Failed to load zodiac detail")}catch(t){p((t==null?void 0:t.message)||"Something went wrong.")}finally{g(!1)}}s()},[d,o]),f?e.jsx(h,{children:e.jsx(P,{})}):e.jsxs(h,{children:[e.jsx("style",{children:`
        .zod-screen {
          padding: 20px 20px 100px; /* Bottom padding for nav */
          color: #fff;
        }
        .zod-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .detail-header__title { text-transform: capitalize; }

        /* Hero Section */
        .hero-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 24px;
          background: radial-gradient(circle at center, rgba(244, 215, 62, 0.15) 0%, rgba(29, 35, 47, 0.4) 70%);
          border-radius: 20px;
          border: 1px solid rgba(244, 215, 62, 0.2);
          backdrop-filter: blur(10px);
        }
        .hero-img {
          width: 120px;
          height: 120px;
          object-fit: contain;
          margin-bottom: 16px;
          filter: drop-shadow(0 0 15px rgba(244, 215, 62, 0.3));
        }
        .hero-sign { font-size: 28px; font-weight: 800; color: #F4D73E; margin: 0; text-transform: uppercase; letter-spacing: 1px; }
        .hero-sub { font-size: 14px; opacity: 0.8; margin-top: 4px; font-style: italic; }
        .hero-desc { font-size: 15px; line-height: 1.6; margin-top: 16px; color: rgba(255,255,255,0.9); }

        /* Info Cards */
        .section-head { color: #F4D73E; font-size: 13px; text-transform: uppercase; font-weight: 700; margin-bottom: 12px; }

        /* Traits Grid */
        .traits-grid { display: flex; flex-wrap: wrap; gap: 8px; }
        .trait-tag {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
        }

        /* Compatibility */
        .compat-row { display: flex; flex-direction: column; gap: 8px; }
        .compat-group { display: flex; align-items: center; gap: 10px; }
        .compat-label { font-size: 12px; width: 50px; opacity: 0.7; }
        .compat-vals { display: flex; gap: 6px; flex-wrap: wrap; flex: 1; }
        .match-good { color: #8be8b6; border-color: #8be8b6; }
        .match-bad { color: #FF6B6B; border-color: #FF6B6B; }

      `}),e.jsxs(Z,{backgroundImage:O,className:"zod-screen",contentClassName:"zod-content",children:[e.jsx(G,{title:(a==null?void 0:a.sign)||"Zodiac",backIcon:T,onBack:()=>r(-1)}),m&&e.jsx(K,{message:m}),a&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"hero-card",children:[e.jsx("img",{src:Q(a.sign),className:"hero-img",alt:a.sign,onError:s=>s.currentTarget.style.display="none"}),e.jsx("h1",{className:"hero-sign",children:a.sign}),e.jsx("div",{className:"hero-sub",children:a.subtitle}),e.jsx("p",{className:"hero-desc",children:a.summary})]}),e.jsxs(c,{children:[e.jsx("div",{className:"section-head",children:"Key Traits"}),e.jsx("div",{className:"traits-grid",children:a.traits.map((s,i)=>e.jsx("span",{className:"trait-tag",children:s},i))})]}),e.jsxs(c,{children:[e.jsx("div",{className:"section-head",children:"Compatibility"}),e.jsxs("div",{className:"compat-row",children:[e.jsxs("div",{className:"compat-group",children:[e.jsx("span",{className:"compat-label",children:"Best"}),e.jsx("div",{className:"compat-vals",children:a.compatibility.best.map((s,i)=>e.jsx("span",{className:"trait-tag match-good",style:{color:"#8be8b6",borderColor:"rgba(139, 232, 182, 0.3)"},children:s},i))})]}),e.jsxs("div",{className:"compat-group",style:{marginTop:8},children:[e.jsx("span",{className:"compat-label",children:"Avoid"}),e.jsx("div",{className:"compat-vals",children:a.compatibility.avoid.map((s,i)=>e.jsx("span",{className:"trait-tag match-bad",style:{color:"#FF6B6B",borderColor:"rgba(255, 107, 107, 0.3)"},children:s},i))})]})]})]}),e.jsxs(c,{children:[e.jsx("div",{className:"section-head",children:"Lucky Aspects"}),e.jsxs("div",{style:{fontSize:14,lineHeight:1.6},children:[e.jsxs("div",{children:[e.jsx("span",{style:{opacity:.7},children:"Colors:"})," ",a.lucky.colors.join(", ")]}),e.jsxs("div",{children:[e.jsx("span",{style:{opacity:.7},children:"Numbers:"})," ",a.lucky.numbers.join(", ")]})]})]}),e.jsxs(c,{className:"glass-card",style:{position:"relative",overflow:"hidden"},children:[e.jsxs("div",{className:"section-head",style:{display:"flex",alignItems:"center",gap:6},children:["Advanced Forecast",o&&e.jsx("span",{style:{fontSize:10,background:"#F4D73E",color:"#000",padding:"1px 4px",borderRadius:4},children:"PRO"})]}),e.jsx(U,{isLocked:!o,lockIcon:R,message:"Unlock 2025 Forecast",onUpgrade:o?void 0:()=>r("/membership"),children:o?e.jsx("ul",{style:{margin:0,paddingLeft:18,fontSize:14,lineHeight:1.5},children:(x=a.advanced)==null?void 0:x.notes.map((s,i)=>e.jsx("li",{style:{marginBottom:6},children:s},i))}):e.jsxs(e.Fragment,{children:[e.jsx("p",{children:"2025 will be a year of significant change. Your career sector indicates..."}),e.jsx("p",{children:"Relationships may face a test in the summer months..."})]})})]})]})]})]})}export{te as default};
