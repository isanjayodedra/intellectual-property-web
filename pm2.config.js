module.exports = {
  apps: [
    {
      name: 'ip-web',
      script: './src/index.js',
      cwd: './',
      namespace: 'ip-web',
      watch: false,
      exec_mode: 'fork',
      env: { NODE_ENV: 'development', PORT: 5001 }
    }
  ]
};