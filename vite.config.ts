import path from 'node:path'
import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import VueMacros from 'unplugin-vue-macros/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'
import Electron from 'vite-plugin-electron'
import ElectronRenderer from 'vite-plugin-electron-renderer'
import pkgJson from './package.json'

export default defineConfig({
  server: {
    host: 'localhost',
    port: 8080,
  },
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    VueMacros({
      defineOptions: false,
      defineModels: false,
      plugins: {
        vue: Vue({
          script: {
            propsDestructure: true,
            defineModel: true,
          },
        }),
      },
    }),
    VueRouter(),
    AutoImport({
      imports: [
        'vue',
        '@vueuse/core',
        VueRouterAutoImports,
        {
          // add any other imports you were relying on
          'vue-router/auto': ['useLink'],
        },
      ],
      dts: true,
      dirs: [
        './src/composables',
      ],
      vueTemplate: true,
    }),
    Components({
      dts: true,
    }),
    UnoCSS(),
    // Electron
    Electron([
      {
        entry: 'electron/main/index.ts',
        onstart(options) {
          if (process.env.VSCODE_DEBUG)

            console.log(/* For `.vscode/.debug.script.mjs` */'[startup] Electron App')
          else
            options.startup()
        },
        vite: {
          build: {
            sourcemap: false,
            minify: true,
            outDir: 'dist-electron/main',
            rollupOptions: {
              external: Object.keys('dependencies' in pkgJson ? pkgJson.dependencies : {}),
            },
          },
        },
      },
      {
        entry: 'electron/preload/index.ts',
        onstart(options) {
          options.reload()
        },
        vite: {
          build: {
            sourcemap: false,
            minify: true,
            outDir: 'dist-electron/preload',
            rollupOptions: {
              external: Object.keys('dependencies' in pkgJson ? pkgJson.dependencies : {}),
            },
          },
        },
      },
    ]),
    ElectronRenderer({
      resolve: {
        serialport: { type: 'cjs' },
        got: { type: 'esm' },
      },
    }),
  ],
})
