(function(window) {
	/*Array indexOf pollyfill from MDN*/
	if (!Array.prototype.indexOf) {
  	Array.prototype.indexOf = function(searchElement, fromIndex) {
    	var k;
    	if (this == null) {
      		throw new TypeError('"this" is null or not defined');
    	}
    	var O = Object(this);
    	var len = O.length >>> 0;
    	if (len === 0) {
      		return -1;
    	}
    	var n = +fromIndex || 0;
    	if (Math.abs(n) === Infinity) {
     		 n = 0;
    	}
    	if (n >= len) {
      		return -1;
    	}
    	k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
    	while (k < len) {
      		if (k in O && O[k] === searchElement) {
        	return k;
      	}
      		k++;
    	}
    	return -1;
  	};
	}
	//libraray-specific private functions
	var utility={
		ifClassList:function(){
			return !!document.body.classList;
		},
		ifEventListener:function(){
			return !!window.addEventListener;
		},
		forEach:function(obj,callback){
			var i,key,value;
			if (obj.length) {
				for (i=0;i<obj.length;i++){
					value=callback.call(obj[i],i,obj[i]);
				}
			}
			else if (typeof obj==='object') {
				for ( key in obj ) {
					value=callback.call(obj[key],key,obj[key]);
				}
			}
			return value;
		},
		toArray:function(obj){
			var result=[];
			utility.forEach(obj,function(){
				result.push(this);
			})
			return result;
		},
		checkDom:function(elements) {
			if (elements.length) {
				if (elements[0].tagName)
				return true
			}
			else if (elements.tagName) {
				return true
			}
			else {
				return false
			}
		},
		camelCase:function(input) {
    		var result=input.toLowerCase().replace(/-(.)/g, function(match, group1) {
        		return group1.toUpperCase();
    		});
			return result.replace(result[0],result[0].toLowerCase())
		},
		stripScripts:function(s) {
    		var div = document.createElement('div');
    		div.innerHTML = s;
		    var scripts = div.getElementsByTagName('script');
		    var i = scripts.length;
		    while (i--) {
		      scripts[i].parentNode.removeChild(scripts[i]);
		    }
		    return div.innerHTML;
  		},
  		copy:function(elements) {
  			var results=[];
  			utility.forEach(elements,function(){
  				results.push(this.cloneNode(true))
  			})
  			return new UnderDollar(results);
  		},
  		animate:function(element,property,initValue,finalValue,time,callback){
			var step,t
			var pace=parseInt(initValue);
			var suffix=finalValue.indexOf('%')>0?'%':'px';
			property=utility.camelCase(property);
			element.style[property]=initValue;
			if (parseInt(finalValue)>parseInt(initValue)){
				step=(parseInt(finalValue)-parseInt(initValue))/(time/(1000/60));
				t=window.setInterval(function(){
					if (pace<parseInt(finalValue)) {
						pace+=step;
						element.style[property]=pace.toFixed(2)+suffix
					}
					else {
						window.clearInterval(t);
						callback()
					}
				},17)
			}
			else {
				step=(parseInt(initValue)-parseInt(finalValue))/(time/(1000/60));
				t=window.setInterval(function(){
					if (pace>parseInt(finalValue)) {
						pace-=step;
						element.style[property]=pace.toFixed(6)+suffix;
					}
					else {
						window.clearInterval(t);
						callback()
					}
				},17)
			}
		},
		mergeOptions:function(obj1,obj2) {
	        var obj3={};
	        for (var key in obj1) {
	            obj3[key]=obj1[key];
	        }
	        for (var key in obj2) {
	            obj3[key]=obj2[key];
	        }
	        return obj3;
    	},
	}
	var UnderDollar=function (elements) {
		var i;
		if (typeof elements==='string') {
			try {
				elements=document.querySelectorAll(elements);
			}
			catch (e) {
				console.log(e.message);
			}
		}
		if (!utility.checkDom(elements)) {
			throw new TypeError('not a DOM element')
		}
		if (elements.length) {
			for (i=0;i<elements.length;i++) {
			this[i]=elements[i];
			}	
		} 
		else {
			this[0]=elements;
		} 
		this.dat={};
		this.length=elements.length||1;
		this.constructor=window._$;
		this.splice=function(){};//hacking the console output http://stackoverflow.com/questions/11886578
		return this;
	}
	UnderDollar.prototype={
		//basic looping function
		each:function(fn){
			if (typeof fn==='function') {
				for (i=0;i<this.length;i++) {
					fn.call(this[i],i,this[i])
				}
			}
			return this;
		},
		//event handler
		on:function(type,callback){
			return this.each(function(){
				if (utility.ifEventListener()){
					this.addEventListener(type,function(event){
						callback.call(this,event);
					},false);
				}
				else if (window.attachEvent) {
					this.attachEvent('on'+type,callback);
				} 
				else {
					this['on'+type]=callback;
				}
			});
		},
		off:function(type,listener){
			return this.each(function(){
				var clone;
				if (listener) {
					this.removeEventListener(type,listener,false)
				}
				else {
					clone=this.cloneNode(true); //remove all event listener including child nodes
					this.parentNode.replaceChild(clone,this);
				}
			})			
		},
		once:function(type,listener){
			var callback=function(eventObj){
				this.removeEventListener(type,callback);
				listener.call(this,eventObj);
			}
			if (typeof listener!=='function') {
				return;
			}
			return this.each(function(){
				this.addEventListener(type,callback,false);
			});
		},
		//class manipulation
		addClass:function(value){
			return this.each(function(){
				if (utility.ifClassList()){
					this.classList.add(value);
				}
				else {
					this.className+=" "+value;
				}
			});
		},
		removeClass:function(value){
			return this.each(function(){
				var name=this.className;
				var array=name.split(" ");
				var pos=array.indexOf(value);
				if (utility.ifClassList()){
					this.classList.remove(value);
					return;
				}
				if (pos>=0) {
					array.splice(pos,1);
					this.className=array.join(' ');
				}
				else {
					return;
				}
				if (this.className==="") {
					this.removeAttribute('class');
				}
			})
		},
		hasClass:function(value){
			if (!utility.ifClassList()) {
				return this.some(function(){
					return this.classList.contains(value);
				})
			}
			else {
				return this.some(function(){
					var name=this.className;
					var array=name.split(" ");
					return array.indexOf(value)>=0;
				})
			}
		},
		//collection
		eq:function(index){
			return new UnderDollar(this[index]);
		},
		some:function(fn){
			var flag,i;
			for (i=0;i<this.length;i++){
				if (fn.call(this[i])===true) {
					return flag=true;
				}
				else {
					flag=false;
				}
			}
			return flag
		},
		every:function(fn){
			var flag,i;
			for (i=0;i<this.length;i++){
				if (fn.call(this[i])===false) {
					return flag=false;
				}
				else {
					flag=true;
				}
			return flag
			}
		},
		filter:function(fn){
			var results=[];
			this.each(function(){
				if (fn.call(this)===true) {
					results.push(this);
				}
			})
			return new UnderDollar(results);
		},
		contains:function(element) {
			return this.some(function(){
				return this===element;
			})
		},
		map:function(fn) {
			return this.each(function(){
				fn.call(this)
			});
		},
		//DOM traversing
		parent:function(){
			var self={};
			if (this.length!==0) {
				this.each(function(index){
					self[index]=this.parentNode;
				})
				self.length=this.length;		
			}
			else if (this.length===0) {
				self=this[0];
			}
			return new UnderDollar(self);
		},
		children:function(){
			var element=this[0];
			var nodelist=element.childNodes;
			var results=[];
			utility.forEach(nodelist,function(key,value){
				if (this.nodeType===1) {
					results.push(this);
				}
			})
			if (results[0]!==undefined) {
				return new UnderDollar(results);
			}
			else {
				return null
			}
		},
		//DOM manipulation 
		create:function(tagName,attr,html) {
			if (typeof tagName!=='string') {return};
			var element=document.createElement(tagName);
			if (html) {html=utility.stripScripts(html);}
			if (typeof attr==='object') {
				utility.forEach(attr,function(key,value){
					value=value.toString();
					element.setAttribute(key,value);
				});
				element.innerHTML=html||'';
			}
			else if (typeof attr==='string') {
				element.innerHTML=attr;
			}
			return new UnderDollar(element);
		},
		appendTo:function(target,ifCopy) {
			var that;
			if (ifCopy) {
				that=this.copy();
			}
			else {
				that=this;
			}
			return that.each(function(){
				target.appendChild(this)
			})
		},
		prependTo:function(target,ifCopy){
			var that;
			var child=target.firstChild;
			if (ifCopy) {
				that=this.copy();
			}
			else {
				that=this;
			}
			return that.each(function(){
				target.insertBefore(this,child);
			})
		},
		append:function(child){
			return this.each(function(){
				this.appendChild(child);
				child=child.cloneNode(true);
			})
		},
		prepend:function(child) {
			return this.each(function(){
				this.insertBefore(child,this.firstChild);
				child=child.cloneNode(true);
			});
		},
		insertBefore:function(target){
			return this.each(function(){
				target.parentNode.insertBefore(this,target);
			})
		},
		insertAfter:function(target){
			var sibling=target.nextSibling;
			console.log(sibling);
			while (sibling.nodeType!==1) {
				sibling=sibling.nextSibling;
			}
			return this.each(function(){
				sibling.parentNode.insertBefore(this,sibling);
			})
		},
		remove:function(){
			return this.each(function(){
				this.parentNode.removeChild(this)
			})
		},
		replace:function(){

		},
		html:function(string){
			var results=[];
			if (!string) {
				if (this.length>1) {
					utility.forEach(this,function(key,value){
						results.push(this.innerHTML)
					})
					return results;
				}
				else {
					return this[0].innerHTML;
				}
			}
			else {
				if (typeof string==='string'){
					string=utility.stripScripts(string);
					return this.each(function(){
						this.innerHTML=string;
					})
				}
				else if (string instanceof Array) {
					return this.each(function(index){
						this.innerHTML=utility.stripScripts(string[index]);
					})
				}
			}
		},
		copy:function(){
			return utility.copy(this);
		},
		//css style
		css:function(key,value){
			var array=[];
			if (typeof key==='object') {
				return this.each(function(){
					var that=this;
					utility.forEach(key,function(key,value){
						var covert=utility.camelCase(key);
						if (typeof value==='number') {value=value+'px';}
						that.style[covert]=value;
					})
				})
			}
			else if (typeof key==='string') {
				if (value) {
					return this.each(function(){
						var covert=utility.camelCase(key);
						if (typeof value==='number') {value=value+'px';}
						this.style[covert]=value;
					});
				}
				else {
					this.each(function(){
						var covert=utility.camelCase(key);
						var style=window.getComputedStyle(this)[covert];
						array.push(style);
					});
					return array.length===1?array[0]:array;
				}
			}
		},
		//dimension and position
		width:function(){
			return this[0].offsetWidth;
		},
		height:function(){
			return this[0].offsetHeight;
		},
		innerWidth:function(){
			return this[0].clientWidth;
		},
		innerHeight:function(){
			return this[0].clientHeight;
		},
		position:function(){

		},
		//animation
		animate:function(property,options){
			var defaults={
				'from':this.eq(0).css(property),
				'to':this.eq(0).css(property),
				'duration':400,
				'callback':function(){},
			}
			var lengthValue=['width','height','margin','padding','margin','left','top','bottom','right'];
			var numericValue=['opacity']
			options=utility.mergeOptions(defaults,options);
			utility.animate(this[0],property,options.from,options.to,options.duration,options.callback);
			return this;
		},
		hide:function() {
			var self=this;
			return this.each(function(){
				var displayType=window.getComputedStyle(this).display;
				this.style.display="none";
				this.setAttribute('data-originalDisplayValue',displayType)
			});
		},
		show:function(){
			return this.each(function(index){
				var style=this.getAttribute('data-originalDisplayValue');
				this.style.display=style;
				this.removeAttribute('data-originalDisplayValue')
			});
		},
		//misc

		//data
		data:function(attr,value) {
			var self=this;
			if (typeof attr==='object') {
				utility.forEach(attr,function(key,val){
					self.dat[key]=val;
				});
				return this
			}
			if (value!==undefined && typeof attr==='string')  {
					self.dat[attr]=value;
					return self
				}
			if (value===undefined && typeof attr==='string'){
				return this.dat[attr];
			}
			else {
				return this.dat;
			}
		}
	}
	window.UnderDollar=function(elements) {
		return new UnderDollar(elements);
	};
	window.UnderDollar.ajax=function(options){
		var defaults={
			'type':'GET',
			url:'/',
			beforeSend:function(){},
			loading:function(){},
			complete:function(){},
			error:function(){},
		};
		options=utility.mergeOptions(defaults,options);
		var xhr=new XMLHttpRequest();
		xhr.open(options.type,options.url,true);
		//xhr.setRequestHeader(options.request.head,options.request.value);
		if (options.data) {
			xhr.send(options.data);
		}
		else {
			xhr.send()
		}
		xhr.onreadystatechange=function(){
			if (xhr.readyState==1) {
				options.beforeSend();
			}
			if (xhr.readyState==3) {
				options.loading();
			}
			if (xhr.readyState==4 && xhr.status==200) {
				options.complete.call(this,xhr.response)
			}
			if (xhr.readyState==4 && xhr.status!==200) {
				options.error.call(this)
			}
		}
	};
	window.UnderDollar.extend=function(obj){
		utility.forEach(obj,function(key,func){
			if (typeof key==='string'&&typeof func==='function'){
				UnderDollar.prototype[key]=func;
			}
		});
	};
	window._$=window.UnderDollar;
})(window)