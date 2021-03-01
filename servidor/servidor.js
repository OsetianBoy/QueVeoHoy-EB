var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var peliculasControlador = require('./controladores/peliculasControlador');



var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(express.static(__dirname + `/../public/`));

app.get('/', function(req, res){
  res.sendFile(`index.html`)
})

app.get('/peliculas/recomendacion', peliculasControlador.recomendarPelicula)
app.get('/peliculas', peliculasControlador.listarPeliculas)
app.get('/generos', peliculasControlador.listarGeneros)
app.get('/peliculas/:id', peliculasControlador.informacionPelicula);

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});

