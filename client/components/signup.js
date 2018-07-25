angular.module('movies')
.controller('SignupCtrl', function($scope, $http) {
  $scope.checkPasswordsMatch = () => {
    $scope.passmatch = $scope.pass !== $scope.passmatchinput;
    $scope.incomplete = $scope.passmatch || $scope.username.length < 2;
  }
  $scope.passmatch = false;
  $scope.passmatchinput = '';
  $scope.incomplete = true;
  $scope.submitform = () => {
    var user = {
      username: $scope.username,
      password: $scope.pass
    }

    $http({
      method: 'POST',
      url: '/signup',
      data: JSON.stringify(user)
    })
    .then(function (res) {
      $scope.ok()
    })
    .catch(function(err) {
      console.log(err);
      alert(err.data)
    });
  }
})
.component('signup', {
  bindings: {
    ok: '=',
    // update: '='
  },
  templateUrl: '/templates/signup.html'
});