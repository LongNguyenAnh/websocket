var SOCKET=null;
var CLIENTID = guidGenerator();
var URL;
var MESSAGETYPE = {
	chat : 0,
	requestQuestion : 1,
	userSelected : 2,
	updateResults: 3
};

function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

function sendMsg(msgBody,msgType){
	var packet = {
		type : msgType,
		clientID : CLIENTID,
		//clientName : $("name").value,
		messageBody : msgBody,
		date : Date.now()
	};
	SOCKET.send(JSON.stringify(packet));
	//reset the text field after sending
	//$("entry").value="";	
}

function nextQuestion(){
	var packet = {
		//escape the quotes to include them in the message
		type : MESSAGETYPE.requestQuestion,
		clientID : CLIENTID
	};
	SOCKET.send(JSON.stringify(packet));
}

function updateChoices(parsedMessage) {
	
}

function connect(){
	URL = window.location.hostname;
	var host = "ws://"+URL+":12345";
	//don't open another socket if already open
	if(SOCKET==null){ 
		SOCKET = new WebSocket(host);
	}
	SOCKET.onopen = function (msg){
		sendMsg("has joined",MESSAGETYPE.CHAT);
	};
	SOCKET.onmessage = function(msg){
		parse(msg);
	};
	SOCKET.onclose   = function(msg){
		//message sent from quit function
	};
	SOCKET.onerror = function(msg){
		log("Error: message "+msg.data);
	}
}

function parse(msg) {
	var message = JSON.parse(msg.data);
	//handle different 
	switch(message.type) {
		case MESSAGETYPE.chat:
			log(message);
			break;
		case MESSAGETYPE.requestQuestion:
			$("question").innerHTML = message.question;
			//reset the screen for the next question
			$("choices").innerHTML = "";
			for(var i in message.answers) {
				$("choices").innerHTML+= "<input type=\"radio\" id=\"choice"+i+"\" name=\"choice\" value=\""+message.answers[i]+"\" />"+
				"<label for="+message.answers[i]+" >"+message.answers[i]+"</label><br>";
			}
			//callCreateCanvas(message);
			break;
	}
}

function quit() {
	SOCKET.close();
	SOCKET=null;
}

// Utilitie
function $(id){
	return document.getElementById(id);
}

function log(msg){
	var time = new Date(msg.date);
	$("log").innerHTML+="<br>"+time.toLocaleTimeString()+"<strong class=\"nick\">"+msg.clientName+"</strong>"+msg.messageBody;
}

function onSelect() {
	var checked = false;
	for(var i=0; i<4; i++) {
		if($("choice"+i).checked) {
			
		}
	}
	if(!checked) { alert("Gotta make a selection, dude"); }

	return false;
}

function onkey(event){
	if(event.keyCode==13){
		sendMsg(($("entry").value),MESSAGETYPE.chat);
	} 
}

function createCanvas(divName) {		
	var div = document.getElementById(divName);
	var canvas = document.createElement('canvas');
	div.appendChild(canvas);
	if (typeof G_vmlCanvasManager != 'undefined') {
		canvas = G_vmlCanvasManager.initElement(canvas);
	}	
	var context = canvas.getContext("2d");
	context.fillstyle = '#22252a';
	return context;
}

function callCreateCanvas(msg) {
		var context = createCanvas("canvasarea");
		var graph = new BarGraph(context);
		graph.maxValue = 30;
		graph.margin = 2;
		graph.colors = ["#49a0d8", "#d353a0", "#ffc527", "#df4c27"];
		graph.xAxisLabelArr = msg.answers;
		setInterval(function () {
			graph.update([Math.random() * 30, Math.random() * 30, Math.random() * 30, Math.random() * 30]);
		}, 1000);
}