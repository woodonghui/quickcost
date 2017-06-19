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


app.controller('listSaleRecordController', function($scope, $http, Outlet, SaleRecord) {
    $scope.outlets;
    $scope.tables = {};

    function loadSaleRecords(outlet) {
        SaleRecord.find({ filter: { where: { outletid: outlet.id } } }).$promise.then(function(records) {
            $scope.tables[outlet.name] = records;
            console.log(records);
        });
    }

    Outlet.find().$promise.then(function(models) {
        $scope.outlets = models;
        for (var i = 0; i < models.length; i++) {
            var outlet = models[i];
            loadSaleRecords(outlet);
        }
    });

});


app.controller('saleRecordController', function($scope, $http, Supplier, Outlet, SaleRecord, CostRecord) {

    $scope.foodpandapayoutrate = 0.635;

    $scope.outlets = Outlet.find();
    $scope.outlet;

    // sale record to insert
    $scope.salerecord = {
        totalincome: 0,
        bankincash: 0,
        foodpandaincome: 0,
        paiditems: [],
        unpaiditems: [],
        date: ''
    };

    $scope.item;

    // list all the suppliers
    $scope.suppliers = Supplier.find();
    $scope.supplier;
    // list all the products under the selected supplier
    $scope.products;
    $scope.product;

    // prepare all the cost records
    $scope.quantity;

    $scope.loading = false;

    $scope.$watch('supplier', function(newValue, oldValue) {
        if (newValue != undefined) {
            $scope.products = Supplier.products({ id: $scope.supplier.id });
        }
    });


    $scope.$watch('salerecord.foodpandaincome', function(newValue, oldValue) {
        if (newValue != undefined) {
            $scope.salerecord.totalincome = Number($scope.salerecord.bankincash);
            for (var i = 0; i < $scope.salerecord.paiditems.length; i++) {
                var item = $scope.salerecord.paiditems[i];
                $scope.salerecord.totalincome += item.supplier.gstregistered ?
                    Number(item.product.unitprice) * Number(item.quantity) * 1.07 : Number(item.product.unitprice) * Number(item.quantity);
            }
            $scope.salerecord.totalincome += $scope.salerecord.foodpandaincome * $scope.foodpandapayoutrate;
            $scope.salerecord.totalincome = parseFloat($scope.salerecord.totalincome.toFixed(2));
        }
    });

    $scope.$watch('salerecord.bankincash', function(newValue, oldValue) {
        if (newValue != undefined) {
            $scope.salerecord.totalincome = Number($scope.salerecord.bankincash);
            for (var i = 0; i < $scope.salerecord.paiditems.length; i++) {
                var item = $scope.salerecord.paiditems[i];
                $scope.salerecord.totalincome += item.supplier.gstregistered ?
                    Number(item.product.unitprice) * Number(item.quantity) * 1.07 : Number(item.product.unitprice) * Number(item.quantity);
            }
            $scope.salerecord.totalincome += $scope.salerecord.foodpandaincome * $scope.foodpandapayoutrate;
            $scope.salerecord.totalincome = parseFloat($scope.salerecord.totalincome.toFixed(2));
        }
    });


    $scope.$watchCollection('salerecord.paiditems', function(newValue, oldValue) {
        if (newValue != undefined) {
            $scope.salerecord.totalincome = Number($scope.salerecord.bankincash);
            for (var i = 0; i < $scope.salerecord.paiditems.length; i++) {
                var item = $scope.salerecord.paiditems[i];
                $scope.salerecord.totalincome += item.supplier.gstregistered ?
                    Number(item.product.unitprice) * Number(item.quantity) * 1.07 : Number(item.product.unitprice) * Number(item.quantity);
            }
            $scope.salerecord.totalincome += $scope.salerecord.foodpandaincome * $scope.foodpandapayoutrate;
            $scope.salerecord.totalincome = parseFloat($scope.salerecord.totalincome.toFixed(2));
        }
    });


    $scope.appendItem = function() {
        if ($scope.item.paid) {
            $scope.salerecord.paiditems.push({
                supplier: $scope.supplier,
                product: $scope.product,
                quantity: $scope.item.quantity,
                paid: true
            });
        } else {
            $scope.salerecord.unpaiditems.push({
                supplier: $scope.supplier,
                product: $scope.product,
                quantity: $scope.item.quantity,
                paid: false
            });
        }
    }

    $scope.removeItem = function($index, paid) {
        if (paid) {
            $scope.salerecord.paiditems.splice($index, 1);
        } else {
            $scope.salerecord.unpaiditems.splice($index, 1);
        }
    }

    $scope.add = function() {
        //console.log($scope.salerecord);
        var date = new Date(document.getElementById('datetimepicker4').value);

        SaleRecord.create({
                totalincome: $scope.salerecord.totalincome,
                bankincash: $scope.salerecord.bankincash,
                foodpandaincome: $scope.salerecord.foodpandaincome,
                outletid: $scope.outlet.id,
                date: date
            }).$promise
            .then(function(salerecord) {
                //console.log(salerecord);
                if (salerecord) {
                    var cost = [];
                    for (var i = 0; i < $scope.salerecord.paiditems.length; i++) {
                        var item = $scope.salerecord.paiditems[i];
                        cost.push({
                            productid: item.product.id,
                            date: date,
                            quantity: item.quantity,
                            paid: true,
                            salerecordid: salerecord.id
                        });
                    }
                    for (var i = 0; i < $scope.salerecord.unpaiditems.length; i++) {
                        var item = $scope.salerecord.unpaiditems[i];
                        cost.push({
                            productid: item.product.id,
                            date: date,
                            quantity: item.quantity,
                            paid: false,
                            salerecordid: salerecord.id
                        });
                    }
                    if (cost.length > 0) {
                        CostRecord.createMany(cost).$promise
                            .then(function(models) {
                                //console.log(models);

                                $scope.salerecord = {
                                    totalincome: 0,
                                    bankincash: 0,
                                    foodpandaincome: 0,
                                    paiditems: [],
                                    unpaiditems: []
                                };

                                $scope.item.quantity = 0;
                                $scope.item.paid = false;

                            });
                    }
                }
            });
    };

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
