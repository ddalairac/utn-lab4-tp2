

export enum eCollections {
    users = "users",
    specialties = 'specialties',
    appointments = "appointments",
    attentionSpaces = "attentionSpaces",
    
    attentionSurvey = "attentionSurvey",
    clinicHistory = "clinicHistory"
}

export interface iAuthError {
    code: string,
    message: string
}