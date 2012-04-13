#!/php -q
<?php  
// Run from command prompt > php -q websocket.demo.php

// Basic WebSocket demo echoes msg back to client
include "websocket.class.php";
$newSocket = new WebSocket("192.168.50.30","12345");
