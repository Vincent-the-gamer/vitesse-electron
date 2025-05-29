<script setup lang="ts" generic="T extends any, O extends any">
import { ipcRenderer } from 'electron';
import packageJson from '../../package.json'
import useNotification from '~/hooks/useNotification';
import { sendMessageToMainProcess } from '~/utils/communication';

defineOptions({
  name: 'IndexPage',
})

const { vite: viteVersion, electron: electronVersion } = packageJson.devDependencies

const name = ref('')

const allowRunAtStartUp = ref<boolean>(false)

// Initialize allowRunAtStartUp
onMounted(() => {
  sendMessageToMainProcess({
    id: "get-login-config",
  })
})

ipcRenderer.on("get-login-config-reply", (_, openAtLogin: boolean) => {
  allowRunAtStartUp.value = openAtLogin
})

watch(() => allowRunAtStartUp.value, (newVal) => {
  sendMessageToMainProcess({
    id: "login-config",
    message: {
      openAtLogin: newVal
    }
  })
  useNotification({
    title: "Run At Login",
    body: "You have set run at login to: " + newVal
  })
})

const router = useRouter()

function go() {
  if (name.value)
    router.push(`/hi/${encodeURIComponent(name.value)}`)
}

function testNotification() {
  useNotification({
    title: "Test Notification",
    body: "Hello Vite + Electron"
  })
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
    <h3 op75 m-1>
      Vite version: {{ viteVersion }}
    </h3>
    <h3 op75 m-1>
      Electron version: {{ electronVersion }}
    </h3>

    <div py-4 />

    <TheInput v-model="name" placeholder="What's your name?" autocomplete="false" @keydown.enter="go" />

    <div>
      <button class="m-3 text-sm btn" :disabled="!name" @click="go">
        Go
      </button>
    </div>
    <div>
      <button btn m-3 text-sm @click="testNotification">Test Notification</button>
    </div>
    <div>
      Allow 「run at startup」: <input type="checkbox" v-model="allowRunAtStartUp"/>
    </div>

  </div>
</template>
