Overview
========

See `atoll` repo for an overview of the full project.  This repo is just for the shared code between
the various entry-point modules that make up the atoll project ("atoll" client & server and
"atoll-electron" to start but there may also be others later).

Getting Started
===============

Once again- start with `atoll` repo for the main "Getting Started" info.  To get this repo set up
and building please follow the requirements and steps below.


Tools Used
----------

1. See `atoll` repo for Node & NPM versions to use.
2. See `atoll` repo for current version of VS Code that's recommended.
  - Make sure you install the recommended workspace extensions.

Steps after Cloning Repo
------------------------

1. `npm ci` to install locked down dependency tree.
2. `npm run build` to build this library for the first time.
3. `npm link` to ensure that this library is available for linking from the main repo.
4. `npm run watch` to build this library and wait for changes to rebuild automatically.
