import{j as e,C as F,u as L,r as m,D as P,x as A,h as B,E as Y}from"./index-BchX0uLO.js";import{b as T}from"./background_003-D8Gsq-oN.js";import{r as _}from"./imageResolver-D0QZlAJW.js";import{A as g}from"./AppShell-B8HgIzxe.js";import{I as p}from"./InfoTrigger-CZCkohiV.js";import"./back_page_icon-Dl_tVR_0.js";import"./exclamation_mark_icon-CRnSbbak.js";import"./profile_icon-DtzFR4rr.js";import"./question_mark_icon-PbVWcZNJ.js";import"./submit_arrow_icon-Q5dhc_J4.js";import"./splash-BJ2Tu_06.js";import"./yin_yang_balance-CnjywNEt.js";import"./Popup-Iv4cjRKp.js";import"./Button-Do3Ls8Si.js";const $=32;function U(s){var o;const i=s.trim().split(/\s+/).filter(Boolean);if(!i.length)return"";if(i.length===1)return((o=i[0][0])==null?void 0:o.toUpperCase())??"";const a=i[0][0]??"",t=i[i.length-1][0]??"";return`${a}${t}`.toUpperCase()}function M({name:s,size:i=$,imageUrl:a}){const t=(s==null?void 0:s.trim())??"",o=t?U(t):"",r=Math.max(i,24),d={width:r,height:r,borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center",background:"rgba(255, 255, 255, 0.08)",border:"1px solid rgba(244, 215, 62, 0.4)",color:"#F4D73E",fontWeight:700,fontSize:Math.max(12,Math.floor(r*.4)),letterSpacing:.5,flexShrink:0};return a?e.jsx("img",{src:a,alt:t?`${t} avatar`:"User avatar",style:{...d,objectFit:"cover",background:"rgba(0, 0, 0, 0.25)",border:"2px solid rgba(244, 215, 62, 0.8)"}}):o?e.jsx("div",{style:d,children:o}):e.jsx("div",{style:d,"aria-hidden":"true",children:e.jsx("svg",{width:Math.floor(r*.55),height:Math.floor(r*.55),viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:e.jsx("path",{d:"M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5Zm0 2c-3.867 0-7 3.133-7 7h2c0-2.761 2.239-5 5-5s5 2.239 5 5h2c0-3.867-3.133-7-7-7Z",fill:"currentColor",opacity:"0.9"})})})}function R(s){return s?s.trim().split(/\s+/).filter(Boolean)[0]??"":""}function K({fullName:s,subtitle:i,className:a,ariaLabel:t="Open profile",imageUrl:o}){const r=R(s),d=r?`Hi, ${r}`:"Hi";return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
        .profile-link {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 4px 6px;
          margin: -4px -6px;
          border-radius: 10px;
          text-decoration: none;
          color: inherit;
        }
        .profile-link:focus-visible {
          outline: 2px solid rgba(244, 215, 62, 0.6);
          outline-offset: 4px;
        }
        .profile-link__text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .profile-link__greeting {
          font-size: 22px;
          font-weight: 700;
          margin: 0;
          color: #fff;
        }
        .profile-link__subtitle {
          font-size: 13px;
          opacity: 0.8;
          margin: 0;
          color: #e6ecf5;
        }
      `}),e.jsxs(F,{to:"/profile",className:["profile-link",a].filter(Boolean).join(" "),"aria-label":t,children:[e.jsx(M,{name:s,size:36,imageUrl:o}),e.jsxs("span",{className:"profile-link__text",children:[e.jsx("span",{className:"profile-link__greeting",children:d}),i?e.jsx("span",{className:"profile-link__subtitle",children:i}):null]})]})]})}function ne(){const s=L(),[i,a]=m.useState(null),[t,o]=m.useState(!0),[r,d]=m.useState(!1),C=n=>_("destiny icons",n);return m.useEffect(()=>{async function n(){var h,f,y,b,j,k,N,v,w,E,S,z,D;try{const c=B(),x=await Y({date:new Date().toISOString().split("T")[0]});if(x.ok&&x.data){const l=x.data,I=((h=c==null?void 0:c.name)==null?void 0:h.trim())||l.userName||"User";a({userName:I,isPremium:l.isPremium??!!(c!=null&&c.isPremium),todayDate:new Date(l.today??new Date).toLocaleDateString("en-US",{weekday:"long",day:"numeric",month:"short"}),focusQuote:l.focusQuote||"Align your energy.",zodiacSign:((f=l.luckyElements)==null?void 0:f.compatibleSign)||"Ox",luckyElements:{color:((y=l.luckyElements)==null?void 0:y.color)||"#F4D73E",element:((b=l.luckyElements)==null?void 0:b.element)||"—",direction:((j=l.luckyElements)==null?void 0:j.direction)||"—"},unluckyElements:{color:"#5b6b7c",element:"Water",direction:"North"},yinYang:{yin:((k=l.yinYangBalance)==null?void 0:k.yin)??50,yang:((N=l.yinYangBalance)==null?void 0:N.yang)??50},fortune:{luckyNumber:(v=l.luckyElements)!=null&&v.number?String(l.luckyElements.number):"—",compatibleSign:((w=l.luckyElements)==null?void 0:w.compatibleSign)||"—",luckyTime:"09:00 - 11:00"},misfortune:{unluckyNumber:"4",challengingSign:"Goat",avoidTime:"13:00 - 15:00"},flipCard:{front:((E=l.flipCard)==null?void 0:E.front)||"Tip unavailable.",back:((S=l.flipCard)==null?void 0:S.back)||null},destinyInsights:(l.destinyInsights||[]).map(u=>({id:u.categoryId||"career",label:u.label||"Insight",isLocked:!!u.isLocked})),recommendation:{text:((D=(z=l.notices)==null?void 0:z[0])==null?void 0:D.text)||"No recommendation today.",isLocked:!(l.isPremium??(c==null?void 0:c.isPremium))}})}}catch(c){console.error("Dashboard Load Error",c)}finally{o(!1)}}n()},[]),t?e.jsx(g,{hideNav:!0,children:e.jsx("div",{style:{background:"#0B0C2A",height:"100vh",width:"100vw"}})}):i?e.jsx(g,{style:{background:"#0B0C2A",color:"#fff"},children:e.jsxs("div",{className:"dashboard-screen",children:[e.jsx("style",{children:`
          .dashboard-screen {
            min-height: 100vh;
            width: 100%;
            position: relative;
            background-color: #0B0C2A;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            padding-bottom: 90px;
            overflow-y: auto;
            color: #fff;
          }

        .dash-bg {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 1.0;
          z-index: 0;
        }

        .content-container {
          position: relative;
          z-index: 1;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* HEADER */
        .header { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
        .header-actions { display: flex; align-items: center; gap: 10px; }
        .upgrade-btn { background: linear-gradient(90deg, #F4D73E 0%, #c7a006 100%); color: #0B0C2A; border: none; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; cursor: pointer; }
        .premium-badge { background: rgba(244, 215, 62, 0.2); color: #F4D73E; border: 1px solid #F4D73E; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 700; }
        .preview-btn { background: rgba(255, 255, 255, 0.12); color: #fff; border: 1px solid rgba(255, 255, 255, 0.3); padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; cursor: pointer; }

        /* COMMON BOX STYLE */
        .glass-box {
          background: rgba(29, 35, 47, 0.6);
          border: 1px solid rgba(70, 98, 112, 0.3);
          border-radius: 16px;
          padding: 16px;
          backdrop-filter: blur(12px);
        }
        .section-title { color: #F4D73E; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px 0; font-weight: 600; }
        .zodiac-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
        }
        .zodiac-value { font-size: 18px; font-weight: 700; }

        /* YIN YANG BAR */
        .yy-bar-bg { width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; display: flex; }
        .yy-bar-yin { height: 100%; background: #000; }
        .yy-bar-yang { height: 100%; background: #fff; }
        .yy-labels { display: flex; justify-content: space-between; font-size: 12px; margin-top: 6px; opacity: 0.8; }

        /* LUCKY & FORTUNE */
        .lucky-row { display: flex; justify-content: space-around; align-items: center; }
        .lucky-item { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .lucky-label { font-size: 11px; opacity: 0.6; text-transform: uppercase; }
        .lucky-value { font-size: 14px; font-weight: 600; color: #fff; }
        .color-circle { width: 24px; height: 24px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.2); }
        .locked-blur { filter: blur(4px); opacity: 0.5; }
        .flip-section { display: grid; gap: 8px; width: 100%; }
        .flip-section-title { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.7); }
        .flip-note { font-size: 12px; opacity: 0.75; }
        .flip-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: rgba(11, 12, 42, 0.7);
          border-radius: 16px;
        }

        /* FLIP CARD */
        .flip-container { perspective: 1000px; height: 320px; cursor: pointer; }
        .flipper { position: relative; width: 100%; height: 100%; transition: transform 0.6s; transform-style: preserve-3d; }
        .flipper.flipped { transform: rotateY(180deg); }
        .front, .back { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; text-align: center; padding: 20px; box-sizing: border-box; gap: 14px; }
        .front { background: linear-gradient(145deg, #1D232F 0%, #2A3B55 100%); border: 1px solid #466270; }
        .back { background: linear-gradient(145deg, #3E2020 0%, #552A2A 100%); border: 1px solid #ff6b6b; transform: rotateY(180deg); }
        .card-title { font-size: 14px; font-weight: 700; margin: 0 0 8px; text-transform: uppercase; color: #F4D73E; }
        .card-text { font-size: 16px; margin: 0; font-weight: 500; }

        /* GRID */
        .grid-container { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .grid-item { background: rgba(29, 35, 47, 0.7); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; align-items: center; gap: 10px; border: 1px solid rgba(255,255,255,0.05); position: relative; cursor: pointer; }
        .grid-item.locked { opacity: 0.6; }
        .grid-icon { width: 36px; height: 36px; object-fit: contain; }
        .lock-overlay { position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.4); padding: 4px; border-radius: 6px; }
        .lock-icon { width: 14px; height: 14px; }

        `}),e.jsx("img",{src:T,className:"dash-bg",alt:"bg"}),e.jsxs("div",{className:"content-container",children:[e.jsxs("div",{className:"header",children:[e.jsx(K,{fullName:i==null?void 0:i.userName,subtitle:i==null?void 0:i.todayDate}),e.jsxs("div",{className:"header-actions",children:[e.jsx("button",{type:"button",className:"preview-btn",onClick:()=>s("/__preview/home"),children:P("preview.cta.home")}),i!=null&&i.isPremium?e.jsx("div",{className:"premium-badge",children:"PREMIUM"}):e.jsx("button",{onClick:()=>s("/membership"),className:"upgrade-btn",children:"Upgrade"})]})]}),e.jsxs("div",{className:"glass-box",children:[e.jsxs("h3",{className:"section-title",style:{color:"#fff",opacity:.7},children:["Today's Focus",e.jsx(p,{defKey:"dailyElement"})]}),e.jsxs("p",{style:{fontSize:"18px",fontStyle:"italic",lineHeight:1.5,margin:0,color:"#F4D73E"},children:['"',i==null?void 0:i.focusQuote,'"']})]}),e.jsxs("div",{className:"glass-box zodiac-card",onClick:()=>{i!=null&&i.zodiacSign&&localStorage.setItem("last_zodiac_sign",i.zodiacSign);const n=i!=null&&i.zodiacSign?`?sign=${encodeURIComponent(i.zodiacSign)}`:"";s(`/zodiac-detail${n}`)},children:[e.jsxs("div",{children:[e.jsxs("h3",{className:"section-title",style:{marginBottom:6},children:["Zodiac",e.jsx(p,{defKey:"zodiac"})]}),e.jsx("div",{className:"zodiac-value",children:i==null?void 0:i.zodiacSign})]}),e.jsx("span",{style:{fontSize:12,opacity:.7},children:"View details →"})]}),e.jsxs("div",{className:"glass-box",children:[e.jsxs("h3",{className:"section-title",children:["Yin Yang Balance",e.jsx(p,{defKey:"yinYang"})]}),e.jsxs("div",{className:"yy-bar-bg",children:[e.jsx("div",{className:"yy-bar-yin",style:{width:`${i==null?void 0:i.yinYang.yin}%`}}),e.jsx("div",{className:"yy-bar-yang",style:{width:`${i==null?void 0:i.yinYang.yang}%`}})]}),e.jsxs("div",{className:"yy-labels",children:[e.jsxs("span",{children:["Yin ",i==null?void 0:i.yinYang.yin,"%"]}),e.jsxs("span",{children:["Yang ",i==null?void 0:i.yinYang.yang,"%"]})]})]}),e.jsx("div",{className:"flip-container",onClick:()=>d(!r),children:e.jsxs("div",{className:`flipper ${r?"flipped":""}`,children:[e.jsxs("div",{className:"front",children:[e.jsxs("div",{className:"flip-section",children:[e.jsx("div",{className:"flip-section-title",children:"Daily Advice"}),e.jsxs("div",{children:[e.jsx("h4",{className:"card-title",children:"✨ Daily Tip"}),e.jsx("p",{className:"card-text",children:i==null?void 0:i.flipCard.front}),e.jsx("span",{className:"flip-note",children:"(Tap to flip)"})]})]}),e.jsxs("div",{className:"flip-section",children:[e.jsxs("div",{className:"flip-section-title",children:["Lucky Elements",e.jsx(p,{defKey:"luckyColor"})]}),e.jsxs("div",{className:"lucky-row",children:[e.jsxs("div",{className:"lucky-item",children:[e.jsx("div",{className:"color-circle",style:{backgroundColor:i==null?void 0:i.luckyElements.color}}),e.jsx("span",{className:"lucky-label",children:"Color"})]}),e.jsxs("div",{className:"lucky-item",children:[e.jsx("span",{className:"lucky-value",children:i==null?void 0:i.luckyElements.element}),e.jsx("span",{className:"lucky-label",children:"Element"})]}),e.jsxs("div",{className:"lucky-item",children:[e.jsx("span",{className:"lucky-value",children:i==null?void 0:i.luckyElements.direction}),e.jsx("span",{className:"lucky-label",children:"Direction"})]})]})]}),e.jsxs("div",{className:"flip-section",children:[e.jsxs("div",{className:"flip-section-title",children:["Today's Fortune",e.jsx(p,{defKey:"fortuneInsight"})]}),e.jsxs("div",{className:"lucky-row",children:[e.jsxs("div",{className:"lucky-item",children:[e.jsx("span",{className:"lucky-value",children:i==null?void 0:i.fortune.luckyNumber}),e.jsx("span",{className:"lucky-label",children:"Number"})]}),e.jsxs("div",{className:"lucky-item",children:[e.jsx("span",{className:"lucky-value",children:i==null?void 0:i.fortune.compatibleSign}),e.jsx("span",{className:"lucky-label",children:"Sign"})]}),e.jsxs("div",{className:"lucky-item",children:[e.jsx("span",{className:"lucky-value",style:{fontSize:"12px"},children:i==null?void 0:i.fortune.luckyTime}),e.jsx("span",{className:"lucky-label",children:"Time"})]})]})]})]}),e.jsxs("div",{className:"back",children:[e.jsxs("div",{className:"flip-section",children:[e.jsx("div",{className:"flip-section-title",children:"Daily Warning"}),e.jsxs("div",{children:[e.jsx("h4",{className:"card-title",style:{color:"#ffcccc"},children:"⚠️ Warning"}),e.jsx("p",{className:"card-text",style:{color:"#fff"},children:(i==null?void 0:i.flipCard.back)||"Take care today."})]})]}),e.jsxs("div",{className:"flip-section",children:[e.jsx("div",{className:"flip-section-title",children:"Unlucky Elements"}),e.jsxs("div",{className:"lucky-row",children:[e.jsxs("div",{className:"lucky-item",children:[e.jsx("div",{className:`color-circle ${i!=null&&i.isPremium?"":"locked-blur"}`,style:{backgroundColor:i==null?void 0:i.unluckyElements.color}}),e.jsx("span",{className:"lucky-label",children:"Color"})]}),e.jsxs("div",{className:"lucky-item",children:[e.jsx("span",{className:`lucky-value ${i!=null&&i.isPremium?"":"locked-blur"}`,children:i==null?void 0:i.unluckyElements.element}),e.jsx("span",{className:"lucky-label",children:"Element"})]}),e.jsxs("div",{className:"lucky-item",children:[e.jsx("span",{className:`lucky-value ${i!=null&&i.isPremium?"":"locked-blur"}`,children:i==null?void 0:i.unluckyElements.direction}),e.jsx("span",{className:"lucky-label",children:"Direction"})]})]})]}),e.jsxs("div",{className:"flip-section",children:[e.jsx("div",{className:"flip-section-title",children:"Today's Misfortune"}),e.jsxs("div",{className:"lucky-row",children:[e.jsxs("div",{className:"lucky-item",children:[e.jsx("span",{className:`lucky-value ${i!=null&&i.isPremium?"":"locked-blur"}`,children:i==null?void 0:i.misfortune.unluckyNumber}),e.jsx("span",{className:"lucky-label",children:"Number"})]}),e.jsxs("div",{className:"lucky-item",children:[e.jsx("span",{className:`lucky-value ${i!=null&&i.isPremium?"":"locked-blur"}`,children:i==null?void 0:i.misfortune.challengingSign}),e.jsx("span",{className:"lucky-label",children:"Sign"})]}),e.jsxs("div",{className:"lucky-item",children:[e.jsx("span",{className:`lucky-value ${i!=null&&i.isPremium?"":"locked-blur"}`,style:{fontSize:"12px"},children:i==null?void 0:i.misfortune.avoidTime}),e.jsx("span",{className:"lucky-label",children:"Avoid"})]})]})]}),!(i!=null&&i.isPremium)&&e.jsxs("div",{className:"flip-overlay",onClick:n=>{n.stopPropagation(),s("/membership")},children:[e.jsx("p",{className:"card-text",style:{marginBottom:"4px"},children:"Locked for Free Users"}),e.jsx("button",{className:"upgrade-btn",children:"Unlock"})]})]})]})}),e.jsxs("div",{children:[e.jsx("h3",{className:"section-title",style:{marginLeft:4},children:"Destiny Insights"}),e.jsx("div",{className:"grid-container",children:i==null?void 0:i.destinyInsights.map(n=>e.jsxs("div",{className:`grid-item ${n.isLocked?"locked":""}`,onClick:()=>{n.isLocked?s("/membership"):s(`/insight/${n.id}`)},children:[n.isLocked&&e.jsx("div",{className:"lock-overlay",children:e.jsx("img",{src:A,className:"lock-icon",alt:"Locked"})}),e.jsx("img",{src:C(n.id),className:"grid-icon",alt:n.label}),e.jsx("span",{className:"grid-label",children:n.label})]},n.id))})]}),e.jsxs("div",{className:"glass-box",children:[e.jsxs("h3",{className:"section-title",children:["Daily Recommendation",e.jsx(p,{defKey:"environment"})]}),e.jsx("p",{style:{fontSize:"14px",lineHeight:"1.5",margin:0,filter:i!=null&&i.isPremium?"none":"blur(4px)"},children:i==null?void 0:i.recommendation.text}),!(i!=null&&i.isPremium)&&e.jsx("div",{style:{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx("button",{className:"upgrade-btn",onClick:()=>s("/membership"),children:"Upgrade to View"})})]})]})]})}):e.jsx(g,{children:e.jsx("div",{style:{padding:20},children:"Unable to load dashboard."})})}export{ne as default};
