require('dotenv').config()

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
