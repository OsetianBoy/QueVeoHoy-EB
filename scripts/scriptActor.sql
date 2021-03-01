USE queveohoydb;

CREATE TABLE `actor` (
    `id`  INT NOT NULL auto_increment,
    `nombre` VARCHAR(70),
    PRIMARY KEY (`id`)
);

CREATE TABLE `actor_pelicula` (
    `id`  INT NOT NULL auto_increment,
    `actor_id` INT(5),
    `pelicula_id` INT(5),
    PRIMARY KEY (`id`),
    FOREIGN KEY (`actor_id`) REFERENCES `actor` (`id`),
    FOREIGN KEY (`pelicula_id`) REFERENCES `pelicula` (`id`)    
);