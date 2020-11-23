# ticketapp-api
```sql
create database ticketapp_db;
use ticketapp_db;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
create table users (id int primary key auto_increment,
 name varchar(100),email
varchar(100) not null,password varchar(30) NOT NULL, role char(5),
unique (email),
check ( role in ('USER','ADMIN')),
created_date timestamp not null default current_timestamp,
modified_date timestamp not null default current_timestamp on update current_timestamp
);
drop table users;


create table tickets(id bigint primary key auto_increment,ticketstatus varchar(50) default 'open',
title varchar(100),department char(50),
check ( department in ('Development','Sales','Networking','Csml')),
priority varchar(10), check ( priority in ('low','medium','high')),
description varchar(500),
mobile_number bigint, unique(mobile_number),
team_assign varchar(50),
created_by int,  
foreign key (created_by) references users(id),
created_date timestamp not null default current_timestamp,
modified_date timestamp not null default current_timestamp on update current_timestamp
);
drop table tickets;
select * from tickets;

create table team_assign(team char(50),
check ( team in ('Development Team','Sales Team','Networking Team','Csml Team','Hardware Team','Software Team')),
created_date timestamp not null default current_timestamp,
modified_date timestamp not null default current_timestamp on update current_timestamp
);
```
