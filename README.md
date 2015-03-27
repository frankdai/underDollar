# underDollar.js
A jQuery-style Javascript Library


Features:

 * Light-weight compared with jQuery
 * Support IE 9+ and other modern browser
 * Familiar API method provided by jQuery


## Usage
Simple import the underdollar.js or underdollar.min.js in the head section; It register two global variable underDollar and _$. It also supports CMD/AMD loading if you use 'define' method such as in requirejs. This library is dependence-free. 

The global underDollar and _$ is functions which will, when called, return a instance of UnderDollar class. All the instances share the same methods, as the same in jQuery. 


## API

###Methods
---
#### Selector
```javascript
_$(selector)
```
##### Arguments:

String: CSS selector to select the elements

Nodelist: Any DOM collections, such as returned by document.getElementsByClassName

HTMLElement: Any element, such as returned by document.getElementById

##### Return Value:

Instance of underDollar class, which is array-like object with enumrable length property;

---
#### .each(iterate):

#####Usage
Iterate all the members in the collection.

#####Arguments:

iterate:  Function will walk through all the members of the instance. Accept two optional arguments: index, element. Inside the function, this keyword will refer to the current element 

#####Return Value:

Instance itself. 

---

#### .on(event,listener):

#####Usage
Register event handler

#####

Event:string. DOM native event type.

Listener: Event handler function to be fired. The first argument is always the event object. 

#####Return Value:

Instance itself. 

---

#### .off(event,listener):

#####Usage
Remove event handler

#####Arguments:

Event:string. DOM native event type.

Listener: Function. Ananmyous function registered as event handler can not be removed. If this argument is not specified, all event handlers will be removed from elements.  

#####Return Value:

Instance itself. 

---

#### .once(event,listener):

#####Usage
Register event handler. Remove it immediately once fired

#####Arguments:

Event:string. DOM native event type.

Listener: Function. Event handler function to be fired only once. The first argument is always the event object. 

#####Return Value:

Instance itself. 
