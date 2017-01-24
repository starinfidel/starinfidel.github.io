// Log class - used for storing, manipulating and displaying game log

function Log(introText)
{
  this.contents = introText;
  this.lastAction = '';


// repaint log
  Log.prototype.repaint = function()
    {
      var element = document.getElementById('logHTML');
      element.innerHTML = this.contents;

      element.scrollTop = 10000;
    }


// repaint last action
  Log.prototype.repaintLastAction = function()
    {
      var element = document.getElementById('lastActionHTML');
      element.innerHTML = this.lastAction;
    }


// add entry to log
  Log.prototype.add = function(msg)
    {
      this.contents += msg + '<br>';
      this.repaint();
      this.repaintLastAction();
    }


// add action entry to log
  Log.prototype.addAction = function(action)
    {
      this.lastAction = '> ' + action + '<br>';
      this.add('> ' + action);
    }


// add text entry to log
  Log.prototype.addText = function(msg)
    {
      // remove object links
      var msgLog = msg.replace(/class=link/gi, '');
      msgLog = msgLog.replace(/onclick/gi, 'on1click');
//      window.alert(msgLog);

      this.lastAction += msg + '<br>';
      this.add(msgLog + '<br>');
//      window.alert(this.lastAction);
    }


// clears log contents
  Log.prototype.clear = function(msg)
    {
      this.contents = '';
      this.repaint();
    }


// set last action
  Log.prototype.setAction = function(action, text)
    {
      this.lastAction = '> ' + action + '<br>' +
        text + '<br>';
      this.repaint();
    }
}
