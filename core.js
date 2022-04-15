var sqlite3 = require('sqlite3').verbose();
require('dotenv').config()
var db = new sqlite3.Database(process.env.DATABASE_PATH);

function migrate_tables_if_necessary(db_table_name) {
  db.serialize(function() {
    db.run(`CREATE TABLE IF NOT EXISTS ` + db_table_name + ` (
      id integer primary key AUTOINCREMENT,
      type TEXT,
      pinyin TEXT,
      hanzi TEXT,
      english TEXT,
      correct integer,
      thinking_time integer,
      answer_response_time integer,
      created_at integer
      );
    `);
  });
}

async function perform_flashcards_loop(db_table_name, words, chinese) {
  console.log("Flashcard loop started, to exit press CTRL-C");
  console.log("\n")
  while(true) {
    await perform_flashcard(db_table_name, words, chinese);
    console.log("\n")
  }
}

async function perform_flashcard(db_table_name, words, chinese) {
  return new Promise(resolve => {
    migrate_tables_if_necessary(db_table_name);

    const random = Math.floor(Math.random() * words.length);
    var word = words[random];
    console.log(word);

    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    var totalThinkingTime = 0;
    var correctAnswer = false;
    var timeThinkingForAnswerStart = new Date().getTime();
    rl.question('What is this word in Chinese? ', function (name) {
      // Calculate how long did you think
      var timeThinkingForAnswerEnd = new Date().getTime();
      totalThinkingTime = timeThinkingForAnswerEnd - timeThinkingForAnswerStart;
      console.log(`Correct: 🍏`, chinese[word][0], chinese[word][1]);

      var answerResponseTime = 0;
      var answerResponseTimeStart = new Date().getTime();
      rl.question("Did you guess correctly(input ' if yes)? ", function (name) {
        if (name == "'") {
          correctAnswer = true;
          console.log("Answer: 💚 Correct")
        } else {
          console.log("Answer: 🔴 Incorrect")
        }
        // Calculate how long it took to answer
        var answerResponseTimeEnd = new Date().getTime();
        answerResponseTime = answerResponseTimeEnd - answerResponseTimeStart;

        // Save to Database
        db.run(`INSERT INTO ` + db_table_name + `(
        type, 
        pinyin, 
        hanzi, 
        english, 
        correct, 
        thinking_time, 
        answer_response_time, 
        created_at
      ) VALUES($type, $pinyin, $hanzi, $english, $correct, $thinking_time, $answer_response_time, $created_at);
      `,
          {
            $type: 'pinyin',
            $pinyin: chinese[word][1],
            $hanzi: chinese[word][0],
            $english: word,
            $correct: correctAnswer,
            $thinking_time: totalThinkingTime,
            $answer_response_time: answerResponseTime,
            $created_at: new Date().getTime()
          }
        );

        rl.close();
        resolve();
      });
    });
  });
}

module.exports.perform_flashcards_loop = perform_flashcards_loop;
