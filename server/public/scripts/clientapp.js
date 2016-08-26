var myApp = angular.module("myApp", []);

myApp.controller('IndexController', ["$scope", "$document", "$http", function($scope, $document, $http) {

    $scope.taskData = {
      fullData: [],
      prioritys: [],
      labels: [],
      uniqueLabels: [],
      labelsCount: [],
      priorityCount: [],
      completed: {
        isTrue: 0,
        isFalse: 0
      }
    };

    getData();


    function findLabels(allLabels){
      var allCount = 0;
      $scope.taskData.uniqueLabels = _.uniq(allLabels);
      $scope.taskData.uniqueLabels.forEach(function(label,i){
        if (label === ""){
          $scope.taskData.uniqueLabels[i] = "unlabeled";
        }
      });
      allLabels.forEach(function(label, i){
        if (label !== "" && label != "unlabeled"){
          allCount++;
        }
      });
      $scope.taskData.allLabelsCount = allCount;

    }
    function countLabels(allLabels){
      findLabels(allLabels);
      $scope.taskData.labelsCount = _.countBy(allLabels, function(theLabel) {
        var match = "";
        $scope.taskData.uniqueLabels.forEach(function(label,i){
          if (theLabel === ""){
            match = "unlabeled";
          }
          if (label === theLabel){
            match = label;
            return match;
          }

        });
        return match;
      });
    }
    function countPrioritys(priorityArray) {
        $scope.taskData.priorityCount = _.countBy(priorityArray, function(num) {
            for (var i = 0; i < 11; i++) {
                if (num == i) {
                    return i + "";
                }
                if (num > 9 ) {
                    return "10";
                }
                if (num === null){
                  return "0";
                }
            }
        });
    }
    function getData() {

        $http.get('/todoList').then(
            function(data) {
                console.log(data);
                $scope.taskData.fullData = data.data;
                $scope.taskData.completed.isTrue = 0;
                $scope.taskData.completed.isFalse = 0;

                $scope.taskData.fullData.forEach(function(task,i){
                  $scope.taskData.prioritys.push(task.task_priority);
                  $scope.taskData.labels.push(task.task_label);
                  if(task.task_completed === true){
                    $scope.taskData.completed.isTrue++;
                  } else {
                    $scope.taskData.completed.isFalse++;
                  }

                });
                countLabels($scope.taskData.labels);
                countPrioritys($scope.taskData.prioritys);
                console.log($scope.taskData);

            }
        );
    }

    $scope.clickedDateFilter = function(buttonClicked) {
        switch (buttonClicked) {
            case "history":
                console.log("history filter clicked");
                break;
            case "today":
                console.log("today filter clicked");
                break;
            case "nextSeven":
                console.log("next seven filter clicked");
                break;
            default:
                console.log("filter not working");
        }
    };

}]);




$(document).ready(function() {
    // loadTaskData("byLabels");
    loadTaskData("byCompleted");

    //hiddenElement
    $('#addTask_form').hide();

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



    $.ajax({
        type: 'POST',
        url: '/todoList',
        data: taskData,
        success: function() {

            //empty and repopulate #dataTable
            $('#task-list').empty();
            loadTaskData("byCompleted");
            $('#addTask_form').hide();


        },
        error: function() {

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

function loadTaskData(organizedBy, specific) {
    $.ajax({
        type: 'GET',
        url: '/todoList',
        success: function(data) {

            var organizedArray = [];
            if (specific !== undefined) {
                data.forEach(function(rowData, i) {
                    if (rowData.task_label == specific) {
                        organizedArray.push(rowData);
                    }
                });

            } else {
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
                        data.forEach(function(rowData, i) {
                            var unique = true;
                            labelArrayObject.none = [];
                            if (rowData.task_label === "") {
                                rowData.task_label = ".";
                            }
                            if (labelArray.length === 0) {

                                unique = true;
                            } else {
                                labelArray.forEach(function(label, i) {
                                    if (label == rowData.task_label) {
                                        unique = false;
                                    }
                                });
                            }
                            if (unique === true) {
                                labelArray.push(rowData.task_label);
                                labelArrayObject[rowData.task_label] = [rowData];
                            } else {
                                labelArrayObject[rowData.task_label].push(rowData);
                            }

                        });
                        var noLabelArray = [];
                        labelArray.forEach(function(label, i) {

                            labelArrayObject[label].forEach(function(rowData, i) {
                                if (rowData.task_label == "none") {
                                    rowData.task_label = "";
                                    noLabelArray.push(rowData);

                                } else {
                                    labeledArray.push(rowData);
                                }

                            });
                        });

                        noLabelArray.forEach(function(rowData, i) {
                            labeledArray.push(rowData);
                        });

                        organizedArray = labeledArray;
                        break;

                    default:
                        break;
                }



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


                // $('#labelList').hide();
                $('.taskComment').hide();
                $('.editDisplay').hide();
                $('.deleteDisplay').hide();
                $('.editCurrentComment').hide();
                $('.editContent').hide();

            });

        },

        error: function(response) {

        },
    });
}

function findLabels(data) {
    var labelArray = [];
    var labelArrayObject = {};
    var labeledArray = [];
    data.forEach(function(rowData, i) {
        var unique = true;
        labelArrayObject.none = [];
        if (rowData.task_label === "") {
            rowData.task_label = "none";
        }
        if (labelArray.length === 0) {

            unique = true;
        } else {
            labelArray.forEach(function(label, i) {
                if (label == rowData.task_label) {
                    unique = false;
                }
            });
        }
        if (unique === true) {
            labelArray.push(rowData.task_label);
            labelArrayObject[rowData.task_label] = [rowData];
        } else {
            labelArrayObject[rowData.task_label].push(rowData);
        }

    });

    return labelArray;
}

function appendLabels(labels) {
    labels.forEach(function(label, i) {
        if (label != "none" && label != "all") {
            $("#labelList").append('<li class="labelFilter" id="' + label + '">' + label + '</li>');
        }
    });
}
