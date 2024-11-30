import React, { useState, useEffect } from "react";
import anychart from 'anychart';
import { SONG_FEATURES } from "./data/Features";
import { useThemeColors } from "./colors";

export const WorldMap = () => {

    useEffect(() => {

    },[])


    return (
        <div>
            <div class="worldmap-title">
                <p id="reception-title">Nationalities Represented on <i>The Metallica Blacklist</i></p>
                <p id="reception-subtitle">Click on a country to see which artists hail from there</p>
            </div>
            <iframe src='https://flo.uri.sh/visualisation/18908130/embed' title='Interactive or visual content' class='flourish-embed-iframe' frameborder='0' scrolling='no' style={{ width: '100%', height: '100vh'}} sandbox='allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation'></iframe>
        </div>
    )

}