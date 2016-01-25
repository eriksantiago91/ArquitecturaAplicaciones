angular.module('starter', [])
.controller("inicial", function($scope, $http){
  $scope.mensaje="Hola Chavales";
  $scope.criterioBusqueda = "";

  $scope.LogInFacebook = function(){
    $scope.usuario = [];
    OAuth.initialize('MiTT1KiGcA2Mb6Iiu7kEEjiEN8c')
    OAuth.popup('facebook')
    .done(function(result) {
      result.me()
      .done(function (response) {
        $scope.usuario = response;
        console.log(JSON.stringify($scope.usuario))
      })
      .fail(function (err) {
        console.log("Error 1"+JSON.stringify(err))
      });
    })
    .fail(function (err) {
      console.log("Error 2"+err)
    });
  }


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
