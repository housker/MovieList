angular.module('movies', ['ngSanitize', 'ui.bootstrap', 'ui.bootstrap.popover', 'ui.bootstrap.tooltip'])
  .config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'https://www.youtube.com/**'
    ]);
  })