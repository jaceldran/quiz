/*
 * definición de modelo Comment
 */

module.exports = function(sequelize, DataTypes) {

	var model = 'Comment';
	
	var config = {
		texto: {
			type: DataTypes.STRING
			, validate: {
				notEmpty: {
					msg: 'Falta texto del comentario'
				}
			}
		}
		, publicado: {
			type: DataTypes.BOOLEAN
			, defaultValue: false
		}
	};
	
	// basado en 
	// https://github.com/Huertix/quiz-huertix-2015/blob/master/models/comment.js
	
	var methods =  {
		classMethods: {
			countPublished: function() {
				return this.count({ 
					where: {publicado: true} 
				});
			}
			, countUnpublished: function() {
				return this.count({ 
					where: {publicado: false} 
				});
			}
			, countCommentedQuizes: function() {
				return this.aggregate(
					'QuizId'
					, 'count'
					, {distinct: true}
				)
			}
		}
	};
	
	return sequelize.define (model, config, methods);
}; 
 