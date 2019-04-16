require('./css/address.less');
var buyerArr = [];

function init(){
    showArr();   
}
init();
function showArr(){
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/userInfo.json',
        timeout: 8000,
        success: function(data){
            console.log(data);
            buyerArr = data.address;
            callback(data);
            bindEvent();//等动态生成的dom结构插入后再绑定事件？
        }
    })
}
function callback(data){
    var arr = data.address,
        str = '';
    arr.forEach(function(item,index){
        if(item.default){
            str += `<li class="item"  buyerId="` + item.buyerId + `">
                        <div class="icon">` + item.name + `</div>
                        <div class="info">
                            <div class="name-and-phone">
                                <p class="name">` + item.name + `</p>
                                <p class="phone">` + item.mobile + `</p>
                            </div>
                            <div class="addr"><span class="default">默认</span>`
                                + item.orderAdderss +
                            `</div>
                        </div>
                        <div class="edit">编辑</div>
                    </li>`
        }else{
            str += `<li class="item"  buyerId="` + item.buyerId + `">
                        <div class="icon">` + item.name + `</div>
                        <div class="info">
                            <div class="name-and-phone">
                                <p class="name">` + item.name + `</p>
                                <p class="phone">` + item.mobile + `</p>
                            </div>
                            <div class="addr">`
                                + item.orderAdderss +
                            `</div>
                        </div>
                        <div class="edit">编辑</div>
                    </li>`
        }
    });
    $('.address-moudle .addr-list').html(str);
}
function bindEvent(){
    $('.address-moudle .nav .tag').on('touchstart',function(){
        $(this).on('touchend',function(){
            $('.wrapper').css('transform','translate3d(0,0,0)');
            $('.address-moudle').css('transform','translate3d(100%,0,0)');
            $(this).off('touchend');
        })
    })
    $('.addr-list .item').on('touchstart',function(){ 
        console.log(66);
        $(this).addClass('active');
        $(this).on('touchend',function(){
            var buyerId = $(this).attr('buyerId'),
                len = buyerArr.length;
            for(var i = 0; i < len; i++){
                if(buyerId == buyerArr[i].buyerId){
                    var info = buyerArr[i];
                    $('.addr-box').attr('buyerId',info.buyerId);
                    $('.buyer-info .name').html(info.name);
                    $('.buyer-info .phone').html(info.mobile);
                    $('.buyer-info .name').html(info.name);
                    $('.addr-info .value').html(info.orderAdderss);
                    break;
                }
            }
            $(this).removeClass('active');
            $('.wrapper').css('transform','translate3d(0,0,0)');
            $('.address-moudle').css('transform','translate3d(100%,0,0)');
            $(this).off('touchend');
       })
   })
}
