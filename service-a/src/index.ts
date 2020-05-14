import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';
import HapiHemera from 'hapi-hemera';

async function init() {

    const server: Hapi.Server = new Hapi.Server({
        host: 'service-a',
        port: process.env.PORT
    });

    await server.register({
        plugin: HapiHemera,
        options: {
            hemera: {
                name: 'service-a',
                logLevel: 'error',
                childLogger: true,
                tag: 'hemera-service-a'
            },
            nats: {
                url: process.env.NATS_URL,
                user: process.env.NATS_USER,
                pass: process.env.NATS_PW
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: async (request: any) => {

            const kladrId: any = request.query.kladrId;
            return request.hemera.act({
				topic: 'dadata',
				cmd: 'getInfo',
				id: kladrId
			});
            // return h.response(JSON.stringify({
            //     kladrId
            // })).type('application/json').code(200);

        },
        options: {
            validate: {
                query: Joi.object({
                    kladrId: Joi.string().pattern(/^[0-9]{13}$/)
                })
            }
        }
    });
    
    await server.start();
    return server;
}

init()
    .then(server => {
        console.log(`Server running at: ${server.info.uri}`);
    })
    .catch(error => {
        console.warn(`Server failed: ${JSON.stringify(error)}`);
    });