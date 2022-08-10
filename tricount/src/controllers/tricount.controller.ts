import { authenticate } from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema, repository
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, requestBody,
  response
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {User, Tricount, TricountUser} from '../models';
import {DepenseRepository,TricountRepository, UserrRepository , TricountUserRepository} from '../repositories';

export class TricountController {
  constructor(
    @repository(TricountRepository)
    public tricountRepository : TricountRepository,
    @repository(UserrRepository) protected userrRepository: UserrRepository,
    @repository(DepenseRepository) protected depenseRepository: DepenseRepository ,
    @repository(TricountUserRepository) protected tricountUserRepository: TricountUserRepository ,
    
  ) {}  

// ajouter un tricount à un utilisateur
  @authenticate('jwt')
  @post('/tricount/create')
  @response(200, {
    description: 'ajout d un tricount ',
    content: {'application/json': {schema: getModelSchemaRef(Tricount)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tricount, {
            title: 'NewTricount',
            exclude: ['id'],
          }),
        },
      },
    })
    tricount: Omit<Tricount, 'id'>,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
   // @param.filter(Tricount) filter?: Filter<Tricount>,
  ):Promise<Tricount> {
    const us = currentUserProfile.id
    const tr = await this.tricountRepository.create(tricount);
    const truser = {userId : us , tricountId: tr.id}
    this.tricountUserRepository.create(truser)
    return tr;
  }
 // tricount by user
  @authenticate('jwt')
  @get('/tricounts')
  @response(200, {
    description: 'afficher les tricounts dun user',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Tricount, {includeRelations: false}),
        },
      },
    },
  })
  async findtricountsbyUserId(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<Tricount[]> {
    const identites: string[] = []
    const us = currentUserProfile.id
    const trus = await this.tricountUserRepository.find({where : {userId : us}})
    trus.map(tu => {identites.push(tu.tricountId)})
    return this.tricountRepository.find({where: { id: { inq: identites}}})
  }
  

// afficher un tricount by id
//@authenticate('jwt')
  @get('/tricount/{id}')
  @response(200, {
    description: 'get tricount by id',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Tricount, {includeRelations: true}),
      },
    },
  })
  async findById(

    @param.path.string('id') id: string,

  ): Promise<Tricount> {
    return this.tricountRepository.findById(id);
  }

// modifier un tricount by id
//@authenticate('jwt')
  @patch('/tricount/{id}')
    @response(200, {
      description: 'patch success',
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tricount, {includeRelations: true}),
        },
      },
    })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tricount ,{partial: true}),
        },
      },
    })
    tricount: Tricount,
  ): Promise<Tricount> {
    await this.tricountRepository.updateById(id, tricount);
    return this.tricountRepository.findById(id);
  }
// supprimer un tricount by id (ytfskh tricount lzm ytfskho depenses w personnes)
//@authenticate('jwt')
  @del('/tricount/{id}')
  @response(204, {
    description: 'Tricount deleted successfuly',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    const identites: string[] = [] //id mta users tb3in tricount param id
    const trus = await this.tricountUserRepository.find({where : {tricountId : id}})
    trus.map(tu => {identites.push(tu.userId)})
    await this.tricountUserRepository.deleteAll({tricountId : id})
    await this.depenseRepository.deleteAll({tricount : id})
    await this.userrRepository.deleteAll({ id: { inq: identites}})
    await this.tricountRepository.deleteById(id);
  }


  @get('/balances/{id}')
  @response(200, {
    description: 'get balances by tricount id',

  })
  async getbalances(
    @param.path.string('id') id: string,

  ): Promise<string> {
    let i = 0;
    let j = 0;
    let message = '' ;
    const plusliste: User[] = [];
    const moinsliste: User[] = [];
    const identites: string[] = [] //id mta users tb3in tricount param id
    const trus = await this.tricountUserRepository.find({where : {tricountId : id}})
    trus.map(tu => {identites.push(tu.userId)})
    const users  = await this.userrRepository.find({ where : {id: { inq: identites}}})
    var total = 0
    users.map(user => {
      total += user.somme })
      console.log("total"+ total)
    const part = total/users.length
    users.map(person => {
     if (person.somme > part)
     {plusliste.push(person)}
     else if (person.somme < part)
     {moinsliste.push(person)}
     else 
     message = `${person.firstname} ${person.lastname} donne le montant exacte`
    })
    // console.log("message: ", message)
    // console.log("moinsliste: ",moinsliste)
    console.log("plusliste: ",plusliste)
   while (i < moinsliste.length) {
  const debt = Math.min( part - moinsliste[i].somme, plusliste[j].somme - part);
  
  moinsliste[i].somme += debt;
  plusliste[j].somme -= debt;
 
  message = message +'\n'+`  ${moinsliste[i].firstname} donne à  ${plusliste[j].firstname} ${debt}`;

  if (moinsliste[i].somme === part) {
    i++;
  }

  if (plusliste[j].somme === part) {
    j++;
  }}
    return message
  }

}
