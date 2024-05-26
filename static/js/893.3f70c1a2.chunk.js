(()=>{"use strict";var __webpack_modules__={893:(e,t,r)=>{const n=e=>{let t=[];for(let r=0;r<e[0].length;r++){t[r]=[];for(let n=0;n<e.length;n++)t[r].push(e[n][r])}return t},o=(e,t)=>{let r=new Array(e[0].length);for(let n=0;n<e.length;n++){r[n]=new Array(e[0].length);for(let o=0;o<e[0].length;o++)r[n][o]=e[n][o]+t[n][o]}return r},l=(e,t)=>{let r=new Array(e.length);for(let n=0;n<e.length;n++)r[n]=e[n]+t[n];return r},_=(e,t)=>{const r=e.length,n=e[0].length,o=t[0].length;if(n!==t.length)throw new Error("The number of columns in the first matrix must match the number of rows in the second matrix.");const l=[];for(let _=0;_<r;_++){l[_]=[];for(let r=0;r<o;r++){let o=0;for(let l=0;l<n;l++)o+=e[_][l]*t[l][r];l[_][r]=o}}return l},s=(e,t)=>{const r=e.length,n=e[0].length;if(n!==t.length)throw new Error("The number of columns in the matrix must match the length of the vector.");const o=[];for(let l=0;l<r;l++){let r=0;for(let o=0;o<n;o++)r+=e[l][o]*t[o];o[l]=r}return o},a=(e,t)=>{const r=e.length,n=e[0].length,o=[];for(let l=0;l<r;l++){o[l]=[];for(let r=0;r<n;r++)o[l][r]=e[l][r]*t}return o},i=(e,t)=>{const r=[];for(let n=0;n<e.length;n++)r[n]=e[n]*t;return r};function c(e){if(!function(e){const t=e.length;for(let r=0;r<t;r++)if(e[r].length!==t)return!1;return!0}(e))throw new Error("Matrix must be square");const t=o(e);if(0===t)throw new Error("Matrix has 0 det");const r=function(e){const t=[];for(let r=0;r<e.length;r++){t[r]=[];for(let n=0;n<e[r].length;n++)t[r][n]=(-1)**(r+n)*o(l(e,r,n))}return t}(e),n=function(e){const t=[];for(let r=0;r<e[0].length;r++){t[r]=[];for(let n=0;n<e.length;n++)t[r][n]=e[n][r]}return t}(r);for(let _=0;_<e.length;_++)for(let r=0;r<e[_].length;r++)n[_][r]/=t;return n;function o(e){if(1===e.length)return e[0][0];let t=0;for(let r=0;r<e.length;r++)t+=e[0][r]*o(l(e,0,r))*(-1)**r;return t}function l(e,t,r){const n=[];for(let o=0;o<e.length;o++)o!==t&&n.push(e[o].filter(((e,t)=>t!=r)));return n}}const u=e=>{const t=e.length,r=Array(t),n=Array(t);for(let o=0;o<t;o++){r[o]=[],n[o]=[];for(let e=0;e<t;e++)r[o][e]=0,n[o][e]=0}for(let o=0;o<t;o++){for(let l=o;l<t;l++){let t=0;for(let e=0;e<o;e++)t+=r[o][e]*n[e][l];n[o][l]=e[o][l]-t}for(let l=o;l<t;l++)if(o===l)r[o][o]=1;else{let t=0;for(let e=0;e<o;e++)t+=r[l][e]*n[e][o];r[l][o]=(e[l][o]-t)/n[o][o]}}return{lower:r,upper:n}},p=(e,t)=>{const r=u(e),n=e.length,o=[],l=[];for(let _=0;_<n;_++){let e=0;for(let t=0;t<_;t++)e+=r.lower[_][t]*o[t];o[_]=(t[_]-e)/r.lower[_][_]}for(let _=n-1;_>=0;_--){let e=0;for(let t=_+1;t<n;t++)e+=r.upper[_][t]*l[t];l[_]=(o[_]-e)/r.upper[_][_]}return l};var f=r(488),h=r(536);const d=function(e,t,r,n,o,l){let _=arguments.length>6&&void 0!==arguments[6]?arguments[6]:0,s=arguments.length>7&&void 0!==arguments[7]?arguments[7]:.1,a=arguments.length>8&&void 0!==arguments[8]?arguments[8]:500,i=arguments.length>9&&void 0!==arguments[9]?arguments[9]:"forward",c=arguments.length>10&&void 0!==arguments[10]?arguments[10]:null,u=1/s,p=y(e,r),f=D(e,n,o),d=g(p,e),m=v(d,e);p=(0,h.cloneDeep)(d),p=k(p,e),null===l&&(l=(e,t)=>{console.log("progress: "+e+"%")});let E=[],q=[];if(null===c)for(let h=0;h<m.length;h++)E.push(_);else E=c;E=S(E,e,t);let x=[];if(x.push(E),"crank-nicolson"===i)b(a,d,e,f,u,p,E,m,q,t,x,l,s);else w(a,d,e,f,u,p,E,m,q,t,x,l,s);return x},w=(e,t,r,n,o,_,c,u,f,h,d,w,b)=>{let m=0,g=0;for(let k=0;k<e;k++){u=v(t,r,g);let k=a(n,o),E=l(l(u,i(s(_,c),-1)),i(s(n,c),o)),q=p(k,E);S(q,r,h,g),f=q,d.push(f),c=f,m+=100/e,w(m,f),g+=b}},b=(e,t,r,n,_,c,u,f,d,w,b,m,g)=>{let k=0,E=0,q=(0,h.cloneDeep)(f);for(let x=0;x<e;x++){f=v(t,r,E);let _=o(n,a(c,g/2)),x=l(s(o(n,a(c,-1*g/2)),u),i(l(q,f),g/2)),y=p(_,x);S(y,r,w,E),d=y,b.push(d),u=d,k+=100/e,m(k,d),E+=g,q=(0,h.cloneDeep)(f)}},m=(e,t)=>{let r=t.assembly.nsets.find((t=>t.setname==e));if(!r)throw new Error("Set not found");return r.nodes},g=(e,t)=>(t.steps[0].boundaries.temperature.forEach((r=>{let n=r.setName,o=t.assembly.nsets.find((e=>e.setname==n));if(!o)throw new Error("Nset not found");o.nodes.forEach((t=>{for(let r=0;r<e.length;r++)r!=t-1&&(e[t-1][r]=0)}))})),e),k=(e,t)=>(t.steps[0].boundaries.temperature.forEach((r=>{let n=r.setName,o=t.assembly.nsets.find((e=>e.setname==n));if(!o)throw new Error("Nset not found");o.nodes.forEach((t=>{for(let r=0;r<e.length;r++)r!=t-1&&(e[r][t-1]=0)}))})),e),v=function(e,t){let r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,n=[];for(let o=0;o<e.length;o++)n.push(0);return t.steps[0].boundaries.temperature.forEach((o=>{let l=o.setName,_=t.assembly.nsets.find((e=>e.setname==l));if(!_)throw new Error("Nset not found");let s=(0,f._)(o.temperature.toString(),r);_.nodes.forEach((t=>{n[t-1]=e[t-1][t-1]*s}))})),t.steps[0].boundaries.temperature.forEach((o=>{let l=o.setName,_=t.assembly.nsets.find((e=>e.setname==l));if(!_)throw new Error("Nset not found");let s=(0,f._)(o.temperature.toString(),r);_.nodes.forEach((t=>{for(let r=0;r<n.length;r++)r!=t-1&&(n[r]-=e[r][t-1]*s)}))})),n},E=(e,t,r,n)=>{var o;let l=r.find((t=>-1!=t.elements.indexOf(e)));if(!l)throw new Error("Element not in elset");let _=l.setname,s=n.find((e=>e.elsetName==_));if(!s)throw new Error("Elset not in section");return null!==(o=t[s.name])&&void 0!==o?o:0},q=(e,t,r,n)=>{var o;let l=r.find((t=>-1!=t.elements.indexOf(e)));if(!l)throw new Error("Element not in elset");let _=l.setname,s=n.find((e=>e.elsetName==_));if(!s)throw new Error("Elset not in section");return null!==(o=t[s.name])&&void 0!==o?o:0},x=(e,t,r,n)=>{var o;let l=r.find((t=>-1!=t.elements.indexOf(e)));if(!l)throw new Error("Element not in elset");let _=l.setname,s=n.find((e=>e.elsetName==_));if(!s)throw new Error("Elset not in section");return null!==(o=t[s.name])&&void 0!==o?o:0},y=(e,t)=>{let r=e.problemData[0].nodes,o=e.problemData[0].elements,l=new Array(r.length);for(let n=0;n<l.length;n++)l[n]=new Array(r.length).fill(0);for(let s=0;s<o.length;s++){let i=E(o[s][0],t,e.problemData[0].lsets,e.problemData[0].sections),u=[[i,0],[0,i]],p=r[o[s][1]-1][1],f=r[o[s][1]-1][2],h=r[o[s][2]-1][1],d=r[o[s][2]-1][2],w=r[o[s][3]-1][1],b=r[o[s][3]-1][2],m=c([[1,p,f],[1,h,d],[1,w,b]]);m.shift();let g=.5*Math.abs(p*(d-b)+h*(b-f)+w*(f-d)),k=a(_(_(n(m),u),m),g);l=M(l,k,o[s][1],o[s][2],o[s][3])}return l};const D=(e,t,r)=>{let n=e.problemData[0].nodes,o=e.problemData[0].elements,l=new Array(n.length);for(let _=0;_<l.length;_++)l[_]=new Array(n.length).fill(0);for(let _=0;_<o.length;_++){let s=q(o[_][0],t,e.problemData[0].lsets,e.problemData[0].sections),a=x(o[_][0],r,e.problemData[0].lsets,e.problemData[0].sections),i=[[n[o[_][1]-1][1],n[o[_][1]-1][2]],[n[o[_][2]-1][1],n[o[_][2]-1][2]],[n[o[_][3]-1][1],n[o[_][3]-1][2]]],c=O(i,s,a);l=M(l,c,o[_][1],o[_][2],o[_][3])}return l},O=(e,t,r)=>{let n=e[0][0],o=e[0][1],l=e[1][0],_=e[1][1],s=e[2][0],i=e[2][1],c=.5*Math.abs(n*(_-i)+l*(i-o)+s*(o-_));return a([[2,1,1],[1,2,1],[1,1,2]],t*r/12*c)},M=(e,t,r,n,o)=>(n--,o--,e[--r][r]+=t[0][0],e[n][n]+=t[1][1],e[o][o]+=t[2][2],e[r][n]+=t[0][1],e[n][r]+=t[1][0],e[r][o]+=t[0][2],e[o][r]+=t[2][0],e[n][o]+=t[1][2],e[o][n]+=t[2][1],e),S=function(e,t,r){let n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;for(let o=0;o<r.length;o++){let l=r[o],_=m(l.setName,t),s=(0,f._)(l.temperature.toString(),n);for(let t=0;t<_.length;t++){e[_[t]-1]=s}}return e};self.addEventListener("message",(e=>{let t=e.data.inpData,r=e.data.temperature_BC,n=e.data.blocks_termal_conductivity,o=e.data.blocks_density,l=e.data.blocks_specific_heat,_=e.data.initialTemp,s=e.data.stepIncrement,a=e.data.steps,i=e.data.method,c=[];if(e.data.usePreStep){let p=[],w=e.data.usePreStep,b=e.data.preStepSteps,m=e.data.preStepIncrement,g=[];g=w?r.map((e=>{let t=(0,h.cloneDeep)(e);return t.temperature=function(e,t,r){let n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:.01,o=0,l=0;for(let _=t;_<=r;_+=n)o+=(0,f._)(e.toString(),_),l++;return o/l}(t.temperature,0,b*m,10),t})):e.data.preStepBC;try{p=d(t,g,n,o,l,N,_,m,b,"crank-nicolson"),c=d(t,r,n,o,l,A,_,s,a,i,p[p.length-1])}catch(u){postMessage({action:"error",result:u})}}else try{c=d(t,r,n,o,l,A,_,s,a,i)}catch(u){postMessage({action:"error",result:u})}postMessage({action:"done",result:c})}));const A=(e,t)=>{postMessage({action:"progress",result:e,temp:t})},N=(e,t)=>{postMessage({action:"progress_preStep",result:e,temp:t})}},488:(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{_:()=>evaluateMathExpression});var _table__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(430);const evaluateMathExpression=(expression,t)=>{const lines=expression.split("\n");if(lines.length>2&&lines[0].includes(",")){const e=(0,_table__WEBPACK_IMPORTED_MODULE_0__.C)(expression),r=(0,_table__WEBPACK_IMPORTED_MODULE_0__.k)(e,t);return r}expression=expression.replace(/t\^(\d+)/g,"Math.pow(t, $1)"),expression=expression.replace(/sin/g,"Math.sin"),expression=expression.replace(/cos/g,"Math.cos");const result=eval(expression);return result}},430:(e,t,r)=>{r.d(t,{C:()=>n,k:()=>o});const n=e=>{const t=e.split("\n"),r=[];for(let n=0;n<t.length;n++){const[e,o]=t[n].split(",");r[parseFloat(e)]=parseFloat(o)}return r};function o(e,t){const r=Object.keys(e).sort(((e,t)=>e-t)),n=e[r[0]];if(t<=0||t<=parseFloat(r[0]))return n;const o=Object.keys(e).map((e=>parseFloat(e))),l=o.find((e=>e<=t)),_=o.find((e=>e>=t));if(void 0===l)return e[o[0]];if(void 0===_)return e[o[o.length-1]];const s=e[l],a=e[_],i=(t-l)/(_-l);return(1-i)*s+i*a}}},__webpack_module_cache__={};function __webpack_require__(e){var t=__webpack_module_cache__[e];if(void 0!==t)return t.exports;var r=__webpack_module_cache__[e]={id:e,loaded:!1,exports:{}};return __webpack_modules__[e].call(r.exports,r,r.exports,__webpack_require__),r.loaded=!0,r.exports}__webpack_require__.m=__webpack_modules__,__webpack_require__.x=()=>{var e=__webpack_require__.O(void 0,[536],(()=>__webpack_require__(893)));return e=__webpack_require__.O(e)},(()=>{var e=[];__webpack_require__.O=(t,r,n,o)=>{if(!r){var l=1/0;for(i=0;i<e.length;i++){r=e[i][0],n=e[i][1],o=e[i][2];for(var _=!0,s=0;s<r.length;s++)(!1&o||l>=o)&&Object.keys(__webpack_require__.O).every((e=>__webpack_require__.O[e](r[s])))?r.splice(s--,1):(_=!1,o<l&&(l=o));if(_){e.splice(i--,1);var a=n();void 0!==a&&(t=a)}}return t}o=o||0;for(var i=e.length;i>0&&e[i-1][2]>o;i--)e[i]=e[i-1];e[i]=[r,n,o]}})(),__webpack_require__.d=(e,t)=>{for(var r in t)__webpack_require__.o(t,r)&&!__webpack_require__.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},__webpack_require__.f={},__webpack_require__.e=e=>Promise.all(Object.keys(__webpack_require__.f).reduce(((t,r)=>(__webpack_require__.f[r](e,t),t)),[])),__webpack_require__.u=e=>"static/js/"+e+".c57e7181.chunk.js",__webpack_require__.miniCssF=e=>{},__webpack_require__.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}(),__webpack_require__.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),__webpack_require__.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),__webpack_require__.p="/heat-transfer/",(()=>{var e={893:1};__webpack_require__.f.i=(t,r)=>{e[t]||importScripts(__webpack_require__.p+__webpack_require__.u(t))};var t=self.webpackChunkheat_transfer=self.webpackChunkheat_transfer||[],r=t.push.bind(t);t.push=t=>{var n=t[0],o=t[1],l=t[2];for(var _ in o)__webpack_require__.o(o,_)&&(__webpack_require__.m[_]=o[_]);for(l&&l(__webpack_require__);n.length;)e[n.pop()]=1;r(t)}})(),(()=>{var e=__webpack_require__.x;__webpack_require__.x=()=>__webpack_require__.e(536).then(e)})();var __webpack_exports__=__webpack_require__.x()})();
//# sourceMappingURL=893.3f70c1a2.chunk.js.map