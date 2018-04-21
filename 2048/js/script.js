    var game = document.getElementById("game"),
        countingResult=document.getElementById("countingResult"),
        counting=0,
        b=[],
        dragging = false,
        mouseX,mouseY,left,height,
        flag=false;
    for(var i=1;i<=16;i++){
        b[i] = document.getElementById("b"+i);
    }
    document.ontouchmove = function(e){
        e.preventDefault();
    }
    function setNew(){
        var random = Math.ceil(Math.random()*16);
        while(b[random].innerHTML)random=Math.ceil(Math.random()*16);
        var ran=Math.ceil(Math.random()*2);
        b[random].innerHTML = 2*ran;
        b[random].classList.add("count"+2*ran);
        b[random].classList.add("block");
    }
    setNew();
    
    for(var i=1;i<=16;i++){
        function down(e){
            dragging = true;
            mouseX = e.clientX;
            mouseY = e.clientY;
        }
        game.addEventListener("touchstart",function(e){
            dragging = true;
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
        });
        game.addEventListener("touchend",function(e){
            dragging = false;
        })
        game.addEventListener("mousedown",function(e){down(e)});
        document.onmouseup=function(e){
            dragging = false;
        }
        function moving(e,method,cell){
        if(dragging){
            if(method=="mouse"){
                left = e.clientX;
            }
            else if(method=="finger"){
                left = e.touches[0].clientX;
            }
            if(left-mouseX>cell){
                for(var r=1;r<=4;r++){
                    ltr(r);
                }
                handle();
            }
            if(mouseX-left>cell){
                for(var r=1;r<=4;r++){
                    rtl(r);
                }
                handle();
            }
        }
        if(dragging){
            if(method=="mouse"){
                ttop = e.clientY;
            }
            else if(method=="finger"){
                ttop = e.touches[0].clientY;
            }
            if(ttop - mouseY>cell){
                for(var col=1;col<=4;col++){
                    ttd(col);
                }
                handle();
            }
            if(mouseY-ttop>cell){
                for(var col=1;col<=4;col++){
                    dtt(col);
                }
                handle();
            }
        }
    }
    
    //根据手机端和电脑端设置不同的参数确定移动
    b[i].addEventListener("touchmove",function(e){
        moving(e,"finger",50);
    })
    b[i].addEventListener("mousemove",function(e){
        moving(e,"mouse",100);
    });

    }
    //从左往右
    function ltr(r){
        var arr=[];
        for(var i=4;i>0;i--){
            arr.push(b[(r-1)*4+i].innerHTML);
        }
        var before = JSON.stringify(arr);
        var len=arr.length;
        for(var i=0;i<len;i++){
            if(arr[i]==''){
                arr.splice(i,1);
                i-=1;
            }
        }
        for(var j=0;j<arr.length;j++){
            if(arr[j]==arr[j+1]){
                arr[j]*=2;
                counting+=arr[j];
                countingResult.innerHTML=counting;
                for(var k=j+1;k<arr.length-1;k++){
                    arr[k]=arr[k+1];
                }
                arr[arr.length-1]='';
            }
        }
        for(var j=0;j<4;j++){
            var temp = r*4-j;
            if(arr[j]){
                b[temp].classList.remove("count"+b[temp].innerHTML);
                b[temp].innerHTML=arr[j];
                b[temp].classList='';
                b[temp].classList.add("block");
                b[temp].classList.add("count"+arr[j]);
            }
            else{
                b[temp].classList.remove("count"+b[temp].innerHTML);
                b[temp].innerHTML='';
                b[temp].classList='';
                b[temp].classList.add("count0");
                b[temp].classList.add("block");
            }
        }
        while(arr.length<4)arr.push('');
        var after= JSON.stringify(arr);
        if(before!=after&&!flag)flag=true;
    }
    function rtl(r){
        var arr=[];
        for(var i=1;i<=4;i++){
            arr.push(b[(r-1)*4+i].innerHTML);
        }
        var before = JSON.stringify(arr);
        var len=arr.length;
        for(var i=0;i<len;i++){
            if(arr[i]==''){
                arr.splice(i,1);
                i-=1;
            }
        }
        for(var j=0;j<arr.length;j++){
            if(arr[j]==arr[j+1]){
                arr[j]*=2;
                counting+=arr[j];
                countingResult.innerHTML=counting;
                for(var k=j+1;k<arr.length-1;k++){
                    arr[k]=arr[k+1];
                }
                arr[arr.length-1]='';
            }
        }
        for(var j=0;j<4;j++){
            var temp = (r-1)*4+j+1;
            if(arr[j]){
                b[temp].classList.remove("count"+b[temp].innerHTML);
                b[temp].innerHTML = arr[j];
                b[temp].classList='';
                b[temp].classList.add("block");
                b[temp].classList.add("count"+arr[j]);
            }
            else {
                b[temp].classList.remove("count"+b[temp].innerHTML);
                b[temp].innerHTML='';
                b[temp].classList='';
                b[temp].classList.add("count0");
                b[temp].classList.add("block");
            }
        }
        while(arr.length<4)arr.push('');
        var after= JSON.stringify(arr);
        if(before!=after&&!flag)flag=true;
    }
    function ttd(col){
        var arr=[];
        for(var i=1;i<=4;i++){
            arr.push(b[col+(i-1)*4].innerHTML);
        }
        var before = JSON.stringify(arr);
        var len=arr.length;
        for(var i=0;i<len;i++){
            if(arr[i]==''){
                arr.splice(i,1);
                i-=1;
            }
        }
        for(var j=arr.length-1;j>0;j--){
            if(arr[j]==arr[j-1]){
                arr[j]*=2;
                counting+=arr[j];
                countingResult.innerHTML=counting;
                for(var k=j-1;k>=1;k--){
                    arr[k]=arr[k-1];
                }
                arr.splice(0,1)
            }
        }
        for(var j=0;j<4;j++){
            var temp = col+(3-j)*4;
            if(j<arr.length){
                b[temp].classList.remove("count"+b[temp].innerHTML);
                b[temp].innerHTML = arr[arr.length-1-j];
                b[temp].classList='';
                b[temp].classList.add("block");
                b[temp].classList.add("count"+arr[arr.length-1-j]);
            }
            else{
                b[temp].classList.remove("count"+b[temp].innerHTML);
                b[temp].innerHTML='';
                b[temp].classList='';
                b[temp].classList.add("count0");
                b[temp].classList.add("block");
            }
        }
        arr=arr.reverse();
        while(arr.length<4)arr.push('');
        var after= JSON.stringify(arr.reverse());
        if(before!=after&&!flag){flag=true;}
    }
    function dtt(col){
        var arr=[];
        for(var i=1;i<=4;i++){
            arr.push(b[col+(i-1)*4].innerHTML);
        }
        var before = JSON.stringify(arr);
        var len=arr.length;
        for(var i=0;i<len;i++){
            if(arr[i]==''){
                arr.splice(i,1);
                i-=1;
            }
        }
        for(var j=0;j<arr.length;j++){
            if(arr[j]==arr[j+1]){
                arr[j]*=2;
                counting+=arr[j];
                countingResult.innerHTML=counting;
                for(var k=j+1;k<arr.length-1;k++){
                    arr[k]=arr[k+1];
                }
                arr.splice(arr.length-1,1)
            }
        }
        for(var j=0;j<4;j++){
            var temp = col+j*4;
            if(j<arr.length){
                b[temp].classList.remove("count"+b[temp].innerHTML)
                b[temp].innerHTML = arr[j];
                b[temp].classList.add("block");
                b[temp].classList.add("count"+arr[j]);
            }
            else {
                b[temp].classList.remove("count"+b[temp].innerHTML)
                b[temp].innerHTML='';
                b[temp].classList.add("count0");
                b[temp].classList.add("block");
            }
        }
        while(arr.length<4)arr.push('');
        var after= JSON.stringify(arr);
        if(before!=after&&!flag)flag=true;
    }

    //判定成功失败条件
    function judge(){
        for(var i=1;i<=16;i++){
            if(b[i].innerHTML==2048){
                var success=confirm("恭喜！游戏成功！");
                if(success){
                    newGame();
                }
            }
            if(!b[i].innerHTML)return false;
            if((i+1<=16)&&(i%4!=0)&&(b[i+1].innerHTML==''||b[i+1].innerHTML==b[i].innerHTML)){
                return false;
            }
            if(i-1>=1&&(i%4!=1)&&(b[i-1].innerHTML==''||b[i-1].innerHTML==b[i].innerHTML)){
                return false;
            }
            if(i-4>=1&&(b[i-4].innerHTML==''||b[i-4].innerHTML==b[i].innerHTML)){
                return false;
            }
            if(i+4<=16&&(b[i+4].innerHTML==''||b[i+4].innerHTML==b[i].innerHTML)){
                return false;
            }
        }
        return true;
    }
    //开始新游戏，删除所有元素内容
    function newGame(){
        for(var j=1;j<=16;j++){
            b[j].innerHTML='';
            b[j].classList='';
            b[j].classList.add("block");
        }
        setNew();
    }
    //如果数据变化则生成一个新的随机数，并判定游戏是否结束
    function handle(){
        dragging=false;
        if(flag){
            setNew();
            var result = judge();
            if(result)
                alert("没有可移动！游戏失败！");
        }
        flag=false;
    }
