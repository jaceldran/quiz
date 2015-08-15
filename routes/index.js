var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var statisticController = require('../controllers/statistic_controller');

// GET home page

router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

// configurar autoload

// si el param "quizId" viene en la ruta, entonces
// ejecutar el método "quizController.load"

router.param('quizId', quizController.load);

// si el param "commentId" viene en la ruta, entonces
// ejecutar el método "commentController.load"

router.param('commentId', commentController.load);

// rutas de sesión

router.get('/login', sessionController.new);
router.post('/login', sessionController.create);
router.get('/logout', sessionController.destroy);

// GET quizes/question y quizes/answer

router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

// solo para usuarios autenticados, lo que se 
// controla con el MW sessionController.loginRequired 

router.get('/quizes/new', sessionController.loginRequired, quizController.new);
router.post('/quizes/create', sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.destroy);

router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);

// este debería ser un PUT en vez de GET
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.loginRequired, commentController.publish);

router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/unpublish', sessionController.loginRequired, commentController.unpublish);

// GET author - página de créditos

router.get('/author', function(req, res) {
  res.render('author', { title: 'Quiz: Author', errors: [] });
});

// GET statistics - página de estadísticas

router.get(
	'/statistics'
	, statisticController.compute
	, statisticController.show
);

// module export

module.exports = router;
