// Interactiveness now

(function() {

    // var clock = document.querySelector('digiclock');

    // // But there is a little problem
    // // we need to pad 0-9 with an extra
    // // 0 on the left for hours, seconds, minutes

    // var pad = function(x) {
    //     return x < 10 ? '0' + x : x;
    // };

    // var ticktock = function() {
    //     var d = new Date();

    //     var h = pad(d.getHours());
    //     var m = pad(d.getMinutes());
    //     var s = pad(d.getSeconds());

    //     var current_time = d.toLocaleDateString() + ' ' + [h, m, s].join(':');
    //     //var current_time = d.toLocaleDateString();

    //     clock.innerHTML = current_time;

    // };

    // ticktock();

    // // Calling ticktock() every 1 second
    // setInterval(ticktock, 1000);

}());
