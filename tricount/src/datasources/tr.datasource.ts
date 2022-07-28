import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'mongo',
  connector: 'mongodb',
  url: 'mongodb+srv://admin:admin@cluster0.zwjwo.mongodb.net/tr?retryWrites=true&w=majority',
  host: '',
  port: 0,
  user: '',
  password: '',
  database: 'tr',
  useNewUrlParser: true
};

@lifeCycleObserver('datasource')
export class MongoDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'tr';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.tr', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
