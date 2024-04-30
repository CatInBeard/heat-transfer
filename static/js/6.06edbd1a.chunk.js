(()=>{"use strict";var __webpack_modules__={6:(e,t,r)=>{const n=e=>{let t=[];for(let r=0;r<e[0].length;r++){t[r]=[];for(let n=0;n<e.length;n++)t[r].push(e[n][r])}return t},l=(e,t)=>{let r=new Array(e.length);for(let n=0;n<e.length;n++)r[n]=e[n]+t[n];return r},o=(e,t)=>{const r=e.length,n=e[0].length,l=t[0].length;if(n!==t.length)throw new Error("The number of columns in the first matrix must match the number of rows in the second matrix.");const o=[];for(let _=0;_<r;_++){o[_]=[];for(let r=0;r<l;r++){let l=0;for(let o=0;o<n;o++)l+=e[_][o]*t[o][r];o[_][r]=l}}return o},_=(e,t)=>{const r=e.length,n=e[0].length;if(n!==t.length)throw new Error("The number of columns in the matrix must match the length of the vector.");const l=[];for(let o=0;o<r;o++){let r=0;for(let l=0;l<n;l++)r+=e[o][l]*t[l];l[o]=r}return l},s=(e,t)=>{const r=e.length,n=e[0].length,l=[];for(let o=0;o<r;o++){l[o]=[];for(let r=0;r<n;r++)l[o][r]=e[o][r]*t}return l},a=(e,t)=>{const r=[];for(let n=0;n<e.length;n++)r[n]=e[n]*t;return r},i=e=>{const t=e.length,r=Array(t),n=Array(t);for(let l=0;l<t;l++){r[l]=[],n[l]=[];for(let e=0;e<t;e++)r[l][e]=0,n[l][e]=0}for(let l=0;l<t;l++){for(let o=l;o<t;o++){let t=0;for(let e=0;e<l;e++)t+=r[l][e]*n[e][o];n[l][o]=e[l][o]-t}for(let o=l;o<t;o++)if(l===o)r[l][l]=1;else{let t=0;for(let e=0;e<l;e++)t+=r[o][e]*n[e][l];r[o][l]=(e[o][l]-t)/n[l][l]}}return{lower:r,upper:n}},u=(e,t)=>{const r=i(e),n=e.length,l=[],o=[];for(let _=0;_<n;_++){let e=0;for(let t=0;t<_;t++)e+=r.lower[_][t]*l[t];l[_]=(t[_]-e)/r.lower[_][_]}for(let _=n-1;_>=0;_--){let e=0;for(let t=_+1;t<n;t++)e+=r.upper[_][t]*o[t];o[_]=(l[_]-e)/r.upper[_][_]}return o};var p=r(824);const c=(e,t)=>{const r=e.length,n=e[0].length,l=[];for(let o=0;o<r;o++){l[o]=[];for(let r=0;r<n;r++)l[o][r]=e[o][r].mul(t)}return l},f=(e,t)=>{let r=new Array(e.length);for(let n=0;n<e.length;n++)r[n]=e[n].plus(t[n]);return r},h=(e,t)=>{const r=[];for(let n=0;n<e.length;n++)r[n]=e[n].mul(t);return r},w=(e,t)=>{const r=e.length,n=e[0].length;if(n!==t.length)throw new Error("The number of columns in the matrix must match the length of the vector.");const l=[];for(let o=0;o<r;o++){let r=new p.A(0);for(let l=0;l<n;l++)r=r.plus(e[o][l].mul(t[l]));l[o]=r}return l},m=(e,t)=>{const r=b(e),n=e.length,l=[],o=[];for(let _=0;_<n;_++){let e=new p.A(0);for(let t=0;t<_;t++)e=e.plus(r.lower[_][t].mul(l[t]));l[_]=t[_].minus(e).div(r.lower[_][_])}for(let _=n-1;_>=0;_--){let e=new p.A(0);for(let t=_+1;t<n;t++)e=e.plus(r.upper[_][t].mul(o[t]));o[_]=l[_].minus(e).div(r.upper[_][_])}return o},b=e=>{const t=e.length,r=Array(t),n=Array(t);for(let l=0;l<t;l++){r[l]=[],n[l]=[];for(let e=0;e<t;e++)r[l][e]=new p.A(0),n[l][e]=new p.A(0)}for(let l=0;l<t;l++){for(let o=l;o<t;o++){let t=new p.A(0);for(let e=0;e<l;e++)t=t.plus(r[l][e].mul(n[e][o]));n[l][o]=e[l][o].minus(t)}for(let o=l;o<t;o++)if(l===o)r[l][l]=1;else{let t=0;for(let e=0;e<l;e++)t+=r[o][e]*n[e][l];r[o][l]=e[o][l].minus(t).div(n[l][l])}}return{lower:r,upper:n}};var g=r(488);const d=e=>{let t=[];for(let r=0;r<e.length;r++)t[r]=new p.A(e[r]);return t},k=e=>{let t=[];for(let r=0;r<e.length;r++)t[r]=e[r].toNumber();return t},v=e=>{let t=[];for(let r=0;r<e.length;r++){t[r]=[];for(let n=0;n<e.length;n++)t[r][n]=new p.A(e[r][n])}return t},E=(e,t)=>{let r=t.assembly.nsets.find((t=>t.setname==e));if(!r)throw new Error("Set not found");return r.nodes},q=(e,t)=>(t.steps[0].boundaries.temperature.forEach((r=>{let n=r.setName,l=t.assembly.nsets.find((e=>e.setname==n));if(!l)throw new Error("Nset not found");l.nodes.forEach((t=>{for(let r=0;r<e.length;r++)r!=t-1&&(e[t-1][r]=0)}))})),e),x=(e,t)=>(t.steps[0].boundaries.temperature.forEach((r=>{let n=r.setName,l=t.assembly.nsets.find((e=>e.setname==n));if(!l)throw new Error("Nset not found");l.nodes.forEach((t=>{for(let r=0;r<e.length;r++)r!=t-1&&(e[r][t-1]=0)}))})),e),y=function(e,t){let r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,n=[];for(let l=0;l<e.length;l++)n.push(0);return t.steps[0].boundaries.temperature.forEach((l=>{let o=l.setName,_=t.assembly.nsets.find((e=>e.setname==o));if(!_)throw new Error("Nset not found");console.log(l.temperature);let s=(0,g._)(l.temperature.toString(),r);_.nodes.forEach((t=>{n[t-1]=e[t-1][t-1]*s;for(let r=0;r<n.length;r++)r!=t-1&&(n[r]-=e[r][t-1]*s)}))})),n},A=(e,t,r,n)=>{var l;let o=r.find((t=>-1!=t.elements.indexOf(e)));if(!o)throw new Error("Element not in elset");let _=o.setname,s=n.find((e=>e.elsetName==_));if(!s)throw new Error("Elset not in section");return null!==(l=t[s.name])&&void 0!==l?l:0},O=(e,t,r,n)=>{var l;let o=r.find((t=>-1!=t.elements.indexOf(e)));if(!o)throw new Error("Element not in elset");let _=o.setname,s=n.find((e=>e.elsetName==_));if(!s)throw new Error("Elset not in section");return null!==(l=t[s.name])&&void 0!==l?l:0},D=(e,t,r,n)=>{var l;let o=r.find((t=>-1!=t.elements.indexOf(e)));if(!o)throw new Error("Element not in elset");let _=o.setname,s=n.find((e=>e.elsetName==_));if(!s)throw new Error("Elset not in section");return null!==(l=t[s.name])&&void 0!==l?l:0},M=(e,t)=>{let r=e.problemData[0].nodes,l=e.problemData[0].elements,_=new Array(r.length);for(let n=0;n<_.length;n++)_[n]=new Array(r.length).fill(0);for(let a=0;a<l.length;a++){let i=A(l[a][0],t,e.problemData[0].lsets,e.problemData[0].sections),u=[[i,0],[0,i]],p=r[l[a][1]-1][1],c=r[l[a][1]-1][2],f=r[l[a][2]-1][1],h=r[l[a][2]-1][2],w=r[l[a][3]-1][1],m=r[l[a][3]-1][2],b=h-m,g=m-c,d=c-h,k=w-f,v=p-w,E=f-p,q=.5*Math.abs(p*(h-m)+f*(m-c)+w*(c-h)),x=[[b,g,d],[k,v,E]],y=s(o(o(n(x),u),x),1/4*q);_=C(_,y,l[a][1],l[a][2],l[a][3])}return _},N=(e,t,r)=>{let n=e.problemData[0].nodes,l=e.problemData[0].elements,o=new Array(n.length);for(let _=0;_<o.length;_++)o[_]=new Array(n.length).fill(0);for(let _=0;_<l.length;_++){let s=O(l[_][0],t,e.problemData[0].lsets,e.problemData[0].sections),a=D(l[_][0],r,e.problemData[0].lsets,e.problemData[0].sections),i=[[n[l[_][1]-1][1],n[l[_][1]-1][2]],[n[l[_][2]-1][1],n[l[_][2]-1][2]],[n[l[_][3]-1][1],n[l[_][3]-1][2]]],u=P(i,s,a);o=C(o,u,l[_][1],l[_][2],l[_][3])}return o},P=(e,t,r)=>{let n=e[0][0],l=e[0][1],o=e[1][0],_=e[1][1],a=e[2][0],i=e[2][1],u=.5*Math.abs(n*(_-i)+o*(i-l)+a*(l-_));return s([[2,1,1],[1,2,1],[1,1,2]],t*r/12*u)},C=(e,t,r,n,l)=>(n--,l--,e[--r][r]+=t[0][0],e[n][n]+=t[1][1],e[l][l]+=t[2][2],e[r][n]+=t[0][1],e[n][r]+=t[1][0],e[r][l]+=t[0][2],e[l][r]+=t[2][0],e[n][l]+=t[1][2],e[l][n]+=t[2][1],e),j=function(e,t,r){let n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;for(let l=0;l<r.length;l++){let o=r[l],_=E(o.setName,t),s=(0,g._)(o.temperature.toString(),n);for(let t=0;t<_.length;t++){e[_[t]-1]=s}}return e},T=(e,t,r)=>{for(let n=0;n<r.length;n++){let l=r[n],o=E(l.setName,t);for(let t=0;t<o.length;t++){e[o[t]-1]=new p.A(l.temperature)}}return e};onmessage=function(e){let t=e.data.inpData,r=e.data.temperature_BC,n=e.data.blocks_termal_conductivity,o=e.data.blocks_density,i=e.data.blocks_specific_heat,b=e.data.initialTemp,g=e.data.stepIncrement,E=e.data.steps;try{var A=function(e,t,r,n,o,i){let b=arguments.length>6&&void 0!==arguments[6]?arguments[6]:0,g=arguments.length>7&&void 0!==arguments[7]?arguments[7]:.1,E=arguments.length>8&&void 0!==arguments[8]?arguments[8]:500,A=arguments.length>9&&void 0!==arguments[9]&&arguments[9];p.A.DP=60;let O=1/g,D=M(e,r),P=N(e,n,o),C=q(D,e),F=y(C,e);D=x(C,e),null===i&&(i=(e,t)=>{console.log("progress: "+e+"%")});let B=[],I=[];for(let l=0;l<F.length;l++)B.push(b);B=j(B,e,t);let S=[];S.push(B);let K=0,L=0;if(A){let r=v(P),n=v(D),l=new p.A(O),o=d(F),_=d(B),s=[];for(let a=0;a<E;a++){let a=c(r,l),u=f(f(o,h(w(n,_),new p.A(-1))),h(w(r,_),l)),b=m(a,u);s=T(b,e,t);let g=k(s);S.push(g),_=s,K+=100/E,i(K,g)}}else for(let p=0;p<E;p++){F=y(C,e,L);let r=s(P,O),n=l(l(F,a(_(D,B),-1)),a(_(P,B),O)),o=u(r,n);I=j(o,e,t,L),S.push(I),B=I,K+=100/E,i(K,I),L+=g}return S}(t,r,n,o,i,F,b,g,E)}catch(O){postMessage({action:"error",result:O})}postMessage({action:"done",result:A})};const F=(e,t)=>{postMessage({action:"progress",result:e,temp:t})}},488:(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{_:()=>evaluateMathExpression});var _table_ts__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(430);const evaluateMathExpression=(expression,t)=>{const lines=expression.split("\n");if(lines.length>2&&lines[0].includes(",")){const e=(0,_table_ts__WEBPACK_IMPORTED_MODULE_0__.C)(expression),r=(0,_table_ts__WEBPACK_IMPORTED_MODULE_0__.k)(e,t);return r}expression=expression.replace(/t\^(\d+)/g,"Math.pow(t, $1)"),expression=expression.replace(/sin/g,"Math.sin"),expression=expression.replace(/cos/g,"Math.cos");const result=eval(expression);return result}},430:(e,t,r)=>{r.d(t,{C:()=>n,k:()=>l});const n=e=>{const t=e.split("\n"),r=[];for(let n=0;n<t.length;n++){const[e,l]=t[n].split(",");r[parseFloat(e)]=parseFloat(l)}return r};function l(e,t){const r=Object.keys(e).sort(((e,t)=>e-t)),n=e[r[0]];if(t<=0||t<=parseFloat(r[0]))return n;const l=Object.keys(e).map((e=>parseFloat(e))),o=l.find((e=>e<=t)),_=l.find((e=>e>=t));if(void 0===o)return e[l[0]];if(void 0===_)return e[l[l.length-1]];const s=e[o],a=e[_],i=(t-o)/(_-o);return(1-i)*s+i*a}}},__webpack_module_cache__={};function __webpack_require__(e){var t=__webpack_module_cache__[e];if(void 0!==t)return t.exports;var r=__webpack_module_cache__[e]={exports:{}};return __webpack_modules__[e](r,r.exports,__webpack_require__),r.exports}__webpack_require__.m=__webpack_modules__,__webpack_require__.x=()=>{var e=__webpack_require__.O(void 0,[443],(()=>__webpack_require__(6)));return e=__webpack_require__.O(e)},(()=>{var e=[];__webpack_require__.O=(t,r,n,l)=>{if(!r){var o=1/0;for(i=0;i<e.length;i++){r=e[i][0],n=e[i][1],l=e[i][2];for(var _=!0,s=0;s<r.length;s++)(!1&l||o>=l)&&Object.keys(__webpack_require__.O).every((e=>__webpack_require__.O[e](r[s])))?r.splice(s--,1):(_=!1,l<o&&(o=l));if(_){e.splice(i--,1);var a=n();void 0!==a&&(t=a)}}return t}l=l||0;for(var i=e.length;i>0&&e[i-1][2]>l;i--)e[i]=e[i-1];e[i]=[r,n,l]}})(),__webpack_require__.d=(e,t)=>{for(var r in t)__webpack_require__.o(t,r)&&!__webpack_require__.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},__webpack_require__.f={},__webpack_require__.e=e=>Promise.all(Object.keys(__webpack_require__.f).reduce(((t,r)=>(__webpack_require__.f[r](e,t),t)),[])),__webpack_require__.u=e=>"static/js/"+e+".e95e3585.chunk.js",__webpack_require__.miniCssF=e=>{},__webpack_require__.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),__webpack_require__.p="./",(()=>{var e={6:1};__webpack_require__.f.i=(t,r)=>{e[t]||importScripts(__webpack_require__.p+__webpack_require__.u(t))};var t=self.webpackChunkheat_transfer=self.webpackChunkheat_transfer||[],r=t.push.bind(t);t.push=t=>{var n=t[0],l=t[1],o=t[2];for(var _ in l)__webpack_require__.o(l,_)&&(__webpack_require__.m[_]=l[_]);for(o&&o(__webpack_require__);n.length;)e[n.pop()]=1;r(t)}})(),(()=>{var e=__webpack_require__.x;__webpack_require__.x=()=>__webpack_require__.e(443).then(e)})();var __webpack_exports__=__webpack_require__.x()})();
//# sourceMappingURL=6.06edbd1a.chunk.js.map