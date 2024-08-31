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
import { Markdown, LinkRenderer } from './Markdown.tsx';
import { RadarCompare } from './RadarCompare';
import './App.css';

const App = () => {

  const [introductionText, setIntroductionText] = useState('')
  const [backgroundText, setBackgroundText] = useState('')
  const [blacklistText, setBlacklistText] = useState('')
  const [conclusionText, setConclusionText] = useState('')
  const [receptionText, setReceptionText] = useState('')
  const [reachText, setReachText] = useState('')
  const [artistsText, setArtistsText] = useState('')
  const [generationsText, setGenerationsText] = useState('')

	useEffect(() => {
		fetch(Introduction).then(res => res.text()).then(text => setIntroductionText(text))
		fetch(Background).then(res => res.text()).then(text => setBackgroundText(text))
		fetch(Blacklist).then(res => res.text()).then(text => setBlacklistText(text))
		fetch(Reception).then(res => res.text()).then(text => setReceptionText(text))
		fetch(Reach).then(res => res.text()).then(text => setReachText(text))
		fetch(Artists).then(res => res.text()).then(text => setArtistsText(text))
		fetch(Generations).then(res => res.text()).then(text => setGenerationsText(text))
		fetch(Conclusion).then(res => res.text()).then(text => setConclusionText(text))
	})

  return (
    <div className="App">
      <audio id="audio" loop autoPlay> 
        <source src="/music/the_unforgiven.mp3" type="audio/mpeg"/>
      </audio>
      <header className="App-header">
        <h1>New Blood Joins This Earth</h1>
        <h4>A retrospective on the Metallica Blacklist</h4>
      </header>

      <Markdown children={backgroundText}></Markdown>
      <Markdown children={blacklistText} components={{ a: LinkRenderer}}></Markdown>
      <RadarCompare/>
      <Markdown children={receptionText} components={{ a: LinkRenderer}}></Markdown>
      <Markdown children={artistsText} components={{ a: LinkRenderer}}></Markdown>
      <Markdown children={reachText} components={{ a: LinkRenderer}}></Markdown>
      <Markdown children={generationsText} components={{ a: LinkRenderer}}></Markdown>
      <Markdown children={conclusionText}></Markdown>

      <p className="footer">Made with 🤘🏼 by Carol Dinh</p>

    </div>
  );
}

export default App;
