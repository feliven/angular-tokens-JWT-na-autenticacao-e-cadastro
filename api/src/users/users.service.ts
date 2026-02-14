import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genero, User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async onModuleInit() {
    const email = 'admin@admin';
    const admin = await this.repository.findOne({ where: { email } });

    if (admin) {
      console.log('Admin user found:', admin.nome);
    } else {
      console.log('Admin user not found. Creating...');

      // Create a default admin object
      const adminUser: UserDto = {
        nome: 'Admin',
        nascimento: new Date(),
        cpf: '11111111111',
        telefone: '9999999999',
        email: email,
        senha: '111', // Important: In a real app, hash this password!
        genero: Genero.NAOINFORMAR,
        cidade: 'Sede',
        // Note: 'estado' is a relation. We pass null or a dummy object here.
        // If your DB requires a valid state ID, you might need to fetch one first.
        estado: null,
      };

      try {
        await this.create(adminUser);
        console.log('Admin user created successfully.');
      } catch (error) {
        console.error('Failed to create admin user:', error.message);
      }
    }
  }

  async findOne(email: string) {
    return this.repository.findOne({
      where: { email },
      relations: ['estado'],
    });
  }

  create(userDto: UserDto) {
    return this.repository.save(userDto);
  }

  update(id: number, updateUserDto: UserDto) {
    return this.repository.update(id, updateUserDto);
  }
}
