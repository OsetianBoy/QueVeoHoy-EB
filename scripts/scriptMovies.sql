CREATE DATABASE queveohoydb;

USE queveohoydb;

CREATE TABLE genero (    
    id INT NOT NULL auto_increment,
    nombre VARCHAR(30),
    PRIMARY KEY (id)
);

CREATE TABLE pelicula (
    id INT NOT NULL auto_increment,
    titulo VARCHAR(100) NOT NULL,
    duracion INT(5) NOT NULL,
    director VARCHAR(400),
    anio INT(5),
    fecha_lanzamiento DATE,
    puntuacion INT(2),
    poster VARCHAR(300),
    trama VARCHAR(700),
    genero_id INT(2),
    PRIMARY KEY (id),
    FOREIGN KEY (genero_id) REFERENCES genero (id)
);
