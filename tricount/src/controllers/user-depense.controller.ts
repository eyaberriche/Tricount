/*import {
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
  Depense,
} from '../models';
import {UserRepository} from '../repositories';

export class UserDepenseController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/depenses', {
    responses: {
      '200': {
        description: 'Array of User has many Depense',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Depense)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Depense>,
  ): Promise<Depense[]> {
    return this.userRepository.depenses(id).find(filter);
  }

  @post('/users/{id}/depenses', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Depense)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Depense, {
            title: 'NewDepenseInUser',
            exclude: ['id'],
            optional: ['user']
          }),
        },
      },
    }) depense: Omit<Depense, 'id'>,
  ): Promise<Depense> {
    return this.userRepository.depenses(id).create(depense);
  }

  @patch('/users/{id}/depenses', {
    responses: {
      '200': {
        description: 'User.Depense PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Depense, {partial: true}),
        },
      },
    })
    depense: Partial<Depense>,
    @param.query.object('where', getWhereSchemaFor(Depense)) where?: Where<Depense>,
  ): Promise<Count> {
    return this.userRepository.depenses(id).patch(depense, where);
  }

  @del('/users/{id}/depenses', {
    responses: {
      '200': {
        description: 'User.Depense DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Depense)) where?: Where<Depense>,
  ): Promise<Count> {
    return this.userRepository.depenses(id).delete(where);
  }
}
*/