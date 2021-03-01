var con = require("../lib/conexionbd");

function listarPeliculas(req, res) {
  var sql = "SELECT * FROM pelicula";
  var anio = req.query.anio;
  var genero = req.query.genero;
  var titulo = req.query.titulo;
  var orden = req.query.tipo_orden;
  var columnaOrden = req.query.columna_orden;
  var pagina = req.query.pagina;
  var cantidad = req.query.cantidad;

  sql += `
        ${anio || genero || titulo ? " WHERE " : ""}
        ${anio ? `anio = ${anio}` : ""}
        ${anio && (genero || titulo) ? ` AND ` : ""}
        ${genero ? `genero_id = ${genero}` : ""}
        ${genero && titulo ? ` AND ` : ""}
        ${titulo ? ` titulo like "%${titulo}%"` : ""}
    `;

  sql += `
        ORDER BY ${columnaOrden} ${orden}
    `;

  sqlLimited = sql.concat(` 
        LIMIT ${(pagina - 1) * cantidad},${cantidad}
    `);

  con.query(sql, function (error, resultado, fields) {
    if (error) {
      console.log("Hubo un error en la consulta 1", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }

    con.query(sqlLimited, function (
      errorLimited,
      resultadoLimited,
      fieldsLimited
    ) {
      if (errorLimited) {
        console.log("Hubo un error en la consulta 2", errorLimited.message);
        return res.status(404).send("Hubo un error en la consulta");
      }
      var respuesta = {
        peliculas: resultadoLimited,
        total: resultado.length,
        paginaActual: pagina
      };

      res.send(JSON.stringify(respuesta));
    });
  });
}

function listarGeneros(req, res) {
  var sql = "SELECT * FROM genero;";

  con.query(sql, function (error, resultado, fields) {
    if (error) {
      console.log("Hubo un error en la consulta 3", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }

    var response = {
      generos: resultado
    };

    res.send(JSON.stringify(response));
  });
}

function informacionPelicula(req, res) {
  let idPelicula = req.params.id;
  let sqlPelicula = `SELECT * FROM pelicula INNER JOIN genero ON genero_id = genero.id WHERE pelicula.id = ${idPelicula}`;

  con.query(sqlPelicula, function (error, resultado, fields) {
    if (error) {
      console.log("Hubo un error en la consulta 4", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }

    let sqlActores = `SELECT * FROM actor_pelicula INNER JOIN actor ON actor_id = actor.id WHERE pelicula_id = ${idPelicula}`;

    con.query(sqlActores, function (error, resultadoActores, fields) {
      if (error) {
        console.log("Hubo un error en la consulta 5", error.message);
        return res.status(404).send("Hubo un error en la consulta");
      }

      let response = {
        pelicula: resultado[0],
        genero: resultado[0].nombre,
        actores: resultadoActores
      };

      res.send(JSON.stringify(response));
    });
  });
}

function recomendarPelicula(req, res) {
  let genero = req.query.genero;
  let anio_inicio = req.query.anio_inicio;
  let anio_fin = req.query.anio_fin;
  let puntuacion = req.query.puntuacion;
  let sql = `SELECT * FROM pelicula`;
  let sqlConGenero = `SELECT pelicula.id, pelicula.poster, pelicula.trama FROM pelicula`;

  let parametros = [
    {
      nombre: "genero",
      valor: genero,
      query: ` INNER JOIN genero ON pelicula.genero_id = genero.id WHERE genero.nombre = "${genero}"`
    },
    {
      nombre: "anio_inicio",
      valor: anio_inicio,
      query: ` AND pelicula.anio BETWEEN ${anio_inicio}`,
      querySinGenero: ` WHERE anio BETWEEN ${anio_inicio}`
    },
    {
      nombre: "anio_fin",
      valor: anio_fin,
      query: ` AND ${anio_fin}`,
      querySinGenero: ` AND ${anio_fin}`
    },
    {
      nombre: "puntuacion",
      valor: puntuacion,
      query: ` AND pelicula.puntuacion = ${puntuacion}`,
      querySinGenero: ` AND puntuacion = ${puntuacion}`
    }
  ];

  parametros.forEach(elemento => {
    if (genero) {
      if (elemento.valor !== "" && elemento.valor !== undefined) {
        sqlConGenero += elemento.query;
        sql = sqlConGenero;
      }
    } else if (puntuacion && !anio_inicio && !anio_fin) {
      sql = `SELECT * FROM pelicula WHERE puntuacion = ${puntuacion}`;
    } else {
      if (elemento.valor !== "" && elemento.valor !== undefined) {
        sql += elemento.querySinGenero;
      }
    }
  });

  con.query(sql, function (error, resultado, fields) {
    if (error) {
      console.log("Hubo un error en la consulta66", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
    let response = {
      peliculas: resultado,
    };

    res.send(JSON.stringify(response));
  });
}

module.exports = {
  listarPeliculas: listarPeliculas,
  listarGeneros: listarGeneros,
  informacionPelicula: informacionPelicula,
  recomendarPelicula: recomendarPelicula
};
