import { HttpService } from '@nestjs/axios';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { ClientProxy } from '@nestjs/microservices';
import { Model } from 'mongoose';

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AxiosHeaders, AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { DatabaseConnectionName } from '../../infra/database/Database.Module';
import { USER_CREATED } from '../event-listener/UserEventListener.Service';
import { UserService } from './User.Service';
import { CreateUserDto } from './dto/CreateUserDto';
import { User } from './entities/User.Entity';

describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;
  let httpService: HttpService;
  let clientProxy: ClientProxy;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name, DatabaseConnectionName.PayEver),
          useValue: {
            new: jest.fn().mockResolvedValue({}),
            constructor: jest.fn().mockResolvedValue({}),
            find: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: 'RABBITMQ_SERVICE',
          useValue: {
            emit: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emitAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken(User.name, DatabaseConnectionName.PayEver));
    httpService = module.get<HttpService>(HttpService);
    clientProxy = module.get<ClientProxy>('RABBITMQ_SERVICE');
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user and send an email and rabbit event', async () => {
      const createUserDto: CreateUserDto = {
        userId: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        avatarUrl: 'avatar-url',
      };
      const user = { ...createUserDto, create: jest.fn().mockResolvedValue(createUserDto) };

      jest.spyOn(model.prototype, 'create').mockResolvedValue(user);
      // jest.spyOn(eventEmitter, 'emitAsync').mockResolvedValue(null);
      jest.spyOn(clientProxy, 'emit').mockImplementation(() => of(true));

      const result = await service.create(createUserDto);

      expect(result).toEqual(user);
      expect(eventEmitter.emitAsync).toHaveBeenCalledWith(USER_CREATED, user);
      expect(clientProxy.emit).toHaveBeenCalledWith('user_created', user);
    });

    it('should throw an error if user creation fails', async () => {
      const createUserDto: CreateUserDto = {
        userId: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        avatarUrl: 'avatar-url',
      };
      jest.spyOn(model.prototype, 'save').mockRejectedValue(new Error());

      await expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findById', () => {
    it('should return a user by ID', async () => {
      const userId = 1;
      const data = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        avatar: 'avatar_url',
      };

      const mockAxiosResponse: AxiosResponse = {
        data,
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config: {
          headers: new AxiosHeaders(),
        },
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockAxiosResponse));

      const result = await service.findById(userId);

      expect(result).toEqual({
        userId: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        avatarUrl: 'avatar_url',
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = 1;

      const mockAxiosResponse: AxiosResponse = {
        data: undefined,
        status: 404,
        statusText: 'Not Found',
        headers: new AxiosHeaders(),
        config: {
          headers: new AxiosHeaders(),
        },
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockAxiosResponse));

      await expect(service.findById(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAvatar', () => {
    it('should return the avatar in base64 if it exists', async () => {
      const userId = 1;
      const user = { _id: userId, avatarUrl: 'avatar_url', avatarHash: 'avatar_hash' };
      jest.spyOn(model, 'findById').mockResolvedValue(user);
      jest.spyOn(service, 'findAvatar').mockResolvedValue('base64_encoded_avatar');

      const result = await service.findAvatar(userId);

      expect(result).toEqual('base64_encoded_avatar');
    });

    it('should fetch, save, and return a new avatar in base64 if it does not exist', async () => {
      const userId = 1;
      const user: User = {
        _id: userId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        avatarUrl: 'avatar_url',
        save: jest.fn().mockResolvedValue({} as User),
      } as unknown as User;
      jest.spyOn(model, 'findById').mockResolvedValue(user);

      const mockAxiosResponse: AxiosResponse = {
        data: undefined,
        status: 404,
        statusText: 'Not Found',
        headers: new AxiosHeaders(),
        config: {
          headers: new AxiosHeaders(),
        },
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockAxiosResponse));
      jest.spyOn(service, 'findAvatar').mockResolvedValue(Buffer.from('avatar').toString('base64'));

      const result = await service.findAvatar(userId);

      expect(result).toEqual(Buffer.from('avatar').toString('base64'));
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = 1;

      jest.spyOn(model, 'findById').mockResolvedValue(null);

      await expect(service.findAvatar(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteAvatar', () => {
    it('should delete the avatar and update the user', async () => {
      const userId = 1;
      const user: User = {
        _id: userId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        avatarUrl: 'avatar_url',
        save: jest.fn().mockResolvedValue({} as User),
      } as unknown as User;
      jest.spyOn(model, 'findById').mockResolvedValue(user);

      await service.deleteAvatar(userId);

      expect(user.save).toHaveBeenCalled();
      expect(user.avatarHash).toBeNull();
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = 1;

      jest.spyOn(model, 'findById').mockResolvedValue(null);

      await expect(service.deleteAvatar(userId)).rejects.toThrow(NotFoundException);
    });
  });
});
