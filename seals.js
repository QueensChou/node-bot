function Seals(){
	// 存储掷骰结果
	var dice;
	// 是否已有掷骰内容
	var seals = false;
	var cqdata;
	var msg;
	var dice_lenght = 0;
	this.setData = function(data){
		cqdata = data;
	}
	this.Dice = function(){
		var user_id = cqdata.user_id;
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
				var user_lenght = dice_lenght + 1;
				// console.log(user_lenght + 'and' + dice_lenght);
				for (var i = 0; ;i++) {
					if( user_lenght > dice_lenght){
						// console.log(user_lenght);
						var num = Math.floor(Math.random() * 100);
						for (id in dice){
							if(num == dice.id){
								return false;
							}else{
								dice[user_id] = num;
								dice_lenght++;
								msg = '对椒盐海豹进行了掷骰!';
								// console.log(dice);
							}
						}
					}else{
						// console.log(dice);
						break;
					}
				}
			}
		}else{
			var num = Math.floor(Math.random() * 100);
			dice = {};
			dice[user_id] = num;
			// console.log(dice);
			msg = '对椒盐海豹进行了掷骰!';
		}
	}
	this.sendMsg = function(){
		// console.log(cqdata);
		var message = cqdata.raw_message;
		switch (message){
			case '/战利品':
				if (!seals) {
					msg = '获得了新的战利品:椒盐海豹,请输入"/需求"进行掷骰!';
					seals = true;
					return msg;
				} else{
					msg = '已有战利品:椒盐海豹,输入"/需求"进行掷骰!';
					return msg;
				}
				break;
			case '/需求':
				if (seals) {
					this.Dice();
					// console.log(dice);
					if(dice_lenght == 2){
						msg = {
							"enddice":true,
							"message":msg,
							"diceData":dice
						}
						seals = false;
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
				break;
		}
	}
}

module.exports = Seals;