/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body,  Req, UseGuards, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Request } from 'express';
import { AccessTokenGuard } from './../common/guards/accessToken.guard';
import { RefreshTokenGuard } from './../common/guards/refreshToken.guard';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signin')
  signin(@Body() data: AuthDto) {
    return this.authService.signIn(data);
  }

  @Post('forgetPassword')
  forgetPassword(@Body() data: AuthDto) {
    return this.authService.forgetPassword(data.email);
    
  }
  @Post ('resetPassword/:token')
  resetPassword(@Body() data: AuthDto , 
@Param('token') token:string) {
  return this.authService.resetPassword(token,data.password);
  }



  @UseGuards(RefreshTokenGuard)
  @Get('logout')
  logout(@Req() req: Request) {
    this.authService.logout(req.user['sub']);
  }

  @UseGuards(RefreshTokenGuard)
@Get('refresh')
refreshTokens(@Req() req: Request) {
  const userId = req.user['sub'];
  const refreshToken = req.user['refreshToken'];
  return this.authService.refreshTokens(userId, refreshToken);
}


 
}
