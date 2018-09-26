var express=require("express");
var log4js =require('log4js');
var _ = require("lodash");
var bodyParser = require('body-parser')
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
app.use(express.static("fontend"))
app.use(bodyParser.json())
app.get("/api/apps",(req,res)=>{
    res.type("json")
    res.end(JSON.stringify(_.map(config.apps,(m)=>{
        return {
            id:m.id,
            name:m.name,
            webui:m.webui,
            operations:_.map(m.operations,c=>{return {commandID:c.commandID,commandName:c.commandName}})
        }
    })))
})
app.post("/api/exec/:appID/:commandID/:args",(req,res)=>{
   execHandler(req.params,req,res)
})
app.post("/api/exec/:appID/:commandID",(req,res)=>{
    execHandler(req.params,req,res)
})
app.post("/api/exec/",(req,res)=>{
    execHandler(req.body,req,res)
})
function execHandler(options,req,res){
    let appID=options.appID
    let commandID=options.commandID
    let app=_.find(config.apps,{id:appID})
    let command=''
    if(_.indexOf(['isActive','mem','cpu'],commandID)!= -1){
        command=_.get(app,commandID)
       
    }else{
        let operator = _.find(_.get(app,'operations'),{commandID})
        command=_.get(operator,"command")
    }
    try{
        if(command){
           exec(command,{encoding: 'utf-8'},(err,out)=>{
               if(err){
                   logger.error("BASH ERROR",app,_.toString(err))
                   res.status(500).send({
                        id:appID,code:1,result:_.toString(err)
                   })
               }else{
                res.status(200).send({id:appID,result:out,code:0})
               }
           })
        }else{
            res.status(500).send({id:appID,result:'Command not found: '+appID+"  commandID:"+commandID,code:1})
            logger.error("应用未配置",appID,commandID)
        }
    }catch(error){
        logger.error("BASH ERROR",app,_.toString(err))
                   res.status(500).send({
                        id:appID,code:1,result:_.toString(err)
                   })
    }
}

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
        res.status(500).send({id:app,error:'应用不存在:'+app,code:0})
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
