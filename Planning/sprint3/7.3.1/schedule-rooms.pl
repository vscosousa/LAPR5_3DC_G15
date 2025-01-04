% Dynamic facts
:- dynamic availability/3.
:- dynamic agenda_staff/3.
:- dynamic agenda_staff1/3.
:- dynamic agenda_operation_room/3.
:- dynamic agenda_operation_room1/3.
:- dynamic better_sol/5.

agenda_staff(d001,20241028,[(720,790,m01),(1080,1140,c01)]).
agenda_staff(d002,20241028,[(850,900,m02),(901,960,m02),(1380,1440,c02)]).
agenda_staff(d003,20241028,[(720,790,m01),(910,980,m02)]).
agenda_staff(d004,20241028,[(850,900,m02),(940,980,c04)]).
%Anaesthetist
agenda_staff(a001,20241028,[]).
agenda_staff(a002,20241028,[]).
%Instrumenting Nurse
agenda_staff(in001,20241028,[]).
agenda_staff(in002,20241028,[]).
%Circulating Nurse
agenda_staff(cn001,20241028,[]).
agenda_staff(cn002,20241028,[]).
%Nurse Anaesthetist
agenda_staff(na001,20241028,[]).
agenda_staff(na002,20241028,[]).
%Medical Action Assistant
agenda_staff(maa001,20241028,[]).
agenda_staff(maa002,20241028,[]).

timetable(d001,20241028,(480,1200)).
timetable(d002,20241028,(500,1440)).
timetable(d003,20241028,(520,1320)).
timetable(d004,20241028,(620,1020)).
%timetable(person,Date,(Ini,Fin)).
timetable(d001,20241028,(480,1200)).
timetable(d002,20241028,(500,1440)). %15,67 h == 15h 40 min
timetable(d003,20241028,(520,1320)). %13,34 h == 13h 20 min
timetable(d004,20241028,(620,1020)).
%Anaesthetist
timetable(a001,20241028,(600,1440)).
timetable(a002,20241028,(480,1200)).
%Instrumenting Nurse
timetable(in001,20241028,(480,1260)).
timetable(in002,20241028,(650,1440)).
%Circulating Nurse
timetable(cn001,20241028,(480,1260)).
timetable(cn002,20241028,(620,1440)).
%Nurse Anaesthetist
timetable(na001,20241028,(500,1260)).
timetable(na002,20241028,(630,1400)).
%Medical Action Assistant
timetable(maa001,20241028,(480,1070)).
timetable(maa002,20241028,(620,1400)).

%staff(IdStaff,TypeStaff,Speciality,[ListTypesOfSurgery]).
staff(d001,doctor,orthopaedist,[so2,so3,so4]).
staff(d002,doctor,orthopaedist,[so2,so3,so4]).
staff(d003,doctor,orthopaedist,[so2,so3,so4]).
staff(a001,anaesthetist,anaesthetist,[so2,so3,so4]).
staff(a002,anaesthetist,anaesthetist,[so2,so3,so4]).
staff(in001,nurse,instrumenting_nurse,[so2,so3,so4]).
staff(in002,nurse,instrumenting_nurse,[so2,so3,so4]).
staff(cn001,nurse,circulating_nurse,[so2,so3,so4]).
staff(cn002,nurse,circulating_nurse,[so2,so3,so4]).
staff(na001,nurse,nurse_anaesthetist,[so2,so3,so4]).
staff(na002,nurse,nurse_anaesthetist,[so2,so3,so4]).
staff(maa001,medical,medical_action_assistant,[so2,so3,so4]).
staff(maa002,medical,medical_action_assistant,[so2,so3,so4]).

surgery(so2,45,60,45).
surgery(so3,45,90,45).
surgery(so4,45,75,45).

surgery_id(so100001,so2).
surgery_id(so100002,so3).
surgery_id(so100003,so4).
surgery_id(so100004,so2).
surgery_id(so100005,so4).
surgery_id(so100006,so2).
surgery_id(so100007,so3).
surgery_id(so100008,so2).
%surgery_id(so100009,so2).
%surgery_id(so100010,so2).
%surgery_id(so100011,so4).
%surgery_id(so100012,so2).
%surgery_id(so100013,so2).

assignment_surgery(so100001,d001).
assignment_surgery(so100002,d002).
assignment_surgery(so100003,d003).
assignment_surgery(so100004,d001).
assignment_surgery(so100004,d002).
assignment_surgery(so100005,d002).
assignment_surgery(so100005,d003).
assignment_surgery(so100006,d001).
assignment_surgery(so100007,d003).
assignment_surgery(so100008,d004).
%assignment_surgery(so100008,d003).
%assignment_surgery(so100009,d002).
%assignment_surgery(so100009,d004).
%assignment_surgery(so100010,d003).
%assignment_surgery(so100011,d001).
%assignment_surgery(so100012,d001).
%assignment_surgery(so100013,d004).

room(or1,operating_room,orthopaedist,[so2,so3,so4]).
room(or2,operating_room,orthopaedist,[so2,so3,so4]).
room(or3,operating_room,orthopaedist,[so2,so3,so4]).

agenda_operation_room(or1,20241028,[(520,579,so100000),(1000,1059,so099999)]).
agenda_operation_room(or2,20241028,[]).
agenda_operation_room(or3,20241028,[]).

% Adding missing predicates for agenda handling
free_agenda0([],[(0,1440)]).
free_agenda0([(0,Tfin,_)|LT],LT1):-!,free_agenda1([(0,Tfin,_)|LT],LT1).
free_agenda0([(Tin,Tfin,_)|LT],[(0,T1)|LT1]):- T1 is Tin-1,
    free_agenda1([(Tin,Tfin,_)|LT],LT1).
 
free_agenda1([(_,Tfin,_)],[(T1,1440)]):-Tfin\==1440,!,T1 is Tfin+1.
free_agenda1([(_,_,_)],[]).
free_agenda1([(_,T,_),(T1,Tfin2,_)|LT],LT1):-Tx is T+1,T1==Tx,!,
    free_agenda1([(T1,Tfin2,_)|LT],LT1).
free_agenda1([(_,Tfin1,_),(Tin2,Tfin2,_)|LT],[(T1,T2)|LT1]):-T1 is Tfin1+1,T2 is Tin2-1,
    free_agenda1([(Tin2,Tfin2,_)|LT],LT1).

adapt_timetable(D,Date,LFA,LFA2):-timetable(D,Date,(InTime,FinTime)),treatin(InTime,LFA,LFA1),treatfin(FinTime,LFA1,LFA2).
 
treatin(InTime,[(In,Fin)|LFA],[(In,Fin)|LFA]):-InTime=<In,!.
treatin(InTime,[(_,Fin)|LFA],LFA1):-InTime>Fin,!,treatin(InTime,LFA,LFA1).
treatin(InTime,[(_,Fin)|LFA],[(InTime,Fin)|LFA]).
treatin(_,[],[]).
 
treatfin(FinTime,[(In,Fin)|LFA],[(In,Fin)|LFA1]):-FinTime>=Fin,!,treatfin(FinTime,LFA,LFA1).
treatfin(FinTime,[(In,_)|_],[]):-FinTime=<In,!.
treatfin(FinTime,[(In,_)|_],[(In,FinTime)]).
treatfin(_,[],[]).

% Predicate for handling intersections of agendas
intersect_all_agendas([Name],Date,LA):-!,availability(Name,Date,LA).
intersect_all_agendas([Name|LNames],Date,LI):-
    availability(Name,Date,LA),
    intersect_all_agendas(LNames,Date,LI1),
    intersect_2_agendas(LA,LI1,LI).
 
intersect_2_agendas([],_,[]).
intersect_2_agendas([D|LD],LA,LIT):-
    intersect_availability(D,LA,LI,LA1),
    intersect_2_agendas(LD,LA1,LID),
    append(LI,LID,LIT).

intersect_availability((_,_),[],[],[]).
 
intersect_availability((_,Fim),[(Ini1,Fim1)|LD],[],[(Ini1,Fim1)|LD]):-
    Fim<Ini1,!.
 
intersect_availability((Ini,Fim),[(_,Fim1)|LD],LI,LA):-
    Ini>Fim1,!,
    intersect_availability((Ini,Fim),LD,LI,LA).

intersect_availability((Ini,Fim),[(Ini1,Fim1)|LD],[(Imax,Fmin)],[(Fim,Fim1)|LD]):-
    Fim1>Fim,!,
    min_max(Ini,Ini1,_,Imax),
    min_max(Fim,Fim1,Fmin,_).
 
intersect_availability((Ini,Fim),[(Ini1,Fim1)|LD],[(Imax,Fmin)|LI],LA):-
    Fim>=Fim1,!,
    min_max(Ini,Ini1,_,Imax),
    min_max(Fim,Fim1,Fmin,_),
    intersect_availability((Fim1,Fim),LD,LI,LA).

min_max(I,I1,I,I1):- I<I1,!.
min_max(I,I1,I1,I).
 
remove_unf_intervals(_,[],[]).
remove_unf_intervals(TSurgery,[(Tin,Tfin)|LA],[(Tin,Tfin)|LA1]):-
    DT is Tfin-Tin+1,TSurgery=<DT,!,
    remove_unf_intervals(TSurgery,LA,LA1).
remove_unf_intervals(TSurgery,[_|LA],LA1):-
    remove_unf_intervals(TSurgery,LA,LA1).
 
schedule_first_interval(TSurgery,[(Tin,_)|_],(Tin,TfinS)):-
    TfinS is Tin + TSurgery - 1.
 
insert_agenda((TinS,TfinS,OpCode),[],[(TinS,TfinS,OpCode)]).
insert_agenda((TinS,TfinS,OpCode),[(Tin,Tfin,OpCode1)|LA],[(TinS,TfinS,OpCode),(Tin,Tfin,OpCode1)|LA]):-
    TfinS<Tin,!.
insert_agenda((TinS,TfinS,OpCode),[(Tin,Tfin,OpCode1)|LA],[(Tin,Tfin,OpCode1)|LA1]):-
    insert_agenda((TinS,TfinS,OpCode),LA,LA1).
 
insert_agenda_doctors(_,_,[]).
insert_agenda_doctors((TinS,TfinS,OpCode),Day,[Doctor|LDoctors]):-
    retract(agenda_staff1(Doctor,Day,Agenda)),
    insert_agenda((TinS,TfinS,OpCode),Agenda,Agenda1),
    assert(agenda_staff1(Doctor,Day,Agenda1)),
    insert_agenda_doctors((TinS,TfinS,OpCode),Day,LDoctors).

% US 7.3.1 - Schedule rooms 

% Schedule surgeries for a given day -- example usage: schedule_surgeries(20241028).
schedule_surgeries(Day) :-
    write('--- Starting scheduling for the day: '), write(Day), write(' ---'), nl, flush_output,

    write('Clearing existing dynamic facts...'), nl, flush_output,
    retractall(agenda_staff1(_,_,_)),
    retractall(agenda_operation_room1(_,_,_)),
    retractall(availability(_,_,_)),
    write('Dynamic facts cleared.'), nl, flush_output,

    write('Reinitializing staff and room agendas...'), nl, flush_output,
    findall(_, (agenda_staff(D,Day,Agenda), write('  Found staff: '), write(D), write(' - Agenda: '), write(Agenda), nl, flush_output,assertz(agenda_staff1(D,Day,Agenda))), _),
    findall(_, (agenda_operation_room(Room,Day,Agenda), write('  Found room: '), write(Room), write(' - Agenda: '), write(Agenda), nl, flush_output, assertz(agenda_operation_room1(Room,Day,Agenda))), _),
    write('Agendas reinitialized.'), nl, flush_output,

    write('Preparing staff availability...'), nl, flush_output,
    findall(_, (agenda_staff1(D,Day,L), write('  Processing staff: '), write(D), write(' - Agenda: '), write(L), nl, flush_output, free_agenda0(L,LFA),  write('    Initial free agenda: '), write(LFA), nl, flush_output, adapt_timetable(D,Day,LFA,LFA2), write('    Adapted agenda: '), write(LFA2), nl, flush_output, assertz(availability(D,Day,LFA2))), _),
    write('Availability prepared.'), nl, flush_output,

    write('Retrieving all rooms and surgeries...'), nl, flush_output,
    findall(Room, agenda_operation_room(Room, Day, _), LRooms),
    write('  Available rooms: '), write(LRooms), nl, flush_output,
    findall(OpCode, surgery_id(OpCode, _), LSurgeries),
    write('  Available surgeries: '), write(LSurgeries), nl, flush_output,

    write('Starting round-robin distribution...'), nl, flush_output,
    distribute_surgeries_to_rooms(LSurgeries, LRooms, Day),
    write('Round-robin distribution completed.'), nl, flush_output.

% Assign surgeries to rooms
distribute_surgeries_to_rooms([], _, _).
distribute_surgeries_to_rooms(LSurgeries, LRooms, Day) :-
    distribute_surgeries_round_robin(LSurgeries, LRooms, Day, 0).
 
% Round-robin distribution of surgeries
distribute_surgeries_round_robin([], _, _, _).
distribute_surgeries_round_robin([OpCode|RestSurgeries], LRooms, Day, RoomIndex) :-
    length(LRooms, NumRooms),
    CurrentRoomIndex is RoomIndex mod NumRooms,
    nth0(CurrentRoomIndex, LRooms, CurrentRoom),
    (schedule_single_surgery(OpCode, CurrentRoom, Day) -> true ; true),
    distribute_surgeries_round_robin(RestSurgeries, LRooms, Day, RoomIndex + 1).
 
% Schedule a single surgery in a room
schedule_single_surgery(OpCode, Room, Day) :-
    surgery_id(OpCode, OpType),
    surgery(OpType, _, TSurgery, _),
    findall(Doctor, assignment_surgery(OpCode, Doctor), LDoctors),
    intersect_all_agendas(LDoctors, Day, LA),
    agenda_operation_room1(Room, Day, LAgenda),
    free_agenda0(LAgenda, LFAgRoom),
    intersect_2_agendas(LA, LFAgRoom, LIntAgDoctorsRoom),
    remove_unf_intervals(TSurgery, LIntAgDoctorsRoom, LPossibilities),
    LPossibilities \= [],
    schedule_first_interval(TSurgery, LPossibilities, (TinS, TfinS)),
    retract(agenda_operation_room1(Room, Day, Agenda)),
    insert_agenda((TinS, TfinS, OpCode), Agenda, Agenda1),
    assertz(agenda_operation_room1(Room, Day, Agenda1)),
    insert_agenda_doctors((TinS, TfinS, OpCode), Day, LDoctors).
 
% After scheduling using the round robin, print the final schedule -- example usage: print_schedule(20241028).
print_schedule(Day) :-
    write('--- Schedule for'), write(Day), write(' ---'), nl, flush_output,
    findall(Room, agenda_operation_room(Room, Day, _), LRooms),
    print_rooms_schedule(LRooms, Day).

% Base case for rooms schedule
print_rooms_schedule([], _) :-
    write('--- End of schedule ---'), nl, flush_output.

% Recursive case for rooms schedule
print_rooms_schedule([Room|LRooms], Day) :-
    agenda_operation_room1(Room, Day, Schedule),
    write('Room '), write(Room), write(' Schedule: '), nl, flush_output,
    print_schedule_list(Schedule),
    print_rooms_schedule(LRooms, Day).

% Base case for individual schedules
print_schedule_list([]) :-
    write('There are no more surgeries scheduled.'), nl, flush_output.

% Recursive case for individual schedules
print_schedule_list([(Start, End, OpCode)|Rest]) :-
    write('  Surgery '), write(OpCode),  write(' from '), write(Start), write(' to '), write(End), nl, flush_output,
    print_schedule_list(Rest).
