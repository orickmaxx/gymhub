# 🎉 GYMHUB - Treinos para Hipertrofia! 💪

E aí, malhador! Bem-vindo ao **GYMHUB**, sua PWA descolada pra turbinar os treinos old school de hipertrofia e condicionamento físico! Aqui você encontra tudo pra detonar no peito, costas, braços e pernas, com um visual inspirado nas plataformas mais famosas e aquele toque offline pra treinar sem desculpas! 🚀

## O que rola por aqui? 🎯

- **Treinos Fodásticos**: 4 programas (Peito/Ombro, Costas, Bíceps/Tríceps e Leg Day 💀) com séries e reps pra arrasar!
- **Offline na Veia**: Funciona sem net graças ao Service Worker! 📴
- **Instala e Leva**: Baixa como app no celular ou PC com um clique! 📱💻
- **Filtros e Busca**: Achou seu treino rapidinho com filtros ou busca! 🔍
- **Animações Top**: GSAP trazendo aquele efeito maneiro nas transições! ✨

## Antes de começar 🎮

- Um navegador legal (Chrome, Firefox, Safari ou Edge tá de boa).
- HTTPS (pra PWA funcionar direitinho) ou localhost pra testar localmente.
- As imagens, vídeo e fontes listados no `service-worker.js` devem estar no lugar!

## Como botar pra rodar? 🛠️

1. **Pega o código**:
   ```bash
   git clone https://github.com/seu-usuario/gymhub.git
   cd gymhub
   ```

2. **Testa localmente (opcional)**:
   - Instala o `http-server` com npm:
     ```bash
     npm install -g http-server
     ```
   - Roda o servidor na raiz:
     ```bash
     http-server -p 8080
     ```
   - Abre `http://localhost:8080/site-de-treino/` no navegador.

3. **Joga no ar**:
   - Manda os arquivos pra um servidor HTTPS (GitHub Pages, Netlify, etc.).
   - Confere se o caminho `/site-de-treino/` bate com o `start_url` do `manifest.json`.

## Como usar? 🏋️‍♂️

- Abre o `index.html` no navegador.
- Dá uma olhada nos treinos na seção "OFF-SEASON ALLDAY".
- Usa os filtros ou busca pra achar o que quer.
- Clica no card pra ver os detalhes no modal e copia o treino com o botão "Copiar Treino".
- Vê o botão "Instalar" no canto inferior direito (se o PWA for detectado) e clica pra instalar! 🎉

## Tecnologias que mandam bem! ⚙️

- **HTML5**: A base sólida da página.
- **CSS3**: Estilo com responsividade top.
- **JavaScript**: A mágica por trás das interações.
- **GSAP**: Animações que impressionam!
- **Service Worker**: Offline na veia.
- **PWA**: Manifest e instalação pra arrasar!

## Quer ajudar? 🚀

1. Faz um fork deste repo.
2. Cria uma branch pra tua ideia:
   ```bash
   git checkout -b feature/sua-ideia
   ```
3. Commita as mudanças:
   ```bash
   git commit -m "Tô trazendo algo novo!"
   ```
4. Manda pro repo:
   ```bash
   git push origin feature/sua-ideia
   ```
5. Abre um Pull Request e bora colaborar! 🤝

## Licença 🎫

Tá tudo liberado sob a [MIT License](LICENSE) - dá uma olhada no arquivo `LICENSE` pra saber mais!

## Fala comigo! 📩

- **Criador**: [ORICKMAX](https://www.instagram.com/orickmax) 😎
- **E-mail**: contatohenriquem2022@gmail.com
- **GitHub**: [@orickmaxx](https://github.com/orickmaxx)

---

**Valeu, Bom Treino!** 🙌 Agradecimentos pra galera que testa e melhora o GYMHUB! 💥