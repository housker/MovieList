angular.module('movies')
.service('itemsService', function($http) {
  this.getAll = function(category, order, callback) {
    $http.get(`/items/${category}/${order}`)
    .then(function({data}) {
      if(callback) {
        callback(data);
      }
    })
    .catch(function(err) {
      console.log(err);
    });
  };
  this.signout = function(cb) {
    $http.get('/signout')
    .then(function() {
      cb();
    })
    .catch(function(err) {
      console.log(err);
    });
  };
  this.addOne = function(movie, callback) {
    $http({
      method: 'POST',
      url: '/items',
      data: JSON.stringify(movie)
    })
    .then(function (res) {
      callback(res.data);
    })
    .catch(function(err) {
      console.log(err);
    });
  };
  this.changeRating = function(title, rating, callback) {
    $http({
      method: 'POST',
      url: '/rating',
      data: {title: title, rating: rating}
    })
    .then(function (res) {
      callback(res.data[0]);
    })
    .catch(function(err) {
      console.log(err);
    });
  };
  this.remove = function(id, callback) {
    $http({
      method: 'POST',
      url: '/remove',
      data: {id: id}
    })
    .then(function (res) {
      callback(res);
    })
    .catch(function(err) {
      console.log(err);
    });
  };
});