import type { CfProperties, ExecutionContext } from "@cloudflare/workers-types";

export {};

declare module "h3" {
  interface H3EventContext {
    cf: CfProperties;
    cloudflare: {
      request: Request;
      env: {
        NITRO_CLIENT_ID: string;
        NITRO_CLIENT_SECRET: string;
      };
      context: ExecutionContext;
    };
  }
}
