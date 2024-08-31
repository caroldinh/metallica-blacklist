import React, { useState, useEffect } from "react";
import AnyChart from "anychart-react";
import anychart from 'anychart';
import { SONG_FEATURES } from "./data/Features";
import { useThemeColors } from "./colors";

export const RadarCompare = () => {

    const [data, setData] = useState([]);
    const [chart, setChart] = useState(undefined);
    const [songName, setSongName] = useState("");

    const FEATURE_KEYS = ["Danceability", "Energy", "Speechiness", "Acousticness", "Instrumentalness", "Liveness", "Valence"];
    const SONGS = new Set(
      SONG_FEATURES.map((song) => song.Original_Title)
    );

    const colors = useThemeColors();

    useEffect(() => {

      if (songName === "") {

        SONGS.forEach((currSong) => {

          let radarChart = anychart.radar();
          let newData = SONG_FEATURES.filter((song) => song.Original_Title === currSong);
          setData(newData);

          let dataSet = anychart.data.set(
            FEATURE_KEYS.map((key) => 
              [key].concat(newData.map((song) => song[key])))
          );

          console.log(dataSet)

          let chart = anychart.radar();
          chart.title(
            currSong
          );

          chart.title().fontColor(colors.FOREGROUND).fontFamily("Rock Salt")
          
          // set chart yScale settings
          chart.yScale().minimum(0).maximumGap(0).ticks().interval(0.2);
          chart.yGrid().stroke({
            color: colors.FOREGROUND,
            thickness: 1,
            opacity: 0.3,
            dash: '5 5'
          });

          // set xAxis labels settings
          chart.xAxis().labels().enabled(songName !== "");
          chart.xGrid().stroke({
            color: colors.FOREGROUND,
            thickness: 1,
            opacity: 0.3
          });

          // set chart legend settings
          chart.legend().enabled(false);

          chart.background().fill(colors.BACKGROUND);

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
          setChart(chart);


        })

      }


    }, [songName])

    return(
      <>
        {songName === "" ? 
          <div id="radar-grid">

            {[...SONGS].map((song) => <div id={`${song}-chart`} class="radar-chart-grid-item"></div>)}

          </div>
          :
          <div></div>
        }
      </>
    )
};