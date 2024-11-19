:- use_module(library(http/json)).
:- use_module(library(error)).
:- use_module(library(http/http_client)).

send_login_request(URL, Email, Password) :-
    Payload = json{email: Email, password: Password},
    format('Sending login request with payload: ~w~n', [Payload]),
    http_post(URL,
              json(Payload),
              Response,
              [headers([('Content-Type', 'application/json')])]),
    format('Response received: ~w~n', [Response]).
