//time, username, text
//created_at, user.screen_name, full_text
const fs = require('fs')
    , es = require('event-stream');

const inFile = process.argv[2];
const outFile = process.argv[3];
const header = process.argv[4]
const formatter = process.argv[5];

var lineNr = 0;
const out = fs.createWriteStream(outFile);
out.write(header || 'time,username,text\n');
const s = fs.createReadStream(inFile)
    .pipe(es.split())
    .pipe(es.mapSync(function(line){
        s.pause();
        lineNr += 1;
        if(lineNr % 50 === 0) {console.log(`writing line ${lineNr}`)};
        var json;
        try{
          json = JSON.parse(line);
        }catch(e){
          console.log(line);
          console.log(e);
          process.exit(1);
        }

        out.write(formatter || `${new Date(json.created_at).getTime()},${json.user.screen_name},${json.full_text.replace(/\n/g,'')}\n`, () => {
          s.resume(); 
        }) 
    })
    .on('error', function(err){
        console.log('Error while reading file.', err);
    })
    .on('end', function(){
        console.log('Read entire file.')
    })
);

