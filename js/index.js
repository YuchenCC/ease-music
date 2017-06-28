/**
 * Created by Administrator on 2017/6/27.
 */
$lastestMusic = $('#lastestMusic')
$.get("JSON1\\song.json",function (response, request) {
    //根据音乐JSON数据生成显示列表
    response.map((object)=>{
        $liHome = $(`<li>
                    <a href="./song.html?id=${object.id}">
                    <div>
                        <h3>${object.name}</h3>
                        <p>${object.singer}</p>
                    </div>
                    <svg class="play">
                        <use xlink:href="#icon-play-circled"></use>
                    </svg>
                    </a>
                </li>`)
        $liHome.appendTo($lastestMusic)
        let idHot
        if(object.id < 10){idHot = `0${object.id }`}
        else {idHot = `${object.id }`}
        $liHot = $(`
            <li>
                <div class="hotOrder">${idHot}</div>
                <div class="hotDetail">
                    <a href="./song.html?id=${object.id}}">
                        <div>
                            <h3>${object.name}</h3>
                            <p>${object.singer}</p>
                        </div>
                        <svg class="play">
                            <use xlink:href="#icon-play-circled"></use>
                         </svg>
                    </a>
                </div>
            </li>`)
        $liHot .appendTo($('#hotMusic'))
        $('#hotMusic').children().eq(0).find('.hotOrder').addClass('hotTop')
        $('#hotMusic').children().eq(1).find('.hotOrder').addClass('hotTop')
        $('#hotMusic').children().eq(2).find('.hotOrder').addClass('hotTop')
        $lastestMusicLoading = $('#lastestMusicLoading')
        $lastestMusicLoading.removeClass('active')  //移除加载GIF
    })
}).fail(function() {alert( "error" );})

let $nav = $('.tabItems')
let $tabContent = $('.tabContent')
$nav.on('click','li',function(e){
    $click = $(e.currentTarget)
    $click.addClass('active').siblings().removeClass('active')
    let index = $click.index()
    $tabContent.children().removeAttr('hidden')
    $tabContent.children().eq(index).show().siblings().hide()

})


