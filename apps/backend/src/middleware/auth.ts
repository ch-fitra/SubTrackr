import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any;
  }
}

export function setupAuth(fastify: FastifyInstance) {
  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const token = request.cookies.token || request.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return reply.status(401).send({ message: 'Unauthorized' });
      }

      const decoded = fastify.jwt.verify(token);
      request.user = decoded;
    } catch (err) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }
  });
}
