import{r as a,j as e,G as k}from"./index-DuHMNxAT.js";import{b as N}from"./background_003-D8Gsq-oN.js";import{i as D}from"./submit_arrow_icon-Q5dhc_J4.js";import{u as S}from"./useSession-PPGubcbG.js";import{u as z}from"./useLocalCache-CN-WCVts.js";import{A as C}from"./AppShell-B5MlbV0k.js";import"./profile_icon-DtzFR4rr.js";function B(){const[h]=S(),{userKey:c,isPremium:l}=h||{},f=a.useMemo(()=>c?`chat.history.${c}.v1`:"chat.history.anon.v1",[c]),[r,o]=z(f,[]),[d,p]=a.useState(""),[n,b]=a.useState(!1),i=a.useRef(null);a.useEffect(()=>{i.current&&(i.current.scrollTop=i.current.scrollHeight)},[r,n]);async function y(t){var m;t&&t.preventDefault();const g=d.trim();if(!g||n)return;b(!0);const v={id:crypto.randomUUID(),role:"user",content:g,ts:Date.now()};o([...r||[],v]),p("");try{const s=await k({question:g});if(s.ok&&s.data){const u={id:crypto.randomUUID(),role:"assistant",content:s.data.answer,ts:Date.now()};o(x=>[...x||[],u])}else throw new Error(((m=s.error)==null?void 0:m.message)||"Failed to get response")}catch(s){const u={id:crypto.randomUUID(),role:"system",content:`Error: ${s.message||"Something went wrong."}`,ts:Date.now()};o(x=>[...x||[],u])}finally{b(!1)}}const w=()=>{window.confirm("Clear chat history?")&&o([])},j=["What is my lucky element today?","How is my wealth luck this month?","Tell me about my Day Master.","Am I compatible with a Rooster?"];return e.jsxs(C,{hideNav:!1,children:[" ",e.jsx("style",{children:`
        .chat-screen {
          height: calc(100vh - 90px); /* Minus bottom nav */
          display: flex;
          flex-direction: column;
          position: relative;
          background-color: #0B0C2A;
        }
        .chat-bg {
          position: fixed; inset: 0; width: 100%; height: 100%;
          object-fit: cover; z-index: 0; pointer-events: none;
        }
        .chat-header {
          position: relative; z-index: 10;
          display: flex; justify-content: space-between; align-items: center;
          padding: 16px 20px;
          background: rgba(11, 12, 42, 0.85);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .header-title { color: #fff; font-weight: 700; font-size: 16px; }
        .header-badge {
          font-size: 10px; padding: 2px 6px; border-radius: 4px;
          margin-left: 8px; text-transform: uppercase; letter-spacing: 0.5px;
          background: ${l?"#F4D73E":"rgba(255,255,255,0.2)"};
          color: ${l?"#000":"#fff"};
        }

        .chat-list {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: relative;
          z-index: 1;
        }

        .msg-row { display: flex; width: 100%; }
        .msg-row.user { justify-content: flex-end; }
        .msg-row.assistant { justify-content: flex-start; }
        .msg-row.system { justify-content: center; }

        .msg-bubble {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 15px;
          line-height: 1.5;
          position: relative;
        }
        .msg-bubble.user {
          background: linear-gradient(135deg, #F4D73E 0%, #c7a006 100%);
          color: #0B0C2A;
          border-bottom-right-radius: 4px;
          box-shadow: 0 4px 12px rgba(244, 215, 62, 0.2);
        }
        .msg-bubble.assistant {
          background: rgba(29, 35, 47, 0.85);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          border-bottom-left-radius: 4px;
          backdrop-filter: blur(4px);
        }
        .msg-bubble.system {
          background: rgba(255, 107, 107, 0.2);
          border: 1px solid rgba(255, 107, 107, 0.4);
          color: #ffcdd2;
          font-size: 13px;
          padding: 8px 12px;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          opacity: 0.9;
          padding-bottom: 60px;
        }
        .suggestion-chip {
          background: rgba(29, 35, 47, 0.8);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 12px 20px;
          border-radius: 12px;
          color: #fce9c7;
          font-size: 14px;
          margin-top: 10px;
          cursor: pointer;
          width: 100%;
          max-width: 300px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .suggestion-chip:active {
          background: rgba(244, 215, 62, 0.15);
          border-color: #F4D73E;
          transform: scale(0.98);
        }

        .input-area {
          position: relative; z-index: 10;
          padding: 12px 16px;
          background: rgba(11, 12, 42, 0.95);
          border-top: 1px solid rgba(255,255,255,0.1);
          display: flex; gap: 10px; align-items: center;
        }
        .chat-input {
          flex: 1;
          height: 44px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          padding: 0 16px;
          color: #fff;
          font-size: 15px;
          outline: none;
        }
        .chat-input:focus { border-color: #F4D73E; background: rgba(255,255,255,0.12); }

        .send-btn {
          width: 44px; height: 44px;
          border-radius: 50%;
          border: none;
          background: #F4D73E;
          display: grid; place-items: center;
          cursor: pointer;
          transition: transform 0.1s;
        }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; background: #555; }
        .send-icon { width: 20px; height: 20px; object-fit: contain; }
      `}),e.jsx("img",{src:N,className:"chat-bg",alt:"bg"}),e.jsxs("div",{className:"chat-screen",children:[e.jsxs("div",{className:"chat-header",children:[e.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[e.jsx("span",{className:"header-title",children:"Fate Assistant"}),e.jsx("span",{className:"header-badge",children:l?"Advanced":"Basic"})]}),e.jsx("button",{onClick:w,style:{background:"transparent",border:"none",color:"rgba(255,255,255,0.5)",fontSize:12},children:"Clear"})]}),e.jsxs("div",{className:"chat-list",ref:i,children:[!r||r.length===0?e.jsxs("div",{className:"empty-state",children:[e.jsx("p",{style:{marginBottom:20,fontSize:14},children:"Ask me anything about your destiny..."}),j.map(t=>e.jsx("div",{className:"suggestion-chip",onClick:()=>p(t),children:t},t))]}):r.map(t=>e.jsx("div",{className:`msg-row ${t.role}`,children:e.jsx("div",{className:`msg-bubble ${t.role}`,children:t.content})},t.id)),n&&e.jsx("div",{className:"msg-row assistant",children:e.jsx("div",{className:"msg-bubble assistant",style:{fontStyle:"italic",opacity:.7},children:"Consulting the stars..."})})]}),e.jsxs("form",{className:"input-area",onSubmit:y,children:[e.jsx("input",{className:"chat-input",placeholder:"Type your question...",value:d,onChange:t=>p(t.target.value)}),e.jsx("button",{type:"submit",className:"send-btn",disabled:!d.trim()||n,children:e.jsx("img",{src:D,className:"send-icon",alt:"Send"})})]})]})]})}export{B as default};
