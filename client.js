var socket=null;
var url;
var token="^";

function connect(){
	url = window.location.hostname;
	var host = "ws://"+url+":12345";
	//don't open another socket if already open
	if(socket==null){ 
		socket = new WebSocket(host);
	}
	socket.onopen = function (msg){
		socket.send($("name").value+" has joined");
	};
	socket.onmessage = function(msg){
		log(unwrap(msg.data));
	};
	socket.onclose   = function(msg){
		//message sent from quit function
	};
	socket.onerror = function(msg){
		log("Error: message "+msg.data);
	}
	$("entry").focus();
}

function unwrap(msg) {
	var message = msg.split(token);
	return message;
}

function send(){
	var msg;
	msg = $("name").value+token+$("entry").value;
	if(socket.readyState!=1){ 
		alert("Please connect before sending message"); 
		return; 
	}

	try{ 
		socket.send(msg); 
	} 
	catch(ex){ 
		log(ex); 
	}
	//reset the text field after sending
	$("entry").value="";
}

function quit() {
	socket.send($("name").value+" has left");
	socket.close();
	socket=null;
}

// Utilities
function $(id){ return document.getElementById(id); }
function log(msg){
	if(msg[1]) {
		$("log").innerHTML+="<br>"+"<strong class=\"nick\">"+msg[0]+":"+"</strong>"+msg[1];
	}
	else{
		$("log").innerHTML+="<br>"+"<strong class=\"nick\">"+msg[0];
	}
}
function onkey(event){ if(event.keyCode==13){ send(); } }