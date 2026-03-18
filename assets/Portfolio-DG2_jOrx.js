import{r as g,j as e,u as D,x as F,h as $,F as B}from"./index-BNUZTk9v.js";import{b as K}from"./background_003-D8Gsq-oN.js";import{r as h,a as P}from"./imageResolver-BJSrD6G7.js";import{A as E,B as O}from"./AppShell-BgfN2k82.js";import{P as M}from"./Popup-BhRaSdR3.js";import{I as y}from"./InfoTrigger-CP5Z7NkU.js";import"./back_page_icon-Dl_tVR_0.js";import"./exclamation_mark_icon-CRnSbbak.js";import"./profile_icon-DtzFR4rr.js";import"./question_mark_icon-PbVWcZNJ.js";import"./submit_arrow_icon-Q5dhc_J4.js";import"./splash-BJ2Tu_06.js";import"./yin_yang_balance-CnjywNEt.js";import"./Button-DV455LN_.js";function U({count:r,scrollRef:t,className:l,style:m}){const[x,a]=g.useState(0);return g.useEffect(()=>{const i=t.current;if(!i||r<=1)return;const s=()=>{const o=i.scrollWidth-i.clientWidth;if(o<=0){a(0);return}const d=i.scrollLeft/o,p=Math.round(d*(r-1));a(Math.max(0,Math.min(r-1,p)))};return s(),i.addEventListener("scroll",s,{passive:!0}),window.addEventListener("resize",s),()=>{i.removeEventListener("scroll",s),window.removeEventListener("resize",s)}},[r,t]),r<=1?null:e.jsxs("div",{className:l,style:{...H,...m},children:[e.jsx("div",{style:Z}),e.jsx("div",{style:q,children:Array.from({length:r},(i,s)=>e.jsx("span",{style:{...G,...s===x?Q:V}},s))})]})}const H={position:"relative",width:"100%",height:16,display:"flex",alignItems:"center",justifyContent:"center",marginTop:6},Z={position:"absolute",left:0,right:0,height:4,borderRadius:999,background:"rgba(255, 255, 255, 0.15)"},q={display:"flex",alignItems:"center",gap:6,padding:"0 6px",zIndex:1},G={width:6,height:6,borderRadius:"50%",transition:"background 0.2s ease"},Q={background:"rgba(255, 255, 255, 0.85)"},V={background:"rgba(255, 255, 255, 0.35)"},J={"Direct Officer":"Represents discipline, authority, and conventional success. You value order, rules, and steady progress in your career.","Seven Killings":"Represents bold action, risk-taking, and decisive leadership. You are dynamic and thrive in competitive environments.","Direct Wealth":"Represents hard-earned income, diligence, and financial stability. You value steady work and responsible resource management.","Indirect Wealth":"Represents entrepreneurial luck, investments, and windfalls. You have a knack for spotting opportunities others miss.","Direct Resource":"Represents conventional knowledge, nurturing, and health. You are likely introspective and value education and comfort.","Indirect Resource":"Represents intuition, unconventional wisdom, and unique talents. You are observant and may have metaphysical interests.",Friend:"Represents peers, equality, and self-confidence. You value networking and have a strong sense of self.","Rob Wealth":"Represents competitive spirit, social charisma, but potential wealth leakage. You are a natural networker but must manage spending.","Eating God":"Represents creativity, strategy, and enjoyment of life. You are artistic, expressive, and prefer a refined lifestyle.","Hurting Officer":"Represents flamboyance, verbal skill, and rebellion. You are a performer at heart and challenge the status quo."},X=["Friend","Rob Wealth","Eating God","Hurting Officer","Direct Wealth","Indirect Wealth","Direct Officer","Seven Killings","Direct Resource","Indirect Resource"],R=["positive","neutral","negative","positive","neutral","negative","positive","neutral","negative","positive"],w=["Wood","Fire","Earth","Metal","Water"],I=[1,2,3,4,5,6,7,8,9],L=["This decade emphasizes deliberate growth and strategic choices","A transitional cycle invites you to recalibrate priorities","Momentum builds steadily when you honor consistent routines","Expect a phase of experimentation paired with careful planning","A stabilizing decade rewards patience and grounded decisions"],T=["Channel the dominant element to guide your daily focus","Lean into mentorship and structured learning opportunities","Balance expansion with rest to avoid energetic burnout","Refine your networks and keep communication intentional","Stay adaptable as circumstances shift through the years"],A=["Overall, this cycle favors steady progress over quick wins.","Overall, measured risk will unlock the best outcomes.","Overall, grounding practices will keep you aligned.","Overall, thoughtful pacing will sustain your success.","Overall, clarity and patience will be your strongest allies."],_=[{label:"Career",description:"Work momentum and leadership outlook."},{label:"Wealth",description:"Cash flow, savings, and investments."},{label:"Health",description:"Energy balance and vitality."},{label:"Talent",description:"Learning, creativity, and growth."},{label:"Love",description:"Relationships and emotional harmony."},{label:"Family",description:"Support systems and home life."}],ee={Career:["Progress feels strongest when you embrace {element}-style leadership. Build credibility through consistent delivery.","This cycle rewards long-term planning. Focus on skill depth and sustainable routines in the {years} window.","Expect opportunities to expand scope. Keep milestones visible to turn momentum into promotions."],Wealth:["Budgeting discipline pays off. Favor {element}-aligned investments and reduce impulse spending.","Income grows through steady streams rather than windfalls. Reinforce savings during {years}.","Diversify cautiously and track expenses weekly to protect your gains."],Health:["Energy improves with structured habits. Prioritize recovery and balance throughout {years}.","Stay mindful of stress signals. Gentle movement and hydration support {element} harmony.","Focus on consistency over intensity to keep vitality strong."],Talent:["Creative breakthroughs arrive after steady practice. Let {element} inspire your learning path.","Sharpen one signature skill and showcase it regularly during {years}.","Seek mentors who help refine technique and confidence."],Love:["Relationships deepen with clear communication. Offer stability and patience this cycle.","Set healthy boundaries early to keep emotional flow balanced in {years}.","Small gestures and shared routines strengthen connection."],Family:["Home life thrives when you create predictable rhythms. Make space for rest and reunion.","Support systems feel stronger when you check in consistently through {years}.","Lean on shared traditions to keep harmony centered."]};function z(r){return r.toLowerCase().trim().replace(/[_\s]+/g," ")}function te(r){const t=z(r);return t.includes("wood")?"wood":t.includes("fire")?"fire":t.includes("earth")?"earth":t.includes("metal")?"metal":t.includes("water")?"water":"fire"}function ie(r){const t=z(r);return P(`elements/${t==="metal"?"gold":t}.png`)}function se(r){const t=z(r),l=t.includes("yin")?"yin":t.includes("yang")?"yang":"",m=te(t);return l?h("daymaster",`${l} ${m}`):P("ui/icon_help.png")}function S(r){const t=r.toLowerCase();return t.includes("yin")?"yin":(t.includes("yang"),"yang")}function ne(r,t){const l=r.core_traits,m=r.elemental_balance_chart||{},x=r.luck_cycles??[],a=r.ten_stars??[];return{userName:(t==null?void 0:t.name)||"User",isPremium:!!(t!=null&&t.isPremium),coreTraits:{zodiac:(l==null?void 0:l.zodiac_sign)||"—",westernZodiac:(l==null?void 0:l.horoscope)||"—",dayMaster:(l==null?void 0:l.day_master)||"—",yinYang:S((l==null?void 0:l.day_master)||"")},fiveElements:{wood:m.Wood??0,fire:m.Fire??0,earth:m.Earth??0,metal:m.Metal??0,water:m.Water??0},fourPillars:r.four_pillars??{year:"—",month:"—",day:"—",hour:"—"},luckCycles:x.map(i=>{const s=(i==null?void 0:i.topics)||{},[o,d]=Object.entries(s)[0]||[];return{period:(i==null?void 0:i.title)||`${(i==null?void 0:i.start)??""} ${(i==null?void 0:i.end)??""}`.trim(),element:o,summary:d,stats:(i==null?void 0:i.stats)??[]}}),tenStars:a.map(i=>({name:(i==null?void 0:i.name)||"Star",position:(i==null?void 0:i.position)||(i==null?void 0:i.strength),polarity:i!=null&&i.influence?"neutral":void 0}))}}function re(r,t=30){const m=new Date().getFullYear()-t;return Array.from({length:10},(a,i)=>{const s=i*10,o=s+9,d=m+s,p=m+o,u=t>=s&&t<=o,v=u?9:I[i%I.length],j=u?"Fire":w[(i+1)%w.length],k=L[i%L.length],N=T[(i+2)%T.length],n=A[(i+3)%A.length],c=`${k}. ${N}. ${n}`,b=`${d}–${p}`;return{id:`${s}-${o}`,startAge:s,endAge:o,startYear:d,endYear:p,element:w[i%w.length],macroLuckNumber:v,macroLuckElement:j,isCurrent:u,summary:c,topics:Object.fromEntries(_.map((f,Y)=>{const C=ee[f.label]||[],W=C[(i+Y)%C.length]||f.description;return[f.label,W.replace("{element}",j).replace("{years}",b)]}))}}).map((a,i)=>{var u;const s=r[i],o=(u=s==null?void 0:s.summary)==null?void 0:u.trim(),d=a.summary.split(". ").filter(Boolean),p=o&&o.length>0?`${o.endsWith(".")?o.slice(0,-1):o}. ${d.slice(1).join(". ")}`:a.summary;return{...a,element:(s==null?void 0:s.element)||a.element,summary:p}})}const ae=({data:r})=>{const x=["wood","fire","earth","metal","water"],a=x.map((i,s)=>{const o=r[i]||0,d=Math.min(o,100)/100*80,p=Math.PI/2+s*2*Math.PI/5;return`${110+d*Math.cos(p)},${110-d*Math.sin(p)}`}).join(" ");return e.jsx("div",{style:{position:"relative",width:220,height:220,margin:"0 auto"},children:e.jsxs("svg",{width:220,height:220,children:[[1,.75,.5,.25].map((i,s)=>e.jsx("polygon",{points:x.map((o,d)=>{const p=80*i,u=Math.PI/2+d*2*Math.PI/5;return`${110+p*Math.cos(u)},${110-p*Math.sin(u)}`}).join(" "),fill:"none",stroke:"rgba(255,255,255,0.1)",strokeWidth:"1"},s)),x.map((i,s)=>{const o=Math.PI/2+s*2*Math.PI/5;return e.jsx("line",{x1:110,y1:110,x2:110+80*Math.cos(o),y2:110-80*Math.sin(o),stroke:"rgba(255,255,255,0.1)",strokeWidth:"1"},s)}),e.jsx("polygon",{points:a,fill:"rgba(244, 215, 62, 0.4)",stroke:"#F4D73E",strokeWidth:"2"}),x.map((i,s)=>{const o=Math.PI/2+s*2*Math.PI/5,d=105,p=110+d*Math.cos(o),u=110-d*Math.sin(o),v=ie(i);return e.jsxs("g",{children:[e.jsx("image",{href:v,x:p-10,y:u-15,height:"20",width:"20"}),e.jsx("text",{x:p,y:u+12,fill:"#fff",fontSize:"10",textAnchor:"middle",style:{textTransform:"capitalize",fontWeight:"bold"},children:i})]},s)})]})})};function je(){const r=D(),[t,l]=g.useState(null),[m,x]=g.useState(!0),[a,i]=g.useState(null),[s,o]=g.useState(null),[d,p]=g.useState("Career"),u=g.useRef(null),v=g.useMemo(()=>({Career:h("destiny icons","career"),Health:h("destiny icons","health"),Wealth:h("destiny icons","wealth"),Love:h("destiny icons","love"),Talent:h("destiny icons","talent"),Family:h("destiny icons","family")}),[]),j=g.useMemo(()=>({Career:"career",Wealth:"wealth",Love:"love",Talent:"talent",Family:"family"}),[]);g.useEffect(()=>{async function n(){try{const c=$(),b=await B();b.ok&&b.data&&l(ne(b.data,c))}catch(c){console.error("Portfolio error",c)}finally{x(!1)}}n()},[]),g.useEffect(()=>{a&&p("Career")},[a==null?void 0:a.id]);const k=g.useMemo(()=>re((t==null?void 0:t.luckCycles)??[],30),[t==null?void 0:t.luckCycles]),N=g.useMemo(()=>{const n=new Map(((t==null?void 0:t.tenStars)??[]).map(c=>[c.name,c]));return X.map((c,b)=>{const f=n.get(c);return{name:c,position:f==null?void 0:f.position,polarity:(f==null?void 0:f.polarity)??R[b%R.length],description:J[c]||"A powerful force in your chart influencing your destiny."}})},[t==null?void 0:t.tenStars]);return m?e.jsx(E,{hideNav:!0,children:e.jsx("div",{style:{background:"#0B0C2A",height:"100vh",width:"100vw"}})}):e.jsxs(E,{style:{background:"#0B0C2A",color:"#fff"},children:[e.jsxs("div",{className:"portfolio-screen",children:[e.jsx("style",{children:`
          .portfolio-screen {
            min-height: 100vh;
            width: 100%;
            position: relative;
            background-color: #0B0C2A;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            padding-bottom: 90px;
            overflow-y: auto;
            color: #fff;
          }
          .port-bg {
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
            gap: 24px;
          }
          .glass-box {
            background: rgba(29, 35, 47, 0.6);
            border: 1px solid rgba(70, 98, 112, 0.3);
            border-radius: 16px;
            padding: 20px;
            backdrop-filter: blur(12px);
          }
          .section-title {
            color: #F4D73E;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 0 0 16px 0;
            font-weight: 700;
            text-align: center;
          }
          .traits-row {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: flex-start;
            gap: 16px;
          }
          .trait-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            width: 45%;
          }
          .trait-item.clickable {
            cursor: pointer;
            transition: transform 0.2s ease;
          }
          .trait-item.clickable:active {
            transform: translateY(1px);
          }
          .trait-icon-container {
            width: 54px;
            height: 54px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid #F4D73E;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }
          .trait-img {
            width: 70%;
            height: 70%;
            object-fit: contain;
            filter: drop-shadow(0 0 2px rgba(244, 215, 62, 0.5));
          }
          .trait-label {
            font-size: 11px;
            opacity: 0.6;
            text-transform: uppercase;
            margin-top: 4px;
            text-align: center;
          }
          .trait-value {
            font-size: 13px;
            font-weight: 700;
            color: #fff;
            text-align: center;
            line-height: 1.2;
            text-transform: capitalize;
          }

          .pillars-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            text-align: center;
          }
          .pillar-col {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            padding: 10px 4px;
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          .pillar-head {
            color: #F4D73E;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
          }
          .pillar-val {
            font-size: 13px;
            font-weight: 600;
          }

          .destiny-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
          }
          .destiny-item {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 12px;
            padding: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            cursor: pointer;
          }
          .destiny-icon {
            width: 32px;
            height: 32px;
            object-fit: contain;
          }
          .destiny-label {
            font-size: 11px;
            font-weight: 500;
          }

          .stars-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .star-item {
            background: rgba(29, 35, 47, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 12px;
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            transition: background 0.2s;
          }
          .star-item:active {
            background: rgba(244, 215, 62, 0.1);
          }
          .star-icon {
            width: 32px;
            height: 32px;
            object-fit: contain;
          }
          .star-name {
            font-size: 13px;
            font-weight: 600;
          }
          .star-tone {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            border: 1px solid rgba(255,255,255,0.4);
          }
          .star-tone.positive { background: #4cd964; }
          .star-tone.neutral { background: #f4d73e; }
          .star-tone.negative { background: #ff6b6b; }

          .luck-scroll {
            display: flex;
            gap: 12px;
            overflow-x: auto;
            padding-bottom: 12px;
            scrollbar-width: none;
          }
          .luck-scroll::-webkit-scrollbar {
            display: none;
          }
          .luck-card {
            min-width: 90px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            flex-shrink: 0;
            cursor: pointer;
          }
          .luck-card.current {
            border-color: #F4D73E;
            background: rgba(244, 215, 62, 0.1);
            box-shadow: 0 0 10px rgba(244, 215, 62, 0.15);
          }
          .luck-age {
            font-size: 12px;
            opacity: 0.7;
          }
          .luck-period {
            font-size: 10px;
            color: #F4D73E;
          }
          .luck-elem {
            font-weight: 600;
            font-size: 13px;
            margin: 4px 0;
          }
          .luck-years {
            font-size: 10px;
            opacity: 0.7;
          }

          .locked-overlay {
            position: absolute;
            inset: 0;
            background: rgba(11, 12, 42, 0.6);
            backdrop-filter: blur(3px);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-radius: 16px;
            z-index: 10;
          }
          .lock-btn {
            background: #F4D73E;
            border: none;
            padding: 6px 14px;
            border-radius: 20px;
            color: #0B0C2A;
            font-weight: 700;
            font-size: 12px;
            margin-top: 8px;
            cursor: pointer;
          }
        `}),e.jsx("img",{src:K,className:"port-bg",alt:"bg"}),e.jsxs("div",{className:"content-container",children:[e.jsxs("div",{style:{textAlign:"left"},children:[e.jsx("h1",{style:{fontSize:"24px",margin:0,color:"#fff"},children:t==null?void 0:t.userName}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("span",{style:{fontSize:"13px",opacity:.7},children:"Metaphysical Portfolio"}),(t==null?void 0:t.isPremium)&&e.jsx("span",{style:{background:"#F4D73E",color:"#000",fontSize:"10px",padding:"2px 6px",borderRadius:"4px",fontWeight:"bold"},children:"PRO"})]})]}),e.jsx("div",{className:"glass-box",children:e.jsxs("div",{className:"traits-row",children:[e.jsxs("div",{className:"trait-item clickable",onClick:()=>{t!=null&&t.coreTraits.zodiac&&localStorage.setItem("last_zodiac_sign",t.coreTraits.zodiac);const n=t!=null&&t.coreTraits.zodiac?`?sign=${encodeURIComponent(t.coreTraits.zodiac)}`:"";r(`/zodiac-detail${n}`)},role:"button",tabIndex:0,children:[e.jsx("div",{className:"trait-icon-container",children:e.jsx("img",{src:h("zodiac",(t==null?void 0:t.coreTraits.zodiac)||""),alt:"Zodiac",className:"trait-img"})}),e.jsx("span",{className:"trait-value",children:t==null?void 0:t.coreTraits.zodiac}),e.jsxs("span",{className:"trait-label",children:["Zodiac",e.jsx(y,{defKey:"zodiac"})]})]}),e.jsxs("div",{className:"trait-item",children:[e.jsx("div",{className:"trait-icon-container",children:e.jsx("img",{src:h("western_zodiac",(t==null?void 0:t.coreTraits.westernZodiac)||""),className:"trait-img",alt:"Western Zodiac"})}),e.jsx("span",{className:"trait-value",children:t==null?void 0:t.coreTraits.westernZodiac}),e.jsx("span",{className:"trait-label",children:"Western Zodiac"})]}),e.jsxs("div",{className:"trait-item clickable",onClick:()=>r("/day-master-detail"),role:"button",tabIndex:0,children:[e.jsx("div",{className:"trait-icon-container",children:e.jsx("img",{src:se((t==null?void 0:t.coreTraits.dayMaster)||""),className:"trait-img",alt:"Day Master"})}),e.jsx("span",{className:"trait-value",children:t==null?void 0:t.coreTraits.dayMaster}),e.jsxs("span",{className:"trait-label",children:["Day Master",e.jsx(y,{defKey:"dayMaster"})]})]}),e.jsxs("div",{className:"trait-item clickable",onClick:()=>{const n=S((t==null?void 0:t.coreTraits.yinYang)||""),c=n?`?key=${encodeURIComponent(n)}`:"";r(`/yin-yang-detail${c}`)},role:"button",tabIndex:0,children:[e.jsx("div",{className:"trait-icon-container",children:e.jsx("img",{src:h("yin_yang",S((t==null?void 0:t.coreTraits.yinYang)||"")),className:"trait-img",alt:"Balance"})}),e.jsx("span",{className:"trait-value",children:t==null?void 0:t.coreTraits.yinYang}),e.jsxs("span",{className:"trait-label",children:["Balance",e.jsx(y,{defKey:"yinYang"})]})]})]})}),e.jsxs("div",{className:"glass-box",children:[e.jsxs("div",{className:"section-title",children:["Elemental Balance",e.jsx(y,{defKey:"elements"})]}),(t==null?void 0:t.fiveElements)&&e.jsx(ae,{data:t.fiveElements})]}),e.jsxs("div",{className:"glass-box",children:[e.jsx("div",{className:"section-title",children:"Four Pillars (BaZi)"}),e.jsxs("div",{className:"pillars-grid",children:[e.jsxs("div",{className:"pillar-col",children:[e.jsxs("span",{className:"pillar-head",children:["Year",e.jsx(y,{defKey:"yearPillar"})]}),e.jsx("span",{className:"pillar-val",children:t==null?void 0:t.fourPillars.year})]}),e.jsxs("div",{className:"pillar-col",children:[e.jsxs("span",{className:"pillar-head",children:["Month",e.jsx(y,{defKey:"monthPillar"})]}),e.jsx("span",{className:"pillar-val",children:t==null?void 0:t.fourPillars.month})]}),e.jsxs("div",{className:"pillar-col",children:[e.jsxs("span",{className:"pillar-head",children:["Day",e.jsx(y,{defKey:"dayPillar"})]}),e.jsx("span",{className:"pillar-val",children:t==null?void 0:t.fourPillars.day})]}),e.jsxs("div",{className:"pillar-col",children:[e.jsxs("span",{className:"pillar-head",children:["Hour",e.jsx(y,{defKey:"hourPillar"})]}),e.jsx("span",{className:"pillar-val",children:t==null?void 0:t.fourPillars.hour})]})]})]}),e.jsxs("div",{className:"glass-box",children:[e.jsx("div",{className:"section-title",children:"Destiny Insights"}),e.jsx("div",{className:"destiny-grid",children:Object.entries(v).map(([n,c])=>e.jsxs("div",{className:"destiny-item",onClick:()=>r(`/insight/${n.toLowerCase()}`),children:[e.jsx("img",{src:c,alt:n,className:"destiny-icon"}),e.jsxs("span",{className:"destiny-label",children:[n,j[n]&&e.jsx(y,{defKey:j[n]})]})]},n))})]}),e.jsxs("div",{className:"glass-box",children:[e.jsx("div",{className:"section-title",children:"10-Year Luck Cycles"}),e.jsx("div",{className:"luck-scroll",ref:u,children:k.map(n=>e.jsxs("button",{type:"button",className:`luck-card ${n.isCurrent?"current":""}`,onClick:()=>{i(n),p("Career")},children:[e.jsxs("span",{className:"luck-age",children:["Age ",n.startAge,"-",n.endAge]}),e.jsx("span",{className:"luck-elem",children:n.element}),e.jsxs("span",{className:"luck-period",children:[n.startYear,"–",n.endYear]}),e.jsx("span",{className:"luck-years",children:"10-year cycle"})]},n.id))}),e.jsx(U,{count:k.length,scrollRef:u}),!(t!=null&&t.isPremium)&&e.jsxs("div",{className:"locked-overlay",children:[e.jsx("img",{src:F,alt:"Locked",style:{width:24,marginBottom:8}}),e.jsx("span",{style:{fontSize:13,fontWeight:600},children:"Unlock Future Cycles"}),e.jsx("button",{className:"lock-btn",onClick:()=>r("/membership"),children:"Upgrade"})]})]}),e.jsxs("div",{className:"glass-box",children:[e.jsxs("div",{className:"section-title",children:["Ten Stars (Gods)",e.jsx(y,{defKey:"tenStars"})]}),e.jsx("div",{className:"stars-grid",children:N.map((n,c)=>e.jsxs("div",{className:"star-item",onClick:()=>o({name:n.name,description:n.description}),children:[e.jsx("img",{src:h("ten_stars",n.name),onError:b=>{b.currentTarget.style.display="none"},alt:n.name,className:"star-icon"}),e.jsx("span",{className:"star-name",children:n.name}),e.jsx("span",{className:`star-tone ${n.polarity||"neutral"}`,title:n.polarity||"neutral"})]},c))})]})]})]}),e.jsx(M,{open:!!a,title:a?`Age ${a.startAge}-${a.endAge} Luck Cycle`:"Luck Cycle",message:a?e.jsxs("div",{style:{display:"grid",gap:16,textAlign:"left"},children:[e.jsxs("div",{style:{display:"grid",gap:10},children:[e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, minmax(0, 1fr))",gap:10},children:[e.jsxs("div",{style:{display:"grid",gap:6},children:[e.jsx("div",{style:{fontSize:12,opacity:.7},children:"Age"}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"},children:[e.jsxs("span",{style:{fontSize:16,fontWeight:700},children:[a.startAge,"-",a.endAge]}),a.isCurrent&&e.jsx("span",{style:{fontSize:10,padding:"2px 6px",borderRadius:999,background:"rgba(244, 215, 62, 0.2)",color:"#F4D73E",border:"1px solid rgba(244, 215, 62, 0.4)",fontWeight:700,textTransform:"uppercase"},children:"Current"})]})]}),e.jsxs("div",{style:{display:"grid",gap:6},children:[e.jsx("div",{style:{fontSize:12,opacity:.7},children:"Years"}),e.jsxs("div",{style:{fontSize:15,fontWeight:600},children:[a.startYear,"–",a.endYear]})]}),e.jsxs("div",{style:{display:"grid",gap:6},children:[e.jsx("div",{style:{fontSize:12,opacity:.7},children:"Element"}),e.jsx("div",{style:{fontSize:15,fontWeight:600},children:a.element})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(2, minmax(0, 1fr))",gap:10},children:[e.jsxs("div",{style:{display:"grid",gap:6},children:[e.jsx("div",{style:{fontSize:12,opacity:.7},children:"Macro Element"}),e.jsx("div",{style:{fontSize:15,fontWeight:600},children:a.macroLuckElement})]}),e.jsxs("div",{style:{display:"grid",gap:6},children:[e.jsx("div",{style:{fontSize:12,opacity:.7},children:"Macro Luck"}),e.jsxs("div",{style:{fontSize:15,fontWeight:600},children:[a.macroLuckNumber," Luck"]})]})]})]}),e.jsx("div",{style:{fontSize:14,lineHeight:1.6},children:a.summary}),e.jsxs("div",{style:{display:"grid",gap:10},children:[e.jsx("div",{style:{fontSize:13,fontWeight:700},children:"Focus Areas"}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:10},children:_.map(n=>{const c=d===n.label;return e.jsxs("button",{type:"button",onClick:()=>p(n.label),style:{background:c?"rgba(244, 215, 62, 0.2)":"rgba(0,0,0,0.25)",borderRadius:10,padding:10,display:"grid",gap:6,justifyItems:"center",textAlign:"center",border:c?"1px solid rgba(244, 215, 62, 0.5)":"1px solid transparent",color:"#fff",cursor:"pointer"},children:[e.jsx("img",{src:v[n.label],alt:n.label,style:{width:28,height:28}}),e.jsx("div",{style:{fontSize:12,fontWeight:600},children:n.label}),e.jsx("div",{style:{fontSize:10,opacity:.7},children:n.description})]},n.label)})})]}),e.jsxs("div",{style:{background:"rgba(0,0,0,0.25)",borderRadius:12,padding:12},children:[e.jsxs("div",{style:{fontSize:12,textTransform:"uppercase",opacity:.7,marginBottom:6},children:[d," Insight"]}),e.jsx("div",{style:{fontSize:13,lineHeight:1.6},children:a.topics[d]})]})]}):null,tone:"info",onClose:()=>i(null),dismissLabel:"Close",closeOnBackdrop:!0}),e.jsx(M,{open:!!s,title:(s==null?void 0:s.name)||"Star Detail",iconOverride:s?h("ten_stars",s.name):void 0,message:e.jsx("div",{style:{textAlign:"center",lineHeight:1.5},children:s==null?void 0:s.description}),tone:"info",onClose:()=>o(null),dismissLabel:"Got it",closeOnBackdrop:!0}),e.jsx(O,{})]})}export{je as default};
