var BURGLAR = {
	hp: 7.5,
	ap: 2.5
};

var WARRIOR = {
	hp: 6.5,
	ap: 3
};

var WIZARD = {
	hp: 4,
	ap: 4.5
};

var GOBLIN = {
	hp: 8.5,
	ap: 2.2
};

var ORC = {
	hp: 5.5,
	ap: 3.5
};

var VAMPIRE = {
	hp: 4,
	ap: 4.5
};

var MONSTERS_ACCESSIBLE_NAMES = [
	'Mon1',
	'Mon2',
	'Mon3',
	'Mon4',
	'Mon5',
	'Mon6',
	'Mon7',
	'Mon8',
	'Mon9'
];

var HEROES_ACCESSIBLE_NAMES = [
	'Hero1',
	'Hero2',
	'Hero3',
	'Hero4',
	'Hero5',
	'Hero6',
	'Hero7',
	'Hero8',
	'Hero9'
];

function Pers() {
	this.hp = null; // Health power
	this.ap = null; // Attack power
	this.currentHP = null;
	this.skillCounter = 2;
	this.name = null;
}

Pers.prototype.generateHP = function(coefHP) {
	var basicHP = Math.floor(Math.random() * (1020 - 980) + 980);
	var resultHP = Math.floor(basicHP * coefHP);
	return resultHP;
}

Pers.prototype.generateAP = function(coefAP) {
	var basicAP = Math.floor(Math.random() * (110 - 90) + 90);
	var resultAP = Math.floor(basicAP * coefAP);
	return resultAP;
}

Pers.prototype.initPers = function(name, settings) {
	this.name = name;
	this.hp = this.generateHP(settings.hp);
	this.ap = this.generateAP(settings.ap);
	this.currentHP = this.hp;
}

Pers.prototype.regen = function() {
	this.currentHP = this.hp;
	this.skillCounter = 2;
}

Pers.prototype.setName = function(name) {
	this.name = name;
}

Pers.prototype.setHP = function(ap) {
	this.currentHP -= ap;
}

Pers.prototype.getAP = function() {
	return this.ap;
}

Pers.prototype.attack = function(obj) {
  obj.setHP(this.getAP());
}

Pers.prototype.isAlive = function() {
  return this.currentHP > 0;
}

Pers.prototype.getHP = function() {
  return this.currentHP;
}

Pers.prototype.shouldUseSkill = function(skillCounter) {
  return (this.currentHP < this.hp/2 && skillCounter > 0);
}

// Heroes
function Hero() {
	Pers.apply(this, arguments);
	if(arguments[1]) {
		this.skillOpponentCounter = 2;
		this.getAP = function() {
			if(this.shouldUseSkill(this.skillOpponentCounter)) {
				this.skillOpponentCounter -= 1;
				return this.ap*2;
			}
			return this.ap;
		}
	}
}

Hero.prototype = Object.create(Pers.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.setHP = function(ap) {
	if(this.shouldUseSkill(this.skillCounter)) {
		this.skillCounter -= 1;
	} else {
		this.currentHP -= ap;
	}
}

function Burg(name) {
	Hero.apply(this, arguments);
	this.initPers(name, BURGLAR);
}

Burg.prototype = Object.create(Hero.prototype);
Burg.prototype.constructor = Burg;

function War(name) {
	Hero.apply(this, arguments);
	this.initPers(name, WARRIOR);
}

War.prototype = Object.create(Hero.prototype);
War.prototype.constructor = War;

function Wiz(name) {
	Hero.apply(this, arguments);
	this.initPers(name, WIZARD);
}

Wiz.prototype = Object.create(Hero.prototype);
Wiz.prototype.constructor = Wiz;


// Monsters
function Monster() {
	Pers.apply(this, arguments);
	if(arguments[1]) {
		this.skillOpponentCounter = 2;
		this.setHP = function(ap) {
			if(this.shouldUseSkill(this.skillOpponentCounter)) {
				this.skillOpponentCounter -= 1;
			} else {
				this.currentHP -= ap;
			}
		}
	}
}

Monster.prototype = Object.create(Pers.prototype);
Monster.prototype.constructor = Monster;

Monster.prototype.getAP = function() {
	if(this.shouldUseSkill(this.skillCounter)) {
		this.skillCounter -= 1;
		return this.ap*2;
	}
	return this.ap;
}

function Gob(name) {
	Monster.apply(this, arguments);
	this.initPers(name, GOBLIN);
}

Gob.prototype = Object.create(Monster.prototype);
Gob.prototype.constructor = Gob;

function Orc(name) {
	Monster.apply(this, arguments);
	this.initPers(name, ORC);
}

Orc.prototype = Object.create(Monster.prototype);
Orc.prototype.constructor = Orc;

function Vamp(name) {
	Monster.apply(this, arguments);
	this.initPers(name, VAMPIRE);
}

Vamp.prototype = Object.create(Monster.prototype);
Vamp.prototype.constructor = Vamp;

// Tournament
function Tournament(amount) {
	this.maxParticipants = amount;
	this.participantsList = [];
}

Tournament.prototype.registerParticipants = function(persList) {
	for(var i = 0; i < persList.length; i += 1) {
		var accessibleList = persList[i] instanceof Monster ? MONSTERS_ACCESSIBLE_NAMES : HEROES_ACCESSIBLE_NAMES;
		if(this.isNameAccessible(persList[i].name, accessibleList)) {
			this.participantsList.push(persList[i]);
		} else {
			console.log('Sorry, ' + persList[i].name + ' you name is not in accessible list');
		}
		if (this.participantsList.length > this.maxParticipants - 1) {
			console.log('Max number of participants reached. Max number is ' + this.maxParticipants);
			break;
		}
	}
}

Tournament.prototype.isNameAccessible = function(name, nameList) {
	for(var i = 0; i < nameList.length; i += 1) {
		if(nameList[i] === name) {
			return true;
		}
	}
	return false;
}

Tournament.prototype.startTournament = function() {
	var sortedList = this.participantsList.sort(this.compareRandom);
	this.battleStage(sortedList);
}

Tournament.prototype.compareRandom = function(a, b) {
	return Math.random() - 0.5;
}

Tournament.prototype.battleStage = function(list) {
	var winners = [];
	var counter = 0;
	if(list.length <= 1) {
		return list;
	}
	if(list.length % 2) {
		winners.push(list[list.length - 1]);
	}
	for(var i = 0; i < Math.floor(list.length / 2); i += 1) {
		winners.push(this.battle(list[counter], list[counter + 1]));
		counter = counter + 2;
	}
	console.log(winners);
	return this.battleStage(winners);
}

Tournament.prototype.battle = function(pers1, pers2) {
	var winner;
	while (pers1.isAlive() && pers2.isAlive()) {
		pers1.attack(pers2);
		pers2.attack(pers1);
	}
	pers1.getHP() > 0 ? winner = pers1 : winner = pers2;
	winner.regen();
	console.log('Winner of the battale: ' + winner.name);
	return winner;
}

Tournament.prototype.getStages = function(num) {
	var result = arguments[1] !== undefined ? arguments[1] : 1;
	if(num / 2 === 1) {
		return result;
	}
	return this.getStages(num / 2, result + 1);
}

var tour1 = new Tournament(15);
var MAGIC_DRINK = true;
var PARTICIPANTS_LIST = [
	new Gob('Mon7', MAGIC_DRINK),
	new Burg('Hero6', MAGIC_DRINK),
	new Vamp('Mon1', MAGIC_DRINK),
	new Orc('Mon4', MAGIC_DRINK),
	new War('Hero5', MAGIC_DRINK),
	new Gob('Mon2', MAGIC_DRINK),
	new War('Semen666'),
	new Burg('Hero7', MAGIC_DRINK),
	new Orc('Mon3', MAGIC_DRINK),
	new Gob('Mon6', MAGIC_DRINK),
	new Gob('Mon9', MAGIC_DRINK),
	new Orc('STAS__1998'),
	new War('Hero1', MAGIC_DRINK),
	new War('Hero4', MAGIC_DRINK),
	new Gob('Mon8', MAGIC_DRINK),
	new Gob('Alfred202'),
	new Wiz('Hero2', MAGIC_DRINK),
	new Burg('Hero3', MAGIC_DRINK),
	new Orc('Mon5', MAGIC_DRINK),
];

tour1.registerParticipants(PARTICIPANTS_LIST);
tour1.startTournament();
