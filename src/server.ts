import app  from './app';
import { PORT } from './utils/config';


export class Server {
    private readonly app;
  
    constructor() {
      this.app = app
    }
  
    async start() {
      try {
       
        this.app.listen(PORT, () => {
          console.log(`server is running on port ${PORT}`);
        });
        console.info('Server started successfully');
      } catch (error) {
        console.error(error);
        process.exit(1);
      }
    }
  }

const server = new Server();
server.start();