// Basic room class - everything about a room ends up here

function Room(stringID)
{
  this.type = '_room';
  this.stringID = stringID;
  this.name = 'unset room name';
  this.description = 'unset description';

// list of available actions in this room
  this.actions = new Object();

// list of objects in this room
  this.objects = new Object();


// adds a player move action to a list of available actions
  Room.prototype.addMoveAction = function(actionName, destination, logString,
      description)
    {
      // creating action object with given parameters
      var action = new Object();
      action.type = '_playerMove';
      action.destination = destination;
      action.logString = logString;
      action.description = description;

      this.actions[actionName] = action;
    }


// adds a blank action returning a string
  Room.prototype.addBlankAction = function(actionName, logString, description)
    {
      // creating action object with given parameters
      var action = new Object();
      action.type = '_blank';
      action.logString = logString;
      action.description = description;

      this.actions[actionName] = action;
    }


// adds an object to this room
  Room.prototype.addObject = function(obj)
    {
      this.objects[obj.stringID] = obj;
      obj.parent = this;
    }


// returns action link
  Room.prototype.paintAction = function(text, actionName)
    {
      return '<span class=link onclick="world.action(this, \'room\', \'' +
        actionName + '\')">' + text + '</span>';
    }


// returns object link text
  Room.prototype.paintObject = function(objName)
    {
      var obj = this.objects[objName];
      if (obj != null)
        return obj.paint();
      else return 'NULL';
    }
}
