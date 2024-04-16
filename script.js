console.log('Lets write Javascript');
let currentsong = new Audio();

function formatTime(seconds) {
    // Round off the seconds to the nearest whole number
    seconds = Math.round(seconds);

    // Calculate minutes and seconds
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;

    // Add leading zeros if necessary
    var formattedMinutes = (minutes < 10 ? '0' : '') + minutes;
    var formattedSeconds = (remainingSeconds < 10 ? '0' : '') + remainingSeconds;

    // Return the formatted time as a string
    return formattedMinutes + ':' + formattedSeconds;
}


//get all the songs
async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/Sigma%20Web%20Dev%20course/Clones/Spotify%20Clone/Songs");
    let response = await a.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href)

            // songs.push(element.href.split("/Songs/")[1])
        }
    }
    return songs;
}
const playMusic = (track, pause = false) => {
    // let audio = new Audio("Songs/" + track)
    currentsong.src = "Songs/" + track
    if (!pause) {
        currentsong.play()
        play.src = "Assets/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track).split(".mp3")[0]
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}
async function main() {
    //Get the list of all songs
    let songs = await getSongs();
    console.log(songs);
    let defaultsong = songs[0].split("/Songs/")[1].replaceAll("%20", " ")
    console.log(defaultsong);

    playMusic(defaultsong, true)

    //Show all the songs in library playlist
    let songUL = document.querySelector(".songlist").getElementsByTagName('ul')[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
        <img class="logosetter" src="Assets/music.svg">
        <div class="leftsonginfo">
            <div>${song.split("/Songs/")[1].replaceAll("%20", " ")}</div>
            <div>${song.split("/Songs/")[1].replaceAll("%20", " ").split("-")[0]}</div>
            <div>${song.split("/Songs/")[1].replaceAll("%20", " ").split("-")[1].split(".mp3")[0]}</div>

        </div>
        <div class="playnow flex align-center">
            <span>Play Now</span>
            <img class="logosetter" src="Assets/playbutton.svg" alt="">
        </div></li>`;
    }

    //Attach eventlistener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".leftsonginfo").firstElementChild.innerHTML)
            playMusic(e.querySelector(".leftsonginfo").firstElementChild.innerHTML)

        })
    })

    //Attach enetlister to previous, play and next 
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "Assets/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "Assets/playbutton.svg"

        }
    })

    // Listen for timeUpdate Event
    currentsong.addEventListener("timeupdate", () => {
        // console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)}/${formatTime(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })
    // Add an eventlistener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100 
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ( currentsong.duration * percent ) / 100
    })
}
main();

//Canceled code

// Play the first song
// var audio = new Audio(songs[0]);
// audio.play();
// audio.addEventListener("loadeddata", () => {
// console.log(audio.duration, audio.currentSrc, audio.currentTime);
// });