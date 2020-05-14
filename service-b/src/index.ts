import HemeraJoi from 'hemera-joi';
import * as Nats from 'nats';
import Hemera from 'nats-hemera';
import { Dadata } from './Dadata';

const nats = Nats.connect({
    url: process.env.NATS_URL,
    user: process.env.NATS_USER,
    pass: process.env.NATS_PW
});


const hemera: any = new Hemera(nats, {
    logLevel: 'error',
    childLogger: true,
    tag: 'hemera-service-b'
});

const api = new Dadata(process.env.API_TOKEN);

async function start() {

    hemera.use(HemeraJoi);

    await hemera.ready(() => {
        hemera.add(
            {
                topic: 'dadata',
                cmd: 'getInfo',
                id: hemera.joi.string().length(13)
            },
            async function (this: Hemera<Hemera.ServerRequest, Hemera.ServerResponse>,
				request: Hemera.ServerPattern) {
                return await api.findAddress(request.id);
            }
        );
    });
}

start();