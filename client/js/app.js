var app = angular.module('App', ['lbServices', 'bc.AngularKeypad']);

app.controller('outletController', function($scope, $http, Outlet) {

    $scope.outlets = Outlet.find();
    $scope.outlet;
    $scope.loading = false;

    $scope.add = function() {
        $scope.loading = true;

        Outlet.create({
                name: $scope.outlet.name,
                address: $scope.outlet.address,
                contact: $scope.outlet.contact
            }).$promise
            .then(function(outlet) {
                $scope.outlets.push(outlet);
                $scope.outlet.name = '';
                $scope.outlet.contact = '';
                $scope.outlet.address = '';
                $scope.loading = false;
            });
    };

    $scope.edit = function($index) {
        $scope.loading = true;
        var outlet = $scope.outlets[$index];
        Outlet.findById({ id: outlet.id }).$promise  .then(function(outlet) {
            $scope.outlet = outlet;
            $scope.loading = false;
        });
    }

    $scope.delete = function($index) {
        $scope.loading = true;
        var outlet = $scope.outlets[$index];

        Outlet.deleteById({ id: outlet.id }).$promise  .then(function() {
            $scope.outlets.splice($index, 1);
            $scope.loading = false;
        });
    };

    $scope.save = function() {

        Outlet.prototype$updateAttributes({
                id: $scope.outlet.id,
                name: $scope.outlet.name,
                address: $scope.outlet.address,
                contact: $scope.outlet.contact
            })
            .$promise.then(function() {
                $scope.outlets = Outlet.find();
            });


        // Outlet.findById({ id: $scope.outlet.id }).$promise  .then(function(outlet) {
        //     outlet.name = $scope.outlet.name;
        //     outlet.$save();
        // });

        //Outlet.update().where()


    }

    // $scope.update = function(co) {
    //     co.$save();
    // };

});


app.controller('saleRecordController', function($scope, $http, Supplier, Outlet) {

    $scope.outlets = Outlet.find();
    $scope.outlet;

    //today's total income
    $scope.totalincome = 0;

    $scope.salerecord;

    // list all the suppliers
    $scope.suppliers = Supplier.find();
    $scope.supplier;
    // list all the products under the selected supplier
    $scope.products;
    $scope.product;

    $scope.costRecords;
    $scope.quantity;

    $scope.loading = false;

    $scope.$watch('supplier', function(newValue, oldValue) {
        //console.log(newValue, oldValue);
        if (newValue != undefined) {
            $scope.products = Supplier.products({ id: $scope.supplier.id });
        }
    });

    $scope.appendCost = function() {
        if (!$scope.costRecords) $scope.costRecords = [];
        $scope.costRecords.push({
            supplier: $scope.supplier,
            product: $scope.product,
            quantity: $scope.quantity
        });
    }

    $scope.removeCost = function($index) {
        $scope.costRecords.splice($index, 1);
    }

    $scope.$watch('costRecords', function(newValue, oldValue) {
        console.log(newValue, oldValue);

    });

    $scope.add = function() {};

    $scope.delete = function($index) {

    };


});


app.controller('supplierController', function($scope, $http, Supplier) {

    $scope.suppliers = Supplier.find();
    $scope.supplier;
    $scope.loading = false;

    $scope.add = function() {
        $scope.loading = true;

        console.log($scope.supplier);

        Supplier.create({
                name: $scope.supplier.name,
                contact: $scope.supplier.contact,
                gstregistered: $scope.supplier.gstregistered || false,
                hasterm: $scope.supplier.hasterm || false
            }).$promise
            .then(function(supplier) {
                $scope.suppliers.push(supplier);
                $scope.supplier.name = '';
                $scope.supplier.contact = '';
                $scope.supplier.gstregistered = false;
                $scope.supplier.hasterm = false;
                $scope.loading = false;
            });
    };

    $scope.delete = function($index) {
        $scope.loading = true;
        var supplier = $scope.suppliers[$index];

        Supplier.deleteById({ id: supplier.id }).$promise  .then(function() {
            $scope.suppliers.splice($index, 1);
            $scope.loading = false;
        });
    };

    // $scope.update = function(co) {
    //     co.$save();
    // };

});



app.controller('productController', function($scope, $http, Product, Supplier) {

    $scope.suppliers = Supplier.find();
    $scope.products = Product.find({ filter: { include: 'supplier' } });
    $scope.product;
    $scope.loading = false;

    $scope.add = function() {
        $scope.loading = true;

        Product.create({
                name: $scope.product.name,
                unitprice: $scope.product.unitprice,
                supplierid: $scope.product.supplier.id,
                unit: $scope.product.unit
            }).$promise
            .then(function(product) {
                $scope.products.push(product);
                $scope.product.name = '';
                $scope.product.unitprice = '';
                $scope.product.unit = '';
                $scope.loading = false;
            });

    };

    $scope.delete = function($index) {
        $scope.loading = true;
        var product = $scope.products[$index];

        Product.deleteById({ id: product.id }).$promise  .then(function() {
            $scope.products.splice($index, 1);
            $scope.loading = false;
        });
    };

    // $scope.update = function(co) {
    //     co.$save();
    // };

});


// app.controller('appController', function($scope, $http, Co, Worker) {

//      $scope.workers = Worker.find();
//      $scope.cos = Co.find();
//      $scope.co;
//      $scope.loading=false;

//      $scope.add = function(){
//          $scope.loading=true;

//          Co.create({netincome: $scope.co.netincome, location: $scope.co.location, personincharge: $scope.co.personincharge.nickname, date: new Date() }).$promise
//               .then(function(co) { 
//                      $scope.cos.push(co);
//                      $scope.co.netincome='';
//                      $scope.co.location='';
//                      $scope.co.personincharge='';
//                      $scope.loading=false;
//                });;
//      };

//      $scope.delete = function($index){
//          $scope.loading=true;
//          var co = $scope.cos[$index];

//          Co.deleteById({ id: co.id}).$promise
//              .then(function() {
//              $scope.cos.splice($index,1);
//              $scope.loading=false;
//           });
//      };

//      $scope.update = function(co){
//          co.$save();
//      };

// });



// app.controller('workerController', function($scope, $http, Worker) {

//      $scope.workers = Worker.find();
//      $scope.worker;
//      $scope.loading=false;

//      $scope.add = function(){
//          $scope.loading=true;

//          Worker.create({firstname: $scope.worker.firstname, lastname: $scope.worker.lastname, nickname: $scope.worker.nickname, joindate: new Date() }).$promise
//               .then(function(worker) { 
//                      $scope.workers.push(worker);
//                      $scope.worker.firstname='';
//                      $scope.worker.lastname='';
//                      $scope.worker.nickname='';
//                      $scope.loading=false;
//                });;
//      };

//      $scope.delete = function($index){
//          $scope.loading=true;
//          var worker = $scope.workers[$index];

//          Worker.deleteById({ id: worker.id}).$promise
//              .then(function() {
//              $scope.workers.splice($index,1);
//              $scope.loading=false;
//           });
//      };

//      $scope.update = function(worker){
//          worker.$save();
//      };

// });
