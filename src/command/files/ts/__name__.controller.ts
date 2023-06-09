import { Controller, <%= nestCommonImports.join(", ") %> } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';<% 
if(responseDto) { %>
import { <%= classify(name) %>ResponseDto } from './<%= name %>.response.dto';<% } if(requestBodyDto) { %>
import { <%= classify(name) %>RequestBodyDto } from './<%= name %>.request.body.dto';<% } if(requestQueryDto) { %>
import { <%= classify(name) %>RequestQueryDto } from './<%= name %>.request.query.dto';<% } if(requestParamsDto) { %>
import { <%= classify(name) %>RequestParamsDto } from './<%= name %>.request.params.dto';<% } %>

@Controller(<%= url ? `"${url}"` : "" %>)
export class <%= classify(name)%>Controller {
  constructor(private commandBus: CommandBus) {}

  @<%= httpMethodDecorator %>()
  async <%= camelize(name) %>(<% if (requestQueryDto) { %>
    @Query() query: <%= classify(name) %>RequestQueryDto,<% } if (requestParamsDto) { %>
    @Param() params: <%= classify(name) %>RequestParamsDto,<% } if (requestBodyDto) { %>
    @Body() body: <%= classify(name) %>RequestBodyDto,<% } if (requestBodyDto || requestParamsDto || requestQueryDto) {%> 
  <%}%>): Promise<<%= responseDto ? classify(name) + "ResponseDto" : "void" %>> {

  }
}
