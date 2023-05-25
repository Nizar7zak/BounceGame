import  { create } from "zustand";

export default create((set) => {
    return {
        blockCount: 7,
        phase: 'ready',
        start: () => {
            set((state) => {
                if(state === 'ready'){
                    return { phase: 'playing' }
                }
                return {}
            })
        },
        restart: () => {
            set((state) => {
                if(state === 'playing' || state === 'ended') {
                    return { phase: 'ready' }
                }
                return {}
            })
        },
        end: () => {
            set((state) => {
                if(state === 'playing') {
                    return { phase: 'ended' }
                }
                return {}
            })
        },


    }
})