var Fifteen = Fifteen || {};

Fifteen.StateManager = function()
{

    var get_other_cell = function(i, j, action) {
        if(action == 'top'){
            new_i = i-1;
            new_j = j;
        }
        if(action == 'bottom'){
            new_i = i+1;
            new_j = j;
        }
        if(action == 'left'){
            new_i = i;
            new_j = j-1;
        }
        if(action == 'right'){
            new_i = i;
            new_j = j+1;
        }
        return { i: new_i, j: new_j };
    };

    var swap = function(cell1, cell2) {
        matrix = Fifteen.State.matrix;
        v1 = matrix[cell1.i][cell1.j];
        v2 = matrix[cell2.i][cell2.j];
        matrix[cell1.i][cell1.j] = v2;
        matrix[cell2.i][cell2.j] = v1;
    };

    var apply_action = function(action) {
        matrix = Fifteen.State.matrix;
        blank = Fifteen.State.blank;
        cell = get_other_cell(blank.i, blank.j, action);
        swap(blank, cell);
        Fifteen.State.blank = cell;
        return {
            blank: blank,
            cell: cell
        };
    };

    return {
        apply_action: apply_action
    };

}();

