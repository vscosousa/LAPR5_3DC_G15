# Plano de Testes Unitários

Este documento fornece uma visão geral dos testes unitários relacionados aos diferentes componentes do sistema. Os testes são divididos por container de teste e cada um deles verifica a funcionalidade de criação, atualização, recuperação e listagem de dados.

## Sumário

- [Testes Unitários para `allergy.test.ts`](#testes-unitários-para-allergytests)
- [Testes Unitários para `specialization.test.ts`](#testes-unitários-para-specializationtests)
- [Testes Unitários para `patientMedicalHistory.test.ts`](#testes-unitários-para-patientmedicalhistorytests)
- [Testes Unitários para `medicalCondition.test.ts`](#testes-unitários-para-medicalconditiontests)
- [Testes Unitários para `appointment.test.ts`](#testes-unitários-para-appointmenttests)
- [Resumo do Número de Testes](#resumo-do-número-de-testes)

## Testes Unitários para `allergy.test.ts`

1. **should create an allergy successfully**
   - **Propósito**: Verificar se uma nova alergia é criada com sucesso.
   - **Resultado Esperado**: A alergia é criada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste Unitário

2. **should fail to create an allergy with missing properties**
   - **Propósito**: Verificar se a criação de uma alergia falha quando propriedades estão faltando.
   - **Resultado Esperado**: A criação da alergia falha.
   - **Tipo de Teste**: Teste Unitário

3. **should set and get allergy properties**
   - **Propósito**: Verificar se as propriedades da alergia podem ser definidas e recuperadas corretamente.
   - **Resultado Esperado**: As propriedades da alergia são definidas e recuperadas corretamente.
   - **Tipo de Teste**: Teste Unitário

4. **should create an allergy with a specific id**
   - **Propósito**: Verificar se uma alergia é criada com um ID específico.
   - **Resultado Esperado**: A alergia é criada com o ID especificado.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `specialization.test.ts`

1. **should create a specialization successfully**
   - **Propósito**: Verificar se uma nova especialização é criada com sucesso.
   - **Resultado Esperado**: A especialização é criada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste Unitário

2. **should fail to create a specialization with missing properties**
   - **Propósito**: Verificar se a criação de uma especialização falha quando propriedades estão faltando.
   - **Resultado Esperado**: A criação da especialização falha.
   - **Tipo de Teste**: Teste Unitário

3. **should create a specialization with a specific id**
   - **Propósito**: Verificar se uma especialização é criada com um ID específico.
   - **Resultado Esperado**: A especialização é criada com o ID especificado.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `patientMedicalHistory.test.ts`

1. **should create a patient medical history successfully**
   - **Propósito**: Verificar se um novo histórico médico do paciente é criado com sucesso.
   - **Resultado Esperado**: O histórico médico do paciente é criado e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste Unitário

2. **should fail to create a patient medical history with missing properties**
   - **Propósito**: Verificar se a criação de um histórico médico do paciente falha quando propriedades estão faltando.
   - **Resultado Esperado**: A criação do histórico médico do paciente falha.
   - **Tipo de Teste**: Teste Unitário

3. **should set and get patient medical history properties**
   - **Propósito**: Verificar se as propriedades do histórico médico do paciente podem ser definidas e recuperadas corretamente.
   - **Resultado Esperado**: As propriedades do histórico médico do paciente são definidas e recuperadas corretamente.
   - **Tipo de Teste**: Teste Unitário

4. **should create a patient medical history with a specific id**
   - **Propósito**: Verificar se um histórico médico do paciente é criado com um ID específico.
   - **Resultado Esperado**: O histórico médico do paciente é criado com o ID especificado.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `medicalCondition.test.ts`

1. **should create a medical condition successfully**
   - **Propósito**: Verificar se uma nova condição médica é criada com sucesso.
   - **Resultado Esperado**: A condição médica é criada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste Unitário

2. **should fail to create a medical condition with missing properties**
   - **Propósito**: Verificar se a criação de uma condição médica falha quando propriedades estão faltando.
   - **Resultado Esperado**: A criação da condição médica falha.
   - **Tipo de Teste**: Teste Unitário

3. **should set and get medical condition properties**
   - **Propósito**: Verificar se as propriedades da condição médica podem ser definidas e recuperadas corretamente.
   - **Resultado Esperado**: As propriedades da condição médica são definidas e recuperadas corretamente.
   - **Tipo de Teste**: Teste Unitário

4. **should create a medical condition with a specific id**
   - **Propósito**: Verificar se uma condição médica é criada com um ID específico.
   - **Resultado Esperado**: A condição médica é criada com o ID especificado.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `appointment.test.ts`

1. **should create an appointment successfully**
   - **Propósito**: Verificar se uma nova consulta é criada com sucesso.
   - **Resultado Esperado**: A consulta é criada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste Unitário

2. **should fail to create an appointment with missing properties**
   - **Propósito**: Verificar se a criação de uma consulta falha quando propriedades estão faltando.
   - **Resultado Esperado**: A criação da consulta falha.
   - **Tipo de Teste**: Teste Unitário

3. **should set and get appointment properties**
   - **Propósito**: Verificar se as propriedades da consulta podem ser definidas e recuperadas corretamente.
   - **Resultado Esperado**: As propriedades da consulta são definidas e recuperadas corretamente.
   - **Tipo de Teste**: Teste Unitário

4. **should create an appointment with a specific id**
   - **Propósito**: Verificar se uma consulta é criada com um ID específico.
   - **Resultado Esperado**: A consulta é criada com o ID especificado.
   - **Tipo de Teste**: Teste Unitário

## Resumo do Número de Testes

- **Allergy**: 4 testes
- **Specialization**: 3 testes
- **Patient Medical History**: 4 testes
- **Medical Condition**: 4 testes
- **Appointment**: 4 testes