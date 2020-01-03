function Fish(){
	var fs = require("fs");
	var request = require("request");
	var rp = require('request-promise');
	var cheerio = require("cheerio");
	var sendMsg;
	var fishName = '';
	
	this.setData = function(data,msg){
		if(msg[1]){
			fishName = msg[1];
		}
	}
	// 向服务端发送请求
	this.getFish = function(callback){
		console.log(fishName);
		if(fishName){
			var data = fs.readFileSync('fish.json');
			var fishID = 0;
			data = JSON.parse(data);
			for (let num in data) {
				if(data[num].name == fishName){
					fishID = data[num].id;
					break;
				}
			}
			var options = {
			    method: 'POST',
			    uri: encodeURI('https://ff14angler.com/index.php?lang=cn&fish=' + fishID),
			    body: {
			        
			    },
			    json: true // Automatically stringifies the body to JSON
			};
			console.log(fishID);
			rp(options)
				.then(function(result){
					// var fishData = JSON.parse(result);
					console.log(result);
					var $ = cheerio.load(result);
					sendMsg = {
						"reply": "正在查询中!"
					}
					console.log(sendMsg);
					return callback(sendMsg);
					
				})
				.catch(function(err){
			        console.log(err);
					return null;
				})
		}else{
			sendMsg = {
				"reply": "参数错误,请输入具体的鱼类名称!"
			}
			console.log(sendMsg);
			return callback(sendMsg);
		}
	}
}

module.exports = Fish;