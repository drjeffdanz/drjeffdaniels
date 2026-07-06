import { music } from '../game/music'
import { useGame } from '../game/store'

export function Menu() {
  const start = useGame((s) => s.start)
  return (
    <div className="menu">
      <div className="menu-card">
        <div className="menu-kicker">A tale of Elderwyn · sequel to The Moonveil Crown</div>
        <h1>
          Sisters' Quest <span className="numeral">II</span>
        </h1>
        <h2>The Moonbeam Mystery</h2>
        <p className="menu-blurb">
          On a quiet night in the palace, a moonbeam bends where no moonbeam
          should. Mackenzie wants the truth. Cambrie wants to know why nobody
          else finds it funny that the moon is <em>misfiring</em>.
        </p>
        <button
          className="begin"
          onClick={() => {
            start()
            music.start()
          }}
        >
          Begin
        </button>
        <div className="menu-controls">
          <div>🖱 Click the floor to walk · click things to interact</div>
          <div>⇥ Tab swaps sisters — they see the world differently</div>
          <div>🔍 Insight is Mackenzie's gift. Wit is Cambrie's.</div>
        </div>
        <div className="menu-note">M0 tech demo — one gray-box room, real systems</div>
      </div>
    </div>
  )
}
