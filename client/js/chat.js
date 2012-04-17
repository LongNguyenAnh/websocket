var chatManager = {
	socket : null,
	clientID : null,
	keyPress : function() {
		var that = this;
		$(document).keydown(function(event) {
			if ( event.keyCode === 13 ) {
				that.sendMsg($("#chatinput").val());
			}
		});
	},	
	sendMsg : function(text){
		this.socket = clientManager.getSocket();
		var payload = {
			type : "CHAT_MESSAGE",
			clientID : null,
			clientName : null,
			data : text,
			date : Date.now()
		};
		this.socket.send(JSON.stringify(payload));
	},
	receiveMsg : function(text) {
		$("#chattext").append(text+"<br>");
	}
}