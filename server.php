<?php  

class WebSocket{
	var $newSocket;
	var $socketsArray = array();
	var $clientsArray   = array();
	var $debug   = true;

	function __construct($address,$port){
		error_reporting(E_ALL);
		set_time_limit(0);
		ob_implicit_flush();
		//setup the new socket
		$this->newSocket=socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
		socket_set_option($this->newSocket, SOL_SOCKET, SO_REUSEADDR, 1);
		socket_bind($this->newSocket, $address, $port);                
		socket_listen($this->newSocket,128);                           
		socket_set_nonblock($this->newSocket);
		$this->socketsArray[] = $this->newSocket;
		//log console message
		$this->say("Server Started : ".date("Y.m.d"));
		$this->say("Listening on   : ".$address." port ".$port);
		$this->say("Master socket  : ".$this->newSocket."\n");

		while(true){
			$changedSockets = $this->socketsArray;
			//watch sockets for changes
			$numChanges = socket_select($changedSockets,$write,$except,NULL);
			if($numChanges>0) {
				foreach($changedSockets as $socket){
					if($socket==$this->newSocket){
						//accept the new socket and check for errors
						$newSocketResource=socket_accept($socket);
						if(!$newSocketResource){
							$this->log("socket_accept() failed");
						}
						else{ 
							$this->connect($newSocketResource);
						}
					}
					else {
						$bytes = socket_recv($socket,$buffer,1024,0);
						if($bytes===0){ 
							$this->disconnect($socket); 
						}
						else{
							$client = $this->getClientSocket($socket);
							if(!$client->handshake){
								$this->doHandShake($client,$buffer);
							}
							else{
								$this->process($client,$this->unmask($buffer));
							}
						}
					}
				}//end for
			} //end if
		}
	}

	function process($client,$msg){

		foreach($this->clientsArray as $client)
		{
			$this->send($client->socket,$msg);
		}
	}

	function send($client,$buffer){ 
		$msg = $this->encode($buffer);
		$sentMsg=socket_write($client,$msg,strlen($msg));
		$this->say("Sending ".$msg." to ".$client);
	} 

	function connect($socket){
		$client = new Client();
		$client->socket = $socket;
		array_push($this->clientsArray,$client);
		array_push($this->socketsArray,$socket);
	}

	function disconnect($socket){
		$found=null;
		$n=count($this->clientsArray);
		for($i=0;$i<$n;$i++){
			if($this->clientsArray[$i]->socket==$socket){ $found=$i; break; }
		}
		if(!is_null($found)){ array_splice($this->clientsArray,$found,1); }
		$index=array_search($socket,$this->socketsArray);
		socket_close($socket);
		if($index>=0){ array_splice($this->socketsArray,$index,1); }
	}

	function doHandShake($client,$buffer){
		$this->log("{$buffer}\r\n");
		list($resource,$connection,$host,$origin,$version,$key,$key1,$key2,$l8b) = $this->getHeaders($buffer);
		
		if($connection != "Upgrade") {
			return false;
		}

		if(!$key) {		
			$upgrade  = "HTTP/1.1 101 WebSocket Protocol Handshake\r\n".
				"Upgrade: WebSocket\r\n".
				"Connection: Upgrade\r\n".
				"Sec-WebSocket-Origin: ".$origin."\r\n".
				"Sec-WebSocket-Location:ws://".$host.$resource."\r\n\r\n".
				$this->calcKey($key,$key1,$key2,$l8b)."\r\n";
		}
		else {
			$upgrade  = "HTTP/1.1 101 Switching Protocols\r\n" .
				"Upgrade: WebSocket\r\n".
				"Connection: Upgrade\r\n".
				"Sec-WebSocket-Accept: ".
				$this->calcKey($key,$key1,$key2,$l8b).
				"\r\n\r\n";
		}
		socket_write($client->socket,$upgrade,strlen($upgrade));
		$client->handshake=true;
		$this->log($upgrade);
		return true;
	}

	function calcKey($key,$key1,$key2,$l8b){
		$specGUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"; //for version 13 handshake		
		//Get the numbers
		preg_match_all('/([\d]+)/', $key1, $key1_num);
		preg_match_all('/([\d]+)/', $key2, $key2_num);
		//Number crunching [/bad pun]
		$this->log("Key1: " . $key1_num = implode($key1_num[0]) );
		$this->log("Key2: " . $key2_num = implode($key2_num[0]) );
		//Count spaces
		preg_match_all('/([ ]+)/', $key1, $key1_spc);
		preg_match_all('/([ ]+)/', $key2, $key2_spc);
		//How many spaces did it find?
		$this->log("Key1 Spaces: " . $key1_spc = strlen(implode($key1_spc[0])) );
		$this->log("Key2 Spaces: " . $key2_spc = strlen(implode($key2_spc[0])) );
		//Some math
		$key1_sec = pack("N",$key1_num / $key1_spc); //Get the 32bit secret key
		$key2_sec = pack("N",$key2_num / $key2_spc);

		if(!$key){
			return md5($key1_sec.$key2_sec.$l8b,1);
		}
		else {
			$shaEncoded=sha1($key.$specGUID, true);
			return base64_encode($shaEncoded); 
		}
	}

	function getHeaders($req){
		$resource=$connection=$host=$origin=$version=$key=$key1=$key2=null;

		if(preg_match("/GET (.*) HTTP/"               ,$req,$match)){ 
			$resource=$match[1];
		}
		if(preg_match("/Connection: (.*)\r\n/",$req,$match)){ 
			$connection=$match[1];
		}
		if(preg_match("/Host: (.*)\r\n/"              ,$req,$match)){ 
			$host=$match[1];
		}
		if(preg_match("/Origin: (.*)\r\n/"            ,$req,$match)){ 
			$origin=$match[1];
		}
		if(preg_match("/Sec-WebSocket-Key1: (.*)\r\n/",$req,$match)){ 
			$key1=$match[1];
			$this->log("Sec Key1: ".$key1);
		}
		if(preg_match("/Sec-WebSocket-Key2: (.*)\r\n/",$req,$match)){ 
			$key2=$match[1];
			$this->log("Sec Key2: ".$key2);
		}
		if(preg_match("/Sec-WebSocket-Key: (.*)\r\n/",$req,$match)){
			$key=$match[1];
			$this->log("WebSocket-key: ".$key);
		}
		if(preg_match("/Sec-WebSocket-Version (.*)\r\n/",$req,$match)) {
			$version = $match[1];
		}
		if($match=substr($req,-8)){
			$l8b=$match;
		}
		return array($resource,$connection,$host,$origin,$version,$key,$key1,$key2,$l8b);
	}

	function getClientSocket($socket){
		$found=null;
		foreach($this->clientsArray as $client){
			if($client->socket==$socket){ $found=$client; break; }
		}
		return $found;
	}

	function     say($msg){ echo $msg."\n"; }
	function     log($msg){ if($this->debug){ echo $msg."\n"; } }
	function    wrap($msg){ return chr(0).$msg.chr(255); }
	function  unwrap($msg){ return substr($msg,1,strlen($msg)-2); }
	private function unmask($payload) {
	    $length = ord($payload[1]) & 127;

	    if($length == 126) {
	        $masks = substr($payload, 4, 4);
	        $data = substr($payload, 8);
	    }
	    elseif($length == 127) {
	        $masks = substr($payload, 10, 4);
	        $data = substr($payload, 14);
	    }
	    else {
	        $masks = substr($payload, 2, 4);
	        $data = substr($payload, 6);
	    }

	    $text = '';
	    for ($i = 0; $i < strlen($data); ++$i) {
	        $text .= $data[$i] ^ $masks[$i%4];
	    }
	    return $text;
	}
	private function encode($text)
	{
	    // 0x1 text frame (FIN + opcode)
	    $b1 = 0x80 | (0x1 & 0x0f);
	    $length = strlen($text);

	    if($length <= 125)
	        $header = pack('CC', $b1, $length);
	    elseif($length > 125 && $length < 65536)
	        $header = pack('CCS', $b1, 126, $length);
	    elseif($length >= 65536)
	        $header = pack('CCN', $b1, 127, $length);

	    return $header.$text;
	}
}

class Client{
	var $socket;
	var $handshake;
}
?>
