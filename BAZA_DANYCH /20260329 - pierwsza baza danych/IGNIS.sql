CREATE TABLE `firefighter` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `user_id` int UNIQUE,
  `firefighter_status_id` int NOT NULL,
  `fire_station_id` int NOT NULL
);

CREATE TABLE `user` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `login` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `date_of_birth` date
);

CREATE TABLE `user_roles` (
  `user_id` int NOT NULL,
  `roles_id` int NOT NULL
);

CREATE TABLE `roles` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL
);

CREATE TABLE `date_of_entry` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `date_of_entry` date,
  `date_of_deletion` date,
  `firefighter_id` int UNIQUE NOT NULL,
  `resolution_id` int UNIQUE,
  `request_to_join_id` int UNIQUE
);

CREATE TABLE `awards_firefighter` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `firefighter_id` int NOT NULL,
  `awards_id` int NOT NULL,
  `date_received` date NOT NULL,
  `created_by_id` int NOT NULL,
  `date_log` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `awards` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL
);

CREATE TABLE `request_to_join` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `date_of_birth` date NOT NULL,
  `recommending_1_id` int NOT NULL,
  `recommending_2_id` int NOT NULL,
  `date_of_submission` date NOT NULL,
  `information` text,
  `created_by_id` int NOT NULL,
  `date_log` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `meeting` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `date` datetime NOT NULL,
  `type_board_meeting_id` int NOT NULL
);

CREATE TABLE `type_board_meeting` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL
);

CREATE TABLE `attendance_register` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `meeting_id` int NOT NULL,
  `firefighter_id` int NOT NULL
);

CREATE TABLE `invited_guests` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `meeting_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `option_vote` boolean DEFAULT false
);

CREATE TABLE `resolution` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `number_resolution` varchar(255) NOT NULL,
  `name` text NOT NULL,
  `date_resolution` date NOT NULL,
  `management_id` int NOT NULL,
  `status_resolution_id` int NOT NULL,
  `created_by_id` int NOT NULL,
  `date_log` timestamp DEFAULT CURRENT_TIMESTAMP,
  `vote_yes` int,
  `vote_no` int,
  `vote_suspending` int
);

CREATE TABLE `status_resolution` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255)
);

CREATE TABLE `vote_resolution` (
  `resolution_id` int NOT NULL,
  `attendance_register_id` int NOT NULL,
  `selected_voice_id` int NOT NULL
);

CREATE TABLE `selected_voice` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL
);

CREATE TABLE `management` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `start` date NOT NULL,
  `end` date NOT NULL,
  `fire_station_id` int NOT NULL
);

CREATE TABLE `members_management` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `firefighter_id` int NOT NULL,
  `management_id` int NOT NULL,
  `start` date NOT NULL,
  `end` date NOT NULL,
  `type_members_management_id` int NOT NULL
);

CREATE TABLE `type_members_management` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL
);

CREATE TABLE `training` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `training_name_id` int NOT NULL,
  `firefighter_id` int NOT NULL,
  `date_training` date NOT NULL,
  `date_next_training` date,
  `company_id` int,
  `created_by_id` int NOT NULL,
  `date_log` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `training_name` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL
);

CREATE TABLE `driving_licence` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `firefighter_id` int NOT NULL,
  `type_of_driving_licence_id` int NOT NULL,
  `obtain` date,
  `renewal` date NOT NULL,
  `created_by_id` int NOT NULL,
  `date_log` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `licences_for_emergency` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `firefighter_id` int NOT NULL,
  `licence_number` varchar(20) NOT NULL,
  `obtain` date NOT NULL,
  `renewal` date NOT NULL,
  `created_by_id` int NOT NULL,
  `date_log` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `type_of_driving_licence` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL
);

CREATE TABLE `firefighter_status` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL
);

CREATE TABLE `fire_station` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `year_of_establishment` date
);

CREATE TABLE `medical_examinations` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `medical_examinations` date NOT NULL,
  `next_medical_examinations` date,
  `firefighter_id` int NOT NULL,
  `person_id` int NOT NULL,
  `company_id` int NOT NULL,
  `created_by_id` int NOT NULL,
  `date_log` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `person` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255),
  `type_person_id` int NOT NULL,
  `created_by_id` int NOT NULL,
  `date_log` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `type_person` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL
);

CREATE TABLE `company` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `place_id` int,
  `house_number` int,
  `type_company_id` int NOT NULL,
  `opening_time` time,
  `closing_time` time,
  `link_to_google_maps` text,
  `fire_station_id` int,
  `created_by_id` int NOT NULL,
  `date_log` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `type_company` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255)
);

CREATE TABLE `phone` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `phone` int(9),
  `type_phone_id` int
);

CREATE TABLE `type_phone` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL
);

CREATE TABLE `phone_number_to_company` (
  `company_id` int NOT NULL,
  `phone_id` int NOT NULL,
  `created_by_id` int NOT NULL,
  `date_log` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `phone_number_to_person` (
  `person_id` int NOT NULL,
  `phone_id` int NOT NULL,
  `created_by_id` int NOT NULL,
  `date_log` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `firefighter_to_fire_station` (
  `fire_station_id` int NOT NULL,
  `firefighter_id` int NOT NULL
);

CREATE TABLE `person_company` (
  `company_id` int UNIQUE NOT NULL,
  `person_id` int UNIQUE NOT NULL
);

CREATE TABLE `card` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `departure_number` int(4) NOT NULL,
  `departure_date` date NOT NULL,
  `hour_departure` time NOT NULL,
  `hour_arrival` time NOT NULL,
  `place_id` int NOT NULL,
  `incident_id` int NOT NULL,
  `commander_id` int NOT NULL,
  `trip` int NOT NULL,
  `email_send_id` int NOT NULL,
  `type_card_id` int NOT NULL,
  `is_active` boolean DEFAULT true,
  `parent_card_id` int,
  `created_by_id` int NOT NULL,
  `date_log` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `email_send` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `date` date,
  `time` time,
  `email_status_id` int NOT NULL
);

CREATE TABLE `email_status` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL
);

CREATE TABLE `type_card` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL
);

CREATE TABLE `rate` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `type_card_id` int NOT NULL,
  `start` date NOT NULL,
  `end` date,
  `rate` int(3) NOT NULL,
  `created_by_id` int NOT NULL,
  `date_log` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `place` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `city_id` int NOT NULL,
  `street_id` int,
  `created_by_id` int NOT NULL,
  `date_log` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `city` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `fire_station_id` int NOT NULL,
  `created_by_id` int NOT NULL,
  `date_log` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `street` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `city_id` int NOT NULL,
  `created_by_id` int NOT NULL,
  `date_log` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `incident` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `incident_type_id` int NOT NULL,
  `created_by_id` int NOT NULL,
  `date_log` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `incident_type` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type_card_id` int NOT NULL
);

CREATE TABLE `garage` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `car_brand` varchar(255) NOT NULL,
  `car_model` varchar(255) NOT NULL,
  `date_car_production` date,
  `date_car_purchase` date,
  `car_operational_number` varchar(8),
  `car_markings` varchar(255),
  `places` int(2) NOT NULL,
  `status_vehicle_id` int NOT NULL,
  `type_of_driving_licence_id` int NOT NULL,
  `type_vehicle_id` int NOT NULL,
  `created_by_id` int NOT NULL,
  `date_log` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `vehicle_couplings` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `garage_id` int NOT NULL,
  `coupling_type_id` int NOT NULL
);

CREATE TABLE `coupling_type` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255)
);

CREATE TABLE `equipment_on_card` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `card_id` int NOT NULL,
  `garage_id` int NOT NULL,
  `towed_by_id` int
);

CREATE TABLE `status_vehicle` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_by_id` int NOT NULL,
  `date_log` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `type_vehicle` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL
);

CREATE TABLE `vehicle_to_card` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `card_id` int NOT NULL,
  `firefighter_id` int NOT NULL,
  `garage_id` int NOT NULL
);

CREATE TABLE `firefighter_action_role` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `vehicle_to_card_id` int NOT NULL,
  `type_function_id` int NOT NULL
);

CREATE TABLE `type_function` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL
);

CREATE TABLE `equipment` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `brand` varchar(255) NOT NULL,
  `model` varchar(255) NOT NULL,
  `date_production` date,
  `date_purchase` date,
  `category_equipment_id` int NOT NULL,
  `overview` boolean DEFAULT false,
  `created_by_id` int NOT NULL,
  `date_log` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `overview_log` (
  `date_overview_id` int NOT NULL,
  `garage_id` int,
  `equipment_id` int,
  `created_by_id` int NOT NULL,
  `date_log` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `date_overview` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `date_overview` date,
  `next_date_overview` date,
  `inspection_company_id` int NOT NULL,
  `inspection_person_id` int
);

CREATE TABLE `repair_log_company` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `equipment_id` int,
  `garage_id` int,
  `date_repair` date,
  `repair` text,
  `created_by_id` int NOT NULL,
  `date_log` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `category_equipment` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL
);

CREATE TABLE `uniform_inventory` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `item_id` int NOT NULL,
  `date_production` date,
  `date_purchase` date,
  `fire_station_id` int NOT NULL,
  `firefighter_id` int,
  `created_by_id` int NOT NULL,
  `date_log` timestamp DEFAULT CURRENT_TIMESTAMP,
  `is_active` boolean DEFAULT true
);

CREATE TABLE `item` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `brand` varchar(255) NOT NULL,
  `model` varchar(255),
  `category_item_id` int NOT NULL
);

CREATE TABLE `category_item` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL
);

CREATE TABLE `information` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `title` text NOT NULL,
  `text` text NOT NULL,
  `created_by_id` int NOT NULL,
  `date_log` timestamp DEFAULT CURRENT_TIMESTAMP,
  `is_active` boolean DEFAULT true,
  `fire_station_id` int NOT NULL
);

CREATE TABLE `event` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `title` text NOT NULL,
  `text` text NOT NULL,
  `date` datetime NOT NULL,
  `duration` time,
  `created_by_id` int NOT NULL,
  `date_log` timestamp DEFAULT CURRENT_TIMESTAMP,
  `is_active` boolean DEFAULT true,
  `fire_station_id` int NOT NULL
);

CREATE TABLE `registrations_to_event` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `firefighter_id` int NOT NULL,
  `date_log` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `membership_fees` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `firefighter_id` int NOT NULL,
  `year` year NOT NULL,
  `price_membership_fees_id` int NOT NULL,
  `date_of_payment` date NOT NULL,
  `status_payment` boolean DEFAULT false
);

CREATE TABLE `price_membership_fees` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `price` int,
  `resolution_id` int
);

ALTER TABLE `firefighter` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `training` ADD FOREIGN KEY (`training_name_id`) REFERENCES `training_name` (`id`);

ALTER TABLE `training` ADD FOREIGN KEY (`firefighter_id`) REFERENCES `firefighter` (`id`);

ALTER TABLE `firefighter` ADD FOREIGN KEY (`firefighter_status_id`) REFERENCES `firefighter_status` (`id`);

ALTER TABLE `firefighter_to_fire_station` ADD FOREIGN KEY (`fire_station_id`) REFERENCES `fire_station` (`id`);

ALTER TABLE `firefighter_to_fire_station` ADD FOREIGN KEY (`firefighter_id`) REFERENCES `firefighter` (`id`);

ALTER TABLE `phone_number_to_company` ADD FOREIGN KEY (`phone_id`) REFERENCES `phone` (`id`);

ALTER TABLE `phone_number_to_company` ADD FOREIGN KEY (`company_id`) REFERENCES `company` (`id`);

ALTER TABLE `company` ADD FOREIGN KEY (`type_company_id`) REFERENCES `type_company` (`id`);

ALTER TABLE `phone` ADD FOREIGN KEY (`type_phone_id`) REFERENCES `type_phone` (`id`);

ALTER TABLE `person_company` ADD FOREIGN KEY (`person_id`) REFERENCES `person` (`id`);

ALTER TABLE `medical_examinations` ADD FOREIGN KEY (`person_id`) REFERENCES `person` (`id`);

ALTER TABLE `medical_examinations` ADD FOREIGN KEY (`company_id`) REFERENCES `company` (`id`);

ALTER TABLE `person_company` ADD FOREIGN KEY (`company_id`) REFERENCES `company` (`id`);

ALTER TABLE `medical_examinations` ADD FOREIGN KEY (`firefighter_id`) REFERENCES `firefighter` (`id`);

ALTER TABLE `training` ADD FOREIGN KEY (`company_id`) REFERENCES `company` (`id`);

ALTER TABLE `date_of_entry` ADD FOREIGN KEY (`firefighter_id`) REFERENCES `firefighter` (`id`);

ALTER TABLE `date_of_entry` ADD FOREIGN KEY (`resolution_id`) REFERENCES `resolution` (`id`);

ALTER TABLE `management` ADD FOREIGN KEY (`fire_station_id`) REFERENCES `fire_station` (`id`);

ALTER TABLE `resolution` ADD FOREIGN KEY (`management_id`) REFERENCES `management` (`id`);

ALTER TABLE `members_management` ADD FOREIGN KEY (`management_id`) REFERENCES `management` (`id`);

ALTER TABLE `members_management` ADD FOREIGN KEY (`firefighter_id`) REFERENCES `firefighter` (`id`);

ALTER TABLE `members_management` ADD FOREIGN KEY (`type_members_management_id`) REFERENCES `type_members_management` (`id`);

ALTER TABLE `date_of_entry` ADD FOREIGN KEY (`request_to_join_id`) REFERENCES `request_to_join` (`id`);

ALTER TABLE `request_to_join` ADD FOREIGN KEY (`recommending_1_id`) REFERENCES `firefighter` (`id`);

ALTER TABLE `request_to_join` ADD FOREIGN KEY (`recommending_2_id`) REFERENCES `firefighter` (`id`);

ALTER TABLE `email_send` ADD FOREIGN KEY (`email_status_id`) REFERENCES `email_status` (`id`);

ALTER TABLE `card` ADD FOREIGN KEY (`email_send_id`) REFERENCES `email_send` (`id`);

ALTER TABLE `card` ADD FOREIGN KEY (`type_card_id`) REFERENCES `type_card` (`id`);

ALTER TABLE `person` ADD FOREIGN KEY (`type_person_id`) REFERENCES `type_person` (`id`);

ALTER TABLE `company` ADD FOREIGN KEY (`place_id`) REFERENCES `place` (`id`);

ALTER TABLE `company` ADD FOREIGN KEY (`fire_station_id`) REFERENCES `fire_station` (`id`);

ALTER TABLE `city` ADD FOREIGN KEY (`fire_station_id`) REFERENCES `fire_station` (`id`);

ALTER TABLE `street` ADD FOREIGN KEY (`city_id`) REFERENCES `city` (`id`);

ALTER TABLE `place` ADD FOREIGN KEY (`city_id`) REFERENCES `city` (`id`);

ALTER TABLE `place` ADD FOREIGN KEY (`street_id`) REFERENCES `street` (`id`);

ALTER TABLE `card` ADD FOREIGN KEY (`place_id`) REFERENCES `place` (`id`);

ALTER TABLE `card` ADD FOREIGN KEY (`commander_id`) REFERENCES `firefighter` (`id`);

ALTER TABLE `card` ADD FOREIGN KEY (`incident_id`) REFERENCES `incident` (`id`);

ALTER TABLE `incident` ADD FOREIGN KEY (`incident_type_id`) REFERENCES `incident_type` (`id`);

ALTER TABLE `incident_type` ADD FOREIGN KEY (`type_card_id`) REFERENCES `type_card` (`id`);

ALTER TABLE `rate` ADD FOREIGN KEY (`type_card_id`) REFERENCES `type_card` (`id`);

ALTER TABLE `garage` ADD FOREIGN KEY (`status_vehicle_id`) REFERENCES `status_vehicle` (`id`);

ALTER TABLE `garage` ADD FOREIGN KEY (`type_vehicle_id`) REFERENCES `type_vehicle` (`id`);

ALTER TABLE `vehicle_to_card` ADD FOREIGN KEY (`garage_id`) REFERENCES `garage` (`id`);

ALTER TABLE `vehicle_to_card` ADD FOREIGN KEY (`firefighter_id`) REFERENCES `firefighter` (`id`);

ALTER TABLE `vehicle_to_card` ADD FOREIGN KEY (`card_id`) REFERENCES `card` (`id`);

ALTER TABLE `awards_firefighter` ADD FOREIGN KEY (`awards_id`) REFERENCES `awards` (`id`);

ALTER TABLE `awards_firefighter` ADD FOREIGN KEY (`firefighter_id`) REFERENCES `firefighter` (`id`);

ALTER TABLE `driving_licence` ADD FOREIGN KEY (`firefighter_id`) REFERENCES `firefighter` (`id`);

ALTER TABLE `licences_for_emergency` ADD FOREIGN KEY (`firefighter_id`) REFERENCES `firefighter` (`id`);

ALTER TABLE `driving_licence` ADD FOREIGN KEY (`type_of_driving_licence_id`) REFERENCES `type_of_driving_licence` (`id`);

ALTER TABLE `garage` ADD FOREIGN KEY (`type_of_driving_licence_id`) REFERENCES `driving_licence` (`id`);

ALTER TABLE `firefighter_action_role` ADD FOREIGN KEY (`vehicle_to_card_id`) REFERENCES `vehicle_to_card` (`id`);

ALTER TABLE `firefighter_action_role` ADD FOREIGN KEY (`type_function_id`) REFERENCES `type_function` (`id`);

ALTER TABLE `vehicle_couplings` ADD FOREIGN KEY (`garage_id`) REFERENCES `garage` (`id`);

ALTER TABLE `vehicle_couplings` ADD FOREIGN KEY (`coupling_type_id`) REFERENCES `coupling_type` (`id`);

ALTER TABLE `equipment_on_card` ADD FOREIGN KEY (`garage_id`) REFERENCES `garage` (`id`);

ALTER TABLE `equipment_on_card` ADD FOREIGN KEY (`card_id`) REFERENCES `card` (`id`);

ALTER TABLE `equipment_on_card` ADD FOREIGN KEY (`towed_by_id`) REFERENCES `equipment_on_card` (`id`);

ALTER TABLE `phone_number_to_person` ADD FOREIGN KEY (`person_id`) REFERENCES `person` (`id`);

ALTER TABLE `phone_number_to_person` ADD FOREIGN KEY (`phone_id`) REFERENCES `phone` (`id`);

ALTER TABLE `card` ADD FOREIGN KEY (`parent_card_id`) REFERENCES `card` (`id`);

ALTER TABLE `overview_log` ADD FOREIGN KEY (`garage_id`) REFERENCES `garage` (`id`);

ALTER TABLE `overview_log` ADD FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`id`);

ALTER TABLE `overview_log` ADD FOREIGN KEY (`created_by_id`) REFERENCES `firefighter` (`id`);

ALTER TABLE `overview_log` ADD FOREIGN KEY (`date_overview_id`) REFERENCES `date_overview` (`id`);

ALTER TABLE `repair_log_company` ADD FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`id`);

ALTER TABLE `repair_log_company` ADD FOREIGN KEY (`garage_id`) REFERENCES `garage` (`id`);

ALTER TABLE `equipment` ADD FOREIGN KEY (`category_equipment_id`) REFERENCES `category_equipment` (`id`);

ALTER TABLE `uniform_inventory` ADD FOREIGN KEY (`firefighter_id`) REFERENCES `firefighter` (`id`);

ALTER TABLE `uniform_inventory` ADD FOREIGN KEY (`fire_station_id`) REFERENCES `fire_station` (`id`);

ALTER TABLE `uniform_inventory` ADD FOREIGN KEY (`item_id`) REFERENCES `item` (`id`);

ALTER TABLE `item` ADD FOREIGN KEY (`category_item_id`) REFERENCES `category_item` (`id`);

ALTER TABLE `user_roles` ADD FOREIGN KEY (`roles_id`) REFERENCES `roles` (`id`);

ALTER TABLE `user_roles` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `information` ADD FOREIGN KEY (`created_by_id`) REFERENCES `firefighter` (`id`);

ALTER TABLE `registrations_to_event` ADD FOREIGN KEY (`firefighter_id`) REFERENCES `firefighter` (`id`);

ALTER TABLE `registrations_to_event` ADD FOREIGN KEY (`event_id`) REFERENCES `event` (`id`);

ALTER TABLE `event` ADD FOREIGN KEY (`fire_station_id`) REFERENCES `fire_station` (`id`);

ALTER TABLE `information` ADD FOREIGN KEY (`fire_station_id`) REFERENCES `fire_station` (`id`);

ALTER TABLE `firefighter` ADD FOREIGN KEY (`fire_station_id`) REFERENCES `fire_station` (`id`);

ALTER TABLE `event` ADD FOREIGN KEY (`created_by_id`) REFERENCES `firefighter` (`id`);

ALTER TABLE `request_to_join` ADD FOREIGN KEY (`created_by_id`) REFERENCES `firefighter` (`id`);

ALTER TABLE `awards_firefighter` ADD FOREIGN KEY (`created_by_id`) REFERENCES `firefighter` (`id`);

ALTER TABLE `card` ADD FOREIGN KEY (`created_by_id`) REFERENCES `firefighter` (`id`);

ALTER TABLE `driving_licence` ADD FOREIGN KEY (`created_by_id`) REFERENCES `training` (`id`);

ALTER TABLE `place` ADD FOREIGN KEY (`created_by_id`) REFERENCES `firefighter` (`id`);

ALTER TABLE `city` ADD FOREIGN KEY (`created_by_id`) REFERENCES `firefighter` (`id`);

ALTER TABLE `street` ADD FOREIGN KEY (`created_by_id`) REFERENCES `firefighter` (`id`);

ALTER TABLE `medical_examinations` ADD FOREIGN KEY (`created_by_id`) REFERENCES `firefighter` (`id`);

ALTER TABLE `equipment` ADD FOREIGN KEY (`created_by_id`) REFERENCES `firefighter` (`id`);

ALTER TABLE `phone_number_to_company` ADD FOREIGN KEY (`created_by_id`) REFERENCES `firefighter` (`id`);

ALTER TABLE `person` ADD FOREIGN KEY (`created_by_id`) REFERENCES `firefighter` (`id`);

ALTER TABLE `garage` ADD FOREIGN KEY (`created_by_id`) REFERENCES `firefighter` (`id`);

ALTER TABLE `repair_log_company` ADD FOREIGN KEY (`created_by_id`) REFERENCES `firefighter` (`id`);

ALTER TABLE `status_vehicle` ADD FOREIGN KEY (`created_by_id`) REFERENCES `firefighter` (`id`);

ALTER TABLE `training` ADD FOREIGN KEY (`created_by_id`) REFERENCES `firefighter` (`id`);

ALTER TABLE `uniform_inventory` ADD FOREIGN KEY (`created_by_id`) REFERENCES `firefighter` (`id`);

ALTER TABLE `price_membership_fees` ADD FOREIGN KEY (`resolution_id`) REFERENCES `resolution` (`id`);

ALTER TABLE `membership_fees` ADD FOREIGN KEY (`price_membership_fees_id`) REFERENCES `price_membership_fees` (`id`);

ALTER TABLE `resolution` ADD FOREIGN KEY (`created_by_id`) REFERENCES `firefighter` (`id`);

ALTER TABLE `resolution` ADD FOREIGN KEY (`status_resolution_id`) REFERENCES `status_resolution` (`id`);

ALTER TABLE `vote_resolution` ADD FOREIGN KEY (`selected_voice_id`) REFERENCES `selected_voice` (`id`);

ALTER TABLE `vote_resolution` ADD FOREIGN KEY (`resolution_id`) REFERENCES `resolution` (`id`);

ALTER TABLE `attendance_register` ADD FOREIGN KEY (`firefighter_id`) REFERENCES `firefighter` (`id`);

ALTER TABLE `attendance_register` ADD FOREIGN KEY (`meeting_id`) REFERENCES `meeting` (`id`);

ALTER TABLE `meeting` ADD FOREIGN KEY (`type_board_meeting_id`) REFERENCES `type_board_meeting` (`id`);

ALTER TABLE `vote_resolution` ADD FOREIGN KEY (`attendance_register_id`) REFERENCES `attendance_register` (`id`);

ALTER TABLE `invited_guests` ADD FOREIGN KEY (`meeting_id`) REFERENCES `meeting` (`id`);
