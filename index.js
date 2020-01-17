var http = require('http');
var querystring = require('querystring')
var fs = require("fs");

// roll点模块
var Seals = require('./seals');
seals = new Seals();

// 幻化模块
var Magic = require('./magic');
magic = new Magic();

// 钓鱼模块
var Fish = require('./fish');
fish = new Fish();

// 对话设置模块
var Talk = require('./talk');
talk = new Talk();

// 回复模块
var Reply = require('./reply');
reply = new Reply();

// cq传入的数据
var cqdata = '';
 
http.createServer(function(req, res){
    // 定义了一个post变量，用于暂存请求体的信息
    var post = '';     
 
    // 通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
    req.on('data', function(chunk){    
        post += chunk;
    });
 
    // 在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
    req.on('end', function(){    
		cqdata = JSON.parse(post);
		// console.log(cqdata);
		var sendMsg = '';
		var message = cqdata.raw_message.split(" ");
		// roll海豹功能,跳转seals模块
		if (message[0] == '.战利品' || message[0] == '.需求') {
			// seals.setData(cqdata,message);
			// seals.sendMsg();
			sendMsg = {
				"reply":"收到消息啦!"
			}
		}else if(message[0] == '.幻化'){
			magic.getMagic( result => {
				// console.log(result + "index");
				sendMsg = result;
				var postData = JSON.stringify(sendMsg);
				res.end(postData);
			})
		}else if(message[0] == '.fish'){
			fish.setData(cqdata,message);
			fish.getFish( result => {
				// console.log(result + "index");
				sendMsg = result;
				var postData = JSON.stringify(sendMsg);
				res.end(postData);
			})
		}else if(message[0] == '.talk'){
			talk.setData(cqdata,message);
			talk.addDate( result => {
				// console.log(result + "index");
				sendMsg = result;
				var postData = JSON.stringify(sendMsg);
				res.end(postData);
			})
		}else{
			var numbers = Math.floor(Math.random()*100);
			fs.readFile('prob.json', function (err, data) {
				if (err) {
					return console.error(err);
				}
				data = JSON.parse(data);
				if(numbers < data.prob){
					reply.setData(cqdata,message);
					reply.sendTalk( result => {
						// console.log(result + "index");
						sendMsg = result;
						var postData = JSON.stringify(sendMsg);
						res.end(postData);
					})
				}
			})
		}
    });
}).listen(8888);

console.log("正在运行中...")