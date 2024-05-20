import { IsString, IsNotEmpty} from 'class-validator';

export class SocioDto {
    @IsString()
    @IsNotEmpty()
    readonly id: string;

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    correo: string;

    @IsString()
    @IsNotEmpty()
    fecha_nacimiento: string;
}
