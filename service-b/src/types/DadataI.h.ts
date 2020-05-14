export interface DadataI {
  findAddress(query: string): Promise<Request>
}
