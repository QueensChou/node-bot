function Seals(){
	var Send = require('./send');
	send = new Send();
	// 存储掷骰结果
	var dice;
	// 是否已有掷骰内容
	var seals = false;
	var cqdata;
	var msg;
	var dice_lenght;
	var spoils;
	var order;
	var p_number;
	var timer;
	this.setData = function(data,msg){
		cqdata = data;
		if(msg[0] == '/战利品'){
			console.log(msg.length);
			if(!seals){
				switch (msg.length){
					case 1:
						spoils = '椒盐海豹';
						order = '/战利品';
						p_number = 8;
						break;
					case 2:
						if(isNaN(parseInt(msg[1]))){
							console.log(msg[1] + '字符串');
							spoils = msg[1];
							order = '/战利品';
							p_number = 8;
						}else{
							console.log(msg[1] + '数字');
							spoils = '椒盐海豹';
							order = '/战利品';
							p_number = parseInt(msg[1]);
						}
						break;
					case 3:
						if (!isNaN(parseInt(msg[2]))) {
							spoils = msg[1];
							order = '/战利品';
							p_number = parseInt(msg[2]);
						}
						break;
					default:
						break;
				}
			}
			console.log(spoils + '--' + order + '--' + p_number);
		}else{
			order = '/需求';
		}
	}
	this.Dice = function(){
		var user_id = cqdata.user_id;
		dice_lenght = 0;
		// console.log(user_id);
		if(dice){
			// console.log("yes");
			var has_user = false;
			for (id in dice) {
				if (user_id == id) {
					has_user = true;
					msg = "无法重复掷骰!";
					break;
				} else{
					dice_lenght++;
				}
			}
			if(!has_user){
				// console.log(dice_lenght);
				var user_lenght = dice_lenght + 1;
				// console.log(user_lenght + 'and' + dice_lenght);
				for (var i = 0; ;i++) {
					if( user_lenght > dice_lenght){
						// console.log(user_lenght);
						var num = Math.floor(Math.random() * 99) + 1;
						var thislenght = 0;
						for (id in dice){
							if(num == dice[id]){
								return false;
							}else{
								thislenght++;
								// console.log(dice);
							}
						}
						if(thislenght == dice_lenght){
							dice[user_id] = num;
							dice_lenght++;
							msg = '对' + spoils + '进行了掷骰!';
						}
					}else{
						// console.log(dice);
						break;
					}
				}
			}
		}else{
			var num = Math.floor(Math.random() * 99) + 1;
			dice = {};
			dice[user_id] = num;
			dice_lenght++;
			// console.log(dice);
			msg = '对' + spoils + '进行了掷骰!';
		}
	}
	this.sendMsg = function(){
		// console.log(cqdata);
		// var message = cqdata.raw_message;
		switch (order){
			case '/战利品':
				if (!seals) {
					msg = '获得了新的战利品:' + spoils + ',请输入"/需求"进行掷骰!';
					seals = true;
					timer =setTimeout(endDice,60000);
					return msg;
				} else{
					msg = '已有战利品:' + spoils + ',输入"/需求"进行掷骰!';
					return msg;
				}
				break;
			case '/需求':
				if (seals) {
					this.Dice();
					// console.log(dice);
					// console.log(dice_lenght);
					if(dice_lenght >= p_number){
						msg = {
							"enddice":true,
							"message":msg,
							"diceData":dice,
							"spoils":spoils
						}
						seals = false;
						dice = undefined;
						dice_lenght = 0;
						clearTimeout(timer);
						return msg;
					}else{
						return msg;
					}
				} else{
					msg = '没有战利品,输入"/战利品"获取!';
					return msg;
				}
				break;
			default:
				msg = '参数错误,请输入"/战利品 物品 人数"或"物品"和"人数"留空!';
				return msg;
				break;
		}
	}
	function endDice(){
		var cqmsg = [];
		if(dice_lenght){
			var winner;
			var piont = 0;
			for(id in dice){
				cqmsg.push({
					"type": "at",
					"data": {
						"qq": id
					}
				});
				cqmsg.push({
					"type": "text",
					"data": {
						"text": "对" + spoils + "掷出了" + dice[id] + "点!\n"
					}
				});
				var dicepiont = parseInt(dice[id]);
				// console.log(dicepiont + 'and' + piont);
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
		}else{
			cqmsg.push({
				"type": "text",
				"data": {
					"text": "无人参与本次掷骰," + spoils + "已被系统收回!"
				}
			});
		}
		send.setData(cqmsg,cqdata);
		send.sendMsg();
		seals = false;
		dice = undefined;
		dice_lenght = 0;
		clearTimeout(timer);
	}
}

module.exports = Seals;