/**
 * Created by Administrator on 2017/6/27.
 */
$lastestMusic = $('#lastestMusic')
$.get("JSON1\\song.json",function (response, request) {
    //console.log(response)
    response.map((object)=>{
        $li = $(`<li>
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
        $li.appendTo($lastestMusic)
        //console.log($li)
        $lastestMusicLoading = $('#lastestMusicLoading')
        $lastestMusicLoading.removeClass('active')
    })

}).fail(function() {alert( "error" );})
