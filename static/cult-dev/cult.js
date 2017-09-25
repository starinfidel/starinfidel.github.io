(function (console, $hx_exports) { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var Cult = function(gvar,uivar,id,infoID) {
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
	var _g1 = 0;
	var _g = this.game.difficulty.numCults;
	while(_g1 < _g) {
		var i = _g1++;
		this.isInfoKnown[i] = this.game.difficulty.isInfoKnown;
	}
	var _g11 = 0;
	var _g2 = this.game.difficulty.numCults;
	while(_g11 < _g2) {
		var i1 = _g11++;
		this.isDiscovered[i1] = this.game.difficulty.isDiscovered;
	}
	this.isDiscovered[id] = true;
	this.isInfoKnown[id] = true;
	this.power = [0,0,0,0];
	this.powerMod = [0,0,0,0];
	this.wars = [];
	var _g12 = 0;
	var _g3 = this.game.difficulty.numCults;
	while(_g12 < _g3) {
		var i2 = _g12++;
		this.wars.push(false);
	}
	this.adeptsUsed = 0;
	this.set_awareness(0);
	this.nodes = new List();
	this.sects = new List();
	this.investigatorTimeout = 0;
	this.difficulty = this.game.difficulty;
	this.logMessages = "";
	this.logPanelMessages = new List();
};
Cult.__name__ = true;
Cult.prototype = {
	load: function(c) {
		this.difficulty = Static.difficulty[c.dif];
		if(c.ide) this.isDead = true; else this.isDead = false;
		if(c.ip) this.isParalyzed = true; else this.isParalyzed = false;
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
			var _g = 0;
			var _g1 = Static.rituals;
			while(_g < _g1.length) {
				var r = _g1[_g];
				++_g;
				if(r.id == c.r) this.ritual = r;
			}
		}
		this.set_awareness(c.aw);
		if(c.w != null) {
			var wlist = c.w;
			this.wars = [];
			var _g2 = 0;
			while(_g2 < wlist.length) {
				var w = wlist[_g2];
				++_g2;
				this.wars.push(w == 1?true:false);
			}
		}
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
		var _g = 0;
		var _g1 = this.wars;
		while(_g < _g1.length) {
			var w = _g1[_g];
			++_g;
			ww.push(w?1:0);
			if(w) savewars = true;
		}
		if(savewars) obj.w = this.wars;
		return obj;
	}
	,getMaxSects: function() {
		return this.nodes.length / 4 | 0;
	}
	,createSect: function(node) {
		if(this.sects.length >= (this.nodes.length / 4 | 0)) return;
		var sect = new sects_Sect(this.game,this.ui,node,this);
		this.sects.add(sect);
		node.sect = sect;
		node.update();
		if(!this.isAI) this.ui.log2(this,node.name + " becomes the leader of a sect " + sect.name + ".",{ type : "sect"});
	}
	,removeSect: function(node) {
		this.ui.log2(this,"Sect " + node.sect.name + " has been destroyed without leadership.",{ type : "sect"});
		this.sects.remove(node.sect);
		node.sect = null;
		node.update();
	}
	,setOrigin: function() {
		var index = -1;
		while(true) {
			index = Math.round((this.game.nodes.length - 1) * Math.random());
			var node = this.game.nodes[index];
			if(node.owner != null) continue;
			var ok = 1;
			var _g = 0;
			var _g1 = this.game.cults;
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
		var _g11 = 0;
		var _g2 = Game.numPowers;
		while(_g11 < _g2) {
			var i = _g11++;
			if(this.origin.power[i] > 0) {
				this.origin.powerGenerated[i] = 1;
				this.powerMod[i] += 1;
			}
		}
		this.origin.setGenerator(true);
		this.origin.setVisible(this,true);
		this.origin.showLinks();
		this.highlightedNodes.clear();
		var _g12 = 0;
		var _g3 = Game.numPowers;
		while(_g12 < _g3) {
			var i1 = _g12++;
			this.power[i1] += Math.round(this.origin.powerGenerated[i1]);
			if(Math.random() < 0.5) this.origin.power[i1]++;
		}
		this.origin.update();
		if(!this.isAI && this.game.difficultyLevel == 2) this.removeCloseGenerators();
	}
	,removeCloseGenerators: function() {
		var _g_head = this.origin.links.h;
		var _g_val = null;
		while(_g_head != null) {
			var n;
			n = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			if(n.owner == null && n.isGenerator) n.setGenerator(false);
		}
	}
	,set_awareness: function(v) {
		this.awareness = v;
		var _g = 0;
		var _g1 = this.game.nodes;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			if(n.visibility[this.id] && n.owner != this) n.update();
		}
		return v;
	}
	,getResourceChance: function() {
		var ch = 99 - (this.difficulty.awarenessResource * this.awareness | 0);
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
	,getGainChance: function(node) {
		var ch = 0;
		if(!node.isGenerator) ch = 99 - (this.awareness * this.difficulty.awarenessGain | 0); else ch = 99 - (this.awareness * 2 * this.difficulty.awarenessGain | 0);
		if(!this.isAI && node.owner != null && !node.owner.isInfoKnown[this.game.player.id]) ch -= 20;
		if(!this.isAI && node.owner != null && !node.isKnown[this.game.player.id]) ch -= 10;
		if(ch < 1) ch = 1;
		return ch;
	}
	,lowerAwareness: function(pwr) {
		if(this.awareness == 0 || this.adeptsUsed >= this.get_adepts() || pwr == 3) return;
		var _g = this;
		_g.set_awareness(_g.awareness - 2);
		if(this.awareness < 0) this.set_awareness(0);
		this.power[pwr]--;
		this.adeptsUsed++;
		if(!this.isAI) {
			this.ui.updateStatus();
			this.ui.map.paint();
		}
	}
	,lowerWillpower: function(pwr) {
		if(!this.hasInvestigator || this.adeptsUsed >= this.get_adepts() || pwr == 3 || this.power[pwr] < Game.willPowerCost || this.investigator.isHidden) return;
		this.power[pwr] -= Game.willPowerCost;
		this.adeptsUsed++;
		var failChance = 30 * this.difficulty.investigatorWillpower;
		if(this.investigator.name == "Randolph Carter") failChance += 10;
		if(100 * Math.random() < failChance) {
			if(!this.isAI) {
				window.document.getElementById("jqDialog_close").style.visibility = "hidden";
				JQDialog.notify("You have failed to shatter the will of the investigator.",1);
				this.ui.updateStatus();
			}
			return;
		}
		this.investigator.will -= 1;
		if(this.investigator.will <= 0) {
			this.ui.log2(this,"The investigator of the " + this.get_fullName() + " has disappeared.",{ symbol : "I"});
			this.killInvestigator();
		}
		if(!this.isAI) this.ui.updateStatus();
	}
	,killInvestigator: function() {
		this.investigator = null;
		this.hasInvestigator = false;
		this.investigatorTimeout = 3;
		this.game.failSectTasks();
	}
	,convert: function(from,to) {
		if(this.power[from] < Game.powerConversionCost[from]) return;
		this.power[from] -= Game.powerConversionCost[from];
		this.power[to] += 1;
		if(!this.isAI) this.ui.updateStatus();
	}
	,canUpgrade: function(level) {
		if(level < 2) return this.getNumFollowers(level) >= Game.upgradeCost && this.get_virgins() >= level + 1; else return this.get_priests() >= Game.upgradeCost && this.get_virgins() >= this.game.difficulty.numSummonVirgins && !this.isRitual;
	}
	,upgrade: function(level) {
		if(!this.canUpgrade(level)) return;
		if(level == 2 && this.get_virgins() < this.game.difficulty.numSummonVirgins || level < 2 && this.get_virgins() < level + 1) return;
		if(level == 2) {
			this.summonStart();
			return;
		}
		var _g = this;
		_g.set_virgins(_g.get_virgins() - (level + 1));
		if(100 * Math.random() > this.getUpgradeChance(level)) {
			if(!this.isAI) {
				window.document.getElementById("jqDialog_close").style.visibility = "hidden";
				JQDialog.notify("Ritual failed.",1);
				this.ui.updateStatus();
			}
			return;
		}
		var _g1 = this;
		_g1.set_awareness(_g1.awareness + level);
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
		if(this != this.game.player && this.get_priests() >= 2) this.ui.log2(this,this.get_fullName() + " has " + this.get_priests() + " priests. Be careful.");
		if(this.isParalyzed && this.get_priests() >= 1) {
			this.unParalyze();
			this.ui.log2(this,this.get_fullName() + " has gained a priest and is no longer paralyzed.");
		}
		this.ui.map.paint();
	}
	,findMostLinkedNode: function(level,noSects) {
		var node = null;
		var nlinks = -1;
		if(level != null) {
			var _g_head = this.nodes.h;
			var _g_val = null;
			while(_g_head != null) {
				var n;
				n = (function($this) {
					var $r;
					_g_val = _g_head[0];
					_g_head = _g_head[1];
					$r = _g_val;
					return $r;
				}(this));
				if(noSects && n.sect != null) continue;
				var cnt = 0;
				var _g_head1 = n.links.h;
				var _g_val1 = null;
				while(_g_head1 != null) {
					var l;
					l = (function($this) {
						var $r;
						_g_val1 = _g_head1[0];
						_g_head1 = _g_head1[1];
						$r = _g_val1;
						return $r;
					}(this));
					if(l.owner == this) cnt++;
				}
				if(n.level == level && cnt > nlinks) {
					node = n;
					nlinks = cnt;
				}
			}
		} else {
			var _g_head2 = this.nodes.h;
			var _g_val2 = null;
			while(_g_head2 != null) {
				var n1;
				n1 = (function($this) {
					var $r;
					_g_val2 = _g_head2[0];
					_g_head2 = _g_head2[1];
					$r = _g_val2;
					return $r;
				}(this));
				if(noSects && n1.sect != null) continue;
				var cnt1 = 0;
				var _g_head3 = n1.links.h;
				var _g_val3 = null;
				while(_g_head3 != null) {
					var l1;
					l1 = (function($this) {
						var $r;
						_g_val3 = _g_head3[0];
						_g_head3 = _g_head3[1];
						$r = _g_val3;
						return $r;
					}(this));
					if(l1.owner == this) cnt1++;
				}
				if(cnt1 > nlinks) {
					node = n1;
					nlinks = cnt1;
				}
			}
		}
		return node;
	}
	,unParalyze: function() {
		var node = this.findMostLinkedNode();
		node.makeGenerator();
		node.isTempGenerator = true;
		this.isParalyzed = false;
		this.paralyzedTurns = 0;
		this.origin = node;
	}
	,getInvestigatorChance: function() {
		return Std["int"]((20 * this.get_priests() + 5 * this.get_adepts() + 0.5 * this.get_neophytes()) * this.difficulty.investigatorChance);
	}
	,summonStart: function() {
		if(this.isRitual) {
			this.ui.alert("You must first finish the current ritual before starting another.");
			return;
		}
		var _g = this;
		_g.set_virgins(_g.get_virgins() - this.game.difficulty.numSummonVirgins);
		this.isRitual = true;
		var _g1 = 0;
		var _g11 = this.game.cults;
		while(_g1 < _g11.length) {
			var c = _g11[_g1];
			++_g1;
			this.isInfoKnown[c.id] = true;
		}
		this.ritual = Static.rituals[0];
		this.ritualPoints = this.ritual.points;
		var _g2 = 0;
		var _g12 = this.game.cults;
		while(_g2 < _g12.length) {
			var p = _g12[_g2];
			++_g2;
			if(p != this && !p.isDead) {
				p.wars[this.id] = true;
				this.wars[p.id] = true;
			}
		}
		this.ui.alert(this.get_fullName() + " has started the " + this.ritual.name + ".<br><br>" + this.info.summonStart);
		this.ui.log2(this,this.get_fullName() + " has started the " + this.ritual.name + ".");
		if(!this.isAI) this.ui.updateStatus();
	}
	,ritualFinish: function() {
		if(this.ritual.id == "summoning") this.summonFinish();
		this.isRitual = false;
	}
	,summonFinish: function() {
		if(100 * Math.random() > this.getUpgradeChance(2)) {
			var _g_head = this.nodes.h;
			var _g_val = null;
			while(_g_head != null) {
				var n;
				n = (function($this) {
					var $r;
					_g_val = _g_head[0];
					_g_head = _g_head[1];
					$r = _g_val;
					return $r;
				}(this));
				if(n.level == 2) {
					n.level = 0;
					n.update();
					break;
				}
			}
			if(!this.isAI) {
				this.ui.alert("The stars were not properly aligned. The high priest goes insane.");
				this.ui.log2(this,this.get_fullName() + " has failed to perform the " + Static.rituals[0].name + ".");
				this.ui.updateStatus();
			} else {
				this.ui.alert(this.get_fullName() + " has failed to perform the " + Static.rituals[0].name + ".<br><br>" + this.info.summonFail);
				this.ui.log2(this,this.get_fullName() + " has failed the " + Static.rituals[0].name + ".");
			}
			return;
		}
		this.game.isFinished = true;
		this.ui.finish(this,"summon");
		this.ui.log2(this,"Game over.");
	}
	,turn: function() {
		if(this.isParalyzed && this.paralyzedTurns > 3) {
			this.unParalyze();
			this.ui.log2(this,this.get_fullName() + " has gained an origin and is no longer paralyzed.");
		}
		if((this.get_priests() > 0 || this.get_adepts() > 0) && !this.hasInvestigator && 100 * Math.random() < this.getInvestigatorChance() && this.investigatorTimeout == 0) {
			this.hasInvestigator = true;
			this.ui.log2(this,"An investigator has found out about " + this.get_fullName() + ".",{ important : !this.isAI, symbol : "I"});
			this.investigator = new Investigator(this,this.ui,this.game);
			if(!this.isAI) this.ui.updateStatus();
		}
		if(this.investigatorTimeout > 0) this.investigatorTimeout--;
		if(this.isRitual) {
			this.ritualPoints -= this.get_priests();
			if(this.ritualPoints <= 0) this.ritualFinish();
			if(this.game.isFinished) return;
		}
		this.powerMod = [0,0,0,0];
		var _g_head = this.nodes.h;
		var _g_val = null;
		while(_g_head != null) {
			var node;
			node = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			if(node.isGenerator) {
				var _g1 = 0;
				var _g = Game.numPowers;
				while(_g1 < _g) {
					var i = _g1++;
					if(100 * Math.random() < this.getResourceChance()) this.power[i] += Math.round(node.powerGenerated[i]);
					this.powerMod[i] += Math.round(node.powerGenerated[i]);
				}
			}
		}
		var value = Std["int"](Math.random() * Std["int"](this.get_neophytes() / 4 - 0.5));
		var _g2 = this;
		_g2.set_virgins(_g2.get_virgins() + value);
		this.adeptsUsed = 0;
		if(this.hasInvestigator) this.investigator.turn();
		var _g_head1 = this.sects.h;
		var _g_val1 = null;
		while(_g_head1 != null) {
			var s;
			s = (function($this) {
				var $r;
				_g_val1 = _g_head1[0];
				_g_head1 = _g_head1[1];
				$r = _g_val1;
				return $r;
			}(this));
			s.turn();
		}
		if(this.isParalyzed) this.paralyzedTurns++;
		this.createSects();
		if(this.options.getBool("sectAdvisor")) this.game.sectAdvisor.run(this);
	}
	,createSects: function() {
		if(this.isAI) return;
		while(this.sects.length < (this.nodes.length / 4 | 0)) {
			var node = this.findMostLinkedNode(null,true);
			this.createSect(node);
		}
	}
	,maxVirgins: function() {
		return Std["int"](this.get_neophytes() / 4 - 0.5);
	}
	,canActivate: function(node) {
		var _g1 = 0;
		var _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.power[i] < node.power[i]) return false;
		}
		return true;
	}
	,activate: function(node) {
		if(this.isParalyzed) {
			if(!this.isAI) this.ui.alert("Cult is paralyzed without the Origin.");
			return "";
		}
		var ok = false;
		var _g_head = node.links.h;
		var _g_val = null;
		while(_g_head != null) {
			var l;
			l = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
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
			var _g_head1 = node.links.h;
			var _g_val1 = null;
			while(_g_head1 != null) {
				var n;
				n = (function($this) {
					var $r;
					_g_val1 = _g_head1[0];
					_g_head1 = _g_head1[1];
					$r = _g_val1;
					return $r;
				}(this));
				if(n.owner == node.owner) cnt++;
			}
			if(cnt >= 3) return "hasLinks";
		}
		var _g1 = 0;
		var _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.power[i] < node.power[i]) return "notEnoughPower";
		}
		var _g11 = 0;
		var _g2 = Game.numPowers;
		while(_g11 < _g2) {
			var i1 = _g11++;
			this.power[i1] = Math.round(this.power[i1] - node.power[i1]);
		}
		if(100 * Math.random() > this.getGainChance(node)) {
			if(!this.isAI) {
				window.document.getElementById("jqDialog_close").style.visibility = "hidden";
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
		var _g3 = 0;
		var _g12 = this.game.cults;
		while(_g3 < _g12.length) {
			var c = _g12[_g3];
			++_g3;
			if(c != this && node.visibility[c.id]) c.highlightNode(node);
		}
		return "ok";
	}
	,declareWar: function(cult) {
		if(cult.wars[this.id]) return;
		cult.wars[this.id] = true;
		this.wars[cult.id] = true;
		var text = this.get_fullName() + " has declared war against " + cult.get_fullName() + ".";
		var m = { id : -1, old : false, type : "cults", text : text, obj : { c1 : this, c2 : cult}, turn : this.game.turns + 1, params : { }};
		var _g = 0;
		var _g1 = this.game.cults;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			if(this.isInfoKnown[c.id] || cult.isInfoKnown[c.id] || this.isDiscovered[c.id] || cult.isDiscovered[c.id]) {
				c.log(text);
				c.logPanel(m);
			}
		}
	}
	,makePeace: function(cult) {
		if(!cult.wars[this.id]) return;
		cult.wars[this.id] = false;
		this.wars[cult.id] = false;
		var text = this.get_fullName() + " has made peace with " + cult.get_fullName() + ".";
		var m = { id : -1, old : false, type : "cults", text : text, obj : { c1 : this, c2 : cult}, turn : this.game.turns + 1, params : { }};
		var _g = 0;
		var _g1 = this.game.cults;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			if(this.isInfoKnown[c.id] || cult.isInfoKnown[c.id] || this.isDiscovered[c.id] || cult.isDiscovered[c.id]) {
				c.log(text);
				c.logPanel(m);
			}
		}
	}
	,loseNode: function(node,cult) {
		var _g = this;
		var _g1 = _g.awareness;
		_g.set_awareness(_g1 + 1);
		_g1;
		if(!this.isAI) this.ui.updateStatus();
		if(cult != null && this.nodes.length > 0) cult.declareWar(this);
		if(this.origin == node) this.loseOrigin();
		node.update();
		this.checkDeath();
	}
	,loseOrigin: function() {
		if(this.nodes.length > 0) this.ui.log2(this,this.get_fullName() + " has lost its Origin.");
		if(this.isRitual) {
			this.isRitual = false;
			this.ui.log2(this,"The execution of " + this.ritual.name + " has been stopped.");
			this.game.failSectTasks();
		}
		var ok = false;
		this.origin = null;
		var _g_head = this.nodes.h;
		var _g_val = null;
		while(_g_head != null) {
			var n;
			n = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			if(n.level == 2) {
				this.origin = n;
				ok = true;
				break;
			}
		}
		if(!ok) {
			if(this.nodes.length > 0) this.ui.log2(this,"Destroying the origin of " + this.get_fullName() + " has left it completely paralyzed.");
			this.isParalyzed = true;
			if(this.hasInvestigator) {
				this.killInvestigator();
				if(this.nodes.length > 0) this.ui.log2(this,"The investigator of the " + this.get_fullName() + " has disappeared thinking the cult is finished.");
			}
		} else {
			this.ui.log2(this,"Another priest becomes the Origin of " + this.get_fullName() + ".");
			this.origin.update();
			this.ui.map.paint();
		}
	}
	,checkVictory: function() {
		if(this.isDead || this.isParalyzed) return;
		var ok = true;
		var _g = 0;
		var _g1 = this.game.cults;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			if(p != this && !p.isDead && !p.isParalyzed) ok = false;
		}
		if(!ok) return;
		this.game.isFinished = true;
		this.ui.finish(this,"conquer");
	}
	,checkDeath: function() {
		if(this.nodes.length > 0 || this.isDead) return;
		this.ui.log2(this,this.get_fullName() + " has been destroyed, forgotten by time.");
		this.ui.map.paint();
		this.isDead = true;
		var _g = 0;
		var _g1 = this.game.cults;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			c.wars[this.id] = false;
		}
		var _g11 = 0;
		var _g2 = this.wars.length;
		while(_g11 < _g2) {
			var i = _g11++;
			this.wars[i] = false;
		}
		this.hasInvestigator = false;
		this.investigator = null;
		var _g3 = 0;
		var _g12 = this.game.cults;
		while(_g3 < _g12.length) {
			var c1 = _g12[_g3];
			++_g3;
			var _g2_head = c1.sects.h;
			var _g2_val = null;
			while(_g2_head != null) {
				var s;
				s = (function($this) {
					var $r;
					_g2_val = _g2_head[0];
					_g2_head = _g2_head[1];
					$r = _g2_val;
					return $r;
				}(this));
				if(s.task != null && s.task.type == "cult" && s.taskTarget == this) s.clearTask();
			}
		}
		if(!this.isAI) {
			var humansAlive = false;
			var _g4 = 0;
			var _g13 = this.game.cults;
			while(_g4 < _g13.length) {
				var c2 = _g13[_g4];
				++_g4;
				if(!c2.isAI && !c2.isDead) {
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
	,discover: function(cult) {
		cult.isDiscovered[this.id] = true;
		this.isDiscovered[cult.id] = true;
		this.ui.log2(this,this.get_fullName() + " has discovered the existence of " + cult.get_fullName() + ".");
	}
	,log: function(s) {
		if(this.isAI) return;
		var s2 = this.ui.logWindow.getRenderedMessage(s);
		this.logMessages += s2;
	}
	,logPanelShort: function(s) {
		this.logPanel({ id : -1, old : false, type : "cult", text : s, obj : this, turn : this.game.turns + 1, params : { }});
	}
	,logPanel: function(m) {
		if(this.logPanelMessages.length >= 24) this.logPanelMessages.clear();
		this.logPanelMessages.add(m);
		this.ui.logPanel.paint();
	}
	,highlightNode: function(n) {
		if(this.isAI) return;
		this.highlightedNodes.add(n);
	}
	,get_virgins: function() {
		return this.power[3];
	}
	,set_virgins: function(v) {
		this.power[3] = v;
		return v;
	}
	,getNumFollowers: function(level) {
		var cnt = 0;
		var _g_head = this.nodes.h;
		var _g_val = null;
		while(_g_head != null) {
			var n;
			n = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			if(n.level == level) cnt++;
		}
		return cnt;
	}
	,get_neophytes: function() {
		return this.getNumFollowers(0);
	}
	,get_adepts: function() {
		return this.getNumFollowers(1);
	}
	,get_priests: function() {
		return this.getNumFollowers(2);
	}
	,get_fullName: function() {
		return UI.cultName(this.id,this.info);
	}
};
var AI = function(gvar,uivar,id,infoID) {
	Cult.call(this,gvar,uivar,id,infoID);
	this.isAI = true;
	if(this.game.difficultyLevel == 0) this.difficulty = Static.difficulty[2]; else if(this.game.difficultyLevel == 2) this.difficulty = Static.difficulty[0]; else this.difficulty = Static.difficulty[1];
};
AI.__name__ = true;
AI.__super__ = Cult;
AI.prototype = $extend(Cult.prototype,{
	aiTurn: function() {
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
		if(this.hasInvestigator && this.get_adepts() > 0) {
			if(this.awareness >= this.difficulty.maxAwareness) this.aiLowerAwarenessHard(); else this.aiLowerWillpower();
			return;
		}
		this.aiUpgradeFollowers();
		if(this.isRitual && this.ritual.id == "summoning") this.aiLowerAwarenessHard();
		this.aiLowerAwareness();
		this.aiSummon();
		if(this.awareness > this.difficulty.maxAwareness && this.get_adepts() > 0) return;
		var list = [];
		var _g = 0;
		var _g1 = this.game.nodes;
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
		var _g2 = 0;
		while(_g2 < list.length) {
			var item1 = list[_g2];
			++_g2;
			var node1 = item1.node;
			var ret = this.activate(node1);
			if(ret == "ok") continue;
			if(ret == "notEnoughPower") this.aiActivateNodeByConvert(node1); else if(ret == "hasLinks") 1;
		}
		this.aiTryPeace();
	}
	,aiTryPeace: function() {
		if(this.isRitual) return;
		var ok = false;
		var _g = 0;
		var _g1 = this.game.cults;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			if(c.isRitual) {
				ok = true;
				break;
			}
		}
		if(!ok) return;
		var _g2 = 0;
		while(_g2 < 3) {
			var i = _g2++;
			if(this.wars[i] && !this.game.cults[i].isRitual) {
				if(Math.random() * 100 > 30) continue;
				this.makePeace(this.game.cults[i]);
			}
		}
	}
	,aiUpgradeFollowers: function() {
		if(this.get_virgins() == 0) return;
		if(this.get_adepts() < 5 && this.getUpgradeChance(0) > 70 && this.get_virgins() > 0) {
			while(true) {
				if(!this.canUpgrade(0) || this.get_virgins() < 1 || this.get_adepts() >= 5) break;
				this.upgrade(0);
				if(Game.debugAI) console.log(this.name + " upgrade neophyte, adepts: " + this.get_adepts());
			}
			return;
		}
		if(this.get_priests() < 3 && this.getUpgradeChance(1) > 60 && this.get_virgins() > 1) {
			while(true) {
				if(!this.canUpgrade(1) || this.get_virgins() < 2 || this.get_priests() >= 3) break;
				this.upgrade(1);
				if(Game.debugAI) console.log("!!! " + this.name + " upgrade adept, priests: " + this.get_priests());
			}
			return;
		}
	}
	,aiLowerWillpower: function() {
		if(!this.hasInvestigator || this.investigator.isHidden || this.get_adepts() == 0) return;
		var _g1 = 0;
		var _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			this.lowerWillpower(i);
			this.lowerWillpower(i);
		}
	}
	,aiLowerAwarenessHard: function() {
		if(this.awareness == 0 || this.get_adepts() == 0) return;
		var prevAwareness = this.awareness;
		while(this.get_virgins() > 0 && this.adeptsUsed < this.get_adepts() && this.awareness >= 0) {
			this.convert(3,0);
			this.lowerAwareness(0);
		}
		if(Game.debugAI && this.awareness != prevAwareness) console.log(this.name + " virgin awareness " + prevAwareness + "% -> " + this.awareness + "%");
	}
	,aiLowerAwareness: function() {
		if(this.awareness < this.difficulty.maxAwareness && !this.hasInvestigator || this.awareness < 5 && this.hasInvestigator || this.get_adepts() == 0 || this.adeptsUsed >= this.get_adepts()) return;
		var prevAwareness = this.awareness;
		var _g1 = 0;
		var _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			while(this.power[i] > 0 && this.adeptsUsed < this.get_adepts() && this.awareness >= this.difficulty.maxAwareness) this.lowerAwareness(i);
		}
		if(Game.debugAI && this.awareness != prevAwareness) console.log(this.name + " awareness " + prevAwareness + "% -> " + this.awareness + "%");
	}
	,aiSummon: function() {
		if(this.get_priests() < 3 || this.get_virgins() < 9 || this.getUpgradeChance(2) < 50 || this.isRitual) return;
		if(Game.debugAI) console.log(this.name + " TRY SUMMON!");
		this.summonStart();
	}
	,aiActivateNodeByConvert: function(node) {
		var resNeed = -1;
		var _g1 = 0;
		var _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.power[i] < node.power[i]) resNeed = i;
		}
		var resConv = -1;
		var _g11 = 0;
		var _g2 = Game.numPowers;
		while(_g11 < _g2) {
			var i1 = _g11++;
			if(i1 != resNeed) {
				if((this.power[i1] / Game.powerConversionCost[i1] | 0) > node.power[resNeed]) resConv = i1;
			}
		}
		if(resConv < 0) return;
		var _g12 = 0;
		var _g3 = node.power[resNeed];
		while(_g12 < _g3) {
			var i2 = _g12++;
			this.convert(resConv,resNeed);
		}
		this.activate(node);
	}
});
var Alert = function(uivar,gvar) {
	this.ui = uivar;
	this.game = gvar;
	this.isVisible = false;
	this.window = Tools.window({ id : "windowAlert", center : true, winW : UI.winWidth, winH : UI.winHeight, bold : true, w : 600, h : 450, z : 25});
	this.window.style.display = "none";
	this.window.style.background = "#222";
	this.window.style.border = "4px double #ffffff";
	var _this = window.document;
	this.text = _this.createElement("div");
	this.text.style.overflow = "auto";
	this.text.style.position = "absolute";
	this.text.style.left = "10px";
	this.text.style.top = "10px";
	this.text.style.width = "580px";
	this.text.style.height = "400px";
	this.text.style.background = "#111";
	this.text.style.border = "1px solid #777";
	this.window.appendChild(this.text);
	var close = Tools.closeButton(this.window,260,415,"alertClose");
	close.onclick = $bind(this,this.onClose);
	this.bg = Tools.bg({ w : UI.winWidth + 20, h : UI.winHeight, z : 24});
};
Alert.__name__ = true;
Alert.prototype = {
	onClose: function(event) {
		this.window.style.display = "none";
		this.bg.style.display = "none";
		this.isVisible = false;
	}
	,show: function(s,shadow,shadowOpacity) {
		if(shadowOpacity == null) shadowOpacity = 0.8;
		this.bg.style.opacity = "" + shadowOpacity;
		this.text.innerHTML = "<center>" + s + "</center>";
		this.window.style.display = "inline";
		if(shadow) this.bg.style.display = "inline"; else this.bg.style.display = "none";
		this.isVisible = true;
	}
};
var Config = function() {
};
Config.__name__ = true;
Config.prototype = {
	get: function(name) {
		return getCookie(name);
	}
	,set: function(name,val) {
		return setCookie(name,val,new Date(2015, 0, 0, 0, 0, 0, 0));
	}
};
var CustomMenu = function(uivar,gvar) {
	this.ui = uivar;
	this.game = gvar;
	this.isVisible = false;
	this.window = Tools.window({ id : "customMenuWindow", center : true, winW : UI.winWidth, winH : UI.winHeight, w : 1000, h : 500, z : 20});
	Tools.label({ id : "titleLabel", text : "Custom game parameters", w : 300, h : 30, x : 320, y : 10, container : this.window});
	var divel = window.document.createElement("div");
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
	var _g = 0;
	var _g1 = CustomMenu.difElementInfo;
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
CustomMenu.__name__ = true;
CustomMenu.prototype = {
	onStartGame: function(e) {
		var dif = { level : -1};
		window.document.getElementById("haxe:trace").innerHTML = "";
		var _g = 0;
		var _g1 = CustomMenu.difElementInfo;
		while(_g < _g1.length) {
			var info = _g1[_g];
			++_g;
			var el = null;
			var _g2_head = this.difElements.h;
			var _g2_val = null;
			while(_g2_head != null) {
				var e1;
				e1 = (function($this) {
					var $r;
					_g2_val = _g2_head[0];
					_g2_head = _g2_head[1];
					$r = _g2_val;
					return $r;
				}(this));
				if(e1.id == info.name) {
					el = e1;
					break;
				}
			}
			var value = null;
			if(info.type == "int") value = Std.parseInt(el.value); else if(info.type == "float") value = parseFloat(el.value); else if(info.type == "bool") value = el.checked;
			dif[info.name] = value;
		}
		if(dif.numPlayers < 1) dif.numPlayers = 1;
		if(dif.numCults < 2) dif.numCults = 2;
		if(dif.numPlayers > 8) dif.numPlayers = 8;
		if(dif.numCults > 8) dif.numCults = 8;
		this.game.restart(-1,dif);
		this.realClose();
	}
	,show: function() {
		this.window.style.display = "inline";
		this.bg.style.display = "inline";
		this.close.style.display = "inline";
		this.isVisible = true;
	}
	,onKey: function(e) {
		if(e.keyCode == 27) this.onClose(null);
	}
	,realClose: function() {
		this.window.style.display = "none";
		this.bg.style.display = "none";
		this.close.style.display = "none";
		this.isVisible = false;
	}
	,onClose: function(event) {
		this.realClose();
		this.ui.mainMenu.show();
	}
};
var DateTools = function() { };
DateTools.__name__ = true;
DateTools.__format_get = function(d,e) {
	switch(e) {
	case "%":
		return "%";
	case "C":
		return StringTools.lpad(Std.string(Std["int"](d.getFullYear() / 100)),"0",2);
	case "d":
		return StringTools.lpad(Std.string(d.getDate()),"0",2);
	case "D":
		return DateTools.__format(d,"%m/%d/%y");
	case "e":
		return Std.string(d.getDate());
	case "F":
		return DateTools.__format(d,"%Y-%m-%d");
	case "H":case "k":
		return StringTools.lpad(Std.string(d.getHours()),e == "H"?"0":" ",2);
	case "I":case "l":
		var hour = d.getHours() % 12;
		return StringTools.lpad(Std.string(hour == 0?12:hour),e == "I"?"0":" ",2);
	case "m":
		return StringTools.lpad(Std.string(d.getMonth() + 1),"0",2);
	case "M":
		return StringTools.lpad(Std.string(d.getMinutes()),"0",2);
	case "n":
		return "\n";
	case "p":
		if(d.getHours() > 11) return "PM"; else return "AM";
		break;
	case "r":
		return DateTools.__format(d,"%I:%M:%S %p");
	case "R":
		return DateTools.__format(d,"%H:%M");
	case "s":
		return Std.string(Std["int"](d.getTime() / 1000));
	case "S":
		return StringTools.lpad(Std.string(d.getSeconds()),"0",2);
	case "t":
		return "\t";
	case "T":
		return DateTools.__format(d,"%H:%M:%S");
	case "u":
		var t = d.getDay();
		if(t == 0) return "7"; else if(t == null) return "null"; else return "" + t;
		break;
	case "w":
		return Std.string(d.getDay());
	case "y":
		return StringTools.lpad(Std.string(d.getFullYear() % 100),"0",2);
	case "Y":
		return Std.string(d.getFullYear());
	default:
		throw new js__$Boot_HaxeError("Date.format %" + e + "- not implemented yet.");
	}
};
DateTools.__format = function(d,f) {
	var r = new StringBuf();
	var p = 0;
	while(true) {
		var np = f.indexOf("%",p);
		if(np < 0) break;
		r.addSub(f,p,np - p);
		r.add(DateTools.__format_get(d,HxOverrides.substr(f,np + 1,1)));
		p = np + 2;
	}
	r.addSub(f,p,f.length - p);
	return r.b;
};
DateTools.format = function(d,f) {
	return DateTools.__format(d,f);
};
var Debug = function(uivar,gvar) {
	this.ui = uivar;
	this.game = gvar;
	this.isVisible = false;
	this.buttons = [];
	this.window = Tools.window({ id : "debugWindow", center : true, winW : UI.winWidth, winH : UI.winHeight, fontSize : 18, w : 800, h : 500, z : 20});
	var _this = window.document;
	this.menu = _this.createElement("div");
	this.menu.style.overflow = "auto";
	this.menu.style.position = "absolute";
	this.menu.style.left = "10px";
	this.menu.style.top = "10px";
	this.menu.style.width = "780px";
	this.menu.style.height = "450px";
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
Debug.__name__ = true;
Debug.prototype = {
	onUpgradeSects: function(event) {
		var _g_head = this.game.player.sects.h;
		var _g_val = null;
		while(_g_head != null) {
			var s;
			s = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			s.size += 100;
		}
	}
	,onGiveAdepts: function(event) {
		this.onGivePower(null);
		var _g = 0;
		while(_g < 3) {
			var i = _g++;
			var _g1_head = this.game.player.nodes.h;
			var _g1_val = null;
			while(_g1_head != null) {
				var n;
				n = (function($this) {
					var $r;
					_g1_val = _g1_head[0];
					_g1_head = _g1_head[1];
					$r = _g1_val;
					return $r;
				}(this));
				if(n.level < 1 && Math.random() < 0.5) n.upgrade();
				var _g1_head1 = n.links.h;
				var _g1_val1 = null;
				while(_g1_head1 != null) {
					var n2;
					n2 = (function($this) {
						var $r;
						_g1_val1 = _g1_head1[0];
						_g1_head1 = _g1_head1[1];
						$r = _g1_val1;
						return $r;
					}(this));
					if(Math.random() < 0.2) this.game.player.activate(n2);
				}
			}
		}
	}
	,onClearTrace: function(event) {
		window.document.getElementById("haxe:trace").innerHTML = "";
	}
	,onTiming: function(event) {
		Game.debugTime = !Game.debugTime;
		console.log("timing " + (Game.debugTime?"on":"off"));
	}
	,onAI: function(event) {
		Game.debugAI = !Game.debugAI;
		console.log("trace ai " + (Game.debugAI?"on":"off"));
	}
	,onDirector: function(event) {
		Game.debugDirector = !Game.debugDirector;
		console.log("trace director " + (Game.debugDirector?"on":"off"));
	}
	,onVis: function(event) {
		Game.debugVis = !Game.debugVis;
		var _g = 0;
		var _g1 = this.game.nodes;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			n.update();
		}
		console.log("node visibility to cults info " + (Game.debugVis?"on":"off"));
	}
	,onNear: function(event) {
		Game.debugNear = !Game.debugNear;
		var _g = 0;
		var _g1 = this.game.nodes;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			n.update();
		}
		console.log("node nearness info " + (Game.debugNear?"on":"off"));
	}
	,onToggleInvisible: function(event) {
		this.game.player.isDebugInvisible = !this.game.player.isDebugInvisible;
		console.log("invisibility " + (this.game.player.isDebugInvisible?"on":"off"));
	}
	,onTotalWar: function(event) {
		var _g = 0;
		var _g1 = this.game.cults;
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
	,onVictorySummon: function(event) {
		this.ui.finish(this.game.cults[0],"summon");
	}
	,onInvestigatorAI: function(event) {
		var _g = 0;
		var _g1 = this.game.cults;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			if(c.isAI) {
				c.hasInvestigator = true;
				c.investigator = new Investigator(c,this.ui,this.game);
			}
		}
	}
	,onInvestigatorPlayer: function(event) {
		var _g = 0;
		var _g1 = this.game.cults;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			if(c == this.game.player) {
				c.hasInvestigator = true;
				c.investigator = new Investigator(c,this.ui,this.game);
			}
		}
	}
	,onGivePower: function(event) {
		var _g = 0;
		while(_g < 4) {
			var i = _g++;
			this.game.player.power[i] += 100;
		}
		this.ui.updateStatus();
	}
	,onOpenMap: function(event) {
		var _g = 0;
		var _g1 = this.game.nodes;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			n.setVisible(this.game.player,true);
			n.isKnown[this.game.player.id] = true;
		}
		var _g2 = 0;
		var _g11 = this.game.cults;
		while(_g2 < _g11.length) {
			var c = _g11[_g2];
			++_g2;
			c.isInfoKnown[this.game.player.id] = true;
			var _g2_head = c.nodes.h;
			var _g2_val = null;
			while(_g2_head != null) {
				var n1;
				n1 = (function($this) {
					var $r;
					_g2_val = _g2_head[0];
					_g2_head = _g2_head[1];
					$r = _g2_val;
					return $r;
				}(this));
				n1.update();
			}
		}
		this.ui.map.paint();
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
	,onKey: function(e) {
		if(e.keyCode == 27 || e.keyCode == 13 || e.keyCode == 32) {
			this.onClose(null);
			return;
		}
		var _g = 0;
		var _g1 = this.buttons;
		while(_g < _g1.length) {
			var b = _g1[_g];
			++_g;
			if(b.name == String.fromCharCode(e.keyCode).toLowerCase()) {
				b.onclick(null);
				break;
			}
		}
	}
	,onClose: function(event) {
		this.window.style.display = "none";
		this.isVisible = false;
	}
	,show: function() {
		this.window.style.display = "inline";
		this.isVisible = true;
	}
};
var Director = function(g,vui) {
	this.game = g;
	this.ui = vui;
};
Director.__name__ = true;
Director.prototype = {
	turn: function() {
		if(this.game.turns < 5) return;
		var cult = this.findWeakestCult();
		this.giveVirgins(cult);
		this.doubleGenerators(cult);
	}
	,giveVirgins: function(cult) {
		if(Math.random() > 0.3) return;
		if(Std["int"](cult.get_neophytes() / 4 - 0.5) < 1) return;
		var n = 1 + Std["int"](Math.random() * 2);
		var _g = cult;
		_g.set_virgins(_g.get_virgins() + 2);
		if(Game.debugDirector) console.log("give " + n + " virgins to " + cult.name);
	}
	,doubleGenerators: function(cult) {
		if(Math.random() > 0.3) return;
		var power = [0,0,0];
		var _g_head = cult.nodes.h;
		var _g_val = null;
		while(_g_head != null) {
			var node;
			node = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			if(!node.isGenerator) continue;
			var _g1 = 0;
			var _g = Game.numPowers;
			while(_g1 < _g) {
				var i = _g1++;
				if(node.powerGenerated[i] > 0) {
					power[i] += node.powerGenerated[i];
					if(Math.random() < 0.1) power[i] += node.powerGenerated[i];
				}
			}
		}
		var _g11 = 0;
		var _g2 = Game.numPowers;
		while(_g11 < _g2) {
			var i1 = _g11++;
			cult.power[i1] += power[i1];
		}
		if(Game.debugDirector) console.log("give " + Std.string(power) + " to " + cult.name);
	}
	,getCultPower: function(cult) {
		var power = 0;
		var _g_head = cult.nodes.h;
		var _g_val = null;
		while(_g_head != null) {
			var node;
			node = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			power++;
			if(node.isGenerator) power++;
		}
		var _g = 0;
		var _g1 = cult.power;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			power += p;
		}
		return power;
	}
	,findWeakestCult: function() {
		var cult = null;
		var cultPower = 10000;
		var _g = 0;
		var _g1 = this.game.cults;
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
	,debug: function(s) {
		if(Game.debugDirector) console.log(s);
	}
};
var Game = $hx_exports.Game = function() {
	this.isNeverStarted = true;
	this.isFinished = true;
	this.turns = 0;
	this.ui = new UI(this);
	this.ui.init();
	this.director = new Director(this,this.ui);
	this.sectAdvisor = new sects_Advisor(this);
	this.ui.mainMenu.show();
	this.sectTasks = [];
	var _g = 0;
	var _g1 = sects_Sect.taskClasses;
	while(_g < _g1.length) {
		var cl = _g1[_g];
		++_g;
		var t = Type.createInstance(cl,[]);
		this.sectTasks.push(t);
	}
};
Game.__name__ = true;
Game.main = function() {
	Game.instance = new Game();
};
Game.prototype = {
	restart: function(newDifficulty,newDif) {
		this.isNeverStarted = false;
		if(getCookie("hasPlayed") == null) this.ui.alert("Welcome.<br><br>If this is your first time playing, please take the time to " + "read the <a target=_blank href='https://github.com/infidel-/cult/blob/wiki/Manual_" + Game.manualVersion + ".md'>Manual</a> " + "before playing. We are not responsible for horrific deaths caused by not reading the " + "Manual. You have been warned.");
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
		this.nodes = [];
		this.cults = [];
		this.lastCultID = 0;
		var cultInfo = [];
		var numPlayersLeft = this.difficulty.numPlayers;
		var _g1 = 0;
		var _g = this.difficulty.numCults;
		while(_g1 < _g) {
			var i = _g1++;
			var p = null;
			var id = this.lastCultID++;
			var infoID = 0;
			if(i > 0) while(true) {
				infoID = 1 + Std["int"](Math.random() * (Static.cults.length - 1));
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
		var _g11 = 1;
		var _g3 = this.difficulty.nodesCount + 1;
		while(_g11 < _g3) {
			var i1 = _g11++;
			this.spawnNode();
		}
		var cnt = 0.15 * this.difficulty.nodesCount | 0;
		var _g4 = 0;
		while(_g4 < cnt) {
			var i2 = _g4++;
			var nodeIndex = Math.round((this.difficulty.nodesCount - 1) * Math.random());
			var node = this.nodes[nodeIndex];
			node.makeGenerator();
		}
		this.updateLinks();
		var _g5 = 0;
		var _g12 = this.cults;
		while(_g5 < _g12.length) {
			var p1 = _g12[_g5];
			++_g5;
			p1.setOrigin();
		}
		this.ui.map.center(this.player.origin.x,this.player.origin.y);
		this.ui.updateStatus();
		var _g6 = 0;
		var _g13 = this.cults;
		while(_g6 < _g13.length) {
			var c = _g13[_g6];
			++_g6;
			c.log("Game started.");
		}
		if(Game.debugTime) console.log("restart" + ": " + (new Date().getTime() - this.timerTime) + "ms");
	}
	,updateLinks: function() {
		var _g = 0;
		var _g1 = this.nodes;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			var _g2 = 0;
			var _g3 = this.nodes;
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
	,spawnNode: function() {
		var x = 0;
		var y = 0;
		var cnt = 0;
		while(true) {
			x = Math.round(20 + Math.random() * (this.difficulty.mapWidth - UI.markerWidth - 40));
			y = Math.round(20 + Math.random() * (this.difficulty.mapHeight - UI.markerHeight - 40));
			cnt++;
			if(cnt > 100) return;
			var ok = 1;
			var _g = 0;
			var _g1 = this.nodes;
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
	,load: function(save) {
		this.isFinished = false;
		this.turns = 0;
		this.ui.clearMap();
		this.ui.clearLog();
		this.lines = new List();
		this.nodes = [];
		this.cults = [];
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
		var _g1 = 0;
		while(_g1 < savenodes.length) {
			var n = savenodes[_g1];
			++_g1;
			var node = new Node(this,this.ui,n.x,n.y,n.id);
			node.load(n);
			this.nodes.push(node);
			if(node.owner == this.player) node.isKnown[this.player.id] = true;
		}
		this.updateLinks();
		var _g2 = 0;
		while(_g2 < savecults.length) {
			var c1 = savecults[_g2];
			++_g2;
			var _g11 = 0;
			var _g21 = this.cults;
			while(_g11 < _g21.length) {
				var cc = _g21[_g11];
				++_g11;
				if(c1.id == cc.id) {
					var n1 = this.getNode(c1.or);
					if(n1 != null) cc.origin = n1;
				}
			}
		}
		var _g3 = 0;
		var _g12 = this.nodes;
		while(_g3 < _g12.length) {
			var n2 = _g12[_g3];
			++_g3;
			n2.update();
		}
		var savelines = save.lines;
		var _g4 = 0;
		while(_g4 < savelines.length) {
			var l = savelines[_g4];
			++_g4;
			var startNode = this.getNode(l[0]);
			var endNode = this.getNode(l[1]);
			var cult1 = this.cults[l[2]];
			var line = Line.create(this.ui.map,cult1,startNode,endNode);
			console.log("TODO: load lines visibility bug!");
			this.lines.add(line);
			startNode.lines.add(line);
			endNode.lines.add(line);
		}
		this.ui.updateStatus();
	}
	,save: function() {
		var save = { };
		save.nodes = [];
		var _g = 0;
		var _g1 = this.nodes;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			save.nodes.push(n.save());
		}
		save.cults = [];
		var _g2 = 0;
		var _g11 = this.cults;
		while(_g2 < _g11.length) {
			var c = _g11[_g2];
			++_g2;
			save.cults.push(c.save());
		}
		save.lines = [];
		console.log("TODO: save lines fail");
		save.turns = this.turns;
		save.dif = this.difficultyLevel;
		return save;
	}
	,getNode: function(id) {
		var _g = 0;
		var _g1 = this.nodes;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			if(n.id == id) return n;
		}
		return null;
	}
	,endTurn: function() {
		var newPlayerID = -1;
		var _g1 = this.currentPlayerID + 1;
		var _g = this.cults.length;
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
			var _g2 = 0;
			var _g11 = this.cults;
			while(_g2 < _g11.length) {
				var c1 = _g11[_g2];
				++_g2;
				c1.checkVictory();
			}
			var x = 0;
			var y = 0;
			if(this.player.origin != null) {
				x = this.player.origin.x;
				y = this.player.origin.y;
			} else {
				var node = this.player.nodes.first();
				var _g_head = this.player.nodes.h;
				var _g_val = null;
				while(_g_head != null) {
					var n;
					n = (function($this) {
						var $r;
						_g_val = _g_head[0];
						_g_head = _g_head[1];
						$r = _g_val;
						return $r;
					}(this));
					if(n.level > node.level) node = n;
				}
				x = node.x;
				y = node.y;
			}
			this.ui.map.center(x,y);
			this.ui.logPanel.paint();
			this.ui.updateStatus();
			if(this.difficulty.numPlayers > 1) this.ui.alert("Your turn<br>" + this.player.get_fullName(),true,1);
		}
		if(newPlayerID < 0) {
			this.turns++;
			this.currentPlayerID = -1;
			this.director.turn();
			this.endTurn();
		}
	}
	,failSectTasks: function() {
		var _g = 0;
		var _g1 = this.cults;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			var _g2_head = c.sects.h;
			var _g2_val = null;
			while(_g2_head != null) {
				var s;
				s = (function($this) {
					var $r;
					_g2_val = _g2_head[0];
					_g2_head = _g2_head[1];
					$r = _g2_val;
					return $r;
				}(this));
				if(s.task != null && s.task.checkFailure(s) == true) s.clearTask();
			}
		}
	}
	,applyPlayerOptions: function() {
		this.ui.map.isAdvanced = this.player.options.getBool("mapAdvancedMode");
		this.ui.map.paint();
	}
	,startTimer: function(name) {
		if(Game.debugTime) this.timerTime = new Date().getTime();
	}
	,endTimer: function(name) {
		if(Game.debugTime) console.log(name + ": " + (new Date().getTime() - this.timerTime) + "ms");
	}
};
var GenName = function() { };
GenName.__name__ = true;
GenName.generate = function() {
	var name = GenName.names[Std["int"](Math.random() * (GenName.names.length - 1))];
	var surname = GenName.surnames[Std["int"](Math.random() * (GenName.surnames.length - 1))];
	return name + " " + surname;
};
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
};
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
var Info = function(uivar,gvar) {
	this.ui = uivar;
	this.game = gvar;
	this.isVisible = false;
	this.window = Tools.window({ id : "windowInfo", center : true, winW : UI.winWidth, winH : UI.winHeight, fontSize : 16, bold : true, w : 800, h : 520, z : 20});
	this.window.style.display = "none";
	this.window.style.padding = "5 5 5 5";
	this.window.style.border = "4px double #ffffff";
	var _this = window.document;
	this.text = _this.createElement("div");
	this.text.style.overflow = "auto";
	this.text.style.position = "absolute";
	this.text.style.left = "10px";
	this.text.style.top = "10px";
	this.text.style.width = "780px";
	this.text.style.height = "480px";
	this.text.style.background = "#111";
	this.window.appendChild(this.text);
	var close = Tools.closeButton(this.window,365,493,"infoClose");
	close.onclick = $bind(this,this.onClose);
};
Info.__name__ = true;
Info.e = function(s) {
	return window.document.getElementById(s);
};
Info.prototype = {
	onClose: function(event) {
		this.window.style.display = "none";
		this.isVisible = false;
	}
	,show: function() {
		var s = "";
		var i = 0;
		var _g = 0;
		var _g1 = this.game.cults;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			s += "<div style=\"" + (i == 0?"background:#333333":"") + "\">";
			if(p.isDead) s += "<s>";
			if(p.isDiscovered[this.game.player.id]) s += p.get_fullName(); else s += "?";
			if(p.isDead) s += "</s> Forgotten";
			if(!p.isDead && p.isInfoKnown[this.game.player.id]) {
				var w = "";
				var _g3 = 0;
				var _g2 = p.wars.length;
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
				var _g31 = 0;
				var _g21 = p.power.length;
				while(_g31 < _g21) {
					var i2 = _g31++;
					s += UI.powerName(i2,true) + ": " + p.power[i2] + " (";
					if(i2 < 3) s += p.getResourceChance() + "%) "; else s += p.get_neophytes() / 4 - 0.5 + ") ";
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
				var turns = Std["int"](p.ritualPoints / p.get_priests());
				if(p.ritualPoints % p.get_priests() > 0) turns += 1;
				s += "Casting <span title='" + p.ritual.note + "' id='info.ritual" + i + "' style='color:#ffaaaa'>" + p.ritual.name + "</span>, " + (p.ritual.points - p.ritualPoints) + "/" + p.ritual.points + " points, " + turns + " turns left<br>";
			}
			if(!p.isDead && p.isInfoKnown[this.game.player.id]) {
				s += p.nodes.length + " followers (" + p.get_neophytes() + " neophytes, " + p.get_adepts() + " adepts, " + p.get_priests() + " priests)";
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
		var _g11 = 0;
		var _g4 = this.game.difficulty.numCults;
		while(_g11 < _g4) {
			var i3 = _g11++;
			window.document.getElementById("info.longnote" + i3).style.display = "none";
			var c = window.document.getElementById("info.toggleNote" + i3);
			c.style.cursor = "pointer";
			c.noteID = i3;
			c.onclick = function(event) {
				var t = event.target;
				if(t.innerHTML == "+") {
					t.innerHTML = "&mdash;";
					window.document.getElementById("info.longnote" + Std.string(t.noteID)).style.display = "block";
					window.document.getElementById("info.note" + Std.string(t.noteID)).style.display = "none";
				} else {
					t.innerHTML = "+";
					window.document.getElementById("info.longnote" + Std.string(t.noteID)).style.display = "none";
					window.document.getElementById("info.note" + Std.string(t.noteID)).style.display = "block";
				}
			};
		}
	}
};
var Investigator = function(c,ui,g) {
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
Investigator.__name__ = true;
Investigator.prototype = {
	load: function(obj) {
		this.name = obj.n;
		this.will = obj.w;
		this.level = obj.l;
		if(obj.h == 1) this.isHidden = true; else this.isHidden = false;
	}
	,save: function() {
		return { n : this.name, w : this.will, l : this.level, h : this.isHidden?1:0};
	}
	,turn: function() {
		if(this.numTurn == 0) {
			this.numTurn++;
			return;
		}
		var turnVisible = this.cult.difficulty.investigatorTurnVisible;
		if(this.cult.isAI && turnVisible > 0) turnVisible = 2;
		if(this.isHidden && this.numTurn > turnVisible) {
			this.ui.log2(this.cult,this.cult.get_fullName() + " has found out the investigator's location.",{ symbol : "I"});
			this.isHidden = false;
		}
		if(this.will >= 9) this.isHidden = true;
		this.numTurn++;
		var _g1 = 0;
		var _g = this.level + 1;
		while(_g1 < _g) {
			var i = _g1++;
			this.killFollower();
		}
		if(this.cult.awareness < 5 && !this.cult.isRitual) return;
		this.gainWill();
		if(this.cult.isRitual && 100 * Math.random() < 30) this.gainWill();
	}
	,gainWill: function() {
		if(100 * Math.random() > this.getGainWillChance()) return;
		var oldLevel = this.level;
		this.will += 1;
		this.level = this.will / 3 | 0;
		if(this.level > 2) this.level = 2;
		if(this.level > oldLevel && !this.cult.isAI) this.ui.log2(this.cult,"The investigator of " + this.cult.get_fullName() + " has gained level " + (this.level + 1) + ".",{ symbol : "I"});
	}
	,killFollower: function() {
		if(100 * Math.random() > this.getKillChance()) return;
		var node = null;
		if(this.cult.isRitual) {
			var _g_head = this.cult.nodes.h;
			var _g_val = null;
			while(_g_head != null) {
				var n;
				n = (function($this) {
					var $r;
					_g_val = _g_head[0];
					_g_head = _g_head[1];
					$r = _g_val;
					return $r;
				}(this));
				if(n.level > this.level || n.isProtected) continue;
				if(node != null && n.level <= node.level) continue;
				node = n;
			}
		} else {
			var _g_head1 = this.cult.nodes.h;
			var _g_val1 = null;
			while(_g_head1 != null) {
				var n1;
				n1 = (function($this) {
					var $r;
					_g_val1 = _g_head1[0];
					_g_head1 = _g_head1[1];
					$r = _g_val1;
					return $r;
				}(this));
				if(n1.level > this.level || n1.isProtected) continue;
				node = n1;
				if(Math.random() > 0.5) break;
			}
		}
		if(node == null) return;
		if(node == this.cult.origin && Math.random() > 0.3) return;
		this.ui.log2(this.cult,"The investigator revealed the " + this.cult.get_fullName() + " follower.",{ symbol : "I"});
		if(node.sect != null) this.cult.removeSect(node);
		node.generateAttributes();
		node.removeOwner();
		var _g = 0;
		var _g1 = this.game.cults;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			if(node.visibility[c.id]) c.highlightNode(node);
		}
	}
	,getGainWillChance: function() {
		var chance = 70 * this.cult.difficulty.investigatorGainWill | 0;
		var _g_head = this.cult.sects.h;
		var _g_val = null;
		while(_g_head != null) {
			var sect;
			sect = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			if(sect.task == null || sect.task.id != "invConfuse") continue;
			if(sect.level == 0) chance -= 2; else if(sect.level == 1) chance -= 5; else if(sect.level == 2) chance -= 10;
		}
		if(chance < 20) chance = 20;
		return chance;
	}
	,getKillChance: function() {
		var chance = 0;
		if(this.cult.awareness <= 5) chance = 20 * this.cult.difficulty.investigatorKill | 0; else if(this.cult.awareness <= 10) chance = 65 * this.cult.difficulty.investigatorKill | 0; else chance = 70 * this.cult.difficulty.investigatorKill | 0;
		var _g_head = this.cult.sects.h;
		var _g_val = null;
		while(_g_head != null) {
			var sect;
			sect = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			if(sect.task == null || sect.task.id != "invConfuse") continue;
			if(sect.level == 0) chance -= 2; else if(sect.level == 1) chance -= 5; else if(sect.level == 2) chance -= 10;
		}
		if(chance < 5) chance = 5;
		return chance;
	}
};
var Line = function() {
	this.pixels = [];
};
Line.__name__ = true;
Line.create = function(map,player,startNode,endNode) {
	var line = new Line();
	line.owner = player;
	line.startNode = startNode;
	line.endNode = endNode;
	line.visibility = [false,false,false,false];
	var cnt = 10;
	var dist = startNode.distance(endNode);
	if(dist < 50) cnt = (dist / 6 | 0) + 1;
	var x = startNode.centerX;
	var y = startNode.centerY;
	var modx = (endNode.centerX - startNode.centerX) / cnt;
	var mody = (endNode.centerY - startNode.centerY) / cnt;
	var _g = 1;
	while(_g < cnt) {
		var i = _g++;
		x += modx;
		y += mody;
		line.pixels.push({ x : Math.round(x), y : Math.round(y)});
	}
	return line;
};
Line.prototype = {
	paint: function(ctx,map,cultID) {
		if(!this.visibility[cultID]) return;
		var _g = 0;
		var _g1 = this.pixels;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			if(p.x < map.viewRect.x - 2 || p.y < map.viewRect.y - 2 || p.x > map.viewRect.x + map.viewRect.w || p.y > map.viewRect.y + map.viewRect.h) continue;
			ctx.drawImage(map.nodeImage,this.owner.id * 2,120,2,2,p.x - map.viewRect.x,p.y - map.viewRect.y,2,2);
		}
	}
	,setVisible: function(c,vis) {
		this.visibility[c.id] = vis;
	}
	,clear: function() {
		this.pixels = null;
	}
};
var List = function() {
	this.length = 0;
};
List.__name__ = true;
List.prototype = {
	add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,first: function() {
		if(this.h == null) return null; else return this.h[0];
	}
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
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
};
var LoadMenu = function(uivar,gvar) {
	this.ui = uivar;
	this.game = gvar;
	this.isVisible = false;
	this.window = Tools.window({ id : "loadMenuWindow", center : true, winW : UI.winWidth, winH : UI.winHeight, w : 420, h : 320, z : 25});
	Tools.label({ id : "loadLabel", text : "Key", w : 60, h : 30, x : 35, y : 30, container : this.window});
	this.key = Tools.textfield({ id : "loadKey", text : getCookie("owner"), w : 205, h : 30, x : 85, y : 30, container : this.window});
	this.key.onclick = $bind(this,this.onKeyClick);
	Tools.button({ id : "loadRefresh", text : "Refresh", w : 100, h : 30, x : 300, y : 30, container : this.window, func : $bind(this,this.onRefresh)});
	this.noSavesFound = Tools.label({ id : "loadLabel2", text : "No saves found.", w : 200, h : 30, x : 140, y : 150, container : this.window});
	this.saves = [];
	this.saveButtons = [];
	this.delButtons = [];
	var _g1 = 0;
	var _g = UI.maxSaves;
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
LoadMenu.__name__ = true;
LoadMenu.prototype = {
	show: function() {
		var list = [];
		if(getCookie("owner") != "") {
			var req = new XMLHttpRequest();
			req.open("GET","/save.list?owner=" + getCookie("owner"),false);
			req.send(null);
			var text = req.responseText;
			list = JSON.parse(text);
		}
		this.saves = list;
		var i = 0;
		var _g = 0;
		var _g1 = this.saveButtons;
		while(_g < _g1.length) {
			var b = _g1[_g];
			++_g;
			b.style.display = "none";
			this.delButtons[i].style.display = "none";
			i++;
		}
		i = 0;
		this.noSavesFound.style.display = "inline";
		var _g2 = 0;
		while(_g2 < list.length) {
			var item = list[_g2];
			++_g2;
			var b1 = this.saveButtons[i];
			if(b1 == null) break;
			b1.innerHTML = item.name;
			b1.style.display = "inline";
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
	,onKeyClick: function() {
		this.keyFocused = true;
	}
	,onRefresh: function(event) {
		this.ui.config.set("owner",this.key.value);
		this.show();
	}
	,onLoadGame: function(event) {
		var b = Tools.getTarget(event);
		var n = Std.parseInt(b.id.substring(4));
		this.onLoadReal(n);
	}
	,onLoadReal: function(n) {
		var save = this.saves[n];
		var req = new XMLHttpRequest();
		req.open("GET","/save.load?owner=" + getCookie("owner") + "&id=" + save.id,false);
		req.send(null);
		var text = req.responseText;
		if(text == "NoSuchSave") return;
		window.document.getElementById("haxe:trace").innerHTML = "";
		var savedGame = JSON.parse(text);
		this.game.load(savedGame);
		this.onClose(null);
	}
	,onDelGame: function(event) {
		var b = Tools.getTarget(event);
		var n = Std.parseInt(b.id.substring(3));
		this.onDelReal(n);
	}
	,onDelReal: function(n) {
		var save = this.saves[n];
		var req = new XMLHttpRequest();
		req.open("GET","/save.delete?owner=" + getCookie("owner") + "&id=" + save.id,false);
		req.send(null);
		var text = req.responseText;
		this.show();
	}
	,onKey: function(e) {
		if(this.keyFocused) return;
		if(e.keyCode == 49) this.onLoadReal(0); else if(e.keyCode == 50) this.onLoadReal(1); else if(e.keyCode == 51) this.onLoadReal(2); else if(e.keyCode == 52) this.onLoadReal(3); else if(e.keyCode == 53) this.onLoadReal(4); else if(e.keyCode == 27) this.onClose(null);
	}
	,onClose: function(event) {
		this.window.style.display = "none";
		this.bg.style.display = "none";
		this.close.style.display = "none";
		this.noSavesFound.style.display = "none";
		var _g = 0;
		var _g1 = this.saveButtons;
		while(_g < _g1.length) {
			var b = _g1[_g];
			++_g;
			b.style.display = "none";
		}
		var _g2 = 0;
		var _g11 = this.delButtons;
		while(_g2 < _g11.length) {
			var b1 = _g11[_g2];
			++_g2;
			b1.style.display = "none";
		}
		this.isVisible = false;
	}
};
var Log = function(uivar,gvar) {
	this.ui = uivar;
	this.game = gvar;
	this.isVisible = false;
	this.window = Tools.window({ id : "windowLog", center : true, winW : UI.winWidth, winH : UI.winHeight, fontSize : 18, w : 800, h : 500, z : 14});
	this.window.style.display = "none";
	this.window.style.background = "#333333";
	this.window.style.border = "4px double #ffffff";
	var _this = window.document;
	this.text = _this.createElement("div");
	this.text.style.overflow = "auto";
	this.text.style.position = "absolute";
	this.text.style.left = "10px";
	this.text.style.top = "10px";
	this.text.style.width = "780px";
	this.text.style.height = "450px";
	this.text.style.background = "#0b0b0b";
	this.text.style.border = "1px solid #777";
	this.window.appendChild(this.text);
	var close = Tools.closeButton(this.window,360,465,"logClose");
	close.onclick = $bind(this,this.onClose);
};
Log.__name__ = true;
Log.prototype = {
	onClose: function(event) {
		this.window.style.display = "none";
		this.isVisible = false;
	}
	,getRenderedMessage: function(s) {
		return "<span style='color:#888888'>" + DateTools.format(new Date(),"%H:%M:%S") + "</span>" + " Turn " + (this.game.turns + 1) + ": " + s + "<br>";
	}
	,clear: function() {
		this.text.innerHTML = "";
	}
	,show: function() {
		this.text.innerHTML = this.game.player.logMessages;
		this.text.scrollTop = 10000;
		this.window.style.display = "inline";
		this.isVisible = true;
	}
};
var LogPanel = function(uivar,gvar) {
	this.ui = uivar;
	this.game = gvar;
	this.list = new List();
	var _this = window.document;
	this.panel = _this.createElement("div");
	this.panel.id = "logPanel";
	this.panel.style.position = "absolute";
	this.panel.style.width = "20px";
	this.panel.style.height = UI.mapHeight + UI.topHeight + 8 + "px";
	this.panel.style.left = "217px";
	this.panel.style.top = "5px";
	this.panel.style.background = "#090909";
	window.document.body.appendChild(this.panel);
};
LogPanel.__name__ = true;
LogPanel.prototype = {
	paint: function() {
		this.clear();
		var _g_head = this.game.player.logPanelMessages.h;
		var _g_val = null;
		while(_g_head != null) {
			var m;
			m = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			var sym = "!";
			var col = "white";
			if(m.type == "cult" || m.type == null) {
				var cult = m.obj;
				col = UI.lineColors[cult.id];
			} else if(m.type == "cults") {
				var cult1 = m.obj.c1;
				var cult2 = m.obj.c2;
				sym = "<span style='color:" + UI.lineColors[cult1.id] + "'>!</span>" + "<span style='color:" + UI.lineColors[cult2.id] + "'>!</span>";
			}
			if(m.params != null && m.params.symbol != null) sym = m.params.symbol;
			var e;
			var _this = window.document;
			e = _this.createElement("div");
			m.id = this.list.length;
			e.id = "log.id" + this.list.length;
			e.messageID = m.id;
			e.style.position = "absolute";
			e.style.width = "18";
			e.style.height = "18";
			e.style.left = "0";
			e.style.top = "" + this.list.length * 22;
			if(m.old) e.style.background = "#050505"; else e.style.background = "#151515";
			if(m.old) e.style.border = "1px solid #999"; else e.style.border = "1px solid #fff";
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
	,onClick: function(event) {
		var e = Tools.getTarget(event);
		if(e.parentNode != this.panel) e = e.parentNode;
		this.panel.removeChild(e);
		this.list.remove(e);
		var _g_head = this.game.player.logPanelMessages.h;
		var _g_val = null;
		while(_g_head != null) {
			var m;
			m = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			if(m.id == e.messageID) this.game.player.logPanelMessages.remove(m);
		}
		var cnt = 0;
		var nodes = this.panel.childNodes;
		var _g1 = 0;
		var _g = nodes.length;
		while(_g1 < _g) {
			var i = _g1++;
			var el = nodes[i];
			el.style.top = cnt * 24 + "px";
			cnt++;
		}
	}
	,clear: function() {
		this.list.clear();
		while(this.panel.hasChildNodes()) this.panel.removeChild(this.panel.firstChild);
	}
};
var MainMenu = function(uivar,gvar) {
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
MainMenu.__name__ = true;
MainMenu.prototype = {
	show: function() {
		this.window.style.display = "inline";
		this.bg.style.display = "inline";
		if(this.game.isFinished) this.saveButton.style.display = "none"; else this.saveButton.style.display = "inline";
		this.isVisible = true;
	}
	,onCustomGame: function(event) {
		this.ui.customMenu.show();
		this.onClose(null);
	}
	,onMultiplayerGame: function(event) {
		this.ui.mpMenu.show();
		this.onClose(null);
	}
	,onLoadGame: function(event) {
		this.ui.loadMenu.show();
		this.onClose(null);
	}
	,onSaveGame: function(event) {
		this.ui.saveMenu.show();
		this.onClose(null);
	}
	,onNewGame: function(event) {
		var id = Tools.getTarget(event).id;
		var dif = 0;
		if(id == "newGameEasy") dif = 0; else if(id == "newGameNormal") dif = 1; else dif = 2;
		this.onNewGameReal(dif);
	}
	,onNewGameReal: function(dif) {
		window.document.getElementById("haxe:trace").innerHTML = "";
		this.game.restart(dif);
		this.onClose(null);
	}
	,onKey: function(e) {
		if(e.keyCode == 49) this.onNewGameReal(0); else if(e.keyCode == 50) this.onNewGameReal(1); else if(e.keyCode == 51) this.onNewGameReal(2); else if(e.keyCode == 52) this.onCustomGame(null); else if(e.keyCode == 53) this.onMultiplayerGame(null); else if(e.keyCode == 27) this.onClose(null);
	}
	,onClose: function(event) {
		if(this.game.isNeverStarted) return;
		this.window.style.display = "none";
		this.bg.style.display = "none";
		this.saveButton.style.display = "none";
		this.isVisible = false;
	}
};
var MapUI = function(uivar,gvar) {
	this.ui = uivar;
	this.game = gvar;
	this.viewRect = { x : 0, y : 0, w : UI.mapWidth, h : UI.mapHeight};
	this.isAdvanced = false;
	var screen = window.document.getElementById("map");
	screen.style.border = "double #777 4px";
	screen.style.width = UI.mapWidth + "px";
	screen.style.height = UI.mapHeight + "px";
	screen.style.position = "absolute";
	screen.style.left = "240px";
	screen.style.top = 5 + UI.topHeight + "px";
	screen.style.overflow = "hidden";
	if(!screen.getContext) window.alert("No canvas available. Please use a canvas-compatible browser like Mozilla Firefox 3.5+ or Google Chrome.");
	screen.onclick = $bind(this,this.onClick);
	screen.onmousemove = $bind(this,this.onMove);
	screen.onmousedown = $bind(this,this.onMouseDown);
	screen.onmouseup = $bind(this,this.onMouseUp);
	screen.onmouseout = $bind(this,this.onMouseOut);
	this.tooltip = Tools.window({ id : "mapTooltipWindow", center : true, winW : UI.winWidth, winH : UI.winHeight, fontSize : 16, w : 200, h : 280, z : 3000});
	this.tooltip.style.padding = "5px";
	this.tooltip.style.border = "1px solid";
	this.tooltip.style.opacity = "0.9";
	this.loadImages();
};
MapUI.__name__ = true;
MapUI.prototype = {
	loadImages: function() {
		this.nodeImage = new Image();
		this.nodeImage.onload = $bind(this,this.onLoadImage);
		this.nodeImage.src = "data/nodes.png";
		this.fontImage = new Image();
		this.fontImage.onload = $bind(this,this.onLoadImage);
		this.fontImage.src = "data/5x8.png";
	}
	,onLoadImage: function() {
		this.paint();
	}
	,paint: function() {
		if(this.game.isFinished && this.game.turns == 0) return;
		if(Game.debugTime) this.game.timerTime = new Date().getTime();
		var el = window.document.getElementById("map");
		var ctx = el.getContext("2d");
		ctx.fillStyle = "black";
		ctx.fillRect(0,0,UI.mapWidth,UI.mapHeight);
		ctx.font = "14px Verdana";
		var _g_head = this.game.lines.h;
		var _g_val = null;
		while(_g_head != null) {
			var l;
			l = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			l.paint(ctx,this,this.game.player.id);
		}
		var _g = 0;
		var _g1 = this.game.nodes;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			n.uiNode.paint(ctx);
		}
		if(this.isAdvanced) {
			ctx.font = "11px Verdana";
			var _g2 = 0;
			var _g11 = this.game.nodes;
			while(_g2 < _g11.length) {
				var n1 = _g11[_g2];
				++_g2;
				n1.uiNode.paintAdvanced(ctx);
			}
		}
		if(this.game.difficulty.mapWidth > UI.mapWidth || this.game.difficulty.mapHeight > UI.mapHeight) this.paintMinimap(ctx);
		if(Game.debugTime) console.log("map paint" + ": " + (new Date().getTime() - this.game.timerTime) + "ms");
	}
	,paintMinimap: function(ctx) {
		var mw = 100;
		var mh = 100;
		var mx = UI.mapWidth - mw;
		var my = UI.mapHeight - mh;
		var xscale = 1.0 * this.game.difficulty.mapWidth / mw;
		var yscale = 1.0 * this.game.difficulty.mapHeight / mh;
		ctx.fillStyle = "rgba(20,20,20,0.5)";
		ctx.fillRect(mx,my,mw,mh);
		var imageData = ctx.getImageData(mx,my,mw,mh);
		var pix = imageData.data;
		var _g = 0;
		var _g1 = this.game.nodes;
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
	,hideTooltip: function() {
		this.tooltip.style.display = "none";
	}
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
		var el = window.document.getElementById("map");
		var x = event.clientX - el.offsetLeft - 4 + window.document.body.scrollLeft;
		var y = event.clientY - el.offsetTop - 6 + window.document.body.scrollTop;
		if(x + 250 > window.innerWidth) x = window.innerWidth - 250;
		if(y + cnt * 20 + 50 > window.innerHeight) y = window.innerHeight - cnt * 20 - 50;
		this.tooltip.style.left = x + "px";
		this.tooltip.style.top = y + "px";
		this.tooltip.innerHTML = text;
		this.tooltip.style.height = cnt * 20 + "px";
		this.tooltip.style.display = "inline";
	}
	,onMouseDown: function(event) {
		this.isDrag = true;
		this.dragEventX = event.clientX;
		this.dragEventY = event.clientY;
	}
	,onMouseUp: function(event) {
		this.isDrag = false;
	}
	,onMouseOut: function(event) {
		this.isDrag = false;
		this.tooltip.style.display = "none";
	}
	,onClick: function(event) {
		if(this.game.isFinished) return;
		var node = this.getEventNode(event);
		if(node == null) return;
		this.game.player.activate(node);
		this.paint();
	}
	,rectBounds: function() {
		if(this.viewRect.x < 0) this.viewRect.x = 0;
		if(this.viewRect.y < 0) this.viewRect.y = 0;
		if(this.viewRect.x + this.viewRect.w > this.game.difficulty.mapWidth) this.viewRect.x = this.game.difficulty.mapWidth - this.viewRect.w;
		if(this.viewRect.y + this.viewRect.h > this.game.difficulty.mapHeight) this.viewRect.y = this.game.difficulty.mapHeight - this.viewRect.h;
	}
	,center: function(x,y) {
		this.viewRect.x = x - this.viewRect.w / 2 | 0;
		this.viewRect.y = y - this.viewRect.h / 2 | 0;
		this.rectBounds();
		this.paint();
	}
	,getEventNode: function(event) {
		if(this.game.nodes == null) return null;
		var el = window.document.getElementById("map");
		var x = event.clientX - el.offsetLeft - 4 + this.viewRect.x + window.document.body.scrollLeft;
		var y = event.clientY - el.offsetTop - 6 + this.viewRect.y + window.document.body.scrollTop;
		var node = null;
		var _g = 0;
		var _g1 = this.game.nodes;
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
	,clear: function() {
	}
};
Math.__name__ = true;
var MultiplayerMenu = function(uivar,gvar) {
	this.ui = uivar;
	this.game = gvar;
	this.isVisible = false;
	this.window = Tools.window({ id : "mpMenuWindow", center : true, winW : UI.winWidth, winH : UI.winHeight, w : 450, h : 220, z : 20});
	Tools.label({ id : "titleLabel", text : "Multiplayer game parameters", w : 350, h : 30, x : 50, y : 10, container : this.window});
	var divel = window.document.createElement("div");
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
	var _g = 0;
	var _g1 = MultiplayerMenu.difElementInfo;
	while(_g < _g1.length) {
		var info = _g1[_g];
		++_g;
		Tools.label({ id : "label" + info.name, text : info.title, w : 300, h : 20, x : 10, y : y, fontSize : 14, container : divel});
		var el = null;
		if(info.type == "bool") el = Tools.checkbox({ id : info.name, text : "" + Std.string(Reflect.field(Static.difficulty[2],info.name)), w : 100, h : 20, x : 320, y : y, fontSize : 14, container : divel}); else if(info.type == "select") {
			el = window.document.createElement("select");
			el.id = info.name;
			el.style.width = "100";
			el.style.height = "20";
			el.style.left = "320";
			el.style.top = "" + y;
			el.style.fontSize = "14px";
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
MultiplayerMenu.__name__ = true;
MultiplayerMenu.prototype = {
	getInfoValue: function(info) {
		var el = null;
		var _g_head = this.difElements.h;
		var _g_val = null;
		while(_g_head != null) {
			var e;
			e = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			if(e.id == info.name) {
				el = e;
				break;
			}
		}
		var value = null;
		if(info.type == "int") value = Std.parseInt(el.value); else if(info.type == "float") value = parseFloat(el.value); else if(info.type == "select") {
			var list = info.params;
			var id = -1;
			var _g1 = 0;
			var _g = list.length;
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
	,onStartGame: function(e) {
		var dif = { level : -1};
		window.document.getElementById("haxe:trace").innerHTML = "";
		var level = this.getInfoValue(MultiplayerMenu.difElementInfo[2]);
		var _g = 0;
		var _g1 = Reflect.fields(Static.difficulty[level]);
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			Reflect.setField(dif,f,Reflect.field(Static.difficulty[level],f));
		}
		var _g2 = 0;
		var _g11 = MultiplayerMenu.difElementInfo;
		while(_g2 < _g11.length) {
			var info = _g11[_g2];
			++_g2;
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
	,show: function() {
		this.window.style.display = "inline";
		this.bg.style.display = "inline";
		this.close.style.display = "inline";
		this.isVisible = true;
	}
	,onKey: function(e) {
		if(e.keyCode == 27) this.onClose(null);
	}
	,realClose: function() {
		this.window.style.display = "none";
		this.bg.style.display = "none";
		this.close.style.display = "none";
		this.isVisible = false;
	}
	,onClose: function(event) {
		this.realClose();
		this.ui.mainMenu.show();
	}
};
var Music = function() {
	this.isInited = false;
	this.trackID = -1;
	this.playlist = [["Introspective","Occlusion","Fluid Dynamics","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi051a_intro-fluid_dynamics.ogg","http://www.kahvi.org/releases.php?release_number=051"],["Introspective","Occlusion","Contain Release","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi051b_intro-contain_release.ogg","http://www.kahvi.org/releases.php?release_number=051"],["Introspective","Occlusion","Wave Propagation","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi051c_intro-wave_propagation.ogg","http://www.kahvi.org/releases.php?release_number=051"],["Introspective","Analogy","Mail Order Monsters","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi080a_intro-mail_order_monsters.ogg","http://www.kahvi.org/releases.php?release_number=080"],["Introspective","Analogy","Cartographer","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi080b_intro-cartographer.ogg","http://www.kahvi.org/releases.php?release_number=080"],["Introspective","Analogy","Gone Awry","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi080c_intro-analogy_gone_awry.ogg","http://www.kahvi.org/releases.php?release_number=080"],["Introspective","Analogy","Bearing Your Name","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi080d_intro-bearing_your_name.ogg","http://www.kahvi.org/releases.php?release_number=080"],["Introspective","Crossing Borders","Crossing Borders","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi094a_introspective-crossing_borders.ogg","http://www.kahvi.org/releases.php?release_number=094"],["Introspective","Crossing Borders","Medina Of Tunis","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi094b_introspective-medina_of_tunis.ogg","http://www.kahvi.org/releases.php?release_number=094"],["Introspective","Black Mesa Winds","Crepuscular Activity","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi236a_introspective-crepuscular_activity.ogg","http://www.kahvi.org/releases.php?release_number=236"],["Introspective","Black Mesa Winds","Vanishing Point","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi236b_introspective-vanishing_point.ogg","http://www.kahvi.org/releases.php?release_number=236"],["Introspective","Black Mesa Winds","Black Mesa Winds","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi236c_introspective-black_mesa_winds.ogg","http://www.kahvi.org/releases.php?release_number=236"],["Introspective","Black Mesa Winds","Convection","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi236d_introspective-convection.ogg","http://www.kahvi.org/releases.php?release_number=236"],["Introspective","Black Mesa Winds","Sky City","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi236e_introspective-sky_city.ogg","http://www.kahvi.org/releases.php?release_number=236"],["Introspective","Black Mesa Winds","Predator Distribution","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi236f_introspective-predator_distribution.ogg","http://www.kahvi.org/releases.php?release_number=236"],["Introspective","Black Mesa Winds","Fahrenheit","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi236g_introspective-fahrenheit.ogg","http://www.kahvi.org/releases.php?release_number=236"],["Introspective","Black Mesa Winds","Riverside","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi236h_introspective-riverside.ogg","http://www.kahvi.org/releases.php?release_number=236"],["Introspective","Black Mesa Winds","Xerophytes","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi236i_introspective-xerophytes.ogg","http://www.kahvi.org/releases.php?release_number=236"],["Introspective","Black Mesa Winds","Differential Erosion","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi236j_introspective-differential_erosion.ogg","http://www.kahvi.org/releases.php?release_number=236"],["Introspective","Black Mesa Winds","Overwhelming Sky","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi236k_introspective-overwhelming_sky.ogg","http://www.kahvi.org/releases.php?release_number=236"],["Curious Inversions","Whom","Antibiotic Resistance","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi254a_curious_inversions-antibiotic_resistance.ogg","http://www.kahvi.org/releases.php?release_number=254"],["Curious Inversions","Whom","Antiquity","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi254b_curious_inversions-antiquity.ogg","http://www.kahvi.org/releases.php?release_number=254"],["Curious Inversions","Whom","Geonosian Advance","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi254c_curious_inversions-geonosian_advance.ogg","http://www.kahvi.org/releases.php?release_number=254"],["Curious Inversions","Whom","In The Scholar's Wake","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi254d_curious_inversions-in_the_scholars_wake.ogg","http://www.kahvi.org/releases.php?release_number=254"],["Curious Inversions","Whom","Predators","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi254e_curious_inversions-predators.ogg","http://www.kahvi.org/releases.php?release_number=254"],["Curious Inversions","Whom","Sissot Eclipse","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi254f_curious_inversions-sissots_eclipse.ogg","http://www.kahvi.org/releases.php?release_number=254"],["Curious Inversions","Whom","Voluntary","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi254g_curious_inversions-voluntary.ogg","http://www.kahvi.org/releases.php?release_number=254"],["Curious Inversions","Whom","Windslak","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi254h_curious_inversions-windslak.ogg","http://www.kahvi.org/releases.php?release_number=254"],["Introspective","Gewesen","Gewesen","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi176a_introspective-gewesen.ogg","http://www.kahvi.org/releases.php?release_number=176"],["Introspective","Gewesen","Undocumented","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi176b_introspective-undocumented.ogg","http://www.kahvi.org/releases.php?release_number=176"],["Introspective","Gewesen","Gewesen pt2","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi176c_introspective-gewesen_part2.ogg","http://www.kahvi.org/releases.php?release_number=176"],["Introspective","Gewesen","Specular Highlights","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi176d_introspective-specular_highlights.ogg","http://www.kahvi.org/releases.php?release_number=176"],["Introspective","Gewesen","The Leaves In The Rain","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi176e_introspective-the_leaves_in_the_rain.ogg","http://www.kahvi.org/releases.php?release_number=176"],["Curious Inversions","Schoolyard Crows","Unfamiliar Domain","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi353a_curious_inversions-unfamiliar_domain.ogg","http://www.kahvi.org/releases.php?release_number=353"],["Curious Inversions","Schoolyard Crows","Restrictions","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi353b_curious_inversions-restrictions.ogg","http://www.kahvi.org/releases.php?release_number=353"],["Curious Inversions","Schoolyard Crows","Inefficient Sacrifice","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi353c_curious_inversions-inefficient_sacrifice.ogg","http://www.kahvi.org/releases.php?release_number=353"],["Curious Inversions","Schoolyard Crows","Elder Grove","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi353d_curious_inversions-elder_grove.ogg","http://www.kahvi.org/releases.php?release_number=353"],["Curious Inversions","Schoolyard Crows","Woven Hand","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi353e_curious_inversions-woven_hand.ogg","http://www.kahvi.org/releases.php?release_number=353"],["Curious Inversions","Schoolyard Crows","Eccentric Structures","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi353f_curious_inversions-eccentric_structures.ogg","http://www.kahvi.org/releases.php?release_number=353"],["Curious Inversions","Schoolyard Crows","Fetter","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi353g_curious_inversions-fetter.ogg","http://www.kahvi.org/releases.php?release_number=353"],["Curious Inversions","Schoolyard Crows","Unit 731","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi353h_curious_inversions-unit_731.ogg","http://www.kahvi.org/releases.php?release_number=353"],["Curious Inversions","Schoolyard Crows","Symmetric Immortality","http://ftp.scene.org/pub/music/groups/kahvicollective/kahvi353i_curious_inversions-symmetric_immortality.ogg","http://www.kahvi.org/releases.php?release_number=353"]];
};
Music.__name__ = true;
Music.prototype = {
	init: function() {
		this.isInited = true;
	}
	,random: function() {
		SoundManager.destroySound("music");
		while(true) {
			var t = Std["int"](Math.random() * (this.playlist.length - 1));
			if(t != this.trackID) {
				this.trackID = t;
				break;
			}
		}
		SoundManager.createSound({ id : "music", url : this.playlist[this.trackID][3], volume : 100});
		SoundManager.play("music",{ onfinish : $bind(this,this.random)});
		this.onRandom();
	}
	,onRandom: function() {
	}
	,play: function() {
		SoundManager.stopAll();
		if(this.trackID == -1) this.random(); else SoundManager.play("music",{ onfinish : $bind(this,this.random)});
	}
	,stop: function() {
		SoundManager.stopAll();
	}
	,pause: function() {
		SoundManager.togglePause("music");
	}
	,getName: function() {
		var a = this.playlist[this.trackID];
		return "<span style='color: #080'>Track:</span> " + a[2] + "<br><span style='color: #080'>Album:</span> " + a[1] + "<br><span style='color: #080'>Artist:</span> " + a[0];
	}
	,getPage: function() {
		return this.playlist[this.trackID][4];
	}
};
var Node = function(gvar,uivar,newx,newy,index) {
	this.game = gvar;
	this.ui = uivar;
	this.id = index;
	this.lines = new List();
	this.links = new List();
	this.visibility = [];
	var _g1 = 0;
	var _g = this.game.difficulty.numCults;
	while(_g1 < _g) {
		var i = _g1++;
		this.visibility.push(false);
	}
	this.isKnown = [];
	var _g11 = 0;
	var _g2 = this.game.difficulty.numCults;
	while(_g11 < _g2) {
		var i1 = _g11++;
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
Node.__name__ = true;
Node.prototype = {
	generateAttributes: function() {
		this.name = GenName.generate();
		this.job = Node.jobs[Std["int"](Math.random() * (Node.jobs.length - 1))];
		this.isGenerator = false;
		this.isTempGenerator = false;
		this.isKnown = [];
		var _g1 = 0;
		var _g = this.game.difficulty.numCults;
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
	,makeGenerator: function() {
		var powerIndex = 0;
		var _g1 = 0;
		var _g = Game.numPowers;
		while(_g1 < _g) {
			var ii1 = _g1++;
			if(this.power[ii1] > 0) {
				this.power[ii1]++;
				powerIndex = ii1;
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
				var _g1 = 0;
				var _g2 = Game.numPowers;
				while(_g1 < _g2) {
					var i1 = _g1++;
					this.owner.powerMod[i1] += Math.round(this.powerGenerated[i1]);
				}
			}
		}
	}
	,save: function() {
		var obj = { id : this.id, p : this.power, x : this.x, y : this.y};
		if(this.owner != null) obj.o = this.owner.id;
		if(this.level > 0) obj.l = this.level;
		var vis = [];
		var savevis = false;
		var _g = 0;
		var _g1 = this.visibility;
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
	,update: function() {
		this.isProtected = false;
		if(this.isGenerator && this.owner != null) {
			var cnt = 0;
			var _g_head = this.links.h;
			var _g_val = null;
			while(_g_head != null) {
				var n;
				n = (function($this) {
					var $r;
					_g_val = _g_head[0];
					_g_head = _g_head[1];
					$r = _g_val;
					return $r;
				}(this));
				if(n.owner == this.owner) cnt++;
			}
			if(cnt >= 3) this.isProtected = true;
		}
	}
	,distance: function(node) {
		return Math.sqrt((node.x - this.x) * (node.x - this.x) + (node.y - this.y) * (node.y - this.y));
	}
	,setGenerator: function(isgen) {
		this.isGenerator = isgen;
		this.update();
	}
	,setOwner: function(c) {
		var prevOwner = this.owner;
		if(this.isGenerator) {
			var _g1 = 0;
			var _g = Game.numPowers;
			while(_g1 < _g) {
				var i = _g1++;
				c.powerMod[i] += Math.round(this.powerGenerated[i]);
			}
		}
		this.clearLines();
		if(this.owner == null) {
			var _g11 = 0;
			var _g2 = Game.numPowers;
			while(_g11 < _g2) {
				var i1 = _g11++;
				if(this.power[i1] > 0) this.power[i1]++;
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
			var _g3 = this.owner;
			_g3.set_awareness(_g3.awareness + 2);
		} else {
			var _g4 = this.owner;
			var _g12 = _g4.awareness;
			_g4.set_awareness(_g12 + 1);
			_g12;
		}
		if(!this.owner.isAI) this.ui.updateStatus();
		this.paintLines();
		var _g_head = this.links.h;
		var _g_val = null;
		while(_g_head != null) {
			var n;
			n = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			n.update();
		}
		if(prevOwner != null) prevOwner.loseNode(this,this.owner);
		if(this.visibility[this.game.player.id] && !this.owner.isDiscovered[this.game.player.id]) this.game.player.discover(this.owner);
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
		var _g_head = this.links.h;
		var _g_val = null;
		while(_g_head != null) {
			var n;
			n = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			n.update();
		}
		var _g1 = 0;
		var _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.power[i] > 2) this.power[i] = 2;
		}
		if(prevOwner != null) prevOwner.loseNode(this);
	}
	,setVisible: function(cult,v) {
		this.visibility[cult.id] = v;
		this.uiNode.setVisible(cult,v);
		if(!cult.isAI) {
			if(Game.mapVisible) v = true;
			var _g_head = this.lines.h;
			var _g_val = null;
			while(_g_head != null) {
				var l;
				l = (function($this) {
					var $r;
					_g_val = _g_head[0];
					_g_head = _g_head[1];
					$r = _g_val;
					return $r;
				}(this));
				l.visibility[cult.id] = v;
			}
			if(this.owner != null && !this.owner.isDiscovered[cult.id]) cult.discover(this.owner);
		}
	}
	,isVisible: function(c) {
		return this.visibility[c.id];
	}
	,upgrade: function() {
		if(this.level >= Game.followerNames.length - 1) return;
		var _g1 = 0;
		var _g = Game.numPowers;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.power[i] > 0) this.power[i]++;
		}
		this.level++;
	}
	,updateLinkVisibility: function(cult) {
		var _g_head = this.links.h;
		var _g_val = null;
		while(_g_head != null) {
			var n;
			n = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			if(n.visibility[cult.id] && n.owner != cult) {
				var vis = false;
				var _g_head1 = n.links.h;
				var _g_val1 = null;
				while(_g_head1 != null) {
					var n2;
					n2 = (function($this) {
						var $r;
						_g_val1 = _g_head1[0];
						_g_head1 = _g_head1[1];
						$r = _g_val1;
						return $r;
					}(this));
					if(n2.owner == cult) {
						vis = true;
						break;
					}
				}
				n.setVisible(cult,vis);
			}
		}
		var hasLinks = false;
		var _g_head2 = this.links.h;
		var _g_val2 = null;
		while(_g_head2 != null) {
			var n21;
			n21 = (function($this) {
				var $r;
				_g_val2 = _g_head2[0];
				_g_head2 = _g_head2[1];
				$r = _g_val2;
				return $r;
			}(this));
			if(n21.owner == cult) {
				this.setVisible(cult,true);
				hasLinks = true;
				break;
			}
		}
		if(!hasLinks) this.setVisible(cult,false);
	}
	,paintLines: function() {
		var hasLine = false;
		var _g_head = this.links.h;
		var _g_val = null;
		while(_g_head != null) {
			var n;
			n = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			if(n.owner == this.owner) {
				var l1 = Line.create(this.ui.map,this.owner,n,this);
				this.game.lines.add(l1);
				n.lines.add(l1);
				this.lines.add(l1);
				var _g = 0;
				var _g1 = this.game.cults;
				while(_g < _g1.length) {
					var c = _g1[_g];
					++_g;
					if(n.visibility[c.id] || this.visibility[c.id]) l1.visibility[c.id] = true;
				}
				hasLine = true;
			}
		}
		if(hasLine) return;
		var dist = 10000;
		var nc = null;
		var _g_head1 = this.owner.nodes.h;
		var _g_val1 = null;
		while(_g_head1 != null) {
			var n1;
			n1 = (function($this) {
				var $r;
				_g_val1 = _g_head1[0];
				_g_head1 = _g_head1[1];
				$r = _g_val1;
				return $r;
			}(this));
			if(this != n1 && this.distance(n1) < dist) {
				dist = this.distance(n1);
				nc = n1;
			}
		}
		var l = Line.create(this.ui.map,this.owner,nc,this);
		this.game.lines.add(l);
		nc.lines.add(l);
		this.lines.add(l);
		var _g2 = 0;
		var _g11 = this.game.cults;
		while(_g2 < _g11.length) {
			var c1 = _g11[_g2];
			++_g2;
			if(nc.visibility[c1.id] || this.visibility[c1.id]) l.visibility[c1.id] = true;
		}
	}
	,showLinks: function() {
		var _g_head = this.links.h;
		var _g_val = null;
		while(_g_head != null) {
			var n;
			n = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			n.setVisible(this.owner,true);
		}
	}
	,clearLines: function() {
		if(this.owner == null) return;
		var _g_head = this.lines.h;
		var _g_val = null;
		while(_g_head != null) {
			var l;
			l = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			l.clear();
			this.game.lines.remove(l);
			l.startNode.lines.remove(l);
			l.endNode.lines.remove(l);
		}
	}
};
var Options = function(c) {
	this.cult = c;
	this.list = new haxe_ds_StringMap();
};
Options.__name__ = true;
Options.prototype = {
	set: function(key,val) {
		if(val == false) this.list.remove(key); else {
			var value = val;
			this.list.set(key,value);
		}
	}
	,get: function(key) {
		return this.list.get(key);
	}
	,getBool: function(key) {
		var ret = this.list.get(key);
		if(ret == null) return false;
		return ret;
	}
};
var OptionsMenu = function(uivar,gvar) {
	this.ui = uivar;
	this.game = gvar;
	this.isVisible = false;
	this.window = Tools.window({ id : "optionMenuWindow", center : true, winW : UI.winWidth, winH : UI.winHeight, w : 1000, h : 500, z : 20});
};
OptionsMenu.__name__ = true;
OptionsMenu.prototype = {
	show: function() {
		this.window.innerHTML = "";
		Tools.label({ id : "titleLabel", text : "Game Options", w : 300, h : 30, x : 420, y : 10, container : this.window});
		var divel;
		var _this = window.document;
		divel = _this.createElement("div");
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
		var _g = 0;
		var _g1 = OptionsMenu.elementInfo;
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
	,onClose: function(e) {
		var dif_level = -1;
		window.document.getElementById("haxe:trace").innerHTML = "";
		var _g = 0;
		var _g1 = OptionsMenu.elementInfo;
		while(_g < _g1.length) {
			var info = _g1[_g];
			++_g;
			var el = null;
			var _g2_head = this.elements.h;
			var _g2_val = null;
			while(_g2_head != null) {
				var e1;
				e1 = (function($this) {
					var $r;
					_g2_val = _g2_head[0];
					_g2_head = _g2_head[1];
					$r = _g2_val;
					return $r;
				}(this));
				if(e1.id == info.name) {
					el = e1;
					break;
				}
			}
			var value = null;
			if(info.type == "int") value = Std.parseInt(el.value); else if(info.type == "float") value = parseFloat(el.value); else if(info.type == "bool") value = el.checked;
			this.game.player.options.set(info.name,value);
			if(info.name == "sectAdvisor" && !value) {
				var _g2_head1 = this.game.player.sects.h;
				var _g2_val1 = null;
				while(_g2_head1 != null) {
					var s;
					s = (function($this) {
						var $r;
						_g2_val1 = _g2_head1[0];
						_g2_head1 = _g2_head1[1];
						$r = _g2_val1;
						return $r;
					}(this));
					s.taskImportant = false;
				}
			}
		}
		this.game.applyPlayerOptions();
		this.realClose();
	}
	,onKey: function(e) {
		if(e.keyCode == 27) this.onClose(null);
	}
	,realClose: function() {
		this.window.style.display = "none";
		this.bg.style.display = "none";
		this.close.style.display = "none";
		this.isVisible = false;
	}
};
var Reflect = function() { };
Reflect.__name__ = true;
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
Reflect.setField = function(o,field,value) {
	o[field] = value;
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
var SaveMenu = function(uivar,gvar) {
	this.ui = uivar;
	this.game = gvar;
	this.isVisible = false;
	this.window = Tools.window({ id : "saveMenuWindow", center : true, winW : UI.winWidth, winH : UI.winHeight, w : 420, h : 320, z : 25});
	Tools.label({ id : "saveLabel", text : "Key", w : 60, h : 30, x : 35, y : 30, container : this.window});
	this.key = Tools.textfield({ id : "saveKey", text : getCookie("owner"), w : 205, h : 30, x : 85, y : 30, container : this.window});
	this.key.onclick = $bind(this,this.onKeyClick);
	Tools.button({ id : "saveRefresh", text : "Refresh", w : 100, h : 30, x : 300, y : 30, container : this.window, func : $bind(this,this.onRefresh)});
	this.noKey = Tools.label({ id : "loadLabel2", text : "Type in key to proceed.", w : 270, h : 30, x : 90, y : 150, container : this.window});
	this.saves = [];
	this.saveButtons = [];
	this.delButtons = [];
	var _g1 = 0;
	var _g = UI.maxSaves;
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
SaveMenu.__name__ = true;
SaveMenu.prototype = {
	show: function() {
		var _g = 0;
		var _g1 = this.delButtons;
		while(_g < _g1.length) {
			var b = _g1[_g];
			++_g;
			b.style.display = "none";
		}
		if(getCookie("owner") != "" && getCookie("owner") != null) {
			var req = new XMLHttpRequest();
			req.open("GET","/save.list?owner=" + getCookie("owner"),false);
			req.send(null);
			var text = req.responseText;
			var list = JSON.parse(text);
			this.saves = list;
			var _g2 = 0;
			var _g11 = this.saveButtons;
			while(_g2 < _g11.length) {
				var b1 = _g11[_g2];
				++_g2;
				b1.style.display = "inline";
				b1.innerHTML = "---";
			}
			var i = 0;
			var _g3 = 0;
			while(_g3 < list.length) {
				var item = list[_g3];
				++_g3;
				var b2 = this.saveButtons[i];
				if(b2 == null) break;
				b2.innerHTML = item.name;
				this.delButtons[i].style.display = "inline";
				i++;
			}
			this.noKey.style.display = "none";
		} else {
			var _g4 = 0;
			var _g12 = this.saveButtons;
			while(_g4 < _g12.length) {
				var b3 = _g12[_g4];
				++_g4;
				b3.style.display = "none";
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
	,onKeyClick: function() {
		this.keyFocused = true;
	}
	,onRefresh: function(event) {
		this.ui.config.set("owner",this.key.value);
		this.show();
	}
	,onSaveGame: function(event) {
		var b = Tools.getTarget(event);
		var n = Std.parseInt(b.id.substring(4));
		this.onSaveReal(n);
	}
	,onSaveReal: function(n) {
		var save = this.saves[n];
		var id = 0;
		if(save != null) id = save.id;
		var name;
		var _this = new Date();
		name = HxOverrides.dateStr(_this);
		var req = new XMLHttpRequest();
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
	,onDelGame: function(event) {
		var b = Tools.getTarget(event);
		var n = Std.parseInt(b.id.substring(3));
		this.onDelReal(n);
	}
	,onDelReal: function(n) {
		var save = this.saves[n];
		var req = new XMLHttpRequest();
		req.open("GET","/save.delete?owner=" + getCookie("owner") + "&id=" + save.id,false);
		req.send(null);
		var text = req.responseText;
		this.show();
	}
	,onKey: function(e) {
		if(this.keyFocused) return;
		if(e.keyCode == 49) this.onSaveReal(0); else if(e.keyCode == 50) this.onSaveReal(1); else if(e.keyCode == 51) this.onSaveReal(2); else if(e.keyCode == 52) this.onSaveReal(3); else if(e.keyCode == 53) this.onSaveReal(4); else if(e.keyCode == 27) this.onClose(null);
	}
	,onClose: function(event) {
		this.window.style.display = "none";
		this.bg.style.display = "none";
		this.close.style.display = "none";
		this.noKey.style.display = "none";
		var _g = 0;
		var _g1 = this.delButtons;
		while(_g < _g1.length) {
			var b = _g1[_g];
			++_g;
			b.style.display = "none";
		}
		var _g2 = 0;
		var _g11 = this.saveButtons;
		while(_g2 < _g11.length) {
			var b1 = _g11[_g2];
			++_g2;
			b1.style.display = "none";
		}
		this.isVisible = false;
	}
};
var SectsInfo = function(uivar,gvar) {
	this.ui = uivar;
	this.game = gvar;
	this.isVisible = false;
	this.selectedNode = null;
	this.selectedNodeID = 0;
	this.window = Tools.window({ id : "windowSects", center : true, winW : UI.winWidth, winH : UI.winHeight, fontSize : 16, bold : true, w : 800, h : 520, z : 20});
	this.window.style.display = "none";
	this.window.style.padding = "5 5 5 5";
	this.window.style.border = "4px double #ffffff";
	var _this = window.document;
	this.list = _this.createElement("div");
	this.list.style.overflow = "auto";
	this.list.style.position = "absolute";
	this.list.style.left = "10px";
	this.list.style.top = "10px";
	this.list.style.width = "790px";
	this.list.style.height = "480px";
	this.list.style.background = "#111";
	this.window.appendChild(this.list);
	var _this1 = window.document;
	this.text = _this1.createElement("div");
	this.text.style.overflow = "auto";
	this.text.style.position = "absolute";
	this.text.style.textAlign = "center";
	this.text.style.left = "120px";
	this.text.style.top = "498px";
	this.text.style.width = "130px";
	this.text.style.height = "20px";
	this.text.style.background = "#111";
	this.window.appendChild(this.text);
	this.menu = Tools.window({ id : "sectsMenuWindow", center : true, winW : UI.winWidth, winH : UI.winHeight, fontSize : 16, w : 200, h : 280, z : 3000});
	this.menu.style.padding = "5px";
	this.menu.style.border = "1px solid";
	this.menu.style.opacity = "0.9";
	var close = Tools.closeButton(this.window,365,493,"infoClose");
	close.onclick = $bind(this,this.onClose);
};
SectsInfo.__name__ = true;
SectsInfo.e = function(s) {
	return window.document.getElementById(s);
};
SectsInfo.create = function(parent,s) {
	var el = window.document.createElement(s);
	parent.appendChild(el);
	return el;
};
SectsInfo.prototype = {
	onKey: function(e) {
		if(e.keyCode == 27 || e.keyCode == 13 || e.keyCode == 32 || e.keyCode == 83) {
			this.onClose(null);
			return;
		}
	}
	,onClose: function(event) {
		this.window.style.display = "none";
		this.isVisible = false;
		this.list.innerHTML = "";
	}
	,onSelect: function(strID) {
		var dotIndex = strID.indexOf(".");
		var dashIndex = strID.indexOf("-");
		var nodeID = Std.parseInt(HxOverrides.substr(strID,0,dotIndex));
		var taskID = HxOverrides.substr(strID,dotIndex + 1,dashIndex - dotIndex - 1);
		var targetID = Std.parseInt(HxOverrides.substr(strID,dashIndex + 1,null));
		var sect = null;
		var _g_head = this.game.player.sects.h;
		var _g_val = null;
		while(_g_head != null) {
			var s;
			s = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
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
		var _g = 0;
		var _g1 = this.game.sectTasks;
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
	,show: function() {
		var s = "<table style=\"overflow:auto\" cellspacing=3 cellpadding=3 width=100%>" + "<tr><th>Name<th>Leader<th>LVL<th>Size<th>Current Task<th>AI";
		var _g_head = this.game.player.sects.h;
		var _g_val = null;
		while(_g_head != null) {
			var sect;
			sect = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			s += "<tr style=\"background:black\"><td>" + sect.name + "<td>" + sect.leader.name + "<td style=\"text-align:center\">" + (sect.level + 1) + "<td style=\"text-align:center\">" + sect.size + "/" + sect.getMaxSize() + " (+" + sect.getGrowth() + ")" + "<td style=\"te1xt-align:center\">";
			s += "<select class=secttasks onchange='Game.instance.ui.sects.onSelect(this.value)'>";
			var _g = 0;
			var _g1 = this.game.sectTasks;
			while(_g < _g1.length) {
				var t = _g1[_g];
				++_g;
				if(t.type == "investigator" && !this.game.player.hasInvestigator) continue;
				if(t.level > sect.level) continue;
				if(t.type == "cult") {
					var _g2 = 0;
					var _g3 = this.game.cults;
					while(_g2 < _g3.length) {
						var c = _g3[_g2];
						++_g2;
						if(c == this.game.player || !c.isDiscovered[this.game.player.id] || c.isDead) continue;
						var ok = t.check(this.game.player,sect,c);
						if(!ok) continue;
						s += "<option class=secttasks value=" + sect.leader.id + "." + t.id + "-" + c.id + (sect.task != null && sect.task.id == t.id && sect.taskTarget == c?" selected":"") + ">" + t.name + ": " + c.name;
					}
				} else if(t.type == "investigator") {
					var ok1 = t.check(this.game.player,sect,null);
					if(!ok1) continue;
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
	,onAdvisor: function(leaderID,checked) {
		var _g_head = this.game.player.sects.h;
		var _g_val = null;
		while(_g_head != null) {
			var sect;
			sect = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			if(sect.leader.id == leaderID) {
				sect.isAdvisor = checked;
				break;
			}
		}
	}
};
var Static = function() { };
Static.__name__ = true;
var UI = function(g) {
	this.game = g;
	this.config = new Config();
};
UI.__name__ = true;
UI.powerName = function(i,isShort) {
	return "<span style='color:" + UI.powerColors[i] + "'>" + (isShort?Game.powerShortNames[i]:Game.powerNames[i]) + "</span>";
};
UI.cultName = function(i,info) {
	return "<span style='color:" + UI.cultColors[i] + "'>" + info.name + "</span>";
};
UI.e = function(s) {
	return window.document.getElementById(s);
};
UI.prototype = {
	init: function() {
		this.logWindow = new Log(this,this.game);
		this.logPanel = new LogPanel(this,this.game);
		this.alertWindow = new Alert(this,this.game);
		this.info = new Info(this,this.game);
		this.debug = new Debug(this,this.game);
		this.status = new Status(this,this.game);
		this.map = new MapUI(this,this.game);
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
		window.document.onkeyup = $bind(this,this.onKey);
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
	,clearMap: function() {
		this.map.clear();
	}
	,msg: function(s) {
		window.document.getElementById("jqDialog_close").style.visibility = "hidden";
		JQDialog.notify(s,1);
	}
	,updateStatus: function() {
		this.status.update();
	}
	,finish: function(cult,state) {
		this.map.paint();
		var msg = "<div style='text-size: 20px'><b>Game over</b></div><br>";
		if(state == "summon" && !cult.isAI) {
			msg += "The stars were right. The Elder God was summoned in " + this.game.turns + " turns.";
			msg += "<br><br><center><b>YOU WON</b></center>";
			this.track("winGame diff:" + this.game.difficultyLevel,"summon",this.game.turns);
		} else if(state == "summon" && cult.isAI) {
			msg += cult.get_fullName() + " has completed the " + Static.rituals[0].name + ".<br><br>" + cult.info.summonFinish;
			msg += "<br><br><center><b>YOU LOSE</b></center>";
			this.track("loseGame diff:" + this.game.difficultyLevel,"summon",this.game.turns);
		} else if(state == "conquer" && !cult.isAI) {
			msg += cult.get_fullName() + " has taken over the world in " + this.game.turns + " turns. The Elder Gods are pleased.";
			msg += "<br><br><center><b>YOU WON</b></center>";
			this.track("winGame diff:" + this.game.difficultyLevel,"conquer",this.game.turns);
		} else if(state == "conquer" && cult.isAI) {
			msg += cult.get_fullName() + " has taken over the world. You fail.";
			msg += "<br><br><center><b>YOU LOSE</b></center>";
			this.track("loseGame diff:" + this.game.difficultyLevel,"conquer",this.game.turns);
		} else if(state == "wiped") {
			msg += cult.get_fullName() + " was wiped away completely. " + "The Elder God lies dormant beneath the sea, waiting.";
			msg += "<br><br><center><b>YOU LOSE</b></center>";
			this.track("loseGame diff:" + this.game.difficultyLevel,"wiped",this.game.turns);
		} else if(state == "multiplayerFinish") {
			msg += "The great game has ended. Humanity will live.";
			msg += "<br><br><center><b>YOU ALL LOSE</b></center>";
			this.track("loseGame diff:" + this.game.difficultyLevel,"multiplayerFinish",this.game.turns);
		}
		var _g = 0;
		var _g1 = this.game.nodes;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			n.setVisible(this.game.player,true);
		}
		this.alert(msg,true);
	}
	,alert: function(s,shadow,shadowOpacity) {
		this.alertWindow.show(s,shadow,shadowOpacity);
	}
	,log2: function(cultOrigin,s,params) {
		var _g = 0;
		var _g1 = this.game.cults;
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
	,clearLog: function() {
		this.logWindow.clear();
		this.logPanel.clear();
	}
	,track: function(action,label,value) {
		action = "cult " + action + " " + Game.version;
		if(label == null) label = "";
		if(value == null) value = 0;
		pageTracker._trackEvent("Evil Cult",action,label,value);
	}
};
var Status = function(uivar,gvar) {
	this.ui = uivar;
	this.game = gvar;
	this.status = window.document.getElementById("status");
	this.status.style.border = "double #777 4px";
	this.status.style.width = "191px";
	this.status.style.height = UI.mapHeight + UI.topHeight - 10 + "px";
	this.status.style.position = "absolute";
	this.status.style.left = "5px";
	this.status.style.top = "5px";
	this.status.style.padding = "5px";
	this.status.style.fontSize = "12px";
	this.status.style.overflow = "hidden";
	var s = "<div id='status.cult' style='padding:0 5 5 5; background: #111; height: 17; " + "font-weight: bold; font-size:15px; text-align:center;'>-</div>";
	s += "<fieldset>";
	s += "<legend>FOLLOWERS</legend>";
	s += "<table width=100% cellpadding=0 cellspacing=2 style='font-size:14px'>";
	var _g1 = 0;
	var _g = Game.followerNames.length;
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
	var _g11 = 0;
	var _g2 = Game.numPowers + 1;
	while(_g11 < _g2) {
		var i1 = _g11++;
		s += "<tr style='";
		if(i1 % 2 == 1) s += "background:#101010";
		s += "'><td>" + "<div id='status.powerMark" + i1 + "' style='width:" + UI.markerWidth + "; height: " + UI.markerHeight + "; font-size: 12px; " + "; background:#222; border:1px solid #777; color: " + UI.powerColors[i1] + ";'>" + "<center><b>" + Game.powerShortNames[i1] + "</b></center></div>" + "<td><b id='status.powerName" + i1 + "' " + UI.powerName(i1) + "</b>" + "<td><td><span id='status.power" + i1 + "'>0</span><br>" + "<span style='font-size:10px' id='status.powerMod" + i1 + "'>0</span>";
		s += "<tr style='";
		if(i1 % 2 == 1) s += "background:#101010";
		s += "'><td colspan=4><table style='font-size:11px'>" + "<tr><td width=20 halign=right>To";
		var _g3 = 0;
		var _g21 = Game.numPowers;
		while(_g3 < _g21) {
			var ii = _g3++;
			if(ii != i1) s += "<td><div id='status.convert" + i1 + ii + "' " + "style='cursor: pointer; width:12; height:12; " + "background:#222; border:1px solid #777; " + "color:" + UI.powerColors[ii] + "; " + "text-align:center; font-size: 10px; font-weight: bold; '>" + Game.powerShortNames[ii] + "</div>";
		}
		if(i1 != 3) {
			s += "<td><div id='status.lowerAwareness" + i1 + "' " + "style='cursor: pointer; width:12; height:12; " + "background:#222; border:1px solid #777; " + "color:" + UI.colAwareness + "; " + "text-align:center; font-size: 10px; font-weight: bold; '>A</div>";
			s += "<td halign=right><div id='status.lowerWillpower" + i1 + "' " + "style='cursor: pointer; width:12; height:12; " + "background:#222; border:1px solid #777; " + "color:" + UI.colWillpower + "; " + "text-align:center; font-size: 10px; font-weight: bold; '>W</div>";
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
	var _g12 = 0;
	var _g4 = Game.followerNames.length;
	while(_g12 < _g4) {
		var i2 = _g12++;
		window.document.getElementById("status.follower" + i2).title = Status.tipFollowers[i2];
		var c = window.document.getElementById("status.upgrade" + i2);
		c.onclick = $bind(this,this.onUpgrade);
		c.title = Status.tipUpgrade[i2];
		c.style.visibility = "hidden";
	}
	var _g13 = 0;
	var _g5 = Game.numPowers + 1;
	while(_g13 < _g5) {
		var i3 = _g13++;
		window.document.getElementById("status.powerMark" + i3).title = Status.tipPowers[i3];
		window.document.getElementById("status.powerName" + i3).title = Status.tipPowers[i3];
		var _g31 = 0;
		var _g22 = Game.numPowers;
		while(_g31 < _g22) {
			var ii1 = _g31++;
			if(i3 != ii1) {
				var c1 = window.document.getElementById("status.convert" + i3 + ii1);
				c1.onclick = $bind(this,this.onConvert);
				c1.title = Status.tipConvert + UI.powerName(ii1) + ": " + Game.powerConversionCost[i3];
			}
		}
		if(i3 != 3) {
			var c2 = window.document.getElementById("status.lowerAwareness" + i3);
			c2.onclick = $bind(this,this.onLowerAwareness);
			c2.title = Status.tipLowerAwareness;
			var c3 = window.document.getElementById("status.lowerWillpower" + i3);
			c3.onclick = $bind(this,this.onLowerWillpower);
			c3.title = Status.tipLowerWillpower + Game.willPowerCost;
		}
	}
	window.document.getElementById("status.endTurn").onclick = $bind(this,this.onEndTurn);
	window.document.getElementById("status.mainMenu").onclick = $bind(this,this.onMainMenu);
	window.document.getElementById("status.play").onclick = $bind(this,this.onPlay);
	window.document.getElementById("status.pause").onclick = $bind(this,this.onPause);
	window.document.getElementById("status.stop").onclick = $bind(this,this.onStop);
	window.document.getElementById("status.random").onclick = $bind(this,this.onRandom);
	window.document.getElementById("status.track").onclick = $bind(this,this.onTrack);
	new JQuery("#status *").tooltip({ delay : 0});
};
Status.__name__ = true;
Status.e = function(s) {
	return window.document.getElementById(s);
};
Status.prototype = {
	onPlay: function(event) {
		this.ui.music.play();
	}
	,onPause: function(event) {
		this.ui.music.pause();
	}
	,onStop: function(event) {
		this.ui.music.stop();
	}
	,onRandom: function(event) {
		this.ui.music.random();
	}
	,onTrack: function(event) {
		window.open(this.ui.music.getPage(),"");
	}
	,onLowerAwareness: function(event) {
		if(this.game.isFinished) return;
		var power = Std.parseInt(Tools.getTarget(event).id.substr(21,1));
		this.game.player.lowerAwareness(power);
	}
	,onLowerWillpower: function(event) {
		if(this.game.isFinished) return;
		var power = Std.parseInt(Tools.getTarget(event).id.substr(21,1));
		this.game.player.lowerWillpower(power);
	}
	,onUpgrade: function(event) {
		if(this.game.isFinished) return;
		var lvl = Std.parseInt(Tools.getTarget(event).id.substr(14,1));
		this.game.player.upgrade(lvl);
	}
	,onConvert: function(event) {
		if(this.game.isFinished) return;
		var from = Std.parseInt(Tools.getTarget(event).id.substr(14,1));
		var to = Std.parseInt(Tools.getTarget(event).id.substr(15,1));
		this.game.player.convert(from,to);
	}
	,onEndTurn: function(event) {
		if(this.game.isFinished) return;
		this.game.player.highlightedNodes.clear();
		var _g_head = this.game.player.logPanelMessages.h;
		var _g_val = null;
		while(_g_head != null) {
			var m;
			m = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			m.old = true;
		}
		this.game.endTurn();
	}
	,onMainMenu: function(event) {
		this.ui.mainMenu.show();
	}
	,updateTip: function(name,tip) {
		name = "#" + name;
		if(name.indexOf(".") > 0) name = (function($this) {
			var $r;
			var len = name.indexOf(".");
			$r = HxOverrides.substr(name,0,len);
			return $r;
		}(this)) + "\\" + (function($this) {
			var $r;
			var pos = name.indexOf(".");
			$r = HxOverrides.substr(name,pos,null);
			return $r;
		}(this));
		new JQuery(name).attr("tooltipText",tip);
	}
	,update: function() {
		window.document.getElementById("status.cult").innerHTML = this.game.player.get_fullName();
		var _g1 = 0;
		var _g = Game.numPowers + 1;
		while(_g1 < _g) {
			var i = _g1++;
			var s = Status.tipPowers[i] + "<br>Chance to gain each unit: <span style='color:white'>" + this.game.player.getResourceChance() + "%</span>";
			this.updateTip("status.powerMark" + i,s);
			this.updateTip("status.powerName" + i,s);
		}
		var _g11 = 0;
		var _g2 = Game.followerLevels;
		while(_g11 < _g2) {
			var i1 = _g11++;
			this.updateTip("status.follower" + i1,Status.tipFollowers[i1]);
			this.updateTip("status.upgrade" + i1,Status.tipUpgrade[i1] + "<br>Chance of success: <span style='color:white'>" + this.game.player.getUpgradeChance(i1) + "%</span>");
		}
		this.updateTip("status.followers1",(this.game.player.adeptsUsed > this.game.player.get_adepts()?this.game.player.get_adepts():this.game.player.adeptsUsed) + " used of " + this.game.player.get_adepts());
		var _g12 = 0;
		var _g3 = Game.numPowers + 1;
		while(_g12 < _g3) {
			var i2 = _g12++;
			var _g31 = 0;
			var _g21 = Game.numPowers;
			while(_g31 < _g21) {
				var ii = _g31++;
				if(i2 == ii) continue;
				var c = window.document.getElementById("status.convert" + i2 + ii);
				if(this.game.player.power[i2] >= Game.powerConversionCost[i2]) c.style.visibility = "visible"; else c.style.visibility = "hidden";
			}
		}
		var _g13 = 0;
		var _g4 = Game.followerLevels;
		while(_g13 < _g4) {
			var i3 = _g13++;
			var s1 = "" + this.game.player.getNumFollowers(i3);
			if(i3 == 1 && this.game.player.get_adepts() > 0) {
				var adepts = this.game.player.get_adepts() - this.game.player.adeptsUsed;
				if(adepts < 0) adepts = 0;
				s1 = "<span style='color:#55dd55'>" + adepts + "</span>";
			}
			window.document.getElementById("status.followers" + i3).innerHTML = s1;
		}
		var _g14 = 0;
		var _g5 = Game.numPowers + 1;
		while(_g14 < _g5) {
			var i4 = _g14++;
			window.document.getElementById("status.power" + i4).innerHTML = "<b>" + this.game.player.power[i4] + "</b>";
			if(i4 == 3) window.document.getElementById("status.powerMod3").innerHTML = " +0-" + Std["int"](this.game.player.get_neophytes() / 4 - 0.5); else window.document.getElementById("status.powerMod" + i4).innerHTML = " +0-" + this.game.player.powerMod[i4];
		}
		window.document.getElementById("status.turns").innerHTML = "" + this.game.turns;
		window.document.getElementById("status.awareness").innerHTML = "" + this.game.player.awareness + "%";
		var _g15 = 0;
		var _g6 = Game.numPowers;
		while(_g15 < _g6) {
			var i5 = _g15++;
			window.document.getElementById("status.lowerAwareness" + i5).style.visibility = "hidden";
		}
		if(this.game.player.adeptsUsed < this.game.player.get_adepts() && this.game.player.get_adepts() > 0 && this.game.player.awareness > 0) {
			var _g16 = 0;
			var _g7 = Game.numPowers;
			while(_g16 < _g7) {
				var i6 = _g16++;
				if(this.game.player.power[i6] > 0) window.document.getElementById("status.lowerAwareness" + i6).style.visibility = "visible";
			}
		}
		var _g17 = 0;
		var _g8 = Game.numPowers;
		while(_g17 < _g8) {
			var i7 = _g17++;
			window.document.getElementById("status.lowerWillpower" + i7).style.visibility = "hidden";
		}
		if(this.game.player.hasInvestigator && !this.game.player.investigator.isHidden && this.game.player.adeptsUsed < this.game.player.get_adepts() && this.game.player.get_adepts() > 0) {
			var _g18 = 0;
			var _g9 = Game.numPowers;
			while(_g18 < _g9) {
				var i8 = _g18++;
				if(this.game.player.power[i8] >= Game.willPowerCost) window.document.getElementById("status.lowerWillpower" + i8).style.visibility = "visible";
			}
		}
		var _g19 = 0;
		var _g10 = Game.followerNames.length;
		while(_g19 < _g10) {
			var i9 = _g19++;
			if(this.game.player.canUpgrade(i9)) window.document.getElementById("status.upgrade" + i9).style.visibility = "visible"; else window.document.getElementById("status.upgrade" + i9).style.visibility = "hidden";
		}
		this.updateTip("status.follower2","3 priests and " + this.game.difficulty.numSummonVirgins + " virgins are needed to summon the Elder God.");
		this.updateTip("status.upgrade2","To perform the " + Static.rituals[0].name + " you need " + Game.upgradeCost + " priests and " + this.game.difficulty.numSummonVirgins + " virgins.<br>" + "<li>The more society is aware of the cult the harder it is to " + "summon Elder God.");
	}
	,onMusic: function() {
		window.document.getElementById("status.track").innerHTML = this.ui.music.getName();
	}
};
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.random = function(x) {
	if(x <= 0) return 0; else return Math.floor(Math.random() * x);
};
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = true;
StringBuf.prototype = {
	add: function(x) {
		this.b += Std.string(x);
	}
	,addSub: function(s,pos,len) {
		if(len == null) this.b += HxOverrides.substr(s,pos,null); else this.b += HxOverrides.substr(s,pos,len);
	}
};
var StringTools = function() { };
StringTools.__name__ = true;
StringTools.lpad = function(s,c,l) {
	if(c.length <= 0) return s;
	while(s.length < l) s = c + s;
	return s;
};
var Tools = function() { };
Tools.__name__ = true;
Tools.getTarget = function(event) {
	if(event == null) event = window.event;
	var t = event.target;
	if(t == null) t = event.srcElement;
	return t;
};
Tools.bg = function(params) {
	if(params.z == null) params.z = 15;
	var bg;
	var _this = window.document;
	bg = _this.createElement("div");
	bg.style.display = "none";
	bg.style.position = "absolute";
	bg.style.zIndex = params.z;
	bg.style.width = params.w;
	bg.style.height = params.h;
	bg.style.left = "0px";
	bg.style.top = "0px";
	bg.style.opacity = "0.8";
	bg.style.background = "#000";
	window.document.body.appendChild(bg);
	return bg;
};
Tools.button = function(params) {
	var b;
	var _this = window.document;
	b = _this.createElement("div");
	b.id = params.id;
	b.innerHTML = params.text;
	if(params.bold == null) params.bold = true;
	if(params.bold) b.style.fontWeight = "bold";
	if(params.fontSize == null) params.fontSize = "20px";
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
};
Tools.closeButton = function(container,x,y,name) {
	var b = Tools.button({ id : name, text : "Close", width : 80, height : 25, x : x, y : y, container : container});
	return b;
};
Tools.label = function(params) {
	var b;
	var _this = window.document;
	b = _this.createElement("div");
	b.id = params.id;
	b.innerHTML = params.text;
	if(params.bold == null) params.bold = true;
	if(params.bold) b.style.fontWeight = "bold";
	if(params.fontSize == null) params.fontSize = "20px";
	b.style.fontSize = params.fontSize;
	b.style.position = "absolute";
	b.style.width = params.w;
	b.style.height = params.h;
	b.style.left = params.x;
	b.style.top = params.y;
	params.container.appendChild(b);
	return b;
};
Tools.window = function(params) {
	if(params.winW != null) params.x = (params.winW - params.w) / 2;
	if(params.winH != null) params.y = (params.winH - params.h) / 2;
	if(params.z == null) params.z = 10;
	var w = window.document.createElement("div");
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
	window.document.body.appendChild(w);
	return w;
};
Tools.textfield = function(params) {
	var t;
	var _this = window.document;
	t = _this.createElement("input");
	t.id = params.id;
	t.value = params.text;
	if(params.bold == null) params.bold = false;
	if(params.bold) t.style.fontWeight = "bold";
	if(params.fontSize == null) params.fontSize = "20px";
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
};
Tools.checkbox = function(params) {
	var t;
	var _this = window.document;
	t = _this.createElement("input");
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
};
var TopMenu = function(uivar,gvar) {
	this.ui = uivar;
	this.game = gvar;
	var _this = window.document;
	this.panel = _this.createElement("div");
	this.panel.id = "topPanel";
	this.panel.style.position = "absolute";
	this.panel.style.width = UI.mapWidth + 8 + "px";
	this.panel.style.height = "26px";
	this.panel.style.left = "240px";
	this.panel.style.top = "5px";
	this.panel.style.background = "#090909";
	window.document.body.appendChild(this.panel);
	Tools.button({ id : "cults", text : "CULTS", w : 70, h : TopMenu.buttonHeight, x : 20, y : 2, fontSize : 16, container : this.panel, title : "Click to view cults information (or press <span style=\"color:white\">C</span>).", func : $bind(this,this.onCults)});
	Tools.button({ id : "sects", text : "SECTS", w : 70, h : TopMenu.buttonHeight, x : 110, y : 2, fontSize : 16, container : this.panel, title : "Click to view sects controlled by your cult (or press <span style=\"color:white\">S</span>).", func : $bind(this,this.onSects)});
	Tools.button({ id : "log", text : "LOG", w : 70, h : TopMenu.buttonHeight, x : 200, y : 2, fontSize : 16, container : this.panel, title : "Click to view message log (or press <span style=\"color:white\">L</span>).", func : $bind(this,this.onLog)});
	Tools.button({ id : "options", text : "OPTIONS", w : 100, h : TopMenu.buttonHeight, x : 290, y : 2, fontSize : 16, container : this.panel, title : "Click to view options (or press <span style=\"color:white\">O</span>).", func : $bind(this,this.onOptions)});
	if(Game.isDebug) Tools.button({ id : "debug", text : "DEBUG", w : 70, h : TopMenu.buttonHeight, x : 410, y : 2, fontSize : 16, container : this.panel, title : "Click to open debug menu (or press <span style=\"color:white\">D</span>).", func : $bind(this,this.onDebug)});
	Tools.button({ id : "about", text : "ABOUT", w : 70, h : TopMenu.buttonHeight, x : 700, y : 2, fontSize : 16, container : this.panel, title : "Click to go to About page.", func : $bind(this,this.onAbout)});
	Tools.button({ id : "advanced", text : "A", w : 12, h : 12, x : 774, y : 30, fontSize : 10, container : this.panel, title : "Click to set/unset advanced map mode (or press <span style=\"color:white\">A</span>).", func : $bind(this,this.onAdvanced)});
};
TopMenu.__name__ = true;
TopMenu.prototype = {
	onCults: function(event) {
		this.ui.info.show();
	}
	,onSects: function(e) {
		this.ui.sects.show();
	}
	,onLog: function(event) {
		this.ui.logWindow.show();
	}
	,onOptions: function(event) {
		this.ui.options.show();
	}
	,onDebug: function(event) {
		if(this.game.isFinished || !Game.isDebug) return;
		this.ui.debug.show();
	}
	,onAdvanced: function(event) {
		this.ui.map.isAdvanced = !this.ui.map.isAdvanced;
		this.game.player.options.set("mapAdvancedMode",this.ui.map.isAdvanced);
		this.ui.map.paint();
	}
	,onAbout: function(event) {
		window.open("http://code.google.com/p/cult/wiki/About");
	}
};
var Type = function() { };
Type.__name__ = true;
Type.createInstance = function(cl,args) {
	var _g = args.length;
	switch(_g) {
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
		throw new js__$Boot_HaxeError("Too many arguments");
	}
	return null;
};
var UINode = function(gvar,uivar,nvar) {
	this.game = gvar;
	this.ui = uivar;
	this.node = nvar;
};
UINode.__name__ = true;
UINode.prototype = {
	paint: function(ctx) {
		if(!this.node.visibility[this.game.player.id]) return;
		if(this.node.x < this.ui.map.viewRect.x - 20 || this.node.y < this.ui.map.viewRect.y - 20 || this.node.x > this.ui.map.viewRect.x + this.ui.map.viewRect.w || this.node.y > this.ui.map.viewRect.y + this.ui.map.viewRect.h) return;
		var key = "";
		var xx = this.node.x;
		var yy = this.node.y;
		var hlx = this.node.x - 10;
		var hly = this.node.y - 10;
		var tx = this.node.x + 4;
		var ty = this.node.y + 14;
		var text = "";
		var textColor = "white";
		var isI = false;
		var is1 = false;
		var _g1 = 0;
		var _g = Game.numPowers;
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
		this.tempd = 0;
		this.temph = 17;
		if(this.node.isGenerator) {
			key += "g";
			dd = 2;
			var _g2 = 0;
			var _g11 = this.game.cults;
			while(_g2 < _g11.length) {
				var p = _g11[_g2];
				++_g2;
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
		var _g_head = this.game.player.highlightedNodes.h;
		var _g_val = null;
		while(_g_head != null) {
			var n;
			n = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			if(n == this.node) {
				ctx.drawImage(this.ui.map.nodeImage,0,167,37,37,hlx,hly,37,37);
				break;
			}
		}
		var a = Reflect.field(UINode.imageKeys,key);
		var y0 = a[0];
		var w = a[1];
		var x0;
		if(this.node.owner != null) x0 = this.node.owner.id * w; else x0 = 0;
		ctx.drawImage(this.ui.map.nodeImage,x0,y0,w,w,xx,yy,w,w);
		ctx.fillStyle = textColor;
		ctx.fillText(text,tx,ty);
		this.tempx = xx;
		this.tempy = yy;
	}
	,paintAdvanced: function(ctx) {
		if(!this.node.visibility[this.game.player.id]) return;
		if(this.node.x < this.ui.map.viewRect.x - 20 || this.node.y < this.ui.map.viewRect.y - 20 || this.node.x > this.ui.map.viewRect.x + this.ui.map.viewRect.w || this.node.y > this.ui.map.viewRect.y + this.ui.map.viewRect.h) return;
		var productionIndicatorWidth = 6;
		var productionIndicatorHeight = 2;
		if(this.node.isGenerator && !this.node.isTempGenerator) {
			if(this.node.owner == null || this.node.isKnown[this.game.player.id]) {
				var _g1 = 0;
				var _g = Game.numPowers;
				while(_g1 < _g) {
					var i = _g1++;
					if(this.node.powerGenerated[i] > 0) {
						ctx.fillStyle = UI.powerColors[i];
						ctx.fillRect(this.tempx + (this.tempd - 1) + i * (productionIndicatorWidth + 1),this.tempy - productionIndicatorHeight,productionIndicatorWidth,productionIndicatorHeight);
					}
				}
			}
		}
		if(this.node.owner != this.game.player) {
			var ch = this.game.player.getGainChance(this.node);
			this.ui.map.paintText(ctx,[ch / 10 | 0,ch % 10,10],0,this.tempx + this.tempd + 1,this.tempy - 11);
			if(this.node.owner == null || this.node.isKnown[this.game.player.id]) {
				var _g11 = 0;
				var _g2 = Game.numPowers;
				while(_g11 < _g2) {
					var i1 = _g11++;
					if(this.node.power[i1] > 0) this.ui.map.paintText(ctx,[this.node.power[i1]],i1 + 1,this.tempd + this.tempx + i1 * 6,this.tempy + this.temph + 3); else this.ui.map.paintText(ctx,[10],i1 + 1,this.tempd + this.tempx + i1 * 6,this.tempy + this.temph + 3);
				}
			}
		}
	}
	,update: function() {
	}
	,getTooltip: function() {
		if(!this.node.visibility[this.game.player.id]) return "";
		var s = "";
		if(Game.debugNear) {
			s += "Node " + this.node.id + "<br>";
			var _g_head = this.node.links.h;
			var _g_val = null;
			while(_g_head != null) {
				var n;
				n = (function($this) {
					var $r;
					_g_val = _g_head[0];
					_g_head = _g_head[1];
					$r = _g_val;
					return $r;
				}(this));
				s += n.id + "<br>";
			}
			if(this.node.isProtected) s += "Protected<br>"; else s += "Unprotected<br>";
		}
		if(Game.debugVis) {
			s += "Node " + this.node.id + "<br>";
			var _g1 = 0;
			var _g = this.game.difficulty.numCults;
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
				var _g11 = 0;
				var _g2 = Game.numPowers;
				while(_g11 < _g2) {
					var i1 = _g11++;
					if(this.game.player.power[i1] < this.node.power[i1]) {
						s += "<span style='color:#ff8888'>Not enough " + Game.powerNames[i1] + "</span><br>";
						br = true;
					}
				}
			}
			if(this.node.isGenerator && this.node.owner != null) {
				var cnt = 0;
				var _g_head1 = this.node.links.h;
				var _g_val1 = null;
				while(_g_head1 != null) {
					var n1;
					n1 = (function($this) {
						var $r;
						_g_val1 = _g_head1[0];
						_g_head1 = _g_head1[1];
						$r = _g_val1;
						return $r;
					}(this));
					if(n1.owner == this.node.owner) cnt++;
				}
				if(cnt >= 3) s += "<span style='color:#ff8888'>Generator has " + cnt + " links</span><br>";
			}
			if(br) s += "<br>";
		}
		if(this.node.owner == null || this.node.isKnown[this.game.player.id]) {
			var _g12 = 0;
			var _g3 = Game.numPowers;
			while(_g12 < _g3) {
				var i2 = _g12++;
				if(this.node.power[i2] > 0) s += "<b style='color:" + UI.powerColors[i2] + "'>" + Game.powerNames[i2] + "</b> " + this.node.power[i2] + "<br>";
			}
		}
		if(this.node.owner == null || this.node.owner.isAI) s += "Chance of success: <span style='color:white'>" + this.game.player.getGainChance(this.node) + "%</span><br>";
		if(this.node.isGenerator && (this.node.owner == null || this.node.isKnown[this.game.player.id])) {
			s += "<br>Generates:<br>";
			var _g13 = 0;
			var _g4 = Game.numPowers;
			while(_g13 < _g4) {
				var i3 = _g13++;
				if(this.node.powerGenerated[i3] > 0) s += "<b style='color:" + UI.powerColors[i3] + "'>" + Game.powerNames[i3] + "</b> " + this.node.powerGenerated[i3] + "<br>";
			}
			if(this.node.isTempGenerator) s += "Temporary<br>";
		}
		return s;
	}
	,setVisible: function(c,v) {
		if(c.isAI) return;
		if(Game.mapVisible) v = true;
	}
};
var haxe_IMap = function() { };
haxe_IMap.__name__ = true;
var haxe_ds_StringMap = function() {
	this.h = { };
};
haxe_ds_StringMap.__name__ = true;
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	set: function(key,value) {
		if(__map_reserved[key] != null) this.setReserved(key,value); else this.h[key] = value;
	}
	,get: function(key) {
		if(__map_reserved[key] != null) return this.getReserved(key);
		return this.h[key];
	}
	,setReserved: function(key,value) {
		if(this.rh == null) this.rh = { };
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) return null; else return this.rh["$" + key];
	}
	,remove: function(key) {
		if(__map_reserved[key] != null) {
			key = "$" + key;
			if(this.rh == null || !this.rh.hasOwnProperty(key)) return false;
			delete(this.rh[key]);
			return true;
		} else {
			if(!this.h.hasOwnProperty(key)) return false;
			delete(this.h[key]);
			return true;
		}
	}
};
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) Error.captureStackTrace(this,js__$Boot_HaxeError);
};
js__$Boot_HaxeError.__name__ = true;
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
});
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
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
};
var sects_Advisor = function(g) {
	this.game = g;
};
sects_Advisor.__name__ = true;
sects_Advisor.prototype = {
	cultHasSectOnTask: function(cult,id,target) {
		var _g_head = cult.sects.h;
		var _g_val = null;
		while(_g_head != null) {
			var s;
			s = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			if(s.task != null && s.task.id == id && s.taskTarget == target) return true;
		}
		return false;
	}
	,findBestSectForTask: function(cult,id,taskVeryImportant) {
		var task = null;
		var _g = 0;
		var _g1 = this.game.sectTasks;
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
		var _g_head = cult.sects.h;
		var _g_val = null;
		while(_g_head != null) {
			var s;
			s = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
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
	,run: function(cult) {
		if(cult.sects.length == 0) return;
		if(cult.hasInvestigator && cult.investigator.isHidden) {
			if(!this.cultHasSectOnTask(cult,"invSearch")) {
				var s = this.findBestSectForTask(cult,"invSearch",true);
				s.setTaskByID("invSearch");
				s.taskImportant = true;
			}
		} else if(cult.hasInvestigator) {
			var _g_head = cult.sects.h;
			var _g_val = null;
			while(_g_head != null) {
				var s1;
				s1 = (function($this) {
					var $r;
					_g_val = _g_head[0];
					_g_head = _g_head[1];
					$r = _g_val;
					return $r;
				}(this));
				if((s1.task == null || s1.task.id != "invConfuse") && s1.isAdvisor) {
					s1.setTaskByID("invConfuse");
					s1.taskImportant = true;
				}
			}
			return;
		}
		var _g = 0;
		var _g1 = this.game.cults;
		while(_g < _g1.length) {
			var c2 = _g1[_g];
			++_g;
			if(c2 == cult || !c2.isDiscovered[cult.id] || c2.isInfoKnown[cult.id]) continue;
			if(this.cultHasSectOnTask(cult,"cultGeneralInfo",c2)) continue;
			var s2 = this.findBestSectForTask(cult,"cultGeneralInfo",false);
			if(s2 == null) break;
			s2.setTaskByID("cultGeneralInfo",c2);
			s2.taskImportant = true;
		}
		var temp = [];
		var _g2 = 0;
		var _g11 = this.game.cults;
		while(_g2 < _g11.length) {
			var c = _g11[_g2];
			++_g2;
			if(c != cult && c.isDiscovered[cult.id] && !c.isDead) temp.push(c.id);
		}
		if(temp.length == 0) return;
		var _g_head1 = cult.sects.h;
		var _g_val1 = null;
		while(_g_head1 != null) {
			var s3;
			s3 = (function($this) {
				var $r;
				_g_val1 = _g_head1[0];
				_g_head1 = _g_head1[1];
				$r = _g_val1;
				return $r;
			}(this));
			if(!s3.taskImportant && s3.isAdvisor) {
				var cultTarget = this.game.cults[temp[Std.random(temp.length)]];
				s3.setTaskByID("cultNodeInfo",cultTarget);
			}
		}
	}
};
var sects_Task = function() {
	this.id = "_empty";
	this.type = "";
	this.name = "";
	this.level = 0;
	this.points = 0;
	this.isInfinite = false;
};
sects_Task.__name__ = true;
sects_Task.prototype = {
	check: function(cult,sect,target) {
		console.log("default check(), should not be called!");
		return true;
	}
	,checkFailure: function(sect) {
		return false;
	}
	,complete: function(game,ui,cult,sect,points) {
		console.log("default complete(), should not be called!");
	}
	,log: function(cult,m) {
		cult.log(m);
		cult.logPanel({ id : -1, old : false, type : "cult", text : m, obj : cult, turn : cult.game.turns + 1, params : { }});
	}
};
var sects_CultGeneralInfoTask = function() {
	sects_Task.call(this);
	this.id = "cultGeneralInfo";
	this.name = "Cult information";
	this.type = "cult";
	this.points = 30;
};
sects_CultGeneralInfoTask.__name__ = true;
sects_CultGeneralInfoTask.__super__ = sects_Task;
sects_CultGeneralInfoTask.prototype = $extend(sects_Task.prototype,{
	check: function(cult,sect,target) {
		var c = target;
		if(cult == c || c.isInfoKnown[cult.id]) return false;
		return true;
	}
	,complete: function(game,ui,cult,sect,points) {
		var c = sect.taskTarget;
		c.isInfoKnown[cult.id] = true;
		this.log(cult,"Task completed: Information about " + c.get_fullName() + " gathered.");
		var _g_head = c.nodes.h;
		var _g_val = null;
		while(_g_head != null) {
			var n;
			n = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			if(n.visibility[c.id]) n.update();
		}
	}
});
var sects_CultNodeInfoTask = function() {
	sects_Task.call(this);
	this.id = "cultNodeInfo";
	this.name = "Cult nodes";
	this.type = "cult";
	this.isInfinite = true;
	this.points = 0;
};
sects_CultNodeInfoTask.__name__ = true;
sects_CultNodeInfoTask.__super__ = sects_Task;
sects_CultNodeInfoTask.prototype = $extend(sects_Task.prototype,{
	check: function(cult,sect,target) {
		var c = target;
		if(cult == c) return false;
		return true;
	}
	,complete: function(game,ui,cult,sect,points) {
		var c = sect.taskTarget;
		var cnt = 0;
		var _g_head = c.nodes.h;
		var _g_val = null;
		while(_g_head != null) {
			var n;
			n = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			if(n.visibility[cult.id] && !n.isKnown[cult.id]) {
				cnt += 10;
				if(cnt >= points) break;
				n.isKnown[cult.id] = true;
				n.update();
			}
		}
	}
});
var sects_CultResourceInfoTask = function() {
	sects_Task.call(this);
	this.id = "cultResourceInfo";
	this.name = "Cult resources";
	this.type = "cult";
	this.points = 50;
};
sects_CultResourceInfoTask.__name__ = true;
sects_CultResourceInfoTask.__super__ = sects_Task;
sects_CultResourceInfoTask.prototype = $extend(sects_Task.prototype,{
	check: function(cult,sect,target) {
		var c = target;
		if(cult == c) return false;
		return true;
	}
	,complete: function(game,ui,cult,sect,points) {
		var c = sect.taskTarget;
		this.log(cult,"Task completed: " + c.get_fullName() + " has " + c.power[0] + " (+" + c.powerMod[0] + ") " + UI.powerName(0) + ", " + c.power[1] + " (+" + c.powerMod[1] + ") " + UI.powerName(1) + ", " + c.power[3] + " (+" + c.powerMod[2] + ") " + UI.powerName(2) + ", " + c.power[3] + " (+" + c.powerMod[3] + ") " + UI.powerName(3) + ".");
	}
});
var sects_CultSabotageRitualTask = function() {
	sects_Task.call(this);
	this.id = "cultSabotageRitual";
	this.name = "Sabotage ritual";
	this.type = "cult";
	this.isInfinite = true;
	this.points = 0;
	this.level = 1;
};
sects_CultSabotageRitualTask.__name__ = true;
sects_CultSabotageRitualTask.__super__ = sects_Task;
sects_CultSabotageRitualTask.prototype = $extend(sects_Task.prototype,{
	check: function(cult,sect,target) {
		var c = target;
		if(cult == c || !c.isRitual) return false;
		return true;
	}
	,checkFailure: function(sect) {
		var c = sect.taskTarget;
		if(!c.isRitual) return true;
		return false;
	}
	,complete: function(game,ui,cult,sect,points) {
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
		if(pts > 0) this.log(cult,"Ritual of " + c.get_fullName() + " stalled for " + pts + " points.");
	}
});
var sects_DoNothingTask = function() {
	sects_Task.call(this);
	this.id = "doNothing";
	this.name = "Do Nothing";
	this.type = "";
	this.isInfinite = true;
	this.points = 0;
};
sects_DoNothingTask.__name__ = true;
sects_DoNothingTask.__super__ = sects_Task;
sects_DoNothingTask.prototype = $extend(sects_Task.prototype,{
	check: function(cult,sect,target) {
		return true;
	}
	,complete: function(game,ui,cult,sect,points) {
	}
});
var sects_InvConfuseTask = function() {
	sects_Task.call(this);
	this.id = "invConfuse";
	this.name = "Confuse investigator";
	this.type = "investigator";
	this.isInfinite = true;
	this.points = 0;
};
sects_InvConfuseTask.__name__ = true;
sects_InvConfuseTask.__super__ = sects_Task;
sects_InvConfuseTask.prototype = $extend(sects_Task.prototype,{
	check: function(cult,sect,target) {
		if(cult.investigator.isHidden) return false;
		return true;
	}
	,checkFailure: function(sect) {
		if(!sect.cult.hasInvestigator || sect.cult.investigator.isHidden) return true;
		return false;
	}
	,complete: function(game,ui,cult,sect,points) {
		if(cult.investigator == null) return;
	}
});
var sects_InvSearchTask = function() {
	sects_Task.call(this);
	this.id = "invSearch";
	this.name = "Search for investigator";
	this.type = "investigator";
	this.points = 50;
};
sects_InvSearchTask.__name__ = true;
sects_InvSearchTask.__super__ = sects_Task;
sects_InvSearchTask.prototype = $extend(sects_Task.prototype,{
	check: function(cult,sect,target) {
		if(!cult.investigator.isHidden) return false;
		return true;
	}
	,checkFailure: function(sect) {
		if(!sect.cult.hasInvestigator || !sect.cult.investigator.isHidden) return true;
		return false;
	}
	,complete: function(game,ui,cult,sect,points) {
		if(cult.investigator == null || !cult.investigator.isHidden) return;
		cult.investigator.isHidden = false;
		cult.log("Task completed: Investigator found.");
		cult.logPanel({ id : -1, old : false, type : "cult", text : "Task completed: Investigator found.", obj : cult, turn : cult.game.turns + 1, params : { }});
	}
});
var sects_Sect = function(g,uivar,l,c) {
	this.game = g;
	this.ui = uivar;
	this.leader = l;
	this.cult = c;
	this.taskPoints = 0;
	this.taskImportant = false;
	this.size = 10;
	if(l.level == 1) this.size = 50; else if(l.level == 2) this.size = 90;
	this.level = 0;
	var rnd3 = Std["int"](Math.random() * sects_Sect.names.length);
	this.name = (function($this) {
		var $r;
		var len = $this.leader.name.indexOf(" ");
		$r = HxOverrides.substr($this.leader.name,0,len);
		return $r;
	}(this)) + (function($this) {
		var $r;
		var pos = $this.leader.name.indexOf(" ") + 1;
		$r = HxOverrides.substr($this.leader.name,pos,1);
		return $r;
	}(this)) + " " + sects_Sect.names[rnd3];
	this.isAdvisor = this.cult.options.getBool("sectAdvisor");
};
sects_Sect.__name__ = true;
sects_Sect.prototype = {
	setTaskByID: function(taskID,target) {
		var _g = 0;
		var _g1 = this.game.sectTasks;
		while(_g < _g1.length) {
			var t = _g1[_g];
			++_g;
			if(t.id == taskID) {
				this.setTask(t,target);
				return;
			}
		}
	}
	,setTask: function(newTask,target) {
		this.task = newTask;
		this.taskPoints = 0;
		this.taskTarget = target;
	}
	,clearTask: function() {
		this.task = null;
		this.taskTarget = null;
		this.taskPoints = 0;
		this.taskImportant = false;
	}
	,getMaxSize: function() {
		var maxSize = 100;
		if(this.leader.level == 1) maxSize = 500; else if(this.leader.level == 2) maxSize = 1000;
		return maxSize;
	}
	,getGrowth: function() {
		if(this.size < this.getMaxSize()) return 1 + (this.size / 10 | 0); else return 0;
	}
	,turn: function() {
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
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
String.__name__ = true;
Array.__name__ = true;
Date.__name__ = ["Date"];
var __map_reserved = {}
CustomMenu.difElementInfo = [{ name : "mapWidth", type : "int", title : "Map width", note : "Map width in pixels"},{ name : "mapHeight", type : "int", title : "Map height", note : "Map height in pixels"},{ name : "nodesCount", type : "int", title : "Amount of nodes", note : "Amount of nodes on map"},{ name : "nodeActivationRadius", type : "int", title : "Activation radius", note : "Node activation radius (node can be activated only when the player has an adjacent node in that radius)"},{ name : "numCults", type : "int", title : "Number of cults (2-8)", note : "Number of cults in game"},{ name : "numPlayers", type : "int", title : "Number of human players (1-8)", note : "Number of human players in game"},{ name : "numSummonVirgins", type : "int", title : "Number of virgins for the final ritual", note : "Number of virgins needed to perform final ritual"},{ name : "upgradeChance", type : "float", title : "Max upgrade chance", note : "Higher value raises max upgrade chance"},{ name : "awarenessResource", type : "float", title : "Resource chance awareness mod", note : "Higher value lowers chance of getting resources each turn"},{ name : "awarenessUpgrade", type : "float", title : "Upgrade chance awareness mod", note : "Higher value lowers chance of upgrading followers"},{ name : "awarenessGain", type : "float", title : "Gain follower chance awareness mod", note : "Higher value lowers chance of gaining new followers"},{ name : "investigatorChance", type : "float", title : "Investigator: Appearing chance", note : "Higher value raises chance of investigator appearing"},{ name : "investigatorKill", type : "float", title : "Investigator: Kill follower chance", note : "Higher value raises chance of investigator killing a follower"},{ name : "investigatorWillpower", type : "float", title : "Investigator: Willpower lower chance", note : "Higher value lowers chance of adepts lowering investigator willpower"},{ name : "investigatorTurnVisible", type : "int", title : "Investigator: Turn to become visible", note : "Turn on which new investigator becomes visible"},{ name : "investigatorGainWill", type : "float", title : "Investigator: Chance of gaining will", note : "Higher value raises chance of investigator gaining will"},{ name : "investigatorCultSize", type : "float", title : "Investigator: Cult size mod", note : "Starting investigator willpower - cult size multiplier (less - easier)"},{ name : "maxAwareness", type : "int", title : "AI: Max awareness", note : "Max awareness for AI to have without using adepts"},{ name : "isInfoKnown", type : "bool", title : "Cult info known at start?", note : "Is cult info for all cults known at start?"},{ name : "isOriginKnown", type : "bool", title : "Origin info known at start?", note : "Is origin known for all cults at start?"},{ name : "isDiscovered", type : "bool", title : "Cults discovered at start?", note : "Are cults marked as discovered on start?"}];
Game.powerNames = ["Intimidation","Persuasion","Bribery","Virgins"];
Game.powerShortNames = ["I","P","B","V"];
Game.followerNames = ["Neophyte","Adept","Priest"];
Game.powerConversionCost = [2,2,2,1];
Game.willPowerCost = 2;
Game.version = "DEV";
Game.manualVersion = "v5";
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
sects_Sect.taskClasses = [sects_DoNothingTask,sects_CultGeneralInfoTask,sects_CultNodeInfoTask,sects_CultResourceInfoTask,sects_CultSabotageRitualTask,sects_InvSearchTask,sects_InvConfuseTask];
sects_Sect.names0 = ["Open","Free","Rising","Strong"];
sects_Sect.names = ["Way","Path","Society","Group","School","Faith","Mind","Love","Care","Reform","State","Sun","Moon","Wisdom"];
Game.main();
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : exports);
