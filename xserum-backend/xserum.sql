drop database if exists `xserum`;
create database `xserum` default character set utf8 collate utf8_general_ci;
use `xserum`;

create table `account` (
    `node_id` int auto_increment primary key,
    `email` varchar(255) unique,
    `password` varchar(512),
    `name` varchar(20),
    `avatar` varchar(300),
    `created_at` datetime default current_timestamp
);

create table `otp` (
    `node_id` int auto_increment primary key,
    `token` varchar(6),
    `made_by` varchar(255),
    `created_at` datetime default current_timestamp,
    
    foreign key (made_by) references account(email) on update cascade on delete cascade
);

create table `premus` (
    `node_id` int auto_increment primary key,
    `type` VARCHAR(10),
    `image` varchar(300),
    `title` varchar(50),
    `description` varchar(100),
    `category` varchar(20),
    `made_by` varchar(255),
    `created_at` datetime default current_timestamp,
    
    foreign key (made_by) references account(email) on update cascade on delete cascade
);

CREATE TABLE `heart` (
    `node_id` int auto_increment primary key,
    `to` int,
    `made_by` varchar(255),
    `created_at` datetime default current_timestamp
);