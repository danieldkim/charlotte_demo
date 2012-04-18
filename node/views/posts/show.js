charlotte.define("http://charlottedemo.com/posts/show", 
  [
    'posts/link_handlers',
    'users/link_handlers'
  ], function(postsLinkHandlers, usersLinkHandlers) {
  return function(callback) {
    var self = this,
        container = self.container;

    if (container) {

      activateMenu(self, '#nav-bar #tab-menu-button');
            
      $(self.contentContainer, container).on('click', '#nav-bar .button.left', function(e) {
        e.preventDefault();
        self.back();
      });
      
      postsLinkHandlers.new(self);
      usersLinkHandlers.show(self);
      
    }
    callback();
  };
});

