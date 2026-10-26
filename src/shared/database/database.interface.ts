export interface Database {
  connect(uri: string): Promise<void>;
  disconnect(): Promise<void>;
}
