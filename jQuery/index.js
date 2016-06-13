$(function  () {
//变量
    var hang=20,
        fangxiang=39,
        fx='right';
        turn=39;
        she=[{'x':0,'y':0},{'x':0,'y':1},{'x':0,'y':2},{'x':0,'y':3}],
        zidianshe={'0_0':true,'0_1':true,'0_2':true},
        timerId=null,
        shiwu=null;
//函数
    var selector=function  (el) {
    	return $('#'+el.x+'-'+el.y)
    }
    //画盒子
	var scene=function  () {
		var box=$('#sence');
		var xy=Math.floor(580/hang);
		for( var i =0 ; i<hang;i++){
			for(var j=0 ; j<hang;j++){
				$('<div>')
				.addClass('block')
				.width(xy-1)
				.height(xy-1)
				.attr('id',i+'-'+j)
				.appendTo(box);
			}
		}
		box.width(xy*hang).height(xy*hang);
		$('.border')
		.width(xy*hang+70)
		.height(xy*hang+70)
	}
    //画蛇
    var huashi=function  () {
    	she.forEach(function  (v) {
    		selector(v).addClass('shengright').attr('data-row','right');
    	})
    	var tou=she[she.length-1];
    	selector(tou).addClass('touright');
    	var wei=she[0];
    	selector(wei).addClass('weiright');
    }
    //画食物
    var fangshiwu=function  () {
	    do{
	        var _x=Math.floor(Math.random()*hang);
	        var _y=Math.floor(Math.random()*hang);
        }while(zidianshe[_x+'_'+_y])
	    shiwu={'x':_x,'y':_y};
	    selector(shiwu).addClass('shiwu');	
    }
    var anew=function  () {
    	$('li').removeClass('sel301 sel151 sel201');
    	$('#sence').empty();
    	scene();
    	huashi();
    	fangshiwu();
    }

    var move=function  () {
	var jiutou=she[she.length-1];
	if(fangxiang===39){
       	var xintou={'x':jiutou.x,'y':jiutou.y+1};
       	fx='right';			
	}
	else if(fangxiang===37) {
		var xintou={'x':jiutou.x,'y':jiutou.y-1};
		fx='left';
	}
	else if(fangxiang===38){
		var xintou={'x':jiutou.x-1,'y':jiutou.y};
		fx='top';
	}
	else if(fangxiang===40){
		var xintou={'x':jiutou.x+1,'y':jiutou.y};
		fx='bottom';
	}
	if(turn!==fangxiang){
		   var pre=selector(she[she.length-2]).attr('data-row')
    	   selector(jiutou).addClass(pre+'-'+fx).attr('data-row',fx);
    	}
        turn=fangxiang;
	//撞墙或撞自己死
	if(xintou.x>hang-1||xintou.y>hang-1||xintou.x<0||xintou.y<0||zidianshe[xintou.x+'_'+xintou.y]){
		clearInterval(timerId)
		$('.gameover').css('display','block');
		return;
	}//吃东西
	else if(xintou.x===shiwu.x&&xintou.y===shiwu.y){
		selector(shiwu).removeClass('shiwu');
		fangshiwu();
	}//正常移动
	else{
		var weiba=she.shift();
		delete zidianshe[weiba.x+'_'+weiba.y];
		selector(weiba).removeAttr('class data-row').addClass('block');
	}
	//去旧头
	selector(jiutou).removeClass('touright toutop touleft toubottom');
	//加新头
	zidianshe[xintou.x+'_'+xintou.y]=true;
	selector(xintou).addClass('tou'+fx+' sheng'+fx).attr('data-row',fx);
	she.push(xintou);
    //加新尾
    var index=selector(she[0]).attr('data-row');
   	selector(she[0]).addClass('wei'+index+' sheng'+index);
    }

    var start=function  () {
    	clearInterval(timerId);
    	timerId=setInterval(move,200);
    }
    var stop=function  () {
    	clearInterval(timerId);
    }
    var restrat=function  () {
    	stop();
		fangxiang=39;
		timerId=null;
		she=[{'x':0,'y':0},{'x':0,'y':1},{'x':0,'y':2},{'x':0,'y':3}];
		zidianshe={'0_0':true,'0_1':true,'0_2':true};
		main();
    }
    var main=function  () {
    	$('#sence').empty();
		scene();
		huashi();
		fangshiwu();
    }

//主体
    main();

//事件
//选择列
$('#big li[data-row]').bind('click',function  () {
	if(timerId){ 
		return
	}
	hang=Number($(this).attr('data-row'));
	anew();
	if(hang===15){
		$(this).addClass('sel151')
	}else if(hang===20){
		$(this).addClass('sel201')
	}else{
		$(this).addClass('sel301')
	}
})
//自定义列
$('#big li input').bind('keydown',function  (e) {
	console.log(timerId)
	if(timerId){ 
		return
	}
	if(e.keyCode===13){
		var num=Number($(this).val());
		if(num<5||num>30||isNaN(num)){
			alert('请重输');
			return;
		}
		hang=num;
		anew();
		$(this).parent().addClass('pitch');
	}
})
//调整上下左右
$(document).bind('keydown',function  (e) {
	if(e.keyCode>40||e.keyCode<37||Math.abs(e.keyCode-fangxiang)===2){ return } 
	fangxiang=e.keyCode;

})
//开始游戏//暂停//重新开始
$('#check li').bind('click',function  () {
	var st=$(this).attr('data-id');
	if(st==='strat'){
		start();
	}else if(st==='stop'){
		stop();
	}else{
		restrat();
	}
})

//弹出界面重新开始
$('.gameover img').on('click',function  () {
	restrat();
	$(this).parent().css('display','none');
	start();
})


})
