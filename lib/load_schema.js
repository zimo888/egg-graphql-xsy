'use strict';

const fs = require('fs');
const path = require('path');
const {
  makeExecutableSchema,
} = require('graphql-tools');
const _ = require('lodash');

const SYMBOL_SCHEMA = Symbol('Applicaton#schema');

const schemas = [];
const resolverMap = {};
const directiveMap = {};
//递归找三个文件
function fileDisplay(filePath){  
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
    if(isFile){  
        if(filename === 'schema.graphql'){
          if (fs.existsSync(filedir)) {
            const schema = fs.readFileSync(filedir, {
              encoding: 'utf8',
            });
            schemas.push(schema);
            console.log(`load Graphql configfile ${filedir}`)
          }
        }else if(filename == 'resolver.js'){
          if (fs.existsSync(filedir)) {
            const resolver = require(filedir);
            _.merge(resolverMap, resolver);
            console.log(`load Graphql configfile ${filedir}`)
          }
        }else if(filename == 'directive.js'){
          if (fs.existsSync(filedir)) {
            const directive = require(filedir);
            _.merge(directiveMap, directive);
            console.log(`load Graphql configfile ${filedir}`)
          }
        }

    }  
    if(isDir){  
        fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件  
    }  
  });   
}  
module.exports = app => {
  const basePath = path.join(app.baseDir, 'app/graphql');
  fileDisplay(basePath)
  const types = fs.readdirSync(basePath);
  Object.defineProperty(app, 'schema', {
    get() {
      if (!this[SYMBOL_SCHEMA]) {
        this[SYMBOL_SCHEMA] = makeExecutableSchema({
          typeDefs: schemas,
          resolvers: resolverMap,
          directiveResolvers: directiveMap,
        });
      }
      return this[SYMBOL_SCHEMA];
    },
  });
};
