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
  const [currTrack, setCurrTrack] = useState(-1);
  const [reviewsToDisplay, setReviewsToDisplay] = useState([]);
  const [previewURL, setPreviewURL] = useState("");

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
    uniqueness: {
      pos: 0,
      neg: 0,
    },
  }

  const colors = useThemeColors();

  const formatArtists = (input) => {
    const parts = input.split(',');
    if (parts.length <= 2) {
      return input;
    }
    return parts.slice(0, 2).join(',') + "...";
  }

  useEffect(() => {

    let song_scores = ALL_SONGS
      .map((song) => {
        return structuredClone(REVIEW_CATEGORY_BASE)
      });

    let mentionsList = new Array(53).fill(0)

    SONG_RECEPTION.forEach((review) => {
      let trackNum = parseInt(review.Track) - 1;
      Object.keys(song_scores[trackNum]).forEach(category => {
        if (review.Quote.indexOf(`<${category}>`) >= 0) {
          mentionsList[trackNum] += 1;
          if (category === 'reputation' && review.Track === '26' && review.Author === 'Brad Sanders')
            song_scores[trackNum][category]["pos"] += 1;
          else if (category === 'reputation' && review.Track === '36')
            song_scores[trackNum][category]["pos"] += 1;
          else if (parseInt(review.Sentiment) == -1) {
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
      const formatted_data = songsSorted.slice(0, 53).map((song, songIndex) => {
        const index = SONG_FEATURES.indexOf(song);
        const values_pos = Object.values(songScores[index]).map(value => value.pos);
        const values_neg = Object.values(songScores[index]).map(value => value.neg);

        return [formatArtists(song.Artists), song.Artists, ...values_pos, ...values_neg]
      })

      let chart_data = anychart.data.set(formatted_data);

      let chart = anychart.column();
      chart.animation(true);
      chart.yScale().stackMode('value');

      Object.keys(REVIEW_CATEGORY_BASE).forEach((category, index) => {

        let series_pos = chart_data.mapAs({
          x: 0, value:
            Object.keys(REVIEW_CATEGORY_BASE).indexOf(category) + 2
        })

        let series_neg = chart_data.mapAs({
          x: 0, value:
            Object.keys(REVIEW_CATEGORY_BASE).indexOf(category) +
            Object.keys(REVIEW_CATEGORY_BASE).length
            + 2
        })

        let series_pos_column = chart.column(series_pos)
        series_pos_column.name(category + " (+)")

        let series_neg_column = chart.column(series_neg)
        series_neg_column.name(category + " (-)")

        series_pos_column.normal().fill(colors[Object.keys(colors)[index]]);
        series_neg_column.normal().fill(`${colors[Object.keys(colors)[index]]} 0.25`);
        series_pos_column.normal().stroke(colors.FOREGROUND, 1);
        series_neg_column.normal().stroke(colors.FOREGROUND, 1);

        series_pos_column.listen("click", (e) => {
          setCurrTrack(SONG_FEATURES.map(song => formatArtists(song.Artists)).indexOf(e.target.me.name));
        })

        series_neg_column.listen("click", (e) => {
          setCurrTrack(SONG_FEATURES.map(song => formatArtists(song.Artists)).indexOf(e.target.me.name));
        })

      });

      // turn on legend
      chart.legend().enabled(false)
      // set yAxis labels formatter
      chart.yAxis().labels().enabled(true).format('{%Value}{groupsSeparator: }');
      chart.xAxis().labels().rotation(90);
      chart.xAxis().overlapMode("allowOverlap");

      chart.background().fill(colors.BACKGROUND)

      // set titles for axes
      chart.xAxis().title('Artists');
      chart.yAxis().title('# of Mentions in Critic Reviews');

      // set interactivity hover
      chart.interactivity().hoverMode('by-x');

      chart.barsPadding(0);
      chart.barGroupsPadding(0.2);

      chart.tooltip().displayMode('union')
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

  useEffect(() => {

    if (currTrack >= 0) {
      setReviewsToDisplay(SONG_RECEPTION.filter(review => parseInt(review.Track) - 1 === currTrack));
      setPreviewURL(ALL_SONGS[currTrack].preview_url);
    } else {
      setReviewsToDisplay([]);
      setPreviewURL("")
    }

  }, [currTrack]);

  return (
        <div id="reception-scrollview">
        <div id="reception-key" style={{ display: currTrack === -1 ? "none" : "block" }}>
          <p class="close-reception" onClick={() => { setCurrTrack(-1) }}>×</p>
          <h3>{currTrack >= 0 && SONG_FEATURES[currTrack].Title}</h3>
          <h4>by {currTrack >= 0 && SONG_FEATURES[currTrack].Artists}</h4>
          {reviewsToDisplay.map(review => {
            return (
              <div id="reception-quote">
                <p dangerouslySetInnerHTML={{
                  __html:
                    review.Quote
                      .replace("<proficiency>", "<span class='proficiency'>")
                      .replace("</proficiency>", `</span> <b>(${review.Sentiment == "1" ? "+1" : "-1"} proficiency)</b>`)
                      .replace("<composition>", "<span class='composition'>")
                      .replace("</composition>", `</span> <b>(${review.Sentiment == "1" ? "+1" : "-1"} composition)</b>`)
                      .replace("<interpretation>", "<span class='interpretation'>")
                      .replace("</interpretation>", `</span> <b>(${review.Sentiment == "1" ? "+1" : "-1"} interpretation)</b>`)
                      .replace("<instrumentation>", "<span class='instrumentation'>")
                      .replace("</instrumentation>", `</span> <b>(${review.Sentiment == "1" ? "+1" : "-1"} instrumentation)</b>`)
                      .replace("<reputation>", "<span class='reputation'>")
                      .replace("</reputation>", `</span> <b>(${review.Sentiment == "1" ? "+1" :
                        review.Track === "26" && review.Author === "Brad Sanders" ? "+1" : //hardcoding a special case
                          review.Track === "36" ? "+1" :
                            "-1"} reputation)</b>`)
                      .replace("<genre>", "<span class='genre'>")
                      .replace("</genre>", `</span> <b>(${review.Sentiment == "1" ? "+1" : "-1"} genre)</b>`)
                      .replace("<loyalty>", "<span class='loyalty'>")
                      .replace("</loyalty>", `</span> <b>(${review.Sentiment == "1" ? "+1" : "-1"} loyalty)</b>`)
                      .replace("<memorability>", "<span class='memorability'>")
                      .replace("</memorability>", `</span> <b>(${review.Sentiment == "1" ? "+1" : "-1"} memorability)</b>`)
                      .replace("<uniqueness>", "<span class='uniqueness'>")
                      .replace("</uniqueness>", `</span> <b>(${review.Sentiment == "1" ? "+1" : "-1"} uniqueness)</b>`)
                }}>
                </p>
                <a class="quote-attr" href={review.URL} target="_blank">({review.Author} via <i>{review.Platform})</i></a>
              </div>
            )
          })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: '100%', flexGrow: 1 }}>
          <p id="reception-title">Critic Reception of Tracks on the Blacklist</p>
          <p id="reception-subtitle">Click on a column to see what reviewers had to say!</p>
          <audio id="reception-preview-player" src={previewURL} autoPlay loop></audio>
          <select class="reception-select" value={sortBy} defaultValue="popularity_asc" onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Sort songs by...</option>
            <option value="mentions_asc"># Mentions in Reviews</option>
            <option value="popularity_asc">Artist popularity on Spotify</option>
          </select>
          <div id="reception-container" style={{ width: '100%' }}></div>
        </div>
      </div>
  )
};