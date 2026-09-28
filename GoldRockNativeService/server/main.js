import { createApplication } from './app.js';
const app=createApplication();
app.server.listen(app.config.port,app.config.host,()=>console.log(`GoldRock ${app.config.environment} preview: ${app.config.origin}`));
process.on('SIGINT',()=>{app.close();process.exit(0);});
process.on('SIGTERM',()=>{app.close();process.exit(0);});
