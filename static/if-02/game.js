// initialization stuff

var world = new World();
var inventory = new Inventory();

var introText = "IF TEST - js interactive fiction.<br><br>";
var log = new Log(introText);

// setting starting room for player
world.currentRoom = '_cabinet';


// =============== inventory contents ===================

// handkerchief
var obj = new WorldObject('_handkerchief');
with (obj)
  {
    name = 'handkerchief';
    addBlankAction('Examine', 'It is clean and white.');
    setIsStatic(false);
  }
inventory.add(obj);


// ================ room declarations ======================

// your cabinet declaration
var room = new Room('_cabinet');
with (room)
  {
    name = 'Your cabinet';
    description =
      'You are in your working cabinet which consists mainly of an ' +
      paintAction('old desk', '_xDesk') + 
      ' and a ' +
      paintAction('wooden chair', '_xChair') +
      ' beside it. There is a jacket hanging on a chair. ' +
      'You can exit ' +
      paintAction('to the living room', '_moveSouth') + '.';

    // drawer object
    var obj = new WorldObject('_drawer');
    with (obj)
      {
	name = 'drawer';

        // open drawer
	obj.Open = function(subj)
	  {
	    log.addText('Opened.');

    	    // move to dummy room Inside drawer
	    world.currentRoom = '_drawerRoom';
	  }

        // examine drawer
	obj.Examine = function(subj)
	  {
	    log.addText('The drawer is closed.');
	  }

	addFuncAction('Examine');
	addFuncAction('Open');
      }
    addObject(obj);

    // room actions
    addMoveAction('_moveSouth', '_livingRoom', 'GO SOUTH',
      'You move to the living room.');
    addBlankAction('_xDesk', 'EXAMINE DESK',
      'The desk is littered with all sorts of useless junk. ' +
      'There is a ' +  paintObject('_drawer') + ' on the front.');
    addBlankAction('_xChair', 'EXAMINE CHAIR',
      'The wooden chair is old and creaky.');
  }
world.addRoom(room);


// dummy room - drawer container
var room = new Room('_drawerRoom');
with (room)
  {
    name = 'Drawer contents';

    // paper object
    var obj2 = new WorldObject('_paper');
    with (obj2)
      {
	name = 'a piece of paper';

    	addBlankAction('Examine', 'The writing says "419".');
	setIsStatic(false);
      }
    addObject(obj2);

    // lighter
    var obj2 = new WorldObject('_lighter');
    with (obj2)
      {
        name = 'lighter';
        addBlankAction('Examine', 'It is in working condition.');
        setIsStatic(false);

        // using this with other objects
	// burn burnables
        obj2.UseWith = function(subj)
	  {
	    if (subj.stringID == '_handkerchief' ||
	        subj.stringID == '_paper')
	      {
	        log.addAction('BURN ' + subj.name.toUpperCase() + ' WITH ' +
		  this.name.toUpperCase());
    	        log.addText("You burn " + subj.name + " to ashes.");
		
		subj.destroy();

		return 1;
	      }

//            window.alert(this.name + ' on ' + subj.name);
	  }
      }
    addObject(obj2);

    // update room description
    room.update = function()
      {
      
        var cnt = 0;
        s = 'Inside you see ';
	for (i in this.objects)
          {
	    s += this.objects[i].paint() + ', ';
            cnt++;
	  }

        if (!cnt)
	  s += 'nothing.';
        else s = s.slice(0, -2) + '.';

	s += '<br><br>' + paintAction('Close drawer', '_closeDrawer') + '.';

        description = s;
      }

    room.update();

    addMoveAction('_closeDrawer', '_cabinet', 'CLOSE DRAWER',
      'You close the drawer.');
  }
world.addRoom(room);



// living room declaration
var room = new Room('_livingRoom');
with (room)
  {
    name = 'Living room';
    description =
      'You are in your living room. ' +
      'You can go to ' +
      paintAction('your cabinet', '_moveNorth') +
      ' or ' + paintAction('exit', '_exit') + ' your apartment.';

    // room actions
    addMoveAction('_moveNorth', '_cabinet', 'GO NORTH');
    addBlankAction('_exit', 'GO OUTSIDE',
      'The door to outside is closed.');
  }
world.addRoom(room);
