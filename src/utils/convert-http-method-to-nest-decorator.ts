export function convertHttpMethodToNestDecorator(method: string): string {
  switch (method.toLowerCase()) {
    case "get":
      return "Get";

    case "post":
      return "Post";

    case "delete":
      return "Delete";

    case "patch":
      return "Patch";

    case "put":
      return "Put";
  }

  throw `Unknown http method: ${method}`;
}
