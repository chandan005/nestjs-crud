import { Body, Controller, Delete, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SanitizeMongooseModelInterceptor } from 'nestjs-mongoose-exclude';
import { UserService } from './User.Service';
import { CreateUserDto } from './dto/CreateUserDto';
import { User } from './entities/User.Entity';

@ApiTags('users')
@Controller('users')
@UseInterceptors(
  new SanitizeMongooseModelInterceptor({
    excludeMongooseId: false,
    excludeMongooseV: true,
  }),
)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({ type: User })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiResponse({ type: User })
  @Get(':userId')
  async findById(@Param('userId') userId: number) {
    return this.userService.findById(userId);
  }

  @ApiResponse({ type: String })
  @Get(':userId/avatar')
  async findAvatar(@Param('userId') userId: number) {
    return this.userService.findAvatar(userId);
  }

  @ApiResponse({})
  @Delete(':userId/avatar')
  async deleteAvatar(@Param('userId') userId: number) {
    return this.userService.deleteAvatar(userId);
  }
}
