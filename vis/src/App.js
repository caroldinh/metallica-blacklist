import react, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'
import Introduction from './texts/introduction.md';
import Background from './texts/background.md';
import Blacklist from './texts/blacklist.md';
import Reception from './texts/reception.md';
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

const App = () => {

  const [introductionText, setIntroductionText] = useState('')
  const [backgroundText, setBackgroundText] = useState('')
  const [blacklistText, setBlacklistText] = useState('')
  const [conclusionText, setConclusionText] = useState('')
  const [receptionText, setReceptionText] = useState('')
  const [reachText, setReachText] = useState('')
  const [generationsText, setGenerationsText] = useState('')
  const [methodologyText, setMethodologyText] = useState('')

  const [unforgivenIsPlaying, setUnforgivenIsPlaying] = useState(true);

  const handleScroll = () => {
      const position = window.scrollY;
      if (unforgivenIsPlaying && position > 600) {
        document.getElementById("unforgiven-audio").volume = Math.max(0, (100 - 0.1 * (position - 600)) / 100);
      } else if (unforgivenIsPlaying && position > 1200) {
        document.getElementById("unforgiven-audio").pause();
      }
  };

  useEffect(() => {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
          window.removeEventListener('scroll', handleScroll);
      };
  }, []);


	useEffect(() => {
		fetch(Introduction).then(res => res.text()).then(text => setIntroductionText(text))
		fetch(Background).then(res => res.text()).then(text => setBackgroundText(text))
		fetch(Blacklist).then(res => res.text()).then(text => setBlacklistText(text))
		fetch(Reception).then(res => res.text()).then(text => setReceptionText(text))
		fetch(Reach).then(res => res.text()).then(text => setReachText(text))
		fetch(Generations).then(res => res.text()).then(text => setGenerationsText(text))
		fetch(Conclusion).then(res => res.text()).then(text => setConclusionText(text))
		fetch(Methodology).then(res => res.text()).then(text => setMethodologyText(text))
	}, [])

  return (
    <div className="App">
      <audio id="unforgiven-audio" loop autoPlay> 
        <source src="https://github.com/caroldinh/metallica-blacklist/raw/refs/heads/main/vis/public/music/the_unforgiven.mp3" type="audio/mpeg"/>
      </audio>
      <header className="App-header">
        <h1>New Blood Joins This Earth</h1>
        <h4>A retrospective on the Metallica Blacklist</h4>
      </header>

      <Markdown children={backgroundText}></Markdown>
      <Markdown children={blacklistText} components={{ a: LinkRenderer}}></Markdown>
      <RadarCompare/>
      <Markdown children={receptionText} components={{ a: LinkRenderer}}></Markdown>
      <ReceptionColChart />
      <Markdown children={reachText} components={{ a: LinkRenderer}}></Markdown>
      <WorldMap/>
      <Markdown children={generationsText} components={{ a: LinkRenderer}}></Markdown>
      <GenreDemographics />
      <Markdown children={conclusionText}></Markdown>
      
      <div className="methodology">
        <Markdown children={methodologyText}></Markdown>
      </div>

      <p className="footer">Made with 🤘🏼 by Caroline Dinh</p>

    </div>
  );
}

export default App;
