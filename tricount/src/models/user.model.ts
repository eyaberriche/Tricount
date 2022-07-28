import {Entity, model, property, hasMany} from '@loopback/repository';
import {Depense} from './depense.model';
import {Tricount} from './tricount.model';
import {TricountUser} from './tricount-user.model';

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
  })
  email: string;

  @property({
    type: 'string',
  })
  lastname: string;

  @property({
    type: 'string',
  })
  firstname: string;

  @property({
    type: 'string',
  })
  password: string;

  @hasMany(() => Depense, {keyTo: 'user'})
  depenses: Depense[];

  @hasMany(() => Tricount, {through: {model: () => TricountUser, keyFrom: 'user', keyTo: 'tricount'}})
  tricounts: Tricount[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
