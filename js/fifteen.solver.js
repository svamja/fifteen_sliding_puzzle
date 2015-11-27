var Fifteen = Fifteen || {};

Fifteen.Solver = function()
{
    var state_manager;
    // var state;

    var attempt_size, advancement_size;
    var advancement_range, alternative_size;
    var max_repeat_discard;

    var init = function(i_state_manager) {
        state_manager = i_state_manager.clone();
    };

    /*
    * each attempt is one end-to-end attempt to
    * solve the puzzle. it has a series of "advancements"
    * each advancement is chosen by trying out different alternatives
    */
    var make_attempt = function(state_manager) {
        var prev_entropy = state_manager.get_entropy();
        var path = [];
        for(var i = 0; i < advancement_size; i++) {
            result = try_alternatives(state_manager);
            if(result.entropy < prev_entropy) { // choose this advancement
                state_manager = result.state_manager;
                prev_entropy = result.entropy;
                path = path.concat(result.path);
                // console.log("advancement", i, "selected", path);
            }
            if(result.entropy == state_manager.min_entropy) {
                // console.log(i, "advancement", i, "skipped");
                break;
            }
        }
        return {
            path: path,
            entropy: prev_entropy
        };
    };

    /*
    * try n different alternatives and returns the best one
    * each alternative is an "advancement" - series of steps
    */
    var try_alternatives = function(state_manager) {
        var min_entropy = state_manager.max_entropy;
        for(var i = 0; i < alternative_size; i++) {
            state_manager_copy = state_manager.clone();
            path = make_advancement(state_manager_copy);
            entropy = state_manager_copy.get_entropy();
            // console.log("alternative", i, path, entropy);
            if(entropy < min_entropy) {
                min_path = path;
                min_entropy = entropy;
                min_state_manager = state_manager_copy;
            }
            if(entropy == 0) break;
        }
        // console.log("alternative selected", min_path);
        return {
            path: min_path,
            entropy: min_entropy,
            state_manager: min_state_manager
        };
    };

    /*
    * Take n number of random steps,
    * where n itself is a random size within advancement_range
    */
    var make_advancement = function(state_manager) {
        step_size = Fifteen.Manager.random_int(advancement_range.min, advancement_range.max + 1);
        path = [];
        for(var i = 0; i < step_size; i++) {
            action = take_random_step(state_manager);
            path.push(action);
            entropy = state_manager.get_entropy();
            if(entropy == state_manager.min_entropy) {
                break;
            }
        }
        return path;
    };

    var take_random_step = function(state_manager) {
        actions = state_manager.get_allowed_actions();
        a_index = Fifteen.Manager.random_int(0, actions.length);
        action = actions[a_index];
        state_manager.apply_action(action);
        return action;
    };

    /*
    * solution is best out of multiple attempts
    */
    var get_solution = function() {
        attempt_size = 10;
        advancement_size = 50;
        advancement_range = { min: 1, max: 10 };
        alternative_size = 10;
        max_repeat_discard = 10;

        best_attempt = { entropy: state_manager.max_entropy };
        if(state_manager.get_entropy() == state_manager.min_entropy) {
            return { entropy: 0, path: [] };
        }

        for(var i = 0; i < attempt_size; i++) {
            state_manager_copy = state_manager.clone();
            result = make_attempt(state_manager_copy);
            if(result.entropy < best_attempt.entropy) {
                best_attempt = result;
            }
            if(best_attempt.entropy == state_manager.min_entropy) break;
        }
        return best_attempt;
    };

    return {
        init: init,
        get_solution, get_solution,
        take_random_step: take_random_step
    };

}();

