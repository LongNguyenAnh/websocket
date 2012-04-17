<html>
<head>
	<title>WebSocket</title>
	<link rel="stylesheet" href="css/style.css" type="text/css" />
	<script src="js//jquery.js"></script>
	<script src="js/showdown.js"></script>
	<script src="js/slides.js"></script>
	<script src="js/java.js"></script>
</head>
<body>
	<div id="container">
		<div id="right-bar">
			<div id="users">
				<div id="myuser">
					<div id="myusernameform">
						<span id="titlebar"></span>
						<input type="text" id="myusernameedit" class="myusernameedithoverable editable editactive"/>
					</div>
				</div>
				<!--
				<div id="otherusers">
					<div id="guestprompts"></div>
					<table id="otheruserstable" cellspacing="0" cellpadding="0" border="0">
						<tr><td>Tony</td></tr>
						<tr><td>Jonh</td></tr>
					</table>    
				</div>
			-->
			</div>
			<div id="chatbox" style="display: block">
				<div id="titlebar">
					<span id="titlelabel"></span>
				</div>
				<div id="chattext" class=""/>
				<div id="chatinputbox">
					<form>
						<input id="chatinput" type="text" maxlength="140"/>
					</form>
				</div>
			</div>
		</div>
		<div id="content"><!-- content area --></div>
	</div> <!--container-->
</body>
</html>