require('./css/payPage.less');
require('./address.js');
require('./shipMode.js');
require('./shipRisk.js');
var dataObj = {
    // id: null,
    // spec: null,
    // specId: null,
    // price: null,
    // num: null
};
function init(){
    bindEvent();
    getMessage();
    showPage(dataObj.id);
}
init();
function getMessage(){
    var info = location.search.slice(1).split('&'),
        len = info.length;
        dataObj = {};
    console.log(info);
    for(var i = 0; i < len; i++){
        var arr = info[i].split('=');
        dataObj[arr[0]]= decodeURIComponent(arr[1]);
    }
    console.log(dataObj);
}
function showPage(id){
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/goodsList.json',
        timeout: 8000,
        success: function(data){
            console.log(data);
            callBack(data,id);
        },
        error: function(){
            console.log('数据获取失败')
        }
    });
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/userInfo.json',
        timeout: 8000,
        success: function(data){
            console.log(data);
            showBuyerInfo(data);
        }

    })
}
function showBuyerInfo(data){
    var info = data.address[0];
    $('.buyer-info .name').html(info.name);
    $('.buyer-info .phone').html(info.mobile);
    $('.buyer-info .name').html(info.name);
    $('.addr-info .value').html(info.orderAdderss);
    $('.addr-box').attr('buyerId',info.buyerId);
}
function callBack(data,id){
    var list = data.list,
        len = list.length,
        PriceRange = '',
        specStr = '';
    for(var i = 0; i < len; i++){
        if(list[i].id === id){
            $('.good-info img').attr('src',dataObj.url);
            $('.good-info .info .disc').html(list[i].name);
            $('.good-info .spec .spec-name').html(dataObj.spec);
            $('.price-and-num .price').html(dataObj.price);
            $('.price-and-num .num').html(dataObj.num);
            $('.choose-num .num').html(dataObj.num);
            $('.total-price .value').html(dataObj.price * dataObj.num);
        }   
    }
}
function bindEvent(){
    $('.nav .back').on('touchstart',function(){
        $(this).on('touchend',function(){
            window.history.back();
            $(this).off('touchend');
        })
    })
    $('.choose-num .btn').on('touchstart',function(){
        $(this).addClass('active');
        $(this).on('touchend',function(){
            var totalPrice = 0,
                input = document.getElementsByClassName('risk-input')[0];
            $(this).removeClass('active');      
            if($(this).hasClass('dec')){
                if(dataObj.num > 1){
                    dataObj.num--;
                }
            }else{
                dataObj.num++;
            }    
            totalPrice = dataObj.price * dataObj.num + Number($('.mode-box').attr('price'));   
            if(input && input.checked == true){
                totalPrice += Number($('.risk-box').attr('price'));
                console.log(totalPrice);
            }
            console.log(totalPrice);            
            $('.price-and-num .price').html(dataObj.price);            
            $('.price-and-num .num').html(dataObj.num);
            $('.choose-num .num').html(dataObj.num);
            $('.total-price .value').html(totalPrice);
            $(this).off('touchend');
        })        
    })
    $('.pay-fri').on('touchstart',function(){
        $(this).on('touchend',function(){
            var input = document.getElementsByClassName('pay-fri-input')[0];
            if(input.checked == true){
                input.checked = false;
            }else{
                input.checked = true;
            }
            $(this).off('touchend');
        })
    })
    $('.pay-fri input').on('click',function(e){
        e.preventDefault();
    })
    $('.addr-box').on('touchstart',function(){
        $(this).addClass('active');
        $(this).on('touchend',function(){
            $(this).removeClass('active');
            $('.wrapper').css('transform','translate3d(-100%,0,0)');
            $('.address-moudle').css('transform','translate3d(0,0,0)');
            $(this).off('touchend');
        })    
    })
    $('.account .sub').on('touchstart',function(){
        $(this).addClass('active');
        $(this).on('touchend',function(){
            $(this).removeClass('active');
            $('.suc-tip').css('display','block');
            $(this).off('touchend');
            setTimeout(function(){
                window.location.href = 'http://localhost:8080/dist/index.html';
            },500);
            showOrderMessage();
        })
    })
}
function showOrderMessage(){
    delete dataObj.spec;
    dataObj.buyerId = $('.adrr-box').attr('buyerId');
    dataObj.shipId = $('.ship-box').attr('shipId');
    dataObj.riskId = $('.risk-box').attr('riskId');  
    console.log(dataObj);  
}

