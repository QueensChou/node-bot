function Reply(){
	var fs = require("fs");
	var sendMsg,cqdata,getMsg;
	
	this.setData = function(data,msg){
		cqdata = data;
		getMsg = msg[0];
	}
	
	this.sendTalk = function(callback){
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
					sendMsg = {
						"reply": sentData[0].dialogue,
						"at_sender":false
					}
					return callback(sendMsg);
					break;
				}
			}
		})
	}
}

module.exports = Reply;