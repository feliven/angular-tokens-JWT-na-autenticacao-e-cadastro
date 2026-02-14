import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { EstadoDto } from 'src/estados/dto/estado.dto';
import { Genero } from '../entities/user.entity'; // Import the Enum

export class UserDto {
  @ApiProperty()
  nome: string;

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

  // 3. Add Validation
  @ApiProperty({ enum: Genero }) // Updates Swagger documentation
  @IsOptional() // Keep this if the field is nullable
  @IsEnum(Genero, { message: 'Gênero deve ser m, f ou n' })
  genero: Genero;

  @ApiProperty()
  cidade: string;

  @ApiProperty()
  estado: EstadoDto;
}
