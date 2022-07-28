import {Entity, model, property} from '@loopback/repository';

@model()
export class TricountUser extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  tricount?: string;

  @property({
    type: 'string',
  })
  user?: string;

  constructor(data?: Partial<TricountUser>) {
    super(data);
  }
}

export interface TricountUserRelations {
  // describe navigational properties here
}

export type TricountUserWithRelations = TricountUser & TricountUserRelations;
