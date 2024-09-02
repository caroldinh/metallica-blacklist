import React, { useState, useEffect } from "react";
import AnyChart from "anychart-react";
import anychart from 'anychart';
import { SONG_FEATURES } from "./data/Features";
import { useThemeColors } from "./colors";

export const RadarCompare = () => {

    const [charts, setCharts] = useState([]);
    const [songData, setSongData] = useState([])
    const [songName, setSongName] = useState("");
    const [artist, setArtist] = useState("");
    const [artistIndex, setArtistIndex] = useState(0);
    const [original, setOriginal] = useState({});

    const FEATURE_KEYS = ["Danceability", "Energy", "Speechiness", "Acousticness", "Instrumentalness", "Liveness", "Valence"];
    const SONGS = new Set(
      SONG_FEATURES.map((song) => song.Original_Title)
    );

    const colors = useThemeColors();

    const plotSong = (currSong) => {

      let newData = SONG_FEATURES.filter((song) => song.Original_Title === currSong);
      setSongData(newData);

      if (songName !== "" && artist !== "")
        newData = newData.filter((song) => song.Artists === artist);

      let dataSet = anychart.data.set(
        FEATURE_KEYS.map((key) => 
          [key].concat(newData.map((song) => song[key])))
      );

      let chart = anychart.radar();
      chart.title(
        currSong
      );

      chart.title().fontColor(colors.FOREGROUND).fontFamily("Rock Salt")
        .fontSize(songName === "" ? 16 : 36)
        .enabled(songName === "")
        .listen("click", (e) => {
          setSongName(songName === "" ? e.domTarget.kc : "");
        })
      
      // set chart yScale settings
      chart.yScale().minimum(0).maximumGap(0).maximum(1).ticks().interval(0.2);
      chart.yAxis().labels()
        .fontFamily("Expletus Sans")
        .fontColor(colors.FOREGROUND)
        .fontSize(16)
        .enabled(songName !== "");
      chart.yGrid().stroke({
        color: colors.FOREGROUND,
        thickness: 1,
        opacity: 0.3,
        dash: '5 5'
      });

      // set xAxis labels settings
      chart.xAxis().labels()
        .fontFamily("Expletus Sans")
        .fontColor(colors.FOREGROUND)
        .background(colors.BACKGROUND)
        .fontSize(16)
        .enabled(songName !== "");

      chart.xGrid().stroke({
        color: colors.FOREGROUND,
        thickness: 1,
        opacity: 0.3
      });

      // set chart legend settings
      chart.legend().enabled(false);

      chart.background().fill(
        //colors.BACKGROUND
        {
          src: songName === "" ? "images/blacklist_cd_withspace.png" : "images/blacklist_cd.png",
          mode: "fit"
        }
      )

      // Draw a lien for each metric
      newData.forEach((data, index) => {
        let songData = dataSet.mapAs({x: 0, value: index + 1 });
        let series = chart.area(songData)
          .name(`${data.Artists}`)
          .stroke({
            color: data.Is_Original ? colors.FOREGROUND : colors.ACCENT,
            thickness: data.Is_Original ? 3 : 2,
          })
          .fill({
            color: data.Is_Original ? colors.FOREGROUND : colors.ACCENT,
            opacity: 0.15,
          })
          series.tooltip().format(`${data.Title} by ${data.Artists}: {%Value}`);
          //series.markers().enabled(true).type('circle').size(3);
      })

      chart.container(`${currSong}-chart`);
      chart.draw();

      charts.push(chart);

    }

    useEffect(() => {

      if (songName === "") {

        setArtist("");
        setArtistIndex(0);
        SONGS.forEach((currSong) => {
          plotSong(currSong);
        })

      } else {
        plotSong(songName);
        songData.forEach((artist, index) => {
          if (artist.Artists === "Metallica") {
            setOriginal(songData[index]);
          }
        })
      }

      return () => {
        charts.forEach((chart) => {
          chart.dispose()
        });
        setCharts([]);
      }

    }, [songName, artist]);

    useEffect(() => {
      console.log(artist);
      songData.forEach((song, index) => {
        if (song.Artists === artist) {
          setArtistIndex(index);
        }
      })
    }, [artist])

    return(
      <>
      <div className="chart-header">
                {/*
        <select value={songName} onChange={(e) => setSongName(e.target.value)}>
          {[...SONGS].concat(["(All songs)"]).map((song) => 
            <option value={song === "(All songs)" ? "" : song}>{song}</option>)
          }
        </select>
                */}
        <div className="chart-key">
          <span className="key-item">
            <span className="key-color accent"></span>
            <span className="key-label">Cover</span>
          </span>
          <span className="key-item">
            <span className="key-color foreground"></span>
            <span className="key-label">Original</span>
          </span>
        </div>
      </div>
        {songName === "" ? 
        <>
          <div className="full-radar-chart" style={{ display: "none" }}></div>
          <div id="radar-grid">

            {[...SONGS].map((song) => <div id={`${song}-chart`} class="radar-chart-grid-item" onClick={() => setSongName(song)}></div>)}

          </div>
          </>
          :
          <>
            <div class="chart-header">
              <h3>{songName}</h3>
              <a id="back-to-all" onClick={() => setSongName("")}>Back to all songs</a>
            </div>
            <div id="radar-container">
              <div id={`${songName}-chart`} className="full-radar-chart" style={{
                display: songName === ""
              }}></div>
              <div id="song-info">
                <select value={artist} defaultValue="" onChange={(e) => setArtist(e.target.value)}>
                    <option value={""}>Select an artist</option>
                  {songData.map((song) => 
                    <option value={song.Artists}>{song.Artists}</option>)
                  }
                </select>
                {artist === "" ? 
                <>
                  <p>Select an artist to view individual stats.</p>
                </>
                :
                FEATURE_KEYS.map((feature) => 
                  <>
                    <p>{feature}: {songData[artistIndex][feature]}</p>
                    <p>{original[feature]-songData[artistIndex][feature]} from original</p>
                  </>
                )
              }
              </div>
            </div>
          </>
        }
      </>
    )
};