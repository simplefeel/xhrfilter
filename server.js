const fs = require('fs')
const exec = require('child_process').exec;

fs.watch("./src", (event, filename) => {
  console.log(filename);
  if (filename && event === "change") {
    exec('rollup src/index.js -o dist/xhrfilter.min.js --output.name xhrfilter -f umd', function (error, stdout, stderr) {
      if (error) {
        console.log(error.stack);
        console.log('Error code: ' + error.code);
      }
      console.log('编译成功' + stdout);
    });
  }
})



console.log("start watch");