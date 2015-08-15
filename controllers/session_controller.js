// MW de autorización de accesos HTTP restringidos

exports.loginRequired = function(req, res, next) {

	if (req.session.user) {
		next();
	} else {
		res.redirect('/login');
	}
};

// GET /login

exports.new = function(req, res) {

	var errors = req.session.errors || {};
	req.session.errors = {};

	res.render(
		'sessions/new.ejs'
		, {
			errors: errors
			, title: 'Quiz: login'
		}
	);
};


// POST /login

exports.create = function (req, res) {

	var login = req.body.login;
	var password = req.body.password;
	var userController = require('./user_controller');
	
	userController.autenticar(login, password, function(error, user){
	
		// si error retornar mensajes de error de sesión
		
		if (error) {
			req.session.errors = [
				{message: 'Se ha producido un error ' + error}
			];
			res.redirect('/login');
			return;
		}
		
		// crear req.session.user y guardar campos id, username
		// la sessión se define por la existencia de req.sesion.user
		
		req.session.user = {
			id: user.id
			, username: user.username
		};
		
		// redir a path anterior
		
		res.redirect(req.session.redir.toString());
	
	});	
	
};

// DELETE /logout

exports.destroy = function (req, res) {

	// destruir objeto session

	delete req.session.user;
	
	// redir a path anterior
	
	res.redirect(req.session.redir.toString());

};
