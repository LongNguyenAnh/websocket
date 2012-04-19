var colorsArray = [ 'red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange' ];
	colorsArray.sort(function(a,b) { return Math.random() > 0.2; } );
var clientManager = {
	socket : null,
	url : null,
	clientID : null,
	clientColor : null,
	connect : function() {
		var that = this;
		this.url = window.location.hostname;
		var host = "ws://"+this.url+":12345";
		this.clientID = that.guidGenerator();
		this.clientColor = colorsArray.shift();
		if(this.socket==null){ 
			this.socket = new WebSocket(host);
		}
		this.socket.onopen = function (data){
		};
		this.socket.onmessage = function(data){
			that.parseJsonData(data);
		};
		this.socket.onclose = function(data){
		};
		this.socket.onerror = function(data){
			alert("message error");
		};
	},
	parseJsonData : function(msg) {
		var message = JSON.parse(msg.data);
		switch(message.type) {
			case "CHAT_MESSAGE":
				chatManager.receiveMsg(message);
				break;
			case "SLIDE_UPDATE":
				$("#content").html(message.data);
				break;
		};
	},		
	guidGenerator : function() {
		var S4 = function() {
			return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		};
		return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	},
	getSocket : function () {
		return this.socket;
	},
	getClientID : function () {
		return this.clientID;
	},
	getClientColor : function(){
		return this.clientColor;
	},

	getCookie = function(name) {
		//name = name.replace(/([.\\+\-*:\/?!|^${}()\[\]])/g, '\\$1');
	 	var re = new RegExp('[; ]' + name + '=([^\\s;]*)');
	 	var sMatch = (' ' + document.cookie).match(re);
	 
	 	if (name && sMatch) return unescape(sMatch[1]);
	}

	setCookie = function(name,value,days) {
		var now = new Date();
	 	var expDate = new Date();
	 	if (days==null || days==0) days=1;
	 	//create date after no of "days" from now
	 	expDate.setTime(now.getTime() + 3600000*24*days);
	 
	 	//create cookie with name, value and expire date
	 	document.cookie=name+"="+escape(value)+";expires="+expDate.toUTCString();
	}
}