charlotte.define('http://charlottedemo.com/users/link_handlers', function() {
  return {
    show: function(tab) {
      var tabContainer = tab.container,
          transitioner = charlotte.pagetransitions.createTransitioner({
             container: tabContainer, 
             duration: .3
           });
      $(tab.contentContainer, tabContainer).on('click', 'a.user.show', function(e) {
        e.preventDefault();
        tab.load({
          url: this.href, 
          onLoad: {
            transition: function(contentCtr, contentStageCtr, callback) {
              transitioner.zoomIn(contentCtr, contentStageCtr, null, callback);
            }
          },
          onBack: {
            transition: function(contentCtr, contentStageCtr, callback) {
              transitioner.slideOut(contentCtr, contentStageCtr, { to: "right" }, callback);              
            }
          }
        });
      });
    }
  };
});