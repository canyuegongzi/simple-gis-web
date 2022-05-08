// @ts-ignore
import { defineConfig } from 'vite';
import cesium from 'vite-plugin-cesium';
// @ts-ignore
import AutoImport from 'unplugin-auto-import/dist/vite'
// @ts-ignore
import Components from 'unplugin-vue-components/dist/vite'
// @ts-ignore
import { ElementPlusResolver } from 'unplugin-vue-components/dist/resolvers.js'
// @ts-ignore
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
      vue(),
      cesium(),
    /*AutoImport({
      resolvers: [ ElementPlusResolver() ],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),*/
  ],
    resolve: {
        alias: {
            '@map': './src/map'
        }
    }
})
