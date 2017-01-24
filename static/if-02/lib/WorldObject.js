
function WorldObject(stringID)
{
  this.type = '_object';
  this.stringID = stringID;
  this.name = 'unset obj name';
  this.description = 'unset description';
  this.parent = null;

  // list of available actions on this object
  this.actions = new Object();
  
  // list of objects inside this object
  this.objects = new Object();

  // object is static? (cannot be picked up)
  this.isStatic = true;

  world.addObject(this);

// adds a blank action returning a string
  WorldObject.prototype.addBlankAction =
      function(actionName, description)
    {
      // creating action object with given parameters
      var action = new Object();
      action.type = '_blank';
      action.description = description;

      this.actions[actionName] = action;
    }


// adds action calling an object method
  WorldObject.prototype.addFuncAction = function(actionName)
    {
      // creating action object with given parameters
      var action = new Object();
      action.type = '_func';

      this.actions[actionName] = action;
    }


// adds an object to this object (container)
  WorldObject.prototype.addObject = function(obj)
    {
      this.objects[obj.stringID] = obj;
      obj.parent = this;
    }


// removes action from a list
  WorldObject.prototype.removeAction = function(actionName)
    {
      delete this.actions[actionName];
    }


// returns object link text
  WorldObject.prototype.paint = function()
    {
      // count the number of available actions on an object
      var cnt = 0;
      var defaultAction;
      for (var i in this.actions)
        {
	  defaultAction = i;
          cnt++;
	}

      // no actions available - highlight as a bug
      if (cnt == 0)
        return '!' + this.name + '!';

      // there's only one action available
      // dynamic objects always can be used with other objects
      else if (cnt == 1 && this.isStatic)
        return '<span class=link onclick="world.action(this, \'object\', \'' +
          this.stringID + '\', \'' + defaultAction + '\')">' + 
	  this.name + '</span>';

      // show link to action menu
      else
        return '<span class=link onclick="world.action(this, \'object\', \'' +
          this.stringID + '\', \'_menu\')">' + this.name + '</span>';
    }


// make object static or dynamic
  WorldObject.prototype.setIsStatic = function(val)
    {
      this.isStatic = val;

      // object is static
      if (this.isStatic)
        delete this.actions['Get'];

      // object is dynamic
      else
        {
          // creating action object
          var action = new Object();
          action.type = '_func';

	  this.actions['Get'] = action;
	}
    }


// get this object into inventory
  WorldObject.prototype.Get = function()
    {
      // object is already in inventory
      if (this.parent == inventory)
        return;

      // remove object from it's parent
      delete this.parent.objects[this.stringID];

      // updates parent
      if (this.parent.update != null)
        this.parent.update();

      // add object to inventory
      inventory.add(this);

      // update log
      log.addText("You pick up " + this.name + ".");
    }


// destroy object
  WorldObject.prototype.destroy = function()
    {
      delete this.parent.objects[this.stringID];
      delete world.objects[this.stringID];

      // updates parent
      if (this.parent.update != null)
        this.parent.update();
    }
}
