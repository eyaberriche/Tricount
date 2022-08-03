import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {TricountUser, TricountUserRelations, Tricount, User} from '../models';
import {TricountRepository} from './tricount.repository';
import {UserrRepository} from './user.repository';

export class TricountUserRepository extends DefaultCrudRepository<
  TricountUser,
  typeof TricountUser.prototype.id,
  TricountUserRelations
> {

  public readonly tricount: BelongsToAccessor<Tricount, typeof TricountUser.prototype.id>;

  public readonly user: BelongsToAccessor<User, typeof TricountUser.prototype.id>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('TricountRepository') protected tricountRepositoryGetter: Getter<TricountRepository>, @repository.getter('UserrRepository') protected userRepositoryGetter: Getter<UserrRepository>,
  ) {
    super(TricountUser, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.tricount = this.createBelongsToAccessorFor('tricount', tricountRepositoryGetter,);
    this.registerInclusionResolver('tricount', this.tricount.inclusionResolver);
  }
}
