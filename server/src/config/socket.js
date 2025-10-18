const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// Store active connections
const activeConnections = new Map();

/**
 * Initialize Socket.IO with authentication and event handlers
 * @param {Server} io - Socket.IO server instance
 */
const initializeSocket = (io) => {
  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`🔌 User connected: ${socket.userId}`);

    // Store connection
    activeConnections.set(socket.userId, socket.id);

    // Join user-specific room
    socket.join(`user:${socket.userId}`);

    // Join role-specific room
    if (socket.userRole === 'admin') {
      socket.join('admin');
    } else if (socket.userRole === 'rider') {
      socket.join('rider');
    }

    // Handle rider location updates
    socket.on('rider:location', (data) => {
      if (socket.userRole === 'rider') {
        // Broadcast location to order-specific room
        socket.to(`order:${data.orderId}`).emit('order:location', {
          coordinates: data.coordinates,
          timestamp: new Date(),
        });
      }
    });

    // Handle rider joining order room
    socket.on('rider:join-order', (orderId) => {
      if (socket.userRole === 'rider') {
        socket.join(`order:${orderId}`);
        logger.info(`Rider ${socket.userId} joined order ${orderId}`);
      }
    });

    // Handle customer joining order room
    socket.on('customer:join-order', (orderId) => {
      socket.join(`order:${orderId}`);
      logger.info(`Customer ${socket.userId} joined order ${orderId}`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      logger.info(`🔌 User disconnected: ${socket.userId}`);
      activeConnections.delete(socket.userId);
    });
  });

  // Set io instance globally for use in controllers
  global.io = io;
};

/**
 * Emit event to specific user
 * @param {string} userId - User ID
 * @param {string} event - Event name
 * @param {Object} data - Data to send
 */
const emitToUser = (userId, event, data) => {
  if (global.io) {
    global.io.to(`user:${userId}`).emit(event, data);
  }
};

/**
 * Emit event to order room
 * @param {string} orderId - Order ID
 * @param {string} event - Event name
 * @param {Object} data - Data to send
 */
const emitToOrder = (orderId, event, data) => {
  if (global.io) {
    global.io.to(`order:${orderId}`).emit(event, data);
  }
};

/**
 * Emit event to all admins
 * @param {string} event - Event name
 * @param {Object} data - Data to send
 */
const emitToAdmins = (event, data) => {
  if (global.io) {
    global.io.to('admin').emit(event, data);
  }
};

/**
 * Emit event to all riders
 * @param {string} event - Event name
 * @param {Object} data - Data to send
 */
const emitToRiders = (event, data) => {
  if (global.io) {
    global.io.to('rider').emit(event, data);
  }
};

module.exports = {
  initializeSocket,
  emitToUser,
  emitToOrder,
  emitToAdmins,
  emitToRiders,
};
