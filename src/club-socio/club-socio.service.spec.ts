import { Test, TestingModule } from '@nestjs/testing';
import { ClubSocioService } from './club-socio.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ClubEntity } from '../club/club.entity';
import { SocioEntity } from '../socio/socio.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {faker} from '@faker-js/faker'
import { ClubService } from '../club/club.service';
import { SocioService } from '../socio/socio.service';

describe('ClubSocioService', () => {
  let service: ClubSocioService;
  let clubRepository: Repository<ClubEntity>;
  let socioRepository: Repository<SocioEntity>;
  let club: ClubEntity;
  let socio: SocioEntity;
  let sociosList: SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubSocioService],
    }).compile();

    service = module.get<ClubSocioService>(ClubSocioService);
    clubRepository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    socioRepository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));
  
    await seedDatabase();
  });

  const seedDatabase = async () => {
    socioRepository.clear();
    clubRepository.clear();
    
    sociosList = [];
    for (let i = 0; i < 5; i++) {
      const socio: SocioEntity = await socioRepository.save({
       
        nombre: faker.person.firstName(),
        fecha_nacimiento: faker.date.past(),
        correo: faker.internet.email(),
        clubes: [],
      });
      sociosList.push(socio);
    }

    club = await clubRepository.save({
     
      nombre: faker.company.name(),
      fecha_fundacion: faker.date.past(),
      imagen: faker.image.url(),
      descripcion: faker.lorem.paragraph(),
      socios: sociosList,
    });

    

  }


  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('should add a socio to a club', async () => {
    const socio = await socioRepository.save({
      nombre: faker.person.firstName(),
      fecha_nacimiento: faker.date.past(),
      correo: faker.internet.email(),
      clubes: [],
    });

    const club = await clubRepository.save({
      nombre: faker.company.name(),
      fecha_fundacion: faker.date.past(),
      descripcion: faker.lorem.paragraph(),
      imagen: faker.image.url(),
      socios: [],
    });

    const clubSocio: ClubEntity = await service.addMemberToClub(socio.id, club.id);
    expect(clubSocio.socios.length).toBe(1);
    expect(clubSocio.socios[0]).not.toBeNull();
    expect(clubSocio.socios[0].id).toEqual(socio.id);
    expect(clubSocio.socios[0].nombre).toEqual(socio.nombre);
    expect(clubSocio.socios[0].correo).toEqual(socio.correo); 
    expect(clubSocio.socios[0].fecha_nacimiento).toEqual(socio.fecha_nacimiento);
  });




});
