# Plano de Testes Unitários

Este documento fornece uma visão geral dos testes unitários relacionados aos diferentes componentes do sistema. Os testes são divididos por container de teste e cada um deles verifica a funcionalidade de criação, atualização, recuperação e listagem de dados.

## Sumário

- [Testes Unitários para `specializationService.test.ts`](#testes-unitários-para-specializationservicetests)
- [Testes Unitários para `patientMedicalHistoryService.test.ts`](#testes-unitários-para-patientmedicalhistoryservicetests)
- [Testes Unitários para `medicalConditionsService.test.ts`](#testes-unitários-para-medicalconditionsservicetests)
- [Testes Unitários para `appointmentService.test.ts`](#testes-unitários-para-appointmentservicetests)
- [Testes Unitários para `allergyService.test.ts`](#testes-unitários-para-allergyservicetests)
- [Resumo do Número de Testes](#resumo-do-número-de-testes)

## Testes Unitários para `specializationService.test.ts`

1. **should create a specialization successfully**
   - **Propósito**: Verificar se uma nova especialização é criada com sucesso.
   - **Resultado Esperado**: A especialização é criada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste Unitário

2. **should update a specialization successfully**
   - **Propósito**: Verificar se uma especialização existente é atualizada com sucesso.
   - **Resultado Esperado**: A especialização é atualizada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste Unitário

3. **should remove a specialization successfully**
   - **Propósito**: Verificar se uma especialização é removida com sucesso.
   - **Resultado Esperado**: A especialização é removida.
   - **Tipo de Teste**: Teste Unitário

4. **should list all specializations successfully**
   - **Propósito**: Verificar se todas as especializações são listadas com sucesso.
   - **Resultado Esperado**: Todas as especializações são listadas.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `patientMedicalHistoryService.test.ts`

1. **should create a patient medical history successfully**
   - **Propósito**: Verificar se um novo histórico médico do paciente é criado com sucesso.
   - **Resultado Esperado**: O histórico médico do paciente é criado e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste Unitário

2. **should update a patient medical history successfully**
   - **Propósito**: Verificar se um histórico médico do paciente existente é atualizado com sucesso.
   - **Resultado Esperado**: O histórico médico do paciente é atualizado e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste Unitário

3. **should get a patient medical history successfully**
   - **Propósito**: Verificar se um histórico médico do paciente é recuperado com sucesso pelo número de registro médico.
   - **Resultado Esperado**: O histórico médico do paciente é recuperado e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `medicalConditionsService.test.ts`

1. **should create a medical condition successfully**
   - **Propósito**: Verificar se uma nova condição médica é criada com sucesso.
   - **Resultado Esperado**: A condição médica é criada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste Unitário

2. **should update a medical condition successfully**
   - **Propósito**: Verificar se uma condição médica existente é atualizada com sucesso.
   - **Resultado Esperado**: A condição médica é atualizada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste Unitário

3. **should remove a medical condition successfully**
   - **Propósito**: Verificar se uma condição médica é removida com sucesso.
   - **Resultado Esperado**: A condição médica é removida.
   - **Tipo de Teste**: Teste Unitário

4. **should list all medical conditions successfully**
   - **Propósito**: Verificar se todas as condições médicas são listadas com sucesso.
   - **Resultado Esperado**: Todas as condições médicas são listadas.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `appointmentService.test.ts`

1. **should create an appointment successfully**
   - **Propósito**: Verificar se uma nova consulta é criada com sucesso.
   - **Resultado Esperado**: A consulta é criada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste Unitário

2. **should update an appointment successfully**
   - **Propósito**: Verificar se uma consulta existente é atualizada com sucesso.
   - **Resultado Esperado**: A consulta é atualizada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste Unitário

3. **should get all appointments successfully**
   - **Propósito**: Verificar se todas as consultas são listadas com sucesso.
   - **Resultado Esperado**: Todas as consultas são listadas.
   - **Tipo de Teste**: Teste Unitário

4. **should get an appointment by ID successfully**
   - **Propósito**: Verificar se uma consulta é recuperada com sucesso pelo ID.
   - **Resultado Esperado**: A consulta é recuperada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `allergyService.test.ts`

1. **should create an allergy successfully**
   - **Propósito**: Verificar se uma nova alergia é criada com sucesso.
   - **Resultado Esperado**: A alergia é criada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste Unitário

2. **should update an allergy successfully**
   - **Propósito**: Verificar se uma alergia existente é atualizada com sucesso.
   - **Resultado Esperado**: A alergia é atualizada e todas as propriedades correspondem aos valores esperados.
   - **Tipo de Teste**: Teste Unitário

3. **should remove an allergy successfully**
   - **Propósito**: Verificar se uma alergia é removida com sucesso.
   - **Resultado Esperado**: A alergia é removida.
   - **Tipo de Teste**: Teste Unitário

4. **should list all allergies successfully**
   - **Propósito**: Verificar se todas as alergias são listadas com sucesso.
   - **Resultado Esperado**: Todas as alergias são listadas.
   - **Tipo de Teste**: Teste Unitário

## Resumo do Número de Testes

- **Specialization**: 4 testes
- **Patient Medical History**: 3 testes
- **Medical Condition**: 4 testes
- **Appointment**: 4 testes
- **Allergy**: 4 testes