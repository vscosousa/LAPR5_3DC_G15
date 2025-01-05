# Plano de Testes Unitários

Este documento fornece uma visão geral dos testes unitários relacionados aos diferentes componentes do sistema. Os testes são divididos por container de teste e cada um deles verifica a funcionalidade de criação, atualização, recuperação e listagem de dados.

## Sumário

- [Testes Unitários para `allergyController.test.ts`](#testes-unitários-para-allergycontrollertests)
- [Testes Unitários para `specializationController.test.ts`](#testes-unitários-para-specializationcontrollertests)
- [Testes Unitários para `patientMedicalHistoryController.test.ts`](#testes-unitários-para-patientmedicalhistorycontrollertests)
- [Testes Unitários para `medicalConditionController.test.ts`](#testes-unitários-para-medicalconditioncontrollertests)
- [Testes Unitários para `appointmentController.test.ts`](#testes-unitários-para-appointmentcontrollertests)
- [Resumo do Número de Testes](#resumo-do-número-de-testes)

## Testes Unitários para `allergyController.test.ts`

1. **createAllergy**
   - **Propósito**: Verificar se uma nova alergia é criada com sucesso.
   - **Resultado Esperado**: A alergia é criada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste Unitário

2. **updateAllergy**
   - **Propósito**: Verificar se uma alergia existente é atualizada com sucesso.
   - **Resultado Esperado**: A alergia é atualizada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste Unitário

3. **deleteAllergy**
   - **Propósito**: Verificar se uma alergia é deletada com sucesso.
   - **Resultado Esperado**: A alergia é deletada.
   - **Tipo de Teste**: Teste Unitário

4. **listAllergies**
   - **Propósito**: Verificar se todas as alergias são listadas com sucesso.
   - **Resultado Esperado**: Todas as alergias são listadas.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `specializationController.test.ts`

1. **createSpecialization**
   - **Propósito**: Verificar se uma nova especialização é criada com sucesso.
   - **Resultado Esperado**: A especialização é criada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste Unitário

2. **updateSpecialization**
   - **Propósito**: Verificar se uma especialização existente é atualizada com sucesso.
   - **Resultado Esperado**: A especialização é atualizada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste Unitário

3. **deleteSpecialization**
   - **Propósito**: Verificar se uma especialização é deletada com sucesso.
   - **Resultado Esperado**: A especialização é deletada.
   - **Tipo de Teste**: Teste Unitário

4. **listSpecializations**
   - **Propósito**: Verificar se todas as especializações são listadas com sucesso.
   - **Resultado Esperado**: Todas as especializações são listadas.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `patientMedicalHistoryController.test.ts`

1. **createPatientMedicalHistory**
   - **Propósito**: Verificar se um novo histórico médico do paciente é criado com sucesso.
   - **Resultado Esperado**: O histórico médico do paciente é criado e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste Unitário

2. **updatePatientMedicalHistory**
   - **Propósito**: Verificar se um histórico médico do paciente existente é atualizado com sucesso.
   - **Resultado Esperado**: O histórico médico do paciente é atualizado e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste Unitário

3. **getPatientMedicalHistory**
   - **Propósito**: Verificar se um histórico médico do paciente é recuperado com sucesso pelo número de registro médico.
   - **Resultado Esperado**: O histórico médico do paciente é recuperado e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `medicalConditionController.test.ts`

1. **createMedicalCondition**
   - **Propósito**: Verificar se uma nova condição médica é criada com sucesso.
   - **Resultado Esperado**: A condição médica é criada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste Unitário

2. **updateMedicalCondition**
   - **Propósito**: Verificar se uma condição médica existente é atualizada com sucesso.
   - **Resultado Esperado**: A condição médica é atualizada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste Unitário

3. **deleteMedicalCondition**
   - **Propósito**: Verificar se uma condição médica é deletada com sucesso.
   - **Resultado Esperado**: A condição médica é deletada.
   - **Tipo de Teste**: Teste Unitário

4. **listMedicalConditions**
   - **Propósito**: Verificar se todas as condições médicas são listadas com sucesso.
   - **Resultado Esperado**: Todas as condições médicas são listadas.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `appointmentController.test.ts`

1. **createAppointment**
   - **Propósito**: Verificar se uma nova consulta é criada com sucesso.
   - **Resultado Esperado**: A consulta é criada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste Unitário

2. **updateAppointment**
   - **Propósito**: Verificar se uma consulta existente é atualizada com sucesso.
   - **Resultado Esperado**: A consulta é atualizada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste Unitário

## Resumo do Número de Testes

- **Allergy**: 4 testes
- **Specialization**: 4 testes
- **Patient Medical History**: 3 testes
- **Medical Condition**: 4 testes
- **Appointment**: 2 testes