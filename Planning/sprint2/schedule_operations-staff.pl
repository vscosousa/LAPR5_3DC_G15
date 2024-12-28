% Dynamic facts
:- dynamic availability/3, agenda_staff/3, agenda_staff1/3, agenda_operation_room/3, agenda_operation_room1/3.

%agenda_staff(person,Date,[(Ini1,Fin1,event1),(Ini2,Fin2,event2),...,(Inin,Finin,eventn)]).
agenda_staff(d001,20241028,[(720,790,m01),(1080,1140,c01)]).
agenda_staff(d002,20241028,[(850,900,m02),(901,960,m02),(1380,1440,c02)]).
agenda_staff(d003,20241028,[(720,790,m01),(910,980,m02)]).
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

%surgery(SurgeryType,TAnesthesia,TSurgery,TCleaning).
surgery(so2,45,60,45).
surgery(so3,45,90,45).
surgery(so4,45,75,45).

%surgery_id(OpCode,SurgeryType).
surgery_id(so100001,so2).
surgery_id(so100002,so3).
surgery_id(so100003,so4).
surgery_id(so100004,so2).
surgery_id(so100005,so4).

%assignment_surgery(OpCode,IdStaff).
assignment_surgery(so100001,d001).
assignment_surgery(so100002,d002).
assignment_surgery(so100003,d003).
assignment_surgery(so100004,d001).
assignment_surgery(so100004,d002).
assignment_surgery(so100005,d002).
assignment_surgery(so100005,d003).

%agenda_operation_room(room,Date,[(Ini1,Fin1,OpCode1),(Ini2,Fin2,OpCode2),...,(Inin,Finin,OpCoden)]).
agenda_operation_room(or1,20241028,[(520,579,so100000),(1000,1059,so099999)]).

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

intersect_all_agendas([Name],Date,LA):-!,availability(Name,Date,LA).
intersect_all_agendas([Name|LNames],Date,LI):-
    availability(Name,Date,LA),
    intersect_all_agendas(LNames,Date,LI1),
    intersect_2_agendas(LA,LI1,LI).

intersect_2_agendas([],_,[]).
intersect_2_agendas([D|LD],LA,LIT):-	intersect_availability(D,LA,LI,LA1),
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

schedule_all_surgeries(Room,Day):- 
    write('Starting schedule_all_surgeries\n'), nl,
    retractall(agenda_staff1(_,_,_)), 
    retractall(agenda_operation_room1(_,_,_)), 
    retractall(availability(_,_,_)), 
    findall(_,(agenda_staff(D,Day,Agenda),assertz(agenda_staff1(D,Day,Agenda))),_), 
    agenda_operation_room(Or,Date,Agenda),assert(agenda_operation_room1(Or,Date,Agenda)), 
    findall(_,(agenda_staff1(D,Date,L),free_agenda0(L,LFA),adapt_timetable(D,Date,LFA,LFA2),assertz(availability(D,Date,LFA2))),_), 
    findall(OpCode,surgery_id(OpCode,_),LOpCode), 
    write('LOpCode: '), write(LOpCode), nl,
    availability_all_surgeries(LOpCode,Room,Day),!.

availability_all_surgeries([],_,_):- 
    write('\nNo more surgeries to schedule'), nl.
availability_all_surgeries([OpCode|LOpCode],Room,Day):- 
    write('-----------------------------------------------'), nl,
    write('Scheduling surgery: '), write(OpCode), nl,
    surgery_id(OpCode,OpType), 
    surgery(OpType,_,TSurgery,_), 
    availability_operation(OpCode,Room,Day,LPossibilities,LStaff), 
    write('\nLPossibilities: '), write(LPossibilities), nl,
    schedule_first_interval(TSurgery,LPossibilities,(TinS,TfinS)), 
    write('\nScheduled interval: '), write((TinS,TfinS)), nl,
    % Atualizar sala de operação 
    retract(agenda_operation_room1(Room,Day,Agenda)), 
    insert_agenda((TinS,TfinS,OpCode),Agenda,Agenda1), 
    assertz(agenda_operation_room1(Room,Day,Agenda1)), 
    % Atualizar agendas do staff 
    write('\nUpdating staff agendas'), nl,
    insert_agenda((TinS,TfinS,OpCode),Agenda,Agenda1),
    write('\nAgenda1: '), write(Agenda1), nl,
    availability_all_surgeries(LOpCode,Room,Day).

availability_operation(OpCode,Room,Day,LPossibilities,LStaff):- 
    write('\nChecking availability for operation: '), write(OpCode), nl,
    surgery_id(OpCode,OpType), 
    surgery(OpType,_,TSurgery,_), 
    % Identificar doutores atribuidos a uma determinada cirurgia 
    findall(Doctor, assignment_surgery(OpCode,Doctor), LDoctors), 
    %write('LDoctors: '), write(LDoctors), nl,
    findall(Anaesthetist, staff(Anaesthetist, anaesthetist, anaesthetist, _), LAnaesthetists),
    %write('LAnaesthetists: '), write(LAnaesthetists), nl,
    findall(InstrumentingNurse, staff(InstrumentingNurse, nurse, instrumenting_nurse, _), LInstrumentingNurses),
    %write('LInstrumentingNurses: '), write(LInstrumentingNurses), nl,
    findall(CirculatingNurse, staff(CirculatingNurse, nurse, circulating_nurse, _), LCirculatingNurses),
    %write('LCirculatingNurses: '), write(LCirculatingNurses), nl,
    findall(NurseAnaesthetist, staff(NurseAnaesthetist, nurse, nurse_anaesthetist, _), LNurseAnaesthetists),
    %write('LNurseAnaesthetists: '), write(LNurseAnaesthetists), nl,
    findall(MedicalActionAssistant, staff(MedicalActionAssistant, medical, medical_action_assistant, _), LMedicalActionAssistants),
    %write('LMedicalActionAssistants: '), write(LMedicalActionAssistants), nl,
    % Interseção das agendas dos doutores e staff adicional 
    intersect_all_agendas(LDoctors,Day,LA_Doctors), 
    intersect_all_agendas(LAnaesthetists,Day,LA_Anaesthetists),
    intersect_all_agendas(LInstrumentingNurses,Day,LA_InstrumentingNurses),
    intersect_all_agendas(LCirculatingNurses,Day,LA_CirculatingNurses),
    intersect_all_agendas(LNurseAnaesthetists,Day,LA_NurseAnaesthetists),
    intersect_all_agendas(LMedicalActionAssistants,Day,LA_MedicalActionAssistants),
    intersect_2_agendas(LA_Doctors,LA_Anaesthetists,LStaff),
    %intersect_2_agendas(LA_All,LA_InstrumentingNurses,LA_All),
    %intersect_2_agendas(LA_All,LA_CirculatingNurses,LA_All),
    %intersect_2_agendas(LA_All,LA_NurseAnaesthetists,LA_All),
    %intersect_2_agendas(LA_All,LA_MedicalActionAssistants,LA_All),
    agenda_operation_room1(Room,Day,LAgenda), 
    free_agenda0(LAgenda,LFAgRoom), 
    intersect_2_agendas(LStaff,LFAgRoom,LIntAgDoctorsRoom), 
    remove_unf_intervals(TSurgery,LIntAgDoctorsRoom,LPossibilities),
    write('\nLPossibilities after filtering: '), write(LPossibilities), nl.

remove_unf_intervals(_,[],[]).
remove_unf_intervals(TSurgery,[(Tin,Tfin)|LA],[(Tin,Tfin)|LA1]):-DT is Tfin-Tin+1,TSurgery=<DT,!, 
    remove_unf_intervals(TSurgery,LA,LA1).
remove_unf_intervals(TSurgery,[_|LA],LA1):- remove_unf_intervals(TSurgery,LA,LA1).

schedule_first_interval(TSurgery,[(Tin,_)|_],(Tin,TfinS)):-
    TfinS is Tin + TSurgery - 1.

insert_agenda((TinS,TfinS,OpCode),[],[(TinS,TfinS,OpCode)]).
insert_agenda((TinS,TfinS,OpCode),[(Tin,Tfin,OpCode1)|LA],[(TinS,TfinS,OpCode),(Tin,Tfin,OpCode1)|LA]):-TfinS<Tin,!.
insert_agenda((TinS,TfinS,OpCode),[(Tin,Tfin,OpCode1)|LA],[(Tin,Tfin,OpCode1)|LA1]):-insert_agenda((TinS,TfinS,OpCode),LA,LA1).

insert_agenda_doctors(_,_,[]).
insert_agenda_doctors((TinS,TfinS,OpCode),Day,[Doctor|LDoctors]):-
    retract(agenda_staff1(Doctor,Day,Agenda)),
    insert_agenda((TinS,TfinS,OpCode),Agenda,Agenda1),
    assert(agenda_staff1(Doctor,Day,Agenda1)),
    insert_agenda_doctors((TinS,TfinS,OpCode),Day,LDoctors).

obtain_better_sol(Room,Day,AgOpRoomBetter,LAgDoctorsBetter,TFinOp):-
    get_time(Ti),
    (obtain_better_sol1(Room,Day);true),
    retract(better_sol(Day,Room,AgOpRoomBetter,LAgDoctorsBetter,TFinOp)),
    write('Final Result: AgOpRoomBetter='),write(AgOpRoomBetter),nl,
    write('LAgDoctorsBetter='),write(LAgDoctorsBetter),nl,
    write('TFinOp='),write(TFinOp),nl,
    get_time(Tf),
    T is Tf-Ti,
    write('Tempo de geracao da solucao:'),write(T),nl.

obtain_better_sol1(Room,Day):-
    asserta(better_sol(Day,Room,_,_,1441)),
    findall(OpCode,surgery_id(OpCode,_),LOC),!,
    permutation(LOC,LOpCode),
    retractall(agenda_staff1(_,_,_)),
    retractall(agenda_operation_room1(_,_,_)),
    retractall(availability(_,_,_)),
    findall(_,(agenda_staff(D,Day,Agenda),assertz(agenda_staff1(D,Day,Agenda))),_),
    agenda_operation_room(Room,Day,Agenda),assert(agenda_operation_room1(Room,Day,Agenda)),
    findall(_,(agenda_staff1(D,Day,L),free_agenda0(L,LFA),adapt_timetable(D,Day,LFA,LFA2),assertz(availability(D,Day,LFA2))),_),
    availability_all_surgeries(LOpCode,Room,Day),
    agenda_operation_room1(Room,Day,AgendaR),
    update_better_sol(Day,Room,AgendaR,LOpCode),
    fail.

update_better_sol(Day,Room,Agenda,LOpCode):-
    better_sol(Day,Room,_,_,FinTime),
    reverse(Agenda,AgendaR),
    evaluate_final_time(AgendaR,LOpCode,FinTime1),
    write('Analysing for LOpCode='),write(LOpCode),nl,
    write('now: FinTime1='),write(FinTime1),write(' Agenda='),write(Agenda),nl,
    FinTime1<FinTime,
    write('best solution updated'),nl,
    retract(better_sol(_,_,_,_,_)),
    findall(Doctor,assignment_surgery(_,Doctor),LDoctors1),
    remove_equals(LDoctors1,LDoctors),
    list_doctors_agenda(Day,LDoctors,LDAgendas),
    asserta(better_sol(Day,Room,Agenda,LDAgendas,FinTime1)).

evaluate_final_time([],_,1441).
evaluate_final_time([(_,Tfin,OpCode)|_],LOpCode,Tfin):-member(OpCode,LOpCode),!.
evaluate_final_time([_|AgR],LOpCode,Tfin):-evaluate_final_time(AgR,LOpCode,Tfin).

list_doctors_agenda(_,[],[]).
list_doctors_agenda(Day,[D|LD],[(D,AgD)|LAgD]):-agenda_staff1(D,Day,AgD),list_doctors_agenda(Day,LD,LAgD).

remove_equals([],[]).
remove_equals([X|L],L1):-member(X,L),!,remove_equals(L,L1).
remove_equals([X|L],[X|L1]):-remove_equals(L,L1).
