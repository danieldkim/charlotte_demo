function activateMenu(tab, buttonSelector) {
  $(tab.contentContainer, tab.container).on("click", buttonSelector, function(e) {
    e.preventDefault();
    tab.browser.request({
      url: '/tab_menu',
      container: '#tab-menu #content'
    }, function(err, bundle, html, triggerReady) {
      hideLoadingOverlay(tab.container);
      if (!err) triggerReady();
    });
  });
}

function submitForm(tab, form) {
  tab.load({
    type: 'POST', 
    url: form.action,
    data: _.reduce($('input,textarea', form), function(dataMap, input) { 
            dataMap[input.name] = input.value;
            return dataMap;
          }, {})
  });
}


function showLoadingOverlay(container) {
  if ($('#loading-overlay', container).length < 1) {
    $(container).append('<div id="loading-overlay">Loading ...</div>')
  }
  $('#loading-overlay', container).show();
}

function hideLoadingOverlay(container) {
  $('#loading-overlay', container).hide();  
}

function refresh() {
  console.log("refreshing!")
  browser.currentTab().reload();
}