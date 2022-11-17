import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import InjectProjectInfoVitePlugin from 'inject-project-info/vite';

console.log(process.argv);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    InjectProjectInfoVitePlugin({
      timeout: 1000,
      isLog: process.argv.includes('production'),
      // isLogLastCommitMessage: true,
      extraLogInfo: [
        {
          label: 'Version',
          value: require('./package.json').version,
        },
        {
          label: '其他想打印的信息',
          value: '需要打印什么就打印什么',
        },
      ],
    }),
  ],
});
