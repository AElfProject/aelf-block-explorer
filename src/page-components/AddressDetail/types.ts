export interface IBalance {
  balance?: string;
  symbol: string;
}
export interface IFile {
  files?: IFile[];
  name: string;
  key?: string;
  content?: string;
  fileType?: string;
}
export interface IViewerConfig {
  content?: string;
  fileType?: string;
  name?: string;
  path?: string;
}
