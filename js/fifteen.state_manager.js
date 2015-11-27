function StateManager(state) {
    this.state = state;
    this.min_entropy = 0;
    this.max_entropy = 9999;
};
 
StateManager.prototype.get_other_cell = function(cell, action) {
    var i = cell.i, j = cell.j;
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

StateManager.prototype.swap = function(cell1, cell2) {
    matrix = this.state.matrix;
    v1 = matrix[cell1.i][cell1.j];
    v2 = matrix[cell2.i][cell2.j];
    matrix[cell1.i][cell1.j] = v2;
    matrix[cell2.i][cell2.j] = v1;
};

StateManager.prototype.is_allowed = function(action) {
    actions = this.get_allowed_actions();
    return actions.indexOf(action) != -1;
};

StateManager.prototype.get_allowed_actions = function() {
    actions = [];
    size = this.state.size;
    blank = this.state.blank;
    if(blank.i > 0) actions.push("top");
    if(blank.i < this.state.size - 1) actions.push("bottom");
    if(blank.j > 0) actions.push("left");
    if(blank.j < this.state.size - 1) actions.push("right");
    return actions;
};

StateManager.prototype.apply_action = function(action) {
    matrix = this.state.matrix;
    blank = this.state.blank;
    cell = this.get_other_cell(blank, action);
    this.swap(blank, cell);
    this.state.blank = cell;
    return {
        blank: blank,
        cell: cell
    };
};

StateManager.prototype.apply_path = function(path) {
    for(var i = 0; i < path.length; i++) {
        if(!this.is_allowed(path[i])) {
            return false;
        }
        this.apply_action(path[i]);
    }
    return true;
};

StateManager.prototype.get_entropy = function() {
    entropy = 0;
    matrix = this.state.matrix;
    blank = this.state.blank;
    matrix_size = this.state.size;

    for(i = 0; i < matrix_size; i++) {
        for(j = 0; j < matrix_size; j++) {
            number = matrix[i][j] - 1;
            if(matrix[i][j] == 0) {
                number = matrix_size*matrix_size - 1;
            }
            number_i = Math.floor(number/matrix_size);
            number_j = number % matrix_size;
            num_entropy = Math.abs(i - number_i) + Math.abs(j - number_j);
            if(num_entropy > 0) {
                num_entropy += Math.abs(blank.i - number_i) + Math.abs(blank.j - number_j);
            }
            entropy += num_entropy;
        }
    }
    return entropy;
};

StateManager.prototype.clone = function() {
    state_copy = deep_copy(this.state);
    return new StateManager(state_copy);
};

