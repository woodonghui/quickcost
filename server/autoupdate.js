var server = require('./server');
var ds = server.dataSources.db;
var lbTables = ['User', 'AccessToken', 'ACL', 'RoleMapping', 'Role',
    'Supplier', 'Product', 'Outlet', 'SaleRecord', 'CostRecord', 'Setting', 'Employee'];
ds.isActual(lbTables, function (err, actual) {
    if (!actual) {
        ds.autoupdate(lbTables, function (er) {
            if (er) throw er;
            else console.log('Loopback built-in tables ', lbTables, ' updated in ', ds.adapter.name);
            ds.disconnect();
        });
    } else {
        console.log('All tables are up-to-date');
        ds.disconnect();
    }
});