CREATE TABLE person (
	id		 BIGINT GENERATED ALWAYS AS IDENTITY,
	email	 VARCHAR(512) NOT NULL,
	displayname	 VARCHAR(512) NOT NULL,
	department_id BIGINT NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE department (
	id		 BIGINT GENERATED ALWAYS AS IDENTITY,
	name	 VARCHAR(512) NOT NULL,
	description VARCHAR(512) NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE item (
	id			 BIGINT GENERATED ALWAYS AS IDENTITY,
	name			 VARCHAR(512) NOT NULL,
	price			 FLOAT(8) NOT NULL,
	isavailable		 BOOL NOT NULL,
	category		 VARCHAR(512) NOT NULL,
	sub_category		 VARCHAR(512),
	isworking		 BOOL NOT NULL,
	isdeprecated	BOOL NOT NULL DEFAULT FALSE,
	unit_manager_person_id BIGINT NOT NULL,
	department_id		 BIGINT NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE normal (
	person_id BIGINT,
	PRIMARY KEY(person_id)
);

CREATE TABLE unit_manager (
	isactive BOOL NOT NULL DEFAULT FALSE,
	person_id BIGINT,
	PRIMARY KEY(person_id)
);

CREATE TABLE administrator (
	person_id BIGINT,
	PRIMARY KEY(person_id)
);

CREATE TABLE item_details (
	chave			 VARCHAR(512) NOT NULL,
	valor			 VARCHAR(512) NOT NULL,
	data			 DATE NOT NULL,
	unit_manager_person_id BIGINT NOT NULL,
	item_id		 BIGINT NOT NULL
);

CREATE TABLE request (
	description	 VARCHAR(512) NOT NULL,
	person_id		 BIGINT NOT NULL,
	action_id		 INTEGER GENERATED ALWAYS AS IDENTITY,
	department_id	 BIGINT NOT NULL,
	action_dateofaction DATE NOT NULL,
	PRIMARY KEY(action_id)
);

CREATE TABLE return (
	isreturned		 BOOL NOT NULL,
	accept_response_action_id INTEGER UNIQUE NOT NULL,
	item_id		 BIGINT NOT NULL,
	person_id		 BIGINT NOT NULL,
	action_id		 INTEGER GENERATED ALWAYS AS IDENTITY,
	action_dateofaction DATE NOT NULL,
	PRIMARY KEY(action_id)
);

CREATE TABLE intervention (
	state			 VARCHAR(512) NOT NULL,
	item_id		 BIGINT NOT NULL,
	unit_manager_person_id BIGINT NOT NULL,
	action_id		 INTEGER GENERATED ALWAYS AS IDENTITY,
	action_dateofaction	 DATE NOT NULL,
	PRIMARY KEY(action_id)
);

CREATE TABLE accept (
	response_request_action_id	 INTEGER NOT NULL,
	response_person_id		 BIGINT NOT NULL,
	response_unit_manager_person_id BIGINT NOT NULL,
	response_action_id		 INTEGER GENERATED ALWAYS AS IDENTITY,
	response_action_dateofaction	 DATE NOT NULL,
	PRIMARY KEY(response_action_id)
);

CREATE TABLE refuse (
	response_request_action_id	 INTEGER NOT NULL,
	response_person_id		 BIGINT NOT NULL,
	response_unit_manager_person_id BIGINT NOT NULL,
	response_action_id		 INTEGER GENERATED ALWAYS AS IDENTITY,
	response_action_dateofaction	 DATE NOT NULL,
	PRIMARY KEY(response_action_id)
);

CREATE TABLE item_accept (
	item_id			 BIGINT,
	accept_response_action_id INTEGER ,
	PRIMARY KEY(item_id,accept_response_action_id)
);

CREATE TABLE unit_manager_return (
	unit_manager_person_id BIGINT NOT NULL,
	return_action_id	 INTEGER,
	PRIMARY KEY(return_action_id)
);

CREATE TABLE person_item (
	person_id BIGINT,
	item_id	 BIGINT,
	PRIMARY KEY(person_id,item_id)
);

CREATE TABLE label_details
(
    id serial PRIMARY KEY,
    category varchar(50),
    sub_category varchar(50),
	label varchar(50),
	details jsonb
);



ALTER TABLE person ADD CONSTRAINT person_fk1 FOREIGN KEY (department_id) REFERENCES department(id);
ALTER TABLE item ADD CONSTRAINT item_fk1 FOREIGN KEY (unit_manager_person_id) REFERENCES unit_manager(person_id);
ALTER TABLE item ADD CONSTRAINT item_fk2 FOREIGN KEY (department_id) REFERENCES department(id);
ALTER TABLE normal ADD CONSTRAINT normal_fk1 FOREIGN KEY (person_id) REFERENCES person(id);
ALTER TABLE unit_manager ADD CONSTRAINT unit_manager_fk1 FOREIGN KEY (person_id) REFERENCES person(id);
ALTER TABLE administrator ADD CONSTRAINT administrator_fk1 FOREIGN KEY (person_id) REFERENCES person(id);
ALTER TABLE item_details ADD CONSTRAINT item_details_fk1 FOREIGN KEY (unit_manager_person_id) REFERENCES unit_manager(person_id);
ALTER TABLE item_details ADD CONSTRAINT item_details_fk2 FOREIGN KEY (item_id) REFERENCES item(id);
ALTER TABLE request ADD CONSTRAINT request_fk1 FOREIGN KEY (person_id) REFERENCES person(id);
ALTER TABLE request ADD CONSTRAINT request_fk2 FOREIGN KEY (department_id) REFERENCES department(id);
ALTER TABLE return ADD CONSTRAINT return_fk1 FOREIGN KEY (accept_response_action_id) REFERENCES accept(response_action_id);
ALTER TABLE return ADD CONSTRAINT return_fk2 FOREIGN KEY (item_id) REFERENCES item(id);
ALTER TABLE return ADD CONSTRAINT return_fk3 FOREIGN KEY (person_id) REFERENCES person(id);
ALTER TABLE intervention ADD CONSTRAINT intervention_fk1 FOREIGN KEY (item_id) REFERENCES item(id);
ALTER TABLE intervention ADD CONSTRAINT intervention_fk2 FOREIGN KEY (unit_manager_person_id) REFERENCES unit_manager(person_id);
ALTER TABLE accept ADD CONSTRAINT accept_fk1 FOREIGN KEY (response_request_action_id) REFERENCES request(action_id);
ALTER TABLE accept ADD CONSTRAINT accept_fk2 FOREIGN KEY (response_person_id) REFERENCES person(id);
ALTER TABLE accept ADD CONSTRAINT accept_fk3 FOREIGN KEY (response_unit_manager_person_id) REFERENCES unit_manager(person_id);
ALTER TABLE refuse ADD CONSTRAINT refuse_fk1 FOREIGN KEY (response_request_action_id) REFERENCES request(action_id);
ALTER TABLE refuse ADD CONSTRAINT refuse_fk2 FOREIGN KEY (response_person_id) REFERENCES person(id);
ALTER TABLE refuse ADD CONSTRAINT refuse_fk3 FOREIGN KEY (response_unit_manager_person_id) REFERENCES unit_manager(person_id);
ALTER TABLE item_accept ADD CONSTRAINT item_accept_fk1 FOREIGN KEY (item_id) REFERENCES item(id);
ALTER TABLE item_accept ADD CONSTRAINT item_accept_fk2 FOREIGN KEY (accept_response_action_id) REFERENCES accept(response_action_id);
ALTER TABLE unit_manager_return ADD CONSTRAINT unit_manager_return_fk1 FOREIGN KEY (unit_manager_person_id) REFERENCES unit_manager(person_id);
ALTER TABLE unit_manager_return ADD CONSTRAINT unit_manager_return_fk2 FOREIGN KEY (return_action_id) REFERENCES return(action_id);
ALTER TABLE person_item ADD CONSTRAINT person_item_fk1 FOREIGN KEY (person_id) REFERENCES person(id);
ALTER TABLE person_item ADD CONSTRAINT person_item_fk2 FOREIGN KEY (item_id) REFERENCES item(id);
