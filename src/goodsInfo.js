require('./css/goodsInfo.less')
require('./goodsCover.js')
function init(){
    bindEvent();
    var id = getId();
    showPage(id);  
}
init();
function getId(){
    var id = location.search.slice(1).split('=')[1];
    return id;
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
}
function callBack(data,id){
    var list = data.list,
        len = list.length,
        PriceRange = '',
        picStr = '';
    for(var i = 0; i < len; i++){
        if(list[i].id === id){
            targetObj = list[i];
            $('.top-pic').css('background-image',"url('" + list[i].imgurl[0] + "')");
            $('.top>.title').html(list[i].name);
            PriceRange = getPriceRange(list[i].spectList);
            $('.top>.price>.pri').html(PriceRange);
            picStr = getInsertPic(list[i]);
            $('.good-detail>.pic-box').html(picStr);
            break;
        }   
    }
}
function getInsertPic(picArr){
    var picStr = '';
    picArr.imgurl.forEach(function(item,index){
        if(index != 0){
            picStr += '<img src="' + item + '" alt="" class="pic">'
        }
    });
    return picStr;
}
function getPriceRange(arr){
    var max = 0,
        min = Infinity;
    arr.forEach(function(item){
        if(item.price > max){
            max = item.price;
        }
        if(item.price < min){
            min = item.price;
        }
    });
    if(min == max){
        return min;
    }else{
        return min + '-' + max;
    }  
}
function bindEvent(){
    $('.good-buy,.good-type').on('touchstart',function(){
        $(this).addClass('active');
        $(this).on('touchend',function(){
            $(this).removeClass('active');
            $('html').css('height','100%').css('overflow','hidden');
            $('.cover').addClass('active');
            $('.good-cover .box').addClass('active');
            $('.cover').on('touchstart',function(){
                $(this).on('touchend',function(){
                    $('.cover').removeClass('active');
                    $('.good-cover .box').removeClass('active');
                    $('html').css('overflow','visible');
                    $(this).off('touchstart');
                    $(this).off('touchend');
                })   
            })
            $(this).off('touchend');
        })
    })
}