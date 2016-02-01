angular.module('starter', ['ngPDFViewer'])


.controller("inicial", function($scope, $rootScope, $http){
	$scope.criterioBusqueda = "";
	$scope.logeo = false;
	$rootScope.usuario = {};

	$scope.LogIn = function(app){
		$scope.nuevoUsuario = {};
		OAuth.initialize('MiTT1KiGcA2Mb6Iiu7kEEjiEN8c')
		OAuth.popup(app)
		.done(function(result) {
			result.me()
			.done(function (response) {
				$rootScope.usuario.nombre = response.name;
				$rootScope.usuario.avatar = response.avatar;
				$scope.logeo = true;
				$scope.nuevoUsuario.id = response.id;
				$scope.nuevoUsuario.nombre = response.name;
				$scope.nuevoUsuario.avatar = response.avatar;
				console.log(JSON.stringify($scope.nuevoUsuario));

				var data = {
					'id': $scope.nuevoUsuario.id,
					'nombre': $scope.nuevoUsuario.nombre,
					'avatar': $scope.nuevoUsuario.avatar
				};

				data = JSON.stringify(data);

				$http({
					method: 'POST',
					url: 'http://127.0.0.1/RestBuscaPlanesUTPL/nuevoUsuario.php',
					data: data,
					headers: {'Content-Type': 'application/x-www-form-urlencoded'},

				}).
				success(function(data, status, headers, config) {
					console.log("Usuario ingresado");
				}).
				error(function(data, status, headers, config) {
          console.log("NO");
        });



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
			url: "http://j4loxa.com/serendipity/plan/browse?q="+$scope.criterioBusqueda+"&fq=keywords%3AAbr%2F2105+-+Ago%2F2015&wt=json&rows=99"
		}).success(function(data, status, headers, config) {
			//alert("sucess");
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
