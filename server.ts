// server.ts - Next.js Standalone + Socket.IO
import { setupSocket } from '@/lib/socket';
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';

interface ServerConfig {
  port: number;
  hostname: string;
  clientOrigins: string[];
  isProd: boolean;
}

const config: ServerConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  hostname: process.env.HOSTNAME || 'localhost',
  clientOrigins: process.env.NEXT_PUBLIC_CLIENT_URL?.split(',') || ['http://localhost:3000'],
  isProd: process.env.NODE_ENV === 'production'
};

if (config.port < 1 || config.port > 65535) {
  console.error(`Invalid port number: ${config.port}`);
  process.exit(1);
}

// Custom server with Socket.IO integration
async function createCustomServer() {
  try {
    // Create Next.js app
    const nextApp = next({
      dev: !config.isProd,
      dir: process.cwd(),
      conf: config.isProd ? { distDir: './.next' } : undefined
    });

    await nextApp.prepare();
    const handle = nextApp.getRequestHandler();

    // Create HTTP server that will handle both Next.js and Socket.IO
    const server = createServer((req, res) => {
      // Skip socket.io requests from Next.js handler
      if (req.url?.startsWith('/api/socketio')) {
        return;
      }
      handle(req, res);
    });

    // Setup Socket.IO
    const io = new Server(server, {
      path: '/api/socketio',
      cors: {
        origin: config.clientOrigins,
        methods: ["GET", "POST"]
      }
    });

    setupSocket(io);

    // Start the server
    server.on('error', (err) => {
      console.error('Server runtime error:', err);
      process.exit(1);
    });

    server.listen(config.port, config.hostname, () => {
      console.log(`> Ready on http://${config.hostname}:${config.port}`);
      console.log(`> Socket.IO server running at ws://${config.hostname}:${config.port}/api/socketio`);
    });

  } catch (err) {
    console.error('Server startup error:', err);
    process.exit(1);
  }
}

// Start the server
createCustomServer();
