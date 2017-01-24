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


// get width of window

function getWindowWidth()
{
  if (navigator.appName == "Netscape" ||
      navigator.appName.indexOf("Opera") != -1)
   return window.innerWidth;

  else if (navigator.appName.indexOf("Microsoft") != -1)
   return document.body.offsetWidth;
}


// get height of window

function getWindowHeight()
{
  if (navigator.appName == "Netscape" ||
      navigator.appName.indexOf("Opera") != -1)
    return window.innerHeight;

  else if (navigator.appName.indexOf("Microsoft") != -1)
   return document.body.offsetHeight;
}


// get window scroller position

function getWindowPositionX()
{
  if (window.pageXOffset != null)
    return window.pageXOffset;
  else return document.body.scrollLeft;
}


// get window scroller position

function getWindowPositionY()
{
  if (window.pageYOffset != null)
    return window.pageYOffset;
  else return document.body.scrollTop;
}
