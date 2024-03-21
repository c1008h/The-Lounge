import {TempUserProps} from './TempUser'

export interface Message {
    id?: string;
    message: string;
    sender: TempUserProps;
    timestamp?: Date | string;
}
  