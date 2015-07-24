// cargar path

var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// cargar modelo ORM

var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres

var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  dialect, // protocol (en el original)
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }      
);

// importar la definición de la tabla Quiz (quiz.js)

var Quiz = sequelize.import(path.join(__dirname,'quiz'));

// exportar definición de tabla Quiz

exports.Quiz = Quiz;

// sequelize.sync() crea e inicializa tabla de preguntas en DB

// utilizo la forma "then", inspirada en el código de jquemada
// porque la llamada mediante "success" no funciona, probablemente
// porque no he instalado la misma versión de sequelize.

sequelize.sync().then(function () {

	Quiz.count().then(function(count){
		
		// la tabla se inicializa solo si está vacía
		
		if (count===0)
		{
			Quiz.create({
				pregunta: 'Capital de Italia'
				, respuesta: 'Roma'
			}).then(function () {
				console.log('Base de datos inicializada');
			});
		}
		
	});

});
