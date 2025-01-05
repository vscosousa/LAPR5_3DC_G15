# Plano de Testes Unitários

Este documento fornece uma visão geral dos testes unitários relacionados aos diferentes componentes do sistema Angular. Os testes são divididos por container de teste e cada um deles verifica a funcionalidade de criação, atualização, recuperação e listagem de dados.

## Sumário

- [Testes Unitários para `activate-patient-user.component.spec.ts`](#testes-unitários-para-activate-patient-usercomponentspects)
- [Testes Unitários para `view-availability.component.spec.ts`](#testes-unitários-para-view-availabilitycomponentspects)
- [Testes Unitários para `update-staff.component.spec.ts`](#testes-unitários-para-update-staffcomponentspects)
- [Testes Unitários para `update-patient.component.spec.ts`](#testes-unitários-para-update-patientcomponentspects)
- [Testes Unitários para `update-appointment.component.spec.ts`](#testes-unitários-para-update-appointmentcomponentspects)
- [Testes Unitários para `specialization.component.spec.ts`](#testes-unitários-para-specializationcomponentspects)
- [Testes Unitários para `sidebar.component.spec.ts`](#testes-unitários-para-sidebarcomponentspects)
- [Testes Unitários para `search-staffs.component.spec.ts`](#testes-unitários-para-search-staffscomponentspects)
- [Testes Unitários para `active-modal.component.spec.ts`](#testes-unitários-para-active-modalcomponentspects)
- [Testes Unitários para `register.component.spec.ts`](#testes-unitários-para-registercomponentspects)
- [Testes Unitários para `patient-settings.component.spec.ts`](#testes-unitários-para-patient-settingscomponentspects)
- [Testes Unitários para `patient-panel.component.spec.ts`](#testes-unitários-para-patient-panelcomponentspects)
- [Testes Unitários para `panel-admin.component.spec.ts`](#testes-unitários-para-panel-admincomponentspects)
- [Testes Unitários para `operation-types.component.spec.ts`](#testes-unitários-para-operation-typescomponentspects)
- [Testes Unitários para `update-operation-type.component.spec.ts`](#testes-unitários-para-update-operation-typecomponentspects)
- [Testes Unitários para `create-operation-type.component.spec.ts`](#testes-unitários-para-create-operation-typecomponentspects)
- [Testes Unitários para `operation-requests.component.spec.ts`](#testes-unitários-para-operation-requestscomponentspects)
- [Testes Unitários para `update-operation-request.component.spec.ts`](#testes-unitários-para-update-operation-requestcomponentspects)
- [Testes Unitários para `create-operation-request.component.spec.ts`](#testes-unitários-para-create-operation-requestcomponentspects)
- [Testes Unitários para `not-found.component.spec.ts`](#testes-unitários-para-not-foundcomponentspects)
- [Testes Unitários para `medical-history-manager.component.spec.ts`](#testes-unitários-para-medical-history-managercomponentspects)
- [Testes Unitários para `manage-patients.component.spec.ts`](#testes-unitários-para-manage-patientscomponentspects)
- [Testes Unitários para `manage-allergies-and-conditions.component.spec.ts`](#testes-unitários-para-manage-allergies-and-conditionscomponentspects)
- [Testes Unitários para `update-conditions.component.spec.ts`](#testes-unitários-para-update-conditionscomponentspects)
- [Testes Unitários para `update-allergies.component.spec.ts`](#testes-unitários-para-update-allergiescomponentspects)
- [Testes Unitários para `create-conditions.component.spec.ts`](#testes-unitários-para-create-conditionscomponentspects)
- [Testes Unitários para `create-allergies.component.spec.ts`](#testes-unitários-para-create-allergiescomponentspects)
- [Testes Unitários para `login.component.spec.ts`](#testes-unitários-para-logincomponentspects)
- [Testes Unitários para `home.component.spec.ts`](#testes-unitários-para-homecomponentspects)
- [Testes Unitários para `doctor-panel.component.spec.ts`](#testes-unitários-para-doctor-panelcomponentspects)
- [Testes Unitários para `delete-user.component.spec.ts`](#testes-unitários-para-delete-usercomponentspects)
- [Testes Unitários para `create-staff.component.spec.ts`](#testes-unitários-para-create-staffcomponentspects)
- [Testes Unitários para `create-patient.component.spec.ts`](#testes-unitários-para-create-patientcomponentspects)
- [Testes Unitários para `create-appointment.component.spec.ts`](#testes-unitários-para-create-appointmentcomponentspects)
- [Testes Unitários para `confirm-updates-staff.component.spec.ts`](#testes-unitários-para-confirm-updates-staffcomponentspects)
- [Testes Unitários para `active-staff.component.spec.ts`](#testes-unitários-para-active-staffcomponentspects)
- [Resumo do Número de Testes](#resumo-do-número-de-testes)

## Testes Unitários para `activate-patient-user.component.spec.ts`

1. **should create the component**
   - **Propósito**: Verificar se o componente é criado com sucesso.
   - **Resultado Esperado**: O componente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

2. **should activate the user account successfully**
   - **Propósito**: Verificar se a conta do usuário é ativada com sucesso.
   - **Resultado Esperado**: A conta do usuário é ativada e uma mensagem de sucesso é exibida.
   - **Tipo de Teste**: Teste Unitário

3. **should handle activation error**
   - **Propósito**: Verificar se o erro de ativação é tratado corretamente.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste Unitário

4. **should alert user if token is not present in URL**
   - **Propósito**: Verificar se uma mensagem de alerta é exibida quando o token não está presente na URL.
   - **Resultado Esperado**: Uma mensagem de alerta é exibida.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `view-availability.component.spec.ts`

1. **should create**
   - **Propósito**: Verificar se o componente é criado com sucesso.
   - **Resultado Esperado**: O componente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

2. **should fetch staff details on init**
   - **Propósito**: Verificar se os detalhes do funcionário são buscados na inicialização.
   - **Resultado Esperado**: Os detalhes do funcionário são buscados com sucesso.
   - **Tipo de Teste**: Teste Unitário

3. **should handle error when fetching staff availability fails**
   - **Propósito**: Verificar se o erro ao buscar a disponibilidade do funcionário é tratado corretamente.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste Unitário

4. **should submit availability slots**
   - **Propósito**: Verificar se os slots de disponibilidade são enviados corretamente.
   - **Resultado Esperado**: Os slots de disponibilidade são enviados com sucesso.
   - **Tipo de Teste**: Teste Unitário

5. **should handle error when submitting availability slots fails**
   - **Propósito**: Verificar se o erro ao enviar os slots de disponibilidade é tratado corretamente.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `update-staff.component.spec.ts`

1. **should create**
   - **Propósito**: Verificar se o componente é criado com sucesso.
   - **Resultado Esperado**: O componente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

2. **should load specializations on init**
   - **Propósito**: Verificar se as especializações são carregadas na inicialização.
   - **Resultado Esperado**: As especializações são carregadas com sucesso.
   - **Tipo de Teste**: Teste Unitário

3. **should fetch staff details on init**
   - **Propósito**: Verificar se os detalhes do funcionário são buscados na inicialização.
   - **Resultado Esperado**: Os detalhes do funcionário são buscados com sucesso.
   - **Tipo de Teste**: Teste Unitário

4. **should update staff details and navigate to search-staffs**
   - **Propósito**: Verificar se os detalhes do funcionário são atualizados e a navegação para a página de busca de funcionários é realizada.
   - **Resultado Esperado**: Os detalhes do funcionário são atualizados e a navegação é realizada com sucesso.
   - **Tipo de Teste**: Teste Unitário

5. **should handle error when updating staff details**
   - **Propósito**: Verificar se o erro ao atualizar os detalhes do funcionário é tratado corretamente.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `update-patient.component.spec.ts`

1. **should create**
   - **Propósito**: Verificar se o componente é criado com sucesso.
   - **Resultado Esperado**: O componente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

2. **should fetch patient details on init**
   - **Propósito**: Verificar se os detalhes do paciente são buscados na inicialização.
   - **Resultado Esperado**: Os detalhes do paciente são buscados com sucesso.
   - **Tipo de Teste**: Teste Unitário

3. **should update patient details**
   - **Propósito**: Verificar se os detalhes do paciente são atualizados corretamente.
   - **Resultado Esperado**: Os detalhes do paciente são atualizados com sucesso.
   - **Tipo de Teste**: Teste Unitário

4. **should handle error when updating patient details**
   - **Propósito**: Verificar se o erro ao atualizar os detalhes do paciente é tratado corretamente.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste Unitário

5. **should clear the form**
   - **Propósito**: Verificar se o formulário é limpo corretamente.
   - **Resultado Esperado**: O formulário é limpo com sucesso.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `update-appointment.component.spec.ts`

1. **should create**
   - **Propósito**: Verificar se o componente é criado com sucesso.
   - **Resultado Esperado**: O componente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

2. **should load appointment on init**
   - **Propósito**: Verificar se a consulta é carregada na inicialização.
   - **Resultado Esperado**: A consulta é carregada com sucesso.
   - **Tipo de Teste**: Teste Unitário

3. **should load appointment successfully**
   - **Propósito**: Verificar se a consulta é carregada corretamente.
   - **Resultado Esperado**: A consulta é carregada com sucesso.
   - **Tipo de Teste**: Teste Unitário

4. **should handle error while loading appointment**
   - **Propósito**: Verificar se o erro ao carregar a consulta é tratado corretamente.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste Unitário

5. **should fetch operation types successfully**
   - **Propósito**: Verificar se os tipos de operação são buscados corretamente.
   - **Resultado Esperado**: Os tipos de operação são buscados com sucesso.
   - **Tipo de Teste**: Teste Unitário

6. **should handle error while fetching operation types**
   - **Propósito**: Verificar se o erro ao buscar os tipos de operação é tratado corretamente.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste Unitário

7. **should fetch staff list based on operation type**
   - **Propósito**: Verificar se a lista de funcionários é buscada com base no tipo de operação.
   - **Resultado Esperado**: A lista de funcionários é buscada com sucesso.
   - **Tipo de Teste**: Teste Unitário

8. **should handle no staff list for the selected operation type**
   - **Propósito**: Verificar se o caso de não haver lista de funcionários para o tipo de operação selecionado é tratado corretamente.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste Unitário

9. **should update team when a member is added**
   - **Propósito**: Verificar se a equipe é atualizada quando um membro é adicionado.
   - **Resultado Esperado**: A equipe é atualizada com sucesso.
   - **Tipo de Teste**: Teste Unitário

10. **should update team when a member is removed**
    - **Propósito**: Verificar se a equipe é atualizada quando um membro é removido.
    - **Resultado Esperado**: A equipe é atualizada com sucesso.
    - **Tipo de Teste**: Teste Unitário

11. **should update an appointment successfully**
    - **Propósito**: Verificar se a consulta é atualizada com sucesso.
    - **Resultado Esperado**: A consulta é atualizada com sucesso.
    - **Tipo de Teste**: Teste Unitário

12. **should handle error during appointment update**
    - **Propósito**: Verificar se o erro ao atualizar a consulta é tratado corretamente.
    - **Resultado Esperado**: Uma mensagem de erro é exibida.
    - **Tipo de Teste**: Teste Unitário

13. **should clear the form**
    - **Propósito**: Verificar se o formulário é limpo corretamente.
    - **Resultado Esperado**: O formulário é limpo com sucesso.
    - **Tipo de Teste**: Teste Unitário

14. **should fetch operation requests and handle no matching request**
    - **Propósito**: Verificar se as solicitações de operação são buscadas e se o caso de não haver solicitação correspondente é tratado corretamente.
    - **Resultado Esperado**: Uma mensagem de erro é exibida.
    - **Tipo de Teste**: Teste Unitário

15. **should fetch operation requests and handle undefined request ID**
    - **Propósito**: Verificar se as solicitações de operação são buscadas e se o caso de ID de solicitação indefinido é tratado corretamente.
    - **Resultado Esperado**: Uma mensagem de erro é exibida.
    - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `specialization.component.spec.ts`

1. **should create**
   - **Propósito**: Verificar se o componente é criado com sucesso.
   - **Resultado Esperado**: O componente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `sidebar.component.spec.ts`

1. **should create**
   - **Propósito**: Verificar se o componente é criado com sucesso.
   - **Resultado Esperado**: O componente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

2. **should initialize panelId and settingsId**
   - **Propósito**: Verificar se o panelId e o settingsId são inicializados corretamente.
   - **Resultado Esperado**: O panelId e o settingsId são inicializados com sucesso.
   - **Tipo de Teste**: Teste Unitário

3. **should decode token and set name and role**
   - **Propósito**: Verificar se o token é decodificado e o nome e o papel são definidos corretamente.
   - **Resultado Esperado**: O token é decodificado e o nome e o papel são definidos com sucesso.
   - **Tipo de Teste**: Teste Unitário

4. **should handle logout**
   - **Propósito**: Verificar se o logout é tratado corretamente.
   - **Resultado Esperado**: O logout é realizado com sucesso.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `search-staffs.component.spec.ts`

1. **should create**
   - **Propósito**: Verificar se o componente é criado com sucesso.
   - **Resultado Esperado**: O componente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

2. **should fetch all staffs on init**
   - **Propósito**: Verificar se todos os funcionários são buscados na inicialização.
   - **Resultado Esperado**: Todos os funcionários são buscados com sucesso.
   - **Tipo de Teste**: Teste Unitário

3. **should fetch specializations on init**
   - **Propósito**: Verificar se as especializações são buscadas na inicialização.
   - **Resultado Esperado**: As especializações são buscadas com sucesso.
   - **Tipo de Teste**: Teste Unitário

4. **should search staffs**
   - **Propósito**: Verificar se a busca de funcionários é realizada corretamente.
   - **Resultado Esperado**: A busca de funcionários é realizada com sucesso.
   - **Tipo de Teste**: Teste Unitário

5. **should clear the form**
   - **Propósito**: Verificar se o formulário é limpo corretamente.
   - **Resultado Esperado**: O formulário é limpo com sucesso.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `active-modal.component.spec.ts`

1. **should create**
  - **Propósito**: Verificar se o componente é criado com sucesso.
  - **Resultado Esperado**: O componente é criado com sucesso.
  - **Tipo de Teste**: Teste Unitário

2. **should display error if username is empty**
  - **Propósito**: Verificar se uma mensagem de erro é exibida quando o nome de usuário está vazio.
  - **Resultado Esperado**: Uma mensagem de erro é exibida.
  - **Tipo de Teste**: Teste Unitário

3. **should activate user successfully**
  - **Propósito**: Verificar se o usuário é ativado com sucesso.
  - **Resultado Esperado**: O usuário é ativado com sucesso.
  - **Tipo de Teste**: Teste Unitário

4. **should handle error when activation fails**
  - **Propósito**: Verificar se o erro ao ativar o usuário é tratado corretamente.
  - **Resultado Esperado**: Uma mensagem de erro é exibida.
  - **Tipo de Teste**: Teste Unitário

5. **should close modal after successful activation**
  - **Propósito**: Verificar se o modal é fechado após a ativação bem-sucedida.
  - **Resultado Esperado**: O modal é fechado com sucesso.
  - **Tipo de Teste**: Teste Unitário

6. **should close modal when closeModal is called**
  - **Propósito**: Verificar se o modal é fechado quando closeModal é chamado.
  - **Resultado Esperado**: O modal é fechado com sucesso.
  - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `register.component.spec.ts`

1. **should create**
   - **Propósito**: Verificar se o componente é criado com sucesso.
   - **Resultado Esperado**: O componente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

2. **should toggle password visibility**
   - **Propósito**: Verificar se a visibilidade da senha pode ser alternada.
   - **Resultado Esperado**: A visibilidade da senha é alternada com sucesso.
   - **Tipo de Teste**: Teste Unitário

3. **should toggle confirm password visibility**
   - **Propósito**: Verificar se a visibilidade da confirmação de senha pode ser alternada.
   - **Resultado Esperado**: A visibilidade da confirmação de senha é alternada com sucesso.
   - **Tipo de Teste**: Teste Unitário

4. **should not submit form if invalid**
   - **Propósito**: Verificar se o formulário não é enviado se for inválido.
   - **Resultado Esperado**: O formulário não é enviado.
   - **Tipo de Teste**: Teste Unitário

5. **should alert if passwords do not match**
   - **Propósito**: Verificar se uma mensagem de alerta é exibida quando as senhas não coincidem.
   - **Resultado Esperado**: Uma mensagem de alerta é exibida.
   - **Tipo de Teste**: Teste Unitário

6. **should call register service on valid form submission**
   - **Propósito**: Verificar se o serviço de registro é chamado ao enviar um formulário válido.
   - **Resultado Esperado**: O serviço de registro é chamado.
   - **Tipo de Teste**: Teste Unitário

7. **should handle registration failure**
   - **Propósito**: Verificar se o erro de registro é tratado corretamente.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `patient-settings.component.spec.ts`

1. **should create**
   - **Propósito**: Verificar se o componente é criado com sucesso.
   - **Resultado Esperado**: O componente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

2. **should handle account deletion successfully**
   - **Propósito**: Verificar se a exclusão da conta é tratada com sucesso.
   - **Resultado Esperado**: A conta é excluída com sucesso.
   - **Tipo de Teste**: Teste Unitário

3. **should handle account deletion failure**
   - **Propósito**: Verificar se o erro de exclusão da conta é tratado corretamente.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste Unitário

4. **should navigate to login if no token is found**
   - **Propósito**: Verificar se a navegação para a página de login ocorre quando nenhum token é encontrado.
   - **Resultado Esperado**: A navegação para a página de login ocorre.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `patient-panel.component.spec.ts`

1. **should create**
   - **Propósito**: Verificar se o componente é criado com sucesso.
   - **Resultado Esperado**: O componente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `panel-admin.component.spec.ts`

1. **should create**
   - **Propósito**: Verificar se o componente é criado com sucesso.
   - **Resultado Esperado**: O componente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `operation-types.component.spec.ts`

1. **should create**
   - **Propósito**: Verificar se o componente é criado com sucesso.
   - **Resultado Esperado**: O componente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `update-operation-type.component.spec.ts`

1. **should create**
   - **Propósito**: Verificar se o componente é criado com sucesso.
   - **Resultado Esperado**: O componente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `create-operation-type.component.spec.ts`

1. **should create**
   - **Propósito**: Verificar se o componente é criado com sucesso.
   - **Resultado Esperado**: O componente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `operation-requests.component.spec.ts`

1. **should create**
   - **Propósito**: Verificar se o componente é criado com sucesso.
   - **Resultado Esperado**: O componente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `update-operation-request.component.spec.ts`

1. **should assert true is true**
   - **Propósito**: Verificar se a asserção de verdade é verdadeira.
   - **Resultado Esperado**: A asserção de verdade é verdadeira.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `create-operation-request.component.spec.ts`

1. **should create**
   - **Propósito**: Verificar se o componente é criado com sucesso.
   - **Resultado Esperado**: O componente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `not-found.component.spec.ts`

1. **should create**
   - **Propósito**: Verificar se o componente é criado com sucesso.
   - **Resultado Esperado**: O componente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

2. **should have a 404 image**
   - **Propósito**: Verificar se a imagem 404 é exibida.
   - **Resultado Esperado**: A imagem 404 é exibida.
   - **Tipo de Teste**: Teste Unitário

3. **should have a link to the home page**
   - **Propósito**: Verificar se há um link para a página inicial.
   - **Resultado Esperado**: O link para a página inicial é exibido.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `medical-history-manager.component.spec.ts`

1. **should create**
   - **Propósito**: Verificar se o componente é criado com sucesso.
   - **Resultado Esperado**: O componente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

2. **should fetch patients**
   - **Propósito**: Verificar se os pacientes são buscados corretamente.
   - **Resultado Esperado**: Os pacientes são buscados com sucesso.
   - **Tipo de Teste**: Teste Unitário

3. **should fetch allergies**
   - **Propósito**: Verificar se as alergias são buscadas corretamente.
   - **Resultado Esperado**: As alergias são buscadas com sucesso.
   - **Tipo de Teste**: Teste Unitário

4. **should fetch medical conditions**
   - **Propósito**: Verificar se as condições médicas são buscadas corretamente.
   - **Resultado Esperado**: As condições médicas são buscadas com sucesso.
   - **Tipo de Teste**: Teste Unitário

5. **should apply filters**
   - **Propósito**: Verificar se os filtros são aplicados corretamente.
   - **Resultado Esperado**: Os filtros são aplicados com sucesso.
   - **Tipo de Teste**: Teste Unitário

6. **should clear filters**
   - **Propósito**: Verificar se os filtros são limpos corretamente.
   - **Resultado Esperado**: Os filtros são limpos com sucesso.
   - **Tipo de Teste**: Teste Unitário

7. **should view patient details**
   - **Propósito**: Verificar se os detalhes do paciente são visualizados corretamente.
   - **Resultado Esperado**: Os detalhes do paciente são visualizados com sucesso.
   - **Tipo de Teste**: Teste Unitário

8. **should fetch medical history**
   - **Propósito**: Verificar se o histórico médico é buscado corretamente.
   - **Resultado Esperado**: O histórico médico é buscado com sucesso.
   - **Tipo de Teste**: Teste Unitário

9. **should search allergies**
   - **Propósito**: Verificar se a busca de alergias é realizada corretamente.
   - **Resultado Esperado**: A busca de alergias é realizada com sucesso.
   - **Tipo de Teste**: Teste Unitário

10. **should search medical conditions**
    - **Propósito**: Verificar se a busca de condições médicas é realizada corretamente.
    - **Resultado Esperado**: A busca de condições médicas é realizada com sucesso.
    - **Tipo de Teste**: Teste Unitário

11. **should delete patient**
    - **Propósito**: Verificar se o paciente é excluído corretamente.
    - **Resultado Esperado**: O paciente é excluído com sucesso.
    - **Tipo de Teste**: Teste Unitário

12. **should refresh patient list**
    - **Propósito**: Verificar se a lista de pacientes é atualizada corretamente.
    - **Resultado Esperado**: A lista de pacientes é atualizada com sucesso.
    - **Tipo de Teste**: Teste Unitário

13. **should open medical history modal**
    - **Propósito**: Verificar se o modal de histórico médico é aberto corretamente.
    - **Resultado Esperado**: O modal de histórico médico é aberto com sucesso.
    - **Tipo de Teste**: Teste Unitário

14. **should close medical history modal**
    - **Propósito**: Verificar se o modal de histórico médico é fechado corretamente.
    - **Resultado Esperado**: O modal de histórico médico é fechado com sucesso.
    - **Tipo de Teste**: Teste Unitário

15. **should filter selected allergies**
    - **Propósito**: Verificar se as alergias selecionadas são filtradas corretamente.
    - **Resultado Esperado**: As alergias selecionadas são filtradas com sucesso.
    - **Tipo de Teste**: Teste Unitário

16. **should filter selected medical conditions**
    - **Propósito**: Verificar se as condições médicas selecionadas são filtradas corretamente.
    - **Resultado Esperado**: As condições médicas selecionadas são filtradas com sucesso.
    - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `manage-patients.component.spec.ts`

1. **should create**
   - **Propósito**: Verificar se o componente é criado com sucesso.
   - **Resultado Esperado**: O componente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

2. **should fetch patients on init**
   - **Propósito**: Verificar se os pacientes são buscados na inicialização.
   - **Resultado Esperado**: Os pacientes são buscados com sucesso.
   - **Tipo de Teste**: Teste Unitário

3. **should fetch allergies on init**
   - **Propósito**: Verificar se as alergias são buscadas na inicialização.
   - **Resultado Esperado**: As alergias são buscadas com sucesso.
   - **Tipo de Teste**: Teste Unitário

4. **should fetch medical conditions on init**
   - **Propósito**: Verificar se as condições médicas são buscadas na inicialização.
   - **Resultado Esperado**: As condições médicas são buscadas com sucesso.
   - **Tipo de Teste**: Teste Unitário

5. **should handle error while fetching patients**
   - **Propósito**: Verificar se o erro ao buscar pacientes é tratado corretamente.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste Unitário

6. **should fetch allergies successfully**
   - **Propósito**: Verificar se as alergias são buscadas corretamente.
   - **Resultado Esperado**: As alergias são buscadas com sucesso.
   - **Tipo de Teste**: Teste Unitário

7. **should handle error while fetching allergies**
   - **Propósito**: Verificar se o erro ao buscar alergias é tratado corretamente.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste Unitário

8. **should fetch medical conditions successfully**
   - **Propósito**: Verificar se as condições médicas são buscadas corretamente.
   - **Resultado Esperado**: As condições médicas são buscadas com sucesso.
   - **Tipo de Teste**: Teste Unitário

9. **should handle error while fetching medical conditions**
   - **Propósito**: Verificar se o erro ao buscar condições médicas é tratado corretamente.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste Unitário

10. **should apply filters**
    - **Propósito**: Verificar se os filtros são aplicados corretamente.
    - **Resultado Esperado**: Os filtros são aplicados com sucesso.
    - **Tipo de Teste**: Teste Unitário

11. **should filter patients successfully**
    - **Propósito**: Verificar se os pacientes são filtrados corretamente.
    - **Resultado Esperado**: Os pacientes são filtrados com sucesso.
    - **Tipo de Teste**: Teste Unitário

12. **should handle error while filtering patients**
    - **Propósito**: Verificar se o erro ao filtrar pacientes é tratado corretamente.
    - **Resultado Esperado**: Uma mensagem de erro é exibida.
    - **Tipo de Teste**: Teste Unitário

13. **should clear filters**
    - **Propósito**: Verificar se os filtros são limpos corretamente.
    - **Resultado Esperado**: Os filtros são limpos com sucesso.
    - **Tipo de Teste**: Teste Unitário

14. **should delete patient**
    - **Propósito**: Verificar se o paciente é excluído corretamente.
    - **Resultado Esperado**: O paciente é excluído com sucesso.
    - **Tipo de Teste**: Teste Unitário

15. **should handle error while deleting patient**
    - **Propósito**: Verificar se o erro ao excluir paciente é tratado corretamente.
    - **Resultado Esperado**: Uma mensagem de erro é exibida.
    - **Tipo de Teste**: Teste Unitário

16. **should view patient details**
    - **Propósito**: Verificar se os detalhes do paciente são visualizados corretamente.
    - **Resultado Esperado**: Os detalhes do paciente são visualizados com sucesso.
    - **Tipo de Teste**: Teste Unitário

17. **should fetch medical history successfully**
    - **Propósito**: Verificar se o histórico médico é buscado corretamente.
    - **Resultado Esperado**: O histórico médico é buscado com sucesso.
    - **Tipo de Teste**: Teste Unitário

18. **should handle error while fetching medical history**
    - **Propósito**: Verificar se o erro ao buscar histórico médico é tratado corretamente.
    - **Resultado Esperado**: Uma mensagem de erro é exibida.
    - **Tipo de Teste**: Teste Unitário

19. **should filter selected allergies**
    - **Propósito**: Verificar se as alergias selecionadas são filtradas corretamente.
    - **Resultado Esperado**: As alergias selecionadas são filtradas com sucesso.
    - **Tipo de Teste**: Teste Unitário

20. **should filter selected medical conditions**
    - **Propósito**: Verificar se as condições médicas selecionadas são filtradas corretamente.
    - **Resultado Esperado**: As condições médicas selecionadas são filtradas com sucesso.
    - **Tipo de Teste**: Teste Unitário

21. **should search allergies**
    - **Propósito**: Verificar se a busca de alergias é realizada corretamente.
    - **Resultado Esperado**: A busca de alergias é realizada com sucesso.
    - **Tipo de Teste**: Teste Unitário

22. **should search medical conditions**
    - **Propósito**: Verificar se a busca de condições médicas é realizada corretamente.
    - **Resultado Esperado**: A busca de condições médicas é realizada com sucesso.
    - **Tipo de Teste**: Teste Unitário

23. **should refresh patient list after deletion**
    - **Propósito**: Verificar se a lista de pacientes é atualizada após a exclusão.
    - **Resultado Esperado**: A lista de pacientes é atualizada com sucesso.
    - **Tipo de Teste**: Teste Unitário
## Testes Unitários para `manage-allergies-and-conditions.component.spec.ts`

1. **should create**
   - **Propósito**: Verificar se o componente é criado com sucesso.
   - **Resultado Esperado**: O componente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

2. **should fetch allergies on init**
   - **Propósito**: Verificar se as alergias são buscadas na inicialização.
   - **Resultado Esperado**: As alergias são buscadas com sucesso.
   - **Tipo de Teste**: Teste Unitário

3. **should fetch medical conditions on init**
   - **Propósito**: Verificar se as condições médicas são buscadas na inicialização.
   - **Resultado Esperado**: As condições médicas são buscadas com sucesso.
   - **Tipo de Teste**: Teste Unitário

4. **should open modal and navigate to the correct route**
   - **Propósito**: Verificar se o modal é aberto e a navegação para a rota correta é realizada.
   - **Resultado Esperado**: O modal é aberto e a navegação é realizada com sucesso.
   - **Tipo de Teste**: Teste Unitário

5. **should close modal and reset state**
   - **Propósito**: Verificar se o modal é fechado e o estado é redefinido corretamente.
   - **Resultado Esperado**: O modal é fechado e o estado é redefinido com sucesso.
   - **Tipo de Teste**: Teste Unitário

6. **should fetch allergies successfully**
   - **Propósito**: Verificar se as alergias são buscadas com sucesso.
   - **Resultado Esperado**: As alergias são buscadas com sucesso.
   - **Tipo de Teste**: Teste Unitário

7. **should handle error while fetching allergies**
   - **Propósito**: Verificar se o erro ao buscar alergias é tratado corretamente.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste Unitário

8. **should fetch medical conditions successfully**
   - **Propósito**: Verificar se as condições médicas são buscadas com sucesso.
   - **Resultado Esperado**: As condições médicas são buscadas com sucesso.
   - **Tipo de Teste**: Teste Unitário

9. **should handle error while fetching medical conditions**
   - **Propósito**: Verificar se o erro ao buscar condições médicas é tratado corretamente.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste Unitário

10. **should handle allergy created event**
    - **Propósito**: Verificar se o evento de criação de alergia é tratado corretamente.
    - **Resultado Esperado**: O modal é fechado após a criação da alergia.
    - **Tipo de Teste**: Teste Unitário

11. **should handle condition created event**
    - **Propósito**: Verificar se o evento de criação de condição médica é tratado corretamente.
    - **Resultado Esperado**: O modal é fechado após a criação da condição médica.
    - **Tipo de Teste**: Teste Unitário

12. **should handle allergy updated event**
    - **Propósito**: Verificar se o evento de atualização de alergia é tratado corretamente.
    - **Resultado Esperado**: O modal é fechado após a atualização da alergia.
    - **Tipo de Teste**: Teste Unitário

13. **should handle condition updated event**
    - **Propósito**: Verificar se o evento de atualização de condição médica é tratado corretamente.
    - **Resultado Esperado**: O modal é fechado após a atualização da condição médica.
    - **Tipo de Teste**: Teste Unitário

14. **should refresh page by fetching allergies and medical conditions**
    - **Propósito**: Verificar se a página é atualizada buscando alergias e condições médicas.
    - **Resultado Esperado**: As alergias e condições médicas são buscadas com sucesso.
    - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `active-staff.component.spec.ts`

1. **should create**
   - **Propósito**: Verificar se o componente é criado com sucesso.
   - **Resultado Esperado**: O componente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

2. **should initialize with token from query params**
   - **Propósito**: Verificar se o token é inicializado a partir dos parâmetros da query.
   - **Resultado Esperado**: O token é inicializado corretamente.
   - **Tipo de Teste**: Teste Unitário

3. **should display error if passwords do not match**
   - **Propósito**: Verificar se uma mensagem de erro é exibida quando as senhas não coincidem.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste Unitário

4. **should display error if passwords are empty**
   - **Propósito**: Verificar se uma mensagem de erro é exibida quando as senhas estão vazias.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste Unitário

5. **should activate user successfully**
   - **Propósito**: Verificar se o usuário é ativado com sucesso.
   - **Resultado Esperado**: O usuário é ativado com sucesso.
   - **Tipo de Teste**: Teste Unitário

6. **should handle error when activation fails**
   - **Propósito**: Verificar se o erro ao ativar o usuário é tratado corretamente.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste Unitário

7. **should navigate to home after successful activation**
   - **Propósito**: Verificar se a navegação para a página inicial ocorre após a ativação bem-sucedida.
   - **Resultado Esperado**: A navegação para a página inicial ocorre.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `confirm-updates-staff.component.spec.ts`

1. **should create**
   - **Propósito**: Verificar se o componente é criado com sucesso.
   - **Resultado Esperado**: O componente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

2. **should initialize with query params**
   - **Propósito**: Verificar se os parâmetros da query são inicializados corretamente.
   - **Resultado Esperado**: Os parâmetros da query são inicializados corretamente.
   - **Tipo de Teste**: Teste Unitário

3. **should confirm updates successfully**
   - **Propósito**: Verificar se as atualizações são confirmadas com sucesso.
   - **Resultado Esperado**: As atualizações são confirmadas com sucesso.
   - **Tipo de Teste**: Teste Unitário

4. **should handle error when confirming updates fails**
   - **Propósito**: Verificar se o erro ao confirmar as atualizações é tratado corretamente.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste Unitário

5. **should navigate to home after successful confirmation**
   - **Propósito**: Verificar se a navegação para a página inicial ocorre após a confirmação bem-sucedida.
   - **Resultado Esperado**: A navegação para a página inicial ocorre.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `create-appointment.component.spec.ts`

1. **should create**
   - **Propósito**: Verificar se o componente é criado com sucesso.
   - **Resultado Esperado**: O componente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

2. **should fetch operation requests on init**
   - **Propósito**: Verificar se as solicitações de operação são buscadas na inicialização.
   - **Resultado Esperado**: As solicitações de operação são buscadas com sucesso.
   - **Tipo de Teste**: Teste Unitário

3. **should fetch operation types successfully**
   - **Propósito**: Verificar se os tipos de operação são buscados com sucesso.
   - **Resultado Esperado**: Os tipos de operação são buscados com sucesso.
   - **Tipo de Teste**: Teste Unitário

4. **should handle error while fetching operation types**
   - **Propósito**: Verificar se o erro ao buscar os tipos de operação é tratado corretamente.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste Unitário

5. **should fetch staff list based on operation type**
   - **Propósito**: Verificar se a lista de funcionários é buscada com base no tipo de operação.
   - **Resultado Esperado**: A lista de funcionários é buscada com sucesso.
   - **Tipo de Teste**: Teste Unitário

6. **should handle no staff list for the selected operation type**
   - **Propósito**: Verificar se o caso de não haver lista de funcionários para o tipo de operação selecionado é tratado corretamente.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste Unitário

7. **should update team when a member is added**
   - **Propósito**: Verificar se a equipe é atualizada quando um membro é adicionado.
   - **Resultado Esperado**: A equipe é atualizada com sucesso.
   - **Tipo de Teste**: Teste Unitário

8. **should update team when a member is removed**
   - **Propósito**: Verificar se a equipe é atualizada quando um membro é removido.
   - **Resultado Esperado**: A equipe é atualizada com sucesso.
   - **Tipo de Teste**: Teste Unitário

9. **should create an appointment successfully**
   - **Propósito**: Verificar se uma consulta é criada com sucesso.
   - **Resultado Esperado**: A consulta é criada com sucesso.
   - **Tipo de Teste**: Teste Unitário

10. **should handle error during appointment creation**
    - **Propósito**: Verificar se o erro ao criar a consulta é tratado corretamente.
    - **Resultado Esperado**: Uma mensagem de erro é exibida.
    - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `create-patient.component.spec.ts`

1. **should create**
   - **Propósito**: Verificar se o componente é criado com sucesso.
   - **Resultado Esperado**: O componente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

2. **should createPatient**
   - **Propósito**: Verificar se um paciente é criado com sucesso.
   - **Resultado Esperado**: O paciente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

3. **should handle error when createPatient fails**
   - **Propósito**: Verificar se o erro ao criar o paciente é tratado corretamente.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste Unitário

4. **should clear the form after creating a patient**
   - **Propósito**: Verificar se o formulário é limpo após a criação de um paciente.
   - **Resultado Esperado**: O formulário é limpo com sucesso.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `create-staff.component.spec.ts`

1. **should create**
   - **Propósito**: Verificar se o componente é criado com sucesso.
   - **Resultado Esperado**: O componente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

2. **should load specializations on init**
   - **Propósito**: Verificar se as especializações são carregadas na inicialização.
   - **Resultado Esperado**: As especializações são carregadas com sucesso.
   - **Tipo de Teste**: Teste Unitário

3. **should load staff types on init**
   - **Propósito**: Verificar se os tipos de funcionários são carregados na inicialização.
   - **Resultado Esperado**: Os tipos de funcionários são carregados com sucesso.
   - **Tipo de Teste**: Teste Unitário

4. **should createStaff and navigate to search-staffs**
   - **Propósito**: Verificar se um funcionário é criado e a navegação para a página de busca de funcionários é realizada.
   - **Resultado Esperado**: O funcionário é criado e a navegação é realizada com sucesso.
   - **Tipo de Teste**: Teste Unitário

5. **should handle error when createStaff fails**
   - **Propósito**: Verificar se o erro ao criar o funcionário é tratado corretamente.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste Unitário

6. **should handle unauthorized error when createStaff fails**
   - **Propósito**: Verificar se o erro de acesso não autorizado ao criar o funcionário é tratado corretamente.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `delete-user.component.spec.ts`

1. **should create**
   - **Propósito**: Verificar se o componente é criado com sucesso.
   - **Resultado Esperado**: O componente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

2. **should delete user account successfully**
   - **Propósito**: Verificar se a conta do usuário é excluída com sucesso.
   - **Resultado Esperado**: A conta do usuário é excluída com sucesso.
   - **Tipo de Teste**: Teste Unitário

3. **should handle error when deleteAccount fails**
   - **Propósito**: Verificar se o erro ao excluir a conta é tratado corretamente.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste Unitário

4. **should alert user if token is not present in URL**
   - **Propósito**: Verificar se uma mensagem de alerta é exibida quando o token não está presente na URL.
   - **Resultado Esperado**: Uma mensagem de alerta é exibida.
   - **Tipo de Teste**: Teste Unitário

5. **should navigate to home and alert user when cancel is clicked**
   - **Propósito**: Verificar se a navegação para a página inicial ocorre e uma mensagem de alerta é exibida quando o cancelamento é clicado.
   - **Resultado Esperado**: A navegação para a página inicial ocorre e uma mensagem de alerta é exibida.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `doctor-panel.component.spec.ts`

1. **should create**
   - **Propósito**: Verificar se o componente é criado com sucesso.
   - **Resultado Esperado**: O componente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `home.component.spec.ts`

1. **should create**
   - **Propósito**: Verificar se o componente é criado com sucesso.
   - **Resultado Esperado**: O componente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

2. **should have a login button**
   - **Propósito**: Verificar se o botão de login está presente.
   - **Resultado Esperado**: O botão de login está presente.
   - **Tipo de Teste**: Teste Unitário

3. **should have a register button**
   - **Propósito**: Verificar se o botão de registro está presente.
   - **Resultado Esperado**: O botão de registro está presente.
   - **Tipo de Teste**: Teste Unitário

4. **should have an articles section**
   - **Propósito**: Verificar se a seção de artigos está presente.
   - **Resultado Esperado**: A seção de artigos está presente.
   - **Tipo de Teste**: Teste Unitário

5. **should have a footer**
   - **Propósito**: Verificar se o rodapé está presente.
   - **Resultado Esperado**: O rodapé está presente.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `login.component.spec.ts`

1. **should create**
   - **Propósito**: Verificar se o componente é criado com sucesso.
   - **Resultado Esperado**: O componente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `create-allergies.component.spec.ts`

1. **should create**
   - **Propósito**: Verificar se o componente é criado com sucesso.
   - **Resultado Esperado**: O componente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `create-conditions.component.spec.ts`

1. **should create**
   - **Propósito**: Verificar se o componente é criado com sucesso.
   - **Resultado Esperado**: O componente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `update-allergies.component.spec.ts`

1. **should create**
   - **Propósito**: Verificar se o componente é criado com sucesso.
   - **Resultado Esperado**: O componente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

2. **should update allergy successfully**
   - **Propósito**: Verificar se a alergia é atualizada com sucesso.
   - **Resultado Esperado**: A alergia é atualizada com sucesso.
   - **Tipo de Teste**: Teste Unitário

3. **should handle error while updating allergy**
   - **Propósito**: Verificar se o erro ao atualizar a alergia é tratado corretamente.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste Unitário

## Testes Unitários para `update-conditions.component.spec.ts`

1. **should create**
   - **Propósito**: Verificar se o componente é criado com sucesso.
   - **Resultado Esperado**: O componente é criado com sucesso.
   - **Tipo de Teste**: Teste Unitário

2. **should update condition successfully**
   - **Propósito**: Verificar se a condição médica é atualizada com sucesso.
   - **Resultado Esperado**: A condição médica é atualizada com sucesso.
   - **Tipo de Teste**: Teste Unitário

3. **should handle error when updating condition fails**
   - **Propósito**: Verificar se o erro ao atualizar a condição médica é tratado corretamente.
   - **Resultado Esperado**: Uma mensagem de erro é exibida.
   - **Tipo de Teste**: Teste Unitário

## Resumo do Número de Testes

- **activate-patient-user.component.spec.ts**: 4 testes
- **view-availability.component.spec.ts**: 5 testes
- **update-staff.component.spec.ts**: 5 testes
- **update-patient.component.spec.ts**: 5 testes
- **update-appointment.component.spec.ts**: 15 testes
- **specialization.component.spec.ts**: 1 teste
- **sidebar.component.spec.ts**: 4 testes
- **search-staffs.component.spec.ts**: 5 testes
- **active-modal.component.spec.ts**: 6 testes
- **register.component.spec.ts**: 7 testes
- **patient-settings.component.spec.ts**: 4 testes
- **patient-panel.component.spec.ts**: 1 teste
- **panel-admin.component.spec.ts**: 1 teste
- **operation-types.component.spec.ts**: 1 teste
- **update-operation-type.component.spec.ts**: 1 teste
- **create-operation-type.component.spec.ts**: 1 teste
- **operation-requests.component.spec.ts**: 1 teste
- **update-operation-request.component.spec.ts**: 1 teste
- **create-operation-request.component.spec.ts**: 1 teste
- **not-found.component.spec.ts**: 3 testes
- **medical-history-manager.component.spec.ts**: 16 testes
- **manage-patients.component.spec.ts**: 23 testes
- **manage-allergies-and-conditions.component.spec.ts**: 14 testes
- **active-staff.component.spec.ts**: 7 testes
- **confirm-updates-staff.component.spec.ts**: 5 testes
- **create-appointment.component.spec.ts**: 10 testes
- **create-patient.component.spec.ts**: 4 testes
- **create-staff.component.spec.ts**: 6 testes
- **delete-user.component.spec.ts**: 5 testes
- **doctor-panel.component.spec.ts**: 1 teste
- **home.component.spec.ts**: 5 testes
- **login.component.spec.ts**: 1 teste
- **create-allergies.component.spec.ts**: 1 teste
- **create-conditions.component.spec.ts**: 1 teste
- **update-allergies.component.spec.ts**: 3 testes
- **update-conditions.component.spec.ts**: 3 testes

Total de Testes: 233
