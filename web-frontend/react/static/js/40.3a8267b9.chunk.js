(this["webpackJsonpmjc-apps"]=this["webpackJsonpmjc-apps"]||[]).push([[40],{508:function(e,a,t){"use strict";var r=t(18),s=t(48),n=t(2),c=t.n(n),l=t(60),o=t.n(l),m=t(502),u=t.n(m),i=t(503),f=o.a.oneOfType([o.a.number,o.a.string]),d={tag:i.q,noGutters:o.a.bool,className:o.a.string,cssModule:o.a.object,form:o.a.bool,xs:f,sm:f,md:f,lg:f,xl:f},b={tag:"div",widths:["xs","sm","md","lg","xl"]},p=function(e){var a=e.className,t=e.cssModule,n=e.noGutters,l=e.tag,o=e.form,m=e.widths,f=Object(s.a)(e,["className","cssModule","noGutters","tag","form","widths"]),d=[];m.forEach((function(a,t){var r=e[a];if(delete f[a],r){var s=!t;d.push(s?"row-cols-"+r:"row-cols-"+a+"-"+r)}}));var b=Object(i.m)(u()(a,n?"no-gutters":null,o?"form-row":"row",d),t);return c.a.createElement(l,Object(r.a)({},f,{className:b}))};p.propTypes=d,p.defaultProps=b,a.a=p},509:function(e,a,t){"use strict";var r=t(18),s=t(48),n=t(2),c=t.n(n),l=t(60),o=t.n(l),m=t(502),u=t.n(m),i=t(503),f=o.a.oneOfType([o.a.number,o.a.string]),d=o.a.oneOfType([o.a.bool,o.a.number,o.a.string,o.a.shape({size:o.a.oneOfType([o.a.bool,o.a.number,o.a.string]),order:f,offset:f})]),b={tag:i.q,xs:d,sm:d,md:d,lg:d,xl:d,className:o.a.string,cssModule:o.a.object,widths:o.a.array},p={tag:"div",widths:["xs","sm","md","lg","xl"]},g=function(e,a,t){return!0===t||""===t?e?"col":"col-"+a:"auto"===t?e?"col-auto":"col-"+a+"-auto":e?"col-"+t:"col-"+a+"-"+t},v=function(e){var a=e.className,t=e.cssModule,n=e.widths,l=e.tag,o=Object(s.a)(e,["className","cssModule","widths","tag"]),m=[];n.forEach((function(a,r){var s=e[a];if(delete o[a],s||""===s){var n=!r;if(Object(i.k)(s)){var c,l=n?"-":"-"+a+"-",f=g(n,a,s.size);m.push(Object(i.m)(u()(((c={})[f]=s.size||""===s.size,c["order"+l+s.order]=s.order||0===s.order,c["offset"+l+s.offset]=s.offset||0===s.offset,c)),t))}else{var d=g(n,a,s);m.push(d)}}})),m.length||m.push("col");var f=Object(i.m)(u()(a,m),t);return c.a.createElement(l,Object(r.a)({},o,{className:f}))};v.propTypes=b,v.defaultProps=p,a.a=v},514:function(e,a,t){"use strict";var r=t(18),s=t(48),n=t(2),c=t.n(n),l=t(60),o=t.n(l),m=t(502),u=t.n(m),i=t(503),f={tag:i.q,inverse:o.a.bool,color:o.a.string,body:o.a.bool,outline:o.a.bool,className:o.a.string,cssModule:o.a.object,innerRef:o.a.oneOfType([o.a.object,o.a.string,o.a.func])},d=function(e){var a=e.className,t=e.cssModule,n=e.color,l=e.body,o=e.inverse,m=e.outline,f=e.tag,d=e.innerRef,b=Object(s.a)(e,["className","cssModule","color","body","inverse","outline","tag","innerRef"]),p=Object(i.m)(u()(a,"card",!!o&&"text-white",!!l&&"card-body",!!n&&(m?"border":"bg")+"-"+n),t);return c.a.createElement(f,Object(r.a)({},b,{className:p,ref:d}))};d.propTypes=f,d.defaultProps={tag:"div"},a.a=d},515:function(e,a,t){"use strict";var r=t(18),s=t(48),n=t(2),c=t.n(n),l=t(60),o=t.n(l),m=t(502),u=t.n(m),i=t(503),f={tag:i.q,className:o.a.string,cssModule:o.a.object,innerRef:o.a.oneOfType([o.a.object,o.a.string,o.a.func])},d=function(e){var a=e.className,t=e.cssModule,n=e.innerRef,l=e.tag,o=Object(s.a)(e,["className","cssModule","innerRef","tag"]),m=Object(i.m)(u()(a,"card-body"),t);return c.a.createElement(l,Object(r.a)({},o,{className:m,ref:n}))};d.propTypes=f,d.defaultProps={tag:"div"},a.a=d},516:function(e,a,t){"use strict";var r=t(18),s=t(48),n=t(2),c=t.n(n),l=t(60),o=t.n(l),m=t(502),u=t.n(m),i=t(503),f={tag:i.q,className:o.a.string,cssModule:o.a.object},d=function(e){var a=e.className,t=e.cssModule,n=e.tag,l=Object(s.a)(e,["className","cssModule","tag"]),o=Object(i.m)(u()(a,"card-header"),t);return c.a.createElement(n,Object(r.a)({},l,{className:o}))};d.propTypes=f,d.defaultProps={tag:"div"},a.a=d},909:function(e,a,t){"use strict";t.r(a);var r=t(152),s=t(153),n=t(156),c=t(154),l=t(155),o=t(2),m=t.n(o),u=t(508),i=t(509),f=t(514),d=t(516),b=t(515),p=t(897),g=t(896),v=function(e){function a(){return Object(r.a)(this,a),Object(n.a)(this,Object(c.a)(a).apply(this,arguments))}return Object(l.a)(a,e),Object(s.a)(a,[{key:"render",value:function(){return m.a.createElement("div",{className:"animated fadeIn"},m.a.createElement(u.a,null,m.a.createElement(i.a,{xs:"12"},m.a.createElement(f.a,null,m.a.createElement(d.a,null,m.a.createElement("i",{className:"fa fa-align-justify"}),m.a.createElement("strong",null,"Breadcrumbs"),m.a.createElement("div",{className:"card-header-actions"},m.a.createElement("a",{href:"https://reactstrap.github.io/components/breadcrumbs/",rel:"noreferrer noopener",target:"_blank",className:"card-header-action"},m.a.createElement("small",{className:"text-muted"},"docs")))),m.a.createElement(b.a,null,m.a.createElement(p.a,null,m.a.createElement(g.a,{active:!0},"Home")),m.a.createElement(p.a,null,m.a.createElement(g.a,null,m.a.createElement("a",{href:"#"},"Home")),m.a.createElement(g.a,{active:!0},"Library")),m.a.createElement(p.a,null,m.a.createElement(g.a,null,m.a.createElement("a",{href:"#"},"Home")),m.a.createElement(g.a,null,m.a.createElement("a",{href:"#"},"Library")),m.a.createElement(g.a,{active:!0},"Data")),m.a.createElement(p.a,{tag:"nav"},m.a.createElement(g.a,{tag:"a",href:"#"},"Home"),m.a.createElement(g.a,{tag:"a",href:"#"},"Library"),m.a.createElement(g.a,{tag:"a",href:"#"},"Data"),m.a.createElement(g.a,{active:!0,tag:"span"},"Bootstrap")))))))}}]),a}(o.Component);a.default=v}}]);
//# sourceMappingURL=40.3a8267b9.chunk.js.map