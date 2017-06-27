
let id = parseInt(location.search.match(/\bid=([^&]*)/)[1],10)
$.get("JSON1\\song.json").then(function(response){
    let song = response.filter(object=>object.id === id)[0]
    //console.log(song)
    let {url, name, lyric,albumImg,background} = song
    $albumImg = $('.disc-container>.disc>.cover').attr('src',song.albumImg)
    $backgroundImg = $('.bgCover').css('background','transparent url(' + song.background + ') no-repeat center')
                                .css('background-size','cover')
    initplay(song.url)
    $songName = $('.song-description>h1').text(song.name)

    console.log(song.lyric)

    //$songLyric = $('.song-description>.lyric>.line').text()
})
function initplay(url){
    let audio = document.createElement('audio')
    audio.src = url
    $iconPlay = $(".icon-play")
    $iconPause = $(".icon-pause")
    audio.oncanplay = function(){
        $iconPlay.on('click',function(){
            audio.play()
            $iconPlay.attr('class','icon icon-play ')
            $iconPause.attr('class','icon icon-pause active')
        })
        $iconPause.on('click',function(){
            audio.pause()
            $iconPlay.attr('class','icon icon-play active')
            $iconPause.attr('class','icon icon-pause')

        })

    }



}