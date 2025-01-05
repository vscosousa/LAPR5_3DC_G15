# Plano de Testes de Integração

Este documento fornece uma visão geral dos testes de integração relacionados aos diferentes componentes do sistema. Os testes são divididos por container de teste e cada um deles verifica a funcionalidade de criação, atualização, recuperação e listagem de dados. Estes testes focam na integração entre os controllers e os services, garantindo que a comunicação e a lógica entre essas camadas funcionem corretamente.

## Sumário

- [Testes de Integração para `medicalConditionControllerService.test.ts`](#testes-de-integração-para-medicalconditioncontrollerservicetests)
- [Testes de Integração para `patientMedicalHistoryControllerService.test.ts`](#testes-de-integração-para-patientmedicalhistorycontrollerservicetests)
- [Testes de Integração para `appointmentControllerService.test.ts`](#testes-de-integração-para-appointmentcontrollerservicetests)
- [Testes de Integração para `allergyControllerService.test.ts`](#testes-de-integração-para-allergycontrollerservicetests)
- [Resumo do Número de Testes](#resumo-do-número-de-testes)

## Testes de Integração para `medicalConditionControllerService.test.ts`

1. **createMedicalCondition**
   - **Propósito**: Verificar se uma nova condição médica é criada com sucesso.
   - **Resultado Esperado**: A condição médica é criada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste de Integração

2. **updateMedicalCondition**
   - **Propósito**: Verificar se uma condição médica existente é atualizada com sucesso.
   - **Resultado Esperado**: A condição médica é atualizada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste de Integração

3. **deleteMedicalCondition**
   - **Propósito**: Verificar se uma condição médica é deletada com sucesso.
   - **Resultado Esperado**: A condição médica é deletada.
   - **Tipo de Teste**: Teste de Integração

4. **listMedicalConditions**
   - **Propósito**: Verificar se todas as condições médicas são listadas com sucesso.
   - **Resultado Esperado**: Todas as condições médicas são listadas.
   - **Tipo de Teste**: Teste de Integração

## Testes de Integração para `patientMedicalHistoryControllerService.test.ts`

1. **createPatientMedicalHistory**
   - **Propósito**: Verificar se um novo histórico médico do paciente é criado com sucesso.
   - **Resultado Esperado**: O histórico médico do paciente é criado e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste de Integração

2. **updatePatientMedicalHistory**
   - **Propósito**: Verificar se um histórico médico do paciente existente é atualizado com sucesso.
   - **Resultado Esperado**: O histórico médico do paciente é atualizado e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste de Integração

3. **getPatientMedicalHistory**
   - **Propósito**: Verificar se um histórico médico do paciente é recuperado com sucesso pelo número de registro médico.
   - **Resultado Esperado**: O histórico médico do paciente é recuperado e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste de Integração

## Testes de Integração para `appointmentControllerService.test.ts`

1. **createAppointment**
   - **Propósito**: Verificar se uma nova consulta é criada com sucesso.
   - **Resultado Esperado**: A consulta é criada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste de Integração

2. **updateAppointment**
   - **Propósito**: Verificar se uma consulta existente é atualizada com sucesso.
   - **Resultado Esperado**: A consulta é atualizada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste de Integração

3. **listAppointments**
   - **Propósito**: Verificar se todas as consultas são listadas com sucesso.
   - **Resultado Esperado**: Todas as consultas são listadas.
   - **Tipo de Teste**: Teste de Integração

4. **getAppointmentById**
   - **Propósito**: Verificar se uma consulta é recuperada com sucesso pelo ID.
   - **Resultado Esperado**: A consulta é recuperada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste de Integração

## Testes de Integração para `allergyControllerService.test.ts`

1. **createAllergy**
   - **Propósito**: Verificar se uma nova alergia é criada com sucesso.
   - **Resultado Esperado**: A alergia é criada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste de Integração

2. **updateAllergy**
   - **Propósito**: Verificar se uma alergia existente é atualizada com sucesso.
   - **Resultado Esperado**: A alergia é atualizada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste de Integração

3. **deleteAllergy**
   - **Propósito**: Verificar se uma alergia é deletada com sucesso.
   - **Resultado Esperado**: A alergia é deletada.
   - **Tipo de Teste**: Teste de Integração

4. **listAllergies**
   - **Propósito**: Verificar se todas as alergias são listadas com sucesso.
   - **Resultado Esperado**: Todas as alergias são listadas.
   - **Tipo de Teste**: Teste de Integração

## Resumo do Número de Testes

- **Medical Condition**: 4 testes
- **Patient Medical History**: 3 testes
- **Appointment**: 4 testes
- **Allergy**: 4 testes