/**
 * Created by Administrator on 2017/6/27.
 */


$lastestMusic = $('#lastestMusic')

$.get("JSON1\\song.json",function (response, request) {

    +function () {        //生成最新音乐显示列表，以及热歌榜
            response.map((object) => {
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
                //动态生成热歌榜
                let idHot
                if (object.id < 10) {
                    idHot = `0${object.id }`
                }
                else {
                    idHot = `${object.id }`
                }
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
                $liHot.appendTo($('#hotMusic'))
                $('#hotMusic').children().eq(0).find('.hotOrder').addClass('hotTop')
                $('#hotMusic').children().eq(1).find('.hotOrder').addClass('hotTop')
                $('#hotMusic').children().eq(2).find('.hotOrder').addClass('hotTop')
                $lastestMusicLoading = $('#lastestMusicLoading')
                $lastestMusicLoading.removeClass('active')  //移除加载GIF
            })
        }();

        +function () {    //监听nav点击变化
            let $nav = $('.tabItems')
            let $tabContent = $('.tabContent')
            $nav.on('click', 'li', function (e) {
                $click = $(e.currentTarget)
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

            loadSearchKeys(response, keys)  //获取搜索关键字
            let timer = undefined
            $('#searchForm').on('input', 'input', function(e){
                searchKeys(e, timer, keys)
            })  //根据搜索关键字匹配并生成li
            $('.recomSearch>ol').on('click', 'li', function(e){
                addHistory(e)
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
            let value = event.currentTarget.value.trim()
            //console.log(value)
            //console.log(keys)
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
                        $li = $(`<li data-name="${object.name}">
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
            let searchRecordAll = (JSON.parse(localStorage.getItem("searchRecordAll"))) || []
            if (!(searchRecordAll instanceof Array)) {
                searchRecordAll = []
            }
            let n = 0
            searchRecordAll.forEach(string => {
                if (string === searchRecord) {
                    return n = 1
                }
            })
            if (n !== 1) {
                searchRecordAll.push(searchRecord)
                localStorage.setItem('searchRecordAll', JSON.stringify(searchRecordAll));
            }
        }
    });

+function(){   //动态获取搜索历史
    initSearch()
    let historySearch = (JSON.parse(localStorage.getItem("searchRecordAll"))) || []
    historySearch.forEach(string=>{  //未做数组去重
        loadHistoryList(string)
        return string
    })
}()

function loadHistoryList(string) {
    $li = $(`<li>
                    <svg class="timer icon" aria-hidden="true">
                      <use xlink:href="#icon-lishi1"></use>
                    </svg>
                    <a href="">
                        <div class="history">
                          <p>${string}</p>
                          <svg class="close icon" aria-hidden="true">
                            <use xlink:href="#icon-close"></use>
                          </svg>
                        </div>
                    </a>
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