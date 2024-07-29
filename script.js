console.log("Lets bnegoin")

async function getSongs(){
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

async function main(){
    try {
        // List of all songs
        let songs = await getSongs();

        if (songs.length === 0) {
            console.error("No songs found to play.");
            return;
        }
        let songUL=document.querySelector(".songList").getElementsByTagName("ul")[0]
        for (const song of songs) {
            let fs=song.replaceAll("%20"," ")
            let author=fs.split(" - ")[0]
            let sname=fs.split(" - ")[1]
            songUL.innerHTML=songUL.innerHTML+ `
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

        let currentIndex = 0;
        let audio = new Audio(songs[currentIndex]);
        console.log("Playing song:", songs[currentIndex]);
        audio.play();

        audio.addEventListener("loadeddata",()=>{
            let duration=audio.duration;
            console.log(duration)
        })

    } catch (error) {
        console.error("Error playing songs:", error);
    }
}
main()

