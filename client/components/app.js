angular.module('movies')
.controller('AppCtrl', function(itemsService, $scope, $sce, $uibModal) {
  itemsService.getAll('title', 'ASC', (data) => {
    console.log('scope: ', $scope)
    data.forEach(movie => $scope.rate = movie.rating)
    $scope.active = 0;
    $scope.allItems = data;
    $scope.allToWatch = data.filter(movie => !movie.watched);
    $scope.allWatched = data.filter(movie => movie.watched);
  });
  $scope.$on("done", function(event, data) {
    itemsService.getAll('title', 'ASC', (data) => {
      data.forEach(movie => $scope.rate = movie.rating)
      $scope.active = 0;
      $scope.allItems = data;
      $scope.allToWatch = data.filter(movie => !movie.watched);
      $scope.allWatched = data.filter(movie => movie.watched);
    });
  });
  this.open = function (template, $scope, itemsService) {
    var ubiModalInstance = $uibModal.open({
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: `../templates/${template}.html`,
      controller: function($uibModalInstance, $scope, itemsService, $rootScope) {
        $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
        };
        $scope.ok = function () {
          itemsService.getAll('title', 'ASC', (data) => {
            $rootScope.$broadcast('done', data);
          });
          $uibModalInstance.close();
        };
      }
    });
  }
  $scope.signout = () => {
    itemsService.signout(() => {
        itemsService.getAll('title', 'ASC', (data) => {
        data.forEach(movie => $scope.rate = movie.rating)
        $scope.active = 0;
        $scope.allItems = data;
        $scope.allToWatch = data.filter(movie => !movie.watched);
        $scope.allWatched = data.filter(movie => movie.watched);
      });
    });
  }
  $scope.isCollapsed = true;
  $scope.htmlPopover = $sce.trustAsHtml('<div><button class="rate btn btn-outline-primary" ng-onclick="rate()">Rate</button><hr /><div class="remove">Remove</div>');
  this.addition = '';
  this.searchResults = (input) => {
    if($scope.active === 0) {
      input.length < 1 ?
      $scope.allToWatch = allItems.filter(movie => movie.rating === 0) :
      $scope.allToWatch = $scope.allToWatch.filter(item => item.title.toLowerCase().includes(input.toLowerCase()));
    } else {
      input.length < 1 ?
      $scope.allWatched = allItems.filter(movie => movie.rating > 0) :
      $scope.allWatched = $scope.allWatched.filter(item => item.title.toLowerCase().includes(input.toLowerCase()));
    }
  }
  this.addMovie = (addMovie) => {
    this.addition = '';
    addMovie = addMovie.replace('\'', '\'\'');
    itemsService.addOne({title: addMovie}, function(addition) {
      addition.new = 'new-movie'
      console.log('addition: ', addition)
      console.log('$scope.allToWatch: ', $scope.allToWatch)
      $scope.allToWatch.unshift(addition);
    })
  }
  $scope.rateMovie = (el, i) => {
    if(el.watched) {
      itemsService.changeRating(el.title, el.rating, response => {
        $scope.allWatched[i] = response;
      });
    } else {
      itemsService.changeRating(el.title, el.rating, response => {
        $scope.allToWatch.splice(i, 1);
        $scope.allWatched.push(response);
      });
    }
  }
  $scope.max = 5;
  $scope.hoveringOver = function(value) {
    $scope.overStar = value;
    $scope.percent = 100 * (value / $scope.max);
  };
  $scope.trash = (el, i) => {
    itemsService.remove(el.id, result => el.watched ? $scope.allWatched.splice(i, 1) : $scope.allToWatch.splice(i, 1))
  }
  this.titleAscend = true;
  this.ratingAscend = true;
  $scope.toggleTitleSort = () => {
    this.titleAscend = !this.titleAscend;
    let order = this.titleAscend ? 'ASC' : 'DESC';
    itemsService.getAll('title', order, (data) => {
      data.forEach(movie => $scope.rate = movie.rating)
      $scope.active = 0;
      $scope.allItems = data;
      $scope.allToWatch = data.filter(movie => !movie.watched);
      $scope.allWatched = data.filter(movie => movie.watched);
    });
  }
  $scope.toggleRatingSort = () => {
    this.ratingAscend = !this.ratingAscend;
    let order = this.ratingAscend ? 'ASC' : 'DESC';
    itemsService.getAll('rating', order, (data) => {
      data.forEach(movie => $scope.rate = movie.rating)
      $scope.active = 0;
      $scope.allItems = data;
      $scope.allToWatch = data.filter(movie => !movie.watched);
      $scope.allWatched = data.filter(movie => movie.watched);
    });
  }
})
.component('app', {
  bindings: {
    rate: '='
  },
  controller: 'AppCtrl',
  templateUrl: '/templates/app.html'
})