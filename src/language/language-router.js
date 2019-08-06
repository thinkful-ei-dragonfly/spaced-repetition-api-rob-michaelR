const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const WordLinkedList = require('../WordLinkedList/WordLinkedList.js')

const languageRouter = express.Router()
const bodyParser = express.json()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )
      console.log(words);

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    // return the next quiz word to be asked
    try {
      const nextQuizWord = await LanguageService.getNextQuizWord(req.app.get('db'), req.language.head)
      res.status(200).json( {
        nextWord: nextQuizWord.original,
        wordCorrectCount: nextQuizWord.correct_count,
        wordIncorrectCount: nextQuizWord.incorrect_count,
        totalScore: req.language.total_score
      }) 
    } catch (e) {
      next(e)
    }
  })

languageRouter
  .route('/guess')
  .post(bodyParser, async (req, res, next) => {
    console.log(req.body);
    if (!Object.keys(req.body).includes('guess')) {
      res.status(400).send({
        error: `Missing 'guess' in request body`,
      })
    }
    // guess is being sent in here... 
    
    // make new Linked List to hold words
    let wordList = new WordLinkedList();
    LanguageService.fillWordList(req.app.get('db'), req.language.id, wordList)

    
    // where is this linked list being kept?
    // implement me
    // res.send('implement me!')
  })

module.exports = languageRouter
