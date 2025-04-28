export interface GetAddressBalanceParams {
  address: string;
}

export interface GetSignatureParams {
  address: string;
  limit?: number;
  before?: string;
  until?: string;
}

export interface GetAddressHoldingsParams {
  address: string;
}
