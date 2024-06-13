import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

enum DatabaseConnectionName {
  PayEver = 'payever',
}

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      connectionName: DatabaseConnectionName.PayEver,
      useFactory: async (config: ConfigService) => ({
        uri: config.get('MONGO_URI_BILLING'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
