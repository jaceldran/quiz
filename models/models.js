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

// importar definiciones de tablas (models/...)

var Quiz = sequelize.import(path.join(__dirname, 'quiz'));
var Comment = sequelize.import(path.join(__dirname, 'comment'));

// configurar relaciones

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

// exportar definiciones de tablas

exports.Quiz = Quiz;
exports.Comment = Comment;

// crea e inicializa la tabla de preguntas en la bd
sequelize.sync().then(function() {
	// ejecuta manejador una vez creada la tabla
	Quiz.count().then(function(count) {		
		if (count===0) {		
			Quiz.create({
				pregunta: 'Capital de Italia'
				, respuesta: 'Roma'
				, tema: 'otro'
			});		
			Quiz.create({
				pregunta: 'Capital de Portugal'
				, respuesta: 'Lisboa'
				, tema: 'otro'
			})
			.then(function(){
				console.log('Base de datos inicializada')
			});			
		}		
	});
});
