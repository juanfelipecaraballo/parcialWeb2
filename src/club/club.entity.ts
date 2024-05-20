import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import { SocioEntity } from '../socio/socio.entity';

@Entity()
export class ClubEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    fecha_fundacion: string;

    @Column()
    imagen: string;

    @Column({ length: 100 })
    descripcion: string;


    @ManyToMany(()=>SocioEntity, socio => socio.clubs)
    @JoinTable()
    socios :SocioEntity[];
}
