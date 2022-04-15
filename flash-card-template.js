var core = require("./core.js");

const words = [
  "last (week)", 
  "next week",
  "train station",
];

const chinese = {
  "last (week)": ["上个", "Shàng gè"],
  "next week": ["下个星期", "Xià gè xīngqí"],
  "train station": ["火车站", "Huǒchē zhàn"],
}

const random = Math.floor(Math.random() * words.length);
var color = words[random];
console.log(color);

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

core.perform_flashcards_loop('some_table_name_2022', words, chinese);
