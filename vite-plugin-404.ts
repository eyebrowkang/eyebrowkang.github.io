import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';

const generate404Plugin = (): Plugin => {
  return {
    name: 'vite-plugin-generate-404',
    writeBundle() {
      const distPath = path.resolve(__dirname, 'dist');
      const indexPath = path.join(distPath, 'index.html');
      const notFoundPath = path.join(distPath, '404.html');

      fs.readFile(indexPath, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        // 生成一个重定向脚本，直接加载 index.html 的内容，而不改变 URL
        const redirectScript = `
<script>
  // 确保我们不在根路径时执行重定向
  if (window.location.pathname !== '/') {
    // 使用 fetch API 获取 index.html 的内容
    fetch('/index.html')
      .then(function(response) {
        return response.text();
      })
      .then(function(html) {
        document.open();
        document.write(html);
        document.close();
      });
  }
</script>
`;

        const newData = data.replace('</body>', `${redirectScript}</body>`);

        fs.writeFile(notFoundPath, newData, 'utf8', (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log('404.html has been generated!');
        });
      });
    },
  };
};

export default generate404Plugin;
