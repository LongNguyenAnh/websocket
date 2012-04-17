
var chat = function(){
	sendChatMsg : function (msgBody,msgType) {
		var packet = {
			type : msgType,
			clientID : clientID,
			clientName : element("name").value,
			messageBody : msgBody,
			date : Date.now()
		};
		if(packet.clientName == null)
		SOCKET.send(JSON.stringify(packet));
	}
}