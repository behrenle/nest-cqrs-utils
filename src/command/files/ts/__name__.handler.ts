import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { <%= classify(name) %>Command } from './<%= name %>.resolver';
import { <%= classify(name) %>ResponseDto } from './<%= name %>.response.dto';

@CommandHandler()
export class <%= classify(name)%>Command implements ICommandHandler<<%= classify(name) %>Command> {
  async execute(
    command: <%= classify(name) %>Command,
  ): Promise<<%= classify(name) %>ResponseDto> {
    
  }
}