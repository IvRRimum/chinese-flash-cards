# Chinese flash card builder
![Preview](/img/preview-1.png)
![Preview](/img/preview-2.png)

Just dump your chinese text in `init-new-dump.txt` and get translation in english and pinyin. Then take the output and fill it in in flash-cards-template.js. Boom you have command line flash cards for learning chinese. No more spending so mutch time to copy pinyin from google translate.

```bash
" A real time saver"
- a Student learning chinese
```

# Setup
```bash
npm install
```

Create new file `.env` and fill it in(example in `example.env`)

Dump your chinese characters in `init-new-dump.txt`(each line(\n) will be translated as a seperate object) and run:
```bash
node init-new.js
```

Now open `flash-card-template.js` in your favorite editor and populatie arrays `words` and `chinese`, with the outputs you got from executing previous command(look at the example already there). Adjust the english/chinese as you please.

```
node flash-card-template.js
```

Now try guesing the chinese word ;) then press enter and repeat, till you remember all of the words. :)

