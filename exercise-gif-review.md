# Relatório de integração da biblioteca de exercícios e GIFs

## Inventário

- Exercícios originais no catálogo: 206.
- Exercícios no CSV: 1.324.
- GIFs encontrados: 1000, todos íntegros e em 360×360 px; 12–54 quadros por arquivo.
- A faixa numérica vai de `0001.gif` a `1670.gif`, mas há 1.000 arquivos: faltam 670 códigos.

## Resultado do mapeamento

- confirmed: 54
- probable: 6
- pending: 143
- no_match: 3
- Associações com GIF confirmado/provável: 60, usando 57 arquivos únicos.
- Os três caminhos repetidos são duplicatas do mesmo movimento no catálogo: os dois registros de Good Morning usam `0044.gif`; os dois registros de Standing Calf Raise usam `0605.gif`; e o fly genérico/flat usa `0308.gif`. Não há exercícios duplicados no mapa.
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

- Abdominal Bicicleta (`abdominal-bicicleta`) — Abdômen; equipamento: Peso Corporal.
- Abdominal Canivete (V-Up) (`abdominal-canivete`) — Abdômen; equipamento: Peso Corporal.
- Abdominal Infra no Banco Plano (`abdominal-infra-banco`) — Abdômen; equipamento: Banco Reto.
- Abdominal na Máquina Articulada (`crunch-maquina`) — Abdômen; equipamento: Máquina.
- Abdominal Remador (`abdominal-remador`) — Abdômen; equipamento: Peso Corporal.
- Abdominal Sit-Up (Completo) (`abdominal-sit-up`) — Abdômen; equipamento: Peso Corporal.
- Abdução de Quadril na Polia (`abducao-quadril-polia`) — Glúteos; equipamento: Máquina de Cabos / Tornozeleira.
- Afundo com Barra no Lugar (`afundo-barra`) — Quadríceps; equipamento: Barra.
- Agachamento Búlgaro (Bulgarian Split Squat) (`agachamento-bulgaro`) — Quadríceps; equipamento: Halteres / Banco.
- Agachamento com Cinto (Belt Squat) (`belt-squat`) — Quadríceps; equipamento: Máquina Belt Squat / Cinto de Lastro.
- Agachamento Goblet (Cálice) (`agachamento-goblet`) — Quadríceps; equipamento: Haltere / Kettlebell.
- Agachamento Hack (Hack Squat) (`agachamento-hack`) — Quadríceps; equipamento: Máquina Hack Squat.
- Agachamento Isométrico na Parede (Cadeirinha) (`agachamento-isometrico-parede`) — Quadríceps; equipamento: Peso Corporal / Parede.
- Agachamento no Smith (`agachamento-smith`) — Quadríceps; equipamento: Máquina Smith.
- Agachamento Pêndulo (Pendulum Squat) (`pendulum-squat`) — Quadríceps; equipamento: Máquina Pendulum Squat.
- Agachamento Pistol (Pistol Squat) (`agachamento-pistol`) — Quadríceps; equipamento: Peso Corporal.
- Agachamento Sumô (Haltere ou Kettlebell) (`agachamento-sumo`) — Quadríceps; equipamento: Haltere / Kettlebell.
- Agachamento Zercher (`agachamento-zercher`) — Quadríceps; equipamento: Barra.
- Avanço com Halteres (Passada / Lunges) (`avanco-halteres`) — Quadríceps; equipamento: Halteres.
- Banco Romano com Foco em Glúteo (`extensao-lombar-foco-gluteo`) — Glúteos; equipamento: Banco Romano 45 Graus.
- Barra Fixa Neutra (`barra-fixa-neutra`) — Costas; equipamento: Peso Corporal.
- Bicicleta de Spinning (`bicicleta-spinning`) — Cardio; equipamento: Spin Bike.
- Bicicleta Ergométrica (Vertical/Horizontal) (`bicicleta-ergometrica`) — Cardio; equipamento: Bicicleta Ergométrica.
- Burpees (`burpees`) — Cardio; equipamento: Peso Corporal.
- Cadeira Abdutora (`abducao-quadril-maquina`) — Glúteos; equipamento: Máquina.
- Cadeira Extensora Unilateral (`cadeira-extensora-unilateral`) — Quadríceps; equipamento: Máquina.
- Cadeira Flexora (`cadeira-flexora`) — Posterior de Coxa; equipamento: Máquina.
- Caminhada do Fazendeiro (`caminhada-do-fazendeiro`) — Antebraço; equipamento: Halteres ou Kettlebells pesados.
- Caminhada Inclinada na Esteira (`esteira-inclinada`) — Cardio; equipamento: Esteira.
- Caminhada Inclinada na Esteira (`esteira-caminhada-inclinada`) — Cardio; equipamento: Esteira.
- Caminhada Lateral com Elástico (Monster Walk) (`caminhada-lateral-elastico`) — Glúteos; equipamento: Faixa Elástica (Mini Band).
- Corrida na Esteira (`esteira-corrida`) — Cardio; equipamento: Esteira.
- Crossover na Polia Alta (`crossover-polia-alta`) — Peito; equipamento: Máquina de Cabos.
- Crossover na Polia Baixa (Elevação) (`crossover-polia-baixa`) — Peito; equipamento: Máquina de Cabos.
- Crucifixo Invertido Curvado (`crucifixo-invertido-curvado-halteres`) — Ombros; equipamento: Halteres.
- Crunch Abdominal na Máquina (`crunch-abdominal-maquina`) — Abdômen; equipamento: Máquina.
- Crunch Abdominal na Polia Alta (`crunch-polia-alta`) — Abdômen; equipamento: Máquina de Cabos / Corda.
- Crunch Abdominal no Solo (`crunch-abdominal-solo`) — Abdômen; equipamento: Peso Corporal.
- Desenvolvimento Arnold (`desenvolvimento-arnold`) — Ombros; equipamento: Halteres.
- Desenvolvimento Atrás da Nuca (Behind the Neck Press) (`desenvolvimento-nuca`) — Ombros; equipamento: Barra (ou Smith).
- Desenvolvimento com Barra Sentado (`desenvolvimento-barra-sentado`) — Ombros; equipamento: Barra.
- Desenvolvimento Militar com Barra (Em Pé) (`desenvolvimento-militar-barra`) — Ombros; equipamento: Barra.
- Elevação de Joelhos na Cadeira / Paralelas (`elevacao-joelhos-paralelas`) — Abdômen; equipamento: Cadeira Romana (Captain's Chair).
- Elevação de Panturrilha no Smith (`elevacao-panturrilha-smith`) — Panturrilhas; equipamento: Máquina Smith / Step.
- Elevação de Panturrilha Sentado (`elevacao-panturrilha-sentado`) — Panturrilhas; equipamento: Máquina / Halteres.
- Elevação de Panturrilha Unilateral (`elevacao-panturrilha-unilateral`) — Panturrilhas; equipamento: Haltere / Peso Corporal.
- Elevação de Pernas no Solo (`elevacao-pernas-solo`) — Abdômen; equipamento: Peso Corporal.
- Elevação em Y na Polia Baixa (`elevacao-y-polia`) — Ombros; equipamento: Máquina de Cabos.
- Elevação Frontal com Anilha (`elevacao-frontal-anilha`) — Ombros; equipamento: Anilha.
- Elevação Lateral em Banco Inclinado (`elevacao-lateral-inclinada`) — Ombros; equipamento: Halteres.
- Elevação Lateral na Máquina (`elevacao-lateral-maquina`) — Ombros; equipamento: Máquina.
- Elevação Lateral Unilateral com Polia (`elevacao-lateral-unilateral-polia`) — Ombros; equipamento: Máquina de Cabos.
- Elevação Pélvica com Barra (`elevacao-pelvica-barra`) — Glúteos; equipamento: Barra.
- Elevação Pélvica com Haltere (`elevacao-pelvica-haltere`) — Glúteos; equipamento: Haltere / Banco.
- Elevação Pélvica na Máquina (`elevacao-pelvica-maquina`) — Glúteos; equipamento: Máquina.
- Elevação Pélvica no Smith (`elevacao-pelvica-smith`) — Glúteos; equipamento: Máquina Smith / Banco.
- Elevação Tibial (Tibialis Raise) (`elevacao-tibial`) — Panturrilhas; equipamento: Peso Corporal / Parede / Aparelho Específico.
- Elíptico (`eliptico`) — Cardio; equipamento: Elíptico.
- Encolhimento com Barra (`encolhimento-barra`) — Costas; equipamento: Barra.
- Encolhimento com Halteres (`encolhimento-halteres`) — Costas; equipamento: Halteres.
- Extensão Lombar na Máquina (`extensao-lombar-maquina`) — Costas; equipamento: Máquina.
- Face Pull (Puxada no Rosto) (`face-pull`) — Ombros; equipamento: Máquina de Cabos.
- Flexão de Perna na Polia (Cabo) (`flexora-polia-baixa`) — Posterior de Coxa; equipamento: Máquina de Cabos / Tornozeleira.
- Flexão de Pernas na Bola Suíça (`flexao-bola-suica`) — Posterior de Coxa; equipamento: Bola Suíça (Fitball).
- Flexão Nórdica (`flexao-nordica`) — Posterior de Coxa; equipamento: Peso Corporal / Suporte.
- Flexora em Pé Unilateral (`flexora-em-pe`) — Posterior de Coxa; equipamento: Máquina.
- Frog Pumps (Ponte Sapo) (`frog-pumps`) — Glúteos; equipamento: Peso Corporal.
- Glúteo 4 Apoios com Caneleira (Joelhos dobrados) (`gluteo-4-apoios-caneleira`) — Glúteos; equipamento: Caneleira (Pesos de Tornozelo).
- Glúteo 4 Apoios com Perna Estendida (`gluteo-4-apoios-perna-estendida`) — Glúteos; equipamento: Caneleira.
- Glúteo Coice na Polia (Glute Kickback) (`gluteo-coice-polia`) — Glúteos; equipamento: Máquina de Cabos / Tornozeleira.
- Glúteo Coice no Smith (`gluteo-coice-smith`) — Glúteos; equipamento: Máquina Smith.
- Hiperextensão Reversa (Reverse Hyper) (`hiperextensao-reversa`) — Glúteos; equipamento: Máquina Reverse Hyper / Banco.
- Hollow Body Hold (Isometria do Corpo Oco) (`isometria-hollow-body`) — Abdômen; equipamento: Peso Corporal.
- JM Press (Supino JM) (`jm-press`) — Tríceps; equipamento: Barra.
- Leg Press Horizontal (Seated Leg Press) (`leg-press-horizontal`) — Quadríceps; equipamento: Máquina (Cabos/Placas).
- Lenhador na Polia (Woodchopper) (`lenhador-polia`) — Abdômen; equipamento: Máquina de Cabos.
- Levantamento Terra Romeno com Halteres (`rdl-halteres`) — Posterior de Coxa; equipamento: Halteres.
- Limpador de Parabrisa (Windshield Wipers) (`windshield-wipers`) — Abdômen; equipamento: Peso Corporal.
- Máquina de Glúteo Coice (`gluteo-coice-maquina`) — Glúteos; equipamento: Máquina.
- Máquina de Tríceps (Mergulho Sentado) (`maquina-mergulho-triceps`) — Tríceps; equipamento: Máquina.
- Mergulho nas Paralelas (Foco Peitoral) (`mergulho-paralelas-peito`) — Peito; equipamento: Peso Corporal.
- Mergulho nas Paralelas (Foco Tríceps) (`mergulho-paralelas-triceps`) — Tríceps; equipamento: Peso Corporal / Barras Paralelas.
- Mergulho no Banco (Tríceps Banco) (`mergulho-banco-triceps`) — Tríceps; equipamento: Peso Corporal / Bancos.
- Mesa Flexora (`mesa-flexora`) — Posterior de Coxa; equipamento: Máquina.
- Ostra com Elástico (Clamshells) (`abducao-elastico-deitado`) — Glúteos; equipamento: Faixa Elástica (Mini Band).
- Panturrilha no Hack Squat (`elevacao-panturrilha-hack`) — Panturrilhas; equipamento: Máquina Hack Squat.
- Panturrilha no Leg Press (`elevacao-panturrilha-leg-press`) — Panturrilhas; equipamento: Máquina Leg Press.
- Passada Cruzada (Curtsy Lunge) (`passada-cruzada-halteres`) — Glúteos; equipamento: Halteres.
- Ponte de Glúteos (Glute Bridge) (`ponte-gluteos-peso-corporal`) — Glúteos; equipamento: Peso Corporal / Solo.
- Ponte de Glúteos Elevada (Pés no Banco) (`ponte-gluteos-elevada`) — Glúteos; equipamento: Banco / Caixote.
- Ponte de Glúteos Unilateral (`ponte-gluteos-unilateral`) — Glúteos; equipamento: Peso Corporal / Solo.
- Prancha com Toque nos Ombros (`prancha-toque-ombros`) — Abdômen; equipamento: Peso Corporal.
- Prancha Isométrica (`prancha-isometrica`) — Abdômen; equipamento: Peso Corporal.
- Prancha Lateral (`prancha-lateral`) — Abdômen; equipamento: Peso Corporal.
- Pular Corda (Cardio Progressivo) (`pular-corda-cardio`) — Cardio; equipamento: Corda de Pular.
- Pull-Through na Polia (`pull-through-polia`) — Posterior de Coxa; equipamento: Máquina de Cabos / Corda.
- Pulldown com Barra Reta (Braços Estendidos) (`pulldown-barra-reta`) — Costas; equipamento: Máquina de Cabos.
- Pulldown com Corda (Braços Estendidos) (`pulldown-corda-polia`) — Costas; equipamento: Máquina de Cabos.
- Puxada com Triângulo na Polia (`puxada-triangulo-polia`) — Costas; equipamento: Máquina de Cabos.
- Remada Articulada (Máquina) (`remada-articulada-maquina`) — Costas; equipamento: Máquina.
- Remada Curvada Supinada (Underhand) (`remada-curvada-supinada`) — Costas; equipamento: Barra.
- Remada Meadows (`remada-meadows`) — Costas; equipamento: Barra (T-Bar).
- Remada Pendlay (`remada-pendlay`) — Costas; equipamento: Barra.
- Remo Seco (Ergômetro) (`remo-ergometro`) — Cardio; equipamento: Remo Ergômetro (Concept2, etc).
- Roda Abdominal (Ab Wheel Rollout) (`roda-abdominal`) — Abdômen; equipamento: Roda Abdominal (Ab Wheel).
- Rolo de Punho (Wrist Roller) (`rolo-de-punho`) — Antebraço; equipamento: Wrist Roller (Rolo e Corda).
- Rosca 21 com Barra (`rosca-21`) — Bíceps; equipamento: Barra.
- Rosca Alternada com Halteres (`rosca-alternada-halteres`) — Bíceps; equipamento: Halteres.
- Rosca Aranha (Spider Curl) (`rosca-aranha`) — Bíceps; equipamento: Barra / Halteres (Banco Inclinado).
- Rosca Concentrada (`rosca-concentrada`) — Bíceps; equipamento: Halteres.
- Rosca Direta com Barra EZ (`rosca-direta-barra-ez`) — Bíceps; equipamento: Barra EZ.
- Rosca Duplo Bíceps na Polia Alta (Crossover) (`rosca-unilateral-polia-alta`) — Bíceps; equipamento: Máquina de Cabos.
- Rosca Inclinada com Halteres (`rosca-inclinada-halteres`) — Bíceps; equipamento: Halteres.
- Rosca Inversa com Barra (`rosca-inversa-barra`) — Bíceps; equipamento: Barra.
- Rosca Martelo (`rosca-martelo`) — Bíceps; equipamento: Halteres.
- Rosca na Polia Baixa (`rosca-polia-baixa`) — Bíceps; equipamento: Máquina de Cabos.
- Rosca Punho Atrás do Corpo com Barra (`rosca-punho-tras-corpo-barra`) — Antebraço; equipamento: Barra.
- Rosca Punho com Halteres (`rosca-punho-halteres`) — Antebraço; equipamento: Halteres.
- Rosca Punho Invertida com Barra (`rosca-punho-invertida-barra`) — Antebraço; equipamento: Barra.
- Rosca Punho Invertida com Halteres (`rosca-punho-invertida-halteres`) — Antebraço; equipamento: Halteres.
- Rosca Scott com Barra (Preacher Curl) (`rosca-scott-barra`) — Bíceps; equipamento: Barra EZ / Banco Scott.
- Rosca Scott Unilateral com Haltere (`rosca-scott-haltere`) — Bíceps; equipamento: Haltere / Banco Scott.
- Rosca Zottman (`rosca-zottman`) — Bíceps; equipamento: Halteres.
- Simulador de Escada (StairMaster) (`simulador-escada`) — Cardio; equipamento: Simulador de Escadas.
- Stiff com Barra (`stiff-barra`) — Posterior de Coxa; equipamento: Barra.
- Stiff com Halteres (`stiff-halteres`) — Posterior de Coxa; equipamento: Halteres.
- Stiff Unilateral (RDL de Uma Perna) (`stiff-unilateral-haltere`) — Posterior de Coxa; equipamento: Haltere / Kettlebell.
- Subida no Banco (Step-Up) com Halteres (`subida-banco-halteres`) — Quadríceps; equipamento: Halteres / Banco.
- Supino Declinado com Barra (`supino-declinado-barra`) — Peito; equipamento: Barra.
- Supino Declinado com Halteres (`supino-declinado-halteres`) — Peito; equipamento: Halteres.
- Supino Fechado (`supino-fechado`) — Tríceps; equipamento: Barra.
- Suspensão na Barra Fixa (Dead Hang) (`dead-hang`) — Antebraço; equipamento: Barra Fixa.
- Sustentação de Anilhas (Pinch Grip) (`sustentacao-anilhas`) — Antebraço; equipamento: Anilhas.
- Tríceps Coice (Kickback) com Haltere (`triceps-coice-haltere`) — Tríceps; equipamento: Haltere.
- Tríceps Coice na Polia (`triceps-coice-polia`) — Tríceps; equipamento: Máquina de Cabos.
- Tríceps Francês com Haltere (Bilateral) (`triceps-frances-haltere-bilateral`) — Tríceps; equipamento: Haltere.
- Tríceps Francês Unilateral com Haltere (`triceps-frances-unilateral`) — Tríceps; equipamento: Haltere.
- Tríceps Pulldown com Barra em V (`triceps-pulldown-barra-v`) — Tríceps; equipamento: Máquina de Cabos.
- Tríceps Pulldown com Barra Reta (`triceps-pulldown-barra-reta`) — Tríceps; equipamento: Máquina de Cabos.
- Tríceps Testa com Barra (`triceps-testa-barra`) — Tríceps; equipamento: Barra.
- Tríceps Testa com Barra EZ (Skullcrusher) (`triceps-testa-barra-ez`) — Tríceps; equipamento: Barra EZ.
- Tríceps Unilateral na Polia (Pegada Inversa) (`triceps-pulldown-unilateral-reverso`) — Tríceps; equipamento: Máquina de Cabos.
- Voador (Peck Deck) (`peck-deck-voador`) — Peito; equipamento: Máquina.

## Revisão no app

A tela de revisão está em `/?exercise-gif-review=1`; permite filtrar os 206 exercícios por status e conferir GIF, nome do arquivo, confiança e justificativa.

## Validação executada

- Build Vite de produção: passou; criou 57 GIFs únicos em `dist/assets`.
- Typecheck manual do TypeScript: passou.
- Integridade: 1.000/1.000 GIFs legíveis, 0 inválidos; todos com 360×360 px e 12–54 quadros.
- IDs do mapa comparados aos 206 do catálogo: correspondência exata, sem IDs duplicados.
- Caminhos das 60 associações confirmadas/prováveis existem na fonte e em `dist/assets`.
- O `package.json` não define scripts de teste ou lint.
- A validação visual do app em viewport de navegador não foi concluída: o preview local expirou na conexão do navegador da sandbox. As folhas de contato dos 1.000 GIFs e as imagens mapeadas foram inspecionadas localmente.
