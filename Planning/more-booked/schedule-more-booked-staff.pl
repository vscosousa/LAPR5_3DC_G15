:- dynamic availability/3.
:- dynamic agenda_staff/3.
:- dynamic agenda_staff1/3.
:- dynamic agenda_operation_room/3.
:- dynamic agenda_operation_room1/3.
:- dynamic heuristic_sol/5.
 
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

staff(d001,doctor,orthopaedist,[so2,so3,so4]).
staff(d002,doctor,orthopaedist,[so2,so3,so4]).
staff(d003,doctor,orthopaedist,[so2,so3,so4]).
staff(d004,doctor,orthopaedist,[so2,so3,so4]).

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

%Example of scheduling heuristics
%obtain_heuristic_sol(or1, 20241028, AgOpRoomBetter, LAgDoctorsBetter, TFinOp).
 
surgery(so2,45,60,45).
surgery(so3,45,90,45).
surgery(so4,45,75,45).
 
 
surgery_id(so100001,so2).
surgery_id(so100002,so3).
surgery_id(so100003,so4).
%surgery_id(so100004,so2).
%surgery_id(so100005,so4).
%surgery_id(so100006,so2).
%surgery_id(so100007,so3).
%surgery_id(so100008,so2).
%surgery_id(so100009,so2).
%surgery_id(so100010,so2).
%surgery_id(so100011,so4).
%surgery_id(so100012,so2).
%surgery_id(so100013,so2).
 
assignment_surgery(so100001,d001).
assignment_surgery(so100002,d002).
assignment_surgery(so100003,d003).
%assignment_surgery(so100004,d001).
%assignment_surgery(so100004,d002).
%assignment_surgery(so100005,d002).
%assignment_surgery(so100005,d003).
%assignment_surgery(so100006,d001).
%assignment_surgery(so100007,d003).
%assignment_surgery(so100008,d004).
%assignment_surgery(so100008,d003).
%assignment_surgery(so100009,d002).
%assignment_surgery(so100009,d004).
%assignment_surgery(so100010,d003).
%assignment_surgery(so100011,d001).
%assignment_surgery(so100012,d001).
%assignment_surgery(so100013,d004).
 
agenda_operation_room(or1,20241028,[(520,579,so100000),(1000,1059,so099999)]).
 
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
 
adapt_timetable(D,Date,LFA,LFA2):-timetable(D,Date,(InTime,FinTime)),
    treatin(InTime,LFA,LFA1),treatfin(FinTime,LFA1,LFA2).
 
treatin(InTime,[(In,Fin)|LFA],[(In,Fin)|LFA]):-InTime=<In,!.
treatin(InTime,[(_,Fin)|LFA],LFA1):-InTime>Fin,!,treatin(InTime,LFA,LFA1).
treatin(InTime,[(_,Fin)|LFA],[(InTime,Fin)|LFA]).
treatin(_,[],[]).
 
treatfin(FinTime,[(In,Fin)|LFA],[(In,Fin)|LFA1]):-FinTime>=Fin,!,treatfin(FinTime,LFA,LFA1).
treatfin(FinTime,[(In,_)|_],[]):-FinTime=<In,!.
treatfin(FinTime,[(In,_)|_],[(In,FinTime)]).
treatfin(_,[],[]).
 
% Predicate for handling intersections of agendas
intersect_all_agendas([Name], Date, LA) :- !, availability(Name, Date, LA).
intersect_all_agendas([Name|LNames], Date, LI) :-
    availability(Name, Date, LA),
    intersect_all_agendas(LNames, Date, LI1),
    intersect_2_agendas(LA, LI1, LI).

intersect_2_agendas([], _, []).
intersect_2_agendas([D|LD], LA, LIT) :-
    intersect_availability(D, LA, LI, LA1),
    intersect_2_agendas(LD, LA1, LID),
    append(LI, LID, LIT).

intersect_availability((_, _), [], [], []).
intersect_availability((_, Fim), [(Ini1, Fim1)|LD], [], [(Ini1, Fim1)|LD]) :-
    Fim < Ini1, !.
intersect_availability((Ini, Fim), [(_, Fim1)|LD], LI, LA) :-
    Ini > Fim1, !,
    intersect_availability((Ini, Fim), LD, LI, LA).
intersect_availability((Ini, Fim), [(Ini1, Fim1)|LD], [(Imax, Fmin)], [(Fim, Fim1)|LD]) :-
    Fim1 > Fim, !,
    min_max(Ini, Ini1, _, Imax),
    min_max(Fim, Fim1, Fmin, _).
intersect_availability((Ini, Fim), [(Ini1, Fim1)|LD], [(Imax, Fmin)|LI], LA) :-
    Fim >= Fim1, !,
    min_max(Ini, Ini1, _, Imax),
    min_max(Fim, Fim1, Fmin, _),
    intersect_availability((Fim1, Fim), LD, LI, LA).

min_max(I, I1, I, I1) :- I < I1, !.
min_max(I, I1, I1, I).
 
% Predicate to evaluate final time
evaluate_final_time([],_,1441).
evaluate_final_time([(_,Tfin,OpCode)|_],LOpCode,Tfin):-member(OpCode,LOpCode),!.
evaluate_final_time([_|AgR],LOpCode,Tfin):-evaluate_final_time(AgR,LOpCode,Tfin).
 
% Predicate to remove duplicates
remove_equals([],[]).
remove_equals([X|L],L1):-member(X,L),!,remove_equals(L,L1).
remove_equals([X|L],[X|L1]):-remove_equals(L,L1).
 
% Predicate to get doctors' agendas
list_doctors_agenda(_,[],[]).
list_doctors_agenda(Day,[D|LD],[(D,AgD)|LAgD]):-
    agenda_staff1(D,Day,AgD),
    list_doctors_agenda(Day,LD,LAgD).
 
% Predicate to insert into agenda
insert_agenda((TinS,TfinS,OpCode),[],[(TinS,TfinS,OpCode)]).
insert_agenda((TinS,TfinS,OpCode),[(Tin,Tfin,OpCode1)|LA],[(TinS,TfinS,OpCode),(Tin,Tfin,OpCode1)|LA]):-
    TfinS<Tin,!.
insert_agenda((TinS,TfinS,OpCode),[(Tin,Tfin,OpCode1)|LA],[(Tin,Tfin,OpCode1)|LA1]):-
    insert_agenda((TinS,TfinS,OpCode),LA,LA1).
 
% Predicate to insert into doctors' agendas
insert_agenda_doctors(_,_,[]).
insert_agenda_doctors((TinS,TfinS,OpCode),Day,[Doctor|LDoctors]):-
    retract(agenda_staff1(Doctor,Day,Agenda)),
    insert_agenda((TinS,TfinS,OpCode),Agenda,Agenda1),
    assert(agenda_staff1(Doctor,Day,Agenda1)),
    insert_agenda_doctors((TinS,TfinS,OpCode),Day,LDoctors).

insert_agenda_staff(_,_,[]).
insert_agenda_staff((TinS,TfinS,OpCode),Day,[Staff|LStaff]):-
    retract(agenda_staff1(Staff,Day,Agenda)),
    insert_agenda((TinS,TfinS,OpCode),Agenda,Agenda1),
    assert(agenda_staff1(Staff,Day,Agenda1)),
    insert_agenda_staff((TinS,TfinS,OpCode),Day,LStaff).
 
% Predicate for operation availability
availability_operation(OpCode, Room, Day, LPossibilities, LDoctors) :-
    surgery_id(OpCode, OpType),
    surgery(OpType, _, TSurgery, _),
    findall(Doctor, assignment_surgery(OpCode, Doctor), LDoctors),
    intersect_all_agendas(LDoctors, Day, LA),
    agenda_operation_room1(Room, Day, LAgenda),
    free_agenda0(LAgenda, LFAgRoom),
    intersect_2_agendas(LA, LFAgRoom, LIntAgDoctorsRoom),
    remove_unf_intervals(TSurgery, LIntAgDoctorsRoom, LPossibilities),
    format('~n--------------------------------------------------------------------------------------------~n', []),
    format('~nAvailable slots for surgery ~w: ~w~n', [OpCode, LPossibilities]).
 
% Predicate to remove unfeasible intervals
remove_unf_intervals(_, [], []).
remove_unf_intervals(TSurgery, [(Tin, Tfin)|LA], [(Tin, Tfin)|LA1]) :-
    DT is Tfin - Tin + 1, TSurgery =< DT, !,
    remove_unf_intervals(TSurgery, LA, LA1).
remove_unf_intervals(TSurgery, [_|LA], LA1) :-
    remove_unf_intervals(TSurgery, LA, LA1).
 
% Predicate to schedule first interval
schedule_first_interval(TSurgery, [(Tin, _)|_], (Tin, TfinS)) :-
    TfinS is Tin + TSurgery - 1.

find_busiest_available_doctor(OpCode, Day, BusiestDoctor, EarliestTime) :-
    surgery_id(OpCode, OpType),
    surgery(OpType, _, TSurgery, _),
    findall(Doctor, assignment_surgery(OpCode, Doctor), Doctors),
    findall((Doctor, BusyCount, Earliest), (
        member(Doctor, Doctors),
        availability(Doctor, Day, Availabilities),
        format('~nAvailability for Doctor ~w: ~w~n', [Doctor, Availabilities]),
        timetable(Doctor, Day, (Start, End)),
        TotalTime is End - Start,
        agenda_staff1(Doctor, Day, CurrentAgenda),
        calculate_total_workload(CurrentAgenda, Durations),
        OcupiedTime is TotalTime - Durations,
        BusyCount is (OcupiedTime / TotalTime) * 100,
        format('Current agenda for Doctor ~w: ~w (BusyCount: ~3f)~n', [Doctor, CurrentAgenda, BusyCount]),
        member((AvailStart, AvailEnd), Availabilities),
        Duration is AvailEnd - AvailStart,
        Duration >= TSurgery,
        Earliest = AvailStart
    ), DoctorData),
    format('Doctor data (BusyCount and Earliest available time): ~w~n', [DoctorData]),
    % Select the busiest doctor and see what is the earliest time available
    sort(2, @>=, DoctorData, SortedByBusy),
    format('Sorted data for busiest doctor: ~w~n', [SortedByBusy]),
    SortedByBusy = [(BusiestDoctor, BusyCount, EarliestTime) | _],
    format('Selected busiest doctor: ~w with earliest time: ~w (BusyCount: ~3f)~n', [BusiestDoctor, EarliestTime, BusyCount]).

calculate_total_workload([], 0).
calculate_total_workload([(Start, End, _) | Rest], TotalWorkload) :-
    calculate_total_workload(Rest, TotalWorkload1),
    TotalWorkload is TotalWorkload1 + End - Start.

% Modified heuristic scheduling
schedule_surgery_heuristic(OpCode, Room, Day) :-
    find_busiest_available_doctor(OpCode, Day, EarliestDoctor, StartTime),
    surgery_id(OpCode, OpType),
    surgery(OpType, _, TSurgery, _),
    EndTime is StartTime + TSurgery - 1,

    % Update operation room agenda
    retract(agenda_operation_room1(Room, Day, Agenda)),
    insert_agenda((StartTime, EndTime, OpCode), Agenda, NewAgenda),
    assertz(agenda_operation_room1(Room, Day, NewAgenda)),
    format('~nSurgery ~w inserted into room ~w agenda: (~w, ~w)~n', [OpCode, Room, StartTime, EndTime]),

    % Update only the earliest doctor's agenda first
    insert_agenda_doctors((StartTime, EndTime, OpCode), Day, [EarliestDoctor]),

    % Then update other assigned doctors' agendas if any
    findall(Doc, (assignment_surgery(OpCode, Doc), Doc \= EarliestDoctor), OtherDocs),
    insert_agenda_doctors((StartTime, EndTime, OpCode), Day, OtherDocs).

    % Update schedules for other staff
    findall(Anaesthetist, assignment_surgery(OpCode, Anaesthetist), LAnaesthetists),
    insert_agenda_staff((StartTime, EndTime, OpCode), Day, LAnaesthetists),

    findall(InstrumentingNurse, assignment_surgery(OpCode, InstrumentingNurse), LInstrumentingNurses),
    insert_agenda_staff((StartTime, EndTime, OpCode), Day, LInstrumentingNurses),

    findall(CirculatingNurse, assignment_surgery(OpCode, CirculatingNurse), LCirculatingNurses),
    insert_agenda_staff((StartTime, EndTime, OpCode), Day, LCirculatingNurses),

    findall(NurseAnaesthetist, assignment_surgery(OpCode, NurseAnaesthetist), LNurseAnaesthetists),
    insert_agenda_staff((StartTime, EndTime, OpCode), Day, LNurseAnaesthetists),

    findall(Medical, assignment_surgery(OpCode, Medical), LMedicals),
    insert_agenda_staff((StartTime, EndTime, OpCode), Day, LMedicals).


obtain_heuristic_sol(Room, Day, AgOpRoomBetter, LAgDoctorsBetter, TFinOp) :-
    get_time(Ti),

    % Initialize schedules
    retractall(agenda_staff1(_, _, _)),
    retractall(agenda_operation_room1(_, _, _)),
    retractall(availability(_, _, _)),

    % Set up initial agendas
    findall(_, (
        agenda_staff(D, Day, Agenda),
        assertz(agenda_staff1(D, Day, Agenda))
    ), _),

    agenda_operation_room(Room, Day, Agenda),
    assert(agenda_operation_room1(Room, Day, Agenda)),

    % Calculate initial availabilities
    findall(_, (
        agenda_staff1(D, Day, L),
        free_agenda0(L, LFA),
        adapt_timetable(D, Day, LFA, LFA2),
        assertz(availability(D, Day, LFA2))
    ), _),

 % Get all surgeries
    findall(OpCode, surgery_id(OpCode, _), LOC),

    % Schedule each surgery using the heuristic
    schedule_all_surgeries_heuristic(LOC, Room, Day),

    % Get final schedule
    agenda_operation_room1(Room, Day, FinalAgenda),
    findall(Doctor, assignment_surgery(_, Doctor), LDoctors1),
    remove_equals(LDoctors1, LDoctors),
    list_doctors_agenda(Day, LDoctors, LAgendas),

    % Calculate final time
    reverse(FinalAgenda, ReversedAgenda),
    evaluate_final_time(ReversedAgenda, LOC, FinalTime),

    % Store results
    AgOpRoomBetter = FinalAgenda,
    LAgDoctorsBetter = LAgendas,
    TFinOp = FinalTime,

    get_time(Tf),
    T is Tf - Ti,

    % Output results
    format('~n--------------------------------------------------------------------------------------------~n', []),
    format('~nFinal Result with Heuristic:~n', []),
    format('~nOperation Room Schedule: ~w~n', [AgOpRoomBetter]),
    format('~nDoctors Schedules: ~w~n', [LAgDoctorsBetter]),
    format('~nFinal Time: ~w~n', [TFinOp]),
    format('~nTime to generate solution: ~2f seconds~n~n', [T]).

choose_best_slot(Slots, Duration, BestSlot, UnavailableSlots) :-
    maplist(calculate_finish_time(Duration), Slots, SlotsWithEndTimes),
    format('~nSlots with end times: ~w~n', [SlotsWithEndTimes]),
    keysort(SlotsWithEndTimes, SortedSlots),
    format('Sorted slots: ~w~n', [SortedSlots]),
    find_best_slot(SortedSlots, UnavailableSlots, BestSlot).

find_best_slot([_-(Start, End) | _], UnavailableSlots, (Start, End)) :-
    \+ member((Start, End), UnavailableSlots), !.
find_best_slot([_ | Rest], UnavailableSlots, BestSlot) :-
    find_best_slot(Rest, UnavailableSlots, BestSlot).

calculate_finish_time(Duration, (Start, End), FinishTime-(Start, End)) :-
    FinishTime is Start + Duration,
    FinishTime =< End.

schedule_all_surgeries_heuristic([], _, _).
schedule_all_surgeries_heuristic([OpCode | Rest], Room, Day) :-
    surgery_id(OpCode, OpType),
    surgery(OpType, _, TSurgery, _),

    % Find earliest available time slot using the heuristic
    availability_operation(OpCode, Room, Day, LPossibilities, _),
    (LPossibilities \= [] ->
        schedule_surgery_heuristic(OpCode, Room, Day),
        schedule_first_interval(TSurgery, LPossibilities, (TinS, TfinS)),

        % Update schedules
        retract(agenda_operation_room1(Room, Day, Agenda)),
        insert_agenda((TinS, TfinS, OpCode), Agenda, Agenda1),
        assertz(agenda_operation_room1(Room, Day, Agenda1)),

        % Update doctors' schedules
        findall(Doctor, assignment_surgery(OpCode, Doctor), LDoctors),
        insert_agenda_doctors((TinS, TfinS, OpCode), Day, LDoctors),

        % Update availabilities
        retractall(availability(_, Day, _)),
        findall(_, (
            agenda_staff1(D, Day, L),
            free_agenda0(L, LFA),
            adapt_timetable(D, Day, LFA, LFA2),
            assertz(availability(D, Day, LFA2))
        ), _)
    ;   format('No available slots for surgery ~w~n', [OpCode])
    ),

    % Continue with next surgery
    schedule_all_surgeries_heuristic(Rest, Room, Day).