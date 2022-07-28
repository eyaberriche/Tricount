import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {User, UserRelations, Depense, Tricount, TricountUser} from '../models';
import {DepenseRepository} from './depense.repository';
import {TricountUserRepository} from './tricount-user.repository';
import {TricountRepository} from './tricount.repository';

export class UserrRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly depenses: HasManyRepositoryFactory<Depense, typeof User.prototype.id>;

  public readonly tricounts: HasManyThroughRepositoryFactory<Tricount, typeof Tricount.prototype.id,
          TricountUser,
          typeof User.prototype.id
        >;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('DepenseRepository') protected depenseRepositoryGetter: Getter<DepenseRepository>, @repository.getter('TricountUserRepository') protected tricountUserRepositoryGetter: Getter<TricountUserRepository>, @repository.getter('TricountRepository') protected tricountRepositoryGetter: Getter<TricountRepository>,
  ) {
    super(User, dataSource);
    this.tricounts = this.createHasManyThroughRepositoryFactoryFor('tricounts', tricountRepositoryGetter, tricountUserRepositoryGetter,);
    this.registerInclusionResolver('tricounts', this.tricounts.inclusionResolver);
    this.depenses = this.createHasManyRepositoryFactoryFor('depenses', depenseRepositoryGetter,);
    this.registerInclusionResolver('depenses', this.depenses.inclusionResolver);
  }
}
