Ext.define("Jarvus.ext.override.app.ControllerRouting",(function(){var c=new RegExp(/:([0-9A-Za-z\_]*)/g),a=[],b;return{override:"Ext.app.Application",requires:["Ext.util.History"],onBeforeLaunch:function(){var o=this,q=o.suspendLayoutUntilInitialRoute,j=Ext.util.History,g,n=0,t,m,u,d,s,l,r,k,f,e,i,h;if(q){Ext.suspendLayouts()}o.callParent(arguments);g=o.controllers.items;t=g.length;for(;n<t;n++){m=g[n];u=m.routes;if(Ext.isObject(u)){for(d in u){s=u[d];l=d.match(c)||[];r=s.conditions||{};k=d;for(f=0,e=l.length;f<e;f++){i=l[f];k=k.replace(i,"("+(r[i]||"[%a-zA-Z0-9-\\_\\s,]+")+")")}h={url:d,controller:m,matcherRegex:new RegExp("^"+k+"$")};if(Ext.isString(s)){h.action=s}else{Ext.apply(h,s)}a.push(h)}}}b=a.length;j.on("change","onHistoryChange",o);j.init(function(){var p=j.getToken();if(p){o.onHistoryChange(p)}if(q){Ext.resumeLayouts(true)}})},onHistoryChange:function(h){var g=0,f,d,e;for(;g<b;g++){f=a[g];d=h.match(f.matcherRegex);if(d){d.shift();e=f.controller;e[f.action].apply(e,d)}}},redirectTo:function(d){Ext.util.History.add(d,true)}}})(),function(){this.superclass.redirectTo=this.prototype.redirectTo});Ext.define("Jarvus.ext.override.util.EncodedHistory",{override:"Ext.util.History",add:function(a,b){if(Ext.data&&Ext.data.Model&&a instanceof Ext.data.Model&&Ext.isFunction(a.toUrl)){a=a.toUrl()}if(Ext.isArray(a)){a=Ext.Array.map(a,this.encodeRouteComponent).join("/")}return this.callParent([a,b])},encodeRouteComponent:function(a){return encodeURIComponent(Ext.isObject(a)?Ext.Object.toQueryString(a):(a||"")).replace(/\(/g,"%28").replace(/\)/g,"%29").replace(/%20/g,"+")},decodeRouteComponent:function(a){return decodeURIComponent((a||"").replace(/\+/g," "))}});Ext.define("Jarvus.ext.override.util.InstantHistory",{override:"Ext.util.History",setHash:function(a){this.callParent([a]);this.handleStateChange(a)},handleStateChange:function(a){if(this.currentToken!=a){this.callParent([a])}}});Ext.define("Jarvus.ext.override.util.PushHistory",{override:"Ext.util.History",pageTitleSeparator:" &mdash; ",pushPath:function(a,d){var c=this,b=c.pageTitleDom,e=c.pageTitleBase;if(d){if(!b){b=c.pageTitleDom=document.querySelector("title");e=c.pageTitleBase=b.innerHTML}b.innerHTML=d+c.pageTitleSeparator+e}Ext.util.History.add(a,true)}});