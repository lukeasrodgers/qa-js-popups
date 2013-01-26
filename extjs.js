var queue = $({});
jQuery.each(Application.Views, function(k, v) {
  if (Ext.Window.prototype.isPrototypeOf(v.prototype)) {
    queue.queue('windows', function(next) {
      try {
        var win = new v();
        win.show();
        win.on('destroy', function() {
          next();
        });
        win.on('hide', function() {
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
