import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {TricountUser, TricountUserRelations} from '../models';

export class TricountUserRepository extends DefaultCrudRepository<
  TricountUser,
  typeof TricountUser.prototype.id,
  TricountUserRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(TricountUser, dataSource);
  }
}
