import{j as e}from"./index-NX-uqBNe.js";function d({backgroundImage:n,alt:o="Background",className:i="",contentClassName:r,children:s}){const c=["background-screen",i].filter(Boolean).join(" "),t=["background-screen__content",r].filter(Boolean).join(" ");return e.jsxs("div",{className:c,children:[e.jsx("style",{children:`
        .background-screen {
          position: relative;
          min-height: 100vh;
          width: 100%;
          background-color: #0B0C2A;
          overflow: hidden;
        }

        .background-screen__image {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
        }

        .background-screen__content {
          position: relative;
          z-index: 1;
        }
      `}),e.jsx("img",{className:"background-screen__image",src:n,alt:o}),e.jsx("div",{className:t,children:s})]})}export{d as B};
