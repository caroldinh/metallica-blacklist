import React, { useState, useEffect } from "react";
import { ALL_SONGS } from "./data/AllSongs";
import { ARTISTS_DICT } from "./data/ArtistsDict";
import { EVERYNOISE_GENRES } from "./data/EverynoiseGenres";
import { useThemeColors } from "./colors";

export const GenreDemographics = () => {

    const [currArtist, setCurrArtist] = useState(null);
    const [currGenre, setCurrGenre] = useState(null);
    const [currSong, setCurrSong] = useState(null);
    const [sortBy, setSortBy] = useState("gender");

    const GENRES_BY_GENDER = Object.keys(EVERYNOISE_GENRES).sort((a, b) => {
        return (EVERYNOISE_GENRES[a].percent_female - EVERYNOISE_GENRES[b].percent_female)
    });

    const GENRES_BY_AGE = Object.keys(EVERYNOISE_GENRES).sort((a, b) => {
        return (EVERYNOISE_GENRES[a].average_age - EVERYNOISE_GENRES[b].average_age)
    });

    const [sortedList, setSortedList] = useState(GENRES_BY_GENDER);

    const colors = useThemeColors();

    useEffect(() => {

        setSortedList(sortBy === 'gender' ? GENRES_BY_GENDER : GENRES_BY_AGE);

    }, [sortBy])

    return (

        <div id="genre-demographics">

            <div class="stage">
                <p id="stage-title">STAGE</p>
            </div>

            <div id="stage-title-row">
                <div style={{ width: '40%', textAlign: 'center', marginBottom: '4vh' }}>
                <select value={sortBy} defaultValue="gender" onChange={(e) => setSortBy(e.target.value)}>
                    <option value="gender">Gender distribution</option>
                    <option value="age">Average age</option>
                </select>
                <p id="stage-title"> of Spotify listeners to Genres on <i>The Metallica Blacklist</i></p>
                </div>
                <div className="chart-key">
                    <span className="key-item">
                        <span className="key-color primary-empty"></span>
                        <span className="key-label">Genre within <i>The Metallica Blacklist</i></span>
                    </span>
                    <span className="key-item">
                        <span className="key-color foreground"></span>
                        <span className="key-label">Genre listed on artist's Spotify page</span>
                    </span>
                    <span className="key-item">
                        <span className="key-color primary"></span>
                        <span className="key-label">Old school thrash - Metallica's core genre</span>
                    </span>
                    { sortBy === 'gender' &&
                    <span className="key-item">
                        <span className="key-color theme-2"></span>
                        <span className="key-label">Gender parity (approx)</span>
                    </span>
                    }
                </div>
            </div>

            <div class="artist-row">
                <div class="bars-row">
                    <p className="key-text">← {sortBy === 'gender' ? "More male" : "Younger"} listeners</p>
                    <p className="key-text">{sortBy === 'gender' ? 'More female' : 'Older' } listeners →</p>
                </div>
            </div>

            {currSong && <audio id="artist-preview-player" src={currSong.preview_url} autoPlay loop></audio> }

            <div
                onMouseLeave={() => {
                    setCurrArtist(null);
                    setCurrSong(null);
                }}
            >


            {Object.keys(ARTISTS_DICT).filter(artist => ARTISTS_DICT[artist].name !== "Metallica" && ARTISTS_DICT[artist].genres.length).map(artist_id => {

                const SONG_DETAILS = ALL_SONGS.filter(song => song.artists.map(artist => artist.id).indexOf(artist_id) >= 0)[0]

                return (

                    <div class="artist-row"
                        style={{
                            backgroundColor: currArtist === artist_id ? colors.ACCENT : colors.BACKGROUND
                        }}
                        onMouseOver={() => { 
                            if (currArtist !== artist_id) {
                                setCurrArtist(artist_id) 
                                setCurrSong(SONG_DETAILS)
                            }
                        }}
                    >

                        {currArtist &&
                            <div class="artists-header" style={{
                                display: currArtist === artist_id ? "flex" : "none"
                            }}>
                                <img className="img" src={ARTISTS_DICT[currArtist].images.length ? ARTISTS_DICT[currArtist].images[0].url : ""}></img>
                                <div class="text-col">
                                    <p className="name">{ARTISTS_DICT[currArtist].name}</p>
                                    <p className="detail-text">{currSong && `${ALL_SONGS.indexOf(currSong) + 1}`}. {currSong && currSong.name}</p>
                                </div>
                            </div>
                        }
                        {
                            currGenre &&
                            <div id="genre-tooltip"
                                style={{
                                    display: currArtist === artist_id ? "flex" : "none"
                                }}
                            >
                                {currGenre === "chamber ensemble" || currGenre === "slacker rock" ? 
                                <p>{currGenre}: No demographic data available</p> : 
                                sortBy === 'gender' ? 
                                <p>{currGenre}: {EVERYNOISE_GENRES[currGenre].percent_female}% female listeners on Spotify</p>
                                :
                                <p>{currGenre}: {EVERYNOISE_GENRES[currGenre].average_age} is the average age of listeners on Spotify</p>
                                }
                            </div>
                        }


                        <div class="bars-row"
                        >
                            {sortedList.filter(genre => genre !== "thrash metal" && genre !== "slacker rock" && genre !== "chamber ensemble").map((genre, index) =>

                                <>


                                    <div key={index} className="genre-cell" style={{
                                        backgroundColor:
                                            ARTISTS_DICT[artist_id].genres.indexOf(genre) >= 0 ? colors.FOREGROUND :
                                                currArtist === artist_id && currGenre !== genre ? colors.ACCENT :
                                                currArtist === artist_id && currGenre === genre ? colors.PRIMARY :
                                                genre === "old school thrash" ? colors.PRIMARY :
                                                genre === "electropop" && sortBy === "gender" ? colors.THEME2 :
                                                colors.BACKGROUND
                                    }}
                                        onMouseEnter={() => { setCurrGenre(genre) }}
                                        onMouseOut={() => { setCurrGenre(null) }}
                                        title={genre}>
                                    </div>

                                </>

                            )}
                        </div>

                    </div>

                )
            })}
            </div>

        </div>

    )

}