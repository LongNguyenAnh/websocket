var clientManager = {
	socket : null,
	url : null,
	connect : function() {
		var that = this;
		this.url = window.location.hostname;
		var host = "ws://"+this.url+":12345";

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
	//clientID : this.guidGenerator(),
	getSocket : function () {
		return this.socket;
	},
	getClientID : function () {
		return this.clientID;
	}
}