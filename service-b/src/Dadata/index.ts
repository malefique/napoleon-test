import https from 'https';
import type { DadataI } from '../types/DadataI.h';

export class Dadata implements DadataI {
    private options: any;

    constructor(token: any) {
        this.options = {
            method: 'POST',
            hostname: 'suggestions.dadata.ru',
            port: 443,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Token ${token}`,
            },
            path: '',
        };
    }

    private request(query: Object): Promise<any> {
        return new Promise((resolve, reject) => {
            const req = https.request(this.options, (res) => {
                if (res.statusCode !== 200) {
                    reject(new Error('Bad request'));
                }

                res.on('data', (d) => {
                    const parsedData = JSON.parse(d.toString());
                    const output = parsedData.suggestions.map((item: any) => {
                        return {
                            country_iso_code: item.data.country_iso_code,
                            region: item.data.region,
                            region_kladr_id: item.data.region_kladr_id,
                            region_iso_code: item.data.region_iso_code,
                            region_fias_id: item.data.region_fias_id
                        }
                    });
                    resolve(output);
                });
            });
            req.write(JSON.stringify({ query: query }));
            req.end();
        });
    }

    public findAddress(query: string) {
        this.options.path = '/suggestions/api/4_1/rs/findById/address';
        return this.request(query);
    }
}
