import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseConnectionName } from '../../config/Database.Module';
import { CreateUserDto } from './dto/CreateUserDto';
import { User } from './entities/User.Entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name, DatabaseConnectionName.PayEver)
    private readonly repository: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      return this.repository.create({ ...createUserDto });
    } catch (err) {
      throw new BadRequestException(`Exception creating user.`);
    }
  }

  async findById(userId: number): Promise<User> {
    const invoice = await this.repository
      .findOne({
        $and: [{ _id: id }],
      })
      .exec();
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }

  async findAvatar(userId: number): Promise<any>;

  async delete(userId: number): Promise<void> {}

  delay(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
}
