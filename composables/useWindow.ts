export default function() {
    const isMaximized = ref(false)
    useIpcEvent<[{
        isMaximized: boolean
    }]>("app-window-change", (event, data) => {
    isMaximized.value = data.isMaximized
    })
    return {
        isMaximized
    }
}