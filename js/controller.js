angular.module('starter', [])

.controller("usuario", function($scope, $rootScope, $http){

})


.controller("inicial", function($scope, $rootScope, $http){
  $scope.criterioBusqueda = "";
  $scope.logeo = false;
  $rootScope.usuario = {};



  $scope.LogIn = function(app){

    OAuth.initialize('MiTT1KiGcA2Mb6Iiu7kEEjiEN8c')
    OAuth.popup(app)
    .done(function(result) {
      result.me()
      .done(function (response) {
        $rootScope.usuario = response;
        $scope.logeo = true;
        console.log(JSON.stringify($rootScope.usuario))
        alert("logeadp");
      })
      .fail(function (err) {
        console.log("Error 1"+JSON.stringify(err))
      });
    })
    .fail(function (err) {
      console.log("Error 2"+err)
    });
  }

  $scope.bandera = true;

  $scope.buscar = function(){
    $scope.busqueda = [];
    $http({
      method: 'GET',
      url: "http://j4loxa.com/serendipity/plan/browse?q="+$scope.criterioBusqueda+"&fq=keywords%3AAbr%2F2105+-+Ago%2F2015&wt=json&rows=600"
    }).success(function(data, status, headers, config) {
      alert("sucess");
      //console.log(JSON.stringify(data));
      console.log(headers());
      $scope.busqueda = data;
      $scope.header = headers;
      $scope.responseHeader = $scope.busqueda.responseHeader;
      $scope.planes = $scope.busqueda.response.docs;
      console.log(JSON.stringify($scope.busqueda.response.numFound));
      $scope.criterioBusqueda = "";

    }).error(function(data, status, headers, config) {
      console.log("Error here. Estado HTTP:"+status);
    });
  }
})
