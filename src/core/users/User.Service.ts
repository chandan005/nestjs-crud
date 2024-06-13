import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { DatabaseConnectionName } from '../../infra/database/Database.Module';
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
    private readonly httpService: HttpService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      return this.repository.create({ ...createUserDto });
    } catch (err) {
      throw new BadRequestException(`Exception creating user.`);
    }
  }

  async findById(userId: number): Promise<User> {
    try {
      const user = await firstValueFrom(this.httpService.get(`${ReqBin.baseUrl}/users/${userId}`));

      if (!user.data) {
        throw new NotFoundException(`Exception getting user with ID ${userId}`);
      }

      const mappedUser: User = {
        firstName: user.data.first_name,
        lastName: user.data.last_name,
        avatarUrl: user.data.avatar,
        ...user.data,
      };
      return mappedUser;
    } catch (error) {
      throw new BadRequestException(`Failed to get user with ID ${userId}.`, error?.response?.data);
    }
  }

  async findAvatar(userId: number): Promise<any> {}

  async deleteUAvatar(userId: number): Promise<void> {
    try {
    } catch (err) {
      throw new BadRequestException(`Exception deleting user with ID ${userId}`);
    }
  }
}
