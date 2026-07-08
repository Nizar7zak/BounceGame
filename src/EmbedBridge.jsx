import { useEffect } from 'react'
import useGames from './stores/useGames'

function isEmbedMode() {
    return new URLSearchParams(window.location.search).get('embed') === '1'
}

function focusGameSurface() {
    window.focus()
    document.body.tabIndex = -1
    document.body.focus({ preventScroll: true })

    const canvas = document.querySelector('canvas')
    if (canvas) {
        canvas.tabIndex = 0
        canvas.focus({ preventScroll: true })
    }
}

function startEmbeddedRun() {
    useGames.getState().start()
    focusGameSurface()
}

export default function EmbedBridge() {
    useEffect(() => {
        const onMessage = (event) => {
            if (event.data?.type === 'bouncegame:start') {
                startEmbeddedRun()
            }
        }

        window.addEventListener('message', onMessage)

        if (isEmbedMode()) {
            const id = window.setTimeout(startEmbeddedRun, 150)
            return () => {
                window.clearTimeout(id)
                window.removeEventListener('message', onMessage)
            }
        }

        return () => window.removeEventListener('message', onMessage)
    }, [])

    return null
}
