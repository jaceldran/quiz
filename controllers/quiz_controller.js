var models = require('../models/models.js');

// DELETE /quizes/:id
// borrar el recurso
// luego redirect a lista de preguntas

exports.destroy = function (req, res) {

	req.quiz
	.destroy()
	.then( function() {
		res.redirect('/quizes');
	}).catch( function(error) {next(error)});
};

// PUT /quizes/:id
// guarda en bd
// valida que no haya errores
// luego redirect a lista de preguntas

exports.update = function (req, res) {

	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	req.quiz
	.validate()
	.then( function (err) {
		if (err) {
			res.render('quizes/edit', {
				quiz: req.quiz
				, title: 'Quiz: Actualizar pregunta'
				, errors: err.errors
			});
		} else {
			req.quiz
			.save ( {fields:['pregunta','respuesta','tema']} )
			.then ( function() {
				res.redirect('/quizes');
			});
		}
	});
	
};

// POST /quizes/create

exports.create = function (req, res) {

	var quiz = models.Quiz.build( req.body.quiz );
	
	// guarda en bd
	// valida que no haya errores
	// luego redirect a lista de preguntas

	quiz
	.validate()
	.then( function (err) {
		if (err) {
			res.render('quizes/new', {
				quiz: quiz
				, title: 'Quiz: Crear pregunta'
				, errors: err.errors
			});
		} else {
			quiz
			.save ( {fields:['pregunta','respuesta', 'tema']} )
			.then ( function() {
				res.redirect('/quizes');
			});
		}
	});
	
};

// GET /quizes/edit

exports.edit = function(req, res) {
	var quiz = req.quiz; // pq hay un autoload de quiz
	
	res.render('quizes/edit', {
		quiz: quiz
		, title: 'Quiz: Editar pregunta ' + quiz.id
		, errors: []
	});
};

// GET /quizes/new

exports.new = function(req, res) {
	var quiz = models.Quiz.build({
		pregunta: ''
		, respuesta: ''
	});
	
	res.render('quizes/new', {
		quiz: quiz
		, title: 'Quiz: Crear pregunta'
		, errors: []
	});
};

// autoload - factoriza el código si ruta incluye :quizId

exports.load = function(req, res, next, quizId) {

	// ajustar para que cuando cargue el quizId incorpore 
	// sus comentarios vinculados

	models.Quiz.find({
		where: {
			id: Number(quizId)
		}
		, include: [
			{model: models.Comment}
		]
	})
	.then (
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next(); // sigue ejecutando el MW que corresponda
			} else {
				next( new Error('No existe quizId=' + quizId) );
			}
		}
	).catch (
		function(error) { 
			next(error); 
		}
	);
};

// usa "then" en vez de "success"

// GET /quizes/:id

exports.show = function (req, res) {	
	models.Quiz.find(req.params.quizId).then(function(quiz) {
		res.render('quizes/show', {
			quiz: req.quiz
			, title: 'Quiz: Pregunta ' + quiz.id
			, errors: []
		});
	});
};

// GET /quizes/:id/answer

exports.answer = function (req, res) {
	models.Quiz.find(req.params.quizId).then(function(quiz) {		
	
		var resultado = 'Incorrecto';
		var respuesta = req.query.respuesta;
	
		if (respuesta === quiz.respuesta)	{
			resultado = 'Correcto';
		} 
		
		res.render(	'quizes/answer', {
			quiz: quiz
			, title: 'Quiz: Resultado pregunta ' + quiz.id
			, resultado:  resultado // resultado 
			, respuesta:  respuesta // respuesta dada
			, errors: []
		});
		
	});
};

// GET /quizes

exports.index = function (req, res) {	

	// por defecto se configura la query para ordenar
	// alfabéticamente por pregunta, independientemente
	// de si se realiza o no una búsqueda.

	var oQuery = {
		order: [['pregunta','ASC']]
	};

	// si recibe query de búsqueda, componer oSearch
	// para pasar al método findAll()

	if (req.query.search)
	{
		req.query.search = decodeURIComponent(req.query.search);
		var search = '%' +  req.query.search.replace(/\s/g, '%') + '%';
		oQuery.where = ["pregunta like ?", search];
	}	

	// aplicar búsqueda 	

	models.Quiz.findAll(oQuery)
	.then ( 
		function(quizes) {
		
			// asignar render de tema
			
			var texts = {
				otro: 'Otro'
				, humanidades: 'Humanidades'
				, ocio: 'Ocio'
				, ciencia: 'Ciencia'
				, teconologia: 'Tecnología'
			}
			
			for(index in quizes)
			{					
				quizes[index].tema_text =  texts[quizes[index].tema];
			}
		
			res.render('quizes/index', {
				quizes: quizes
				, title: 'Quiz: Preguntas'
				, errors: []
				, search: req.query.search || ''
			});
		}
	).catch ( 
		function error() { 
			next(error); 
		} 
	);
	
	
};
