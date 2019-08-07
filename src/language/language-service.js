'use strict';
const LinkedList = require('../LinkedList/LinkedList.js');

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score'
      )
      .where('language.user_id', user_id)
      .first();
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count'
      )
      .where({ language_id });
  },
  getNextQuizWord(db, id) {
    // add any additional fields??
    return db('word')
      .select('id', 'next', 'original', 'correct_count', 'incorrect_count')
      .where({ id })
      .first();
  },
  fillWordList(db, language, words) {
    let wordList = new LinkedList(); // import linked list
    // need the language object, entire language
    wordList.id = language.id;
    wordList.name = language.name; // french
    wordList.total_score = language.total_score;
    let word = words.find(w => w.id === language.head);

    // console.log('WORDS: ', words);
    // console.log('WORD: ', word);
    wordList.insertFirst({
      id: word.id,
      original: word.original,
      translation: word.translation,
      memory_value: word.memory_value,
      correct_count: word.correct_count,
      incorrect_count: word.incorrect_count,
    });
    while (word.next) {
      word = words.find(w => w.id === word.next);
      wordList.insertLast({
        id: word.id,
        original: word.original,
        translation: word.translation,
        memory_value: word.memory_value,
        correct_count: word.correct_count,
        incorrect_count: word.incorrect_count,
      });
    }
    console.log('returned wordList: ', JSON.stringify(wordList, null, 2));
    return wordList;
  },
  updateWord(db, word) {
    return db
      .from('word')
      .where({ id: word.id })
      .update({
        memory_value: word.memory_value,
        incorrect_count: word.incorrect_count,
        correct_count: word.correct_count,
      });
  },
  incrementTotalScore(db, language) {
    return db
      .from('language')
      .where({ id: language.id })
      .update({ total_score: language.total_score + 1 });
  },
  persistLinkedList(db, linkedLanguage) {
    return db.transaction(trx =>
      Promise.all([
        db('language')
          .transacting(trx)
          .where('id', linkedLanguage.id)
          .update({
            total_score: linkedLanguage.total_score,
            head: linkedLanguage.head.value.id,
          }),

        ...linkedLanguage.forEach(node =>
          db('word')
            .transacting(trx)
            .where('id', node.value.id)
            .update({
              memory_value: node.value.memory_value,
              correct_count: node.value.correct_count,
              incorrect_count: node.value.incorrect_count,
              next: node.next ? node.next.value.id : null,
            })
        ),
      ])
    );
  },
};

module.exports = LanguageService;
