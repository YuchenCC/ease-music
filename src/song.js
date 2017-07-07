require('./css/song.scss');


//  获取查询参数，识别播放音乐ID
let id = parseInt(location.search.match(/\bid=([^&]*)/)[1],10)

//  设置下一个歌曲链接，成型曲库id参数可设置随机数
let $next = $(`<a hidden href="./song.html?id=${id+1}">`)
$next.appendTo($('.links'))

//ajax请求音乐ID对应相关JSON数据
$.get("JSON1\\song.json").then(function(response){
    let song = response.filter(object=>object.id === id)[0]
    let {url, name, lyric,albumImg,background} = song
    let $albumImg = $('.disc-container>.disc>p>.cover').attr('src',song.albumImg)
    let $backgroundImg = $('.bgCover').css('background','transparent url(' + song.background + ') no-repeat center')
                                .css('background-size','cover')
    initplay(song.url)
    let $songName = $('.song-description>h1').text(song.name)
    handleLyric(song.lyric)
})
//解析JSON中的歌词数据
function handleLyric(lyric){
    let lyrics = lyric.split('↵')
    let lyricTimes = []
    let lyricTexts = []
    lyrics.map((string)=>{
        let lyricTime = string.slice(1,10)
        let lyricText = string.slice(11)
        lyricTimes.push(lyricTime)
        lyricTexts.push(lyricText)
    })
    insertLyric(lyricTimes,lyricTexts)
}
//插入解析的歌词数据
function insertLyric(lyricTimes,lyricTexts){
    let $songLyric = $('.song-description>.lyric>.lines')
    for(let i = 0;i<lyricTimes.length;i++) {
        if(lyricTimes[i]){
            if (lyricTexts[i]=== ''){
                lyricTexts[i]= '...'
            }
            let $span = $(`<span data-time = ${lyricTimes[i]}>${lyricTexts[i]}</span>`)
            $span.appendTo($songLyric)
        }
    }
}
//初始化播放
function initplay(url){
    let audio = document.createElement('audio')
    audio.src = url
    audio.loop = false
    let timer = null
    let $iconPlay = $(".icon-play")
    let $iconPause = $(".icon-pause")
    let $iconCover = $(".cover")
    let $iconLight = $(".light")
    let $imitatePlay = $('#imitatePlay')
    $imitatePlay.on('click',function () {
        audio.preload = 'auto'
        //console.log('$imitatePlay')
    })
    $iconPlay.on('click',function(){
        audio.play()
        console.log('play')

    })
    $iconPause.on('click',function(){
        audio.pause()
        console.log('pause')
    })
    audio.addEventListener("canplay",function () {
        //console.log(audio.readyState)
        $iconPlay.click()
        console.log('canplay')
    })
    audio.addEventListener("playing",function () {
        timer = setInterval(lyricScroll,500)
        $iconPlay.attr('class','icon icon-play ')
        $iconPause.attr('class','icon icon-pause svgActive')
        $iconCover.addClass('animationActive')
        $iconLight.addClass('animationActive')

    })
    audio.addEventListener("pause",function () {
        $iconPlay.attr('class','icon icon-play svgActive')
        $iconPause.attr('class','icon icon-pause')
        $iconCover.removeClass('animationActive')
        $iconLight.removeClass('animationActive')
        clearInterval(timer)
    })

    audio.addEventListener("ended",function () {
        console.log('ended,next')
        window.location.href = $next.attr('href')
    })
    function lyricScroll() {
        let $songLyricSpan = $('.song-description>.lyric>.lines>span')
        let musicTime = parseInt(audio.currentTime, 10)
        $.map($songLyricSpan, function (span) {
            let spanTime = span.getAttribute('data-time')
            if (!spanTime) {
                return
            }
            let minites = parseInt(spanTime.match(/(\d*):(.*)/)[1], 10)
            let seconds = parseInt(spanTime.match(/(\d*):(.*)/)[2], 10)
            let time = minites * 60 + seconds
            if (time === musicTime) {
                return changeLyric(spanTime)
            }

        })
        function changeLyric(spanTime) {
            let $songLyric = $('.song-description>.lyric>.lines')
            for (let i = 0; i < $songLyricSpan.length; i++) {
                if ($songLyricSpan.eq(i).attr('data-time') == spanTime) {
                    //console.log(changeHeight)
                    $songLyricSpan.eq(i).addClass('lyricActive').siblings().removeClass('lyricActive')
                    let changeHeight = - $songLyricSpan.eq(i).position().top
                    $songLyric.css('transform', `translateY(${changeHeight}px)`)
                }
            }
        }

        $imitatePlay.click()
        //播放时间对应歌词滚动高亮
    }
}
