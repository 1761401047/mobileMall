require('./css/index.less');
function init(){
    addGoods();
}
init();
function addGoods(){
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/goodsList.json',
        timeout: 8000,
        success: function (data) {
            console.log(data);
            callBack(data);
        },
        error: function (data) {
            console.log('商品列表获取失败');
        }
    })
}
function callBack(data){
    var list = data.list,
        str = '';
    list.forEach(function(ele){
        str += `<a href="http://localhost:8080/dist/goodsInfo.html?id=` + ele.id + `">
                    <div class="good">
                        <img src="` + ele.imgurl[0] + `" alt="">
                        <div class="info">
                            <p class="disc">` + ele.name + `</p>
                            <p class="price">` + ele.spectList[0].price + `</p>
                        </div>
                    </div>
                </a>`;
    });
    $('.content').html(str);
}