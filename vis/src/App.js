import react, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'
import Introduction from './texts/introduction.md';
import Background from './texts/background.md';
import Blacklist from './texts/blacklist.md';
import Reception from './texts/reception.md';
import Reception2 from './texts/reception2.md';
import Reach from './texts/reach.md';
import Artists from './texts/artists.md';
import Generations from './texts/generations.md';
import Conclusion from './texts/conclusion.md';
import Methodology from './texts/methodology.md';
import { Markdown, LinkRenderer } from './Markdown.tsx';
import { RadarCompare } from './RadarCompare';
import { WorldMap } from './Map';
import './App.css';
import { ReceptionColChart } from './ReceptionColChart.js';
import { GenreDemographics } from './GenreDemographics.js';
import { ReceptionCategories } from './ReceptionCategories.js';

const App = () => {

  const [introductionText, setIntroductionText] = useState('')
  const [backgroundText, setBackgroundText] = useState('')
  const [blacklistText, setBlacklistText] = useState('')
  const [conclusionText, setConclusionText] = useState('')
  const [receptionText, setReceptionText] = useState('')
  const [receptionText2, setReceptionText2] = useState('')
  const [reachText, setReachText] = useState('')
  const [generationsText, setGenerationsText] = useState('')
  const [methodologyText, setMethodologyText] = useState('')
  const [started, setStarted] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState(false);

  const [unforgivenIsPlaying, setUnforgivenIsPlaying] = useState(true);

  const handleScroll = () => {
    const position = window.scrollY;
    if (unforgivenIsPlaying && position > 1080) {
      document.getElementById("unforgiven-audio").volume = Math.max(0, (100 - 0.1 * (position - 1080)) / 100);
    } else if (unforgivenIsPlaying && position > 1500) {
      document.getElementById("unforgiven-audio").pause();
    }
  };

  const handleFirstScroll = () => {
    document.getElementById("unforgiven-audio").play();
    document.getElementById("text-start").scrollIntoView();
    window.removeEventListener('scroll', handleFirstScroll);
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scroll', handleFirstScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
   if (started) {
    document.getElementsByTagName("html")[0].style.overflowY = "scroll";
   } 
  }, [started])

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(Introduction).then(res => res.text()).then(text => setIntroductionText(text))
    fetch(Background).then(res => res.text()).then(text => setBackgroundText(text))
    fetch(Blacklist).then(res => res.text()).then(text => setBlacklistText(text))
    fetch(Reception).then(res => res.text()).then(text => setReceptionText(text))
    fetch(Reception2).then(res => res.text()).then(text => setReceptionText2(text))
    fetch(Reach).then(res => res.text()).then(text => setReachText(text))
    fetch(Generations).then(res => res.text()).then(text => setGenerationsText(text))
    fetch(Conclusion).then(res => res.text()).then(text => setConclusionText(text))
    fetch(Methodology).then(res => res.text()).then(text => setMethodologyText(text))

    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

  }, [])

  return (
    <div className="App">
      <audio id="unforgiven-audio" loop>
        <source src="https://github.com/caroldinh/metallica-blacklist/raw/refs/heads/main/vis/public/music/the_unforgiven.mp3" type="audio/mpeg" />
      </audio>
      <header className="App-header">
        <img id="metalligif" src="images/Metallica.gif"></img>
        <h1>New Blood Joins This Earth</h1>
        <h4>Visualizing the influence of Metallica, thirty years after the "Black Album"</h4>
        <div id="btn-start" onClick={() => {
          setStarted(true);
          document.getElementById("unforgiven-audio").play();
          document.getElementById("text-start").scrollIntoView();
        }}>{windowDimensions.height > windowDimensions.width ? "Best experienced in landscape (continue anyways)" : "Begin with audio"}</div>
      </header>

      <div id="text-start">
      {started ?
        <div>
          <Markdown children={backgroundText}></Markdown>
          <Markdown children={blacklistText} components={{ a: LinkRenderer }}></Markdown>
          <RadarCompare />
          <Markdown children={receptionText} components={{ a: LinkRenderer }}></Markdown>
          <ReceptionCategories />
          <Markdown children={receptionText2} components={{ a: LinkRenderer }}></Markdown>
          <ReceptionColChart />
          <Markdown children={reachText} components={{ a: LinkRenderer }}></Markdown>
          <WorldMap />
          <Markdown children={generationsText} components={{ a: LinkRenderer }}></Markdown>
          <GenreDemographics />
          <div class="image-and-caption">
            <img src="images/RedditScreenshot2.png" alt="Reddit post on r/Metallica that reads: 'Does anybody else have no fucking idea who 95% of the artists on The Blacklist albm are?! I know I'm old (40) and out of touch with new music, but I thought I'd know more artists than I do."></img>
            <a class="caption" href="https://www.reddit.com/r/Metallica/comments/pdmr0t/does_anybody_else_have_no_fucking_idea_who_95_of/" target="_blank">original post by u/ashbyashbyashby</a>
          </div>
          <Markdown children={conclusionText}></Markdown>

          <div className="methodology">
            <Markdown children={methodologyText}></Markdown>
          </div>
          <p className="footer">Made with 🤘🏼 by <a href="https://caroldinh.github.io/" target="_blank">Caroline Dinh</a></p>
        </div>
        :
        <div></div>
      }
      </div>

    </div>
  );
}

export default App;
