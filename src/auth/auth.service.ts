import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsInput } from './inputs/auth-credentials.input';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentials: AuthCredentialsInput) {
    const { username, password } = authCredentials;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      id: uuid(),
      username,
      password: hashedPassword,
      createdDate: new Date().toISOString(),
    });
    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(authCredentials: AuthCredentialsInput): Promise<string> {
    const { username, password } = authCredentials;
    const user = await this.userRepository.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return accessToken;
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async findById(id: string): Promise<User> {
    const found = await this.userRepository.findOne({ id });
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }
}
