import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-auth.strategy';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  async login(user, isAuth = false) {
    const {two_factor_auth, nick_fourtytwo, first_connection} = await prisma.users.findFirst({where:{id:user.id},
      select: {
        two_factor_auth:true,
        nick_fourtytwo:true,
        first_connection:true
      }
    })
    const payload: JwtPayload = { username: nick_fourtytwo, id: user.id, isAuth, two_factor_auth, first_time: first_connection };
    
	return {
      accessToken: this.jwtService.sign(payload),
      two_factor_auth,
    };
  }

  validate(token) {
      return {
        validate: this.jwtService.verify(token)
      }
  }
}