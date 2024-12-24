import { GenderEnum } from '@app/common/interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from '@src/users/entities/user.entity';
import { UsersRepository } from '@src/users/users.repository';

@Injectable()
export class UserSeeder {
  private readonly logger = new Logger(UserSeeder.name);

  constructor(private readonly usersRepository: UsersRepository) {}

  async seed() {
    try {
      const raws: Omit<UserEntity, 'createdAt' | 'updatedAt' | 'updatedBy'>[] =
        [
          {
            id: 1,
            firstName: 'Super',
            lastName: 'Admin',
            email: 'OyM2l@example.com',
            birthDate: new Date(),
            gender: GenderEnum.MALE,
            password: 'Password123@-',
            createdBy: 'system',
          },
        ];

      const data = raws.map((raw) => new UserEntity(raw));

      this.logger.log('Seeding users data...');

      await this.usersRepository.query('SET FOREIGN_KEY_CHECKS = 0;');
      await this.usersRepository.query('TRUNCATE users;');
      await this.usersRepository.query('SET FOREIGN_KEY_CHECKS = 1;');
      await this.usersRepository.create(data);

      this.logger.log('Successfully seeded users data...');
    } catch (error) {
      this.logger.error('Error while seeding users data...', error);
    }
  }
}
