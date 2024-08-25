import react, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'
import Introduction from './texts/introduction.md';
import Background from './texts/background.md';
import Blacklist from './texts/blacklist.md';
import Conclusion from './texts/conclusion.md';
import { Markdown, LinkRenderer } from './Markdown.tsx';
import './App.css';

const App = () => {

  const [introductionText, setIntroductionText] = useState('')
  const [backgroundText, setBackgroundText] = useState('')
  const [blacklistText, setBlacklistText] = useState('')
  const [conclusionText, setConclusionText] = useState('')

	useEffect(() => {
		fetch(Introduction).then(res => res.text()).then(text => setIntroductionText(text))
		fetch(Background).then(res => res.text()).then(text => setBackgroundText(text))
		fetch(Blacklist).then(res => res.text()).then(text => setBlacklistText(text))
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

      <Markdown children={introductionText}></Markdown>
      <Markdown children={backgroundText}></Markdown>
      <Markdown children={blacklistText} components={{ a: LinkRenderer}}></Markdown>
      <Markdown children={conclusionText}></Markdown>

    </div>
  );
}

export default App;
