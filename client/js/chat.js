var token=": ";

var chatManager = {
	socket : null,
	clientID : null,
	clientName : null,
	clientType : null,
	keyPress : function() {
		var that = this;
		$(document).keydown(function(event) {
			if ( event.keyCode === 13 ) {
				that.sendMsg($("#chatinput").val());
				$("#chatinput").val("");
			}
		});
	},	
	sendMsg : function(text){
		this.socket = clientManager.getSocket();
		this.clientID = clientManager.clientID;
		this.clientColor = clientManager.clientColor;
		this.clientType = clientManager.getCookie();
		var payload = {
			type : "CHAT_MESSAGE",
			clientID : this.clientID,
			clientName : $("#myusernameedit").val(),
			clientType : this.clientType,
			data : text,
			color : this.clientColor,
			date : Date.now()
		};
		if(payload.clientName === "")
		{
			alert("Please input a Name");
		}
		else
		{
			this.socket.send(JSON.stringify(payload));
		}
	},
	receiveMsg : function(msg) {
		$("#chattext").append('<span style="color:'+ msg.color + '">' + msg.clientName + '</span>' + token + msg.data +'<br>');
	}
}