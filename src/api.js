export const API = `/api/` //http://127.0.0.1:8000/

export const ProfilesAPI = `${API}profiles_api/v1/`

export const SoftAPI = `${API}soft_loading_api/v1/`


export const nameStatusMap = [
    ['opened',    'Введен',   'Введенные'],
    ['paid',      'Оплачен',  'Оплаченные'],
    ['completed', 'Принят',   'Принятые'],
    ['rejected',  'Отклонен', 'Отклоненные']
];

export const getStatus = value =>
    nameStatusMap.find(element => element[0] === value)

