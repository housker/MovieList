angular.module('movies')
.component('search', {
  bindings: {
    searchResults: '<',
    addMovie: '=',
    addition: '=',
    rate: '='
  },
  templateUrl: '/templates/search.html'
});