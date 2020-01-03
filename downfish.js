var fs = require("fs");
var request = require("request");
var rp = require('request-promise');
var cheerio = require("cheerio");
var fishName = '';

var options = {
	method: 'POST',
	uri: encodeURI('https://ff14angler.com/index.php?lang=cn&search=' + fishName),
	body: {
		
	},
	json: true // Automatically stringifies the body to JSON
};

rp(options)
	.then(function(result){
		// var fishData = JSON.parse(result);
		// console.log(result);
		var $ = cheerio.load(result);
		var fishID = $('select[name="fish"]').find("option");
		var fishList=[];
		$('select[name="fish"] option').each(function(){
			var value = $(this).val();
			var text = $(this).text();
			if(text!=''){   
				var o = {
					"name": text,
					"id": value
				};
				fishList.push(o);
			}  
		});
		console.log(fishList);
		let str = JSON.stringify(fishList,"","\t")
		fs.writeFile('fish.json', str,  function(err) {
		   if (err) {
		       return console.error(err);
		   }
		   console.log("数据写入成功！");
		   console.log("--------我是分割线-------------")
		   console.log("读取写入的数据！");
		   fs.readFile('fish.json', function (err, data) {
		      if (err) {
		         return console.error(err);
		      }
		      console.log("异步读取文件数据: " + data.toString());
		   });
		});
	})
	.catch(function(err){
		console.log(err);
		return null;
	})