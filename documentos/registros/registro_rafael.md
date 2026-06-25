### Data: 19/05/2026


### Objetivo do Dia

Rafael: Realizar o estudo aprofundado do guia de estilos.

### Guia de estilos
Colocar fotos se for preciso

### Alterações Realizadas

#### Rafael:

- Alteração: Foi realizado o aprimoramento de conhecimento sobre o guia de estilos.

## Link para onde estão as estruturas do guia de estilos

 https://chatgpt.com/share/6a0ca7a8-c6bc-83e9-a75e-0e5fb8ddaced

### Data: 19/05/2026


### Objetivo do Dia

Rafael: Realizar o estudo aprofundado do guia de estilos.

### Guia de estilos
Colocar fotos se for preciso

### Alterações Realizadas

#### Rafael:

- Alteração: Foi realizado o aprimoramento de conhecimento sobre o guia de estilos.

## Link para onde está o histórico de conversa com a IA generativa sobre o estudo:

 https://chatgpt.com/share/6a0ca7a8-c6bc-83e9-a75e-0e5fb8ddaced

### Data: 19/05/2026


### Objetivo do Dia

Rafael: Realizar o estudo aprofundado do guia de estilos.

### Guia de estilos
Colocar fotos se for preciso

### Alterações Realizadas

#### Rafael:

- Alteração: Foi realizado o aprimoramento de conhecimento sobre o guia de estilos.

## Link para onde estão as estruturas do guia de estilos

 https://chatgpt.com/share/6a0ca7a8-c6bc-83e9-a75e-0e5fb8ddaced

### Data: 21/05/2026


### Objetivo do Dia

Rafael: Realizar o aprimoramento no estudo do guia de estilos.

### Guia de estilos
Colocar fotos se for preciso

### Alterações Realizadas

#### Rafael:

- Alteração: Foi realizado o aprimoramento do estudo perante o guia de estilos.

## Link para onde está o histórico de conversa com a IA generativa sobre o estudo:

 https://chatgpt.com/share/6a0ca7a8-c6bc-83e9-a75e-0e5fb8ddaced

### Data: 25/05/2026


### Objetivo do Dia

Rafael: Realizar a adição da interface do protótipo.

### Guia de estilos
Colocar fotos se for preciso

### Alterações Realizadas

#### Rafael:

- Alteração: Foi realizada a adição da interface do protótipo.

## Link para onde está o protótipo feito com o Figma Make:

https://pause-kit-95074407.figma.site/

### Data: 26/05/2026


### Objetivo do Dia

Rafael: Realizar o design do guia de estilos.

### Guia de estilos
Colocar fotos se for preciso

### Alterações Realizadas

#### Rafael:

- Alteração: Foi realizado o design do guia de estilos.

## Link para onde está o design feito com o Figma:

https://www.figma.com/design/hT0ZlGn9DAz64Y1gIwFVrM/corrije-ai?node-id=380-557&p=f&t=9kcwY8wCWUyUi0DN-0

### Data: 27/05/2026


### Objetivo do Dia

Rafael: Realizar a corrreção das cores do protótipo.

### Guia de estilos
Colocar fotos se for preciso

### Alterações Realizadas

#### Rafael:

- Apontamento para correção de cores:

Cores erradas: branco suave, preto, azul escuro, vermelho e informação (azul claro).

Cores corretas: ciano, sucesso (verde) e aviso (laranja)

Corrigir o branco suave (e8ecf0 para f2f2f2), preto (0e2040 para 000000), azul escuro (0e2040 para 05245f), vermelho (df6969 para ef4444) e informação/azul claro (1b6ec2 para 3b82f6).

Cores corretas: Ciano, sucesso/verde, aviso/laranja

## Link para onde está o design feito com o Figma:

https://www.figma.com/design/hT0ZlGn9DAz64Y1gIwFVrM/corrije-ai?node-id=372-2092&p=f&t=QtzUNpqWMLAQtIJG-0

### Data: 28/05/2026


### Objetivo do Dia

Rafael: Realizar o estudo aprofundado sobre documentação de guia de estilos e protótipo e a documentação prévia.


### Estudo realizado e documentação
Colocar fotos se for preciso

### Alterações Realizadas

#### Rafael:

- Alteração: Foi realizado o estudo aprofundado sobre documentação de guia de estilos e protótipo e uma prévia da documentação de ambos.

## Link para onde está o estudo realizado com a IA Chat GPT e a documentação prévia:

https://chatgpt.com/c/6a187f7e-c84c-83e9-bbf9-9b45d707e4f8

https://docs.google.com/document/d/1FMkr8Wr4BYk0v4T6TH_4_sgdb7MDEkxsH-MecunJ3jo/edit?tab=t.0

### Data: 01/06/2026


### Objetivo do Dia


Rafael: Atualizar o modelo ER, identificar entidades e relacionamentos principais e registrar as alterações na documentação.


### Modelagem do banco de dados


### Alterações Realizadas


#### Rafael:


- Alteração: Foram atualizados o MER e o DER na seção 3.6 do WAD para alinhar o modelo ER à migration principal (`src/backend/src/database/migrations/migration.sql`). Também foram documentadas as entidades principais por grupo, os relacionamentos centrais, as tabelas atuais do modelo físico e a substituição das estruturas antigas por `questao`, `prova_questao`, `prova_aluno`, `resposta_aluno`, `resultado_aluno`, `exportacao_resultado`, `email_envio` e `avaliacao_log`.

### Data: 02/06/2026


### Objetivo do Dia


Rafael: Atualizar a seção 3.6 do WAD, com foco no refinamento do Diagrama Entidade-Relacionamento (DER) para refletir exatamente o estado atual da migration do banco de dados.


### Modelagem do banco de dados


### Alterações Realizadas


#### Rafael:


- Alteração: Foi atualizada a seção 3.6.2 do WAD para representar o DER físico conforme a migration principal (`src/backend/src/database/migrations/migration.sql`). A documentação passou a usar os nomes reais das 22 tabelas de domínio, suas chaves primárias, chaves estrangeiras, restrições `UNIQUE`, restrições `CHECK`, enums, relacionamentos reais e índices físicos relevantes. Também foi registrado que `prova_materia` e `prova_enunciado` não existem como tabelas físicas, evitando componentes fantasmas na documentação.
