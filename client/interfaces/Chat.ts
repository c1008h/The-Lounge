import {TempUserProps} from './TempUser'

export interface Message {
    id?: string;
    type: string;
    message: string;
    sender: TempUserProps | string;
    timestamp?: Date | string;
}
  