var myApp = angular.module("myApp", ['ui.bootstrap']);

//MARK: ---- um yea i have no idea what this ish TRUELY does.
myApp.directive('focusOn', function() {
    return function(scope, elem, attr) {
        scope.$on('focusOn', function(e, name) {
            if (name === attr.focusOn) {
                elem[0].focus();
            }
        });
    };
});
myApp.factory('focus', function($rootScope, $timeout) {
    return function(name) {
        $timeout(function() {
            $rootScope.$broadcast('focusOn', name);
        });
    };
});

myApp.directive('confirm', function(ConfirmService) {
    return {
        restrict: 'A',
        scope: {
            eventHandler: '&ngClick'
        },
        link: function(scope, element, attrs){
          element.unbind("click");
          element.bind("click", function(e) {
            ConfirmService.open(attrs.confirm, scope.eventHandler);
          });
        }
    };
});
myApp.service('ConfirmService', function($modal) {
  var service = {};
  service.open = function (text, onOk) {
    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'ModalConfirmCtrl',
      resolve: {
        text: function () {
          return text;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      onOk();
    }, function () {
    });
  };

  return service;
});



myApp.controller('IndexController', ["$scope", "$document", "$http", "focus", function($scope, $document, $http, focus) {



    //TODO: MAKE SURE ANGULAR IS DONE WITH EVERYTHING BEFORE UPDATING DOM.

    getData();
    hoverFunctions();
    taskClickFunctions();
    filterClickFunctions();
    editDataButtonFunctions();
    initScopedVariables();
    menuButtonFunctions();



    function hoverFunctions() {
        $scope.hoverIn_edit = function(icon) {
            this.hoverEdit = true;
        };
        $scope.hoverOut_edit = function(icon) {

            this.hoverEdit = false;
        };
        $scope.hoverIn_comment = function(icon) {
            this.hoverComment = true;
        };
        $scope.hoverOut_comment = function(icon) {
            this.hoverComment = false;
        };

    }
    function taskClickFunctions() {
        $scope.checkboxClicked = function(isComplete, task_id) {
          var stati = {};
            switch (isComplete) {
                case true:
                    stati = {status: false};
                    break;
                case false:
                    stati = {status: true};
            }
            console.log('id to update comp', task_id);
            console.log('update tooo', stati);
            $http.put('/todoList/'+task_id, stati).then(function(){
              getData();
            });
        };
        $scope.labelClicked = function(label) {
            if (label !== "") {
                console.log("clicked", label);
            }
        };


    }
    function filterClickFunctions() {
        $scope.showAll = function() {
            getData();
        };
        $scope.clickedDateFilter = function(dateClicked) {
            switch (dateClicked) {
                case "nextThree":
                    console.log("next three filter clicked");
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
        $scope.clickedPriorityFilter = function(priorityClicked) {
            getData(priorityClicked);
        };
        $scope.clickedLabelFilter = function(theLabelClicked) {
            getData(theLabelClicked);
        };
        $scope.clickedCompletedFilter = function(status) {
            switch (status) {
                case 'complete':
                    getData('complete');
                    break;
                case 'uncomplete':
                    getData('uncomplete');
                    break;
                default:
                    break;
            }
        };


    }
    function editDataButtonFunctions() {
        $scope.delete = function(id) {
        $scope.deleteTask(id);
      };
        $scope.editTaskClicked = function(task) {
            $scope.popUp_Edit = false;
            $scope.currentPriority = task.task_priority + "";
            $scope.task_name = task.task_name;
            $scope.task_description = task.task_description;
            $scope.task_label = task.task_label;
            $scope.task_id = task.id;

            // console.log('editing ', task);
        };
        $scope.postEdits = function(task_name, task_description, task_label, priority, task_id) {
            var editedTask = {
                task_id: task_id,
                task_name: task_name,
                task_description: task_description,
                task_label: task_label,
                task_priority: priority * 1
            };

            $http.put('/editTask/' + task_id, editedTask).then(function(){
              $scope.popUp_Edit = true;
              getData();
            });

        };
        $scope.cancelEdits = function() {
            $scope.popUp_Edit = true;
        };
        $scope.deleteTask = function(task_id){


          $http.delete('/todolist/' + task_id).then(function(){
                      console.log("DELETE TASK@ID=", task_id);
                      getData();
                      $scope.popUp_Edit = true;


          });

        };

        $scope.addNewComment = function(task, taskCommentInput) {
            console.log('thistask', task.id);
            console.log('newcomment', taskCommentInput);

            $http.put('/editComment/' + task.id, {comment: taskCommentInput}).then(function(){
              console.log("update comment worked");
              getData();
            });
        };
        $scope.quickAddTask = function() {
            $scope.popUp_Add = false;
            focus('focusMe');
            console.log("working?");
        };
        $scope.cancelAddTask = function() {
            $scope.popUp_Add = true;
        };
        $scope.addNewTask = function(task) {
            var newTask = {};

            if (task !== undefined) {
                newTask = new Task(task.name, task.comment, task.label, task.priority);
                $scope.popUp_Add = true;
            }
            console.log('working', newTask);

            $http.post('/todoList', newTask).then(function(){
              getData();
            });
        };



    }
    function menuButtonFunctions() {
        $scope.menuButtonClicked = function() {
            $scope.popUp_Menu = false;
        };
        $scope.menuExitClicked = function() {
            $scope.popUp_Menu = true;
        };
    }
    function initScopedVariables() {
        $scope.popUp_Add = true;
        $scope.popUp_Edit = true;
        $scope.popUp_Menu = true;
    }

    function getData(orderBy) {
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
        $http.get('/todoList').then(
            function(data) {
                console.log('orderBy', orderBy);
                console.log(data);

                $scope.taskData.fullData = data.data;
                $scope.taskData.completed.isTrue = 0;
                $scope.taskData.completed.isFalse = 0;

                $scope.taskData.fullData.forEach(function(task, i) {
                    $scope.taskData.prioritys.push(task.task_priority);
                    $scope.taskData.labels.push(task.task_label);
                    if (task.task_completed === true) {
                        $scope.taskData.completed.isTrue++;
                    } else {
                        $scope.taskData.completed.isFalse++;
                    }

                });
                countLabels($scope.taskData.labels);
                countPrioritys($scope.taskData.prioritys);
                if (orderBy === undefined) {
                    console.log('vinilla task upload');
                    $scope.tasksToDisplay = $scope.taskData.fullData;
                } else {
                    switch (orderBy) {
                        case 'complete':
                            sortByCompleted($scope.taskData.fullData);
                            break;
                        case 'uncomplete':
                            sortByUncompleted($scope.taskData.fullData);
                            break;
                        case 'highToLow':
                        case 'lowToHigh':
                        case 'low':
                        case 'medium':
                        case 'high':
                        sortByPriority($scope.taskData.fullData,orderBy);
                        break;
                        default:
                            console.log('must be a label');
                            sortByLabel($scope.taskData.fullData, orderBy);


                    }
                }

            }
        );
    }

    function sortByPriority(taskData, priorityFilter){
      console.log(priorityFilter);
      var sortedArray = [];
      switch(priorityFilter){
        case 'highToLow':
          sortedArray = highToLow(taskData, 10, 0);
        break;
        case 'lowToHigh':
          sortedArray = lowToHigh(taskData);
        break;
        case 'low':
          sortedArray = highToLow(taskData, 3, 0);
          break;
          case 'medium':
            sortedArray = highToLow(taskData, 6, 4);
            break;
            case 'high':
              sortedArray = highToLow(taskData, 10, 7);
              break;
      }
      //TODO: TOGGLE HIGH TO LOW/LOW TO HIGH ON SECTIONS: DEFAULT HIGH TO LOW;
      $scope.tasksToDisplay = sortedArray;

    }
    function sortByLabel(taskData, labelFilter) {
        var sortedTasks = [];
        var labels = $scope.taskData.uniqueLabels;

        if (labelFilter != 'all' && labelFilter != 'unlabeled') {
            taskData.forEach(function(task, i) {
                if (task.task_label == labelFilter) {
                    sortedTasks.push(task);
                }
            });
        } else if (labelFilter == 'unlabeled') {
            taskData.forEach(function(task, i) {
                if (task.task_label === "") {
                    sortedTasks.push(task);
                }
            });
        } else if (labelFilter == 'all') {
            labels.forEach(function(label, i) {
                taskData.forEach(function(task, i) {

                    if (task.task_label == label) {
                        sortedTasks.push(task);
                    }
                });
            });
        } else {
            console.log("ERROR IN LABEL FILTER FUNCTION");
        }

        $scope.tasksToDisplay = sortedTasks;
    }
    function sortByCompleted(taskData) {
        var complete = [];
        var uncomplete = [];
        taskData.forEach(function(task, i) {
            if (task.task_completed === true) {
                complete.push(task);
            } else {
                uncomplete.push(task);
            }
        });

        uncomplete.forEach(function(task, i) {
            complete.push(task);
        });
        $scope.tasksToDisplay = complete;
    }
    function sortByUncompleted(taskData) {
        var complete = [];
        var uncomplete = [];
        taskData.forEach(function(task, i) {
            if (task.task_completed === true) {
                complete.push(task);
            } else {
                uncomplete.push(task);
            }
        });

        complete.forEach(function(task, i) {
            uncomplete.push(task);
        });
        $scope.tasksToDisplay = uncomplete;
    }
    function highToLow(data, start, end){
      var newArray = [];
      for(var i = start; i >= end; i--){
        data.forEach(function(task, j){ // jshint ignore:line
          if (task.task_priority == i){
            newArray.push(task);
          }
        });
      }
      return newArray;
    }
    function lowToHigh(data){
      var newArray = [];
      for(var i = 0; i <= 10; i++){
        data.forEach(function(task, j){ // jshint ignore:line
          if (task.task_priority == i){
            newArray.push(task);
          }
        });
      }
      return newArray;
    }

    function findLabels(allLabels) {
        var allCount = 0;
        $scope.taskData.uniqueLabels = _.uniq(allLabels);
        $scope.taskData.uniqueLabels.forEach(function(label, i) {
            if (label === "") {
                $scope.taskData.uniqueLabels[i] = "unlabeled";
            }
        });
        allLabels.forEach(function(label, i) {
            if (label !== "" && label != "unlabeled") {
                allCount++;
            }
        });
        $scope.taskData.allLabelsCount = allCount;

    }
    function countLabels(allLabels) {
        findLabels(allLabels);
        $scope.taskData.labelsCount = _.countBy(allLabels, function(theLabel) {
            var match = "";
            $scope.taskData.uniqueLabels.forEach(function(label, i) {
                if (theLabel === "") {
                    match = "unlabeled";
                }
                if (label === theLabel) {
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
                if (num > 9) {
                    return "10";
                }
                if (num === null) {
                    return "0";
                }
            }
        });
    }

    function Task(name, desc, labelPassed, priorityPassed) {
        // organize date object
        var comment = desc;
        if (desc === undefined) {
            comment = null;
        }

        var d = new Date(),
            dformat = [(d.getMonth() + 1).padLeft(),
                d.getDate().padLeft(),
                d.getFullYear()
            ].join('/') +
            ' ' + [d.getHours().padLeft(),
                d.getMinutes().padLeft(),
                d.getSeconds().padLeft()
            ].join(':');

        //check for blank label
        var label = labelPassed;
        if (label === undefined) {
            console.log('undefined label');
            label = "";
        }

        var priority = 0;
        if (priorityPassed !== undefined) {
            priority = priorityPassed * 1;
        } else {
            priority = 0;
        }

        this.task_name = name;
        this.task_date = dformat;
        this.task_description = comment;
        this.task_label = label;
        this.task_priority = priority;
        this.task_completed = false;
    }

}]);

myApp.controller('ModalConfirmCtrl', function ($scope, $modalInstance, text) {

  $scope.text = text;

  $scope.ok = function () {
    $modalInstance.close(true);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});


Number.prototype.padLeft = function(base, chr) {
    var len = (String(base || 10).length - String(this).length) + 1;
    return len > 0 ? new Array(len).join(chr || '0') + this : this;
};
