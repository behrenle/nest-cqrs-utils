import { Controller, <%= nestCommonImports.join(", ") %> } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';<% 
if(responseDto) { %>
import { <%= classify(name) %>ResponseDto } from './<%= name %>.response.dto';<% } if(requestQueryDto) { %>
import { <%= classify(name) %>RequestQueryDto } from './<%= name %>.request.query.dto';<% } if(requestParamsDto) { %>
import { <%= classify(name) %>RequestParamsDto } from './<%= name %>.request.params.dto';<% } %>

@Controller(<%= url ? `"${url}"` : "" %>)
export class <%= classify(name)%>Controller {
  constructor(private queryBus: QueryBus) {}

  @<%= httpMethodDecorator %>()
  async <%= camelize(name) %>(<% if (requestQueryDto) { %>
    @Query() query: <%= classify(name) %>RequestQueryDto,<% } if (requestParamsDto) { %>
    @Param() params: <%= classify(name) %>RequestParamsDto,<% } if ( requestParamsDto || requestQueryDto) {%> 
  <%}%>): Promise<<%= responseDto ? classify(name) + "ResponseDto" : "void" %>> {

  }
}
