/*
 * definición de modelo quiz
 */

module.exports = function(sequelize, DataTypes) 
{
	var model = 'Quiz';
	var config = {
		pregunta: DataTypes.STRING
		, respuesta: DataTypes.STRING
	};
	return sequelize.define (model, config);
}; 
 