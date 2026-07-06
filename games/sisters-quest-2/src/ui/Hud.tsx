import { useState } from 'react'
import { music } from '../game/music'
import { useGame } from '../game/store'
import { SPEAKERS, type SisterId, type Verb } from '../game/types'

const VERB_LABELS: Record<Verb, string> = {
  look: '👁 Look',
  talk: '💬 Talk',
  take: '✋ Take',
  use: '⚙ Use',
  insight: '🔍 Insight',
}

export function StatusLine() {
  const hover = useGame((s) => s.hoverHotspot)
  const verb = useGame((s) => s.verb)
  const dialogue = useGame((s) => s.dialogue)
  if (dialogue || !hover) return null
  return (
    <div className="status-line">
      {VERB_LABELS[verb].replace(/^\S+\s/, '')} → {hover}
    </div>
  )
}

export function VerbBar() {
  const verb = useGame((s) => s.verb)
  const setVerb = useGame((s) => s.setVerb)
  const activeSister = useGame((s) => s.activeSister)
  const dialogue = useGame((s) => s.dialogue)
  if (dialogue) return null

  const verbs: Verb[] = ['look', 'talk', 'take', 'use']
  return (
    <div className="verb-bar">
      {verbs.map((v) => (
        <button
          key={v}
          className={verb === v ? 'verb active' : 'verb'}
          onClick={() => setVerb(v)}
        >
          {VERB_LABELS[v]}
        </button>
      ))}
      {activeSister === 'mackenzie' && (
        <button
          className={verb === 'insight' ? 'verb insight active' : 'verb insight'}
          onClick={() => setVerb('insight')}
          title="Mackenzie's gift: examine deeper"
        >
          {VERB_LABELS.insight}
        </button>
      )}
    </div>
  )
}

function SisterButton({ id }: { id: SisterId }) {
  const activeSister = useGame((s) => s.activeSister)
  const swap = useGame((s) => s.swapSister)
  const [imgOk, setImgOk] = useState(true)
  const speaker = SPEAKERS[id]
  const active = activeSister === id
  return (
    <button
      className={active ? 'sister-btn active' : 'sister-btn'}
      style={{ borderColor: active ? '#d4af6a' : 'transparent' }}
      onClick={() => !active && swap()}
      title={active ? `${speaker.name} (active)` : `Switch to ${speaker.name} (Tab)`}
    >
      {speaker.portrait && imgOk ? (
        <img src={speaker.portrait} alt={speaker.name} onError={() => setImgOk(false)} />
      ) : (
        <span style={{ color: speaker.color }}>{speaker.name.charAt(0)}</span>
      )}
    </button>
  )
}

export function SisterSwitch() {
  return (
    <div className="sister-switch">
      <SisterButton id="mackenzie" />
      <SisterButton id="cambrie" />
      <div className="hint">Tab to swap</div>
    </div>
  )
}

export function TopRight() {
  const casebook = useGame((s) => s.casebook)
  const toggleCasebook = useGame((s) => s.toggleCasebook)
  const [musicOn, setMusicOn] = useState(music.enabled)
  return (
    <div className="top-right">
      <button className="hud-btn" onClick={toggleCasebook}>
        📖 Casebook{casebook.length > 0 ? ` (${casebook.length})` : ''}
      </button>
      <button className="hud-btn" onClick={() => setMusicOn(music.toggle())}>
        {musicOn ? '🔊' : '🔇'}
      </button>
    </div>
  )
}

export function Casebook() {
  const open = useGame((s) => s.casebookOpen)
  const entries = useGame((s) => s.casebook)
  const toggle = useGame((s) => s.toggleCasebook)
  if (!open) return null
  return (
    <div className="casebook">
      <div className="casebook-header">
        <span>Mackenzie's Casebook</span>
        <button className="hud-btn" onClick={toggle}>
          ✕
        </button>
      </div>
      {entries.length === 0 ? (
        <p className="casebook-empty">
          No entries yet. Mackenzie's <em>Insight</em> fills these pages — find
          something strange and look deeper.
        </p>
      ) : (
        entries.map((e) => (
          <div key={e.id} className="casebook-entry">
            <h4>{e.title}</h4>
            <p>{e.text}</p>
          </div>
        ))
      )}
    </div>
  )
}
