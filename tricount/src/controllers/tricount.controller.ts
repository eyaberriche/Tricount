// Uncomment these imports to begin using these cool features!

import { repository } from "@loopback/repository";
import { getModelSchemaRef, post, requestBody, response } from "@loopback/rest";
import { Tricount } from "../models";
import { TricountRepository } from "../repositories";

// import {inject} from '@loopback/core';


export class TricountController {
  constructor(
    @repository(TricountRepository)
    public tricountRepository : TricountRepository,
  ) {}




// ajouter un tricount à un utilisateur
  //@authenticate('jwt')
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
  ): Promise<Tricount> {
    return this.tricountRepository.create(tricount);
  }
}
