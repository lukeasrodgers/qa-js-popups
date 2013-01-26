# Take the pain out of QAing js popup windows

QAing complex web apps can be tedious and error-prone. You have to
remember all the UI nooks and crannies, even the ones that are rarely
seen by users and often only seen under special, difficult to remember
and recreate circumstances.

One particularly annoying instance of this general problem is presented
by javascript popup windows. Fortunately, if we can make a couple
assumptions that will hold true for the majority of web apps, this
process can be substantially simplified, and the risk of missing obscure
corners of your UI can be largely mitigated.

Provided are two small scripts for use with Backbone and ExtJs web apps.
You will likely have to modify them to work with your particular
codebase.

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

They iterate through all view constructors accessible from
`Application.Views`, use `isPrototypeOf` to check whether they inherit
from whatever base window class you're using, and if they do, they
attempt to instantiate the window and show/render it. 

If this fails, an error message will be displayed, and we proceed to the
next window.

If it succeeds, you can have a look at the window, verify everything is
okay, then close it, at which point (assuming the listeners are set up
correctly), the process will continue.

## Constructor recipes

For a majority of your cases, this simplified approach will probably
just work. 

However:

- if any of your windows require parameters be passed to their
  constructor
- if any of your windows require certain global state that is not the
  case

the scripts can take advantage of what I've called "constructor recipes"
that can both specify parameters to be passed to the constructor, and
also establish whatever global state is necessary. 

Constructor recipes can either just be an object with whatever
parameters you need passed to the constructor, or they can be function
that can establish state and/or return the required params object.

Example:

```
var constructor_recipes = {
  AccountWindow: {
    user_id: 999
  },
  SpecialAdminWindow: function() {
    window.global_params.user_type = 'admin';
    return {some_other_param: true};
    return {};
  }
};
```

## What you'll probably need to tweak to work with your codebase

- namespacing 
- base window class
- method to show/render the window
- listeners fired when the windows is closed/destroyed

## How to use it

1. Make whatever modifications are necessary
2. (Optional) if you need to use constructor recipes, write them, paste
   into js dev console
3. Paste the script into js console

## TODO

Allow windows to be created using multiple constructor recipes to cover
different states.
