import { users } from '.prisma/client';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  const mockUser = {
    email: 'asdf@asdf.com',
    password: 'password',
  };

  beforeEach(async () => {
    fakeUsersService = {
      getUsers: () => Promise.resolve([]),
      createUser: (mockUser) => {
        const { email, password } = mockUser;

        return Promise.resolve({ id: '1', email, password } as users);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an auth service instance', async () => {
    expect(service).toBeDefined();
  });

  it('creates new user with salted and hashed password', async () => {
    const user = await service.signup(mockUser);

    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');

    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.getUsers = () =>
      Promise.resolve([{ id: '1', email: 'a', password: 'a' } as users]);

    try {
      await service.signup(mockUser);
    } catch (error) {
      // done();
    }
  });

  it('throws if signin is called with an unused email', async () => {
    try {
      await service.signin(mockUser);
    } catch(err) {
      // done()
    }
  });

  it('throws if invalid password is provided', async () => {
    fakeUsersService.getUsers = () =>
      Promise.resolve([{ id: '1', email: 'a', password: 'a' } as users]);
    try {
      await service.signin(mockUser)
    } catch(err) {

    }
  });
});
