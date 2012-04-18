charlotte.define('http://charlottedemo.com/tab_menu/show', function() {
  var MENU_CONTAINER = "#tab-menu";
  return function() {
    var self = this,
        tab, 
        transitioner;
        
    if (self.currentTab) {
      tab = self.currentTab();
      transitioner = charlotte.pagetransitions.createTransitioner({
          duration: .3,
          takeover: false
        });
      transitioner.slideOver(tab.container, '#tab-menu', {from: "top"},
        function() {
          
          $(MENU_CONTAINER).on('click', '#back-button', function(e) {
            e.preventDefault();
            transitioner.slideOut('#tab-menu', tab.container, {to: "top"}, function() {
              charlotte.pagetransitions.clearAnimationProperties('#tab-menu', tab.container);
              $(MENU_CONTAINER).css('display', 'none');
            });
          });

          $(MENU_CONTAINER).on('click', '.menu-item', function(e) {
            e.preventDefault();
            var item = this,
                currentTab = self.currentTab(),
                tab = self.switchTab(this.id);
            if (tab.length() < 1) {
              tab.load({
                url: this.href,
                onCacheMiss: function(url, tab, afterViewLoad) {
                  console.log("Cache miss for " + url + ", afterViewLoad: " + afterViewLoad);
                  if (!afterViewLoad) {
                    showLoadingOverlay(MENU_CONTAINER);
                  }
                },
                onRequestEnd: function(settings, tab) {
                  hideLoadingOverlay(MENU_CONTAINER);
                },
                onViewLoad: {
                  callback: function(err, bundle, triggerReady) {
                    if (err) {
                      console.log("Could not load tab menu item: " + item.href);
                      self.switchTab(currentTab.name);
                      return;
                    }
                    $(currentTab.container).css('display', 'none');
                    transitioner.slideOut('#tab-menu', tab.container, {to: "top"}, function() {
                      charlotte.pagetransitions.clearAnimationProperties('#tab-menu', tab.container);
                      $(MENU_CONTAINER).css('display', 'none');
                      triggerReady();
                    });
                  }
                },
                onLoad: {
                  container: '#content',
                  callback: function(err, bundle, triggerReady) {
                    if (err) {
                      alert("Could not load " + self.href);
                      self.switchTab(currentTab.name);
                      return;
                    }
                    triggerReady();
                  }
                }
              });
            } else {              
              $(currentTab.container).css('display', 'none');                      
              transitioner.slideOut('#tab-menu', tab.container, {to: "top"}, function() {
                charlotte.pagetransitions.clearAnimationProperties('#tab-menu', tab.container);
                $(MENU_CONTAINER).css('display', 'none');
              });
            }
            
          });
 
        }); 
    }
  };
});

