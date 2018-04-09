'use strict';
//connector 在第一次查询的时候加载
const fs = require('fs');
const path = require('path');

const SYMBOL_CONNECTOR_CLASS = Symbol('Application#connectorClass');
const classes = new Map();
function fileDisplay(filePath,lastDirName){  
  //根据文件路径读取文件，返回文件列表  
   const files = fs.readdirSync(filePath);
    //遍历读取到的文件列表  
   files.forEach(function(filename){  
    //获取当前文件的绝对路径  
    var filedir = path.join(filePath,filename);  
    //根据文件路径获取文件信息，返回一个fs.Stats对象  
    var stats =  fs.statSync(filedir);
    var isFile = stats.isFile();//是文件  
    var isDir = stats.isDirectory();//是文件夹  
    console.log(filedir)
    if(isFile){ 
      if(filename === 'connector.js'){
        if (fs.existsSync(filedir)) {
          const Connector = require(filedir);
          classes.set(lastDirName, require(filedir));
        }
        console.log(`load Graphql connector ${filedir}`)
      }
    }  
    if(isDir){  
        fileDisplay(filedir,filename);//递归，如果是文件夹，就继续遍历该文件夹下面的文件  
    }  
  });   
}  
module.exports = app => {
  const basePath = path.join(app.baseDir, 'app/graphql');

  Object.defineProperty(app, 'connectorClass', {
    get() {
      if (!this[SYMBOL_CONNECTOR_CLASS]) {
        fileDisplay(basePath)
        this[SYMBOL_CONNECTOR_CLASS] = classes;
      }
      return this[SYMBOL_CONNECTOR_CLASS];
    },
  });
};
