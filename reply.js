function Reply(){
	var fs = require("fs");
	var sendMsg,cqdata,getMsg;
	
	this.setData = function(data,msg){
		cqdata = data;
		getMsg = msg[0];
	}
	
	this.sendTalk = function(callback){
		// console.log(11111);
		fs.readFile('talk.json', function (err, data) {
			if (err) {
				return console.error(err);
			}
			data = JSON.parse(data);
			var wordData = data.total;
			for (let i = 0; i < wordData.length; i++) {
				if(getMsg.indexOf(wordData[i].getWord) !== -1){
					var sentData = wordData[i].sentWord;
					sentData.sort(function(a, b){return 0.5 - Math.random()}); 
					if(sentData[0].atqq){
						// console.log(333333);
						sendMsg = {
							"reply": [
								{
									"type": "at",
									"data": {
										"qq": sentData[0].atqq
									}
								},
								{
									"type": "text",
									"data": {"text": sentData[0].dialogue}
								}
							],
							"at_sender":false,
							"auto_escape":true
						}
					}else{
						// console.log(444444);
						sendMsg = {
							"reply": sentData[0].dialogue,
							"at_sender":false,
						}
					}
					return callback(sendMsg);
					break;
				}
			}
			// console.log("other");
			return callback(0);
		})
	}
}

module.exports = Reply;