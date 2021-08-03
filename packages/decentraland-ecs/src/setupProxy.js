const path = require('path')
const fs = require('fs')

module.exports = function (dcl, app, express) {
  const dclKernelPath = path.dirname(require.resolve('decentraland-kernel/package.json', {paths: [dcl.getWorkingDir()]}));
  const dclKernelDefaultProfilePath = path.resolve(dclKernelPath, 'default-profile');
  const dclKernelImagesDecentralandConnect = path.resolve(dclKernelPath, 'images', 'decentraland-connect');
  const dclKernelLoaderPath = path.resolve(dclKernelPath, 'loader');
  const dclUnityRenderer = path.dirname(require.resolve('@dcl/unity-renderer/package.json', {paths: [dcl.getWorkingDir()]}));

  const routeMappingPath = {
      '/': {
          path: path.resolve(dclKernelPath, 'preview.html'), 
          type: 'text/html'
      },
      '/favicon.ico': {
          path: path.resolve(dclKernelPath, 'favicon.ico'), 
          type: 'text/html'
      },
      '/@/artifacts/preview.js': {
          path: path.resolve(dclKernelPath, 'dist', 'preview.js'), 
          type: 'text/javascript'
      },
  };
  
  for (const route in routeMappingPath){
      app.get(route, async (req, res) => {
          res.setHeader('Content-Type', routeMappingPath[route].type);
          const contentFile = fs.readFileSync(routeMappingPath[route].path);
          res.send(contentFile);
      });
  }
  
  createStaticRoutes(app, '/images/decentraland-connect/*', dclKernelImagesDecentralandConnect);
  createStaticRoutes(app, '/@/artifacts/unity-renderer/*', dclUnityRenderer);
  createStaticRoutes(app, '/@/artifacts/loader/*', dclKernelLoaderPath);
  createStaticRoutes(app, '/default-profile/*', dclKernelDefaultProfilePath);
}

function createStaticRoutes(app, route, localFolder) {
    app.use(route, (req, res, next) => {
      const options = {
        root: localFolder,
        dotfiles: 'deny',
        maxAge: 1,
        cacheControl: false,
        lastModified: true,
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true,
          etag: JSON.stringify(Date.now().toString()),
          'cache-control': 'no-cache,private,max-age=1'
        }
      }
  
      const fileName = req.params[0]
  
      res.sendFile(fileName, options, (err) => {
        if (err) {
          next(err)
        } else {
          console.log(`Sending ${localFolder}/${fileName}`)
        }
      })
    })
  }