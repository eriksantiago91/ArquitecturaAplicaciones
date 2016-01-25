angular.module('starter', [])
.controller("inicial", function($scope, $http){
  $scope.mensaje="Hola Chavales";
  $scope.criterioBusqueda = "";
  OAuth.initialize('');

  OAuth.popup('facebook')
  .done(function(result) {
    result.get('/me')
    .done(function (response) {
      //this will display "John Doe" in the console
      console.log(response.name);
    })
    .fail(function (err) {
      //handle error with err
    });
  })
  .fail(function (err) {
    //handle error with err
  });


  $scope.buscar = function(){
    $scope.busqueda = [];
    $http({
      method: 'GET',
      url: "http://j4loxa.com/serendipity/plan/browse?q="+$scope.criterioBusqueda+"&fq=keywords%3AAbr%2F2105+-+Ago%2F2015&wt=json&rows=600"
    }).success(function(data, status, headers, config) {
      console.log(JSON.stringify(data));
      $scope.busqueda = data;
      $scope.responseHeader = $scope.busqueda.responseHeader;
      $scope.planes = $scope.busqueda.response.docs;
      console.log(JSON.stringify($scope.busqueda.response.numFound));
      $scope.criterioBusqueda = "";

    }).error(function(data, status, headers, config) {
      console.log("Error here. Estado HTTP:"+status);
    });
  }
})
