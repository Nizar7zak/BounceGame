import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware"

function notifyParentComplete(state) {
    if (typeof window === 'undefined' || window.parent === window) return
    window.parent.postMessage({
        type: 'bouncegame:complete',
        elapsedMs: state.endTime - state.startTime,
        glassBroken: state.glassBroken,
        blockCount: state.blockCount,
    }, '*')
}

const useGames = create(subscribeWithSelector((set) => {
    return {
        blockCount: 10,
        blocksSeed: 0,
        startTime: 0,
        endTime: 0,

        phase: 'ready',
        hitShake: 0,
        glassBroken: 0,
        touchInput: {
            forward: false,
            backward: false,
            leftward: false,
            rightward: false,
            jump: false,
        },
        setTouchInput: (patch) => {
            set((state) => ({
                touchInput: { ...state.touchInput, ...patch },
            }))
        },
        resetTouchInput: () => {
            set({
                touchInput: {
                    forward: false,
                    backward: false,
                    leftward: false,
                    rightward: false,
                    jump: false,
                },
            })
        },
        punchShake: () => {
            set((state) => ({
                hitShake: Math.min(state.hitShake + 0.35, 1),
            }))
        },
        recordGlassBreak: () => {
            set((state) => ({
                glassBroken: state.glassBroken + 1,
            }))
        },
        start: () => {
            set((state) => {
                if (state.phase === 'ready') {
                    return { phase: 'playing', startTime: Date.now(), glassBroken: 0 }
                }
                return {}
            })
        },
        restart: () => {
            set((state) => {
                if (state.phase === 'playing' || state.phase === 'ended') {
                    return {
                        phase: 'ready',
                        blocksSeed: Math.random(),
                        glassBroken: 0,
                        touchInput: {
                            forward: false,
                            backward: false,
                            leftward: false,
                            rightward: false,
                            jump: false,
                        },
                    }
                }
                return {}
            })
        },
        end: () => {
            set((state) => {
                if (state.phase === 'playing') {
                    const next = { phase: 'ended', endTime: Date.now() }
                    notifyParentComplete({ ...state, ...next })
                    return next
                }
                return {}
            })
        },


    }
}
))

export default useGames