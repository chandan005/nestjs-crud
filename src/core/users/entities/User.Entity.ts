import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class User extends Document {
  @ApiProperty()
  @Prop({ required: true, trim: true })
  email: string;

  @ApiProperty()
  @Prop({ required: true, trim: true })
  firstName: string;

  @ApiProperty()
  @Prop({ required: true, trim: true })
  lastName: string;

  @ApiProperty()
  @Prop({ required: false, trim: true })
  avatarUrl?: string;

  @ApiProperty()
  @Prop({ required: false, trim: true })
  avatarHash?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
