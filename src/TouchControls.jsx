import { useCallback, useEffect, useRef, useState } from 'react'
import useGames from './stores/useGames.js'

const STICK_RADIUS = 48
const DEADZONE = 0.18

export default function TouchControls() {
  const setTouchInput = useGames((state) => state.setTouchInput)
  const resetTouchInput = useGames((state) => state.resetTouchInput)
  const zoneRef = useRef(null)
  const touchId = useRef(null)
  const origin = useRef({ x: 0, y: 0 })
  const [stick, setStick] = useState({ x: 0, y: 0 })
  const [jumpActive, setJumpActive] = useState(false)

  const applyMovement = useCallback(
    (dx, dy) => {
      const mag = Math.hypot(dx, dy)
      const normX = mag > 1 ? dx / mag : dx
      const normY = mag > 1 ? dy / mag : dy

      setTouchInput({
        forward: normY < -DEADZONE,
        backward: normY > DEADZONE,
        leftward: normX < -DEADZONE,
        rightward: normX > DEADZONE,
      })
    },
    [setTouchInput]
  )

  const resetMovement = useCallback(() => {
    setTouchInput({
      forward: false,
      backward: false,
      leftward: false,
      rightward: false,
    })
    setStick({ x: 0, y: 0 })
  }, [setTouchInput])

  const updateStick = useCallback(
    (clientX, clientY) => {
      let dx = (clientX - origin.current.x) / STICK_RADIUS
      let dy = (clientY - origin.current.y) / STICK_RADIUS
      const mag = Math.hypot(dx, dy)

      if (mag > 1) {
        dx /= mag
        dy /= mag
      }

      setStick({ x: dx * STICK_RADIUS, y: dy * STICK_RADIUS })
      applyMovement(dx, dy)
    },
    [applyMovement]
  )

  const handleJoystickStart = useCallback(
    (event) => {
      event.preventDefault()
      useGames.getState().start()

      const touch = event.changedTouches[0]
      touchId.current = touch.identifier

      const rect = zoneRef.current.getBoundingClientRect()
      origin.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      }

      updateStick(touch.clientX, touch.clientY)
    },
    [updateStick]
  )

  const handleJumpStart = useCallback(
    (event) => {
      event.preventDefault()
      useGames.getState().start()
      setTouchInput({ jump: true })
      setJumpActive(true)
    },
    [setTouchInput]
  )

  const handleJumpEnd = useCallback(
    (event) => {
      event.preventDefault()
      setTouchInput({ jump: false })
      setJumpActive(false)
    },
    [setTouchInput]
  )

  useEffect(() => {
    const findTouch = (event) => {
      if (touchId.current === null) return null

      for (const touch of event.touches) {
        if (touch.identifier === touchId.current) return touch
      }

      for (const touch of event.changedTouches) {
        if (touch.identifier === touchId.current) return touch
      }

      return null
    }

    const handleMove = (event) => {
      const touch = findTouch(event)
      if (!touch) return

      event.preventDefault()
      updateStick(touch.clientX, touch.clientY)
    }

    const handleEnd = (event) => {
      for (const touch of event.changedTouches) {
        if (touch.identifier === touchId.current) {
          event.preventDefault()
          touchId.current = null
          resetMovement()
        }
      }
    }

    window.addEventListener('touchmove', handleMove, { passive: false })
    window.addEventListener('touchend', handleEnd, { passive: false })
    window.addEventListener('touchcancel', handleEnd, { passive: false })

    return () => {
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('touchend', handleEnd)
      window.removeEventListener('touchcancel', handleEnd)
      resetTouchInput()
    }
  }, [resetMovement, resetTouchInput, updateStick])

  return (
    <div className="touch-controls">
      <div
        ref={zoneRef}
        className="touch-joystick"
        onTouchStart={handleJoystickStart}
        aria-label="Move"
      >
        <div className="touch-joystick-base" />
        <div
          className="touch-joystick-stick"
          style={{ transform: `translate(${stick.x}px, ${stick.y}px)` }}
        />
      </div>

      <button
        type="button"
        className={`touch-jump ${jumpActive ? 'active' : ''}`}
        onTouchStart={handleJumpStart}
        onTouchEnd={handleJumpEnd}
        onTouchCancel={handleJumpEnd}
        aria-label="Jump"
      >
        Jump
      </button>
    </div>
  )
}
