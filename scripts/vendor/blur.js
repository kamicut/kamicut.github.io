(function(e){e.fn.blurjs=function(t){function n(e,t,n,a,r,o){if(!(isNaN(o)||1>o)){o|=0;var u,c=e.getContext("2d");try{try{u=c.getImageData(t,n,a,r)}catch(d){try{netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead"),u=c.getImageData(t,n,a,r)}catch(d){throw alert("Cannot access local image"),Error("unable to access local image data: "+d)}}}catch(d){throw alert("Cannot access image"),Error("unable to access image data: "+d)}var p,h,f,m,g,v,y,M,b,w,x,_,V,E,T,k,A,S,L,C,j=u.data,D=o+o+1,N=a-1,I=r-1,O=o+1,P=O*(O+1)/2,F=new i,R=F;for(f=1;D>f;f++)if(R=R.next=new i,f==O)var $=R;R.next=F;var q=null,H=null;y=v=0;var B=s[o],U=l[o];for(h=0;r>h;h++){for(E=T=k=M=b=w=0,x=O*(A=j[v]),_=O*(S=j[v+1]),V=O*(L=j[v+2]),M+=P*A,b+=P*S,w+=P*L,R=F,f=0;O>f;f++)R.r=A,R.g=S,R.b=L,R=R.next;for(f=1;O>f;f++)m=v+((f>N?N:f)<<2),M+=(R.r=A=j[m])*(C=O-f),b+=(R.g=S=j[m+1])*C,w+=(R.b=L=j[m+2])*C,E+=A,T+=S,k+=L,R=R.next;for(q=F,H=$,p=0;a>p;p++)j[v]=M*B>>U,j[v+1]=b*B>>U,j[v+2]=w*B>>U,M-=x,b-=_,w-=V,x-=q.r,_-=q.g,V-=q.b,m=y+(N>(m=p+o+1)?m:N)<<2,E+=q.r=j[m],T+=q.g=j[m+1],k+=q.b=j[m+2],M+=E,b+=T,w+=k,q=q.next,x+=A=H.r,_+=S=H.g,V+=L=H.b,E-=A,T-=S,k-=L,H=H.next,v+=4;y+=a}for(p=0;a>p;p++){for(T=k=E=b=w=M=0,v=p<<2,x=O*(A=j[v]),_=O*(S=j[v+1]),V=O*(L=j[v+2]),M+=P*A,b+=P*S,w+=P*L,R=F,f=0;O>f;f++)R.r=A,R.g=S,R.b=L,R=R.next;for(g=a,f=1;o>=f;f++)v=g+p<<2,M+=(R.r=A=j[v])*(C=O-f),b+=(R.g=S=j[v+1])*C,w+=(R.b=L=j[v+2])*C,E+=A,T+=S,k+=L,R=R.next,I>f&&(g+=a);for(v=p,q=F,H=$,h=0;r>h;h++)m=v<<2,j[m]=M*B>>U,j[m+1]=b*B>>U,j[m+2]=w*B>>U,M-=x,b-=_,w-=V,x-=q.r,_-=q.g,V-=q.b,m=p+(I>(m=h+O)?m:I)*a<<2,M+=E+=q.r=j[m],b+=T+=q.g=j[m+1],w+=k+=q.b=j[m+2],q=q.next,x+=A=H.r,_+=S=H.g,V+=L=H.b,E-=A,T-=S,k-=L,H=H.next,v+=a}c.putImageData(u,t,n)}}function i(){this.r=0,this.g=0,this.b=0,this.a=0,this.next=null}var a=document.createElement("canvas"),r=!1,o=e(this).selector.replace(/[^a-zA-Z0-9]/g,"");if(a.getContext){t=e.extend({source:"body",radius:5,overlay:"",offset:{x:0,y:0},optClass:"",cache:!1,cacheKeyPrefix:"blurjs-",draggable:!1,debug:!1},t);var s=[512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,289,287,285,282,280,278,275,273,271,269,267,265,263,261,259],l=[9,11,12,13,13,14,14,15,15,15,15,16,16,16,16,17,17,17,17,17,17,17,18,18,18,18,18,18,18,18,18,19,19,19,19,19,19,19,19,19,19,19,19,19,19,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24];return this.each(function(){var i=e(this),s=e(t.source),l=s.css("backgroundImage").replace(/"/g,"").replace(/url\(|\)$/gi,"");ctx=a.getContext("2d"),tempImg=new Image,tempImg.onload=function(){if(r)var e=tempImg.src;else{a.style.display="none",a.width=tempImg.width,a.height=tempImg.height,ctx.drawImage(tempImg,0,0),n(a,0,0,a.width,a.height,t.radius),0!=t.overlay&&(ctx.beginPath(),ctx.rect(0,0,tempImg.width,tempImg.width),ctx.fillStyle=t.overlay,ctx.fill());var e=a.toDataURL();if(t.cache)try{t.debug&&console.log("Cache Set"),localStorage.setItem(t.cacheKeyPrefix+o+"-"+l+"-data-image",e)}catch(u){console.log(u)}}var c=s.css("backgroundAttachment"),d="fixed"==c?"":"-"+(i.offset().left-s.offset().left-t.offset.x)+"px -"+(i.offset().top-s.offset().top-t.offset.y)+"px";i.css({"background-image":'url("'+e+'")',"background-repeat":s.css("backgroundRepeat"),"background-position":d,"background-attachment":c}),0!=t.optClass&&i.addClass(t.optClass),t.draggable&&(i.css({"background-attachment":"fixed","background-position":"0 0"}),i.draggable())},Storage.prototype.cacheChecksum=function(e){var n="";for(var i in e){var a=e[i];n+="[object Object]"==""+a?(""+a.x+(""+a.y)+",").replace(/[^a-zA-Z0-9]/g,""):(a+",").replace(/[^a-zA-Z0-9]/g,"")}var r=this.getItem(t.cacheKeyPrefix+o+"-"+l+"-options-cache");r!=n&&(this.removeItem(t.cacheKeyPrefix+o+"-"+l+"-options-cache"),this.setItem(t.cacheKeyPrefix+o+"-"+l+"-options-cache",n),t.debug&&console.log("Settings Changed, Cache Emptied"))};var u=null;t.cache&&(localStorage.cacheChecksum(t),u=localStorage.getItem(t.cacheKeyPrefix+o+"-"+l+"-data-image")),null!=u?(t.debug&&console.log("Cache Used"),r=!0,tempImg.src=u):(t.debug&&console.log("Source Used"),tempImg.src=l)})}}})(jQuery);