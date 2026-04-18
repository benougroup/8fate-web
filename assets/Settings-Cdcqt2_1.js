import{j as e,u as Y,r,d as ee,v as ae,f as te,H as se}from"./index-DVX7OMu2.js";import{a as re}from"./profile_icon-DtzFR4rr.js";import{b as ie,a as ne,T as oe,t as B}from"./timeRanges-Ca2k--fm.js";import{a as le}from"./imageResolver-BN1kI4py.js";import{A as ce}from"./AppShell-DjxYG3AR.js";import{B as de}from"./BackgroundScreen-BIyndidP.js";import{G as F}from"./GlassCard-8-LnyGIo.js";import{B as h}from"./Button-CamjhAis.js";import{E as U}from"./ErrorBox-DJPdDS2Z.js";import{u as ue}from"./useSession-BfyW6qrt.js";import"./back_page_icon-Dl_tVR_0.js";import"./exclamation_mark_icon-CRnSbbak.js";import"./question_mark_icon-PbVWcZNJ.js";import"./submit_arrow_icon-Q5dhc_J4.js";import"./background_003-D8Gsq-oN.js";import"./splash-BJ2Tu_06.js";import"./yin_yang_balance-CnjywNEt.js";function me({status:l,style:t,className:s}){const g=l==="premium";return e.jsxs("div",{className:s,style:{...ge,...g?pe:xe,...t},children:[e.jsx("span",{style:{...he,background:g?"#f0b64d":"rgba(252, 233, 199, 0.4)",boxShadow:g?"0 0 10px rgba(240, 182, 77, 0.5)":void 0}}),g?"Premium active":"Free plan"]})}const ge={display:"inline-flex",alignItems:"center",gap:8,padding:"6px 14px",borderRadius:999,border:"1px solid rgba(247, 216, 148, 0.25)",fontWeight:600,fontSize:14,background:"rgba(7, 12, 28, 0.7)",color:"rgba(252, 233, 199, 0.9)"},pe={background:"rgba(32, 25, 6, 0.82)",color:"#f5d473",border:"1px solid rgba(245, 212, 115, 0.55)",boxShadow:"0 12px 26px rgba(245, 212, 115, 0.28)"},xe={background:"rgba(15, 24, 52, 0.7)",color:"rgba(252, 233, 199, 0.85)"},he={width:8,height:8,borderRadius:"50%",display:"inline-block"};function be(l){return(Array.isArray(l==null?void 0:l.shiChen)?l.shiChen:[]).filter(s=>s&&typeof s.start=="string"&&typeof s.end=="string"&&typeof s.key=="string").map(s=>({value:s.start,label:`${s.start} - ${s.end} (${s.key} Hour)`}))}function fe(){const l=["profile_data","localProfile.v1","dev_profile_data"];for(const t of l)try{const s=localStorage.getItem(t);if(!s)continue;return JSON.parse(s)}catch(s){console.warn("Failed to parse local profile data",s)}return null}function Oe(){const l=Y(),[t]=ue(),s=!!(t!=null&&t.isPremium),g=le(s?"badges/premium.png":"badges/free_logo.png"),[c,C]=r.useState(!1),[R,v]=r.useState(null),[D,p]=r.useState(null),[j,k]=r.useState((t==null?void 0:t.name)||""),[O,_]=r.useState(""),[b,A]=r.useState(""),[f,y]=r.useState(""),[N,w]=r.useState(""),[d,Z]=r.useState(!0),[x,I]=r.useState("HK"),[M,G]=r.useState("en"),[H,T]=r.useState(""),[L,E]=r.useState(""),[o,K]=r.useState({}),u=r.useMemo(()=>ie(B),[]),$=r.useMemo(()=>ne(B),[]),q=r.useMemo(()=>be(B),[]),J=r.useMemo(()=>{const a=u.filter(n=>n.countryCode===x);return a.length?a:u},[u,x]);r.useEffect(()=>{t&&k(t.name||"")},[t]),r.useEffect(()=>{K(fe()??{})},[]),r.useEffect(()=>{if(!o)return;k(o.name||(t==null?void 0:t.name)||""),_(o.gender||"");const a=o.dob||o.dateOfBirth||"",n=o.exactTime||o.birthTime||"",i=o.timeRange==="midnight"?"night":o.timeRange,m=o.country||"HK",P=o.timeZoneId||"",z=u.find(S=>S.countryCode===m&&S.timeZoneId===P)||u.find(S=>S.timeZoneId===P);A(a),y(n||""),w(i||""),Z(!!n),I(m),G(o.language||"en"),T(P),E((z==null?void 0:z.id)||"")},[o,t,u]);const W=async()=>{var n;if(p(null),v(null),(b!==""||f!==""||N!==""||x!=="HK")&&!s){const i=parseInt(localStorage.getItem("birth_edit_quota")||"0");if(i>=1){p("Free users can only update birth details once. Please upgrade to edit.");return}localStorage.setItem("birth_edit_quota",(i+1).toString())}try{const i=await ae({name:j,dob:b||void 0,exactTime:d&&f||void 0,timeRange:d?void 0:N||void 0,country:x||void 0,timeZoneId:H||void 0});if(i.ok){t&&te({...t,name:j});const m={name:j,gender:O,dob:b,dateOfBirth:b,exactTime:d&&f||null,birthTime:d?f:"",timeRange:d?null:N||null,country:x,language:M,timeZoneId:H};localStorage.setItem("profile_data",JSON.stringify(m)),K(m),v("Profile updated successfully."),C(!1),setTimeout(()=>v(null),3e3)}else p(((n=i.error)==null?void 0:n.message)||"Failed to update profile.")}catch{p("An unexpected error occurred.")}},X=()=>{window.confirm("Are you sure you want to sign out?")&&(se(),l("/login",{replace:!0}))},Q=a=>{E(a);const n=u.find(i=>i.id===a);I((n==null?void 0:n.countryCode)??""),T((n==null?void 0:n.timeZoneId)??"")},V=a=>{I(a);const i=u.filter(m=>m.countryCode===a)[0];E((i==null?void 0:i.id)??""),T((i==null?void 0:i.timeZoneId)??"")};return e.jsxs(ce,{children:[e.jsx("style",{children:`
        .settings-screen {
          padding-bottom: 90px;
          overflow-y: auto;
          color: #fff;
        }
        .content-container {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .page-title { font-size: 24px; font-weight: 700; margin: 0 0 10px 0; }

        .settings-card {
          background: rgba(29, 35, 47, 0.6);
          border-color: rgba(70, 98, 112, 0.3);
        }
        .section-title {
          color: #F4D73E; font-size: 13px; text-transform: uppercase;
          letter-spacing: 1px; margin: 0 0 16px 0; font-weight: 700;
        }

        .avatar-row { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
        .avatar-img {
          width: 64px; height: 64px; border-radius: 50%;
          border: 2px solid #F4D73E; padding: 4px; background: rgba(0,0,0,0.3); object-fit: contain;
        }
        .user-info { display: flex; flex-direction: column; gap: 6px; }
        .user-name { font-size: 18px; font-weight: 700; }
        .status-row { display: flex; align-items: center; gap: 10px; }
        .status-badge-icon { width: 22px; height: 22px; object-fit: contain; }

        .form-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
        .label { font-size: 13px; color: rgba(255,255,255,0.7); }
        .input {
          background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; padding: 12px; color: #fff; font-size: 15px; outline: none;
          width: 100%;
        }
        .input:disabled { opacity: 0.5; cursor: not-allowed; border-color: transparent; background: rgba(255,255,255,0.05); }
        .input:focus { border-color: #F4D73E; }

        .btn-row { display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap; }
        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
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
        .switch:disabled {
          opacity: 0.5;
          cursor: not-allowed;
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
        .helper-text {
          font-size: 12px;
          opacity: 0.7;
        }
        .version-text { text-align: center; font-size: 12px; opacity: 0.4; margin-top: 20px; }
      `}),e.jsxs(de,{backgroundImage:ee,className:"settings-screen",contentClassName:"content-container",children:[e.jsx("h1",{className:"page-title",children:"Settings"}),R&&e.jsx(U,{tone:"success",message:R,onClose:()=>v(null),dismissible:!0}),D&&e.jsx(U,{tone:"error",message:D,onClose:()=>p(null),dismissible:!0}),e.jsxs(F,{className:"glass-card settings-card",children:[e.jsxs("div",{className:"avatar-row",children:[e.jsx("img",{src:re,className:"avatar-img",alt:"Avatar"}),e.jsxs("div",{className:"user-info",children:[e.jsx("div",{className:"user-name",children:(t==null?void 0:t.name)||"Fate User"}),e.jsxs("div",{className:"status-row",children:[e.jsx("img",{src:g,className:"status-badge-icon",alt:s?"Premium":"Free"}),e.jsx(me,{status:s?"premium":"free"})]})]})]}),!s&&e.jsx(h,{variant:"primary",onClick:()=>l("/upgrade"),style:{width:"100%"},children:"Upgrade to Premium"})]}),e.jsxs(F,{className:"glass-card settings-card",children:[e.jsx("div",{className:"section-title",children:"Profile Information"}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"label",children:"Display Name"}),e.jsx("input",{className:"input",value:j,onChange:a=>k(a.target.value),disabled:!c})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"label",children:"Gender"}),e.jsxs("select",{className:"input",value:O,onChange:a=>_(a.target.value),disabled:!c,children:[e.jsx("option",{value:"",children:"Prefer not to say"}),e.jsx("option",{value:"male",children:"Male"}),e.jsx("option",{value:"female",children:"Female"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"label",children:"Language"}),e.jsx("select",{className:"input",value:M,onChange:a=>G(a.target.value),disabled:!c,children:e.jsx("option",{value:"en",children:"English"})})]}),e.jsx("div",{style:{height:16}}),e.jsx("div",{className:"section-title",style:{fontSize:12,opacity:.8},children:"Birth Data"}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"label",children:"Country of Birth"}),e.jsxs("select",{className:"input",value:x,onChange:a=>V(a.target.value),disabled:!c,children:[e.jsx("option",{value:"",children:"Select country"}),$.map(a=>e.jsx("option",{value:a.code,children:a.name},a.code))]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"label",children:"City of Birth (time zone)"}),e.jsxs("select",{className:"input",value:L,onChange:a=>Q(a.target.value),disabled:!c,children:[e.jsx("option",{value:"",children:"Select city"}),J.map(a=>e.jsx("option",{value:a.id,children:a.label},a.id))]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"label",children:"Date of Birth"}),e.jsx("input",{type:"date",className:"input",value:b,onChange:a=>A(a.target.value),disabled:!c})]}),e.jsx("div",{className:"form-group",children:e.jsxs("div",{className:"toggle-row",children:[e.jsx("div",{className:"toggle-label",children:"I know my birth time"}),e.jsx("button",{type:"button",className:"switch","data-on":d,"aria-pressed":d,onClick:()=>{if(!c)return;const a=!d;Z(a),a?w(""):y("")},disabled:!c,children:e.jsx("span",{className:"switch-thumb"})})]})}),d?e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"label",children:"Birth Time Range (Chinese 2-hour)"}),e.jsxs("select",{className:"input",value:f,onChange:a=>{y(a.target.value),a.target.value&&w("")},disabled:!c,children:[e.jsx("option",{value:"",children:"Select time window"}),q.map(a=>e.jsx("option",{value:a.value,children:a.label},a.value))]})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"label",children:"Approximate Time Range"}),e.jsxs("select",{className:"input",value:N,onChange:a=>{w(a.target.value),a.target.value&&y("")},disabled:!c,children:[e.jsx("option",{value:"",children:"Select a range"}),oe.map(a=>e.jsx("option",{value:a.value,children:a.label},a.value))]}),e.jsx("div",{className:"helper-text",children:"Not sure? Use the premium Time Finder to refine your birth time."})]}),c&&e.jsx(h,{variant:"secondary",size:"sm",onClick:()=>l(s?"/timefinder":"/upgrade"),children:"Use Time Finder"})]}),c?e.jsxs("div",{className:"btn-row",children:[e.jsx(h,{variant:"primary",size:"sm",onClick:W,children:"Save Changes"}),e.jsx(h,{variant:"ghost",size:"sm",onClick:()=>{C(!1),p(null)},children:"Cancel"})]}):e.jsx(h,{variant:"secondary",size:"sm",onClick:()=>C(!0),children:"Edit Profile"})]}),e.jsxs(F,{className:"glass-card settings-card",children:[e.jsx("div",{className:"section-title",children:"System"}),e.jsx("div",{className:"btn-row",children:e.jsx(h,{variant:"danger",size:"sm",onClick:X,children:"Sign Out"})})]}),e.jsx("div",{className:"version-text",children:"v1.0.0 Beta"})]})]})}export{Oe as default};
