var browser;
    
function bootHtmlBundleFlow(options, callback) {
  var semanticVersion,
      VersionMismatchError;

  charlotte.baseUrl = 'http://charlottedemo.com/';
  charlotte.rootUrl = options.rootUrl;
  charlotte.assetRootUrl = options.assetRootUrl;
  charlotte.htmlBundleMode = true;
  charlotte.tempCacheSize = 1000000;

  if (!localStorage.getItem("version") ) {
    localStorage.setItem("version", "1.0");
  }
  
  async.series([
      
    function(next) {
      if (charlotte.inNativeApp) {
        charlotte.clearFileCache({
          versionExceptions: [localStorage.getItem("version")]
        }, next);
      } else{
        next();
      }
    },
    
    function(next) {
      charlotte.assets({ 
        javascripts: {
          urls: [
            "/lib/underscore", "/lib/async", "/lib/zepto", "/lib/jade",
            "/lib/charlotte/shared", "/lib/charlotte/charlotte", 
            "/lib/charlotte/util",  "/lib/shared_helpers", "/lib/common/common"
          ]
        }
      }, next);
    },
    
    function(next) {
      
      var viewOnlyUrlMatchers = {};
      
      console.log("Successfully added document assets.");
            
      $('#nav-bar').live('swipe', function() {
        charlotte.clearRamCache();
      });
            
      semanticVersion = charlotte.util.semanticVersion;
      VersionMismatchError = charlotte.util.VersionMismatchError;
                        
      _.each(['users', 'posts'], function(resourceType) {
        viewOnlyUrlMatchers[resourceType+'Show'] = function(url, parsedUrl) {
          var m = parsedUrl.pathname.match(resourceType + "/(\\w+)$");
          return m && !_.include(['new', 'edit'], m[1]);
        };
      });
      viewOnlyUrlMatchers['home'] = function(url, parsedUrl) {
        return parsedUrl.pathname == '/';
      };
      
      
      browser = charlotte.createBrowser({
        helpers: sharedHelpers.static,
        dynamicHelpers: sharedHelpers.dynamic,
        timeout: 10000,
        cachedBundles: {
          viewOnlyUrlMatchers: viewOnlyUrlMatchers,
          urlMatchers: [ /tab_menu$/, /new$/, /new\?/],
          tempUrlMatchers: [
            function(url, parsedUrl) {
              var m = parsedUrl.pathname.match("footmarks/(\\w+)$");
              return m && !_.include(['new', 'edit'], m[1]);
            }
          ]
        },
        errorHandlers: {
          global: function(err, tab) {
            console.log("Error in charlotte browser: " + err.message);
            if (err.stack) console.log("Stack: " + err.stack);
          },
          
          default: function(err, tab, next) {
            if (err instanceof charlotte.ServerUnavailableError) {
              alert("Server is unavailable");
            } else if (err instanceof charlotte.ResourceNotFoundError) {
              alert("Couldn't find that. Maybe it got deleted?");
            } else if (err instanceof charlotte.AssetLoadError) {
              alert(err.message);
            } else if (err instanceof VersionMismatchError) {
              if (!localVersion) return;
              var localVersion = err.localVersion, 
                  remoteVersion = err.remoteVersion
              if (localVersion.compareTo(remoteVersion) > 0) { // local is greater
                // app store update downloaded before new server version 
                // deployed. notify user to try again later.
                alert("New version of app not live yet.  Please try again later.");
              } else { 
                if (localVersion.major != remoteVersion.major) {
                  // major version update, need app store update
                  alert("Please update to latest version available in the app store.");
                } else if (localVersion.minor != remoteVersion.minor) {
                  // minor version update, update local version and restart
                  localStorage.setItem("version", remoteVersion);
                  alert("Restart required to update.  Restarting now ...")
                  document.location = "index.html";
                }
              }
            } 
            next();
          }        
        },        
        onCacheMiss: function(url, tab, afterViewLoad) {
          console.log("Cache miss for " + url + ", afterViewLoad: " + afterViewLoad);
          if (!afterViewLoad) showLoadingOverlay(browser.currentTab().container);
        },
        onRequestEnd: function(settings, tab) {
          if (tab) {
            hideLoadingOverlay(tab.container);
          }
        },
        onVersionChange: function(localVersion, remoteVersion, callback) {
          var localSemVer = localVersion ? semanticVersion(localVersion) : null,
              remoteSemVer = semanticVersion(remoteVersion);
          console.log("Version changed! local: " + localVersion + ", remote: " + remoteVersion);
          // if new version is not just a patch, send VersionMismatchError
          callback(localSemVer && remoteSemVer.isPatchOf(localSemVer) ? 
                     null : 
                     new VersionMismatchError(localSemVer, remoteSemVer));
        }
      });
      
      var bootComplete = false;
      _.each(['home', 'users', 'foo', 'bar'], function(name) {
        browser.createTab({
          name: name, 
          container: '#' + name + '-tab'
        });
      });
      var homeTab = browser.switchTab('home');
      homeTab.load({
        url: '/',
        onViewLoad: {},
        onLoad: {
          callback: function(err, bundle, triggerReady) {
            if (!err) {
              triggerReady(function(err) {
                if (!bootComplete) next(err);
                bootComplete = true;
              });
            }
          }
        },
        onReturn: function() {
          console.log("Returned home.");
        }
      });
    }
  ], function(err) {
    console.log("Boot finished.");
    if (err) {
      console.log("Error booting: " + err.message);
      if (err.stack) console.log(err.stack);
    }
    if (callback) callback(err);
  });

}
