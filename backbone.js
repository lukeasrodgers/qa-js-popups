var queue = $({});
jQuery.each(Application.Views, function(k, v) {
  if (Application.Views.Window.prototype.isPrototypeOf(v.prototype)) {
    queue.queue('windows', function(next) {
      try {
        var win = new v();
        win.render();
        win.on('close', function() {
          next();
        });
      } catch (err) {
        console.log('failed to open window', err);
        next();
      }
    });
  }
});
queue.dequeue('windows');
