import { Injectable } from '@nestjs/common';
import { ClubEntity } from '../club/club.entity';
import { SocioEntity } from '../socio/socio.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ClubSocioService {
    constructor(
        @InjectRepository(ClubEntity)
        private readonly clubRepository: Repository<ClubEntity>,
        @InjectRepository(SocioEntity)
        private readonly socioRepository: Repository<SocioEntity>
    ){}
    
    async addMemberToClub(socioId: string, clubId: string): Promise<ClubEntity>{
        const club: ClubEntity = await this.clubRepository.findOne({where:{id:clubId}, relations:["socios"]});
        if (!club)
            throw new BusinessLogicException("No se pudo encontrar el club con el id indicado.", BusinessError.NOT_FOUND);
        
        const socio: SocioEntity = await this.socioRepository.findOne({where:{id:socioId}});
        if (!socio)
            throw new BusinessLogicException("No se pudo encontrar el socio con el id indicado.", BusinessError.NOT_FOUND);
        
        club.socios = [...club.socios, socio];
        return await this.clubRepository.save(club);
    }

    async findMembersFromClub(clubId: string): Promise<SocioEntity[]>{
        const club: ClubEntity = await this.clubRepository.findOne({where:{id:clubId}, relations:["socios"]});
        if (!club)
            throw new BusinessLogicException("No se pudo encontrar el club con el id indicado.", BusinessError.NOT_FOUND);
        
        return club.socios;
    }

    async findMemberFromClub(socioId: string, clubId: string): Promise<SocioEntity>{
        const club: ClubEntity = await this.clubRepository.findOne({where:{id:clubId}, relations:["socios"]});
        if (!club)
            throw new BusinessLogicException("No se pudo encontrar el club con el id indicado.", BusinessError.NOT_FOUND);
        
        const socio: SocioEntity = club.socios.find(s=>s.id == socioId);
        if (!socio)
            throw new BusinessLogicException("No se pudo encontrar el socio con el id indicado.", BusinessError.NOT_FOUND);
        
        return socio;
    }

    async updateMembersFromClub(clubId: string, socios: SocioEntity[]): Promise<ClubEntity>{
        const club: ClubEntity = await this.clubRepository.findOne({where:{id:clubId}, relations:["socios"]});
        if (!club)
            throw new BusinessLogicException("No se pudo encontrar el club con el id indicado.", BusinessError.NOT_FOUND);
        
        club.socios = socios;
        return await this.clubRepository.save(club);
    }

    async deleteMemberFromClub(socioId: string, clubId: string): Promise<ClubEntity>{
        const club: ClubEntity = await this.clubRepository.findOne({where:{id:clubId}, relations:["socios"]});
        if (!club)
            throw new BusinessLogicException("No se pudo encontrar el club con el id indicado.", BusinessError.NOT_FOUND);
        
        const socio: SocioEntity = await this.socioRepository.findOne({where:{id:socioId}});
        if (!socio)
            throw new BusinessLogicException("No se pudo encontrar el socio con el id indicado.", BusinessError.NOT_FOUND);
        
        club.socios = club.socios.filter(s=>s.id != socioId);
        return await this.clubRepository.save(club);
    }

    

}
