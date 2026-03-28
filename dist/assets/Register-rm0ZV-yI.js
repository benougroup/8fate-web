import{u as n,h as o,j as e,d as c,w as l}from"./index-BchX0uLO.js";import{A as d}from"./AppShell-B8HgIzxe.js";import{B as m}from"./BackgroundScreen-BmvMI8qu.js";import{B as g}from"./Button-Do3Ls8Si.js";import"./profile_icon-DtzFR4rr.js";function b(){const a=n(),t=o(),i=(t==null?void 0:t.name)||"Traveler",r="Test_email@gmail.com",s=()=>{a("/terms",{state:{mode:"accept"}})};return e.jsxs(d,{hideNav:!0,children:[e.jsx("style",{children:`
        .reg-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          text-align: center;
          color: #fff;
        }
        .reg-content {
          max-width: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          animation: fadeIn 0.8s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .icon-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(244, 215, 62, 0.2) 0%, rgba(0,0,0,0) 70%);
          border: 1px solid rgba(244, 215, 62, 0.4);
          display: grid;
          place-items: center;
          margin-bottom: 8px;
          box-shadow: 0 0 30px rgba(244, 215, 62, 0.15);
        }
        .main-icon {
          width: 40px;
          height: 40px;
          object-fit: contain;
        }

        .title {
          font-size: 28px;
          font-weight: 700;
          color: #F4D73E;
          margin: 0;
          letter-spacing: 0.5px;
        }
        .subtitle {
          font-size: 16px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }
        .email-tag {
          background: rgba(255,255,255,0.1);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          margin-top: -12px;
        }
      `}),e.jsx(m,{backgroundImage:c,contentClassName:"reg-screen",children:e.jsxs("div",{className:"reg-content",children:[e.jsx("div",{className:"icon-circle",children:e.jsx("img",{src:l,className:"main-icon",alt:"Start"})}),e.jsxs("div",{children:[e.jsxs("h1",{className:"title",children:["Welcome, ",i]}),e.jsx("div",{style:{height:12}}),e.jsx("div",{className:"email-tag",children:r}),e.jsx("div",{style:{height:12}}),e.jsx("p",{className:"subtitle",children:"Your account has been successfully created."}),e.jsx("p",{className:"subtitle",style:{fontSize:14,opacity:.6,marginTop:8},children:"To reveal your destiny chart and lucky elements, we need to map your birth details."})]}),e.jsx(g,{variant:"primary",size:"lg",onClick:s,style:{width:"100%",marginTop:16},children:"Begin Your Journey"})]})})]})}export{b as default};
