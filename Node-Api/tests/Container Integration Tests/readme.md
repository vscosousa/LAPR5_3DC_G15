# Plano de Testes de Integração

Este documento fornece uma visão geral dos testes de integração relacionados aos diferentes componentes do sistema. Os testes são divididos por container de teste e cada um deles verifica a funcionalidade de criação, atualização, recuperação e listagem de dados.

## Sumário

- [Testes de Integração para `patientMedicalHistoryContainer.test.ts`](#testes-de-integração-para-patientmedicalhistorycontainertests)
- [Testes de Integração para `medicalConditionContainer.test.ts`](#testes-de-integração-para-medicalconditioncontainertests)
- [Testes de Integração para `appointmentContainer.test.ts`](#testes-de-integração-para-appointmentcontainertests)
- [Testes de Integração para `allergyContainer.test.ts`](#testes-de-integração-para-allergycontainertests)
- [Resumo do Número de Testes](#resumo-do-número-de-testes)

## Testes de Integração para `patientMedicalHistoryContainer.test.ts`

1. **POST /patientsMedicalHistory/create**
   - **Propósito**: Verificar se um novo histórico médico do paciente é criado com sucesso.
   - **Resultado Esperado**: O histórico médico do paciente é criado e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste de Integração

2. **PUT /patientsMedicalHistory/update/:patientMedicalRecordNumber**
   - **Propósito**: Verificar se um histórico médico do paciente existente é atualizado com sucesso.
   - **Resultado Esperado**: O histórico médico do paciente é atualizado e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste de Integração

3. **GET /patientsMedicalHistory/get/:patientMedicalRecordNumber**
   - **Propósito**: Verificar se um histórico médico do paciente é recuperado com sucesso pelo número de registro médico.
   - **Resultado Esperado**: O histórico médico do paciente é recuperado e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste de Integração

## Testes de Integração para `medicalConditionContainer.test.ts`

1. **POST /medicalConditions/create**
   - **Propósito**: Verificar se uma nova condição médica é criada com sucesso.
   - **Resultado Esperado**: A condição médica é criada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste de Integração

2. **PUT /medicalConditions/update/:id**
   - **Propósito**: Verificar se uma condição médica existente é atualizada com sucesso.
   - **Resultado Esperado**: A condição médica é atualizada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste de Integração

3. **DELETE /medicalConditions/delete/:id**
   - **Propósito**: Verificar se uma condição médica é deletada com sucesso.
   - **Resultado Esperado**: A condição médica é deletada.
   - **Tipo de Teste**: Teste de Integração

4. **GET /medicalConditions**
   - **Propósito**: Verificar se todas as condições médicas são listadas com sucesso.
   - **Resultado Esperado**: Todas as condições médicas são listadas.
   - **Tipo de Teste**: Teste de Integração

## Testes de Integração para `appointmentContainer.test.ts`

1. **POST /appointments/create**
   - **Propósito**: Verificar se uma nova consulta é criada com sucesso.
   - **Resultado Esperado**: A consulta é criada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste de Integração

2. **PUT /appointments/update/:id**
   - **Propósito**: Verificar se uma consulta existente é atualizada com sucesso.
   - **Resultado Esperado**: A consulta é atualizada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste de Integração

3. **GET /appointments/:id**
   - **Propósito**: Verificar se uma consulta é recuperada com sucesso pelo ID.
   - **Resultado Esperado**: A consulta é recuperada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste de Integração

4. **GET /appointments**
   - **Propósito**: Verificar se todas as consultas são listadas com sucesso.
   - **Resultado Esperado**: Todas as consultas são listadas.
   - **Tipo de Teste**: Teste de Integração

## Testes de Integração para `allergyContainer.test.ts`

1. **POST /allergies/create**
   - **Propósito**: Verificar se uma nova alergia é criada com sucesso.
   - **Resultado Esperado**: A alergia é criada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste de Integração

2. **PUT /allergies/update/:id**
   - **Propósito**: Verificar se uma alergia existente é atualizada com sucesso.
   - **Resultado Esperado**: A alergia é atualizada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste de Integração

3. **DELETE /allergies/delete/:id**
   - **Propósito**: Verificar se uma alergia é deletada com sucesso.
   - **Resultado Esperado**: A alergia é deletada.
   - **Tipo de Teste**: Teste de Integração

4. **GET /allergies**
   - **Propósito**: Verificar se todas as alergias são listadas com sucesso.
   - **Resultado Esperado**: Todas as alergias são listadas.
   - **Tipo de Teste**: Teste de Integração

## Resumo do Número de Testes

- **Patient Medical History**: 3 testes
- **Medical Condition**: 4 testes
- **Appointment**: 4 testes
- **Allergy**: 4 testes