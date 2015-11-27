var Fifteen = Fifteen || {};

Fifteen.Worker = function()
{

    var opposite_actions = {
        'top' : 'bottom',
        'bottom' : 'top',
        'left' : 'right',
        'right' : 'left',
    };

    var get_neighbors = function(cell) {
        i = cell.i;
        j = cell.j;
        var neighbors = {
            'top' : -1,
            'left' : -1,
            'right' : -1,
            'bottom' : -1,
        };
        matrix = Fifteen.State.matrix;
        if(matrix[i-1] != undefined && matrix[i-1][j] != undefined) {
            neighbors['top'] = matrix[i-1][j];
        }
        if(matrix[i+1] != undefined && matrix[i+1][j] != undefined) {
            neighbors['bottom'] = matrix[i+1][j];
        }
        if(matrix[i][j-1] != undefined) {
            neighbors['left'] = matrix[i][j-1]
        }
        if(matrix[i][j+1] != undefined) {
            neighbors['right'] = matrix[i][j+1]
        }
        return neighbors;
    };

    var is_clickable = function(cell) {
        n = get_neighbors(cell);
        if(n.top != 0 && n.left != 0 && n.right != 0 && n.bottom != 0) {
            return false;
        }
        return true;
    };

    var get_click_action = function(cell) {
        n = get_neighbors(cell);
        for(i = 0; i < Fifteen.Manager.actions.length; i++) {
            if(n[Fifteen.Manager.actions[i]] == 0) {
                return opposite_actions[Fifteen.Manager.actions[i]];
            }
        }
        return "none";
    };

    return {
        is_clickable: is_clickable,
        get_click_action: get_click_action,
    };

}();

