$estr = function() { return js.Boot.__string_rec(this,''); }
if(typeof quests=='undefined') quests = {}
quests.Quest = function(g) { if( g === $_ ) return; {
	this.game = g;
	this.map = this.game.map;
	this.id = "_dummy";
	this.turnsPassed = 0;
}}
quests.Quest.__name__ = ["quests","Quest"];
quests.Quest.check = function(game) {
	return false;
}
quests.Quest.prototype.activate = function(o) {
	null;
}
quests.Quest.prototype.finish = function() {
	{ var $it0 = this.map.objects.iterator();
	while( $it0.hasNext() ) { var o = $it0.next();
	if(o.quest == this) o.die();
	}}
	this.game.quests.remove(this);
}
quests.Quest.prototype.game = null;
quests.Quest.prototype.id = null;
quests.Quest.prototype.map = null;
quests.Quest.prototype.message = function(str) {
	this.game.ui.alert(str);
}
quests.Quest.prototype.spawnQuestMarker = function(x,y,name,tag,message) {
	var o = new QuestMarker(this.game,x,y,this);
	o.name = name;
	o.message = message;
	o.questTag = tag;
}
quests.Quest.prototype.start = function() {
	null;
}
quests.Quest.prototype.tick = function() {
	null;
}
quests.Quest.prototype.turnsPassed = null;
quests.Quest.prototype.__class__ = quests.Quest;
quests.NosyReporter = function(g) { if( g === $_ ) return; {
	quests.Quest.apply(this,[g]);
	this.id = "nosyReporter";
}}
quests.NosyReporter.__name__ = ["quests","NosyReporter"];
quests.NosyReporter.__super__ = quests.Quest;
for(var k in quests.Quest.prototype ) quests.NosyReporter.prototype[k] = quests.Quest.prototype[k];
quests.NosyReporter.check = function(game) {
	if(game.map.getReanimated() == 0 || game.player.theory < 3) return false;
	return true;
}
quests.NosyReporter.prototype.activate = function(o) {
	if(o.questTag == "_markerStart") {
		this.game.ui.alert("A nosy reporter from out of town walks around the laboratory asking questions. You need to deal with this risk of exposure.");
		o.die();
		var c = this.game.map.findEmpty(this.game.player.lab.x - 3,this.game.player.lab.y - 3,this.game.player.lab.w + 6,this.game.player.lab.h + 6);
		var o1 = new Human(this.game,c.x,c.y);
		o1.quality = 3;
		o1.name = "reporter";
		o1.message = "\"I need to find a scoop in this lousy town.\"";
		o1.isQuest = true;
		o1.quest = this;
		o1.questTag = "_reporter";
	}
}
quests.NosyReporter.prototype.start = function() {
	var c = this.game.map.findEmpty(this.game.player.lab.x - 3,this.game.player.lab.y - 3,this.game.player.lab.w + 6,this.game.player.lab.h + 6);
	this.spawnQuestMarker(c.x,c.y,"nosy reporter","_markerStart","A reporter is snooping around your laboratory...");
}
quests.NosyReporter.prototype.tick = function() {
	if(this.turnsPassed > 10) {
		this.game.ui.alert("The reporter has been able to dig up some revealing information about your research drawing unwanted attention. [Suspicion +1].");
		this.game.player.suspicion++;
		this.finish();
		return;
	}
	var o = this.map.getQuestObject(this,"_markerStart");
	if(o != null) return;
	var o1 = this.map.getQuestObject(this,"_reporter");
	if(o1 != null) return;
	this.game.ui.alert("This reporter won't bother you again.");
	this.finish();
}
quests.NosyReporter.prototype.__class__ = quests.NosyReporter;
CellObject = function(g,xv,yv,dontAdd) { if( g === $_ ) return; {
	this.game = g;
	this.x = xv;
	this.y = yv;
	this.map = this.game.map;
	this.ui = this.game.ui;
	this.turns = 0;
	this.skip = false;
	this.life = 1;
	this.state = "idle";
	this.subtype = null;
	this.isQuest = false;
	this.message = "";
	if(dontAdd == null || dontAdd == false) {
		this.map.objects.add(this);
		this.map.get(this.x,this.y).object = this;
	}
}}
CellObject.__name__ = ["CellObject"];
CellObject.prototype.activate = function(p) {
	return false;
}
CellObject.prototype.ai = function() {
	null;
}
CellObject.prototype.alert = function(ax,ay) {
	null;
}
CellObject.prototype.die = function() {
	this.map.objects.remove(this);
	this.map.get(this.x,this.y).object = null;
}
CellObject.prototype.game = null;
CellObject.prototype.getImage = function() {
	return this.type;
}
CellObject.prototype.getMessage = function() {
	return this.message;
}
CellObject.prototype.getNote = function() {
	var p1 = ((this.subtype == null?this.type:this.subtype));
	var p2 = ((this.state != "idle"?(" (" + this.state) + ")":""));
	var p3 = "";
	{
		var _g1 = 0, _g = this.life;
		while(_g1 < _g) {
			var i = _g1++;
			p3 += "*";
		}
	}
	return ((p1 + p2) + " ") + p3;
}
CellObject.prototype.hit = function(o) {
	null;
}
CellObject.prototype.isQuest = null;
CellObject.prototype.life = null;
CellObject.prototype.map = null;
CellObject.prototype.message = null;
CellObject.prototype.move = function(nx,ny) {
	this.map.get(this.x,this.y).object = null;
	this.x = nx;
	this.y = ny;
	this.map.get(this.x,this.y).object = this;
	this.onMove();
}
CellObject.prototype.name = null;
CellObject.prototype.onMove = function() {
	null;
}
CellObject.prototype.quest = null;
CellObject.prototype.questTag = null;
CellObject.prototype.skip = null;
CellObject.prototype.state = null;
CellObject.prototype.subtype = null;
CellObject.prototype.turns = null;
CellObject.prototype.type = null;
CellObject.prototype.ui = null;
CellObject.prototype.x = null;
CellObject.prototype.y = null;
CellObject.prototype.__class__ = CellObject;
Patient = function(g,xv,yv) { if( g === $_ ) return; {
	CellObject.apply(this,[g,xv,yv]);
	this.type = "patient";
}}
Patient.__name__ = ["Patient"];
Patient.__super__ = CellObject;
for(var k in CellObject.prototype ) Patient.prototype[k] = CellObject.prototype[k];
Patient.prototype.activate = function(player) {
	this.die();
	player.money++;
	this.ui.msg("Grateful patient gives you money for the treatment.");
	return true;
}
Patient.prototype.ai = function() {
	if(!this.isSick && this.turns >= 2) {
		if(Math.random() < 0.7) this.die();
		else {
			this.isSick = true;
			this.turns = 0;
		}
	}
	else if(this.isSick && this.turns >= 2) {
		this.die();
		var o = new Body(this.game,this.x,this.y);
		o.skip = true;
	}
}
Patient.prototype.getNote = function() {
	return ((this.isSick?"sick patient":this.type));
}
Patient.prototype.isSick = null;
Patient.prototype.__class__ = Patient;
Creature = function(g,xv,yv) { if( g === $_ ) return; {
	CellObject.apply(this,[g,xv,yv]);
	this.type = "creature";
}}
Creature.__name__ = ["Creature"];
Creature.__super__ = CellObject;
for(var k in CellObject.prototype ) Creature.prototype[k] = CellObject.prototype[k];
Creature.prototype.ai = function() {
	this.aiDefaultCreature();
}
Creature.prototype.aiAlertAroundMe = function() {
	var _g1 = (this.y - 2), _g = (this.y + 2);
	while(_g1 < _g) {
		var yy = _g1++;
		var _g3 = (this.x - 2), _g2 = (this.x + 2);
		while(_g3 < _g2) {
			var xx = _g3++;
			var c = this.map.get(xx,yy);
			if(c == null || c.object == null || c.object.type != "human" || c.object == this) continue;
			var o = c.object;
			o.alert(this.x,this.y);
			this.game.panic++;
		}
	}
}
Creature.prototype.aiCallForHelp = function(ax,ay) {
	if(this.map.getObjectCount("human","cop") >= 10) return;
	this.game.queue("spawn.cop",{ x : ax, y : ay},2);
}
Creature.prototype.aiChangeRandomDirection = function() {
	var cnt = 0;
	while(true) {
		var dir = Std["int"](Math.random() * Map.dirx.length);
		var c = this.map.get(this.x + Map.dirx[dir],this.y + Map.diry[dir]);
		cnt++;
		if(cnt > 50) break;
		if(c == null || !c.isWalkable()) continue;
		this.direction = dir;
		break;
	}
}
Creature.prototype.aiDefaultCreature = function() {
	if(Math.random() < 0.2) this.aiChangeRandomDirection();
	var c = this.map.get(this.x + Map.dirx[this.direction],this.y + Map.diry[this.direction]);
	if(c == null || !c.isWalkable()) {
		this.aiChangeRandomDirection();
		return;
	}
	else this.move(this.x + Map.dirx[this.direction],this.y + Map.diry[this.direction]);
}
Creature.prototype.aiFindAdjacentObject = function(t,isOutside) {
	{
		var _g1 = 0, _g = Map.dirx.length;
		while(_g1 < _g) {
			var i = _g1++;
			var c = this.map.get(this.x + Map.dirx[i],this.y + Map.diry[i]);
			if(c == null || c.object == null || c.object.type != t || (c.type == "building" && isOutside)) continue;
			return c;
		}
	}
	return null;
}
Creature.prototype.aiFindRandomMarker = function(radius) {
	{ var $it1 = this.map.markers.iterator();
	while( $it1.hasNext() ) { var m = $it1.next();
	if(m.x >= this.x - radius && m.x <= this.x + radius && m.y >= this.y - radius && m.y <= this.y + radius) return m;
	}}
	return null;
}
Creature.prototype.aiFindRandomObject = function(t,radius) {
	{
		var _g = -radius;
		while(_g < radius) {
			var yy = _g++;
			var _g1 = -radius;
			while(_g1 < radius) {
				var xx = _g1++;
				var c = this.map.get(this.x + xx,this.y + yy);
				if(c == null || c.object == null || c.object.type != t) continue;
				return c;
			}
		}
	}
	return null;
}
Creature.prototype.aiMoveTo = function(xx,yy) {
	var dx = xx - this.x, dy = yy - this.y;
	if(dx < 0) dx = -1;
	else if(dx > 0) dx = 1;
	if(dy < 0) dy = -1;
	else if(dy > 0) dy = 1;
	var dir = 0;
	{
		var _g = 1;
		while(_g < 9) {
			var i = _g++;
			if(dx == Creature.dirNumX[i] && dy == Creature.dirNumY[i]) {
				dir = i;
				break;
			}
		}
	}
	var c = this.map.get(this.x + dx,this.y + dy);
	if(c == null || !c.isWalkable() || c.object != null) {
		var dir2 = Creature.dirSecondary[dir][0];
		c = this.map.get(this.x + Creature.dirNumX[dir2],this.y + Creature.dirNumY[dir2]);
		if(c == null || !c.isWalkable() || c.object != null) {
			var dir3 = Creature.dirSecondary[dir][1];
			c = this.map.get(this.x + Creature.dirNumX[dir3],this.y + Creature.dirNumY[dir3]);
			if(c == null || !c.isWalkable() || c.object != null) return;
			else dir = dir3;
		}
		else dir = dir2;
	}
	this.move(c.x,c.y);
}
Creature.prototype.direction = null;
Creature.prototype.__class__ = Creature;
Reanimated = function(g,xv,yv) { if( g === $_ ) return; {
	Creature.apply(this,[g,xv,yv]);
	this.type = "reanimated";
	this.level = 1;
	this.life = 3;
}}
Reanimated.__name__ = ["Reanimated"];
Reanimated.__super__ = Creature;
for(var k in Creature.prototype ) Reanimated.prototype[k] = Creature.prototype[k];
Reanimated.prototype.ai = function() {
	var c = this.aiFindAdjacentObject("human",false);
	if(c != null) {
		this.map.addMessage(this.x,this.y,("The reanimated attacks " + c.object.name) + ".");
		c.object.hit(this);
		return;
	}
	if(this.level > 1) {
		var c1 = this.aiFindAdjacentObject("body",true);
		if(c1 != null) {
			this.map.addMessage(this.x,this.y,"The reanimated hungrily devours the body.");
			this.aiAlertAroundMe();
			c1.object.die();
			this.life = 2 + this.level;
			return;
		}
	}
	var m = this.aiFindRandomMarker(2);
	if(m != null) {
		this.aiMoveTo(m.x,m.y);
		return;
	}
	this.aiDefaultCreature();
}
Reanimated.prototype.getNote = function() {
	var p1 = ((this.subtype == null?this.type:this.subtype));
	var p2 = ((this.state != "idle"?(" (" + this.state) + ")":""));
	var p3 = "";
	{
		var _g1 = 0, _g = this.life;
		while(_g1 < _g) {
			var i = _g1++;
			p3 += "*";
		}
	}
	return (((((p1 + " [") + this.level) + "]") + p2) + " ") + p3;
}
Reanimated.prototype.hit = function(who) {
	this.life--;
	if(this.life > 0) return;
	this.die();
	this.game.stats.reanimatedDestroyed++;
	this.map.addMessage(this.x,this.y,"Reanimated has been put down.");
}
Reanimated.prototype.level = null;
Reanimated.prototype.onMove = function() {
	var m = this.map.getMarker(this.x,this.y);
	if(m != null) this.map.markers.remove(m);
}
Reanimated.prototype.__class__ = Reanimated;
Reflect = function() { }
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	if(o.hasOwnProperty != null) return o.hasOwnProperty(field);
	var arr = Reflect.fields(o);
	{ var $it2 = arr.iterator();
	while( $it2.hasNext() ) { var t = $it2.next();
	if(t == field) return true;
	}}
	return false;
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	}
	catch( $e3 ) {
		{
			var e = $e3;
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
		catch( $e4 ) {
			{
				var e = $e4;
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
Map = function(g) { if( g === $_ ) return; {
	this.game = g;
	this.ui = this.game.ui;
	this.width = UI.mapWidth;
	this.height = UI.mapHeight;
}}
Map.__name__ = ["Map"];
Map.prototype.addMessage = function(x,y,text,params) {
	if(params == null) params = { }
	if(params.isImportant == null) params.isImportant = false;
	var m = { x : x, y : y, text : text, isImportant : params.isImportant}
	this.messages.set((("" + x) + ",") + y,m);
}
Map.prototype.buildings = null;
Map.prototype.cells = null;
Map.prototype.cemetery = null;
Map.prototype.clearMessages = function() {
	{ var $it5 = this.messages.keys();
	while( $it5.hasNext() ) { var m = $it5.next();
	this.messages.remove(m);
	}}
}
Map.prototype.copsTotal = null;
Map.prototype.findEmpty = function(x,y,w,h) {
	var cell = null;
	var cnt = 0;
	while(true) {
		cnt++;
		if(cnt > 200) return null;
		var nx = x + Std["int"](Math.random() * w);
		var ny = y + Std["int"](Math.random() * h);
		if(nx >= this.width || ny >= this.height || nx < 0 || ny < 0) continue;
		cell = this.get(nx,ny);
		if(cell.object != null || !cell.isWalkable()) continue;
		return cell;
	}
	return null;
}
Map.prototype.game = null;
Map.prototype.generate = function() {
	this.cells = new Hash();
	this.objects = new List();
	this.markers = new List();
	this.messages = new Hash();
	this.buildings = new Array();
	this.copsTotal = Std["int"]((this.width * this.height) / 22 + Math.random() * 10);
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
				if(Math.random() < 0.05) cell.type = "tree";
				cell.isVisible = true;
				if(cell.x == 1 + Std["int"](this.width / 3) && Math.random() < 0.3) cell.type = "grass";
				this.cells.set((x + ",") + y,cell);
			}
		}
	}
	this.generateBuildings();
	this.generateCreatures();
}
Map.prototype.generateBuildings = function() {
	var bldg = new Array();
	{
		var _g1 = 0, _g = this.height;
		while(_g1 < _g) {
			var y = _g1++;
			var _g3 = 0, _g2 = this.width;
			while(_g3 < _g2) {
				var x = _g3++;
				var cell = this.get(x,y);
				if(Math.random() > 0.2) continue;
				var sx = 2 + Std["int"](Math.random() * 3);
				var sy = 2 + Std["int"](Math.random() * 3);
				if(x + sx > this.width) sx = this.width - x;
				if(y + sy > this.height) sy = this.height - y;
				if(x + sx > this.width || y + sy > this.height) continue;
				if(sx < 2 || sy < 2) continue;
				var ok = true;
				{
					var _g5 = -1, _g4 = sy + 2;
					while(_g5 < _g4) {
						var dy = _g5++;
						var _g7 = -1, _g6 = sx + 2;
						while(_g7 < _g6) {
							var dx = _g7++;
							{
								var _g8 = 0;
								while(_g8 < bldg.length) {
									var b = bldg[_g8];
									++_g8;
									if(x + dx > b.x && x + dx < b.x + b.w && y + dy > b.y && y + dy < b.y + b.h) {
										ok = false;
										break;
									}
								}
							}
							if(!ok) break;
						}
					}
				}
				if(!ok) continue;
				var rect = { x : x, y : y, w : sx, h : sy, t : null}
				bldg.push(rect);
			}
		}
	}
	var types = ["lab","cemetery","police"];
	{
		var _g = 0;
		while(_g < types.length) {
			var t = types[_g];
			++_g;
			var n = 0;
			var loop = 0;
			while(loop < 100) {
				n = Std["int"](Math.random() * bldg.length);
				if(bldg[n].w < 3 || bldg[n].h < 3) continue;
				if(t == "lab" && bldg[n].x >= 2 && bldg[n].y >= 2 && bldg[n].x + bldg[n].w <= this.width - 2 && bldg[n].y + bldg[n].h <= this.height - 2) continue;
				if(bldg[n].t == null) break;
			}
			var b = bldg[n];
			b.t = t;
			if(t == "lab") {
				b.w = 2;
				b.h = 2;
			}
			else if(t == "police") {
				b.w = 3;
				b.h = 3;
			}
			else if(t == "cemetery") {
				b.w = 3;
				b.h = 2;
			}
		}
	}
	var cnt = 0;
	{
		var _g = 0;
		while(_g < bldg.length) {
			var b = bldg[_g];
			++_g;
			{
				var _g2 = 0, _g1 = b.h;
				while(_g2 < _g1) {
					var dy = _g2++;
					var _g4 = 0, _g3 = b.w;
					while(_g4 < _g3) {
						var dx = _g4++;
						var cell = this.get(b.x + dx,b.y + dy);
						if(cell == null) continue;
						cell.type = "building";
						cell.subtype = b.t;
						cell.building = b;
					}
				}
			}
			if(b.t == "lab") this.game.player.lab = b;
			else if(b.t == "cemetery") this.cemetery = b;
			else if(b.t == "police") this.police = b;
			cnt++;
		}
	}
	this.buildings = bldg;
}
Map.prototype.generateCreatures = function() {
	var cnt = Std["int"]((this.width * this.height) / 18);
	{
		var _g = 0;
		while(_g < cnt) {
			var i = _g++;
			var x = 0, y = 0;
			while(true) {
				x = Std["int"](Math.random() * this.width);
				y = Std["int"](Math.random() * this.height);
				var cell = this.get(x,y);
				if(cell.type == "building" || cell.object != null) continue;
				if(x >= this.game.player.lab.x - 2 && x <= (this.game.player.lab.x + this.game.player.lab.w) + 2 && y >= this.game.player.lab.y - 2 && y <= (this.game.player.lab.y + this.game.player.lab.h) + 2) continue;
				break;
			}
			var c = new Human(this.game,x,y);
			c.aiChangeRandomDirection();
		}
	}
}
Map.prototype.get = function(x,y) {
	return this.cells.get((x + ",") + y);
}
Map.prototype.getMarker = function(x,y) {
	{ var $it6 = this.markers.iterator();
	while( $it6.hasNext() ) { var m = $it6.next();
	if(m.x == x && m.y == y) return m;
	}}
	return null;
}
Map.prototype.getMessage = function(x,y) {
	return this.messages.get((("" + x) + ",") + y);
}
Map.prototype.getObjectCount = function(type,subtype) {
	var cnt = 0;
	{ var $it7 = this.objects.iterator();
	while( $it7.hasNext() ) { var o = $it7.next();
	if(o.type == type && (subtype == null || o.subtype == subtype)) cnt++;
	}}
	return cnt;
}
Map.prototype.getQuestObject = function(q,tag) {
	{ var $it8 = this.objects.iterator();
	while( $it8.hasNext() ) { var o = $it8.next();
	if(o.quest == q && o.questTag == tag) return o;
	}}
	return null;
}
Map.prototype.getReanimated = function() {
	var cnt = 0;
	{ var $it9 = this.objects.iterator();
	while( $it9.hasNext() ) { var o = $it9.next();
	if(o.type == "reanimated") cnt++;
	}}
	return cnt;
}
Map.prototype.hasAlerted = function() {
	{ var $it10 = this.objects.iterator();
	while( $it10.hasNext() ) { var o = $it10.next();
	if(o.type == "human" && o.state == "alerted") return true;
	}}
	return false;
}
Map.prototype.hasMarker = function(x,y) {
	{ var $it11 = this.markers.iterator();
	while( $it11.hasNext() ) { var m = $it11.next();
	if(m.x == x && m.y == y) return true;
	}}
	return false;
}
Map.prototype.hasReanimated = function() {
	{ var $it12 = this.objects.iterator();
	while( $it12.hasNext() ) { var o = $it12.next();
	if(o.type == "reanimated") return true;
	}}
	return false;
}
Map.prototype.height = null;
Map.prototype.markers = null;
Map.prototype.messages = null;
Map.prototype.objects = null;
Map.prototype.paint = function(rect) {
	var el = js.Lib.document.getElementById("map");
	var map = el.getContext("2d");
	map.font = (UI.cellSize - 3) + "px Verdana";
	map.fillStyle = "black";
	map.textBaseline = "top";
	if(rect == null) rect = { x : 0, y : 0, w : 1000, h : 740}
	if(rect.x < 0) rect.x = 0;
	if(rect.y < 0) rect.y = 0;
	map.fillRect(rect.x,rect.y,rect.w,rect.h);
	if(this.cells == null) return;
	{
		var _g1 = 0, _g = this.height;
		while(_g1 < _g) {
			var y = _g1++;
			var _g3 = 0, _g2 = this.width;
			while(_g3 < _g2) {
				var x = _g3++;
				var cell = this.get(x,y);
				cell.paint(map,false,rect);
			}
		}
	}
	this.paintPolice(map);
}
Map.prototype.paintPolice = function(map) {
	map.font = Std["int"](UI.cellSize / 2) + "px Verdana";
	var text = ((this.copsTotal - this.game.stats.copsDead) + " / ") + this.copsTotal;
	var metrics = map.measureText(text);
	var xx = UI.cellSize * this.police.x + (UI.cellSize * this.police.w - metrics.width) / 2;
	var yy = UI.cellSize * this.police.y + 50;
	map.fillStyle = "rgba(0, 0, 0, 0.7)";
	var m2 = map.measureText("?");
	map.fillRect(xx - 4,yy - 8,metrics.width + 8,m2.width * 2 + 8);
	map.fillStyle = "white";
	map.fillText(text,xx,yy);
}
Map.prototype.police = null;
Map.prototype.reanimated = null;
Map.prototype.removeMessage = function(x,y) {
	this.messages.remove((("" + x) + ",") + y);
}
Map.prototype.spawnOnCemetery = function() {
	var cnt = 2;
	{
		var _g = 0;
		while(_g < cnt) {
			var i = _g++;
			if(Math.random() > 0.2) continue;
			var x = this.cemetery.x + Std["int"](Math.random() * this.cemetery.w);
			var y = this.cemetery.y + Std["int"](Math.random() * this.cemetery.h);
			var o = new Body(this.game,x,y);
			o.quality = 1;
			o.freshness = 2;
			if(Math.random() < 0.2) o.quality++;
			if(Math.random() < 0.2) o.freshness++;
		}
	}
}
Map.prototype.spawnPatients = function() {
	var cnt = Std["int"]((this.width * this.height) / 120);
	{
		var _g = 0;
		while(_g < cnt) {
			var i = _g++;
			if(Math.random() < 0.8) continue;
			var x = 0, y = 0;
			while(true) {
				x = Std["int"](Math.random() * this.width);
				y = Std["int"](Math.random() * this.height);
				var cell = this.get(x,y);
				if(cell.type != "building" || cell.object != null || cell.subtype != null) continue;
				break;
			}
			var o = new Patient(this.game,x,y);
		}
	}
}
Map.prototype.ui = null;
Map.prototype.width = null;
Map.prototype.__class__ = Map;
if(typeof haxe=='undefined') haxe = {}
haxe.Log = function() { }
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe.Log.clear = function() {
	js.Boot.__clear_trace();
}
haxe.Log.prototype.__class__ = haxe.Log;
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
quests.LabEventGeneric = function(g) { if( g === $_ ) return; {
	quests.Quest.apply(this,[g]);
	this.id = "labEvent";
}}
quests.LabEventGeneric.__name__ = ["quests","LabEventGeneric"];
quests.LabEventGeneric.__super__ = quests.Quest;
for(var k in quests.Quest.prototype ) quests.LabEventGeneric.prototype[k] = quests.Quest.prototype[k];
quests.LabEventGeneric.check = function(game) {
	if(game.player.theory < 2) return false;
	var c = game.map.get(game.player.lab.x,game.player.lab.y);
	if(c.object != null) return false;
	return true;
}
quests.LabEventGeneric.prototype.activate = function(o) {
	if(o.questTag != "_markerStart") return;
	var rnd = Math.random() * 100;
	var rnd2 = Math.random() * 100;
	var cnt = 7;
	var avg = 100 / cnt;
	var chance = 15;
	if(rnd < avg) {
		this.game.ui.alert("It seems some of your equipment is faulty... " + ((rnd2 < chance?"and it's broken in the middle of an experiment delaying your research! [Theory -1]":"but you manage to stop the experiment just in time.")));
		if(rnd2 < chance) this.game.player.theory -= 1;
	}
	else if(rnd < avg * 2) {
		this.game.ui.alert("Ordered earlier equipment is finally delivered to your laboratory... " + ((rnd2 < chance?"and it gives a huge bonus to your research! [Theory +1]":"but it falls short of your expectations.")));
		if(rnd2 < chance) this.game.player.theory += 1;
	}
	else if(rnd < avg * 3) {
		this.game.ui.alert("Your assistant mixes up dangerously explosive chemicals used in research... " + ((rnd2 < chance?"and it produces a loud explosion alerting the neighbours! [Suspicion +1]":"but fortunately nobody is around at this time.")));
		if(rnd2 < chance) this.game.player.suspicion += 1;
	}
	else if(rnd < avg * 4) {
		this.game.ui.alert("Ordered by mail experimental chemicals finally make it to your laboratory... " + ((rnd2 < chance?"and they give a huge bonus to your research! [Theory +1]":"but they fall short of your expectations.")));
		if(rnd2 < chance) this.game.player.theory += 1;
	}
	else if(rnd < avg * 5) {
		this.game.ui.alert("Chatting with your assistant you find yourself in the mood for a lecture... " + ((rnd2 < chance?"and after an hour of discussing your theory you feel new ideas forming in your brain! [Theory +1]":"but even after repeating yourself over and over he fails to grasp your theory.")));
		if(rnd2 < chance) this.game.player.theory += 1;
	}
	else if(rnd < avg * 6) {
		this.game.ui.alert("Reading the freshly received by mail medicine journal... " + ((rnd2 < chance?"you feel new ideas forming in your brain! [Theory +1]":"you find nothing of interest.")));
		if(rnd2 < chance) this.game.player.theory += 1;
	}
	else if(rnd < avg * 6) {
		this.game.ui.alert("Browsing through the freshly received mail... " + ((rnd2 < chance?"you find a strange letter from a person you don't know discussing your research with a degree of knowledge.":"you find nothing of interest.")));
		if(rnd2 < chance) this.game.questVariables.set("mysteriousLetterReceived",1);
	}
	o.die();
	this.finish();
}
quests.LabEventGeneric.prototype.start = function() {
	this.spawnQuestMarker(this.game.player.lab.x,this.game.player.lab.y,"laboratory event","_markerStart","There is something happening in the laboratory...");
}
quests.LabEventGeneric.prototype.tick = function() {
	if(this.turnsPassed > 1) this.finish();
}
quests.LabEventGeneric.prototype.__class__ = quests.LabEventGeneric;
UI = function(g) { if( g === $_ ) return; {
	this.game = g;
	js.Lib.document.onkeydown = $closure(this,"onKey");
	js.Lib.document.getElementById("version").innerHTML = Game.version;
	js.Lib.document.getElementById("map").onclick = $closure(this,"onMapClick");
	js.Lib.document.getElementById("map").onmousemove = $closure(this,"onMapMove");
	js.Lib.document.getElementById("restart").onclick = $closure(this,"onRestart");
	js.Lib.document.getElementById("endTurn").onclick = $closure(this,"onEndTurn");
	this.msgLocked = false;
	var map = js.Lib.document.getElementById("map");
	if(!(map).getContext) js.Lib.window.alert("No canvas available. Please use a canvas-compatible browser like Mozilla Firefox 3.5+ or Google Chrome.");
	this.alertWindow = js.Lib.document.createElement("alertWindow");
	this.alertWindow.style.visibility = "hidden";
	this.alertWindow.style.position = "absolute";
	this.alertWindow.style.zIndex = 20;
	this.alertWindow.style.width = 600;
	this.alertWindow.style.height = 250;
	this.alertWindow.style.left = 200;
	this.alertWindow.style.top = 250;
	this.alertWindow.style.background = "#222";
	this.alertWindow.style.border = "4px double #ffffff";
	js.Lib.document.body.appendChild(this.alertWindow);
	this.alertText = js.Lib.document.createElement("alertText");
	this.alertText.style.overflow = "auto";
	this.alertText.style.position = "absolute";
	this.alertText.style.left = 10;
	this.alertText.style.top = 10;
	this.alertText.style.width = 580;
	this.alertText.style.height = 200;
	this.alertText.style.background = "#111";
	this.alertText.style.border = "1px solid #777";
	this.alertWindow.appendChild(this.alertText);
	var alertClose = this.createCloseButton(this.alertWindow,260,215,"alertClose");
	alertClose.onclick = $closure(this,"onAlertCloseClick");
	this.loadImages();
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
UI.prototype.finish = function(isVictory,reason) {
	var el = js.Lib.document.getElementById("map");
	var map = el.getContext("2d");
	map.font = (UI.cellSize - 4) + "px Verdana";
	map.fillStyle = "rgba(0, 0, 0, 0.7)";
	map.fillRect(0,0,el.width,el.height);
	map.fillStyle = "white";
	var text = "";
	if(isVictory) {
		var result = "";
		if(reason == "police") result = "removed the official obstacles";
		else if(reason == "theory") result = "perfected your knowledge";
		text = ((("You have " + result) + " in ") + this.game.turns) + " turns!";
	}
	else text = "You have been found out...";
	var metrics = map.measureText(text);
	var x = (el.width - metrics.width) / 2;
	var y = (el.height - UI.cellSize) / 2;
	map.fillText(text,x,y);
	var font = Std["int"](0.4 * UI.cellSize);
	map.font = font + "px Verdana";
	map.fillStyle = "yellow";
	map.fillText(this.game.stats.humansDead + " citizens died during the course of these horrible events.",10,y + 70);
	map.fillText(this.game.stats.copsDead + " police officers died fulfilling their duty.",10,((y + 70) + font) + 10);
	map.fillText(this.game.stats.bodiesTested + " different solutions were tested on the specimens.",10,(y + 70) + (font + 10) * 2);
	map.fillText(this.game.stats.bodiesReanimated + " specimens were successfully reanimated.",10,(y + 70) + (font + 10) * 3);
	map.fillText(this.game.stats.reanimatedDestroyed + " reanimated bodies were put down by the police.",10,(y + 70) + (font + 10) * 4);
}
UI.prototype.game = null;
UI.prototype.getVar = function(name) {
	return getCookie(name);
}
UI.prototype.images = null;
UI.prototype.justClicked = null;
UI.prototype.loadImages = function() {
	this.images = new Hash();
	var imgnames = ["tile_building","tile_cemetery","tile_grass","tile_lab","tile_police","tile_tree","undefined","object_body1","object_body3","object_human1","object_human3","object_human_alerted2","object_quest","object_body2","object_cop","object_human2","object_human_alerted1","object_human_alerted3","object_human_quest","object_reanimated","building2x2","building2x3","building2x4","building3x2","building3x3","building3x4","building4x2","building4x3","building4x4","building_cemetery","building_lab","building_police"];
	{
		var _g = 0;
		while(_g < imgnames.length) {
			var nm = imgnames[_g];
			++_g;
			var img = new Image();
			img.onload = $closure(this,"onLoadImage");
			img.src = ("images/" + nm) + ".png";
			this.images.set(nm,img);
		}
	}
}
UI.prototype.msg = function(s,isLocked) {
	if(isLocked == null) isLocked = true;
	if(this.msgLocked && !isLocked) return;
	if(isLocked) this.msgLocked = true;
	js.Lib.document.getElementById("msg").innerHTML = ("<center>" + s) + "</center>";
}
UI.prototype.msgLocked = null;
UI.prototype.onAlertCloseClick = function(event) {
	this.alertWindow.style.visibility = "hidden";
}
UI.prototype.onEndTurn = function(event) {
	this.msgLocked = false;
	this.msg("",false);
	this.game.endTurn();
}
UI.prototype.onKey = function(ev) {
	var key = ev.keyCode;
	if(ev.keyCode == 69 || ev.keyCode == 32) this.onEndTurn(null);
	if(ev.keyCode == 32) {
		if(ev.stopPropagation) ev.stopPropagation();
		ev.cancelBubble = true;
		ev.returnValue = false;
		ev.preventDefault();
	}
}
UI.prototype.onLoadImage = function() {
	this.game.map.paint();
}
UI.prototype.onMapClick = function(event) {
	if(this.game.isFinished) return;
	if(this.msgLocked) {
		this.msgLocked = false;
		this.msg("",false);
	}
	var map = js.Lib.document.getElementById("map");
	var x = (event.clientX - map.offsetLeft) - 14;
	var y = (event.clientY - map.offsetTop) - 14;
	var cellX = Std["int"]((x - 5) / UI.cellSize);
	var cellY = Std["int"]((y - 7) / UI.cellSize);
	var cell = this.game.map.get(cellX,cellY);
	if(cell != null) {
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
	var x = (event.clientX - map.offsetLeft) - 14;
	var y = (event.clientY - map.offsetTop) - 14;
	this.cursorX = Std["int"]((x - 5) / UI.cellSize);
	this.cursorY = Std["int"]((y - 7) / UI.cellSize);
	var cell = this.game.map.get(this.cursorX,this.cursorY);
	if(cell != null && cell.isVisible) {
		this.tip(cell.getNote());
		var m = this.game.map.getMessage(cell.x,cell.y);
		if(m != null) this.msg(m.text);
		else if(cell.object != null) this.msg(cell.object.getMessage());
		else if(this.game.map.hasMarker(cell.x,cell.y)) this.msg("This marker will attract reanimated if they are close enough. ");
		else if(cell.building == this.game.map.police) this.msg(("There are " + (this.game.map.copsTotal - this.game.stats.copsDead)) + " officers left to protect the town.");
		else this.msg("");
	}
	else {
		this.tip("");
		this.msg("");
	}
	this.prevX = x;
	this.prevY = y;
}
UI.prototype.onRestart = function(event) {
	this.msgLocked = false;
	this.msg("",false);
	this.game.restart();
}
UI.prototype.paintStatus = function() {
	var s = (((((((((((("<table width=100%><tr>" + "<td halign=left>Theory: ") + this.game.player.theory) + "<td halign=left>Suspicion: ") + this.game.player.suspicion) + "<td halign=left>Max markers: ") + (1 + Std["int"](this.game.player.theory / 3))) + "<td halign=left>TC: ") + this.game.player.getTheoryChance(1)) + "% / ") + this.game.player.getTheoryChance(2)) + "% / ") + this.game.player.getTheoryChance(3)) + "%";
	s += (("<td halign=right><p style='text-align:right; margin-right:5'>" + "Turns: ") + this.game.turns) + "</table>";
	js.Lib.document.getElementById("status").innerHTML = s;
}
UI.prototype.prevX = null;
UI.prototype.prevY = null;
UI.prototype.setVar = function(name,val) {
	return setCookie(name,val,new Date(2015, 0, 0, 0, 0, 0, 0));
}
UI.prototype.tip = function(s) {
	js.Lib.document.getElementById("tip").innerHTML = s;
}
UI.prototype.track = function(action,label,value) {
	action = (("drwest " + action) + " ") + Game.version;
	if(label == null) label = "";
	if(value == null) value = 0;
	pageTracker._trackEvent("Dr West",action,label,value);
}
UI.prototype.__class__ = UI;
Cell = function(g) { if( g === $_ ) return; {
	this.game = g;
	this.map = this.game.map;
	this.ui = this.game.ui;
}}
Cell.__name__ = ["Cell"];
Cell.prototype.activate = function() {
	if(this.map.hasMarker(this.x,this.y)) {
		var m = this.map.getMarker(this.x,this.y);
		this.map.markers.remove(m);
	}
	else if(this.object != null) {
		var endTurn = this.object.activate(this.game.player);
		if(endTurn) this.game.endTurn();
		else this.game.map.paint();
	}
	else if(this.isWalkable() && this.map.markers.length < 1 + Std["int"](this.game.player.theory / 3) && !this.map.hasMarker(this.x,this.y)) {
		var o = new Marker(this.game,this.x,this.y);
		this.map.markers.add(o);
	}
	else return;
	this.game.map.paint();
}
Cell.prototype.building = null;
Cell.prototype.distance = function(c) {
	var dx = this.x - c.x;
	var dy = this.y - c.y;
	return Std["int"](Math.sqrt(dx * dx + dy * dy));
}
Cell.prototype.game = null;
Cell.prototype.getNote = function() {
	var s = "";
	if(this.object != null) s = this.object.getNote();
	else if(this.subtype != null) s = this.subtype;
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
			if(c == null || !c.isWalkable() || !c.isVisible) continue;
			return true;
		}
	}
	return false;
}
Cell.prototype.isVisible = null;
Cell.prototype.isWalkable = function() {
	if(this.object != null) return false;
	return Reflect.field(Cell.walkable,this.type);
}
Cell.prototype.map = null;
Cell.prototype.object = null;
Cell.prototype.paint = function(screen,isSelected,rect) {
	var x1 = 3 + this.x * UI.cellSize;
	var x2 = (3 + this.x * UI.cellSize) + UI.cellSize;
	var y1 = 2 + this.y * UI.cellSize;
	var y2 = (2 + this.y * UI.cellSize) + UI.cellSize;
	if(!(x1 >= rect.x && x1 < rect.x + rect.w && y1 >= rect.y && y1 < rect.y + rect.h) && !(x2 > rect.x && x2 <= rect.x + rect.w && y2 > rect.y && y2 <= rect.y + rect.h)) return;
	var xx = 5 + this.x * UI.cellSize;
	var yy = 7 + this.y * UI.cellSize;
	var skipBG = false;
	if(this.type == "building" && (this.x != this.building.x || this.y != this.building.y)) skipBG = true;
	var sym = "tile_" + this.type;
	if(this.subtype != null) sym = "tile_" + this.subtype;
	var w = UI.cellSize, h = UI.cellSize;
	if(this.type == "building") {
		w = this.building.w * UI.cellSize;
		h = this.building.h * UI.cellSize;
		if(this.subtype != null) sym = "building_" + this.subtype;
		else sym = (("building" + this.building.w) + "x") + this.building.h;
	}
	var img = this.ui.images.get(sym);
	if(img == null) {
		haxe.Log.trace(sym,{ fileName : "Cell.hx", lineNumber : 83, className : "Cell", methodName : "paint"});
		img = this.ui.images.get("undefined");
	}
	if(!skipBG) screen.drawImage(img,xx,yy,w,h);
	if(this.object != null) {
		sym = "object_" + this.object.getImage();
		img = this.ui.images.get(sym);
		screen.drawImage(img,xx,yy,UI.cellSize,UI.cellSize);
	}
	this.paintMessage(screen,xx,yy);
	if(this.map.hasMarker(this.x,this.y)) this.paintMarker(screen,xx,yy);
}
Cell.prototype.paintMarker = function(screen,xx,yy) {
	var oldFont = screen.font;
	screen.fillStyle = "rgba(0, 0, 0, 0.7)";
	screen.font = Std["int"](UI.cellSize / 1.5) + "px Verdana";
	var metrics = screen.measureText("!");
	screen.fillRect(xx + 6,yy + 6,metrics.width + 4,metrics.width * 2);
	var m = this.map.markers.first();
	screen.fillStyle = "red";
	var sym = "!";
	screen.fillStyle = "#ff0000";
	screen.fillText(sym,xx + 8,yy + 8);
	screen.font = oldFont;
}
Cell.prototype.paintMessage = function(screen,xx,yy) {
	var msg = this.map.getMessage(this.x,this.y);
	if(msg == null) return;
	var oldFont = screen.font;
	screen.fillStyle = "rgba(0, 0, 0, 0.7)";
	screen.font = Std["int"](UI.cellSize / 2) + "px Verdana";
	var metrics = screen.measureText("?");
	screen.fillRect(xx + 8,yy + 8,metrics.width + 4,metrics.width * 2);
	screen.fillStyle = ((msg.isImportant?"#ffff00":"#aaaa00"));
	var sym = ((msg.isImportant?"!":"?"));
	screen.fillText(sym,xx + 10,yy + 10);
	screen.font = oldFont;
}
Cell.prototype.paintSelected = function(screen) {
	if(this.game.isFinished) return;
	screen.fillStyle = "#333333";
	screen.fillRect(3 + this.x * UI.cellSize,2 + this.y * UI.cellSize,UI.cellSize,UI.cellSize);
}
Cell.prototype.repaint = function() {
	this.game.map.paint(UI.getRect(this.x,this.y,0));
}
Cell.prototype.subtype = null;
Cell.prototype.type = null;
Cell.prototype.ui = null;
Cell.prototype.x = null;
Cell.prototype.y = null;
Cell.prototype.__class__ = Cell;
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
Human = function(g,xv,yv) { if( g === $_ ) return; {
	Creature.apply(this,[g,xv,yv]);
	this.type = "human";
	this.name = "human";
	this.subtype = "human";
	this.quality = 1;
	if(Math.random() < 0.2) this.quality++;
	if(Math.random() < 0.1) this.quality++;
	this.timerAlerted = 0;
}}
Human.__name__ = ["Human"];
Human.__super__ = Creature;
for(var k in Creature.prototype ) Human.prototype[k] = Creature.prototype[k];
Human.prototype.ai = function() {
	if(this.state == "alerted") this.timerAlerted--;
	if(this.state == "alerted" && this.timerAlerted <= 0) this.state = "idle";
	this.aiDefaultCreature();
}
Human.prototype.alert = function(ax,ay) {
	this.timerAlerted = 5;
	if(this.state == "alerted") return;
	this.state = "alerted";
	this.map.addMessage(this.x,this.y,"Authorities have been notified!");
	this.aiCallForHelp(ax,ay);
	this.aiCallForHelp(ax,ay);
}
Human.prototype.getImage = function() {
	if(this.isQuest) return "human_quest";
	if(this.state == "alerted") return "human_alerted" + this.quality;
	return "human" + this.quality;
}
Human.prototype.getMessage = function() {
	if(this.isQuest) return this.message;
	else if(this.state == "alerted") return "\"Good lord, I'm so scared!\"";
	else return "";
}
Human.prototype.getNote = function() {
	var p3 = "";
	{
		var _g1 = 0, _g = this.life;
		while(_g1 < _g) {
			var i = _g1++;
			p3 += "*";
		}
	}
	return (((this.name + " (BQ ") + this.quality) + ") ") + p3;
}
Human.prototype.hit = function(who) {
	if(who.type != "reanimated") return;
	this.life--;
	this.isHit = true;
	if(this.life > 0) this.alert(who.x,who.y);
	this.aiAlertAroundMe();
	if(this.life > 0) return;
	this.die();
	this.game.stats.humansDead++;
	this.game.panic += 10;
	var o = new Body(this.game,this.x,this.y);
	o.quality = this.quality;
	o.skip = true;
}
Human.prototype.isHit = null;
Human.prototype.quality = null;
Human.prototype.timerAlerted = null;
Human.prototype.__class__ = Human;
Body = function(g,xv,yv) { if( g === $_ ) return; {
	CellObject.apply(this,[g,xv,yv]);
	this.type = "body";
	this.freshness = 3;
	this.quality = 1 + Std["int"](Math.random() * 2);
}}
Body.__name__ = ["Body"];
Body.__super__ = CellObject;
for(var k in CellObject.prototype ) Body.prototype[k] = CellObject.prototype[k];
Body.prototype.activate = function(player) {
	if(this.map.get(this.x,this.y).subtype == "lab" || player.theory >= 10) return false;
	var nx = -1, ny = -1;
	{
		var _g1 = player.lab.y, _g = (player.lab.y + player.lab.h);
		while(_g1 < _g) {
			var yy = _g1++;
			{
				var _g3 = player.lab.x, _g2 = (player.lab.x + player.lab.w);
				while(_g3 < _g2) {
					var xx = _g3++;
					if(this.map.get(xx,yy).object == null) {
						nx = xx;
						ny = yy;
						break;
					}
				}
			}
			if(nx != -1) break;
		}
	}
	if(nx == -1) {
		this.map.addMessage(this.x,this.y,"Your laboratory is full!");
		return false;
	}
	this.map.addMessage(this.x,this.y,"You bring the specimen to your laboratory.");
	this.game.panic += 10;
	this.map.removeMessage(nx,ny);
	this.move(nx,ny);
	this.map.paint();
	this.ui.paintStatus();
	return false;
}
Body.prototype.ai = function() {
	if(this.map.get(this.x,this.y).subtype == "lab") {
		this.testSolution(this.game.player);
		return;
	}
	this.freshness--;
	if(this.freshness == 0) this.die();
}
Body.prototype.freshness = null;
Body.prototype.getImage = function() {
	return "body" + this.quality;
}
Body.prototype.getNote = function() {
	return ((("body (F " + this.freshness) + ",Q ") + this.quality) + ")";
}
Body.prototype.quality = null;
Body.prototype.testSolution = function(player) {
	this.die();
	this.game.stats.bodiesTested++;
	if(100 * Math.random() < 45 - 15 * this.quality) {
		this.map.addMessage(this.x,this.y,"You test a new solution on the body... Nothing happens.");
		return true;
	}
	var mod = 0;
	if(100 * Math.random() < player.getTheoryChance(this.quality)) {
		player.theory++;
		mod = 1;
		if(this.quality == 3 && player.theory < 10) {
			player.theory++;
			mod = 2;
		}
		if(player.theory > 10) player.theory = 10;
	}
	var spawnOk = false;
	if(100 * Math.random() < 70) {
		spawnOk = true;
		var cell = this.map.findEmpty(player.lab.x - 3,player.lab.y - 3,player.lab.w + 6,player.lab.h + 6);
		if(cell == null) {
			haxe.Log.trace("no empty spots near lab",{ fileName : "Body.hx", lineNumber : 60, className : "Body", methodName : "testSolution"});
			return true;
		}
		var o = new Reanimated(this.game,cell.x,cell.y);
		o.life = 3 + Std["int"](player.theory / 3);
		o.level = 1 + Std["int"](player.theory / 3);
		this.game.stats.bodiesReanimated++;
	}
	this.map.addMessage(this.x,this.y,((spawnOk?"With the new solution the body is reanimated! ":"You have failed to reanimate the body. ")) + ((mod > 0?("[Theory +" + mod) + "]":"")),((mod > 0?{ isImportant : true}:{ })));
	return true;
}
Body.prototype.__class__ = Body;
Cop = function(g,xv,yv) { if( g === $_ ) return; {
	Human.apply(this,[g,xv,yv]);
	this.subtype = "cop";
	this.name = "officer";
	this.life = 2;
	this.skip = true;
	this.state = "alerted";
	this.timerAlerted = 3;
}}
Cop.__name__ = ["Cop"];
Cop.__super__ = Human;
for(var k in Human.prototype ) Cop.prototype[k] = Human.prototype[k];
Cop.prototype.ai = function() {
	if(this.state == "alerted") this.timerAlerted--;
	if(this.state == "alerted" && this.timerAlerted <= 0) this.state = "idle";
	if(this.state == "idle" && Math.random() < 0.7) {
		this.die();
		return;
	}
	var c = this.aiFindAdjacentObject("reanimated",false);
	if(c != null) {
		this.map.addMessage(this.x,this.y,"Officer attacks the reanimated.");
		c.object.hit(this);
		return;
	}
	var c1 = this.aiFindRandomObject("reanimated",5);
	if(c1 != null) {
		this.aiMoveTo(c1.x,c1.y);
		return;
	}
	this.aiDefaultCreature();
}
Cop.prototype.alert = function(ax,ay) {
	this.timerAlerted = 3;
	if(this.state == "alerted") return;
	this.state = "alerted";
}
Cop.prototype.getImage = function() {
	return "cop";
}
Cop.prototype.getMessage = function() {
	if(this.state == "alerted") {
		if(this.aiFindAdjacentObject("reanimated",false) != null) return "\"You won't get away with this!\"";
		else return "\"Where's that damn perpetrator?\"";
	}
	else return "\"Dum-de-dum, patrolling around.\"";
}
Cop.prototype.getNote = function() {
	var p3 = "";
	{
		var _g1 = 0, _g = this.life;
		while(_g1 < _g) {
			var i = _g1++;
			p3 += "*";
		}
	}
	return (("officer (BQ " + this.quality) + ") ") + p3;
}
Cop.prototype.hit = function(who) {
	if(who.type != "reanimated") return;
	if(Math.random() < 0.6) this.life--;
	this.isHit = true;
	this.aiAlertAroundMe();
	this.aiCallForHelp(this.x,this.y);
	if(this.life > 0) return;
	this.die();
	this.game.stats.copsDead++;
	if(this.game.stats.copsDead > this.game.map.copsTotal) this.game.stats.copsDead = this.game.map.copsTotal;
	this.game.panic += 15;
	var o = new Body(this.game,this.x,this.y);
	o.skip = true;
}
Cop.prototype.__class__ = Cop;
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
QuestMarker = function(g,xv,yv,q) { if( g === $_ ) return; {
	CellObject.apply(this,[g,xv,yv]);
	this.type = "quest";
	this.subtype = "quest";
	this.isQuest = true;
	this.quest = q;
}}
QuestMarker.__name__ = ["QuestMarker"];
QuestMarker.__super__ = CellObject;
for(var k in CellObject.prototype ) QuestMarker.prototype[k] = CellObject.prototype[k];
QuestMarker.prototype.activate = function(p) {
	this.quest.activate(this);
	return false;
}
QuestMarker.prototype.getNote = function() {
	return this.name;
}
QuestMarker.prototype.__class__ = QuestMarker;
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
ValueType = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
Type = function() { }
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	if(o.__enum__ != null) return null;
	return o.__class__;
}
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
}
Type.getSuperClass = function(c) {
	return c.__super__;
}
Type.getClassName = function(c) {
	if(c == null) return null;
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl;
	try {
		cl = eval(name);
	}
	catch( $e13 ) {
		{
			var e = $e13;
			{
				cl = null;
			}
		}
	}
	if(cl == null || cl.__name__ == null) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e;
	try {
		e = eval(name);
	}
	catch( $e14 ) {
		{
			var err = $e14;
			{
				e = null;
			}
		}
	}
	if(e == null || e.__ename__ == null) return null;
	return e;
}
Type.createInstance = function(cl,args) {
	if(args.length <= 3) return new cl(args[0],args[1],args[2]);
	if(args.length > 8) throw "Too many arguments";
	return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
}
Type.createEmptyInstance = function(cl) {
	return new cl($_);
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw ("Constructor " + constr) + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw ("Constructor " + constr) + " does not need parameters";
	return f;
}
Type.createEnumIndex = function(e,index,params) {
	var c = Type.getEnumConstructs(e)[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
}
Type.getInstanceFields = function(c) {
	var a = Reflect.fields(c.prototype);
	a.remove("__class__");
	return a;
}
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	a.remove("__name__");
	a.remove("__interfaces__");
	a.remove("__super__");
	a.remove("prototype");
	return a;
}
Type.getEnumConstructs = function(e) {
	return e.__constructs__;
}
Type["typeof"] = function(v) {
	switch(typeof(v)) {
	case "boolean":{
		return ValueType.TBool;
	}break;
	case "string":{
		return ValueType.TClass(String);
	}break;
	case "number":{
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	}break;
	case "object":{
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	}break;
	case "function":{
		if(v.__name__ != null) return ValueType.TObject;
		return ValueType.TFunction;
	}break;
	case "undefined":{
		return ValueType.TNull;
	}break;
	default:{
		return ValueType.TUnknown;
	}break;
	}
}
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		{
			var _g1 = 2, _g = a.length;
			while(_g1 < _g) {
				var i = _g1++;
				if(!Type.enumEq(a[i],b[i])) return false;
			}
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	}
	catch( $e15 ) {
		{
			var e = $e15;
			{
				return false;
			}
		}
	}
	return true;
}
Type.enumConstructor = function(e) {
	return e[0];
}
Type.enumParameters = function(e) {
	return e.slice(2);
}
Type.enumIndex = function(e) {
	return e[1];
}
Type.prototype.__class__ = Type;
if(typeof js=='undefined') js = {}
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
		catch( $e16 ) {
			{
				var e = $e16;
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
	catch( $e17 ) {
		{
			var e = $e17;
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
quests.AnxiousAssistant = function(g) { if( g === $_ ) return; {
	quests.Quest.apply(this,[g]);
	this.id = "anxiousAssistant";
}}
quests.AnxiousAssistant.__name__ = ["quests","AnxiousAssistant"];
quests.AnxiousAssistant.__super__ = quests.Quest;
for(var k in quests.Quest.prototype ) quests.AnxiousAssistant.prototype[k] = quests.Quest.prototype[k];
quests.AnxiousAssistant.check = function(game) {
	if(game.map.getReanimated() == 0 || game.player.theory < 5) return false;
	var c = game.map.get(game.player.lab.x,game.player.lab.y);
	if(c.object != null) return false;
	return true;
}
quests.AnxiousAssistant.prototype.activate = function(o) {
	if(o.questTag == "_markerStart") {
		this.game.ui.alert("Your assistant seems to have a problem with your research. It's time to dispose of him. Lead any reanimated close to him.");
		o.die();
		var o1 = new Human(this.game,this.game.player.lab.x,this.game.player.lab.y);
		o1.quality = 3;
		o1.name = "assistant";
		o1.message = "He does not yet suspect what awaits him.";
		o1.isQuest = true;
		o1.quest = this;
		o1.questTag = "_assistant";
		o1.ai = function() {
			null;
		}
	}
}
quests.AnxiousAssistant.prototype.start = function() {
	this.spawnQuestMarker(this.game.player.lab.x,this.game.player.lab.y,"anxious assistant","_markerStart","Your assistant is behaving weird lately...");
}
quests.AnxiousAssistant.prototype.tick = function() {
	if(this.turnsPassed > 5) {
		this.game.ui.alert("Your assistant has become mentally unstable and had to be sent to the appropriate institution. [Suspicion +1].");
		this.game.player.suspicion++;
		this.finish();
		return;
	}
	var o = this.map.getQuestObject(this,"_markerStart");
	if(o != null) return;
	var o1 = this.map.getQuestObject(this,"_assistant");
	if(o1 != null) return;
	this.game.ui.alert("You have managed to obtain a very fresh specimen...");
	this.finish();
}
quests.AnxiousAssistant.prototype.__class__ = quests.AnxiousAssistant;
Game = function(p) { if( p === $_ ) return; {
	this.ui = new UI(this);
	this.map = new Map(this);
	this.tasks = new List();
	var hasPlayed = getCookie("hasPlayed");
	if(hasPlayed == null) this.ui.alert(("Welcome, Dr. West.<br><br>" + "If this is your first time playing, please take the time to read the ") + "<a target=_blank href='http://code.google.com/p/drwest/wiki/Manual'>Manual</a> before playing.");
	setCookie("hasPlayed","1",new Date(2015, 0, 0, 0, 0, 0, 0));
	this.restart();
}}
Game.__name__ = ["Game"];
Game.instance = null;
Game.main = function() {
	Game.instance = new Game();
}
Game.prototype.checkFinish = function() {
	if(this.stats.copsDead >= this.map.copsTotal) {
		this.finish(true,"police");
		return;
	}
	else if(this.player.theory >= 10) {
		this.finish(true,"theory");
		return;
	}
	{
		var _g1 = this.player.lab.y - 1, _g = (this.player.lab.y + this.player.lab.h) + 1;
		while(_g1 < _g) {
			var y = _g1++;
			var _g3 = this.player.lab.x - 1, _g2 = (this.player.lab.x + this.player.lab.w) + 1;
			while(_g3 < _g2) {
				var x = _g3++;
				var c = this.map.get(x,y);
				if(c == null || c.object == null || c.object.type != "human" || c.object.subtype != "cop") continue;
				this.player.suspicion++;
			}
		}
	}
	if(this.player.suspicion >= 3) {
		this.player.suspicion = 3;
		this.ui.paintStatus();
		this.finish(false,"suspicion");
	}
}
Game.prototype.endTurn = function() {
	if(this.isFinished) return;
	this.map.clearMessages();
	this.taskHandler();
	this.ui.tip("");
	{ var $it18 = this.quests.iterator();
	while( $it18.hasNext() ) { var q = $it18.next();
	{
		q.turnsPassed++;
		q.tick();
	}
	}}
	{ var $it19 = this.map.objects.iterator();
	while( $it19.hasNext() ) { var o = $it19.next();
	{
		o.turns++;
		if(!o.skip) o.ai();
		else o.skip = false;
	}
	}}
	this.map.paint();
	this.ui.paintStatus();
	this.checkFinish();
	if(this.isFinished) return;
	this.handlePanic();
	this.map.spawnOnCemetery();
	this.spawnQuests();
	this.turns++;
	this.map.paint();
	this.ui.paintStatus();
}
Game.prototype.finish = function(isVictory,reason) {
	this.isFinished = true;
	this.ui.track(((isVictory?"winGame":"loseGame")),reason,this.turns);
	this.ui.finish(isVictory,reason);
}
Game.prototype.handlePanic = function() {
	var cnt = this.map.getObjectCount("human","human");
	var max = Std["int"]((this.map.width * this.map.height) / 18);
	if(cnt < max * 0.35) {
		if(!this.isPanic) this.ui.alert("The town is in panic! The authorities order the police to be on constant patrol.");
		this.isPanic = true;
	}
	if(!this.isPanic) return;
	{
		var _g = 0;
		while(_g < 4) {
			var i = _g++;
			var c = this.map.findEmpty(this.map.police.x - 2,this.map.police.y - 2,this.map.police.w + 4,this.map.police.h + 4);
			this.queue("spawn.cop",{ x : c.x, y : c.y},1);
		}
	}
}
Game.prototype.isFinished = null;
Game.prototype.isPanic = null;
Game.prototype.map = null;
Game.prototype.panic = null;
Game.prototype.player = null;
Game.prototype.questVariables = null;
Game.prototype.quests = null;
Game.prototype.questsCompleted = null;
Game.prototype.queue = function(type,params,turns) {
	var t = { type : type, params : params, turns : turns}
	this.tasks.add(t);
}
Game.prototype.restart = function() {
	this.ui.track("startGame",null,null);
	this.tasks.clear();
	this.stats = { humansDead : 0, copsDead : 0, bodiesTested : 0, bodiesReanimated : 0, reanimatedDestroyed : 0}
	this.isFinished = false;
	this.turns = 0;
	this.panic = 0;
	this.isPanic = false;
	this.player = new Player(this);
	this.quests = new List();
	this.questsCompleted = new List();
	this.questVariables = new Hash();
	this.map.generate();
	this.map.paint();
	this.ui.paintStatus();
}
Game.prototype.spawnQuests = function() {
	var prob = 0.05;
	if(this.quests.length > 0) prob = 0.025;
	var rnd = Math.random();
	if(rnd > prob) return;
	{
		var _g = 0, _g1 = Game.possibleQuests;
		while(_g < _g1.length) {
			var cl = _g1[_g];
			++_g;
			var ok = true;
			{ var $it20 = this.quests.iterator();
			while( $it20.hasNext() ) { var qqq = $it20.next();
			if(Type.getClassName(Type.getClass(qqq)) == Type.getClassName(cl)) {
				ok = false;
				break;
			}
			}}
			if(!ok) continue;
			var ok1 = true;
			if(!cl.isRepeatable) {
				{ var $it21 = this.questsCompleted.iterator();
				while( $it21.hasNext() ) { var qqcl = $it21.next();
				if(Type.getClassName(cl) == Type.getClassName(qqcl)) {
					ok1 = false;
					break;
				}
				}}
				if(!ok1) continue;
			}
			var ok2 = Reflect.field(cl,"check").apply(cl,[this]);
			if(!ok2) continue;
			var q = Type.createInstance(cl,[this]);
			this.quests.add(q);
			q.start();
			this.questsCompleted.add(cl);
			return;
		}
	}
}
Game.prototype.stats = null;
Game.prototype.taskHandler = function() {
	{ var $it22 = this.tasks.iterator();
	while( $it22.hasNext() ) { var t = $it22.next();
	{
		t.turns--;
		if(t.turns > 0) continue;
		var copCount = this.map.getObjectCount("human","cop");
		if(t.type == "spawn.cop" && copCount < 10 && (this.map.copsTotal - this.stats.copsDead) - copCount > 0) {
			var cell = this.map.findEmpty(t.params.x - 1,t.params.y - 1,2,2);
			if(cell != null) {
				var o = new Cop(this,cell.x,cell.y);
				this.ui.msg("Authorities arrive on the scene.");
			}
		}
		this.tasks.remove(t);
	}
	}}
}
Game.prototype.tasks = null;
Game.prototype.turns = null;
Game.prototype.ui = null;
Game.prototype.__class__ = Game;
Player = function(g) { if( g === $_ ) return; {
	this.game = g;
	this.money = 0;
	this.theory = 1;
	this.suspicion = 0;
}}
Player.__name__ = ["Player"];
Player.prototype.game = null;
Player.prototype.getMaxMarkers = function() {
	return 1 + Std["int"](this.theory / 3);
}
Player.prototype.getTheoryChance = function(quality) {
	var c = (10 + 40 * (quality - 1)) - this.theory * 2;
	if(c < 2) c = 2;
	return c;
}
Player.prototype.lab = null;
Player.prototype.money = null;
Player.prototype.suspicion = null;
Player.prototype.theory = null;
Player.prototype.__class__ = Player;
Marker = function(g,xv,yv) { if( g === $_ ) return; {
	CellObject.apply(this,[g,xv,yv,true]);
	this.type = "marker";
	this.life = 0;
}}
Marker.__name__ = ["Marker"];
Marker.__super__ = CellObject;
for(var k in CellObject.prototype ) Marker.prototype[k] = CellObject.prototype[k];
Marker.prototype.activate = function(p) {
	this.die();
	return false;
}
Marker.prototype.__class__ = Marker;
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
	catch( $e23 ) {
		{
			var e = $e23;
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
	{ var $it24 = it;
	while( $it24.hasNext() ) { var i = $it24.next();
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
$Main = function() { }
$Main.__name__ = ["@Main"];
$Main.prototype.__class__ = $Main;
$_ = {}
js.Boot.__res = {}
js.Boot.__init();
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
quests.Quest.isRepeatable = false;
quests.NosyReporter.isRepeatable = false;
Creature.dirNumX = [0,-1,0,1,-1,0,1,-1,0,1];
Creature.dirNumY = [0,1,1,1,0,0,0,-1,-1,-1];
Creature.dirSecondary = [[0,0],[2,4],[1,3],[2,6],[1,7],[0,0],[3,9],[4,8],[7,9],[6,8]];
Map.dirx = [-1,-1,-1,0,0,1,1,1];
Map.diry = [-1,0,1,-1,1,-1,0,1];
quests.LabEventGeneric.isRepeatable = true;
UI.cellSize = 40;
UI.mapWidth = 25;
UI.mapHeight = 16;
UI.repaintRadius = 3;
Cell.walkable = { grass : true, building : false, swamp : true, water : false, tree : false}
Cell.dx = [1,-1,0,0,1,-1,1,-1];
Cell.dy = [0,0,1,-1,1,-1,-1,1];
js.Lib.onerror = null;
quests.AnxiousAssistant.isRepeatable = false;
Game.version = "v3";
Game.possibleQuests = [quests.AnxiousAssistant,quests.NosyReporter,quests.LabEventGeneric];
$Main.init = Game.main();
