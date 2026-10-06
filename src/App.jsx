 
import { useState } from 'react'
import './App.css'

function App() {
  const [sourceLanguage, setSourceLanguage] = useState('en')
  const [targetLanguage, setTargetLanguage] = useState('hi')
  const [text, setText] = useState('')
  const [translation, setTranslation] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)

  const languages = [
    { name: 'English', code: 'en' },
    { name: 'Hindi', code: 'hi' },
    { name: 'Bengali', code: 'bn' },
    { name: 'Spanish', code: 'es' },
    { name: 'French', code: 'fr' },
    { name: 'German', code: 'de' },
    { name: 'Japanese', code: 'ja' },
    { name: 'Chinese', code: 'zh' }
  ]

  const getLanguageName = (code) => {
    const language = languages.find((item) => item.code === code)
    return language ? language.name : code
  }

  const handleTranslate = async () => {
    if (!text.trim()) {
      setTranslation('')
      return
    }

    if (sourceLanguage === targetLanguage) {
      setTranslation(text)
      return
    }

    try {
      setIsTranslating(true)
      setTranslation('')

      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=${sourceLanguage}|${targetLanguage}`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Translation request failed')
      }

      const data = await response.json()

      if (data.responseData?.translatedText) {
        setTranslation(data.responseData.translatedText)
      } else {
        setTranslation('Translation is not available right now.')
      }
    } catch (error) {
      console.error('Translation error:', error)
      setTranslation('Something went wrong. Please try again.')
    } finally {
      setIsTranslating(false)
    }
  }

  const handleClear = () => {
    setText('')
    setTranslation('')
  }

  const handleSwap = () => {
    setSourceLanguage(targetLanguage)
    setTargetLanguage(sourceLanguage)

    setText(translation)
    setTranslation(text)
  }

  const handleCopy = async () => {
    if (!translation) return

    try {
      await navigator.clipboard.writeText(translation)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  return (
    <main className="app">
      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>

      <section className="translator">
        {/* Header */}
        <header className="translator-header">
          <div className="brand">
            <div className="brand-icon">
              <span>文</span>
              <span>A</span>
            </div>

            <div>
              <h1>Lingua</h1>
              <p>Translate without boundaries</p>
            </div>
          </div>

          <div className="status">
            <span className="status-dot"></span>
            Translation ready
          </div>
        </header>

        {/* Language selector */}
        <div className="language-selector">
          <div className="language-select">
            <span className="language-label">FROM</span>

            <select
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
            >
              {languages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.name}
                </option>
              ))}
            </select>
          </div>

          <button
            className="swap-button"
            onClick={handleSwap}
            aria-label="Swap languages"
          >
            <span>⇄</span>
          </button>

          <div className="language-select">
            <span className="language-label">TO</span>

            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
            >
              {languages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Translation panels */}
        <div className="translation-area">
          {/* Source */}
          <div className="text-panel">
            <div className="panel-header">
              <div className="panel-language">
                <span className="language-symbol">A</span>
                <span>{getLanguageName(sourceLanguage)}</span>
              </div>

              <button
                className="panel-action"
                onClick={() => setText('')}
                disabled={!text}
              >
                Clear
              </button>
            </div>

            <div className="textarea-wrapper">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type something to translate..."
                maxLength={5000}
              />

              <div className="character-count">
                {text.length} / 5000
              </div>
            </div>
          </div>

          {/* Target */}
          <div className="text-panel result-panel">
            <div className="panel-header">
              <div className="panel-language">
                <span className="language-symbol translated-symbol">
                  文
                </span>
                <span>{getLanguageName(targetLanguage)}</span>
              </div>

              <button
                className="panel-action"
                onClick={handleCopy}
                disabled={!translation}
              >
                Copy
              </button>
            </div>

            <div className="textarea-wrapper">
              <textarea
                value={isTranslating ? '' : translation}
                readOnly
                placeholder={
                  isTranslating
                    ? 'Translating...'
                    : 'Your translation will appear here...'
                }
              />

              {isTranslating && (
                <div className="loading">
                  <span></span>
                  <span></span>
                  <span></span>
                  <p>Translating</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom actions */}
        <div className="bottom-bar">
          <div className="tip">
            <span>✦</span>
            <span>Fast, simple and easy to use</span>
          </div>

          <div className="actions">
            <button
              className="clear-all"
              onClick={handleClear}
              disabled={!text && !translation}
            >
              Clear all
            </button>

            <button
              className="translate-button"
              onClick={handleTranslate}
              disabled={isTranslating || !text.trim()}
            >
              {isTranslating ? (
                <>
                  <span className="button-spinner"></span>
                  Translating...
                </>
              ) : (
                <>
                  Translate
                  <span className="arrow">→</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="footer">
          <span>Lingua Translator</span>
          <span>•</span>
          <span>Powered by translation technology</span>
        </footer>
      </section>
    </main>
  )
}

export default App
 
