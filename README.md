# Take the pain out of QAing js popup windows

QAing complex web apps can be tedious and error-prone. You have to
remember all the UI nooks and crannies, even the ones that are rarely
seen by users and often only seen under special, difficult to remember
and recreate circumstances. JavaScript tests with Qunit or Jasmine help,
but it is somewhere between hard and impossible to write tests that
verify "look and feel."

One particularly annoying instance of this general problem is presented
by javascript popup windows. Fortunately, if we can make a couple
assumptions that will hold true for the majority of web apps, this
process can be substantially simplified, and the risk of missing obscure
corners of your UI can be largely mitigated.

Provided are two small scripts for use with Backbone and ExtJs web apps.
You will likely have to modify them to work with your particular
codebase.

## Dependencies

- modern browser
- currently uses jQuery

## How it works

These scripts make a few assumptions: 

1. your windows are created via constructors that are
2. accessible from the global namespace, and are
3. namespaced something like this: `Application.Views...`
4. your windows inherit from a common class. For ExtJs this will be
  `Ext.Window`. For Backbone this will be a class of your own creation,
e.g. `Application.Views.BaseWindow`, etc.
5. they have standard API for opening/showing them, and standard
  listeners for when they are closed/destroyed/hidden.

The scripts iterate through all view constructors accessible from
`Application.Views`, use `isPrototypeOf` to check whether the view in
question inherits from whatever base window class you're using, and if
it does, we attempt to instantiate the window and show/render it. 

If this fails, an error message will be displayed, and we proceed to the
next window.

If it succeeds, you can have a look at the window, verify everything is
okay, then close it, at which point (assuming the listeners are set up
correctly), the process will continue.

## How to use it

1. Make any necessary modifications to the script ([see below](https://github.com/lukeasrodgers/qa-js-popups#what-youll-probably-need-to-tweak-in-these-scripts))
2. (Optional) if you need to use constructor recipes, write them, paste
   into js dev console
3. (Optional) if you want to ignore some windows, add them to the
   blacklist.
4. Paste the script into js console
5. QA to your heart's content

### Advanced usage: Constructor recipes

For a majority of your cases, this simplified approach will probably
just work. 

However:

- if any of your windows require parameters be passed to their
  constructor function
- if any of your windows require certain global state that cannot
  already be assumed to be the case

the scripts can take advantage of what I've called "constructor recipes"
that can both specify parameters to be passed to the constructor, and
also establish whatever global state is necessary. 

Constructor recipes can either just be an object with whatever
parameters you need passed to the constructor, or they can be functions
that can establish state and/or return the required params object.

The key for each recipe should correspond to the name of the window as
it occurs in your global namesapce.

So, assuming Application.Views.AccountWindow, and
Application.Views.SpecialAdminWindow: 

```
var constructor_recipes = {
  AccountWindow: {
    user_id: 999
  },
  SpecialAdminWindow: function() {
    window.global_params.user_type = 'admin';
    return {some_other_param: true};
  }
};
```

### Advanced usage: ignoring some windows

There may be some windows in your app you want to ignore. Just add the
name of the view as it appears in the global namespace to a global
variable `blacklist` before running the script: 

```
var blacklist = ['IgnoreThisWindow', 'AndThisOne'];
```

## What you'll probably need to tweak in these scripts

- namespacing 
- base window class
- method to show/render the window
- listeners fired when the windows is closed/destroyed

If using ExtJs, the only thing you should have to change is your
application namespacing pattern.

If using Backbone you will likely have to make some more substantial
changes. If using Backbone Marionette, listening to the `close` event,
as this code does, should work just fine. 

## TODO

- Allow windows to be created using multiple constructor recipes to
  cover different states of the application
- Constructor recipes should provide something like setup/teardown
