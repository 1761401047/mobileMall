require('./css/shipRisk.less');
require('./css/shipMode.less');
var dataObj = {
    // id: null,
    // spec: null,
    // specId: null,
    // price: null,
    // num: null
};
var isFree = true;
function init(){
    getMessage();
    initCover(dataObj.id);
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
function initCover(id){
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/goodsList.json',
        timeout: 8000,
        success: function(data){
            console.log(data);
            callBack(data,id);
            bindEvent();
        },
        error: function(){
            console.log('数据获取失败')
        }
    });
}
function callBack(data,id){
    var list = data.list,
        len = list.length,
        PriceRange = '',
        specStr = '';
    for(var i = 0; i < len; i++){
        if(list[i].id === id){
            var riskInfo = list[i].risk,
                str = '';
            isFree = riskInfo.isFree;
            if(isFree){
                var input = document.getElementsByClassName('risk-type-input')[0];
                input.checked = true;
                str = `<p class="risk" isRisk=true>` + riskInfo.disc + `</p>
                       <p class="tag">></p>`;
                $('.ship-risk-cover .type').html(riskInfo.disc);
            }else{
                str = `<p class="risk" isRisk=false>` + riskInfo.disc + `</p>
                       <input class="risk-input" type="checkbox">`;
            }
            $('.risk-box').attr('price',riskInfo.price);
            $('.risk-box').attr('riskId',riskInfo.riskId);            
            $('.ship-risk .cont').html(str);
        }
    }
}
function bindEvent(){
    $('.mask').on('touchstart',function(){
        $(this).on('touchend',function(){
            $(this).removeClass('active');
            $('.ship-risk-cover').removeClass('active');
        })
    })
    $('.risk-close').on('touchstart',function(){
        $(this).addClass('active');        
        $(this).on('touchend',function(){
            $(this).removeClass('active');
            $('.mask').removeClass('active');
            $('.ship-risk-cover').removeClass('active');
            $(this).off('touchend');
        })
    })
    if(isFree){
        console.log(6)
        $('.risk-box').on('touchstart',function(){
            $(this).css('background-color','#eee');
            $(this).on('touchend',function(){
                $(this).css('background-color','transparent');
                $('.ship-risk-cover').addClass('active');
                $('.mask').addClass('active'); 
                $(this).off('touchend');
            })
        })
    }else{
        $('.risk-box').on('touchstart',function(){
            $(this).on('touchend',function(){
                var input = document.getElementsByClassName('risk-input')[0],
                    totalPrice = Number($('.price-and-num .price').html()) * Number($('.price-and-num .num').html()) + Number($('.mode-box').attr('price'));
                if(input.checked == true){
                    input.checked = false;              
                    $('.total-price .value').html(totalPrice);
                }else{
                    input.checked = true;
                    $('.total-price .value').html(totalPrice + Number($('.risk-box').attr('price')));
                }
                $(this).off('touchend');
            })
        })
    }
    $('.ship-risk-cover .risk-type-input').on('click',function(e){
        e.preventDefault();
    })
    $('.risk-box input').on('click',function(e){
        e.preventDefault();
    })
    $('.ship-risk-cover .risk-type').on('touchstart',function(){
        $(this).on('touchend',function(){
            $('.mask').removeClass('active');
            $('.ship-risk-cover').removeClass('active');
            $(this).off('touchend');
        })
    })
}
