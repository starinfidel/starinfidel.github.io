var $hxClasses = $hxClasses || {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	return proto;
}
var Cult = $hxClasses["Cult"] = function(gvar,uivar,id,infoID) {
	this.game = gvar;
	this.ui = uivar;
	this.id = id;
	this.infoID = infoID;
	this.info = Static.cults[infoID];
	this.name = this.info.name;
	this.isAI = false;
	this.highlightedNodes = new List();
	this.options = new Options(this);
	this.isDiscovered = [];
	this.isInfoKnown = [];
	this.paralyzedTurns = 0;
	var _g1 = 0, _g = this.game.difficulty.numCults;
	while(_g1 < _g) {
		var i = _g1++;
		this.isInfoKnown[i] = this.game.difficulty.isInfoKnown;
	}
	var _g1 = 0, _g = this.game.difficulty.numCults;
	while(_g1 < _g) {
		var i = _g1++;
		this.isDiscovered[i] = this.game.difficulty.isDiscovered;
	}
	this.isDiscovered[id] = true;
	this.isInfoKnown[id] = true;
	this.power = [0,0,0,0];
	this.powerMod = [0,0,0,0];
	this.wars = [];
	var _g1 = 0, _g = this.game.difficulty.numCults;
	while(_g1 < _g) {
		var i = _g1++;
		this.wars.push(false);
	}
	this.adeptsUsed = 0;
	this.setAwareness(0);
	this.nodes = new List();
	this.sects = new List();
	this.investigatorTimeout = 0;
	this.difficulty = this.game.difficulty;
	this.logMessages = "";
	this.logPanelMessages = new List();
};
Cult.__name__ = ["Cult"];
Cult.prototype = {
	getFullName: function() {
		return UI.cultName(this.id,this.info);
	}
	,getPriests: function() {
		return this.getNumFollowers(2);
	}
	,getAdepts: function() {
		return this.getNumFollowers(1);
	}
	,getNeophytes: function() {
		return this.getNumFollowers(0);
	}
	,getNumFollowers: function(level) {
		var cnt = 0;
		var $it0 = this.nodes.iterator();
		while( $it0.hasNext() ) {
			var n = $it0.next();
			if(n.level == level) cnt++;
		}
		return cnt;
	}
	,setVirgins: function(v) {
		this.power[3] = v;
		return v;
	}
	,getVirgins: function() {
		return this.power[3];
	}
	,highlightNode: function(n) {
		if(this.isAI) return;
		this.highlightedNodes.add(n);
	}
	,logPanel: function(m) {
		if(this.logPanelMessages.length >= 24) this.logPanelMessages.clear();
		this.logPanelMessages.add(m);
		this.ui.logPanel.paint();
	}
	,logPanelShort: function(s) {
		this.logPanel({ id : -1, old : false, type : "cult", text : s, obj : this, turn : this.game.turns + 1, params : { }});
	}
	,log: function(s) {
		if(this.isAI) return;
		var s2 = this.ui.logWindow.getRenderedMessage(s);
		this.logMessages += s2;
	}
	,discover: function(cult) {
		cult.isDiscovered[this.id] = true;
		this.isDiscovered[cult.id] = true;
		this.ui.log2(this,this.getFullName() + " has discovered the existence of " + cult.getFullName() + ".");
	}
	,checkDeath: function() {
		if(this.nodes.length > 0 || this.isDead) return;
		this.ui.log2(this,this.getFullName() + " has been destroyed, forgotten by time.");
		this.ui.map.paint();
		this.isDead = true;
		var _g = 0, _g1 = this.game.cults;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			c.wars[this.id] = false;
		}
		var _g1 = 0, _g = this.wars.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.wars[i] = false;
		}
		this.hasInvestigator = false;
		this.investigator = null;
		var _g = 0, _g1 = this.game.cults;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			var $it0 = c.sects.iterator();
			while( $it0.hasNext() ) {
				var s = $it0.next();
				if(s.task != null && s.task.type == "cult" && s.taskTarget == this) s.clearTask();
			}
		}
		if(!this.isAI) {
			var humansAlive = false;
			var _g = 0, _g1 = this.game.cults;
			while(_g < _g1.length) {
				var c = _g1[_g];
				++_g;
				if(!c.isAI && !c.isDead) {
					humansAlive = true;
					break;
				}
			}
			if(!humansAlive) {
				this.game.isFinished = true;
				this.ui.finish(this,this.game.difficulty.numPlayers == 1?"wiped":"multiplayerFinish");
			}
		} else this.checkVictory();
	}
	,checkVictory: function() {
		if(this.isDead || this.isParalyzed) return;
		var ok = true;
		var _g = 0, _g1 = this.game.cults;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			if(p != this && !p.isDead && !p.isParalyzed) ok = false;
		}
		if(!ok) return;
		this.game.isFinished = true;
		this.ui.finish(this,"conquer");
	}
	,loseOrigin: function() {
		if(this.nodes.length > 0) this.ui.log2(this,this.getFullName() + " has lost its Origin.");
		if(this.isRitual) {
			this.isRitual = false;
			this.ui.log2(this,"The execution of " + this.ritual.name + " has been stopped.");
			this.game.failSectTasks();
		}
		var ok = false;
		this.origin = null;
		var $it0 = this.nodes.iterator();
		while( $it0.hasNext() ) {
			var n = $it0.next();
			if(n.level == 2) {
				this.origin = n;
				ok = true;
				break;
			}
		}
		if(!ok) {
			if(this.nodes.length > 0) this.ui.log2(this,"Destroying the origin of " + this.getFullName() + " has left it completely paralyzed.");
			this.isParalyzed = true;
			if(this.hasInvestigator) {
				this.killInvestigator();
				if(this.nodes.length > 0) this.ui.log2(this,"The investigator of the " + this.getFullName() + " has disappeared thinking the cult is finished.");
			}
		} else {
			this.ui.log2(this,"Another priest becomes the Origin of " + this.getFullName() + ".");
			this.origin.update();
			this.ui.map.paint();
		}
	}
	,loseNode: function(node,cult) {
		var _g = this, _g1 = _g.awareness;
		_g.setAwareness(_g1 + 1);
		_g1;
		if(!this.isAI) this.ui.updateStatus();
		if(cult != null && this.nodes.length > 0) cult.declareWar(this);
		if(this.origin == node) this.loseOrigin();
		node.update();
		this.checkDeath();
	}
	,makePeace: function(cult) {
		if(!cult.wars[this.id]) return;
		cult.wars[this.id] = false;
		this.wars[cult.id] = false;
		var text = this.getFullName() + " has made peace with " + cult.getFullName() + ".";
		var m = { id : -1, old : false, type : "cults", text : text, obj : { c1 : this, c2 : cult}, turn : this.game.turns + 1, params : { }};
		var _g = 0, _g1 = this.game.cults;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			if(this.isInfoKnown[c.id] || cult.isInfoKnown[c.id] || this.isDiscovered[c.id] || cult.isDiscovered[c.id]) {
				c.log(text);
				c.logPanel(m);
			}
		}
	}
	,declareWar: function(cult) {
		if(cult.wars[this.id]) return;
		cult.wars[this.id] = true;
		this.wars[cult.id] = true;
		var text = this.getFullName() + " has declared war against " + cult.getFullName() + ".";
		var m = { id : -1, old : false, type : "cults", text : text, obj : { c1 : this, c2 : cult}, turn : this.game.turns + 1, params : { }};
		var _g = 0, _g1 = this.game.cults;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			if(this.isInfoKnown[c.id] || cult.isInfoKnown[c.id] || this.isDiscovered[c.id] || cult.isDiscovered[c.id]) {
				c.log(text);
				c.logPanel(m);
			}
		}
	}
	,activate: function(node) {
		if(this.isParalyzed) {
			if(!this.isAI) this.ui.alert("Cult is paralyzed without the Origin.");
			return "";
		}
		var ok = false;
		var $it0 = node.links.iterator();
		while( $it0.hasNext() ) {
			var l = $it0.next();
			if(l.owner == this) {
				ok = true;
				break;
			}
		}
		if(!ok) {
			if(!this.isAI) this.ui.alert("Must have an adjacent node to activate.");
			return "";
		}
		if(node.owner == this) return "isOwner";
		if(node.isGenerator && node.owner != null) {
			var cnt = 0;
			var $it1 = node.links.iterator();
			while( $it1.hasNext() ) {
				var n = $it1.next();
				if(n.owner == node.owner) cnt++;
			}
			if(cnt >= 3) return "hasLinks";
		}
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.power[i] < node.power[i]) return "notEnoughPower";
		}
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			this.power[i] = Math.round(this.power[i] - node.power[i]);
		}
		if(100 * Math.random() > this.getGainChance(node)) {
			if(!this.isAI) {
				js.Lib.document.getElementById("jqDialog_close").style.visibility = "hidden";
				JQDialog.notify("Could not gain a follower.",1);
				this.ui.updateStatus();
			}
			return "failure";
		}
		if(node.level > 0) node.level--;
		if(node.sect != null) node.owner.removeSect(node);
		node.setOwner(this);
		if(node.isTempGenerator) {
			node.setGenerator(false);
			node.isTempGenerator = false;
		}
		this.checkVictory();
		var _g = 0, _g1 = this.game.cults;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			if(c != this && node.visibility[c.id]) c.highlightNode(node);
		}
		return "ok";
	}
	,canActivate: function(node) {
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.power[i] < node.power[i]) return false;
		}
		return true;
	}
	,maxVirgins: function() {
		return this.getNeophytes() / 4 - 0.5 | 0;
	}
	,createSects: function() {
		if(this.isAI) return;
		while(this.sects.length < (this.nodes.length / 4 | 0)) {
			var node = this.findMostLinkedNode(null,true);
			this.createSect(node);
		}
	}
	,turn: function() {
		if(this.isParalyzed && this.paralyzedTurns > 3) {
			this.unParalyze();
			this.ui.log2(this,this.getFullName() + " has gained an origin and is no longer paralyzed.");
		}
		if((this.getPriests() > 0 || this.getAdepts() > 0) && !this.hasInvestigator && 100 * Math.random() < this.getInvestigatorChance() && this.investigatorTimeout == 0) {
			this.hasInvestigator = true;
			this.ui.log2(this,"An investigator has found out about " + this.getFullName() + ".",{ important : !this.isAI, symbol : "I"});
			this.investigator = new Investigator(this,this.ui,this.game);
			if(!this.isAI) this.ui.updateStatus();
		}
		if(this.investigatorTimeout > 0) this.investigatorTimeout--;
		if(this.isRitual) {
			this.ritualPoints -= this.getPriests();
			if(this.ritualPoints <= 0) this.ritualFinish();
			if(this.game.isFinished) return;
		}
		this.powerMod = [0,0,0,0];
		var $it0 = this.nodes.iterator();
		while( $it0.hasNext() ) {
			var node = $it0.next();
			if(node.isGenerator) {
				var _g1 = 0, _g = Game.numPowers;
				while(_g1 < _g) {
					var i = _g1++;
					if(100 * Math.random() < this.getResourceChance()) this.power[i] += Math.round(node.powerGenerated[i]);
					this.powerMod[i] += Math.round(node.powerGenerated[i]);
				}
			}
		}
		var value = Math.random() * (this.getNeophytes() / 4 - 0.5 | 0) | 0;
		var _g = this;
		_g.setVirgins(_g.getVirgins() + value);
		this.adeptsUsed = 0;
		if(this.hasInvestigator) this.investigator.turn();
		var $it1 = this.sects.iterator();
		while( $it1.hasNext() ) {
			var s = $it1.next();
			s.turn();
		}
		if(this.isParalyzed) this.paralyzedTurns++;
		this.createSects();
		if(this.options.getBool("sectAdvisor")) this.game.sectAdvisor.run(this);
	}
	,summonFinish: function() {
		if(100 * Math.random() > this.getUpgradeChance(2)) {
			var $it0 = this.nodes.iterator();
			while( $it0.hasNext() ) {
				var n = $it0.next();
				if(n.level == 2) {
					n.level = 0;
					n.update();
					break;
				}
			}
			if(!this.isAI) {
				this.ui.alert("The stars were not properly aligned. The high priest goes insane.");
				this.ui.log2(this,this.getFullName() + " has failed to perform the " + Static.rituals[0].name + ".");
				this.ui.updateStatus();
			} else {
				this.ui.alert(this.getFullName() + " has failed to perform the " + Static.rituals[0].name + ".<br><br>" + this.info.summonFail);
				this.ui.log2(this,this.getFullName() + " has failed the " + Static.rituals[0].name + ".");
			}
			return;
		}
		this.game.isFinished = true;
		this.ui.finish(this,"summon");
		this.ui.log2(this,"Game over.");
	}
	,ritualFinish: function() {
		if(this.ritual.id == "summoning") this.summonFinish();
		this.isRitual = false;
	}
	,summonStart: function() {
		if(this.isRitual) {
			this.ui.alert("You must first finish the current ritual before starting another.");
			return;
		}
		var _g = this;
		_g.setVirgins(_g.getVirgins() - this.game.difficulty.numSummonVirgins);
		this.isRitual = true;
		var _g = 0, _g1 = this.game.cults;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			this.isInfoKnown[c.id] = true;
		}
		this.ritual = Static.rituals[0];
		this.ritualPoints = this.ritual.points;
		var _g = 0, _g1 = this.game.cults;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			if(p != this && !p.isDead) {
				p.wars[this.id] = true;
				this.wars[p.id] = true;
			}
		}
		this.ui.alert(this.getFullName() + " has started the " + this.ritual.name + ".<br><br>" + this.info.summonStart);
		this.ui.log2(this,this.getFullName() + " has started the " + this.ritual.name + ".");
		if(!this.isAI) this.ui.updateStatus();
	}
	,getInvestigatorChance: function() {
		return (20 * this.getPriests() + 5 * this.getAdepts() + 0.5 * this.getNeophytes()) * this.difficulty.investigatorChance | 0;
	}
	,unParalyze: function() {
		var node = this.findMostLinkedNode();
		node.makeGenerator();
		node.isTempGenerator = true;
		this.isParalyzed = false;
		this.paralyzedTurns = 0;
		this.origin = node;
	}
	,findMostLinkedNode: function(level,noSects) {
		var node = null;
		var nlinks = -1;
		if(level != null) {
			var $it0 = this.nodes.iterator();
			while( $it0.hasNext() ) {
				var n = $it0.next();
				if(noSects && n.sect != null) continue;
				var cnt = 0;
				var $it1 = n.links.iterator();
				while( $it1.hasNext() ) {
					var l = $it1.next();
					if(l.owner == this) cnt++;
				}
				if(n.level == level && cnt > nlinks) {
					node = n;
					nlinks = cnt;
				}
			}
		} else {
			var $it2 = this.nodes.iterator();
			while( $it2.hasNext() ) {
				var n = $it2.next();
				if(noSects && n.sect != null) continue;
				var cnt = 0;
				var $it3 = n.links.iterator();
				while( $it3.hasNext() ) {
					var l = $it3.next();
					if(l.owner == this) cnt++;
				}
				if(cnt > nlinks) {
					node = n;
					nlinks = cnt;
				}
			}
		}
		return node;
	}
	,upgrade: function(level) {
		if(!this.canUpgrade(level)) return;
		if(level == 2 && this.getVirgins() < this.game.difficulty.numSummonVirgins || level < 2 && this.getVirgins() < level + 1) return;
		if(level == 2) {
			this.summonStart();
			return;
		}
		var _g = this;
		_g.setVirgins(_g.getVirgins() - (level + 1));
		if(100 * Math.random() > this.getUpgradeChance(level)) {
			if(!this.isAI) {
				js.Lib.document.getElementById("jqDialog_close").style.visibility = "hidden";
				JQDialog.notify("Ritual failed.",1);
				this.ui.updateStatus();
			}
			return;
		}
		var _g = this;
		_g.setAwareness(_g.awareness + level);
		var ok = false;
		var upNode = null;
		if(this.origin != null && this.origin.level == level) {
			this.origin.upgrade();
			upNode = this.origin;
			ok = true;
		}
		if(!ok) {
			var upNode1 = this.findMostLinkedNode(level);
			if(upNode1 != null) {
				upNode1.upgrade();
				ok = true;
			}
		}
		if(!this.isAI) this.ui.updateStatus();
		if(this != this.game.player && this.getPriests() >= 2) this.ui.log2(this,this.getFullName() + " has " + this.getPriests() + " priests. Be careful.");
		if(this.isParalyzed && this.getPriests() >= 1) {
			this.unParalyze();
			this.ui.log2(this,this.getFullName() + " has gained a priest and is no longer paralyzed.");
		}
		this.ui.map.paint();
	}
	,canUpgrade: function(level) {
		if(level < 2) return this.getNumFollowers(level) >= Game.upgradeCost && this.getVirgins() >= level + 1; else return this.getPriests() >= Game.upgradeCost && this.getVirgins() >= this.game.difficulty.numSummonVirgins && !this.isRitual;
	}
	,convert: function(from,to) {
		if(this.power[from] < Game.powerConversionCost[from]) return;
		this.power[from] -= Game.powerConversionCost[from];
		this.power[to] += 1;
		if(!this.isAI) this.ui.updateStatus();
	}
	,killInvestigator: function() {
		this.investigator = null;
		this.hasInvestigator = false;
		this.investigatorTimeout = 3;
		this.game.failSectTasks();
	}
	,lowerWillpower: function(pwr) {
		if(!this.hasInvestigator || this.adeptsUsed >= this.getAdepts() || pwr == 3 || this.power[pwr] < Game.willPowerCost || this.investigator.isHidden) return;
		this.power[pwr] -= Game.willPowerCost;
		this.adeptsUsed++;
		var failChance = 30 * this.difficulty.investigatorWillpower;
		if(this.investigator.name == "Randolph Carter") failChance += 10;
		if(100 * Math.random() < failChance) {
			if(!this.isAI) {
				js.Lib.document.getElementById("jqDialog_close").style.visibility = "hidden";
				JQDialog.notify("You have failed to shatter the will of the investigator.",1);
				this.ui.updateStatus();
			}
			return;
		}
		this.investigator.will -= 1;
		if(this.investigator.will <= 0) {
			this.ui.log2(this,"The investigator of the " + this.getFullName() + " has disappeared.",{ symbol : "I"});
			this.killInvestigator();
		}
		if(!this.isAI) this.ui.updateStatus();
	}
	,lowerAwareness: function(pwr) {
		if(this.awareness == 0 || this.adeptsUsed >= this.getAdepts() || pwr == 3) return;
		var _g = this;
		_g.setAwareness(_g.awareness - 2);
		if(this.awareness < 0) this.setAwareness(0);
		this.power[pwr]--;
		this.adeptsUsed++;
		if(!this.isAI) {
			this.ui.updateStatus();
			this.ui.map.paint();
		}
	}
	,getGainChance: function(node) {
		var ch = 0;
		if(!node.isGenerator) ch = 99 - (this.awareness * this.difficulty.awarenessGain | 0); else ch = 99 - (this.awareness * 2 * this.difficulty.awarenessGain | 0);
		if(!this.isAI && node.owner != null && !node.owner.isInfoKnown[this.game.player.id]) ch -= 20;
		if(!this.isAI && node.owner != null && !node.isKnown[this.game.player.id]) ch -= 10;
		if(ch < 1) ch = 1;
		return ch;
	}
	,getUpgradeChance: function(level) {
		var ch = 0;
		if(level == 0) ch = 99 * this.difficulty.upgradeChance - this.awareness * this.difficulty.awarenessUpgrade | 0; else if(level == 1) ch = 80 * this.difficulty.upgradeChance - this.awareness * 1.5 * this.difficulty.awarenessUpgrade | 0; else if(level == 2) ch = 75 * this.difficulty.upgradeChance - this.awareness * 2 * this.difficulty.awarenessUpgrade | 0;
		if(ch < 1) ch = 1;
		if(ch > 99) ch = 99;
		return ch;
	}
	,getResourceChance: function() {
		var ch = 99 - (this.difficulty.awarenessResource * this.awareness | 0);
		if(ch < 1) ch = 1;
		return ch;
	}
	,setAwareness: function(v) {
		this.awareness = v;
		var _g = 0, _g1 = this.game.nodes;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			if(n.visibility[this.id] && n.owner != this) n.update();
		}
		return v;
	}
	,removeCloseGenerators: function() {
		var $it0 = this.origin.links.iterator();
		while( $it0.hasNext() ) {
			var n = $it0.next();
			if(n.owner == null && n.isGenerator) n.setGenerator(false);
		}
	}
	,setOrigin: function() {
		var index = -1;
		while(true) {
			index = Math.round((this.game.nodes.length - 1) * Math.random());
			var node = this.game.nodes[index];
			if(node.owner != null) continue;
			var ok = 1;
			var _g = 0, _g1 = this.game.cults;
			while(_g < _g1.length) {
				var p = _g1[_g];
				++_g;
				if(p.origin != null && node.distance(p.origin) < this.difficulty.nodeActivationRadius + 50) {
					ok = 0;
					break;
				}
			}
			if(ok == 0) continue;
			break;
		}
		this.origin = this.game.nodes[index];
		this.origin.owner = this;
		if(!this.isAI || this.game.difficulty.isOriginKnown) this.origin.isKnown[this.id] = true;
		this.nodes.add(this.origin);
		this.origin.update();
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.origin.power[i] > 0) {
				this.origin.powerGenerated[i] = 1;
				this.powerMod[i] += 1;
			}
		}
		this.origin.setGenerator(true);
		this.origin.setVisible(this,true);
		this.origin.showLinks();
		this.highlightedNodes.clear();
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			this.power[i] += Math.round(this.origin.powerGenerated[i]);
			if(Math.random() < 0.5) this.origin.power[i]++;
		}
		this.origin.update();
		if(!this.isAI && this.game.difficultyLevel == 2) this.removeCloseGenerators();
	}
	,removeSect: function(node) {
		this.ui.log2(this,"Sect " + node.sect.name + " has been destroyed without leadership.",{ type : "sect"});
		this.sects.remove(node.sect);
		node.sect = null;
		node.update();
	}
	,createSect: function(node) {
		if(this.sects.length >= (this.nodes.length / 4 | 0)) return;
		var sect = new sects.Sect(this.game,this.ui,node,this);
		this.sects.add(sect);
		node.sect = sect;
		node.update();
		if(!this.isAI) this.ui.log2(this,node.name + " becomes the leader of a sect " + sect.name + ".",{ type : "sect"});
	}
	,getMaxSects: function() {
		return this.nodes.length / 4 | 0;
	}
	,save: function() {
		console.log("TODO save isDiscovered isInfoKnown");
		var obj = { id : this.id, iid : this.infoID, dif : this.difficulty.level, ia : this.isAI?1:0, ide : this.isDead?1:0, ip : this.isParalyzed?1:0, p : this.power, or : this.origin != null?this.origin.id:0, au : this.adeptsUsed, it : this.investigatorTimeout};
		if(this.hasInvestigator) obj.inv = this.investigator.save();
		if(this.isRitual) {
			obj.r = this.ritual.id;
			obj.rp = this.ritualPoints;
		}
		obj.aw = this.awareness;
		var ww = [];
		var savewars = false;
		var _g = 0, _g1 = this.wars;
		while(_g < _g1.length) {
			var w = _g1[_g];
			++_g;
			ww.push(w?1:0);
			if(w) savewars = true;
		}
		if(savewars) obj.w = this.wars;
		return obj;
	}
	,load: function(c) {
		this.difficulty = Static.difficulty[c.dif];
		this.isDead = c.ide?true:false;
		this.isParalyzed = c.ip?true:false;
		console.log("TODO load isDiscovered isInfoKnown");
		this.power = c.p;
		this.adeptsUsed = c.au;
		this.investigatorTimeout = c.it;
		if(c.inv != null) {
			this.hasInvestigator = true;
			this.investigator = new Investigator(this,this.ui,this.game);
			this.investigator.load(c.inv);
		}
		if(c.r != null) {
			this.isRitual = true;
			this.ritualPoints = c.rp;
			var _g = 0, _g1 = Static.rituals;
			while(_g < _g1.length) {
				var r = _g1[_g];
				++_g;
				if(r.id == c.r) this.ritual = r;
			}
		}
		this.setAwareness(c.aw);
		if(c.w != null) {
			var wlist = c.w;
			this.wars = [];
			var _g = 0;
			while(_g < wlist.length) {
				var w = wlist[_g];
				++_g;
				this.wars.push(w == 1?true:false);
			}
		}
	}
	,highlightedNodes: null
	,logPanelMessages: null
	,logMessages: null
	,investigatorTimeout: null
	,investigator: null
	,hasInvestigator: null
	,options: null
	,sects: null
	,adeptsUsed: null
	,nodes: null
	,priests: null
	,adepts: null
	,neophytes: null
	,origin: null
	,powerMod: null
	,wars: null
	,virgins: null
	,power: null
	,awareness: null
	,ritualPoints: null
	,ritual: null
	,isRitual: null
	,isDebugInvisible: null
	,paralyzedTurns: null
	,isParalyzed: null
	,isDead: null
	,isAI: null
	,isDiscovered: null
	,isInfoKnown: null
	,difficulty: null
	,info: null
	,fullName: null
	,name: null
	,infoID: null
	,id: null
	,ui: null
	,game: null
	,__class__: Cult
	,__properties__: {get_fullName:"getFullName",set_awareness:"setAwareness",set_virgins:"setVirgins",get_virgins:"getVirgins",get_neophytes:"getNeophytes",get_adepts:"getAdepts",get_priests:"getPriests"}
}
var AI = $hxClasses["AI"] = function(gvar,uivar,id,infoID) {
	Cult.call(this,gvar,uivar,id,infoID);
	this.isAI = true;
	if(this.game.difficultyLevel == 0) this.difficulty = Static.difficulty[2]; else if(this.game.difficultyLevel == 2) this.difficulty = Static.difficulty[0]; else this.difficulty = Static.difficulty[1];
};
AI.__name__ = ["AI"];
AI.__super__ = Cult;
AI.prototype = $extend(Cult.prototype,{
	aiActivateNodeByConvert: function(node) {
		var resNeed = -1;
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.power[i] < node.power[i]) resNeed = i;
		}
		var resConv = -1;
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			if(i != resNeed) {
				if((this.power[i] / Game.powerConversionCost[i] | 0) > node.power[resNeed]) resConv = i;
			}
		}
		if(resConv < 0) return;
		var _g1 = 0, _g = node.power[resNeed];
		while(_g1 < _g) {
			var i = _g1++;
			this.convert(resConv,resNeed);
		}
		this.activate(node);
	}
	,aiSummon: function() {
		if(this.getPriests() < 3 || this.getVirgins() < 9 || this.getUpgradeChance(2) < 50 || this.isRitual) return;
		if(Game.debugAI) console.log(this.name + " TRY SUMMON!");
		this.summonStart();
	}
	,aiLowerAwareness: function() {
		if(this.awareness < this.difficulty.maxAwareness && !this.hasInvestigator || this.awareness < 5 && this.hasInvestigator || this.getAdepts() == 0 || this.adeptsUsed >= this.getAdepts()) return;
		var prevAwareness = this.awareness;
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			while(this.power[i] > 0 && this.adeptsUsed < this.getAdepts() && this.awareness >= this.difficulty.maxAwareness) this.lowerAwareness(i);
		}
		if(Game.debugAI && this.awareness != prevAwareness) console.log(this.name + " awareness " + prevAwareness + "% -> " + this.awareness + "%");
	}
	,aiLowerAwarenessHard: function() {
		if(this.awareness == 0 || this.getAdepts() == 0) return;
		var prevAwareness = this.awareness;
		while(this.getVirgins() > 0 && this.adeptsUsed < this.getAdepts() && this.awareness >= 0) {
			this.convert(3,0);
			this.lowerAwareness(0);
		}
		if(Game.debugAI && this.awareness != prevAwareness) console.log(this.name + " virgin awareness " + prevAwareness + "% -> " + this.awareness + "%");
	}
	,aiLowerWillpower: function() {
		if(!this.hasInvestigator || this.investigator.isHidden || this.getAdepts() == 0) return;
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			this.lowerWillpower(i);
			this.lowerWillpower(i);
		}
	}
	,aiUpgradeFollowers: function() {
		if(this.getVirgins() == 0) return;
		if(this.getAdepts() < 5 && this.getUpgradeChance(0) > 70 && this.getVirgins() > 0) {
			while(true) {
				if(!this.canUpgrade(0) || this.getVirgins() < 1 || this.getAdepts() >= 5) break;
				this.upgrade(0);
				if(Game.debugAI) console.log(this.name + " upgrade neophyte, adepts: " + this.getAdepts());
			}
			return;
		}
		if(this.getPriests() < 3 && this.getUpgradeChance(1) > 60 && this.getVirgins() > 1) {
			while(true) {
				if(!this.canUpgrade(1) || this.getVirgins() < 2 || this.getPriests() >= 3) break;
				this.upgrade(1);
				if(Game.debugAI) console.log("!!! " + this.name + " upgrade adept, priests: " + this.getPriests());
			}
			return;
		}
	}
	,aiTryPeace: function() {
		if(this.isRitual) return;
		var ok = false;
		var _g = 0, _g1 = this.game.cults;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			if(c.isRitual) {
				ok = true;
				break;
			}
		}
		if(!ok) return;
		var _g = 0;
		while(_g < 3) {
			var i = _g++;
			if(this.wars[i] && !this.game.cults[i].isRitual) {
				if(Math.random() * 100 > 30) continue;
				this.makePeace(this.game.cults[i]);
			}
		}
	}
	,aiTurn: function() {
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
		if(this.hasInvestigator && this.getAdepts() > 0) {
			if(this.awareness >= this.difficulty.maxAwareness) this.aiLowerAwarenessHard(); else this.aiLowerWillpower();
			return;
		}
		this.aiUpgradeFollowers();
		if(this.isRitual && this.ritual.id == "summoning") this.aiLowerAwarenessHard();
		this.aiLowerAwareness();
		this.aiSummon();
		if(this.awareness > this.difficulty.maxAwareness && this.getAdepts() > 0) return;
		var list = new Array();
		var _g = 0, _g1 = this.game.nodes;
		while(_g < _g1.length) {
			var node = _g1[_g];
			++_g;
			if(node.owner == this || !node.visibility[this.id] || node.owner != null && node.owner.isDebugInvisible) continue;
			var item = { node : node, priority : 0};
			if(node.owner != null && node.level == 2 && node.owner.isRitual && node.owner.ritual.id == "summoning") item.priority += 3;
			if(node.owner == null) item.priority++;
			if(node.owner != null && this.wars[node.owner.id]) item.priority++; else if(node.owner != null && node.owner.isRitual && node.owner.ritual.id == "summoning") item.priority += 2; else if(node.owner != null) item.priority--;
			if(node.owner != null && this.hasInvestigator) item.priority--;
			if(node.isGenerator && !node.isProtected) item.priority += 2;
			if(this.canActivate(node)) item.priority++;
			list.push(item);
		}
		list.sort(function(x,y) {
			if(x.priority == y.priority) return 0; else if(x.priority > y.priority) return -1; else return 1;
		});
		var _g = 0;
		while(_g < list.length) {
			var item = list[_g];
			++_g;
			var node = item.node;
			var ret = this.activate(node);
			if(ret == "ok") continue;
			if(ret == "notEnoughPower") this.aiActivateNodeByConvert(node); else if(ret == "hasLinks") 1;
		}
		this.aiTryPeace();
	}
	,__class__: AI
});
var Alert = $hxClasses["Alert"] = function(uivar,gvar) {
	this.ui = uivar;
	this.game = gvar;
	this.isVisible = false;
	this.window = Tools.window({ id : "windowAlert", center : true, winW : UI.winWidth, winH : UI.winHeight, bold : true, w : 600, h : 450, z : 25});
	this.window.style.display = "none";
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
	close.onclick = $bind(this,this.onClose);
	this.bg = Tools.bg({ w : UI.winWidth + 20, h : UI.winHeight, z : 24});
};
Alert.__name__ = ["Alert"];
Alert.prototype = {
	show: function(s,shadow,shadowOpacity) {
		if(shadowOpacity == null) shadowOpacity = 0.8;
		this.bg.style.opacity = shadowOpacity;
		this.text.innerHTML = "<center>" + s + "</center>";
		this.window.style.display = "inline";
		this.bg.style.display = shadow?"inline":"none";
		this.isVisible = true;
	}
	,onClose: function(event) {
		this.window.style.display = "none";
		this.bg.style.display = "none";
		this.isVisible = false;
	}
	,isVisible: null
	,bg: null
	,text: null
	,window: null
	,game: null
	,ui: null
	,__class__: Alert
}
var Config = $hxClasses["Config"] = function() {
};
Config.__name__ = ["Config"];
Config.prototype = {
	set: function(name,val) {
		return setCookie(name,val,new Date(2015, 0, 0, 0, 0, 0, 0));
	}
	,get: function(name) {
		return getCookie(name);
	}
	,__class__: Config
}
var CustomMenu = $hxClasses["CustomMenu"] = function(uivar,gvar) {
	this.ui = uivar;
	this.game = gvar;
	this.isVisible = false;
	this.window = Tools.window({ id : "customMenuWindow", center : true, winW : UI.winWidth, winH : UI.winHeight, w : 1000, h : 500, z : 20});
	Tools.label({ id : "titleLabel", text : "Custom game parameters", w : 300, h : 30, x : 320, y : 10, container : this.window});
	var divel = js.Lib.document.createElement("div");
	divel.style.background = "#030303";
	divel.style.left = "10";
	divel.style.top = "40";
	divel.style.width = "980";
	divel.style.height = "400";
	divel.style.position = "absolute";
	divel.style.overflow = "auto";
	this.window.appendChild(divel);
	this.difElements = new List();
	var y = 10;
	var _g = 0, _g1 = CustomMenu.difElementInfo;
	while(_g < _g1.length) {
		var info = _g1[_g];
		++_g;
		Tools.label({ id : "label" + info.name, text : info.title, w : 300, h : 20, x : 10, y : y, fontSize : 14, container : divel});
		var el = null;
		if(info.type == "bool") el = Tools.checkbox({ id : info.name, text : "" + Std.string(Reflect.field(Static.difficulty[2],info.name)), w : 70, h : 20, x : 320, y : y, fontSize : 14, container : divel}); else el = Tools.textfield({ id : info.name, text : "" + Std.string(Reflect.field(Static.difficulty[2],info.name)), w : 70, h : 20, x : 320, y : y, fontSize : 14, container : divel});
		Tools.label({ id : "note" + info.name, text : info.note, w : 540, h : 20, x : 410, y : y, fontSize : 14, bold : false, container : divel});
		y += 30;
		this.difElements.add(el);
	}
	Tools.button({ id : "startCustomGame", text : "Start", w : 80, h : 25, x : 250, y : 460, container : this.window, func : $bind(this,this.onStartGame)});
	this.bg = Tools.bg({ w : UI.winWidth + 20, h : UI.winHeight});
	this.close = Tools.closeButton(this.window,630,460,"customMenuClose");
	this.close.onclick = $bind(this,this.onClose);
};
CustomMenu.__name__ = ["CustomMenu"];
CustomMenu.prototype = {
	onClose: function(event) {
		this.realClose();
		this.ui.mainMenu.show();
	}
	,realClose: function() {
		this.window.style.display = "none";
		this.bg.style.display = "none";
		this.close.style.display = "none";
		this.isVisible = false;
	}
	,onKey: function(e) {
		if(e.keyCode == 27) this.onClose(null);
	}
	,show: function() {
		this.window.style.display = "inline";
		this.bg.style.display = "inline";
		this.close.style.display = "inline";
		this.isVisible = true;
	}
	,onStartGame: function(e) {
		var dif = { level : -1};
		js.Lib.document.getElementById("haxe:trace").innerHTML = "";
		var _g = 0, _g1 = CustomMenu.difElementInfo;
		while(_g < _g1.length) {
			var info = _g1[_g];
			++_g;
			var el = null;
			var $it0 = this.difElements.iterator();
			while( $it0.hasNext() ) {
				var e1 = $it0.next();
				if(e1.id == info.name) {
					el = e1;
					break;
				}
			}
			var value = null;
			if(info.type == "int") value = Std.parseInt(el.value); else if(info.type == "float") value = Std.parseFloat(el.value); else if(info.type == "bool") value = el.checked;
			dif[info.name] = value;
		}
		if(dif.numPlayers < 1) dif.numPlayers = 1;
		if(dif.numCults < 2) dif.numCults = 2;
		if(dif.numPlayers > 8) dif.numPlayers = 8;
		if(dif.numCults > 8) dif.numCults = 8;
		this.game.restart(-1,dif);
		this.realClose();
	}
	,difElements: null
	,isVisible: null
	,close: null
	,bg: null
	,window: null
	,game: null
	,ui: null
	,__class__: CustomMenu
}
var DateTools = $hxClasses["DateTools"] = function() { }
DateTools.__name__ = ["DateTools"];
DateTools.__format_get = function(d,e) {
	return (function($this) {
		var $r;
		switch(e) {
		case "%":
			$r = "%";
			break;
		case "C":
			$r = StringTools.lpad(Std.string(d.getFullYear() / 100 | 0),"0",2);
			break;
		case "d":
			$r = StringTools.lpad(Std.string(d.getDate()),"0",2);
			break;
		case "D":
			$r = DateTools.__format(d,"%m/%d/%y");
			break;
		case "e":
			$r = Std.string(d.getDate());
			break;
		case "H":case "k":
			$r = StringTools.lpad(Std.string(d.getHours()),e == "H"?"0":" ",2);
			break;
		case "I":case "l":
			$r = (function($this) {
				var $r;
				var hour = d.getHours() % 12;
				$r = StringTools.lpad(Std.string(hour == 0?12:hour),e == "I"?"0":" ",2);
				return $r;
			}($this));
			break;
		case "m":
			$r = StringTools.lpad(Std.string(d.getMonth() + 1),"0",2);
			break;
		case "M":
			$r = StringTools.lpad(Std.string(d.getMinutes()),"0",2);
			break;
		case "n":
			$r = "\n";
			break;
		case "p":
			$r = d.getHours() > 11?"PM":"AM";
			break;
		case "r":
			$r = DateTools.__format(d,"%I:%M:%S %p");
			break;
		case "R":
			$r = DateTools.__format(d,"%H:%M");
			break;
		case "s":
			$r = Std.string(d.getTime() / 1000 | 0);
			break;
		case "S":
			$r = StringTools.lpad(Std.string(d.getSeconds()),"0",2);
			break;
		case "t":
			$r = "\t";
			break;
		case "T":
			$r = DateTools.__format(d,"%H:%M:%S");
			break;
		case "u":
			$r = (function($this) {
				var $r;
				var t = d.getDay();
				$r = t == 0?"7":Std.string(t);
				return $r;
			}($this));
			break;
		case "w":
			$r = Std.string(d.getDay());
			break;
		case "y":
			$r = StringTools.lpad(Std.string(d.getFullYear() % 100),"0",2);
			break;
		case "Y":
			$r = Std.string(d.getFullYear());
			break;
		default:
			$r = (function($this) {
				var $r;
				throw "Date.format %" + e + "- not implemented yet.";
				return $r;
			}($this));
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
		r.b += HxOverrides.substr(f,p,np - p);
		r.b += Std.string(DateTools.__format_get(d,HxOverrides.substr(f,np + 1,1)));
		p = np + 2;
	}
	r.b += HxOverrides.substr(f,p,f.length - p);
	return r.b;
}
DateTools.format = function(d,f) {
	return DateTools.__format(d,f);
}
DateTools.delta = function(d,t) {
	return (function($this) {
		var $r;
		var d1 = new Date();
		d1.setTime(d.getTime() + t);
		$r = d1;
		return $r;
	}(this));
}
DateTools.getMonthDays = function(d) {
	var month = d.getMonth();
	var year = d.getFullYear();
	if(month != 1) return DateTools.DAYS_OF_MONTH[month];
	var isB = year % 4 == 0 && year % 100 != 0 || year % 400 == 0;
	return isB?29:28;
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
	return { ms : t % 1000, seconds : s % 60 | 0, minutes : m % 60 | 0, hours : h % 24 | 0, days : h / 24 | 0};
}
DateTools.make = function(o) {
	return o.ms + 1000.0 * (o.seconds + 60.0 * (o.minutes + 60.0 * (o.hours + 24.0 * o.days)));
}
var Debug = $hxClasses["Debug"] = function(uivar,gvar) {
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
	close.onclick = $bind(this,this.onClose);
	this.lastMenuY = -20;
	this.menuItem = 0;
	this.addItem(0,"Clear trace",$bind(this,this.onClearTrace));
	this.addItem(0,"Give power",$bind(this,this.onGivePower));
	this.addItem(0,"Open map",$bind(this,this.onOpenMap));
	this.addItem(0,"Investigator: AI",$bind(this,this.onInvestigatorAI));
	this.addItem(0,"Investigator: Player",$bind(this,this.onInvestigatorPlayer));
	this.addItem(0,"Victory: Summon",$bind(this,this.onVictorySummon));
	this.addItem(0,"Total war",$bind(this,this.onTotalWar));
	this.addItem(0,"Invisibility toggle",$bind(this,this.onToggleInvisible));
	this.addItem(0,"Trace timing toggle",$bind(this,this.onTiming));
	this.addItem(0,"Trace AI toggle",$bind(this,this.onAI));
	this.addItem(0,"Node vis toggle",$bind(this,this.onVis));
	this.addItem(0,"Node near toggle",$bind(this,this.onNear));
	this.addItem(0,"Give adepts",$bind(this,this.onGiveAdepts));
	this.addItem(0,"Upgrade sects",$bind(this,this.onUpgradeSects));
	this.lastMenuY = -20;
	this.addItem(1,"Trace Director toggle",$bind(this,this.onDirector));
};
Debug.__name__ = ["Debug"];
Debug.prototype = {
	show: function() {
		this.window.style.display = "inline";
		this.isVisible = true;
	}
	,onClose: function(event) {
		this.window.style.display = "none";
		this.isVisible = false;
	}
	,onKey: function(e) {
		if(e.keyCode == 27 || e.keyCode == 13 || e.keyCode == 32) {
			this.onClose(null);
			return;
		}
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
	,addItem: function(row,title,func) {
		this.lastMenuY += 30;
		var sym = this.menuItem + 49;
		if(this.menuItem > 8) sym = this.menuItem - 9 + 65 + 32;
		var b = Tools.button({ id : "menuItem" + this.lastMenuY, fontSize : 14, bold : false, text : String.fromCharCode(sym) + " " + title, w : 200, h : 22, x : 10 + row * 210, y : this.lastMenuY, container : this.menu, func : func});
		b.name = String.fromCharCode(sym);
		this.buttons.push(b);
		this.menuItem++;
	}
	,menuItem: null
	,lastMenuY: null
	,onOpenMap: function(event) {
		var _g = 0, _g1 = this.game.nodes;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			n.setVisible(this.game.player,true);
			n.isKnown[this.game.player.id] = true;
		}
		var _g = 0, _g1 = this.game.cults;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			c.isInfoKnown[this.game.player.id] = true;
			var $it0 = c.nodes.iterator();
			while( $it0.hasNext() ) {
				var n = $it0.next();
				n.update();
			}
		}
		this.ui.map.paint();
	}
	,onGivePower: function(event) {
		var _g = 0;
		while(_g < 4) {
			var i = _g++;
			this.game.player.power[i] += 100;
		}
		this.ui.updateStatus();
	}
	,onInvestigatorPlayer: function(event) {
		var _g = 0, _g1 = this.game.cults;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			if(c == this.game.player) {
				c.hasInvestigator = true;
				c.investigator = new Investigator(c,this.ui,this.game);
			}
		}
	}
	,onInvestigatorAI: function(event) {
		var _g = 0, _g1 = this.game.cults;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			if(c.isAI) {
				c.hasInvestigator = true;
				c.investigator = new Investigator(c,this.ui,this.game);
			}
		}
	}
	,onVictorySummon: function(event) {
		this.ui.finish(this.game.cults[0],"summon");
	}
	,onTotalWar: function(event) {
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
	,onToggleInvisible: function(event) {
		this.game.player.isDebugInvisible = !this.game.player.isDebugInvisible;
		console.log("invisibility " + (this.game.player.isDebugInvisible?"on":"off"));
	}
	,onNear: function(event) {
		Game.debugNear = !Game.debugNear;
		var _g = 0, _g1 = this.game.nodes;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			n.update();
		}
		console.log("node nearness info " + (Game.debugNear?"on":"off"));
	}
	,onVis: function(event) {
		Game.debugVis = !Game.debugVis;
		var _g = 0, _g1 = this.game.nodes;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			n.update();
		}
		console.log("node visibility to cults info " + (Game.debugVis?"on":"off"));
	}
	,onDirector: function(event) {
		Game.debugDirector = !Game.debugDirector;
		console.log("trace director " + (Game.debugDirector?"on":"off"));
	}
	,onAI: function(event) {
		Game.debugAI = !Game.debugAI;
		console.log("trace ai " + (Game.debugAI?"on":"off"));
	}
	,onTiming: function(event) {
		Game.debugTime = !Game.debugTime;
		console.log("timing " + (Game.debugTime?"on":"off"));
	}
	,onClearTrace: function(event) {
		js.Lib.document.getElementById("haxe:trace").innerHTML = "";
	}
	,onGiveAdepts: function(event) {
		this.onGivePower(null);
		var _g = 0;
		while(_g < 3) {
			var i = _g++;
			var $it0 = this.game.player.nodes.iterator();
			while( $it0.hasNext() ) {
				var n = $it0.next();
				if(n.level < 1 && Math.random() < 0.5) n.upgrade();
				var $it1 = n.links.iterator();
				while( $it1.hasNext() ) {
					var n2 = $it1.next();
					if(Math.random() < 0.2) this.game.player.activate(n2);
				}
			}
		}
	}
	,onUpgradeSects: function(event) {
		var $it0 = this.game.player.sects.iterator();
		while( $it0.hasNext() ) {
			var s = $it0.next();
			s.size += 100;
		}
	}
	,isVisible: null
	,buttons: null
	,menu: null
	,window: null
	,game: null
	,ui: null
	,__class__: Debug
}
var Director = $hxClasses["Director"] = function(g,vui) {
	this.game = g;
	this.ui = vui;
};
Director.__name__ = ["Director"];
Director.prototype = {
	debug: function(s) {
		if(Game.debugDirector) console.log(s);
	}
	,findWeakestCult: function() {
		var cult = null;
		var cultPower = 10000;
		var _g = 0, _g1 = this.game.cults;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			if(c.isDead) continue;
			if(this.getCultPower(c) < cultPower) {
				cult = c;
				cultPower = this.getCultPower(c);
			}
		}
		return cult;
	}
	,getCultPower: function(cult) {
		var power = 0;
		var $it0 = cult.nodes.iterator();
		while( $it0.hasNext() ) {
			var node = $it0.next();
			power++;
			if(node.isGenerator) power++;
		}
		var _g = 0, _g1 = cult.power;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			power += p;
		}
		return power;
	}
	,doubleGenerators: function(cult) {
		if(Math.random() > 0.3) return;
		var power = [0,0,0];
		var $it0 = cult.nodes.iterator();
		while( $it0.hasNext() ) {
			var node = $it0.next();
			if(!node.isGenerator) continue;
			var _g1 = 0, _g = Game.numPowers;
			while(_g1 < _g) {
				var i = _g1++;
				if(node.powerGenerated[i] > 0) {
					power[i] += node.powerGenerated[i];
					if(Math.random() < 0.1) power[i] += node.powerGenerated[i];
				}
			}
		}
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			cult.power[i] += power[i];
		}
		if(Game.debugDirector) console.log("give " + Std.string(power) + " to " + cult.name);
	}
	,giveVirgins: function(cult) {
		if(Math.random() > 0.3) return;
		if((cult.getNeophytes() / 4 - 0.5 | 0) < 1) return;
		var n = 1 + (Math.random() * 2 | 0);
		var _g = cult;
		_g.setVirgins(_g.getVirgins() + 2);
		if(Game.debugDirector) console.log("give " + n + " virgins to " + cult.name);
	}
	,turn: function() {
		if(this.game.turns < 5) return;
		var cult = this.findWeakestCult();
		this.giveVirgins(cult);
		this.doubleGenerators(cult);
	}
	,ui: null
	,game: null
	,__class__: Director
}
var Game = $hxClasses["Game"] = function() {
	this.isFinished = true;
	this.turns = 0;
	this.ui = new UI(this);
	this.ui.init();
	this.director = new Director(this,this.ui);
	this.sectAdvisor = new sects.Advisor(this);
	this.ui.mainMenu.show();
	this.sectTasks = new Array();
	var _g = 0, _g1 = sects.Sect.taskClasses;
	while(_g < _g1.length) {
		var cl = _g1[_g];
		++_g;
		var t = Type.createInstance(cl,[]);
		this.sectTasks.push(t);
	}
};
Game.__name__ = ["Game"];
Game.instance = null;
Game.main = function() {
	Game.instance = new Game();
}
Game.prototype = {
	endTimer: function(name) {
		if(Game.debugTime) console.log(name + ": " + (new Date().getTime() - this.timerTime) + "ms");
	}
	,startTimer: function(name) {
		if(Game.debugTime) this.timerTime = new Date().getTime();
	}
	,timerTime: null
	,applyPlayerOptions: function() {
		this.ui.map.isAdvanced = this.player.options.getBool("mapAdvancedMode");
		this.ui.map.paint();
	}
	,failSectTasks: function() {
		var _g = 0, _g1 = this.cults;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			var $it0 = c.sects.iterator();
			while( $it0.hasNext() ) {
				var s = $it0.next();
				if(s.task != null && s.task.checkFailure(s) == true) s.clearTask();
			}
		}
	}
	,endTurn: function() {
		var newPlayerID = -1;
		var _g1 = this.currentPlayerID + 1, _g = this.cults.length;
		while(_g1 < _g) {
			var i = _g1++;
			var c = this.cults[i];
			if(c.isAI && !c.isDead) {
				c.turn();
				if(this.isFinished) return;
				if(Game.debugTime) this.timerTime = new Date().getTime();
				c.aiTurn();
				if(Game.debugTime) console.log("ai " + c.name + ": " + (new Date().getTime() - this.timerTime) + "ms");
			}
			if(!c.isAI && !c.isDead) {
				newPlayerID = i;
				break;
			}
		}
		if(newPlayerID >= 0) {
			this.player = this.cults[newPlayerID];
			this.currentPlayerID = newPlayerID;
			this.applyPlayerOptions();
			this.player.turn();
			var _g = 0, _g1 = this.cults;
			while(_g < _g1.length) {
				var c = _g1[_g];
				++_g;
				c.checkVictory();
			}
			var x = 0, y = 0;
			if(this.player.origin != null) {
				x = this.player.origin.x;
				y = this.player.origin.y;
			} else {
				var node = this.player.nodes.first();
				var $it0 = this.player.nodes.iterator();
				while( $it0.hasNext() ) {
					var n = $it0.next();
					if(n.level > node.level) node = n;
				}
				x = node.x;
				y = node.y;
			}
			this.ui.map.center(x,y);
			this.ui.logPanel.paint();
			this.ui.updateStatus();
			if(this.difficulty.numPlayers > 1) this.ui.alert("Your turn<br>" + this.player.getFullName(),true,1);
		}
		if(newPlayerID < 0) {
			this.turns++;
			this.currentPlayerID = -1;
			this.director.turn();
			this.endTurn();
		}
	}
	,getNode: function(id) {
		var _g = 0, _g1 = this.nodes;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			if(n.id == id) return n;
		}
		return null;
	}
	,save: function() {
		var save = { };
		save.nodes = new Array();
		var _g = 0, _g1 = this.nodes;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			save.nodes.push(n.save());
		}
		save.cults = new Array();
		var _g = 0, _g1 = this.cults;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			save.cults.push(c.save());
		}
		save.lines = new Array();
		console.log("TODO: save lines fail");
		save.turns = this.turns;
		save.dif = this.difficultyLevel;
		return save;
	}
	,load: function(save) {
		this.isFinished = false;
		this.turns = 0;
		this.ui.clearMap();
		this.ui.clearLog();
		this.lines = new List();
		this.nodes = new Array();
		this.cults = new Array();
		this.difficultyLevel = save.dif;
		this.difficulty = Static.difficulty[this.difficultyLevel];
		this.turns = save.turns;
		var savecults = save.cults;
		var _g = 0;
		while(_g < savecults.length) {
			var c = savecults[_g];
			++_g;
			var cult = null;
			if(c.ia == 0) {
				cult = new Cult(this,this.ui,c.id,c.iid);
				this.player = cult;
			} else cult = new AI(this,this.ui,c.id,c.iid);
			cult.load(c);
			this.cults.push(cult);
		}
		var savenodes = save.nodes;
		var _g = 0;
		while(_g < savenodes.length) {
			var n = savenodes[_g];
			++_g;
			var node = new Node(this,this.ui,n.x,n.y,n.id);
			node.load(n);
			this.nodes.push(node);
			if(node.owner == this.player) node.isKnown[this.player.id] = true;
		}
		this.updateLinks();
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
		var _g = 0, _g1 = this.nodes;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			n.update();
		}
		var savelines = save.lines;
		var _g = 0;
		while(_g < savelines.length) {
			var l = savelines[_g];
			++_g;
			var startNode = this.getNode(l[0]);
			var endNode = this.getNode(l[1]);
			var cult = this.cults[l[2]];
			var line = Line.create(this.ui.map,cult,startNode,endNode);
			console.log("TODO: load lines visibility bug!");
			this.lines.add(line);
			startNode.lines.add(line);
			endNode.lines.add(line);
		}
		this.ui.updateStatus();
	}
	,spawnNode: function() {
		var x = 0, y = 0;
		var cnt = 0;
		while(true) {
			x = Math.round(20 + Math.random() * (this.difficulty.mapWidth - UI.markerWidth - 40));
			y = Math.round(20 + Math.random() * (this.difficulty.mapHeight - UI.markerHeight - 40));
			cnt++;
			if(cnt > 100) return;
			var ok = 1;
			var _g = 0, _g1 = this.nodes;
			while(_g < _g1.length) {
				var n = _g1[_g];
				++_g;
				if(x - 30 < n.x && x + UI.markerWidth + 30 > n.x && (y - 30 < n.y && y + UI.markerHeight + 30 > n.y)) ok = 0;
			}
			if(ok == 1) break;
		}
		var node = new Node(this,this.ui,x,y,this.lastNodeIndex++);
		if(Game.mapVisible) node.setVisible(this.player,true);
		node.update();
		this.nodes.push(node);
	}
	,updateLinks: function() {
		var _g = 0, _g1 = this.nodes;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			var _g2 = 0, _g3 = this.nodes;
			while(_g2 < _g3.length) {
				var n2 = _g3[_g2];
				++_g2;
				if(n != n2 && n.distance(n2) < this.difficulty.nodeActivationRadius) {
					n.links.remove(n2);
					n.links.add(n2);
				}
			}
		}
	}
	,restart: function(newDifficulty,newDif) {
		if(getCookie("hasPlayed") == null) this.ui.alert("Welcome.<br><br>If this is your first time playing, please take the time to " + "read the <a target=_blank href='http://code.google.com/p/cult/wiki/Manual_" + Game.version + "'>Manual</a> " + "before playing. We are not responsible for horrific deaths caused by not reading the " + "Manual. You have been warned.");
		setCookie("hasPlayed","1",new Date(2015, 0, 0, 0, 0, 0, 0));
		this.ui.track("startGame diff:" + newDifficulty,null,null);
		if(Game.debugTime) this.timerTime = new Date().getTime();
		this.difficultyLevel = newDifficulty;
		if(this.difficultyLevel >= 0) this.difficulty = Static.difficulty[this.difficultyLevel]; else this.difficulty = newDif;
		this.isFinished = false;
		this.turns = 0;
		this.ui.clearMap();
		this.ui.clearLog();
		this.lines = new List();
		this.nodes = new Array();
		this.cults = new Array();
		this.lastCultID = 0;
		var cultInfo = new Array();
		var numPlayersLeft = this.difficulty.numPlayers;
		var _g1 = 0, _g = this.difficulty.numCults;
		while(_g1 < _g) {
			var i = _g1++;
			var p = null;
			var id = this.lastCultID++;
			var infoID = 0;
			if(i > 0) while(true) {
				infoID = 1 + (Math.random() * (Static.cults.length - 1) | 0);
				var ok = true;
				var _g2 = 0;
				while(_g2 < cultInfo.length) {
					var ii = cultInfo[_g2];
					++_g2;
					if(infoID == ii) {
						ok = false;
						break;
					}
				}
				if(ok) break;
			}
			if(numPlayersLeft > 0) {
				p = new Cult(this,this.ui,id,infoID);
				p.options.set("sectAdvisor",true);
				numPlayersLeft--;
			} else p = new AI(this,this.ui,id,infoID);
			this.cults.push(p);
			cultInfo.push(infoID);
		}
		this.player = this.cults[0];
		this.currentPlayerID = 0;
		this.lastNodeIndex = 0;
		var _g1 = 1, _g = this.difficulty.nodesCount + 1;
		while(_g1 < _g) {
			var i = _g1++;
			this.spawnNode();
		}
		var cnt = 0.15 * this.difficulty.nodesCount | 0;
		var _g = 0;
		while(_g < cnt) {
			var i = _g++;
			var nodeIndex = Math.round((this.difficulty.nodesCount - 1) * Math.random());
			var node = this.nodes[nodeIndex];
			node.makeGenerator();
		}
		this.updateLinks();
		var _g = 0, _g1 = this.cults;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			p.setOrigin();
		}
		this.ui.map.center(this.player.origin.x,this.player.origin.y);
		this.ui.updateStatus();
		var _g = 0, _g1 = this.cults;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			c.log("Game started.");
		}
		if(Game.debugTime) console.log("restart" + ": " + (new Date().getTime() - this.timerTime) + "ms");
	}
	,lines: null
	,nodes: null
	,lastCultID: null
	,lastNodeIndex: null
	,difficulty: null
	,difficultyLevel: null
	,isFinished: null
	,turns: null
	,sectTasks: null
	,player: null
	,currentPlayerID: null
	,cults: null
	,sectAdvisor: null
	,director: null
	,ui: null
	,__class__: Game
}
var GenName = $hxClasses["GenName"] = function() { }
GenName.__name__ = ["GenName"];
GenName.generate = function() {
	var name = GenName.names[Math.random() * (GenName.names.length - 1) | 0];
	var surname = GenName.surnames[Math.random() * (GenName.surnames.length - 1) | 0];
	return name + " " + surname;
}
var Hash = $hxClasses["Hash"] = function() {
	this.h = { };
};
Hash.__name__ = ["Hash"];
Hash.prototype = {
	toString: function() {
		var s = new StringBuf();
		s.b += Std.string("{");
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(i);
			s.b += Std.string(" => ");
			s.b += Std.string(Std.string(this.get(i)));
			if(it.hasNext()) s.b += Std.string(", ");
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,h: null
	,__class__: Hash
}
var HxOverrides = $hxClasses["HxOverrides"] = function() { }
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
}
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
}
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var Info = $hxClasses["Info"] = function(uivar,gvar) {
	this.ui = uivar;
	this.game = gvar;
	this.isVisible = false;
	this.window = Tools.window({ id : "windowInfo", center : true, winW : UI.winWidth, winH : UI.winHeight, fontSize : 16, bold : true, w : 800, h : 520, z : 20});
	this.window.style.display = "none";
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
	close.onclick = $bind(this,this.onClose);
};
Info.__name__ = ["Info"];
Info.e = function(s) {
	return js.Lib.document.getElementById(s);
}
Info.prototype = {
	show: function() {
		var s = "";
		var i = 0;
		var _g = 0, _g1 = this.game.cults;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			s += "<div style=\"" + (i == 0?"background:#333333":"") + "\">";
			if(p.isDead) s += "<s>";
			s += p.isDiscovered[this.game.player.id]?p.getFullName():"?";
			if(p.isDead) s += "</s> Forgotten";
			if(!p.isDead && p.isInfoKnown[this.game.player.id]) {
				var w = "";
				var _g3 = 0, _g2 = p.wars.length;
				while(_g3 < _g2) {
					var i1 = _g3++;
					if(p.wars[i1]) w += UI.cultName(i1,this.game.cults[i1].info) + " ";
				}
				if(w != "") s += " wars: " + w;
			}
			s += "<br>";
			if(p.hasInvestigator && p.isInfoKnown[this.game.player.id]) {
				s += "<span style='font-size: 12px; color: #999999'>Investigator <span style='color: white'>" + p.investigator.name + "</span>";
				if(!p.investigator.isHidden) s += ": Level " + (p.investigator.level + 1) + ", Willpower " + p.investigator.will;
				s += "</span>";
				if(p.investigator.isHidden) s += " <span style='color:#ffffff'>--- Hidden ---</span>";
				s += "<br>";
			}
			if(Game.isDebug && p.investigatorTimeout > 0 && p.isInfoKnown[this.game.player.id]) s += " Investigator timeout: " + p.investigatorTimeout + "<br>";
			if(Game.isDebug) {
				s += "<span style='font-size: 10px'>";
				var _g3 = 0, _g2 = p.power.length;
				while(_g3 < _g2) {
					var i1 = _g3++;
					s += UI.powerName(i1,true) + ": " + p.power[i1] + " (";
					if(i1 < 3) s += p.getResourceChance() + "%) "; else s += p.getNeophytes() / 4 - 0.5 + ") ";
				}
				s += "<span title='Awareness'>A: " + p.awareness + "%</span> ";
				s += "<span title='Chance of summoning'>ROS: " + p.getUpgradeChance(2) + "%</span> ";
				if(!p.hasInvestigator) s += "<span title='Chance of investigator appearing'>IAC: " + p.getInvestigatorChance() + "%</span> ";
				if(p.hasInvestigator) {
					s += "<span title='Chance of investigator reveal'>IRC: " + p.investigator.getKillChance() + "%</span> ";
					s += "<span title='Chance of investigator willpower raise'>IWC: " + p.investigator.getGainWillChance() + "%</span> ";
				}
				s += "<span title='Cult Power'>PWR: " + this.game.director.getCultPower(p) + "</span> ";
				s += "Dif: " + p.difficulty.level;
				s += "</span><br>";
			}
			if(p.isRitual && p.isInfoKnown[this.game.player.id]) {
				var turns = p.ritualPoints / p.getPriests() | 0;
				if(p.ritualPoints % p.getPriests() > 0) turns += 1;
				s += "Casting <span title='" + p.ritual.note + "' id='info.ritual" + i + "' style='color:#ffaaaa'>" + p.ritual.name + "</span>, " + (p.ritual.points - p.ritualPoints) + "/" + p.ritual.points + " points, " + turns + " turns left<br>";
			}
			if(!p.isDead && p.isInfoKnown[this.game.player.id]) {
				s += p.nodes.length + " followers (" + p.getNeophytes() + " neophytes, " + p.getAdepts() + " adepts, " + p.getPriests() + " priests)";
				if(p.isParalyzed) s += " --- Paralyzed ---";
				s += "<br>";
			}
			s += "<span id='info.toggleNote" + i + "' style='height:10; width:10; font-size:12px; border: 1px solid #777'>+</span>";
			s += "<br>";
			s += "<span id='info.note" + i + "'>" + (p.isInfoKnown[this.game.player.id]?p.info.note:"No information.") + "</span>";
			s += "<span id='info.longnote" + i + "'>" + (p.isInfoKnown[this.game.player.id]?p.info.longNote:"No information.") + "</span>";
			s += "</div><hr>";
			i++;
		}
		this.text.innerHTML = s;
		this.window.style.display = "inline";
		this.isVisible = true;
		var _g1 = 0, _g = this.game.difficulty.numCults;
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
					js.Lib.document.getElementById("info.longnote" + Std.string(t.noteID)).style.display = "block";
					js.Lib.document.getElementById("info.note" + Std.string(t.noteID)).style.display = "none";
				} else {
					t.innerHTML = "+";
					js.Lib.document.getElementById("info.longnote" + Std.string(t.noteID)).style.display = "none";
					js.Lib.document.getElementById("info.note" + Std.string(t.noteID)).style.display = "block";
				}
			};
		}
	}
	,onClose: function(event) {
		this.window.style.display = "none";
		this.isVisible = false;
	}
	,isVisible: null
	,text: null
	,window: null
	,game: null
	,ui: null
	,__class__: Info
}
var IntIter = $hxClasses["IntIter"] = function(min,max) {
	this.min = min;
	this.max = max;
};
IntIter.__name__ = ["IntIter"];
IntIter.prototype = {
	next: function() {
		return this.min++;
	}
	,hasNext: function() {
		return this.min < this.max;
	}
	,max: null
	,min: null
	,__class__: IntIter
}
var Investigator = $hxClasses["Investigator"] = function(c,ui,g) {
	this.cult = c;
	this.ui = ui;
	this.game = g;
	this.name = GenName.generate();
	this.numTurn = 0;
	this.isHidden = true;
	this.will = 1 + (c.nodes.length * c.difficulty.investigatorCultSize | 0);
	if(this.will > 9) this.will = 9;
	if(this.cult.isAI && this.will > 4) this.will = 4;
	this.level = this.will / 3 | 0;
	if(this.level > 2) this.level = 2;
};
Investigator.__name__ = ["Investigator"];
Investigator.prototype = {
	getKillChance: function() {
		var chance = 0;
		if(this.cult.awareness <= 5) chance = 20 * this.cult.difficulty.investigatorKill | 0; else if(this.cult.awareness <= 10) chance = 65 * this.cult.difficulty.investigatorKill | 0; else chance = 70 * this.cult.difficulty.investigatorKill | 0;
		var $it0 = this.cult.sects.iterator();
		while( $it0.hasNext() ) {
			var sect = $it0.next();
			if(sect.task == null || sect.task.id != "invConfuse") continue;
			if(sect.level == 0) chance -= 2; else if(sect.level == 1) chance -= 5; else if(sect.level == 2) chance -= 10;
		}
		if(chance < 5) chance = 5;
		return chance;
	}
	,getGainWillChance: function() {
		var chance = 70 * this.cult.difficulty.investigatorGainWill | 0;
		var $it0 = this.cult.sects.iterator();
		while( $it0.hasNext() ) {
			var sect = $it0.next();
			if(sect.task == null || sect.task.id != "invConfuse") continue;
			if(sect.level == 0) chance -= 2; else if(sect.level == 1) chance -= 5; else if(sect.level == 2) chance -= 10;
		}
		if(chance < 20) chance = 20;
		return chance;
	}
	,killFollower: function() {
		if(100 * Math.random() > this.getKillChance()) return;
		var node = null;
		if(this.cult.isRitual) {
			var $it0 = this.cult.nodes.iterator();
			while( $it0.hasNext() ) {
				var n = $it0.next();
				if(n.level > this.level || n.isProtected) continue;
				if(node != null && n.level <= node.level) continue;
				node = n;
			}
		} else {
			var $it1 = this.cult.nodes.iterator();
			while( $it1.hasNext() ) {
				var n = $it1.next();
				if(n.level > this.level || n.isProtected) continue;
				node = n;
				if(Math.random() > 0.5) break;
			}
		}
		if(node == null) return;
		if(node == this.cult.origin && Math.random() > 0.3) return;
		this.ui.log2(this.cult,"The investigator revealed the " + this.cult.getFullName() + " follower.",{ symbol : "I"});
		if(node.sect != null) this.cult.removeSect(node);
		node.generateAttributes();
		node.removeOwner();
		var _g = 0, _g1 = this.game.cults;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			if(node.visibility[c.id]) c.highlightNode(node);
		}
	}
	,gainWill: function() {
		if(100 * Math.random() > this.getGainWillChance()) return;
		var oldLevel = this.level;
		this.will += 1;
		this.level = this.will / 3 | 0;
		if(this.level > 2) this.level = 2;
		if(this.level > oldLevel && !this.cult.isAI) this.ui.log2(this.cult,"The investigator of " + this.cult.getFullName() + " has gained level " + (this.level + 1) + ".",{ symbol : "I"});
	}
	,turn: function() {
		if(this.numTurn == 0) {
			this.numTurn++;
			return;
		}
		var turnVisible = this.cult.difficulty.investigatorTurnVisible;
		if(this.cult.isAI && turnVisible > 0) turnVisible = 2;
		if(this.isHidden && this.numTurn > turnVisible) {
			this.ui.log2(this.cult,this.cult.getFullName() + " has found out the investigator's location.",{ symbol : "I"});
			this.isHidden = false;
		}
		if(this.will >= 9) this.isHidden = true;
		this.numTurn++;
		var _g1 = 0, _g = this.level + 1;
		while(_g1 < _g) {
			var i = _g1++;
			this.killFollower();
		}
		if(this.cult.awareness < 5 && !this.cult.isRitual) return;
		this.gainWill();
		if(this.cult.isRitual && 100 * Math.random() < 30) this.gainWill();
	}
	,save: function() {
		return { n : this.name, w : this.will, l : this.level, h : this.isHidden?1:0};
	}
	,load: function(obj) {
		this.name = obj.n;
		this.will = obj.w;
		this.level = obj.l;
		this.isHidden = obj.h == 1?true:false;
	}
	,isHidden: null
	,level: null
	,will: null
	,name: null
	,numTurn: null
	,game: null
	,ui: null
	,cult: null
	,__class__: Investigator
}
var Line = $hxClasses["Line"] = function() {
	this.pixels = new Array();
};
Line.__name__ = ["Line"];
Line.create = function(map,player,startNode,endNode) {
	var line = new Line();
	line.owner = player;
	line.startNode = startNode;
	line.endNode = endNode;
	line.visibility = [false,false,false,false];
	var cnt = 10;
	var dist = startNode.distance(endNode);
	if(dist < 50) cnt = (dist / 6 | 0) + 1;
	var x = startNode.centerX, y = startNode.centerY;
	var modx = (endNode.centerX - startNode.centerX) / cnt, mody = (endNode.centerY - startNode.centerY) / cnt;
	var _g = 1;
	while(_g < cnt) {
		var i = _g++;
		x += modx;
		y += mody;
		line.pixels.push({ x : Math.round(x), y : Math.round(y)});
	}
	return line;
}
Line.prototype = {
	clear: function() {
		this.pixels = null;
	}
	,setVisible: function(c,vis) {
		this.visibility[c.id] = vis;
	}
	,paint: function(ctx,map,cultID) {
		if(!this.visibility[cultID]) return;
		var _g = 0, _g1 = this.pixels;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			if(p.x < map.viewRect.x - 2 || p.y < map.viewRect.y - 2 || p.x > map.viewRect.x + map.viewRect.w || p.y > map.viewRect.y + map.viewRect.h) continue;
			ctx.drawImage(map.nodeImage,this.owner.id * 2,120,2,2,p.x - map.viewRect.x,p.y - map.viewRect.y,2,2);
		}
	}
	,visibility: null
	,owner: null
	,pixels: null
	,endNode: null
	,startNode: null
	,__class__: Line
}
var List = $hxClasses["List"] = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype = {
	map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			b.add(f(v));
		}
		return b;
	}
	,filter: function(f) {
		var l2 = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			if(f(v)) l2.add(v);
		}
		return l2;
	}
	,join: function(sep) {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		while(l != null) {
			if(first) first = false; else s.b += Std.string(sep);
			s.b += Std.string(l[0]);
			l = l[1];
		}
		return s.b;
	}
	,toString: function() {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		s.b += Std.string("{");
		while(l != null) {
			if(first) first = false; else s.b += Std.string(", ");
			s.b += Std.string(Std.string(l[0]));
			l = l[1];
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,last: function() {
		return this.q == null?null:this.q[0];
	}
	,first: function() {
		return this.h == null?null:this.h[0];
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,length: null
	,q: null
	,h: null
	,__class__: List
}
var LoadMenu = $hxClasses["LoadMenu"] = function(uivar,gvar) {
	this.ui = uivar;
	this.game = gvar;
	this.isVisible = false;
	this.window = Tools.window({ id : "loadMenuWindow", center : true, winW : UI.winWidth, winH : UI.winHeight, w : 420, h : 320, z : 25});
	Tools.label({ id : "loadLabel", text : "Key", w : 60, h : 30, x : 35, y : 30, container : this.window});
	this.key = Tools.textfield({ id : "loadKey", text : getCookie("owner"), w : 205, h : 30, x : 85, y : 30, container : this.window});
	this.key.onclick = $bind(this,this.onKeyClick);
	Tools.button({ id : "loadRefresh", text : "Refresh", w : 100, h : 30, x : 300, y : 30, container : this.window, func : $bind(this,this.onRefresh)});
	this.noSavesFound = Tools.label({ id : "loadLabel2", text : "No saves found.", w : 200, h : 30, x : 140, y : 150, container : this.window});
	this.saves = new Array();
	this.saveButtons = new Array();
	this.delButtons = new Array();
	var _g1 = 0, _g = UI.maxSaves;
	while(_g1 < _g) {
		var i = _g1++;
		var b = Tools.button({ id : "load" + i, text : "Load", w : 330, h : 30, x : 35, y : 70 + 40 * i, container : this.window, func : $bind(this,this.onLoadGame)});
		this.saveButtons.push(b);
		var b2 = Tools.button({ id : "del" + i, text : "X", w : 20, h : 30, x : 380, y : 70 + 40 * i, container : this.window, func : $bind(this,this.onDelGame)});
		this.delButtons.push(b2);
	}
	this.bg = Tools.bg({ w : UI.winWidth + 20, h : UI.winHeight});
	this.close = Tools.closeButton(this.window,180,280,"loadMenuClose");
	this.close.onclick = $bind(this,this.onClose);
};
LoadMenu.__name__ = ["LoadMenu"];
LoadMenu.prototype = {
	onClose: function(event) {
		this.window.style.display = "none";
		this.bg.style.display = "none";
		this.close.style.display = "none";
		this.noSavesFound.style.display = "none";
		var _g = 0, _g1 = this.saveButtons;
		while(_g < _g1.length) {
			var b = _g1[_g];
			++_g;
			b.style.display = "none";
		}
		var _g = 0, _g1 = this.delButtons;
		while(_g < _g1.length) {
			var b = _g1[_g];
			++_g;
			b.style.display = "none";
		}
		this.isVisible = false;
	}
	,onKey: function(e) {
		if(this.keyFocused) return;
		if(e.keyCode == 49) this.onLoadReal(0); else if(e.keyCode == 50) this.onLoadReal(1); else if(e.keyCode == 51) this.onLoadReal(2); else if(e.keyCode == 52) this.onLoadReal(3); else if(e.keyCode == 53) this.onLoadReal(4); else if(e.keyCode == 27) this.onClose(null);
	}
	,onDelReal: function(n) {
		var save = this.saves[n];
		var req = new js.XMLHttpRequest();
		req.open("GET","/save.delete?owner=" + getCookie("owner") + "&id=" + save.id,false);
		req.send(null);
		var text = req.responseText;
		this.show();
	}
	,onDelGame: function(event) {
		var b = Tools.getTarget(event);
		var n = Std.parseInt(b.id.substring(3));
		this.onDelReal(n);
	}
	,onLoadReal: function(n) {
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
	,onLoadGame: function(event) {
		var b = Tools.getTarget(event);
		var n = Std.parseInt(b.id.substring(4));
		this.onLoadReal(n);
	}
	,onRefresh: function(event) {
		setCookie("owner",this.key.value,new Date(2015, 0, 0, 0, 0, 0, 0));
		this.show();
	}
	,onKeyClick: function() {
		this.keyFocused = true;
	}
	,show: function() {
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
		var _g = 0, _g1 = this.saveButtons;
		while(_g < _g1.length) {
			var b = _g1[_g];
			++_g;
			b.style.display = "none";
			this.delButtons[i].style.display = "none";
			i++;
		}
		i = 0;
		this.noSavesFound.style.display = "inline";
		var _g = 0;
		while(_g < list.length) {
			var item = list[_g];
			++_g;
			var b = this.saveButtons[i];
			if(b == null) break;
			b.innerHTML = item.name;
			b.style.display = "inline";
			this.delButtons[i].style.display = "inline";
			i++;
			this.noSavesFound.style.display = "none";
		}
		this.key.value = getCookie("owner");
		this.window.style.display = "inline";
		this.bg.style.display = "inline";
		this.close.style.display = "inline";
		this.isVisible = true;
		this.keyFocused = false;
	}
	,isVisible: null
	,saves: null
	,delButtons: null
	,saveButtons: null
	,keyFocused: null
	,noSavesFound: null
	,key: null
	,close: null
	,bg: null
	,window: null
	,game: null
	,ui: null
	,__class__: LoadMenu
}
var Log = $hxClasses["Log"] = function(uivar,gvar) {
	this.ui = uivar;
	this.game = gvar;
	this.isVisible = false;
	this.window = Tools.window({ id : "windowLog", center : true, winW : UI.winWidth, winH : UI.winHeight, fontSize : 18, w : 800, h : 500, z : 14});
	this.window.style.display = "none";
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
	close.onclick = $bind(this,this.onClose);
};
Log.__name__ = ["Log"];
Log.prototype = {
	show: function() {
		this.text.innerHTML = this.game.player.logMessages;
		this.text.scrollTop = 10000;
		this.window.style.display = "inline";
		this.isVisible = true;
	}
	,clear: function() {
		this.text.innerHTML = "";
	}
	,getRenderedMessage: function(s) {
		return "<span style='color:#888888'>" + DateTools.format(new Date(),"%H:%M:%S") + "</span>" + " Turn " + (this.game.turns + 1) + ": " + s + "<br>";
	}
	,onClose: function(event) {
		this.window.style.display = "none";
		this.isVisible = false;
	}
	,logPrevTurn: null
	,isVisible: null
	,text: null
	,window: null
	,game: null
	,ui: null
	,__class__: Log
}
var LogPanel = $hxClasses["LogPanel"] = function(uivar,gvar) {
	this.ui = uivar;
	this.game = gvar;
	this.list = new List();
	this.panel = js.Lib.document.createElement("div");
	this.panel.id = "logPanel";
	this.panel.style.position = "absolute";
	this.panel.style.width = 20;
	this.panel.style.height = UI.mapHeight + UI.topHeight + 8;
	this.panel.style.left = 217;
	this.panel.style.top = 5;
	this.panel.style.background = "#090909";
	js.Lib.document.body.appendChild(this.panel);
};
LogPanel.__name__ = ["LogPanel"];
LogPanel.prototype = {
	clear: function() {
		this.list.clear();
		while(this.panel.hasChildNodes()) this.panel.removeChild(this.panel.firstChild);
	}
	,onClick: function(event) {
		var e = Tools.getTarget(event);
		if(e.parentNode != this.panel) e = e.parentNode;
		this.panel.removeChild(e);
		this.list.remove(e);
		var $it0 = this.game.player.logPanelMessages.iterator();
		while( $it0.hasNext() ) {
			var m = $it0.next();
			if(m.id == e.messageID) this.game.player.logPanelMessages.remove(m);
		}
		var cnt = 0;
		var nodes = this.panel.childNodes;
		var _g1 = 0, _g = nodes.length;
		while(_g1 < _g) {
			var i = _g1++;
			nodes[i].style.top = "" + cnt * 24;
			cnt++;
		}
	}
	,paint: function() {
		this.clear();
		var $it0 = this.game.player.logPanelMessages.iterator();
		while( $it0.hasNext() ) {
			var m = $it0.next();
			var sym = "!";
			var col = "white";
			if(m.type == "cult" || m.type == null) {
				var cult = m.obj;
				col = UI.lineColors[cult.id];
			} else if(m.type == "cults") {
				var cult = m.obj.c1;
				var cult2 = m.obj.c2;
				sym = "<span style='color:" + UI.lineColors[cult.id] + "'>!</span>" + "<span style='color:" + UI.lineColors[cult2.id] + "'>!</span>";
			}
			if(m.params != null && m.params.symbol != null) sym = m.params.symbol;
			var e = js.Lib.document.createElement("div");
			m.id = this.list.length;
			e.id = "log.id" + this.list.length;
			e.messageID = m.id;
			e.style.position = "absolute";
			e.style.width = "18";
			e.style.height = "18";
			e.style.left = "0";
			e.style.top = "" + this.list.length * 22;
			e.style.background = m.old?"#050505":"#151515";
			e.style.border = m.old?"1px solid #999":"1px solid #fff";
			e.style.cursor = "pointer";
			e.style.fontSize = "15px";
			e.style.color = col;
			e.style.fontWeight = "bold";
			e.style.textAlign = "center";
			if(m.params != null && m.params.important) e.style.textDecoration = "blink";
			e.innerHTML = sym;
			this.panel.appendChild(e);
			e.onclick = $bind(this,this.onClick);
			e.title = "Turn " + m.turn + ": " + m.text;
			new JQuery("#log\\.id" + this.list.length).tooltip({ delay : 0});
			this.list.add(e);
		}
	}
	,list: null
	,panel: null
	,game: null
	,ui: null
	,__class__: LogPanel
}
var MainMenu = $hxClasses["MainMenu"] = function(uivar,gvar) {
	this.ui = uivar;
	this.game = gvar;
	this.isVisible = false;
	this.window = Tools.window({ id : "mainMenuWindow", center : true, winW : UI.winWidth, winH : UI.winHeight, w : 420, h : 280, z : 20});
	Tools.label({ id : "titleLabel", text : "Evil Cult " + Game.version, w : 260, h : 30, x : 130, y : 10, container : this.window});
	Tools.button({ id : "newGameEasy", text : "START NEW GAME - EASY", w : 350, h : 30, x : 35, y : 40, container : this.window, func : $bind(this,this.onNewGame)});
	Tools.button({ id : "newGameNormal", text : "START NEW GAME - NORMAL", w : 350, h : 30, x : 35, y : 80, container : this.window, func : $bind(this,this.onNewGame)});
	Tools.button({ id : "newGameHard", text : "START NEW GAME - HARD", w : 350, h : 30, x : 35, y : 120, container : this.window, func : $bind(this,this.onNewGame)});
	Tools.button({ id : "customGame", text : "CUSTOM GAME", w : 350, h : 30, x : 35, y : 160, container : this.window, func : $bind(this,this.onCustomGame)});
	Tools.button({ id : "customGame", text : "MULTIPLAYER GAME", w : 350, h : 30, x : 35, y : 200, container : this.window, func : $bind(this,this.onMultiplayerGame)});
	this.saveButton = { style : { }};
	this.bg = Tools.bg({ w : UI.winWidth + 20, h : UI.winHeight});
	this.close = Tools.closeButton(this.window,160,240,"mainMenuClose");
	this.close.onclick = $bind(this,this.onClose);
};
MainMenu.__name__ = ["MainMenu"];
MainMenu.prototype = {
	onClose: function(event) {
		this.window.style.display = "none";
		this.bg.style.display = "none";
		this.saveButton.style.display = "none";
		this.isVisible = false;
	}
	,onKey: function(e) {
		if(e.keyCode == 49) this.onNewGameReal(0); else if(e.keyCode == 50) this.onNewGameReal(1); else if(e.keyCode == 51) this.onNewGameReal(2); else if(e.keyCode == 52) this.onCustomGame(null); else if(e.keyCode == 53) this.onMultiplayerGame(null); else if(e.keyCode == 27) this.onClose(null);
	}
	,onNewGameReal: function(dif) {
		js.Lib.document.getElementById("haxe:trace").innerHTML = "";
		this.game.restart(dif);
		this.onClose(null);
	}
	,onNewGame: function(event) {
		var id = Tools.getTarget(event).id;
		var dif = 0;
		if(id == "newGameEasy") dif = 0; else if(id == "newGameNormal") dif = 1; else dif = 2;
		this.onNewGameReal(dif);
	}
	,onSaveGame: function(event) {
		this.ui.saveMenu.show();
		this.onClose(null);
	}
	,onLoadGame: function(event) {
		this.ui.loadMenu.show();
		this.onClose(null);
	}
	,onMultiplayerGame: function(event) {
		this.ui.mpMenu.show();
		this.onClose(null);
	}
	,onCustomGame: function(event) {
		this.ui.customMenu.show();
		this.onClose(null);
	}
	,show: function() {
		this.window.style.display = "inline";
		this.bg.style.display = "inline";
		this.saveButton.style.display = this.game.isFinished?"none":"inline";
		this.isVisible = true;
	}
	,isVisible: null
	,saveButton: null
	,close: null
	,bg: null
	,window: null
	,game: null
	,ui: null
	,__class__: MainMenu
}
var Map = $hxClasses["Map"] = function(uivar,gvar) {
	this.ui = uivar;
	this.game = gvar;
	this.viewRect = { x : 0, y : 0, w : UI.mapWidth, h : UI.mapHeight};
	this.isAdvanced = false;
	var screen = js.Lib.document.getElementById("map");
	screen.style.border = "double #777 4px";
	screen.style.width = UI.mapWidth;
	screen.style.height = UI.mapHeight;
	screen.style.position = "absolute";
	screen.style.left = 240;
	screen.style.top = 5 + UI.topHeight;
	screen.style.overflow = "hidden";
	if(!screen.getContext) js.Lib.window.alert("No canvas available. Please use a canvas-compatible browser like Mozilla Firefox 3.5+ or Google Chrome.");
	screen.onclick = $bind(this,this.onClick);
	screen.onmousemove = $bind(this,this.onMove);
	screen.onmousedown = $bind(this,this.onMouseDown);
	screen.onmouseup = $bind(this,this.onMouseUp);
	screen.onmouseout = $bind(this,this.onMouseOut);
	this.tooltip = Tools.window({ id : "mapTooltipWindow", center : true, winW : UI.winWidth, winH : UI.winHeight, fontSize : 16, w : 200, h : 280, z : 3000});
	this.tooltip.style.padding = 5;
	this.tooltip.style.border = "1px solid";
	this.tooltip.style.opacity = 0.9;
	this.loadImages();
};
Map.__name__ = ["Map"];
Map.prototype = {
	clear: function() {
	}
	,getEventNode: function(event) {
		var el = js.Lib.document.getElementById("map");
		var x = event.clientX - el.offsetLeft - 4 + this.viewRect.x + js.Lib.document.body.scrollLeft;
		var y = event.clientY - el.offsetTop - 6 + this.viewRect.y + js.Lib.document.body.scrollTop;
		var node = null;
		var _g = 0, _g1 = this.game.nodes;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			if(!n.visibility[this.game.player.id]) continue;
			if(x > n.x - 10 && x <= n.x + 20 && y > n.y - 10 && y <= n.y + 20) {
				node = n;
				break;
			}
		}
		return node;
	}
	,center: function(x,y) {
		this.viewRect.x = x - this.viewRect.w / 2 | 0;
		this.viewRect.y = y - this.viewRect.h / 2 | 0;
		this.rectBounds();
		this.paint();
	}
	,rectBounds: function() {
		if(this.viewRect.x < 0) this.viewRect.x = 0;
		if(this.viewRect.y < 0) this.viewRect.y = 0;
		if(this.viewRect.x + this.viewRect.w > this.game.difficulty.mapWidth) this.viewRect.x = this.game.difficulty.mapWidth - this.viewRect.w;
		if(this.viewRect.y + this.viewRect.h > this.game.difficulty.mapHeight) this.viewRect.y = this.game.difficulty.mapHeight - this.viewRect.h;
	}
	,onClick: function(event) {
		if(this.game.isFinished) return;
		var node = this.getEventNode(event);
		if(node == null) return;
		this.game.player.activate(node);
		this.paint();
	}
	,onMouseOut: function(event) {
		this.isDrag = false;
		this.tooltip.style.display = "none";
	}
	,onMouseUp: function(event) {
		this.isDrag = false;
	}
	,onMouseDown: function(event) {
		this.isDrag = true;
		this.dragEventX = event.clientX;
		this.dragEventY = event.clientY;
	}
	,dragEventY: null
	,dragEventX: null
	,onMove: function(event) {
		if(this.isDrag) {
			this.viewRect.x -= event.clientX - this.dragEventX | 0;
			this.viewRect.y -= event.clientY - this.dragEventY | 0;
			this.dragEventX = event.clientX;
			this.dragEventY = event.clientY;
			this.rectBounds();
			this.paint();
			return;
		}
		var node = this.getEventNode(event);
		if(node == null) {
			this.tooltip.style.display = "none";
			return;
		}
		if(this.isAdvanced) return;
		var text = node.uiNode.getTooltip();
		var cnt = 0;
		var ii = 0;
		while(true) {
			var i = text.indexOf("<br>",ii);
			if(i == -1) break;
			ii = i + 1;
			cnt++;
		}
		var el = js.Lib.document.getElementById("map");
		var x = event.clientX - el.offsetLeft - 4 + js.Lib.document.body.scrollLeft;
		var y = event.clientY - el.offsetTop - 6 + js.Lib.document.body.scrollTop;
		if(x + 250 > js.Lib.window.innerWidth) x = js.Lib.window.innerWidth - 250;
		if(y + cnt * 20 + 50 > js.Lib.window.innerHeight) y = js.Lib.window.innerHeight - cnt * 20 - 50;
		this.tooltip.style.left = x;
		this.tooltip.style.top = y;
		this.tooltip.innerHTML = text;
		this.tooltip.style.height = cnt * 20;
		this.tooltip.style.display = "inline";
	}
	,hideTooltip: function() {
		this.tooltip.style.display = "none";
	}
	,paintText: function(ctx,syms,row,x,y) {
		var i = 0;
		var _g = 0;
		while(_g < syms.length) {
			var ch = syms[_g];
			++_g;
			ctx.drawImage(this.fontImage,ch * 5,row * 8,5,8,x + i * 6,y,5,8);
			i++;
		}
	}
	,paintMinimap: function(ctx) {
		var mw = 100, mh = 100, mx = UI.mapWidth - mw, my = UI.mapHeight - mh;
		var xscale = 1.0 * this.game.difficulty.mapWidth / mw;
		var yscale = 1.0 * this.game.difficulty.mapHeight / mh;
		ctx.fillStyle = "rgba(20,20,20,0.5)";
		ctx.fillRect(mx,my,mw,mh);
		var imageData = ctx.getImageData(mx,my,mw,mh);
		var pix = imageData.data;
		var _g = 0, _g1 = this.game.nodes;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			if(n.visibility[this.game.player.id]) {
				var x = n.x / xscale | 0;
				var y = n.y / yscale | 0;
				var index = (x + y * mw) * 4;
				var color = UI.nodeNeutralPixelColors;
				if(n.owner != null) color = UI.nodePixelColors[n.owner.id];
				pix[index] = color[0];
				pix[index + 1] = color[1];
				pix[index + 2] = color[2];
			}
		}
		ctx.putImageData(imageData,mx,my);
		ctx.strokeStyle = "rgb(100,100,100)";
		ctx.lineWidth = 1.0;
		ctx.strokeRect(mx + this.viewRect.x / xscale,my + this.viewRect.y / yscale,UI.mapWidth / xscale,UI.mapHeight / yscale);
	}
	,paint: function() {
		if(this.game.isFinished && this.game.turns == 0) return;
		if(Game.debugTime) this.game.timerTime = new Date().getTime();
		var el = js.Lib.document.getElementById("map");
		var ctx = el.getContext("2d");
		ctx.fillStyle = "black";
		ctx.fillRect(0,0,UI.mapWidth,UI.mapHeight);
		ctx.font = "14px Verdana";
		var $it0 = this.game.lines.iterator();
		while( $it0.hasNext() ) {
			var l = $it0.next();
			l.paint(ctx,this,this.game.player.id);
		}
		var _g = 0, _g1 = this.game.nodes;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			n.uiNode.paint(ctx);
		}
		if(this.isAdvanced) {
			ctx.font = "11px Verdana";
			var _g = 0, _g1 = this.game.nodes;
			while(_g < _g1.length) {
				var n = _g1[_g];
				++_g;
				n.uiNode.paintAdvanced(ctx);
			}
		}
		if(this.game.difficulty.mapWidth > UI.mapWidth || this.game.difficulty.mapHeight > UI.mapHeight) this.paintMinimap(ctx);
		if(Game.debugTime) console.log("map paint" + ": " + (new Date().getTime() - this.game.timerTime) + "ms");
	}
	,onLoadImage: function() {
		this.paint();
	}
	,loadImages: function() {
		this.nodeImage = new Image();
		this.nodeImage.onload = $bind(this,this.onLoadImage);
		this.nodeImage.src = "data/nodes.png";
		this.fontImage = new Image();
		this.fontImage.onload = $bind(this,this.onLoadImage);
		this.fontImage.src = "data/5x8.png";
	}
	,isAdvanced: null
	,isDrag: null
	,viewRect: null
	,tooltip: null
	,nodeImage: null
	,fontImage: null
	,game: null
	,ui: null
	,__class__: Map
}
var MultiplayerMenu = $hxClasses["MultiplayerMenu"] = function(uivar,gvar) {
	this.ui = uivar;
	this.game = gvar;
	this.isVisible = false;
	this.window = Tools.window({ id : "mpMenuWindow", center : true, winW : UI.winWidth, winH : UI.winHeight, w : 450, h : 220, z : 20});
	Tools.label({ id : "titleLabel", text : "Multiplayer game parameters", w : 350, h : 30, x : 50, y : 10, container : this.window});
	var divel = js.Lib.document.createElement("div");
	divel.style.background = "#030303";
	divel.style.left = "10";
	divel.style.top = "40";
	divel.style.width = "430";
	divel.style.height = "130";
	divel.style.position = "absolute";
	divel.style.overflow = "none";
	this.window.appendChild(divel);
	this.difElements = new List();
	var y = 10;
	var _g = 0, _g1 = MultiplayerMenu.difElementInfo;
	while(_g < _g1.length) {
		var info = _g1[_g];
		++_g;
		Tools.label({ id : "label" + info.name, text : info.title, w : 300, h : 20, x : 10, y : y, fontSize : 14, container : divel});
		var el = null;
		if(info.type == "bool") el = Tools.checkbox({ id : info.name, text : "" + Std.string(Reflect.field(Static.difficulty[2],info.name)), w : 100, h : 20, x : 320, y : y, fontSize : 14, container : divel}); else if(info.type == "select") {
			el = js.Lib.document.createElement("select");
			el.id = info.name;
			el.style.width = "100";
			el.style.height = "20";
			el.style.left = "320";
			el.style.top = "" + y;
			el.style.fontSize = 14;
			el.style.position = "absolute";
			el.style.color = "#ffffff";
			el.style.background = "#111";
			var s = "<select class=secttasks onchange='Game.instance.ui.mpMenu.onSelect(this.value)'>";
			var list = info.params;
			var _g2 = 0;
			while(_g2 < list.length) {
				var item = list[_g2];
				++_g2;
				s += "<option class=secttasks>" + item;
			}
			s += "</select>";
			el.innerHTML = s;
			divel.appendChild(el);
		} else el = Tools.textfield({ id : info.name, text : "" + Std.string(Reflect.field(Static.difficulty[2],info.name)), w : 100, h : 20, x : 320, y : y, fontSize : 14, container : divel});
		y += 30;
		this.difElements.add(el);
	}
	Tools.button({ id : "startMultiplayerGame", text : "Start", w : 80, h : 25, x : 100, y : 180, container : this.window, func : $bind(this,this.onStartGame)});
	this.bg = Tools.bg({ w : UI.winWidth + 20, h : UI.winHeight});
	this.close = Tools.closeButton(this.window,320,180,"mpMenuClose");
	this.close.onclick = $bind(this,this.onClose);
};
MultiplayerMenu.__name__ = ["MultiplayerMenu"];
MultiplayerMenu.prototype = {
	onClose: function(event) {
		this.realClose();
		this.ui.mainMenu.show();
	}
	,realClose: function() {
		this.window.style.display = "none";
		this.bg.style.display = "none";
		this.close.style.display = "none";
		this.isVisible = false;
	}
	,onKey: function(e) {
		if(e.keyCode == 27) this.onClose(null);
	}
	,show: function() {
		this.window.style.display = "inline";
		this.bg.style.display = "inline";
		this.close.style.display = "inline";
		this.isVisible = true;
	}
	,onStartGame: function(e) {
		var dif = { level : -1};
		js.Lib.document.getElementById("haxe:trace").innerHTML = "";
		var level = this.getInfoValue(MultiplayerMenu.difElementInfo[2]);
		var _g = 0, _g1 = Reflect.fields(Static.difficulty[level]);
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			dif[f] = Reflect.field(Static.difficulty[level],f);
		}
		var _g = 0, _g1 = MultiplayerMenu.difElementInfo;
		while(_g < _g1.length) {
			var info = _g1[_g];
			++_g;
			var value = this.getInfoValue(info);
			if(info.name == "numCults") dif.numCults = value; else if(info.name == "numPlayers") dif.numPlayers = value; else if(info.name == "mapSize") {
				if(value == 0) {
					dif.mapWidth = 780;
					dif.mapHeight = 580;
					dif.nodesCount = 100;
				} else if(value == 1) {
					dif.mapWidth = 1170;
					dif.mapHeight = 870;
					dif.nodesCount = 225;
				} else if(value == 2) {
					dif.mapWidth = 1560;
					dif.mapHeight = 1160;
					dif.nodesCount = 400;
				} else if(value == 3) {
					dif.mapWidth = 3120;
					dif.mapHeight = 2320;
					dif.nodesCount = 1600;
				}
			}
		}
		if(dif.numPlayers < 2) dif.numPlayers = 2;
		if(dif.numCults < 2) dif.numCults = 2;
		if(dif.numPlayers > 8) dif.numPlayers = 8;
		if(dif.numCults > 8) dif.numCults = 8;
		this.game.restart(-1,dif);
		this.realClose();
	}
	,getInfoValue: function(info) {
		var el = null;
		var $it0 = this.difElements.iterator();
		while( $it0.hasNext() ) {
			var e = $it0.next();
			if(e.id == info.name) {
				el = e;
				break;
			}
		}
		var value = null;
		if(info.type == "int") value = Std.parseInt(el.value); else if(info.type == "float") value = Std.parseFloat(el.value); else if(info.type == "select") {
			var list = info.params;
			var id = -1;
			var _g1 = 0, _g = list.length;
			while(_g1 < _g) {
				var i = _g1++;
				if(list[i] == el.value) {
					value = i;
					break;
				}
			}
		} else if(info.type == "bool") value = el.checked;
		return value;
	}
	,difElements: null
	,isVisible: null
	,close: null
	,bg: null
	,window: null
	,game: null
	,ui: null
	,__class__: MultiplayerMenu
}
var Music = $hxClasses["Music"] = function() {
	this.isInited = false;
	this.trackID = -1;
	this.playlist = [["Introspective","Occlusion","Fluid Dynamics","http://kahvi.micksam7.com/mp3/kahvi051a_intro-fluid_dynamics.mp3","http://www.kahvi.org/releases.php?release_number=051"],["Introspective","Occlusion","Contain Release","http://kahvi.micksam7.com/mp3/kahvi051b_intro-contain_release.mp3","http://www.kahvi.org/releases.php?release_number=051"],["Introspective","Occlusion","Wave Propagation","http://kahvi.micksam7.com/mp3/kahvi051c_intro-wave_propagation.mp3","http://www.kahvi.org/releases.php?release_number=051"],["Introspective","Analogy","Mail Order Monsters","http://kahvi.micksam7.com/mp3/kahvi080a_intro-mail_order_monsters.mp3","http://www.kahvi.org/releases.php?release_number=080"],["Introspective","Analogy","Cartographer","http://kahvi.micksam7.com/mp3/kahvi080b_intro-cartographer.mp3","http://www.kahvi.org/releases.php?release_number=080"],["Introspective","Analogy","Gone Awry","http://kahvi.micksam7.com/mp3/kahvi080c_intro-analogy_gone_awry.mp3","http://www.kahvi.org/releases.php?release_number=080"],["Introspective","Analogy","Bearing Your Name","http://kahvi.micksam7.com/mp3/kahvi080d_intro-bearing_your_name.mp3","http://www.kahvi.org/releases.php?release_number=080"],["Introspective","Crossing Borders","Crossing Borders","http://kahvi.micksam7.com/mp3/kahvi094a_introspective-crossing_borders.mp3","http://www.kahvi.org/releases.php?release_number=094"],["Introspective","Crossing Borders","Medina Of Tunis","http://kahvi.micksam7.com/mp3/kahvi094b_introspective-medina_of_tunis.mp3","http://www.kahvi.org/releases.php?release_number=094"],["Introspective","Black Mesa Winds","Crepuscular Activity","http://kahvi.micksam7.com/mp3/kahvi236a_introspective-crepuscular_activity.mp3","http://www.kahvi.org/releases.php?release_number=236"],["Introspective","Black Mesa Winds","Vanishing Point","http://kahvi.micksam7.com/mp3/kahvi236b_introspective-vanishing_point.mp3","http://www.kahvi.org/releases.php?release_number=236"],["Introspective","Black Mesa Winds","Black Mesa Winds","http://kahvi.micksam7.com/mp3/kahvi236c_introspective-black_mesa_winds.mp3","http://www.kahvi.org/releases.php?release_number=236"],["Introspective","Black Mesa Winds","Convection","http://kahvi.micksam7.com/mp3/kahvi236d_introspective-convection.mp3","http://www.kahvi.org/releases.php?release_number=236"],["Introspective","Black Mesa Winds","Sky City","http://kahvi.micksam7.com/mp3/kahvi236e_introspective-sky_city.mp3","http://www.kahvi.org/releases.php?release_number=236"],["Introspective","Black Mesa Winds","Predator Distribution","http://kahvi.micksam7.com/mp3/kahvi236f_introspective-predator_distribution.mp3","http://www.kahvi.org/releases.php?release_number=236"],["Introspective","Black Mesa Winds","Fahrenheit","http://kahvi.micksam7.com/mp3/kahvi236g_introspective-fahrenheit.mp3","http://www.kahvi.org/releases.php?release_number=236"],["Introspective","Black Mesa Winds","Riverside","http://kahvi.micksam7.com/mp3/kahvi236h_introspective-riverside.mp3","http://www.kahvi.org/releases.php?release_number=236"],["Introspective","Black Mesa Winds","Xerophytes","http://kahvi.micksam7.com/mp3/kahvi236i_introspective-xerophytes.mp3","http://www.kahvi.org/releases.php?release_number=236"],["Introspective","Black Mesa Winds","Differential Erosion","http://kahvi.micksam7.com/mp3/kahvi236j_introspective-differential_erosion.mp3","http://www.kahvi.org/releases.php?release_number=236"],["Introspective","Black Mesa Winds","Overwhelming Sky","http://kahvi.micksam7.com/mp3/kahvi236k_introspective-overwhelming_sky.mp3","http://www.kahvi.org/releases.php?release_number=236"],["Curious Inversions","Whom","Antibiotic Resistance","http://kahvi.micksam7.com/mp3/kahvi254a_curious_inversions-antibiotic_resistance.mp3","http://www.kahvi.org/releases.php?release_number=254"],["Curious Inversions","Whom","Antiquity","http://kahvi.micksam7.com/mp3/kahvi254b_curious_inversions-antiquity.mp3","http://www.kahvi.org/releases.php?release_number=254"],["Curious Inversions","Whom","Geonosian Advance","http://kahvi.micksam7.com/mp3/kahvi254c_curious_inversions-geonosian_advance.mp3","http://www.kahvi.org/releases.php?release_number=254"],["Curious Inversions","Whom","In The Scholar's Wake","http://kahvi.micksam7.com/mp3/kahvi254d_curious_inversions-in_the_scholars_wake.mp3","http://www.kahvi.org/releases.php?release_number=254"],["Curious Inversions","Whom","Predators","http://kahvi.micksam7.com/mp3/kahvi254e_curious_inversions-predators.mp3","http://www.kahvi.org/releases.php?release_number=254"],["Curious Inversions","Whom","Sissot Eclipse","http://kahvi.micksam7.com/mp3/kahvi254f_curious_inversions-sissot_eclipse.mp3","http://www.kahvi.org/releases.php?release_number=254"],["Curious Inversions","Whom","Voluntary","http://kahvi.micksam7.com/mp3/kahvi254g_curious_inversions-voluntary.mp3","http://www.kahvi.org/releases.php?release_number=254"],["Curious Inversions","Whom","Windslak","http://kahvi.micksam7.com/mp3/kahvi254h_curious_inversions-windslak.mp3","http://www.kahvi.org/releases.php?release_number=254"],["Introspective","Gewesen","Gewesen","http://kahvi.micksam7.com/mp3/kahvi176a_introspective-gewesen.mp3","http://www.kahvi.org/releases.php?release_number=176"],["Introspective","Gewesen","Undocumented","http://kahvi.micksam7.com/mp3/kahvi176b_introspective-undocumented.mp3","http://www.kahvi.org/releases.php?release_number=176"],["Introspective","Gewesen","Gewesen pt2","http://kahvi.micksam7.com/mp3/kahvi176c_introspective-gewesen_part2.mp3","http://www.kahvi.org/releases.php?release_number=176"],["Introspective","Gewesen","Specular Highlights","http://kahvi.micksam7.com/mp3/kahvi176d_introspective-specular_highlights.mp3","http://www.kahvi.org/releases.php?release_number=176"],["Introspective","Gewesen","The Leaves In The Rain","http://kahvi.micksam7.com/mp3/kahvi176e_introspective-the_leaves_in_the_rain.mp3","http://www.kahvi.org/releases.php?release_number=176"]];
};
Music.__name__ = ["Music"];
Music.prototype = {
	getPage: function() {
		return this.playlist[this.trackID][4];
	}
	,getName: function() {
		var a = this.playlist[this.trackID];
		return "<span style='color: #080'>Track:</span> " + a[2] + "<br><span style='color: #080'>Album:</span> " + a[1] + "<br><span style='color: #080'>Artist:</span> " + a[0];
	}
	,pause: function() {
		SoundManager.togglePause("music");
	}
	,stop: function() {
		SoundManager.stop("music");
	}
	,play: function() {
		if(this.trackID == -1) this.random(); else SoundManager.play("music",{ onfinish : $bind(this,this.random)});
	}
	,onRandom: function() {
	}
	,random: function() {
		SoundManager.destroySound("music");
		while(true) {
			var t = Math.random() * (this.playlist.length - 1) | 0;
			if(t != this.trackID) {
				this.trackID = t;
				break;
			}
		}
		SoundManager.createSound({ id : "music", url : this.playlist[this.trackID][3], volume : 100});
		SoundManager.play("music",{ onfinish : $bind(this,this.random)});
		this.onRandom();
	}
	,init: function() {
		this.isInited = true;
	}
	,playlist: null
	,trackID: null
	,isInited: null
	,__class__: Music
}
var Node = $hxClasses["Node"] = function(gvar,uivar,newx,newy,index) {
	this.game = gvar;
	this.ui = uivar;
	this.id = index;
	this.lines = new List();
	this.links = new List();
	this.visibility = [];
	var _g1 = 0, _g = this.game.difficulty.numCults;
	while(_g1 < _g) {
		var i = _g1++;
		this.visibility.push(false);
	}
	this.isKnown = [];
	var _g1 = 0, _g = this.game.difficulty.numCults;
	while(_g1 < _g) {
		var i = _g1++;
		this.isKnown.push(false);
	}
	this.owner = null;
	this.x = newx;
	this.y = newy;
	this.centerX = this.x + Math.round(UI.markerWidth / 2);
	this.centerY = this.y + Math.round(UI.markerHeight / 2);
	this.generateAttributes();
	this.uiNode = new UINode(this.game,this.ui,this);
};
Node.__name__ = ["Node"];
Node.prototype = {
	clearLines: function() {
		if(this.owner == null) return;
		var $it0 = this.lines.iterator();
		while( $it0.hasNext() ) {
			var l = $it0.next();
			l.clear();
			this.game.lines.remove(l);
			l.startNode.lines.remove(l);
			l.endNode.lines.remove(l);
		}
	}
	,showLinks: function() {
		var $it0 = this.links.iterator();
		while( $it0.hasNext() ) {
			var n = $it0.next();
			n.setVisible(this.owner,true);
		}
	}
	,paintLines: function() {
		var hasLine = false;
		var $it0 = this.links.iterator();
		while( $it0.hasNext() ) {
			var n = $it0.next();
			if(n.owner == this.owner) {
				var l = Line.create(this.ui.map,this.owner,n,this);
				this.game.lines.add(l);
				n.lines.add(l);
				this.lines.add(l);
				var _g = 0, _g1 = this.game.cults;
				while(_g < _g1.length) {
					var c = _g1[_g];
					++_g;
					if(n.visibility[c.id] || this.visibility[c.id]) l.visibility[c.id] = true;
				}
				hasLine = true;
			}
		}
		if(hasLine) return;
		var dist = 10000;
		var nc = null;
		var $it1 = this.owner.nodes.iterator();
		while( $it1.hasNext() ) {
			var n = $it1.next();
			if(this != n && this.distance(n) < dist) {
				dist = this.distance(n);
				nc = n;
			}
		}
		var l = Line.create(this.ui.map,this.owner,nc,this);
		this.game.lines.add(l);
		nc.lines.add(l);
		this.lines.add(l);
		var _g = 0, _g1 = this.game.cults;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			if(nc.visibility[c.id] || this.visibility[c.id]) l.visibility[c.id] = true;
		}
	}
	,updateLinkVisibility: function(cult) {
		var $it0 = this.links.iterator();
		while( $it0.hasNext() ) {
			var n = $it0.next();
			if(n.visibility[cult.id] && n.owner != cult) {
				var vis = false;
				var $it1 = n.links.iterator();
				while( $it1.hasNext() ) {
					var n2 = $it1.next();
					if(n2.owner == cult) {
						vis = true;
						break;
					}
				}
				n.setVisible(cult,vis);
			}
		}
		var hasLinks = false;
		var $it2 = this.links.iterator();
		while( $it2.hasNext() ) {
			var n2 = $it2.next();
			if(n2.owner == cult) {
				this.setVisible(cult,true);
				hasLinks = true;
				break;
			}
		}
		if(!hasLinks) this.setVisible(cult,false);
	}
	,upgrade: function() {
		if(this.level >= Game.followerNames.length - 1) return;
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.power[i] > 0) this.power[i]++;
		}
		this.level++;
	}
	,isVisible: function(c) {
		return this.visibility[c.id];
	}
	,setVisible: function(cult,v) {
		this.visibility[cult.id] = v;
		this.uiNode.setVisible(cult,v);
		if(!cult.isAI) {
			if(Game.mapVisible) v = true;
			var $it0 = this.lines.iterator();
			while( $it0.hasNext() ) {
				var l = $it0.next();
				l.visibility[cult.id] = v;
			}
			if(this.owner != null && !this.owner.isDiscovered[cult.id]) cult.discover(this.owner);
		}
	}
	,removeOwner: function() {
		if(this.owner == null) return;
		var prevOwner = this.owner;
		this.clearLines();
		this.owner.nodes.remove(this);
		this.owner = null;
		this.level = 0;
		this.update();
		this.updateLinkVisibility(prevOwner);
		var $it0 = this.links.iterator();
		while( $it0.hasNext() ) {
			var n = $it0.next();
			n.update();
		}
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.power[i] > 2) this.power[i] = 2;
		}
		if(prevOwner != null) prevOwner.loseNode(this);
	}
	,setOwner: function(c) {
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
		this.isKnown[this.owner.id] = true;
		this.owner.nodes.add(this);
		this.update();
		this.showLinks();
		if(prevOwner != null) this.updateLinkVisibility(prevOwner);
		if(this.isGenerator) {
			var _g = this.owner;
			_g.setAwareness(_g.awareness + 2);
		} else {
			var _g = this.owner, _g1 = _g.awareness;
			_g.setAwareness(_g1 + 1);
			_g1;
		}
		if(!this.owner.isAI) this.ui.updateStatus();
		this.paintLines();
		var $it0 = this.links.iterator();
		while( $it0.hasNext() ) {
			var n = $it0.next();
			n.update();
		}
		if(prevOwner != null) prevOwner.loseNode(this,this.owner);
		if(this.visibility[this.game.player.id] && !this.owner.isDiscovered[this.game.player.id]) this.game.player.discover(this.owner);
	}
	,setGenerator: function(isgen) {
		this.isGenerator = isgen;
		this.update();
	}
	,distance: function(node) {
		return Math.sqrt((node.x - this.x) * (node.x - this.x) + (node.y - this.y) * (node.y - this.y));
	}
	,update: function() {
		this.isProtected = false;
		if(this.isGenerator && this.owner != null) {
			var cnt = 0;
			var $it0 = this.links.iterator();
			while( $it0.hasNext() ) {
				var n = $it0.next();
				if(n.owner == this.owner) cnt++;
			}
			if(cnt >= 3) this.isProtected = true;
		}
	}
	,save: function() {
		var obj = { id : this.id, p : this.power, x : this.x, y : this.y};
		if(this.owner != null) obj.o = this.owner.id;
		if(this.level > 0) obj.l = this.level;
		var vis = [];
		var savevis = false;
		var _g = 0, _g1 = this.visibility;
		while(_g < _g1.length) {
			var v = _g1[_g];
			++_g;
			vis.push(v?1:0);
			if(v) savevis = true;
		}
		if(savevis) obj.vis = vis;
		if(this.isGenerator) obj.pg = this.powerGenerated;
		return obj;
	}
	,load: function(n) {
		this.power = n.p;
		if(n.l != null) this.level = n.l;
		if(n.vis != null) {
			var vis = n.vis;
			this.visibility = [];
			var i = 0;
			var _g = 0;
			while(_g < vis.length) {
				var v = vis[_g];
				++_g;
				this.visibility.push(v == 1?true:false);
				if(v == 1) this.uiNode.setVisible(this.game.cults[i],true);
				i++;
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
	,makeGenerator: function() {
		var powerIndex = 0;
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var ii = _g1++;
			if(this.power[ii] > 0) {
				this.power[ii]++;
				powerIndex = ii;
			}
		}
		var ii = -1;
		while(true) {
			ii = Math.round((Game.numPowers - 1) * Math.random());
			if(ii != powerIndex) break;
		}
		this.powerGenerated[ii] = 1;
		this.setGenerator(true);
	}
	,generateAttributes: function() {
		this.name = GenName.generate();
		this.job = Node.jobs[Math.random() * (Node.jobs.length - 1) | 0];
		this.isGenerator = false;
		this.isTempGenerator = false;
		this.isKnown = [];
		var _g1 = 0, _g = this.game.difficulty.numCults;
		while(_g1 < _g) {
			var i = _g1++;
			this.isKnown.push(false);
		}
		this.power = [0,0,0];
		this.powerGenerated = [0,0,0];
		this.level = 0;
		var index = Math.round((Game.numPowers - 1) * Math.random());
		this.power[index] = 1;
	}
	,links: null
	,lines: null
	,sect: null
	,owner: null
	,level: null
	,isProtected: null
	,isTempGenerator: null
	,isGenerator: null
	,isKnown: null
	,visibility: null
	,centerY: null
	,centerX: null
	,y: null
	,x: null
	,powerGenerated: null
	,power: null
	,job: null
	,name: null
	,id: null
	,uiNode: null
	,game: null
	,ui: null
	,__class__: Node
}
var Options = $hxClasses["Options"] = function(c) {
	this.cult = c;
	this.list = new Hash();
};
Options.__name__ = ["Options"];
Options.prototype = {
	getBool: function(key) {
		var ret = this.list.get(key);
		if(ret == null) return false;
		return ret;
	}
	,get: function(key) {
		return this.list.get(key);
	}
	,set: function(key,val) {
		if(val == false) this.list.remove(key); else this.list.set(key,val);
	}
	,list: null
	,cult: null
	,__class__: Options
}
var OptionsMenu = $hxClasses["OptionsMenu"] = function(uivar,gvar) {
	this.ui = uivar;
	this.game = gvar;
	this.isVisible = false;
	this.window = Tools.window({ id : "optionMenuWindow", center : true, winW : UI.winWidth, winH : UI.winHeight, w : 1000, h : 500, z : 20});
};
OptionsMenu.__name__ = ["OptionsMenu"];
OptionsMenu.prototype = {
	realClose: function() {
		this.window.style.display = "none";
		this.bg.style.display = "none";
		this.close.style.display = "none";
		this.isVisible = false;
	}
	,onKey: function(e) {
		if(e.keyCode == 27) this.onClose(null);
	}
	,onClose: function(e) {
		var dif = { level : -1};
		js.Lib.document.getElementById("haxe:trace").innerHTML = "";
		var _g = 0, _g1 = OptionsMenu.elementInfo;
		while(_g < _g1.length) {
			var info = _g1[_g];
			++_g;
			var el = null;
			var $it0 = this.elements.iterator();
			while( $it0.hasNext() ) {
				var e1 = $it0.next();
				if(e1.id == info.name) {
					el = e1;
					break;
				}
			}
			var value = null;
			if(info.type == "int") value = Std.parseInt(el.value); else if(info.type == "float") value = Std.parseFloat(el.value); else if(info.type == "bool") value = el.checked;
			this.game.player.options.set(info.name,value);
			if(info.name == "sectAdvisor" && !value) {
				var $it1 = this.game.player.sects.iterator();
				while( $it1.hasNext() ) {
					var s = $it1.next();
					s.taskImportant = false;
				}
			}
		}
		this.game.applyPlayerOptions();
		this.realClose();
	}
	,show: function() {
		this.window.innerHTML = "";
		Tools.label({ id : "titleLabel", text : "Game Options", w : 300, h : 30, x : 420, y : 10, container : this.window});
		var divel = js.Lib.document.createElement("div");
		divel.style.background = "#030303";
		divel.style.left = "10";
		divel.style.top = "40";
		divel.style.width = "980";
		divel.style.height = "400";
		divel.style.position = "absolute";
		divel.style.overflow = "auto";
		this.window.appendChild(divel);
		this.elements = new List();
		var y = 10;
		var _g = 0, _g1 = OptionsMenu.elementInfo;
		while(_g < _g1.length) {
			var info = _g1[_g];
			++_g;
			Tools.label({ id : "label" + info.name, text : info.title, w : 300, h : 20, x : 10, y : y, fontSize : 14, container : divel});
			var el = null;
			if(info.type == "bool") {
				el = Tools.checkbox({ id : info.name, w : 70, h : 20, x : 320, y : y, fontSize : 14, container : divel});
				el.checked = this.game.player.options.getBool(info.name);
			} else el = Tools.textfield({ id : info.name, text : "" + Std.string(this.game.player.options.get(info.name)), w : 70, h : 20, x : 320, y : y, fontSize : 14, container : divel});
			Tools.label({ id : "note" + info.name, text : info.note, w : 540, h : 20, x : 410, y : y, fontSize : 14, bold : false, container : divel});
			y += 30;
			this.elements.add(el);
		}
		this.bg = Tools.bg({ w : UI.winWidth + 20, h : UI.winHeight});
		this.close = Tools.closeButton(this.window,460,460,"optionMenuClose");
		this.close.onclick = $bind(this,this.onClose);
		this.window.style.display = "inline";
		this.bg.style.display = "inline";
		this.close.style.display = "inline";
		this.isVisible = true;
	}
	,elements: null
	,isVisible: null
	,close: null
	,bg: null
	,window: null
	,game: null
	,ui: null
	,__class__: OptionsMenu
}
var Reflect = $hxClasses["Reflect"] = function() { }
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compare = function(a,b) {
	return a == b?0:a > b?1:-1;
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && !v.__enum__ || t == "function" && (v.__name__ || v.__ename__);
}
Reflect.deleteField = function(o,f) {
	if(!Reflect.hasField(o,f)) return false;
	delete(o[f]);
	return true;
}
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0, _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
}
var SaveMenu = $hxClasses["SaveMenu"] = function(uivar,gvar) {
	this.ui = uivar;
	this.game = gvar;
	this.isVisible = false;
	this.window = Tools.window({ id : "saveMenuWindow", center : true, winW : UI.winWidth, winH : UI.winHeight, w : 420, h : 320, z : 25});
	Tools.label({ id : "saveLabel", text : "Key", w : 60, h : 30, x : 35, y : 30, container : this.window});
	this.key = Tools.textfield({ id : "saveKey", text : getCookie("owner"), w : 205, h : 30, x : 85, y : 30, container : this.window});
	this.key.onclick = $bind(this,this.onKeyClick);
	Tools.button({ id : "saveRefresh", text : "Refresh", w : 100, h : 30, x : 300, y : 30, container : this.window, func : $bind(this,this.onRefresh)});
	this.noKey = Tools.label({ id : "loadLabel2", text : "Type in key to proceed.", w : 270, h : 30, x : 90, y : 150, container : this.window});
	this.saves = new Array();
	this.saveButtons = new Array();
	this.delButtons = new Array();
	var _g1 = 0, _g = UI.maxSaves;
	while(_g1 < _g) {
		var i = _g1++;
		var b = Tools.button({ id : "save" + i, text : "...", w : 330, h : 30, x : 35, y : 70 + 40 * i, container : this.window, func : $bind(this,this.onSaveGame)});
		this.saveButtons.push(b);
		var b2 = Tools.button({ id : "del" + i, text : "X", w : 20, h : 30, x : 380, y : 70 + 40 * i, container : this.window, func : $bind(this,this.onDelGame)});
		this.delButtons.push(b2);
	}
	this.bg = Tools.bg({ w : UI.winWidth + 20, h : UI.winHeight});
	this.close = Tools.closeButton(this.window,180,280,"saveMenuClose");
	this.close.onclick = $bind(this,this.onClose);
};
SaveMenu.__name__ = ["SaveMenu"];
SaveMenu.prototype = {
	onClose: function(event) {
		this.window.style.display = "none";
		this.bg.style.display = "none";
		this.close.style.display = "none";
		this.noKey.style.display = "none";
		var _g = 0, _g1 = this.delButtons;
		while(_g < _g1.length) {
			var b = _g1[_g];
			++_g;
			b.style.display = "none";
		}
		var _g = 0, _g1 = this.saveButtons;
		while(_g < _g1.length) {
			var b = _g1[_g];
			++_g;
			b.style.display = "none";
		}
		this.isVisible = false;
	}
	,onKey: function(e) {
		if(this.keyFocused) return;
		if(e.keyCode == 49) this.onSaveReal(0); else if(e.keyCode == 50) this.onSaveReal(1); else if(e.keyCode == 51) this.onSaveReal(2); else if(e.keyCode == 52) this.onSaveReal(3); else if(e.keyCode == 53) this.onSaveReal(4); else if(e.keyCode == 27) this.onClose(null);
	}
	,onDelReal: function(n) {
		var save = this.saves[n];
		var req = new js.XMLHttpRequest();
		req.open("GET","/save.delete?owner=" + getCookie("owner") + "&id=" + save.id,false);
		req.send(null);
		var text = req.responseText;
		this.show();
	}
	,onDelGame: function(event) {
		var b = Tools.getTarget(event);
		var n = Std.parseInt(b.id.substring(3));
		this.onDelReal(n);
	}
	,onSaveReal: function(n) {
		var save = this.saves[n];
		var id = 0;
		if(save != null) id = save.id;
		var name = HxOverrides.dateStr(new Date());
		var req = new js.XMLHttpRequest();
		req.open("POST","/save.save?owner=" + getCookie("owner") + "&id=" + id + "&name=" + name + "&version=" + Game.version,false);
		var obj = this.game.save();
		var str = JSON.stringify(obj);
		req.send(str);
		var text = req.responseText;
		if(text == "TooBig") {
			this.ui.alert("Save file too big (" + (str.length / 1024 | 0) + "kb)! Contact me to raise limit.");
			return;
		} else if(text == "TooManySaves") {
			this.ui.alert("Too many saved games already.");
			return;
		}
		this.onClose(null);
	}
	,onSaveGame: function(event) {
		var b = Tools.getTarget(event);
		var n = Std.parseInt(b.id.substring(4));
		this.onSaveReal(n);
	}
	,onRefresh: function(event) {
		setCookie("owner",this.key.value,new Date(2015, 0, 0, 0, 0, 0, 0));
		this.show();
	}
	,onKeyClick: function() {
		this.keyFocused = true;
	}
	,show: function() {
		var _g = 0, _g1 = this.delButtons;
		while(_g < _g1.length) {
			var b = _g1[_g];
			++_g;
			b.style.display = "none";
		}
		if(getCookie("owner") != "" && getCookie("owner") != null) {
			var req = new js.XMLHttpRequest();
			req.open("GET","/save.list?owner=" + getCookie("owner"),false);
			req.send(null);
			var text = req.responseText;
			var list = JSON.parse(text);
			this.saves = list;
			var _g = 0, _g1 = this.saveButtons;
			while(_g < _g1.length) {
				var b = _g1[_g];
				++_g;
				b.style.display = "inline";
				b.innerHTML = "---";
			}
			var i = 0;
			var _g = 0;
			while(_g < list.length) {
				var item = list[_g];
				++_g;
				var b = this.saveButtons[i];
				if(b == null) break;
				b.innerHTML = item.name;
				this.delButtons[i].style.display = "inline";
				i++;
			}
			this.noKey.style.display = "none";
		} else {
			var _g = 0, _g1 = this.saveButtons;
			while(_g < _g1.length) {
				var b = _g1[_g];
				++_g;
				b.style.display = "none";
			}
			this.noKey.style.display = "inline";
		}
		this.key.value = getCookie("owner");
		this.window.style.display = "inline";
		this.bg.style.display = "inline";
		this.close.style.display = "inline";
		this.isVisible = true;
		this.keyFocused = false;
	}
	,isVisible: null
	,saves: null
	,delButtons: null
	,saveButtons: null
	,keyFocused: null
	,noKey: null
	,key: null
	,close: null
	,bg: null
	,window: null
	,game: null
	,ui: null
	,__class__: SaveMenu
}
var SectsInfo = $hxClasses["SectsInfo"] = function(uivar,gvar) {
	this.ui = uivar;
	this.game = gvar;
	this.isVisible = false;
	this.selectedNode = null;
	this.selectedNodeID = 0;
	this.window = Tools.window({ id : "windowSects", center : true, winW : UI.winWidth, winH : UI.winHeight, fontSize : 16, bold : true, w : 800, h : 520, z : 20});
	this.window.style.display = "none";
	this.window.style.padding = "5 5 5 5";
	this.window.style.border = "4px double #ffffff";
	this.list = js.Lib.document.createElement("div");
	this.list.style.overflow = "auto";
	this.list.style.position = "absolute";
	this.list.style.left = 10;
	this.list.style.top = 10;
	this.list.style.width = 790;
	this.list.style.height = 480;
	this.list.style.background = "#111";
	this.window.appendChild(this.list);
	this.text = js.Lib.document.createElement("div");
	this.text.style.overflow = "auto";
	this.text.style.position = "absolute";
	this.text.style.textAlign = "center";
	this.text.style.left = 120;
	this.text.style.top = 498;
	this.text.style.width = 130;
	this.text.style.height = 20;
	this.text.style.background = "#111";
	this.window.appendChild(this.text);
	this.menu = Tools.window({ id : "sectsMenuWindow", center : true, winW : UI.winWidth, winH : UI.winHeight, fontSize : 16, w : 200, h : 280, z : 3000});
	this.menu.style.padding = 5;
	this.menu.style.border = "1px solid";
	this.menu.style.opacity = 0.9;
	var close = Tools.closeButton(this.window,365,493,"infoClose");
	close.onclick = $bind(this,this.onClose);
};
SectsInfo.__name__ = ["SectsInfo"];
SectsInfo.e = function(s) {
	return js.Lib.document.getElementById(s);
}
SectsInfo.create = function(parent,s) {
	var el = js.Lib.document.createElement(s);
	parent.appendChild(el);
	return el;
}
SectsInfo.prototype = {
	onAdvisor: function(leaderID,checked) {
		var $it0 = this.game.player.sects.iterator();
		while( $it0.hasNext() ) {
			var sect = $it0.next();
			if(sect.leader.id == leaderID) {
				sect.isAdvisor = checked;
				break;
			}
		}
	}
	,show: function() {
		var s = "<table style=\"overflow:auto\" cellspacing=3 cellpadding=3 width=100%>" + "<tr><th>Name<th>Leader<th>LVL<th>Size<th>Current Task<th>AI";
		var $it0 = this.game.player.sects.iterator();
		while( $it0.hasNext() ) {
			var sect = $it0.next();
			s += "<tr style=\"background:black\"><td>" + sect.name + "<td>" + sect.leader.name + "<td style=\"text-align:center\">" + (sect.level + 1) + "<td style=\"text-align:center\">" + sect.size + "/" + sect.getMaxSize() + " (+" + sect.getGrowth() + ")" + "<td style=\"te1xt-align:center\">";
			s += "<select class=secttasks onchange='Game.instance.ui.sects.onSelect(this.value)'>";
			var _g = 0, _g1 = this.game.sectTasks;
			while(_g < _g1.length) {
				var t = _g1[_g];
				++_g;
				if(t.type == "investigator" && !this.game.player.hasInvestigator) continue;
				if(t.level > sect.level) continue;
				if(t.type == "cult") {
					var _g2 = 0, _g3 = this.game.cults;
					while(_g2 < _g3.length) {
						var c = _g3[_g2];
						++_g2;
						if(c == this.game.player || !c.isDiscovered[this.game.player.id] || c.isDead) continue;
						var ok = t.check(this.game.player,sect,c);
						if(!ok) continue;
						s += "<option class=secttasks value=" + sect.leader.id + "." + t.id + "-" + c.id + (sect.task != null && sect.task.id == t.id && sect.taskTarget == c?" selected":"") + ">" + t.name + ": " + c.name;
					}
				} else if(t.type == "investigator") {
					var ok = t.check(this.game.player,sect,null);
					if(!ok) continue;
					s += "<option class=secttasks value=" + sect.leader.id + "." + t.id + "-0 " + (sect.task != null && sect.task.id == t.id?" selected":"") + ">" + t.name;
				} else s += "<option class=secttasks value=" + sect.leader.id + "." + t.id + "-0" + (sect.task != null && sect.task.id == t.id?" selected":"") + ">" + t.name;
				if(sect.task != null && sect.task.id == t.id && !sect.task.isInfinite) s += " (" + sect.taskPoints + "/" + sect.task.points + ")";
			}
			s += "</select>";
			s += "<td style=\"text-align:center\">" + "<input type=\"checkbox\" name=\"sectai" + sect.leader.id + "\" " + (sect.isAdvisor?"checked":"") + " onchange=\"Game.instance.ui.sects.onAdvisor(" + sect.leader.id + ", this.checked)\">";
		}
		s += "</table>";
		this.list.innerHTML = s;
		this.text.innerHTML = "Sects: " + this.game.player.sects.length + "/" + (this.game.player.nodes.length / 4 | 0);
		this.window.style.display = "inline";
		this.isVisible = true;
	}
	,onSelect: function(strID) {
		var dotIndex = strID.indexOf(".");
		var dashIndex = strID.indexOf("-");
		var nodeID = Std.parseInt(HxOverrides.substr(strID,0,dotIndex));
		var taskID = HxOverrides.substr(strID,dotIndex + 1,dashIndex - dotIndex - 1);
		var targetID = Std.parseInt(HxOverrides.substr(strID,dashIndex + 1,null));
		var sect = null;
		var $it0 = this.game.player.sects.iterator();
		while( $it0.hasNext() ) {
			var s = $it0.next();
			if(s.leader.id == nodeID) {
				sect = s;
				sect.isAdvisor = false;
				break;
			}
		}
		if(taskID == "doNothing") {
			sect.clearTask();
			this.show();
			return;
		}
		var task = null;
		var _g = 0, _g1 = this.game.sectTasks;
		while(_g < _g1.length) {
			var t = _g1[_g];
			++_g;
			if(t.id == taskID) {
				task = t;
				break;
			}
		}
		if(task == null) return;
		var target = null;
		if(task.type == "cult") target = this.game.cults[targetID];
		sect.setTask(task,target);
		this.show();
	}
	,onClose: function(event) {
		this.window.style.display = "none";
		this.isVisible = false;
		this.list.innerHTML = "";
	}
	,onKey: function(e) {
		if(e.keyCode == 27 || e.keyCode == 13 || e.keyCode == 32 || e.keyCode == 83) {
			this.onClose(null);
			return;
		}
	}
	,selectedNodeID: null
	,selectedNode: null
	,isVisible: null
	,menu: null
	,text: null
	,list: null
	,window: null
	,game: null
	,ui: null
	,__class__: SectsInfo
}
var Static = $hxClasses["Static"] = function() { }
Static.__name__ = ["Static"];
var UI = $hxClasses["UI"] = function(g) {
	this.game = g;
	this.config = new Config();
};
UI.__name__ = ["UI"];
UI.powerName = function(i,isShort) {
	return "<span style='color:" + UI.powerColors[i] + "'>" + (isShort?Game.powerShortNames[i]:Game.powerNames[i]) + "</span>";
}
UI.cultName = function(i,info) {
	return "<span style='color:" + UI.cultColors[i] + "'>" + info.name + "</span>";
}
UI.e = function(s) {
	return js.Lib.document.getElementById(s);
}
UI.prototype = {
	track: function(action,label,value) {
		action = "cult " + action + " " + Game.version;
		if(label == null) label = "";
		if(value == null) value = 0;
		pageTracker._trackEvent("Evil Cult",action,label,value);
	}
	,clearLog: function() {
		this.logWindow.clear();
		this.logPanel.clear();
	}
	,log2: function(cultOrigin,s,params) {
		var _g = 0, _g1 = this.game.cults;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			if(c.isDiscovered[cultOrigin.id] || cultOrigin.isDiscovered[c.id]) {
				c.log(s);
				if(params != null && params.type == "sect" && c.options.getBool("logPanelSkipSects")) continue;
				c.logPanel({ id : -1, old : false, type : null, text : s, obj : cultOrigin, turn : this.game.turns + 1, params : params});
			}
		}
	}
	,alert: function(s,shadow,shadowOpacity) {
		this.alertWindow.show(s,shadow,shadowOpacity);
	}
	,finish: function(cult,state) {
		this.map.paint();
		var msg = "<div style='text-size: 20px'><b>Game over</b></div><br>";
		if(state == "summon" && !cult.isAI) {
			msg += "The stars were right. The Elder God was summoned in " + this.game.turns + " turns.";
			msg += "<br><br><center><b>YOU WON</b></center>";
			this.track("winGame diff:" + this.game.difficultyLevel,"summon",this.game.turns);
		} else if(state == "summon" && cult.isAI) {
			msg += cult.getFullName() + " has completed the " + Static.rituals[0].name + ".<br><br>" + cult.info.summonFinish;
			msg += "<br><br><center><b>YOU LOSE</b></center>";
			this.track("loseGame diff:" + this.game.difficultyLevel,"summon",this.game.turns);
		} else if(state == "conquer" && !cult.isAI) {
			msg += cult.getFullName() + " has taken over the world in " + this.game.turns + " turns. The Elder Gods are pleased.";
			msg += "<br><br><center><b>YOU WON</b></center>";
			this.track("winGame diff:" + this.game.difficultyLevel,"conquer",this.game.turns);
		} else if(state == "conquer" && cult.isAI) {
			msg += cult.getFullName() + " has taken over the world. You fail.";
			msg += "<br><br><center><b>YOU LOSE</b></center>";
			this.track("loseGame diff:" + this.game.difficultyLevel,"conquer",this.game.turns);
		} else if(state == "wiped") {
			msg += cult.getFullName() + " was wiped away completely. " + "The Elder God lies dormant beneath the sea, waiting.";
			msg += "<br><br><center><b>YOU LOSE</b></center>";
			this.track("loseGame diff:" + this.game.difficultyLevel,"wiped",this.game.turns);
		} else if(state == "multiplayerFinish") {
			msg += "The great game has ended. Humanity will live.";
			msg += "<br><br><center><b>YOU ALL LOSE</b></center>";
			this.track("loseGame diff:" + this.game.difficultyLevel,"multiplayerFinish",this.game.turns);
		}
		var _g = 0, _g1 = this.game.nodes;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			n.setVisible(this.game.player,true);
		}
		this.alert(msg,true);
	}
	,updateStatus: function() {
		this.status.update();
	}
	,msg: function(s) {
		js.Lib.document.getElementById("jqDialog_close").style.visibility = "hidden";
		JQDialog.notify(s,1);
	}
	,clearMap: function() {
		this.map.clear();
	}
	,onKey: function(e) {
		var key = e.keyCode;
		var windowOpen = this.loadMenu.isVisible || this.saveMenu.isVisible || this.mainMenu.isVisible || this.debug.isVisible || this.alertWindow.isVisible || this.logWindow.isVisible || this.info.isVisible || this.sects.isVisible || this.customMenu.isVisible;
		if(this.loadMenu.isVisible) this.loadMenu.onKey(e); else if(this.saveMenu.isVisible) this.saveMenu.onKey(e); else if(this.mainMenu.isVisible) this.mainMenu.onKey(e); else if(this.customMenu.isVisible) this.customMenu.onKey(e); else if(this.mpMenu.isVisible) this.mpMenu.onKey(e); else if(this.debug.isVisible) this.debug.onKey(e); else if(this.sects.isVisible) this.sects.onKey(e); else if(e.keyCode == 27 || e.keyCode == 13 || e.keyCode == 32) {
			if(e.keyCode == 13 && this.sects.isVisible) return;
			if(this.alertWindow.isVisible) this.alertWindow.onClose(null); else if(this.logWindow.isVisible) this.logWindow.onClose(null); else if(this.info.isVisible) this.info.onClose(null); else if(this.sects.isVisible) this.sects.onClose(null); else if(this.options.isVisible) this.options.onClose(null); else this.mainMenu.show();
		} else if(this.logWindow.isVisible && e.keyCode == 76) this.logWindow.onClose(null); else if(this.info.isVisible && e.keyCode == 67) this.info.onClose(null); else if(this.options.isVisible && e.keyCode == 79) this.options.onClose(null); else if(!windowOpen) {
			if(e.keyCode == 65) this.top.onAdvanced(null); else if(e.keyCode == 67) this.top.onCults(null); else if(e.keyCode == 68) this.top.onDebug(null); else if(e.keyCode == 69) this.status.onEndTurn(null); else if(e.keyCode == 76) this.top.onLog(null); else if(e.keyCode == 77) this.mainMenu.show(); else if(e.keyCode == 79) this.top.onOptions(null); else if(e.keyCode == 83) this.top.onSects(null); else if(e.keyCode == 49 && !this.game.isFinished) this.game.player.upgrade(0); else if(e.keyCode == 50 && !this.game.isFinished) this.game.player.upgrade(1); else if(e.keyCode == 51 && !this.game.isFinished) this.game.player.upgrade(2);
		}
	}
	,init: function() {
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
		this.customMenu = new CustomMenu(this,this.game);
		this.mpMenu = new MultiplayerMenu(this,this.game);
		this.top = new TopMenu(this,this.game);
		this.sects = new SectsInfo(this,this.game);
		this.options = new OptionsMenu(this,this.game);
		this.music.onRandom = ($_=this.status,$bind($_,$_.onMusic));
		js.Lib.document.onkeyup = $bind(this,this.onKey);
	}
	,options: null
	,sects: null
	,top: null
	,logPanel: null
	,config: null
	,map: null
	,debug: null
	,alertWindow: null
	,logWindow: null
	,info: null
	,mpMenu: null
	,customMenu: null
	,saveMenu: null
	,loadMenu: null
	,mainMenu: null
	,status: null
	,music: null
	,game: null
	,__class__: UI
}
var Status = $hxClasses["Status"] = function(uivar,gvar) {
	this.ui = uivar;
	this.game = gvar;
	this.status = js.Lib.document.getElementById("status");
	this.status.style.border = "double #777 4px";
	this.status.style.width = 191;
	this.status.style.height = UI.mapHeight + UI.topHeight - 10;
	this.status.style.position = "absolute";
	this.status.style.left = 5;
	this.status.style.top = 5;
	this.status.style.padding = 5;
	this.status.style.fontSize = "12px";
	this.status.style.overflow = "hidden";
	var s = "<div id='status.cult' style='padding:0 5 5 5; background: #111; height: 17; " + "font-weight: bold; font-size:15px; text-align:center;'>-</div>";
	s += "<fieldset>";
	s += "<legend>FOLLOWERS</legend>";
	s += "<table width=100% cellpadding=0 cellspacing=2 style='font-size:14px'>";
	var _g1 = 0, _g = Game.followerNames.length;
	while(_g1 < _g) {
		var i = _g1++;
		s += "<tr style='height:10;'><td id='status.follower" + i + "'>" + Game.followerNames[i] + "s";
		s += "<td><div id='status.upgrade" + i + "' " + "style='cursor: pointer; width:12; height:12; " + "background:#222; border:1px solid #777; " + "color:lightgreen; " + (i < Game.followerNames.length - 1?"":"text-decoration:blink; ") + "text-align:center; font-size: 10px; font-weight: bold; '>";
		if(i < Game.followerNames.length - 1) s += "+"; else s += "!";
		s += "</div>";
		s += "<td><span id='status.followers" + i + "' style='font-weight:bold;'>0</span>";
	}
	s += "</table></fieldset>";
	s += "<fieldset><legend" + " style='padding:0 5 0 5;'>RESOURCES</legend>" + "<table width=100% cellpadding=0 cellspacing=0 style='font-size:14px'>";
	var _g1 = 0, _g = Game.numPowers + 1;
	while(_g1 < _g) {
		var i = _g1++;
		s += "<tr style='";
		if(i % 2 == 1) s += "background:#101010";
		s += "'><td>" + "<div id='status.powerMark" + i + "' style='width:" + UI.markerWidth + "; height: " + UI.markerHeight + "; font-size: 12px; " + "; background:#222; border:1px solid #777; color: " + UI.powerColors[i] + ";'>" + "<center><b>" + Game.powerShortNames[i] + "</b></center></div>" + "<td><b id='status.powerName" + i + "' " + UI.powerName(i) + "</b>" + "<td><td><span id='status.power" + i + "'>0</span><br>" + "<span style='font-size:10px' id='status.powerMod" + i + "'>0</span>";
		s += "<tr style='";
		if(i % 2 == 1) s += "background:#101010";
		s += "'><td colspan=4><table style='font-size:11px'>" + "<tr><td width=20 halign=right>To";
		var _g3 = 0, _g2 = Game.numPowers;
		while(_g3 < _g2) {
			var ii = _g3++;
			if(ii != i) s += "<td><div id='status.convert" + i + ii + "' " + "style='cursor: pointer; width:12; height:12; " + "background:#222; border:1px solid #777; " + "color:" + UI.powerColors[ii] + "; " + "text-align:center; font-size: 10px; font-weight: bold; '>" + Game.powerShortNames[ii] + "</div>";
		}
		if(i != 3) {
			s += "<td><div id='status.lowerAwareness" + i + "' " + "style='cursor: pointer; width:12; height:12; " + "background:#222; border:1px solid #777; " + "color:" + UI.colAwareness + "; " + "text-align:center; font-size: 10px; font-weight: bold; '>A</div>";
			s += "<td halign=right><div id='status.lowerWillpower" + i + "' " + "style='cursor: pointer; width:12; height:12; " + "background:#222; border:1px solid #777; " + "color:" + UI.colWillpower + "; " + "text-align:center; font-size: 10px; font-weight: bold; '>W</div>";
		}
		s += "</table>";
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
	s += "</center>";
	s += "<fieldset id='musicplayer'>";
	s += "<legend>MUSIC</legend>";
	s += "<div title='Click to go to album page.' id='status.track' " + "style='text-align: center; background: #222; cursor:pointer; font-size:10px; color: #00ff00'>-<br>-<br>-</div>";
	s += "<center style='padding-top:0px'>";
	s += "<span class=button2 title='Play' id='status.play'>PLAY</span>&nbsp;&nbsp;";
	s += "<span class=button2 title='Pause' id='status.pause'>PAUSE</span>&nbsp;&nbsp;";
	s += "<span class=button2 title='Stop' id='status.stop'>STOP</span>&nbsp;&nbsp;";
	s += "<span class=button2 title='Random track' id='status.random'>RANDOM</span>";
	s += "</center></fieldset>";
	s += "<center style='padding-top:12px;'><span class=button title='" + Status.tipMainMenu + "' id='status.mainMenu'>MAIN MENU</span></center>";
	this.status.innerHTML = s;
	var _g1 = 0, _g = Game.followerNames.length;
	while(_g1 < _g) {
		var i = _g1++;
		js.Lib.document.getElementById("status.follower" + i).title = Status.tipFollowers[i];
		var c = js.Lib.document.getElementById("status.upgrade" + i);
		c.onclick = $bind(this,this.onUpgrade);
		c.title = Status.tipUpgrade[i];
		c.style.visibility = "hidden";
	}
	var _g1 = 0, _g = Game.numPowers + 1;
	while(_g1 < _g) {
		var i = _g1++;
		js.Lib.document.getElementById("status.powerMark" + i).title = Status.tipPowers[i];
		js.Lib.document.getElementById("status.powerName" + i).title = Status.tipPowers[i];
		var _g3 = 0, _g2 = Game.numPowers;
		while(_g3 < _g2) {
			var ii = _g3++;
			if(i != ii) {
				var c = js.Lib.document.getElementById("status.convert" + i + ii);
				c.onclick = $bind(this,this.onConvert);
				c.title = Status.tipConvert + UI.powerName(ii) + ": " + Game.powerConversionCost[i];
			}
		}
		if(i != 3) {
			var c = js.Lib.document.getElementById("status.lowerAwareness" + i);
			c.onclick = $bind(this,this.onLowerAwareness);
			c.title = Status.tipLowerAwareness;
			var c1 = js.Lib.document.getElementById("status.lowerWillpower" + i);
			c1.onclick = $bind(this,this.onLowerWillpower);
			c1.title = Status.tipLowerWillpower + Game.willPowerCost;
		}
	}
	js.Lib.document.getElementById("status.endTurn").onclick = $bind(this,this.onEndTurn);
	js.Lib.document.getElementById("status.mainMenu").onclick = $bind(this,this.onMainMenu);
	js.Lib.document.getElementById("status.play").onclick = $bind(this,this.onPlay);
	js.Lib.document.getElementById("status.pause").onclick = $bind(this,this.onPause);
	js.Lib.document.getElementById("status.stop").onclick = $bind(this,this.onStop);
	js.Lib.document.getElementById("status.random").onclick = $bind(this,this.onRandom);
	js.Lib.document.getElementById("status.track").onclick = $bind(this,this.onTrack);
	new JQuery("#status *").tooltip({ delay : 0});
};
Status.__name__ = ["Status"];
Status.e = function(s) {
	return js.Lib.document.getElementById(s);
}
Status.prototype = {
	onMusic: function() {
		js.Lib.document.getElementById("status.track").innerHTML = this.ui.music.getName();
	}
	,update: function() {
		js.Lib.document.getElementById("status.cult").innerHTML = this.game.player.getFullName();
		var _g1 = 0, _g = Game.numPowers + 1;
		while(_g1 < _g) {
			var i = _g1++;
			var s = Status.tipPowers[i] + "<br>Chance to gain each unit: <span style='color:white'>" + this.game.player.getResourceChance() + "%</span>";
			this.updateTip("status.powerMark" + i,s);
			this.updateTip("status.powerName" + i,s);
		}
		var _g1 = 0, _g = Game.followerLevels;
		while(_g1 < _g) {
			var i = _g1++;
			this.updateTip("status.follower" + i,Status.tipFollowers[i]);
			this.updateTip("status.upgrade" + i,Status.tipUpgrade[i] + "<br>Chance of success: <span style='color:white'>" + this.game.player.getUpgradeChance(i) + "%</span>");
		}
		this.updateTip("status.followers1",(this.game.player.adeptsUsed > this.game.player.getAdepts()?this.game.player.getAdepts():this.game.player.adeptsUsed) + " used of " + this.game.player.getAdepts());
		var _g1 = 0, _g = Game.numPowers + 1;
		while(_g1 < _g) {
			var i = _g1++;
			var _g3 = 0, _g2 = Game.numPowers;
			while(_g3 < _g2) {
				var ii = _g3++;
				if(i == ii) continue;
				var c = js.Lib.document.getElementById("status.convert" + i + ii);
				c.style.visibility = this.game.player.power[i] >= Game.powerConversionCost[i]?"visible":"hidden";
			}
		}
		var _g1 = 0, _g = Game.followerLevels;
		while(_g1 < _g) {
			var i = _g1++;
			var s = "" + this.game.player.getNumFollowers(i);
			if(i == 1 && this.game.player.getAdepts() > 0) {
				var adepts = this.game.player.getAdepts() - this.game.player.adeptsUsed;
				if(adepts < 0) adepts = 0;
				s = "<span style='color:#55dd55'>" + adepts + "</span>";
			}
			js.Lib.document.getElementById("status.followers" + i).innerHTML = s;
		}
		var _g1 = 0, _g = Game.numPowers + 1;
		while(_g1 < _g) {
			var i = _g1++;
			js.Lib.document.getElementById("status.power" + i).innerHTML = "<b>" + this.game.player.power[i] + "</b>";
			if(i == 3) js.Lib.document.getElementById("status.powerMod3").innerHTML = " +0-" + (this.game.player.getNeophytes() / 4 - 0.5 | 0); else js.Lib.document.getElementById("status.powerMod" + i).innerHTML = " +0-" + this.game.player.powerMod[i];
		}
		js.Lib.document.getElementById("status.turns").innerHTML = "" + this.game.turns;
		js.Lib.document.getElementById("status.awareness").innerHTML = "" + this.game.player.awareness + "%";
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			js.Lib.document.getElementById("status.lowerAwareness" + i).style.visibility = "hidden";
		}
		if(this.game.player.adeptsUsed < this.game.player.getAdepts() && this.game.player.getAdepts() > 0 && this.game.player.awareness > 0) {
			var _g1 = 0, _g = Game.numPowers;
			while(_g1 < _g) {
				var i = _g1++;
				if(this.game.player.power[i] > 0) js.Lib.document.getElementById("status.lowerAwareness" + i).style.visibility = "visible";
			}
		}
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			js.Lib.document.getElementById("status.lowerWillpower" + i).style.visibility = "hidden";
		}
		if(this.game.player.hasInvestigator && !this.game.player.investigator.isHidden && this.game.player.adeptsUsed < this.game.player.getAdepts() && this.game.player.getAdepts() > 0) {
			var _g1 = 0, _g = Game.numPowers;
			while(_g1 < _g) {
				var i = _g1++;
				if(this.game.player.power[i] >= Game.willPowerCost) js.Lib.document.getElementById("status.lowerWillpower" + i).style.visibility = "visible";
			}
		}
		var _g1 = 0, _g = Game.followerNames.length;
		while(_g1 < _g) {
			var i = _g1++;
			js.Lib.document.getElementById("status.upgrade" + i).style.visibility = this.game.player.canUpgrade(i)?"visible":"hidden";
		}
		this.updateTip("status.follower2","3 priests and " + this.game.difficulty.numSummonVirgins + " virgins are needed to summon the Elder God.");
		this.updateTip("status.upgrade2","To perform the " + Static.rituals[0].name + " you need " + Game.upgradeCost + " priests and " + this.game.difficulty.numSummonVirgins + " virgins.<br>" + "<li>The more society is aware of the cult the harder it is to " + "summon Elder God.");
	}
	,updateTip: function(name,tip) {
		name = "#" + name;
		if(name.indexOf(".") > 0) name = HxOverrides.substr(name,0,name.indexOf(".")) + "\\" + HxOverrides.substr(name,name.indexOf("."),null);
		new JQuery(name).attr("tooltipText",tip);
	}
	,onMainMenu: function(event) {
		this.ui.mainMenu.show();
	}
	,onEndTurn: function(event) {
		if(this.game.isFinished) return;
		this.game.player.highlightedNodes.clear();
		var $it0 = this.game.player.logPanelMessages.iterator();
		while( $it0.hasNext() ) {
			var m = $it0.next();
			m.old = true;
		}
		this.game.endTurn();
	}
	,onConvert: function(event) {
		if(this.game.isFinished) return;
		var from = Std.parseInt(Tools.getTarget(event).id.substr(14,1));
		var to = Std.parseInt(Tools.getTarget(event).id.substr(15,1));
		this.game.player.convert(from,to);
	}
	,onUpgrade: function(event) {
		if(this.game.isFinished) return;
		var lvl = Std.parseInt(Tools.getTarget(event).id.substr(14,1));
		this.game.player.upgrade(lvl);
	}
	,onLowerWillpower: function(event) {
		if(this.game.isFinished) return;
		var power = Std.parseInt(Tools.getTarget(event).id.substr(21,1));
		this.game.player.lowerWillpower(power);
	}
	,onLowerAwareness: function(event) {
		if(this.game.isFinished) return;
		var power = Std.parseInt(Tools.getTarget(event).id.substr(21,1));
		this.game.player.lowerAwareness(power);
	}
	,onTrack: function(event) {
		js.Lib.window.open(this.ui.music.getPage(),"");
	}
	,onRandom: function(event) {
		this.ui.music.random();
	}
	,onStop: function(event) {
		this.ui.music.stop();
	}
	,onPause: function(event) {
		this.ui.music.pause();
	}
	,onPlay: function(event) {
		this.ui.music.play();
	}
	,status: null
	,game: null
	,ui: null
	,__class__: Status
}
var Std = $hxClasses["Std"] = function() { }
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	return x | 0;
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
var StringBuf = $hxClasses["StringBuf"] = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	toString: function() {
		return this.b;
	}
	,addSub: function(s,pos,len) {
		this.b += HxOverrides.substr(s,pos,len);
	}
	,addChar: function(c) {
		this.b += String.fromCharCode(c);
	}
	,add: function(x) {
		this.b += Std.string(x);
	}
	,b: null
	,__class__: StringBuf
}
var StringTools = $hxClasses["StringTools"] = function() { }
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
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
}
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c >= 9 && c <= 13 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.rpad = function(s,c,l) {
	var sl = s.length;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		s += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		s += c;
		sl += cl;
	}
	return s;
}
StringTools.lpad = function(s,c,l) {
	var ns = "";
	var sl = s.length;
	if(sl >= l) return s;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		ns += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		ns += c;
		sl += cl;
	}
	return ns + s;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
}
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
}
StringTools.isEOF = function(c) {
	return c != c;
}
var Tools = $hxClasses["Tools"] = function() { }
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
	bg.style.display = "none";
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
	b.className = "uiButton";
	b.style.fontSize = params.fontSize;
	b.style.position = "absolute";
	b.style.width = params.w;
	b.style.height = params.h;
	b.style.left = params.x;
	b.style.top = params.y;
	params.container.appendChild(b);
	if(params.func != null) b.onclick = params.func;
	if(params.title != null) {
		b.title = params.title;
		new JQuery("#" + Std.string(params.id)).tooltip({ delay : 0});
	}
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
	w.style.display = "none";
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
	t.style.color = "#ffffff";
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
Tools.checkbox = function(params) {
	var t = js.Lib.document.createElement("input");
	t.id = params.id;
	t.value = params.text;
	t.type = "checkbox";
	if(params.bold == null) params.bold = false;
	if(params.bold) t.style.fontWeight = "bold";
	if(params.fontSize == null) params.fontSize = 20;
	t.style.color = "#ffffff";
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
var TopMenu = $hxClasses["TopMenu"] = function(uivar,gvar) {
	this.ui = uivar;
	this.game = gvar;
	this.panel = js.Lib.document.createElement("div");
	this.panel.id = "topPanel";
	this.panel.style.position = "absolute";
	this.panel.style.width = UI.mapWidth + 8;
	this.panel.style.height = 26;
	this.panel.style.left = 240;
	this.panel.style.top = 5;
	this.panel.style.background = "#090909";
	js.Lib.document.body.appendChild(this.panel);
	Tools.button({ id : "cults", text : "CULTS", w : 70, h : TopMenu.buttonHeight, x : 20, y : 2, fontSize : 16, container : this.panel, title : "Click to view cults information (or press <span style=\"color:white\">C</span>).", func : $bind(this,this.onCults)});
	Tools.button({ id : "sects", text : "SECTS", w : 70, h : TopMenu.buttonHeight, x : 110, y : 2, fontSize : 16, container : this.panel, title : "Click to view sects controlled by your cult (or press <span style=\"color:white\">S</span>).", func : $bind(this,this.onSects)});
	Tools.button({ id : "log", text : "LOG", w : 70, h : TopMenu.buttonHeight, x : 200, y : 2, fontSize : 16, container : this.panel, title : "Click to view message log (or press <span style=\"color:white\">L</span>).", func : $bind(this,this.onLog)});
	Tools.button({ id : "options", text : "OPTIONS", w : 100, h : TopMenu.buttonHeight, x : 290, y : 2, fontSize : 16, container : this.panel, title : "Click to view options (or press <span style=\"color:white\">O</span>).", func : $bind(this,this.onOptions)});
	if(Game.isDebug) Tools.button({ id : "debug", text : "DEBUG", w : 70, h : TopMenu.buttonHeight, x : 410, y : 2, fontSize : 16, container : this.panel, title : "Click to open debug menu (or press <span style=\"color:white\">D</span>).", func : $bind(this,this.onDebug)});
	Tools.button({ id : "about", text : "ABOUT", w : 70, h : TopMenu.buttonHeight, x : 700, y : 2, fontSize : 16, container : this.panel, title : "Click to go to About page.", func : $bind(this,this.onAbout)});
	Tools.button({ id : "advanced", text : "A", w : 12, h : 12, x : 774, y : 30, fontSize : 10, container : this.panel, title : "Click to set/unset advanced map mode (or press <span style=\"color:white\">A</span>).", func : $bind(this,this.onAdvanced)});
};
TopMenu.__name__ = ["TopMenu"];
TopMenu.prototype = {
	onAbout: function(event) {
		js.Lib.window.open("http://code.google.com/p/cult/wiki/About");
	}
	,onAdvanced: function(event) {
		this.ui.map.isAdvanced = !this.ui.map.isAdvanced;
		this.game.player.options.set("mapAdvancedMode",this.ui.map.isAdvanced);
		this.ui.map.paint();
	}
	,onDebug: function(event) {
		if(this.game.isFinished || !Game.isDebug) return;
		this.ui.debug.show();
	}
	,onOptions: function(event) {
		this.ui.options.show();
	}
	,onLog: function(event) {
		this.ui.logWindow.show();
	}
	,onSects: function(e) {
		this.ui.sects.show();
	}
	,onCults: function(event) {
		this.ui.info.show();
	}
	,panel: null
	,game: null
	,ui: null
	,__class__: TopMenu
}
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = $hxClasses["Type"] = function() { }
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
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
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
}
Type.createInstance = function(cl,args) {
	switch(args.length) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
}
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
}
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
}
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	HxOverrides.remove(a,"__name__");
	HxOverrides.remove(a,"__interfaces__");
	HxOverrides.remove(a,"__properties__");
	HxOverrides.remove(a,"__super__");
	HxOverrides.remove(a,"prototype");
	return a;
}
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
}
Type["typeof"] = function(v) {
	switch(typeof(v)) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
}
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2, _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e ) {
		return false;
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
Type.allEnums = function(e) {
	var all = [];
	var cst = e.__constructs__;
	var _g = 0;
	while(_g < cst.length) {
		var c = cst[_g];
		++_g;
		var v = Reflect.field(e,c);
		if(!Reflect.isFunction(v)) all.push(v);
	}
	return all;
}
var UINode = $hxClasses["UINode"] = function(gvar,uivar,nvar) {
	this.game = gvar;
	this.ui = uivar;
	this.node = nvar;
};
UINode.__name__ = ["UINode"];
UINode.prototype = {
	setVisible: function(c,v) {
		if(c.isAI) return;
		if(Game.mapVisible) v = true;
	}
	,getTooltip: function() {
		if(!this.node.visibility[this.game.player.id]) return "";
		var s = "";
		if(Game.debugNear) {
			s += "Node " + this.node.id + "<br>";
			var $it0 = this.node.links.iterator();
			while( $it0.hasNext() ) {
				var n = $it0.next();
				s += n.id + "<br>";
			}
			if(this.node.isProtected) s += "Protected<br>"; else s += "Unprotected<br>";
		}
		if(Game.debugVis) {
			s += "Node " + this.node.id + "<br>";
			var _g1 = 0, _g = this.game.difficulty.numCults;
			while(_g1 < _g) {
				var i = _g1++;
				s += Std.string(this.node.visibility[i]) + "<br>";
			}
		}
		if(this.node.owner != null && !this.node.owner.isInfoKnown[this.game.player.id] && !this.node.isKnown[this.game.player.id] && this.node.owner != this.game.player) {
			s += "<span style='color:#ff8888'>Use sect to gather cult<br>or node information.</span><br>";
			if(this.node.owner == null || this.node.owner != this.game.player) s += "<br>Chance of success: <span style='color:white'>" + this.game.player.getGainChance(this.node) + "%</span><br>";
			return s;
		}
		if(this.node.owner != null) {
			s += "<span style='color:" + UI.cultColors[this.node.owner.id] + "'>" + this.node.owner.name + "</span><br>";
			if(this.node.owner.origin == this.node && this.node.isKnown[this.game.player.id]) s += "<span style='color:" + UI.cultColors[this.node.owner.id] + "'>The Origin</span><br>";
			s += "<br>";
		}
		s += "<span style='color:white'>" + this.node.name + "</span><br>";
		s += this.node.job + "<br>";
		if(this.node.owner != null) s += "<b>" + (this.node.isKnown[this.game.player.id]?Game.followerNames[this.node.level]:"Unknown") + "</b> <span style='color:white'>L" + (this.node.isKnown[this.game.player.id]?"" + (this.node.level + 1):"?") + "</span><br>";
		s += "<br>";
		if(this.node.sect != null) s += "Leader of<br>" + this.node.sect.name + "<br><br>";
		if(this.node.owner != this.game.player) {
			var br = false;
			if(this.node.isKnown[this.game.player.id] || this.node.owner == null) {
				var _g1 = 0, _g = Game.numPowers;
				while(_g1 < _g) {
					var i = _g1++;
					if(this.game.player.power[i] < this.node.power[i]) {
						s += "<span style='color:#ff8888'>Not enough " + Game.powerNames[i] + "</span><br>";
						br = true;
					}
				}
			}
			if(this.node.isGenerator && this.node.owner != null) {
				var cnt = 0;
				var $it1 = this.node.links.iterator();
				while( $it1.hasNext() ) {
					var n = $it1.next();
					if(n.owner == this.node.owner) cnt++;
				}
				if(cnt >= 3) s += "<span style='color:#ff8888'>Generator has " + cnt + " links</span><br>";
			}
			if(br) s += "<br>";
		}
		if(this.node.owner == null || this.node.isKnown[this.game.player.id]) {
			var _g1 = 0, _g = Game.numPowers;
			while(_g1 < _g) {
				var i = _g1++;
				if(this.node.power[i] > 0) s += "<b style='color:" + UI.powerColors[i] + "'>" + Game.powerNames[i] + "</b> " + this.node.power[i] + "<br>";
			}
		}
		if(this.node.owner == null || this.node.owner.isAI) s += "Chance of success: <span style='color:white'>" + this.game.player.getGainChance(this.node) + "%</span><br>";
		if(this.node.isGenerator && (this.node.owner == null || this.node.isKnown[this.game.player.id])) {
			s += "<br>Generates:<br>";
			var _g1 = 0, _g = Game.numPowers;
			while(_g1 < _g) {
				var i = _g1++;
				if(this.node.powerGenerated[i] > 0) s += "<b style='color:" + UI.powerColors[i] + "'>" + Game.powerNames[i] + "</b> " + this.node.powerGenerated[i] + "<br>";
			}
			if(this.node.isTempGenerator) s += "Temporary<br>";
		}
		return s;
	}
	,update: function() {
	}
	,paintAdvanced: function(ctx) {
		if(!this.node.visibility[this.game.player.id]) return;
		if(this.node.x < this.ui.map.viewRect.x - 20 || this.node.y < this.ui.map.viewRect.y - 20 || this.node.x > this.ui.map.viewRect.x + this.ui.map.viewRect.w || this.node.y > this.ui.map.viewRect.y + this.ui.map.viewRect.h) return;
		if(this.node.owner != this.game.player) {
			var ch = this.game.player.getGainChance(this.node);
			this.ui.map.paintText(ctx,[ch / 10 | 0,ch % 10,10],0,this.tempx + this.tempd + 1,this.tempy - 11);
			if(this.node.owner == null || this.node.isKnown[this.game.player.id]) {
				var _g1 = 0, _g = Game.numPowers;
				while(_g1 < _g) {
					var i = _g1++;
					if(this.node.power[i] > 0) this.ui.map.paintText(ctx,[this.node.power[i]],i + 1,this.tempd + this.tempx + i * 6,this.tempy + this.temph + 3); else this.ui.map.paintText(ctx,[10],i + 1,this.tempd + this.tempx + i * 6,this.tempy + this.temph + 3);
				}
			}
		}
	}
	,paint: function(ctx) {
		if(!this.node.visibility[this.game.player.id]) return;
		if(this.node.x < this.ui.map.viewRect.x - 20 || this.node.y < this.ui.map.viewRect.y - 20 || this.node.x > this.ui.map.viewRect.x + this.ui.map.viewRect.w || this.node.y > this.ui.map.viewRect.y + this.ui.map.viewRect.h) return;
		var key = "";
		var xx = this.node.x, yy = this.node.y, hlx = this.node.x - 10, hly = this.node.y - 10, tx = this.node.x + 4, ty = this.node.y + 14;
		var text = "";
		var textColor = "white";
		var isI = false, is1 = false;
		var _g1 = 0, _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.node.power[i] > 0) {
				text = Game.powerShortNames[i];
				textColor = UI.powerColors[i];
				isI = false;
				if(Game.powerShortNames[i] == "I") isI = true;
			}
		}
		if(this.node.owner != null) {
			key = "c";
			text = "" + (this.node.level + 1);
			textColor = "white";
			if(this.node.sect != null) text = "S";
			if(!this.node.isKnown[this.game.player.id]) text = "?";
		} else key = "neutral";
		var dd = 0;
		this.temph = 17;
		if(this.node.isGenerator) {
			key += "g";
			dd = 2;
			var _g = 0, _g1 = this.game.cults;
			while(_g < _g1.length) {
				var p = _g1[_g];
				++_g;
				if(p.origin == this.node && !p.isDead && this.node.isKnown[this.game.player.id]) {
					key = "o";
					dd = 4;
					break;
				}
			}
			if(this.node.isProtected) key += "p";
			xx -= dd;
			yy -= dd;
			this.temph += dd * 2;
			this.tempd = dd;
		}
		if(isI) tx += 2;
		xx -= this.ui.map.viewRect.x;
		yy -= this.ui.map.viewRect.y;
		tx -= this.ui.map.viewRect.x;
		ty -= this.ui.map.viewRect.y;
		hlx -= this.ui.map.viewRect.x;
		hly -= this.ui.map.viewRect.y;
		var $it0 = this.game.player.highlightedNodes.iterator();
		while( $it0.hasNext() ) {
			var n = $it0.next();
			if(n == this.node) {
				ctx.drawImage(this.ui.map.nodeImage,0,167,37,37,hlx,hly,37,37);
				break;
			}
		}
		var a = Reflect.field(UINode.imageKeys,key);
		var y0 = a[0];
		var w = a[1];
		var x0 = this.node.owner != null?this.node.owner.id * w:0;
		ctx.drawImage(this.ui.map.nodeImage,x0,y0,w,w,xx,yy,w,w);
		ctx.fillStyle = textColor;
		ctx.fillText(text,tx,ty);
		this.tempx = xx;
		this.tempy = yy;
	}
	,tempd: null
	,temph: null
	,tempy: null
	,tempx: null
	,imageName: null
	,node: null
	,ui: null
	,game: null
	,__class__: UINode
}
var js = js || {}
js.Boot = $hxClasses["js.Boot"] = function() { }
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
}
js.Boot.isClass = function(o) {
	return o.__name__;
}
js.Boot.isEnum = function(e) {
	return e.__ename__;
}
js.Boot.getClass = function(o) {
	return o.__class__;
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
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
			if(cl == Array) return o.__enum__ == null;
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	} catch( e ) {
		if(cl == null) return false;
	}
	switch(cl) {
	case Int:
		return Math.ceil(o%2147483648.0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return o === true || o === false;
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o == null) return false;
		if(cl == Class && o.__name__ != null) return true; else null;
		if(cl == Enum && o.__ename__ != null) return true; else null;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Lib = $hxClasses["js.Lib"] = function() { }
js.Lib.__name__ = ["js","Lib"];
js.Lib.document = null;
js.Lib.window = null;
js.Lib.debug = function() {
	debugger;
}
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib.eval = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
var sects = sects || {}
sects.Advisor = $hxClasses["sects.Advisor"] = function(g) {
	this.game = g;
};
sects.Advisor.__name__ = ["sects","Advisor"];
sects.Advisor.prototype = {
	run: function(cult) {
		if(cult.sects.length == 0) return;
		if(cult.hasInvestigator && cult.investigator.isHidden) {
			if(!this.cultHasSectOnTask(cult,"invSearch")) {
				var s = this.findBestSectForTask(cult,"invSearch",true);
				s.setTaskByID("invSearch");
				s.taskImportant = true;
			}
		} else if(cult.hasInvestigator) {
			var $it0 = cult.sects.iterator();
			while( $it0.hasNext() ) {
				var s = $it0.next();
				if((s.task == null || s.task.id != "invConfuse") && s.isAdvisor) {
					s.setTaskByID("invConfuse");
					s.taskImportant = true;
				}
			}
			return;
		}
		var _g = 0, _g1 = this.game.cults;
		while(_g < _g1.length) {
			var c2 = _g1[_g];
			++_g;
			if(c2 == cult || !c2.isDiscovered[cult.id] || c2.isInfoKnown[cult.id]) continue;
			if(this.cultHasSectOnTask(cult,"cultGeneralInfo",c2)) continue;
			var s = this.findBestSectForTask(cult,"cultGeneralInfo",false);
			if(s == null) break;
			s.setTaskByID("cultGeneralInfo",c2);
			s.taskImportant = true;
		}
		var temp = [];
		var _g = 0, _g1 = this.game.cults;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			if(c != cult && c.isDiscovered[cult.id] && !c.isDead) temp.push(c.id);
		}
		if(temp.length == 0) return;
		var $it1 = cult.sects.iterator();
		while( $it1.hasNext() ) {
			var s = $it1.next();
			if(!s.taskImportant && s.isAdvisor) {
				var cultTarget = this.game.cults[temp[Std.random(temp.length)]];
				s.setTaskByID("cultNodeInfo",cultTarget);
			}
		}
	}
	,findBestSectForTask: function(cult,id,taskVeryImportant) {
		var task = null;
		var _g = 0, _g1 = this.game.sectTasks;
		while(_g < _g1.length) {
			var t = _g1[_g];
			++_g;
			if(t.id == id) {
				task = t;
				break;
			}
		}
		var largestSect = null;
		var largestSize = 0;
		var minimalSect = null;
		var minimalSize = 10000;
		var $it0 = cult.sects.iterator();
		while( $it0.hasNext() ) {
			var s = $it0.next();
			if(!s.isAdvisor) continue;
			if(s.taskImportant && !taskVeryImportant) continue;
			if(s.size >= task.points && s.size < minimalSize) {
				minimalSect = s;
				minimalSize = s.size;
			}
			if(s.size > largestSize) {
				largestSect = s;
				largestSize = s.size;
			}
		}
		if(minimalSect != null) return minimalSect;
		return largestSect;
	}
	,cultHasSectOnTask: function(cult,id,target) {
		var $it0 = cult.sects.iterator();
		while( $it0.hasNext() ) {
			var s = $it0.next();
			if(s.task != null && s.task.id == id && s.taskTarget == target) return true;
		}
		return false;
	}
	,game: null
	,__class__: sects.Advisor
}
sects.Task = $hxClasses["sects.Task"] = function() {
	this.id = "_empty";
	this.type = "";
	this.name = "";
	this.level = 0;
	this.points = 0;
	this.isInfinite = false;
};
sects.Task.__name__ = ["sects","Task"];
sects.Task.prototype = {
	log: function(cult,m) {
		cult.log(m);
		cult.logPanel({ id : -1, old : false, type : "cult", text : m, obj : cult, turn : cult.game.turns + 1, params : { }});
	}
	,complete: function(game,ui,cult,sect,points) {
		console.log("default complete(), should not be called!");
	}
	,checkFailure: function(sect) {
		return false;
	}
	,check: function(cult,sect,target) {
		console.log("default check(), should not be called!");
		return true;
	}
	,isInfinite: null
	,points: null
	,level: null
	,name: null
	,type: null
	,id: null
	,__class__: sects.Task
}
sects.CultGeneralInfoTask = $hxClasses["sects.CultGeneralInfoTask"] = function() {
	sects.Task.call(this);
	this.id = "cultGeneralInfo";
	this.name = "Cult information";
	this.type = "cult";
	this.points = 30;
};
sects.CultGeneralInfoTask.__name__ = ["sects","CultGeneralInfoTask"];
sects.CultGeneralInfoTask.__super__ = sects.Task;
sects.CultGeneralInfoTask.prototype = $extend(sects.Task.prototype,{
	complete: function(game,ui,cult,sect,points) {
		var c = sect.taskTarget;
		c.isInfoKnown[cult.id] = true;
		this.log(cult,"Task completed: Information about " + c.getFullName() + " gathered.");
		var $it0 = c.nodes.iterator();
		while( $it0.hasNext() ) {
			var n = $it0.next();
			if(n.visibility[c.id]) n.update();
		}
	}
	,check: function(cult,sect,target) {
		var c = target;
		if(cult == c || c.isInfoKnown[cult.id]) return false;
		return true;
	}
	,__class__: sects.CultGeneralInfoTask
});
sects.CultNodeInfoTask = $hxClasses["sects.CultNodeInfoTask"] = function() {
	sects.Task.call(this);
	this.id = "cultNodeInfo";
	this.name = "Cult nodes";
	this.type = "cult";
	this.isInfinite = true;
	this.points = 0;
};
sects.CultNodeInfoTask.__name__ = ["sects","CultNodeInfoTask"];
sects.CultNodeInfoTask.__super__ = sects.Task;
sects.CultNodeInfoTask.prototype = $extend(sects.Task.prototype,{
	complete: function(game,ui,cult,sect,points) {
		var c = sect.taskTarget;
		var cnt = 0;
		var $it0 = c.nodes.iterator();
		while( $it0.hasNext() ) {
			var n = $it0.next();
			if(n.visibility[cult.id] && !n.isKnown[cult.id]) {
				cnt += 10;
				if(cnt >= points) break;
				n.isKnown[cult.id] = true;
				n.update();
			}
		}
	}
	,check: function(cult,sect,target) {
		var c = target;
		if(cult == c) return false;
		return true;
	}
	,__class__: sects.CultNodeInfoTask
});
sects.CultResourceInfoTask = $hxClasses["sects.CultResourceInfoTask"] = function() {
	sects.Task.call(this);
	this.id = "cultResourceInfo";
	this.name = "Cult resources";
	this.type = "cult";
	this.points = 50;
};
sects.CultResourceInfoTask.__name__ = ["sects","CultResourceInfoTask"];
sects.CultResourceInfoTask.__super__ = sects.Task;
sects.CultResourceInfoTask.prototype = $extend(sects.Task.prototype,{
	complete: function(game,ui,cult,sect,points) {
		var c = sect.taskTarget;
		this.log(cult,"Task completed: " + c.getFullName() + " has " + c.power[0] + " (+" + c.powerMod[0] + ") " + UI.powerName(0) + ", " + c.power[1] + " (+" + c.powerMod[1] + ") " + UI.powerName(1) + ", " + c.power[3] + " (+" + c.powerMod[2] + ") " + UI.powerName(2) + ", " + c.power[3] + " (+" + c.powerMod[3] + ") " + UI.powerName(3) + ".");
	}
	,check: function(cult,sect,target) {
		var c = target;
		if(cult == c) return false;
		return true;
	}
	,__class__: sects.CultResourceInfoTask
});
sects.CultSabotageRitualTask = $hxClasses["sects.CultSabotageRitualTask"] = function() {
	sects.Task.call(this);
	this.id = "cultSabotageRitual";
	this.name = "Sabotage ritual";
	this.type = "cult";
	this.isInfinite = true;
	this.points = 0;
	this.level = 1;
};
sects.CultSabotageRitualTask.__name__ = ["sects","CultSabotageRitualTask"];
sects.CultSabotageRitualTask.__super__ = sects.Task;
sects.CultSabotageRitualTask.prototype = $extend(sects.Task.prototype,{
	complete: function(game,ui,cult,sect,points) {
		var c = sect.taskTarget;
		if(!c.isRitual || c.ritualPoints >= c.ritual.points) return;
		var cnt = 0;
		var pts = 0;
		while(true) {
			cnt += 150;
			if(cnt >= points) break;
			if(Math.random() * 100 > 65) continue;
			c.ritualPoints += 1;
			pts += 1;
			if(c.ritualPoints >= c.ritual.points) break;
		}
		if(pts > 0) this.log(cult,"Ritual of " + c.getFullName() + " stalled for " + pts + " points.");
	}
	,checkFailure: function(sect) {
		var c = sect.taskTarget;
		if(!c.isRitual) return true;
		return false;
	}
	,check: function(cult,sect,target) {
		var c = target;
		if(cult == c || !c.isRitual) return false;
		return true;
	}
	,__class__: sects.CultSabotageRitualTask
});
sects.DoNothingTask = $hxClasses["sects.DoNothingTask"] = function() {
	sects.Task.call(this);
	this.id = "doNothing";
	this.name = "Do Nothing";
	this.type = "";
	this.isInfinite = true;
	this.points = 0;
};
sects.DoNothingTask.__name__ = ["sects","DoNothingTask"];
sects.DoNothingTask.__super__ = sects.Task;
sects.DoNothingTask.prototype = $extend(sects.Task.prototype,{
	complete: function(game,ui,cult,sect,points) {
	}
	,check: function(cult,sect,target) {
		return true;
	}
	,__class__: sects.DoNothingTask
});
sects.InvConfuseTask = $hxClasses["sects.InvConfuseTask"] = function() {
	sects.Task.call(this);
	this.id = "invConfuse";
	this.name = "Confuse investigator";
	this.type = "investigator";
	this.isInfinite = true;
	this.points = 0;
};
sects.InvConfuseTask.__name__ = ["sects","InvConfuseTask"];
sects.InvConfuseTask.__super__ = sects.Task;
sects.InvConfuseTask.prototype = $extend(sects.Task.prototype,{
	complete: function(game,ui,cult,sect,points) {
		if(cult.investigator == null) return;
	}
	,checkFailure: function(sect) {
		if(!sect.cult.hasInvestigator || sect.cult.investigator.isHidden) return true;
		return false;
	}
	,check: function(cult,sect,target) {
		if(cult.investigator.isHidden) return false;
		return true;
	}
	,__class__: sects.InvConfuseTask
});
sects.InvSearchTask = $hxClasses["sects.InvSearchTask"] = function() {
	sects.Task.call(this);
	this.id = "invSearch";
	this.name = "Search for investigator";
	this.type = "investigator";
	this.points = 50;
};
sects.InvSearchTask.__name__ = ["sects","InvSearchTask"];
sects.InvSearchTask.__super__ = sects.Task;
sects.InvSearchTask.prototype = $extend(sects.Task.prototype,{
	complete: function(game,ui,cult,sect,points) {
		if(cult.investigator == null || !cult.investigator.isHidden) return;
		cult.investigator.isHidden = false;
		cult.log("Task completed: Investigator found.");
		cult.logPanel({ id : -1, old : false, type : "cult", text : "Task completed: Investigator found.", obj : cult, turn : cult.game.turns + 1, params : { }});
	}
	,checkFailure: function(sect) {
		if(!sect.cult.hasInvestigator || !sect.cult.investigator.isHidden) return true;
		return false;
	}
	,check: function(cult,sect,target) {
		if(!cult.investigator.isHidden) return false;
		return true;
	}
	,__class__: sects.InvSearchTask
});
sects.Sect = $hxClasses["sects.Sect"] = function(g,uivar,l,c) {
	this.game = g;
	this.ui = uivar;
	this.leader = l;
	this.cult = c;
	this.taskPoints = 0;
	this.taskImportant = false;
	this.size = 10;
	if(l.level == 1) this.size = 50; else if(l.level == 2) this.size = 90;
	this.level = 0;
	var rnd3 = Math.random() * sects.Sect.names.length | 0;
	this.name = HxOverrides.substr(this.leader.name,0,this.leader.name.indexOf(" ")) + HxOverrides.substr(this.leader.name,this.leader.name.indexOf(" ") + 1,1) + " " + sects.Sect.names[rnd3];
	this.isAdvisor = this.cult.options.getBool("sectAdvisor");
};
sects.Sect.__name__ = ["sects","Sect"];
sects.Sect.prototype = {
	turn: function() {
		this.size += this.getGrowth();
		var oldlevel = this.level;
		if(this.size < 100) this.level = 0; else if(this.size < 500) this.level = 1; else if(this.size < 1000) this.level = 2; else this.level = 2;
		if(this.level != oldlevel && !this.cult.isAI) this.ui.log2(this.cult,this.name + " has gained a new level.",{ type : "sect"});
		if(this.task == null) return;
		this.taskPoints += this.size;
		if(this.taskPoints < this.task.points) return;
		this.task.complete(this.game,this.ui,this.cult,this,this.taskPoints);
		this.taskPoints = 0;
		if(!this.task.isInfinite) {
			this.clearTask();
			this.game.failSectTasks();
		}
	}
	,getGrowth: function() {
		if(this.size < this.getMaxSize()) return 1 + (this.size / 10 | 0); else return 0;
	}
	,getMaxSize: function() {
		var maxSize = 100;
		if(this.leader.level == 1) maxSize = 500; else if(this.leader.level == 2) maxSize = 1000;
		return maxSize;
	}
	,clearTask: function() {
		this.task = null;
		this.taskTarget = null;
		this.taskPoints = 0;
		this.taskImportant = false;
	}
	,setTask: function(newTask,target) {
		this.task = newTask;
		this.taskPoints = 0;
		this.taskTarget = target;
	}
	,setTaskByID: function(taskID,target) {
		var _g = 0, _g1 = this.game.sectTasks;
		while(_g < _g1.length) {
			var t = _g1[_g];
			++_g;
			if(t.id == taskID) {
				this.setTask(t,target);
				return;
			}
		}
	}
	,taskImportant: null
	,taskTarget: null
	,taskPoints: null
	,task: null
	,isAdvisor: null
	,level: null
	,size: null
	,cult: null
	,leader: null
	,name: null
	,ui: null
	,game: null
	,__class__: sects.Sect
}
var $_;
function $bind(o,m) { var f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; return f; };
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
}; else null;
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
Array.prototype.__class__ = $hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
var Void = $hxClasses.Void = { __ename__ : ["Void"]};
if(typeof document != "undefined") js.Lib.document = document;
if(typeof window != "undefined") {
	js.Lib.window = window;
	js.Lib.window.onerror = function(msg,url,line) {
		var f = js.Lib.onerror;
		if(f == null) return false;
		return f(msg,[url + ":" + line]);
	};
}
js.XMLHttpRequest = window.XMLHttpRequest?XMLHttpRequest:window.ActiveXObject?function() {
	try {
		return new ActiveXObject("Msxml2.XMLHTTP");
	} catch( e ) {
		try {
			return new ActiveXObject("Microsoft.XMLHTTP");
		} catch( e1 ) {
			throw "Unable to create XMLHttpRequest object.";
		}
	}
}:(function($this) {
	var $r;
	throw "Unable to create XMLHttpRequest object.";
	return $r;
}(this));
CustomMenu.difElementInfo = [{ name : "mapWidth", type : "int", title : "Map width", note : "Map width in pixels"},{ name : "mapHeight", type : "int", title : "Map height", note : "Map height in pixels"},{ name : "nodesCount", type : "int", title : "Amount of nodes", note : "Amount of nodes on map"},{ name : "nodeActivationRadius", type : "int", title : "Activation radius", note : "Node activation radius (node can be activated only when the player has an adjacent node in that radius)"},{ name : "numCults", type : "int", title : "Number of cults (2-8)", note : "Number of cults in game"},{ name : "numPlayers", type : "int", title : "Number of human players (1-8)", note : "Number of human players in game"},{ name : "numSummonVirgins", type : "int", title : "Number of virgins for the final ritual", note : "Number of virgins needed to perform final ritual"},{ name : "upgradeChance", type : "float", title : "Max upgrade chance", note : "Higher value raises max upgrade chance"},{ name : "awarenessResource", type : "float", title : "Resource chance awareness mod", note : "Higher value lowers chance of getting resources each turn"},{ name : "awarenessUpgrade", type : "float", title : "Upgrade chance awareness mod", note : "Higher value lowers chance of upgrading followers"},{ name : "awarenessGain", type : "float", title : "Gain follower chance awareness mod", note : "Higher value lowers chance of gaining new followers"},{ name : "investigatorChance", type : "float", title : "Investigator: Appearing chance", note : "Higher value raises chance of investigator appearing"},{ name : "investigatorKill", type : "float", title : "Investigator: Kill follower chance", note : "Higher value raises chance of investigator killing a follower"},{ name : "investigatorWillpower", type : "float", title : "Investigator: Willpower lower chance", note : "Higher value lowers chance of adepts lowering investigator willpower"},{ name : "investigatorTurnVisible", type : "int", title : "Investigator: Turn to become visible", note : "Turn on which new investigator becomes visible"},{ name : "investigatorGainWill", type : "float", title : "Investigator: Chance of gaining will", note : "Higher value raises chance of investigator gaining will"},{ name : "investigatorCultSize", type : "float", title : "Investigator: Cult size mod", note : "Starting investigator willpower - cult size multiplier (less - easier)"},{ name : "maxAwareness", type : "int", title : "AI: Max awareness", note : "Max awareness for AI to have without using adepts"},{ name : "isInfoKnown", type : "bool", title : "Cult info known at start?", note : "Is cult info for all cults known at start?"},{ name : "isOriginKnown", type : "bool", title : "Origin info known at start?", note : "Is origin known for all cults at start?"},{ name : "isDiscovered", type : "bool", title : "Cults discovered at start?", note : "Are cults marked as discovered on start?"}];
DateTools.DAYS_OF_MONTH = [31,28,31,30,31,30,31,31,30,31,30,31];
Game.powerNames = ["Intimidation","Persuasion","Bribery","Virgins"];
Game.powerShortNames = ["I","P","B","V"];
Game.followerNames = ["Neophyte","Adept","Priest"];
Game.powerConversionCost = [2,2,2,1];
Game.willPowerCost = 2;
Game.version = "v5.2";
Game.followerLevels = 3;
Game.numPowers = 3;
Game.upgradeCost = 3;
Game.isDebug = false;
Game.debugTime = false;
Game.debugVis = false;
Game.debugNear = false;
Game.debugAI = false;
Game.debugDirector = false;
Game.mapVisible = false;
GenName.names = ["Austin","Barbara","Calvin","Carl","Catherine","Clarence","Donald","Dwight","Ed","Evelyn","Kevin","Lester","Mark","Oscar","Patricia","Samuel","Sigourney","Spencer","Tom","Virgil","Adam","Alan","Andrea","Arthur","Brett","Damien","David","Frank","Helen","James","Jane","John","Maria","Michael","Neil","Patrick","Paul","Randolph","Robert","Sarah","Scott","Armand","Bernard","Claude","Danielle","Emile","Gaston","Gerard","Henri","Jacqueline","Jacques","Jean","Leon","Louis","Marc","Marcel","Marielle","Micheline","Pierre","Rene","Sylvie","Christel","Dieter","Franz","Gerhard","Gudrun","Gunter","Hans","Helga","Jurgen","Karin","Klaus","Manfred","Matthias","Otto","Rudi","Siegfried","Stefan","Uta","Werner","Wolfgang","Akinori","Isao","Jungo","Hideo","Kenji","Mariko","Masaharu","Masanori","Michiko","Naohiro","Sata","Shigeo","Shigeru","Shuji","Sumie","Tatsuo","Toshio","Yasuaki","Yataka","Yoko","Yuzo","Anatoly","Andrei","Alyona","Boris","Dmitriy","Galina","Gennadiy","Grigoriy","Igor","Ivan","Leonid","Lyudmila","Mikhail","Natalya","Nikolai","Olga","Sergei","Tatyana","Victor","Vladimir","Yuri"];
GenName.surnames = ["Bradley","Bryant","Carr","Crossett","Dodge","Gallagher","Homburger","Horton","Hudson","Johnson","Kemp","King","McNeil","Miller","Mitchell","Nash","Stephens","Stoddard","Thompson","Webb","Bailey","Blake","Carter","Davies","Day","Evans","Hill","Jones","Jonlan","Martin","Parker","Pearce","Reynolds","Robinson","Sharpe","Smith","Stewart","Taylor","Watson","White","Wright","Bouissou","Bouton","Buchard","Coicaud","Collignon","Cuvelier","Dagallier","Dreyfus","Dujardin","Gaudin","Gautier","Gressier","Guerin","Laroyenne","Lecointe","Lefevre","Luget","Marcelle","Pecheux","Revenu","Berger","Brehme","Esser","Faerber","Geisler","Gunkel","Hafner","Heinsch","Keller","Krause","Mederow","Meyer","Richter","Schultz","Seidler","Steinbach","Ulbricht","Unger","Vogel","Zander","Akira","Fujimoto","Ishii","Iwahara","Iwasaki","Kojima","Koyama","Matsumara","Morita","Noguchi","Okabe","Okamoto","Sato","Shimaoka","Shoji","Tanida","Tanikawa","Yamanaka","Yamashita","Yamazaki","Andryanov","Belov","Chukarin","Gorokhov","Kolotov","Korkin","Likhachev","Maleev","Mikhailov","Petrov","Razuvaev","Romanov","Samchenko","Scharov","Shadrin","Shalimov","Torbin","Voronin","Yakubchik","Zhdanovich"];
MultiplayerMenu.difElementInfo = [{ name : "numCults", type : "int", title : "Number of cults (2-8)", params : null},{ name : "numPlayers", type : "int", title : "Number of human players (1-8)", params : null},{ name : "difficulty", type : "select", title : "Game difficulty", params : ["Easy","Normal","Hard"]},{ name : "mapSize", type : "select", title : "Map size", params : ["Small","Medium","Large","Huge"]}];
Node.jobs = ["Government official","Corporate worker","University professor","Army officer","Scientist","Politician","Media Person"];
OptionsMenu.elementInfo = [{ name : "mapAdvancedMode", type : "bool", title : "Advanced map mode", note : "Displays additional node information on map"},{ name : "logPanelSkipSects", type : "bool", title : "No sect messages in log panel", note : "Will not show sect messages in log panel"},{ name : "sectAdvisor", type : "bool", title : "Sect advisor", note : "Sect advisor will automatically give tasks to sects depending on the situation"}];
Static.difficulty = [{ level : 0, mapWidth : 780, mapHeight : 580, nodesCount : 100, nodeVisibilityRadius : 101, nodeActivationRadius : 101, numCults : 3, numPlayers : 1, numSummonVirgins : 6, upgradeChance : 1.10, awarenessResource : 1.25, awarenessUpgrade : 0.75, awarenessGain : 0.75, investigatorChance : 0.50, investigatorKill : 0.75, investigatorWillpower : 0.75, investigatorTurnVisible : 0, investigatorGainWill : 0.50, investigatorCultSize : 0.05, maxAwareness : 10, isInfoKnown : true, isOriginKnown : true, isDiscovered : true},{ level : 1, mapWidth : 780, mapHeight : 580, nodesCount : 100, nodeVisibilityRadius : 101, nodeActivationRadius : 101, numCults : 4, numPlayers : 1, numSummonVirgins : 9, upgradeChance : 1.0, awarenessResource : 1.5, awarenessUpgrade : 1.0, awarenessGain : 1.0, investigatorChance : 1.0, investigatorKill : 1.0, investigatorWillpower : 1.0, investigatorTurnVisible : 10, investigatorGainWill : 0.75, investigatorCultSize : 0.1, maxAwareness : 5, isInfoKnown : false, isOriginKnown : false, isDiscovered : false},{ level : 2, mapWidth : 780, mapHeight : 580, nodesCount : 100, nodeVisibilityRadius : 101, nodeActivationRadius : 101, numCults : 4, numPlayers : 1, numSummonVirgins : 9, upgradeChance : 0.90, awarenessResource : 1.75, awarenessUpgrade : 1.25, awarenessGain : 1.25, investigatorChance : 1.25, investigatorKill : 1.25, investigatorWillpower : 1.25, investigatorTurnVisible : 2000, investigatorGainWill : 1.0, investigatorCultSize : 0.15, maxAwareness : 5, isInfoKnown : false, isOriginKnown : false, isDiscovered : false},{ level : -1, mapWidth : 780, mapHeight : 580, nodesCount : 100, nodeVisibilityRadius : 101, nodeActivationRadius : 101, numCults : 4, numPlayers : 2, numSummonVirgins : 9, upgradeChance : 1.0, awarenessResource : 1.5, awarenessUpgrade : 1.0, awarenessGain : 1.0, investigatorChance : 1.0, investigatorKill : 1.0, investigatorWillpower : 1.0, investigatorTurnVisible : 10, investigatorGainWill : 0.75, investigatorCultSize : 0.1, maxAwareness : 5, isInfoKnown : false, isOriginKnown : false, isDiscovered : false}];
Static.cults = [{ name : "Cult of Elder God", note : "The cult still lives.", longNote : "At the dawn of humanity the great old ones told their secrets in dreams to the first men, who formed a cult which had never died... Hidden in distant and dark places of the world, waiting for the day when the stars will be right again and the mighty Elder God will rise from his slumber under the deep waters to bring the earth beneath his sway once more.", summonStart : "", summonFinish : "", summonFail : ""},{ name : "Pharaonic Slumber", note : "A group that wants to put the entire world to sleep, feeding on the nightmares of the dreamers.", longNote : "Abhumans from a dark dimension close to ours came to Earth thousands of years ago, trading their magics and technology with the Egyptians for control of their people's minds when they slept, for they fed upon nightmares. With the secret help of the Roman Empire, the Egyptians drove the abhumans into hiding. But they have returned, and their goal has grown with time: the permanent slumber of the world.", summonStart : "As the Pharaonic Slumber's power grows, the world enters a state of controlled drowsiness. People go to bed earlier and sleep later, their dreams plagued with thoughts of sweeping sands and dark figures. Short naps at work become almost commonplace, and as the abhumans feed upon the dreaming energies of the world, everyone feels less and less energetic. All the more reason to take a bit of a rest...", summonFinish : "The world drifts off to sleep, some even slumping to the sidewalk where they were just walking or barely managing to bring their vehicles to a stop. The abhumans come out in force, walking amongst the dreaming populace, feeding hungrily upon the horrid dreams foisted upon them by the dark magics. A few humans manage to keep themselves awake a bit longer on massive doses of amphetamines, but soon they too crash into the darkness of eternal slumber, screaming into unconsciousness as they see the burning red eyes of those who've come to consume their thoughts.", summonFail : "People shake off the dozing state that had captured them. Sales of coffee and cola rocket temporarily, an odd spike that intrigues many commentators, and for a moment humanity is more awake than it has ever been before. Soon, however, old habits return, and some are still plagued by dreams of windswept deserts they have never before seen and cloaked figures that move in a way that somehow feels inhuman, dreams that feel more real than reality."},{ name : "Blooded Mask", note : "A group devoted to ripping away the masks people wear and revealing the insane reality beyond.", longNote : "Those who peer too long into the Abyss find that it stares back at them, and the Blooded Mask has long gazed into the ineffable world beyond our own. Affiliated with no Elder God, or perhaps all of them, the Blooded Mask longs to show humanity the brutal truths that hide behind the consensual reality. The truths drive those who see them insane, filling them with a desire to show others as well, and the Blooded Mask are the original converts.", summonStart : "A rash of cases of schizophrenia and paranoid delusions becomes an epidemic.  World health organizations struggle to understand environmental factors behind the increasing numbers of psychotic breaks and irrational behaviour across the world, unaware of the rituals the Blooded Mask are enacting.  The only clue is an increased incidence of individuals trying to claw their eyes out, often babbling about seeing <i>the truth</i> better without them.", summonFinish : "Even the most stable individuals become gripped by the desire to see beyond the veil. Plucking their eyes out, almost as one, humanity peers out of bloody sockets into the screaming void of alien truth that had, until then, been hidden to most. The Bloody Veil's incantations brought to their climax, the world becomes a madhouse of screaming blind horror, people stumbling through living nightmares in colours their minds were never meant to comprehend, groping past those others wandering in the same strange geometries.", summonFail : "The outbreak of madness draws to a close, the circumstances at its end as mysterious as when it began. Sanity returns to some of those who saw the underlying truth, but those who blinded themselves are relegated to sanitariums around the world, their screaming reverberating in the halls of the buildings, unable to stop seeing the horrifying ur-reality. A small number of painters attempt to incorporate the colours they saw in their madness into their work, and the epileptic seizures their paintings evoke cause the black ops divisions of the world's governments to destroy all evidence of their work."},{ name : "Universal Lambda", note : "Programmers who want to turn humanity into a vast processing machine.", longNote : "In the early seventies, a secret goverment project uncovered the changes necessary to turn any human brain into an efficient, soulless computer.  Little did the project know that it had been subverted by the dark cult. The Universal Lambda works to refine that now-defunct project's results: the turning of every human being into cogs of a huge machine, a distributed network for the vast living intellect of the Elder God.", summonStart : "The Universal Lambda's cybermantic machinations begin to influence the entire world.  People start to walk in unconscious lockstep down the streets; crime and accident rates drop as the rituals rewire minds to be more and more regimented.  People make fewer choices, locking themselves into patterns without realizing the steady loss of free will.", summonFinish : "Their rituals complete, the Universal Lambda turns the world into a well-oiled machine. Bodies still move around, taking part in the same rote behavior they did before, but the minds of the populace are gone. Instead of thinking independent thoughts, humanity's brains run the code that allows The Machine to run in our dimension. The tiny flickers of free will brought upon by every birth are quickly consumed by the overwhelming cybermantic magics enveloping the world; all are just parts of the giant soulless entity... ", summonFail : "The eerily constant behavior of humanity slowly returns to its regular froth of chaos. People still occasionally slip into the robotic state they exhibited mere days before, but the rising rate of accidents and deaths heralds the return of free will, for better or worse."},{ name : "Drowned", note : "Vengeful spirits determined to drown the rest of the world.", longNote : "Over the millennia, hundreds of thousands of people have drowned in the oceans, lakes, and rivers of the world. Most of them pass peacefully into oblivion, but some linger, warped by the experience of their death. Over time, those who remain have gathered together in an undead cabal. They want the rest of the world to join them in their watery graves, and will stop at nothing to make it happen.", summonStart : "It begins to rain. A slow drizzle at first, the entire world is soon enveloped in an unending thunderstorm, water pouring from the heavens without an end in sight. Low-lying regions begin to flood, and it is only a matter of time before even the highest ground is inundated.", summonFinish : "The heavy rains turn torrential.  The sea level rises inexorably as humanity crowds further and further up into the mountains.  Still the rains come, still the waters climb.  Every death in the water adds to the power of the Drowned, the force of the neverending rain.  Many take\n      to boats in an attempt to survive on the surface of the sea, only to find that no ship remains seaworthy; leaks spring up in unlikely places, and soon every vessel succumbs to the inexorable pull of the dark depths below.  The last gasp of humanity is a doomed man standing on the peak of Everest, and then he goes under once. Twice. He is gone.", summonFail : "The rains slacken, first to a light patter, then a drizzle, then nothing but the usual patterns of storms and showers. Commentators argue that the excess water had to come from somewhere, but within days everything seems to have returned to an equilibrium, the ghost rains drying up into nothing.  Scientists are at a loss to explain the phenomenon, but the\n      rest of the world returns to its routine, although many glance at the sky whenever a cloud darkens the day, worried that it might once again begin to rain forever."},{ name : "Manipulators", note : "Powerful magicians who wish to enslave humanity.", longNote : "For centuries, men in power have desired the ability to make their subjects obey their every whim. Some have used force, or fear, but none have been completely successful. A group of powerful male magicians, many of whom control powerful multinational corporations, are determined to succeed where others have failed.  Through the use of mind-manipulation magic, memetic manipulation, and subtle influence in world governments, they plan to make every other man, woman, and child on the planet their slaves, forced into fulfilling the Manipulators' dark desires.", summonStart : "The Manipulators start their ultimate ritual with a slow but insidious assault on the psyches of the world, using traditional advertising techniques combined with subtle dark magics.  Much of their work is couched in the comforting form of mass media, convincing people that the\n      old inhibited days are over, that a new dawn of peace, prosperity, and happiness is on the horizon, subtly hinting that a chosen few will be the ones to lead humanity into the new golden age.  Many are skeptical, but many more are taken in by the Manipulators' careful schemes, as the magics work their way on the minds of the converted and unconverted alike.", summonFinish : "The Manipulators' control of the world becomes more and more overt, their supposedly-benign stewardship turning into outright worship by the masses. Their magics turn support into adulation, appreciation into unfettered desire; the world wants, needs to fulfill their every whim, no matter the consequence. People of all genders and ages disappear into the gleaming palaces, their bodies and minds used for unmentionable new rituals. The diversity of humanity is now nothing more than a living, breathing mass of clay for the Manipulators to sculpt as they desire. And their desires are manifold indeed.", summonFail : "What at first seemed like the genuine rise of a new era of freedom and prosperity turns sour, many of its proponents discovered to be frauds and freaks.  The Manipulators themselves stay behind the scenes, protected by layers of misdirection and human shields, but the effects\n      of their manipulations begin to fade.  People once again assert contrary views with candor; for a moment, they view the mass media with a genuine critical eye.  Then the time passes, advertisements and packaged views reasserting their mundane control on the opinions, just another day in this modern life."},{ name : "The Frozen Dream", note : "A group of ice demons that want to freeze the world. ", longNote : "Led by unholy denizens of frozen wastes, The Frozen Dream works to turn the world into an eternal winter horrorland, full of ice demons and frosthounds cavorting in the terrible chill. What little can survive in the icy bleakness will be hunted for sport. ", summonStart : "As The Frozen Dream begins their dark rituals, temperatures across the world begin to drop. Winter has become bitterly frigid, spring and fall too cold for the plants, and summer a wan shadow of its former self. Weather patterns spiral out of control, and food crops wither and die. ", summonFinish : "Their dark ritual complete, The Frozen Dream's grasp upon the Earth becomes stronger. The biting cold becomes unbearable, freezing and shattering plants and animals alike still on the surface. What little humanity remains is ensconced deep underground, but the unnatural chill manages to penetrate even those bastions, slowly but surely. It is only a matter of time before the thin flame of natural life is extinguished by the icy winds that blow across the planet. ", summonFail : "The unnatural chill of recent days begins to fade, the world scrambling to repair what damage can be fixed. Many still shiver uncontrollably when a gust of cool air blows past them, a psychic remnant of the grasp The Frozen Dream nearly had upon the Earth."},{ name : "The Slake", note : "Emotional vampires who feed on ecstasy and horror.", longNote : "Legends passed down for generations speak of vampires, those who consume the blood of mankind. Little do most know that those stories contain the dim shine of truth: twisted creatures among humanity, drinking in strong emotion and leaving shattered husks. With the world ripe for the plucking, the Slake want nothing more than to turn it all into an eternal feeding ground.", summonStart : "The Slake begin to draw on their stores of distilled emotions, slowly drawing the world into a heightened sense of existence. Petty disputes flare into armed conflicts, teetering towards full-fledge wars; long-hidden passions and desires erupt into a reflowering of hedonism. On the edges of it all, the vampires drink and drink, powering their dark magics ever further...", summonFinish : "Society collapses into an orgy of violence and ecstasy. Nation-states collapse as they destroy each other in terrible attacks and counterattacks, while those back home fall into reckless passion, destroying relationships and souls alike as the Slake consume it all. They leave only a small number of chattel alive, to procreate and destroy as they drain them, one by one, until the end of time.", summonFail : "The strange passions that had gripped the world fade like a bad dream, the world shaking off the heightened sense of everything with little more than whispers of concern. A wild season, nothing more, the media proclaims, a self-fulfilling prophecy. The Slake retreat for a while, to gather their powers once again for another attempt at goading the world into providing the emotions they crave."}];
Static.rituals = [{ id : "summoning", name : "Final Ritual", points : 9, note : "Upon completion this cult will reign over the world unchallenged."}];
UI.powerColors = ["rgb(255, 0, 0)","rgb(0, 255, 255)","rgb(0, 255, 0)","rgb(255, 255, 0)"];
UI.nodePixelColors = [[85,221,85],[39,39,215],[224,82,202],[216,225,81],[9,136,255],[96,150,18],[168,87,0],[153,0,9]];
UI.nodeNeutralPixelColors = [120,120,120];
UI.lineColors = ["#55dd55","#2727D7","#E052CA","#D8E151","#0988ff","#609612","#a85700","#990009"];
UI.cultColors = ["#00B400","#2F43FD","#B400AE","#B4AE00","#0988ff","#609612","#a85700","bb000b"];
UI.winWidth = 1024;
UI.winHeight = 630;
UI.mapWidth = 780;
UI.mapHeight = 580;
UI.tooltipWidth = 100;
UI.tooltipHeight = 80;
UI.markerWidth = 15;
UI.markerHeight = 15;
UI.topHeight = 30;
UI.colAwareness = "#ff9999";
UI.colWillpower = "#bbbbbb";
UI.maxSaves = 5;
Status.tipPowers = [UI.powerName(0) + " is needed to gain new followers.",UI.powerName(1) + " is needed to gain new followers.",UI.powerName(2) + " is needed to gain new followers.",UI.powerName(3) + " are gathered by your neophytes.<br>" + "They are needed for rituals to upgrade your<br>followers " + "and also for the final ritual of summoning."];
Status.tipConvert = "Cost to convert to ";
Status.tipUpgrade = ["To gain an adept you need " + Game.upgradeCost + " neophytes and 1 virgin.","To gain a priest you need " + Game.upgradeCost + " adepts and 2 virgins.",""];
Status.tipFollowers = ["Neophytes can find some virgins if they're lucky.","Adepts can lower society awareness and investigator's willpower.",""];
Status.tipTurns = "Shows the number of turns passed from the start.";
Status.tipAwareness = "Shows how much human society is aware of the cult.<br>" + "<li>The greater awareness is the harder it is to do anything:<br>" + "gain new followers, resources or make rituals.<br> " + "<li>Adepts can lower the society awareness using resources.<br>" + "<li>The more adepts you have the more you can lower awareness each turn.";
Status.tipLowerAwareness = "Your adepts can use resources to lower society awareness.";
Status.tipLowerWillpower = "Your adepts can use resources to lower willpower of an investigator.<br>Cost: ";
Status.tipEndTurn = "Click to end current turn (or press <span style=\"color:white\">E</span>).";
Status.tipMainMenu = "Click to open main menu (or press <span style=\"color:white\">ESC</span>).";
TopMenu.buttonHeight = 20;
UINode.imageKeys = { c : [0,17], cg : [19,21], cgp : [42,21], o : [65,25], op : [92,25], neutral : [125,17], neutralg : [144,21]};
js.Lib.onerror = null;
sects.Sect.taskClasses = [sects.DoNothingTask,sects.CultGeneralInfoTask,sects.CultNodeInfoTask,sects.CultResourceInfoTask,sects.CultSabotageRitualTask,sects.InvSearchTask,sects.InvConfuseTask];
sects.Sect.names0 = ["Open","Free","Rising","Strong"];
sects.Sect.names = ["Way","Path","Society","Group","School","Faith","Mind","Love","Care","Reform","State","Sun","Moon","Wisdom"];
Game.main();
