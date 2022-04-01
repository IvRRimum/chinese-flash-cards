require('dotenv').config()

//const projectId = process.env.GOOGLE_APPLICATION_PROJECT_ID;
//const {Translate} = require('@google-cloud/translate').v2;
//
//// Instantiates a client
//const translate = new Translate({projectId});
//
//async function translateToChinese() {
//  // The text to translate
//  const text = 'Hello, world!';
//
//  // The target language
//  const target = 'zh';
//
//  // Translates some text into Russian
//  const [translation] = await translate.translate(text, target);
//  console.log(`Text: ${text}`);
//  console.log(`Translation: ${translation}`);
//}
//
//translateToChinese()

const util = require('util')
var fs = require('fs');
const tokenize = require('chinese-tokenizer').loadFile(process.env.CEDICT_PATH)

// load the init-new-dump file
var init_new_dump = fs.readFileSync(process.env.DUMP_FILE_PATH, 'utf8');

// split the init-new-dump file into lines
var lines = init_new_dump.split('\n');

// Extract Chinese characters from each line and store them in a new array
var chinese_characters = [];
for (var i = 0; i < lines.length; i++) {
  var line = lines[i];
  var chinese_character = line.split("")
    .filter(char => /\p{Script=Han}/u.test(char))
    .join("");
  if (chinese_character.length > 0) {
    chinese_characters.push(chinese_character);
  }
}

// Translate chinese_characters and push them to a new array called chinese_characters_translated
var chinese_characters_translated = [];
for (var i = 0; i < chinese_characters.length; i++) {
  var chinese_character = chinese_characters[i];
  var chinese_character_translated = tokenize(chinese_character);

  // Loop trought translations and construct an object 
  chinese_character_translated.forEach(function(translation) {
    var obj = {};
    var keyStr = "";
    var pinyinStr = "";
    translation["matches"].forEach(function(match) {
      if (match["pinyinPretty"] == pinyinStr) return;
      keyStr += match["english"];
      pinyinStr += match["pinyinPretty"];
    });
    obj[keyStr] = translation["text"] + " " + pinyinStr;

    chinese_characters_translated.push(obj);
  });
}

console.log(chinese_characters_translated)

// console.log(util.inspect(chinese_characters_translated, {showHidden: false, depth: null, colors: true}))
