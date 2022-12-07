import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/jwt-auth/jwt-auth.guard';
import { TChannel } from 'src/users/types';
import { ChatService } from './chat.service';

@Controller('channels')
@UseGuards(JwtAuthGuard)
export class ChatController {
    constructor(private chatService: ChatService) {}


    @Post()
    createChannel(@Body('channel') channel: TChannel) {
        return this.chatService.createChannel(channel)
    }

    @Get(':id')
    getChannel(@Param('id', ParseIntPipe) channel_id: number, @Req() req: Request) {
        return this.chatService.getChannel(channel_id, req)
    }

    @Get('/user/:id')
    getDirectConversation(@Param('id', ParseIntPipe) friend: number, @Req() req: Request) {
        return this.chatService.getDirectConversation(friend, req)
    }

    @Delete(':id')
    deleteChannel(@Param('id', ParseIntPipe) channel_id: number, @Req() req: Request) {
        return this.chatService.deleteChannel(channel_id, req)
    }
}
