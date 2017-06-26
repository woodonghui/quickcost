app.controller('costController', function($scope, $http, Outlet) {
    $scope.outlets = Outlet.find();


});
