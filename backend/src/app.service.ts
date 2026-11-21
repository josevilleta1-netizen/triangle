import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'UP',
      system: 'TRIANGLE ERP / POS',
      version: '0.1.0-alpha.1',
      branch: 'Sede Chapinero',
      timestamp: new Date().toISOString(),
    };
  }
}
