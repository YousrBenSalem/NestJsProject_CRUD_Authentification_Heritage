/* eslint-disable prettier/prettier */
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
/* import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto'; */
import { MailerService } from '@nestjs-modules/mailer';  

import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailerService : MailerService ,
    
  ) {}
  
	async signIn(data: AuthDto) {
    // Check if user exists
    const user = await this.usersService.findByUsername(data.email);
    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = await argon2.verify(user.password, data.password);
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens(user._id.toString(), user.username);
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);
  return {tokens,user};
  }


  	async logout(userId: string) {
    return this.usersService.update(userId, { refreshToken: null });
  }
    hashData(data: string) {
    return argon2.hash(data);
  }
  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }
  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
  const user = await this.usersService.findById(userId);
  if (!user || !user.refreshToken)
    throw new ForbiddenException('Access Denied');
  const refreshTokenMatches = await argon2.verify(
    user.refreshToken,
    refreshToken,
  );
  if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
  const tokens = await this.getTokens(user.id, user.username);
  await this.updateRefreshToken(user.id, tokens.refreshToken);
  return tokens;
}
/*   create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  } */


    // forget password
    async forgetPassword ( email : string){
      try {
          const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
        }
    else {
      //create new token 
      const token = await this.jwtService.sign({
        id: user._id,  
      },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '5m',
        },)
       // update token
       await this.usersService.updateToken(user._id, token);
       // send email 
       const option = {
        to : user.email ,
        subject : 'Forget Password',
        template: './forgot-password', 
        context: {  
        token : token      },  
        html : `<h1> Update u password </h1> <a href=http://localhost:3001/reset/${token}>Click here</a>`
       }
           await this.mailerService.sendMail(option)

           return {success: true , 
            message : "You can change your password ",
            data : user 
           }


    }
      
      } catch (err) {
        return err ;
        
      }
    }

    // reset password 
    async resetPassword (token : string, newPassword : string){
      try {
        const decoded = await this.jwtService.verify(token, {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          });
          if (!decoded) {
            throw new UnauthorizedException('Invalid token');
            }
            const user = await this.usersService.findById(decoded.id);
            if (!user) {
              throw new NotFoundException('User not found');
              }
              const hashedPassword = await argon2.hash(newPassword);
                user.password = hashedPassword;
                user.refreshToken = undefined ;
                await user.save();
              return {success: true ,
                message : "Password updated successfully",
                data : user
                }
                } catch (err) {
                  return {
                    success: false ,
                    message : "invalid token"+err ,
                    data:null
                  }
                }
    }
    
}
