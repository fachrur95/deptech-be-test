import { PaginationDto } from '@app/common/dto';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly usersRepository: UsersRepository) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      return this.usersRepository.create(
        new UserEntity({ ...createUserDto, password: hashedPassword }),
      );
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(filter: PaginationDto) {
    const dataPagination = await this.usersRepository.pagination({
      filter,
      keySearch: ['firstName', 'lastName', 'email'],
      initialKeySort: 'firstName',
    });

    return dataPagination;
  }

  async findOne(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const { currentPassword, ...dataUpdate } = updateUserDto;
      const user = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });

      await this.verifyUser(user.email, currentPassword);
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);

      return this.usersRepository.findOneAndUpdate(
        { id },
        { ...dataUpdate, password: hashedPassword },
      );
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number) {
    return this.usersRepository.findOneAndDelete({ id });
  }
}
