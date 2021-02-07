const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

//Establecemos parametros de conexión
const conexion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "inventariodb",
});

//Probamos la conexión
conexion.connect(function (error) {
  if (error) {
    throw error;
  } else {
    console.log("conexión exitosa");
  }
});

app.get("/", function (req, res) {
  res.send("Ruta INICIO");
});

//Mostrar Registros
app.get("/api/articulos", (req, res) => {
  conexion.query("select * from articulos", (error, filas) => {
    if (error) {
      throw error;
    } else {
      res.send(filas);
    }
  });
});

//Mostrar un SOLO Registro
app.get("/api/articulos/:id", (req, res) => {
  conexion.query(
    "select * from articulos where id = ?",
    [req.params.id],
    (error, fila) => {
      if (error) {
        throw error;
      } else {
        res.send(fila);
      }
    }
  );
});

//Crear Registro
app.post("/api/articulos", (req, res) => {
  let data = {
    codigo: req.body.codigo,
    descripcion: req.body.descripcion,
    preciousd: req.body.preciousd,
    precioco: req.body.precioco,
    stock: req.body.stock,
  };
  let sql = "insert into articulos set ?";

  conexion.query(sql, data, function (error, results) {
    if (error) {
      throw error;
    } else {
      res.send(results);
    }
  });
});

//Editar Registro
app.put("/api/articulos/:id", (req, res) => {
  let id = req.params.id;
  let codigo = req.body.codigo;
  let descripcion = req.body.descripcion;
  let preciousd = req.body.preciousd;
  let precioco = req.body.precioco;
  let stock = req.body.stock;
  let sql =
    "UPDATE articulos SET codigo = ?, descripcion = ?, preciousd = ?, precioco = ?, stock = ? WHERE id = ? ";

  conexion.query(
    sql,
    [codigo, descripcion, preciousd, precioco, stock, id],
    function (error, results) {
      if (error) {
        throw error;
      } else {
        res.send(results);
      }
    }
  );
});

//Eliminar Registro
app.delete("/api/articulos/:id", (req, res) => {
  conexion.query(
    "DELETE FROM articulos WHERE id = ?",
    [req.params.id],
    function (error, filas) {
      if (error) {
        throw error;
      } else {
        res.send(filas);
      }
    }
  );
});

const puerto = process.env.PUERTO || 3000;

app.listen(puerto, function () {
  console.log("servidor Ok en puerto: " + puerto);
});
