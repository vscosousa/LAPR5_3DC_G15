# Plano de Testes Unitários para `AuthInterceptor`

Este documento fornece uma visão geral dos testes unitários relacionados ao `AuthInterceptor`. Os testes verificam a funcionalidade de interceptação de requisições HTTP, adicionando cabeçalhos de autorização quando necessário.

## Sumário

- [Testes Unitários para `auth.interceptor.spec.ts`](#testes-unitários-para-authinterceptorspects)
- [Resumo do Número de Testes](#resumo-do-número-de-testes)

## Testes Unitários para `auth.interceptor.spec.ts`

1. **should be created**
   - **Propósito**: Verificar se o interceptor é criado com sucesso.
   - **Resultado Esperado**: O interceptor é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

2. **should add Authorization header to requests**
   - **Propósito**: Verificar se o cabeçalho de autorização é adicionado às requisições.
   - **Resultado Esperado**: O cabeçalho de autorização é adicionado com sucesso.
   - **Tipo de Teste**: Teste Unitário

3. **should not add Authorization header to non-auth URLs**
   - **Propósito**: Verificar se o cabeçalho de autorização não é adicionado a URLs que não requerem autenticação.
   - **Resultado Esperado**: O cabeçalho de autorização não é adicionado.
   - **Tipo de Teste**: Teste Unitário

4. **should not add Authorization header if no token is found**
   - **Propósito**: Verificar se o cabeçalho de autorização não é adicionado quando nenhum token é encontrado.
   - **Resultado Esperado**: O cabeçalho de autorização não é adicionado.
   - **Tipo de Teste**: Teste Unitário

## Resumo do Número de Testes

- **auth.interceptor.spec.ts**: 4 testes
