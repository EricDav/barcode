import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Product } from './models/product.model';
import { User } from './models/user.model';
import { config } from './config';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: config.db.host,
    port: config.db.port,
    username: config.db.username,
    password: config.db.password,
    database: config.db.name,
    entities: [Product, User],
    logging: true,
    synchronize: true,
    ssl: { rejectUnauthorized: false }
  }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
