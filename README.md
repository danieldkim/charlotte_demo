# Introduction

This is a demo app. Please refer to the [charlotte][] documentation for the
full details on project setup and the charlotte APIs.

# The Web App

You can run the app from the `charlotte_demo/node` directory like so:

    $ export NODE_PATH=.:./node_modules:$NODE_PATH
    $ NODE_ENV=development NODE_PATH=$NODE_PATH:. node app.js
    Listening on port 3000.
  
Add these lines this to your /etc/hosts file:

    127.0.0.1   local.charlottedemo.com
    127.0.0.1   local-assets.charlottedemo.com

And then open up http://local.charlottedemo.com:3000/ in your web browser and
click around. Notice that it takes a couple of seconds for the home page to
load due to the artificial delay we coded into our Express route for the home
page. Go to http://local.charlottedemo.com:3000/?viewOnly=true and notice that
it loads instantly but with no data.
 
# PhoneGap Simulation File

So we have a functioning web app. Let's take a look at how we enhanced it for
native app distribution. But before we go native, let's look the static
`_index.html` file we created to simulate the PhoneGap experience. This is
pretty much the static html version of the outer layout jade template with a
couple of key differences:

* include `boot.js` which contains code to boot our app using charlotte in
html bundle mode.

* call `bootHtmlBundleFlow()` which is defined in `boot.js` on body load.

The file is basically the same as the index.html file we use in our
PhoneGap-based native application, minus the elements specific to the PhoneGap
and native environment. It allows us to simulate in a desktop browser our app
running on PhoneGap, sans the device API's. Since a significant portion of our
app functionality will not rely on the device API's it's worth creating this
file so that we can develop and debug using the tools available in desktop
browsers. To load it, just go to
[http://local.charlottedemo.com:3000/_index.html](http://local.charlottedemo.com:3000/_index.html)
in Chrome or Safari.

# The Native App

# The Tab Menu

# Navigational Adjustments for Web vs. Native 

There are certain places where we do things conditionally based on whether a
`requestId` is present, which we use as an indicator of whether we are running
in normal mode or in html bundle mode. To wit, in `views/posts/show.jade` we
do this:

    - if (requestId)
      - navBar.set({showCenterTabMenuLink: true})
      - navBar.get().buttons = {left: {text: "Back"}}
    - else 
      - navBar.set({buttons: {left: {href: "/tab_menu", text: "CD"}}});
  

There is no need to display the back button when running in a desktop browser
in normal mode as the user can use the browser's back button to go back.
Instead, we show a link to the tab menu, in it's place. When running in html
bundle mode, we show a link in the center of the tab bar to access the menu

It is up to your discretion how you implement conditional presentation logic
for normal vs. html bundle mode. There's no reason we *can't* show a back
button all the time, we just *shouldn't*. We'd also have to do extra work to
make sure the href gets set with the proper value.

# Form Submissions and Flash Messages

# Other Things to Point Out

Most of the the other code is self-explanatory, but some other observations
to note:

* all of our express helpers will be used both by node and by the charlotte
  browser when executed client-side in a native app. thus, we put them in
  `shared_helpers.js` and create a symlink to it in the public directory to
  make it accessible for download.

* because there is no longer a separation between private templates and public
  JavaScript and CSS code -- all view source is now public -- it opens up new
  organizational possibilities for your source tree. in our demo app we choose
  to group related templates, JS, and CSS together based on common
  functionality.

* the `charlotte.util.propertyHelper()` method can be used to create request
  scope properties that can be set and accessed from templates. this allows a
  template used to render the body of a response to set a property used by the
  layout body that includes it, i.e. where the cancel link should point to in
  the modal form layout body.

* in a couple of our routes we render a skeleton response on `viewOnly`
  requests, otherwise we create some artificial latency using `setTimeout` and
  then render the response with data. this is to demonstrate how
  view-only-first requests work with the charlotte browser.

* in the `new.jade` template for posts, we see the use of the `NODE_ENV`
  helper provided by charlotte. this tells us what node environment we're
  running in. here we're using it to only show the file input if we're in
  development mode, so that we can use a desktop browser to test the file
  upload. otherwise, we wouldn't want to show the file input in production as
  file upload is not enabled in mobile safari. for the native app path we
  display a button that will invoke the native photo picker through PhoneGap,
  which we'll discuss later.



[charlotte]: https://github.com/danieldkim/charlotte  "Charlotte"

