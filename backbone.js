var queue = $({});
jQuery.each(Application.Views, function(class_name, Constructor) {
  if (typeof blacklist !== 'undefined' && blacklist.indexOf(class_name) !== -1) {
    console.log('Skipping blacklisted', class_name);
  }
  else if (Application.Views.Window.prototype.isPrototypeOf(Constructor.prototype)) {
    queue.queue('windows', function(next) {
      try {
        console.log('Trying ', class_name);
        var opts = (typeof constructor_recipes !== 'undefined') ? constructor_recipes[class_name] || {} : {};
        if (typeof opts === 'function') {
          opts = opts();
        }
        var win = new Constructor(opts);
        win.render();
        win.on('close', function() {
          next();
        });
      } catch (err) {
        console.log('failed to open window', class_name, err);
        next();
      }
    });
  }
});
queue.dequeue('windows');
