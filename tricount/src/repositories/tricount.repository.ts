import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Tricount, TricountRelations, User, TricountUser} from '../models';
import {TricountUserRepository} from './tricount-user.repository';
import { UserrRepository } from './user.repository';


export class TricountRepository extends DefaultCrudRepository<
  Tricount,
  typeof Tricount.prototype.id,
  TricountRelations
> {

  public readonly users: HasManyThroughRepositoryFactory<User, typeof User.prototype.id,
          TricountUser,
          typeof Tricount.prototype.id
        >;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('TricountUserRepository') protected tricountUserRepositoryGetter: Getter<TricountUserRepository>, @repository.getter('UserrRepository') protected userRepositoryGetter: Getter<UserrRepository>,
  ) {
    super(Tricount, dataSource);
    this.users = this.createHasManyThroughRepositoryFactoryFor('users', userRepositoryGetter, tricountUserRepositoryGetter,);
    this.registerInclusionResolver('users', this.users.inclusionResolver);
  }

}
