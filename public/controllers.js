var myApp = angular.module("AgendaApp",[]);

myApp.controller('AppCtrl',['$scope','$http',function($scope,$http){
	console.log("Controller initialized");

	var refresh = function (){
		$http.get('/citas').success(function (citas){
			console.log('Data received successfully');
			$scope.citalist = citas;
		});
	}

	refresh();

	$scope.addCita = function(){
		console.log("Inserting cita ...");
		$http.post('/citas',$scope.citas);
		refresh();
	}

	$scope.deleteCita = function(descripcion){
		console.log("Deleting cita with "+descripcion);
		$http.delete('/citas/'+descripcion);
		refresh();
	}

}]);
