import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware"

export default create(subscribeWithSelector((set) => {
    return {
        blockCount: 10,
        blocksSeed: 0,
        startTime: 0,
        endTime: 0,

        phase: 'ready',
        hitShake: 0,
        glassBroken: 0,
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
                    return { phase: 'ready', blocksSeed: Math.random(), glassBroken: 0 }
                }
                return {}
            })
        },
        end: () => {
            set((state) => {
                if (state.phase === 'playing') {
                    return { phase: 'ended', endTime: Date.now() }
                }
                return {}
            })
        },


    }
}
))