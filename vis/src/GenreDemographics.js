import React, { useState, useEffect } from "react";
import { ALL_SONGS } from "./data/AllSongs";
import { ARTISTS_DICT } from "./data/ArtistsDict";
import { EVERYNOISE_GENRES } from "./data/EverynoiseGenres";
import { useThemeColors } from "./colors";

export const GenreDemographics = () => {

    const [currArtist, setCurrArtist] = useState(null);
    const [currGenre, setCurrGenre] = useState(null);
    const [currSong, setCurrSong] = useState(null);

    const GENRES_BY_GENDER = Object.keys(EVERYNOISE_GENRES).sort((a, b) => {
        return (EVERYNOISE_GENRES[a].percent_female - EVERYNOISE_GENRES[b].percent_female)
    })

    const GENRES_BY_AGE = Object.keys(EVERYNOISE_GENRES).sort((a, b) => {
        return (EVERYNOISE_GENRES[a].average_age - EVERYNOISE_GENRES[b].average_age)
    })

    const colors = useThemeColors();

    return (

        <div id="genre-demographics">

            <div class="stage">
                <p id="stage-title">STAGE</p>
            </div>

            <div class="artist-row">
                <div class="bars-row">
                    <p className="key-text">More male listeners</p>
                    <p className="key-text">More female listeners</p>
                </div>
            </div>


            {Object.keys(ARTISTS_DICT).filter(artist => ARTISTS_DICT[artist].name !== "Metallica").map(artist_id => {

                const SONG_DETAILS = ALL_SONGS.filter(song => song.artists.map(artist => artist.id).indexOf(artist_id) >= 0)[0]

                return (

                    <div class="artist-row"

                        style={{
                            backgroundColor: currArtist === artist_id ? colors.ACCENT : colors.BACKGROUND
                        }}

                    >

                        {/*
                    <div class="artists-header">
                        <img className="img" src={ARTISTS_DICT[artist_id].images.length ? ARTISTS_DICT[artist_id].images[0].url : ""}></img>
                        <div class="text-col">
                            <p className="name">{ARTISTS_DICT[artist_id].name}</p>
                            <p className="detail-text">{SONG_DETAILS.track_number}. {SONG_DETAILS.name}</p>
                        </div>
                    </div>
                    */}

                        {currArtist &&
                            <div class="artists-header" style={{
                                display: currArtist === artist_id ? "flex" : "none"
                            }}>
                                <img className="img" src={ARTISTS_DICT[currArtist].images.length ? ARTISTS_DICT[currArtist].images[0].url : ""}></img>
                                <div class="text-col">
                                    <p className="name">{ARTISTS_DICT[currArtist].name}</p>
                                    <p className="detail-text">{currSong && currSong.track_number}. {currSong && currSong.name}</p>
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
                                <p>{currGenre}: {EVERYNOISE_GENRES[currGenre].percent_female}% female listeners on Spotify</p>
                            </div>
                        }


                        <div class="bars-row"
                            onMouseOver={() => { setCurrArtist(artist_id); setCurrSong(SONG_DETAILS) }}
                            onMouseOut={() => { setCurrArtist(null) }}
                        >
                            {GENRES_BY_GENDER.filter(genre => genre !== "thrash metal").map((genre, index) =>

                                <>


                                    <div key={index} className="genre-cell" style={{
                                        backgroundColor:
                                            ARTISTS_DICT[artist_id].genres.indexOf(genre) >= 0 ? colors.FOREGROUND :
                                                genre === "old school thrash" ? colors.ACCENT :
                                                    currArtist === artist_id && currGenre !== genre ? colors.ACCENT :
                                                        colors.BACKGROUND
                                    }}
                                        onMouseOver={() => { setCurrGenre(genre) }}
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

    )

}