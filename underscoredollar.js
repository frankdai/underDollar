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
			var i,key;
			if (obj.length) {
				for (i=0;i<obj.length;i++){
					callback.call(obj[i],i);
				}
			}
			else if (typeof obj==='object') {
				for ( key in obj ) {
					callback.call(obj[key],key);
				}
			}
		},
		toArray:function(obj){
			var result=[];
			utility.forEach(obj,function(){
				result.push(this);
			})
			return result;
		},
	}
	var UnderDollar=function (elements) {
		var i;
		if (elements.length) {
			for (i=0;i<elements.length;i++) {
			this[i]=elements[i];
			}	
		} 
		else {
			this[0]=elements;
		} 
		this.length=elements.length||1;
		this.constructor=window._$;
		this.splice=function(){};//hacking the console output http://stackoverflow.com/questions/11886578
		return this;
	}
	UnderDollar.prototype={
		each:function(fn){
			if (typeof fn==='function') {
				for (i=0;i<this.length;i++) {
					fn.call(this[i],i,this[i])
				}
			}
			return this;
		},
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
		once:function(){
			
		},
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
			var result,i;
			if (!this.length) {return;}
			for (var i=0;i<this.length;i++) {
				if (this[i].className.indexOf(value)>=0) {
					result=true;
					break
				}
				else {
					result=false;
				}
			}
			return result;
		},
		eq:function(index){
			return new UnderDollar(this[index]);
		},
	}
	window._$=function(elements) {
		return new UnderDollar(elements)
	}
})(window)