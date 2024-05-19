import { Injectable } from '@nestjs/common';
import { ClubEntity } from './club.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ClubService {

    constructor(
        @InjectRepository(ClubEntity)
        private readonly clubRepository: Repository<ClubEntity>
    ){}


    async findAll(): Promise<ClubEntity[]> {
        return await this.clubRepository.find({ relations: ["socios"]});
    }

    async findOne(id: string): Promise<ClubEntity>{
        const club: ClubEntity = await this.clubRepository.findOne({where:{id}, relations:["socios"]});
        if (!club)
            throw new BusinessLogicException("No se pudo encontrar el club con el id indicado.", BusinessError.NOT_FOUND);
        return club;
    }

    async create(club: ClubEntity): Promise<ClubEntity> {
        if (!this.validateDescription(club.descripcion)) {
            throw new BusinessLogicException('La descripción no puede superar los 100 caracteres.', BusinessError.BAD_REQUEST);
        }
        return await this.clubRepository.save(club);
    }
   
    async update(id: string, club: ClubEntity): Promise<ClubEntity> {
        const persistedClub: ClubEntity = await this.clubRepository.findOne({where:{id}});
        if (!persistedClub)
          throw new BusinessLogicException("No se pudo encontrar el club con el id indicado.", BusinessError.NOT_FOUND);
        
        club.id = id;

        if (!this.validateDescription(club.descripcion)) {
            throw new BusinessLogicException('La descripción no puede superar los 100 caracteres.', BusinessError.BAD_REQUEST);
        }
        
        return await this.clubRepository.save(club);
    }
    
    

    async delete(id: string) {
        const club: ClubEntity = await this.clubRepository.findOne({where:{id}});
        if (!club)
          throw new BusinessLogicException("No se pudo encontrar el club con el id indicado.", BusinessError.NOT_FOUND);
      
        await this.clubRepository.remove(club);
    }

    private validateDescription(description: string): boolean {
        return description.length <= 100;
    }

}