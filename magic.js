function Magic(){
	var request = require("request");
	var rp = require('request-promise');
	var cheerio = require("cheerio");
	var Send = require('./send');
	send = new Send();
	var sendMsg;
	// 向服务端发送请求
	this.getMagic = function(callback){
		rp('https://api.ffxivsc.cn/glamour/v1/glamourRandom?_=1576249725064')
			.then(function(result){
				var magicData = JSON.parse(result);
				// console.log(result);
				sendMsg = {
					"reply": magicData.array[0].glamourTitle + "\n" + "https://www.ffxivsc.cn/page/glamour.html?glamourId=" + magicData.array[0].glamour_id
				}
				console.log(sendMsg);
				return callback(sendMsg);
				
			})
			.catch(function(err){
		        console.log(err);
				return null;
			})
	}
}

module.exports = Magic;