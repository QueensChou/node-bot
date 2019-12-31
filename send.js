function Send(){
	var http = require('http');
	
	var send_data = {
		"group_id": 123456,
		"message": []
	}
	var postData;
	var options = {};
	this.setData = function(msg, cqdata){
		send_data.group_id = cqdata.group_id;
		send_data.message = msg;
		postData = JSON.stringify(send_data);
		options = {
		  hostname: '127.0.0.1',
		  port: 8888,
		  path: '/send_group_msg',
		  method: 'POST',
		  headers: {
		    'Content-Type': 'application/json',
		    'Content-Length': Buffer.byteLength(postData)
		  }
		};
	}
	this.sendMsg = function(){
		var reqcq = http.request(options, (res) => {
			res.setEncoding('utf8');
			res.on('data', (chunk) => {
				console.log('响应主体:' + chunk);
			});
			res.on('end', () => {
				console.log('响应中已无数据');
			});
		});
		
		reqcq.on('error', (e) => {
		  console.error('请求遇到问题:' + e.message);
		});
		
		// 将数据写入请求主体。
		reqcq.write(postData);
		reqcq.end(); 
	}
}

module.exports = Send;