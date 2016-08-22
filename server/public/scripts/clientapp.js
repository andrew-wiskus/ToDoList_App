$(document).ready(function() {
    // loadTaskData("byLabels");
    loadTaskData("byCompleted");

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
    $('#task-list').on("click", ".delete_comment", function() {
        var clickedRow = $(this).parent().parent().attr("id");
        //TODO:delete comment
        console.log(clickedRow);
        $.ajax({
            type: 'PUT',
            url: '/editList/' + clickedRow,
            data: {
                task_description: ""
            },
            success: function() {

                $('#task-list').empty();
                loadTaskData("byCompleted");
            },
            error: function() {
                console.log("error in delete");
            }
        });

    });

    $('#task-list').on("click", "#cancel_comment", function() {
        var clickedRow = $(this).parent().parent().parent().attr("id");
        $('#taskComment' + clickedRow).hide();
    });
    $('#task-list').on("click", "#add_comment", function() {
        console.log("works");

        event.preventDefault();
        //TODO: change icon opacity via toggleClass.
        var clickedRow = $(this).parent().parent().parent().attr("id");
        description = {};

        $.each($('#addComment').serializeArray(), function(i, field) {
            description[field.name] = field.value;
        });



        $.ajax({
            type: 'PUT',
            url: '/editList/' + clickedRow,
            data: description,
            success: function() {
                console.log('/POST success function ran');
                //empty and repopulate #dataTable
                var taskDescription = description.task_description;


                $('#addComment').empty();
                $('#taskComment' + clickedRow + ' p').text(taskDescription);
                if (description.task_description !== "") {
                    $('#description' + clickedRow).toggleClass('hasDescription');
                }
                $('#editCurrentComment' + clickedRow).show();
            },
            error: function() {
                console.log('/POST didnt work');
            }

        });


    });
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
    $('#task-list').on("click", ".delete_yes", function() {
        var rowClicked = $(this).parent().parent().attr("id");
        $.ajax({
            type: 'DELETE',
            url: '/todoList/' + rowClicked,
            success: function() {
                console.log('DELETED ITEM: ID:', rowClicked);

                $('#task-list').empty();
                loadTaskData("byCompleted");
            },
            error: function() {
                console.log("error in delete");
            }
        });
    });
    $('#task-list').on("click", ".delete_no", function() {
        var clickedRow = $(this).parent().parent().attr("id");
        $('#editDisplay' + clickedRow).show();
        $('#confirmDelete' + clickedRow).hide();
    });
    $('#task-list').on("click", ".edit_Delete", function() {
        var rowClicked = $(this).parent().parent().attr("id");


        $('#editDisplay' + rowClicked).hide();
        $('#confirmDelete' + rowClicked).show();


    });
    $('#task-list').on("click", ".edit_Content", function() {

        var rowClicked = $(this).parent().parent().attr("id");

        $('#editDisplay' + rowClicked).hide();
        if ($('#editContent' + rowClicked).is(":visible") === true) {
            $('#editContent' + rowClicked).hide();
        } else {
            $('#editContent' + rowClicked).show();
        }

    });

    $('#task-list').on("click", "#editTask_cancel", function() {
        var rowClicked = $(this).parent().parent().parent().attr("id");
        $(this).parent().parent().parent().children().first().next().next().next().text("");
        $(this).parent().parent().parent().children().first().next().next().next().toggleClass("activeButton");
        console.log(this);
        console.log("works?");
        $('#editContent' + rowClicked).hide();

    });

    $('#task-list').on("click", "#editTask_confirm", function() {
        event.preventDefault();
        var taskData = {};
        var rowClicked = $(this).parent().parent().parent().attr("id");

        $.each($('#editContentForm' + rowClicked).serializeArray(), function(i, field) {
            taskData[field.name] = field.value;
        });

        $.ajax({
            type: 'PUT',
            url: '/editTask/' + rowClicked,
            data: taskData,
            success: function() {

                $('#task-list').empty();
                loadTaskData("byCompleted");
            },
            error: function() {
                console.log("error in delete");
            }
        });

        console.log("Works");
    });



});


function addTaskClick() {
    //TODO: stop reloading page to top/scrolling or w.e. seemless addition to page
    event.preventDefault();
    var taskData = {};

    $.each($('#addTask_form').serializeArray(), function(i, field) {
        taskData[field.name] = field.value;
    });

    if (taskData.task_priority === "") {
        taskData.task_priority = 0;
    }
    console.log("typedData:", taskData);


    $.ajax({
        type: 'POST',
        url: '/todoList',
        data: taskData,
        success: function() {
            console.log('/POST success function ran');
            //empty and repopulate #dataTable
            $('#task-list').empty();
            loadTaskData("byCompleted");
            $('#addTask_form').hide();


        },
        error: function() {
            console.log('/POST didnt work');
        }

    });

}

function commentIconClick() {
    var clickedRow = $(this).parent().attr("id");

    if ($('#taskComment' + clickedRow).text() === "" || $('#taskComment' + clickedRow).text() === null) {
        $('#taskComment' + clickedRow).append('<form id="addComment">' +
            '<div class="form-group">' +
            '<label class="commentInput" for="taskComment">Add Comment:</label>' +
            '<input type="text" id="task_description" name="task_description" class="task_description form-control" />' +
            '</div>' +
            '<button id="add_comment">Add Comment</button>' +
            '<a href="#" id="cancel_comment">Cancel</a>' +
            '</form>');
        $('#taskComment' + clickedRow).show();




    } else if ($('#taskComment' + clickedRow).is(":visible") === true) {
        $('#taskComment' + clickedRow).hide();
        $('#editCurrentComment' + clickedRow).hide();
        $(this).empty();

    } else {
        $(this).append();
        $('#taskComment' + clickedRow).show();
        $('#editCurrentComment' + clickedRow).show();
        if ($('#editDisplay' + clickedRow).is(":visible") === true) {
            $(this).parent().children().first().next().next().next().text("");
            $(this).parent().children().first().next().next().next().toggleClass("activeButton");
            $('#editDisplay' + clickedRow).hide();
        }
    }
}

function editIconClick() {
    var clickedRow = ($(this).parent().attr('id'));
    $(this).toggleClass("activeButton");
    //$('#confirmDelete'+ clickedRow).hide();
    if ($('#editDisplay' + clickedRow).is(":visible") === true) {
        $('#editDisplay' + clickedRow).hide();
        $(this).text("");
    } else if ($('#confirmDelete' + clickedRow).is(":visible") === true) {
        $('#confirmDelete' + clickedRow).hide();
        $('#editDisplay' + clickedRow).hide();
        $(this).text("");
    } else {
        $('#editDisplay' + clickedRow).show();
        $(this).text("Cancel");
        $('#taskComment' + clickedRow).hide();
        $('#editCurrentComment' + clickedRow).hide();
        //TODO: FIX THIS CANCEL BUTTON SO UGLY
    }

    if ($('#editContent' + clickedRow).is(":visible") === true) {
        $('#editContent' + clickedRow).hide();
    }
    //TODO: make listeners for edit/delete/cancel
    //TODO: make text input field for edit
    //TODO: delete request for delete
    //TODO: on cancel hide #editDisplay

}

function hideComments() {
    $('.taskCommentText').hide();
}

function loadTaskData(organizedBy) {
    $.ajax({
        type: 'GET',
        url: '/todoList',
        success: function(data) {
            console.log('/GET success function ran');
            var organizedArray = [];
            switch (organizedBy) {
                case "byCompleted":
                    var isComplete = [];
                    var notComplete = [];
                    data.forEach(function(rowData, i) {
                        if (rowData.task_completed === true) {
                            isComplete.push(rowData);
                        } else {
                            notComplete.push(rowData);
                        }
                    });
                    isComplete.forEach(function(rowData, i) {
                        notComplete.push(rowData);
                    });
                    organizedArray = notComplete;
                    break;
                case "byLabels":
                    var labelArray = [];
                    var labelArrayObject = {};
                    var labeledArray = [];
                    data.forEach(function(rowData,i){
                      var unique = true;
                      labelArrayObject.none = [];
                      if (rowData.task_label === ""){ rowData.task_label = "."; }
                      if (labelArray.length === 0) {

                        unique = true;
                      } else {
                      labelArray.forEach(function(label,i){
                        if (label == rowData.task_label){
                          unique = false;
                        }
                      });}
                      if (unique === true){
                        labelArray.push(rowData.task_label);
                        labelArrayObject[rowData.task_label] = [rowData];
                      } else {
                        labelArrayObject[rowData.task_label].push(rowData);
                      }

                  });
                    var noLabelArray = [];
                    labelArray.forEach(function(label,i){
                      console.log("LABEL",label);
                      labelArrayObject[label].forEach(function(rowData,i){
                        if (rowData.task_label == "."){
                          rowData.task_label = "";
                          noLabelArray.push(rowData);

                        }
                          else {
                          labeledArray.push(rowData);
                        }

                      });
                    });

                    noLabelArray.forEach(function(rowData,i){
                      labeledArray.push(rowData);
                    });

                    organizedArray = labeledArray;
                    break;

                default:
                    break;
            }
            organizedArray.forEach(function(rowData, i) {
                var taskDescription = "";
                var hasDescription = "";
                var isComplete = "";

                if (rowData.task_description !== "" && rowData.task_description !== null) {
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

                var $input1 = '<input type="text" id="task_name' + rowData.id + '" name="task_name" class="task_input form-control" />';
                var $input2 = '<input type="text" id="task_label' + rowData.id + '" placeholder="none" name="task_label" class="label_input form-control" />';
                var $input3 = '<input type="text" id="task_priority' + rowData.id + '" placeholder="" name="task_priority" class="priority_input form-control" />';


                var editContentString = '<form id="editContentForm' + rowData.id + '">' +
                    '<div class="form-group">' +
                    '<label class="taskLabel" for="taskName">Task:</label>' +
                    $input1 +
                    '<label class="taskLabel" for="task_Label">Label:</label>' +
                    $input2 +
                    '<label class="taskLabel" for="task_Priority">Priority:</label>' +
                    $input3 +
                    '</div>' +
                    '<button id="editTask_confirm">Confirm</button>' +
                    '<a href="#" id="editTask_cancel">Cancel</a>' +
                    '</form>';

                var $el = $('<div id="' + rowData.id + '"class="task-list-item"></div>');
                var appendString = '<span class="checkBox glyphicon glyphicon ' + isChecked + '"></span>' +
                    '<span class="task_name ' + isComplete + '">' + rowData.task_name + '</span>' +
                    '<span id ="description' + rowData.id + '" class="showDescription ' + hasDescription + ' glyphicon glyphicon-comment"></span>' +
                    '<span class="edit_icon glyphicon glyphicon-edit"></span>' +
                    '<span class="label_icon glyphicon glyphicon-asterisk"></span>' +
                    '<span class="task_label">' + rowData.task_label + '</span>' +
                    '<div id="taskComment' + rowData.id + '" class="taskComment"><p class="taskCommentText">' + taskDescription + '</p></div>' +
                    '<div id="editDisplay' + rowData.id + '" class="editDisplay"><a class="edit_Delete" href="#">Delete Task</a>//<a class="edit_Content" href="#">Edit Content</a></div>' +
                    '<div id="confirmDelete' + rowData.id + '" class="deleteDisplay"><span id="confirm_delete">Are you sure?:</span><a href="#" id ="' + rowData.id + '" class="delete_yes">Yes</a> / <a href="#" id ="' + rowData.id + '" class="delete_no">No</a></div>' +
                    '<div id="editCurrentComment' + rowData.id + '" class="editCurrentComment"> <a href="#" class="delete_comment" id="editComment' + rowData.id + '">-delete comment</a></div>' +
                    '<div id="editContent' + rowData.id + '" class="editContent">' + editContentString + '</div>' +
                    '<div id="underlineTask"></div>';

                $el.append(appendString);

                $('#task-list').append($el);
                //prepopulate
                $("#task_name" + rowData.id).val(rowData.task_name);
                $("#task_label" + rowData.id).val(rowData.task_label);
                $("#task_priority" + rowData.id).val(rowData.task_priority);

                $('.taskComment').hide();
                $('.editDisplay').hide();
                $('.deleteDisplay').hide();
                $('.editCurrentComment').hide();
                $('.editContent').hide();

            });
        },

        error: function(response) {
            console.log('GET /testRoute fail. No data could be retrieved!');
        },
    });
}
