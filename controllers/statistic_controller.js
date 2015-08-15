
// basado en
// https://github.com/Huertix/quiz-huertix-2015/blob/master/controllers/statistics_controller.js

var models = require('../models/models.js');
var Sequelize = require('sequelize');


exports.compute = function(req, res, next) {

	var counts = {};
	res.counts = {};

	models.Quiz.count().then(
		function(count) {
			counts.quizes = count;			
			return models.Comment.count();
		}		
	).then (
		function(count) {
			counts.comments = count
			return 	models.Comment.countUnpublished();
		}
	).then (
		function(count) {
			counts.unpublished = count;
			return 	models.Comment.countPublished();
		}
	).then (
		function(count) {
			counts.published = count;
			//res.counts['Comentarios publicados'] = count;
			//res.counts['Media de comentarios por pregunta'] = 
			//	(counts.comments / counts.quizes).toFixed(2);				
			return 	models.Comment.countCommentedQuizes();	
		}	
	).then (
		function(count) {
			counts.commented = count;
			//res.counts['Preguntas comentadas'] = count;
		}
	).then (
		function() {		
			res.counts['Total preguntas'] =counts.quizes;
			res.counts['Total comentarios'] = counts.comments;
			res.counts['Comentarios publicados'] = counts.published;
			res.counts['Comentarios no publicados'] = counts.published;
			res.counts['Preguntas comentadas'] = counts.commented;
			res.counts['Media de comentarios por pregunta'] = 
				(counts.comments / counts.quizes).toFixed(2);		
		}
	).catch(
		function(error) { 
			next(error); 
		}		
	).finally(
		function() {
			next();
		}
	);

};

exports.show = function(req, res) {

	res.render('quizes/statistics', {
		title: 'Quiz: Statistics'
		, counts: res.counts
		, errors: []
	})

};
