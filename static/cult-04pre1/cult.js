$estr = function() { return js.Boot.__string_rec(this,''); }
Line = function(screen) { if( screen === $_ ) return; {
	this.screen = screen;
	this.pixels = new Array();
}}
Line.__name__ = ["Line"];
Line.paint = function(map,player,startNode,endNode) {
	var screen = map.screen;
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
			var pixel = js.Lib.document.createElement("div");
			pixel.style.position = "absolute";
			pixel.style.left = Math.round(x) + "px";
			pixel.style.top = Math.round(y) + "px";
			pixel.style.width = "2";
			pixel.style.height = "2";
			pixel.style.background = UI.lineColors[player.id];
			pixel.style.zIndex = 5;
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
SaveMenu = function(uivar,gvar) { if( uivar === $_ ) return; {
	this.ui = uivar;
	this.game = gvar;
	this.isVisible = false;
	this.window = Tools.window({ id : "saveMenuWindow", center : true, winW : UI.winWidth, winH : UI.winHeight, w : 420, h : 320, z : 25});
	Tools.label({ id : "saveLabel", text : "Key", w : 60, h : 30, x : 35, y : 30, container : this.window});
	this.key = Tools.textfield({ id : "saveKey", text : getCookie("owner"), w : 205, h : 30, x : 85, y : 30, container : this.window});
	this.key.onclick = $closure(this,"onKeyClick");
	Tools.button({ id : "saveRefresh", text : "Refresh", w : 100, h : 30, x : 300, y : 30, container : this.window, func : $closure(this,"onRefresh")});
	this.noKey = Tools.label({ id : "loadLabel2", text : "Type in key to proceed.", w : 270, h : 30, x : 90, y : 150, container : this.window});
	this.saves = new Array();
	this.saveButtons = new Array();
	this.delButtons = new Array();
	{
		var _g1 = 0, _g = UI.maxSaves;
		while(_g1 < _g) {
			var i = _g1++;
			var b = Tools.button({ id : "save" + i, text : "...", w : 330, h : 30, x : 35, y : 70 + 40 * i, container : this.window, func : $closure(this,"onSaveGame")});
			this.saveButtons.push(b);
			var b2 = Tools.button({ id : "del" + i, text : "X", w : 20, h : 30, x : 380, y : 70 + 40 * i, container : this.window, func : $closure(this,"onDelGame")});
			this.delButtons.push(b2);
		}
	}
	this.bg = Tools.bg({ w : UI.winWidth + 20, h : UI.winHeight});
	this.close = Tools.closeButton(this.window,180,280,"saveMenuClose");
	this.close.onclick = $closure(this,"onClose");
}}
SaveMenu.__name__ = ["SaveMenu"];
SaveMenu.prototype.bg = null;
SaveMenu.prototype.close = null;
SaveMenu.prototype.delButtons = null;
SaveMenu.prototype.game = null;
SaveMenu.prototype.isVisible = null;
SaveMenu.prototype.key = null;
SaveMenu.prototype.keyFocused = null;
SaveMenu.prototype.noKey = null;
SaveMenu.prototype.onClose = function(event) {
	this.window.style.visibility = "hidden";
	this.bg.style.visibility = "hidden";
	this.close.style.visibility = "hidden";
	this.noKey.style.visibility = "hidden";
	{
		var _g = 0, _g1 = this.delButtons;
		while(_g < _g1.length) {
			var b = _g1[_g];
			++_g;
			b.style.visibility = "hidden";
		}
	}
	{
		var _g = 0, _g1 = this.saveButtons;
		while(_g < _g1.length) {
			var b = _g1[_g];
			++_g;
			b.style.visibility = "hidden";
		}
	}
	this.isVisible = false;
}
SaveMenu.prototype.onDelGame = function(event) {
	var b = Tools.getTarget(event);
	var n = Std.parseInt(b.id.substring(3));
	this.onDelReal(n);
}
SaveMenu.prototype.onDelReal = function(n) {
	var save = this.saves[n];
	var req = new js.XMLHttpRequest();
	req.open("GET","/save.delete?owner=" + getCookie("owner") + "&id=" + save.id,false);
	req.send(null);
	var text = req.responseText;
	this.show();
}
SaveMenu.prototype.onKey = function(e) {
	if(this.keyFocused) return;
	if(e.keyCode == 49) this.onSaveReal(0);
	else if(e.keyCode == 50) this.onSaveReal(1);
	else if(e.keyCode == 51) this.onSaveReal(2);
	else if(e.keyCode == 52) this.onSaveReal(3);
	else if(e.keyCode == 53) this.onSaveReal(4);
	else if(e.keyCode == 27) this.onClose(null);
}
SaveMenu.prototype.onKeyClick = function() {
	this.keyFocused = true;
}
SaveMenu.prototype.onRefresh = function(event) {
	setCookie("owner",this.key.value,new Date(2015, 0, 0, 0, 0, 0, 0));
	this.show();
}
SaveMenu.prototype.onSaveGame = function(event) {
	var b = Tools.getTarget(event);
	var n = Std.parseInt(b.id.substring(4));
	this.onSaveReal(n);
}
SaveMenu.prototype.onSaveReal = function(n) {
	var save = this.saves[n];
	var id = 0;
	if(save != null) id = save.id;
	var name = Date.now().toString();
	var req = new js.XMLHttpRequest();
	req.open("POST","/save.save?owner=" + getCookie("owner") + "&id=" + id + "&name=" + name + "&version=" + Game.version,false);
	var obj = this.game.save();
	var str = JSON.stringify(obj);
	req.send(str);
	var text = req.responseText;
	if(text == "TooBig") {
		this.ui.alert("Save file too big (" + Std["int"](str.length / 1024) + "kb)! Contact me to raise limit.");
		return;
	}
	else if(text == "TooManySaves") {
		this.ui.alert("Too many saved games already.");
		return;
	}
	this.onClose(null);
}
SaveMenu.prototype.saveButtons = null;
SaveMenu.prototype.saves = null;
SaveMenu.prototype.show = function() {
	{
		var _g = 0, _g1 = this.delButtons;
		while(_g < _g1.length) {
			var b = _g1[_g];
			++_g;
			b.style.visibility = "hidden";
		}
	}
	if(getCookie("owner") != "" && getCookie("owner") != null) {
		var req = new js.XMLHttpRequest();
		req.open("GET","/save.list?owner=" + getCookie("owner"),false);
		req.send(null);
		var text = req.responseText;
		var list = JSON.parse(text);
		this.saves = list;
		{
			var _g = 0, _g1 = this.saveButtons;
			while(_g < _g1.length) {
				var b = _g1[_g];
				++_g;
				b.style.visibility = "visible";
				b.innerHTML = "---";
			}
		}
		var i = 0;
		{
			var _g = 0;
			while(_g < list.length) {
				var item = list[_g];
				++_g;
				var b = this.saveButtons[i];
				if(b == null) break;
				b.innerHTML = item.name;
				this.delButtons[i].style.visibility = "visible";
				i++;
			}
		}
		this.noKey.style.visibility = "hidden";
	}
	else {
		{
			var _g = 0, _g1 = this.saveButtons;
			while(_g < _g1.length) {
				var b = _g1[_g];
				++_g;
				b.style.visibility = "hidden";
			}
		}
		this.noKey.style.visibility = "visible";
	}
	this.key.value = getCookie("owner");
	this.window.style.visibility = "visible";
	this.bg.style.visibility = "visible";
	this.close.style.visibility = "visible";
	this.isVisible = true;
	this.keyFocused = false;
}
SaveMenu.prototype.ui = null;
SaveMenu.prototype.window = null;
SaveMenu.prototype.__class__ = SaveMenu;
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
Log = function(uivar,gvar) { if( uivar === $_ ) return; {
	this.ui = uivar;
	this.game = gvar;
	this.isVisible = false;
	this.window = Tools.window({ id : "window", center : true, winW : UI.winWidth, winH : UI.winHeight, fontSize : 18, w : 800, h : 500, z : 14});
	this.window.style.visibility = "hidden";
	this.window.style.background = "#333333";
	this.window.style.border = "4px double #ffffff";
	this.text = js.Lib.document.createElement("div");
	this.text.style.overflow = "auto";
	this.text.style.position = "absolute";
	this.text.style.left = 10;
	this.text.style.top = 10;
	this.text.style.width = 780;
	this.text.style.height = 450;
	this.text.style.background = "#0b0b0b";
	this.text.style.border = "1px solid #777";
	this.window.appendChild(this.text);
	var close = Tools.closeButton(this.window,360,465,"logClose");
	close.onclick = $closure(this,"onClose");
}}
Log.__name__ = ["Log"];
Log.prototype.add = function(s,doShow) {
	this.text.innerHTML += "<span style='color:#888888'>" + DateTools.format(Date.now(),"%H:%M:%S") + "</span>" + " Turn " + (this.game.turns + 1) + ": " + s + "<br>";
	if(doShow == null || doShow == true) this.show();
	this.logPrevTurn = this.game.turns;
}
Log.prototype.clear = function() {
	this.text.innerHTML = "";
}
Log.prototype.game = null;
Log.prototype.isVisible = null;
Log.prototype.logPrevTurn = null;
Log.prototype.onClose = function(event) {
	this.window.style.visibility = "hidden";
	this.isVisible = false;
}
Log.prototype.show = function() {
	this.text.scrollTop = 10000;
	this.window.style.visibility = "visible";
	this.isVisible = true;
}
Log.prototype.text = null;
Log.prototype.ui = null;
Log.prototype.window = null;
Log.prototype.__class__ = Log;
Cult = function(gvar,uivar,id,infoID) { if( gvar === $_ ) return; {
	this.game = gvar;
	this.ui = uivar;
	this.id = id;
	this.infoID = infoID;
	this.info = Static.cults[infoID];
	this.name = this.info.name;
	this.isAI = false;
	this.power = [0,0,0,0];
	this.powerMod = [0,0,0,0];
	this.wars = [false,false,false,false];
	this.adeptsUsed = 0;
	this.setAwareness(0);
	this.nodes = new List();
	this.investigatorTimeout = 0;
	this.difficulty = this.game.difficulty;
}}
Cult.__name__ = ["Cult"];
Cult.prototype.activate = function(node) {
	if(this.isParalyzed) {
		if(!this.isAI) this.ui.alert("Cult is paralyzed without the Origin.");
		return "";
	}
	if(node.owner == this) return "isOwner";
	if(node.isGenerator && node.owner != null) {
		var cnt = 0;
		{ var $it0 = node.links.iterator();
		while( $it0.hasNext() ) { var n = $it0.next();
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
			{
				js.Lib.document.getElementById("jqDialog_close").style.visibility = "hidden";
				JQDialog.notify("Could not gain a follower.",1);
			}
			this.ui.updateStatus();
		}
		return "failure";
	}
	if(node.level > 0) node.level--;
	node.setOwner(this);
	this.checkVictory();
	if(this.isAI && node.visibility[0]) node.setHighlighted(true);
	return "ok";
}
Cult.prototype.adepts = null;
Cult.prototype.adeptsUsed = null;
Cult.prototype.awareness = null;
Cult.prototype.canActivate = function(node) {
	{
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.power[i] < node.power[i]) return false;
		}
	}
	return true;
}
Cult.prototype.canUpgrade = function(level) {
	if(level < 2) return (this.getNumFollowers(level) >= Game.upgradeCost && this.getVirgins() >= level + 1);
	else return (this.getPriests() >= Game.upgradeCost && this.getVirgins() >= Game.numSummonVirgins && !this.isRitual);
}
Cult.prototype.checkDeath = function() {
	if(this.nodes.length > 0 || this.isDead) return;
	this.ui.log2("cult",this,this.getFullName() + " has been destroyed, forgotten by time.");
	this.isDead = true;
	{
		var _g = 0, _g1 = this.game.cults;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			c.wars[this.id] = false;
		}
	}
	{
		var _g1 = 0, _g = this.wars.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.wars[i] = false;
		}
	}
	this.hasInvestigator = false;
	this.investigator = null;
	if(!this.isAI) {
		this.game.isFinished = true;
		this.ui.finish(this,"wiped");
	}
	else this.checkVictory();
}
Cult.prototype.checkVictory = function() {
	var ok = true;
	{
		var _g = 0, _g1 = this.game.cults;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			if(p != this && !p.isDead) ok = false;
		}
	}
	if(!ok) return;
	this.game.isFinished = true;
	this.ui.finish(this,"conquer");
}
Cult.prototype.convert = function(from,to) {
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
Cult.prototype.declareWar = function(cult) {
	if(cult.wars[this.id]) return;
	cult.wars[this.id] = true;
	this.wars[cult.id] = true;
	this.ui.log2("cults",{ c1 : this, c2 : cult},this.getFullName() + " has declared war against " + cult.getFullName() + ".");
}
Cult.prototype.difficulty = null;
Cult.prototype.fullName = null;
Cult.prototype.game = null;
Cult.prototype.getAdepts = function() {
	return this.getNumFollowers(1);
}
Cult.prototype.getFullName = function() {
	return UI.cultName(this.id,this.info);
}
Cult.prototype.getGainChance = function(node) {
	var ch = 0;
	if(!node.isGenerator) ch = 99 - Std["int"](this.awareness * this.difficulty.awarenessGain);
	else ch = 99 - Std["int"](this.awareness * 2 * this.difficulty.awarenessGain);
	if(ch < 1) ch = 1;
	return ch;
}
Cult.prototype.getInvestigatorChance = function() {
	return Std["int"]((20 * this.getPriests() + 5 * this.getAdepts() + 0.5 * this.getNeophytes()) * this.difficulty.investigatorChance);
}
Cult.prototype.getNeophytes = function() {
	return this.getNumFollowers(0);
}
Cult.prototype.getNumFollowers = function(level) {
	var cnt = 0;
	{ var $it1 = this.nodes.iterator();
	while( $it1.hasNext() ) { var n = $it1.next();
	if(n.level == level) cnt++;
	}}
	return cnt;
}
Cult.prototype.getPriests = function() {
	return this.getNumFollowers(2);
}
Cult.prototype.getResourceChance = function() {
	var ch = 99 - Std["int"](this.difficulty.awarenessResource * this.awareness);
	if(ch < 1) ch = 1;
	return ch;
}
Cult.prototype.getUpgradeChance = function(level) {
	var ch = 0;
	if(level == 0) ch = Std["int"](99 * this.difficulty.upgradeChance - this.awareness * this.difficulty.awarenessUpgrade);
	else if(level == 1) ch = Std["int"](80 * this.difficulty.upgradeChance - this.awareness * 1.5 * this.difficulty.awarenessUpgrade);
	else if(level == 2) ch = Std["int"](75 * this.difficulty.upgradeChance - this.awareness * 2 * this.difficulty.awarenessUpgrade);
	if(ch < 1) ch = 1;
	if(ch > 99) ch = 99;
	return ch;
}
Cult.prototype.getVirgins = function() {
	return this.power[3];
}
Cult.prototype.hasInvestigator = null;
Cult.prototype.id = null;
Cult.prototype.info = null;
Cult.prototype.infoID = null;
Cult.prototype.investigator = null;
Cult.prototype.investigatorTimeout = null;
Cult.prototype.isAI = null;
Cult.prototype.isDead = null;
Cult.prototype.isDebugInvisible = null;
Cult.prototype.isParalyzed = null;
Cult.prototype.isRitual = null;
Cult.prototype.load = function(c) {
	this.difficulty = Static.difficulty[c.dif];
	this.isDead = ((c.ide?true:false));
	this.isParalyzed = ((c.ip?true:false));
	this.power = c.p;
	this.adeptsUsed = c.au;
	this.investigatorTimeout = c.it;
	if(c.inv != null) {
		this.hasInvestigator = true;
		this.investigator = new Investigator(this,this.ui);
		this.investigator.load(c.inv);
	}
	if(c.r != null) {
		this.isRitual = true;
		this.ritualPoints = c.rp;
		{
			var _g = 0, _g1 = Static.rituals;
			while(_g < _g1.length) {
				var r = _g1[_g];
				++_g;
				if(r.id == c.r) this.ritual = r;
			}
		}
	}
	this.setAwareness(c.aw);
	if(c.w != null) {
		var wlist = c.w;
		this.wars = [];
		{
			var _g = 0;
			while(_g < wlist.length) {
				var w = wlist[_g];
				++_g;
				this.wars.push((w == 1?true:false));
			}
		}
	}
}
Cult.prototype.loseNode = function(node,cult) {
	{
		var _g = this, _g1 = _g.awareness;
		_g.setAwareness(_g1 + 1);
		_g1;
	}
	if(!this.isAI) this.ui.updateStatus();
	if(cult != null && this.nodes.length > 0) cult.declareWar(this);
	if(this.origin == node) this.loseOrigin();
	node.update();
	this.checkDeath();
}
Cult.prototype.loseOrigin = function() {
	this.ui.log2("cult",this,this.getFullName() + " has lost its Origin.");
	if(this.isRitual) {
		this.isRitual = false;
		this.ui.log2("cult",this,"The execution of " + this.ritual.name + " has been stopped.");
	}
	var ok = false;
	this.origin = null;
	{ var $it2 = this.nodes.iterator();
	while( $it2.hasNext() ) { var n = $it2.next();
	{
		if(n.level == 2) {
			this.origin = n;
			ok = true;
			break;
		}
	}
	}}
	if(!ok) {
		this.ui.log2("cult",this,"With no priests left " + this.getFullName() + " is completely paralyzed.");
		this.isParalyzed = true;
	}
	else {
		this.ui.log2("cult",this,"Another priest becomes the Origin of " + this.getFullName() + ".");
		this.origin.update();
	}
}
Cult.prototype.lowerAwareness = function(pwr) {
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
Cult.prototype.lowerWillpower = function(pwr) {
	if(!this.hasInvestigator || this.adeptsUsed >= this.getAdepts() || pwr == 3 || this.power[pwr] < Game.willPowerCost || this.investigator.isHidden) return;
	this.power[pwr] -= Game.willPowerCost;
	var failChance = 30 * this.difficulty.investigatorWillpower;
	if(this.investigator.name == "Randolph Carter") failChance += 10;
	if(100 * Math.random() < failChance) {
		if(!this.isAI) {
			{
				js.Lib.document.getElementById("jqDialog_close").style.visibility = "hidden";
				JQDialog.notify("You have failed to shatter the will of the investigator.",1);
			}
			this.ui.updateStatus();
		}
		return;
	}
	this.investigator.will -= 1;
	if(this.investigator.will <= 0) {
		this.investigator = null;
		this.hasInvestigator = false;
		this.ui.log2("cult",this,"The investigator of the " + this.getFullName() + " has disappeared.");
		this.investigatorTimeout = 3;
	}
	this.adeptsUsed++;
	if(!this.isAI) this.ui.updateStatus();
}
Cult.prototype.makePeace = function(cult) {
	if(!cult.wars[this.id]) return;
	cult.wars[this.id] = false;
	this.wars[cult.id] = false;
	this.ui.log2("cults",{ c1 : this, c2 : cult},this.getFullName() + " has made peace with " + cult.getFullName() + ".");
}
Cult.prototype.name = null;
Cult.prototype.neophytes = null;
Cult.prototype.nodes = null;
Cult.prototype.origin = null;
Cult.prototype.power = null;
Cult.prototype.powerMod = null;
Cult.prototype.priests = null;
Cult.prototype.removeCloseGenerators = function() {
	{ var $it3 = this.origin.links.iterator();
	while( $it3.hasNext() ) { var n = $it3.next();
	{
		if(n.owner == null && n.isGenerator) n.setGenerator(false);
	}
	}}
}
Cult.prototype.ritual = null;
Cult.prototype.ritualFinish = function() {
	if(this.ritual.id == "summoning") this.summonFinish();
	this.isRitual = false;
}
Cult.prototype.ritualPoints = null;
Cult.prototype.save = function() {
	var obj = { id : this.id, iid : this.infoID, dif : this.difficulty.level, ia : ((this.isAI?1:0)), ide : ((this.isDead?1:0)), ip : ((this.isParalyzed?1:0)), p : this.power, or : ((this.origin != null?this.origin.id:0)), au : this.adeptsUsed, it : this.investigatorTimeout}
	if(this.hasInvestigator) obj.inv = this.investigator.save();
	if(this.isRitual) {
		obj.r = this.ritual.id;
		obj.rp = this.ritualPoints;
	}
	obj.aw = this.awareness;
	var ww = [];
	var savewars = false;
	{
		var _g = 0, _g1 = this.wars;
		while(_g < _g1.length) {
			var w = _g1[_g];
			++_g;
			ww.push((w?1:0));
			if(w) savewars = true;
		}
	}
	if(savewars) obj.w = this.wars;
	return obj;
}
Cult.prototype.setAwareness = function(v) {
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
Cult.prototype.setOrigin = function() {
	var index = -1;
	while(true) {
		index = Math.round((this.game.nodes.length - 1) * Math.random());
		var node = this.game.nodes[index];
		if(node.owner != null) continue;
		var ok = 1;
		{
			var _g = 0, _g1 = this.game.cults;
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
	this.origin.owner = this;
	this.nodes.add(this.origin);
	this.origin.update();
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
	if(!this.isAI && this.game.difficultyLevel == 2) this.removeCloseGenerators();
}
Cult.prototype.setVirgins = function(v) {
	this.power[3] = v;
	return v;
}
Cult.prototype.summonFinish = function() {
	if(100 * Math.random() > this.getUpgradeChance(2)) {
		{ var $it4 = this.nodes.iterator();
		while( $it4.hasNext() ) { var n = $it4.next();
		if(n.level == 2) {
			n.level = 0;
			n.update();
			break;
		}
		}}
		if(!this.isAI) {
			this.ui.alert("The stars were not properly aligned. The high priest goes insane.");
			this.ui.log2("cult",this,this.getFullName() + " has failed to perform the " + Static.rituals[0].name + ".");
			this.ui.updateStatus();
		}
		else {
			this.ui.alert(this.getFullName() + " has failed to perform the " + Static.rituals[0].name + ".<br><br>" + this.info.summonFail);
			this.ui.log2("cult",this,this.getFullName() + " has failed the " + Static.rituals[0].name + ".");
		}
		return;
	}
	this.game.isFinished = true;
	this.ui.finish(this,"summon");
	this.ui.log2("cult",this,"Game over.");
}
Cult.prototype.summonStart = function() {
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
		var _g = 0, _g1 = this.game.cults;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			if(p != this && !p.isDead) {
				p.wars[this.id] = true;
				this.wars[p.id] = true;
			}
		}
	}
	this.ui.alert(this.getFullName() + " has started the " + this.ritual.name + ".<br><br>" + Static.cults[this.id].summonStart);
	this.ui.log2("cult",this,this.getFullName() + " has started the " + this.ritual.name + ".");
	if(!this.isAI) this.ui.updateStatus();
}
Cult.prototype.turn = function() {
	if((this.getPriests() > 0 || this.getAdepts() > 0) && !this.hasInvestigator && 100 * Math.random() < this.getInvestigatorChance() && this.investigatorTimeout == 0) {
		this.hasInvestigator = true;
		this.ui.log2("cult",this,"An investigator has found out about " + this.getFullName() + ".");
		this.investigator = new Investigator(this,this.ui);
		if(!this.isAI) this.ui.updateStatus();
	}
	if(this.investigatorTimeout > 0) this.investigatorTimeout--;
	if(this.isRitual) {
		this.ritualPoints -= this.getPriests();
		if(this.ritualPoints <= 0) this.ritualFinish();
		if(this.game.isFinished) return;
	}
	this.powerMod = [0,0,0,0];
	{ var $it5 = this.nodes.iterator();
	while( $it5.hasNext() ) { var node = $it5.next();
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
	if(this.hasInvestigator) this.investigator.turn();
}
Cult.prototype.ui = null;
Cult.prototype.upgrade = function(level) {
	if(!this.canUpgrade(level)) return;
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
			{
				js.Lib.document.getElementById("jqDialog_close").style.visibility = "hidden";
				JQDialog.notify("Ritual failed.",1);
			}
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
	if(this.origin != null && this.origin.level == level) {
		this.origin.upgrade();
		upNode = this.origin;
		ok = true;
	}
	if(!ok) { var $it6 = this.nodes.iterator();
	while( $it6.hasNext() ) { var n = $it6.next();
	if(n.level == level && n.isGenerator) {
		n.upgrade();
		upNode = n;
		ok = true;
		break;
	}
	}}
	if(!ok) { var $it7 = this.nodes.iterator();
	while( $it7.hasNext() ) { var n = $it7.next();
	if(n.level == level) {
		n.upgrade();
		upNode = n;
		ok = true;
		break;
	}
	}}
	if(!this.isAI) this.ui.updateStatus();
	if(this != this.game.player && this.getPriests() >= 2) this.ui.log2("cult",this,this.getFullName() + " has " + this.getPriests() + " priests. Be careful.");
	if(this.isParalyzed && this.getPriests() >= 1) {
		this.isParalyzed = false;
		this.origin = upNode;
		this.origin.update();
		this.ui.log2("cult",this,this.getFullName() + " gains a priest and is no longer paralyzed.");
	}
}
Cult.prototype.virgins = null;
Cult.prototype.wars = null;
Cult.prototype.__class__ = Cult;
UINode = function(gvar,uivar,nvar) { if( gvar === $_ ) return; {
	this.game = gvar;
	this.ui = uivar;
	this.node = nvar;
	this.marker = js.Lib.document.createElement("div");
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
	this.marker.style.zIndex = 10;
	this.marker.style.cursor = "pointer";
	this.marker.onclick = $closure(this.ui.map,"onNodeClick");
	this.ui.map.screen.appendChild(this.marker);
	this.markerHL = js.Lib.document.createElement("div");
	this.markerHL.style.visibility = "hidden";
	this.markerHL.style.background = "#111";
	this.markerHL.style.border = "1px solid #333";
	this.markerHL.style.width = UI.markerWidth + 20;
	this.markerHL.style.height = UI.markerHeight + 20;
	this.markerHL.style.position = "absolute";
	this.markerHL.style.opacity = 0.5;
	this.markerHL.style.left = this.node.centerX - (UI.markerWidth + 21) / 2;
	this.markerHL.style.top = this.node.centerY - (UI.markerHeight + 21) / 2;
	this.markerHL.style.zIndex = 8;
	this.ui.map.screen.appendChild(this.markerHL);
}}
UINode.__name__ = ["UINode"];
UINode.prototype.game = null;
UINode.prototype.marker = null;
UINode.prototype.markerHL = null;
UINode.prototype.node = null;
UINode.prototype.setHighlighted = function() {
	this.update();
}
UINode.prototype.setVisible = function(c,v) {
	if(c.isAI) return;
	if(Game.mapVisible) v = true;
	this.marker.style.visibility = ((v?"visible":"hidden"));
}
UINode.prototype.ui = null;
UINode.prototype.update = function() {
	var s = "";
	if(Game.debugNear) {
		s += "Node " + this.node.id + "<br>";
		{ var $it8 = this.node.links.iterator();
		while( $it8.hasNext() ) { var n = $it8.next();
		s += n.id + "<br>";
		}}
	}
	if(Game.debugVis) {
		s += "Node " + this.node.id + "<br>";
		{
			var _g1 = 0, _g = Game.numCults;
			while(_g1 < _g) {
				var i = _g1++;
				s += this.node.visibility[i] + "<br>";
			}
		}
	}
	if(this.node.owner != null) {
		s += "<span style='color:" + Game.cultColors[this.node.owner.id] + "'>" + this.node.owner.name + "</span><br>";
		if(this.node.owner.origin == this.node) s += "<span style='color:" + Game.cultColors[this.node.owner.id] + "'>The Origin</span><br>";
		s += "<br>";
	}
	s += "<span style='color:white'>" + this.node.name + "</span><br>";
	s += this.node.job + "<br>";
	if(this.node.owner != null) s += "<b>" + Game.followerNames[this.node.level] + "</b> <span style='color:white'>L" + (this.node.level + 1) + "</span><br>";
	{
		s += "<br>";
		{
			var _g1 = 0, _g = Game.numPowers;
			while(_g1 < _g) {
				var i = _g1++;
				if(this.node.power[i] > 0) {
					s += "<b style='color:" + UI.powerColors[i] + "'>" + Game.powerNames[i] + "</b> " + this.node.power[i] + "<br>";
					this.marker.innerHTML = Game.powerShortNames[i];
					this.marker.style.color = UI.powerColors[i];
				}
			}
		}
		if(this.node.owner == null || this.node.owner.isAI) s += "Chance of success: <span style='color:white'>" + this.game.player.getGainChance(this.node) + "%</span><br>";
	}
	this.marker.style.background = "#111";
	if(this.node.owner != null) {
		this.marker.innerHTML = "" + (this.node.level + 1);
		this.marker.style.color = "#ffffff";
		this.marker.style.background = UI.nodeColors[this.node.owner.id];
	}
	this.marker.style.border = "1px solid #777";
	var borderWidth = 1;
	if(this.node.isGenerator) {
		borderWidth = 3;
		var col = "#777";
		var type = "solid";
		if(this.node.isProtected) col = "#ffffff";
		{
			var _g = 0, _g1 = this.game.cults;
			while(_g < _g1.length) {
				var p = _g1[_g];
				++_g;
				if(p.origin == this.node && !p.isDead) {
					borderWidth = 5;
					type = "double";
					break;
				}
			}
		}
		this.marker.style.border = borderWidth + "px " + type + " " + col;
		s += "<br>Generates:<br>";
		{
			var _g1 = 0, _g = Game.numPowers;
			while(_g1 < _g) {
				var i = _g1++;
				if(this.node.powerGenerated[i] > 0) s += "<b style='color:" + UI.powerColors[i] + "'>" + Game.powerNames[i] + "</b> " + this.node.powerGenerated[i] + "<br>";
			}
		}
	}
	this.marker.title = s;
	new JQuery("#map\\.node" + this.node.id).tooltip({ delay : 0});
	this.markerHL.style.visibility = ((this.node.isHighlighted?"visible":"hidden"));
	if(this.node.isHighlighted) {
		this.markerHL.style.width = UI.markerWidth + borderWidth + 19;
		this.markerHL.style.height = UI.markerHeight + borderWidth + 19;
		this.markerHL.style.left = this.node.centerX - (UI.markerWidth - borderWidth + 22) / 2;
		this.markerHL.style.top = this.node.centerY - (UI.markerHeight - borderWidth + 22) / 2;
	}
}
UINode.prototype.__class__ = UINode;
Game = function(p) { if( p === $_ ) return; {
	this.isFinished = true;
	this.turns = 0;
	this.ui = new UI(this);
	this.ui.init();
	this.ui.mainMenu.show();
}}
Game.__name__ = ["Game"];
Game.instance = null;
Game.main = function() {
	Game.instance = new Game();
}
Game.prototype.cults = null;
Game.prototype.difficulty = null;
Game.prototype.difficultyLevel = null;
Game.prototype.endTimer = function(name) {
	if(Game.debugTime) haxe.Log.trace(name + ": " + (Date.now().getTime() - this.timerTime) + "ms",{ fileName : "Game.hx", lineNumber : 365, className : "Game", methodName : "endTimer"});
}
Game.prototype.endTurn = function() {
	this.ui.logPanel.endTurn();
	{
		var _g = 0, _g1 = this.nodes;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			if(n.isHighlighted) n.setHighlighted(false);
		}
	}
	{
		var _g = 0, _g1 = this.cults;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			if(c.isAI && !c.isDead) {
				c.turn();
				if(this.isFinished) return;
				if(Game.debugTime) this.timerTime = Date.now().getTime();
				c.aiTurn();
				if(Game.debugTime) haxe.Log.trace("ai " + c.name + ": " + (Date.now().getTime() - this.timerTime) + "ms",{ fileName : "Game.hx", lineNumber : 365, className : "Game", methodName : "endTimer"});
			}
		}
	}
	this.player.turn();
	this.turns++;
	this.ui.updateStatus();
}
Game.prototype.getNode = function(id) {
	{
		var _g = 0, _g1 = this.nodes;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			if(n.id == id) return n;
		}
	}
	return null;
}
Game.prototype.isFinished = null;
Game.prototype.lastCultID = null;
Game.prototype.lastNodeIndex = null;
Game.prototype.lines = null;
Game.prototype.load = function(save) {
	this.isFinished = false;
	this.turns = 0;
	this.ui.clearMap();
	this.ui.clearLog();
	this.lines = new List();
	this.nodes = new Array();
	this.cults = new Array();
	var savecults = save.cults;
	{
		var _g = 0;
		while(_g < savecults.length) {
			var c = savecults[_g];
			++_g;
			var cult = null;
			if(c.ia == 0) {
				cult = new Cult(this,this.ui,c.id,c.iid);
				this.player = cult;
			}
			else cult = new AI(this,this.ui,c.id,c.iid);
			cult.load(c);
			this.cults.push(cult);
		}
	}
	var savenodes = save.nodes;
	{
		var _g = 0;
		while(_g < savenodes.length) {
			var n = savenodes[_g];
			++_g;
			var node = new Node(this,this.ui,n.x,n.y,n.id);
			node.load(n);
			this.nodes.push(node);
		}
	}
	this.updateLinks();
	{
		var _g = 0;
		while(_g < savecults.length) {
			var c = savecults[_g];
			++_g;
			var _g1 = 0, _g2 = this.cults;
			while(_g1 < _g2.length) {
				var cc = _g2[_g1];
				++_g1;
				if(c.id == cc.id) {
					var n = this.getNode(c.or);
					if(n != null) cc.origin = n;
				}
			}
		}
	}
	{
		var _g = 0, _g1 = this.nodes;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			n.update();
		}
	}
	var savelines = save.lines;
	{
		var _g = 0;
		while(_g < savelines.length) {
			var l = savelines[_g];
			++_g;
			var startNode = this.getNode(l[0]);
			var endNode = this.getNode(l[1]);
			var cult = this.cults[l[2]];
			var line = Line.paint(this.ui.map,cult,startNode,endNode);
			if(l[3] == 1) line.setVisible(true);
			this.lines.add(line);
			startNode.lines.add(line);
			endNode.lines.add(line);
		}
	}
	this.difficultyLevel = save.dif;
	this.difficulty = Static.difficulty[this.difficultyLevel];
	this.turns = save.turns;
	this.ui.updateStatus();
}
Game.prototype.nodes = null;
Game.prototype.player = null;
Game.prototype.restart = function(newDifficulty) {
	if(getCookie("hasPlayed") == null) this.ui.alert("Welcome.<br><br>If this is your first time playing, please take the time to " + "read the <a target=_blank href='http://code.google.com/p/cult/wiki/Manual_" + Game.version + "'>Manual</a> " + "before playing. We are not responsible for horrific deaths caused by not reading the " + "Manual. You have been warned.");
	setCookie("hasPlayed","1",new Date(2015, 0, 0, 0, 0, 0, 0));
	this.ui.track("startGame diff:" + newDifficulty,null,null);
	if(Game.debugTime) this.timerTime = Date.now().getTime();
	this.difficultyLevel = newDifficulty;
	this.difficulty = Static.difficulty[this.difficultyLevel];
	this.isFinished = false;
	this.turns = 0;
	this.ui.clearMap();
	this.ui.clearLog();
	this.ui.log("Game started.",false);
	this.lines = new List();
	this.nodes = new Array();
	this.cults = new Array();
	this.lastCultID = 0;
	var cultInfo = new Array();
	{
		var _g1 = 0, _g = Game.numCults;
		while(_g1 < _g) {
			var i = _g1++;
			var p = null;
			var id = this.lastCultID++;
			var infoID = 0;
			if(i > 0) while(true) {
				infoID = 1 + Std["int"](Math.random() * (Static.cults.length - 1));
				var ok = true;
				{
					var _g2 = 0;
					while(_g2 < cultInfo.length) {
						var ii = cultInfo[_g2];
						++_g2;
						if(infoID == ii) {
							ok = false;
							break;
						}
					}
				}
				if(ok) break;
			}
			if(i == 0) p = new Cult(this,this.ui,id,infoID);
			else p = new AI(this,this.ui,id,infoID);
			this.cults.push(p);
			cultInfo.push(infoID);
		}
	}
	this.player = this.cults[0];
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
	this.updateLinks();
	{
		var _g = 0, _g1 = this.cults;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			p.setOrigin();
		}
	}
	this.ui.updateStatus();
	if(Game.debugTime) haxe.Log.trace("restart" + ": " + (Date.now().getTime() - this.timerTime) + "ms",{ fileName : "Game.hx", lineNumber : 365, className : "Game", methodName : "endTimer"});
}
Game.prototype.save = function() {
	var save = { }
	save.nodes = new Array();
	{
		var _g = 0, _g1 = this.nodes;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			save.nodes.push(n.save());
		}
	}
	save.cults = new Array();
	{
		var _g = 0, _g1 = this.cults;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			save.cults.push(c.save());
		}
	}
	save.lines = new Array();
	{ var $it9 = this.lines.iterator();
	while( $it9.hasNext() ) { var l = $it9.next();
	save.lines.push([l.startNode.id,l.endNode.id,l.owner.id,((l.isVisible?1:0))]);
	}}
	save.turns = this.turns;
	save.dif = this.difficultyLevel;
	return save;
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
Game.prototype.updateLinks = function() {
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
Game.prototype.__class__ = Game;
UI = function(g) { if( g === $_ ) return; {
	this.game = g;
	this.config = new Config();
}}
UI.__name__ = ["UI"];
UI.powerName = function(i) {
	return "<span style='color:" + UI.powerColors[i] + "'>" + Game.powerNames[i] + "</span>";
}
UI.cultName = function(i,info) {
	return "<span style='color:" + Game.cultColors[i] + "'>" + info.name + "</span>";
}
UI.e = function(s) {
	return js.Lib.document.getElementById(s);
}
UI.prototype.alert = function(s,shadow) {
	this.alertWindow.show(s,shadow);
}
UI.prototype.alertWindow = null;
UI.prototype.clearLog = function() {
	this.logWindow.clear();
	this.logPanel.clear();
}
UI.prototype.clearMap = function() {
	this.map.clear();
}
UI.prototype.config = null;
UI.prototype.debug = null;
UI.prototype.finish = function(cult,state) {
	var msg = "<div style='text-size: 20px'><b>Game over</b></div><br>";
	if(state == "summon" && !cult.isAI) {
		msg += "The stars were right. The Elder God was summoned in " + this.game.turns + " turns.";
		msg += "<br><br><center><b>YOU WON</b></center>";
		this.track("winGame diff:" + this.game.difficultyLevel,"summon",this.game.turns);
	}
	else if(state == "summon" && cult.isAI) {
		msg += cult.getFullName() + " has completed the " + Static.rituals[0].name + ".<br><br>" + cult.info.summonFinish;
		msg += "<br><br><center><b>YOU LOSE</b></center>";
		this.track("loseGame diff:" + this.game.difficultyLevel,"summon",this.game.turns);
	}
	else if(state == "conquer" && !cult.isAI) {
		msg += cult.getFullName() + " has taken over the world in " + this.game.turns + " turns. The Elder Gods are pleased.";
		msg += "<br><br><center><b>YOU WON</b></center>";
		this.track("winGame diff:" + this.game.difficultyLevel,"conquer",this.game.turns);
	}
	else if(state == "conquer" && cult.isAI) {
		msg += cult.getFullName() + " has taken over the world. You fail.";
		msg += "<br><br><center><b>YOU LOSE</b></center>";
		this.track("loseGame diff:" + this.game.difficultyLevel,"conquer",this.game.turns);
	}
	else if(state == "wiped") {
		msg += cult.getFullName() + " was wiped away completely. " + "The Elder God lies dormant beneath the sea, waiting.";
		msg += "<br><br><center><b>YOU LOSE</b></center>";
		this.track("loseGame diff:" + this.game.difficultyLevel,"wiped",this.game.turns);
	}
	{
		var _g = 0, _g1 = this.game.nodes;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			n.setVisible(this.game.player,true);
		}
	}
	this.alert(msg,true);
}
UI.prototype.game = null;
UI.prototype.info = null;
UI.prototype.init = function() {
	this.logWindow = new Log(this,this.game);
	this.logPanel = new LogPanel(this,this.game);
	this.alertWindow = new Alert(this,this.game);
	this.info = new Info(this,this.game);
	this.debug = new Debug(this,this.game);
	this.status = new Status(this,this.game);
	this.map = new Map(this,this.game);
	this.music = new Music();
	this.mainMenu = new MainMenu(this,this.game);
	this.loadMenu = new LoadMenu(this,this.game);
	this.saveMenu = new SaveMenu(this,this.game);
	this.music.onRandom = $closure(this.status,"updateTrack");
	js.Lib.document.onkeyup = $closure(this,"onKey");
}
UI.prototype.loadMenu = null;
UI.prototype.log = function(s,show) {
	this.logWindow.add(s,false);
	if(show == true || show == null) this.logPanel.add(s);
}
UI.prototype.log2 = function(type,obj,s) {
	this.logWindow.add(s,false);
	this.logPanel.add(s,type,obj);
}
UI.prototype.logPanel = null;
UI.prototype.logWindow = null;
UI.prototype.mainMenu = null;
UI.prototype.map = null;
UI.prototype.msg = function(s) {
	js.Lib.document.getElementById("jqDialog_close").style.visibility = "hidden";
	JQDialog.notify(s,1);
}
UI.prototype.music = null;
UI.prototype.onKey = function(e) {
	var key = e.keyCode;
	if(this.loadMenu.isVisible) this.loadMenu.onKey(e);
	else if(this.saveMenu.isVisible) this.saveMenu.onKey(e);
	else if(this.mainMenu.isVisible) this.mainMenu.onKey(e);
	else if(this.debug.isVisible) this.debug.onKey(e);
	else if(e.keyCode == 69) this.status.onEndTurn(null);
	else if(e.keyCode == 73) this.status.onInfo(null);
	else if(e.keyCode == 76) this.status.onLog(null);
	else if(e.keyCode == 68) this.status.onDebug(null);
	else if(e.keyCode == 27 || e.keyCode == 13 || e.keyCode == 32) {
		if(this.alertWindow.isVisible) this.alertWindow.onClose(null);
		else if(this.logWindow.isVisible) this.logWindow.onClose(null);
		else if(this.info.isVisible) this.info.onClose(null);
		else this.mainMenu.show();
	}
	else if(e.keyCode == 49) this.game.player.upgrade(0);
	else if(e.keyCode == 50) this.game.player.upgrade(1);
	else if(e.keyCode == 51) this.game.player.upgrade(2);
}
UI.prototype.saveMenu = null;
UI.prototype.status = null;
UI.prototype.track = function(action,label,value) {
	action = "cult " + action + " " + Game.version;
	if(label == null) label = "";
	if(value == null) value = 0;
	pageTracker._trackEvent("Evil Cult",action,label,value);
}
UI.prototype.updateStatus = function() {
	this.status.update();
}
UI.prototype.__class__ = UI;
Static = function() { }
Static.__name__ = ["Static"];
Static.prototype.__class__ = Static;
Status = function(uivar,gvar) { if( uivar === $_ ) return; {
	this.ui = uivar;
	this.game = gvar;
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
	var s = "<div style='padding:0 5 5 5; background: #111; height: 20; " + "font-weight: bold; font-size:19px;'>Evil Cult " + Game.version + "</div>";
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
			s += "'><td>" + "<div id='status.powerMark" + i + "' style='width:" + UI.markerWidth + "; height: " + UI.markerHeight + "; font-size: 12px; " + "; background:#222; border:1px solid #777; color: " + UI.powerColors[i] + ";'>" + "<center><b>" + Game.powerShortNames[i] + "</b></center></div>" + "<td><b id='status.powerName" + i + "' " + UI.powerName(i) + "</b>" + "<td><td><span id='status.power" + i + "'>0</span><br>" + "<span style='font-size:10px' id='status.powerMod" + i + "'>0</span>";
			s += "<tr style='";
			if(i % 2 == 1) s += "background:#101010";
			s += "'><td colspan=4><table style='font-size:11px'>" + "<tr><td width=20 halign=right>To";
			{
				var _g3 = 0, _g2 = Game.numPowers;
				while(_g3 < _g2) {
					var ii = _g3++;
					if(ii != i) s += "<td><div id='status.convert" + i + ii + "' " + "style='cursor: pointer; width:12; height:12; " + "background:#222; border:1px solid #777; " + "color:" + UI.powerColors[ii] + "; " + "text-align:center; font-size: 10px; font-weight: bold; '>" + Game.powerShortNames[ii] + "</div>";
				}
			}
			if(i != 3) {
				s += "<td><div id='status.lowerAwareness" + i + "' " + "style='cursor: pointer; width:12; height:12; " + "background:#222; border:1px solid #777; " + "color:" + UI.colAwareness + "; " + "text-align:center; font-size: 10px; font-weight: bold; '>A</div>";
				s += "<td halign=right><div id='status.lowerWillpower" + i + "' " + "style='cursor: pointer; width:12; height:12; " + "background:#222; border:1px solid #777; " + "color:" + UI.colWillpower + "; " + "text-align:center; font-size: 10px; font-weight: bold; '>W</div>";
			}
			s += "</table>";
		}
	}
	s += "</table></fieldset>";
	s += "<fieldset>";
	s += "<legend>STATS</legend>";
	s += "<table cellpadding=0 cellspacing=2 width=100% style='font-size:14px'>";
	s += "<tr id='status.awRow' title='" + Status.tipAwareness + "'><td>Awareness<td><span id='status.awareness' " + "style='font-weight:bold'>0</span>";
	s += "<tr id='status.tuRow' title='" + Status.tipTurns + "'><td>Turns<td><span id='status.turns' " + "style='font-weight:bold'>0</span>";
	s += "</table></fieldset>";
	s += "<center style='padding:15 0 2 0'>";
	s += "<span title='" + Status.tipEndTurn + "' id='status.endTurn' class=button>END TURN</span> ";
	s += "<span title='" + Status.tipInfo + "' id='status.info' class=button>INFO</span> ";
	s += "<span class=button title='" + Status.tipLog + "' id='status.log'>LOG</span> ";
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
	s += "<center style='padding-top:8px;'><span class=button title='" + Status.tipMainMenu + "' id='status.mainMenu'>MAIN MENU</span>&nbsp;&nbsp;";
	s += "<span class=button title='" + Status.tipAbout + "' id='status.about'>ABOUT</span></center>";
	this.status.innerHTML = s;
	{
		var _g1 = 0, _g = Game.followerNames.length;
		while(_g1 < _g) {
			var i = _g1++;
			js.Lib.document.getElementById("status.follower" + i).title = Status.tipFollowers[i];
			var c = js.Lib.document.getElementById("status.upgrade" + i);
			c.onclick = $closure(this,"onUpgrade");
			c.title = Status.tipUpgrade[i];
			c.style.visibility = "hidden";
		}
	}
	{
		var _g1 = 0, _g = (Game.numPowers + 1);
		while(_g1 < _g) {
			var i = _g1++;
			js.Lib.document.getElementById("status.powerMark" + i).title = Status.tipPowers[i];
			js.Lib.document.getElementById("status.powerName" + i).title = Status.tipPowers[i];
			{
				var _g3 = 0, _g2 = Game.numPowers;
				while(_g3 < _g2) {
					var ii = _g3++;
					if(i != ii) {
						var c = js.Lib.document.getElementById("status.convert" + i + ii);
						c.onclick = $closure(this,"onConvert");
						c.title = Status.tipConvert + UI.powerName(ii) + ": " + Game.powerConversionCost[i];
					}
				}
			}
			if(i != 3) {
				var c = js.Lib.document.getElementById("status.lowerAwareness" + i);
				c.onclick = $closure(this,"onLowerAwareness");
				c.title = Status.tipLowerAwareness;
				var c1 = js.Lib.document.getElementById("status.lowerWillpower" + i);
				c1.onclick = $closure(this,"onLowerWillpower");
				c1.title = Status.tipLowerWillpower + Game.willPowerCost;
			}
		}
	}
	js.Lib.document.getElementById("status.endTurn").onclick = $closure(this,"onEndTurn");
	js.Lib.document.getElementById("status.info").onclick = $closure(this,"onInfo");
	js.Lib.document.getElementById("status.log").onclick = $closure(this,"onLog");
	js.Lib.document.getElementById("status.mainMenu").onclick = $closure(this,"onMainMenu");
	js.Lib.document.getElementById("status.about").onclick = $closure(this,"onAbout");
	if(Game.isDebug) js.Lib.document.getElementById("status.debug").onclick = $closure(this,"onDebug");
	js.Lib.document.getElementById("status.play").onclick = $closure(this,"onPlay");
	js.Lib.document.getElementById("status.pause").onclick = $closure(this,"onPause");
	js.Lib.document.getElementById("status.stop").onclick = $closure(this,"onStop");
	js.Lib.document.getElementById("status.random").onclick = $closure(this,"onRandom");
	js.Lib.document.getElementById("status.track").onclick = $closure(this,"onTrack");
	new JQuery("#status *").tooltip({ delay : 0});
}}
Status.__name__ = ["Status"];
Status.e = function(s) {
	return js.Lib.document.getElementById(s);
}
Status.prototype.game = null;
Status.prototype.onAbout = function(event) {
	js.Lib.window.open("http://code.google.com/p/cult/wiki/About");
}
Status.prototype.onConvert = function(event) {
	if(this.game.isFinished) return;
	var from = Std.parseInt(Tools.getTarget(event).id.substr(14,1));
	var to = Std.parseInt(Tools.getTarget(event).id.substr(15,1));
	this.game.player.convert(from,to);
}
Status.prototype.onDebug = function(event) {
	if(this.game.isFinished || !Game.isDebug) return;
	this.ui.debug.show();
}
Status.prototype.onEndTurn = function(event) {
	if(this.game.isFinished) return;
	this.game.endTurn();
}
Status.prototype.onInfo = function(event) {
	this.ui.info.show();
}
Status.prototype.onLog = function(event) {
	this.ui.logWindow.show();
}
Status.prototype.onLowerAwareness = function(event) {
	if(this.game.isFinished) return;
	var power = Std.parseInt(Tools.getTarget(event).id.substr(21,1));
	this.game.player.lowerAwareness(power);
}
Status.prototype.onLowerWillpower = function(event) {
	if(this.game.isFinished) return;
	var power = Std.parseInt(Tools.getTarget(event).id.substr(21,1));
	this.game.player.lowerWillpower(power);
}
Status.prototype.onMainMenu = function(event) {
	this.ui.mainMenu.show();
}
Status.prototype.onPause = function(event) {
	this.ui.music.pause();
}
Status.prototype.onPlay = function(event) {
	this.ui.music.play();
}
Status.prototype.onRandom = function(event) {
	this.ui.music.random();
}
Status.prototype.onStop = function(event) {
	this.ui.music.stop();
}
Status.prototype.onTrack = function(event) {
	js.Lib.window.open(this.ui.music.getPage(),"");
}
Status.prototype.onUpgrade = function(event) {
	if(this.game.isFinished) return;
	var lvl = Std.parseInt(Tools.getTarget(event).id.substr(14,1));
	this.game.player.upgrade(lvl);
}
Status.prototype.status = null;
Status.prototype.ui = null;
Status.prototype.update = function() {
	{
		var _g1 = 0, _g = (Game.numPowers + 1);
		while(_g1 < _g) {
			var i = _g1++;
			var s = Status.tipPowers[i] + "<br>Chance to gain each unit: <span style='color:white'>" + this.game.player.getResourceChance() + "%</span>";
			this.updateTip("status.powerMark" + i,s);
			this.updateTip("status.powerName" + i,s);
		}
	}
	{
		var _g1 = 0, _g = Game.followerLevels;
		while(_g1 < _g) {
			var i = _g1++;
			this.updateTip("status.follower" + i,Status.tipFollowers[i]);
			this.updateTip("status.upgrade" + i,Status.tipUpgrade[i] + "<br>Chance of success: <span style='color:white'>" + this.game.player.getUpgradeChance(i) + "%</span>");
		}
	}
	this.updateTip("status.followers1",this.game.player.adeptsUsed + " used of " + this.game.player.getAdepts());
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
			var s = "" + this.game.player.getNumFollowers(i);
			if(i == 1 && this.game.player.getAdepts() > 0) {
				s = "<span style='color:#55dd55'>" + (this.game.player.getAdepts() - this.game.player.adeptsUsed) + "</span>";
			}
			js.Lib.document.getElementById("status.followers" + i).innerHTML = s;
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
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			js.Lib.document.getElementById("status.lowerWillpower" + i).style.visibility = "hidden";
		}
	}
	if(this.game.player.hasInvestigator && !this.game.player.investigator.isHidden && this.game.player.adeptsUsed < this.game.player.getAdepts() && this.game.player.getAdepts() > 0) {
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.game.player.power[i] >= Game.willPowerCost) js.Lib.document.getElementById("status.lowerWillpower" + i).style.visibility = "visible";
		}
	}
	{
		var _g1 = 0, _g = Game.followerNames.length;
		while(_g1 < _g) {
			var i = _g1++;
			js.Lib.document.getElementById("status.upgrade" + i).style.visibility = ((this.game.player.canUpgrade(i)?"visible":"hidden"));
		}
	}
}
Status.prototype.updateTip = function(name,tip) {
	name = "#" + name;
	if(name.indexOf(".") > 0) {
		name = name.substr(0,name.indexOf(".")) + "\\" + name.substr(name.indexOf("."));
	}
	new JQuery(name).attr("tooltipText",tip);
}
Status.prototype.updateTrack = function() {
	js.Lib.document.getElementById("status.track").innerHTML = this.ui.music.getName();
}
Status.prototype.__class__ = Status;
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
LoadMenu = function(uivar,gvar) { if( uivar === $_ ) return; {
	this.ui = uivar;
	this.game = gvar;
	this.isVisible = false;
	this.window = Tools.window({ id : "loadMenuWindow", center : true, winW : UI.winWidth, winH : UI.winHeight, w : 420, h : 320, z : 25});
	Tools.label({ id : "loadLabel", text : "Key", w : 60, h : 30, x : 35, y : 30, container : this.window});
	this.key = Tools.textfield({ id : "loadKey", text : getCookie("owner"), w : 205, h : 30, x : 85, y : 30, container : this.window});
	this.key.onclick = $closure(this,"onKeyClick");
	Tools.button({ id : "loadRefresh", text : "Refresh", w : 100, h : 30, x : 300, y : 30, container : this.window, func : $closure(this,"onRefresh")});
	this.noSavesFound = Tools.label({ id : "loadLabel2", text : "No saves found.", w : 200, h : 30, x : 140, y : 150, container : this.window});
	this.saves = new Array();
	this.saveButtons = new Array();
	this.delButtons = new Array();
	{
		var _g1 = 0, _g = UI.maxSaves;
		while(_g1 < _g) {
			var i = _g1++;
			var b = Tools.button({ id : "load" + i, text : "Load", w : 330, h : 30, x : 35, y : 70 + 40 * i, container : this.window, func : $closure(this,"onLoadGame")});
			this.saveButtons.push(b);
			var b2 = Tools.button({ id : "del" + i, text : "X", w : 20, h : 30, x : 380, y : 70 + 40 * i, container : this.window, func : $closure(this,"onDelGame")});
			this.delButtons.push(b2);
		}
	}
	this.bg = Tools.bg({ w : UI.winWidth + 20, h : UI.winHeight});
	this.close = Tools.closeButton(this.window,180,280,"loadMenuClose");
	this.close.onclick = $closure(this,"onClose");
}}
LoadMenu.__name__ = ["LoadMenu"];
LoadMenu.prototype.bg = null;
LoadMenu.prototype.close = null;
LoadMenu.prototype.delButtons = null;
LoadMenu.prototype.game = null;
LoadMenu.prototype.isVisible = null;
LoadMenu.prototype.key = null;
LoadMenu.prototype.keyFocused = null;
LoadMenu.prototype.noSavesFound = null;
LoadMenu.prototype.onClose = function(event) {
	this.window.style.visibility = "hidden";
	this.bg.style.visibility = "hidden";
	this.close.style.visibility = "hidden";
	this.noSavesFound.style.visibility = "hidden";
	{
		var _g = 0, _g1 = this.saveButtons;
		while(_g < _g1.length) {
			var b = _g1[_g];
			++_g;
			b.style.visibility = "hidden";
		}
	}
	{
		var _g = 0, _g1 = this.delButtons;
		while(_g < _g1.length) {
			var b = _g1[_g];
			++_g;
			b.style.visibility = "hidden";
		}
	}
	this.isVisible = false;
}
LoadMenu.prototype.onDelGame = function(event) {
	var b = Tools.getTarget(event);
	var n = Std.parseInt(b.id.substring(3));
	this.onDelReal(n);
}
LoadMenu.prototype.onDelReal = function(n) {
	var save = this.saves[n];
	var req = new js.XMLHttpRequest();
	req.open("GET","/save.delete?owner=" + getCookie("owner") + "&id=" + save.id,false);
	req.send(null);
	var text = req.responseText;
	this.show();
}
LoadMenu.prototype.onKey = function(e) {
	if(this.keyFocused) return;
	if(e.keyCode == 49) this.onLoadReal(0);
	else if(e.keyCode == 50) this.onLoadReal(1);
	else if(e.keyCode == 51) this.onLoadReal(2);
	else if(e.keyCode == 52) this.onLoadReal(3);
	else if(e.keyCode == 53) this.onLoadReal(4);
	else if(e.keyCode == 27) this.onClose(null);
}
LoadMenu.prototype.onKeyClick = function() {
	this.keyFocused = true;
}
LoadMenu.prototype.onLoadGame = function(event) {
	var b = Tools.getTarget(event);
	var n = Std.parseInt(b.id.substring(4));
	this.onLoadReal(n);
}
LoadMenu.prototype.onLoadReal = function(n) {
	var save = this.saves[n];
	var req = new js.XMLHttpRequest();
	req.open("GET","/save.load?owner=" + getCookie("owner") + "&id=" + save.id,false);
	req.send(null);
	var text = req.responseText;
	if(text == "NoSuchSave") return;
	js.Lib.document.getElementById("haxe:trace").innerHTML = "";
	var savedGame = JSON.parse(text);
	this.game.load(savedGame);
	this.onClose(null);
}
LoadMenu.prototype.onRefresh = function(event) {
	setCookie("owner",this.key.value,new Date(2015, 0, 0, 0, 0, 0, 0));
	this.show();
}
LoadMenu.prototype.saveButtons = null;
LoadMenu.prototype.saves = null;
LoadMenu.prototype.show = function() {
	var list = [];
	if(getCookie("owner") != "") {
		var req = new js.XMLHttpRequest();
		req.open("GET","/save.list?owner=" + getCookie("owner"),false);
		req.send(null);
		var text = req.responseText;
		list = JSON.parse(text);
	}
	this.saves = list;
	var i = 0;
	{
		var _g = 0, _g1 = this.saveButtons;
		while(_g < _g1.length) {
			var b = _g1[_g];
			++_g;
			b.style.visibility = "hidden";
			this.delButtons[i].style.visibility = "hidden";
			i++;
		}
	}
	i = 0;
	this.noSavesFound.style.visibility = "visible";
	{
		var _g = 0;
		while(_g < list.length) {
			var item = list[_g];
			++_g;
			var b = this.saveButtons[i];
			if(b == null) break;
			b.innerHTML = item.name;
			b.style.visibility = "visible";
			this.delButtons[i].style.visibility = "visible";
			i++;
			this.noSavesFound.style.visibility = "hidden";
		}
	}
	this.key.value = getCookie("owner");
	this.window.style.visibility = "visible";
	this.bg.style.visibility = "visible";
	this.close.style.visibility = "visible";
	this.isVisible = true;
	this.keyFocused = false;
}
LoadMenu.prototype.ui = null;
LoadMenu.prototype.window = null;
LoadMenu.prototype.__class__ = LoadMenu;
Map = function(uivar,gvar) { if( uivar === $_ ) return; {
	this.ui = uivar;
	this.game = gvar;
	this.screen = js.Lib.document.getElementById("map");
	this.screen.style.border = "double white 4px";
	this.screen.style.width = UI.mapWidth;
	this.screen.style.height = UI.mapHeight;
	this.screen.style.position = "absolute";
	this.screen.style.left = 240;
	this.screen.style.top = 5;
	this.screen.style.overflow = "hidden";
}}
Map.__name__ = ["Map"];
Map.prototype.clear = function() {
	while(this.screen.hasChildNodes()) this.screen.removeChild(this.screen.firstChild);
}
Map.prototype.game = null;
Map.prototype.onNodeClick = function(event) {
	if(this.game.isFinished) return;
	this.game.player.activate(Tools.getTarget(event).node);
}
Map.prototype.screen = null;
Map.prototype.ui = null;
Map.prototype.__class__ = Map;
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
Debug = function(uivar,gvar) { if( uivar === $_ ) return; {
	this.ui = uivar;
	this.game = gvar;
	this.isVisible = false;
	this.buttons = new Array();
	this.window = Tools.window({ id : "debugWindow", center : true, winW : UI.winWidth, winH : UI.winHeight, fontSize : 18, w : 800, h : 500, z : 20});
	this.menu = js.Lib.document.createElement("div");
	this.menu.style.overflow = "auto";
	this.menu.style.position = "absolute";
	this.menu.style.left = 10;
	this.menu.style.top = 10;
	this.menu.style.width = 780;
	this.menu.style.height = 450;
	this.menu.style.background = "#0b0b0b";
	this.menu.style.border = "1px solid #777";
	this.window.appendChild(this.menu);
	var close = Tools.closeButton(this.window,360,465,"debugClose");
	close.onclick = $closure(this,"onClose");
	this.lastMenuY = -20;
	this.menuItem = 0;
	this.addItem("Clear trace",$closure(this,"onClearTrace"));
	this.addItem("Give power",$closure(this,"onGivePower"));
	this.addItem("Open map",$closure(this,"onOpenMap"));
	this.addItem("Investigator: AI",$closure(this,"onInvestigatorAI"));
	this.addItem("Investigator: Player",$closure(this,"onInvestigatorPlayer"));
	this.addItem("Victory: Summon",$closure(this,"onVictorySummon"));
	this.addItem("Total war",$closure(this,"onTotalWar"));
	this.addItem("Invisibility toggle",$closure(this,"onToggleInvisible"));
	this.addItem("Trace timing toggle",$closure(this,"onTiming"));
	this.addItem("Trace AI toggle",$closure(this,"onAI"));
	this.addItem("Node vis toggle",$closure(this,"onVis"));
	this.addItem("Node near toggle",$closure(this,"onNear"));
	this.addItem("Give adepts",$closure(this,"onGiveAdepts"));
}}
Debug.__name__ = ["Debug"];
Debug.prototype.addItem = function(title,func) {
	this.lastMenuY += 30;
	var sym = this.menuItem + 49;
	if(this.menuItem > 8) sym = this.menuItem - 9 + 65 + 32;
	var b = Tools.button({ id : "menuItem" + this.lastMenuY, fontSize : 14, bold : false, text : String.fromCharCode(sym) + " " + title, w : 200, h : 22, x : 10, y : this.lastMenuY, container : this.menu, func : func});
	b.name = String.fromCharCode(sym);
	this.buttons.push(b);
	this.menuItem++;
}
Debug.prototype.buttons = null;
Debug.prototype.game = null;
Debug.prototype.isVisible = null;
Debug.prototype.lastMenuY = null;
Debug.prototype.menu = null;
Debug.prototype.menuItem = null;
Debug.prototype.onAI = function(event) {
	Game.debugAI = !Game.debugAI;
	haxe.Log.trace("trace ai " + ((Game.debugAI?"on":"off")),{ fileName : "Debug.hx", lineNumber : 103, className : "Debug", methodName : "onAI"});
}
Debug.prototype.onClearTrace = function(event) {
	js.Lib.document.getElementById("haxe:trace").innerHTML = "";
}
Debug.prototype.onClose = function(event) {
	this.window.style.visibility = "hidden";
	this.isVisible = false;
}
Debug.prototype.onGiveAdepts = function(event) {
	this.onGivePower(null);
	{
		var _g = 0;
		while(_g < 3) {
			var i = _g++;
			{ var $it10 = this.game.player.nodes.iterator();
			while( $it10.hasNext() ) { var n = $it10.next();
			{
				if(n.level < 1 && Math.random() < 0.5) n.upgrade();
				{ var $it11 = n.links.iterator();
				while( $it11.hasNext() ) { var n2 = $it11.next();
				if(Math.random() < 0.2) this.game.player.activate(n2);
				}}
			}
			}}
		}
	}
}
Debug.prototype.onGivePower = function(event) {
	{
		var _g = 0;
		while(_g < 4) {
			var i = _g++;
			this.game.player.power[i] += 100;
		}
	}
	this.ui.updateStatus();
}
Debug.prototype.onInvestigatorAI = function(event) {
	var _g = 0, _g1 = this.game.cults;
	while(_g < _g1.length) {
		var c = _g1[_g];
		++_g;
		if(c.isAI) {
			c.hasInvestigator = true;
			c.investigator = new Investigator(c,this.ui);
		}
	}
}
Debug.prototype.onInvestigatorPlayer = function(event) {
	var _g = 0, _g1 = this.game.cults;
	while(_g < _g1.length) {
		var c = _g1[_g];
		++_g;
		if(c == this.game.player) {
			c.hasInvestigator = true;
			c.investigator = new Investigator(c,this.ui);
		}
	}
}
Debug.prototype.onKey = function(e) {
	if(e.keyCode == 27 || e.keyCode == 13 || e.keyCode == 32) {
		this.onClose(null);
		return;
	}
	{
		var _g = 0, _g1 = this.buttons;
		while(_g < _g1.length) {
			var b = _g1[_g];
			++_g;
			if(b.name == String.fromCharCode(e.keyCode).toLowerCase()) {
				b.onclick(null);
				break;
			}
		}
	}
}
Debug.prototype.onNear = function(event) {
	Game.debugNear = !Game.debugNear;
	{
		var _g = 0, _g1 = this.game.nodes;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			n.update();
		}
	}
	haxe.Log.trace("node nearness info " + ((Game.debugNear?"on":"off")),{ fileName : "Debug.hx", lineNumber : 123, className : "Debug", methodName : "onNear"});
}
Debug.prototype.onOpenMap = function(event) {
	var _g = 0, _g1 = this.game.nodes;
	while(_g < _g1.length) {
		var n = _g1[_g];
		++_g;
		n.setVisible(this.game.player,true);
	}
}
Debug.prototype.onTiming = function(event) {
	Game.debugTime = !Game.debugTime;
	haxe.Log.trace("timing " + ((Game.debugTime?"on":"off")),{ fileName : "Debug.hx", lineNumber : 95, className : "Debug", methodName : "onTiming"});
}
Debug.prototype.onToggleInvisible = function(event) {
	this.game.player.isDebugInvisible = !this.game.player.isDebugInvisible;
	haxe.Log.trace("invisibility " + ((this.game.player.isDebugInvisible?"on":"off")),{ fileName : "Debug.hx", lineNumber : 131, className : "Debug", methodName : "onToggleInvisible"});
}
Debug.prototype.onTotalWar = function(event) {
	var _g = 0, _g1 = this.game.cults;
	while(_g < _g1.length) {
		var p = _g1[_g];
		++_g;
		var _g2 = 0;
		while(_g2 < 4) {
			var i = _g2++;
			if(i != p.id) p.wars[i] = true;
		}
	}
}
Debug.prototype.onVictorySummon = function(event) {
	this.ui.finish(this.game.cults[0],"summon");
}
Debug.prototype.onVis = function(event) {
	Game.debugVis = !Game.debugVis;
	{
		var _g = 0, _g1 = this.game.nodes;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			n.update();
		}
	}
	haxe.Log.trace("node visibility to cults info " + ((Game.debugVis?"on":"off")),{ fileName : "Debug.hx", lineNumber : 113, className : "Debug", methodName : "onVis"});
}
Debug.prototype.show = function() {
	this.window.style.visibility = "visible";
	this.isVisible = true;
}
Debug.prototype.ui = null;
Debug.prototype.window = null;
Debug.prototype.__class__ = Debug;
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
AI = function(gvar,uivar,id,infoID) { if( gvar === $_ ) return; {
	Cult.apply(this,[gvar,uivar,id,infoID]);
	this.isAI = true;
	if(this.game.difficultyLevel == 0) this.difficulty = Static.difficulty[2];
	else if(this.game.difficultyLevel == 2) this.difficulty = Static.difficulty[0];
	else this.difficulty = Static.difficulty[1];
}}
AI.__name__ = ["AI"];
AI.__super__ = Cult;
for(var k in Cult.prototype ) AI.prototype[k] = Cult.prototype[k];
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
	if((this.awareness < this.difficulty.maxAwareness && !this.hasInvestigator) || (this.awareness < 5 && this.hasInvestigator) || this.getAdepts() == 0 || this.adeptsUsed >= this.getAdepts()) return;
	var prevAwareness = this.awareness;
	{
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			while(this.power[i] > 0 && this.adeptsUsed < this.getAdepts() && this.awareness >= this.difficulty.maxAwareness) this.lowerAwareness(i);
		}
	}
	if(Game.debugAI && this.awareness != prevAwareness) haxe.Log.trace(this.name + " awareness " + prevAwareness + "% -> " + this.awareness + "%",{ fileName : "AI.hx", lineNumber : 297, className : "AI", methodName : "aiLowerAwareness"});
}
AI.prototype.aiLowerAwarenessHard = function() {
	if(this.awareness == 0 || this.getAdepts() == 0) return;
	var prevAwareness = this.awareness;
	while(this.getVirgins() > 0 && this.adeptsUsed < this.getAdepts() && this.awareness >= 0) {
		this.convert(3,0);
		this.lowerAwareness(0);
	}
	if(Game.debugAI && this.awareness != prevAwareness) haxe.Log.trace(this.name + " virgin awareness " + prevAwareness + "% -> " + this.awareness + "%",{ fileName : "AI.hx", lineNumber : 276, className : "AI", methodName : "aiLowerAwarenessHard"});
}
AI.prototype.aiLowerWillpower = function() {
	if(!this.hasInvestigator || this.investigator.isHidden || this.getAdepts() == 0) return;
	{
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			this.lowerWillpower(i);
			this.lowerWillpower(i);
		}
	}
}
AI.prototype.aiSummon = function() {
	if(this.getPriests() < 3 || this.getVirgins() < 9 || this.getUpgradeChance(2) < 50 || this.isRitual) return;
	if(Game.debugAI) haxe.Log.trace(this.name + " TRY SUMMON!",{ fileName : "AI.hx", lineNumber : 308, className : "AI", methodName : "aiSummon"});
	this.summonStart();
}
AI.prototype.aiTryPeace = function() {
	if(this.isRitual) return;
	var ok = false;
	{
		var _g = 0, _g1 = this.game.cults;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			if(c.isRitual) {
				ok = true;
				break;
			}
		}
	}
	if(!ok) return;
	{
		var _g = 0;
		while(_g < 3) {
			var i = _g++;
			if(this.wars[i] && !this.game.cults[i].isRitual) {
				if(Math.random() * 100 > 30) continue;
				this.makePeace(this.game.cults[i]);
			}
		}
	}
}
AI.prototype.aiTurn = function() {
	if(this.isParalyzed && this.hasInvestigator) {
		this.aiLowerAwarenessHard();
		this.aiLowerWillpower();
		return;
	}
	if(this.isParalyzed) {
		this.aiLowerWillpower();
		this.aiUpgradeFollowers();
		return;
	}
	if(this.hasInvestigator) {
		this.aiLowerWillpower();
		return;
	}
	this.aiUpgradeFollowers();
	if(this.isRitual && this.ritual.id == "summoning") this.aiLowerAwarenessHard();
	this.aiLowerAwareness();
	this.aiSummon();
	if(this.awareness > this.difficulty.maxAwareness && this.getAdepts() > 0) return;
	var list = new Array();
	{
		var _g = 0, _g1 = this.game.nodes;
		while(_g < _g1.length) {
			var node = _g1[_g];
			++_g;
			if(node.owner == this || !node.visibility[this.id] || (node.owner != null && node.owner.isDebugInvisible)) continue;
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
	this.aiTryPeace();
}
AI.prototype.aiUpgradeFollowers = function() {
	if(this.getVirgins() == 0) return;
	if(this.getAdepts() < 5 && this.getUpgradeChance(0) > 70 && this.getVirgins() > 0) {
		while(true) {
			if(this.getVirgins() < 1 || this.getAdepts() >= 5) break;
			this.upgrade(0);
			if(Game.debugAI) haxe.Log.trace(this.name + " upgrade neophyte, adepts: " + this.getAdepts(),{ fileName : "AI.hx", lineNumber : 220, className : "AI", methodName : "aiUpgradeFollowers"});
		}
		return;
	}
	if(this.getPriests() < 3 && this.getUpgradeChance(1) > 60 && this.getVirgins() > 1) {
		while(true) {
			if(this.getVirgins() < 2 || this.getPriests() >= 3) break;
			this.upgrade(1);
			if(Game.debugAI) haxe.Log.trace("!!! " + this.name + " upgrade adept, priests: " + this.getPriests(),{ fileName : "AI.hx", lineNumber : 236, className : "AI", methodName : "aiUpgradeFollowers"});
		}
		return;
	}
}
AI.prototype.__class__ = AI;
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
Info = function(uivar,gvar) { if( uivar === $_ ) return; {
	this.ui = uivar;
	this.game = gvar;
	this.isVisible = false;
	this.window = Tools.window({ id : "window", center : true, winW : UI.winWidth, winH : UI.winHeight, fontSize : 16, bold : true, w : 800, h : 520, z : 20});
	this.window.style.visibility = "hidden";
	this.window.style.padding = "5 5 5 5";
	this.window.style.border = "4px double #ffffff";
	this.text = js.Lib.document.createElement("div");
	this.text.style.overflow = "auto";
	this.text.style.position = "absolute";
	this.text.style.left = 10;
	this.text.style.top = 10;
	this.text.style.width = 780;
	this.text.style.height = 480;
	this.text.style.background = "#111";
	this.window.appendChild(this.text);
	var close = Tools.closeButton(this.window,365,493,"infoClose");
	close.onclick = $closure(this,"onClose");
}}
Info.__name__ = ["Info"];
Info.e = function(s) {
	return js.Lib.document.getElementById(s);
}
Info.prototype.game = null;
Info.prototype.isVisible = null;
Info.prototype.onClose = function(event) {
	this.window.style.visibility = "hidden";
	this.isVisible = false;
}
Info.prototype.show = function() {
	var s = "";
	var i = 0;
	{
		var _g = 0, _g1 = this.game.cults;
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
						if(p.wars[i1]) w += UI.cultName(i1,this.game.cults[i1].info) + " ";
					}
				}
				if(w != "") s += " wars: " + w;
			}
			s += "<br>";
			if(p.hasInvestigator) {
				s += "<span style='font-size: 12px; color: #999999'>Investigator <span style='color: white'>" + p.investigator.name + "</span>: Level " + (p.investigator.level + 1) + ", Willpower " + p.investigator.will + "</span>";
				if(Game.isDebug && p.investigator.isHidden) s += " Hidden";
				s += "<br>";
			}
			if(Game.isDebug && p.investigatorTimeout > 0) s += " Investigator timeout: " + p.investigatorTimeout + "<br>";
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
				s += "<span title='Awareness'>A: " + p.awareness + "%</span> ";
				s += "<span title='Chance of summoning'>ROS: " + p.getUpgradeChance(2) + "%</span> ";
				s += "<span title='Chance of investigator appearing'>IC: " + p.getInvestigatorChance() + "%</span> ";
				if(p.hasInvestigator) s += "<span title='Chance of investigator reveal'>RC: " + p.investigator.getKillChance() + "%</span> ";
				s += "</span><br>";
			}
			if(p.isRitual == true) {
				var turns = Std["int"](p.ritualPoints / p.getPriests());
				if(p.ritualPoints % p.getPriests() > 0) turns += 1;
				s += "Casting <span title='" + p.ritual.note + "' id='info.ritual" + i + "' style='color:#ffaaaa'>" + p.ritual.name + "</span>, " + (p.ritual.points - p.ritualPoints) + "/" + p.ritual.points + " points, " + turns + " turns left<br>";
			}
			if(!p.isDead) {
				s += p.nodes.length + " followers (" + p.getNeophytes() + " neophytes, " + p.getAdepts() + " adepts, " + p.getPriests() + " priests)";
				if(p.isParalyzed) s += " Paralyzed";
				s += "<br>";
			}
			s += "<span id='info.toggleNote" + i + "' style='height:10; width:10; font-size:12px; border: 1px solid #777'>+</span>";
			s += "<br>";
			s += "<span id='info.note" + i + "'>" + p.info.note + "</span>";
			s += "<span id='info.longnote" + i + "'>" + p.info.longNote + "</span>";
			s += "</div><hr>";
			i++;
		}
	}
	this.text.innerHTML = s;
	this.window.style.visibility = "visible";
	this.isVisible = true;
	{
		var _g1 = 0, _g = Game.numCults;
		while(_g1 < _g) {
			var i1 = _g1++;
			js.Lib.document.getElementById("info.longnote" + i1).style.display = "none";
			var c = js.Lib.document.getElementById("info.toggleNote" + i1);
			c.style.cursor = "pointer";
			c.noteID = i1;
			c.onclick = function(event) {
				var t = event.target;
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
Info.prototype.text = null;
Info.prototype.ui = null;
Info.prototype.window = null;
Info.prototype.__class__ = Info;
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
js = {}
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
		catch( $e12 ) {
			{
				var e = $e12;
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
	catch( $e13 ) {
		{
			var e = $e13;
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
Node = function(gvar,uivar,newx,newy,index) { if( gvar === $_ ) return; {
	this.game = gvar;
	this.ui = uivar;
	this.id = index;
	this.lines = new List();
	this.links = new List();
	this.visibility = new Array();
	{
		var _g1 = 0, _g = Game.numCults;
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
	this.name = GenName.generate();
	this.job = Node.jobs[Std["int"](Math.random() * (Node.jobs.length - 1))];
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
	{ var $it14 = this.lines.iterator();
	while( $it14.hasNext() ) { var l = $it14.next();
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
Node.prototype.isHighlighted = null;
Node.prototype.isProtected = null;
Node.prototype.isVisible = function(c) {
	return this.visibility[c.id];
}
Node.prototype.job = null;
Node.prototype.level = null;
Node.prototype.lines = null;
Node.prototype.links = null;
Node.prototype.load = function(n) {
	this.power = n.p;
	if(n.l != null) this.level = n.l;
	if(n.vis != null) {
		var vis = n.vis;
		this.visibility = [];
		var i = 0;
		{
			var _g = 0;
			while(_g < vis.length) {
				var v = vis[_g];
				++_g;
				this.visibility.push((v == 1?true:false));
				if(v == 1) this.uiNode.setVisible(this.game.cults[i],true);
				i++;
			}
		}
	}
	if(n.o != null) {
		this.owner = this.game.cults[n.o];
		this.owner.nodes.add(this);
	}
	if(n.pg != null) {
		this.isGenerator = true;
		this.powerGenerated = n.pg;
		if(this.owner != null) {
			var _g1 = 0, _g = Game.numPowers;
			while(_g1 < _g) {
				var i = _g1++;
				this.owner.powerMod[i] += Math.round(this.powerGenerated[i]);
			}
		}
	}
}
Node.prototype.name = null;
Node.prototype.owner = null;
Node.prototype.paintLines = function() {
	var hasLine = false;
	{ var $it15 = this.links.iterator();
	while( $it15.hasNext() ) { var n = $it15.next();
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
	{ var $it16 = this.owner.nodes.iterator();
	while( $it16.hasNext() ) { var n = $it16.next();
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
Node.prototype.removeOwner = function() {
	if(this.owner == null) return;
	var prevOwner = this.owner;
	this.clearLines();
	this.owner.nodes.remove(this);
	this.owner = null;
	this.level = 0;
	this.update();
	this.updateLinkVisibility(prevOwner);
	{ var $it17 = this.links.iterator();
	while( $it17.hasNext() ) { var n = $it17.next();
	n.update();
	}}
	{
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.power[i] > 2) this.power[i] = 2;
		}
	}
	if(prevOwner != null) prevOwner.loseNode(this);
}
Node.prototype.save = function() {
	var obj = { id : this.id, p : this.power, x : this.x, y : this.y}
	if(this.owner != null) obj.o = this.owner.id;
	if(this.level > 0) obj.l = this.level;
	var vis = [];
	var savevis = false;
	{
		var _g = 0, _g1 = this.visibility;
		while(_g < _g1.length) {
			var v = _g1[_g];
			++_g;
			vis.push((v?1:0));
			if(v) savevis = true;
		}
	}
	if(savevis) obj.vis = vis;
	if(this.isGenerator) obj.pg = this.powerGenerated;
	return obj;
}
Node.prototype.setGenerator = function(isgen) {
	this.isGenerator = isgen;
	this.update();
}
Node.prototype.setHighlighted = function(isHL) {
	this.isHighlighted = isHL;
	this.uiNode.setHighlighted();
}
Node.prototype.setOwner = function(c) {
	var prevOwner = this.owner;
	if(this.isGenerator) {
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			c.powerMod[i] += Math.round(this.powerGenerated[i]);
		}
	}
	this.clearLines();
	if(this.owner == null) {
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.power[i] > 0) this.power[i]++;
		}
	}
	if(this.owner != null) this.owner.nodes.remove(this);
	this.owner = c;
	this.owner.nodes.add(this);
	this.update();
	this.showLinks();
	if(prevOwner != null) this.updateLinkVisibility(prevOwner);
	if(this.isGenerator) {
		var _g = this.owner;
		_g.setAwareness(_g.awareness + 2);
	}
	else {
		var _g = this.owner, _g1 = _g.awareness;
		_g.setAwareness(_g1 + 1);
		_g1;
	}
	if(!this.owner.isAI) this.ui.updateStatus();
	this.paintLines();
	{ var $it18 = this.links.iterator();
	while( $it18.hasNext() ) { var n = $it18.next();
	n.update();
	}}
	if(prevOwner != null) prevOwner.loseNode(this,this.owner);
}
Node.prototype.setVisible = function(cult,v) {
	this.visibility[cult.id] = v;
	this.uiNode.setVisible(cult,v);
	if(!cult.isAI) {
		if(Game.mapVisible) v = true;
		{ var $it19 = this.lines.iterator();
		while( $it19.hasNext() ) { var l = $it19.next();
		l.setVisible(v);
		}}
		if(this.isHighlighted) this.setHighlighted(v);
	}
}
Node.prototype.showLinks = function() {
	{ var $it20 = this.links.iterator();
	while( $it20.hasNext() ) { var n = $it20.next();
	n.setVisible(this.owner,true);
	}}
}
Node.prototype.ui = null;
Node.prototype.uiNode = null;
Node.prototype.update = function() {
	this.isProtected = false;
	if(this.isGenerator && this.owner != null) {
		var cnt = 0;
		{ var $it21 = this.links.iterator();
		while( $it21.hasNext() ) { var n = $it21.next();
		if(n.owner == this.owner) cnt++;
		}}
		if(cnt >= 3) this.isProtected = true;
	}
	this.uiNode.update();
}
Node.prototype.updateLinkVisibility = function(cult) {
	{ var $it22 = this.links.iterator();
	while( $it22.hasNext() ) { var n = $it22.next();
	if(n.visibility[cult.id] && n.owner != cult) {
		var vis = false;
		{ var $it23 = n.links.iterator();
		while( $it23.hasNext() ) { var n2 = $it23.next();
		if(n2.owner == cult) {
			vis = true;
			break;
		}
		}}
		n.setVisible(cult,vis);
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
DateTools = function() { }
DateTools.__name__ = ["DateTools"];
DateTools.__format_get = function(d,e) {
	return (function($this) {
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
			$r = (function($this) {
				var $r;
				var hour = d.getHours() % 12;
				$r = StringTools.lpad(Std.string((hour == 0?12:hour)),(e == "I"?"0":" "),2);
				return $r;
			}($this));
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
			$r = (function($this) {
				var $r;
				var t = d.getDay();
				$r = (t == 0?"7":Std.string(t));
				return $r;
			}($this));
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
			$r = (function($this) {
				var $r;
				throw "Date.format %" + e + "- not implemented yet.";
				return $r;
			}($this));
		}break;
		}
		return $r;
	}(this));
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
Config = function(p) { if( p === $_ ) return; {
	null;
}}
Config.__name__ = ["Config"];
Config.prototype.get = function(name) {
	return getCookie(name);
}
Config.prototype.set = function(name,val) {
	return setCookie(name,val,new Date(2015, 0, 0, 0, 0, 0, 0));
}
Config.prototype.__class__ = Config;
Alert = function(uivar,gvar) { if( uivar === $_ ) return; {
	this.ui = uivar;
	this.game = gvar;
	this.isVisible = false;
	this.window = Tools.window({ id : "window", center : true, winW : UI.winWidth, winH : UI.winHeight, bold : true, w : 600, h : 450, z : 25});
	this.window.style.visibility = "hidden";
	this.window.style.background = "#222";
	this.window.style.border = "4px double #ffffff";
	this.text = js.Lib.document.createElement("div");
	this.text.style.overflow = "auto";
	this.text.style.position = "absolute";
	this.text.style.left = 10;
	this.text.style.top = 10;
	this.text.style.width = 580;
	this.text.style.height = 400;
	this.text.style.background = "#111";
	this.text.style.border = "1px solid #777";
	this.window.appendChild(this.text);
	var close = Tools.closeButton(this.window,260,415,"alertClose");
	close.onclick = $closure(this,"onClose");
	this.bg = Tools.bg({ w : UI.winWidth + 20, h : UI.winHeight, z : 24});
}}
Alert.__name__ = ["Alert"];
Alert.prototype.bg = null;
Alert.prototype.game = null;
Alert.prototype.isVisible = null;
Alert.prototype.onClose = function(event) {
	this.window.style.visibility = "hidden";
	this.bg.style.visibility = "hidden";
	this.isVisible = false;
}
Alert.prototype.show = function(s,shadow) {
	this.text.innerHTML = "<center>" + s + "</center>";
	this.window.style.visibility = "visible";
	this.bg.style.visibility = ((shadow?"visible":"hidden"));
	this.isVisible = true;
}
Alert.prototype.text = null;
Alert.prototype.ui = null;
Alert.prototype.window = null;
Alert.prototype.__class__ = Alert;
GenName = function() { }
GenName.__name__ = ["GenName"];
GenName.generate = function() {
	var name = GenName.names[Std["int"](Math.random() * (GenName.names.length - 1))];
	var surname = GenName.surnames[Std["int"](Math.random() * (GenName.surnames.length - 1))];
	return name + " " + surname;
}
GenName.prototype.__class__ = GenName;
Investigator = function(c,ui) { if( c === $_ ) return; {
	this.cult = c;
	this.ui = ui;
	this.level = 0;
	this.will = 1;
	this.name = GenName.generate();
	this.numTurn = 0;
	this.isHidden = true;
}}
Investigator.__name__ = ["Investigator"];
Investigator.prototype.cult = null;
Investigator.prototype.gainWill = function() {
	if(100 * Math.random() > 70 * this.cult.difficulty.investigatorGainWill) return;
	var oldLevel = this.level;
	this.will += 1;
	this.level = Std["int"](this.will / 3);
	if(this.level > 2) this.level = 2;
	if(this.level > oldLevel && !this.cult.isAI) this.ui.log2("cult",this.cult,"The investigator of " + this.cult.getFullName() + " has gained level " + (this.level + 1) + ".");
}
Investigator.prototype.getKillChance = function() {
	if(this.cult.awareness <= 5) return Std["int"](20 * this.cult.difficulty.investigatorKill);
	else if(this.cult.awareness <= 10) return Std["int"](65 * this.cult.difficulty.investigatorKill);
	else return Std["int"](70 * this.cult.difficulty.investigatorKill);
}
Investigator.prototype.isHidden = null;
Investigator.prototype.killFollower = function() {
	if(100 * Math.random() > this.getKillChance()) return;
	var node = null;
	if(this.cult.isRitual) { var $it24 = this.cult.nodes.iterator();
	while( $it24.hasNext() ) { var n = $it24.next();
	{
		if(n.level > this.level || n.isProtected) continue;
		if(node != null && n.level <= node.level) continue;
		node = n;
	}
	}}
	else { var $it25 = this.cult.nodes.iterator();
	while( $it25.hasNext() ) { var n = $it25.next();
	{
		if(n.level > this.level || n.isProtected) continue;
		node = n;
		if(Math.random() > 0.5) break;
	}
	}}
	if(node == null) return;
	this.ui.log2("cult",this.cult,"The investigator revealed the " + this.cult.getFullName() + " follower.");
	node.removeOwner();
	if(node.visibility[0]) node.setHighlighted(true);
}
Investigator.prototype.level = null;
Investigator.prototype.load = function(obj) {
	this.name = obj.n;
	this.will = obj.w;
	this.level = obj.l;
	this.isHidden = ((obj.h == 1?true:false));
}
Investigator.prototype.name = null;
Investigator.prototype.numTurn = null;
Investigator.prototype.save = function() {
	return { n : this.name, w : this.will, l : this.level, h : ((this.isHidden?1:0))}
}
Investigator.prototype.turn = function() {
	if(this.numTurn == 0 && this.cult.difficulty.level == 0) {
		this.numTurn++;
		return;
	}
	if(this.isHidden && this.numTurn > this.cult.difficulty.investigatorTurnVisible) {
		this.ui.log2("cult",this.cult,this.cult.getFullName() + " has found out the investigator's location.");
		this.isHidden = false;
	}
	if(this.will >= 9) this.isHidden = true;
	this.numTurn++;
	{
		var _g1 = 0, _g = (this.level + 1);
		while(_g1 < _g) {
			var i = _g1++;
			this.killFollower();
		}
	}
	if(this.cult.awareness < 5 && !this.cult.isRitual) return;
	this.gainWill();
	if(this.cult.isRitual && 100 * Math.random() < 30) this.gainWill();
}
Investigator.prototype.ui = null;
Investigator.prototype.will = null;
Investigator.prototype.__class__ = Investigator;
MainMenu = function(uivar,gvar) { if( uivar === $_ ) return; {
	this.ui = uivar;
	this.game = gvar;
	this.isVisible = false;
	this.window = Tools.window({ id : "mainMenuWindow", center : true, winW : UI.winWidth, winH : UI.winHeight, w : 420, h : 280, z : 20});
	Tools.button({ id : "newGameEasy", text : "START NEW GAME - EASY", w : 350, h : 30, x : 35, y : 30, container : this.window, func : $closure(this,"onNewGame")});
	Tools.button({ id : "newGameNormal", text : "START NEW GAME - NORMAL", w : 350, h : 30, x : 35, y : 70, container : this.window, func : $closure(this,"onNewGame")});
	Tools.button({ id : "newGameHard", text : "START NEW GAME - HARD", w : 350, h : 30, x : 35, y : 110, container : this.window, func : $closure(this,"onNewGame")});
	Tools.button({ id : "loadGame", text : "LOAD GAME", w : 350, h : 30, x : 35, y : 150, container : this.window, func : $closure(this,"onLoadGame")});
	this.saveButton = Tools.button({ id : "saveGame", text : "SAVE GAME", w : 350, h : 30, x : 35, y : 190, container : this.window, func : $closure(this,"onSaveGame")});
	this.bg = Tools.bg({ w : UI.winWidth + 20, h : UI.winHeight});
	this.close = Tools.closeButton(this.window,160,240,"mainMenuClose");
	this.close.onclick = $closure(this,"onClose");
}}
MainMenu.__name__ = ["MainMenu"];
MainMenu.prototype.bg = null;
MainMenu.prototype.close = null;
MainMenu.prototype.game = null;
MainMenu.prototype.isVisible = null;
MainMenu.prototype.onClose = function(event) {
	this.window.style.visibility = "hidden";
	this.bg.style.visibility = "hidden";
	this.close.style.visibility = "hidden";
	this.saveButton.style.visibility = "hidden";
	this.isVisible = false;
}
MainMenu.prototype.onKey = function(e) {
	if(e.keyCode == 49) this.onNewGameReal(0);
	else if(e.keyCode == 50) this.onNewGameReal(1);
	else if(e.keyCode == 51) this.onNewGameReal(2);
	else if(e.keyCode == 52) this.onLoadGame(null);
	else if(e.keyCode == 53) this.onSaveGame(null);
	else if(e.keyCode == 27 && !this.game.isFinished) this.onClose(null);
}
MainMenu.prototype.onLoadGame = function(event) {
	this.ui.loadMenu.show();
	this.onClose(null);
}
MainMenu.prototype.onNewGame = function(event) {
	var id = Tools.getTarget(event).id;
	var dif = 0;
	if(id == "newGameEasy") dif = 0;
	else if(id == "newGameNormal") dif = 1;
	else dif = 2;
	this.onNewGameReal(dif);
}
MainMenu.prototype.onNewGameReal = function(dif) {
	js.Lib.document.getElementById("haxe:trace").innerHTML = "";
	this.game.restart(dif);
	this.onClose(null);
}
MainMenu.prototype.onSaveGame = function(event) {
	this.ui.saveMenu.show();
	this.onClose(null);
}
MainMenu.prototype.saveButton = null;
MainMenu.prototype.show = function() {
	this.window.style.visibility = "visible";
	this.bg.style.visibility = "visible";
	this.close.style.visibility = ((this.game.isFinished?"hidden":"visible"));
	this.saveButton.style.visibility = ((this.game.isFinished?"hidden":"visible"));
	this.isVisible = true;
}
MainMenu.prototype.ui = null;
MainMenu.prototype.window = null;
MainMenu.prototype.__class__ = MainMenu;
LogPanel = function(uivar,gvar) { if( uivar === $_ ) return; {
	this.ui = uivar;
	this.game = gvar;
	this.list = new List();
	this.panel = js.Lib.document.createElement("div");
	this.panel.id = "logPanel";
	this.panel.style.position = "absolute";
	this.panel.style.width = 20;
	this.panel.style.height = (UI.mapHeight + 8);
	this.panel.style.left = 217;
	this.panel.style.top = 5;
	this.panel.style.background = "#090909";
	js.Lib.document.body.appendChild(this.panel);
}}
LogPanel.__name__ = ["LogPanel"];
LogPanel.prototype.add = function(text,type,obj) {
	if(this.list.length >= 24) this.clear();
	var sym = "!";
	var col = "white";
	if(type == "cult") {
		var cult = obj;
		col = UI.lineColors[cult.id];
	}
	else if(type == "cults") {
		var cult = obj.c1;
		var cult2 = obj.c2;
		sym = "<span style='color:" + UI.lineColors[cult.id] + "'>!</span>" + "<span style='color:" + UI.lineColors[cult2.id] + "'>!</span>";
	}
	var e = js.Lib.document.createElement("div");
	e.id = "log.id" + this.list.length;
	e.style.position = "absolute";
	e.style.width = "20";
	e.style.height = "20";
	e.style.left = "0";
	e.style.top = "" + (this.list.length * 24);
	e.style.background = "#151515";
	e.style.border = "1px solid #999";
	e.style.cursor = "pointer";
	e.style.fontSize = 15;
	e.style.color = col;
	e.style.fontWeight = "bold";
	e.style.textAlign = "center";
	e.innerHTML = sym;
	this.panel.appendChild(e);
	e.onclick = $closure(this,"onClick");
	e.title = "Turn " + (this.game.turns + 1) + ": " + text;
	new JQuery("#log\\.id" + this.list.length).tooltip({ delay : 0});
	this.list.add(e);
}
LogPanel.prototype.clear = function() {
	this.list.clear();
	while(this.panel.hasChildNodes()) this.panel.removeChild(this.panel.firstChild);
}
LogPanel.prototype.endTurn = function() {
	{ var $it26 = this.list.iterator();
	while( $it26.hasNext() ) { var e = $it26.next();
	e.style.background = "#050505";
	}}
}
LogPanel.prototype.game = null;
LogPanel.prototype.list = null;
LogPanel.prototype.onClick = function(event) {
	var e = Tools.getTarget(event);
	this.panel.removeChild(e);
	this.list.remove(e);
	var cnt = 0;
	var nodes = this.panel.childNodes;
	{
		var _g1 = 0, _g = nodes.length;
		while(_g1 < _g) {
			var i = _g1++;
			nodes[i].style.top = "" + (cnt * 24);
			cnt++;
		}
	}
}
LogPanel.prototype.panel = null;
LogPanel.prototype.ui = null;
LogPanel.prototype.__class__ = LogPanel;
Tools = function() { }
Tools.__name__ = ["Tools"];
Tools.getTarget = function(event) {
	if(event == null) event = window.event;
	var t = event.target;
	if(t == null) t = event.srcElement;
	return t;
}
Tools.bg = function(params) {
	if(params.z == null) params.z = 15;
	var bg = js.Lib.document.createElement("div");
	bg.style.visibility = "hidden";
	bg.style.position = "absolute";
	bg.style.zIndex = params.z;
	bg.style.width = params.w;
	bg.style.height = params.h;
	bg.style.left = 0;
	bg.style.top = 0;
	bg.style.opacity = 0.8;
	bg.style.background = "#000";
	js.Lib.document.body.appendChild(bg);
	return bg;
}
Tools.button = function(params) {
	var b = js.Lib.document.createElement("div");
	b.id = params.id;
	b.innerHTML = params.text;
	if(params.bold == null) params.bold = true;
	if(params.bold) b.style.fontWeight = "bold";
	if(params.fontSize == null) params.fontSize = 20;
	b.style.fontSize = params.fontSize;
	b.style.position = "absolute";
	b.style.width = params.w;
	b.style.height = params.h;
	b.style.left = params.x;
	b.style.top = params.y;
	b.style.background = "#111";
	b.style.border = "1px outset #777";
	b.style.cursor = "pointer";
	b.style.textAlign = "center";
	params.container.appendChild(b);
	if(params.func != null) b.onclick = params.func;
	return b;
}
Tools.closeButton = function(container,x,y,name) {
	var b = Tools.button({ id : name, text : "Close", width : 80, height : 25, x : x, y : y, container : container});
	return b;
}
Tools.label = function(params) {
	var b = js.Lib.document.createElement("div");
	b.id = params.id;
	b.innerHTML = params.text;
	if(params.bold == null) params.bold = true;
	if(params.bold) b.style.fontWeight = "bold";
	if(params.fontSize == null) params.fontSize = 20;
	b.style.fontSize = params.fontSize;
	b.style.position = "absolute";
	b.style.width = params.w;
	b.style.height = params.h;
	b.style.left = params.x;
	b.style.top = params.y;
	params.container.appendChild(b);
	return b;
}
Tools.window = function(params) {
	if(params.winW != null) params.x = (params.winW - params.w) / 2;
	if(params.winH != null) params.y = (params.winH - params.h) / 2;
	if(params.z == null) params.z = 10;
	var w = js.Lib.document.createElement("div");
	w.id = params.id;
	w.style.visibility = "hidden";
	w.style.position = "absolute";
	w.style.zIndex = params.z;
	w.style.width = params.w;
	w.style.height = params.h;
	w.style.left = params.x;
	w.style.top = params.y;
	if(params.fontSize != null) w.style.fontSize = params.fontSize;
	if(params.bold) w.style.fontWeight = "bold";
	w.style.background = "#222";
	w.style.border = "4px double #ffffff";
	js.Lib.document.body.appendChild(w);
	return w;
}
Tools.textfield = function(params) {
	var t = js.Lib.document.createElement("input");
	t.id = params.id;
	t.value = params.text;
	if(params.bold == null) params.bold = false;
	if(params.bold) t.style.fontWeight = "bold";
	if(params.fontSize == null) params.fontSize = 20;
	t.style.fontSize = params.fontSize;
	t.style.position = "absolute";
	t.style.width = params.w;
	t.style.height = params.h;
	t.style.left = params.x;
	t.style.top = params.y;
	t.style.background = "#111";
	t.style.paddingLeft = "5px";
	t.style.border = "1px outset #777";
	params.container.appendChild(t);
	return t;
}
Tools.prototype.__class__ = Tools;
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
	js["XMLHttpRequest"] = (window.XMLHttpRequest?XMLHttpRequest:(window.ActiveXObject?function() {
		try {
			return new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch( $e27 ) {
			{
				var e = $e27;
				{
					try {
						return new ActiveXObject("Microsoft.XMLHTTP");
					}
					catch( $e28 ) {
						{
							var e1 = $e28;
							{
								throw "Unable to create XMLHttpRequest object.";
							}
						}
					}
				}
			}
		}
	}:(function($this) {
		var $r;
		throw "Unable to create XMLHttpRequest object.";
		return $r;
	}(this))));
}
Game.powerNames = ["Intimidation","Persuasion","Bribery","Virgins"];
Game.powerShortNames = ["I","P","B","V"];
Game.followerNames = ["Neophyte","Adept","Priest"];
Game.powerConversionCost = [2,2,2,1];
Game.willPowerCost = 2;
Game.cultColors = ["#00B400","#2F43FD","#B400AE","#B4AE00"];
Game.version = "v4pre2";
Game.followerLevels = 3;
Game.numPowers = 3;
Game.numCults = 4;
Game.numSummonVirgins = 9;
Game.nodesCount = 100;
Game.upgradeCost = 3;
Game.isDebug = false;
Game.debugTime = false;
Game.debugVis = false;
Game.debugNear = false;
Game.debugAI = false;
Game.mapVisible = false;
UI.powerColors = ["#ff0000","#00ffff","#00ff00","#ffff00"];
UI.nodeColors = ["#005500","#010955","#560053","#505000"];
UI.lineColors = ["#55dd55","#2727D7","#E052CA","#D8E151"];
UI.winWidth = 1024;
UI.winHeight = 600;
UI.mapWidth = 780;
UI.mapHeight = 580;
UI.tooltipWidth = 100;
UI.tooltipHeight = 80;
UI.markerWidth = 15;
UI.markerHeight = 15;
UI.nodeVisibility = 101;
UI.colAwareness = "#ff9999";
UI.colWillpower = "#bbbbbb";
UI.maxSaves = 5;
Static.difficulty = [{ level : 0, upgradeChance : 1.10, awarenessResource : 1.25, awarenessUpgrade : 0.75, awarenessGain : 0.75, investigatorChance : 0.50, investigatorKill : 0.75, investigatorWillpower : 0.75, investigatorTurnVisible : 0, investigatorGainWill : 0.50, maxAwareness : 10},{ level : 1, upgradeChance : 1.0, awarenessResource : 1.5, awarenessUpgrade : 1.0, awarenessGain : 1.0, investigatorChance : 1.0, investigatorKill : 1.0, investigatorWillpower : 1.0, investigatorTurnVisible : 1, investigatorGainWill : 0.75, maxAwareness : 5},{ level : 2, upgradeChance : 0.90, awarenessResource : 1.75, awarenessUpgrade : 1.25, awarenessGain : 1.25, investigatorChance : 1.25, investigatorKill : 1.25, investigatorWillpower : 1.25, investigatorTurnVisible : 2, investigatorGainWill : 1.0, maxAwareness : 5}];
Static.cults = [{ name : "Cult of Elder God", note : "The cult still lives.", longNote : "At the dawn of humanity the great old ones told their secrets in dreams to the first men, who formed a cult which had never died... Hidden in distant and dark places of the world, waiting for the day when the stars will be right again and the mighty Elder God will rise from his slumber under the deep waters to bring the earth beneath his sway once more.", summonStart : "", summonFinish : "", summonFail : ""},{ name : "Pharaonic Slumber", note : "A group that wants to put the entire world to sleep, feeding on the nightmares of the dreamers.", longNote : "Abhumans from a dark dimension close to ours came to Earth thousands of years ago, trading their magics and technology with the Egyptians for control of their people's minds when they slept, for they fed upon nightmares. With the secret help of the Roman Empire, the Egyptians drove the abhumans into hiding. But they have returned, and their goal has grown with time: the permanent slumber of the world.", summonStart : "As the Pharaonic Slumber's power grows, the world enters a state of controlled drowsiness. People go to bed earlier and sleep later, their dreams plagued with thoughts of sweeping sands and dark figures. Short naps at work become almost commonplace, and as the abhumans feed upon the dreaming energies of the world, everyone feels less and less energetic. All the more reason to take a bit of a rest...", summonFinish : "The world drifts off to sleep, some even slumping to the sidewalk where they were just walking or barely managing to bring their vehicles to a stop. The abhumans come out in force, walking amongst the dreaming populace, feeding hungrily upon the horrid dreams foisted upon them by the dark magics. A few humans manage to keep themselves awake a bit longer on massive doses of amphetamines, but soon they too crash into the darkness of eternal slumber, screaming into unconsciousness as they see the burning red eyes of those who've come to consume their thoughts.", summonFail : "People shake off the dozing state that had captured them. Sales of coffee and cola rocket temporarily, an odd spike that intrigues many commentators, and for a moment humanity is more awake than it has ever been before. Soon, however, old habits return, and some are still plagued by dreams of windswept deserts they have never before seen and cloaked figures that move in a way that somehow feels inhuman, dreams that feel more real than reality."},{ name : "Blooded Mask", note : "A group devoted to ripping away the masks people wear and revealing the insane reality beyond.", longNote : "Those who peer too long into the Abyss find that it stares back at them, and the Blooded Mask has long gazed into the ineffable world beyond our own. Affiliated with no Elder God, or perhaps all of them, the Blooded Mask longs to show humanity the brutal truths that hide behind the consensual reality. The truths drive those who see them insane, filling them with a desire to show others as well, and the Blooded Mask are the original converts.", summonStart : "A rash of cases of schizophrenia and paranoid delusions becomes an epidemic.  World health organizations struggle to understand environmental factors behind the increasing numbers of psychotic breaks and irrational behaviour across the world, unaware of the rituals the Blooded Mask are enacting.  The only clue is an increased incidence of individuals trying to claw their eyes out, often babbling about seeing <i>the truth</i> better without them.", summonFinish : "Even the most stable individuals become gripped by the desire to see beyond the veil. Plucking their eyes out, almost as one, humanity peers out of bloody sockets into the screaming void of alien truth that had, until then, been hidden to most. The Bloody Veil's incantations brought to their climax, the world becomes a madhouse of screaming blind horror, people stumbling through living nightmares in colours their minds were never meant to comprehend, groping past those others wandering in the same strange geometries.", summonFail : "The outbreak of madness draws to a close, the circumstances at its end as mysterious as when it began. Sanity returns to some of those who saw the underlying truth, but those who blinded themselves are relegated to sanitariums around the world, their screaming reverberating in the halls of the buildings, unable to stop seeing the horrifying ur-reality. A small number of painters attempt to incorporate the colours they saw in their madness into their work, and the epileptic seizures their paintings evoke cause the black ops divisions of the world's governments to destroy all evidence of their work."},{ name : "Universal Lambda", note : "Programmers who want to turn humanity into a vast processing machine.", longNote : "In the early seventies, a secret goverment project uncovered the changes necessary to turn any human brain into an efficient, soulless computer.  Little did the project know that it had been subverted by the dark cult. The Universal Lambda works to refine that now-defunct project's results: the turning of every human being into cogs of a huge machine, a distributed network for the vast living intellect of the Elder God.", summonStart : "The Universal Lambda's cybermantic machinations begin to influence the entire world.  People start to walk in unconscious lockstep down the streets; crime and accident rates drop as the rituals rewire minds to be more and more regimented.  People make fewer choices, locking themselves into patterns without realizing the steady loss of free will.", summonFinish : "Their rituals complete, the Universal Lambda turns the world into a well-oiled machine. Bodies still move around, taking part in the same rote behavior they did before, but the minds of the populace are gone. Instead of thinking independent thoughts, humanity's brains run the code that allows The Machine to run in our dimension. The tiny flickers of free will brought upon by every birth are quickly consumed by the overwhelming cybermantic magics enveloping the world; all are just parts of the giant soulless entity... ", summonFail : "The eerily constant behavior of humanity slowly returns to its regular froth of chaos. People still occasionally slip into the robotic state they exhibited mere days before, but the rising rate of accidents and deaths heralds the return of free will, for better or worse."},{ name : "Drowned", note : "Vengeful spirits determined to drown the rest of the world.", longNote : "Over the millennia, hundreds of thousands of people have drowned in the oceans, lakes, and rivers of the world. Most of them pass peacefully into oblivion, but some linger, warped by the experience of their death. Over time, those who remain have gathered together in an undead cabal. They want the rest of the world to join them in their watery graves, and will stop at nothing to make it happen.", summonStart : "It begins to rain. A slow drizzle at first, the entire world is soon enveloped in an unending thunderstorm, water pouring from the heavens without an end in sight. Low-lying regions begin to flood, and it is only a matter of time before even the highest ground is inundated.", summonFinish : "The heavy rains turn torrential.  The sea level rises inexorably as humanity crowds further and further up into the mountains.  Still the rains come, still the waters climb.  Every death in the water adds to the power of the Drowned, the force of the neverending rain.  Many take\n      to boats in an attempt to survive on the surface of the sea, only to find that no ship remains seaworthy; leaks spring up in unlikely places, and soon every vessel succumbs to the inexorable pull of the dark depths below.  The last gasp of humanity is a doomed man standing on the peak of Everest, and then he goes under once. Twice. He is gone.", summonFail : "The rains slacken, first to a light patter, then a drizzle, then nothing but the usual patterns of storms and showers. Commentators argue that the excess water had to come from somewhere, but within days everything seems to have returned to an equilibrium, the ghost rains drying up into nothing.  Scientists are at a loss to explain the phenomenon, but the\n      rest of the world returns to its routine, although many glance at the sky whenever a cloud darkens the day, worried that it might once again begin to rain forever."},{ name : "Manipulators", note : "Powerful magicians who wish to enslave humanity.", longNote : "For centuries, men in power have desired the ability to make their subjects obey their every whim. Some have used force, or fear, but none have been completely successful. A group of powerful male magicians, many of whom control powerful multinational corporations, are determined to succeed where others have failed.  Through the use of mind-manipulation magic, memetic manipulation, and subtle influence in world governments, they plan to make every other man, woman, and child on the planet their slaves, forced into fulfilling the Manipulators' dark desires.", summonStart : "The Manipulators start their ultimate ritual with a slow but insidious assault on the psyches of the world, using traditional advertising techniques combined with subtle dark magics.  Much of their work is couched in the comforting form of mass media, convincing people that the\n      old inhibited days are over, that a new dawn of peace, prosperity, and happiness is on the horizon, subtly hinting that a chosen few will be the ones to lead humanity into the new golden age.  Many are skeptical, but many more are taken in by the Manipulators' careful schemes, as the magics work their way on the minds of the converted and unconverted alike.", summonFinish : "The Manipulators' control of the world becomes more and more overt, their supposedly-benign stewardship turning into outright worship by the masses. Their magics turn support into adulation, appreciation into unfettered desire; the world wants, needs to fulfill their every whim, no matter the consequence. People of all genders and ages disappear into the gleaming palaces, their bodies and minds used for unmentionable new rituals. The diversity of humanity is now nothing more than a living, breathing mass of clay for the Manipulators to sculpt as they desire. And their desires are manifold indeed.", summonFail : "What at first seemed like the genuine rise of a new era of freedom and prosperity turns sour, many of its proponents discovered to be frauds and freaks.  The Manipulators themselves stay behind the scenes, protected by layers of misdirection and human shields, but the effects\n      of their manipulations begin to fade.  People once again assert contrary views with candor; for a moment, they view the mass media with a genuine critical eye.  Then the time passes, advertisements and packaged views reasserting their mundane control on the opinions, just another day in this modern life."}];
Static.rituals = [{ id : "summoning", name : "Final Ritual", points : 9, note : "Upon completion this cult will reign over the world unchallenged."}];
Status.tipPowers = [UI.powerName(0) + " is needed to gain new followers.",UI.powerName(1) + " is needed to gain new followers.",UI.powerName(2) + " is needed to gain new followers.",UI.powerName(3) + " are gathered by your neophytes.<br>" + "They are needed for rituals to upgrade your<br>followers " + "and also for the final ritual of summoning."];
Status.tipConvert = "Cost to convert to ";
Status.tipUpgrade = ["To gain an adept you need " + Game.upgradeCost + " neophytes and 1 virgin.","To gain a priest you need " + Game.upgradeCost + " adepts and 2 virgins.","To perform the " + Static.rituals[0].name + " you need " + Game.upgradeCost + " priests and " + Game.numSummonVirgins + " virgins.<br>" + "<li>The more society is aware of the cult the harder it is to " + "summon Elder God."];
Status.tipFollowers = ["Neophytes can find some virgins if they're lucky.","Adepts can lower society awareness and investigator's willpower.","3 priests and " + Game.numSummonVirgins + " virgins are needed to summon the Elder God."];
Status.tipTurns = "Shows the number of turns passed from the start.";
Status.tipAwareness = "Shows how much human society is aware of the cult.<br>" + "<li>The greater awareness is the harder it is to do anything:<br>" + "gain new followers, resources or make rituals.<br> " + "<li>Adepts can lower the society awareness using resources.<br>" + "<li>The more adepts you have the more you can lower awareness each turn.";
Status.tipLowerAwareness = "Your adepts can use resources to lower society awareness.";
Status.tipLowerWillpower = "Your adepts can use resources to lower willpower of an investigator.<br>Cost: ";
Status.tipEndTurn = "Click to end current turn (or press <span style=\"color:white\">E</span>).";
Status.tipInfo = "Click to view cults information (or press <span style=\"color:white\">I</span>).";
Status.tipMainMenu = "Click to open main menu (or press <span style=\"color:white\">ESC</span>).";
Status.tipLog = "Click to view message log (or press <span style=\"color:white\">L</span>).";
Status.tipAbout = "Click to go to About page.";
js.Lib.onerror = null;
Node.jobs = ["Government official","Corporate worker","University professor","Army officer","Scientist"];
DateTools.DAYS_OF_MONTH = [31,28,31,30,31,30,31,31,30,31,30,31];
GenName.names = ["Austin","Barbara","Calvin","Carl","Catherine","Clarence","Donald","Dwight","Ed","Evelyn","Kevin","Lester","Mark","Oscar","Patricia","Samuel","Sigourney","Spencer","Tom","Virgil","Adam","Alan","Andrea","Arthur","Brett","Damien","David","Frank","Helen","James","Jane","John","Maria","Michael","Neil","Patrick","Paul","Randolph","Robert","Sarah","Scott","Armand","Bernard","Claude","Danielle","Emile","Gaston","Gerard","Henri","Jacqueline","Jacques","Jean","Leon","Louis","Marc","Marcel","Marielle","Micheline","Pierre","Rene","Sylvie","Christel","Dieter","Franz","Gerhard","Gudrun","Gunter","Hans","Helga","Jurgen","Karin","Klaus","Manfred","Matthias","Otto","Rudi","Siegfried","Stefan","Uta","Werner","Wolfgang","Akinori","Isao","Jungo","Hideo","Kenji","Mariko","Masaharu","Masanori","Michiko","Naohiro","Sata","Shigeo","Shigeru","Shuji","Sumie","Tatsuo","Toshio","Yasuaki","Yataka","Yoko","Yuzo","Anatoly","Andrei","Alyona","Boris","Dmitriy","Galina","Gennadiy","Grigoriy","Igor","Ivan","Leonid","Lyudmila","Mikhail","Natalya","Nikolai","Olga","Sergei","Tatyana","Victor","Vladimir","Yuri"];
GenName.surnames = ["Bradley","Bryant","Carr","Crossett","Dodge","Gallagher","Homburger","Horton","Hudson","Johnson","Kemp","King","McNeil","Miller","Mitchell","Nash","Stephens","Stoddard","Thompson","Webb","Bailey","Blake","Carter","Davies","Day","Evans","Hill","Jones","Jonlan","Martin","Parker","Pearce","Reynolds","Robinson","Sharpe","Smith","Stewart","Taylor","Watson","White","Wright","Bouissou","Bouton","Buchard","Coicaud","Collignon","Cuvelier","Dagallier","Dreyfus","Dujardin","Gaudin","Gautier","Gressier","Guerin","Laroyenne","Lecointe","Lefevre","Luget","Marcelle","Pecheux","Revenu","Berger","Brehme","Esser","Faerber","Geisler","Gunkel","Hafner","Heinsch","Keller","Krause","Mederow","Meyer","Richter","Schultz","Seidler","Steinbach","Ulbricht","Unger","Vogel","Zander","Akira","Fujimoto","Ishii","Iwahara","Iwasaki","Kojima","Koyama","Matsumara","Morita","Noguchi","Okabe","Okamoto","Sato","Shimaoka","Shoji","Tanida","Tanikawa","Yamanaka","Yamashita","Yamazaki","Andryanov","Belov","Chukarin","Gorokhov","Kolotov","Korkin","Likhachev","Maleev","Mikhailov","Petrov","Razuvaev","Romanov","Samchenko","Scharov","Shadrin","Shalimov","Torbin","Voronin","Yakubchik","Zhdanovich"];
$Main.init = Game.main();
