import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClubSocioModule } from './club-socio/club-socio.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import { ClubModule } from './club/club.module';
import { SocioModule } from './socio/socio.module';
import { ClubEntity } from './club/club.entity';
import { SocioEntity } from './socio/socio.entity';
import { tr } from '@faker-js/faker';


@Module({
  imports: [ClubSocioModule, ClubModule, SocioModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'club',
      entities: [ClubEntity, SocioEntity],
      synchronize: true,
      dropSchema: true,
      keepConnectionAlive: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

