$(document).ready(function() {
    loadTaskData();

    //hiddenElement
    $('#addTask_form').hide();



    //listeners
    //---------------------------------------------------------------
    //---------------add task functionality listeners----------------
    //---------------------------------------------------------------
    $('#addTaskButton').on("click", addTaskClick);
    $('#cancel').on("click", function() {
        //TODO: fix this..? shitty way to do this.
        location.reload();
    });
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
    //------------------------------------------------------------
    //--------------task item icon listeners----------------------
    //------------------------------------------------------------
    $('#task-list').on("click", ".showDescription", commentIconClick);
    $('#task-list').on("click", ".checkBox", function() {
        $(this).toggleClass('glyphicon-unchecked').toggleClass('glyphicon-check');
        $(this).parent().children().first().next().toggleClass('taskComplete');


        var statusID = $(this).parent().attr('id');
        var taskStatus = {};

        if ($(this).parent().children().first().next().hasClass('taskComplete')) {
            taskStatus.status = true;
        } else {
            taskStatus.status = false;
        }

        $.ajax({
            type: 'PUT',
            url: '/todoList/' + statusID,
            data: taskStatus,
            success: function() {},
            error: function() {

            }
        });
    });

    //---------------------------------------------------------------
    //--------------edit task functionality--------------------------
    //---------------------------------------------------------------
    $('#task-list').on("click", ".edit_icon", editIconClick);
    $('#task-list').on("click", ".edit_Delete", function() {
        var rowClicked = $(this).parent().parent().attr("id");

        $.ajax({
            type: 'DELETE',
            url: '/todoList/' + rowClicked,
            success: function() {
                console.log('DELETED ITEM: ID:', rowClicked);

                $('#task-list').empty();
                loadTaskData();
            },
            error: function() {
                console.log("error in delete");
            }
        });
    });



});


function addTaskClick() {
    //TODO: stop reloading page to top/scrolling or w.e. seemless addition to page
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

}

function commentIconClick() {
    var clickedRow = $(this).parent().attr("id");

    if ($('#taskComment' + clickedRow).text() === "") {
        console.log("blank");
        //TODO: append comment input field

    } else if ($('#taskComment' + clickedRow).is(":visible") === true) {
        $('#taskComment' + clickedRow).hide();
    } else {
        $('#taskComment' + clickedRow).show();
    }
}

function editIconClick() {
    var clickedRow = ($(this).parent().attr('id'));
    $(this).toggleClass("activeButton");
    if ($('#editDisplay' + clickedRow).is(":visible") === true) {
        $('#editDisplay' + clickedRow).hide();
        $(this).text("");
    } else {
        $('#editDisplay' + clickedRow).show();
        $(this).text("Cancel");
        //TODO: FIX THIS CANCEL BUTTON SO UGLY
    }

    //TODO: make listeners for edit/delete/cancel
    //TODO: make text input field for edit
    //TODO: delete request for delete
    //TODO: on cancel hide #editDisplay

}

function hideComments() {
    $('.taskCommentText').hide();
}

function loadTaskData() {
    $.ajax({
        type: 'GET',
        url: '/todoList',
        success: function(data) {
            console.log('/GET success function ran');

            data.forEach(function(rowData, i) {
                var taskDescription = "";
                var hasDescription = "";
                var isComplete = "";

                if (rowData.task_description !== null) {
                    taskDescription = rowData.task_description;
                    hasDescription = "hasDescription";
                }

                if (rowData.task_completed === false) {
                    isChecked = "glyphicon-unchecked";
                    isComplete = "";
                } else {
                    isChecked = "glyphicon-check";
                    isComplete = "taskComplete";
                }



                var $el = $('<div id="' + rowData.id + '"class="task-list-item"></div>');
                var appendString = '<span class="checkBox glyphicon glyphicon ' + isChecked + '"></span>' +
                    '<span class="task_name ' + isComplete + '">' + rowData.task_name + '</span>' +
                    '<span class="showDescription ' + hasDescription + ' glyphicon glyphicon-comment"></span>' +
                    '<span class="edit_icon glyphicon glyphicon-edit"></span>' +
                    '<span class="label_icon glyphicon glyphicon-asterisk"></span>' +
                    '<span class="task_label">' + rowData.task_label + '</span>' +
                    '<div id="taskComment' + rowData.id + '" class="taskComment"><p class="taskCommentText">' + taskDescription + '</p></div>' +
                    '<div id="editDisplay' + rowData.id + '" class="editDisplay"><a class="edit_Delete" href="#">Delete</a>//<a class="edit_Content" href="#">Edit Content</a></div>' +
                    '<div id="editComment' + rowData.id + '"></div>' +
                    '<div id="underlineTask"></div>';

                $el.append(appendString);

                $('#task-list').append($el);
                $('.taskComment').hide();
                $('.editDisplay').hide();

            });
        },

        error: function(response) {
            console.log('GET /testRoute fail. No data could be retrieved!');
        },
    });
}
