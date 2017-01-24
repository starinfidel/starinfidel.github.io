$estr = function() { return js.Boot.__string_rec(this,''); }
if(typeof js=='undefined') js = {}
js.Boot = function() { }
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = (i != null?((i.fileName + ":") + i.lineNumber) + ": ":"");
	msg += js.Boot.__unhtml(js.Boot.__string_rec(v,"")) + "<br/>";
	var d = document.getElementById("haxe:trace");
	if(d == null) alert("No haxe:trace element defined\n" + msg);
	else d.innerHTML += msg;
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
	else null;
}
js.Boot.__closure = function(o,f) {
	var m = o[f];
	if(m == null) return null;
	var f1 = function() {
		return m.apply(o,arguments);
	}
	f1.scope = o;
	f1.method = m;
	return f1;
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ != null || o.__ename__ != null)) t = "object";
	switch(t) {
	case "object":{
		if(o instanceof Array) {
			if(o.__enum__ != null) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				{
					var _g1 = 2, _g = o.length;
					while(_g1 < _g) {
						var i = _g1++;
						if(i != 2) str += "," + js.Boot.__string_rec(o[i],s);
						else str += js.Boot.__string_rec(o[i],s);
					}
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			{
				var _g = 0;
				while(_g < l) {
					var i1 = _g++;
					str += ((i1 > 0?",":"")) + js.Boot.__string_rec(o[i1],s);
				}
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		}
		catch( $e0 ) {
			{
				var e = $e0;
				{
					return "???";
				}
			}
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = (o.hasOwnProperty != null);
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) continue;
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__") continue;
		if(str.length != 2) str += ", \n";
		str += ((s + k) + " : ") + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += ("\n" + s) + "}";
		return str;
	}break;
	case "function":{
		return "<function>";
	}break;
	case "string":{
		return o;
	}break;
	default:{
		return String(o);
	}break;
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return (o.__enum__ == null);
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	}
	catch( $e1 ) {
		{
			var e = $e1;
			{
				if(cl == null) return false;
			}
		}
	}
	switch(cl) {
	case Int:{
		return Math.ceil(o%2147483648.0) === o;
	}break;
	case Float:{
		return typeof(o) == "number";
	}break;
	case Bool:{
		return o === true || o === false;
	}break;
	case String:{
		return typeof(o) == "string";
	}break;
	case Dynamic:{
		return true;
	}break;
	default:{
		if(o == null) return false;
		return o.__enum__ == cl || (cl == Class && o.__name__ != null) || (cl == Enum && o.__ename__ != null);
	}break;
	}
}
js.Boot.__init = function() {
	js.Lib.isIE = (typeof document!='undefined' && document.all != null && typeof window!='undefined' && window.opera == null);
	js.Lib.isOpera = (typeof window!='undefined' && window.opera != null);
	Array.prototype.copy = Array.prototype.slice;
	Array.prototype.insert = function(i,x) {
		this.splice(i,0,x);
	}
	Array.prototype.remove = (Array.prototype.indexOf?function(obj) {
		var idx = this.indexOf(obj);
		if(idx == -1) return false;
		this.splice(idx,1);
		return true;
	}:function(obj) {
		var i = 0;
		var l = this.length;
		while(i < l) {
			if(this[i] == obj) {
				this.splice(i,1);
				return true;
			}
			i++;
		}
		return false;
	});
	Array.prototype.iterator = function() {
		return { cur : 0, arr : this, hasNext : function() {
			return this.cur < this.arr.length;
		}, next : function() {
			return this.arr[this.cur++];
		}}
	}
	var cca = String.prototype.charCodeAt;
	String.prototype.cca = cca;
	String.prototype.charCodeAt = function(i) {
		var x = cca.call(this,i);
		if(isNaN(x)) return null;
		return x;
	}
	var oldsub = String.prototype.substr;
	String.prototype.substr = function(pos,len) {
		if(pos != null && pos != 0 && len != null && len < 0) return "";
		if(len == null) len = this.length;
		if(pos < 0) {
			pos = this.length + pos;
			if(pos < 0) pos = 0;
		}
		else if(len < 0) {
			len = (this.length + len) - pos;
		}
		return oldsub.apply(this,[pos,len]);
	}
	$closure = js.Boot.__closure;
}
js.Boot.prototype.__class__ = js.Boot;
js.Lib = function() { }
js.Lib.__name__ = ["js","Lib"];
js.Lib.isIE = null;
js.Lib.isOpera = null;
js.Lib.document = null;
js.Lib.window = null;
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib.eval = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
js.Lib.prototype.__class__ = js.Lib;
UI = function(g) { if( g === $_ ) return; {
	this.game = g;
	js.Lib.document.getElementById("version").innerHTML = Game.version;
	js.Lib.document.getElementById("map").onclick = $closure(this,"onMapClick");
	js.Lib.document.getElementById("map").onmousemove = $closure(this,"onMapMove");
	js.Lib.document.getElementById("restart").onclick = $closure(this,"onRestart");
	this.msgLocked = false;
	var map = js.Lib.document.getElementById("map");
	if(!(map).getContext) js.Lib.window.alert("No canvas available. Please use Mozilla Firefox 3.5+ or Google Chrome.");
	this.alertWindow = js.Lib.document.createElement("alertWindow");
	this.alertWindow.style.visibility = "hidden";
	this.alertWindow.style.position = "absolute";
	this.alertWindow.style.zIndex = 20;
	this.alertWindow.style.width = 600;
	this.alertWindow.style.height = 450;
	this.alertWindow.style.left = 200;
	this.alertWindow.style.top = 50;
	this.alertWindow.style.background = "#222";
	this.alertWindow.style.border = "4px double #ffffff";
	js.Lib.document.body.appendChild(this.alertWindow);
	this.alertText = js.Lib.document.createElement("alertText");
	this.alertText.style.overflow = "auto";
	this.alertText.style.position = "absolute";
	this.alertText.style.left = 10;
	this.alertText.style.top = 10;
	this.alertText.style.width = 580;
	this.alertText.style.height = 400;
	this.alertText.style.background = "#111";
	this.alertText.style.border = "1px solid #777";
	this.alertWindow.appendChild(this.alertText);
	var alertClose = this.createCloseButton(this.alertWindow,260,415,"alertClose");
	alertClose.onclick = $closure(this,"onAlertCloseClick");
}}
UI.__name__ = ["UI"];
UI.getRect = function(x,y,radius) {
	var rect = { x : 3 + (x - radius) * UI.cellSize, y : 2 + (y - radius) * UI.cellSize, w : (UI.cellSize * radius) * 2, h : (UI.cellSize * radius) * 2}
	if(radius == 0) {
		rect.w = UI.cellSize;
		rect.h = UI.cellSize;
	}
	return rect;
}
UI.e = function(s) {
	return js.Lib.document.getElementById(s);
}
UI.prototype.alert = function(s) {
	this.alertText.innerHTML = ("<center>" + s) + "</center>";
	this.alertWindow.style.visibility = "visible";
}
UI.prototype.alertText = null;
UI.prototype.alertWindow = null;
UI.prototype.createCloseButton = function(container,x,y,name) {
	var b = js.Lib.document.createElement(name);
	b.innerHTML = "<b>Close</b>";
	b.style.fontSize = 20;
	b.style.position = "absolute";
	b.style.width = 80;
	b.style.height = 25;
	b.style.left = x;
	b.style.top = y;
	b.style.background = "#111";
	b.style.border = "1px outset #777";
	b.style.cursor = "pointer";
	b.style.textAlign = "center";
	container.appendChild(b);
	return b;
}
UI.prototype.cursorX = null;
UI.prototype.cursorY = null;
UI.prototype.finish = function(isVictory) {
	var el = js.Lib.document.getElementById("map");
	var map = el.getContext("2d");
	map.fillStyle = "rgba(0, 0, 0, 0.5)";
	map.fillRect(0,0,el.width,el.height);
	map.fillStyle = "white";
	var text = "";
	if(isVictory) text = ("You have found all obelisks in " + this.game.turns) + " turns!";
	else text = "You have never returned from the swamp...";
	var metrics = map.measureText(text);
	map.fillText(text,(el.width - metrics.width) / 2,(el.height - UI.cellSize) / 2);
	if(isVictory) {
		text = ("You have managed to destroy " + this.game.zombiesDestroyed) + " creatures.";
		var metrics1 = map.measureText(text);
		map.fillText(text,(el.width - metrics1.width) / 2,(el.height - UI.cellSize) / 2 + 40);
	}
}
UI.prototype.game = null;
UI.prototype.getVar = function(name) {
	return getCookie(name);
}
UI.prototype.justClicked = null;
UI.prototype.msg = function(s,isLocked) {
	if(isLocked == null) isLocked = true;
	if(this.msgLocked && !isLocked) return;
	if(isLocked) this.msgLocked = true;
	js.Lib.document.getElementById("msg").innerHTML = s;
}
UI.prototype.msgLocked = null;
UI.prototype.onAlertCloseClick = function(event) {
	this.alertWindow.style.visibility = "hidden";
}
UI.prototype.onMapClick = function(event) {
	if(this.game.isFinished) return;
	if(this.msgLocked) {
		this.msgLocked = false;
		this.msg("",false);
	}
	var map = js.Lib.document.getElementById("map");
	var x = event.clientX - map.offsetLeft;
	var y = event.clientY - map.offsetTop;
	var cellX = Std["int"]((x - 5) / UI.cellSize);
	var cellY = Std["int"]((y - 7) / UI.cellSize);
	var cell = this.game.map.get(cellX,cellY);
	if(cell != null && cell.hasAdjacentWalkable()) {
		cell.activate();
	}
	this.justClicked = true;
	this.paintStatus();
}
UI.prototype.onMapMove = function(event) {
	if(this.justClicked) {
		this.justClicked = false;
		return;
	}
	if(this.game.isFinished) return;
	var map = js.Lib.document.getElementById("map");
	var x = event.clientX - map.offsetLeft;
	var y = event.clientY - map.offsetTop;
	this.cursorX = Std["int"]((x - 5) / UI.cellSize);
	this.cursorY = Std["int"]((y - 7) / UI.cellSize);
	this.game.map.paint(UI.getRect(this.cursorX,this.cursorY,UI.repaintRadius));
	var dx = this.prevX - x;
	var dy = this.prevY - y;
	if(dx * dx + dy * dy > 10000) this.game.map.paint();
	var cell = this.game.map.get(this.cursorX,this.cursorY);
	if(cell != null && cell.isVisible) this.msg(cell.getNote(),false);
	else this.msg("",false);
	this.prevX = x;
	this.prevY = y;
}
UI.prototype.onRestart = function(event) {
	this.msgLocked = false;
	this.msg("",false);
	this.game.restart();
}
UI.prototype.paintStatus = function() {
	var s = (((((((((((((("<table width=100%><tr><td halign=left>Obelisks found: " + this.game.map.obelisksFound()) + " / ") + this.game.map.obelisks.length) + "<td halign=left>Obelisks shattered: ") + this.game.map.obelisksShattered()) + " / ") + this.game.map.obelisks.length) + "<td halign=left>Creatures destroyed: ") + this.game.zombiesDestroyed) + " / ") + this.game.zombies) + "<td halign=right><p style='text-align:right; margin-right:5'>") + "Turns: ") + this.game.turns) + "</table>";
	js.Lib.document.getElementById("status").innerHTML = s;
}
UI.prototype.prevX = null;
UI.prototype.prevY = null;
UI.prototype.setVar = function(name,val) {
	return setCookie(name,val,new Date(2015, 0, 0, 0, 0, 0, 0));
}
UI.prototype.track = function(action,label,value) {
	action = (("obelisk " + action) + " ") + Game.version;
	if(label == null) label = "";
	if(value == null) value = 0;
	pageTracker._trackEvent("Black Obelisk",action,label,value);
}
UI.prototype.__class__ = UI;
Game = function(p) { if( p === $_ ) return; {
	this.ui = new UI(this);
	this.map = new Map(this);
	var hasPlayed = getCookie("hasPlayed");
	if(hasPlayed == null) this.ui.alert(("Welcome to Black Obelisk.<br><br>" + "If this is your first time playing, please take the time to read the ") + "<a target=_blank href='http://code.google.com/p/bobelisk/wiki/Manual'>Manual</a> before playing.");
	setCookie("hasPlayed","1",new Date(2015, 0, 0, 0, 0, 0, 0));
	this.restart();
}}
Game.__name__ = ["Game"];
Game.instance = null;
Game.main = function() {
	Game.instance = new Game();
}
Game.prototype.checkFinish = function() {
	if(this.map.obelisksShattered() < this.map.obelisks.length) return;
	this.finish(true);
}
Game.prototype.finish = function(isVictory) {
	this.isFinished = true;
	this.ui.track(((isVictory?"winGame":"loseGame")),"",this.turns);
	this.ui.finish(isVictory);
}
Game.prototype.isFinished = null;
Game.prototype.map = null;
Game.prototype.restart = function() {
	this.ui.track("startGame",null,null);
	this.isFinished = false;
	this.turns = 0;
	this.zombies = 0;
	this.zombiesDestroyed = 0;
	this.map.generate();
	this.map.paint();
	this.ui.paintStatus();
}
Game.prototype.turns = null;
Game.prototype.ui = null;
Game.prototype.zombies = null;
Game.prototype.zombiesDestroyed = null;
Game.prototype.__class__ = Game;
Std = function() { }
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	if(x < 0) return Math.ceil(x);
	return Math.floor(x);
}
Std.parseInt = function(x) {
	var v = parseInt(x);
	if(Math.isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
Std.prototype.__class__ = Std;
Cell = function(g) { if( g === $_ ) return; {
	this.game = g;
	this.map = this.game.map;
	this.ui = this.game.ui;
	this.hasZombie = false;
	this.zombieAlerted = false;
}}
Cell.__name__ = ["Cell"];
Cell.prototype.activate = function() {
	if(!this.isVisible) {
		this.game.turns++;
		this.ui.paintStatus();
	}
	if(this.type == "obelisk" && this.isVisible) this.activateObelisk();
	this.alertNearbyZombies(true);
	if(this.game.isFinished) return;
	if(this.isVisible) {
		this.lureCreatures();
		return;
	}
	this.isVisible = true;
	this.game.map.paint(UI.getRect(this.x,this.y,1));
	if(this.hasZombie) this.game.finish(false);
	else this.game.checkFinish();
	this.game.map.revealCloseObelisks(this);
}
Cell.prototype.activateObelisk = function() {
	this.ui.msg("Thunderous bolts of lightning shatter the obelisk.");
	this.type = "shatteredObelisk";
	{
		var _g = 0;
		while(_g < 8) {
			var i = _g++;
			var c = this.map.get(this.x + Cell.dx[i],this.y + Cell.dy[i]);
			if(c == null) continue;
			if(c.hasZombie) {
				this.game.zombiesDestroyed++;
				c.hasZombie = false;
			}
			c.alertNearbyZombies(false);
			c.isVisible = true;
		}
	}
	this.ui.paintStatus();
	this.game.map.paint(UI.getRect(this.x,this.y,2));
	this.game.checkFinish();
}
Cell.prototype.alertNearbyZombies = function(killPlayerIfAlerted) {
	if(!Reflect.field(Cell.walkable,this.type) || this.isVisible) return;
	{
		var _g = 0;
		while(_g < 8) {
			var i = _g++;
			var c = this.map.get(this.x + Cell.dx[i],this.y + Cell.dy[i]);
			if(c == null || !c.hasZombie) continue;
			if(c.hasZombie && c.zombieAlerted && killPlayerIfAlerted) {
				this.ui.msg("You fail trying to sneak around the creature.");
				this.game.finish(false);
				return;
			}
			c.zombieAlerted = true;
			c.isVisible = true;
			this.game.map.paint(UI.getRect(c.x,c.y,0));
		}
	}
}
Cell.prototype.distance = function(c) {
	var dx = this.x - c.x;
	var dy = this.y - c.y;
	return Std["int"](Math.sqrt(dx * dx + dy * dy));
}
Cell.prototype.game = null;
Cell.prototype.getNote = function() {
	var s = "";
	if(this.hasZombie) s = "creature" + ((this.zombieAlerted?" (alerted)":""));
	else if(Reflect.hasField(Cell.names,this.type)) s = Reflect.field(Cell.names,this.type);
	else s = this.type;
	return s;
}
Cell.prototype.hasAdjacentVisible = function() {
	{
		var _g = 0;
		while(_g < 4) {
			var i = _g++;
			var c = this.map.get(this.x + Cell.dx[i],this.y + Cell.dy[i]);
			if(c == null || !c.isVisible) continue;
			return true;
		}
	}
	return false;
}
Cell.prototype.hasAdjacentWalkable = function() {
	{
		var _g = 0;
		while(_g < 8) {
			var i = _g++;
			var c = this.map.get(this.x + Cell.dx[i],this.y + Cell.dy[i]);
			if(c == null || !Reflect.field(Cell.walkable,c.type) || !c.isVisible) continue;
			return true;
		}
	}
	return false;
}
Cell.prototype.hasZombie = null;
Cell.prototype.isVisible = null;
Cell.prototype.isWalkable = function() {
	return Reflect.field(Cell.walkable,this.type);
}
Cell.prototype.lureCreatures = function() {
	if(!Reflect.field(Cell.walkable,this.type)) return;
	{
		var _g = 0;
		while(_g < 8) {
			var i = _g++;
			var c = this.map.get(this.x + Cell.dx[i],this.y + Cell.dy[i]);
			if(c == null || !c.hasZombie || !c.zombieAlerted) continue;
			c.hasZombie = false;
			if(c.x > this.map.width / 3) c.isVisible = false;
			this.hasZombie = true;
			this.zombieAlerted = c.zombieAlerted;
			c.game.map.paint(UI.getRect(c.x,c.y,0));
			this.game.map.paint(UI.getRect(this.x,this.y,0));
			break;
		}
	}
}
Cell.prototype.map = null;
Cell.prototype.paint = function(screen,isSelected,rect) {
	var x1 = 3 + this.x * UI.cellSize;
	var x2 = (3 + this.x * UI.cellSize) + UI.cellSize;
	var y1 = 2 + this.y * UI.cellSize;
	var y2 = (2 + this.y * UI.cellSize) + UI.cellSize;
	if(!(x1 >= rect.x && x1 < rect.x + rect.w && y1 >= rect.y && y1 < rect.y + rect.h) && !(x2 > rect.x && x2 <= rect.x + rect.w && y2 > rect.y && y2 <= rect.y + rect.h)) return;
	if(isSelected) this.paintSelected(screen);
	screen.fillStyle = Reflect.field(Cell.colors,this.type);
	var sym = Reflect.field(Cell.symbols,this.type);
	var xx = 5 + this.x * UI.cellSize;
	var yy = -1 + this.y * UI.cellSize;
	if(this.hasZombie) {
		screen.fillStyle = Cell.colors.zombie;
		sym = Cell.symbols.zombie;
	}
	if(sym == "_") {
		xx += 4;
		yy -= 6;
	}
	if(this.isVisible) screen.fillText(sym,xx,yy);
}
Cell.prototype.paintSelected = function(screen) {
	if(!this.hasAdjacentWalkable() || this.game.isFinished) return;
	var dist = 10;
	{
		var _g = -3;
		while(_g < 3) {
			var dy = _g++;
			var _g1 = -3;
			while(_g1 < 3) {
				var dx = _g1++;
				var c = this.map.get(this.x + dx,this.y + dy);
				if(c == null || !c.hasZombie) continue;
				var d = this.distance(c);
				if(d < dist) dist = d;
			}
		}
	}
	if(dist >= 3) screen.fillStyle = "#333333";
	else if(dist == 2) screen.fillStyle = "green";
	else if(dist == 1) screen.fillStyle = "yellow";
	else if(dist == 0) screen.fillStyle = "red";
	screen.fillRect(3 + this.x * UI.cellSize,2 + this.y * UI.cellSize,UI.cellSize,UI.cellSize);
}
Cell.prototype.repaint = function() {
	this.game.map.paint(UI.getRect(this.x,this.y,0));
}
Cell.prototype.type = null;
Cell.prototype.ui = null;
Cell.prototype.x = null;
Cell.prototype.y = null;
Cell.prototype.zombieAlerted = null;
Cell.prototype.__class__ = Cell;
Hash = function(p) { if( p === $_ ) return; {
	this.h = {}
	if(this.h.__proto__ != null) {
		this.h.__proto__ = null;
		delete(this.h.__proto__);
	}
	else null;
}}
Hash.__name__ = ["Hash"];
Hash.prototype.exists = function(key) {
	try {
		key = "$" + key;
		return this.hasOwnProperty.call(this.h,key);
	}
	catch( $e2 ) {
		{
			var e = $e2;
			{
				
				for(var i in this.h)
					if( i == key ) return true;
			;
				return false;
			}
		}
	}
}
Hash.prototype.get = function(key) {
	return this.h["$" + key];
}
Hash.prototype.h = null;
Hash.prototype.iterator = function() {
	return { ref : this.h, it : this.keys(), hasNext : function() {
		return this.it.hasNext();
	}, next : function() {
		var i = this.it.next();
		return this.ref["$" + i];
	}}
}
Hash.prototype.keys = function() {
	var a = new Array();
	
			for(var i in this.h)
				a.push(i.substr(1));
		;
	return a.iterator();
}
Hash.prototype.remove = function(key) {
	if(!this.exists(key)) return false;
	delete(this.h["$" + key]);
	return true;
}
Hash.prototype.set = function(key,value) {
	this.h["$" + key] = value;
}
Hash.prototype.toString = function() {
	var s = new StringBuf();
	s.b[s.b.length] = "{";
	var it = this.keys();
	{ var $it3 = it;
	while( $it3.hasNext() ) { var i = $it3.next();
	{
		s.b[s.b.length] = i;
		s.b[s.b.length] = " => ";
		s.b[s.b.length] = Std.string(this.get(i));
		if(it.hasNext()) s.b[s.b.length] = ", ";
	}
	}}
	s.b[s.b.length] = "}";
	return s.b.join("");
}
Hash.prototype.__class__ = Hash;
List = function(p) { if( p === $_ ) return; {
	this.length = 0;
}}
List.__name__ = ["List"];
List.prototype.add = function(item) {
	var x = [item];
	if(this.h == null) this.h = x;
	else this.q[1] = x;
	this.q = x;
	this.length++;
}
List.prototype.clear = function() {
	this.h = null;
	this.q = null;
	this.length = 0;
}
List.prototype.filter = function(f) {
	var l2 = new List();
	var l = this.h;
	while(l != null) {
		var v = l[0];
		l = l[1];
		if(f(v)) l2.add(v);
	}
	return l2;
}
List.prototype.first = function() {
	return (this.h == null?null:this.h[0]);
}
List.prototype.h = null;
List.prototype.isEmpty = function() {
	return (this.h == null);
}
List.prototype.iterator = function() {
	return { h : this.h, hasNext : function() {
		return (this.h != null);
	}, next : function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		return x;
	}}
}
List.prototype.join = function(sep) {
	var s = new StringBuf();
	var first = true;
	var l = this.h;
	while(l != null) {
		if(first) first = false;
		else s.b[s.b.length] = sep;
		s.b[s.b.length] = l[0];
		l = l[1];
	}
	return s.b.join("");
}
List.prototype.last = function() {
	return (this.q == null?null:this.q[0]);
}
List.prototype.length = null;
List.prototype.map = function(f) {
	var b = new List();
	var l = this.h;
	while(l != null) {
		var v = l[0];
		l = l[1];
		b.add(f(v));
	}
	return b;
}
List.prototype.pop = function() {
	if(this.h == null) return null;
	var x = this.h[0];
	this.h = this.h[1];
	if(this.h == null) this.q = null;
	this.length--;
	return x;
}
List.prototype.push = function(item) {
	var x = [item,this.h];
	this.h = x;
	if(this.q == null) this.q = x;
	this.length++;
}
List.prototype.q = null;
List.prototype.remove = function(v) {
	var prev = null;
	var l = this.h;
	while(l != null) {
		if(l[0] == v) {
			if(prev == null) this.h = l[1];
			else prev[1] = l[1];
			if(this.q == l) this.q = prev;
			this.length--;
			return true;
		}
		prev = l;
		l = l[1];
	}
	return false;
}
List.prototype.toString = function() {
	var s = new StringBuf();
	var first = true;
	var l = this.h;
	s.b[s.b.length] = "{";
	while(l != null) {
		if(first) first = false;
		else s.b[s.b.length] = ", ";
		s.b[s.b.length] = Std.string(l[0]);
		l = l[1];
	}
	s.b[s.b.length] = "}";
	return s.b.join("");
}
List.prototype.__class__ = List;
Map = function(g) { if( g === $_ ) return; {
	this.game = g;
	this.ui = this.game.ui;
	this.width = UI.mapWidth;
	this.height = UI.mapHeight;
}}
Map.__name__ = ["Map"];
Map.prototype.cells = null;
Map.prototype.game = null;
Map.prototype.generate = function() {
	this.cells = new Hash();
	this.obelisks = new List();
	{
		var _g1 = 0, _g = this.height;
		while(_g1 < _g) {
			var y = _g1++;
			var _g3 = 0, _g2 = this.width;
			while(_g3 < _g2) {
				var x = _g3++;
				var cell = new Cell(this.game);
				cell.x = x;
				cell.y = y;
				cell.type = "grass";
				this.cells.set((x + ",") + y,cell);
			}
		}
	}
	{
		var _g1 = 0, _g = this.height;
		while(_g1 < _g) {
			var y = _g1++;
			var _g3 = 0, _g2 = this.width;
			while(_g3 < _g2) {
				var x = _g3++;
				var cell = this.get(x,y);
				if(cell.x < this.width / 3) {
					if(Math.random() < 0.05) cell.type = "tree";
					cell.isVisible = true;
				}
				else {
					if(Math.random() < 0.9) cell.type = "swamp";
					if(Math.random() < 0.2) cell.type = "water";
					if(Math.random() < 0.05) cell.type = "tree";
					cell.isVisible = false;
				}
				if(cell.x == 1 + Std["int"](this.width / 3) && Math.random() < 0.3) cell.type = "grass";
				if(cell.x >= this.width / 3 && (cell.type == "grass" || cell.type == "swamp") && Math.random() < 0.07) cell.hasZombie = true;
				this.cells.set((x + ",") + y,cell);
			}
		}
	}
	{ var $it4 = this.cells.iterator();
	while( $it4.hasNext() ) { var c = $it4.next();
	if(c.hasZombie) this.game.zombies++;
	}}
	this.generateObelisks();
	this.generateBuildings();
}
Map.prototype.generateBuildings = function() {
	var _g1 = 0, _g = this.height;
	while(_g1 < _g) {
		var y = _g1++;
		var _g3 = 0, _g2 = Std["int"](this.width / 3);
		while(_g3 < _g2) {
			var x = _g3++;
			var cell = this.get(x,y);
			if(Math.random() > 0.05) continue;
			var sx = 2 + Std["int"](Math.random() * 2);
			var sy = 2 + Std["int"](Math.random() * 2);
			var ok = true;
			{
				var _g5 = -1, _g4 = sy + 2;
				while(_g5 < _g4) {
					var dy = _g5++;
					var _g7 = -1, _g6 = sx + 2;
					while(_g7 < _g6) {
						var dx = _g7++;
						if(dx == 0 && dy == 0) continue;
						var cell1 = this.get(x + dx,y + dy);
						if(cell1 != null && cell1.type == "building") {
							ok = false;
							break;
						}
					}
				}
			}
			if(!ok) continue;
			{
				var _g4 = 0;
				while(_g4 < sy) {
					var dy = _g4++;
					var _g5 = 0;
					while(_g5 < sx) {
						var dx = _g5++;
						var cell1 = this.get(x + dx,y + dy);
						if(cell1 == null) continue;
						cell1.type = "building";
					}
				}
			}
			this.cells.set((x + ",") + y,cell);
		}
	}
}
Map.prototype.generateObelisks = function() {
	var numObelisks = 3 + Std["int"](4 * Math.random());
	{
		var _g = 0;
		while(_g < numObelisks) {
			var i = _g++;
			var x = Std["int"](((2 * this.width) / 3 + (Math.random() * this.width) / 3) - 1);
			var y = Std["int"](this.height * Math.random());
			var cell = this.get(x,y);
			cell.type = "obelisk";
			cell.hasZombie = false;
			this.obelisks.add(cell);
		}
	}
}
Map.prototype.get = function(x,y) {
	return this.cells.get((x + ",") + y);
}
Map.prototype.height = null;
Map.prototype.obelisks = null;
Map.prototype.obelisksFound = function() {
	var cnt = 0;
	{ var $it5 = this.game.map.obelisks.iterator();
	while( $it5.hasNext() ) { var o = $it5.next();
	if(o.isVisible) cnt++;
	}}
	return cnt;
}
Map.prototype.obelisksShattered = function() {
	var cnt = 0;
	{ var $it6 = this.game.map.obelisks.iterator();
	while( $it6.hasNext() ) { var o = $it6.next();
	if(o.isVisible && o.type == "shatteredObelisk") cnt++;
	}}
	return cnt;
}
Map.prototype.paint = function(rect) {
	var el = js.Lib.document.getElementById("map");
	var map = el.getContext("2d");
	map.font = UI.cellSize + "px Verdana";
	map.fillStyle = "black";
	map.textBaseline = "top";
	if(rect == null) rect = { x : 0, y : 0, w : 1000, h : 740}
	if(rect.x < 0) rect.x = 0;
	if(rect.y < 0) rect.y = 0;
	map.fillRect(rect.x,rect.y,rect.w,rect.h);
	{
		var _g1 = 0, _g = this.height;
		while(_g1 < _g) {
			var y = _g1++;
			var _g3 = 0, _g2 = this.width;
			while(_g3 < _g2) {
				var x = _g3++;
				var cell = this.get(x,y);
				cell.paint(map,(this.ui.cursorX == x && this.ui.cursorY == y),rect);
			}
		}
	}
}
Map.prototype.revealCloseObelisks = function(cell) {
	var map = js.Lib.document.getElementById("map").getContext("2d");
	{ var $it7 = this.obelisks.iterator();
	while( $it7.hasNext() ) { var o = $it7.next();
	{
		if(o.isVisible || cell.distance(o) > 5) continue;
		var fx = (o.x - 1) + Std["int"](Math.random() * 2);
		var fy = (o.y - 1) + Std["int"](Math.random() * 2);
		map.fillStyle = Cell.colors.fakeObelisk;
		map.fillText(Cell.symbols.fakeObelisk,5 + fx * UI.cellSize,-1 + fy * UI.cellSize);
	}
	}}
}
Map.prototype.ui = null;
Map.prototype.width = null;
Map.prototype.__class__ = Map;
Reflect = function() { }
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	if(o.hasOwnProperty != null) return o.hasOwnProperty(field);
	var arr = Reflect.fields(o);
	{ var $it8 = arr.iterator();
	while( $it8.hasNext() ) { var t = $it8.next();
	if(t == field) return true;
	}}
	return false;
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	}
	catch( $e9 ) {
		{
			var e = $e9;
			null;
		}
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
}
Reflect.fields = function(o) {
	if(o == null) return new Array();
	var a = new Array();
	if(o.hasOwnProperty) {
		
					for(var i in o)
						if( o.hasOwnProperty(i) )
							a.push(i);
				;
	}
	else {
		var t;
		try {
			t = o.__proto__;
		}
		catch( $e10 ) {
			{
				var e = $e10;
				{
					t = null;
				}
			}
		}
		if(t != null) o.__proto__ = null;
		
					for(var i in o)
						if( i != "__proto__" )
							a.push(i);
				;
		if(t != null) o.__proto__ = t;
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && f.__name__ == null;
}
Reflect.compare = function(a,b) {
	return ((a == b)?0:((((a) > (b))?1:-1)));
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return (t == "string" || (t == "object" && !v.__enum__) || (t == "function" && v.__name__ != null));
}
Reflect.deleteField = function(o,f) {
	if(!Reflect.hasField(o,f)) return false;
	delete(o[f]);
	return true;
}
Reflect.copy = function(o) {
	var o2 = { }
	{
		var _g = 0, _g1 = Reflect.fields(o);
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			o2[f] = Reflect.field(o,f);
		}
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = new Array();
		{
			var _g1 = 0, _g = arguments.length;
			while(_g1 < _g) {
				var i = _g1++;
				a.push(arguments[i]);
			}
		}
		return f(a);
	}
}
Reflect.prototype.__class__ = Reflect;
StringBuf = function(p) { if( p === $_ ) return; {
	this.b = new Array();
}}
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype.add = function(x) {
	this.b[this.b.length] = x;
}
StringBuf.prototype.addChar = function(c) {
	this.b[this.b.length] = String.fromCharCode(c);
}
StringBuf.prototype.addSub = function(s,pos,len) {
	this.b[this.b.length] = s.substr(pos,len);
}
StringBuf.prototype.b = null;
StringBuf.prototype.toString = function() {
	return this.b.join("");
}
StringBuf.prototype.__class__ = StringBuf;
IntIter = function(min,max) { if( min === $_ ) return; {
	this.min = min;
	this.max = max;
}}
IntIter.__name__ = ["IntIter"];
IntIter.prototype.hasNext = function() {
	return this.min < this.max;
}
IntIter.prototype.max = null;
IntIter.prototype.min = null;
IntIter.prototype.next = function() {
	return this.min++;
}
IntIter.prototype.__class__ = IntIter;
$Main = function() { }
$Main.__name__ = ["@Main"];
$Main.prototype.__class__ = $Main;
$_ = {}
js.Boot.__res = {}
js.Boot.__init();
{
	js.Lib.document = document;
	js.Lib.window = window;
	onerror = function(msg,url,line) {
		var f = js.Lib.onerror;
		if( f == null )
			return false;
		return f(msg,[url+":"+line]);
	}
}
{
	String.prototype.__class__ = String;
	String.__name__ = ["String"];
	Array.prototype.__class__ = Array;
	Array.__name__ = ["Array"];
	Int = { __name__ : ["Int"]}
	Dynamic = { __name__ : ["Dynamic"]}
	Float = Number;
	Float.__name__ = ["Float"];
	Bool = { __ename__ : ["Bool"]}
	Class = { __name__ : ["Class"]}
	Enum = { }
	Void = { __ename__ : ["Void"]}
}
{
	Math.NaN = Number["NaN"];
	Math.NEGATIVE_INFINITY = Number["NEGATIVE_INFINITY"];
	Math.POSITIVE_INFINITY = Number["POSITIVE_INFINITY"];
	Math.isFinite = function(i) {
		return isFinite(i);
	}
	Math.isNaN = function(i) {
		return isNaN(i);
	}
	Math.__name__ = ["Math"];
}
js.Lib.onerror = null;
UI.cellSize = 40;
UI.mapWidth = 25;
UI.mapHeight = 16;
UI.repaintRadius = 3;
Game.version = "v2";
Cell.colors = { grass : "green", building : "gray", swamp : "#339999", water : "blue", tree : "darkgreen", obelisk : "gray", fakeObelisk : "#222222", shatteredObelisk : "gray", zombie : "gray"}
Cell.symbols = { grass : ".", building : "#", swamp : ".", water : "~", tree : "*", obelisk : "+", fakeObelisk : "+", shatteredObelisk : "_", zombie : "z"}
Cell.walkable = { grass : true, building : false, swamp : true, water : false, tree : false, obelisk : true, shatteredObelisk : true, zombie : true}
Cell.names = { shatteredObelisk : "shattered obelisk"}
Cell.dx = [1,-1,0,0,1,-1,1,-1];
Cell.dy = [0,0,1,-1,1,-1,-1,1];
$Main.init = Game.main();
