
let id = parseInt(location.search.match(/\bid=([^&]*)/)[1],10)
$next = $(`<a hidden href="./song.html?id=${id+1}">`)
$next.appendTo($('.links'))
$.get("JSON1\\song.json").then(function(response){
    let song = response.filter(object=>object.id === id)[0]
    //console.log(song)
    let {url, name, lyric,albumImg,background} = song
    $albumImg = $('.disc-container>.disc>.cover').attr('src',song.albumImg)
    $backgroundImg = $('.bgCover').css('background','transparent url(' + song.background + ') no-repeat center')
                                .css('background-size','cover')
    initplay(song.url)
    $songName = $('.song-description>h1').text(song.name)

    //console.log(song.lyric)
    handleLyric(song.lyric)

})
function handleLyric(lyric){
    let lyrics = lyric.split('↵')
    let lyricTimes = []
    let lyricTexts = []
    //console.log(lyrics)
    lyrics.map((string)=>{
        let lyricTime = string.slice(1,10)
        let lyricText = string.slice(11)
        lyricTimes.push(lyricTime)
        lyricTexts.push(lyricText)
    })
    //console.log(lyricTimes)
    //console.log(lyricTexts)
    insertLyric(lyricTimes,lyricTexts)
}
function insertLyric(lyricTimes,lyricTexts){
    $songLyric = $('.song-description>.lyric>.lines')
    for(let i = 0;i<lyricTimes.length;i++) {
        if(lyricTimes[i]){
            if (lyricTexts[i]=== ''){
                lyricTexts[i]= '...'
            }
            $span = $(`<span data-time = ${lyricTimes[i]}>${lyricTexts[i]}</span>`)
            $span.appendTo($songLyric)
        }
    }
}




function initplay(url){
    let audio = document.createElement('audio')
    audio.src = url
    audio.loop = false
    audio.preload = 'auto'
    $iconPlay = $(".icon-play")
    $iconPause = $(".icon-pause")
    $iconCover = $(".cover")
    $iconLight = $(".light")
    $iconPlay.on('click',function(){
        audio.play()
        $iconPlay.attr('class','icon icon-play ')
        $iconPause.attr('class','icon icon-pause svgActive')
        $iconCover.addClass('animationActive')
        $iconLight.addClass('animationActive')
    })
    $iconPause.on('click',function(){
        audio.pause()
        $iconPlay.attr('class','icon icon-play svgActive')
        $iconPause.attr('class','icon icon-pause')
        $iconCover.removeClass('animationActive')
        $iconLight.removeClass('animationActive')
    })
    audio.addEventListener("canplaythrough",function () {
        console.log(audio.readyState)
        $iconPlay.click()
    })
    audio.addEventListener("ended",function () {
        console.log('ended,next')
        window.location.href = $next.attr('href')
    })

    setInterval(function () {
        //console.log('currentTime is' +  )
        $songLyricSpan = $('.song-description>.lyric>.lines>span')
        let musicTime = parseInt(audio.currentTime,10)
        //console.log('musicTime = ' + musicTime)
        //console.log($songLyric.children())
        $.map($songLyricSpan,function(span){
            //console.log('musicTime = ' + musicTime)
            let spanTime = span.getAttribute('data-time')
            if (!spanTime) {return}
            let minites = parseInt(spanTime.match(/(\d*):(.*)/)[1],10)
            let seconds = parseInt(spanTime.match(/(\d*):(.*)/)[2],10)
            let time = minites * 60 + seconds
            //console.log('time = ' + time)
            //console.log('musicTime = ' + musicTime)
            if ( time === musicTime){
                //console.log(spanTime)
                //console.log('time = ' + time)
                //console.log('musicTime = ' + musicTime)
                return changeLyric(spanTime)
                }

        })
        function changeLyric(spanTime){
            for(i=0 ;i<$songLyricSpan.length;i++){
                if($songLyricSpan.eq(i).attr('data-time') == spanTime) {
                    //console.log(changeHeight)
                    let changeHeight = Math.ceil($songLyricSpan.eq(i-1).outerHeight())
                    if( i === 0){
                        $songLyric.css('transform', `translateY(0)`)
                    }else{
                        let lasttrans = $songLyric.css('transform').match(/(.*,){5}\s*(.*)\)/)[2]
                        console.log(lasttrans)
                        console.log(changeHeight)
                        $songLyric.css('transform', `translateY(${lasttrans-changeHeight}px)`)

                        console.log($songLyric.css('transform'))
                    }


                    //console.log(changeHeight)
                    $songLyricSpan.eq(i).addClass('lyricActive').siblings().removeClass('lyricActive')
                    $songLyric = $('.song-description>.lyric>.lines')
                   // console.log($songLyric.css('transform'))


                    //console.log(lasttrans)

                }
            }


        }
        //console.log(spanTime)
        //let song = $songLyricSpan.filter(object=>{
        //    console.log(object)

            //console.log(object.attr)

        //$.get("JSON1\\song.json").then(function(response){
         //   let song = response.filter(object=>object.id === id)[0]
            //console.log(song)
        //console.log('duration is' + audio.duration )
    },1000)
}
