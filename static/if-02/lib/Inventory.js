// Inventory class - player items management

function Inventory()
{
  this.type = '_inventory';

// objects list
  this.objects = new Object();
//  this.contents = introText;


  // paint inventory contents
  Inventory.prototype.paint = function()
    {
      var cnt = 0;
      var str = 'Your pack contains : ';
      for (i in this.objects)
        {
	  var obj = this.objects[i];
	  str += obj.paint() + ', ';
	  cnt++;
	}

      if (!cnt)
        str = 'Your pack contains nothing.';
      else str = str.slice(0, -2) + '.';

      // update log
      log.addAction("INVENTORY");
      log.addText(str);
    }


// add object to inventory
  Inventory.prototype.add = function(obj)
    {
      this.objects[obj.stringID] = obj;
      obj.parent = this;

      delete obj.actions['Get'];
    }
}
