import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SocioEntity } from './socio.entity';
import { SocioService } from './socio.service';



describe('SocioService', () => {
  let service: SocioService;
  let repository: Repository<SocioEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SocioService]
    }).compile();

    service = module.get<SocioService>(SocioService);
    repository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new socio', async () => {
    const socio = new SocioEntity();
    socio.nombre = "Juan";
    socio.fecha_nacimiento = "1990-01-01";
    socio.correo = "hola@hola.com";
    await service.create(socio);
    const storedSocio = await service.create(socio);
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.nombre).toEqual(socio.nombre);
    expect(storedSocio.fecha_nacimiento).toEqual(socio.fecha_nacimiento);
    expect(storedSocio.correo).toEqual(socio.correo);

  });

  it('should find a socio by id', async () => {
    const socio = new SocioEntity();
    socio.nombre = "Juan";
    socio.fecha_nacimiento = "1990-01-01";
    socio.correo = "hola@hola.com";
    await repository.save(socio);

    const socioBuscado = await service.findOne(socio.id);

    expect (socioBuscado).not.toBeNull();
    expect(socioBuscado.nombre).toEqual(socio.nombre);
    expect(socioBuscado.fecha_nacimiento).toEqual(socio.fecha_nacimiento);
    expect(socioBuscado.correo).toEqual(socio.correo);
    
  });

  it('should find all socios', async () => {
    const socio1 = new SocioEntity();
    socio1.nombre = "Juan";
    socio1.fecha_nacimiento = "1990-01-01";
    socio1.correo = "hola@hola.com";
    await repository.save(socio1);

    const socio2 = new SocioEntity();
    socio2.nombre = "Pedro";
    socio2.fecha_nacimiento = "1995-01-01";
    socio2.correo = "hola2@hola2.com";
    await repository.save(socio2);

    const socios = await service.findAll();

    expect(socios).not.toBeNull();

    expect(socios.length).toEqual(2);

  });

  it('should update a socio', async () => {
      const socio = new SocioEntity();
      socio.nombre = "Juan";
      socio.fecha_nacimiento = "1990-01-01";
      socio.correo = "hola@hola.com";
      await repository.save(socio);

      const updatedSocio = new SocioEntity();
      updatedSocio.nombre = "Juan Updated";
      updatedSocio.fecha_nacimiento = "1990-01-01";
      updatedSocio.correo = "updated@hola.com";

      await service.update(socio.id, updatedSocio);

      const socioBuscado = await service.findOne(socio.id);
      expect(socioBuscado).not.toBeNull();
      expect(socioBuscado.nombre).toEqual(updatedSocio.nombre);
      expect(socioBuscado.fecha_nacimiento).toEqual(updatedSocio.fecha_nacimiento);

  });

  it('should throw an exception while trying to find a deleted socio', async () => {
      const socio = new SocioEntity();
      socio.nombre = "Juan";
      socio.fecha_nacimiento = "1990-01-01";
      socio.correo = "hola@hola.com";
      await repository.save(socio);

      await service.delete(socio.id);
      
      await expect(() => service.findOne(socio.id)).rejects.toHaveProperty("message", "No se pudo encontrar el socio con el id indicado.");
      
  });

});