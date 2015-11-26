var Fifteen = Fifteen || {};

Fifteen.State = {
    size : 0,
    matrix : [],
    blank: { i : 0, j: 0 }
};

Fifteen.UI = function()
{

    var selector;
    var cell_spacing = 4;

    var init = function(i_selector, size) {
        selector = i_selector;
        Fifteen.State.size = size;
        create_table(selector, size);
        Fifteen.State.blank = init_matrix(Fifteen.State.matrix, size);
        style_table(selector, size, cell_spacing);
        refresh(Fifteen.State.matrix);
        $(selector).find('td').click(Fifteen.Manager.on_click);
    };

    var create_table = function(selector, size) {
        for(i = 0; i < size; i++) {
            $tr = $('<tr>');
            for(j = 0; j < size; j++) {
                $td = $('<td>');
                $td.data('i', i);
                $td.data('j', j);
                $tr.append($td);
            }
            $(selector).append($tr);
        }
    };

    var init_matrix = function(matrix, size) {
        for(i = 0; i < size; i++) {
            matrix[i] = [];
            for(j = 0; j < size; j++) {
                matrix[i][j] = i*size + j + 1;
            }
        }
        matrix[size - 1][size - 1] = 0;
        return { 
            i : size - 1, 
            j : size -1
        };
    };


    var style_table = function(selector, size, cell_spacing) {
        $selector = $(selector);
        $selector.css({
            'borderSpacing': cell_spacing,
            'borderCollapse': 'separate'
        });
        td_width = (100/size) + '%';
        $selector.find('td').css({
            'padding': 10,
            'textAlign': 'center',
            'width' : td_width,
            'height' : 70,
            'fontSize': '2em',
            'verticalAlign' : 'middle',
        });
        height = $selector.height();
        width = height;
        $selector.width(width);
        $selector.css({'margin' : 'auto'});
        $selector.css({'marginTop' : '60px'});
    };

    var refresh = function() {
        matrix = Fifteen.State.matrix;
        $(selector).find('td').css({ 
            'top' : 0,
            'left' : 0,
        });
        $(selector).find('tr').each(function(i, tr) {
            $(tr).find('td').each(function(j, td) {
                if(matrix[i][j] == 0) {
                    $(td).html("").css({'backgroundColor' : '#eea'});
                }
                else {
                    $(td).html(matrix[i][j]).css({'backgroundColor' : '#ee3'});
                }
            })
        })
    };

    var get_cell = function(cell_selector) {
        i = $(cell_selector).data('i');
        j = $(cell_selector).data('j');
        return {
            i: i,
            j: j
        };
    };

    return {
        init: init,
        refresh: refresh,
        get_cell: get_cell,
    };

}();

