var Fifteen = Fifteen || {};

Fifteen.Manager = function()
{

    var actions = ['top', 'bottom', 'left', 'right'];
    // var opposite_actions = ['bottom', 'top', 'right', 'left'];

    var on_click = function() {
        cell = Fifteen.UI.get_cell(this);
        // Get the direction of swap (for blank cell)
        action = Fifteen.Worker.get_click_action(cell);
        if(action == "none") { // nothing to be done
            return;
        }
        // Apply the action on matrix first
        var state_manager = new StateManager(Fifteen.State);
        step_info = state_manager.apply_action(action);
        // Refresh the UI
        Fifteen.UI.refresh();
    };

    var animate_path = function(path) {

        var state_manager = new StateManager(Fifteen.State);
        var state = Fifteen.State;
        var blank = state.blank;

        var promise = false;
        var path_length = path.length;
        var path_index = 0;

        for(var i = 0; i < path_length; i++) {
            if(i == 0) {
                action = path.shift();
                path_index++;
                Fifteen.UI.status("playing: " + path_index + " of " + path_length);
                target_cell = state_manager.get_other_cell(state.blank, action);
                promise = Fifteen.UI.animate_cell(target_cell, action);
                state_manager.apply_action(action);
            }
            else {
                promise = promise.then(function() {
                    Fifteen.UI.refresh();
                    action = path.shift();
                    path_index++;
                    Fifteen.UI.status("playing: " + path_index + " of " + path_length);
                    target_cell = state_manager.get_other_cell(state.blank, action);
                    var p = Fifteen.UI.animate_cell(target_cell, action);
                    state_manager.apply_action(action);
                    return p;
                });
            }
        }

        if(promise) {
            promise.then(function() {
                Fifteen.UI.refresh();
            });            
        }

    };

    var on_solve = function() {
        var state_manager = new StateManager(Fifteen.State);
        Fifteen.Solver.init(state_manager);
        solution = Fifteen.Solver.get_solution();
        console.log(solution.path);
        if(solution.entropy == 0) {
            animate_path(solution.path);
        }
        else {
            Fifteen.UI.status("Unable to solve");
        }
    };

    var random_int = function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };

    var on_randomize = function() {
        var action;
        var state_manager = new StateManager(Fifteen.State).clone();
        var path = [];
        for(var i = 0; i < 10; i++) {
            action = Fifteen.Solver.take_random_step(state_manager);
            path.push(action);
        }
        animate_path(path);
    }

    return {
        actions: actions,
        on_click: on_click,
        on_solve: on_solve,
        on_randomize: on_randomize,
        random_int: random_int,
        animate_path: animate_path
    };

}();

