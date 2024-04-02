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
        const script = `
<script>
  document.addEventListener("DOMContentLoaded", function() {
    if (!window.location.hash && window.location.pathname !== '/') {
      window.history.replaceState(null, null, '/#' + window.location.pathname + window.location.search);
      window.location.reload();
    }
  });
</script>
`;
        const newData = data.replace('</body>', `${script}</body>`);

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
