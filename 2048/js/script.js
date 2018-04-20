function Game () {
	var _this = this;
	Object.defineProperty(this,"score",{
		set:function (val) {
			document.getElementsByTagName("span")[0].innerText = val;
		}
	})
	
	this.numArr = [];
	this.init = function () {
		this.spareGrid = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
		this.score = 0;
		//将所有格子置空
		this.spareGrid.forEach(function (item) {
			var curDiv = document.getElementsByClassName("grid-"+item)[0]
			curDiv.innerText = "";
			curDiv.className = "grid-"+item;
		})
		var onePos = Math.floor(Math.random()*16);
		this.spareGrid[onePos] = "no";
		var anotherPos = Math.floor(Math.random()*16);
		this.spareGrid[anotherPos] = "no";
		var allDivs = document.getElementById("wrap").getElementsByTagName("div").innerText = "";
		var oneDiv = document.getElementsByClassName("grid-"+onePos)[0];
		oneDiv.innerText = "2";
		oneDiv.className += " active";
		var anotherDiv = document.getElementsByClassName("grid-"+anotherPos)[0];
		anotherDiv.innerText = "2";
		anotherDiv.className += " active";
		console.log(this.spareGrid)
	};
	this.getOneNum = function () {
		var spareGrid = this.spareGrid.filter((item)=>item!="no");
		var len = spareGrid.length;
		if (len>0) {
			var onePos = spareGrid[Math.floor(Math.random()*len)];
			var oneDiv = document.getElementsByClassName("grid-"+onePos)[0];
			oneDiv.innerText = "2";
			oneDiv.className += " active";
			_this.spareGrid[onePos] = "no";//可用格子里 该项设置为no
		} else{
			alert("游戏结束！")
		}
			
	};
	this.getScore = function () {
		this.score = this.quickSort(_this.numArr).pop();
	};
	this.quickSort = function (arr){
	    if(arr.length<=1){
	       return arr;
	    }
	    var pivotIndex=Math.floor(arr.length/2);
	    var pivot=arr.splice(pivotIndex,1)[0];
	    var left=[];
	    var right=[];
	    for(var i=0;i<arr.length;i++){
	        if(arr[i]<pivot){
	           left.push(arr[i]);
	        }else{
	           right.push(arr[i]);
	        }
	    }
	    return _this.quickSort(left).concat([pivot],_this.quickSort(right));
	};
	//判断当前操作是否可执行
	this.operate = function (op) {
		if (op) {
			_this.numArr.forEach(function (item,index) {
				var cur = document.getElementsByClassName("grid-"+index)[0];
				if (item) {
					cur.innerText = item;
					cur.className += " active";
					_this.spareGrid[index] = "no";
				} else{
					cur.innerText = "";
					cur.className = cur.className.replace(/active/gi,"");
					_this.spareGrid[index] = index;
				}
			})
			this.getScore();
			this.getOneNum();
		}
	}
	//监听键盘的下箭头事件
	this.down = function () {
		this.numArr = [];
		var operate = false;
		for (var i = 0;i<4;i++) {
			var arr = [];
			for (var j = 0;j<4;j++) {
				var k = i+4*j;
				var num = document.getElementsByClassName("grid-"+k)[0].innerText;
				if (num) {
					arr.push(num);
				} else{
					arr.push(0);
				}
			}
			//判断是否可操作
			var str = arr.join("");
			var reg = /[1-9]+[0]+/;
			if (reg.test(str)) {
				operate = true;
			}
			arr.forEach(function (item,index) {
				if (item == 0) {
					arr.splice(index,1);
					arr.unshift(0);
				}
			})
			for (var n = 3;n>0;n--) {
				if (arr[n] == arr[n-1] && arr[n]!=0) {
					arr[n] = arr[n-1]*2;
					arr.splice(n-1,1);
					arr.unshift(0);
					operate = true;
				}
			}
			arr.forEach(function (item,index) {
				_this.numArr[i+4*index] = item;
				
			})
		}
		this.operate(operate);
		
			
			
	};
	this.up = function () {
		
	};
	this.left = function () {
		
	};
	this.right = function () {
		this.numArr = [];
		var operate = false;
		for (var i = 0;i<4;i++) {
			var arr = [];
			for (var j = 0;j<4;j++) {
				var k = j+4*i;
				var num = document.getElementsByClassName("grid-"+k)[0].innerText;
				if (num) {
					arr.push(num);
				} else{
					arr.push(0);
				}
			}
			//判断是否可操作
			var str = arr.join("");
			var reg = /[1-9]+[0]+/;
			if (reg.test(str)) {
				operate = true;
			}
			arr.forEach(function (item,index) {
				if (item == 0) {
					arr.splice(index,1);
					arr.unshift(0);
				}
			})
			for (var n = 3;n>0;n--) {
				if (arr[n] == arr[n-1] && arr[n]!=0) {
					arr[n] = arr[n-1]*2;
					arr.splice(n-1,1);
					arr.unshift(0);
					operate = true;
				}
			}
			arr.forEach(function (item,index) {
				_this.numArr[4*i+index] = item;
				
			})
		}
		this.operate(operate)
	}
}
var newGame = new Game();
newGame.init();
var resetBtn = document.getElementsByTagName("button")[0];
resetBtn.addEventListener("click",function () {
	newGame.init();
})
document.onkeydown = function (event) {
	if (event.keyCode == 37) {
		newGame.left();
	} else if (event.keyCode == 38) {
		newGame.up();
	} else if (event.keyCode == 39) {
		newGame.right();
	} else if (event.keyCode == 40) {
		newGame.down();
	}
}
