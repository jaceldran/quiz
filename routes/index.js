var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

// GET home page

router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

// configurar autoload
// si el param "quizId" viene en la ruta, entonces
// ejecutar el m�todo "quizController.load"

router.param('quizId', quizController.load);

// GET quizes/question y quizes/answer

router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new', quizController.new);
router.post('/quizes/create', quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', quizController.edit);
router.put('/quizes/:quizId(\\d+)', quizController.update);
router.delete('/quizes/:quizId(\\d+)', quizController.destroy);


// GET author - p�gina de cr�ditos

router.get('/author', function(req, res) {
  res.render('author', { title: 'Quiz: Author', errors: [] });
});

// module export

module.exports = router;
