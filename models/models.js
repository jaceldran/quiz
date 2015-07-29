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
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }      
);

/*// usar bbdd sqlite
var config = {
	dialect: 'sqlite'
	, storage: 'quiz.sqlite'
};
var sequelize = New Sequelize(null, null, null, config);*/

// importar definición de tabla Quiz (models/quiz.js)

var Quiz = sequelize.import(path.join(__dirname,'quiz'));

// exportar definicion de tabla Quiz

exports.Quiz = Quiz;

// crea e inicializa la tabla de preguntas en la bd
sequelize.sync().success(function() {
	// ejecuta manejador una vez creada la tabla
	Quiz.count().success(function(count) {		
		if (count===0) {		
			Quiz.create({
				pregunta: 'Capital de Italia'
				, respuesta: 'Roma'
			})
			.success(function(){
				console.log('Base de datos inicializada')
			});		
		}		
	});
});