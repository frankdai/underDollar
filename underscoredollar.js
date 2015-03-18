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
	}
	var UnderDollar=function (elements) {
		var i;
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
		this.version='0.1';
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
				this.addEventListener(type,function(event){
					callback.call(this,event);
				},false)
			})
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
		//logic operation
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
		//DOM manipulation 
		contains:function(element) {
			return this.some(function(){
				return this===element;
			})
		},
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
			return new UnderDollar(results)
		},
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
		appendTo:function(target) {
			return this.each(function(){
				target.appendChild(this)
			})
		},
		prependTo:function(target){
			return this.each(function(){
				target.insertBefore(this,target.firstChild);
			})
		},
		remove:function(){
			return this.each(function(){
				this.parentNode.removeChild(this)
			})
		},
		html:function(string){
			var results=[];
			if (!string) {
				utility.forEach(this,function(key,value){
					results.push(this.innerHTML)
				})
				return results;
			}
			else {
				string=utility.stripScripts(string);
				return this.each(function(){
					this.innerHTML=string;
				})
			}
		},
	}
	window._$=function(elements) {
		return new UnderDollar(elements)
	}
})(window)