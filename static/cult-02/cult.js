$estr = function() { return js.Boot.__string_rec(this,''); }
js = {}
js.Boot = function() { }
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = (i != null?i.fileName + ":" + i.lineNumber + ": ":"");
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
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
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
	js.Lib.isIE = (document.all != null && window.opera == null);
	js.Lib.isOpera = (window.opera != null);
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
			len = this.length + len - pos;
		}
		return oldsub.apply(this,[pos,len]);
	}
	$closure = js.Boot.__closure;
}
js.Boot.prototype.__class__ = js.Boot;
Player = function(gvar,uivar,id,infoID) { if( gvar === $_ ) return; {
	this.game = gvar;
	this.ui = uivar;
	this.id = id;
	this.info = Static.cults[infoID];
	this.name = this.info.name;
	this.isAI = false;
	this.power = [0,0,0,0];
	this.powerMod = [0,0,0,0];
	this.wars = [false,false,false,false];
	this.adeptsUsed = 0;
	this.setAwareness(0);
	this.nodes = new List();
}}
Player.__name__ = ["Player"];
Player.prototype.activate = function(node) {
	if(this.isParalyzed) return "";
	if(node.owner == this) return "isOwner";
	if(node.isGenerator && node.owner != null) {
		var cnt = 0;
		{ var $it2 = node.links.iterator();
		while( $it2.hasNext() ) { var n = $it2.next();
		if(n.owner == node.owner) cnt++;
		}}
		if(cnt >= 3) {
			if(!this.isAI) {
				js.Lib.document.getElementById("jqDialog_close").style.visibility = "hidden";
				JQDialog.notify("Generator has " + cnt + " links.",1);
			}
			return "hasLinks";
		}
	}
	{
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.power[i] < node.power[i]) {
				if(!this.isAI) {
					js.Lib.document.getElementById("jqDialog_close").style.visibility = "hidden";
					JQDialog.notify("Not enough " + Game.powerNames[i],1);
				}
				return "notEnoughPower";
			}
		}
	}
	{
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			this.power[i] = Math.round(this.power[i] - node.power[i]);
		}
	}
	if(100 * Math.random() > this.getGainChance(node)) {
		if(!this.isAI) {
			this.ui.alert("Could not gain a follower.");
			this.ui.updateStatus();
		}
		return "failure";
	}
	var prevOwner = node.owner;
	if(node.isGenerator) {
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			this.powerMod[i] += Math.round(node.powerGenerated[i]);
		}
	}
	node.clearLines();
	node.setOwner(this);
	node.showLinks();
	if(prevOwner != null) node.updateLinkVisibility(prevOwner);
	if(node.isGenerator) {
		var _g = this;
		_g.setAwareness(_g.awareness + 2);
	}
	else {
		var _g = this, _g1 = _g.awareness;
		_g.setAwareness(_g1 + 1);
		_g1;
	}
	if(!this.isAI) this.ui.updateStatus();
	node.paintLines();
	{ var $it3 = node.links.iterator();
	while( $it3.hasNext() ) { var n = $it3.next();
	n.update();
	}}
	if(prevOwner != null) prevOwner.checkDeath();
	if(prevOwner != null && !prevOwner.isDead && !this.wars[prevOwner.id]) {
		this.wars[prevOwner.id] = true;
		prevOwner.wars[this.id] = true;
		this.ui.log(UI.cultName(this.id,this.info) + " has declared a war against " + UI.cultName(prevOwner.id,prevOwner.info) + ".");
	}
	if(prevOwner != null && prevOwner.origin == node) {
		this.ui.log(UI.cultName(prevOwner.id,prevOwner.info) + " has lost its origin.");
		if(prevOwner.isRitual) {
			prevOwner.isRitual = false;
			this.ui.log("Performing of " + prevOwner.ritual.name + " is stopped.");
		}
		var ok = false;
		{ var $it4 = prevOwner.nodes.iterator();
		while( $it4.hasNext() ) { var n = $it4.next();
		{
			if(n.level == 2) {
				prevOwner.origin = n;
				ok = true;
				break;
			}
		}
		}}
		if(!ok) {
			this.ui.log("With no priests left " + UI.cultName(prevOwner.id,prevOwner.info) + " is completely paralyzed.");
			prevOwner.isParalyzed = true;
		}
		else {
			this.ui.log("Another priest becomes the origin of " + UI.cultName(prevOwner.id,prevOwner.info) + ".");
			prevOwner.origin.update();
		}
		node.update();
	}
	this.checkVictory();
	return "ok";
}
Player.prototype.adepts = null;
Player.prototype.adeptsUsed = null;
Player.prototype.awareness = null;
Player.prototype.canActivate = function(node) {
	{
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.power[i] < node.power[i]) return false;
		}
	}
	return true;
}
Player.prototype.checkDeath = function() {
	if(this.nodes.length > 0) return;
	this.ui.log(UI.cultName(this.id,this.info) + " was wiped completely and forgotten.");
	this.isDead = true;
	if(!this.isAI) {
		this.game.isFinished = true;
		this.ui.finish(this,"wiped");
	}
}
Player.prototype.checkVictory = function() {
	var ok = true;
	{
		var _g = 0, _g1 = this.game.players;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			if(p != this && !p.isDead) ok = false;
		}
	}
	if(!ok) return;
	this.ui.finish(this,"conquer");
}
Player.prototype.convert = function(from,to) {
	if(this.power[from] < Game.powerConversionCost[from]) {
		if(!this.isAI) {
			js.Lib.document.getElementById("jqDialog_close").style.visibility = "hidden";
			JQDialog.notify("Not enough " + Game.powerNames[from],1);
		}
		return;
	}
	this.power[from] -= Game.powerConversionCost[from];
	this.power[to] += 1;
	if(!this.isAI) this.ui.updateStatus();
}
Player.prototype.game = null;
Player.prototype.getAdepts = function() {
	return this.getNumFollowers(1);
}
Player.prototype.getGainChance = function(node) {
	var ch = 0;
	if(!node.isGenerator) ch = 99 - this.awareness;
	else ch = 99 - this.awareness * 2;
	if(ch < 1) ch = 1;
	return ch;
}
Player.prototype.getNeophytes = function() {
	return this.getNumFollowers(0);
}
Player.prototype.getNumFollowers = function(level) {
	var cnt = 0;
	{ var $it5 = this.nodes.iterator();
	while( $it5.hasNext() ) { var n = $it5.next();
	if(n.level == level) cnt++;
	}}
	return cnt;
}
Player.prototype.getPriests = function() {
	return this.getNumFollowers(2);
}
Player.prototype.getResourceChance = function() {
	var ch = Std["int"](99 - 1.5 * this.awareness);
	if(ch < 1) ch = 1;
	return ch;
}
Player.prototype.getUpgradeChance = function(level) {
	var ch = 0;
	if(level == 0) ch = 99 - this.awareness;
	else if(level == 1) ch = 80 - Std["int"](this.awareness * 1.5);
	else if(level == 2) ch = 75 - this.awareness * 2;
	if(ch < 1) ch = 1;
	return ch;
}
Player.prototype.getVirgins = function() {
	return this.power[3];
}
Player.prototype.id = null;
Player.prototype.info = null;
Player.prototype.isAI = null;
Player.prototype.isDead = null;
Player.prototype.isParalyzed = null;
Player.prototype.isRitual = null;
Player.prototype.lowerAwareness = function(pwr) {
	if(this.awareness == 0 || this.adeptsUsed >= this.getAdepts() || pwr == 3) return;
	{
		var _g = this;
		_g.setAwareness(_g.awareness - 2);
	}
	if(this.awareness < 0) this.setAwareness(0);
	this.power[pwr]--;
	this.adeptsUsed++;
	if(!this.isAI) this.ui.updateStatus();
}
Player.prototype.name = null;
Player.prototype.neophytes = null;
Player.prototype.nodes = null;
Player.prototype.origin = null;
Player.prototype.power = null;
Player.prototype.powerMod = null;
Player.prototype.priests = null;
Player.prototype.ritual = null;
Player.prototype.ritualFinish = function() {
	if(this.ritual.id == "summoning") this.summonFinish();
	this.isRitual = false;
}
Player.prototype.ritualPoints = null;
Player.prototype.setAwareness = function(v) {
	this.awareness = v;
	{
		var _g = 0, _g1 = this.game.nodes;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			if(n.visibility[this.id] && n.owner != this) n.update();
		}
	}
	return v;
}
Player.prototype.setOrigin = function() {
	var index = -1;
	while(true) {
		index = Math.round((this.game.nodes.length - 1) * Math.random());
		var node = this.game.nodes[index];
		if(node.owner != null) continue;
		var ok = 1;
		{
			var _g = 0, _g1 = this.game.players;
			while(_g < _g1.length) {
				var p = _g1[_g];
				++_g;
				if(p.origin != null && node.distance(p.origin) < UI.nodeVisibility + 50) {
					ok = 0;
					break;
				}
			}
		}
		if(ok == 0) continue;
		break;
	}
	this.origin = this.game.nodes[index];
	this.origin.setOwner(this);
	{
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.origin.power[i] > 0) {
				this.origin.powerGenerated[i] = 1;
				this.powerMod[i] += 1;
			}
		}
	}
	this.neophytes++;
	this.origin.setGenerator(true);
	this.origin.setVisible(this,true);
	this.origin.showLinks();
	{
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			this.power[i] += Math.round(this.origin.powerGenerated[i]);
			if(Math.random() < 0.5) this.origin.power[i]++;
		}
	}
	this.origin.update();
}
Player.prototype.setVirgins = function(v) {
	this.power[3] = v;
	return v;
}
Player.prototype.summonFinish = function() {
	if(100 * Math.random() > this.getUpgradeChance(2)) {
		{ var $it6 = this.nodes.iterator();
		while( $it6.hasNext() ) { var n = $it6.next();
		if(n.level == 2) {
			n.level = 0;
			n.update();
			break;
		}
		}}
		if(!this.isAI) {
			this.ui.alert("The stars were not right. The high priest goes insane.");
			this.ui.log(UI.cultName(this.id,this.info) + " has failed to perform the " + Static.rituals[0].name + ".");
			this.ui.updateStatus();
		}
		else {
			this.ui.alert(UI.cultName(this.id,this.info) + " has failed to perform the " + Static.rituals[0].name + ".<br><br>" + this.info.summonFail);
			this.ui.log(UI.cultName(this.id,this.info) + " has failed the " + Static.rituals[0].name + ".");
		}
		return;
	}
	this.game.isFinished = true;
	this.ui.finish(this,"summon");
	this.ui.log("Game over.");
}
Player.prototype.summonStart = function() {
	if(this.isRitual) {
		this.ui.alert("You must first finish the current ritual before starting another.");
		return;
	}
	{
		var _g = this;
		_g.setVirgins(_g.getVirgins() - Game.numSummonVirgins);
	}
	this.isRitual = true;
	this.ritual = Static.rituals[0];
	this.ritualPoints = this.ritual.points;
	{
		var _g = 0, _g1 = this.game.players;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			if(p != this) {
				p.wars[this.id] = true;
				this.wars[p.id] = true;
			}
		}
	}
	this.ui.alert(UI.cultName(this.id,this.info) + " has started the " + this.ritual.name + ".<br><br>" + Static.cults[this.id].summonStart);
	this.ui.log(UI.cultName(this.id,this.info) + " has started the " + this.ritual.name + ".");
	if(!this.isAI) this.ui.updateStatus();
}
Player.prototype.turn = function() {
	if(this.isRitual) {
		this.ritualPoints -= this.getPriests();
		if(this.ritualPoints <= 0) this.ritualFinish();
	}
	this.powerMod = [0,0,0,0];
	{ var $it7 = this.nodes.iterator();
	while( $it7.hasNext() ) { var node = $it7.next();
	if(node.isGenerator) {
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			if(100 * Math.random() < this.getResourceChance()) this.power[i] += Math.round(node.powerGenerated[i]);
			this.powerMod[i] += Math.round(node.powerGenerated[i]);
		}
	}
	}}
	var value = Std["int"](Math.random() * (this.getNeophytes() / 4 - 0.5));
	{
		var _g = this;
		_g.setVirgins(_g.getVirgins() + value);
	}
	this.adeptsUsed = 0;
}
Player.prototype.ui = null;
Player.prototype.upgrade = function(level) {
	if((level == 2 && this.getVirgins() < Game.numSummonVirgins) || (level < 2 && this.getVirgins() < level + 1)) {
		if(!this.isAI) {
			js.Lib.document.getElementById("jqDialog_close").style.visibility = "hidden";
			JQDialog.notify("Not enough virgins",1);
		}
		return;
	}
	if(level == 2) {
		this.summonStart();
		return;
	}
	{
		var _g = this;
		_g.setVirgins(_g.getVirgins() - (level + 1));
	}
	if(100 * Math.random() > this.getUpgradeChance(level)) {
		if(!this.isAI) {
			this.ui.alert("Ritual failed.");
			this.ui.updateStatus();
		}
		return;
	}
	{
		var _g = this;
		_g.setAwareness(_g.awareness + level);
	}
	var ok = false;
	var upNode = null;
	if(this.origin.level == level) {
		this.origin.upgrade();
		upNode = this.origin;
		ok = true;
	}
	if(!ok) { var $it8 = this.nodes.iterator();
	while( $it8.hasNext() ) { var n = $it8.next();
	if(n.level == level && n.isGenerator) {
		n.upgrade();
		upNode = n;
		ok = true;
		break;
	}
	}}
	if(!ok) { var $it9 = this.nodes.iterator();
	while( $it9.hasNext() ) { var n = $it9.next();
	if(n.level == level) {
		n.upgrade();
		upNode = n;
		ok = true;
		break;
	}
	}}
	if(!this.isAI) this.ui.updateStatus();
	if(this != this.game.player && this.getPriests() >= 2) this.ui.log(UI.cultName(this.id,this.info) + " has " + this.getPriests() + " priests. Be careful.");
	if(this.isParalyzed && this.getPriests() >= 1) {
		this.isParalyzed = false;
		this.origin = upNode;
		this.origin.update();
		this.ui.log(UI.cultName(this.id,this.info) + " gains a priest and is no longer paralyzed.");
	}
}
Player.prototype.virgins = null;
Player.prototype.wars = null;
Player.prototype.__class__ = Player;
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
Node = function(gvar,uivar,newx,newy,index) { if( gvar === $_ ) return; {
	this.game = gvar;
	this.ui = uivar;
	this.id = index;
	this.lines = new List();
	this.links = new List();
	this.visibility = new Array();
	{
		var _g1 = 0, _g = Game.numPlayers;
		while(_g1 < _g) {
			var i = _g1++;
			this.visibility.push(false);
		}
	}
	this.isGenerator = false;
	this.power = [0,0,0];
	this.powerGenerated = [0,0,0];
	this.level = 0;
	this.owner = null;
	this.name = Node.names[Std["int"](Math.random() * (Node.names.length - 1))];
	this.x = newx;
	this.y = newy;
	this.centerX = this.x + Math.round(UI.markerWidth / 2);
	this.centerY = this.y + Math.round(UI.markerHeight / 2);
	this.uiNode = new UINode(this.game,this.ui,this);
}}
Node.__name__ = ["Node"];
Node.prototype.centerX = null;
Node.prototype.centerY = null;
Node.prototype.clearLines = function() {
	if(this.owner == null) return;
	{ var $it10 = this.lines.iterator();
	while( $it10.hasNext() ) { var l = $it10.next();
	{
		l.clear();
		this.game.lines.remove(l);
		l.startNode.lines.remove(l);
		l.endNode.lines.remove(l);
	}
	}}
}
Node.prototype.distance = function(node) {
	return Math.sqrt((node.x - this.x) * (node.x - this.x) + (node.y - this.y) * (node.y - this.y));
}
Node.prototype.game = null;
Node.prototype.id = null;
Node.prototype.isGenerator = null;
Node.prototype.isProtected = null;
Node.prototype.isVisible = function(player) {
	return this.visibility[player.id];
}
Node.prototype.level = null;
Node.prototype.lines = null;
Node.prototype.links = null;
Node.prototype.name = null;
Node.prototype.owner = null;
Node.prototype.paintLines = function() {
	var hasLine = false;
	{ var $it11 = this.links.iterator();
	while( $it11.hasNext() ) { var n = $it11.next();
	if(n.owner == this.owner) {
		var l = Line.paint(this.ui.map,this.owner,n,this);
		this.game.lines.add(l);
		n.lines.add(l);
		this.lines.add(l);
		if(!this.owner.isAI || (n.visibility[this.game.player.id] && this.visibility[this.game.player.id])) l.setVisible(true);
		hasLine = true;
	}
	}}
	if(hasLine) return;
	var dist = 10000;
	var nc = null;
	{ var $it12 = this.owner.nodes.iterator();
	while( $it12.hasNext() ) { var n = $it12.next();
	if(this != n && this.distance(n) < dist) {
		dist = this.distance(n);
		nc = n;
	}
	}}
	var l = Line.paint(this.ui.map,this.owner,nc,this);
	this.game.lines.add(l);
	nc.lines.add(l);
	this.lines.add(l);
	if(!this.owner.isAI || (nc.visibility[this.game.player.id] && this.visibility[this.game.player.id])) l.setVisible(true);
}
Node.prototype.power = null;
Node.prototype.powerGenerated = null;
Node.prototype.setGenerator = function(isgen) {
	this.isGenerator = isgen;
	this.update();
}
Node.prototype.setOwner = function(p) {
	if(this.owner == null) {
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.power[i] > 0) this.power[i]++;
		}
	}
	if(this.owner != null) this.owner.nodes.remove(this);
	this.owner = p;
	this.owner.nodes.add(this);
	this.update();
}
Node.prototype.setVisible = function(player,v) {
	this.visibility[player.id] = v;
	this.uiNode.setVisible(player,v);
	if(!player.isAI) {
		if(Game.mapVisible) v = true;
		{ var $it13 = this.lines.iterator();
		while( $it13.hasNext() ) { var l = $it13.next();
		l.setVisible(v);
		}}
	}
}
Node.prototype.showLinks = function() {
	{ var $it14 = this.links.iterator();
	while( $it14.hasNext() ) { var n = $it14.next();
	n.setVisible(this.owner,true);
	}}
}
Node.prototype.ui = null;
Node.prototype.uiNode = null;
Node.prototype.update = function() {
	this.isProtected = false;
	if(this.isGenerator && this.owner != null) {
		var cnt = 0;
		{ var $it15 = this.links.iterator();
		while( $it15.hasNext() ) { var n = $it15.next();
		if(n.owner == this.owner) cnt++;
		}}
		if(cnt >= 3) this.isProtected = true;
	}
	this.uiNode.update();
}
Node.prototype.updateLinkVisibility = function(player) {
	{ var $it16 = this.links.iterator();
	while( $it16.hasNext() ) { var n = $it16.next();
	if(n.visibility[player.id] && n.owner != player) {
		var vis = false;
		{ var $it17 = n.links.iterator();
		while( $it17.hasNext() ) { var n2 = $it17.next();
		if(n2.owner == player) {
			vis = true;
			break;
		}
		}}
		n.setVisible(player,vis);
		n.update();
	}
	}}
}
Node.prototype.upgrade = function() {
	if(this.level >= Game.followerNames.length - 1) return;
	{
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.power[i] > 0) this.power[i]++;
		}
	}
	this.level++;
	this.update();
}
Node.prototype.visibility = null;
Node.prototype.x = null;
Node.prototype.y = null;
Node.prototype.__class__ = Node;
Game = function(p) { if( p === $_ ) return; {
	this.ui = new UI(this);
	this.ui.init();
	this.restart();
	this.ui.updateStatus();
	var hasPlayed = getCookie("hasPlayed");
	if(hasPlayed == null) this.ui.alert("Welcome.<br><br>If it is your first time playing, please take your time to " + "read the <a target=_blank href='http://code.google.com/p/cult/wiki/Tutorial'>Tutorial</a> before playing. Or you might die horribly while trying.");
	setCookie("hasPlayed","1",new Date(2015, 0, 0, 0, 0, 0, 0));
}}
Game.__name__ = ["Game"];
Game.instance = null;
Game.main = function() {
	Game.instance = new Game();
}
Game.prototype.endTimer = function(name) {
	if(Game.debugTime) haxe.Log.trace(name + ": " + (Date.now().getTime() - this.timerTime) + "ms",{ fileName : "Game.hx", lineNumber : 230, className : "Game", methodName : "endTimer"});
}
Game.prototype.endTurn = function() {
	{
		var _g = 0, _g1 = this.players;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			if(p.isAI && !p.isDead) {
				p.turn();
				if(this.isFinished) return;
				if(Game.debugTime) this.timerTime = Date.now().getTime();
				p.aiTurn();
				if(Game.debugTime) haxe.Log.trace("ai" + ": " + (Date.now().getTime() - this.timerTime) + "ms",{ fileName : "Game.hx", lineNumber : 230, className : "Game", methodName : "endTimer"});
			}
		}
	}
	this.player.turn();
	this.turns++;
	this.ui.updateStatus();
}
Game.prototype.isFinished = null;
Game.prototype.lastNodeIndex = null;
Game.prototype.lastPlayerID = null;
Game.prototype.lines = null;
Game.prototype.nodes = null;
Game.prototype.player = null;
Game.prototype.players = null;
Game.prototype.restart = function() {
	this.ui.track("startGame",null,null);
	if(Game.debugTime) this.timerTime = Date.now().getTime();
	this.isFinished = false;
	this.ui.clearMap();
	this.ui.clearLog();
	this.ui.log("Game started.",false);
	this.lines = new List();
	this.nodes = new Array();
	this.players = new Array();
	this.lastPlayerID = 0;
	{
		var _g1 = 0, _g = Game.numPlayers;
		while(_g1 < _g) {
			var i = _g1++;
			var p = null;
			var id = this.lastPlayerID++;
			if(i == 0) p = new Player(this,this.ui,id,id);
			else p = new AI(this,this.ui,id,id);
			this.players.push(p);
		}
	}
	this.player = this.players[0];
	this.turns = 0;
	this.lastNodeIndex = 0;
	{
		var _g1 = 1, _g = (Game.nodesCount + 1);
		while(_g1 < _g) {
			var i = _g1++;
			this.spawnNode();
		}
	}
	var cnt = Std["int"](0.15 * Game.nodesCount);
	{
		var _g = 0;
		while(_g < cnt) {
			var i = _g++;
			var nodeIndex = Math.round((Game.nodesCount - 1) * Math.random());
			var node = this.nodes[nodeIndex];
			var powerIndex = 0;
			{
				var _g2 = 0, _g1 = Game.numPowers;
				while(_g2 < _g1) {
					var ii = _g2++;
					if(node.power[ii] > 0) {
						node.power[ii]++;
						powerIndex = ii;
					}
				}
			}
			var ii = -1;
			while(true) {
				ii = Math.round((Game.numPowers - 1) * Math.random());
				if(ii != powerIndex) break;
			}
			node.powerGenerated[ii] = 1;
			node.setGenerator(true);
		}
	}
	{
		var _g = 0, _g1 = this.nodes;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			var _g2 = 0, _g3 = this.nodes;
			while(_g2 < _g3.length) {
				var n2 = _g3[_g2];
				++_g2;
				if(n != n2 && n.distance(n2) < UI.nodeVisibility) {
					n.links.remove(n2);
					n.links.add(n2);
				}
			}
		}
	}
	{
		var _g = 0, _g1 = this.players;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			p.setOrigin();
		}
	}
	this.ui.updateStatus();
	if(Game.debugTime) haxe.Log.trace("restart" + ": " + (Date.now().getTime() - this.timerTime) + "ms",{ fileName : "Game.hx", lineNumber : 230, className : "Game", methodName : "endTimer"});
}
Game.prototype.spawnNode = function() {
	var x = 0, y = 0;
	var cnt = 0;
	while(true) {
		x = Math.round(20 + Math.random() * (UI.mapWidth - UI.markerWidth - 40));
		y = Math.round(20 + Math.random() * (UI.mapHeight - UI.markerHeight - 40));
		cnt++;
		if(cnt > 100) return;
		var ok = 1;
		{
			var _g = 0, _g1 = this.nodes;
			while(_g < _g1.length) {
				var n = _g1[_g];
				++_g;
				if((x - 30 < n.x && x + UI.markerWidth + 30 > n.x) && (y - 30 < n.y && y + UI.markerHeight + 30 > n.y)) ok = 0;
			}
		}
		if(ok == 1) break;
	}
	var node = new Node(this,this.ui,x,y,this.lastNodeIndex++);
	var index = Math.round((Game.numPowers - 1) * Math.random());
	node.power[index] = 1;
	if(Game.mapVisible) node.setVisible(this.player,true);
	node.update();
	this.nodes.push(node);
}
Game.prototype.startTimer = function(name) {
	if(Game.debugTime) this.timerTime = Date.now().getTime();
}
Game.prototype.timerTime = null;
Game.prototype.turns = null;
Game.prototype.ui = null;
Game.prototype.__class__ = Game;
Static = function() { }
Static.__name__ = ["Static"];
Static.prototype.__class__ = Static;
UI = function(g) { if( g === $_ ) return; {
	this.game = g;
	this.music = new Music();
	this.music.onRandom = $closure(this,"updateTrack");
}}
UI.__name__ = ["UI"];
UI.powerName = function(i) {
	return "<span style='color:" + Game.powerColors[i] + "'>" + Game.powerNames[i] + "</span>";
}
UI.cultName = function(i,info) {
	return "<span style='color:" + Game.playerColors[i] + "'>" + info.name + "</span>";
}
UI.e = function(s) {
	return js.Lib.document.getElementById(s);
}
UI.prototype.alert = function(s) {
	this.alertText.innerHTML = "<center>" + s + "</center>";
	this.alertWindow.style.visibility = "visible";
}
UI.prototype.alertText = null;
UI.prototype.alertWindow = null;
UI.prototype.clearLog = function() {
	this.logText.innerHTML = "";
}
UI.prototype.clearMap = function() {
	while(this.map.hasChildNodes()) this.map.removeChild(this.map.firstChild);
}
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
UI.prototype.finish = function(player,state) {
	var msg = "<div style='text-size: 20px'><b>Game over</b></div><br>";
	if(state == "summon" && !player.isAI) {
		msg += "The stars were right. The Elder God was summoned in " + this.game.turns + " turns.";
		this.track("winGame","summon",this.game.turns);
	}
	else if(state == "summon" && player.isAI) {
		msg += UI.cultName(player.id,player.info) + " has completed the " + Static.rituals[0].name + ".<br><br>" + player.info.summonFinish;
		this.track("loseGame","summon",this.game.turns);
	}
	else if(state == "conquer" && !player.isAI) {
		msg += UI.cultName(player.id,player.info) + " has taken over the world in " + this.game.turns + " turns. The Elder Gods are pleased.";
		this.track("winGame","conquer",this.game.turns);
	}
	else if(state == "conquer" && player.isAI) {
		msg += UI.cultName(player.id,player.info) + " has taken over the world. You fail.";
		this.track("loseGame","conquer",this.game.turns);
	}
	else if(state == "wiped") {
		msg += UI.cultName(player.id,player.info) + " was wiped away completely. " + "The Elder God lies dormant beneath the sea, waiting.";
		this.track("loseGame","wiped",this.game.turns);
	}
	this.alert(msg);
}
UI.prototype.game = null;
UI.prototype.getTarget = function(event) {
	if(event == null) event = window.event;
	var t = event.target;
	if(t == null) t = event.srcElement;
	return t;
}
UI.prototype.getVar = function(name) {
	return getCookie(name);
}
UI.prototype.infoText = null;
UI.prototype.infoWindow = null;
UI.prototype.init = function() {
	this.logWindow = js.Lib.document.createElement("logWindow");
	this.logWindow.style.visibility = "hidden";
	this.logWindow.style.position = "absolute";
	this.logWindow.style.zIndex = 20;
	this.logWindow.style.left = 100;
	this.logWindow.style.top = 50;
	this.logWindow.style.width = 800;
	this.logWindow.style.height = 500;
	this.logWindow.style.background = "#333333";
	this.logWindow.style.border = "4px double #ffffff";
	js.Lib.document.body.appendChild(this.logWindow);
	this.logText = js.Lib.document.createElement("logText");
	this.logText.style.overflow = "auto";
	this.logText.style.position = "absolute";
	this.logText.style.left = 10;
	this.logText.style.top = 10;
	this.logText.style.width = 780;
	this.logText.style.height = 450;
	this.logText.style.background = "#0b0b0b";
	this.logText.style.border = "1px solid #777";
	this.logWindow.appendChild(this.logText);
	var logClose = this.createCloseButton(this.logWindow,360,465,"logClose");
	logClose.onclick = $closure(this,"onLogCloseClick");
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
	this.infoWindow = js.Lib.document.createElement("infoWindow");
	this.infoWindow.style.fontSize = 16;
	this.infoWindow.style.fontWeight = "bold";
	this.infoWindow.style.visibility = "hidden";
	this.infoWindow.style.position = "absolute";
	this.infoWindow.style.zIndex = 20;
	this.infoWindow.style.left = 100;
	this.infoWindow.style.top = 45;
	this.infoWindow.style.width = 800;
	this.infoWindow.style.height = 520;
	this.infoWindow.style.background = "#111";
	this.infoWindow.style.padding = "5 5 5 5";
	this.infoWindow.style.border = "4px double #ffffff";
	js.Lib.document.body.appendChild(this.infoWindow);
	this.infoText = js.Lib.document.createElement("logText");
	this.infoText.style.overflow = "auto";
	this.infoText.style.position = "absolute";
	this.infoText.style.left = 10;
	this.infoText.style.top = 10;
	this.infoText.style.width = 780;
	this.infoText.style.height = 480;
	this.infoText.style.background = "#111";
	this.infoWindow.appendChild(this.infoText);
	var infoClose = this.createCloseButton(this.infoWindow,365,490,"infoClose");
	infoClose.onclick = $closure(this,"onInfoCloseClick");
	this.status = js.Lib.document.getElementById("status");
	this.status.style.border = "double white 4px";
	this.status.style.width = 191;
	this.status.style.height = UI.mapHeight - 10;
	this.status.style.position = "absolute";
	this.status.style.left = 5;
	this.status.style.top = 5;
	this.status.style.padding = 5;
	this.status.style.fontSize = "12px";
	this.status.style.overflow = "hidden";
	var s = "<div style='padding:0 5 5 5; background: #111; height: 20; " + "font-weight: bold; font-size:20px;'>Evil Cult v" + Game.version + "</div>";
	s += "<fieldset>";
	s += "<legend>FOLLOWERS</legend>";
	s += "<table width=100% cellpadding=0 cellspacing=2 style='font-size:14px'>";
	{
		var _g1 = 0, _g = Game.followerNames.length;
		while(_g1 < _g) {
			var i = _g1++;
			s += "<tr style='height:10;'><td id='status.follower" + i + "'>" + Game.followerNames[i] + "s";
			s += "<td><div id='status.upgrade" + i + "' " + "style='cursor: pointer; width:12; height:12; " + "background:#222; border:1px solid #777; " + "color:lightgreen; " + ((i < Game.followerNames.length - 1?"":"text-decoration:blink; ")) + "text-align:center; font-size: 10px; font-weight: bold; '>";
			if(i < Game.followerNames.length - 1) s += "+";
			else s += "!";
			s += "</div>";
			s += "<td><span id='status.followers" + i + "' style='font-weight:bold;'>0</span>";
		}
	}
	s += "</table></fieldset>";
	s += "<fieldset><legend" + " style='padding:0 5 0 5;'>RESOURCES</legend>" + "<table width=100% cellpadding=0 cellspacing=0 style='font-size:14px'>";
	{
		var _g1 = 0, _g = (Game.numPowers + 1);
		while(_g1 < _g) {
			var i = _g1++;
			s += "<tr style='";
			if(i % 2 == 1) s += "background:#101010";
			s += "'><td>" + "<div id='status.powerMark" + i + "' style='width:" + UI.markerWidth + "; height: " + UI.markerHeight + "; font-size: 12px; " + "; background:#222; border:1px solid #777; color: " + Game.powerColors[i] + ";'>" + "<center><b>" + Game.powerShortNames[i] + "</b></center></div>" + "<td><b id='status.powerName" + i + "' " + UI.powerName(i) + "</b>" + "<td><td><span id='status.power" + i + "'>0</span><br>" + "<span style='font-size:10px' id='status.powerMod" + i + "'>0</span>";
			s += "<tr style='";
			if(i % 2 == 1) s += "background:#101010";
			s += "'><td colspan=4><table style='font-size:11px'>" + "<tr><td width=20 halign=right>To";
			{
				var _g3 = 0, _g2 = Game.numPowers;
				while(_g3 < _g2) {
					var ii = _g3++;
					if(ii != i) s += "<td><div id='status.convert" + i + ii + "' " + "style='cursor: pointer; width:12; height:12; " + "background:#222; border:1px solid #777; " + "color:" + Game.powerColors[ii] + "; " + "text-align:center; font-size: 10px; font-weight: bold; '>" + Game.powerShortNames[ii] + "</div>";
				}
			}
			if(i != 3) s += "<td><div id='status.lowerAwareness" + i + "' " + "style='cursor: pointer; width:12; height:12; " + "background:#222; border:1px solid #777; " + "color:" + UI.colAwareness + "; " + "text-align:center; font-size: 10px; font-weight: bold; '>A</div>";
			s += "</table>";
		}
	}
	s += "</table></fieldset>";
	s += "<fieldset>";
	s += "<legend>STATS</legend>";
	s += "<table cellpadding=0 cellspacing=2 width=100% style='font-size:14px'>";
	s += "<tr id='status.awRow' title='" + UI.tipAwareness + "'><td>Awareness<td><span id='status.awareness' " + "style='font-weight:bold'>0</span>";
	s += "<tr id='status.tuRow' title='" + UI.tipTurns + "'><td>Turns<td><span id='status.turns' " + "style='font-weight:bold'>0</span>";
	s += "</table></fieldset>";
	s += "<center style='padding:15 0 2 0'>";
	s += "<span title='" + UI.tipEndTurn + "' id='status.endTurn' class=button>END TURN</span> ";
	s += "<span title='" + UI.tipInfo + "' id='status.info' class=button>INFO</span> ";
	s += "<span class=button title='" + UI.tipLog + "' id='status.log'>LOG</span> ";
	if(Game.isDebug) s += "<span class=button width=10 height=10 id='status.debug'>D</span> ";
	s += "</center>";
	s += "<fieldset style='bottom: 5px; margin-top: 10px; height: 60px; padding:0 5 0 5'>";
	s += "<legend>MUSIC</legend>";
	s += "<div title='Click to go to album page.' id='status.track' " + "style='background: #222; cursor:pointer; font-size:10px; color: #00ff00'> - </div>";
	s += "<center style='padding-top:0px'>";
	s += "<span class=button2 title='Play' id='status.play'>PLAY</span>&nbsp;&nbsp;";
	s += "<span class=button2 title='Pause' id='status.pause'>PAUSE</span>&nbsp;&nbsp;";
	s += "<span class=button2 title='Stop' id='status.stop'>STOP</span>&nbsp;&nbsp;";
	s += "<span class=button2 title='Random track' id='status.random'>RANDOM</span>";
	s += "</center></fieldset>";
	s += "<center style='padding-top:8px;'><span class=button title='" + UI.tipRestart + "' id='status.restart'>RESTART GAME</span>&nbsp;&nbsp;";
	s += "<span class=button title='" + UI.tipAbout + "' id='status.about'>ABOUT</span></center>";
	this.status.innerHTML = s;
	{
		var _g1 = 0, _g = Game.followerNames.length;
		while(_g1 < _g) {
			var i = _g1++;
			js.Lib.document.getElementById("status.follower" + i).title = UI.tipFollowers[i];
			var c = js.Lib.document.getElementById("status.upgrade" + i);
			c.onclick = $closure(this,"onStatusUpgrade");
			c.title = UI.tipUpgrade[i];
		}
	}
	{
		var _g1 = 0, _g = (Game.numPowers + 1);
		while(_g1 < _g) {
			var i = _g1++;
			js.Lib.document.getElementById("status.powerMark" + i).title = UI.tipPowers[i];
			js.Lib.document.getElementById("status.powerName" + i).title = UI.tipPowers[i];
			{
				var _g3 = 0, _g2 = Game.numPowers;
				while(_g3 < _g2) {
					var ii = _g3++;
					if(i != ii) {
						var c = js.Lib.document.getElementById("status.convert" + i + ii);
						c.onclick = $closure(this,"onStatusConvert");
						c.title = UI.tipConvert + UI.powerName(ii) + ": " + Game.powerConversionCost[i];
					}
				}
			}
			if(i != 3) {
				var c = js.Lib.document.getElementById("status.lowerAwareness" + i);
				c.onclick = $closure(this,"onStatusLowerAwareness");
				c.title = UI.tipLowerAwareness;
			}
		}
	}
	js.Lib.document.getElementById("status.endTurn").onclick = $closure(this,"onStatusEndTurn");
	js.Lib.document.getElementById("status.info").onclick = $closure(this,"onStatusInfo");
	js.Lib.document.getElementById("status.log").onclick = $closure(this,"onStatusLog");
	js.Lib.document.getElementById("status.restart").onclick = $closure(this,"onStatusRestart");
	js.Lib.document.getElementById("status.about").onclick = $closure(this,"onStatusAbout");
	if(Game.isDebug) js.Lib.document.getElementById("status.debug").onclick = $closure(this,"onStatusDebug");
	js.Lib.document.getElementById("status.play").onclick = $closure(this,"onStatusPlay");
	js.Lib.document.getElementById("status.pause").onclick = $closure(this,"onStatusPause");
	js.Lib.document.getElementById("status.stop").onclick = $closure(this,"onStatusStop");
	js.Lib.document.getElementById("status.random").onclick = $closure(this,"onStatusRandom");
	js.Lib.document.getElementById("status.track").onclick = $closure(this,"onStatusTrack");
	this.map = js.Lib.document.getElementById("map");
	this.map.style.border = "double white 4px";
	this.map.style.width = UI.mapWidth;
	this.map.style.height = UI.mapHeight;
	this.map.style.position = "absolute";
	this.map.style.left = 220;
	this.map.style.top = 5;
	this.map.style.overflow = "hidden";
	new JQuery("#status *").tooltip({ delay : 0});
}
UI.prototype.log = function(s,show) {
	this.logText.innerHTML += "<span style='color:#888888'>" + DateTools.format(Date.now(),"%H:%M:%S") + "</span>" + " Turn " + (this.game.turns + 1) + ": " + s + "<br>";
	if(show == null || show == true) this.onStatusLog(null);
	this.logPrevTurn = this.game.turns;
}
UI.prototype.logPrevTurn = null;
UI.prototype.logText = null;
UI.prototype.logWindow = null;
UI.prototype.map = null;
UI.prototype.msg = function(s) {
	js.Lib.document.getElementById("jqDialog_close").style.visibility = "hidden";
	JQDialog.notify(s,1);
}
UI.prototype.music = null;
UI.prototype.onAlertCloseClick = function(event) {
	this.alertWindow.style.visibility = "hidden";
}
UI.prototype.onInfoCloseClick = function(event) {
	this.infoWindow.style.visibility = "hidden";
}
UI.prototype.onLogCloseClick = function(event) {
	this.logWindow.style.visibility = "hidden";
}
UI.prototype.onNodeClick = function(event) {
	if(this.game.isFinished) return;
	this.game.player.activate(this.getTarget(event).node);
}
UI.prototype.onStatusAbout = function(event) {
	js.Lib.window.open("http://code.google.com/p/cult/wiki/About");
}
UI.prototype.onStatusConvert = function(event) {
	if(this.game.isFinished) return;
	var from = Std.parseInt(this.getTarget(event).id.substr(14,1));
	var to = Std.parseInt(this.getTarget(event).id.substr(15,1));
	this.game.player.convert(from,to);
}
UI.prototype.onStatusDebug = function(event) {
	if(this.game.isFinished) return;
	{
		var _g = 0;
		while(_g < 4) {
			var i = _g++;
			this.game.player.power[i] += 100;
		}
	}
	this.updateStatus();
	{
		var _g = 0, _g1 = this.game.nodes;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			n.setVisible(this.game.player,true);
		}
	}
}
UI.prototype.onStatusEndTurn = function(event) {
	if(this.game.isFinished) return;
	this.game.endTurn();
}
UI.prototype.onStatusInfo = function(event) {
	var s = "";
	var i = 0;
	{
		var _g = 0, _g1 = this.game.players;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			s += "<div style=\"" + ((i == 0?"background:#333333":"")) + "\">";
			if(p.isDead) s += "<s>";
			s += UI.cultName(i,p.info);
			if(p.isDead) s += "</s> Forgotten";
			if(!p.isDead) {
				var w = "";
				{
					var _g3 = 0, _g2 = p.wars.length;
					while(_g3 < _g2) {
						var i1 = _g3++;
						if(p.wars[i1]) w += UI.cultName(i1,this.game.players[i1].info) + " ";
					}
				}
				if(w != "") s += " wars: " + w;
			}
			s += "<br>";
			if(Game.isDebug) {
				s += "<span style='font-size: 10px'>";
				{
					var _g3 = 0, _g2 = p.power.length;
					while(_g3 < _g2) {
						var i1 = _g3++;
						s += UI.powerName(i1) + ": " + p.power[i1] + " (";
						if(i1 < 3) s += p.getResourceChance() + "%) ";
						else s += (p.getNeophytes() / 4 - 0.5) + ") ";
					}
				}
				s += "Awareness: " + p.awareness + "% ";
				s += "ROS: " + p.getUpgradeChance(2) + "% ";
				s += "</span><br>";
			}
			if(p.isRitual == true) {
				var turns = Std["int"](p.ritualPoints / p.getPriests());
				if(p.ritualPoints % p.getPriests() > 0) turns += 1;
				s += "Casting <span title='" + p.ritual.note + "' id='info.ritual" + i + "' style='color:#ffaaaa'>" + p.ritual.name + "</span>, " + (p.ritual.points - p.ritualPoints) + "/" + p.ritual.points + " points, " + turns + " turns left<br>";
			}
			s += p.nodes.length + " followers (" + p.getNeophytes() + " neophytes, " + p.getAdepts() + " adepts, " + p.getPriests() + " priests)";
			if(p.isParalyzed) s += " Paralyzed";
			s += "<br>";
			s += "<span id='info.toggleNote" + i + "' style='height:10; width:10; font-size:12px; border: 1px solid #777'>+</span>";
			s += "<br>";
			s += "<span id='info.note" + i + "'>" + p.info.note + "</span>";
			s += "<span id='info.longnote" + i + "'>" + p.info.longNote + "</span>";
			s += "</div><hr>";
			i++;
		}
	}
	this.infoText.innerHTML = s;
	this.infoWindow.style.visibility = "visible";
	{
		var _g1 = 0, _g = Game.numPlayers;
		while(_g1 < _g) {
			var i1 = _g1++;
			js.Lib.document.getElementById("info.longnote" + i1).style.display = "none";
			var c = js.Lib.document.getElementById("info.toggleNote" + i1);
			c.style.cursor = "pointer";
			c.noteID = i1;
			c.onclick = function(event1) {
				var t = event1.target;
				if(t.innerHTML == "+") {
					t.innerHTML = "&mdash;";
					js.Lib.document.getElementById("info.longnote" + t.noteID).style.display = "block";
					js.Lib.document.getElementById("info.note" + t.noteID).style.display = "none";
				}
				else {
					t.innerHTML = "+";
					js.Lib.document.getElementById("info.longnote" + t.noteID).style.display = "none";
					js.Lib.document.getElementById("info.note" + t.noteID).style.display = "block";
				}
			}
		}
	}
}
UI.prototype.onStatusLog = function(event) {
	this.logText.scrollTop = 10000;
	this.logWindow.style.visibility = "visible";
}
UI.prototype.onStatusLowerAwareness = function(event) {
	if(this.game.isFinished) return;
	var power = Std.parseInt(this.getTarget(event).id.substr(21,1));
	this.game.player.lowerAwareness(power);
}
UI.prototype.onStatusPause = function(event) {
	this.music.pause();
}
UI.prototype.onStatusPlay = function(event) {
	this.music.play();
}
UI.prototype.onStatusRandom = function(event) {
	this.music.random();
}
UI.prototype.onStatusRestart = function(event) {
	this.game.restart();
}
UI.prototype.onStatusStop = function(event) {
	this.music.stop();
}
UI.prototype.onStatusTrack = function(event) {
	js.Lib.window.open(this.music.getPage(),"");
}
UI.prototype.onStatusUpgrade = function(event) {
	if(this.game.isFinished) return;
	var lvl = Std.parseInt(this.getTarget(event).id.substr(14,1));
	this.game.player.upgrade(lvl);
}
UI.prototype.setVar = function(name,val) {
	return setCookie(name,val,new Date(2015, 0, 0, 0, 0, 0, 0));
}
UI.prototype.status = null;
UI.prototype.track = function(action,label,value) {
	if(label == null) label = "";
	if(value == null) value = 0;
	pageTracker._trackEvent("Evil Cult",action,label,value);
}
UI.prototype.updateStatus = function() {
	{
		var _g1 = 0, _g = (Game.numPowers + 1);
		while(_g1 < _g) {
			var i = _g1++;
			var s = UI.tipPowers[i] + "<br>Chance to gain each unit: <span style='color:white'>" + this.game.player.getResourceChance() + "%</span>";
			this.updateTip("status.powerMark" + i,s);
			this.updateTip("status.powerName" + i,s);
		}
	}
	{
		var _g1 = 0, _g = Game.followerLevels;
		while(_g1 < _g) {
			var i = _g1++;
			this.updateTip("status.follower" + i,UI.tipFollowers[i]);
			this.updateTip("status.upgrade" + i,UI.tipUpgrade[i] + "<br>Chance of success: <span style='color:white'>" + this.game.player.getUpgradeChance(i) + "%</span>");
		}
	}
	{
		var _g1 = 0, _g = (Game.numPowers + 1);
		while(_g1 < _g) {
			var i = _g1++;
			var _g3 = 0, _g2 = Game.numPowers;
			while(_g3 < _g2) {
				var ii = _g3++;
				if(i == ii) continue;
				var c = js.Lib.document.getElementById("status.convert" + i + ii);
				c.style.visibility = ((this.game.player.power[i] >= Game.powerConversionCost[i]?"visible":"hidden"));
			}
		}
	}
	{
		var _g1 = 0, _g = Game.followerLevels;
		while(_g1 < _g) {
			var i = _g1++;
			js.Lib.document.getElementById("status.followers" + i).innerHTML = "" + this.game.player.getNumFollowers(i);
		}
	}
	{
		var _g1 = 0, _g = (Game.numPowers + 1);
		while(_g1 < _g) {
			var i = _g1++;
			js.Lib.document.getElementById("status.power" + i).innerHTML = "<b>" + this.game.player.power[i] + "</b>";
			if(i == 3) js.Lib.document.getElementById("status.powerMod3").innerHTML = " +0-" + Std["int"](this.game.player.getNeophytes() / 4 - 0.5);
			else js.Lib.document.getElementById("status.powerMod" + i).innerHTML = " +0-" + this.game.player.powerMod[i];
		}
	}
	js.Lib.document.getElementById("status.turns").innerHTML = "" + this.game.turns;
	js.Lib.document.getElementById("status.awareness").innerHTML = "" + this.game.player.awareness + "%";
	{
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			js.Lib.document.getElementById("status.lowerAwareness" + i).style.visibility = "hidden";
		}
	}
	if(this.game.player.adeptsUsed < this.game.player.getAdepts() && this.game.player.getAdepts() > 0 && this.game.player.awareness > 0) {
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.game.player.power[i] > 0) js.Lib.document.getElementById("status.lowerAwareness" + i).style.visibility = "visible";
		}
	}
	{
		var _g1 = 0, _g = (Game.followerNames.length - 1);
		while(_g1 < _g) {
			var i = _g1++;
			js.Lib.document.getElementById("status.upgrade" + i).style.visibility = (((this.game.player.getNumFollowers(i) >= Game.upgradeCost && this.game.player.getVirgins() >= i + 1)?"visible":"hidden"));
		}
	}
	js.Lib.document.getElementById("status.upgrade2").style.visibility = (((this.game.player.getPriests() >= Game.upgradeCost && this.game.player.getVirgins() >= Game.numSummonVirgins)?"visible":"hidden"));
}
UI.prototype.updateTip = function(name,tip) {
	name = "#" + name;
	if(name.indexOf(".") > 0) {
		name = name.substr(0,name.indexOf(".")) + "\\" + name.substr(name.indexOf("."));
	}
	new JQuery(name).attr("tooltipText",tip);
}
UI.prototype.updateTrack = function() {
	js.Lib.document.getElementById("status.track").innerHTML = this.music.getName();
}
UI.prototype.__class__ = UI;
haxe = {}
haxe.Log = function() { }
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe.Log.clear = function() {
	js.Boot.__clear_trace();
}
haxe.Log.prototype.__class__ = haxe.Log;
DateTools = function() { }
DateTools.__name__ = ["DateTools"];
DateTools.__format_get = function(d,e) {
	return function($this) {
		var $r;
		switch(e) {
		case "%":{
			$r = "%";
		}break;
		case "C":{
			$r = StringTools.lpad(Std.string(Std["int"](d.getFullYear() / 100)),"0",2);
		}break;
		case "d":{
			$r = StringTools.lpad(Std.string(d.getDate()),"0",2);
		}break;
		case "D":{
			$r = DateTools.__format(d,"%m/%d/%y");
		}break;
		case "e":{
			$r = Std.string(d.getDate());
		}break;
		case "H":case "k":{
			$r = StringTools.lpad(Std.string(d.getHours()),(e == "H"?"0":" "),2);
		}break;
		case "I":case "l":{
			$r = function($this) {
				var $r;
				var hour = d.getHours() % 12;
				$r = StringTools.lpad(Std.string((hour == 0?12:hour)),(e == "I"?"0":" "),2);
				return $r;
			}($this);
		}break;
		case "m":{
			$r = StringTools.lpad(Std.string(d.getMonth() + 1),"0",2);
		}break;
		case "M":{
			$r = StringTools.lpad(Std.string(d.getMinutes()),"0",2);
		}break;
		case "n":{
			$r = "\n";
		}break;
		case "p":{
			$r = (d.getHours() > 11?"PM":"AM");
		}break;
		case "r":{
			$r = DateTools.__format(d,"%I:%M:%S %p");
		}break;
		case "R":{
			$r = DateTools.__format(d,"%H:%M");
		}break;
		case "s":{
			$r = Std.string(Std["int"](d.getTime() / 1000));
		}break;
		case "S":{
			$r = StringTools.lpad(Std.string(d.getSeconds()),"0",2);
		}break;
		case "t":{
			$r = "\t";
		}break;
		case "T":{
			$r = DateTools.__format(d,"%H:%M:%S");
		}break;
		case "u":{
			$r = function($this) {
				var $r;
				var t = d.getDay();
				$r = (t == 0?"7":Std.string(t));
				return $r;
			}($this);
		}break;
		case "w":{
			$r = Std.string(d.getDay());
		}break;
		case "y":{
			$r = StringTools.lpad(Std.string(d.getFullYear() % 100),"0",2);
		}break;
		case "Y":{
			$r = Std.string(d.getFullYear());
		}break;
		default:{
			$r = function($this) {
				var $r;
				throw "Date.format %" + e + "- not implemented yet.";
				return $r;
			}($this);
		}break;
		}
		return $r;
	}(this);
}
DateTools.__format = function(d,f) {
	var r = new StringBuf();
	var p = 0;
	while(true) {
		var np = f.indexOf("%",p);
		if(np < 0) break;
		r.b[r.b.length] = f.substr(p,np - p);
		r.b[r.b.length] = DateTools.__format_get(d,f.substr(np + 1,1));
		p = np + 2;
	}
	r.b[r.b.length] = f.substr(p,f.length - p);
	return r.b.join("");
}
DateTools.format = function(d,f) {
	return DateTools.__format(d,f);
}
DateTools.delta = function(d,t) {
	return Date.fromTime(d.getTime() + t);
}
DateTools.getMonthDays = function(d) {
	var month = d.getMonth();
	var year = d.getFullYear();
	if(month != 1) return DateTools.DAYS_OF_MONTH[month];
	var isB = ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
	return (isB?29:28);
}
DateTools.seconds = function(n) {
	return n * 1000.0;
}
DateTools.minutes = function(n) {
	return n * 60.0 * 1000.0;
}
DateTools.hours = function(n) {
	return n * 60.0 * 60.0 * 1000.0;
}
DateTools.days = function(n) {
	return n * 24.0 * 60.0 * 60.0 * 1000.0;
}
DateTools.parse = function(t) {
	var s = t / 1000;
	var m = s / 60;
	var h = m / 60;
	return { ms : t % 1000, seconds : Std["int"](s % 60), minutes : Std["int"](m % 60), hours : Std["int"](h % 24), days : Std["int"](h / 24)}
}
DateTools.make = function(o) {
	return o.ms + 1000.0 * (o.seconds + 60.0 * (o.minutes + 60.0 * (o.hours + 24.0 * o.days)));
}
DateTools.prototype.__class__ = DateTools;
Line = function(screen) { if( screen === $_ ) return; {
	this.screen = screen;
	this.pixels = new Array();
}}
Line.__name__ = ["Line"];
Line.paint = function(screen,player,startNode,endNode) {
	var line = new Line(screen);
	line.owner = player;
	line.startNode = startNode;
	line.endNode = endNode;
	line.isVisible = false;
	var cnt = 10;
	var dist = startNode.distance(endNode);
	if(dist < 50) cnt = Std["int"](dist / 6) + 1;
	var x = startNode.centerX, y = startNode.centerY;
	var modx = (endNode.centerX - startNode.centerX) / cnt, mody = (endNode.centerY - startNode.centerY) / cnt;
	{
		var _g = 1;
		while(_g < cnt) {
			var i = _g++;
			x += modx;
			y += mody;
			var pixel = js.Lib.document.createElement("pixel");
			pixel.style.position = "absolute";
			pixel.style.left = Math.round(x) + "px";
			pixel.style.top = Math.round(y) + "px";
			pixel.style.width = "2";
			pixel.style.height = "2";
			pixel.style.background = Game.lineColors[player.id];
			pixel.style.zIndex = 10;
			pixel.style.visibility = "hidden";
			screen.appendChild(pixel);
			line.pixels.push(pixel);
		}
	}
	return line;
}
Line.prototype.clear = function() {
	{
		var _g = 0, _g1 = this.pixels;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			this.screen.removeChild(p);
		}
	}
	this.pixels = null;
}
Line.prototype.endNode = null;
Line.prototype.isVisible = null;
Line.prototype.owner = null;
Line.prototype.pixels = null;
Line.prototype.screen = null;
Line.prototype.setVisible = function(vis) {
	{
		var _g = 0, _g1 = this.pixels;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			p.style.visibility = ((vis?"visible":"hidden"));
		}
	}
	this.isVisible = vis;
}
Line.prototype.startNode = null;
Line.prototype.__class__ = Line;
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
Music = function(p) { if( p === $_ ) return; {
	this.isInited = false;
	this.trackID = -1;
	this.playlist = [["Introspective","Occlusion","Fluid Dynamics","http://kahvi.micksam7.com/mp3/kahvi051a_intro-fluid_dynamics.mp3","http://www.kahvi.org/releases.php?release_number=051"],["Introspective","Occlusion","Contain Release","http://kahvi.micksam7.com/mp3/kahvi051b_intro-contain_release.mp3","http://www.kahvi.org/releases.php?release_number=051"],["Introspective","Occlusion","Wave Propagation","http://kahvi.micksam7.com/mp3/kahvi051c_intro-wave_propagation.mp3","http://www.kahvi.org/releases.php?release_number=051"],["Introspective","Analogy","Mail Order Monsters","http://kahvi.micksam7.com/mp3/kahvi080a_intro-mail_order_monsters.mp3","http://www.kahvi.org/releases.php?release_number=080"],["Introspective","Analogy","Cartographer","http://kahvi.micksam7.com/mp3/kahvi080b_intro-cartographer.mp3","http://www.kahvi.org/releases.php?release_number=080"],["Introspective","Analogy","Gone Awry","http://kahvi.micksam7.com/mp3/kahvi080c_intro-analogy_gone_awry.mp3","http://www.kahvi.org/releases.php?release_number=080"],["Introspective","Analogy","Bearing Your Name","http://kahvi.micksam7.com/mp3/kahvi080d_intro-bearing_your_name.mp3","http://www.kahvi.org/releases.php?release_number=080"],["Introspective","Crossing Borders","Crossing Borders","http://kahvi.micksam7.com/mp3/kahvi094a_introspective-crossing_borders.mp3","http://www.kahvi.org/releases.php?release_number=094"],["Introspective","Crossing Borders","Medina Of Tunis","http://kahvi.micksam7.com/mp3/kahvi094b_introspective-medina_of_tunis.mp3","http://www.kahvi.org/releases.php?release_number=094"],["Introspective","Black Mesa Winds","Crepuscular Activity","http://kahvi.micksam7.com/mp3/kahvi236a_introspective-crepuscular_activity.mp3","http://www.kahvi.org/releases.php?release_number=236"],["Introspective","Black Mesa Winds","Vanishing Point","http://kahvi.micksam7.com/mp3/kahvi236b_introspective-vanishing_point.mp3","http://www.kahvi.org/releases.php?release_number=236"],["Introspective","Black Mesa Winds","Black Mesa Winds","http://kahvi.micksam7.com/mp3/kahvi236c_introspective-black_mesa_winds.mp3","http://www.kahvi.org/releases.php?release_number=236"],["Introspective","Black Mesa Winds","Convection","http://kahvi.micksam7.com/mp3/kahvi236d_introspective-convection.mp3","http://www.kahvi.org/releases.php?release_number=236"],["Introspective","Black Mesa Winds","Sky City","http://kahvi.micksam7.com/mp3/kahvi236e_introspective-sky_city.mp3","http://www.kahvi.org/releases.php?release_number=236"],["Introspective","Black Mesa Winds","Predator Distribution","http://kahvi.micksam7.com/mp3/kahvi236f_introspective-predator_distribution.mp3","http://www.kahvi.org/releases.php?release_number=236"],["Introspective","Black Mesa Winds","Fahrenheit","http://kahvi.micksam7.com/mp3/kahvi236g_introspective-fahrenheit.mp3","http://www.kahvi.org/releases.php?release_number=236"],["Introspective","Black Mesa Winds","Riverside","http://kahvi.micksam7.com/mp3/kahvi236h_introspective-riverside.mp3","http://www.kahvi.org/releases.php?release_number=236"],["Introspective","Black Mesa Winds","Xerophytes","http://kahvi.micksam7.com/mp3/kahvi236i_introspective-xerophytes.mp3","http://www.kahvi.org/releases.php?release_number=236"],["Introspective","Black Mesa Winds","Differential Erosion","http://kahvi.micksam7.com/mp3/kahvi236j_introspective-differential_erosion.mp3","http://www.kahvi.org/releases.php?release_number=236"],["Introspective","Black Mesa Winds","Overwhelming Sky","http://kahvi.micksam7.com/mp3/kahvi236k_introspective-overwhelming_sky.mp3","http://www.kahvi.org/releases.php?release_number=236"],["Curious Inversions","Whom","Antibiotic Resistance","http://kahvi.micksam7.com/mp3/kahvi254a_curious_inversions-antibiotic_resistance.mp3","http://www.kahvi.org/releases.php?release_number=254"],["Curious Inversions","Whom","Antiquity","http://kahvi.micksam7.com/mp3/kahvi254b_curious_inversions-antiquity.mp3","http://www.kahvi.org/releases.php?release_number=254"],["Curious Inversions","Whom","Geonosian Advance","http://kahvi.micksam7.com/mp3/kahvi254c_curious_inversions-geonosian_advance.mp3","http://www.kahvi.org/releases.php?release_number=254"],["Curious Inversions","Whom","In The Scholar's Wake","http://kahvi.micksam7.com/mp3/kahvi254d_curious_inversions-in_the_scholars_wake.mp3","http://www.kahvi.org/releases.php?release_number=254"],["Curious Inversions","Whom","Predators","http://kahvi.micksam7.com/mp3/kahvi254e_curious_inversions-predators.mp3","http://www.kahvi.org/releases.php?release_number=254"],["Curious Inversions","Whom","Sissot Eclipse","http://kahvi.micksam7.com/mp3/kahvi254f_curious_inversions-sissot_eclipse.mp3","http://www.kahvi.org/releases.php?release_number=254"],["Curious Inversions","Whom","Voluntary","http://kahvi.micksam7.com/mp3/kahvi254g_curious_inversions-voluntary.mp3","http://www.kahvi.org/releases.php?release_number=254"],["Curious Inversions","Whom","Windslak","http://kahvi.micksam7.com/mp3/kahvi254h_curious_inversions-windslak.mp3","http://www.kahvi.org/releases.php?release_number=254"],["Introspective","Gewesen","Gewesen","http://kahvi.micksam7.com/mp3/kahvi176a_introspective-gewesen.mp3","http://www.kahvi.org/releases.php?release_number=176"],["Introspective","Gewesen","Undocumented","http://kahvi.micksam7.com/mp3/kahvi176b_introspective-undocumented.mp3","http://www.kahvi.org/releases.php?release_number=176"],["Introspective","Gewesen","Gewesen pt2","http://kahvi.micksam7.com/mp3/kahvi176c_introspective-gewesen_part2.mp3","http://www.kahvi.org/releases.php?release_number=176"],["Introspective","Gewesen","Specular Highlights","http://kahvi.micksam7.com/mp3/kahvi176d_introspective-specular_highlights.mp3","http://www.kahvi.org/releases.php?release_number=176"],["Introspective","Gewesen","The Leaves In The Rain","http://kahvi.micksam7.com/mp3/kahvi176e_introspective-the_leaves_in_the_rain.mp3","http://www.kahvi.org/releases.php?release_number=176"]];
}}
Music.__name__ = ["Music"];
Music.prototype.getName = function() {
	var a = this.playlist[this.trackID];
	return a[0] + " - " + a[1] + " - " + a[2];
}
Music.prototype.getPage = function() {
	return this.playlist[this.trackID][4];
}
Music.prototype.init = function() {
	this.isInited = true;
}
Music.prototype.isInited = null;
Music.prototype.onRandom = function() {
	null;
}
Music.prototype.pause = function() {
	SoundManager.togglePause("music");
}
Music.prototype.play = function() {
	if(this.trackID == -1) this.random();
	else SoundManager.play("music",{ onfinish : $closure(this,"random")});
}
Music.prototype.playlist = null;
Music.prototype.random = function() {
	SoundManager.destroySound("music");
	while(true) {
		var t = Std["int"](Math.random() * (this.playlist.length - 1));
		if(t != this.trackID) {
			this.trackID = t;
			break;
		}
	}
	SoundManager.createSound({ id : "music", url : this.playlist[this.trackID][3], volume : 100});
	SoundManager.play("music",{ onfinish : $closure(this,"random")});
	this.onRandom();
}
Music.prototype.stop = function() {
	SoundManager.stop("music");
}
Music.prototype.trackID = null;
Music.prototype.__class__ = Music;
UINode = function(gvar,uivar,nvar) { if( gvar === $_ ) return; {
	this.game = gvar;
	this.ui = uivar;
	this.node = nvar;
	this.marker = js.Lib.document.createElement("map.node" + this.node.id);
	this.marker.id = "map.node" + this.node.id;
	this.marker.node = this.node;
	this.marker.style.background = "#222";
	this.marker.style.border = "1px solid #777";
	this.marker.style.width = UI.markerWidth;
	this.marker.style.height = UI.markerHeight;
	this.marker.style.position = "absolute";
	this.marker.style.left = this.node.x;
	this.marker.style.top = this.node.y;
	this.marker.style.visibility = "hidden";
	this.marker.style.textAlign = "center";
	this.marker.style.fontWeight = "bold";
	this.marker.style.fontSize = "12px";
	this.marker.style.zIndex = 20;
	this.marker.style.cursor = "pointer";
	this.marker.onclick = $closure(this.ui,"onNodeClick");
	this.ui.map.appendChild(this.marker);
}}
UINode.__name__ = ["UINode"];
UINode.prototype.game = null;
UINode.prototype.marker = null;
UINode.prototype.node = null;
UINode.prototype.setVisible = function(player,v) {
	if(player.isAI) return;
	if(Game.mapVisible) v = true;
	this.marker.style.visibility = ((v?"visible":"hidden"));
}
UINode.prototype.ui = null;
UINode.prototype.update = function() {
	var s = "";
	if(Game.debugNear) {
		s += "Node " + this.node.id + "<br>";
		{ var $it18 = this.node.links.iterator();
		while( $it18.hasNext() ) { var n = $it18.next();
		s += n.id + "<br>";
		}}
	}
	if(Game.debugVis) {
		s += "Node " + this.node.id + "<br>";
		{
			var _g1 = 0, _g = Game.numPlayers;
			while(_g1 < _g) {
				var i = _g1++;
				s += this.node.visibility[i] + "<br>";
			}
		}
	}
	if(this.node.owner != null) s += "<span style='color:" + Game.playerColors[this.node.owner.id] + "'>" + this.node.owner.name + "</span><br>";
	if(this.node.owner != null && this.node.owner.origin == this.node) s += "<span style='color:" + Game.playerColors[this.node.owner.id] + "'>The Origin</span><br>";
	s += this.node.name + "<br>";
	if(this.node.owner != null) s += "<b>" + Game.followerNames[this.node.level] + "</b> <span style='color:white'>L" + (this.node.level + 1) + "</span><br>";
	if(this.node.owner == null || this.node.owner.isAI) {
		s += "<br>";
		{
			var _g1 = 0, _g = Game.numPowers;
			while(_g1 < _g) {
				var i = _g1++;
				if(this.node.power[i] > 0) {
					s += "<b style='color:" + Game.powerColors[i] + "'>" + Game.powerNames[i] + "</b> " + this.node.power[i] + "<br>";
					this.marker.innerHTML = Game.powerShortNames[i];
					this.marker.style.color = Game.powerColors[i];
				}
			}
		}
		s += "Chance of success: <span style='color:white'>" + this.game.player.getGainChance(this.node) + "%</span><br>";
	}
	this.marker.style.background = "#111";
	if(this.node.owner != null) {
		this.marker.innerHTML = "" + (this.node.level + 1);
		this.marker.style.color = "#ffffff";
		this.marker.style.background = Game.nodeColors[this.node.owner.id];
	}
	if(this.node.isGenerator) {
		var w = "3px";
		var col = "#777";
		var type = "solid";
		if(this.node.isProtected) col = "#ffffff";
		{
			var _g = 0, _g1 = this.game.players;
			while(_g < _g1.length) {
				var p = _g1[_g];
				++_g;
				if(p.origin == this.node && !p.isDead) {
					w = "5px";
					type = "double";
					break;
				}
			}
		}
		this.marker.style.border = w + " " + type + " " + col;
		s += "<br>Generates:<br>";
		{
			var _g1 = 0, _g = Game.numPowers;
			while(_g1 < _g) {
				var i = _g1++;
				if(this.node.powerGenerated[i] > 0) s += "<b style='color:" + Game.powerColors[i] + "'>" + Game.powerNames[i] + "</b> " + this.node.powerGenerated[i] + "<br>";
			}
		}
	}
	this.marker.title = s;
	new JQuery("#map\\.node" + this.node.id).tooltip({ delay : 0});
}
UINode.prototype.__class__ = UINode;
StringTools = function() { }
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.htmlEscape = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&amp;").join("&");
}
StringTools.startsWith = function(s,start) {
	return (s.length >= start.length && s.substr(0,start.length) == start);
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return (slen >= elen && s.substr(slen - elen,elen) == end);
}
StringTools.isSpace = function(s,pos) {
	var c = s.charCodeAt(pos);
	return (c >= 9 && c <= 13) || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) {
		r++;
	}
	if(r > 0) return s.substr(r,l - r);
	else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) {
		r++;
	}
	if(r > 0) {
		return s.substr(0,l - r);
	}
	else {
		return s;
	}
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.rpad = function(s,c,l) {
	var sl = s.length;
	var cl = c.length;
	while(sl < l) {
		if(l - sl < cl) {
			s += c.substr(0,l - sl);
			sl = l;
		}
		else {
			s += c;
			sl += cl;
		}
	}
	return s;
}
StringTools.lpad = function(s,c,l) {
	var ns = "";
	var sl = s.length;
	if(sl >= l) return s;
	var cl = c.length;
	while(sl < l) {
		if(l - sl < cl) {
			ns += c.substr(0,l - sl);
			sl = l;
		}
		else {
			ns += c;
			sl += cl;
		}
	}
	return ns + s;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var neg = false;
	if(n < 0) {
		neg = true;
		n = -n;
	}
	var s = n.toString(16);
	s = s.toUpperCase();
	if(digits != null) while(s.length < digits) s = "0" + s;
	if(neg) s = "-" + s;
	return s;
}
StringTools.prototype.__class__ = StringTools;
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
		s.b[s.b.length] = l[0];
		l = l[1];
	}
	s.b[s.b.length] = "}";
	return s.b.join("");
}
List.prototype.__class__ = List;
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
AI = function(gvar,uivar,id,infoID) { if( gvar === $_ ) return; {
	Player.apply(this,[gvar,uivar,id,infoID]);
	this.isAI = true;
}}
AI.__name__ = ["AI"];
AI.__super__ = Player;
for(var k in Player.prototype ) AI.prototype[k] = Player.prototype[k];
AI.prototype.aiActivateNodeByConvert = function(node) {
	var resNeed = -1;
	{
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.power[i] < node.power[i]) resNeed = i;
		}
	}
	var resConv = -1;
	{
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			if(i != resNeed) if(Std["int"](this.power[i] / Game.powerConversionCost[i]) > node.power[resNeed]) resConv = i;
		}
	}
	if(resConv < 0) return;
	{
		var _g1 = 0, _g = node.power[resNeed];
		while(_g1 < _g) {
			var i = _g1++;
			this.convert(resConv,resNeed);
		}
	}
	this.activate(node);
}
AI.prototype.aiLowerAwareness = function() {
	if(this.awareness < 10 || this.getAdepts() == 0 || this.adeptsUsed >= this.getAdepts()) return;
	var prevAwareness = this.awareness;
	{
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			while(this.power[i] > 0 && this.adeptsUsed < this.getAdepts() && this.awareness >= 10) this.lowerAwareness(i);
		}
	}
	if(Game.debugAI && this.awareness != prevAwareness) haxe.Log.trace(this.name + " awareness " + prevAwareness + "% -> " + this.awareness + "%",{ fileName : "AI.hx", lineNumber : 189, className : "AI", methodName : "aiLowerAwareness"});
}
AI.prototype.aiLowerAwarenessSummon = function() {
	if(this.awareness == 0 || this.getAdepts() == 0 || !this.isRitual || (this.isRitual && this.ritual.id != "summoning")) return;
	var prevAwareness = this.awareness;
	while(this.getVirgins() > 0 && this.adeptsUsed < this.getAdepts() && this.awareness >= 0) {
		this.convert(3,0);
		this.lowerAwareness(0);
	}
	if(Game.debugAI && this.awareness != prevAwareness) haxe.Log.trace(this.name + " virgin awareness " + prevAwareness + "% -> " + this.awareness + "%",{ fileName : "AI.hx", lineNumber : 171, className : "AI", methodName : "aiLowerAwarenessSummon"});
}
AI.prototype.aiSummon = function() {
	if(this.getPriests() < 3 || this.getVirgins() < 9 || this.getUpgradeChance(2) < 50 || this.isRitual) return;
	if(Game.debugAI) haxe.Log.trace(this.name + " TRY SUMMON!",{ fileName : "AI.hx", lineNumber : 200, className : "AI", methodName : "aiSummon"});
	this.summonStart();
}
AI.prototype.aiTurn = function() {
	this.aiUpgradeFollowers();
	if(this.isParalyzed) return;
	this.aiLowerAwarenessSummon();
	this.aiLowerAwareness();
	this.aiSummon();
	var list = new Array();
	{
		var _g = 0, _g1 = this.game.nodes;
		while(_g < _g1.length) {
			var node = _g1[_g];
			++_g;
			if(node.owner == this || !node.visibility[this.id] || (Game.debugInvisible && node.owner == this.game.player)) continue;
			var item = { node : node, priority : 0}
			if(node.owner != null && node.level == 2 && node.owner.isRitual && node.owner.ritual.id == "summoning") item.priority += 3;
			if(node.owner == null) item.priority++;
			if(node.owner != null && this.wars[node.owner.id]) item.priority++;
			else if(node.owner != null && node.owner.isRitual && node.owner.ritual.id == "summoning") item.priority += 2;
			else if(node.owner != null) item.priority--;
			if(node.isGenerator && !node.isProtected) item.priority += 2;
			if(this.canActivate(node)) item.priority++;
			list.push(item);
		}
	}
	list.sort(function(x,y) {
		if(x.priority == y.priority) return 0;
		else if(x.priority > y.priority) return -1;
		else return 1;
	});
	{
		var _g = 0;
		while(_g < list.length) {
			var item = list[_g];
			++_g;
			var node = item.node;
			var ret = this.activate(node);
			if(ret == "ok") continue;
			if(ret == "notEnoughPower") this.aiActivateNodeByConvert(node);
			else if(ret == "hasLinks") 1;
		}
	}
}
AI.prototype.aiUpgradeFollowers = function() {
	if(this.getVirgins() == 0) return;
	if(this.getAdepts() < 5 && this.getUpgradeChance(0) > 70 && this.getVirgins() > 0) {
		while(true) {
			if(this.getVirgins() < 1 || this.getAdepts() >= 5) break;
			this.upgrade(0);
			if(Game.debugAI) haxe.Log.trace(this.name + " upgrade neophyte, adepts: " + this.getAdepts(),{ fileName : "AI.hx", lineNumber : 131, className : "AI", methodName : "aiUpgradeFollowers"});
		}
		return;
	}
	if(this.getPriests() < 3 && this.getUpgradeChance(1) > 60 && this.getVirgins() > 1) {
		while(true) {
			if(this.getVirgins() < 2 || this.getPriests() >= 3) break;
			this.upgrade(1);
			if(Game.debugAI) haxe.Log.trace("!!! " + this.name + " upgrade adept, priests: " + this.getPriests(),{ fileName : "AI.hx", lineNumber : 147, className : "AI", methodName : "aiUpgradeFollowers"});
		}
		return;
	}
}
AI.prototype.__class__ = AI;
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
	Date.now = function() {
		return new Date();
	}
	Date.fromTime = function(t) {
		var d = new Date();
		d["setTime"](t);
		return d;
	}
	Date.fromString = function(s) {
		switch(s.length) {
		case 8:{
			var k = s.split(":");
			var d = new Date();
			d["setTime"](0);
			d["setUTCHours"](k[0]);
			d["setUTCMinutes"](k[1]);
			d["setUTCSeconds"](k[2]);
			return d;
		}break;
		case 10:{
			var k = s.split("-");
			return new Date(k[0],k[1] - 1,k[2],0,0,0);
		}break;
		case 19:{
			var k = s.split(" ");
			var y = k[0].split("-");
			var t = k[1].split(":");
			return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
		}break;
		default:{
			throw "Invalid date format : " + s;
		}break;
		}
	}
	Date.prototype["toString"] = function() {
		var date = this;
		var m = date.getMonth() + 1;
		var d = date.getDate();
		var h = date.getHours();
		var mi = date.getMinutes();
		var s = date.getSeconds();
		return date.getFullYear() + "-" + ((m < 10?"0" + m:"" + m)) + "-" + ((d < 10?"0" + d:"" + d)) + " " + ((h < 10?"0" + h:"" + h)) + ":" + ((mi < 10?"0" + mi:"" + mi)) + ":" + ((s < 10?"0" + s:"" + s));
	}
	Date.prototype.__class__ = Date;
	Date.__name__ = ["Date"];
}
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
Node.names = ["Government official","Corporate worker","University professor","Army officer","Scientist"];
Game.powerNames = ["Intimidation","Persuasion","Bribery","Virgins"];
Game.powerShortNames = ["I","P","B","V"];
Game.powerColors = ["#ff0000","#00ffff","#00ff00","#ffff00"];
Game.followerNames = ["Neophyte","Adept","Priest"];
Game.powerConversionCost = [2,2,2,1];
Game.lineColors = ["#55dd55","#2727D7","#E052CA","#D8E151"];
Game.nodeColors = ["#005500","#010955","#560053","#505000"];
Game.playerColors = ["#00B400","#2F43FD","#B400AE","#B4AE00"];
Game.version = 2;
Game.followerLevels = 3;
Game.numPowers = 3;
Game.numPlayers = 4;
Game.numSummonVirgins = 9;
Game.nodesCount = 100;
Game.upgradeCost = 3;
Game.isDebug = false;
Game.debugTime = false;
Game.debugVis = false;
Game.debugNear = false;
Game.debugAI = false;
Game.debugInvisible = false;
Game.mapVisible = false;
Static.cults = [{ name : "Cult of Elder God", note : "The cult still lives.", longNote : "At the dawn of humanity the great old ones tolds their secrets in dreams to the first men, who formed a cult which had never died... Hidden in distant and dark places of the world, waiting for the day when the stars will be right again and the mighty Elder God will rise from his slumber under the deep waters to bring the earth beneath his sway once more.", summonStart : "", summonFinish : "", summonFail : ""},{ name : "Pharaonic Slumber", note : "A group that wants to put the entire world to sleep, feeding on the nightmares of the dreamers.", longNote : "Abhumans from a dark dimension close to ours came to Earth thousands of years ago, trading their magics and technology with the Egyptians for control of their people's minds when they slept, for they fed upon nightmares. With the secret help of the Roman Empire, the Egyptians drove the abhumans into hiding. But they have returned, and their goal has grown with time: the permanent slumber of the world.", summonStart : "As the Pharaonic Slumber's power grows, the world enters a state of controlled drowsiness. People go to bed earlier and sleep later, their dreams plagued with thoughts of sweeping sands and dark figures. Short naps at work become almost commonplace, and as the abhumans feed upon the dreaming energies of the world, everyone feels less and less energetic. All the more reason to take a bit of a rest...", summonFinish : "The world drifts off to sleep, some even slumping to the sidewalk where they were just walking or barely managing to bring their vehicles to a stop. The abhumans come out in force, walking amongst the dreaming populace, feeding hungrily upon the horrid dreams foisted upon them by the dark magics. A few humans manage to keep themselves awake a bit longer on massive doses of amphetamines, but soon they too crash into the darkness of eternal slumber, screaming into unconsciousness as they see the burning red eyes of those who've come to consume their thoughts.", summonFail : "People shake off the dozing state that had captured them. Sales of coffee and cola rocket temporarily, an odd spike that intrigues many commentators, and for a moment humanity is more awake than it has ever been before. Soon, however, old habits return, and some are still plagued by dreams of windswept deserts they have never before seen and cloaked figures that move in a way that somehow feels inhuman, dreams that feel more real than reality."},{ name : "Blooded Mask", note : "A group devoted to ripping away the masks people wear and revealing the insane reality beyond.", longNote : "Those who peer too long into the Abyss find that it stares back at them, and the Blooded Mask has long gazed into the ineffable world beyond our own. Affiliated with no Elder God, or perhaps all of them, the Blooded Mask longs to show humanity the brutal truths that hide behind the consensual reality. The truths drive those who see them insane, filling them with a desire to show others as well, and the Blooded Mask are the original converts.", summonStart : "A rash of cases of schizophrenia and paranoid delusions becomes an epidemic.  World health organizations struggle to understand environmental factors behind the increasing numbers of psychotic breaks and irrational behaviour across the world, unaware of the rituals the Blooded Mask are enacting.  The only clue is an increased incidence of individuals trying to claw their eyes out, often babbling about seeing <i>the truth</i> better without them.", summonFinish : "Even the most stable individuals become gripped by the desire to see beyond the veil. Plucking their eyes out, almost as one, humanity peers out of bloody sockets into the screaming void of alien truth that had, until then, been hidden to most. The Bloody Veil's incantations brought to their climax, the world becomes a madhouse of screaming blind horror, people stumbling through living nightmares in colours their minds were never meant to comprehend, groping past those others wandering in the same strange geometries.", summonFail : "The outbreak of madness draws to a close, the circumstances at its end as mysterious as when it began. Sanity returns to some of those who saw the underlying truth, but those who blinded themselves are relegated to sanitariums around the world, their screaming reverberating in the halls of the buildings, unable to stop seeing the horrifying ur-reality. A small number of painters attempt to incorporate the colours they saw in their madness into their work, and the epileptic seizures their paintings evoke cause the black ops divisions of the world's governments to destroy all evidence of their work."},{ name : "Universal Lambda", note : "Programmers who want to turn humanity into a vast processing machine.", longNote : "In the early seventies, a secret goverment project uncovered the changes necessary to turn any human brain into an efficient, soulless computer.  Little did the project know that it had been subverted by the dark cult. The Universal Lambda works to refine that now-defunct project's results: the turning of every human being into cogs of a huge machine, a distributed network for the vast living intellect of the Elder God.", summonStart : "The Universal Lambda's cybermantic machinations begin to influence the entire world.  People start to walk in unconscious lockstep down the streets; crime and accident rates drop as the rituals rewire minds to be more and more regimented.  People make fewer choices, locking themselves into patterns without realizing the steady loss of free will.", summonFinish : "Their rituals complete, the Universal Lambda turns the world into a well-oiled machine. Bodies still move around, taking part in the same rote behavior they did before, but the minds of the populace are gone. Instead of thinking independent thoughts, humanity's brains run the code that allows The Machine to run in our dimension. The tiny flickers of free will brought upon by every birth are quickly consumed by the overwhelming cybermantic magics enveloping the world; all are just parts of the giant soulless entity... ", summonFail : "The eerily constant behavior of humanity slowly returns to its regular froth of chaos. People still occasionally slip into the robotic state they exhibited mere days before, but the rising rate of accidents and deaths heralds the return of free will, for better or worse."}];
Static.rituals = [{ id : "summoning", name : "Final Ritual", points : 9, note : "Upon completion this cult will reign over the world unchallenged."}];
UI.mapWidth = 800;
UI.mapHeight = 580;
UI.tooltipWidth = 100;
UI.tooltipHeight = 80;
UI.markerWidth = 15;
UI.markerHeight = 15;
UI.nodeVisibility = 101;
UI.colAwareness = "#ff9999";
UI.tipPowers = [UI.powerName(0) + " is needed to gain new followers.",UI.powerName(1) + " is needed to gain new followers.",UI.powerName(2) + " is needed to gain new followers.",UI.powerName(3) + " are gathered by your neophytes.<br>" + "They are needed for rituals to upgrade your<br>followers " + "and also for the final ritual of summoning."];
UI.tipConvert = "Cost to convert to ";
UI.tipUpgrade = ["To gain an adept you need " + Game.upgradeCost + " neophytes and 1 virgin.","To gain a priest you need " + Game.upgradeCost + " adepts and 2 virgins.","To perform the " + Static.rituals[0].name + " you need " + Game.upgradeCost + " priests and " + Game.numSummonVirgins + " virgins.<br>" + "<li>The more society is aware of the cult the harder it is to " + "summon Elder God."];
UI.tipFollowers = ["Neophytes can find some virgins if they're lucky.","Adepts can lower society awareness.","3 priests and " + Game.numSummonVirgins + " virgins are needed to summon the Elder God."];
UI.tipTurns = "Shows the number of turns passed from the start.";
UI.tipAwareness = "Shows how much human society is aware of the cult.<br>" + "<li>The greater awareness is the harder it is to do anything:<br>" + "gain new followers, resources or make rituals.<br> " + "<li>Adepts can lower the society awareness using resources.<br>" + "<li>The more adepts you have the more you can lower awareness each turn.";
UI.tipLowerAwareness = "Your adepts can use resources to lower society awareness.";
UI.tipEndTurn = "Click to end current turn.";
UI.tipInfo = "Click to view cults information.";
UI.tipRestart = "Click to restart a game.";
UI.tipLog = "Click to view message log.";
UI.tipAbout = "Click to go to About page.";
DateTools.DAYS_OF_MONTH = [31,28,31,30,31,30,31,31,30,31,30,31];
$Main.init = Game.main();
