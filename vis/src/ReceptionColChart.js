import React, { useState, useEffect } from "react";
import anychart from 'anychart';
import { ALL_SONGS } from "./data/AllSongs";
import { SONG_RECEPTION } from "./data/Reception";
import { SONG_FEATURES } from "./data/Features";
import { ARTISTS_DICT } from "./data/ArtistsDict";
import { useThemeColors } from "./colors";

export const ReceptionColChart = () => {

    const [currChart, setCurrChart] = useState(null);
    const [sortBy, setSortBy] = useState("")
    const [mentions, setMentions] = useState(undefined);
    const [songScores, setSongScores] = useState(undefined);
    const [songsSorted, setSongsSorted] = useState([...SONG_FEATURES.slice(0, 53)]);

    const REVIEW_CATEGORY_BASE = {
      proficiency: {
        pos: 0,
        neg: 0,
      },
      composition: {
        pos: 0,
        neg: 0,
      },
      interpretation: {
        pos: 0,
        neg: 0,
      },
      instrumentation: {
        pos: 0,
        neg: 0,
      },
      reputation: {
        pos: 0,
        neg: 0,
      },
      genre: {
        pos: 0,
        neg: 0,
      },
      loyalty: {
        pos: 0,
        neg: 0,
      },
      memorability: {
        pos: 0,
        neg: 0,
      },
    }

    const colors = useThemeColors();

    useEffect(() => {

      let song_scores = ALL_SONGS
      .map((song) => {
        return structuredClone(REVIEW_CATEGORY_BASE)
      });

      let mentionsList = new Array(53).fill(0)

      SONG_RECEPTION.forEach((review) => {
        let trackNum = parseInt(review.Track) - 1;
        let mentions = 0;
        Object.keys(song_scores[trackNum]).forEach(category => {
          if (review.Quote.indexOf(`<${category}>`) >= 0) {
            mentionsList[trackNum] += 1;
            if (parseInt(review.Sentiment) == -1) {
              song_scores[trackNum][category]["neg"] -= 1;
            } else {
              song_scores[trackNum][category]["pos"] += 1;
            }
          }
        })
      })

      setMentions(mentionsList);
      setSongScores(song_scores);

    }, [])

    useEffect(() => {

      if (currChart)
        currChart.dispose();

      if (songScores) {
        const formatted_data = songsSorted.slice(0, 53).map(song => {
          const index = SONG_FEATURES.indexOf(song);
          const values_pos = Object.values(songScores[index]).map(value => value.pos);
          const values_neg = Object.values(songScores[index]).map(value => value.neg);
          return [song.Artists, ...values_pos, ...values_neg]
        })

        let chart_data = anychart.data.set(formatted_data);

        let chart = anychart.column();
        chart.animation(true);
        chart.yScale().stackMode('value');

        Object.keys(REVIEW_CATEGORY_BASE).forEach(category => {

          let series_pos = chart_data.mapAs({x: 0, value: 
            Object.keys(REVIEW_CATEGORY_BASE).indexOf(category) + 1
          })

          let series_neg = chart_data.mapAs({x: 0, value: 
            Object.keys(REVIEW_CATEGORY_BASE).indexOf(category) +
            Object.keys(REVIEW_CATEGORY_BASE).length
            + 1
          })

          let series_pos_column = chart.column(series_pos)
          series_pos_column.name(category + " (+)")

          let series_neg_column = chart.column(series_neg)
          series_neg_column.name(category + " (-)")

        });

        // turn on legend
        chart.legend().enabled(true).fontSize(13).padding([0, 0, 20, 0]);
        // set yAxis labels formatter
        chart.yAxis().labels().format('{%Value}{groupsSeparator: }');

        chart.background().fill(colors.BACKGROUND)

        // set titles for axes
        chart.xAxis().title('Reviews');
        chart.yAxis().title('# of Mentions');

        // set interactivity hover
        chart.interactivity().hoverMode('by-x');

        chart.tooltip().valuePrefix('$').displayMode('union');

        // set container id for the chart
        chart.container('reception-container');

        // initiate chart drawing
        chart.draw();

        setCurrChart(chart);

      }

    }, [songScores, songsSorted])

    
    useEffect(() => {

      const sortByPopularity = (a, b) => {
        console.log(ALL_SONGS[SONG_FEATURES.indexOf(a)]);
        const artistsA = ALL_SONGS[SONG_FEATURES.indexOf(a)].artists.map(artist => ARTISTS_DICT[artist.id])
          .filter(artist => artist.name !== "Metallica");
        const artistsB = ALL_SONGS[SONG_FEATURES.indexOf(b)].artists.map(artist => ARTISTS_DICT[artist.id])
          .filter(artist => artist.name !== "Metallica");
        return artistsA[0].popularity - artistsB[0].popularity
      }

      const sortByMentions = (a, b) => {
        const indexA = SONG_FEATURES.indexOf(a);
        const indexB = SONG_FEATURES.indexOf(b);

        return mentions[indexA] - mentions[indexB];
      }

      if (sortBy === "popularity_asc") {
        setSongsSorted([...SONG_FEATURES.slice(0, 53)].sort(sortByPopularity));
      } else if (sortBy === "popularity_desc") {
        setSongsSorted([...SONG_FEATURES.slice(0, 53)].sort(sortByPopularity).reverse());
      } else if (sortBy === "mentions_asc") {
        setSongsSorted([...SONG_FEATURES.slice(0, 53)].sort(sortByMentions));
      } else if (sortBy === "mentions_desc") {
        setSongsSorted([...SONG_FEATURES.slice(0, 53)].sort(sortByMentions).reverse());
      } else {
        setSongsSorted([...SONG_FEATURES.slice(0, 53)]);
      }
      
    }, [sortBy])

    return(
      <>
        <select value={sortBy} defaultValue="popularity_asc" onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Sort songs by...</option>
            <option value="mentions_asc">Critical mentions (ascending)</option>
            <option value="mentions_desc">Critical mentions (descending)</option>
            <option value="popularity_asc">Popularity (ascending)</option>
            <option value="popularity_desc">Popularity (descending)</option>
        </select>
        <div id="reception-scrollview">
          <div id="reception-key">
            <h3>adsfj;asldkjfas;dk</h3>
          </div>
          <div id="reception-container"></div>
        </div>
      </>
    )
};