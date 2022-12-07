import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { JwtAuthService } from 'src/jwt-auth/jwt-auth.service';

const prisma = new PrismaClient()

@Injectable()
export class AuthService {
    constructor(private jwtAuthService: JwtAuthService) {}

    async secondTime(token: string) {
      if (!token) {
        throw new ForbiddenException("Need Token")
      }
      const {validate} = await this.jwtAuthService.validate(token);
      let id: number = validate.id
      if (!validate || !validate.id) {
        throw new ForbiddenException("Invalid Token")
      }
      await prisma.users.update({where:{id},
        data: {
          first_connection: false
        }
      })
    }

    async verify(token: string) {
        if (!token) {
            return {status: 2}
        }
        const {validate} = this.jwtAuthService.validate(token);
        if (!validate || !validate.id) {
          throw new ForbiddenException("Invalid Token")
        }
        if (validate.first_time == true) {
          return {status: 3}
        }
        if (validate.isAuth || !validate.two_factor_auth) {
          return {status: 0}
        }
        return {status: 1}
    }
}
