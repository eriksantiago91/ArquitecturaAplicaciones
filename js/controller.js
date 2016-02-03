angular.module('starter', ['ngRoute'])

.config(function($routeProvider){
	$routeProvider
	.when('/',{
		templateUrl : 'templates/inicial.html',
		controller : 'inicial'
	})
	.when('/filtroAutor',{
		templateUrl : 'templates/filtroAutor.html',
		controller : 'inicial'
	});
})


.controller("inicial", function($scope, $rootScope, $http){
	$scope.criterioBusqueda = "";
	$scope.logeo = false;
	$rootScope.usuario = {};
	$scope.planVisor = {};
	$scope.usuariosRegistrados = [];
	$scope.showModal = false;
	$scope.mensaje = "Busqueda Pública"

	$scope.toggleModal = function(){
		console.log("presionado")
		$scope.showModal = !$scope.showModal;
	};

	$scope.verContenido = function(index){
		$scope.planVisor = $scope.planes[index];
	}

	$scope.LogIn = function(app){
		$scope.nuevoUsuario = {};
		OAuth.initialize('MiTT1KiGcA2Mb6Iiu7kEEjiEN8c')
		OAuth.popup(app)
		.done(function(result) {
			result.me()
			.done(function (response) {
				$scope.logeo = true;
				$scope.mensaje = "Busqueda Privada";
				$rootScope.usuario.nombre = response.name;
				$rootScope.usuario.avatar = response.avatar;
				if (response.id > 999999999){
					response.id = response.id - 10204162000000000;
				}
				$rootScope.usuario.id = response.id;

				$scope.nuevoUsuario.id = response.id;
				$scope.nuevoUsuario.nombre = response.name;
				$scope.nuevoUsuario.avatar = response.avatar;
				$scope.listarFavoritos();
				$scope.listarSeguidos();
				$http({
					method: 'GET',
					url: "http://127.0.0.1/RestBuscaPlanesUTPL/listarUsuarios.php"
				}).success(function(data, status, headers, config) {
					$scope.usuariosRegistrados = data;
					var aux1 = $scope.usuariosRegistrados;
					var bandera = false;
					for (var i = 0; i < aux1.length; i++){
						console.log($scope.nuevoUsuario.id+" : "+ $scope.usuariosRegistrados[i].id);
						if ($scope.nuevoUsuario.id == $scope.usuariosRegistrados[i].id){
							bandera = true;
						}
					}
					$scope.usuariosCompartir = $scope.usuariosRegistrados;
					console.log($scope.usuariosCompartir);
					if (bandera == false){
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
					}

				}).error(function(data, status, headers, config) {
					console.log("Error here. Estado HTTP:"+status);
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

	$scope.listarSeguidos = function(){
		console.log("http://127.0.0.1/RestBuscaPlanesUTPL/listarSeguidos.php?id_usuario="+$rootScope.usuario.id);
		$http({
			method: 'GET',
			url: "http://127.0.0.1/RestBuscaPlanesUTPL/listarSeguidos.php?id_usuario="+$rootScope.usuario.id
		}).success(function(data, status, headers, config) {
			console.log("Favoritos: "+data);
			$scope.usuariosSeguidos = data;
		}).error(function(data, status, headers, config) {
			console.log("Error al obtener seguidos:"+status);
		});
	}


	$scope.LogOut = function(){
		$scope.logeo = false;
		$scope.mensaje = "Busqueda Publica";
		$scope.$apply();
	}

	$scope.listarFavoritos = function(){
		$http({
			method: 'GET',
			url: "http://127.0.0.1/RestBuscaPlanesUTPL/listarFavoritos.php?id_usuario="+$rootScope.usuario.id
		}).success(function(data, status, headers, config) {
			console.log("Favoritos: "+data);
			$scope.favoritos = data;
		}).error(function(data, status, headers, config) {
			console.log("Error al obtener favoritos:"+status);
		});
	}


	$scope.favoritos=function(planTitle, planId){
		$scope.id=planId;
		$scope.nombre=planTitle;
		alert($scope.nombre);
		var data = {
			'id': $scope.id,
			'nombre': $scope.nombre,
			'id_usuario': $rootScope.usuario.id
		};
		data = JSON.stringify(data);

		$http({
			method: 'POST',
			url: 'http://127.0.0.1/RestBuscaPlanesUTPL/nuevoFavorito.php',
			data: data,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		}).
		success(function(data, status, headers, config) {
			console.log("Favorito inngresado");
			$scope.listarFavoritos();

		}).
		error(function(data, status, headers, config) {
			console.log("Error al ingresar favorito");
		});
	}

	$scope.filtrarporAutor = function(nombreAutor){
		$scope.planesFiltradorPorAutor = [];
		for (var i = 0; i < $scope.planes.length; i++){
			if ($scope.planes[i].author == nombreAutor){
				$scope.planesFiltradorPorAutor.push($scope.planes[i]);
			}
		}

	}

	$scope.buscar = function(){
		$scope.busqueda = [];
		$http({
			method: 'GET',
			url: "http://j4loxa.com/serendipity/plan/browse?q="+$scope.criterioBusqueda+"&wt=json&rows=99"
		}).success(function(data, status, headers, config) {
			$scope.busqueda = data;
			$scope.header = headers;
			var autoresFace  = $scope.busqueda.facet_counts.facet_fields.author_s;
			var len = autoresFace.length;
			$scope.autores = [];
			var a = {};
			for (var i = 0; i < len; i+=2){
				a = {
					"nombre" : autoresFace[i],
					"numeroPlanes" : autoresFace[i+1]
				}
				$scope.autores.push(a);
			}
			$scope.planes = $scope.busqueda.response.docs;
			$scope.auditoria();
			$scope.criterioBusqueda = "";
			for (var i = 0; i < $scope.planes.length; i++){
				$scope.planes[i].title[0] = $scope.planes[i].title[0].replace(/Plan docente de/g,"");
			}
		}).error(function(data, status, headers, config) {
			console.log("Error here. Estado HTTP:"+status);
		});
	}


	$scope.nuevoSeguido = function(id_seguido){

		var data = {
			'id_seguido' : id_seguido,
			'id_seguidor' : $rootScope.usuario.id
		}

		data = JSON.stringify(data);
		console.log(data);


		$http({
			method: 'POST',
			url: 'http://127.0.0.1/RestBuscaPlanesUTPL/nuevoSeguido.php',
			data : data,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		}).
		success(function(data, status, headers, config) {
			console.log("Nuevo seguido");

		}).
		error(function(data, status, headers, config) {
			console.log("Error al seguir al usuario: ");
		});
	}

	$scope.auditoria=function(){
		$scope.CurrentDate = new Date();
	 	$scope.versiones=navigator.appVersion;
		console.log($rootScope.usuario.id);

		if ($scope.logeo == true){
			var data = {
				'tipo_busqueda' : 'privada',
				'id_usuario' : $rootScope.usuario.id,
				'hora' : $scope.CurrentDate,
				'criterio_busqueda' : $scope.criterioBusqueda,
				'navegador' : $scope.versiones
			}
		}else{
			var data = {
				'tipo_busqueda' : 'publica',
				'id_usuario' : 000,
				'hora' : $scope.CurrentDate,
				'criterio_busqueda' : $scope.criterioBusqueda,
				'navegador' : $scope.versiones
			}
		}


		data = JSON.stringify(data);

		console.log(data);

		$http({
			method: 'POST',
			url: 'http://127.0.0.1/RestBuscaPlanesUTPL/nuevoRegistroLog.php',
			data: data,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		}).
		success(function(data, status, headers, config) {
			console.log("Favorito inngresado");
		}).
		error(function(data, status, headers, config) {
			console.log("Error al ingresar favorito: ");
		});


	}

})


.directive('modal', function () {
	return {
		template: '<div class="modal fade">' +
		'<div class="modal-dialog">' +
		'<div class="modal-content">' +
		'<div class="modal-header">' +
		'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
		'<h4 class="modal-title">{{ title }}</h4>' +
		'</div>' +
		'<div class="modal-body" ng-transclude></div>' +
		'</div>' +
		'</div>' +
		'</div>',
		restrict: 'E',
		transclude: true,
		replace:true,
		scope:true,
		link: function postLink(scope, element, attrs) {
			scope.title = attrs.title;

			scope.$watch(attrs.visible, function(value){
				if(value == true)
				$(element).modal('show');
				else
				$(element).modal('hide');
			});

			$(element).on('shown.bs.modal', function(){
				scope.$apply(function(){
					scope.$parent[attrs.visible] = true;
				});
			});

			$(element).on('hidden.bs.modal', function(){
				scope.$apply(function(){
					scope.$parent[attrs.visible] = false;
				});
			});
		}
	};
});
