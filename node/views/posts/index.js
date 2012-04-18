charlotte.define('http://charlottedemo.com/posts/index', 
  ['posts/link_handlers'], function(linkHandlers) {
  return function(callback) {
    var self = this,
        container = self.container;
    
    if (container) {

      activateMenu(self, '#nav-bar .button.left');

      linkHandlers.new(self);
      linkHandlers.show(self);
      
      $('#refresh-button', container).click(function() {
        browser.request({
          url: '/',
          data: { part: 'posts'},
          container: $('#posts-container', container)[0],
        }, function(err, bundle, html, triggerReady) {
          hideLoadingOverlay(container);
          if (callback) callback(err);
        });
      });
      
    }
    
    new iScroll($('#body-frame', container)[0]);
        
    callback();
  }
});
