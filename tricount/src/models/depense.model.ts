import {Entity, model, property} from '@loopback/repository';

@model()
export class Depense extends Entity {
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
    type: 'number',
    default: 0,
  })
  price?: number;

  @property({
    type: 'string',
  })
  user?: string;

  constructor(data?: Partial<Depense>) {
    super(data);
  }
}

export interface DepenseRelations {
  // describe navigational properties here
}

export type DepenseWithRelations = Depense & DepenseRelations;
