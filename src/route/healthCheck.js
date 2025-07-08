// src/route/healthCheck.js

const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /healthz:
 *   get:
 *     summary: Health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 service:
 *                   type: string
 *                 status:
 *                   type: string
 *                   example: 'UP'
 */
router.get('/healthz', (req, res) => {
  res.status(200).json({
    service: 'IP Web API', // replace with real service name
    status: 'UP',
  });
});

module.exports = router;