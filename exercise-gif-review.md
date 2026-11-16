# Relatório de integração da biblioteca de exercícios e GIFs

## Inventário

- Exercícios originais no catálogo: 206.
- Exercícios no CSV: 1.324.
- GIFs encontrados: 1000, todos íntegros e em 360×360 px; 12–54 quadros por arquivo.
- A faixa numérica vai de `0001.gif` a `1670.gif`, mas há 1.000 arquivos: faltam 670 códigos.

## Resultado do mapeamento

- confirmed: 95
- probable: 6
- pending: 102
- no_match: 3
- Associações com GIF confirmado/provável: 101, usando 97 arquivos únicos (41 novos vínculos adicionados nesta integração e inspecionados quadro a quadro).
- Os caminhos repetidos correspondem a variantes/duplicatas do catálogo: Good Morning (`0044.gif`), Standing Calf Raise (`0605.gif`), fly reto/genérico (`0308.gif`) e rosca martelo (`0313.gif`).
- `Air Bike` não recebeu GIF: o CSV e `0003.gif` mostram o abdominal de bicicleta no solo, enquanto o catálogo descreve a bicicleta ergométrica.
- `Glute Ham Raise` (CSV 3193) e `Jump Rope` (CSV 2612) não têm seus arquivos na pasta.
- A biblioteca local não tinha 206 exercícios no runtime de treinos: `EXERCISE_DATABASE` contém 22; `catalogo.json` contém 206. O catálogo da interface agora exibe os 206 sem alterar o gerador de IA; aliases da integração conectam GIFs confirmados aos IDs runtime quando compatíveis.

## Prováveis — revisão necessária

- Crucifixo com Halteres no Banco Reto (`crucifixo-halteres-banco-reto`) — Dumbbell fly em banco reto; movimento e equipamento conferem, embora este registro do catálogo não explicite o ângulo do banco. (CSV 0308).
- Crucifixo Invertido com Halteres (`crucifixo-invertido-halteres`) — A animação mostra o crucifixo invertido com o peito apoiado; o catálogo não especifica esse apoio. (CSV 0383).
- Desenvolvimento Máquina (Articulado) (`desenvolvimento-maquina`) — Shoulder press em máquina de alavancas; movimento confere, mas o modelo de máquina não é especificado no catálogo. (CSV 0603).
- Panturrilha Burrinho (Donkey Calf Raise) (`elevacao-panturrilha-burro`) — O movimento de panturrilha burrinho confere; a animação usa apoio corporal, enquanto o catálogo menciona máquina/plataforma. (CSV 0284).
- Remada Baixa com Triângulo (`remada-baixa-triangulo`) — Remada sentada baixa em cabo com pegada fechada; o GIF sugere puxador triangular, mas a CSV não confirma o acessório. (CSV 0861).
- Remada Cavalinho (T-Bar Row) (`remada-cavalinho`) — T-bar row em máquina com apoio do peito; movimento e equipamento compatíveis, mas o apoio do peito não é especificado no catálogo. (CSV 0606).

## Sem correspondência segura

- Bicicleta Ergométrica de Ar (Air Bike / Assault Bike) (`air-bike`) — O CSV usa Air Bike para um movimento abdominal no solo; o catálogo descreve a bicicleta ergométrica. A associação foi rejeitada por diferença biomecânica. (candidato CSV rejeitado 0003).
- Glute Ham Raise (GHR) (`glute-ham-raise`) — Exercício identificado no CSV (3193), mas o arquivo GIF correspondente não está na pasta assets. (CSV 3193).
- Pular Corda (Foco Panturrilha e Cardio) (`pular-corda`) — Exercício identificado no CSV (2612), mas o arquivo GIF correspondente não está na pasta assets. (CSV 2612).

## Pendentes — ainda sem associação visual segura

- Mesa Flexora (mesa-flexora) — Posterior de Coxa; equipamento: Máquina.
- Elevação Pélvica com Barra (elevacao-pelvica-barra) — Glúteos; equipamento: Barra.
- Crunch Abdominal na Máquina (crunch-abdominal-maquina) — Abdômen; equipamento: Máquina.
- Caminhada Inclinada na Esteira (esteira-inclinada) — Cardio; equipamento: Esteira.
- Voador (Peck Deck) (peck-deck-voador) — Peito; equipamento: Máquina.
- Crossover na Polia Alta (crossover-polia-alta) — Peito; equipamento: Máquina de Cabos.
- Crossover na Polia Baixa (Elevação) (crossover-polia-baixa) — Peito; equipamento: Máquina de Cabos.
- Puxada com Triângulo na Polia (puxada-triangulo-polia) — Costas; equipamento: Máquina de Cabos.
- Remada Curvada Supinada (Underhand) (remada-curvada-supinada) — Costas; equipamento: Barra.
- Remada Articulada (Máquina) (remada-articulada-maquina) — Costas; equipamento: Máquina.
- Remada Pendlay (remada-pendlay) — Costas; equipamento: Barra.
- Remada Meadows (remada-meadows) — Costas; equipamento: Barra (T-Bar).
- Encolhimento com Barra (encolhimento-barra) — Costas; equipamento: Barra.
- Encolhimento com Halteres (encolhimento-halteres) — Costas; equipamento: Halteres.
- Extensão Lombar na Máquina (extensao-lombar-maquina) — Costas; equipamento: Máquina.
- Desenvolvimento Militar com Barra (Em Pé) (desenvolvimento-militar-barra) — Ombros; equipamento: Barra.
- Elevação Lateral na Máquina (elevacao-lateral-maquina) — Ombros; equipamento: Máquina.
- Elevação Lateral em Banco Inclinado (elevacao-lateral-inclinada) — Ombros; equipamento: Halteres.
- Elevação Frontal com Anilha (elevacao-frontal-anilha) — Ombros; equipamento: Anilha.
- Face Pull (Puxada no Rosto) (face-pull) — Ombros; equipamento: Máquina de Cabos.
- Crucifixo Invertido Curvado (crucifixo-invertido-curvado-halteres) — Ombros; equipamento: Halteres.
- Elevação Lateral Unilateral com Polia (elevacao-lateral-unilateral-polia) — Ombros; equipamento: Máquina de Cabos.
- Elevação em Y na Polia Baixa (elevacao-y-polia) — Ombros; equipamento: Máquina de Cabos.
- Rosca Direta com Barra EZ (rosca-direta-barra-ez) — Bíceps; equipamento: Barra EZ.
- Rosca Scott Unilateral com Haltere (rosca-scott-haltere) — Bíceps; equipamento: Haltere / Banco Scott.
- Rosca na Polia Baixa (rosca-polia-baixa) — Bíceps; equipamento: Máquina de Cabos.
- Rosca Duplo Bíceps na Polia Alta (Crossover) (rosca-unilateral-polia-alta) — Bíceps; equipamento: Máquina de Cabos.
- Rosca 21 com Barra (rosca-21) — Bíceps; equipamento: Barra.
- Tríceps Pulldown com Barra Reta (triceps-pulldown-barra-reta) — Tríceps; equipamento: Máquina de Cabos.
- Tríceps Testa com Barra EZ (Skullcrusher) (triceps-testa-barra-ez) — Tríceps; equipamento: Barra EZ.
- Tríceps Francês com Haltere (Bilateral) (triceps-frances-haltere-bilateral) — Tríceps; equipamento: Haltere.
- Tríceps Francês Unilateral com Haltere (triceps-frances-unilateral) — Tríceps; equipamento: Haltere.
- Mergulho no Banco (Tríceps Banco) (mergulho-banco-triceps) — Tríceps; equipamento: Peso Corporal / Bancos.
- Tríceps Coice (Kickback) com Haltere (triceps-coice-haltere) — Tríceps; equipamento: Haltere.
- Tríceps Coice na Polia (triceps-coice-polia) — Tríceps; equipamento: Máquina de Cabos.
- Máquina de Tríceps (Mergulho Sentado) (maquina-mergulho-triceps) — Tríceps; equipamento: Máquina.
- JM Press (Supino JM) (jm-press) — Tríceps; equipamento: Barra.
- Rosca Punho com Halteres (rosca-punho-halteres) — Antebraço; equipamento: Halteres.
- Rosca Punho Invertida com Halteres (rosca-punho-invertida-halteres) — Antebraço; equipamento: Halteres.
- Caminhada do Fazendeiro (caminhada-do-fazendeiro) — Antebraço; equipamento: Halteres ou Kettlebells pesados.
- Suspensão na Barra Fixa (Dead Hang) (dead-hang) — Antebraço; equipamento: Barra Fixa.
- Sustentação de Anilhas (Pinch Grip) (sustentacao-anilhas) — Antebraço; equipamento: Anilhas.
- Agachamento no Smith (agachamento-smith) — Quadríceps; equipamento: Máquina Smith.
- Leg Press Horizontal (Seated Leg Press) (leg-press-horizontal) — Quadríceps; equipamento: Máquina (Cabos/Placas).
- Cadeira Extensora Unilateral (cadeira-extensora-unilateral) — Quadríceps; equipamento: Máquina.
- Agachamento Búlgaro (Bulgarian Split Squat) (agachamento-bulgaro) — Quadríceps; equipamento: Halteres / Banco.
- Avanço com Halteres (Passada / Lunges) (avanco-halteres) — Quadríceps; equipamento: Halteres.
- Afundo com Barra no Lugar (afundo-barra) — Quadríceps; equipamento: Barra.
- Agachamento Sumô (Haltere ou Kettlebell) (agachamento-sumo) — Quadríceps; equipamento: Haltere / Kettlebell.
- Agachamento Pêndulo (Pendulum Squat) (pendulum-squat) — Quadríceps; equipamento: Máquina Pendulum Squat.
- Agachamento com Cinto (Belt Squat) (belt-squat) — Quadríceps; equipamento: Máquina Belt Squat / Cinto de Lastro.
- Agachamento Isométrico na Parede (Cadeirinha) (agachamento-isometrico-parede) — Quadríceps; equipamento: Peso Corporal / Parede.
- Cadeira Flexora (cadeira-flexora) — Posterior de Coxa; equipamento: Máquina.
- Flexora em Pé Unilateral (flexora-em-pe) — Posterior de Coxa; equipamento: Máquina.
- Stiff com Barra (stiff-barra) — Posterior de Coxa; equipamento: Barra.
- Levantamento Terra Romeno com Halteres (rdl-halteres) — Posterior de Coxa; equipamento: Halteres.
- Flexão Nórdica (flexao-nordica) — Posterior de Coxa; equipamento: Peso Corporal / Suporte.
- Stiff Unilateral (RDL de Uma Perna) (stiff-unilateral-haltere) — Posterior de Coxa; equipamento: Haltere / Kettlebell.
- Flexão de Perna na Polia (Cabo) (flexora-polia-baixa) — Posterior de Coxa; equipamento: Máquina de Cabos / Tornozeleira.
- Flexão de Pernas na Bola Suíça (flexao-bola-suica) — Posterior de Coxa; equipamento: Bola Suíça (Fitball).
- Panturrilha no Leg Press (elevacao-panturrilha-leg-press) — Panturrilhas; equipamento: Máquina Leg Press.
- Elevação Tibial (Tibialis Raise) (elevacao-tibial) — Panturrilhas; equipamento: Peso Corporal / Parede / Aparelho Específico.
- Elevação Pélvica na Máquina (elevacao-pelvica-maquina) — Glúteos; equipamento: Máquina.
- Elevação Pélvica no Smith (elevacao-pelvica-smith) — Glúteos; equipamento: Máquina Smith / Banco.
- Elevação Pélvica com Haltere (elevacao-pelvica-haltere) — Glúteos; equipamento: Haltere / Banco.
- Ponte de Glúteos (Glute Bridge) (ponte-gluteos-peso-corporal) — Glúteos; equipamento: Peso Corporal / Solo.
- Ponte de Glúteos Unilateral (ponte-gluteos-unilateral) — Glúteos; equipamento: Peso Corporal / Solo.
- Ponte de Glúteos Elevada (Pés no Banco) (ponte-gluteos-elevada) — Glúteos; equipamento: Banco / Caixote.
- Frog Pumps (Ponte Sapo) (frog-pumps) — Glúteos; equipamento: Peso Corporal.
- Abdução de Quadril na Polia (abducao-quadril-polia) — Glúteos; equipamento: Máquina de Cabos / Tornozeleira.
- Máquina de Glúteo Coice (gluteo-coice-maquina) — Glúteos; equipamento: Máquina.
- Glúteo Coice no Smith (gluteo-coice-smith) — Glúteos; equipamento: Máquina Smith.
- Glúteo 4 Apoios com Caneleira (Joelhos dobrados) (gluteo-4-apoios-caneleira) — Glúteos; equipamento: Caneleira (Pesos de Tornozelo).
- Glúteo 4 Apoios com Perna Estendida (gluteo-4-apoios-perna-estendida) — Glúteos; equipamento: Caneleira.
- Ostra com Elástico (Clamshells) (abducao-elastico-deitado) — Glúteos; equipamento: Faixa Elástica (Mini Band).
- Caminhada Lateral com Elástico (Monster Walk) (caminhada-lateral-elastico) — Glúteos; equipamento: Faixa Elástica (Mini Band).
- Passada Cruzada (Curtsy Lunge) (passada-cruzada-halteres) — Glúteos; equipamento: Halteres.
- Banco Romano com Foco em Glúteo (extensao-lombar-foco-gluteo) — Glúteos; equipamento: Banco Romano 45 Graus.
- Prancha Isométrica (prancha-isometrica) — Abdômen; equipamento: Peso Corporal.
- Prancha Lateral (prancha-lateral) — Abdômen; equipamento: Peso Corporal.
- Elevação de Pernas no Solo (elevacao-pernas-solo) — Abdômen; equipamento: Peso Corporal.
- Elevação de Joelhos na Cadeira / Paralelas (elevacao-joelhos-paralelas) — Abdômen; equipamento: Cadeira Romana (Captain's Chair).
- Abdominal Remador (abdominal-remador) — Abdômen; equipamento: Peso Corporal.
- Crunch Abdominal na Polia Alta (crunch-polia-alta) — Abdômen; equipamento: Máquina de Cabos / Corda.
- Lenhador na Polia (Woodchopper) (lenhador-polia) — Abdômen; equipamento: Máquina de Cabos.
- Abdominal Bicicleta (abdominal-bicicleta) — Abdômen; equipamento: Peso Corporal.
- Roda Abdominal (Ab Wheel Rollout) (roda-abdominal) — Abdômen; equipamento: Roda Abdominal (Ab Wheel).
- Abdominal Canivete (V-Up) (abdominal-canivete) — Abdômen; equipamento: Peso Corporal.
- Abdominal na Máquina Articulada (crunch-maquina) — Abdômen; equipamento: Máquina.
- Hollow Body Hold (Isometria do Corpo Oco) (isometria-hollow-body) — Abdômen; equipamento: Peso Corporal.
- Limpador de Parabrisa (Windshield Wipers) (windshield-wipers) — Abdômen; equipamento: Peso Corporal.
- Prancha com Toque nos Ombros (prancha-toque-ombros) — Abdômen; equipamento: Peso Corporal.
- Abdominal Infra no Banco Plano (abdominal-infra-banco) — Abdômen; equipamento: Banco Reto.
- Corrida na Esteira (esteira-corrida) — Cardio; equipamento: Esteira.
- Caminhada Inclinada na Esteira (esteira-caminhada-inclinada) — Cardio; equipamento: Esteira.
- Bicicleta Ergométrica (Vertical/Horizontal) (bicicleta-ergometrica) — Cardio; equipamento: Bicicleta Ergométrica.
- Bicicleta de Spinning (bicicleta-spinning) — Cardio; equipamento: Spin Bike.
- Elíptico (eliptico) — Cardio; equipamento: Elíptico.
- Simulador de Escada (StairMaster) (simulador-escada) — Cardio; equipamento: Simulador de Escadas.
- Remo Seco (Ergômetro) (remo-ergometro) — Cardio; equipamento: Remo Ergômetro (Concept2, etc).
- Pular Corda (Cardio Progressivo) (pular-corda-cardio) — Cardio; equipamento: Corda de Pular.
- Burpees (burpees) — Cardio; equipamento: Peso Corporal.

Inspeção visual quadro a quadro: 516 quadros examinados. Dos 41 novos vínculos, 40 foram confirmados nos GIFs; o GIF `0046.gif` foi rejeitado por mostrar hack squat com barra e substituído por `0743.gif`, cuja sequência mostra a máquina hack.

## Revisão no app

A tela de revisão está em `/?exercise-gif-review=1`; permite filtrar os 206 exercícios por status e conferir GIF, nome do arquivo, confiança e justificativa.

## Validação executada

- Build Vite de produção: passou; copiou 97 GIFs revisados para `dist/assets` após a inspeção quadro a quadro.
- Typecheck manual do TypeScript: passou.
- Integridade: 1.000/1.000 GIFs legíveis, 0 inválidos; todos com 360×360 px e 12–54 quadros.
- IDs do mapa comparados aos 206 do catálogo: correspondência exata, sem IDs duplicados.
- Caminhos das 101 associações confirmadas/prováveis existem na pasta `assets`; os 97 arquivos únicos usados pelo mapa foram copiados para `dist/assets`.
- O `package.json` não define scripts de teste ou lint.
- A validação visual do app em viewport de navegador não foi concluída: o preview local expirou na conexão do navegador da sandbox. As folhas de contato dos 1.000 GIFs e as imagens mapeadas foram inspecionadas localmente.
