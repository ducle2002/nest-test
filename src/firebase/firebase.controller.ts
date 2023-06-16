import { Body, Controller, Get, HttpStatus, Param, Post, Query } from "@nestjs/common";
import { FirebaseService } from './firebase.service';
import { ApiTags } from '@nestjs/swagger';
import { MulticastMessageDto } from './dtos/multicast-message.dto';
import { sendNotiDto } from './dtos/sendNotiDto.dto';
import { queryNotiTokenDto } from './dtos/queryNotiTokenDto.dto';

@ApiTags('Firebase Notify')
@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post('/test')
  async testNotify(@Body() payload: MulticastMessageDto) {
    try {
      const deviceTokens = payload.deviceTokens;
      await this.firebaseService.sendMessage(deviceTokens, {
        title: payload.title,
        content: payload.content,
      });
      return 'test success';
    } catch (error) {
      throw error;
    }
  }

  @Post('/multicastMessage')
  async testNotifyVer2(@Body() payload: MulticastMessageDto) {
    try {
      const deviceTokens = payload.deviceTokens;

      return await this.firebaseService.sendMulticastMessage(
        deviceTokens,
        payload.title,
        payload.content,
        '1',
        payload.data,
      );
    } catch (error) {
      throw error;
    }
  }

  @Post('/queryBase1')
  async testQueryBase(
    @Body() payload: sendNotiDto,
    @Query() query: queryNotiTokenDto,
  ) {
    try {
      return await this.firebaseService.queryBase(
        query,
        payload.title,
        payload.content,
        payload.action,
        payload.data,
      );
    } catch (error) {
      throw error;
    }
  }

  @Get('/queryBase2')
  async testQueryBase2() {
    try {
      return await this.firebaseService.queryBase2();
    } catch (error) {
      throw error;
    }
  }
}
