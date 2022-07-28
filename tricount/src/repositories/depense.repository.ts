import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Depense, DepenseRelations} from '../models';

export class DepenseRepository extends DefaultCrudRepository<
  Depense,
  typeof Depense.prototype.id,
  DepenseRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Depense, dataSource);
  }
}
 