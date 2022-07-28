import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
  import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
User,
TricountUser,
Tricount,
} from '../models';
import {UserRepository} from '../repositories';

export class UserTricountController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/tricounts', {
    responses: {
      '200': {
        description: 'Array of User has many Tricount through TricountUser',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Tricount)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Tricount>,
  ): Promise<Tricount[]> {
    return this.userRepository.tricounts(id).find(filter);
  }

  @post('/users/{id}/tricounts', {
    responses: {
      '200': {
        description: 'create a Tricount model instance',
        content: {'application/json': {schema: getModelSchemaRef(Tricount)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tricount, {
            title: 'NewTricountInUser',
            exclude: ['id'],
          }),
        },
      },
    }) tricount: Omit<Tricount, 'id'>,
  ): Promise<Tricount> {
    return this.userRepository.tricounts(id).create(tricount);
  }

  @patch('/users/{id}/tricounts', {
    responses: {
      '200': {
        description: 'User.Tricount PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tricount, {partial: true}),
        },
      },
    })
    tricount: Partial<Tricount>,
    @param.query.object('where', getWhereSchemaFor(Tricount)) where?: Where<Tricount>,
  ): Promise<Count> {
    return this.userRepository.tricounts(id).patch(tricount, where);
  }

  @del('/users/{id}/tricounts', {
    responses: {
      '200': {
        description: 'User.Tricount DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Tricount)) where?: Where<Tricount>,
  ): Promise<Count> {
    return this.userRepository.tricounts(id).delete(where);
  }
}
