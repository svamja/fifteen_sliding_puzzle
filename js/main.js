function on_solve() {
    matrix = [];
    var i, j;
    for(i = 0; i < 4; i++) {
        for(j = 0; j < 4; j++) {
            k = i*4 + j;
            matrix[k] = Fifteen.State.matrix[i][j] - 1;
            if(matrix[k] == -1) {
                matrix[k] = 15
            }
        }
    }

    data = {
        matrix: matrix,
        time: new Date().getTime()
    };
    console.log(data);

    url = 'http://localhost:8001/slidingpuzzle';

    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(response) {
            console.log(response);
            path = response.path.slice(0)
            Fifteen.Manager.animate_path(path);
        },
        failure: function(err) {
            console.log(err);
        }
    });

};



$(function() {

    Fifteen.UI.init('#square', 4);
    $('#btn_randomize').click(Fifteen.Manager.on_randomize);
    // $('#btn_solve').click(Fifteen.Manager.on_solve);
    $('#btn_solve').click(on_solve);

});
