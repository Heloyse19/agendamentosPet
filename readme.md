# Clínica Veterinária Pet - Sistema de Agendamento

Sistema web para agendamento de consultas, exames e cirurgias em uma clínica veterinária. Desenvolvido como projeto de estudo para praticar HTML, CSS, JavaScript e integração com APIs externas.

## Funcionalidades

- Cadastro completo de agendamentos (tutor + pet + serviço)
- Armazenamento local usando localStorage (não precisa de banco de dados)
- Geração de comprovante em PDF (jsPDF)
- Envio de email de confirmação (EmailJS)
- Número de atendimento automático (A001, A002, A003...)
- Remoção de agendamentos da lista
- Design responsivo

## Tecnologias Utilizadas

- **HTML5** - Estrutura da página
- **CSS3** - Estilização e layout responsivo
- **JavaScript (ES6+)** - Lógica do sistema e manipulação do DOM
- **LocalStorage** - Persistência de dados local
- **jsPDF** - Geração de arquivos PDF
- **EmailJS** - Envio de emails sem backend

## Pré-requisitos

- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Conexão com internet (para carregar bibliotecas externas)
- Conta no [EmailJS](https://www.emailjs.com) (para envio de emails)

## Como executar o projeto

### 1. Clone o repositório

- git clone https://github.com/seu-usuario/clinica-veterinaria.git
- cd clinica-veterinaria

## 2. Configure o EmailJs

- Crie uma conta gratuita em EmailJS.com

- Conecte sua conta de email (Gmail, Outlook, etc.)

- Crie um template de email com as seguintes variáveis:

{{to_email}}

{{tutor_nome}}

{{pet_nome}}

{{pet_raca}}

{{pet_peso}}

{{tipo_atendimento}}

{{numero_atendimento}}

{{data_agendamento}}

{{hora_agendamento}}

{{observacoes}}

Copie suas chaves:

- PUBLIC_KEY (em Account > API Keys)

- SERVICE_ID (em Email Services)

- TEMPLATE_ID (em Email Templates)

## 3. Configure o arquivo config.js
Crie o arquivo config.js na raiz do projeto com suas chaves

- exemplo:
const EMAIL_CONFIG = {
    PUBLIC_KEY: 'sua_public_key_aqui',
    SERVICE_ID: 'seu_service_id_aqui',
    TEMPLATE_ID: 'seu_template_id_aqui'
};

Importante: O config.js está no .gitignore para não expor suas chaves no GitHub!

## 4. Abra o projeto
Basta abrir o arquivo index.html em qualquer navegador moderno.

## Como usar?

1. Preencha o formulário com os dados do tutor, pet e agendamento

2. Clique em "AGENDAR" - o agendamento será salvo na lista ao lado

3. Para gerar o comprovante: clique no botão "PDF" no card do agendamento

4. Para enviar confirmação por email: clique no botão "Email" e informe o email do tutor

5. Para remover um agendamento: clique no "×" no canto superior direito do card

## Possíveis problemas e soluções
- PDF não gera:	Verifique sua conexão com a internet (biblioteca jsPDF precisa carregar)

- Email não envia: Verifique se as chaves do EmailJS estão corretas no config.js

- Agendamentos somem: O localStorage é específico do navegador. Dados ficam salvos apenas no computador onde foram criados

- Estilos quebrados: Verifique se o style.css está no mesmo diretório do index.html

## Dependências externas (CDN)

- [jsPDF](https://cdnjs.com/libraries/jspdf) - Geração de PDF
- [EmailJS](https://www.emailjs.com/docs/) - Envio de emails

## Segurança
- O arquivo config.js está no .gitignore - nunca commite suas chaves!

- O sistema não envia dados para nenhum servidor externo além do EmailJS

- Os agendamentos ficam apenas no localStorage do navegador

## Próximos passos (em desenvolvimento)
- Melhorar o design visual

- Adicionar filtros por tipo de atendimento

- Implementar busca por nome do tutor/pet

- Adicionar edição de agendamentos

- Modo escuro

## Licença
Projeto desenvolvido para fins de estudo.

## Autora
Desenvolvido como projeto de estudo - Clínica Veterinária Pet
