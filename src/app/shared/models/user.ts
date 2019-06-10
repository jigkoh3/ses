
export class user {
    id: string;
    name: string;
    username: string;
    password: string;
    result_datetime: string;
    client_ip: string;
    length: string;
    status: string;
    error: number;
    token: string;
    data: user_data[]
}

export class user_data {
    employee_id: number;
    employee_number: string;
    employee_username: string;
    employee_fname_th: string;
    employee_lname_th: string;
    employee_fname_en: string;
    employee_lname_en: string;
    employee_nickname: string;
    employee_position: string;
    employee_tel: string;
    employee_email: string;
    employee_type: string;
    itasset_company_id: number;
    itasset_company_name: string;
    itasset_department_id: number;
    itasset_department_name: string;
    itasset_building_id: string;
    employee_createby: string;
    employee_updateby: string;
    employee_status: string;
    employee_url: string;
    employee_keyword: string;
    fullname: string;
    employee_ext: number;
    employee_mobile: string;
    domain_id: string;
    domain_name: string;
    domain_name_eng: string;
}

export class post_auth {
    employee_id: number;
    application_code: string;
    employee_username: string;
}

export class auth_role {
    auth_role_profile: auth_role_profile[]
    auth_role_menu: auth_role_menu[]
}

export class auth_role_profile {
    permission_id: number;
    role_id: number;
    role_name: string;
    application_id: number;
    application_code: string;
    application_name: string;
    employee_id: number;
    employee_username: string;
    employee_number: string;
    employee_fname_th: string;
    employee_lname_th: string;
    employee_fname_en: string;
    employee_lname_en: string;
    employee_email: string;
    employee_domain: string;
}

export class auth_role_menu {
    role_id: number;
    application_id: number;
    menu_id: number;
    menu_name: string;
    menu_url: string;
    menu_sequence: number;
    menu_sub: number;
    menu_icon: string;
}