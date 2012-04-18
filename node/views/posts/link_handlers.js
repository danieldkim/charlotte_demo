charlotte.define('http://charlottedemo.com/posts/link_handlers', function() {
  return {
    new: function(tab) {
      var tabContainer = tab.container,
          transitioner = charlotte.pagetransitions.createTransitioner({
             container: tabContainer, 
             duration: .3
           });
           
      $(tab.contentContainer, tabContainer).on('click', ' a[href*="/posts/new"]', function(e) {
        e.preventDefault();
        tab.load({
          url: this.href,
          onLoad: {
            transition: function(contentCtr, contentStageCtr, callback) {
              $('#nav-bar', tabContainer).css("z-index", "auto");
              transitioner.slideOver(contentCtr, contentStageCtr, { from: "bottom"}, callback);
            }
          },
          onBack: {
            transition: function(contentCtr, contentStageCtr, callback) {
              transitioner.slideOut(contentCtr, contentStageCtr, { to: "bottom" }, callback);
            },
            callback: function(err, options) {
              if (options && options.shouldRefresh) {
                refresh();
              }
            }
          }
        });      
      });
      
    },
        
    show: function(tab) {
      var tabContainer = tab.container,
          transitioner = charlotte.pagetransitions.createTransitioner({
             container: tabContainer, 
             duration: .3
           });
      $(tab.contentContainer, tabContainer).on("click", 'a.post.show', function(e) {
        e.preventDefault();
        tab.load({
          url: this.href,
          onViewLoad: {
            transition: function(contentCtr, contentStageCtr, callback) {
              transitioner.pushIn(contentCtr, contentStageCtr, {from: "right"}, callback);
            }            
          },
          onBack: {
            transition: function(contentCtr, contentStageCtr, callback) {
              transitioner.pushIn(contentCtr, contentStageCtr, { from: "left"}, callback);
            }
          }
        });
        return false;
      });
    }
  };
});