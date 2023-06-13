import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { <%= classify(name) %>Query } from './<%= name %>.query';
import { <%= classify(name) %>ResponseDto } from './<%= name %>.response.dto';

@QueryHandler(<%= classify(name)%>Query)
export class <%= classify(name)%>Handler implements IQueryHandler<<%= classify(name) %>Query> {
  async execute(
    query: <%= classify(name) %>Query,
  ): Promise<<%= responseDto ? classify(name) + "ResponseDto" : "void" %>> {
    
  }
}