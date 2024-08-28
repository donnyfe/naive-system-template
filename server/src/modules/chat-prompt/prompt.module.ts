import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PromptController } from './prompt.controller'
import { PromptService } from './prompt.service'
import { PromptEntity } from './prompt.entity'

@Module({
  imports: [TypeOrmModule.forFeature([PromptEntity])],
  controllers: [PromptController],
  providers: [PromptService],
  exports: [PromptService],
})
export class PromptModule {}
