window.init = function () {
    angular.bootstrap(document, ['tesedaApp']);
}

$(document).ready(function () {
    if (window.location.hash == "#_=_") window.location.hash = "";
    window.init();
});
