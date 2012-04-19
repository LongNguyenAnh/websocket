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
	}
}
