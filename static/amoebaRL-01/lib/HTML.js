// misc HTML functions

// get X position of HTML object

function getPositionX(obj)
{
  var curleft = 0;
  if (document.getElementById || document.all)
    {
      while (obj.offsetParent)
        {
	  curleft += obj.offsetLeft
	  obj = obj.offsetParent;
	}
    }
  else if (document.layers)
    curleft += obj.x;

  return curleft;
}


// get Y position of HTML object

function getPositionY(obj)
{
  var curtop = 0;
  if (document.getElementById || document.all)
    {
      while (obj.offsetParent)
        {
 	  curtop += obj.offsetTop
 	  obj = obj.offsetParent;
        }
    }
  else if (document.layers)
    curtop += obj.y;

  return curtop;
}
