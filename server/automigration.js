// var server = require('./server');
// var ds = server.dataSources.db;
// var lbTables = ['User', 'AccessToken', 'ACL', 'RoleMapping', 'Role'];
// ds.automigrate(lbTables, function(er) {
//     if (er) throw er;
//     console.log('Loopback built-in tables ', lbTables, ' created in ', ds.adapter.name);
//     ds.disconnect();
// });
// var myTables = ['Supplier', 'Product', 'Outlet', 'SaleRecord', 'CostRecord', 'Setting', 'Employee'];
// ds.automigrate(myTables, function(er) {
//     if (er) throw er;
//     console.log(myTables, 'created in ', ds.adapter.name);
//     ds.disconnect();
// });
