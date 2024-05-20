import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ClubEntity} from './club.entity';
import { ClubService } from './club.service';

describe('ClubService', () => {
  let service: ClubService;
  let repository: Repository<ClubEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubService]
    }).compile();

    service = module.get<ClubService>(ClubService);
    repository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new club', async () => {
    const club = new ClubEntity();
    club.nombre = "Club de futbol";
    club.fecha_fundacion = "01/01/2005";
    club.imagen = "imagen.jpg";
    club.descripcion = "Club de futbol de la ciudad";
    await service.create(club);
    const storedClub = await service.create(club);
    expect(storedClub).not.toBeNull();
    expect(storedClub.nombre).toEqual(club.nombre);
    expect(storedClub.fecha_fundacion).toEqual(club.fecha_fundacion);
    expect(storedClub.imagen).toEqual(club.imagen);
    expect(storedClub.descripcion).toEqual(club.descripcion);

  });

  it('should find a club by id', async () => {
    const club = new ClubEntity();
    club.nombre = "Club de futbol";
    club.fecha_fundacion = "1990-01-01";
    club.imagen = "imagen.jpg";
    club.descripcion = "Club de futbol de la ciudad";
    await repository.save(club);

    const clubBuscado = await service.findOne(club.id);

    expect (clubBuscado).not.toBeNull();
    expect(clubBuscado.nombre).toEqual(club.nombre);
    expect(clubBuscado.fecha_fundacion).toEqual(club.fecha_fundacion);
    expect(clubBuscado.imagen).toEqual(club.imagen);
    expect(clubBuscado.descripcion).toEqual(club.descripcion);
    
  });

  it('should find all clubs', async () => {
    const club1 = new ClubEntity();
    club1.nombre = "Club de futbol";
    club1.fecha_fundacion = "1990-01-01";
    club1.imagen = "imagen.jpg";
    club1.descripcion = "Club de futbol de la ciudad";
    await repository.save(club1);

    const club2 = new ClubEntity();
    club2.nombre = "Club de baloncesto";
    club2.fecha_fundacion = "1990-01-01";
    club2.imagen = "imagen.jpg";
    club2.descripcion = "Club de baloncesto de la ciudad";
    await repository.save(club2);

    const clubs = await service.findAll();

    expect(clubs).not.toBeNull();

    expect(clubs.length).toEqual(2);

    });

    it('should update a club', async () => {
        const club = new ClubEntity();
        club.nombre = "Club de futbol";
        club.fecha_fundacion = "1990-01-01";
        club.imagen = "imagen.jpg";
        club.descripcion = "Club de futbol de la ciudad";
        await repository.save(club);

        club.nombre = "Club de baloncesto";
        club.fecha_fundacion = "1990-01-01";
        club.imagen = "imagen.jpg";
        club.descripcion = "Club de baloncesto de la ciudad";
        const updatedClub = await service.update(club.id, club);

        expect(updatedClub).not.toBeNull();
        expect(updatedClub.nombre).toEqual(club.nombre);
        expect(updatedClub.fecha_fundacion).toEqual(club.fecha_fundacion);
        expect(updatedClub.imagen).toEqual(club.imagen);
        expect(updatedClub.descripcion).toEqual(club.descripcion);
    });

    it('should throw an exception while trying to find a deleted club', async () => {
        const club = new ClubEntity();
        club.nombre = "Club de futbol";
        club.fecha_fundacion = "1990-01-01";
        club.imagen = "imagen.jpg";
        club.descripcion = "Club de futbol de la ciudad";
        await repository.save(club);

        await service.delete(club.id);

        await expect (() => service.findOne(club.id)).rejects.toHaveProperty("message", "No se pudo encontrar el club con el id indicado.");
    }
    );
}   
);