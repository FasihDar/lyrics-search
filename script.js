let songsData = [];

function searchLyrics() {
    var searchInput = document.getElementById("searchInput").value.trim();
    var resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    fetch(`https://api.lyrics.ovh/suggest/${encodeURIComponent(searchInput)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch songs');
            }
            return response.json();
        })
        .then(data => {
            songsData = data.data;
            displayAllLyrics();
        })
        .catch(error => {
            console.error("Error fetching song suggestions:", error);
        });
}

function displayAllLyrics() {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    songsData.forEach(song => {
        var artist = song.artist.name;
        var title = song.title;

        var resultDiv = document.createElement("div");
        resultDiv.classList.add("result");
        
        var songInfo = document.createElement("h4");
        songInfo.textContent = `${artist} - ${title}`;
        
        var getLyricsButton = document.createElement("button");
        getLyricsButton.textContent = "Get Lyrics";
        getLyricsButton.classList.add("get-lyrics-btn");
        getLyricsButton.addEventListener("click", function() {
            getLyrics(artist, title, resultDiv);
        });

        resultDiv.appendChild(songInfo);
        resultDiv.appendChild(getLyricsButton);

        resultsDiv.appendChild(resultDiv);
    });
}

function getLyrics(artist, title, resultDiv) {
    var lyricsUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`;
    fetch(lyricsUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch lyrics');
            }
            return response.json();
        })
        .then(lyricsData => {
            var lyrics = lyricsData.lyrics;
            
            resultDiv.innerHTML = "";

            var lyricsContainer = document.createElement("div");
            lyricsContainer.classList.add("lyrics-container");

            var lyricsParagraphs = lyrics.split('\n').map(line => {
                return `<p>${line}</p>`;
            }).join('');

            lyricsContainer.innerHTML = lyricsParagraphs;

            resultDiv.appendChild(lyricsContainer);

            const resultsDiv = document.getElementById("results");
            Array.from(resultsDiv.children).forEach(child => {
                if (child !== resultDiv) {
                    child.style.display = "none";
                }
            });
        })
        .catch(error => {
            console.error("Error fetching lyrics:", error);
        });
}


