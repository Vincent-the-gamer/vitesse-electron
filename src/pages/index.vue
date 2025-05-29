<script setup lang="ts" generic="T extends any, O extends any">
import packageJson from "../../package.json"

const { vite: viteVersion, electron: electronVersion } = packageJson.devDependencies

defineOptions({
  name: 'IndexPage',
})

const name = ref('')

const router = useRouter()
function go() {
  if (name.value)
    router.push(`/hi/${encodeURIComponent(name.value)}`)
}
</script>

<template>
  <div>
    <div i-carbon-campsite inline-block text-4xl />
    <div i-ion:logo-electron inline-block text-4xl />
    <p>
      <a rel="noreferrer" href="https://github.com/Vincent-the-gamer/vitesse-electron" target="_blank">
        Vitesse Electron
      </a>
    </p>
    <p>
      <em text-sm op75>Vite + Electron starter template.</em>
    </p>
    <h3 op75 m-1>Vite version: {{ viteVersion }}</h3>
    <h3 op75 m-1>Electron version: {{ electronVersion }}</h3>

    <div py-4 />

    <TheInput
      v-model="name"
      placeholder="What's your name?"
      autocomplete="false"
      @keydown.enter="go"
    />

    <div>
      <button
        class="m-3 text-sm btn"
        :disabled="!name"
        @click="go"
      >
        Go
      </button>
    </div>
  </div>
</template>
