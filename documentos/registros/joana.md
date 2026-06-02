#### Registros diários da sprint 2 - Joana Auriemo Racy

### Data: 06/05/2026

### Objetivo do Dia: Estruturar e pesquisar template do wireframe do aluno.


### Alterações Realizadas: Terminei a estrutura e pesquisa do template do wireframe do aluno.


## Link para onde estão as estruturas do Wireframe
- Link do Figma - utilizado para fazer o Wireframe do aluno:
https://www.figma.com/design/hT0ZlGn9DAz64Y1gIwFVrM/Sem-t%C3%ADtulo?node-id=0-1&t=RCH7vGXuLSJq8vto-1


### -----------------------Outro Dia----------------------


### Data: 07/05/2026

### Objetivo do Dia: Começar a fazer o wireframe do aluno.


### Alterações Realizadas: Fiz quatro telas do aluno.


## Link para onde estão as estruturas do Wireframe
- Link do Figma - utilizado para fazer o Wireframe do aluno:
https://www.figma.com/design/hT0ZlGn9DAz64Y1gIwFVrM/Sem-t%C3%ADtulo?node-id=0-1&t=RCH7vGXuLSJq8vto-1


## ---------------------Outro Dia-----------------------


### Data: 11/05/2026

### Objetivo do Dia: Continuar fazendo as telas do wireframe do aluno.


### Alterações Realizadas: Fiz mais telas do Wireframe do aluno.


## Link para onde estão as estruturas do Wireframe
- Link do Figma - utilizado para fazer o Wireframe do aluno:
https://www.figma.com/design/hT0ZlGn9DAz64Y1gIwFVrM/Sem-t%C3%ADtulo?node-id=0-1&t=RCH7vGXuLSJq8vto-1


## ---------------------------Outro Dia-------------------------


### Data: 12/05/2026


### Objetivo do Dia: Continuar fazendo as telas do wireframe do aluno.


### Alterações Realizadas: Organizei os frames em ordem cronológica de acesso, e padronizei os títulos.


## Link para onde estão as estruturas do Wireframe
- Link do Figma: https://www.figma.com/design/hT0ZlGn9DAz64Y1gIwFVrM/corrije-ai?node-id=0-1&p=f&t=yiozHSv70VPvzseF-0


## ---------------------------Outro Dia-------------------------


### Data: 13/05/2026


### Objetivo do Dia: Começar os slides.


### Alterações Realizadas: Criei a apresentação e meu slide (de Modelo Relacional, o que é e para que serve).


## Link para onde estão os slides
- Link do Canva: https://canva.link/tjnuod1kpcpcl1v

## ---------------------------Outro Dia-------------------------


### Data: 14/05/2026


### Objetivo do Dia: Acabar os slides e roteiro.


### Alterações Realizadas: Recriei a apresentação, adaptei slides pro modelo certo e escrevi roteiro.


## Link para onde estão os slides
- Link do Canva: https://canva.link/i69yzyj7b9aq5sp

## Link do roteiro:
- Link do Docs: https://docs.google.com/document/d/1eAJFZrq3S6L6vTaXLxWV6Vx3hl1YGZHJZ2noENsnfGM/edit?usp=sharing

## ---------------------------Outro Dia-------------------------


### Data: 14/05/2026


### Objetivo do Dia: Iniciar o artefato 6


### Alterações Realizadas: Estudei o artefato 6 para compreender o que precisava ser feito e criei exemplos de expressões SQL.

## ---------------------------Outro Dia-------------------------


### Data: 25/05/2026


### Objetivo do Dia: Desenvolver artefato 6


### Alterações Realizadas: Criei e ajustei 3 tabelas verdade
| #1 | --- |
| --- | --- |
| **Expressão SQL** | `SELECT * FROM prova WHERE status = 'publicada' AND (turma = '2A' OR semestre = '2026.1');` |
| **Proposições lógicas** | $A$: A prova está publicada (`status = 'publicada'`) <br> $B$: A prova é da turma 2A (`turma = '2A'`) <br> $C$: A prova é do semestre 2026.1 (`semestre = '2026.1'`) |
| **Expressão lógica proposicional** | $A \land (B \lor C)$ |
| **Tabela Verdade** | <table><thead><tr><th>$A$</th><th>$B$</th><th>$C$</th><th>$B \lor C$</th><th>$A \land (B \lor C)$</th></tr></thead><tbody><tr><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td></tr><tr><td>F</td><td>F</td><td>V</td><td>V</td><td>F</td></tr><tr><td>F</td><td>V</td><td>F</td><td>V</td><td>F</td></tr><tr><td>F</td><td>V</td><td>V</td><td>V</td><td>F</td></tr><tr><td>V</td><td>F</td><td>F</td><td>F</td><td>F</td></tr><tr><td>V</td><td>F</td><td>V</td><td>V</td><td>V</td></tr><tr><td>V</td><td>V</td><td>F</td><td>V</td><td>V</td></tr><tr><td>V</td><td>V</td><td>V</td><td>V</td><td>V</td></tr></tbody></table> |

| #2 | --- |
| --- | --- |
| **Expressão SQL** | `SELECT * FROM questao WHERE tipo IN ('multipla_escolha', 'verdadeiro_falso') AND ativa = true;` |
| **Proposições lógicas** | $A$: A questão é de múltipla escolha (`tipo = 'multipla_escolha'`) <br> $B$: A questão é de verdadeiro ou falso (`tipo = 'verdadeiro_falso'`) <br> $C$: A questão está ativa (`ativa = true`) |
| **Expressão lógica proposicional** | $(A \lor B) \land C$ |
| **Tabela Verdade** | <table><thead><tr><th>$A$</th><th>$B$</th><th>$C$</th><th>$A \lor B$</th><th>$(A \lor B) \land C$</th></tr></thead><tbody><tr><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td></tr><tr><td>F</td><td>F</td><td>V</td><td>F</td><td>F</td></tr><tr><td>F</td><td>V</td><td>F</td><td>V</td><td>F</td></tr><tr><td>F</td><td>V</td><td>V</td><td>V</td><td>V</td></tr><tr><td>V</td><td>F</td><td>F</td><td>V</td><td>F</td></tr><tr><td>V</td><td>F</td><td>V</td><td>V</td><td>V</td></tr><tr><td>V</td><td>V</td><td>F</td><td>V</td><td>F</td></tr><tr><td>V</td><td>V</td><td>V</td><td>V</td><td>V</td></tr></tbody></table> |

| #3 | --- |
| --- | --- |
| **Expressão SQL** | `UPDATE resultado_aluno SET liberado = true, liberado_em = CURRENT_TIMESTAMP WHERE nota_total >= 6 AND liberado = false;` |
| **Proposições lógicas** | $A$: A nota total é maior ou igual a 6 (`nota_total >= 6`) <br> $B$: O resultado já está liberado (`liberado = true`) |
| **Expressão lógica proposicional** | $A \land \neg B$ |
| **Tabela Verdade** | <table><thead><tr><th>$A$</th><th>$B$</th><th>$\neg B$</th><th>$A \land \neg B$</th></tr></thead><tbody><tr><td>F</td><td>F</td><td>V</td><td>F</td></tr><tr><td>F</td><td>V</td><td>F</td><td>F</td></tr><tr><td>V</td><td>F</td><td>V</td><td>V</td></tr><tr><td>V</td><td>V</td><td>F</td><td>F</td></tr></tbody></table> |


## ---------------------------Outro Dia-------------------------


### Data: 26/05/2026


### Objetivo do Dia: Desenvolver artefato 6


### Alterações Realizadas: Criei a 4ª tabela verdade e ajustei as outras 3


## ---------------------------Outro Dia-------------------------


### Data: 27/05/2026


### Objetivo do Dia: Revisar feedback do Wesley


### Alterações Realizadas: Destaquei o que temos que alterar em nosso projeto, e o que precisamos pedir revisão.


## ---------------------------Outro Dia-------------------------


### Data: 28/05/2026


### Objetivo do Dia: Revisar Artefato 6


### Alterações Realizadas: Foi feita uma revisão final do Artefato 6, com mudança na tabela 2 e adição da tabela 5.


## ---------------------------Outro Dia-------------------------


### Data: 01/06/2026


### Objetivo do Dia: Atualizar a seção 3.9 do WAD - Matriz de Rastreabilidade


### Alterações Realizadas: Foi feita uma grande atualização na Matriz de Rastreabilidade.

## Matriz de Rastreabilidade
| Persona | RF | RN | Endpoint real ou suporte técnico | Tela relacionada | Evidência | Status |
|---------|----|----|----------------------------------|------------------|-----------|--------|
| Professor, Coordenador | RF001 | RN01 | POST/GET/PUT/DELETE /api/v1/provas; GET /api/v1/provas/:provaId/status-historico; POST /api/v1/provas/:provaId/encerrar; POST /api/v1/provas/:provaId/arquivar | Wireframes de provas e editor | prova.routes.ts, ProvaController, ProvaService, prova_status_historico | Implementado no backend; frontend ainda não implementado |
| Professor, Coordenador | RF001 | RN01 | GET /api/v1/provas/:provaId | Wireframe de detalhes da prova | prova.routes.ts, ProvaController.buscarPorId, ProvaService.buscarPorId | Implementado no backend; frontend ainda não implementado |
| Professor, Coordenador | RF001 | RN01 | GET /api/v1/provas/:provaId/questoes | Wireframe de detalhes da prova | prova.routes.ts, ProvaQuestaoController.listar, ProvaQuestaoService.listar | Implementado no backend; frontend ainda não implementado |
| Professor, Coordenador | RF001 | RN01 | POST /api/v1/provas/:provaId/encerrar | Wireframe de encerramento da prova | prova.routes.ts, ProvaController.encerrar, ProvaService.encerrar | Implementado no backend; frontend ainda não implementado |
| Professor, Coordenador | RF001 | RN01 | POST /api/v1/provas/:provaId/arquivar | Wireframe de histórico de provas | prova.routes.ts, ProvaController.arquivar, ProvaService.arquivar | Implementado no backend; frontend ainda não implementado |
| Professor, Coordenador | RF002 | RN18, RN19 | GET /api/v1/auth/google; GET /api/v1/auth/google/callback; GET /api/v1/auth/me; POST /api/v1/auth/logout | Wireframe de login do professor/coordenador | auth.routes.ts, AuthController, AuthService, requireRole | Implementado no backend; frontend ainda não implementado |
| Professor | RF003 | RN20 | CRUD /api/v1/questoes; POST/GET/DELETE /api/v1/provas/:provaId/questoes | Wireframe de banco de questões | questao.routes.ts, prova.routes.ts, QuestaoService, ProvaQuestaoService | Implementado no backend; frontend ainda não implementado |
| Professor | RF003 | RN20 | GET /api/v1/questoes/:questaoId | Wireframe de visualizar questão | questao.routes.ts, QuestaoService.buscarPorId, QuestaoRepository.findById | Implementado no backend; frontend ainda não implementado |
| Professor | RF003 | RN20 | GET /api/v1/questoes com filtros materiaId, temaId, tipo e busca | Wireframe de banco de questões | listQuestoesQuerySchema, QuestaoRepository.findMany | Implementado no backend; frontend ainda não implementado |
| Professor | RF003 | RN20 | POST /api/v1/provas/:provaId/questoes | Wireframe de vincular questão a prova | prova.routes.ts, ProvaQuestaoService.adicionar | Implementado no backend; frontend ainda não implementado |
| Professor | RF003 | RN20 | DELETE /api/v1/provas/:provaId/questoes/:questaoId | Wireframe de remover questão da prova | prova.routes.ts, ProvaQuestaoService.remover | Implementado no backend; frontend ainda não implementado |
| Professor, Coordenador | RF003 | RN20 | POST/GET/PUT/DELETE /api/v1/temas | Wireframe de banco de questões | tema.routes.ts, TemaController, TemaService, TemaRepository | Implementado no backend; frontend ainda não implementado |
| Professor, Coordenador | RF003 | RN20 | GET /api/v1/temas com filtro materiaId | Wireframe de filtros do banco de questões | listTemasQuerySchema, TemaRepository.findAll | Implementado no backend; frontend ainda não implementado |
| Professor, Coordenador | RF003 | RN20 | GET /api/v1/materias e GET /api/v1/materias/:materiaId | Wireframe de banco de questões e criação de prova | materia.routes.ts, MateriaController, MateriaService | Implementado no backend; frontend ainda não implementado |
| Professor | RF004 | RN03 | POST/PUT /api/v1/questoes com enunciado.conteudoLatex | Wireframe de editor de questão | questao.schema.ts, tabela enunciado.conteudo_latex | Implementado no backend; frontend ainda não implementado |
| Professor | RF004 | RN03 | POST/PUT /api/v1/questoes com alternativas[].conteudoLatex | Wireframe de editor de questão | questao.schema.ts, alternativa.conteudo_latex | Implementado no backend; frontend ainda não implementado |
| Professor | RF005 | RN03 | POST/PUT /api/v1/questoes com tipo multipla_escolha, verdadeiro_falso ou discursiva | Wireframe de editor de questão | questao.schema.ts, enum questao_tipo | Implementado no backend; frontend ainda não implementado |
| Professor | RF005 | RN03 | Questão objetiva com alternativas e exatamente uma correta | Wireframe de editor de questão objetiva | createQuestaoBodySchema, alternativas schema, alternativa_uma_correta_por_questao_index | Implementado no backend; frontend ainda não implementado |
| Professor | RF005 | RN03 | Questão discursiva sem alternativas | Wireframe de editor de questão discursiva | createQuestaoBodySchema, enum questao_tipo | Implementado no backend; frontend ainda não implementado |
| Professor | RF005 | RN03 | Questão verdadeiro/falso com exatamente duas alternativas | Wireframe de editor de questão VF | createQuestaoBodySchema, enum questao_tipo | Implementado no backend; frontend ainda não implementado |
| Professor | RF006 | RN04 | POST/PUT /api/v1/questoes com permiteAnexo, limiteCaracteres e limitePalavras | Wireframe de configuração de questão | questao.schema.ts, questao.permite_anexo, resposta-anexo.routes.ts | Implementado no backend; frontend ainda não implementado |
| Professor | RF006 | RN04 | Validação de tamanho e formato de anexos em upload público | Wireframe de configuração de anexos | resposta-anexo.routes.ts, multipart.ts, resposta_anexo_mime_type_check, resposta_anexo_tamanho_check | Implementado no backend; frontend ainda não implementado |
| Professor | RF007 | RN05 | PATCH /api/v1/provas/:provaId/configuracoes com tempoLimiteMin, dataInicio e dataFim | Wireframe de configurações da prova | prova.schema.ts, ProvaService.atualizarConfiguracoes, prova.tempo_limite_min | Implementado no backend; frontend ainda não implementado |
| Professor | RF007 | RN05 | PATCH /api/v1/provas/:provaId/configuracoes com tempoLimiteMin | Wireframe de configurações da prova | updateProvaConfiguracoesBodySchema, prova.tempo_limite_min | Implementado no backend; frontend ainda não implementado |
| Professor | RF007 | RN05 | PATCH /api/v1/provas/:provaId/configuracoes com dataInicio e dataFim | Wireframe de configurações da prova | updateProvaConfiguracoesBodySchema, prova.data_inicio, prova.data_fim | Implementado no backend; frontend ainda não implementado |
| Professor | RF008 | RN07 | POST /api/v1/provas/:provaId/publicar | Wireframe de compartilhar prova | ProvaService.publicar, prova.url_acesso, prova.qr_code | Implementado no backend; frontend ainda não implementado |
| Professor | RF008 | RN07 | Compartilhamento por URL pública gerada ao publicar prova | Wireframe de compartilhar prova | ProvaService.publicar, prova.url_acesso | Implementado no backend; frontend ainda não implementado |
| Professor | RF008 | RN07 | Payload de QR Code gerado a partir da URL pública | Wireframe de compartilhar prova | ProvaService.publicar, prova.qr_code, observação da migration sobre QR Code | Implementado no backend como payload; imagem depende do frontend/backend de renderização |
| Aluno | RF009 | RN08 | POST /api/v1/public/provas/:urlAcesso/iniciar | Wireframe de identificação do aluno | aluno-portal.routes.ts, AlunoPortalService, tabela prova_aluno | Implementado no backend; frontend ainda não implementado |
| Aluno | RF009 | RN08 | Início de tentativa em POST /api/v1/public/provas/:urlAcesso/iniciar | Wireframe de identificação do aluno | AlunoPortalService, AlunoPortalRepository, tabela prova_aluno | Implementado no backend; frontend ainda não implementado |
| Aluno | RF009 | RN08 | Validação de acesso por urlAcesso, período da prova e dados do aluno | Wireframe de identificação do aluno | AlunoPortalService, alunoPortalParamsSchema, iniciarProvaBodySchema | Implementado no backend; frontend ainda não implementado |
| Aluno | RF010 | RN10 | PUT /api/v1/public/provas-aluno/:provaAlunoId/respostas/:questaoId; GET /api/v1/public/provas-aluno/:provaAlunoId/respostas | Wireframe de responder prova | resposta-aluno.routes.ts, RespostaAlunoService | Backend implementado; experiência de zoom depende do frontend |
| Aluno | RF010 | RN10 | Salvamento/atualização de respostas em PUT /api/v1/public/provas-aluno/:provaAlunoId/respostas/:questaoId | Wireframe de responder prova | RespostaAlunoService.salvarRascunho, resposta_aluno.rascunho, resposta_aluno.sincronizada_em | Implementado no backend; frontend ainda não implementado |
| Aluno | RF010 | RN10 | Atualização de respostas discursivas com respostaTexto | Wireframe de responder prova | salvarRespostaBodySchema, resposta_aluno.resposta_texto | Implementado no backend; frontend ainda não implementado |
| Aluno | RF010 | RN10 | Atualização de respostas objetivas com alternativaId | Wireframe de responder prova | salvarRespostaBodySchema, resposta_aluno.alternativa_id | Implementado no backend; frontend ainda não implementado |
| Aluno | RF011 | RN10 | Enunciado e alternativas em LaTeX retornados no portal público e nas questões da prova | Wireframe de responder prova | enunciado.conteudo_latex, alternativa.conteudo_latex, questao.schema.ts | Backend implementado; renderização LaTeX depende do frontend |
| Aluno | RF011 | RN10 | Conteúdo LaTeX disponível em enunciados e alternativas retornados pela API | Wireframe de responder prova | conteudoLatex na API, enunciado.conteudo_latex, alternativa.conteudo_latex | Backend implementado; renderização depende do frontend |
| Aluno | RF012 | RN04 | POST /api/v1/public/respostas/:respostaId/anexos | Wireframe de upload | resposta-anexo.routes.ts, RespostaAnexoService, StorageService | Implementado no backend; frontend ainda não implementado |
| Aluno | RF012 | RN04 | Upload multipart em POST /api/v1/public/respostas/:respostaId/anexos | Wireframe de upload | resposta-anexo.routes.ts, multipart middleware, StorageService | Implementado no backend; frontend ainda não implementado |
| Aluno | RF013 | RN11 | POST /api/v1/public/respostas/:respostaId/anexos valida JPG, PNG, PDF e limite de 5MB | Wireframe de upload/compressão | resposta-anexo.schema.ts, multipart.ts, resposta_anexo.mime_type, resposta_anexo.tamanho_bytes | Backend implementado; compressão de imagem depende do frontend/storage |
| Aluno | RF013 | RN11 | Validação de tipo de arquivo JPG, PNG e PDF | Wireframe de upload/compressão | respostaAnexoSchema, resposta_anexo_mime_type_check | Implementado no backend; frontend ainda não implementado |
| Aluno | RF013 | RN11 | Validação de limite de tamanho até 5MB | Wireframe de upload/compressão | bodyLimit 6MB, resposta_anexo_tamanho_check <= 5242880 | Implementado no backend; frontend ainda não implementado |
| Professor | RF014 | RN13 | GET /api/v1/provas/:provaId/correcao/questoes; GET /api/v1/provas/:provaId/questoes/:questaoId/respostas | Wireframe de correção | correcao.routes.ts, CorrecaoController, CorrecaoService | Implementado no backend; frontend ainda não implementado |
| Professor | RF014 | RN13 | Listagem de questões e respostas para correção | Wireframe de correção | CorrecaoService.listarQuestoesDaProva, CorrecaoService.listarRespostasPorQuestao | Implementado no backend; frontend ainda não implementado |
| Professor | RF014 | RN13 | Consulta de respostas discursivas e anexos por questão | Wireframe de correção | CorrecaoRepository.findRespostasPorQuestao, correcaoRespostaSchema | Implementado no backend; frontend ainda não implementado |
| Professor | RF014 | RN13 | POST /api/v1/provas/:provaId/correcao/objetivas | Wireframe de correção | correcao.routes.ts, CorrecaoController.executarObjetivas, CorrecaoService.executarCorrecaoAutomatica | Implementado no backend; frontend ainda não implementado |
| Professor | RF015 | RN13 | PUT /api/v1/respostas/:respostaId/correcao com nota, observação e feedback | Wireframe de correção manual | correcao.schema.ts, CorrecaoRepository, tabela feedback | Implementado no backend; frontend ainda não implementado |
| Professor | RF015 | RN13 | Lançamento manual de nota em PUT /api/v1/respostas/:respostaId/correcao | Wireframe de correção manual | salvarCorrecaoBodySchema.nota, CorrecaoRepository.upsertCorrecao | Implementado no backend; frontend ainda não implementado |
| Professor | RF015 | RN13 | Feedback textual da correção por campo feedback e tabela feedback | Wireframe de correção manual | salvarCorrecaoBodySchema.feedback, tabela feedback.mensagem | Implementado no backend; frontend ainda não implementado |
| Professor | RF016 | RN13 | GET /api/v1/provas/:provaId/questoes/:questaoId/respostas retorna anexos das respostas | Wireframe de galeria/anexos | CorrecaoRepository, RespostaAnexoRepository, resposta_anexo | Implementado no backend; frontend ainda não implementado |
| Professor | RF016 | RN13 | Visualização de anexos enviados junto das respostas | Wireframe de galeria/anexos | correcaoRespostaSchema.anexos, resposta_anexo | Implementado no backend; frontend ainda não implementado |
| Professor, Coordenador | RF017 | RN14 | GET /api/v1/provas/:provaId/resultados; POST /api/v1/provas/:provaId/resultados/exportar | Wireframe de resultados | resultado.routes.ts, ResultadoService, ResultadoRepository, StorageService | Implementado no backend; frontend ainda não implementado |
| Professor, Coordenador | RF017 | RN14 | Exportação de resultados em CSV ou XLSX | Wireframe de resultados | ResultadoService.exportarPorProva, exportacao_resultado, StorageService | Implementado no backend; frontend ainda não implementado |
| Professor, Coordenador | RF017 | RN14 | Consulta de desempenho por aluno em GET /api/v1/provas/:provaId/resultados | Wireframe de resultados | ResultadoRepository.findByProva, resultadoAlunoSchema | Implementado no backend; frontend ainda não implementado |
| Coordenador | RF018 | RN17 | GET /api/v1/coordenador/provas; CRUD /api/v1/professores; CRUD /api/v1/materias; vínculos matéria-professor | Wireframe de painel do coordenador | coordenador.routes.ts, professor.routes.ts, materia.routes.ts, materia_professor | Implementado no backend; frontend ainda não implementado |
| Coordenador | RF018 | RN17 | CRUD de professores em /api/v1/professores | Wireframe de painel coordenador | professor.routes.ts, ProfessorService, ProfessorRepository | Implementado no backend; frontend ainda não implementado |
| Coordenador | RF018 | RN17 | CRUD de matérias em /api/v1/materias | Wireframe de painel coordenador | materia.routes.ts, MateriaService, MateriaRepository | Implementado no backend; frontend ainda não implementado |
| Coordenador | RF018 | RN17 | Vínculo professor-matéria via tabela materia_professor | Wireframe de painel coordenador | migration.sql, materia_professor, professor/materia services | Implementado no backend; frontend ainda não implementado |
| Coordenador | RF018 | RN17 | GET /api/v1/alunos; GET /api/v1/alunos/:alunoId; PUT /api/v1/alunos/:alunoId; DELETE /api/v1/alunos/:alunoId | Wireframe de gestão de alunos | aluno.routes.ts, AlunoController, AlunoService, AlunoRepository | Implementado no backend; frontend ainda não implementado |
| Coordenador | RF018 | RN17 | POST /api/v1/professores/:professorId/materias | Wireframe de vínculo professor-matéria | professor.routes.ts, ProfessorController.criarVinculo, materia_professor | Implementado no backend; frontend ainda não implementado |
| Coordenador | RF018 | RN17 | DELETE /api/v1/professores/:professorId/materias/:materiaId | Wireframe de vínculo professor-matéria | professor.routes.ts, ProfessorController.removerVinculo, materia_professor | Implementado no backend; frontend ainda não implementado |
| Coordenador | RF018 | RN17 | POST /api/v1/materias; PUT /api/v1/materias/:materiaId; DELETE /api/v1/materias/:materiaId | Wireframe de gestão de matérias | materia.routes.ts, MateriaController, MateriaService, MateriaRepository | Implementado no backend; frontend ainda não implementado |
| Coordenador | RF019 | RN17 | GET /api/v1/provas/:provaId/analytics; POST /api/v1/logs | Wireframe de analytics | analytics.routes.ts, AnalyticsService, avaliacao_log | Implementado no backend; frontend ainda não implementado |
| Coordenador | RF019 | RN17 | Análise estatística de provas em GET /api/v1/provas/:provaId/analytics | Wireframe de analytics | AnalyticsService.obterPorProva, AnalyticsRepository | Implementado no backend; frontend ainda não implementado |
| Coordenador | RF019 | RN17 | Registro de logs de acesso em POST /api/v1/logs | Wireframe de analytics | analytics.routes.ts, AnalyticsService.registrarLog, avaliacao_log | Implementado no backend; frontend ainda não implementado |
| Coordenador | RF020 | RN01 | GET /api/v1/coordenador/provas; GET /api/v1/provas/:provaId/status-historico | Wireframe de painel do coordenador | coordenador.routes.ts, ProvaController.listar, prova_status_historico | Implementado no backend; frontend ainda não implementado |
| Professor | RF021 | RN18 | POST /api/v1/provas; GET /api/v1/provas/:provaId; PUT /api/v1/provas/:provaId | Wireframe de nova prova/editor | ProvaController, ProvaService, materia_professor | Implementado no backend; frontend ainda não implementado |
| Professor, Coordenador | RF022 | RN02 | GET /api/v1/provas com filtros status, turma, semestre, materiaId e professorId | Wireframe de home com filtros | listProvasQuerySchema, ProvaRepository.findMany | Implementado no backend; frontend ainda não implementado |
| Professor | RF023 | RN06 | PATCH /api/v1/provas/:provaId/configuracoes com embaralharQuestoes e embaralharAlternativas | Wireframe de configurações da prova | prova.schema.ts, prova.embaralhar_questoes, prova.embaralhar_alternativas | Implementado no backend; frontend ainda não implementado |
| Professor | RF023 | RN06 | PATCH /api/v1/provas/:provaId/configuracoes com embaralharAlternativas | Wireframe de configurações da prova | updateProvaConfiguracoesBodySchema, prova.embaralhar_alternativas | Implementado no backend; frontend ainda não implementado |
| Aluno | RF024 | RN09 | GET /api/v1/public/provas/:urlAcesso | Wireframe de instruções do aluno | aluno-portal.routes.ts, AlunoPortalService, provaPublicaSchema | Implementado no backend; frontend ainda não implementado |
| Aluno | RF024 | RN09 | Visualização de instruções em GET /api/v1/public/provas/:urlAcesso | Wireframe de portal do aluno | aluno-portal.routes.ts, provaPublicaSchema.instrucoes | Implementado no backend; frontend ainda não implementado |
| Aluno | RF025 | RN09 | GET /api/v1/public/provas/:urlAcesso retorna tempoLimiteMin, dataInicio e dataFim | Wireframe de timer | aluno-portal.schema.ts, prova.tempo_limite_min, prova.data_inicio, prova.data_fim | Backend implementado; exibição do timer depende do frontend |
| Aluno | RF025 | RN09 | Consulta de tempo da prova em GET /api/v1/public/provas/:urlAcesso | Wireframe de timer | tempoLimiteMin, dataInicio, dataFim | Backend implementado; exibição depende do frontend |
| Aluno | RF026 | RN12 | GET /api/v1/public/provas-aluno/:provaAlunoId/respostas; POST /api/v1/public/provas-aluno/:provaAlunoId/enviar | Wireframe de revisão final e conclusão | resposta-aluno.routes.ts, RespostaAlunoService.enviarFinal | Implementado no backend; frontend ainda não implementado |
| Aluno | RF026 | RN12 | Revisão de respostas por GET /api/v1/public/provas-aluno/:provaAlunoId/respostas | Wireframe de revisão final | resposta-aluno.routes.ts, RespostaAlunoService.listarRespostas | Implementado no backend; frontend ainda não implementado |
| Aluno | RF026 | RN12 | Envio definitivo em POST /api/v1/public/provas-aluno/:provaAlunoId/enviar | Wireframe de finalização | resposta-aluno.routes.ts, RespostaAlunoService.enviarFinal | Implementado no backend; frontend ainda não implementado |
| Professor, Coordenador | RF027 | RN15 | POST /api/v1/provas/:provaId/resultados/liberar-email; GET /api/v1/provas/:provaId/emails; POST /api/v1/emails/:emailEnvioId/reenviar | Wireframe de e-mails | email.routes.ts, EmailResultadoService, email_envio | Implementado no backend; frontend ainda não implementado |
| Professor, Coordenador | RF027 | RN15 | Reenvio de e-mails de resultado em POST /api/v1/emails/:emailEnvioId/reenviar | Wireframe de e-mails | email.routes.ts, EmailResultadoService.reenviar | Implementado no backend; frontend ainda não implementado |
| Professor, Coordenador | RF027 | RN15 | Consulta de histórico de e-mails em GET /api/v1/provas/:provaId/emails | Wireframe de e-mails | EmailResultadoService.listarEnvios, email_envio | Implementado no backend; frontend ainda não implementado |
| Professor, Coordenador | RF027 | RN15 | POST /api/v1/provas/:provaId/resultados/liberar-email com confirmarPendencias | Wireframe de liberação de notas/e-mails | email.schema.ts, EmailResultadoService.liberar, EmailEnvioRepository | Implementado no backend; frontend ainda não implementado |
| Coordenador | RF028 | RN16 | POST /api/v1/provas/:provaId/anexos/exportar retorna lista dos anexos da prova | Wireframe de exportação de anexos | anexo-exportar.routes.ts, AnexoExportarService, AnexoExportarRepository | Implementado no backend como listagem/exportação de metadados; frontend ainda não implementado |
| Coordenador | RF028 | RN16 | Exportacao/listagem dos anexos da prova em POST /api/v1/provas/:provaId/anexos/exportar | Wireframe de exportação de anexos | AnexoExportarService.exportar, AnexoExportarRepository.findAnexosPorProva | Implementado no backend como listagem/exportação de metadados; frontend ainda não implementado |
