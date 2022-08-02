import {belongsTo, Entity, model, property} from '@loopback/repository';
import { Tricount } from './tricount.model';
import { User } from './user.model';

@model()
export class TricountUser extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

 
  @belongsTo(() => Tricount)
  tricount?: string;

  @belongsTo(() => User)
  user?: string;


  constructor(data?: Partial<TricountUser>) {
    super(data);
  }
}

export interface TricountUserRelations {
  // describe navigational properties here
}

export type TricountUserWithRelations = TricountUser & TricountUserRelations;
