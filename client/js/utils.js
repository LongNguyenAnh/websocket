//this file contains utility functions
var utility = {
	var self = this;
	// GUID generator
	guidGenerator: function() {
		var S4 = function() {
			return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		};
		return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	};

	// shorhand for get element by id
	element: function(id) {
		return document.getElementById(id);
	};
}