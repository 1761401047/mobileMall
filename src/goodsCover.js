require('./css/goodsCover.less');
var dataObj = {
    id: getId(),
    spec: null,
    specId: null,
    price: null,
    num: 1
}
function init(){
    bindEvent();
    var id = getId();
    showCover(id);
}
init();
function getId(){
    var id = location.search.slice(1).split('=')[1];
    console.log(id);
    return id;
}
function showCover(id){
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
        totalQuantity = 0;
        specStr = '';
    for(var i = 0; i < len; i++){
        if(list[i].id === id){
            $('.top-info img').attr('src',list[i].imgurl[0]);
            PriceRange = getPriceRange(list[i].spectList);
            $('.top-info .price').children('span').html(PriceRange);
            specStr = getSpecList(list[i].spectList);
            $('.good-cover .spec-list').html(specStr);
            totalQuantity = getTotalQuantity(list[i].spectList);
            $('.top-info .quantity').children('span').html(totalQuantity);
            $('.top-info .choose').children('span').html("请选择规格");
            break;
        }   
    }
}
function getSpecList(arr){
    var specStr = '';
    arr.forEach(function(item){
        specStr += `<li class="item" url="` + item.url + `" specId="` + item.nid + `" spec="` + item.spect + `" price="` + item.price + `" quantity="` + item.quantity +`">
                        <img src="` + item.url + `" alt="">
                        <div class="disc">` + item.spect + `</div>
                    </li>`
    });
    return specStr;
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
function getTotalQuantity(arr){
    var totalNum = 0;
    arr.forEach(function(item){
        totalNum += Number(item.quantity);
    });
    return totalNum;
}
function bindEvent(){
    var num = 1,
        flag = true;
    $('.btn').on('touchstart',function(){
        $(this).addClass('active');
    })
    $('.btn').on('touchend',function(){
        $(this).removeClass('active');
        if($(this).hasClass('dec')){
            num = calcNum.dec();
        }else{
            num = calcNum.add();
        }
        $('.button .num').html(num);
        dataObj.num = num;
        console.log(dataObj.num);
    })
    $('.spec-list').on('touchstart','li',function(){
        $(this).on('touchend',function(){
            dataObj.spec = encodeURIComponent($(this).attr('spec'));
            dataObj.specId = $(this).attr('specId');
            dataObj.price = $(this).attr('price');
            dataObj.url = $(this).attr('url');
            $('.spec-list li').removeClass('active');
            $(this).addClass('active');
            $('.top-info img').attr('src',$(this).attr('url'));
            $('.top-info .price').children('span').html($(this).attr('price'));
            $('.top-info .quantity').children('span').html($(this).attr('quantity'));
            $('.top-info .choose').children('span').html($(this).attr('spec'));          
            if(flag){
                flag = false;
                $('.confirm').addClass('useful');
                $('.good-cover .confirm').on('touchstart',function(){
                    $(this).addClass('active');
                    $(this).on('touchend',function(){
                        $(this).removeClass('active');
                        window.location.href = 'http://localhost:8080/dist/payPage.html?id=' + dataObj.id + '&spec=' + dataObj.spec + '&specId=' + dataObj.specId + '&price=' + dataObj.price + '&num=' + dataObj.num + '&url=' + dataObj.url;
                        $(this).off('touchend');
                    })
                })
            }  
            $(this).off('touchend');
        })
    })
}
var calcNum = (function(){
    var num = 1;
    function dec(){
        if(num > 1){
            num--;
            return num;
        }
    }
    function add(){
        num++;
        return num;
    }
    return {
        dec: dec,
        add: add
    }
})()