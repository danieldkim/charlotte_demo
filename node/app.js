var util = require('util'), 
    url = require('url'), 
    http = require('http'), 
    _ = require('underscore'), 
    async = require('async'), 
    express = require('express'), 
    app = express.createServer(), 
    logging = require('node-logging'), 
    sharedHelpers = require('shared_helpers'), 
    charlotte = require('charlotte');

function NotFound(msg){
  this.name = 'NotFound';
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
}

app.configure(function(){
  // charlotte.version = "1.0";
  app.use(logging.requestLogger);
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Origin', 'http://local.charlottedemo.com:3000');
    res.header('Access-Control-Allow-Credentials', true);
    next();
  });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "keyboard cat" }));
  charlotte.supportExpress(app, { 
    assetRootPath: "http://local-assets.charlottedemo.com:3000/"
  });
  app.use(app.router);
  app.set('view engine', 'jade');
  app.use(express.static(__dirname + '/views'));
  app.error(function(err, req, res, next){
    var status = 500;
    if (err instanceof NotFound) {
      status = 404;
    }
    res.render(status.toString(), {
      layoutBody: 'error_layout_body',
      status: status, 
      error: {
        message: err.toString(), 
        stack: err.stack
      },
      completeBundleProcess: true
    });
  });  
});

app.helpers(sharedHelpers.static);

app.dynamicHelpers(
  _.extend(sharedHelpers.dynamic, {
    _: function() { return _; },
  }));
  
var posts = [
];

var users = [
];

_.times(25, function(i) {
  users.push({
    id: i,
    name: "User " + i,
    rating: Math.random() * 100
  });
});

function compareByRating(a, b) { return b.rating - a.rating; };

users.sort(compareByRating);

_.times(100, function(i) {
  posts.push({
    id: i,
    user: users[i % 25],
    title: "Post " + i,
    body: "post " + i + " bla bla bla",
    rating: Math.random() * 100
  });
});

posts.sort(compareByRating);

var bypassViews = process.env.NODE_ENV == 'development' ? 
                    charlotte.bypassViews() : function(req, res, next) { next(); };

app.get('/', bypassViews, function(req, res) {
  var title = "Popular Posts",
      popPosts = [], timeout = 0;
      
  if (!req.viewOnly) {
    popPosts = posts.slice(0, 100);
    timeout = 2000;
  }
  
  setTimeout(function() {
    switch (req.param('part')) {
      case 'posts':
        res.render('posts/posts', {
          layoutBody: false,
          posts: popPosts,
        });
        break;
      default:
        res.render('posts/index', {
          title: title,
          posts: popPosts,
        })      
    };
  }, timeout);
  
})

app.get('/users', bypassViews, function(req, res){
  var title = "Popular Users",
      popUsers = [], timeout = 0;
      
  if (!req.viewOnly) {
    popUsers = users.slice(0, 5);
    timeout = 2000;
  }
  
  setTimeout(function() {
    res.render('users/index', {
      title: title,
      users: popUsers,
    })      
  }, timeout);
});

app.get('/users/:id', bypassViews, function(req, res){
  var user = _.find(users, function(u) { return u.id == req.param('id') });
  res.render('users/show', {
    title: user.name + " Profile",
    user: user,
    posts: _.select(posts, function(p) {return p.user == user;})
  });
});

app.get('/posts/new', bypassViews, function(req, res) {
  res.render('posts/new', {
    layoutBody: false,
    title: "Create Post", 
    from: req.referer,
    post: {}
  });  
});

app.get('/posts/:id', bypassViews, function(req, res){
  
  var locals = {
        title: "A Post",
      };
  if (!req.viewOnly) {
    locals.post = _.find(posts, function(p) { return p.id == req.param('id') });
    if (!locals.post) {
      throw new NotFound("Could not find post with id " + req.param('id'));
    }
  }    
  setTimeout(function() {
    res.render('posts/show', locals);
  }, req.viewOnly ? 0 : 1500);
});


app.post('/posts', bypassViews, function(req, res) {
  var from = req.param('from') || '/',
      errors = [],
      post = {};
  ['title', 'body'].forEach(function(name) {
    var v = req.param(name);
    if (!v) errors.push("Must enter a " + name);
    else post[name] = v;
  })
  if (errors.length > 0) {
    res.render('posts/new', {
      layoutBody: false,
      title: "Create Post", 
      from: from,
      post: post,
      errors: errors
    });
  } else {
    req.flash('info', "Post created.");
    res.redirect(from);
  }
});


app.get('/tab_menu', bypassViews, function(req, res) {
  res.render('tab_menu/show', {layoutBody: false});
});

app.listen(3000);
console.log("Listening on port 3000.");
