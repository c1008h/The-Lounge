export interface TempUserProps {
    displayName: string;
    uid: string;
}

export const defaultTempUser: TempUserProps = {
    displayName: '',
    uid: '',
};

export interface AddAnonSessionResponse {
    uid: string;
    error?: string;
}