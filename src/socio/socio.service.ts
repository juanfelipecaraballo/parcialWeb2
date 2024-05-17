import { SocioEntity } from "./socio.entity";
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class SocioService{
    constructor(
        @InjectRepository(SocioEntity)
        private readonly socioRepository: Repository<SocioEntity>
    ){}

    async findOne(id:string): Promise<SocioEntity>{
        const socio: SocioEntity = await this.socioRepository.findOne({where:{id}, relations:["clubs"]});
        if (!socio)
            throw new BusinessLogicException("No se pudo encontrar el socio con el id indicado.", BusinessError.NOT_FOUND);
        return socio;
    }

    async findAll(): Promise<SocioEntity[]> {
        return await this.socioRepository.find({ relations: ["clubs"] });
    }

    async create(socio: SocioEntity): Promise<SocioEntity> {
        return await this.socioRepository.save(socio);
    }

    async update(id: string, socio: SocioEntity): Promise<SocioEntity> {
        const persistedSocio: SocioEntity = await this.socioRepository.findOne({where:{id}});
        if (!persistedSocio)
          throw new BusinessLogicException("No se pudo encontrar el socio con el id indicado.", BusinessError.NOT_FOUND);
       
        socio.id = id; 
       
        return await this.socioRepository.save(socio);
    }

    async delete(id: string) {
        const socio: SocioEntity = await this.socioRepository.findOne({where:{id}});
        if (!socio)
          throw new BusinessLogicException("No se pudo encontrar el socio con el id indicado.", BusinessError.NOT_FOUND);
     
        await this.socioRepository.remove(socio);
    }
}