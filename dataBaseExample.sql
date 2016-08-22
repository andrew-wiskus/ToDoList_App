CREATE TABLE taskList2 (
    id SERIAL PRIMARY KEY,
    task_name character varying(120),
    task_date integer,
    task_description character varying(600),
    task_label character varying(120),
    task_priority integer,
    task_completed boolean
);

-- this is the current tasks I have loaded
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('on orderbyLabel make dynamic dropdown','','',0,true);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('get rid of prepop on addtask from last add','','nitpick',0,false);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('adding task in filter should prepop label','','nitpick',0,false);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('add filters in nav','label/completed/priority ^ or \/','',4,true);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('make nav_midsec pretty','','design',0,true);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('test','test','test',1,true);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('when deleteing task in filtered view, stay there','','bug',4,false);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('when adding task stay in current filter','','bug',8,false);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('priority filter logic','','work',8,false);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('add priority visual element','','design',8,false);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('multiple label tags?','','future',8,false);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('add color picker to labels','hello how are you','future',1,false);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('change task_name fontsize for long tasks','','bug',0,false);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('on orderbyCompletion have show/hide option','','',0,true);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('completion filter logic','','work',8,false);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('have nav to go back to home, ordered by date','','design',8,false);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('find better color scheme','','design',8,false);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('edit content functionality','','work',9,true);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('color scheme picker','','future',8,false);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('righcorner nav expansion','','very future',2,false);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('amount of tasks(c/uc) in dynamic label filter','','design',2,false);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('build functionality for dates','','work',5,false);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('task_complete status','','work',9,true);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('delete function','','work',9,true);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('organize ur damn css','','nitpick',5,false);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('fix the auto scroll when pressing buttons','','bug',0,false);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('alert if no priority','','work',5,true);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('when adding comment needs 2 change icon','','nitpick',4,true);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('dont allow blank task','','bug',3,false);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('comment edit/delete functionality','','work',8,true);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('fix addtask complete bug','','',null,true);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('selected filter indicators!!','','bug',3,false);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('add priority to addTask form','','',null,true);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('Delete button confirm','','work',8,true);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('make comment if empty','','work',0,true);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('auto fill label when adding task in filter','','nitpick',3,false);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('edit content function','','work',7,true);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('order list by is compelted','','',0,true);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('order list by labels','','',null,true);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('click on label in task to filter labelID to top','','future',3,false);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('push db to heroku','','future',3,false);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('add edit/delete button in comments','harry was here','',0,true);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('add search bar','','future',3,false);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('double check addTask','','bug',0,true);
INSERT INTO taskList2 (task_name, task_description, task_label, task_priority, task_completed) VALUES ('fix addTask Label','','bug',0,true);
