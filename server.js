const { execSync } = require('child_process');
const port = process.env.PORT || 3456;
execSync(`npx next dev -p ${port}`, { stdio: 'inherit', cwd: '/Users/mukundagarwal/GladiatorAI' });
