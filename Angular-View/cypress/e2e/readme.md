# Plano de Testes de Integração com Cypress

Este documento fornece uma visão geral dos testes de integração realizados com Cypress para os diferentes componentes do sistema Angular. Os testes são divididos por container de teste e cada um deles verifica a funcionalidade de criação, atualização, recuperação e listagem de dados.

## Sumário

- [Testes de Integração para `active-deactive-staff.cy.ts`](#testes-de-integração-para-active-deactive-staffcyts)
- [Testes de Integração para `update-staff.cy.ts`](#testes-de-integração-para-update-staffcyts)
- [Testes de Integração para `update-patient.cy.ts`](#testes-de-integração-para-update-patientcyts)
- [Testes de Integração para `update-operation-type.cy.ts`](#testes-de-integração-para-update-operation-typecyts)
- [Testes de Integração para `update-conditions.cy.ts`](#testes-de-integração-para-update-conditionscyts)
- [Testes de Integração para `update-appointment.cy.ts`](#testes-de-integração-para-update-appointmentcyts)
- [Testes de Integração para `update-allergies.cy.ts`](#testes-de-integração-para-update-allergiescyts)
- [Testes de Integração para `search-staffs.cy.ts`](#testes-de-integração-para-search-staffscyts)
- [Testes de Integração para `request-delete.cy.ts`](#testes-de-integração-para-request-deletecyts)
- [Testes de Integração para `register.cy.ts`](#testes-de-integração-para-registercyts)
- [Testes de Integração para `operation-types.cy.ts`](#testes-de-integração-para-operation-typescyts)
- [Testes de Integração para `medical-history.cy.ts`](#testes-de-integração-para-medical-historycyts)
- [Testes de Integração para `manage-medical-condition.cy.ts`](#testes-de-integração-para-manage-medical-conditioncyts)
- [Testes de Integração para `login.cy.ts`](#testes-de-integração-para-logincyts)
- [Testes de Integração para `list-patient.cy.ts`](#testes-de-integração-para-list-patientcyts)
- [Testes de Integração para `delete-patient.cy.ts`](#testes-de-integração-para-delete-patientcyts)
- [Testes de Integração para `create-staff.cy.ts`](#testes-de-integração-para-create-staffcyts)
- [Testes de Integração para `create-operation-type.cy.ts`](#testes-de-integração-para-create-operation-typecyts)
- [Testes de Integração para `create-patient.cy.ts`](#testes-de-integração-para-create-patientcyts)
- [Testes de Integração para `create-operation-request.cy.ts`](#testes-de-integração-para-create-operation-requestcyts)
- [Testes de Integração para `create-appointment.cy.ts`](#testes-de-integração-para-create-appointmentcyts)
- [Resumo do Número de Testes](#resumo-do-número-de-testes)

## Testes de Integração para `active-deactive-staff.cy.ts`

1. **should display deactive button and should display active button after**
   - **Propósito**: Verificar se o botão de desativar é exibido e se o botão de ativar é exibido após a desativação.
   - **Resultado Esperado**: O botão de desativar é exibido e o botão de ativar é exibido após a desativação.
   - **Tipo de Teste**: Teste de Integração

2. **should deactive a staff**
   - **Propósito**: Verificar se um funcionário é desativado com sucesso.
   - **Resultado Esperado**: O funcionário é desativado e o botão de ativar é exibido.
   - **Tipo de Teste**: Teste de Integração

3. **should activate a staff**
   - **Propósito**: Verificar se um funcionário é ativado com sucesso.
   - **Resultado Esperado**: O funcionário é ativado e o botão de desativar é exibido.
   - **Tipo de Teste**: Teste de Integração

## Testes de Integração para `update-staff.cy.ts`

1. **should display the update staff form**
   - **Propósito**: Verificar se o formulário de atualização de funcionário é exibido.
   - **Resultado Esperado**: O formulário de atualização de funcionário é exibido.
   - **Tipo de Teste**: Teste de Integração

2. **should auto-fill the form with staff details**
   - **Propósito**: Verificar se o formulário é preenchido automaticamente com os detalhes do funcionário.
   - **Resultado Esperado**: O formulário é preenchido automaticamente com os detalhes do funcionário.
   - **Tipo de Teste**: Teste de Integração

3. **should allow the user to update staff details**
   - **Propósito**: Verificar se o usuário pode atualizar os detalhes do funcionário.
   - **Resultado Esperado**: Os detalhes do funcionário são atualizados com sucesso.
   - **Tipo de Teste**: Teste de Integração

4. **should show an error if a required field is missing**
   - **Propósito**: Verificar se uma mensagem de erro é exibida quando um campo obrigatório está faltando.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste de Integração

5. **should show an error if identifier is missing**
   - **Propósito**: Verificar se uma mensagem de erro é exibida quando o campo identificador está faltando.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste de Integração

6. **should show an error if phoneNumber is missing**
   - **Propósito**: Verificar se uma mensagem de erro é exibida quando o campo número de telefone está faltando.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste de Integração

7. **should show an error if email is missing**
   - **Propósito**: Verificar se uma mensagem de erro é exibida quando o campo email está faltando.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste de Integração

8. **should show an error if specializationName is missing**
   - **Propósito**: Verificar se uma mensagem de erro é exibida quando o campo nome da especialização está faltando.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste de Integração

## Testes de Integração para `update-patient.cy.ts`

1. **should display the update patient form**
   - **Propósito**: Verificar se o formulário de atualização de paciente é exibido.
   - **Resultado Esperado**: O formulário de atualização de paciente é exibido.
   - **Tipo de Teste**: Teste de Integração

2. **should allow the user to update patient details**
   - **Propósito**: Verificar se o usuário pode atualizar os detalhes do paciente.
   - **Resultado Esperado**: Os detalhes do paciente são atualizados com sucesso.
   - **Tipo de Teste**: Teste de Integração

3. **should clear the form when the clear button is clicked**
   - **Propósito**: Verificar se o formulário é limpo quando o botão de limpar é clicado.
   - **Resultado Esperado**: O formulário é limpo.
   - **Tipo de Teste**: Teste de Integração

## Testes de Integração para `update-operation-type.cy.ts`

1. **should display the update operation type form**
   - **Propósito**: Verificar se o formulário de atualização do tipo de operação é exibido.
   - **Resultado Esperado**: O formulário de atualização do tipo de operação é exibido.
   - **Tipo de Teste**: Teste de Integração

2. **should allow the admin to fill in the form and update the operation type**
   - **Propósito**: Verificar se o administrador pode preencher o formulário e atualizar o tipo de operação.
   - **Resultado Esperado**: O tipo de operação é atualizado com sucesso.
   - **Tipo de Teste**: Teste de Integração

3. **should navigate back to the operation types page**
   - **Propósito**: Verificar se a navegação de volta para a página de tipos de operação funciona corretamente.
   - **Resultado Esperado**: A navegação de volta para a página de tipos de operação funciona corretamente.
   - **Tipo de Teste**: Teste de Integração

## Testes de Integração para `update-conditions.cy.ts`

1. **should display the update condition form**
   - **Propósito**: Verificar se o formulário de atualização de condição é exibido.
   - **Resultado Esperado**: O formulário de atualização de condição é exibido.
   - **Tipo de Teste**: Teste de Integração

2. **should allow the user to update condition details**
   - **Propósito**: Verificar se o usuário pode atualizar os detalhes da condição.
   - **Resultado Esperado**: Os detalhes da condição são atualizados com sucesso.
   - **Tipo de Teste**: Teste de Integração

3. **should display an alert with the message: Failed to update condition**
   - **Propósito**: Verificar se uma mensagem de alerta é exibida quando a atualização da condição falha.
   - **Resultado Esperado**: Uma mensagem de alerta é exibida.
   - **Tipo de Teste**: Teste de Integração

## Testes de Integração para `update-appointment.cy.ts`

1. **should update an appointment successfully**
   - **Propósito**: Verificar se uma consulta é atualizada com sucesso.
   - **Resultado Esperado**: A consulta é atualizada com sucesso.
   - **Tipo de Teste**: Teste de Integração

2. **should fail to update an appointment with missing fields**
   - **Propósito**: Verificar se a atualização de uma consulta falha quando campos obrigatórios estão faltando.
   - **Resultado Esperado**: A atualização da consulta falha e uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste de Integração

## Testes de Integração para `update-allergies.cy.ts`

1. **should display the update allergy form**
   - **Propósito**: Verificar se o formulário de atualização de alergia é exibido.
   - **Resultado Esperado**: O formulário de atualização de alergia é exibido.
   - **Tipo de Teste**: Teste de Integração

2. **should allow the user to update allergy details**
   - **Propósito**: Verificar se o usuário pode atualizar os detalhes da alergia.
   - **Resultado Esperado**: Os detalhes da alergia são atualizados com sucesso.
   - **Tipo de Teste**: Teste de Integração

3. **should display an alert with the message: Failed to create allergy**
   - **Propósito**: Verificar se uma mensagem de alerta é exibida quando a criação da alergia falha.
   - **Resultado Esperado**: Uma mensagem de alerta é exibida.
   - **Tipo de Teste**: Teste de Integração

## Testes de Integração para `search-staffs.cy.ts`

1. **should display the search staff form**
   - **Propósito**: Verificar se o formulário de busca de funcionários é exibido.
   - **Resultado Esperado**: O formulário de busca de funcionários é exibido.
   - **Tipo de Teste**: Teste de Integração

2. **should allow the user to apply all filters**
   - **Propósito**: Verificar se o usuário pode aplicar todos os filtros de busca.
   - **Resultado Esperado**: Os filtros de busca são aplicados corretamente e os resultados são exibidos.
   - **Tipo de Teste**: Teste de Integração

3. **should allow the user to apply firstName filter**
   - **Propósito**: Verificar se o usuário pode aplicar o filtro de primeiro nome.
   - **Resultado Esperado**: O filtro de primeiro nome é aplicado corretamente e os resultados são exibidos.
   - **Tipo de Teste**: Teste de Integração

4. **should allow the user to apply lastName filter**
   - **Propósito**: Verificar se o usuário pode aplicar o filtro de sobrenome.
   - **Resultado Esperado**: O filtro de sobrenome é aplicado corretamente e os resultados são exibidos.
   - **Tipo de Teste**: Teste de Integração

5. **should allow the user to apply fullName filter**
   - **Propósito**: Verificar se o usuário pode aplicar o filtro de nome completo.
   - **Resultado Esperado**: O filtro de nome completo é aplicado corretamente e os resultados são exibidos.
   - **Tipo de Teste**: Teste de Integração

6. **should allow the user to apply email filter**
   - **Propósito**: Verificar se o usuário pode aplicar o filtro de email.
   - **Resultado Esperado**: O filtro de email é aplicado corretamente e os resultados são exibidos.
   - **Tipo de Teste**: Teste de Integração

7. **should allow the user to apply specialization filter**
   - **Propósito**: Verificar se o usuário pode aplicar o filtro de especialização.
   - **Resultado Esperado**: O filtro de especialização é aplicado corretamente e os resultados são exibidos.
   - **Tipo de Teste**: Teste de Integração

8. **should clear the filters when the clear button is clicked**
   - **Propósito**: Verificar se os filtros são limpos quando o botão de limpar é clicado.
   - **Resultado Esperado**: Os filtros são limpos.
   - **Tipo de Teste**: Teste de Integração

## Testes de Integração para `request-delete.cy.ts`

1. **should display the settings page**
   - **Propósito**: Verificar se a página de configurações é exibida.
   - **Resultado Esperado**: A página de configurações é exibida.
   - **Tipo de Teste**: Teste de Integração

2. **should allow the user to change the theme**
   - **Propósito**: Verificar se o usuário pode alterar o tema.
   - **Resultado Esperado**: O tema é alterado com sucesso.
   - **Tipo de Teste**: Teste de Integração

3. **should display the account settings section**
   - **Propósito**: Verificar se a seção de configurações da conta é exibida.
   - **Resultado Esperado**: A seção de configurações da conta é exibida.
   - **Tipo de Teste**: Teste de Integração

4. **should allow the user to request account deletion**
   - **Propósito**: Verificar se o usuário pode solicitar a exclusão da conta.
   - **Resultado Esperado**: A solicitação de exclusão da conta é feita com sucesso.
   - **Tipo de Teste**: Teste de Integração

5. **should delete the account**
   - **Propósito**: Verificar se a conta é excluída com sucesso.
   - **Resultado Esperado**: A conta é excluída com sucesso.
   - **Tipo de Teste**: Teste de Integração

## Testes de Integração para `register.cy.ts`

1. **should display the registration form**
   - **Propósito**: Verificar se o formulário de registro é exibido.
   - **Resultado Esperado**: O formulário de registro é exibido.
   - **Tipo de Teste**: Teste de Integração

2. **should allow the user to register with valid credentials**
   - **Propósito**: Verificar se o usuário pode se registrar com credenciais válidas.
   - **Resultado Esperado**: O registro é feito com sucesso.
   - **Tipo de Teste**: Teste de Integração

3. **should display an error message for invalid registration**
   - **Propósito**: Verificar se uma mensagem de erro é exibida para um registro inválido.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste de Integração

4. **should toggle password visibility**
   - **Propósito**: Verificar se a visibilidade da senha pode ser alternada.
   - **Resultado Esperado**: A visibilidade da senha é alternada com sucesso.
   - **Tipo de Teste**: Teste de Integração

5. **should toggle confirm password visibility**
   - **Propósito**: Verificar se a visibilidade da confirmação de senha pode ser alternada.
   - **Resultado Esperado**: A visibilidade da confirmação de senha é alternada com sucesso.
   - **Tipo de Teste**: Teste de Integração

## Testes de Integração para `operation-types.cy.ts`

1. **should display the operation types table**
   - **Propósito**: Verificar se a tabela de tipos de operação é exibida.
   - **Resultado Esperado**: A tabela de tipos de operação é exibida.
   - **Tipo de Teste**: Teste de Integração

2. **should display the correct table headers**
   - **Propósito**: Verificar se os cabeçalhos da tabela estão corretos.
   - **Resultado Esperado**: Os cabeçalhos da tabela estão corretos.
   - **Tipo de Teste**: Teste de Integração

3. **should allow the admin to create a new operation type**
   - **Propósito**: Verificar se o administrador pode criar um novo tipo de operação.
   - **Resultado Esperado**: O novo tipo de operação é criado com sucesso.
   - **Tipo de Teste**: Teste de Integração

4. **should display staff members when "Show Staff" button is clicked**
   - **Propósito**: Verificar se os membros da equipe são exibidos quando o botão "Show Staff" é clicado.
   - **Resultado Esperado**: Os membros da equipe são exibidos.
   - **Tipo de Teste**: Teste de Integração

5. **should allow the admin to edit an operation type**
   - **Propósito**: Verificar se o administrador pode editar um tipo de operação.
   - **Resultado Esperado**: O tipo de operação é editado com sucesso.
   - **Tipo de Teste**: Teste de Integração

6. **should allow the admin to deactivate and activate an operation type**
   - **Propósito**: Verificar se o administrador pode desativar e ativar um tipo de operação.
   - **Resultado Esperado**: O tipo de operação é desativado e ativado com sucesso.
   - **Tipo de Teste**: Teste de Integração

7. **should navigate back to the dashboard**
   - **Propósito**: Verificar se a navegação de volta para o painel funciona corretamente.
   - **Resultado Esperado**: A navegação de volta para o painel funciona corretamente.
   - **Tipo de Teste**: Teste de Integração

## Testes de Integração para `medical-history.cy.ts`

1. **should filter by email, select the patient and edit medical history**
   - **Propósito**: Verificar se o histórico médico do paciente pode ser filtrado por email, selecionado e editado.
   - **Resultado Esperado**: O histórico médico do paciente é filtrado, selecionado e editado com sucesso.
   - **Tipo de Teste**: Teste de Integração

2. **should view the medical history of a patient**
   - **Propósito**: Verificar se o histórico médico do paciente pode ser visualizado.
   - **Resultado Esperado**: O histórico médico do paciente é visualizado com sucesso.
   - **Tipo de Teste**: Teste de Integração

3. **should clear filters**
   - **Propósito**: Verificar se os filtros podem ser limpos.
   - **Resultado Esperado**: Os filtros são limpos com sucesso.
   - **Tipo de Teste**: Teste de Integração

## Testes de Integração para `manage-medical-condition.cy.ts`

1. **should display the list of medical conditions**
   - **Propósito**: Verificar se a lista de condições médicas é exibida.
   - **Resultado Esperado**: A lista de condições médicas é exibida.
   - **Tipo de Teste**: Teste de Integração

2. **should create a new medical condition**
   - **Propósito**: Verificar se uma nova condição médica pode ser criada.
   - **Resultado Esperado**: A nova condição médica é criada com sucesso.
   - **Tipo de Teste**: Teste de Integração

3. **should view details of a medical condition**
   - **Propósito**: Verificar se os detalhes de uma condição médica podem ser visualizados.
   - **Resultado Esperado**: Os detalhes da condição médica são visualizados com sucesso.
   - **Tipo de Teste**: Teste de Integração

4. **should update a medical condition**
   - **Propósito**: Verificar se uma condição médica pode ser atualizada.
   - **Resultado Esperado**: A condição médica é atualizada com sucesso.
   - **Tipo de Teste**: Teste de Integração

## Testes de Integração para `login.cy.ts`

1. **should display the login form**
   - **Propósito**: Verificar se o formulário de login é exibido.
   - **Resultado Esperado**: O formulário de login é exibido.
   - **Tipo de Teste**: Teste de Integração

2. **should allow the user to login with valid credentials**
   - **Propósito**: Verificar se o usuário pode fazer login com credenciais válidas.
   - **Resultado Esperado**: O login é realizado com sucesso.
   - **Tipo de Teste**: Teste de Integração

3. **should display an error message for invalid credentials**
   - **Propósito**: Verificar se uma mensagem de erro é exibida para credenciais inválidas.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste de Integração

4. **should toggle password visibility**
   - **Propósito**: Verificar se a visibilidade da senha pode ser alternada.
   - **Resultado Esperado**: A visibilidade da senha é alternada com sucesso.
   - **Tipo de Teste**: Teste de Integração

## Testes de Integração para `list-patient.cy.ts`

1. **should display the list of patients**
   - **Propósito**: Verificar se a lista de pacientes é exibida.
   - **Resultado Esperado**: A lista de pacientes é exibida.
   - **Tipo de Teste**: Teste de Integração

2. **should allow the user to apply filters**
   - **Propósito**: Verificar se o usuário pode aplicar filtros.
   - **Resultado Esperado**: Os filtros são aplicados com sucesso.
   - **Tipo de Teste**: Teste de Integração

3. **should clear the filters when the clear button is clicked**
   - **Propósito**: Verificar se os filtros são limpos quando o botão de limpar é clicado.
   - **Resultado Esperado**: Os filtros são limpos com sucesso.
   - **Tipo de Teste**: Teste de Integração

## Testes de Integração para `delete-patient.cy.ts`

1. **should display the list of patients**
   - **Propósito**: Verificar se a lista de pacientes é exibida.
   - **Resultado Esperado**: A lista de pacientes é exibida.
   - **Tipo de Teste**: Teste de Integração

2. **should delete a patient when the delete button is clicked**
   - **Propósito**: Verificar se um paciente é excluído quando o botão de excluir é clicado.
   - **Resultado Esperado**: O paciente é excluído com sucesso.
   - **Tipo de Teste**: Teste de Integração

## Testes de Integração para `create-patient.cy.ts`

1. **should display the create patient form**
   - **Propósito**: Verificar se o formulário de criação de paciente é exibido.
   - **Resultado Esperado**: O formulário de criação de paciente é exibido.
   - **Tipo de Teste**: Teste de Integração

2. **should allow the user to fill out the form and create a new patient**
   - **Propósito**: Verificar se o usuário pode preencher o formulário e criar um novo paciente.
   - **Resultado Esperado**: O novo paciente é criado com sucesso.
   - **Tipo de Teste**: Teste de Integração

3. **should clear the form when the clear button is clicked**
   - **Propósito**: Verificar se o formulário é limpo quando o botão de limpar é clicado.
   - **Resultado Esperado**: O formulário é limpo com sucesso.
   - **Tipo de Teste**: Teste de Integração

## Testes de Integração para `create-staff.cy.ts`

1. **should display the create staff form**
   - **Propósito**: Verificar se o formulário de criação de funcionário é exibido.
   - **Resultado Esperado**: O formulário de criação de funcionário é exibido.
   - **Tipo de Teste**: Teste de Integração

2. **should allow the user to fill out the form and create a new staff**
   - **Propósito**: Verificar se o usuário pode preencher o formulário e criar um novo funcionário.
   - **Resultado Esperado**: O novo funcionário é criado com sucesso.
   - **Tipo de Teste**: Teste de Integração

3. **should show an error if a required field is missing**
   - **Propósito**: Verificar se uma mensagem de erro é exibida quando um campo obrigatório está faltando.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste de Integração

4. **should show an error if firstName is missing**
   - **Propósito**: Verificar se uma mensagem de erro é exibida quando o campo primeiro nome está faltando.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste de Integração

5. **should show an error if lastName is missing**
   - **Propósito**: Verificar se uma mensagem de erro é exibida quando o campo sobrenome está faltando.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste de Integração

6. **should show an error if fullName is missing**
   - **Propósito**: Verificar se uma mensagem de erro é exibida quando o campo nome completo está faltando.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste de Integração

7. **should show an error if email is missing**
   - **Propósito**: Verificar se uma mensagem de erro é exibida quando o campo email está faltando.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste de Integração

8. **should show an error if email is invalid**
   - **Propósito**: Verificar se uma mensagem de erro é exibida quando o campo email é inválido.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste de Integração

9. **should show an error if identifier is missing**
   - **Propósito**: Verificar se uma mensagem de erro é exibida quando o campo identificador está faltando.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste de Integração

10. **should show an error if phoneNumber is missing**
    - **Propósito**: Verificar se uma mensagem de erro é exibida quando o campo número de telefone está faltando.
    - **Resultado Esperado**: Uma mensagem de erro é exibida.
    - **Tipo de Teste**: Teste de Integração

11. **should show an error if staffType is missing**
    - **Propósito**: Verificar se uma mensagem de erro é exibida quando o campo tipo de funcionário está faltando.
    - **Resultado Esperado**: Uma mensagem de erro é exibida.
    - **Tipo de Teste**: Teste de Integração

12. **should show an error if specializationName is missing**
    - **Propósito**: Verificar se uma mensagem de erro é exibida quando o campo nome da especialização está faltando.
    - **Resultado Esperado**: Uma mensagem de erro é exibida.
    - **Tipo de Teste**: Teste de Integração

## Testes de Integração para `create-operation-type.cy.ts`

1. **should display the create operation type form**
   - **Propósito**: Verificar se o formulário de criação de tipo de operação é exibido.
   - **Resultado Esperado**: O formulário de criação de tipo de operação é exibido.
   - **Tipo de Teste**: Teste de Integração

2. **should allow the admin to fill in the form and create a new operation type**
   - **Propósito**: Verificar se o administrador pode preencher o formulário e criar um novo tipo de operação.
   - **Resultado Esperado**: O novo tipo de operação é criado com sucesso.
   - **Tipo de Teste**: Teste de Integração

3. **should display an error message when no specialization is selected**
   - **Propósito**: Verificar se uma mensagem de erro é exibida quando nenhuma especialização é selecionada.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste de Integração

4. **should navigate back to the operation types page**
   - **Propósito**: Verificar se a navegação de volta para a página de tipos de operação funciona corretamente.
   - **Resultado Esperado**: A navegação de volta para a página de tipos de operação funciona corretamente.
   - **Tipo de Teste**: Teste de Integração

## Testes de Integração para `create-operation-request.cy.ts`

1. **should display the update operation type form**
   - **Propósito**: Verificar se o formulário de atualização do tipo de operação é exibido.
   - **Resultado Esperado**: O formulário de atualização do tipo de operação é exibido.
   - **Tipo de Teste**: Teste de Integração

2. **should allow the admin to fill in the form and update the operation request**
   - **Propósito**: Verificar se o administrador pode preencher o formulário e atualizar a solicitação de operação.
   - **Resultado Esperado**: A solicitação de operação é atualizada com sucesso.
   - **Tipo de Teste**: Teste de Integração

3. **should navigate back to the operation types page**
   - **Propósito**: Verificar se a navegação de volta para a página de tipos de operação funciona corretamente.
   - **Resultado Esperado**: A navegação de volta para a página de tipos de operação funciona corretamente.
   - **Tipo de Teste**: Teste de Integração

## Testes de Integração para `create-appointment.cy.ts`

1. **should create an appointment successfully**
   - **Propósito**: Verificar se uma consulta é criada com sucesso.
   - **Resultado Esperado**: A consulta é criada com sucesso.
   - **Tipo de Teste**: Teste de Integração

2. **should fail to create an appointment with missing fields**
   - **Propósito**: Verificar se a criação de uma consulta falha quando campos obrigatórios estão faltando.
   - **Resultado Esperado**: A criação da consulta falha e uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste de Integração

## Resumo do Número de Testes

- **Activate-Deactivate Staff**: 3 testes
- **Update Staff**: 8 testes
- **Update Patient**: 3 testes
- **Update Operation Type**: 3 testes
- **Update Conditions**: 3 testes
- **Update Appointment**: 2 testes
- **Update Allergies**: 3 testes
- **Search Staffs**: 8 testes
- **Request Delete**: 5 testes
- **Register**: 5 testes
- **Operation Types**: 7 testes
- **Medical History**: 3 testes
- **Manage Medical Condition**: 4 testes
- **Login**: 4 testes
- **List Patient**: 3 testes
- **Delete Patient**: 2 testes
- **Create Patient**: 3 testes
- **Create Staff**: 12 testes
- **Create Operation Type**: 4 testes
- **Create Operation Request**: 3 testes
- **Create Appointment**: 2 testes
