$(function() {

    Fifteen.UI.init('#square', 4);
    $('#btn_randomize').click(Fifteen.Manager.randomize);
    $('#btn_solve').click(Fifteen.Manager.solve);

});
