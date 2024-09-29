import React, { useState, useEffect } from "react";
import anychart from 'anychart';
import { ALL_SONGS } from "./data/AllSongs";
import { SONG_RECEPTION } from "./data/Reception";
import { SONG_FEATURES } from "./data/Features";
import { useThemeColors } from "./colors";

export const ReceptionColChart = () => {

    const [charts, setCharts] = useState([]);

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

      let song_scores = ALL_SONGS.map((song) => {
        return structuredClone(REVIEW_CATEGORY_BASE)
      });

      SONG_RECEPTION.forEach((review) => {
        let trackNum = parseInt(review.Track) - 1;
        Object.keys(song_scores[trackNum]).forEach(category => {
          if (review.Quote.indexOf(`<${category}>`) >= 0) {
            if (parseInt(review.Sentiment) == -1) {
              song_scores[trackNum][category]["neg"] -= 1;
            } else {
              song_scores[trackNum][category]["pos"] += 1;
            }
          }
        })
      })

      console.log(song_scores);

      const formatted_data = SONG_FEATURES.slice(0, 53).map(song => {
        const index = SONG_FEATURES.indexOf(song);
        const values_pos = Object.values(song_scores[index]).map(value => value.pos);
        const values_neg = Object.values(song_scores[index]).map(value => value.neg);
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

    }, [])

    return(
      <>
        <div id="reception-container"></div>
      </>
    )
};