import { HttpService } from '@nestjs/axios';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
// eslint-disable-next-line import/order
import { readFile, unlink, writeFile } from 'fs/promises';
// eslint-disable-next-line import/order
import { createHash } from 'crypto';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { DatabaseConnectionName } from '../../infra/database/Database.Module';
import { USER_CREATED } from '../event-listener/UserEventListener.Service';
import { CreateUserDto } from './dto/CreateUserDto';
import { User } from './entities/User.Entity';

const ReqBin = {
  baseUrl: 'https://reqres.in/api',
};

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name, DatabaseConnectionName.PayEver)
    private readonly repository: Model<User>,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    private readonly httpService: HttpService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = await this.repository.create({ ...createUserDto });

      if (user) {
        // Event Emitter to send email via sendgrid
        this.eventEmitter.emitAsync(USER_CREATED, user);

        // RabbitMQ
        this.client.emit('user_created', user);
      }

      return user;
    } catch (err) {
      throw new BadRequestException(`Exception creating user.`);
    }
  }

  async findById(userId: number): Promise<User> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${ReqBin.baseUrl}/users/${userId}`),
      );

      if (!data) {
        throw new NotFoundException(`Exception getting user with ID ${userId}`);
      }

      const mappedUser: User = {
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        avatarUrl: data.avatar,
        ...data,
      };

      return mappedUser;
    } catch (error) {
      throw new BadRequestException(`Failed to get user with ID ${userId}.`, error?.response?.data);
    }
  }

  async findAvatar(userId: number): Promise<string> {
    const user = await this.repository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    if (user.avatarHash) {
      const filePath = `./avatars/${user.avatarHash}.png`;
      const avatar = await readFile(filePath);
      return avatar.toString('base64');
    } else {
      if (!user.avatarUrl) {
        throw new NotFoundException();
      }
      const { data } = await firstValueFrom(
        this.httpService.get(user.avatarUrl, { responseType: 'arraybuffer' }),
      );
      const avatarHash = createHash('sha256').update(data).digest('hex');
      const filePath = `./avatars/${avatarHash}.png`;
      await writeFile(filePath, data);
      user.avatarHash = avatarHash;
      await user.save();
      return data.toString('base64');
    }
  }

  async deleteAvatar(userId: number): Promise<void> {
    const user = await this.repository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    if (user.avatarHash) {
      const filePath = `./avatars/${user.avatarHash}.png`;
      await unlink(filePath);
      user.avatarHash = undefined;
      await user.save();
    }
  }
}
