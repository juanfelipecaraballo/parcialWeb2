import { Body, Controller, Delete, Get, Post, Put, UseInterceptors } from '@nestjs/common';
import { ClubSocioService } from './club-socio.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { Param } from '@nestjs/common';
import { SocioDto } from 'src/socio/socio.dto';
import { plainToInstance } from 'class-transformer';
import { SocioEntity } from 'src/socio/socio.entity';

@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubSocioController {
    constructor(private readonly clubSocioService: ClubSocioService) {}

    @Post(':clubId/members/:socioId')
    async addMemberToClub(@Param('clubId') clubId: string, @Param('socioId') socioId: string) {
        return await this.clubSocioService.addMemberToClub(socioId, clubId);
    }

    @Get(':clubId/members')
    async findMembersFromClub(@Param('clubId') clubId: string) {
        return await this.clubSocioService.findMembersFromClub(clubId);
    }

    @Get(':clubId/members/:socioId')
    async findMemberFromClub(@Param('clubId') clubId: string, @Param('socioId') socioId: string) {
        return await this.clubSocioService.findMemberFromClub(socioId, clubId);
    }

    @Put(':clubId/members')
    async updateMembersFromClub(@Param('clubId') clubId: string, @Body() sociosDto: SocioDto[]){
        const socios = plainToInstance(SocioEntity, sociosDto);
        return await this.clubSocioService.updateMembersFromClub(clubId, socios);
    }

    @Delete(':clubId/members/:socioId')
    async deleteMemberFromClub(@Param('clubId') clubId: string, @Param('socioId') socioId: string){
        return await this.clubSocioService.deleteMemberFromClub(socioId, clubId);
    }

}
