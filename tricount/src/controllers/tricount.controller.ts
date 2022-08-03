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
    const us = currentUserProfile.id
    return this.tricountRepository.find({  include: [
      {
        relation: 'persons',
        scope: {
          include: [{relation: 'depenses'}],
        },
      },
    ] });
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
   //const persons = await this.personRepository.find({where : { tricount : id}})
   //persons.map(async x => { await this.depenseRepository.deleteAll({person : x.id})
   //await this.personRepository.deleteById(x.id)})


   await this.tricountRepository.deleteById(id);
  }


  @get('/plusliste/{id}')
  @response(200, {
    description: 'get plus liste by tricount id',

  })
  async findplusliste(
    @param.path.string('id') id: string,

  ): Promise<User[]> {
    const tr = await this.tricountRepository.findById(id)
    const plusListe: User[] = [];

    //const persons = await this.personRepository.find({where : {tricount : tr.id}})
    /*persons.map(person => {
     if (person.somme > (tr.total/persons.length))
     {plusListe.push(person)}
    })*/
    return plusListe
  }
  @get('/moinsliste/{id}')
  @response(200, {
    description: 'get moinsliste by tricount id',

  })
  async findmoinsliste(
    @param.path.string('id') id: string,

  ): Promise<User[]> {
    const tr = await this.tricountRepository.findById(id)
    const plusListe: User[] = [];
    //const persons = await this.personRepository.find({where : {tricount : tr.id}})
   /* persons.map(person => {
     if (person.somme < (tr.total/persons.length))
     {plusListe.push(person)}
    })*/
     return plusListe;

  }
 /* @get('/balances/{id}')
  @response(200, {
    description: 'get balances by tricount id',

  })
  async getbalances(
    @param.path.string('id') id: string,

  ): Promise<string> {
    let i = 0;
    let j = 0;
    let message = '' ;
    const tr = await this.tricountRepository.findById(id)
    const plusliste: User[] = [];
    const moinsliste: User[] = [];
    const persons = await this.personRepository.find({where : {tricount : tr.id}})
    const part = tr.total/persons.length
    persons.map(person => {
     if (person.somme > (tr.total/persons.length))
     {plusliste.push(person)}
     else
     {moinsliste.push(person)}
    })
   while (i < moinsliste.length) {
  const debt = Math.min( part - moinsliste[i].somme, plusliste[j].somme - part);
  moinsliste[i].somme += debt;
  plusliste[j].somme -= debt;

  message = message +'\n'+`${plusliste[i].name} donne à ${moinsliste[j].name} ${debt}`;

  if (moinsliste[i].somme === part) {
    i++;
  }

  if (plusliste[j].somme === part) {
    j++;
  }}
    return message
  }*/

}
