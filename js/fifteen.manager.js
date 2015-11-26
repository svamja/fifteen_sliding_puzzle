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
        step_info = Fifteen.StateManager.apply_action(action);
        // Refresh the UI
        Fifteen.UI.refresh();
    };

    return {
        actions: actions,
        on_click: on_click,
    };

}();

