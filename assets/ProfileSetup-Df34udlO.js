import{u as U,r,h as W,j as t,d as X,o as Q,p as V}from"./index-D4b7fGqM.js";import{a as ee}from"./profile_icon-DtzFR4rr.js";import{e as te,a as ae,b as re,T as se,t as f}from"./timeRanges-Ca2k--fm.js";import{B as ie}from"./BackgroundScreen-BsV6Lihb.js";function ne(p){return(Array.isArray(p==null?void 0:p.shiChen)?p.shiChen:[]).filter(s=>s&&typeof s.start=="string"&&typeof s.end=="string"&&typeof s.key=="string").map(s=>({value:s.start,label:`${s.start} - ${s.end} (${s.key} Hour)`}))}function pe(){var E,A,R;const p=U(),v=r.useMemo(()=>te(f),[]),s=r.useMemo(()=>ae(f),[]),o=r.useMemo(()=>re(f),[]),N=r.useMemo(()=>ne(f),[]),h=v.includes("Asia/Hong_Kong")?"Asia/Hong_Kong":v[0]||"",l=r.useMemo(()=>o.find(e=>e.timeZoneId===h&&e.countryCode==="HK")??o.find(e=>e.timeZoneId===h)??o[0]??null,[o,h]),H=(l==null?void 0:l.countryCode)??((E=s[0])==null?void 0:E.code)??"",[u,K]=r.useState(""),[y,_]=r.useState(""),[w,S]=r.useState((l==null?void 0:l.id)??""),[x,C]=r.useState(H),[j,k]=r.useState((l==null?void 0:l.timeZoneId)??h),[g,F]=r.useState(""),[i,$]=r.useState(!0),[m,z]=r.useState(((A=N[0])==null?void 0:A.value)||""),[b,I]=r.useState(""),[P,T]=r.useState(!1),[O,d]=r.useState(null),D=r.useMemo(()=>{const e=o.filter(a=>a.countryCode===x);return e.length?e:o},[o,x]);function B(e){try{localStorage.setItem("profile_data",JSON.stringify(e))}catch(a){console.error("Failed to save profile locally",a)}}function M(e,a){V({name:u.trim(),requiresProfile:!1,requiresTimeSelection:e,...a!==void 0?{isPremium:a}:{}}),p(e?"/timefinder":"/dashboard",{replace:!0})}function G(){p(-1)}function Y(e){S(e);const a=o.find(n=>n.id===e)??null;C((a==null?void 0:a.countryCode)??""),k((a==null?void 0:a.timeZoneId)??"")}function q(e){C(e);const n=o.filter(c=>c.countryCode===e)[0]??null;S((n==null?void 0:n.id)??""),k((n==null?void 0:n.timeZoneId)??"")}async function J(e){var n;if(e.preventDefault(),d(null),!u.trim())return d("Please enter your name.");if(!x)return d("Please select your country of birth.");if(!w)return d("Please select your place of birth.");if(!j)return d("Please select a time zone.");if(!g)return d("Please choose your birth date.");if(i&&!m)return d("Select your birth time window.");if(!i&&!b)return d("Select an approximate time range.");T(!0);const a={name:u.trim(),gender:y,country:x.trim(),timeZoneId:j,dateOfBirth:g,exactTime:i?m:null,timeRange:i?null:b};try{const c=await Q({name:u.trim(),gender:y||void 0,country:x.trim(),timeZoneId:j,dob:g,exactTime:i?m:void 0,timeRange:i?void 0:b,language:"English"});if(!c.ok||!c.data)throw new Error(((n=c.error)==null?void 0:n.message)||"Profile setup failed. Please try again.");const L=!i||!!c.data.needsTimeFinder;B(a),M(L,c.data.isPremium)}catch(c){console.error("Profile setup error",c),B(a),M(!i,!0)}finally{T(!1)}}const Z=u||((R=W())==null?void 0:R.name)||"";return t.jsxs(ie,{backgroundImage:X,className:"profile-setup-screen",contentClassName:"profile-setup-content",children:[t.jsx("style",{children:`
        .profile-setup-screen {
          color: #fce9c7;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .profile-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(11,12,42,0.85) 0%, rgba(11,12,42,0.9) 60%, rgba(11,12,42,0.96) 100%);
          z-index: 0;
        }
        .profile-setup-content {
          position: relative;
          z-index: 1;
        }
        .profile-card {
          position: relative;
          z-index: 1;
          max-width: 520px;
          margin: 0 auto;
          padding: 28px 20px 48px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .back-button {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fce9c7;
          padding: 8px 12px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .back-button:hover { border-color: rgba(244, 215, 62, 0.35); }
        .back-button:active { transform: translateY(1px); }
        .title {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: 0.3px;
          color: #f9dfa6;
        }
        .subtitle { opacity: 0.82; line-height: 1.5; }
        .avatar {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          border: 2px solid rgba(244, 215, 62, 0.6);
          background: rgba(255,255,255,0.08);
          display: grid;
          place-items: center;
          overflow: hidden;
          box-shadow: 0 12px 24px rgba(0,0,0,0.35);
          align-self: center;
        }
        .avatar img { width: 82%; height: 82%; object-fit: contain; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.45)); }
        form { display: grid; gap: 14px; position: relative; z-index: 1; }
        label.field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 14px;
          color: #fce9c7;
        }
        .field span { opacity: 0.72; letter-spacing: 0.2px; font-size: 13px; }
        .input, .select {
          height: 46px;
          border-radius: 12px;
          border: 1px solid rgba(247, 216, 148, 0.24);
          background: rgba(7, 12, 28, 0.7);
          color: #fce9c7;
          padding: 0 12px;
          font-size: 15px;
        }
        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(247, 216, 148, 0.18);
          padding: 12px 14px;
          border-radius: 14px;
        }
        .toggle-label { font-weight: 700; letter-spacing: 0.3px; }
        .switch {
          width: 50px;
          height: 26px;
          background: rgba(255,255,255,0.15);
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.18);
          position: relative;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .switch[data-on="true"] { background: rgba(244, 215, 62, 0.5); border-color: rgba(244, 215, 62, 0.7); }
        .switch-thumb {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #0b0c2a;
          box-shadow: 0 4px 10px rgba(0,0,0,0.35);
          transition: transform 0.2s ease;
        }
        .switch[data-on="true"] .switch-thumb { transform: translateX(24px); }
        .help-text { color: rgba(252, 233, 199, 0.75); font-size: 13px; line-height: 1.5; }
        .error {
          background: rgba(255, 107, 107, 0.12);
          border: 1px solid rgba(255, 107, 107, 0.4);
          color: #ffcdd2;
          padding: 10px 12px;
          border-radius: 10px;
          font-size: 14px;
        }
        .submit-btn {
          margin-top: 4px;
          height: 48px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(90deg, #f7d894, #f4c43e);
          color: #0b0c2a;
          font-weight: 800;
          font-size: 16px;
          letter-spacing: 0.3px;
          cursor: pointer;
          box-shadow: 0 12px 26px rgba(244, 215, 62, 0.3);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .submit-btn:active { transform: translateY(1px); box-shadow: 0 6px 18px rgba(244, 215, 62, 0.25); }
        .subdued { opacity: 0.7; font-size: 14px; }
        .card-surface {
          background: rgba(29, 35, 47, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          padding: 18px;
          box-shadow: 0 16px 32px rgba(0,0,0,0.35);
          display: grid;
          gap: 12px;
        }
      `}),t.jsx("div",{className:"profile-overlay"}),t.jsxs("div",{className:"profile-card",children:[t.jsxs("button",{className:"back-button",type:"button",onClick:G,"aria-label":"Back",children:[t.jsx("span",{"aria-hidden":!0,children:"‹"}),t.jsx("span",{children:"Back"})]}),t.jsx("div",{className:"title",children:"Profile Setup"}),t.jsx("p",{className:"subtitle",children:"Tell us a bit about you so we can generate your BaZi chart."}),t.jsx("div",{className:"avatar",children:t.jsx("img",{src:ee,alt:Z?`${Z} avatar placeholder`:"Profile avatar"})}),O&&t.jsx("div",{className:"error",role:"alert",children:O}),t.jsx("div",{className:"card-surface",children:t.jsxs("form",{onSubmit:J,children:[t.jsxs("label",{className:"field",children:[" ",t.jsx("span",{children:"Name"}),t.jsx("input",{className:"input",value:u,onChange:e=>K(e.target.value),placeholder:"e.g., Alex Chan"})]}),t.jsxs("label",{className:"field",children:[" ",t.jsx("span",{children:"Gender (optional)"}),t.jsxs("select",{className:"select",value:y,onChange:e=>_(e.target.value),children:[t.jsx("option",{value:"",children:"Prefer not to say"}),t.jsx("option",{value:"female",children:"Female"}),t.jsx("option",{value:"male",children:"Male"})]})]}),t.jsxs("label",{className:"field",children:[" ",t.jsx("span",{children:"Country of birth"}),t.jsxs("select",{className:"select",value:x,onChange:e=>q(e.target.value),children:[t.jsx("option",{value:"",children:"Select country"}),s.map(e=>t.jsx("option",{value:e.code,children:e.name},e.code))]})]}),t.jsxs("label",{className:"field",children:[" ",t.jsx("span",{children:"City of birth (time zone)"}),t.jsxs("select",{className:"select",value:w,onChange:e=>Y(e.target.value),children:[t.jsx("option",{value:"",children:"Select city"}),D.map(e=>t.jsx("option",{value:e.id,children:e.label},e.id))]}),t.jsx("div",{className:"help-text",children:"Your time zone is tied to the place of birth selection."})]}),t.jsxs("label",{className:"field",children:[" ",t.jsx("span",{children:"Date of birth"}),t.jsx("input",{className:"input",type:"date",value:g,onChange:e=>F(e.target.value)})]}),t.jsxs("div",{className:"toggle-row",children:[t.jsx("div",{className:"toggle-label",children:"I know my birth time"}),t.jsx("button",{type:"button",className:"switch","data-on":i,"aria-pressed":i,onClick:()=>{const e=!i;$(e),e?I(""):z("")},children:t.jsx("span",{className:"switch-thumb"})})]}),i?t.jsxs("label",{className:"field",children:[" ",t.jsx("span",{children:"Exact birth time (Chinese 2-hour)"}),t.jsxs("select",{className:"select",value:m,onChange:e=>z(e.target.value),children:[t.jsx("option",{value:"",children:"Select time window"}),N.map(e=>t.jsx("option",{value:e.value,children:e.label},e.value))]})]}):t.jsxs("label",{className:"field",children:[" ",t.jsx("span",{children:"Approximate time"}),t.jsxs("select",{className:"select",value:b,onChange:e=>I(e.target.value),children:[t.jsx("option",{value:"",children:"Select a period"}),se.map(e=>t.jsx("option",{value:e.value,children:e.label},e.value))]})]}),t.jsx("p",{className:"help-text subdued",children:"We use your birth details to generate the most accurate BaZi chart."}),t.jsx("button",{type:"submit",className:"submit-btn",disabled:P,children:P?"Saving...":"Confirm"})]})})]})]})}export{pe as default};
