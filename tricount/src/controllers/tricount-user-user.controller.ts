import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  TricountUser,
  User,
} from '../models';
import {TricountUserRepository} from '../repositories';

export class TricountUserUserController {
  constructor(
    @repository(TricountUserRepository)
    public tricountUserRepository: TricountUserRepository,
  ) { }

  @get('/tricount-users/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to TricountUser',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof TricountUser.prototype.id,
  ): Promise<User> {
    return this.tricountUserRepository.user(id);
  }
}
