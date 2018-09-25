var express=require("express");
var log4js =require('log4js');
var _ = require("lodash");
var path = require('path');
YAML = require('yamljs');
var exec = require('child_process').exec;
var app= express();
var PORT=8080;
//app.set('etag', false);
log4js.configure({
      appenders: {
        out: { type: 'stdout' },
        app: { type: 'file', filename: 'application.log' }
      },
      categories: {
        default: { appenders: [ 'out', 'app' ], level: 'info' }
      }
  });
var logger = log4js.getLogger();
logger.level='info'
var fs=require('fs');
var config_file="./config.json";
var config={apps:[]}
//loading config file
try{
    config = YAML.load('config.yml');
    if(config.logLevel){
        logger.setLevel(config.logLevel)
    }
    if(config.port){
        PORT=config.port
    }
}
catch (error){
    logger.error("无法读取配置文件")
}
app.listen(PORT,'0.0.0.0',()=>{
    logger.info("服务器监听端口："+PORT)
})
app.use(express.static("dist"))
app.get("/api/apps",(req,res)=>{
    res.type("json")
    res.end(JSON.stringify(_.map(config.apps,(m)=>{
        return {
            id:m.id,
            name:m.name,
            operations:_.map(m.operations,c=>{return {commandID:c.commandID,commandName:c.commandName}})
        }
    })))
})
app.post("/api/exec/:appID/:commandID",(req,res)=>{

})
app.get("/api/status/:app",(req,res)=>{
    var app=req.params.app;
    var app_config=_.find(config.apps,{id:app})
    if(app_config){
        exec(app_config.status,{encoding:'utf-8'},(err,out)=>{
            if(err){
                logger.error("应用调用错误:"+app+"----"+_.toString(err))
                res.status(500).send({id:app,code:1,exec:_.toString(err)})
            }else{
                res.status(200).send({id:app,exec:out,code:0})
            }
                

        })
    }else{
        res.status(500).send({id:app,error:'应用不存在',code:0})
        logger.error("应用未配置:"+app)
    }
})
app.post('/api/start/:app',(req,res)=>{
    var app=req.params.app;
    var app_config=_.find(config.apps,{id:app})
    if(app_config){
        exec(app_config.start,{encoding:'utf-8'},(err,out)=>{
            if(err){
                logger.error("应用启动错误;"+app+'----'+_.toString(err))
                res.status(500).send(app_config.start+"\\n"+_.toString(err));
            }else{
                res.status(200).send(app_config.start+"\\n"+out);
            }
        })
    }else{
        res.status(500).send({error:"应用不存在"});
        logger.error("应用未配置:"+app);
    }
})
app.post('/api/stop/:app',(req,res)=>{
    var app=req.params.app;
    var app_config=_.find(config.apps,{id:app})
    if(app_config){
        exec(app_config.stop,{encoding:'utf-8'},(err,out)=>{
            if(err){
                logger.error("应用关闭错误;"+app+'----'+_.toString(err))
                res.status(500).send(app_config.stop+'\\n'+_.toString(err));
            }else{
                res.status(200).send(app_config.stop+"\\n"+out);
            }
        })
    }else{
        res.status(500).send({error:"应用不存在"});
        logger.error("应用未配置:"+app);
    }
})
