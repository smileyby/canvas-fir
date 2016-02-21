window.onload=function(){
	canvas=document.querySelector('#canvas');
	ctx=canvas.getContext("2d");
    canvas_time=document.querySelector('#canvas_time');
    ctx_time=canvas_time.getContext("2d");
	ctx.beginPath();
	ctx.strokeStyle="#ff5600";
    var num=0;
    //时钟
    var drawClock=function(){
        ctx_time.clearRect(0,0,200,200);
        //保存干净的画布状态
        ctx_time.save();
        ctx_time.strokeStyle="#000";
        ctx_time.lineWidth=3;
        ctx_time.translate(100,100);
        //画表盘
        ctx_time.save();
        ctx_time.beginPath();
        ctx_time.arc(0,0,100,0,Math.PI*2);
        ctx_time.stroke();

        //中心装饰圆
        ctx_time.beginPath();
        ctx_time.fillStyle="red";
        ctx_time.arc(0,0,6,0,Math.PI*2);
        ctx_time.fill();
        ctx_time.restore();

        //秒针
        ctx_time.save();
        ctx_time.lineCap="round";
        ctx_time.strokeStyle="red";
        ctx_time.lineWidth=2;
        ctx_time.beginPath();
        ctx_time.rotate(Math.PI/60*num);
        num+=1;
        console.log(num);
        ctx_time.moveTo(0,30);
        ctx_time.lineTo(0,-60);
        ctx_time.stroke();
        //秒针装饰圆
        ctx_time.strokeStyle="red";
        ctx_time.beginPath();
        ctx_time.lineWidth=2;
        ctx_time.moveTo(5,-65);
        ctx_time.arc(0,-65,5,0,Math.PI*2);
        ctx_time.stroke();
        ctx_time.restore();

        ctx_time.lineCap="round";
        ctx_time.strokeStyle="#000";
        ctx_time.lineWidth=2;
        ctx_time.beginPath();
        for(var i=1;i<61;i++){
            ctx_time.rotate(Math.PI/30);
            //取余5为0时条件为假****注意****
            if(i%5){
                ctx_time.moveTo(95,0);
            }else{
                ctx_time.moveTo(85,0);  
            }
            ctx_time.lineTo(100,0);
        }
        ctx_time.stroke();
        //恢复干净的画布状态
        ctx_time.restore();            
    }
    drawClock();
	//绘制棋盘
	var huaqipan=function(){
		ctx.clearRect(0,0,600,600);
		for(var i=0;i<15;i++){
			var lingard = ctx.createLinearGradient(20,20,20,580);
		    lingard.addColorStop(0,'red');
		    lingard.addColorStop(1,'blue');
		    ctx.strokeStyle = lingard;
			ctx.moveTo(20,20.5+i*40);
		    ctx.lineTo(580,20.5+i*40);
		    ctx.stroke();
		}
		for(var i=0;i<15;i++){
			var lingard = ctx.createLinearGradient(20,20,580,20);
		    lingard.addColorStop(0,'yellow');
		    lingard.addColorStop(1,'purple');
		    ctx.strokeStyle = lingard;
			ctx.moveTo(20.5+i*40,20);
			ctx.lineTo(20.5+i*40,580);
			ctx.stroke();
		}
		ctx.moveTo(300.5,300.5);
		ctx.arc(300.5,300.5,4,0,Math.PI*2);
		ctx.fillStyle="#000";
		ctx.fill();
		var place=[140.5,460.5];
		for(var i=0;i<place.length;i++){
			for(var k=0;k<place.length;k++){
				ctx.moveTo(place[i],place[k]);
				ctx.arc(place[i],place[k],4,0,Math.PI*2);
				ctx.fill();
			}
		}
	}
	huaqipan();
	//控制落子的地点
    var luozi2=function(x,y,color){
    	var zx=40*x+20.5;
    	var zy=40*y+20.5;
    	var black=ctx.createRadialGradient(zx,zy,1,zx,zy,8);
	    black.addColorStop(0.1,'#555');
	    black.addColorStop(1,'black');
	    var fff=ctx.createRadialGradient(zx,zy,1,zx,zy,18);
	    fff.addColorStop(0.1,'#fff');
	    fff.addColorStop(1,'#ddd');
	    ctx.shadowOffsetX = 2;
		ctx.shadowOffsetY = 2;
		ctx.shadowBlur = 8;
		ctx.shadowColor="rgba(0,0,0,0.5)";
    	ctx.beginPath();
    	ctx.fillStyle=color?black:fff;
        ctx.arc(zx,zy,10,0,Math.PI*2);
        ctx.fill();
    }
    var qiziimg=document.querySelector("#sucai");
    var luozi=function(x,y,color){
        var zx=40*x+20.5-15;
    	var zy=40*y+20.5-15;
        //ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        //sx, sy, sWidth, sHeight(原图片位置,宽高)
        //dx, dy, dWidth, dHeight(放置后图片的位置,宽高)
    	if(color){
    	    ctx.drawImage(qiziimg,1,0,31,31,zx,zy,31,31);
    	}else{
    	    ctx.drawImage(qiziimg,33,0,31,31,zx,zy,31,31);
    	}
    }
    var data={};
    var flag=localStorage.x?false:true;
    var times;
    canvas.onclick=function(e){
        clearInterval(times);
        num=0;
        drawClock();
        times=setInterval(drawClock,1000);
    	//位置四舍五入
    	var x=Math.round((e.offsetX-20.5)/40);
    	var y=Math.round((e.offsetY-20.5)/40);
    	if(data[x+'_'+y]){return;}
    	luozi(x,y,flag);
    	data[x+'_'+y]=flag?'black':'white';
    	flag=!flag;
    	localStorage.data=JSON.stringify(data);
    	//判断棋子颜色，调用判断函数判断输赢
    	if(flag){
    		if(panduan(x,y,'white')){
                clearInterval(times);
                num=0;
                drawClock();
    			try_again.innerHTML="白棋胜Try_again";
    			openflag();
    		}	
    	}else{
    		if(panduan(x,y,'black')){
                clearInterval(times);
                num=0;
                drawClock();
    			try_again.innerHTML="黑棋胜Try_again";
    			openflag();
    		}	
    	}
        //记录黑棋
    	if(!flag){
            localStorage.x="1";
    	}else{
    	    localStorage.removeItem("x");
    	}
    }
    var xy2id=function(x,y){
        return x+'_'+y;
    }
    //判断输赢
    var panduan=function(x,y,color){
        var shuju = filter(color);
        var tx,ty,hang=1;shu=1;zuoxie=1;youxie=1;
        tx=x;
        ty=y;
        while(shuju[xy2id(tx-1,ty)]){
        	tx--;
        	hang++;
        }
        tx=x;
        ty=y;
        while(shuju[xy2id(tx+1,ty)]){
        	tx++;
        	hang++;
        }
        if(hang>=5){return true;}
        tx=x;
        ty=y;
        while(shuju[xy2id(tx,ty-1)]){
        	ty--;
        	shu++;
        }
        tx=x;
        ty=y;
        while(shuju[xy2id(tx,ty+1)]){
        	ty++;
        	shu++;
        }
        if(shu>=5){return true;}
        tx=x;
        ty=y;
        while(shuju[xy2id(tx+1,ty-1)]){
        	tx++;
        	ty--;
        	youxie++;
        }
        tx=x;
        ty=y;
        while(shuju[xy2id(tx-1,ty+1)]){
        	tx--;
        	ty++;
        	youxie++;
        }
        if(youxie>=5){return true;}
        tx=x;
        ty=y;
        while(shuju[xy2id(tx-1,ty-1)]){
        	tx--;
        	ty--;
        	zuoxie++;
        }
        tx=x;
        ty=y;
        while(shuju[xy2id(tx+1,ty+1)]){
        	tx++;
        	ty++;
        	zuoxie++;
        }
        if(zuoxie>=5){return true;}
    }
    //读取当前颜色棋子的所有数据
    var filter = function(color){
    	var r = {};
        for(var i in data){
        	if(data[i]==color){
               r[i]=data[i];
        	}
        }
        return r;
    }
    //再试一次开关的显示/隐藏
    var openflag=function(){
    	again.style.display="block";
    }
    yes.onclick=restart.onclick=function(){
    	localStorage.clear();
    	data={};
    	huaqipan();
    	flag=true;
    	again.style.display="none";
        clearInterval(times);
        num=0;
        drawClock();
    	return;
    }
    restart.onmouseover=function(){
        this.className="restart";
    }
    restart.onmouseout=function(){
        this.className="";
    }
    huiqi.onmouseover=function(){
        this.className="huiqi";
    }
    huiqi.onmouseout=function(){
        this.className="";
    }
    no.onclick=function(){
        canvas.onclick=null;
        again.style.display="none";
    }
    //判断是否有残局数据，如果有则打开页面是进行加载
    //localStorage  本地保存数据
    //JSON.stringify(obj)对象转字符串
    //JSON.parse(str)字符串转对象
    if(localStorage.data){
    	data=JSON.parse(localStorage.data);
    	for(var i in data){
    		var x=i.split("_")[0];
    		var y=i.split("_")[1];
    		luozi(x,y,(data[i]=='black')?true:false);
    	}
    }
    canvas.ondblclick=function(e){
    	e.stopPropagation();
    	return false;
    }
    document.ondblclick=function(){
    	localStorage.clear();
    	location.reload();
    }
    //悔棋
    huiqi.onclick=function(){
        //悔棋以后时间静止？？？？？
        clearInterval(times);
        num=0;
        drawClock();
        times=setInterval(drawClock,1000);
        huaqipan();
        var colorarr=[];
        var zuobiaoarr=[];
        data=JSON.parse(localStorage.data);
        if(JSON.stringify(data)==0){
            huiqi.onclick=null;
            return;
        }
        for(var i in data){
            zuobiaoarr.push(i);
            colorarr.push(data[i]);   
        }
        colorarr.pop();
        zuobiaoarr.pop();
        for(var i=0;i<colorarr.length;i++){
            var x=zuobiaoarr[i].split("_")[0];
            var y=zuobiaoarr[i].split("_")[1];
            luozi(x,y,(colorarr[i]=='black')?true:false);
            if(((colorarr[i]=='black')?true:false)){
               localStorage.x="1";
            }else{
                localStorage.removeItem("x");
            } 
        }
        //更新localStorage
        data={};
        for(var i=0;i<zuobiaoarr.length;i++){
            var x=zuobiaoarr[i].split("_")[0];
            var y=zuobiaoarr[i].split("_")[1];
            data[x+'_'+y]=colorarr[i];
        }
        localStorage.data=JSON.stringify(data);
        location.reload();
        
    }
    	//中心渐变
    	//var black=ctx.createRadiaGradient(zx,zy,1,zx,zy,18);
    	//black.addColorStop(0.5,'red');
    	//渐变色的定义
    	//括号中的参数是起始点和结束点的坐标
    	//var lingard = ctx.createLinearGradient(20,300,580,300);
    	//lingard.addColorStop(0,'red');
    	//lingard.addColorStop(0.2,'blue');
    	//lingard.addColorStop(0.4,'yellow');
    	//lingard.addColorStop(0.6,'green');
    	//lingard.addColorStop(0.8,'pink');
    	//lingard.addColorStop(1,'gray');
    	
    	//控制线条的粗细程度
    	//ctx.lineWidth = 10;
    	//lineCap控制线条的两端形状
    	//ctx.lineCap = 'round';

    	//ctx.strokeStyle = lingard;
    	//ctx.fillStyle = lingard;
    	//ctx.beginPath();
    	//ctx.fillRect(250,250,100,100);
    	//ctx.moveTo(20,300);
    	//ctx.lineTo(580,300);
    	//ctx.stroke();
        //棋子
        //ctx.beginPath();
        //ctx.moveTo(20,20);
        //ctx.fillStyle="#fff";
        //ctx.arc(20,20,10,0,Math.PI*2);
        //ctx.shadowOffsetX = 2;
    	//ctx.shadowOffsetY = 2;
    	//ctx.shadowBlur = 8;
    	//ctx.shadowColor="rgba(0,0,0,0.5)";
        //ctx.fill();
        //棋子绘制
        // x number 棋子横坐标
        // y number 棋子纵坐标
        // color boolean 棋子的颜色

}