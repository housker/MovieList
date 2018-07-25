angular.module('movies')
.controller('SigninCtrl', function($scope, $http) {
  $scope.checkComplete = () => {
    $scope.incomplete = $scope.pass.length < 3 || $scope.username.length < 2;
  }
  $scope.incomplete = true;
  $scope.submitform = () => {
    var user = {
      username: $scope.username,
      password: $scope.pass
    }

    $http({
      method: 'POST',
      url: '/signin',
      data: JSON.stringify(user)
    })
    .then(function (res) {
      console.log(res)
      $scope.ok()
    })
    .catch(function(err) {
      console.log(err);
      alert(err.data)
    });
  }
})
.component('signin', {
  bindings: {
    ok: '=',
    // update: '='
  },
  templateUrl: '/templates/signin.html'
});