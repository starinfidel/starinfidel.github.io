// floating menu class

function Menu(type, htmlObject, objName, obj, items)
{
//  this.contents = introText;

  // set up menu layer
  var element = document.getElementById('actionsMenuHTML');
  element.style.zIndex = 100;
  element.style.border = 'double white 4px';
  element.style.background = '#cccccc';


  var html = '';
  var numItems = 0;

  for (var i in items)
    {
      html +=
        '<span class=menuitem onclick="hideActionMenu(); world.action(this, \'object\', \'' +
	objName + '\', \'' + i + '\')">' + i + '</span><br>';
      numItems++;
    }

  // dynamic objects display inventory to act with
  if (!obj.isStatic)
    {
      var html2 = '<hr><span class=menuheader>Use with:</span><br>';
      var numItems2 = 2;
      var ok = 0;

      for (var i in inventory.objects)
        {
	  if (i == objName) continue;
	  ok = 1;
	
	  var mObj = inventory.objects[i];
	  html2 +=
            '<span class=menuitem onclick="hideActionMenu(); ' +
	    'world.action(this, \'object\', \'' +
    	    objName + '\', \'_object\', \'' + i + '\')">' +
	    mObj.name + '</span><br>';

          numItems2++;
	}

      if (ok)
        {
	  html += html2;
	  numItems += numItems2;
	}
    }

  element.innerHTML = html;

  element.style.width = 200;
  element.style.height = numItems * 25;
  element.style.top = getPositionY(htmlObject) + 25;
  element.style.left = getPositionX(htmlObject);

//  window.alert(getWindowPositionX() + ' ' + getWindowPositionY());
  if (parseInt(element.style.top) + parseInt(element.style.height) -
      getWindowPositionY() > getWindowHeight())
    element.style.top = getWindowHeight() - parseInt(element.style.height) +
      getWindowPositionY() - 20;

  if (parseInt(element.style.left) + parseInt(element.style.width) -
      getWindowPositionX() > getWindowWidth())
    element.style.left = getWindowWidth() - parseInt(element.style.width) +
      getWindowPositionX() - 20;

  element.style.visibility = 'visible';

  // register onclick event on body
  document.body.onclick = hideActionMenu;
  
  // hack: set click flag so that event handler won't hide menu right after
  // displaying it
  window.clickFlag = true;
}


// hide action menu

function hideActionMenu()
{
  // unset click flag
  if (window.clickFlag)
    {
      window.clickFlag = false;
      return;
    }

  var element = document.getElementById('actionsMenuHTML');
  element.style.visibility = 'hidden';

  return false;
}
