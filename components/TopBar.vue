<script setup lang="ts">
import type { AppWindowAction } from "~/types"

defineProps<{
  title: string
}>()


const { isMaximized } = useWindow()

async function windowAction(action: AppWindowAction["action"]) {
  const res = await window.ipcRenderer.invoke<boolean, [AppWindowAction]>("app-window", {
    action
  })
  if(action === "toggleMaximize") {
    isMaximized.value = res
  }
}

</script>
<template>
    <div class="titlebar flex items-center shadow-md">
        <div class="flex items-center justify-between h-10 px-3  w-full">
            <div class="flex-1 flex items-center">
                <h1 class="text-2xl font-bold font">{{ title }}</h1>
            </div>
            <div class="flex items-center justify-center no-drag">
                <Tooltip>
                    <TooltipTrigger :key="`${isMaximized}`">
                        <a href="#" @click.prevent="windowAction('toggleMaximize')">
                            <Icon v-if="isMaximized" name="tabler:arrows-diagonal-minimize-2" class="w-6 h-6 text-black" />
                            <Icon v-else name="tabler:arrows-diagonal" class="w-6 h-6 text-black" />
                        </a>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{{ isMaximized ? "Restore" : "Maximize" }}</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </div>
    </div>
</template>
<style scoped>
.titlebar {
    -webkit-user-select: none;
    -webkit-app-region: drag;
}
.font {
    font-family: JetBrains Mono, monospace;
}
.no-drag {
    -webkit-app-region: no-drag;
}
</style>