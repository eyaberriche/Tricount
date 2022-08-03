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
  Tricount,
} from '../models';
import {TricountUserRepository} from '../repositories';

export class TricountUserTricountController {
  constructor(
    @repository(TricountUserRepository)
    public tricountUserRepository: TricountUserRepository,
  ) { }

  @get('/tricount-users/{id}/tricount', {
    responses: {
      '200': {
        description: 'Tricount belonging to TricountUser',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Tricount)},
          },
        },
      },
    },
  })
  async getTricount(
    @param.path.string('id') id: typeof TricountUser.prototype.id,
  ): Promise<Tricount> {
    return this.tricountUserRepository.tricount(id);
  }
}
