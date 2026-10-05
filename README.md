# Souza & Selly Advocacia (v4)

Landing page institucional e comercial de altíssimo padrão desenvolvida para o escritório **Souza & Selly Advocacia**, projetada com arquitetura moderna **Vite**, estética de luxo (*Obsidian Black & 24k Champagne Gold*), conformidade com o Código de Ética e Disciplina da OAB (Provimento 205/2021) e performance máxima.

---

## 🏛️ Sobre o Escritório

- **Sócias-Fundadoras:** Dra. Samara Selly e Dra. Maria Souza
- **Especialidades:**
  - **Dra. Samara Selly:** Pós-graduada em Direito Previdenciário, Direito do Trabalho e Processo do Trabalho.
  - **Dra. Maria Souza:** Pós-graduada em Direito Previdenciário e Direito Tributário.
- **Atuação:** Direito Previdenciário (INSS, BPC/LOAS, Rurais), Trabalhista e Cível/Família.
- **Diferencial Humano:** Atendimento em todo o Ceará, com visitas domiciliares e presenciais dedicadas a clientes no interior do estado.
- **Sede:** Av. Jovita Feitosa, nº 3072, Bairro Parquelândia, Fortaleza - CE, CEP 60455-410.
- **Horário de Atendimento:** 09:00 às 17:00 (Segunda a Sexta).

---

## 🚀 Tecnologias & Arquitetura

- **Vite 6+**: Bundler ultrarrápido com Hot Module Replacement (HMR) e compilação em milissegundos.
- **HTML5 Semântico**: Estrutura otimizada para SEO local e acessibilidade (WCAG 2.1 AA).
- **CSS3 Puro Modular**: Design system próprio com paleta Dark Obsidian (`#070709`), Dourado Champanhe (`#D4AF37`), efeitos de vidro (glassmorphism) e micro-interações refinadas.
- **Vercel Edge Ready**: Arquivo `vercel.json` pré-configurado com cabeçalhos de segurança (CSP, HSTS, X-Frame-Options) e cache imutável de assets estáticos.

---

## 📁 Estrutura do Projeto

```text
souza-e-selly-v4/
├── assets/                  # Imagens institucionais em alta definição
│   ├── logo.jpg             # Logotipo oficial circular com balança dourada
│   ├── samara.jpg           # Retrato institucional Dra. Samara Selly
│   ├── mariana.jpg          # Retrato institucional Dra. Maria Souza
│   ├── interior_ceara.jpg   # Cena documental de visita no interior do CE
│   └── escritorio_sede.jpg  # Sala de reuniões da sede na Parquelândia
├── css/
│   └── styles.css           # Design system completo e responsivo
├── js/
│   └── main.js              # Lógica interativa (FAQ, abas, status e formulário)
├── public/                  # Assets estáticos servidos pelo Vite
├── index.html               # Ponto de entrada da aplicação
├── 404.html                 # Página 404 personalizada
├── vite.config.js           # Configuração de build do Vite
├── vercel.json              # Configurações de deploy e segurança na Vercel
├── package.json             # Scripts de dev, build e dependências
└── README.md
```

---

## 🛠️ Como Executar Localmente

```bash
# 1. Instalar as dependências
npm install

# 2. Iniciar o servidor de desenvolvimento Vite
npm run dev

# 3. Gerar a build otimizada de produção
npm run build

# 4. Pré-visualizar a build de produção localmente
npm run preview
```

---

## ⚡ Como Fazer o Deploy na Vercel

### Opção 1: Conectando com o GitHub (Recomendado)
1. Acesse [vercel.com](https://vercel.com) e conecte sua conta do GitHub.
2. Clique em **"Add New..."** → **"Project"**.
3. Selecione o repositório **`danieldiniz1999/souza-e-selly-v4`**.
4. A Vercel detectará automaticamente o framework como **Vite**:
   - **Framework Preset:** `Vite`
   - **Build Command:** `vite build`
   - **Output Directory:** `dist`
5. Clique em **"Deploy"**. Seu site estará no ar em poucos segundos!

### Opção 2: Via Vercel CLI no Terminal
```bash
# Instalar a CLI da Vercel (se necessário)
npm i -g vercel

# Executar o deploy
vercel --prod
```
