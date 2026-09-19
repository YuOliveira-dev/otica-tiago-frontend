# Informações e Especificações do Site - TS EYEWEAR

## 1. Visão Geral do Projeto

O **Catálogo Online da TS EYEWEAR** é uma aplicação web moderna, responsiva e de alta performance, desenvolvida para apresentar de forma elegante e imersiva o portfólio completo de armações de grau, óculos de sol e acessórios da marca.

A TS EYEWEAR atua como uma operação **100% online**, combinando a conveniência do e-commerce moderno com a segurança de um **atendimento consultivo personalizado via WhatsApp**: o cliente escolhe o modelo desejado, confere dimensões técnicas precisas e conclui o pedido ou orçamento de lentes diretamente com um especialista óptico.

---

## 2. Objetivos Principais

1. **Apresentar o Catálogo Completo**: Exibir armações e produtos de eyewear com excelência visual (fotos em múltiplos ângulos, detalhes de acabamento e dimensões técnicas).
2. **Conversão Consultiva Ágil (WhatsApp First)**: Conectar o cliente diretamente ao WhatsApp com produto, modelo, cor e referência pré-carregados na mensagem.
3. **Experiência de Compra 100% Digital e Segura**: Facilitar a escolha do tamanho ideal através de guias virtuais de medidas faciais e envio assistido de receitas oftalmológicas.
4. **Educação e Confiança em Saúde Visual**: Explicar com clareza os diferenciais das lentes, proteção UV400 certificada, materiais das armações (acetato, metal, titânio) e garantias.
5. **Destaque Logístico**: Comunicar de forma ostensiva a política de **Frete Grátis para todo o Brasil** em todos os pedidos e opções de entrega rápida (SEDEX, PAC, Motoboy e Transportadora).

---

## 3. Público-Alvo e Personas

* **Persona 1: O Usuário de Óculos de Grau (Saúde & Estilo)**
  * *Perfil*: Busca armações confortáveis e duráveis que valorizem o formato do seu rosto. Precisa de orientação sobre compatibilidade de sua graduação com o aro e facilidade no envio da receita médica via WhatsApp.
* **Persona 2: O Comprador de Óculos de Sol (Tendência & Proteção)**
  * *Perfil*: Procura modelos modernos e autênticos com proteção UV certificada e lentes polarizadas. Valoriza fotos detalhadas de alta definição e agilidade no fechamento da compra.
* **Persona 3: O Consumidor Prático e Digital (Conveniência & Frete)**
  * *Perfil*: Prioriza comprar online com frete grátis, receber com rapidez em sua residência e contar com garantia de troca de 30 dias caso precise substituir a armação.

---

## 4. Arquitetura de Informação e Mapa de Páginas

```
[Home]
 ├── Top Bar Promocional ("Frete Grátis para todo o Brasil | Atendimento Especializado")
 ├── Hero Promocional (Banners sazonais e lançamentos da coleção)
 ├── Navegação por Categorias (Óculos de Grau, Óculos de Sol, Lançamentos, Outlet)
 ├── Marcas e Linhas em Destaque
 ├── Vitrine de Destaques / Mais Vendidos
 ├── Guia Rápido: Como escolher o tamanho ideal do seu óculos
 ├── Benefícios TS EYEWEAR (5 Anos de Expertise, 100% Original, Frete Grátis Brasil, Troca Fácil)
 └── Rodapé Institucional Completo

[Páginas de Categoria / Catálogo]
 ├── Cabeçalho da Categoria com banner refinado
 ├── Barra de Filtros (Gênero, Material, Formato, Linha, Faixa de Preço)
 ├── Ordenação (Mais Populares, Menor Preço, Maior Preço, Lançamentos)
 ├── Grade de Produtos Responsiva
 └── Paginação / Carregamento sob demanda

[Página de Produto (PDP - Product Detail Page)]
 ├── Galeria de Fotos em Alta Resolução (frontal, lateral 45°, detalhe da haste)
 ├── Badges Oficiais (Frete Grátis Brasil, 100% Original, Garantia)
 ├── Título, Marca, Linha e Código de Referência (SKU)
 ├── Preço à vista com desconto + Simulação de parcelamento
 ├── Seletor de Cores disponíveis
 ├── Tabela de Medidas da Armação (Aro, Ponte, Haste em milímetros)
 ├── Botão Principal: "Comprar pelo WhatsApp" (mensagem personalizada pronta)
 ├── Botão Secundário: "Guia de Medidas / Falar com Especialista"
 ├── Simulador de Prazo de Entrega por CEP
 └── Produtos Relacionados / "Quem viu este, também gostou"

[Institucional & Suporte]
 ├── Quem Somos (História oficial de 5 anos da TS EYEWEAR)
 ├── Como Comprar Lentes de Grau Online (Guia passo a passo)
 ├── Política de Frete e Entregas (Frete Grátis Brasil, Correios, Motoboy e Transportadoras)
 ├── Trocas, Devoluções e Garantias (30 dias para troca, 6 meses armação, 1 ano lentes)
 └── Política de Privacidade (LGPD) e Termos de Uso
```

---

## 5. Categorização e Taxonomia do Catálogo

1. **Óculos de Grau**:
   * Masculino, Feminino, Unissex.
   * Formato: Redondo, Quadrado, Retangular, Aviador, Gatinho, Geométrico, Oval.
   * Tipo de Armação: Aro Fechado, Meio Aro (Nylon), Balgriff (Três Peças / Sem Aro).
   * Material: Acetato, Metal, Titânio, TR90.
2. **Óculos de Sol**:
   * Masculino, Feminino, Unissex, Esportivo.
   * Tipo de Lente: Proteção UV400, Polarizada, Degradê, Espelhada, Clássica (G15/Cinza/Marrom).
3. **Acessórios & Cuidados**:
   * Estojos premium, flanelas de microfibra e sprays limpa-lentes.
4. **Outlet / Oportunidades**:
   * Filtro por percentual de desconto e ponta de estoque.

---

## 6. Fluxos do Usuário (User Journeys)

### Fluxo A: Compra Direta e Consultiva via WhatsApp
1. O usuário navega pela Home ou Categoria e seleciona uma armação.
2. Na página do produto, confere as fotos, especificações de materiais e medidas técnicas (aro, ponte e haste).
3. Clica em **"Comprar pelo WhatsApp"**.
4. O sistema abre o WhatsApp oficial com a mensagem formatada:
   > *"Olá, equipe TS EYEWEAR! Tenho interesse no óculos [Nome do Modelo] (Ref: [SKU]) na cor [Cor], anunciado por R$ [Preço]. Gostaria de confirmar a disponibilidade e fechar meu pedido!"*
5. O consultor óptico atende de forma personalizada, confirma os dados de entrega (com Frete Grátis para todo o Brasil) e envia o link de pagamento seguro.

### Fluxo B: Consultoria de Estilo e Envio de Receita de Grau 100% Online
1. O usuário encontra uma armação de que gostou para uso diário com lentes de grau.
2. Clica em **"Orçar com Minha Receita"**.
3. A conversa no WhatsApp é iniciada:
   > *"Olá, TS EYEWEAR! Gostei da armação [Nome do Modelo] (Ref: [SKU]) e gostaria de orçar com minhas lentes de grau. Como posso enviar minha receita oftalmológica?"*
4. O consultor óptico recebe a foto da prescrição, avalia o grau prescrito e a DNP, sugere o melhor índice de lente (1.56, 1.67 ou 1.74) e finaliza o pedido.

### Fluxo C: Comparação e Lista de Favoritos
1. O usuário marca modelos clicando no ícone de coração nos cards de produtos.
2. Os itens são preservados localmente no navegador (`localStorage`).
3. O usuário pode abrir a aba de **Favoritos** a qualquer instante para comparar modelos lado a lado ou compartilhar a seleção com o atendente no WhatsApp.

---

## 7. Informações Institucionais ("Quem Somos")

* **História Oficial**:
  Há 5 anos a TS EYEWEAR transforma a forma como você vê o mundo. A marca nasceu da convicção de que óculos não são meros acessórios, mas sim identidade, proteção e confiança.
* **Pilares da Marca**:
  * **Expertise de 5 Anos**: Domínio técnico em saúde visual, lentes graduadas e tendências internacionais de eyewear.
  * **Qualidade Garantida**: Produtos 100% originais com garantia de fabricação.
  * **Proteção Real**: Foco intransigente na saúde dos olhos e lentes com tecnologia UV certificada.
  * **Consultoria Personalizada**: Suporte humano para encontrar o modelo ideal para cada formato de rosto e necessidade de visão.
* **Redes Sociais Oficiais**:
  * Instagram Oficial: `@tseyewear`
