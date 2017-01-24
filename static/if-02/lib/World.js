// Main world class - game variables etc

function World()
{
// list of rooms in the world
  this.rooms = new Object();

// master list of all objects in the world, including inventory and
// insides of containers
  this.objects = new Object();

// stringID of room where player is now
  this.currentRoom = '';
//  this.description = 'unset description';

// add room to the world
  World.prototype.addRoom = function(room)
    {
      this.rooms[room.stringID] = room;
    }

// player action
  World.prototype.action = function(htmlObject, type, stringID, action,
      subjStringID)
    {
      // room actions
      if (type == 'room')
        {
	  var room = this.rooms[this.currentRoom];
	  var action = room.actions[stringID];

	  // player movement between rooms
	  if (action.type == '_playerMove')
	    {
	      this.currentRoom = action.destination;
	    }

	  // update log
	  log.addAction(action.logString);
	  if (action.description != null)
	    log.addText(action.description);
	}

      // object actions
      else if (type == 'object')
        {
	  var obj = world.objects[stringID];
	  if (obj == null)
	    window.alert('No such object [' + stringID + ']');

	  // show action menu
	  if (action == '_menu')
	    {
	      var menu = new Menu('', htmlObject, stringID, obj, obj.actions);

	      return;
	    }

	  // object on object action
	  else if (action == '_object')
	    {
	      var subj = world.objects[subjStringID];
	      if (subj == null)
		window.alert('No such object [' + subjStringID + ']');

	      var ok = 0;
	      if (obj.UseWith != null)
    	        ok = obj.UseWith(subj);

	      if (ok == 0 && subj.UseWith != null)
    	        ok = subj.UseWith(obj);

	      if (ok == 0)
	        {
	          log.addAction('USE ' + subj.name.toUpperCase() + ' ON ' +
		    obj.name.toUpperCase());
    	          log.addText("Nothing happens.");
		}

    	      // repaint world
	      this.repaint();

	      return;
	    }

	  var actionObj = obj.actions[action];

	  // update log
	  log.addAction(action.toUpperCase() + ' ' +
	    obj.name.toUpperCase());

	  // object method action
	  if (actionObj.type == '_func')
	    eval("obj." + action + "(obj)");
	
	  // update action description
	  else if (actionObj.description != null)
	    log.addText(actionObj.description);
	}

      // repaint world
      this.repaint();
    }


// repaint world
  World.prototype.repaint = function()
    {
      var element = document.getElementById('worldHTML');
      var room = this.rooms[this.currentRoom];

      element.innerHTML = '<b>' + room.name + '</b><br>' + room.description;
    }


// adds an object to a master list
  World.prototype.addObject = function(obj)
    {
      this.objects[obj.stringID] = obj;
    }
}
