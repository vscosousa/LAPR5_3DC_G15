# Plano de Testes Unitários

Este documento fornece uma visão geral dos testes unitários relacionados aos diferentes componentes do sistema Angular. Os testes são divididos por container de teste e cada um deles verifica a funcionalidade de criação, atualização, recuperação e listagem de dados.

## Sumário

- [Testes Unitários para `auth.guard.spec.ts`](#testes-unitários-para-authguardcomponentspects)
- [Testes Unitários para `doctor.guard.spec.ts`](#testes-unitários-para-doctorguardcomponentspects)
- [Testes Unitários para `patient.guard.spec.ts`](#testes-unitários-para-patientguardcomponentspects)
- [Resumo do Número de Testes](#resumo-do-número-de-testes)

## Testes Unitários para `auth.guard.spec.ts`

1. **should be created**
   - **Propósito**: Verificar se o guard é criado com sucesso.
   - **Resultado Esperado**: O guard é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

2. **should allow activation if user is admin**
   - **Propósito**: Verificar se a ativação é permitida quando o usuário é um administrador.
   - **Resultado Esperado**: A ativação é permitida.
   - **Tipo de Teste**: Teste Unitário

3. **should navigate to login if user is not admin**
   - **Propósito**: Verificar se a navegação para a página de login ocorre quando o usuário não é um administrador.
   - **Resultado Esperado**: A navegação para a página de login ocorre.
   - **Tipo de Teste**: Teste Unitário

4. **should navigate to login if no token is found**
   - **Propósito**: Verificar se a navegação para a página de login ocorre quando nenhum token é encontrado.
   - **Resultado Esperado**: A navegação para a página de login ocorre.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `doctor.guard.spec.ts`

Total de Testes: 4

1. **should be created**
   - **Propósito**: Verificar se o guard é criado com sucesso.
   - **Resultado Esperado**: O guard é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

2. **should allow activation if user is doctor**
   - **Propósito**: Verificar se a ativação é permitida quando o usuário é um médico.
   - **Resultado Esperado**: A ativação é permitida.
   - **Tipo de Teste**: Teste Unitário

3. **should navigate to login if user is not doctor**
   - **Propósito**: Verificar se a navegação para a página de login ocorre quando o usuário não é um médico.
   - **Resultado Esperado**: A navegação para a página de login ocorre.
   - **Tipo de Teste**: Teste Unitário

4. **should navigate to login if no token is found**
   - **Propósito**: Verificar se a navegação para a página de login ocorre quando nenhum token é encontrado.
   - **Resultado Esperado**: A navegação para a página de login ocorre.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `patient.guard.spec.ts`

Total de Testes: 4

1. **should be created**
   - **Propósito**: Verificar se o guard é criado com sucesso.
   - **Resultado Esperado**: O guard é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

2. **should allow activation if user is patient**
   - **Propósito**: Verificar se a ativação é permitida quando o usuário é um paciente.
   - **Resultado Esperado**: A ativação é permitida.
   - **Tipo de Teste**: Teste Unitário

3. **should navigate to login if user is not patient**
   - **Propósito**: Verificar se a navegação para a página de login ocorre quando o usuário não é um paciente.
   - **Resultado Esperado**: A navegação para a página de login ocorre.
   - **Tipo de Teste**: Teste Unitário

4. **should navigate to login if no token is found**
   - **Propósito**: Verificar se a navegação para a página de login ocorre quando nenhum token é encontrado.
   - **Resultado Esperado**: A navegação para a página de login ocorre.
   - **Tipo de Teste**: Teste Unitário

## Resumo do Número de Testes

- **Auth Guard**: 4 testes
- **Doctor Guard**: 4 testes
- **Patient Guard**: 4 testes
