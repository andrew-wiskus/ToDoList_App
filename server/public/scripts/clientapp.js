$(document).ready(function() {
    loadTaskData();

    //hiddenElement
    $('#addTask_form').hide();
    //hideComments();


    //listeners
    $('#addTask').on("click", function() {
        $('#addTask').hide();
        $('#addTaskLabel').hide();
        $('#addTask_form').show();
    });

    $('#addTaskLabel').on("click", function() {
        $('#addTask').hide();
        $('#addTaskLabel').hide();
        $('#addTask_form').show();
    });

    $('#addTaskButton').on("click", function() {
        event.preventDefault();
        var taskData = {};

        $.each($('#addTask_form').serializeArray(), function(i, field) {
            taskData[field.name] = field.value;
        });
        console.log("typedData:", taskData);

        $.ajax({
            type: 'POST',
            url: '/todoList',
            data: taskData,
            success: function() {
                console.log('/POST success function ran');
                //empty and repopulate #dataTable
                $('#task-list').empty();
                location.reload();

            },
            error: function() {
                console.log('/POST didnt work');
            }

        });

    });

    $('#cancel').on("click", function() {
        location.reload();
    });

});

function loadTaskData() {
    $.ajax({
        type: 'GET',
        url: '/todoList',
        success: function(data) {
            console.log('/GET success function ran');

            data.forEach(function(rowData, i) {
                var taskDescription = "";
                var hasDescription = "";
                if (rowData.task_description !== null) {
                    taskDescription = rowData.task_description;
                    hasDescription = "hasDescription";
                }


                console.log(rowData);
                var $el = $('<div id="' + rowData.id + '"class="task-list-item"></div>');
                var appendString = '<span class="checkBox glyphicon glyphicon glyphicon-unchecked"></span>' +
                    '<span class="task_name">' + rowData.task_name + '</span>' +
                    '<span class="showDescription ' + hasDescription + ' glyphicon glyphicon-comment"></span>' +
                    '<span class="label_icon glyphicon glyphicon-asterisk"></span>' +
                    '<span class="task_label">' + rowData.task_label + '</span>' +
                    '<div id="taskComment' + rowData.id + '" class="taskComment"><p class="taskCommentText">' + taskDescription + '</p></div>' +
                    '<div id="underlineTask"></div>';

                $el.append(appendString);

                $('#task-list').append($el);
            });
        },

        error: function(response) {
            console.log('GET /testRoute fail. No data could be retrieved!');
        },
    });
}
