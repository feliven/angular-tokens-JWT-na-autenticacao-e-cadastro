import { Estado } from 'src/estados/entities/estado.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// 1. Define the Enum
export enum Genero {
  MASCULINO = 'm',
  FEMININO = 'f',
  NAOINFORMAR = 'n',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  nascimento: Date;

  @Column()
  cpf: string;

  @Column()
  telefone: string;

  @Column()
  email: string;

  @Column()
  senha: string;

  // 2. Update the column to use the Enum
  @Column({ type: 'simple-enum', enum: Genero, nullable: true })
  genero: Genero;

  @Column()
  cidade: string;

  @ManyToOne(() => Estado)
  @JoinColumn()
  estado: Estado;
}
