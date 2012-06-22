/*v0.46*/var CartoDB=CartoDB||{};if(typeof(google.maps.CartoDBLayer)==="undefined"){function CartoDBLayer(a){this.extend(CartoDBLayer,google.maps.OverlayView);this.options={query:"SELECT * FROM {{table_name}}",opacity:1,auto_bound:false,debug:false,visible:true,layer_order:"top",tiler_domain:"cartodb.com",tiler_port:"80",tiler_protocol:"http",sql_domain:"cartodb.com",sql_port:"80",sql_protocol:"http"};this.options=this._extend({},this.options,a);if(!this.options.table_name||!this.options.map){if(this.options.debug){throw ("cartodb-gmapsv3 needs at least a CartoDB table name and the gmapsv3 map object :(")}else{return}}this.initialize();this.setMap(a.map)}CartoDBLayer.prototype.extend=function(b,a){return(function(c){for(var d in c.prototype){this.prototype[d]=c.prototype[d]}return this}).apply(b,[a])};CartoDBLayer.prototype.initialize=function(){if(this.options.auto_bound){this.setBounds()}if(this.options.map_style){this._setMapStyle()}this._addWadus()};CartoDBLayer.prototype.draw=function(){};CartoDBLayer.prototype.onAdd=function(a){this._addInteraction()};CartoDBLayer.prototype.onRemove=function(a){this._remove()};CartoDBLayer.prototype.setOpacity=function(a){if(isNaN(a)||a>1||a<0){if(this.options.debug){throw (a+" is not a valid value")}else{return}}this.options.opacity=a;this._update()};CartoDBLayer.prototype.setQuery=function(a){if(!isNaN(a)){if(this.options.debug){throw (a+" is not a valid query")}else{return}}this.options.query=a;this._update()};CartoDBLayer.prototype.setStyle=function(a){if(!isNaN(a)){if(this.options.debug){throw (a+" is not a valid style")}else{return}}this.options.tile_style=a;this._update()};CartoDBLayer.prototype.setInteractivity=function(a){if(!isNaN(a)){if(this.options.debug){throw (a+" is not a valid setInteractivity value")}else{return}}this.options.interactivity=a;this._update()};CartoDBLayer.prototype.setLayerOrder=function(a){if(isNaN(a)&&a!="top"&&a!="bottom"){if(this.options.debug){throw (a+" is not a valid layer position")}else{return}}if(this.layer.gmaps_index){delete this.layer.gmaps_index}this.options.layer_order=a;this._setLayerOrder()};CartoDBLayer.prototype.setInteraction=function(b){if(b!==false&&b!==true){if(this.options.debug){throw (b+" is not a valid setInteraction value")}else{return}}if(this.interaction){if(b){var a=this;this.interaction.on("on",function(c){a._bindWaxEvents(a.options.map,c)})}else{this.interaction.off("on")}}};CartoDBLayer.prototype.setOptions=function(a){if(typeof a!="object"||a.length){if(this.options.debug){throw (a+" options has to be an object")}else{return}}this.options=this._extend({},this.options,a);this._update()};CartoDBLayer.prototype.hide=function(){this.options.visible=false;this.options.before=this.options.opacity;this.setOpacity(0);this.setInteraction(false)};CartoDBLayer.prototype.show=function(){this.options.visible=true;this.setOpacity(this.options.before);delete this.options.before;this.setInteraction(true)};CartoDBLayer.prototype.isVisible=function(){return this.options.visible};CartoDBLayer.prototype._remove=function(){this.setInteraction(false);var a=this;this.options.map.overlayMapTypes.forEach(function(c,b){if(c==a.layer){a.options.map.overlayMapTypes.removeAt(b);return}})};CartoDBLayer.prototype._update=function(){this._remove();this._addInteraction()};CartoDBLayer.prototype.setBounds=function(b){var a=this;if(!b){var b=this.options.query}reqwest({url:this._generateUrl("sql")+"/api/v2/sql/?q="+escape("SELECT ST_XMin(ST_Extent(the_geom)) as minx,ST_YMin(ST_Extent(the_geom)) as miny,ST_XMax(ST_Extent(the_geom)) as maxx,ST_YMax(ST_Extent(the_geom)) as maxy from ("+b.replace(/\{\{table_name\}\}/g,this.options.table_name)+") as subq"),type:"jsonp",jsonpCallback:"callback",success:function(p){if(p.rows[0].maxx!=null){var o=p.rows[0];var k=o.maxx;var i=o.maxy;var j=o.minx;var h=o.miny;var d=-85.0511;var f=85.0511;var l=-179;var m=179;var g=function(r,s,q){return r<s?s:r>q?q:r};k=g(k,l,m);j=g(j,l,m);i=g(i,d,f);h=g(h,d,f);var n=new google.maps.LatLng(i,k);var e=new google.maps.LatLng(h,j);var c=new google.maps.LatLngBounds(n,e);a.options.map.fitBounds(c)}},error:function(c,d){if(this.options.debug){throw ("Error getting table bounds: "+d)}}})};CartoDBLayer.prototype._addWadus=function(){var a=this;setTimeout(function(){if(!document.getElementById("cartodb_logo")){var b=document.createElement("a");b.setAttribute("id","cartodb_logo");b.setAttribute("style","position:absolute; bottom:3px; left:74px; display:block; border:none; z-index:100");b.setAttribute("href","http://www.cartodb.com");b.setAttribute("target","_blank");b.innerHTML="<img src='http://cartodb.s3.amazonaws.com/static/new_logo.png' alt='CartoDB' title='CartoDB' style='border:none;' />";a.options.map.getDiv().appendChild(b)}},2000)};CartoDBLayer.prototype._setMapStyle=function(){var a=this;reqwest({url:this._generateUrl("tiler")+"/tiles/"+this.options.table_name+"/map_metadata?callback=?",type:"jsonp",jsonpCallback:"callback",success:function(b){var d=json_parse(b.map_metadata);if(!d||d.google_maps_base_type=="roadmap"){a.map.setOptions({mapTypeId:google.maps.MapTypeId.ROADMAP})}else{if(d.google_maps_base_type=="satellite"){a.map.setOptions({mapTypeId:google.maps.MapTypeId.SATELLITE})}else{if(d.google_maps_base_type=="terrain"){a.map.setOptions({mapTypeId:google.maps.MapTypeId.TERRAIN})}else{var c=[{stylers:[{saturation:-65},{gamma:1.52}]},{featureType:"administrative",stylers:[{saturation:-95},{gamma:2.26}]},{featureType:"water",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"administrative.locality",stylers:[{visibility:"off"}]},{featureType:"road",stylers:[{visibility:"simplified"},{saturation:-99},{gamma:2.22}]},{featureType:"poi",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"road.arterial",stylers:[{visibility:"off"}]},{featureType:"road.local",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"transit",stylers:[{visibility:"off"}]},{featureType:"road",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"poi",stylers:[{saturation:-55}]}];d.google_maps_customization_style=c;a.map.setOptions({mapTypeId:google.maps.MapTypeId.ROADMAP})}}}if(!d){d={google_maps_customization_style:[]}}a.map.setOptions({styles:d.google_maps_customization_style})},error:function(b,c){if(params.debug){throw ("Error getting map style: "+c)}}})};CartoDBLayer.prototype._addInteraction=function(){var a=this;this.tilejson=this._generateTileJson();this.layer=new wax.g.connector(this.tilejson);this._setLayerOrder();if(this.options.interactivity){this.interaction=wax.g.interaction().map(this.options.map).tilejson(this.tilejson).on("on",function(b){a._bindWaxEvents(a.options.map,b)}).on("off",function(b){if(a.options.featureOut){return a.options.featureOut&&a.options.featureOut()}else{if(a.options.debug){throw ("featureOut function not defined")}}})}};CartoDBLayer.prototype._bindWaxEvents=function(b,c){var a=this._findPos(b,c),d=this.getProjection().fromContainerPixelToLatLng(a);switch(c.e.type){case"mousemove":if(this.options.featureOver){return this.options.featureOver(c.e,d,c.pos,c.data)}else{if(this.options.debug){throw ("featureOver function not defined")}}break;case"click":if(this.options.featureClick){this.options.featureClick(c.e,d,c.pos,c.data)}else{if(this.options.debug){throw ("featureClick function not defined")}}break;case"touchend":if(this.options.featureClick){this.options.featureClick(c.e,d,c.pos,c.data)}else{if(this.options.debug){throw ("featureClick function not defined")}}break;default:break}};CartoDBLayer.prototype._generateTileJson=function(){var b=this._generateUrl("tiler"),f=b+"/tiles/"+this.options.table_name+"/{z}/{x}/{y}",g=f+".png",a=f+".grid.json";if(this.options.query){var e="sql="+encodeURIComponent(this.options.query.replace(/\{\{table_name\}\}/g,this.options.table_name));g=this._addUrlData(g,e);a=this._addUrlData(a,e)}if(this.options.tile_style){var c="style="+encodeURIComponent(this.options.tile_style.replace(/\{\{table_name\}\}/g,this.options.table_name));g=this._addUrlData(g,c);a=this._addUrlData(a,c)}if(this.options.interactivity){var d="interactivity="+encodeURIComponent(this.options.interactivity.replace(/ /g,""));g=this._addUrlData(g,d);a=this._addUrlData(a,d)}return{blankImage:"../img/blank_tile.png",tilejson:"1.0.0",scheme:"xyz",name:this.options.table_name,tiles:[g],grids:[a],tiles_base:g,grids_base:a,opacity:this.options.opacity,formatter:function(h,i){return i}}};CartoDBLayer.prototype._setLayerOrder=function(){var a=this;this.options.map.overlayMapTypes.forEach(function(c,d){if(c==a.layer){a.options.map.overlayMapTypes.removeAt(d)}});if(this.layer.gmaps_index){this.options.map.overlayMapTypes.insertAt(this.layer.gmaps_index,this.layer);return}if(this.options.layer_order=="top"){this.options.map.overlayMapTypes.push(this.layer);return}if(this.options.layer_order=="bottom"){this.options.map.overlayMapTypes.insertAt(0,this.layer);return}var b=this.options.map.overlayMapTypes.getLength();if(this.options.layer_order>=b){this.options.map.overlayMapTypes.push(this.layer)}else{if(this.options.layer_order<=0){this.options.map.overlayMapTypes.insertAt(0,this.layer)}else{this.options.map.overlayMapTypes.insertAt(this.options.layer_order,this.layer)}}this.options.map.overlayMapTypes.forEach(function(c,d){c.gmaps_index=d})};CartoDBLayer.prototype._generateUrl=function(a){if(a=="sql"){return this.options.sql_protocol+"://"+((this.options.user_name)?this.options.user_name+".":"")+this.options.sql_domain+((this.options.sql_port!="")?(":"+this.options.sql_port):"")}else{return this.options.tiler_protocol+"://"+((this.options.user_name)?this.options.user_name+".":"")+this.options.tiler_domain+((this.options.tiler_port!="")?(":"+this.options.tiler_port):"")}};CartoDBLayer.prototype._parseUri=function(e){var d={strictMode:false,key:["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],q:{name:"queryKey",parser:/(?:^|&)([^&=]*)=?([^&]*)/g},parser:{strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/}},a=d.parser[d.strictMode?"strict":"loose"].exec(e),c={},b=14;while(b--){c[d.key[b]]=a[b]||""}c[d.q.name]={};c[d.key[12]].replace(d.q.parser,function(g,f,h){if(f){c[d.q.name][f]=h}});return c};CartoDBLayer.prototype._addUrlData=function(a,b){a+=(this._parseUri(a).query)?"&":"?";return a+=b};CartoDBLayer.prototype._extend=function(d){var c=Array.prototype.slice.call(arguments,1);for(var b=0,a=c.length,f;b<a;b++){f=c[b]||{};for(var e in f){if(f.hasOwnProperty(e)){d[e]=f[e]}}}return d};CartoDBLayer.prototype._findPos=function(b,c){var d=curtop=0;var a=b.getDiv();if(a.offsetParent){do{d+=a.offsetLeft;curtop+=a.offsetTop}while(a=a.offsetParent);return new google.maps.Point(c.pos.x-d,c.pos.y-curtop)}else{return new google.maps.Point(c.e)}}}var json_parse=(function(){var d,b,a={'"':'"',"\\":"\\","/":"/",b:"\b",f:"\f",n:"\n",r:"\r",t:"\t"},m,k=function(n){throw {name:"SyntaxError",message:n,at:d,text:m}},g=function(n){if(n&&n!==b){k("Expected '"+n+"' instead of '"+b+"'")}b=m.charAt(d);d+=1;return b},f=function(){var o,n="";if(b==="-"){n="-";g("-")}while(b>="0"&&b<="9"){n+=b;g()}if(b==="."){n+=".";while(g()&&b>="0"&&b<="9"){n+=b}}if(b==="e"||b==="E"){n+=b;g();if(b==="-"||b==="+"){n+=b;g()}while(b>="0"&&b<="9"){n+=b;g()}}o=+n;if(!isFinite(o)){k("Bad number")}else{return o}},h=function(){var q,p,o="",n;if(b==='"'){while(g()){if(b==='"'){g();return o}else{if(b==="\\"){g();if(b==="u"){n=0;for(p=0;p<4;p+=1){q=parseInt(g(),16);if(!isFinite(q)){break}n=n*16+q}o+=String.fromCharCode(n)}else{if(typeof a[b]==="string"){o+=a[b]}else{break}}}else{o+=b}}}}k("Bad string")},j=function(){while(b&&b<=" "){g()}},c=function(){switch(b){case"t":g("t");g("r");g("u");g("e");return true;case"f":g("f");g("a");g("l");g("s");g("e");return false;case"n":g("n");g("u");g("l");g("l");return null}k("Unexpected '"+b+"'")},l,i=function(){var n=[];if(b==="["){g("[");j();if(b==="]"){g("]");return n}while(b){n.push(l());j();if(b==="]"){g("]");return n}g(",");j()}}k("Bad array")},e=function(){var o,n={};if(b==="{"){g("{");j();if(b==="}"){g("}");return n}while(b){o=h();j();g(":");if(Object.hasOwnProperty.call(n,o)){k('Duplicate key "'+o+'"')}n[o]=l();j();if(b==="}"){g("}");return n}g(",");j()}}k("Bad object")};l=function(){j();switch(b){case"{":return e();case"[":return i();case'"':return h();case"-":return f();default:return b>="0"&&b<="9"?f():c()}};return function(q,o){var n;m=q;d=0;b=" ";n=l();j();if(b){k("Syntax error")}return typeof o==="function"?(function p(u,t){var s,r,w=u[t];if(w&&typeof w==="object"){for(s in w){if(Object.prototype.hasOwnProperty.call(w,s)){r=p(w,s);if(r!==undefined){w[s]=r}else{delete w[s]}}}}return o.call(u,t,w)}({"":n},"")):n}}());
!function(d,c){typeof module!="undefined"?module.exports=c():typeof define=="function"&&define.amd?define(d,c):this[d]=c()}("reqwest",function(){function handleReadyState(a,b,c){return function(){a&&a[readyState]==4&&(twoHundo.test(a.status)?b(a):c(a))}}function setHeaders(a,b){var c=b.headers||{},d;c.Accept=c.Accept||defaultHeaders.accept[b.type]||defaultHeaders.accept["*"],!b.crossOrigin&&!c[requestedWith]&&(c[requestedWith]=defaultHeaders.requestedWith),c[contentType]||(c[contentType]=b.contentType||defaultHeaders.contentType);for(d in c){c.hasOwnProperty(d)&&a.setRequestHeader(d,c[d])}}function generalCallback(a){lastValue=a}function urlappend(a,b){return a+(/\?/.test(a)?"&":"?")+b}function handleJsonp(a,b,c,d){var e=uniqid++,f=a.jsonpCallback||"callback",g=a.jsonpCallbackName||"reqwest_"+e,h=new RegExp("((^|\\?|&)"+f+")=([^&]+)"),i=d.match(h),j=doc.createElement("script"),k=0;i?i[3]==="?"?d=d.replace(h,"$1="+g):g=i[3]:d=urlappend(d,f+"="+g),win[g]=generalCallback,j.type="text/javascript",j.src=d,j.async=!0,typeof j.onreadystatechange!="undefined"&&(j.event="onclick",j.htmlFor=j.id="_reqwest_"+e),j.onload=j.onreadystatechange=function(){if(j[readyState]&&j[readyState]!=="complete"&&j[readyState]!=="loaded"||k){return !1}j.onload=j.onreadystatechange=null,j.onclick&&j.onclick(),a.success&&a.success(lastValue),lastValue=undefined,head.removeChild(j),k=1},head.appendChild(j)}function getRequest(a,b,c){var d=(a.method||"GET").toUpperCase(),e=typeof a=="string"?a:a.url,f=a.processData!==!1&&a.data&&typeof a.data!="string"?reqwest.toQueryString(a.data):a.data||null,g;return(a.type=="jsonp"||d=="GET")&&f&&(e=urlappend(e,f),f=null),a.type=="jsonp"?handleJsonp(a,b,c,e):(g=xhr(),g.open(d,e,!0),setHeaders(g,a),g.onreadystatechange=handleReadyState(g,b,c),a.before&&a.before(g),g.send(f),g)}function Reqwest(a,b){this.o=a,this.fn=b,init.apply(this,arguments)}function setType(a){var b=a.match(/\.(json|jsonp|html|xml)(\?|$)/);return b?b[1]:"js"}function init(o,fn){function complete(a){o.timeout&&clearTimeout(self.timeout),self.timeout=null,o.complete&&o.complete(a)}function success(resp){var r=resp.responseText;if(r){switch(type){case"json":try{resp=win.JSON?win.JSON.parse(r):eval("("+r+")")}catch(err){return error(resp,"Could not parse JSON in response",err)}break;case"js":resp=eval(r);break;case"html":resp=r}}fn(resp),o.success&&o.success(resp),complete(resp)}function error(a,b,c){o.error&&o.error(a,b,c),complete(a)}this.url=typeof o=="string"?o:o.url,this.timeout=null;var type=o.type||setType(this.url),self=this;fn=fn||function(){},o.timeout&&(this.timeout=setTimeout(function(){self.abort()},o.timeout)),this.request=getRequest(o,success,error)}function reqwest(a,b){return new Reqwest(a,b)}function normalize(a){return a?a.replace(/\r?\n/g,"\r\n"):""}function serial(a,b){var c=a.name,d=a.tagName.toLowerCase(),e=function(a){a&&!a.disabled&&b(c,normalize(a.attributes.value&&a.attributes.value.specified?a.value:a.text))};if(a.disabled||!c){return}switch(d){case"input":if(!/reset|button|image|file/i.test(a.type)){var f=/checkbox/i.test(a.type),g=/radio/i.test(a.type),h=a.value;(!f&&!g||a.checked)&&b(c,normalize(f&&h===""?"on":h))}break;case"textarea":b(c,normalize(a.value));break;case"select":if(a.type.toLowerCase()==="select-one"){e(a.selectedIndex>=0?a.options[a.selectedIndex]:null)}else{for(var i=0;a.length&&i<a.length;i++){a.options[i].selected&&e(a.options[i])}}}}function eachFormElement(){var a=this,b,c,d,e=function(b,c){for(var e=0;e<c.length;e++){var f=b[byTag](c[e]);for(d=0;d<f.length;d++){serial(f[d],a)}}};for(c=0;c<arguments.length;c++){b=arguments[c],/input|select|textarea/i.test(b.tagName)&&serial(b,a),e(b,["input","select","textarea"])}}function serializeQueryString(){return reqwest.toQueryString(reqwest.serializeArray.apply(null,arguments))}function serializeHash(){var a={};return eachFormElement.apply(function(b,c){b in a?(a[b]&&!isArray(a[b])&&(a[b]=[a[b]]),a[b].push(c)):a[b]=c},arguments),a}var context=this,win=window,doc=document,old=context.reqwest,twoHundo=/^20\d$/,byTag="getElementsByTagName",readyState="readyState",contentType="Content-Type",requestedWith="X-Requested-With",head=doc[byTag]("head")[0],uniqid=0,lastValue,xmlHttpRequest="XMLHttpRequest",isArray=typeof Array.isArray=="function"?Array.isArray:function(a){return a instanceof Array},defaultHeaders={contentType:"application/x-www-form-urlencoded",accept:{"*":"text/javascript, text/html, application/xml, text/xml, */*",xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript",js:"application/javascript, text/javascript"},requestedWith:xmlHttpRequest},xhr=win[xmlHttpRequest]?function(){return new XMLHttpRequest}:function(){return new ActiveXObject("Microsoft.XMLHTTP")};return Reqwest.prototype={abort:function(){this.request.abort()},retry:function(){init.call(this,this.o,this.fn)}},reqwest.serializeArray=function(){var a=[];return eachFormElement.apply(function(b,c){a.push({name:b,value:c})},arguments),a},reqwest.serialize=function(){if(arguments.length===0){return""}var a,b,c=Array.prototype.slice.call(arguments,0);return a=c.pop(),a&&a.nodeType&&c.push(a)&&(a=null),a&&(a=a.type),a=="map"?b=serializeHash:a=="array"?b=reqwest.serializeArray:b=serializeQueryString,b.apply(null,c)},reqwest.toQueryString=function(a){var b="",c,d=encodeURIComponent,e=function(a,c){b+=d(a)+"="+d(c)+"&"};if(isArray(a)){for(c=0;a&&c<a.length;c++){e(a[c].name,a[c].value)}}else{for(var f in a){if(!Object.hasOwnProperty.call(a,f)){continue}var g=a[f];if(isArray(g)){for(c=0;c<g.length;c++){e(f,g[c])}}else{e(f,a[f])}}}return b.replace(/&$/,"").replace(/%20/g,"+")},reqwest.compat=function(a,b){return a&&(a.type&&(a.method=a.type)&&delete a.type,a.dataType&&(a.type=a.dataType),a.jsonpCallback&&(a.jsonpCallbackName=a.jsonpCallback)&&delete a.jsonpCallback,a.jsonp&&(a.jsonpCallback=a.jsonp)),new Reqwest(a,b)},reqwest});
