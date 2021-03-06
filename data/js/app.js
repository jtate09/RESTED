'use strict';

// Register app
var app = angular.module('RestedApp', ['dndLists']);

// Support data-urls
app.config(['$compileProvider', function ($compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|local|data):/);
}]);

// Prevent double-bootstrap by storing
// bootstrap status.
var isBootstrapped = false;

// We have to delay the entire
// bootstrapping of the app until we
// know of the client supports
// indexeddb because of how firefox
// handles private mode.
function bootstrapApp(doesSupportIDB) {
  if (!isBootstrapped) {
    window.IDB_SUPPORTED = doesSupportIDB;
    var app = angular.element('#app');
    angular.bootstrap(app, ['RestedApp']);

    if (doesSupportIDB) {
      (window.indexedDB || window.mozIndexedDB).deleteDatabase('_RESTED_TEST_IDB_SUPPORT');
    }
  }
}

function checkIDBSupportAndCallManualBootstrap() {
  try {
    var indexedDB = window.indexedDB || window.mozIndexedDB;

    // In Firefox private mode, this will throw
    // an error because IndexedDB is only read,
    // not write.
    var test = indexedDB.open('_RESTED_TEST_IDB_SUPPORT', 1);

    // Check if we successfully created test DB
    test.onerror = function() {
      bootstrapApp(false);
    }
    test.onsuccess = function() {
      bootstrapApp(true);
    }
  } catch(e) {
    bootstrapApp(false);
  }
};

// Done setting up, check for support and bootstrap
checkIDBSupportAndCallManualBootstrap();

