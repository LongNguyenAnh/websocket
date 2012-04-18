var token=": ";
var chatManager = {
	socket : null,
	clientID : null,
	clientName : null,
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
		var payload = {
			type : "CHAT_MESSAGE",
			clientID : this.clientID,
			clientName : $("#myusernameedit").val(),
			data : text,
			date : Date.now()
		};
		this.socket.send(JSON.stringify(payload));
	},
	receiveMsg : function(msg) {
		if($("#myusernameedit").val() === "")
		{
			alert("Please input a Name");
		}
		else
		{$("#chattext").append("<b>" + msg.clientName + "</b>" + token + msg.data +"<br>");}
	}
}