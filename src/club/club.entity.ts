import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import { SocioEntity } from 'src/socio/socio.entity';

@Entity()
export class ClubEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    fecha_fundacion: Date;

    @Column()
    imagen: string;

    @Column({ length: 100 })
    descripcion: string;


    @ManyToMany(()=>SocioEntity, socio => socio.clubs)
    socios :SocioEntity[];
}
