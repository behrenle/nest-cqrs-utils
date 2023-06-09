import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { <%= classify(name) %>Command } from './<%= name %>.command';
import { <%= classify(name) %>ResponseDto } from './<%= name %>.response.dto';

@CommandHandler(<%= classify(name)%>Command)
export class <%= classify(name)%>Handler implements ICommandHandler<<%= classify(name) %>Command> {
  async execute(
    command: <%= classify(name) %>Command,
  ): Promise<<%= responseDto ? classify(name) + "ResponseDto" : "void" %>> {
    
  }
}