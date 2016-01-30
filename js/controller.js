angular.module('starter', ['ngPDFViewer'])

.controller('TestController', [ '$scope', 'PDFViewerService', function($scope, pdf) {
	console.log('TestController: new instance');
	$scope.pdfURL = "test.pdf";
	$scope.instance = pdf.Instance("viewer");
	$scope.nextPage = function() {
		$scope.instance.nextPage();
	};
	$scope.prevPage = function() {
		$scope.instance.prevPage();
	};
	$scope.gotoPage = function(page) {
		$scope.instance.gotoPage(page);
	};
	$scope.pageLoaded = function(curPage, totalPages) {
		$scope.currentPage = curPage;
		$scope.totalPages = totalPages;
	};
	$scope.loadProgress = function(loaded, total, state) {
		console.log('loaded =', loaded, 'total =', total, 'state =', state);
	};
}])

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
        $rootScope.usuario.nombre = response.name;
        $rootScope.usuario.avatar = response.avatar;
        $scope.logeo = true;
        console.log(JSON.stringify($rootScope.usuario))
        $scope.$apply();
      })
      .fail(function (err) {
        console.log("Error con la data: "+JSON.stringify(err))
      });
    })
    .fail(function (err) {
      console.log("Error con la conexion: "+err)
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
