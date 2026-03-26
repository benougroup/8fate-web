import{u as S,h as N,r,j as t,d as w,x as L,y as C,z as I,p as z}from"./index-Cs5zJtQU.js";import{B as E}from"./BackgroundScreen-CSOHEDwx.js";import{L as F}from"./LockedOverlay-nAGyfOG8.js";function D(){try{const o=localStorage.getItem("profile_data")||localStorage.getItem("dev_profile_data")||localStorage.getItem("localProfile.v1");return o?JSON.parse(o):null}catch{return null}}function B(o){return o==="afternoon"?"afternoon":o==="evening"?"evening":o==="night"||o==="midnight"?"night":"morning"}function R(){const o=S(),n=N(),c=!!(n!=null&&n.isPremium),[f,u]=r.useState([]),[s,p]=r.useState(null),[g,x]=r.useState(!0),[d,m]=r.useState(!1);r.useEffect(()=>{async function i(){const e=D(),b=(e==null?void 0:e.dateOfBirth)||new Date().toISOString().slice(0,10),k=B(e==null?void 0:e.timeRange),y=(e==null?void 0:e.timeZoneId)||"UTC",l=await C({dob:b,timeRange:k,timeZoneId:y,location:e==null?void 0:e.country,locale:"en"});if(l.ok&&l.data){const j=l.data.windows.map(a=>({id:a.id,hourLabel:a.title,description:a.description,keywords:a.shiChen.map(v=>v.key),isLocked:a.locked&&!c}));u(j)}x(!1)}i()},[c]);async function h(){if(!s||d)return;if(m(!0),(await I(s)).ok){z({requiresTimeSelection:!1}),o("/dashboard",{replace:!0});return}m(!1)}return g?t.jsx("div",{style:{background:"#0B0C2A",height:"100vh"}}):t.jsxs(E,{backgroundImage:w,className:"tf-screen",contentClassName:"tf-container",children:[t.jsx("style",{children:`
        .tf-screen {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          display: flex;
          justify-content: center;
          padding: 20px 0;
          overflow-y: auto;
        }
        .tf-container {
          width: 100%;
          max-width: 480px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .header { text-align: center; color: #fff; }
        .title { font-size: 20px; font-weight: 700; margin: 0 0 8px; color: #F4D73E; }
        .subtitle { font-size: 14px; opacity: 0.8; line-height: 1.5; margin: 0; }

        .nav-row { display: flex; justify-content: flex-start; }
        .back-btn {
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          background: rgba(29, 35, 47, 0.6);
          padding: 8px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .cards-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .option-card {
          position: relative;
          background: rgba(29, 35, 47, 0.85);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          overflow: hidden;
        }
        .option-card.selected {
          background: rgba(244, 215, 62, 0.15);
          border-color: #F4D73E;
          box-shadow: 0 0 12px rgba(244, 215, 62, 0.3);
        }

        /* Locked State */
        .option-card.locked {
          cursor: pointer;
          border-color: rgba(255,255,255,0.05);
        }
        .option-card .locked-overlay__mask {
          background: rgba(11, 12, 42, 0.4);
        }

        .opt-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .opt-label { color: #F4D73E; font-size: 13px; font-weight: 700; text-transform: uppercase; }
        .check-circle { width: 20px; height: 20px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3); display: grid; place-items: center; }
        .option-card.selected .check-circle { border-color: #F4D73E; background: #F4D73E; }
        .check-icon { font-size: 12px; color: #000; display: none; }
        .option-card.selected .check-icon { display: block; }

        .opt-desc { font-size: 14px; color: #fff; line-height: 1.4; margin: 0 0 12px; }
        .tags { display: flex; gap: 8px; flex-wrap: wrap; }
        .tag { background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 4px; font-size: 11px; color: rgba(255,255,255,0.8); }

        .confirm-btn {
          width: 100%;
          height: 50px;
          border-radius: 25px;
          background: #F4D73E;
          color: #0B0C2A;
          font-weight: 700;
          font-size: 16px;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(244, 215, 62, 0.3);
          margin-top: 10px;
        }
        .confirm-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}),t.jsx("div",{className:"nav-row",children:t.jsx("button",{type:"button",className:"back-btn",onClick:()=>o("/profile-setup"),children:"Back"})}),t.jsxs("div",{className:"header",children:[t.jsx("h1",{className:"title",children:"Find Your Birth Time"}),t.jsxs("p",{className:"subtitle",children:["Select the profile that best describes your personality. ",!c&&"Upgrade to see all options."]})]}),t.jsx("div",{className:"cards-list",children:f.map(i=>t.jsx("div",{className:`option-card ${s===i.id?"selected":""} ${i.isLocked?"locked":""}`,onClick:()=>{i.isLocked?o("/membership"):p(i.id)},role:"button",tabIndex:0,onKeyDown:e=>{e.key!=="Enter"&&e.key!==" "||(e.preventDefault(),i.isLocked?o("/membership"):p(i.id))},children:t.jsxs(F,{isLocked:!!i.isLocked,lockIcon:L,message:"Premium Option",onUpgrade:i.isLocked?()=>o("/membership"):void 0,children:[t.jsxs("div",{className:"opt-header",children:[t.jsx("span",{className:"opt-label",children:i.hourLabel}),t.jsx("div",{className:"check-circle",children:t.jsx("span",{className:"check-icon",children:"✓"})})]}),t.jsx("p",{className:"opt-desc",children:i.description}),t.jsx("div",{className:"tags",children:i.keywords.map(e=>t.jsx("span",{className:"tag",children:e},e))})]})},i.id))}),t.jsx("button",{className:"confirm-btn",disabled:!s||d,onClick:h,children:d?"Saving...":"Confirm & Continue"})]})}export{R as default};
