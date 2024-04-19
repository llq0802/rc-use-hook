"use strict";(self.webpackChunkrc_use_hooks=self.webpackChunkrc_use_hooks||[]).push([[450],{67450:function(rn,Y,f){f.d(Y,{dw:function(){return _e},yq:function(){return se},rn:function(){return Je},Od:function(){return ee},VP:function(){return he},FK:function(){return Ne},vE:function(){return $e},Hp:function(){return oe},Np:function(){return ve},FD:function(){return Ce},JW:function(){return Le},Cj:function(){return de},KK:function(){return Me},l:function(){return Ae},J:function(){return ue},F5:function(){return Se},GS:function(){return Z},DU:function(){return Pe},vI:function(){return ye},gQ:function(){return be},x3:function(){return $},Gp:function(){return en},iP:function(){return ce},ck:function(){return te}});var J=f(54306),S=f.n(J),O=f(75843),i=f(50959);function $(n){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},t=(0,i.useState)(!1),r=S()(t,2),o=r[0],u=r[1],s=(0,i.useRef)(),a=(0,i.useRef)(),c=(0,i.useRef)(),d=e.onShow,m=e.onHide,l=e.showFormart,v=e.hideFormart;(0,i.useImperativeHandle)(n,function(){return{onShow:function(w){var P=a.current=(0,O.Z)(w);u(!0),d==null||d(P)},onHide:function(w){var P=c.current=(0,O.Z)(w);u(!1),m==null||m(P)},getChildData:function(){return s.current}}});var h=(0,i.useCallback)(function(R){s.current=(0,O.Z)(R)},[]),p=(0,i.useCallback)(function(R){u(R)},[]),D=(0,i.useCallback)(function(){u(!1)},[]),E=(0,i.useCallback)(function(){s.current=void 0,a.current=void 0,c.current=void 0},[]),C=l?l(a.current):a.current,y=v?v(c.current):c.current;return{setParentData:h,showRecord:C,hideRecord:y,open:o,updateOpen:p,close:D,clear:E}}var Q=f(14445),U=function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:[],t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:[];return(0,Q.Z)(e,t)},b=function(e){return typeof e=="function"};function X(n){return n.replace(/-([a-z])/g,function(e,t){return t.toUpperCase()})}var q=function(e){var t=(e==null?void 0:e.scrollHeight)>(e==null?void 0:e.clientHeight),r=window.getComputedStyle(e).overflowY,o=r.indexOf("hidden")!==-1;return t&&!o},_=function n(e){return!e||e===document.body?document.body:q(e)?e:n(e==null?void 0:e.parentNode)},un=function(){return/Safari/.test(navigator.userAgent)&&!/Chrome/.test(navigator.userAgent)};function an(){return window.innerHeight>window.innerWidth?"portrait":"landscape"}function ee(n){var e=(0,i.useRef)(),t=(0,i.useState)(n),r=S()(t,2),o=r[0],u=r[1];(0,i.useEffect)(function(){var a;e==null||(a=e.current)===null||a===void 0||a.call(e,o)},[o]);var s=(0,i.useCallback)(function(a,c){b(c)&&(e.current=c),u(function(d){var m=b(a)?a==null?void 0:a(d):a;return m})},[]);return[o,s]}var ne=f(14659),te=ne.c,re=f(57213),F=f.n(re);function ue(){var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},e=(0,i.useMemo)(function(){return F()({imageAttribute:"data-img-src",target:function(){return document},options:{},dependencies:[]},n)},[n]),t=e.imageAttribute,r=e.target,o=e.options,u=e.dependencies,s=F()({rootMargin:"0px 0px 200px 0px",threshold:.01,root:function(){return null}},o),a=(0,i.useMemo)(function(){return X(t.slice(5))},[t]);function c(d){var m=d.dataset[a];if(d.tagName==="IMG")d.src=m;else{var l,v=(l=d.querySelectorAll("img"))!==null&&l!==void 0?l:[];v.forEach(function(h){h.src=m})}}(0,i.useEffect)(function(){var d;if(r){var m=b(r)?r==null?void 0:r():r==null?void 0:r.current,l=(d=m==null?void 0:m.querySelectorAll("[".concat(t,"]")))!==null&&d!==void 0?d:[];if(window.IntersectionObserver){var h,p,D=b(s.root)?(h=s.root)===null||h===void 0?void 0:h.call(s):s==null||(p=s.root)===null||p===void 0?void 0:p.current,E=new IntersectionObserver(function(C){C.forEach(function(y){y.intersectionRatio>0&&(E.unobserve(y.target),c(y.target))})},F()(F()({},s),{},{root:D}));return l==null||l.forEach(function(C){return E.observe(C)}),function(){l==null||l.forEach(function(C){return E==null?void 0:E.unobserve(C)})}}else{var v;(v=Array.from(l))===null||v===void 0||v.forEach(function(C){return c(C)})}}},u)}var ae=function(e,t){var r=(0,i.useRef)(!1),o=(0,i.useRef)(0),u=(0,i.useRef)();(t===void 0||!U(t,u.current))&&(o.current+=1,u.current=t),(0,i.useEffect)(function(){if(!r.current)r.current=!0;else return e()},[o.current])},oe=ae,ie=function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:!0,t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"\u771F\u7684\u8981\u79BB\u5F00\u5417?";(0,i.useEffect)(function(){var r=window.onbeforeunload;if(!e){window.onbeforeunload=r;return}return window.onbeforeunload=function(o){return o.preventDefault(),r&&(r==null||r(o)),o.returnValue=t,t},function(){window.onbeforeunload=r}},[t,e])},se=ie,le=f(16116);function N(){return{innerHeight:window.innerHeight,innerWidth:window.innerWidth,outerHeight:window.outerHeight,outerWidth:window.outerWidth}}function ce(){var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:200,e=(0,i.useState)(N()),t=S()(e,2),r=t[0],o=t[1];return(0,i.useEffect)(function(){var u=(0,le.Z)(function(){o(N())},n);return window.addEventListener("resize",u),function(){return window.removeEventListener("resize",u)}},[]),r}var W=Math.PI,A=function(n){return n.top="top",n.left="left",n.right="right",n.bottom="bottom",n}(A||{});function de(n){var e=(0,i.useState)(),t=S()(e,2),r=t[0],o=t[1];return(0,i.useEffect)(function(){if(n){var u=b(n)?n==null?void 0:n():n==null?void 0:n.current,s=u==null?void 0:u.getBoundingClientRect(),a=Math.atan2(s.height,s.width),c=function(l){var v=l.offsetX-s.width/2,h=s.height/2-l.offsetY,p=Math.atan2(h,v);p<a&&p>=-a?o(A.right):p>=a&&p<W-a?o(A.top):p>=W-a||p<-(W-a)?o(A.left):o(A.bottom)},d=function(){return o(void 0)};return u==null||u.addEventListener("mouseenter",c),u==null||u.addEventListener("mouseleave",d),function(){u==null||u.removeEventListener("mouseenter",c),u==null||u.removeEventListener("mouseleave",d)}}},[]),r}var fe=function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:1e3,t=(0,i.useState)(0),r=S()(t,2),o=r[0],u=r[1],s=(0,i.useRef)(o);s.current=o;var a=(0,i.useRef)(0);return(0,i.useEffect)(function(){var c=function d(){a.current=window.requestAnimationFrame(function(){s.current<e?((0,i.startTransition)(function(){return u(s.current+1)}),d()):window.cancelAnimationFrame(a.current)})};return c(),function(){return window.cancelAnimationFrame(a.current)}},[]),function(c){return s.current>=c}},ve=fe,me=f(874),ge=f.n(me);function he(){var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:0,e=(0,i.useState)(!1),t=S()(e,2),r=t[0],o=t[1];(0,i.useEffect)(function(){if(r&&n){var s=setTimeout(function(){o(!1)},n);return function(){clearTimeout(s)}}},[r,n]);var u=(0,i.useCallback)(function(s){var a=ge()(s);o(a)},[]);return[r,u]}var H=null,pe=function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:!1,t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:function(){return document.body},r=arguments.length>2&&arguments[2]!==void 0?arguments[2]:17,o=(0,i.useState)(e),u=S()(o,2),s=u[0],a=u[1],c=(0,i.useCallback)(function(l){if(l===document.body){var v=document.createElement("style");v.dataset.useLockScrollState="true",v.innerHTML=`
       html body {
          width: calc(100% - `.concat(r,`px);
          overflow: hidden;
        }
      `),document.head.appendChild(v);return}H=window.getComputedStyle(l).overflow,l.style.overflow="hidden"},[]),d=(0,i.useCallback)(function(l){if(l===document.body){var v=document.head.querySelector('style[data-use-lock-scroll-state="true"]');v&&v.remove();return}l.style.overflow=H,H=null},[]);(0,i.useLayoutEffect)(function(){var l=typeof t=="function"?t==null?void 0:t():t==null?void 0:t.current;return s?c(l):d(l),function(){H=null}},[s]),(0,i.useEffect)(function(){return function(){return a(e)}},[]);var m=(0,i.useCallback)(function(l){return a(l)},[]);return[s,m]},Se=pe,Ee=function(e,t){var r=(0,i.useState)({state:void 0,loaded:!1}),o=S()(r,2),u=o[0],s=u.state,a=u.loaded,c=o[1];(0,i.useEffect)(function(){!a&&t&&c({state:e,loaded:!0})},[t,a]);var d=function(l){a&&(b(l)?c(function(v){return{state:l==null?void 0:l(v.state),loaded:!0}}):c({state:l,loaded:a}))};return[s,d]},Ce=Ee;function Z(n){var e=(0,i.useState)(window.matchMedia(n).matches),t=S()(e,2),r=t[0],o=t[1];return(0,i.useEffect)(function(){var u=window.matchMedia(n);u.matches!==r&&o(u.matches);var s=function(){o(u.matches)};return u.addListener(s),function(){return u.removeListener(s)}},[r,n]),r}var Re=function(e){var t=(0,i.useRef)(),r=(0,i.useRef)();(0,i.useEffect)(function(){var o=function u(s){r.current&&e(s-r.current),r.current=s,t.current=requestAnimationFrame(u)};return t.current=requestAnimationFrame(o),function(){return cancelAnimationFrame(t.current)}},[])},be=Re,L=f(10422),we=function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:document.body,t=(0,i.useState)({render:function(){return null},remove:function(){return null}}),r=S()(t,2),o=r[0],u=r[1],s=(0,i.useCallback)(function(a){var c=function(l){var v=l.children;return L.createPortal(v,a||document.body)},d=function(){var l;return L==null||(l=L.unmountComponentAtNode)===null||l===void 0?void 0:l.call(L,a||document.body)};return{render:c,remove:d}},[]);return(0,i.useEffect)(function(){e&&o.remove();var a=s(e);return u(a),function(){a.remove()}},[e]),o.render},ye=we,Fe=function(e){var t=(0,i.useState)(null),r=S()(t,2),o=r[0],u=r[1];return(0,i.useEffect)(function(){var s=b(e)?e==null?void 0:e():e==null?void 0:e.current,a=_(s);u(a)},[]),o},Pe=Fe;function Ae(n){var e=(0,i.useState)([0,0]),t=S()(e,2),r=t[0],o=t[1];return(0,i.useEffect)(function(){if(n){var u=document.createElement("img");u.addEventListener("load",function(s){var a=s.target,c=a.naturalWidth,d=a.naturalHeight;o([c,d])}),u.src=n}},[n]),r}function Le(){var n=Z("(orientation: portrait)");return n===void 0?void 0:n?"portrait":"landscape"}var He=function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,r=(0,i.useState)(t),o=S()(r,2),u=o[0],s=o[1];return(0,i.useEffect)(function(){var a=b(e)?e==null?void 0:e():e==null?void 0:e.current,c=function(){return s(!0)},d=function(){return s(!1)};return a.addEventListener("focus",c),a.addEventListener("blur",d),function(){a.removeEventListener("focus",c),a.removeEventListener("blur",d)}},[]),u},Me=He,De=f(25359),M=f.n(De),ze=f(93525),Oe=f.n(ze),We=f(49811),k=f.n(We),Ie=f(12342),Te=f.n(Ie),Be=f(17188),Ue=["max","allSettled"];function Ne(){var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:[],e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},t=e.max,r=t===void 0?(n==null?void 0:n.length)||3:t,o=e.allSettled,u=o===void 0?!0:o,s=Te()(e,Ue);function a(){return c.apply(this,arguments)}function c(){return c=k()(M()().mark(function m(){var l,v,h,p=arguments;return M()().wrap(function(E){for(;;)switch(E.prev=E.next){case 0:for(l=p.length,v=new Array(l),h=0;h<l;h++)v[h]=p[h];return E.abrupt("return",new Promise(function(C,y){if(!(n!=null&&n.length)){C([]);return}var R=[],w=0,P=0;function j(){return T.apply(this,arguments)}function T(){return T=k()(M()().mark(function tn(){var B,K,z,x,V;return M()().wrap(function(g){for(;;)switch(g.prev=g.next){case 0:if(w!==(n==null?void 0:n.length)){g.next=2;break}return g.abrupt("return");case 2:return K=n[w],z=w,x=(B=v==null?void 0:v[z])!==null&&B!==void 0?B:[],w++,g.prev=6,g.next=9,K.apply(void 0,Oe()(x));case 9:V=g.sent,R[z]=V,g.next=17;break;case 13:g.prev=13,g.t0=g.catch(6),R[z]=g.t0,u||y(g.t0);case 17:return g.prev=17,P++,P===n.length&&(C(R),u||d==null||d.mutate(void 0)),j(),g.finish(17);case 22:case"end":return g.stop()}},tn,null,[[6,13,17,22]])})),T.apply(this,arguments)}for(var nn=Math.min(r,n==null?void 0:n.length),G=0;G<nn;G++)j()}));case 2:case"end":return E.stop()}},m)})),c.apply(this,arguments)}var d=(0,Be.Z)(a,F()({},s));return d}var Ze=f(54689),ke=f.n(Ze),je=f(63466),Ge=f.n(je),Ke=f(21140),xe=f.n(Ke),Ve=f(52510),I=f.n(Ve),Ye=Ge()(function n(){var e=this;xe()(this,n),I()(this,"subscriptions",new Map),I()(this,"emit",function(t,r){var o=ke()(e.subscriptions.get(t)||[]),u;try{for(o.s();!(u=o.n()).done;){var s=u.value;s(r)}}catch(a){o.e(a)}finally{o.f()}}),I()(this,"subscription",function(t,r){var o=(0,i.useRef)();o.current=r,(0,i.useEffect)(function(){function u(c){o.current&&o.current(c)}if(e.subscriptions.has(t)){var a=e.subscriptions.get(t);a.add(u)}else{e.subscriptions.set(t,new Set);var s=e.subscriptions.get(t);s.add(u)}return function(){e.subscriptions.delete(t)}},[])})});function Je(){var n=(0,i.useRef)();return n.current||(n.current=new Ye),n.current}function $e(n,e){var t=(0,i.useRef)({deps:e,val:void 0,initialized:!1}),r=t.current;return(r.initialized===!1||!U(r.deps,e))&&(r.deps=e,r.val=n(),r.initialized=!0),r.val}var Qe=f(80111),Xe=f(75317),qe=f.n(Xe);function _e(){var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:0,e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},t=qe()(n,F()({duration:1e3,enterance:!0,direct:!1,disabled:!1,decimals:2},e)),r=S()(t,2),o=r[0],u=r[1],s=(0,Qe.Z)(function(a){var c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;typeof a=="number"?u(a,c):typeof a=="function"&&u(a==null?void 0:a(),c)});return[o,s]}function en(n){var e=(0,i.useRef)(!0);if(e.current){e.current=!1;try{n()}catch(t){console.error(t)}}}}}]);
