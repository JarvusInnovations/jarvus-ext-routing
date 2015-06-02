jarvus-ext-routing
==================

Touch-style controller-based routing for ExtJS with some convenient enhancements to Ext.util.History

## Supported frameworks

- [ext-4.2.2.1144](https://github.com/JarvusInnovations/jarvus-ext-routing/tree/ext-4.2.2.1144)
- [ext-5.1.1.451](https://github.com/JarvusInnovations/jarvus-ext-routing/tree/ext-5.1.1.451)

## Using packages
This repository has separate branches for each framework+version, with the master branch serving as a template for new branches.

### Step 1) Clone a branch into your <kbd>packages</kbd> folder
Open a terminal in your app's or workspace's <kbd>packages</kbd> directory and clone the branch for the framework+version you're using:

  `git clone -b ext-5.1.1.451 https://github.com/JarvusInnovations/jarvus-ext-routing.git`

### Step 2) Add package to app's requirements
Open the <kbd>app.json</kbd> file in your app's directory and add `"jarvus-hotfixes"` to the array following the existing `"requires"` attribute:

```json
    "requires": [
        "jarvus-ext-routing"
    ],
```

### Step 3) Refresh bootstrap.js
In order for the package to be automatically loaded by your app, the <kbd>bootstrap.js</kbd> file generated by Sencha CMD must be updated after adding a new package to the app's `"requires"` config. Run this from your app's directory:

  `sencha app refresh`

