if (!Object.prototype.Inherits) {
Object.defineProperty(Object.prototype, "Inherits", {value: function( parent )
{
	parent.apply(this, Array.prototype.slice.call(arguments, 1));
}});

Object.defineProperty(Function.prototype, "Inherits", {value: function( parent )
{
	var dummyType = (new Function("return function " + parent.name + "() {}"))();
	dummyType.prototype = parent.prototype;
	this.prototype = new dummyType();
	Object.defineProperty(this.prototype, "constructor", {value: this});
}});
}
function is_instance_of(a, b) {
	return (a instanceof b);
}
