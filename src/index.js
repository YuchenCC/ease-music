/**
 * Created by Administrator on 2017/6/27.
 */
require('./css/index.css');



$.get("JSON1\\song.json",function (response, request) {

    +function () {        //生成最新音乐显示列表，以及热歌榜
            let $lastestMusic = $('#lastestMusic')
            response.map((object) => {
                let $liHome = $(`<li>
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
                //动态生成热歌榜
                let idHot
                if (object.id < 10) {
                    idHot = `0${object.id }`
                }
                else {
                    idHot = `${object.id }`
                }
                let $liHot = $(`
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
                $liHot.appendTo($('#hotMusic'))
                $('#hotMusic').children().eq(0).find('.hotOrder').addClass('hotTop')
                $('#hotMusic').children().eq(1).find('.hotOrder').addClass('hotTop')
                $('#hotMusic').children().eq(2).find('.hotOrder').addClass('hotTop')
                let $lastestMusicLoading = $('#lastestMusicLoading')
                $lastestMusicLoading.removeClass('active')  //移除加载GIF
            })
        }();

        +function () {    //监听nav点击变化
            let $nav = $('.tabItems')
            let $tabContent = $('.tabContent')
            $nav.on('click', 'li', function (e) {
                let $click = $(e.currentTarget)
                $click.addClass('active').siblings().removeClass('active')
                let index = $click.index()
                $tabContent.children().removeAttr('hidden')
                $tabContent.children().eq(index).show().siblings().hide()
            })
        }();

//动态获取热门搜索
        +function () {
            function getRandomKeys(response, maxNumber) {   //根据需求关键字匹配ajax返回的response，并写入数组。多关键字则随机写入
                let array = []
                for (let i = 0; i < maxNumber; i++) {
                    let list = response.filter(object =>
                    object.hot === i)[0]
                    if (list) {
                        if (Math.random() < 0.5) {
                            array.push($(`<li>${list.name}</li>`))
                        }
                        else {
                            array.push($(`<li>${list.singer}</li>`))
                        }
                    }
                }
                return array
                //将生成的热门音乐数组随机顺序展示
            }

            function popOneOfArray(array, selected) {   //删除数组中的选定元素
                let temp = array[0]
                let result = array[selected]
                array[selected] = temp
                array[0] = array[selected]
                array.shift()
                return result
            }

            function randomGetArray(array, fn) {   //获得数组中随机元素并执行fn
                while (1) {
                    if (array[0]) {
                        let count = Math.floor(Math.random() * (array.length))
                        fn(array, count)
                    }
                    else {
                        break
                    }
                }
            }

            +function () {  //热门搜索排序
                let array = getRandomKeys(response, 10)  //根据hot关键字选取对应name和singer写入数组，最大10个
                randomGetArray(array, function (array, selected) {    //随机获得数组某一参数值
                    let $li = popOneOfArray(array, selected)  //生成$li并删除取出的数组
                    $li.appendTo($('.hotSearch>ul'))
                })
            }()
        }();

        +function () {
            let keys = []
            $('.cancelIcon').hide()
            loadSearchKeys(response, keys)  //获取搜索关键字
            let timer = undefined
            $('#searchForm').on('input', 'input', function(e){
                $('.cancelIcon').show()
                searchKeys(e, timer, keys)
            })  //根据搜索关键字匹配并生成li
            $('.recomSearch>ol').on('click', 'li', function(e){
                addHistory(e)
            })
            $('.cancelIcon').on('click',function(){
                $('.inputCover').children('input').val('')
                searchKeys(null)
            })
        }()

        function loadSearchKeys(response, array) {
            response.map((object) => {
                array.push({name: object.name, id: object.id})
                array.push({name: object.singer, id: object.id})
            })
            return array
        }

        function searchKeys(event, timer, keys) {
            let value
            if(arguments[0] === null){
                value = ''
                console.log('null')
            }
            else{
                value = event.currentTarget.value.trim()
                console.log('have')
            }
            if (value.length === 0) {
                return initSearch()
            }
            searchStart()
            if (timer) {
                clearTimeout(timer)
            }
            doSearch(value, timer, keys)
            return timer
        }

        function doSearch(value, timer, keys) {
            $('.recomSearch>h3>span').text(value)
            let regex = new RegExp(`^(${value}).*`);
            timer = setTimeout(function () {
                $('.recomSearch>ol').children().remove()
                keys.map(function (object) {
                    if (object.name.match(regex)) {
                        //console.log(object)
                        let $li = $(`<li data-name="${object.name}">
                                <svg class="recomIcon icon" aria-hidden="true">
                                    <use xlink:href="#icon-sousuo"></use>
                                </svg>
                                <a href="./song.html?id=${object.id}">
                                    <p>${object.name}</p>
                                </a>
                            </li>`)
                        $li.appendTo($('.recomSearch>ol'))
                    }
                })
                timer = undefined
            }, 300)
        }

        function addHistory(event) {
            let searchRecord = $(event.currentTarget).attr('data-name')
            let searchRecordAll = getlocalStorage('searchRecordAll')
            let n = 0
            searchRecordAll.forEach(string => {
                if (string === searchRecord) {
                    return n = 1
                }
            })
            if (n !== 1) {
                searchRecordAll.push(searchRecord)
                console.log('push'+ searchRecordAll)
                localStorage.setItem('searchRecordAll', JSON.stringify(searchRecordAll));
            }
        }
    });
function getlocalStorage(name){
    let temp = localStorage.getItem(name)
    if (temp === 'undefined'){
        temp = '[]'
        console.log('none')
    }
    return JSON.parse(temp)
}
+function(){   //动态获取搜索历史
    initSearch()
    let historySearch = getlocalStorage('searchRecordAll')
    console.log(historySearch)
    if (historySearch) {
        historySearch.forEach(string => {  //未做数组去重
            loadHistoryList(string)
            return string
        })
    }
    $('.close').on('click',function(e){
        let key = $(e.currentTarget).siblings('a').children().children().text()
        console.log(key)
        $(e.currentTarget).parent('li').remove()
        let historyDel = getlocalStorage('searchRecordAll')
        let afterDelKey = popKeyOfArray(historyDel,key)
        localStorage.setItem('searchRecordAll', JSON.stringify(afterDelKey));

    })
}()

function popKeyOfArray(array, key) {   //删除数组中指定的关键字
        for(let i=0;i<array.length;i++) {
            if (array[i] === key) {
                let temp = array[0]
                array[0] = array[i]
                array[i] = temp
                array.shift()
                return array
            }
        }


}


function loadHistoryList(string) {
    let $li = $(`<li>
                    <svg class="timer icon" aria-hidden="true">
                        <use xlink:href="#icon-lishi1"></use>
                    </svg>
                    <a href="">
                        <div class="history">
                          <p>${string}</p>
                        </div>
                    </a>
                    <svg class="close icon" aria-hidden="true">
                        <use xlink:href="#icon-close"></use>
                    </svg>
                 </li>
            `)
    $li.appendTo($('.historySearch>ol'))
}
function initSearch() {
    $('.hotSearch').show()
    $('.historySearch').show()
    $('.recomSearch').hide()
    $('.bestMatch').hide()
}
function searchStart(){
    $('.hotSearch').hide()
    $('.historySearch').hide()
    $('.recomSearch').show()
    $('.bestMatch').hide()
}