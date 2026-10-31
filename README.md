# newapp

Landing page da parceria **RideWave Technologies × Mobiltec** para o **Cloud4Mobile** (MDM brasileiro).

Objetivos: detalhar o portfólio e as ofertas, atrair tráfego orgânico sobre MDM e capturar leads.

## Estrutura

```
index.html            página única (SEO, JSON-LD e conteúdo)
assets/css/style.css  estilos (tema escuro da RideWave)
assets/js/main.js     menu mobile e formulário de leads
assets/img/           favicons
```

Site estático, sem build. Para ver localmente: `python3 -m http.server 8000` e abrir http://localhost:8000.

## Captura de leads

Em `assets/js/main.js`, defina `FORM_ENDPOINT` com a URL de um serviço que receba POST JSON (Formspree, Make, Zapier, CRM etc.). Enquanto estiver vazio, o formulário abre o WhatsApp da RideWave com os dados preenchidos.

## Pontos a confirmar antes de publicar

- Nomes, escopo e condições das ofertas (Piloto, Implantação e migração, Gestão contínua) são propostas iniciais.
- Autorização de uso da marca/logo da Mobiltec (a página usa só o nome em texto).
- Política de privacidade e termos (a página ainda não tem links para elas).
- Código do Google Analytics / Search Console, se for usar.
