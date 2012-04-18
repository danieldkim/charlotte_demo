charlotte.define('http://charlottedemo.com/posts/new', function() {
  return function(callback) {
    var self = this,
        container = self.container,
        fileUri,
        transitioner;

    if (container) {
      transitioner = charlotte.pagetransitions.createTransitioner({
          container: container, 
          duration: .3
        });  
              
      $(self.contentContainer, container).on('click', '#cancel', function(e) {
        e.preventDefault();
        self.back();
      });
    
      $(self.contentContainer, container).on('click', '#done', function(e) {      
        e.preventDefault();

        var form = $('#modal-form', container)[0],
            fileUri = $('input[name=fileUri]', container).val();
            
        if (charlotte.inNativeApp && fileUri) {
          
          var uploadOptions = new FileUploadOptions();
          uploadOptions.fileKey = "image";
          uploadOptions.fileName = fileUri.substr(fileUri.lastIndexOf('/')+1);
          // uploadOptions.mimeType = "image/jpeg";
      
          var params = new Object();
          $('input,textarea', form).each(function() { 
            params[this.name] = this.value;
          });
          uploadOptions.params = params;
          uploadOptions.fileUri = fileUri;

          self.load({
            url: form.action,
            type: "upload",
            uploadOptions: uploadOptions
          });
        
        } else {
          submitForm(self, form);
        }
        
      });
    
      $(self.contentContainer, container).on('click', '#add-photo', function(e) {
        e.preventDefault();
        navigator.camera.getPicture(
          function(uri) {
            $('input[name=fileUri]', container).val(uri);
          }, 
          function(message) { alert(message); }, 
          { 
            quality: 50, 
            destinationType: navigator.camera.DestinationType.FILE_URI,
            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true
          });      
      });
    }
    
    callback();
    
  };
});
