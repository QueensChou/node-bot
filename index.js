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
var spoils;
 
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
		if (message.indexOf('/战利品') != -1 || message == '/需求') {
			message = message.split(" ");
			seals.setData(cqdata,message);
			msg = seals.sendMsg();
			// console.log(msg);
			if(typeof msg != 'string'){
				endDice = msg.enddice;
				dicedata = msg.diceData;
				spoils = msg.spoils;
				msg = msg.message;
				// console.log(dicedata);
			}
			var cqmsg = [];
			if(message[0] == '/战利品'){
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
				var winner;
				var piont = 0;
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
							"text": "对" + spoils + "掷出了" + dicedata[id] + "点!\n"
						}
					});
					var dicepiont = parseInt(dicedata[id]);
					console.log(dicepiont + 'and' + piont);
					if(dicepiont > piont){
						piont = dicepiont;
						winner = id;
					}
				}
				cqmsg.push({
					"type": "at",
					"data": {
						"qq": winner
					}
				},{
					"type": "text",
					"data": {
						"text": "获得了" + spoils + "!"
					}
				})
				send.setData(cqmsg,cqdata);
				send.sendMsg();
				endDice = false;
			}
		}
    });
}).listen(8888);

console.log("正在运行中...")