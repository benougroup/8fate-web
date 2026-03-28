import{j as e}from"./index-DgbupLA2.js";function a({isLocked:o,lockIcon:t,message:n="Unlock with Premium",onUpgrade:l,children:r}){return e.jsxs("div",{className:"locked-overlay",children:[e.jsx("style",{children:`
        .locked-overlay {
          position: relative;
        }

        .locked-overlay__content--locked {
          filter: blur(4px);
          pointer-events: none;
        }

        .locked-overlay__mask {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 8px;
        }

        .locked-overlay__button {
          background: #F4D73E;
          border: none;
          padding: 6px 14px;
          border-radius: 20px;
          color: #0B0C2A;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
        }

        .locked-overlay__message {
          color: #fff;
          font-size: 13px;
          opacity: 0.9;
        }
      `}),e.jsx("div",{className:o?"locked-overlay__content--locked":void 0,children:r}),o?e.jsxs("div",{className:"locked-overlay__mask",children:[e.jsx("img",{src:t,alt:"Locked",style:{width:24,marginBottom:4}}),e.jsx("span",{className:"locked-overlay__message",children:n}),l?e.jsx("button",{className:"locked-overlay__button",type:"button",onClick:l,children:"Upgrade"}):null]}):null]})}export{a as L};
