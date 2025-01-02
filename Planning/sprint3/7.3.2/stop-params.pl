:- dynamic generations/1.
:- dynamic valid_value/1.
:- dynamic population/1.
:- dynamic prob_crossover/1.
:- dynamic prob_mutation/1.

% surgery(Id, ProcessTime, DueTime, PenaltyWeight).
surgery(so100001, 2, 5, 1).
surgery(so100002, 4, 7, 6).
surgery(so100003, 1, 11, 2).
surgery(so100004, 3, 9, 3).
surgery(so100005, 3, 8, 2).

% surgeries(NSurgeries).
surgeries(5).

% run ?- generate.

% parameters initialization
initialize :-
  write('Number of generations before stop: '), read(NG),
  (retract(generations(_)); true), asserta(generations(NG)),
  write('Value considered valid:'), read(ValidValue),
  (retract(valid_value(_)); true), asserta(valid_value(ValidValue)),
  write('Population size: '), read(PS),
  (retract(population(_)); true), asserta(population(PS)),
  write('Probability of crossover (%):'), read(P1),
  PC is P1 / 100,
  (retract(prob_crossover(_)); true), asserta(prob_crossover(PC)),
  write('Probability of mutation (%):'), read(P2),
  PM is P2 / 100,
  (retract(prob_mutation(_)); true), asserta(prob_mutation(PM)).

generate :-
  initialize,
  generate_population(Pop),
  write('Pop='), write(Pop), nl,
  evaluate_population(Pop, PopValue),
  write('PopValue='), write(PopValue), nl,
  order_population(PopValue, PopOrd),
  generations(NG),
  valid_value(ValidValue),
  generate_generation(0, NG, ValidValue, PopOrd, 0).

generate_population(Pop) :-
  population(PopSize),
  surgeries(NumS),
  findall(Surgery, surgery(Surgery, _, _, _), SurgeriesList),
  generate_population(PopSize, SurgeriesList, NumS, Pop).

generate_population(0, _, _, []) :- !.
generate_population(PopSize, SurgeriesList, NumS, [Ind | Rest]) :-
  PopSize1 is PopSize - 1,
  generate_population(PopSize1, SurgeriesList, NumS, Rest),
  generate_individual(SurgeriesList, NumS, Ind),
  not(member(Ind, Rest)).
generate_population(PopSize, SurgeriesList, NumS, L) :-
  generate_population(PopSize, SurgeriesList, NumS, L).

generate_individual([G], 1, [G]) :- !.
generate_individual(SurgeriesList, NumS, [G | Rest]) :-
  NumTemp is NumS + 1, % to use with random
  random(1, NumTemp, N),
  remove(N, SurgeriesList, G, NewList),
  NumS1 is NumS - 1,
  generate_individual(NewList, NumS1, Rest).

remove(1, [G | Rest], G, Rest).
remove(N, [G1 | Rest], G, [G1 | Rest1]) :-
  N1 is N - 1,
  remove(N1, Rest, G, Rest1).

evaluate_population([], []).
evaluate_population([Ind | Rest], [Ind * V | Rest1]) :-
  evaluate(Ind, V),
  evaluate_population(Rest, Rest1).

evaluate(Seq, V) :- evaluate(Seq, 0, V).

evaluate([], _, 0).
evaluate([S | Rest], Inst, V) :-
  surgery(S, Dur, Due, Pen),
  FinInst is Inst + Dur,
  evaluate(Rest, FinInst, VRest),
  ((FinInst =< Due, !, VT is 0) ; (VT is (FinInst - Due) * Pen)),
  V is VT + VRest.

order_population(PopValue, PopValueOrd) :-
  bsort(PopValue, PopValueOrd).

bsort([X], [X]) :- !.
bsort([X | Xs], Ys) :-
  bsort(Xs, Zs),
  bchange([X | Zs], Ys).

bchange([X], [X]) :- !.
bchange([X * VX, Y * VY | L1], [Y * VY | L2]) :-
  VX > VY, !,
  bchange([X * VX | L1], L2).
bchange([X | L1], [X | L2]) :-
  bchange(L1, L2).

% Generate the next generation
generate_generation(G, G, _, Pop, Counter) :- !,
  nl, write('Generation '), write(Counter), write(':'), nl, write(Pop), nl.

generate_generation(N, G, ValidValue, Pop, Counter) :-
  nl, write('Generation '), write(Counter), write(':'), nl, write(Pop), nl,

  % Identify the best individual from the current population
  Pop = [Best * BestValue | _],
  write('Best individual: '), write(Best), write(' with Value: '), write(BestValue), nl,

  % Perform genetic operations
  crossover(Pop, NPop1, Mode),
  mutation(NPop1, NPop),

  % Evaluate and order the new population
  evaluate_population(NPop, NPopValue),
  order_population(NPopValue, NPopOrd),

  write('New population'), write(NPopOrd), nl,

  % Compare the best from current and new population
  NPopOrd = [_NewBest * NewBestValue | _],
  (NewBestValue @=< BestValue
    -> FinalPop = NPopOrd,  % Keep new population if no improvement

      % Increase only if the BestValue is =< ValidValue
      (BestValue @=< ValidValue
        -> N1 is N + 1,
        % debug
        write('N: '), write(N1), nl,
        write('G: '), write(G), nl,
        write('Valid value: '), write(ValidValue), nl
        ;
        N1 is 0
      ),
      nl, write('NewBest value:'), write(NewBestValue), nl,
      write('Best value:'), write(BestValue), nl
    ;  include_best(Best * BestValue, NPopOrd, FinalPop),  % Preserve best individual
      N1 is 0, % Reset if there is a new best number
      nl, write('NewBest value:'), write(NewBestValue), nl,
      write('Best value:'), write(BestValue), nl
  ),

  Counter1 is Counter + 1,

  generate_generation(N1, G, ValidValue, FinalPop, Counter1).

% Put the best individual in the first position
include_best(Best, Population, FinalPopulation) :-
  % Remove the worst individual from the population
  append(Front, [_ | Rest], Population),
  append(Front, Rest, TempPopulation),
  % Insert the best individual at the start
  append([Best], TempPopulation, FinalPopulation).

generate_crossover_points(P1, P2, Mode) :- generate_crossover_points1(P1, P2, Mode).

generate_crossover_points1(P1, P2, random) :-
  surgeries(N),
  NTemp is N + 1,
  random(1, NTemp, P11),
  random(1, NTemp, P21),
  P11 \== P21, !,
  ((P11 < P21, !, P1 = P11, P2 = P21) ; P1 = P21, P2 = P11).
generate_crossover_points1(P1, P2, random) :-
  generate_crossover_points1(P1, P2, random).

generate_crossover_points1(P1, P2, sequential) :-
  surgeries(N),
  P1 is 1,  % First point always at position 1
  P2 is N.  % Second point always at last position

crossover([], [], _).
crossover([Ind * _], [Ind], _).
crossover([Ind1 * _, Ind2 * _ | Rest], [NInd1, NInd2 | Rest1], Mode) :-
  generate_crossover_points(P1, P2, Mode),
  prob_crossover(Pcruz), random(0.0, 1.0, Pc),
  ((Pc =< Pcruz, !,
    cross(Ind1, Ind2, P1, P2, NInd1),
    cross(Ind2, Ind1, P1, P2, NInd2))
  ;
  (NInd1 = Ind1, NInd2 = Ind2)),
  crossover(Rest, Rest1, Mode).

fillh([], []).

fillh([_ | R1], [h | R2]) :-
  fillh(R1, R2).

sublist(L1, I1, I2, L) :- I1 < I2, !,
  sublist1(L1, I1, I2, L).
sublist(L1, I1, I2, L) :- sublist1(L1, I2, I1, L).

sublist1([X | R1], 1, 1, [X | H]) :- !, fillh(R1, H).
sublist1([X | R1], 1, N2, [X | R2]) :- !, N3 is N2 - 1,
  sublist1(R1, 1, N3, R2).
sublist1([_ | R1], N1, N2, [h | R2]) :- N3 is N1 - 1,
  N4 is N2 - 1,
  sublist1(R1, N3, N4, R2).

rotate_right(L, K, L1) :- surgeries(N),
  T is N - K,
  rr(T, L, L1).

rr(0, L, L) :- !.
rr(N, [X | R], R2) :- N1 is N - 1,
  append(R, [X], R1),
  rr(N1, R1, R2).

remove([], _, []) :- !.
remove([X | R1], L, [X | R2]) :- not(member(X, L)), !,
  remove(R1, L, R2).
remove([_ | R1], L, R2) :-
  remove(R1, L, R2).

insert([], L, _, L) :- !.
insert([X | R], L, N, L2) :-
  surgeries(T),
  ((N > T, !, N1 is N mod T) ; N1 = N),
  insert1(X, N1, L, L1),
  N2 is N + 1,
  insert(R, L1, N2, L2).

insert1(X, 1, L, [X | L]) :- !.
insert1(X, N, [Y | L], [Y | L1]) :-
  N1 is N - 1,
  insert1(X, N1, L, L1).

cross(Ind1, Ind2, P1, P2, NInd11) :-
  sublist(Ind1, P1, P2, Sub1),
  surgeries(NumS),
  R is NumS - P2,
  rotate_right(Ind2, R, Ind21),
  remove(Ind21, Sub1, Sub2),
  P3 is P2 + 1,
  insert(Sub2, Sub1, P3, NInd1),
  removeh(NInd1, NInd11).

removeh([], []).
removeh([h | R1], R2) :- !,
  removeh(R1, R2).
removeh([X | R1], [X | R2]) :-
  removeh(R1, R2).

mutation([], []).
mutation([Ind | Rest], [NInd | Rest1]) :-
  prob_mutation(Pmut),
  random(0.0, 1.0, Pm),
  ((Pm < Pmut, !, mutacao1(Ind, NInd)) ; NInd = Ind),
  mutation(Rest, Rest1).

mutacao1(Ind, NInd) :-
  generate_crossover_points(P1, P2, Mode),
  mutacao22(Ind, P1, P2, NInd).

mutacao22([G1 | Ind], 1, P2, [G2 | NInd]) :- !,
  P21 is P2 - 1,
  mutacao23(G1, P21, Ind, G2, NInd).
mutacao22([G | Ind], P1, P2, [G | NInd]) :-
  P11 is P1 - 1, P21 is P2 - 1,
  mutacao22(Ind, P11, P21, NInd).

mutacao23(G1, 1, [G2 | Ind], G2, [G1 | Ind]) :- !.
mutacao23(G1, P, [G | Ind], G2, [G | NInd]) :-
  P1 is P - 1,
  mutacao23(G1, P1, Ind, G2, NInd).