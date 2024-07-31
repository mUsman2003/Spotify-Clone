console.log("Lets bnegoin")

let currentSong = new Audio();

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
    try {
        let a = await fetch("http://127.0.0.1:3000/songs/");
        let response = await a.text();
        let div = document.createElement("div");
        div.innerHTML = response;
        let as = div.getElementsByTagName("a");
        let songs = [];
        for (let index = 0; index < as.length; index++) {
            const element = as[index];
            if (element.href.endsWith(".mp3")) {
                songs.push(element.href.split("/songs/")[1]);
            }
        }
        console.log("Songs fetched:", songs);
        return songs;
    } catch (error) {
        console.error("Error fetching songs:", error);
        return [];
    }
}

const playMusic = (track, songs) => {
    for (const song of songs) {
        let fs = song.replaceAll("%20", " ")
        let sname = fs.split(" - ")[1]
        if (sname == track) {
            currentSong.src = `/songs/${song}`
            console.log(sname + " - " + track)
            currentSong.play()
            playID.src = "img/pause.svg"

            document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
            document.querySelector(".songinfo").innerHTML = decodeURI(song)
        }
    }
}


async function main() {


    try {
        // List of all songs
        let songs = await getSongs();

        let fs = songs[0].replaceAll("%20", " ")
        currentSong.src = `/songs/${songs[0]}`

        document.querySelector(".songinfo").innerHTML = decodeURI(songs[0])
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";

        if (songs.length === 0) {
            console.error("No songs found to play.");
            return;
        }
        let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
        for (const song of songs) {
            let fs = song.replaceAll("%20", " ")
            let author = fs.split(" - ")[0]
            let sname = fs.split(" - ")[1]
            songUL.innerHTML = songUL.innerHTML + `
                        <li>
                            <img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${sname}</div>
                                <div>${author}</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div>
                        </li>`;
        }

        Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
            e.addEventListener("click", element => {
                playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim().replace("%20", " "), songs)
            })
        });

        playID.addEventListener("click", () => {
            if (currentSong.paused) {
                console.log("play now")
                currentSong.play()
                playID.src = "img/pause.svg"
            }
            else {
                console.log("pause now")
                currentSong.pause()
                playID.src = "img/play.svg"
            }
        })


        //timeupdate event

        currentSong.addEventListener("timeupdate", () => {
            document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
            document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";

        })

        document.querySelector(".seekbar").addEventListener("click", e => {
            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
            document.querySelector(".circle").style.left = percent + "%";
            currentSong.currentTime = ((currentSong.duration) * percent) / 100
        })


    } catch (error) {
        console.error("Error playing songs:", error);
    }
}
main()

