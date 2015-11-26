var matrix = [];
var matrix_size = 4;
var zero_i, zero_j;
var td_width, td_height;
var cell_spacing = 4;
var anim_path;
var anim_callback;

function fill_matrix() {
    for(i = 0; i < matrix_size; i++) {
        matrix[i] = [];
        for(j = 0; j < matrix_size; j++) {
            matrix[i][j] = i*matrix_size + j + 1;
        }
    }
    matrix[matrix_size - 1][matrix_size - 1] = 0;
    zero_i = zero_j = matrix_size - 1;
}

function create_table() {
    for(i = 0; i < matrix_size; i++) {
        $tr = $('<tr>');
        for(j = 0; j < matrix_size; j++) {
            $td = $('<td>');
            $td.data('i', i);
            $td.data('j', j);
            $tr.append($td);
        }
        $('#square').append($tr);
    }
}

function style_table() {

    $('#square').css({
        'borderSpacing': cell_spacing,
        'borderCollapse': 'separate'
    });

    td_width = (100/matrix_size) + '%';

    $('#square td').css({
        'padding': 10,
        // 'backgroundColor' : '#ee3',
        'textAlign': 'center',
        'width' : td_width,
        'height' : 70,
        'fontSize': '2em',
        'verticalAlign' : 'middle',
        // 'textShadow' : '2px 2px #eee'
    });

    height = $('#square').height();
    width = height;
    $('#square').width(width);

    $('#square').css({'margin' : 'auto'});
    $('#square').css({'marginTop' : '60px'});

    td_width = $('#square td').eq(0).width();
    td_height = $('#square td').eq(0).height();

}

function refresh_table() {
    $('#square td').css({ 
        // 'position' : 'static',
        'top' : 0,
        'left' : 0,
    });
    $('#square tr').each(function(i, tr) {
        $(tr).find('td').each(function(j, td) {
            if(matrix[i][j] == 0) {
                $(td).html("").css({'backgroundColor' : '#eea'});
            }
            else {
                $(td).html(matrix[i][j]).css({'backgroundColor' : '#ee3'});
            }
        })
    })
}

function neighbors(i,j) {
    var neighbors = {
        'top' : -1,
        'left' : -1,
        'right' : -1,
        'bottom' : -1,
    };
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

}

function swap(i1, j1, i2, j2) {
    v1 = matrix[i1][j1];
    v2 = matrix[i2][j2];
    matrix[i1][j1] = v2;
    matrix[i2][j2] = v1;
}

function clickable(i, j) {
    n = neighbors(i,j);
    if(n.top != 0 && n.left != 0 && n.right != 0 && n.bottom != 0) {
        return false;
    }
    return true;
}

function shift_cell(i, j, n) {
    if(n.top != 0 && n.left != 0 && n.right != 0 && n.bottom != 0) {
        return;
    }
    if(n.top == 0){
        swap(i, j, i-1, j);
    }
    if(n.bottom == 0){
        swap(i, j, i+1, j);
    }
    if(n.left == 0){
        swap(i, j, i, j-1);
    }
    if(n.right == 0){
        swap(i, j, i, j+1);
    }
}

function click_cell(i, j) {
    n = neighbors(i,j);
    shift_cell(i,j,n);
    zero_i = i;
    zero_j = j;
    refresh_table();    
}

function on_click() {
    i = $(this).data('i');
    j = $(this).data('j');
    click_cell(i, j);
    get_entropy();
}

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


function get_movements(i, j) {
    var movements = {
        'top' : false,
        'left' : false,
        'right' : false,
        'bottom' : false,
    };
    if(i > 0) movements['top'] = true;
    if(j > 0) movements['left'] = true;
    if(i < matrix_size - 1) movements['bottom'] = true;
    if(j < matrix_size - 1) movements['right'] = true;
    return movements;
}

function get_other_cell(i, j, movement_type) {
    if(movement_type == 'top'){
        new_i = i-1;
        new_j = j;
    }
    if(movement_type == 'bottom'){
        new_i = i+1;
        new_j = j;
    }
    if(movement_type == 'left'){
        new_i = i;
        new_j = j-1;
    }
    if(movement_type == 'right'){
        new_i = i;
        new_j = j+1;
    }
    return { i: new_i, j: new_j };
}

function shift_blank(movement_type) {
    new_cell = get_other_cell(zero_i, zero_j, movement_type);
    swap(zero_i, zero_j, new_cell.i, new_cell.j);
    zero_i = new_cell.i;
    zero_j = new_cell.j;
}

function apply_random_path(path_size) {
    if(path_size == undefined) path_size = 10;
    movement_types = ['top', 'left', 'right', 'bottom'];
    opposites = ['bottom', 'right', 'left', 'top'];
    len = 0;
    path = [];
    entropies = [];
    prev_index = 0;
    while(true) {
        index = getRandomInt(0, 4);
        r_movement  = movement_types[index];
        if(r_movement == opposites[prev_index]) continue;
        movements = get_movements(zero_i, zero_j);
        if(movements[r_movement] == false) continue;
        shift_blank(r_movement);
        entropies.push(get_entropy());
        path.push(r_movement);
        prev_index = index;
        if(len++ >= path_size - 1) break;
    }
    return {
        path: path,
        entropies: entropies
    };
}

function random_path(path_size) {
    orig_matrix = jQuery.extend(true, {}, matrix);
    orig_zeros = [zero_i, zero_j];

    result = apply_random_path();

    matrix = orig_matrix;
    zero_i = orig_zeros[0];
    zero_j = orig_zeros[1];
    return result.path;
}

function next_animation() {

    if(anim_path.length == 0) {
        if(anim_callback != undefined) {
            anim_callback();
        }
        return;
    }

    $('#square td').css({ 'position' : 'relative' });
    displacement = $('#square td:first').outerHeight() + cell_spacing;
    movement = anim_path.shift();
    new_cell = get_other_cell(zero_i, zero_j, movement);
    cell_index = new_cell.i*matrix_size + new_cell.j;
    $tds = $('#square td');
    $tds.css({ 'zIndex' : 1 });
    $tds.eq(cell_index).css({ 'zIndex' : 5 });
    if(movement == 'top') {
        anim_target = { 'top' : displacement };
    }
    if(movement == 'bottom') {
        anim_target = { 'top' : -displacement };
    }
    if(movement == 'left') {
        anim_target = { 'left' : displacement };
    }
    if(movement == 'right') {
        anim_target = { 'left' : -displacement };
    }
    $tds.eq(cell_index).animate(anim_target, 200, 'swing', function() {
        swap(zero_i, zero_j, new_cell.i, new_cell.j);
        zero_i = new_cell.i;
        zero_j = new_cell.j;
        refresh_table();
        next_animation();
    });
}

function animate_path(path, callback) {
    anim_path = path;
    anim_callback = callback;
    next_animation();
}

function randomize() {
    path_size = 10;
    $('#status_text').html('randomizing: ' + path_size + ' steps ..');
    path = random_path(path_size);
    animate_path(path, function() {
        entropy = get_entropy();
        $('#status_text').html('randomization over: ' + entropy);
    });
}

function get_entropy() {
    entropy = 0;
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
                num_entropy += Math.abs(zero_i - number_i) + Math.abs(zero_j - number_j);
            }
            entropy += num_entropy;
        }
    }
    return entropy;
}

function get_solution_path() {

    orig_matrix = jQuery.extend(true, {}, matrix);
    orig_zeros = [zero_i, zero_j];


    if(get_entropy() == 0) {
        return [];
    }

    for(p = 0; p < 400; p++) { // Attempts

        solution_path = [];
        matrix = orig_matrix;
        zero_i = orig_zeros[0];
        zero_j = orig_zeros[1];

        prev_entropy = 999;
        start_time = new Date().getTime();
        status_quo_count = 0;

        for(k = 0; k < 100; k++) { // Advancements

            if(k % 100 == 0) {
                time = new Date().getTime();
                if(time - start_time > 500) {
                    break;
                }
            }

            $('#status_text').html('iteration ' + (k+1));
            min_entropy = 99999;
            min_path = [];
            min_matrix = [];

            iter_matrix = jQuery.extend(true, {}, matrix);
            iter_zeros = [zero_i, zero_j];

            for(m = 0; m < 6; m++) { // Alternative

                matrix = jQuery.extend(true, {}, iter_matrix);
                zero_i = iter_zeros[0];
                zero_j = iter_zeros[1];
                step_size = getRandomInt(4, 10);
                result = apply_random_path(step_size);

                // console.log("alternative", m, result.path, result.entropies);

                for(n = 0; n < step_size; n++) { // Steps within alternative
                    if(result.entropies[n] == 0) {
                        matrix = orig_matrix;
                        zero_i = orig_zeros[0];
                        zero_j = orig_zeros[1];
                        solution_path = solution_path.concat(result.path.slice(0, n+1));
                        return solution_path;
                    }
                }
                entropy = result.entropies[step_size - 1];
                if(entropy < min_entropy) {
                    min_matrix = jQuery.extend(true, {}, matrix);
                    min_zeros = [zero_i, zero_j];
                    min_entropy = entropy;
                    min_path = result.path;
                }
            }

            // console.log("iter", k, min_path, min_entropy, prev_entropy);

            // If entropy is decreased, apply it to solution
            if(min_entropy < prev_entropy || status_quo_count >= 10) {
                status_quo_count = 0;
                matrix = min_matrix;
                zero_i = min_zeros[0];
                zero_j = min_zeros[1];
                solution_path = solution_path.concat(min_path);
                prev_entropy = min_entropy;
            }
            else {
                status_quo_count++;
                matrix = iter_matrix;
                zero_i = iter_zeros[0];
                zero_j = iter_zeros[1];            
            }

            if(min_entropy == 0) {
                break;
            }

            // break;

        }
    }

    console.log('iteration count: ' + k);

    matrix = orig_matrix;
    zero_i = orig_zeros[0];
    zero_j = orig_zeros[1];

    return solution_path;
}

function solve() {
    $('#status_text').html('solving ..');
    path = get_solution_path();
    $('#status_text').html('solution size: ' + path.length + ' steps. playing ..');
    animate_path(path, function() {
        $('#status_text').html('solution complete');
    });
}

$(function() {

    create_table();
    fill_matrix();
    refresh_table();
    style_table();

    $('#square td').click(on_click);
    $('#btn_randomize').click(randomize);
    $('#btn_solve').click(solve);

    // entropy = get_entropy();


    // refresh_table();
    // console.log(path);


})

