$(function() {

    Fifteen.UI.init('#square', 4);
    $('#btn_randomize').click(Fifteen.Manager.on_randomize);
    $('#btn_solve').click(Fifteen.Manager.on_solve);

});
