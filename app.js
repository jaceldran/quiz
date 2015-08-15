var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');
var routes = require('./routes/index');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// MW para gestionar vistas con layout
app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// helpers dinámicos
app.use( function(req, res, next) {
	
	// guardar path en session.redir para después de login
	
	if (!req.path.match(/\/login|\/logout/)) {
		req.session.redir = req.path;
	}	
	
	// hacer visible req.session en las vistas
	
	res.locals.session = req.session;	

	// auto-logout
	// aplica solo cuando hay usuario logado
	
	if (req.session.user) {

		// limite para auto-logout en milisegundos

		var limit = 2 * 60  * 1000; // 2 minutos
		var username = req.session.user.username;

		// registrar cuando se inicia la sesión

		if (req.session.start===undefined) {
			console.log('=>[APP-SESSION-START ' + username + ']');
			req.session.start = new Date().getTime();
		}
	
		// calcular duración de la sesión y comparar con el límite	
	
		var duration = new Date().getTime() - req.session.start;
		if (duration > limit) {
		
			console.log('=>[APP-AUTO-LOGOUT ' + username + ']');
			
			// reiniciar control de duración
			
			delete req.session.start;

			// [[ esto da error de "session undefined" (????)
			//var sessionController = require('./controllers/session_controller');
			//sessionController.destroy(); // ]]

			// como lo anterior no funciona, 
			// copio el código del método session_controller.destroy()
			// excepto el res.redirect que da error de "header sent"
			
			delete req.session.user;
		}
	}


	// next lo que sea
	// antes justo bajo la línea:  res.locals.session = req.session;

	next();
	
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use( function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
			errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
		errors: []
    });
});


module.exports = app;
