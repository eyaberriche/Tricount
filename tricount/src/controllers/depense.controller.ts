import {authenticate} from '@loopback/authentication';
import { inject } from '@loopback/core';
import {
  FilterExcludingWhere,
  repository
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import { SecurityBindings, UserProfile } from '@loopback/security';
import {Depense} from '../models';
import {DepenseRepository, UserrRepository} from '../repositories';

import {TricountRepository} from '../repositories';

export class DepenseController {
  constructor(
    @repository(DepenseRepository)
    public depenseRepository : DepenseRepository,
    
    @repository(UserrRepository)
    public userrRepository : UserrRepository,
  ) {}

  //depense d'un user with param id
  @authenticate('jwt')
  @get('/depensesUser/{id}')
  @response(200, {
    description: 'Array of Depense model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Depense, {includeRelations: true}),
        },
      },
    },
  })
  async finddepenseuser(
    @param.path.string('id') id: string
  ): Promise<Depense[]> {
    return this.depenseRepository.find({where: {user: id}});
  }

  //depenses d'un user connecté
  @authenticate('jwt')
  @get('/depenses')
  @response(200, {
    description: 'Array of Depense model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Depense, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<Depense[]> {

    return this.depenseRepository.find({where: {user: currentUserProfile.id}});
  }
//get depense by id
  @authenticate('jwt')
  @get('/depense/{id}')
  @response(200, {
    description: 'Depense model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Depense, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Depense, {exclude: 'where'}) filter?: FilterExcludingWhere<Depense>
  ): Promise<Depense> {
    return this.depenseRepository.findById(id, filter);
  }

  @patch('/depense/{id}')
  @response(200, {
    description: 'patch success',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Depense, {includeRelations: true}),
      },
    },
  })
  async updateById(
  @param.path.string('id') id: string,
  @requestBody({
    content: {
      'application/json': {
        schema: getModelSchemaRef(Depense, {partial: true}),
      },
    },
  }) depense: Depense,

): Promise<void> {
  const first = await this.depenseRepository.findById(id)

  const user = await this.userrRepository.findById(first.user)
  const somme = (user.somme - first.price) + depense.price;
  await this.userrRepository.updateById(user.id , {somme: somme});
  await this.depenseRepository.updateById(id, depense);
  //return this.depenseRepository.findById(id);

}

@post('/depense/new')
@response(200, {
  description: 'post success',
  content: {
    'application/json': {
      schema: getModelSchemaRef(Depense, {includeRelations: true}),
      exclude: ['id'],
    },
  },
})
async createe(

@requestBody({
  content: {
    'application/json': {
      schema: getModelSchemaRef(Depense, {partial: true}),
    },
  },
}) depense:Omit<Depense, 'id'>,

): Promise<Depense> {
  const user = await this.userrRepository.findById(depense.user)
  const somme = user.somme + depense.price
  await  this.userrRepository.updateById(user.id , {somme: somme});
   return this.depenseRepository.create(depense);
//return this.depenseRepository.findById(id);

}

  //@authenticate('jwt')
  @del('/depense/{id}')
  @response(204, {
    description: 'Depense DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
   const dep =  await this.depenseRepository.findById(id);
   const pers = await this.userrRepository.findById(dep.user)
   const somme = pers.somme - dep.price;
   await this.userrRepository.updateById(pers.id , {somme: somme});
   await this.depenseRepository.deleteById(id);
  } 
}
