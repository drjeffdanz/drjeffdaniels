import { useEffect, useRef, useState } from 'react'
import { useGame } from '../game/store'
import { SPEAKERS } from '../game/types'

export function DialogueOverlay() {
  const dialogue = useGame((s) => s.dialogue)
  const index = useGame((s) => s.dialogueIndex)
  const advance = useGame((s) => s.advanceDialogue)
  const [portraitOk, setPortraitOk] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const line = dialogue?.[index]

  // VO hook: if a line ships with audio (M4+), play it. Text-only until then.
  useEffect(() => {
    audioRef.current?.pause()
    audioRef.current = null
    if (line?.audio) {
      const a = new Audio(line.audio)
      audioRef.current = a
      a.play().catch(() => {})
    }
    setPortraitOk(true)
  }, [line])

  useEffect(() => {
    if (!dialogue) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault()
        advance()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dialogue, advance])

  if (!line) return null

  const speaker = SPEAKERS[line.speaker] ?? SPEAKERS.narrator
  const isNarrator = line.speaker === 'narrator'

  return (
    <div className="dialogue" onClick={advance}>
      {!isNarrator && (
        <div className="dialogue-portrait" style={{ borderColor: speaker.color }}>
          {speaker.portrait && portraitOk ? (
            <img
              src={speaker.portrait}
              alt={speaker.name}
              onError={() => setPortraitOk(false)}
            />
          ) : (
            <span style={{ color: speaker.color }}>{speaker.name.charAt(0)}</span>
          )}
        </div>
      )}
      <div className="dialogue-body">
        {!isNarrator && (
          <div className="dialogue-name" style={{ color: speaker.color }}>
            {speaker.name}
          </div>
        )}
        <div className={isNarrator ? 'dialogue-text narrator' : 'dialogue-text'}>
          {line.text}
        </div>
        <div className="dialogue-more">
          {index + 1} / {dialogue!.length} — click to continue
        </div>
      </div>
    </div>
  )
}
