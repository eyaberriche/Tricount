
import {authenticate, TokenService} from '@loopback/authentication';
import {
  Credentials,
  MyUserService,
  TokenServiceBindings, UserRepository,
  UserServiceBindings
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {Filter, FilterExcludingWhere, model, property, repository} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  requestBody,
  response,
  SchemaObject
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import * as _ from 'lodash';
import {User} from '../models';
import {UserrRepository} from '../repositories';



@model()
export class NewUserRequest extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
    @repository(UserrRepository) protected userrRepository: UserrRepository,
  ) {}

   

  @get('/users')
  @response(200, {
    description: 'Array of Userr model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userrRepository.find(filter);
  }


  @get('/user/{id}')
  @response(200, {
    description: 'Userr model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    return this.userrRepository.findById(id, filter);
  }



//@authenticate('jwt')
@patch('/account/{id}')
@response(200, {
  description: 'patch success',
  content: {
    'application/json': {
      schema: getModelSchemaRef(User, {includeRelations: true}),
    },
  },
})
async updateById(
@param.path.string('id') id: string,
@requestBody({
  content: {
    'application/json': {
      schema: getModelSchemaRef(User ,{partial: true}),
    },
  },
})
user: User,
): Promise<User> {
//

  const password = await hash(user.password, await genSalt());
  await this.userrRepository.updateById( id , _.omit(user, 'password'));
  const savedUser = await this.userrRepository.findById(id);

  await this.userRepository.userCredentials(savedUser.id).create({password});

  return savedUser;
 

}


  @post('/user/create')
  @response(200, {
    description: 'ajout d un User ',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody(CredentialsRequestBody)
    User: Omit<User, 'id'>,
  ): Promise<User> {
    return this.userrRepository.create(User);
  }


  @del('/user/{id}')
  @response(204, {
    description: 'Userr DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userrRepository.deleteById(id);
  }


  @post('/user/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);
    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);
    return {token};
  }

  @authenticate('jwt')
  @get('user/current', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
 async current(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ):  Promise<User> {
    return this.userrRepository.findById(currentUserProfile.id)}

  @post('user/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,

            },
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
            exclude: ['id']
          }),
        },
      },
    })
    requser: NewUserRequest,
  ): Promise<User> {
    const password = await hash(requser.password, await genSalt());
    const savedUser = await this.userrRepository.create(
      _.omit(requser, 'password'),
    );

    await this.userRepository.userCredentials(savedUser.id).create({password});

    return savedUser;
  }
}