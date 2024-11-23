:- use_module(library(http/json)).
:- use_module(library(http/http_client)).
:- use_module(library(http/http_json)).

:- dynamic staff/9.

send_login_request(URL, Email, Password, Token) :-
    Payload = json{email: Email, password: Password},
    http_post(URL,
              json(Payload),
              ResponseString,
              []),
    Token = ResponseString.

assert_staff_info([]).
assert_staff_info([Staff | Rest]) :-
    assertz(staff(Staff.id, Staff.fullName, Staff.email, Staff.phoneNumber, Staff.licenseNumber, Staff.specializationId, Staff.staffType, Staff.isActive, Staff.availabilitySlots)),
    assert_staff_info(Rest).

get_all_staffs(URL, Token) :-
    atomic_list_concat(['Bearer ', Token], BearerToken),
    catch(
        http_get(URL, ResponseJson, [json_object(dict), request_header('Authorization'=BearerToken), status_code(StatusCode)]),
        error(existence_error(http_reply, _), _),
        fail
    ),
    ( StatusCode = 200 ->
        assert_staff_info(ResponseJson)
    ; fail
    ).

print_all_dynamic_staffs :-
    forall(staff(Id, FullName, Email, PhoneNumber, LicenseNumber, SpecializationId, StaffType, IsActive, AvailabilitySlots),
           ( format('Staff ID: ~w~n', [Id]),
             format('Full Name: ~w~n', [FullName]),
             format('Email: ~w~n', [Email]),
             format('Phone Number: ~w~n', [PhoneNumber]),
             format('License Number: ~w~n', [LicenseNumber]),
             format('Specialization ID: ~w~n', [SpecializationId]),
             format('Staff Type: ~w~n', [StaffType]),
             format('Is Active: ~w~n', [IsActive]),
             format('Availability Slots: ~w~n', [AvailabilitySlots]),
             nl
           )).

example :-
    LoginURL = 'https://localhost:5001/api/user/login',
    StaffsURL = 'https://localhost:5001/api/staff',
    Email = 'admin@email.com',
    Password = 'Adminadmin1@',
    send_login_request(LoginURL, Email, Password, Token),
    get_all_staffs(StaffsURL, Token),
    print_all_dynamic_staffs.