charlotte.define("http://charlottedemo.com/users/show", 
  ['posts/link_handlers'], function(postsLinkHandlers) {
  
  return function(callback) {
    var self = this,
        container = self.container;

    if (container) {
      
      activateMenu(self, '#nav-bar #tab-menu-button');
      
      $(self.contentContainer, container).on('click', '#nav-bar .button.left', function(e) {
        e.preventDefault();
        self.back();
      });
      
      postsLinkHandlers.show(self);      
    }
    
    callback();
  }
});
