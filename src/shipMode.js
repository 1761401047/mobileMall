require('./css/shipMode.less');
var dataObj = {
    // id: null,
    // spec: null,
    // specId: null,
    // price: null,
    // num: null
};
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
            var shipArr = list[i].shipType,
                str = '';
            shipArr.forEach(function(item,index){
                if(index == 0){
                    str += `<div class="ship-type" price="` + item.price + `" shipId="` + item.id + `">
                            <div class="type">` + item.type + `</div>                
                            <input class="ship-type-input" type="checkbox" checked=true>
                        </div>`;
                }else{
                    str += `<div class="ship-type" price="` + item.price + `">
                            <div class="type">` + item.type + `</div>                
                            <input class="ship-type-input" type="checkbox">
                        </div>`;
                }
            });   
            $('.mode-box .mode').html(shipArr[0].type);
            $('.mode-box').attr('price',shipArr[0].price);
            $('.mode-box').attr('shipId',shipArr[0].id);            
            $('.ship-mode-cover .cont').html(str);
        }
    }
}
function bindEvent(){
    $('.mode-box').on('touchstart',function(){
        $(this).css('background-color','#eee');
        $(this).on('touchend',function(){
            $(this).css('background-color','transparent');
            $('.ship-mode-cover').addClass('active');
            $('.mask').addClass('active');  
            $(this).off('touchend');
        })
    })
    $('.ship-type').on('touchstart',function(){
        $(this).on('touchend',function(){
            var inputs = document.getElementsByClassName('ship-type-input'),
               len = inputs.length,
               input = document.getElementsByClassName('risk-input')[0],
               totalPrice = Number($('.price-and-num .price').html()) * Number($('.price-and-num .num').html());
            if(input && input.checked == true){
                totalPrice += Number($('.risk-box').attr('price'));
                console.log(totalPrice);
            }
            for(var i = 0; i < len; i++){
                //使用setAttribute控制checked状态的方式无效
                inputs[i].checked = false;
            }       
            this.lastElementChild.checked = true;
            $('.mode-box .mode').html($(this).children('.type').html());
            $('.mode-box').attr('price',$(this).attr('price'));
            $('.mode-box').attr('shipId',$(this).attr('shipId'));
            $('.total-price .value').html(totalPrice + Number($(this).attr('price')));
            setTimeout(function(){
                $('.mask').removeClass('active');
                $('.ship-mode-cover').removeClass('active');
            },200);
            $(this).off('touchend');
        })
    })
    //关键一步，将复选框的默认点击事件取消，使复选框的状态完全由js控制
    $('.ship-type input').on('click',function(e){
        e.preventDefault();
    })
    $('.mask').on('touchstart',function(){
        $(this).on('touchend',function(){
            $(this).removeClass('active');
            $('.ship-mode-cover').removeClass('active');
        })
    })
    $('.mode-close').on('touchstart',function(){
        $(this).addClass('active');        
        $(this).on('touchend',function(){
            $(this).removeClass('active');
            $('.mask').removeClass('active');
            $('.ship-mode-cover').removeClass('active');
            $(this).off('touchend');
        })
    })
}