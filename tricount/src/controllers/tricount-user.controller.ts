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
Tricount,
TricountUser,
User,
} from '../models';
import {TricountRepository} from '../repositories';

export class TricountUserController {
  constructor(
    @repository(TricountRepository) protected tricountRepository: TricountRepository,
  ) { }

  @get('/tricounts/{id}/users', {
    responses: {
      '200': {
        description: 'Array of Tricount has many User through TricountUser',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<User>,
  ): Promise<User[]> {
    return this.tricountRepository.users(id).find(filter);
  }

  @post('/tricounts/{id}/users', {
    responses: {
      '200': {
        description: 'create a User model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Tricount.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUserInTricount',
            exclude: ['id'],
          }),
        },
      },
    }) user: Omit<User, 'id'>,
  ): Promise<User> {
    return this.tricountRepository.users(id).create(user);
  }

  @patch('/tricounts/{id}/users', {
    responses: {
      '200': {
        description: 'Tricount.User PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: Partial<User>,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.tricountRepository.users(id).patch(user, where);
  }

  @del('/tricounts/{id}/users', {
    responses: {
      '200': {
        description: 'Tricount.User DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.tricountRepository.users(id).delete(where);
  }
}
