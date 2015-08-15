var models = require('../models/models.js');

// autoload - si ruta incluye :commentId

exports.load = function(req, res, next, commentId) {

	models.Comment.find({
		where: {
			id: Number(commentId)
		}
	})
	.then (
		function(comment) {
			if (comment) {
				req.comment = comment;
				next(); // sigue ejecutando el MW que corresponda
			} else {
				next( new Error('No existe commentId=' + commentId) );
			}
		}
	).catch (
		function(error) { 
			next(error); 
		}
	);
};


// GET /quizes/:quizId/comments/:commentId/publish

exports.publish = function(req, res) {

	req.comment.publicado = true;
	
	req.comment
	.save(
		{fields: ['publicado']}
	)
	.then(
		function() {
			res.redirect('/quizes/'+req.params.quizId);
	}).catch( 
		function(error) {
			next(error);
	});
};

// GET /quizes/:quizId/comments/:commentId/unpublish

exports.unpublish = function(req, res) {

	req.comment.publicado = false;
	
	req.comment
	.save(
		{fields: ['publicado']}
	)
	.then(
		function() {
			res.redirect('/quizes/'+req.params.quizId);
	}).catch( 
		function(error) {
			next(error);
	});
};

// GET /quizes/:quizId/comments/new

exports.new = function(req, res) {
	res.render(
		'comments/new.ejs'
		, {
			quizId: req.params.quizId			
			, errors: []			
			, title: 'Quiz: Crear comentario'
			, quiz: req.quiz
		}
	);
};


// POST /quizes/quizId/comments

exports.create = function (req, res) {

	var comment = models.Comment.build({
		texto: req.body.comment.texto
		, QuizId: req.params.quizId
	});
	
	// guarda en bd
	// valida que no haya errores
	// luego redirect a pregunta actual

	comment
	.validate()
	.then( function (err) {
		if (err) {
			res.render('comments/new.ejs', {
				comment: comment
				, QuizId: req.params.quizId
				, errors: err.errors
				, title: 'Quiz: Crear comentario (error)'
				, quiz: req.quiz
			});
		} else {
			comment
			.save()
			.then( function() {				
				res.redirect('/quizes/'+req.params.quizId);
			});
		}
	}).catch( function(error) {	next(error)	} );	
};
