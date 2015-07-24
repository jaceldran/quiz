/*
 * definición del modelo de QUIZ
 */

module.exports = function (sequelize, DataTypes) 
{
	// parametros para definición
	
	var table = 'Quiz';
	
	var define = {
		pregunta: DataTypes.STRING
		, respuesta: DataTypes.STRING	
	};

	return sequelize.define(table, define);
};