var fs = require('fs');
var ejs = require('ejs');
var globalPath = require('path');

/*=== funtion autoload === */
function autoload(path, level) {
  try {
    if(fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function(file, index){
        var nextPath = globalPath.join(path, file);

        if(fs.lstatSync(nextPath).isDirectory()) {
          folders[path] !== undefined ? folders[path].push(file) : folders[path] = [file];

          var typePath = globalPath.join(nextPath, '/types.js');
          var actionPath = globalPath.join(nextPath, '/actions.js');
          var recucerPath = globalPath.join(nextPath, '/reducers.js');

          if (fs.existsSync(typePath) && fs.existsSync(actionPath) && fs.existsSync(recucerPath)) {
            var indexModulePath = globalPath.join(nextPath, '/index.js');

            if(fs.existsSync(indexModulePath)) {
              fs.unlinkSync(indexModulePath);
            }

            if(!fs.existsSync(indexModulePath)) {
              var indexModule = fs.readFileSync(globalPath.resolve('./templates/index.module.js'), 'utf8');

              fs.writeFile(indexModulePath, indexModule, function(err) {
                if (err) {
                  return;
                }

                console.log('file: ' + indexModulePath + ' saved !');
              });
            }
            return;
          }

          autoload(nextPath);
        }
      });
    }
  }
  catch (error) {
    console.log(error);
  }
}

/*=== run === */
var folders = [];

autoload(globalPath.resolve('./src/features'));

for(var key in folders) {
  var indexModulePath = globalPath.join(key, '/index.js');

  if(fs.existsSync(indexModulePath)) {
    fs.unlinkSync(indexModulePath);
  }

  if (folders[key] !== undefined) {
    var indexModule = fs.readFileSync(globalPath.resolve('./templates/index.feature.js'), 'utf8');
    var content = ejs.render(indexModule, {files: folders[key]});

     fs.writeFile(indexModulePath, content, function(err) {
        if (err) {
          return;
        }

        console.log('file: ' + indexModulePath + ' saved !');
      });
  }
}