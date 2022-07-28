import {authenticate} from '@loopback/authentication';
import {
  FilterExcludingWhere,
  repository
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {Depense} from '../models';
import {DepenseRepository} from '../repositories';

import {TricountRepository} from '../repositories';

export class DepenseController {
  constructor(
    @repository(DepenseRepository)
    public depenseRepository : DepenseRepository,
    @repository(TricountRepository)
    public tricountRepository :TricountRepository,
  ) {}
  //@authenticate('jwt')
/*   @post('/depenses')
  @response(200, {
    description: 'Depense model instance',
    content: {'application/json': {schema: getModelSchemaRef(Depense)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Depense, {
            title: 'NewDepense',
            exclude: ['id'],
          }),
        },
      },
    })
    depense: Omit<Depense, 'id'>,
  ): Promise<Depense> {

   const pers = await this.personRepository.findById(depense.person)
   const tricount = await this.tricountRepository.findById(pers.tricount)
   const somme = pers.somme + depense.price
   const total = depense.price + tricount.total
   await  this.personRepository.updateById(pers.id , {somme: somme});
   await  this.tricountRepository.updateById(tricount.id , {total: total});
   return this.depenseRepository.create(depense);
  }
  @authenticate('jwt')
  @get('/depenses/{id}')
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
    @param.path.string('id') id: string
  ): Promise<Depense[]> {
    return this.depenseRepository.find({where: {person: id}});
  }
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

  const pers = await this.personRepository.findById(first.person)
  const tricount = await this.tricountRepository.findById(pers.tricount)
  const somme = (pers.somme - first.price) + depense.price;
  const total = (tricount.total- first.price) + depense.price;
  await this.personRepository.updateById(pers.id , {somme: somme});
  await this.tricountRepository.updateById(tricount.id , {total: total});
  await this.depenseRepository.updateById(id, depense);
  //return this.depenseRepository.findById(id);

}

@put('/depenses/{id}')
@response(204, {
  description: 'Depense PUT success',
})
async replaceById(
  @param.path.string('id') id: string,
  @requestBody() depense: Depense,
): Promise<void> {
  const first = await this.depenseRepository.findById(id)
  const pers = await this.personRepository.findById(depense.person)
  const tricount = await this.tricountRepository.findById(pers.tricount)
  const somme = (pers.somme - first.price) + depense.price;
  const total = (tricount.total- first.price) + depense.price;
  await this.personRepository.updateById(pers.id , {somme: somme});
  await this.tricountRepository.updateById(tricount.id , {total: total});
  await this.depenseRepository.replaceById(id, depense);

}

  //@authenticate('jwt')
  @del('/depense/{id}')
  @response(204, {
    description: 'Depense DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
   const dep =  await this.depenseRepository.findById(id);
   const pers = await this.personRepository.findById(dep.person)
   const tricount = await this.tricountRepository.findById(pers.tricount)
   const somme = pers.somme - dep.price;
   const total = (tricount.total- dep.price)
   await this.personRepository.updateById(pers.id , {somme: somme});
   await this.tricountRepository.updateById(tricount.id , {total: total});
   await this.depenseRepository.deleteById(id);
  } */
}
