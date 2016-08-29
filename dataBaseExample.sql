CREATE TABLE taskList (
    id SERIAL PRIMARY KEY,
    task_name character varying(120),
    task_date integer,
    task_description character varying(600),
    task_label character varying(120),
    task_priority integer,
    task_completed boolean
);
