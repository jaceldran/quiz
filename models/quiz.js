/*
 * definición de modelo quiz
 */

module.exports = function(sequelize, DataTypes) {

	var model = 'Quiz';
	
	var config = {
		pregunta: {
			type: DataTypes.STRING
			, validate: {
				notEmpty: {
					msg: 'Falta enunciado de Pregunta'
				}
			}
		}
		, respuesta: {
			type: DataTypes.STRING
			, validate: {
				notEmpty: {
					msg: 'Falta valor de Respuesta'
				}
			}
		}
		, tema: {
			type: DataTypes.STRING
			, validate: {
				notEmpty: {
					msg: 'Falta tema'
				}
			}
		}		
	};
	
	return sequelize.define (model, config);
}; 
 