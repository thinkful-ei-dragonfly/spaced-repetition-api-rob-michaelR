const express = require('express');
const LanguageService = require('./language-service');
const { requireAuth } = require('../middleware/jwt-auth');
const WordLinkedList = require('../LinkedList/LinkedList.js');

const languageRouter = express.Router();
const bodyParser = express.json();

languageRouter.use(requireAuth).use(async (req, res, next) => {
  try {
    const language = await LanguageService.getUsersLanguage(
      req.app.get('db'),
      req.user.id
    );

    if (!language)
      return res.status(404).json({
        error: `You don't have any languages`,
      });

    req.language = language;
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get('/', async (req, res, next) => {
  try {
    const words = await LanguageService.getLanguageWords(
      req.app.get('db'),
      req.language.id
    );

    res.json({
      language: req.language,
      words,
    });
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get('/head', async (req, res, next) => {
  // return the next quiz word to be asked
  try {
    const nextQuizWord = await LanguageService.getNextQuizWord(
      req.app.get('db'),
      req.language.head
    );
    res.status(200).json({
      nextWord: nextQuizWord.original,
      wordCorrectCount: nextQuizWord.correct_count,
      wordIncorrectCount: nextQuizWord.incorrect_count,
      totalScore: req.language.total_score,
    });
  } catch (e) {
    next(e);
  }
});

languageRouter.route('/guess').post(bodyParser, async (req, res, next) => {
  // console.log(req.body);
  if (!Object.keys(req.body).includes('guess')) {
    res.status(400).send({
      error: `Missing 'guess' in request body`,
    });
  }

  const words = await LanguageService.getLanguageWords(
    req.app.get('db'),
    req.language.id
  );
  console.log('words: ', words);
  const wordList = LanguageService.fillWordList(
    req.app.get('db'),
    req.language,
    words
  );

  // LanguageService.fillWordList(req.app.get('db'), req.language, wordList)
  //  .then(words => {
  if (req.body.guess === wordList.head.value.translation) {
    // NEED TO MOVE WORD M
    // iterate count up on server too??
    LanguageService.incrementMemory(wordList.head.value.id)
    res.status(200).json({
      nextWord: wordList.head.next.value.original, // EX: "test-next-word-from-incorrect-guess", need to check M instead?
      wordCorrectCount: wordList.head.value.correct_count,
      wordIncorrectCount: wordList.head.value.incorrect_count,
      totalScore: ++wordList.total_score,
      answer: req.body.guess, // EX: "test answer from correct guess"
      isCorrect: true,
    });
  } else {
    res.status(200).json({
      nextWord: wordList.head.next.value.original, // EX: 'test-next-word-from-incorrect-guess', need to check M instead?
      wordCorrectCount: wordList.head.value.correct_count,
      wordIncorrectCount: wordList.head.value.incorrect_count,
      totalScore: wordList.total_score,
      answer: req.body.guess, // EX: "test answer from incorrect guess"
      isCorrect: false,
    });
  }
});

module.exports = languageRouter;
