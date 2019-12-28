function Magic(){
	var request = require("request");
	var cheerio = require("cheerio");
	 
	// 向服务端发送请求
	this.getMagic = function(){
		request('https://api.ffxivsc.cn/glamour/v1/glamourRandom?_=1576249725064',function(err,result){
		    if(err){
		        console.log(err);
		    }
		    console.log(result.body);
		})
	}
}

module.exports = Magic;