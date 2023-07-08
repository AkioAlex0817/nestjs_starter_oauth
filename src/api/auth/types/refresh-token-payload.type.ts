import { AccessTokenPayloadType } from './access-token-payload.type';

export type RefreshTokenPayloadType = AccessTokenPayloadType & { refreshToken: string };
