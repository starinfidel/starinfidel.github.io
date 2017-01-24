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


// set a cookie

function setCookie(name, value, expire)
{
  document.cookie = name + "=" + escape(value) +
    ((expire == null) ? "" : ("; expires=" + expire.toGMTString()));
}


// get a cookie

function getCookie(Name)
{
  var search = Name + "=";

  if (document.cookie.length == 0) return null;

  var offset = document.cookie.indexOf(search);

  if (offset == -1) return null;

  offset += search.length;

  // set index of beginning of value
  end = document.cookie.indexOf(";", offset);

  // set index of end of cookie value
  if (end == -1)
    end = document.cookie.length;

  return unescape(document.cookie.substring(offset, end))
}
											     