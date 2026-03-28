import{u as n,dS as o,j as e}from"./index-DSjBdigZ.js";import{A as s}from"./AppShell-BzezwaJE.js";import{b as r}from"./background_003-D8Gsq-oN.js";import{i as l}from"./back_page_icon-Dl_tVR_0.js";import{B as d}from"./BackgroundScreen-gMdBNuyU.js";import{D as c}from"./DetailHeader-C6Hva3tO.js";import{G as h}from"./GlassCard-BIWQEGRy.js";import"./profile_icon-DtzFR4rr.js";const p={career:{title:"Career Reading",body:"This section reveals your career potential and strengths using ancient Chinese Metaphysics. It helps identify ideal professions, areas for growth, and talents you can develop in your work life."},family:{title:"Family Reading",body:"This section provides insights into your relationship with family members. It reflects emotional dynamics, support systems, and challenges within your family based on your chart."},love:{title:"Love Reading",body:"The Love Reading analyzes your romantic destiny—your emotional needs, ideal partner traits, and relationship patterns. It can also show compatibility and areas to grow in love."},talent:{title:"Talent Reading",body:"Your natural gifts and creative potential are revealed here. This section explores skills, personal strengths, and talents that help you stand out or find your life calling."},wealth:{title:"Wealth Reading",body:"This reading helps you understand your wealth potential, earning capacity, and attitude toward money. It can show how to grow prosperity through work, timing, and alignment with your element."},health:{title:"Health Reading",body:"Your chart offers clues about your physical constitution and energetic balance. Understanding your elemental weaknesses helps you proactively maintain vitality and balance."}};function v(){const a=n(),{category:i}=o(),t=p[i||""]||{title:"Insight",body:"Content unavailable."};return e.jsxs(s,{children:[e.jsx("style",{children:`
        .insight-screen {
          padding: 20px 20px 100px;
          color: #fff;
        }
        .insight-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .insight-card {
          padding: 24px;
          min-height: 200px;
        }
        .body-text {
          font-size: 16px;
          line-height: 1.6;
          opacity: 0.9;
          white-space: pre-wrap;
        }
      `}),e.jsxs(d,{backgroundImage:r,className:"insight-screen",contentClassName:"insight-content",children:[e.jsx(c,{title:t.title,backIcon:l,onBack:()=>a(-1)}),e.jsx(h,{className:"glass-card insight-card",children:e.jsx("p",{className:"body-text",children:t.body})})]})]})}export{v as default};
