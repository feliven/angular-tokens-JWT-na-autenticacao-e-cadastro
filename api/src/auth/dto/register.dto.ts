import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { EstadoDto } from 'src/estados/dto/estado.dto';
import { Genero } from 'src/users/entities/user.entity';

export class RegisterDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  nascimento: Date;
  @ApiProperty()
  cpf: string;
  @ApiProperty()
  telefone: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  senha: string;
  @ApiProperty({ type: EstadoDto })
  destino: EstadoDto;
  @ApiProperty({ enum: Genero }) // Updates Swagger documentation
  @IsOptional() // Keep this if the field is nullable
  @IsEnum(Genero, { message: 'Gênero deve ser m, f ou n' })
  genero: Genero;
}
