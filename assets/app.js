const outcomes = [500, 750, 999, 1000]
const payouts = [0, 1, 3, 100]
const outcome = 500
const resultInd = outcomes.findIndex((value) => { // 0, 1, 2, 3
    return outcome < value
})
let totalPayout = localStorage.getItem("total_payout");
if (totalPayout === null)
    totalPayout = 0;
else
    totalPayout *= 1;

const tanks = []
const result = resultInd - 1
if (resultInd > 0) { // if payout > 0
    for (let i = 0; i < 3; i++) {
        tanks.push(result) // worm miner ind:6, ant builder ind:7, green farmer ind: 8
    }
    for (i = 0; i < 6; i++) {
        const newInd = Math.floor(Math.random() * 8)
        if (newInd === result) { // continue if new ind = result
            i--
            continue
        }
        if (newInd < 3) {
            let counts = 0 // already exist same payout character count
            tanks.forEach((tank) => counts += tank === newInd ? 1 : 0)
            if (counts === 2) {
                i--
                continue
            }
        }
        tanks.push(newInd)
    }
} else {
    for (i = 0; i < 9; i++) {
        const newInd = Math.floor(Math.random() * 8)
        if (newInd < 3) {
            let counts = 0 // already exist same payout character count
            tanks.forEach((tank) => counts += tank === newInd ? 1 : 0)
            if (counts === 2) {
                i--
                continue
            }
        }
        tanks.push(newInd)
    }
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

function scoreChange() {
    $('#outcome').text(`$${totalPayout}`)
    $('#scoreChangeSound')[0].play()
}

shuffle(tanks) // shuffle tanks array

const $tank = $('.tank')
const $cloneAll = $('#cloneAll')
const $claimPrice = $('#claimPrice')
let gameEnded = false


let playAttempt = setInterval(() => {
    $('#bgSound')[0]
        .play()
        .then(() => {
            clearInterval(playAttempt);
        })
        .catch((error) => {
            console.log("Unable to play the audio, User has not interacted yet.");
        });
}, 2000);

$(function () {
    setLayoutMode();
    $tank.each(function (index, tank) {
        setTimeout(function () {
            $(tank).append(`
                <img src="./assets/images/egg.svg" alt="" class="w-100 egg-img egg-drop"/>
                <img src="./assets/images/bubbles/1.svg" alt="" class="bubble-1"/>
                <img src="./assets/images/bubbles/1.svg" alt="" class="bubble-1-1"/>
                <img src="./assets/images/bubbles/2.svg" alt="" class="bubble-2"/>
                <img src="./assets/images/bubbles/2.svg" alt="" class="bubble-2-1"/>
                <img src="./assets/images/bubbles/3.svg" alt="" class="bubble-3"/>
                <img src="./assets/images/bubbles/3.svg" alt="" class="bubble-3-1"/>
                <img src="./assets/images/bubbles/4.svg" alt="" class="bubble-4"/>
                <img src="./assets/images/bubbles/4.svg" alt="" class="bubble-4-1"/>
                <img src="./assets/images/bubbles/5.svg" alt="" class="bubble-5"/>
                <img src="./assets/images/bubbles/5.svg" alt="" class="bubble-5-1"/>
            `)
            setTimeout(function () {
                $(tank).children('.egg-img').removeClass('egg-drop').addClass('img-swing')
            }, 500)
        }, 0.15 * 1000 * index)
    })
    setTimeout(function () {
        // $('#eggAppearSound')[0].play()
    }, 0.5 * 1000)

    tanks.forEach((tank, index) => {
        $(`.tank[data-index=${index}]`).append(`
        <div class="img-appeal">
            <div class="character-${tank}"></div>
        </div>`)
    })
    scoreChange()

    setTimeout(function () {
        $tank.click(function () { // when click each tank
            const $this = $(this)
            if ($(this).children('.egg-img').css('display') !== 'block') { //if already egg broken, then return
                return;
            }
            $(this).children('[class^=egg-]').show()
            const eggClickSound = new Audio("./assets/sounds/Egg_Crack/Egg_Crack_v1.wav")
            eggClickSound.play()
            $this.children('.egg-img').hide()
            const $imgAppeal = $this.children('.img-appeal')
            $imgAppeal.show()
            setTimeout(function () {
                if ($imgAppeal.children(`.character-2`).length) {
                    $('#farmerAppearSound')[0].play()
                }
                $imgAppeal.addClass('img-swing')
            }, 800)
            if (isAllTanksClicked()) {
                showResult()
            }
        })
        $cloneAll.click(function () { // when click clone all button
            $('#tanks .egg-img').hide()
            $('#tanks .img-appeal').show().addClass('img-swing')
            showResult()
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        })
    }, 1.5 * 1000)

    for (let i = 1; i <= 3; i++) {
        $(`#payout${i}`).text(`$${payouts[i]}`)
        $(`#outcome${i}`).text(outcomes[i])
    }
})
window.onresize = setLayoutMode;


function isAllTanksClicked() {
    let clickedAll = true;
    let count = 0;
    $tank.each(function () {
        if ($(this).children('.egg-img').css('display') !== 'block') {
            if ($(this).find(`.character-${result}`).length === 1) { // check if all payout tanks are clicked
                count += 1;
                if (count === 3)
                    return false
            }
        } else {
            clickedAll = false;
        }
    })
    return clickedAll || count === 3
}

function showResult() { // show result in modal
    if (gameEnded) return;
    gameEnded = true;
    if (resultInd > 0) {
        $('#winModalPopupSound')[0].play()
        $('#resultDescription').html(`you won <span class="float-right">$${payouts[resultInd]}!</span>`)
        $('#resultImages > div').append(`<div class="character-${result}"></div>`).addClass();
        setTimeout(function () {
            $('#resultImages > div').addClass('img-swing')
        }, 1800)
    } else {
        $('#resultDescription').text(`you lose!`)
        $('#resultImages, #resultModal video').hide()
        $claimPrice.text('play again')
    }
    setTimeout(function () {
        $('#resultModal').addClass(`result-${resultInd}`).fadeIn()
        $(`#popup${resultInd + 1}Sound`)[0].play()
        $cloneAll.addClass('game-ended').text('play again')
        setTimeout(function () {
            $('#gameEndSound')[0].play()
        }, 1000)
    }, 1000)
}

$claimPrice.click(function () { // when click claim price button
    $('#resultModal').fadeOut()
    if (result >= 0) {
        totalPayout += payouts[resultInd];
        scoreChange()
        localStorage.setItem('total_payout', totalPayout)
    } else {
        location.reload()
    }
    $cloneAll.click(function () {
        $('#gameStartSound')[0].play()
        setTimeout(function () {
            location.reload()
        }, 1000)
    })
})

function setLayoutMode() { // toggle portrait mode based window height and width
    const isPortraitMode = $(window).height() > $(window).width()
    if (isPortraitMode) {
        $('body').addClass('portrait')
    } else {
        $('body').removeClass('portrait')
    }
}

$(document).on('mouseup, mousedown', '.border-block[id]', function (event) {
    const $buttonMouseSound = event.type === 'mouseup' ? '#buttonMouseUpSound' : '#buttonMouseDownSound'
    $($buttonMouseSound)[0].play()
})
