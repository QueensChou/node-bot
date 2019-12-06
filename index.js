var http = require('http');
var querystring = require('querystring')
// var request = require('request');
var Seals = require('./seals');
var Send = require('./send');
seals = new Seals();
send = new Send();
var cqdata = '';
var msg = '';
var endDice = false;
var dicedata;
 
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
		var message = cqdata.raw_message;
		if (message == '/战利品' || message == '/需求') {
			seals.setData(cqdata);
			msg = seals.sendMsg();
			console.log(msg);
			console.log(seals.dice);
			if(typeof msg != 'string'){
				endDice = msg.enddice;
				dicedata = msg.diceData;
				msg = msg.message;
			}
			var cqmsg = [];
			if(message == '/战利品'){
				cqmsg = [{
					"type": "text",
					"data": {
						"text": msg
					}
				}]
			}else{
				cqmsg = [{
					"type": "at",
					"data": {
						"qq": cqdata.user_id
					}
				},{
					"type": "text",
					"data": {
						"text": msg
					}
				}]
			}
			send.setData(cqmsg,cqdata);
			send.sendMsg();
			if(endDice){
				cqmsg = [];
				for(id in dicedata){
					cqmsg.push({
						"type": "at",
						"data": {
							"qq": id
						}
					});
					cqmsg.push({
						"type": "text",
						"data": {
							"text": "对椒盐海豹掷出了" + dicedata.id + "点!\n"
						}
					});
				}
				send.setData(cqmsg,cqdata);
				send.sendMsg();
			}
		}
    });
}).listen(8888);

console.log("正在运行中...")