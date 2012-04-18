charlotte.define('http://charlottedemo.com/users/index', 
  ['users/link_handlers'], function(linkHandlers) {
  
  return function(callback) {
    var self = this,
        container = self.container;
    
    if (container) {
      activateMenu(self, '#nav-bar .button.left');
      linkHandlers.show(self);
    }
    callback();
  }
});
