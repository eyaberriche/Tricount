import {Entity, model, property, hasMany} from '@loopback/repository';
import {User} from './user.model';
import {TricountUser} from './tricount-user.model';
import { Depense } from './depense.model';

@model()
export class Tricount extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'number',
    default: 0,
  })
  total?: number;
  @hasMany(() => Depense, {keyTo: 'tricount'})
  depenses: Depense[];

  @hasMany(() => User, {through: {model: () => TricountUser, keyFrom: 'tricount', keyTo: 'user'}})
  users: User[];

  constructor(data?: Partial<Tricount>) {
    super(data);
  }
}

export interface TricountRelations {
  // describe navigational properties here
}

export type TricountWithRelations = Tricount & TricountRelations;
