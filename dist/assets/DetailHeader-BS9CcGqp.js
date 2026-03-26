import{j as e}from"./index-DQfzOgci.js";function l({title:a,onBack:i,backIcon:t}){return e.jsxs("div",{className:"detail-header",children:[e.jsx("style",{children:`
        .detail-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
        }

        .detail-header__icon {
          width: 24px;
          height: 24px;
          cursor: pointer;
          filter: brightness(0) invert(1);
        }

        .detail-header__title {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
        }
      `}),t&&i?e.jsx("img",{className:"detail-header__icon",src:t,onClick:i,alt:"Back"}):null,e.jsx("span",{className:"detail-header__title",children:a})]})}export{l as D};
