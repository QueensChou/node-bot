function Talk(){
	var fs = require("fs");
	var sendMsg,setQQ,cqdata;
	var isTalk,method,prob,getWord,sentWord;
	
	this.setData = function(data,msg){
		cqdata = data;
		if(msg[1] && msg[1] == 'add' && msg[2] && msg[3]){
			isTalk = true;
			method = 'add';
			getWord = msg[2];
			sentWord = msg[3];
		}else if(msg[1] && msg[1] == 'set' && msg[2]){
			isTalk = true;
			method = 'set';
			prob = msg[2];
		}else{
			isTalk = false;
		}
	}
	
	this.addDate = function(callback){
		if (isTalk) {
			switch (method){
				case 'add':
					fs.readFile('talk.json', function (err, data) {
						if (err) {
							return console.error(err);
						}
						var lenght = 0;
						data = JSON.parse(data);
						var wordData = data.total;
						console.log(typeof data);
						for (let i = 0; i < wordData.length; i++) {
							var lenght2 = 0;
							if(wordData[i].getWord == getWord){
								var sentData = wordData[i].sentWord;
								console.log(sentData.length);
								for (let j = 0; j < sentData.length; j++) {
									if(sentData[j].dialogue == sentWord){
										console.log(lenght2);
										sendMsg = {
											"reply": "已有该数据,无法重复添加!"
										}
										return callback(sendMsg);
									}
									lenght2++;
								}
								if(lenght2 >= sentData.length){
									var o = {
										"dialogue":sentWord,
										"setqq":cqdata.user_id
									};
									sentData.push(o);
								}
								break;
							}
							lenght++;
						}
						if(lenght >= wordData.length){
							var o = {
								"getWord":getWord,
								"sentWord":[
									{
										"dialogue":sentWord,
										"setqq":cqdata.user_id
									}
								]
							};
							wordData.push(o);
							console.log(typeof wordData);
						}
						data.total = wordData;
						let str = JSON.stringify(data,"","\t")
						fs.writeFile('talk.json', str,  function(err) {
							if (err) {
								return console.error(err);
							}
							console.log("数据写入成功！");
							sendMsg = {
								"reply": "数据已添加!"
							}
							return callback(sendMsg);
						});
					});
					break;
				case 'set':
					if(parseInt(prob)){
						var probData = {
							"prob":parseInt(prob)
						};
						let str = JSON.stringify(probData,"","\t")
						fs.writeFile('prob.json', str,  function(err) {
							if (err) {
								return console.error(err);
							}
							console.log("数据写入成功！");
							sendMsg = {
								"reply": "设置成功,回复的概率为" + prob + "%"
							}
							return callback(sendMsg);
						});
					}else{
						sendMsg = {
							"reply": "数值错误,请输入正确的数值!"
						}
						return callback(sendMsg);
					}
					break;
			}
		} else{
			sendMsg = {
				"reply": "参数错误\n请输入.talk add 触发语句 回复语句 添加数据\n输入.talk set 数值 设定回复概率"
			}
			return callback(sendMsg);
		}
		
	}
}

module.exports = Talk;